import React, { useContext } from 'react';
import './industries.scss';
import { NavLink, useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';

export const Industries = () => {
    const { lang } = useParams();
    const { services: {TranslationsService} } = useContext(AppContext);
    document.title = `${TranslationsService.labels(`menu.industries.label`)} | ${TranslationsService.getMainInfoCompany('name')}`;

    const industriesList = Object.keys(TranslationsService.labels('industries')).sort().reduce((objEntries, key) => {
        objEntries[key] = TranslationsService.labels(`industries.${key}`);
        return objEntries;
    }, {});

  return (
    <div className="section-home">
      <section className='main-hero syd-hero position-relative' style={{backgroundImage:`url(${TranslationsService.labels('hero_sections.industries.img_path')})`}}>
        <div className='my-auto mx-0'>
            <h2 className='syd-title light text-uppercase'>{TranslationsService.labels(`menu.industries.label`)}</h2>
            {
                TranslationsService.labels('hero_sections.industries.text') &&
                <p className='dark-mode-text fs-1 m-0'>{TranslationsService.labels('hero_sections.industries.text')}</p>
            }
        </div>
      </section>

        <div className='container-fluid'>
            <div className='row p-2'>
            {
                Object.keys(industriesList).map((key,i) => (
                    <div className='col-sm-6 col-lg-4 py-2' key={i}>
                        <NavLink to={`/${lang}/industries/${key}`} className='text-deco-none'>
                            <div className='syd-box small'>
                                <div className='d-flex justify-content-between align-items-center gap-1'>
                                    <div>
                                        <h4 className='syd-title small light'>{industriesList[key].title}</h4>
                                    </div>
                                    <div>
                                        <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 11.55" className='box-arrow-item'>
                                            <polygon className="arrow-item" points="10 5.77 0 0 0 11.55 10 5.77"/>
                                        </svg>
                                    </div>
                                </div>
                                <p className='syd-paragraph' dangerouslySetInnerHTML={{ __html: industriesList[key].desc }}></p>
                            </div>
                        </NavLink>
                    </div>
                ))
            }
            </div>
        </div>
    </div>
  );
};