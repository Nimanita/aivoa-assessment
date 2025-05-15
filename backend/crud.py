from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
import models
import schemas

def get_companies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Company).offset(skip).limit(limit).all()

def get_company_by_id(db: Session, company_id: int):
    company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with ID {company_id} not found"
        )
    return company

def get_company_by_name(db: Session, company_name: str):
    return db.query(models.Company).filter(models.Company.company_name == company_name).first()

def create_company(db: Session, company: schemas.CompanyCreate):
    try:
        db_company = models.Company(
            company_name=company.company_name,
            location=company.location
        )
        db.add(db_company)
        db.commit()
        db.refresh(db_company)
        return db_company
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this name already exists"
        )

def update_company(db: Session, company_id: int, company_data: schemas.CompanyUpdate):
    db_company = get_company_by_id(db, company_id)
    
    # Only update fields that are provided
    update_data = company_data.dict(exclude_unset=True)
    
    try:
        for key, value in update_data.items():
            if value is not None:  # Only update if value is provided
                setattr(db_company, key, value)
        
        db.commit()
        db.refresh(db_company)
        return db_company
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this name already exists"
        )

def delete_company(db: Session, company_id: int):
    db_company = get_company_by_id(db, company_id)
    db.delete(db_company)
    db.commit()
    return db_company