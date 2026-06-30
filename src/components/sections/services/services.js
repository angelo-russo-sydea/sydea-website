import React, {useContext, useEffect, useState} from 'react';
import './services.scss';
import { AppContext } from '../../../services/translationContext';
import { Link, useParams } from "react-router-dom";
import { ServiceCard } from '../../cards/service-card';

export const Services = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  const [isVisible, setIsVisible] = useState(false);
  const { lang } = useParams();

  useEffect(() => {
    const element = document.getElementById('animatedServices');

    const handleVisibilityChange = () => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const is_visible = (rect.top < window.innerHeight && rect.bottom >= 0);
        if (is_visible) {
          window.removeEventListener('scroll', handleVisibilityChange);
        }
        setIsVisible(is_visible);
      }
    };
    window.addEventListener('scroll', handleVisibilityChange);
    return () => {
      window.removeEventListener('scroll', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="section-home mt-3 syd-bg-dark">
      {/* <div className='container-fluid p-3'>
        <Link to="/services" className='text-deco-none'>
          <h2 className='syd-title light fw-bold text-uppercase pt-5 pb-3'>{TranslationsService.labels(`menu.services.label`)}</h2>
        </Link>
        <div className='row p-0'>
          <div className='col-sm-4'>
            <p className='syd-paragraph fs-5' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`home_page.services.text`) }}></p>
          </div>
          <div id='animatedServices' className='col-sm-8 position-relative'>
            <div className='row'>
            {
              Object.keys(TranslationsService.labels(`home_page.services`)).map((_service,i)=>(
                (typeof(TranslationsService.labels(`home_page.services.${_service}`)) === 'object' ) &&
                <div key={i} className={`p-2 col-sm-6 d-flex align-items-start ${i % 2 !== 0 ? 'justify-content-end':''}`}>
                  <div className={`box-serv-home ${isVisible ? 'visible' : ''} p-3 position-relative row-section-service`}>
                    <Link to={`services/${_service}`} className='text-deco-none' key={i}>
                      <h3 className='services-title transition-03s-eio fw-bold text-uppercase d-flex align-items-center justify-content-between'>{TranslationsService.labels(`home_page.services.${_service}.title`)}
                        <span className='arrow-box-services d-flex p-1 transition-03s-eio'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                          </svg>
                        </span>
                      </h3>
                      <p className='syd-paragraph fs-6' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`home_page.services.${_service}.text`) }}></p>
                    </Link>
                  </div>
                </div>
              ))
            }
            </div>
          </div>
        </div>
      </div> */}
      <div className='container-fluid p-3'>
        <Link to={`/${lang}/services`} className='text-deco-none'>
          <h2 className='syd-title light fw-bold pt-5'>{TranslationsService.labels(`menu.services.label`)}</h2>
        </Link>
          <div className='p-2'>
            <p className='syd-paragraph syd-body-article-p' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`home_page.services.text`) }}></p>
            <div className='container px-md-5'>
              <div className='row'>
              {
                Object.keys(TranslationsService.labels(`home_page.services`))
                  .filter(key => typeof TranslationsService.labels("home_page.services")[key] === 'object')
                  .map((_service, i)=>(
                    // <div className={`col-md-4 col-sm-12 p-4`} key={i}>
                    //   <div className='syd-card-container'>
                    //     <div className='image-background' style={{backgroundImage: `url(${TranslationsService.labels(`home_page.services.${_service}.image`)})`}}/>
                    //     <div className='syd-content-card'>
                    //       <h3>{TranslationsService.labels(`home_page.services.${_service}.title`)}</h3>
                    //       <Link to={`/${lang}/services/${_service}`} className='text-deco-none'>
                    //         <div className='syd-button-card'>
                    //           {TranslationsService.labels('explore_more')}
                    //         </div>
                    //       </Link>
                    //     </div>
                    //   </div>
                    // </div>

                    <ServiceCard 
                      key={i}
                      colMD={4}
                      colSM={12}
                      bgImage={TranslationsService.labels(`home_page.services.${_service}.image`)}
                      title={TranslationsService.labels(`home_page.services.${_service}.title`)}
                      link={`/${lang}/services/${_service}`}
                    />

                ))
              }
              </div>
            </div>
          {/* <div className='col-sm-4'>
            <p className='syd-paragraph fs-5' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`home_page.services.text`) }}></p>
          </div>
          <div id='animatedServices' className='col-sm-8 position-relative'>
            <div className='row'>
            {
              Object.keys(TranslationsService.labels(`home_page.services`)).map((_service,i)=>(
                (typeof(TranslationsService.labels(`home_page.services.${_service}`)) === 'object' ) &&
                <div key={i} className={`p-2 col-sm-6 d-flex align-items-start ${i % 2 !== 0 ? 'justify-content-end':''}`}>
                  <div className={`box-serv-home ${isVisible ? 'visible' : ''} p-3 position-relative row-section-service`}>
                    <Link to={`services/${_service}`} className='text-deco-none' key={i}>
                      <h3 className='services-title transition-03s-eio fw-bold text-uppercase d-flex align-items-center justify-content-between'>{TranslationsService.labels(`home_page.services.${_service}.title`)}
                        <span className='arrow-box-services d-flex p-1 transition-03s-eio'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                          </svg>
                        </span>
                      </h3>
                      <p className='syd-paragraph fs-6' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`home_page.services.${_service}.text`) }}></p>
                    </Link>
                  </div>
                </div>
              ))
            }
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};