import React, { useContext } from 'react';
import './cards.scss';
import { AppContext } from '../../services/translationContext';
import { Link } from 'react-router-dom';

export const ServiceCard = ({colMD, colSM, bgImage, title, link}) => {
  const { services: {TranslationsService} } = useContext(AppContext);

  return (
    <div className={`col-md-${colMD} col-sm-${colSM} p-4`}>
      <div className='syd-card-container'>
        <div className='image-background' style={{backgroundImage: `url(${bgImage})`}}/>
        <div className='syd-content-card'>
          <h3 className='font-title'>{title}</h3>
          <Link to={link} className='text-deco-none' draggable={false}>
            <div className='syd-button-card'>
              {TranslationsService.labels('explore_more')}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};