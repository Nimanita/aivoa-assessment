// src/components/EditCompanyForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import companyService from '../services/companyService';

const EditCompanyForm = ({ show, handleClose, companyId, onCompanyUpdated }) => {
  const [companyData, setCompanyData] = useState({
    company_name: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch company data when the modal opens
  useEffect(() => {
    if (show && companyId) {
      const fetchCompany = async () => {
        try {
          setLoading(true);
          const company = await companyService.getCompanyById(companyId);
          setCompanyData({
            company_name: company.company_name,
            location: company.location
          });
          setError('');
        } catch (err) {
          setError('Failed to load company data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchCompany();
    }
  }, [show, companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!companyData.company_name || !companyData.location) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const updatedCompany = await companyService.updateCompany(companyId, companyData);
      
      // Notify parent component
      if (onCompanyUpdated) {
        onCompanyUpdated(updatedCompany);
      }
      
      // Close modal
      handleClose();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'Failed to update company');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              name="company_name"
              value={companyData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={companyData.location}
              onChange={handleChange}
              placeholder="Enter location"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button 
              variant="secondary" 
              onClick={handleClose} 
              className="me-2"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCompanyForm;