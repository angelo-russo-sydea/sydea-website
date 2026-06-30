import React, {useContext} from 'react';
import "./roles.scss";
import { Link, useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';

export const Roles = () => {
  const { lang } = useParams();
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `${TranslationsService.labels(`explore_sydea_roles`)} | ${TranslationsService.getMainInfoCompany('name')}`;

  return (
    <div className="section-home light">
      <section className='main-hero syd-hero position-relative' style={{backgroundImage:`url(${TranslationsService.labels('hero_sections.explore_roles.img_path')})`}}>
        <div className='my-auto mx-0'>
          <p className='dark-mode-text m-0 breadcrumb-detail'>
            <Link to={`/${lang}`}  className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
            &nbsp;&#9656;&nbsp;
            <Link to={`/${lang}/careers`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.careers.label`)}</Link>
          </p>
          <h2 className='syd-title light text-uppercase'>{TranslationsService.labels('explore_sydea_roles')}</h2>
          {
            TranslationsService.labels('hero_sections.explore_roles.text') &&
            <p className='dark-mode-text fs-1 m-0'>{TranslationsService.labels('hero_sections.explore_roles.text')}</p>
          }
        </div>
      </section>
      <div className='container-fluid'>
        <div className='row p-3 row-gap-3'>
        {
          Object.keys(TranslationsService.labels('roles')).map((_role,i) => (
            <div key={i} className='col-sm-6 col-lg-4'>
              <Link to={`/${lang}/careers/roles/${_role}`} className='text-deco-none'>
                <div className='syd-box small flat my-2'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <h4 className='syd-title small light'>{TranslationsService.labels(`roles.${_role}.name`)}</h4>
                    </div>
                    <div>
                      <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 11.55" className='box-arrow-item'>
                        <polygon className="arrow-item" points="10 5.77 0 0 0 11.55 10 5.77"/>
                      </svg>
                    </div>
                  </div>
                  <p className='syd-paragraph'>{TranslationsService.labels(`roles.${_role}.text`)}</p>
                </div>
              </Link>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  );
};

