import React, { useContext } from 'react';
import './cards.scss';
import { AppContext } from '../../services/translationContext';
import { Link } from 'react-router-dom';

export const FlatCard = ({colMD, colSM, title, link, backgroundColor, textColor, logo, titleColor, buArea, buService}) => {
  const { services: {TranslationsService} } = useContext(AppContext);
  
  const getServiceTitle = (buKey, subKey, serviceKey) => {
    if(subKey){
      return TranslationsService.labels('services')[buKey].items[subKey][serviceKey].title;
    }
    else {
      return TranslationsService.labels('services')[buKey][serviceKey].title;
    }
  };

  return (
    <div className={`col-sm-${colSM} col-md-${colMD}`}>
      <Link to={link} className='text-deco-none tile-client-story' draggable={false}>
        <div className='syd-box d-flex position-relative p-0 overflow-hidden syd-client-stories-box client-story-tile-img transition-03s-eio' style={{backgroundColor: backgroundColor, color: textColor, flexDirection:'column'}}>
          <div className='d-flex align-items-center justify-content-center' style={{overflow: 'hidden', flexBasis: '100%', maxWidth:'100%', padding: '2rem'}}>
            <img src={logo} style={{maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain'}}></img>
          </div>
          <div className='body-stories-sect d-flex flex-column h-100 w-100 p-4 pt-0 bkg-tile-client-story syd-vertical-box-body'>
            <h4 className="fw-bold font-title" style={{color: titleColor}}>{title}</h4>
            <div className='d-flex align-items-center gap-2'>
                <div
                  style={{ height: '0.6rem', width: '0.6rem', borderRadius: 50 }}
                  className='bg-main-color'
                />
                <p className='m-0 text-uppercase' style={{ fontSize: '0.8rem' }}>
                  {TranslationsService.labels(`services.${buArea.key}.title`)}
                  {buArea.sub_items && (
                    <span>
                      {' '}– {TranslationsService.labels('services')[buArea.key].items[buArea.sub_items].title}
                    </span>
                  )}
                </p>
              </div>
            <br/>
            {
              buService.map(service => {
                const title = getServiceTitle(
                  buArea.key,
                  buArea.sub_items,
                  service
                );
                if (!title) return null;
                return (
                  <div className='d-flex align-items-center gap-2' key={service}>
                    <p className='m-0 text-uppercase' style={{ fontSize: '0.7rem' }}>
                      {title}
                    </p>
                  </div>
                );
              })
            }
            </div>
        </div>
      </Link>
    </div>
    // <div className={`col-md-${colMD} col-sm-${colSM} p-4`}>
    //   <div className='syd-card-container'>
    //     <div className='image-background' style={{backgroundImage: `url(${bgImage})`}}/>
    //     <div className='syd-content-card'>
    //       <h3>{title}</h3>
    //       <Link to={link} className='text-deco-none'>
    //         <div className='syd-button-card'>
    //           {TranslationsService.labels('explore_more')}
    //         </div>
    //       </Link>
    //     </div>
    //   </div>
    // </div>
  );
};