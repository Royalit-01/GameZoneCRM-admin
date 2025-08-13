
import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
   

   <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h1 className="mt-3 fs-5">Loading.....</h1>
    </div>

  );
};



export default Loader;
