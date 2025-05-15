// src/components/CompanyForm.js
import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import companyService from '../services/companyService';

const CompanyForm = ({ onCompanyAdded }) => {
  const [companyData, setCompanyData] = useState({
    company_name: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      const newCompany = await companyService.createCompany(companyData);
      
      // Reset form
      setCompanyData({
        company_name: '',
        location: ''
      });
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Notify parent component
      if (onCompanyAdded) {
        onCompanyAdded(newCompany);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'Failed to add company');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Add New Company</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Company added successfully!</Alert>}
        
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

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Company'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CompanyForm;