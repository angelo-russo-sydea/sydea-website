import React, { useContext } from 'react';
import './services.scss';
import { Link, useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';
import { PageHero } from '../../components/page-hero/page-hero';
import { ServiceCard } from '../../components/cards/service-card';

export const Services = () => {
    const { lang } = useParams();
    const { services: {TranslationsService} } = useContext(AppContext);
    document.title = `${TranslationsService.labels(`menu.services.label`)} | ${TranslationsService.getMainInfoCompany('name')}`;
    const servicesList = TranslationsService.labels('services');

  return (
    <div className="section-home">
      <PageHero
        bgImage={TranslationsService.labels('hero_sections.services.img_path')}
        breadcrumb={[]}
        title={TranslationsService.labels(`menu.services.label`)}
        subtitle={TranslationsService.labels(`hero_sections.services.text`)}
        hideBreadcrumb={true}
      />
        <div className='container'>
            {
                Object.keys(servicesList).map((area,indice) => {
                    return (
                    <div key={indice}>
                        <div className='my-2 title-service-sticky'>
                            <Link to={`/${lang}/services/${area}`} className='text-deco-none d-flex gap-3 align-items-center title-area' style={{width:'max-content'}}>
                                <h2 className='syd-title white m-0 fw-bold transition-03s-eio' style={{color:'#fece2f', fontSize:'4rem', zIndex: 9999}}>{servicesList[area].title}</h2>
                                {/* <svg viewBox="0 0 10 11.55" style={{height:'1rem'}} className="box-arrow-title-service">
                                    <polygon className="arrow-title-service transition-03s-eio" points="10 5.77 0 0 0 11.55 10 5.77"/>
                                </svg> */}
                            </Link>
                        </div>
                        <div>
                            {
                                TranslationsService.labels('services')[area].items ?
                                (
                                Object.keys(TranslationsService.labels('services')[area].items).map((_sub, i) => (
                                    <div key={i}>
                                        <Link to={`/${lang}/services/${area}/${_sub}`} className='text-deco-none'>
                                            <h3 className='dark-mode-text m-0 fw-bold transition-03s-eio fs-3 pb-3'>{TranslationsService.labels('services')[area].items[_sub].title}</h3>
                                        </Link>
                                        <div className='container px-md-5'>
                                            <div className='row'>
                                            {
                                                TranslationsService.labels('services')[area].items[_sub] ?
                                                (
                                                    Object.entries(TranslationsService.labels('services')[area].items[_sub])
                                                    .filter(([key, val]) =>
                                                      typeof val === 'object' &&
                                                      val.title
                                                    )
                                                    .map(([subItemKey, subItemValue], j) => (
                                                      // <div className='col-md-4 col-sm-12 p-4' key={j}>
                                                      //   <div className='syd-card-container'>
                                                      //     <div
                                                      //       className='image-background'
                                                      //       style={{ backgroundImage: `url(${subItemValue.image})` }}
                                                      //     />
                                                      //     <div className='syd-content-card'>
                                                      //       <h4>{subItemValue.title}</h4>
                                                      //       <Link
                                                      //         to={`/${lang}/services/${area}/${_sub}/${subItemKey}`}
                                                      //         className='text-deco-none'
                                                      //       >
                                                      //         <div className='syd-button-card'>
                                                      //           {TranslationsService.labels('explore_more')}
                                                      //         </div>
                                                      //       </Link>
                                                      //     </div>
                                                      //   </div>
                                                      // </div>
                                                      <ServiceCard 
                                                        key={j}
                                                        colMD={4}
                                                        colSM={12}
                                                        bgImage={subItemValue.image}
                                                        title={subItemValue.title}
                                                        link={`/${lang}/services/${area}/${_sub}/${subItemKey}`}
                                                      />
                                                    ))
                                                  
                                                ) : null
                                            }
                                            </div>
                                        </div>
                                    </div>
                                ))
                                )
                                :
                                (
                                <div className='container px-md-5'>
                                    <div className='row'>
                                    {
                                        Object.entries(servicesList[area])
                                        .filter(([key, val]) => typeof val === 'object' && val.title)
                                        .map(([subbu, val], i) => (
                                          // <div className='col-md-4 col-sm-12 p-4' key={i}>
                                          //   <div className='syd-card-container'>
                                          //     <div
                                          //       className='image-background'
                                          //       style={{ backgroundImage: `url(${val.image})` }}
                                          //     />
                                          //     <div className='syd-content-card'>
                                          //       <h4>{val.title}</h4>
                                          //       <Link to={`/${lang}/services/${area}/${subbu}`} className='text-deco-none'>
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
                                            bgImage={val.image}
                                            title={val.title}
                                            link={`/${lang}/services/${area}/${subbu}`}
                                          />
                                        ))
                                    }
                                    {/* {
                                        Object.keys(servicesList[area]).map((subbu,i) => (
                                        servicesList[area][subbu].title && 
                                            <div className='col-md-4 col-sm-12 p-4' key={i}>
                                                <div className='syd-card-container'>
                                                  <div className='image-background' style={{backgroundImage: `url(${servicesList[area][subbu].image})`}}/>
                                                  <div className='syd-content-card'>
                                                    <h4>{servicesList[area][subbu].title}</h4>
                                                    <Link to={`/${lang}/services/${area}/${subbu}`} className='text-deco-none'>
                                                      <div className='syd-button-card'>
                                                        {TranslationsService.labels('explore_more')}
                                                      </div>
                                                    </Link>
                                                  </div>
                                                </div>
                                            </div>
                                        ))
                                    } */}
                                    </div>
                                </div>

                               
                                )
                            }
                        </div>
                    </div>
                    );
                })
            }
        </div>
    </div>
  );
};