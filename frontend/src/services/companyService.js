import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Service functions for company CRUD operations
const companyService = {
  // Get all companies
  getCompanies: async () => {
    try {
      const response = await apiClient.get('/companies/');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Get company by ID
  getCompanyById: async (id) => {
    try {
      const response = await apiClient.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching company with id ${id}:`, error);
      throw error;
    }
  },

  // Create new company
  createCompany: async (companyData) => {
    try {
      const response = await apiClient.post('/companies/', companyData);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  // Update company
  updateCompany: async (id, companyData) => {
    try {
      const response = await apiClient.put(`/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      console.error(`Error updating company with id ${id}:`, error);
      throw error;
    }
  },

  // Delete company
  deleteCompany: async (id) => {
    try {
      const response = await apiClient.delete(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting company with id ${id}:`, error);
      throw error;
    }
  }
};

export default companyService;