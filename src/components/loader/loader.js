import React, {useState} from 'react';
import './loader.scss';

export const Loader = () => {

  return (
    <div className='area-spinner'>
        <div className="spinner-border text-warning" style={{width:'3rem', height:'3rem'}} role="status"></div>
    </div>
  );
};