import React from 'react';
import "./not-found.scss";
import { Link, useParams } from "react-router-dom";

export const NotFound = () => {
  document.title = '404 | Page not found';
  const { lang } = useParams();
  
  return (
    <div className='section-home light text-center p-5'>
        <h1 className='fw-bold lbl-404'>404</h1>
        <h2 className='fs-1'>Oops! Something went wrong…</h2>
        <h3 className='mt-3 mb-5 fs-4'>Page not found.</h3>
        <Link to={`/${lang}`} className='btn-head-home mt-5 text-deco-none px-4 py-3 fs-3 text-uppercase transition-03s-eio'>Go Home</Link>
    </div>
  );
};

