// src/App.js
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import CompanyForm from './components/companyForm';
import CompanyList from './components/companyList';

function App() {
  // This state helps trigger a refresh of the company list
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCompanyAdded = () => {
    // Increment the key to trigger a refresh
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="App">
      <Navbar />
      <Container className="mt-4">
        <Row>
          <Col md={4}>
            <CompanyForm onCompanyAdded={handleCompanyAdded} />
          </Col>
          <Col md={8}>
            <CompanyList refreshTrigger={refreshKey} />
          </Col>
        </Row>
      </Container>
      
      {/* Toast container for notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
