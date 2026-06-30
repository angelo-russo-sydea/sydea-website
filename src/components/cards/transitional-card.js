import React, { useContext } from 'react';
import './cards.scss';
import { AppContext } from '../../services/translationContext';
import { Link } from 'react-router-dom';

export const TransitionalCard = ({colMD, colSM, title, link, target, bgImage, category}) => {

  return (
    <div className={`col-sm-${colSM} col-md-${colMD}`}>
      <Link to={link} className='insights-card-prev text-deco-none tile-client-story' target={target} draggable={false}>
        <div className='syd-box flat d-flex position-relative p-0 overflow-hidden syd-client-stories-box'>
          {
            category && <div className='box-stories-card-category text-uppercase tag-category-menu'>{category}</div>
          }
          <img src={bgImage} alt={title} className='insights-image transition-03s-eio client-story-tile-img'></img>
          <div className='body-stories-sect d-flex flex-column h-100 w-100 p-4 pt-0 bkg-tile-client-story syd-vertical-box-body'>
            <h4 className="insights-title-card fw-bold font-title">{title}</h4>
          </div>
        </div>
      </Link>
    </div>
  );
};