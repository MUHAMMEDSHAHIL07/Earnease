import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from './routes/Router';

function App() {
  return (
    <>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
export default React.memo(App);