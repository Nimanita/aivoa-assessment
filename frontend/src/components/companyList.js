// src/components/CompanyList.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import companyService from '../services/companyService';
import EditCompanyForm from './EditCompanyForm';

const CompanyList = ({ refreshTrigger }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(null);

  // Fetch companies when component mounts or refreshTrigger changes
  useEffect(() => {
    fetchCompanies();
  }, [refreshTrigger]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getCompanies();
      setCompanies(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch companies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setSelectedCompanyId(id);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        setDeleteInProgress(id);
        await companyService.deleteCompany(id);
        
        // Update the companies list
        setCompanies(companies.filter(company => company.id !== id));
        
        // Show success message
        toast.success('Company deleted successfully');
      } catch (err) {
        toast.error('Failed to delete company');
        console.error(err);
      } finally {
        setDeleteInProgress(null);
      }
    }
  };

  const handleCompanyUpdated = (updatedCompany) => {
    // Update the company in the list
    setCompanies(companies.map(company => 
      company.id === updatedCompany.id ? updatedCompany : company
    ));
    
    // Show success message
    toast.success('Company updated successfully');
  };

  return (
    <>
      <Card>
        <Card.Header as="h5">Companies</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : companies.length === 0 ? (
            <Alert variant="info">No companies found. Add one to get started!</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Company Name</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company.id}>
                    <td>{company.id}</td>
                    <td>{company.company_name}</td>
                    <td>{company.location}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(company.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(company.id)}
                        disabled={deleteInProgress === company.id}
                      >
                        {deleteInProgress === company.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <EditCompanyForm
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        companyId={selectedCompanyId}
        onCompanyUpdated={handleCompanyUpdated}
      />
    </>
  );
};

export default CompanyList;