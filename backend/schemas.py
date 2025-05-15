from pydantic import BaseModel, field_validator
from typing import Optional

class CompanyBase(BaseModel):
    company_name: str
    location: str

    @field_validator('company_name')
    def company_name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Company name cannot be empty')
        return v.strip()

    @field_validator('location')
    def location_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Location cannot be empty')
        return v.strip()

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    location: Optional[str] = None

    @field_validator('company_name')
    def company_name_must_not_be_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Company name cannot be empty')
        return v.strip() if v else None

    @field_validator('location')
    def location_must_not_be_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Location cannot be empty')
        return v.strip() if v else None

class Company(CompanyBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True