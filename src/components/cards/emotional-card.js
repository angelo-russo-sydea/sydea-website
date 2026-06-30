import React, { useContext } from 'react';
import './cards.scss';
import { AppContext } from '../../services/translationContext';
import { Link } from 'react-router-dom';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

export const EmotionalCard = ({colMD, colSM, title, link, bgImage, category, desc}) => {

  return (
    <div className={`col-sm-${colSM} col-md-${colMD} p-2`}>
      <Link to={link} style={{textDecoration: 'none'}} draggable={false}>
        <div className='box-stories-card d-flex flex-column border-0'>
          <div className='background-card' style={{backgroundImage:`linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(${bgImage})`}}></div>
          <div className='box-stories-card-overlay-bottom' style={{ background: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(42, 42, 42, 0.51) 85%)'}}></div>
          <div className='box-stories-card-overlay'></div>
          <div className='box-stories-card-category text-uppercase'>{category}</div>
          <div className='box-stories-card-body mt-auto'>
            <div className='box-stories-card-title mt-auto'>
              <h4 style={{fontSize: '1.5rem', lineHeight: '2rem'}} className='fw-bold'>{title}</h4>
            </div>
            <div className='box-stories-card-desc mt-3'>{desc}</div>
          </div>
          <div className='arrow-stories-card'>
            <TrendingFlatIcon />
          </div>
        </div>
      </Link>
    </div>
  );
};