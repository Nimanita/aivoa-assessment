from sqlalchemy import Column, Integer, String, UniqueConstraint
from database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(100), unique=True, nullable=False)
    location = Column(String(100), nullable=False)

    # Define unique constraints
    __table_args__ = (
        UniqueConstraint('company_name', name='uq_company_name'),
    )