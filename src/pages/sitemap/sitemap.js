import React, { useContext } from "react";
import './sitemap.scss';
import { Link, useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';

export const Sitemap = () => {
  let { lang } = useParams();

  const { services: { TranslationsService } } = useContext(AppContext);
  document.title = `Sitemap | ${TranslationsService.getMainInfoCompany('name')}`;

  return (
    <div className="section-home light p-5">
      <h4 className='dark-mode-title fs-5 m-0'>About Sydea</h4>
      <h2 className='syd-black fw-bold fs-1'>Sitemap</h2>

      <div id="syd-sitemap" className="section-sitemap py-5">
        <div className="row">
        {
          TranslationsService.sectionAvailable('services') &&
          <div className="col-sm-12 col-lg-4">
            <Link to={`/${lang}/services`} className="text-deco-none fw-bold fs-3">
              {TranslationsService.labels(`menu.services.label`)}
            </Link>
            {
              Object.entries(TranslationsService.labels('services')).map(([area, areaValue], indice) => (
                <ul key={indice}>
                  <li>
                    <Link to={`/${lang}/services/${area}`} className='text-deco-none fw-bold fs-5'>
                      {areaValue.title}
                    </Link>
                  </li>
                  <ul>
                    {
                      areaValue.items && Object.keys(areaValue.items).length > 0 ? (
                        Object.entries(areaValue.items)
                          .filter(([key, val]) => typeof val === 'object' && val.title)
                          .map(([subKey, subValue], i) => (
                            <ul key={i}>
                              <b>{subValue.title}</b>
                              {
                                Object.entries(subValue)
                                  .filter(([k, v]) => typeof v === 'object' && v.title)
                                  .map(([subSubKey, subSubValue], j) => (
                                    <li key={j} className="ms-2">
                                      <Link to={`/${lang}/services/${area}/${subKey}/${subSubKey}`} className='text-deco-none fs-6'>
                                        {subSubValue.title}
                                      </Link>
                                    </li>
                                  ))
                              }
                            </ul>
                          ))
                      ) : (
                        Object.entries(areaValue)
                          .filter(([key, val]) => typeof val === 'object' && val.title)
                          .map(([subKey, subValue], i) => (
                            <li key={i}>
                              <Link to={`/${lang}/services/${area}/${subKey}`} className='text-deco-none fs-6'>
                                {subValue.title}
                              </Link>
                            </li>
                          ))
                      )
                    }
                  </ul>
                </ul>
              ))
            }
          </div>
        }


        {
          TranslationsService.sectionAvailable('products') &&
          <div className="col-sm-12 col-lg-4">
          <Link to={`/${lang}/products`} className="text-deco-none fw-bold fs-3">{TranslationsService.labels(`menu.products.label`)}</Link>
            <ul>
              {
                Object.keys(TranslationsService.labels('products')).map((_sub,indice) => (
                  <li key={indice}>
                    <Link to={`/${lang}/products/${_sub}`} className='text-deco-none fs-6'>{TranslationsService.labels(`products.${_sub}.title`)}</Link>
                  </li>
                ))
              }
            </ul>
            <Link to={`/${lang}/industries`} className="text-deco-none fw-bold fs-3">{TranslationsService.labels(`menu.industries.label`)}</Link>
            <ul>
              {
                Object.keys(TranslationsService.labels('industries')).map((_sub,indice) => (
                  <li key={indice}>
                    <Link to={`/${lang}/industries/${_sub}`} className='text-deco-none fs-6'>{TranslationsService.labels(`industries.${_sub}.title`)}</Link>
                  </li>
                ))
              }
            </ul>
          </div>
          }
          
          <div className="col-sm-12 col-lg-4">
          {
          TranslationsService.sectionAvailable('insights') &&
          <>
            <Link to={`/${lang}/insights`} className="text-deco-none fw-bold fs-3">{TranslationsService.labels(`menu.insights.label`)}</Link>
            <ul>
            {
              TranslationsService.childMenuAvailable('insightsSections.blog') &&
              <li>
                <Link to={`/${lang}/insights/blog`} className='text-deco-none fs-6'>Blog</Link>
              </li>
            }
            {
              TranslationsService.childMenuAvailable('insightsSections.client-stories') &&
              <li>
                <Link to={`/${lang}/insights/client-stories`} className='text-deco-none fs-6'>{TranslationsService.labels('client_stories')}</Link>
              </li>
            }
            </ul>
            </>
          }

          {
            TranslationsService.sectionAvailable('about') &&
            <>
            <Link to={`/${lang}/about`} className="text-deco-none fw-bold fs-3">{TranslationsService.labels(`menu.about.label`)}</Link>
            <ul>
              <li>
                  <Link to={`/${lang}/about`} className="text-deco-none fs-6">{TranslationsService.labels('our_history')}</Link>
              </li>
              {
                TranslationsService.childMenuAvailable('aboutSections.r&d') && 
                <li>
                  <Link to={`/${lang}/about/rnd`} className="text-deco-none fs-6">R&D</Link>
                </li>
              }
              {
                TranslationsService.childMenuAvailable('aboutSections.partners') && 
                <li>
                  <Link to={`/${lang}/about/our-partners`} className="text-deco-none fs-6">{TranslationsService.labels('our_partners')}</Link>
                </li>
              }
              {
                TranslationsService.childMenuAvailable('aboutSections.certifications') && 
                <li>
                  <Link to={`/${lang}/about/our-certifications`} className="text-deco-none fs-6">{TranslationsService.labels('our_certifications')}</Link>
                </li>
              }
              {/* <li>
                  <Link to={`/${lang}/about/the-real-submarine`} className="text-deco-none fs-6">The Real Submarine</Link>
              </li> */}
            </ul>
            </>
            }

            {
              TranslationsService.sectionAvailable('careers') &&
                <Link to={`/${lang}/careers`} className="text-deco-none fw-bold fs-3">{TranslationsService.labels(`menu.careers.label`)}</Link>
            }
            
            <br/>
            
            {
              TranslationsService.sectionAvailable('contacts') &&
              <Link to={`/${lang}/contacts`} className="text-deco-none fw-bold fs-3">{TranslationsService.labels(`menu.contact-us.label`)}</Link>
            }

          </div>
        </div>
      </div>
    </div>
  );
};