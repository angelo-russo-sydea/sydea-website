import React, { useContext, useState, useEffect } from "react";
import './home.scss';
import { Hero } from "../../components/hero/hero";
import { Services } from '../../components/sections/services/services';
import { useNavigate } from "react-router-dom";
import { Clients } from '../../components/clients/clients';
import { ClientStoriesSection } from '../../components/sections/client-stories/client-stories';
import { AppContext } from '../../services/translationContext';
import SeoHelmet from "../../components/SeoHelmet";

const appOwner = process.env.REACT_APP_OWNER;
const aaa = `Software enterprise <br/> <span class='main-color'>progettato su misura</span>`;

export const Home = () => {
  const { services: { TranslationsService } } = useContext(AppContext);
  const navigate = useNavigate();

  const [isVisibleKPI, setIsVisibleKPI] = useState(false);

  useEffect(() => {
    const element = document.getElementById('animated-row-slogan');

    const handleVisibilityChange = () => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const is_visible = (rect.top < window.innerHeight && rect.bottom >= 0);
        if (is_visible) {
          window.removeEventListener('scroll', handleVisibilityChange);
        }
        setIsVisibleKPI(is_visible);
      }
    };
    window.addEventListener('scroll', handleVisibilityChange);
    return () => {
      window.removeEventListener('scroll', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <SeoHelmet 
        title={TranslationsService.labels('home_page.meta-title')}
        description={TranslationsService.labels('home_page.meta-description')}
      />

      <header className="page-header">
        <h1 className="sr-only">Sydea - System Integrator</h1>
      </header>

      <Hero />
      <div className="container">
        { TranslationsService.sectionAvailable('services') && <Services /> }
        
        <div id="animated-row-slogan" className="bkg-dark p-5 row m-0 align-items-center">
          <div className="col-sm-9">
            <h4 className={`slogan-home dark-mode-text ${isVisibleKPI ? 'animated-text-tracking-in' : ''} font-title`} dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`home_page.slogan`) }}></h4>
            {/* <h4 className={`fw-bold slogan-home dark-mode-text ${isVisibleKPI ? 'animated-text-tracking-in' : ''}`} dangerouslySetInnerHTML={{ __html: aaa }}></h4> */}
          </div>
          <div className={`col-sm-3 d-flex flex-column gap-3 col-kpi-home ${isVisibleKPI ? 'visible' : ''}`}>
            {
              Object.keys(TranslationsService.labels(`about_kpi`)).map((kpi,i) =>(
                <div className='text-center' key={i}>
                  <p className='m-0 lbl-counter font-title'>{TranslationsService.labels(`about_kpi.${kpi}.value`)}</p>
                  <p className='m-0 lbl-val dark-mode-text text-uppercase fs-6'>{TranslationsService.labels(`about_kpi.${kpi}.label`)}</p>
                </div>
              ))
            }
            {/* <button className="syd-button d-flex align-items-center gap-2 m-auto" onClick={() => navigate("/about")}>
              About {TranslationsService.getMainInfoCompany('name')}
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </button> */}
          </div>
        </div>
        </div>

        {/* <div className="container">
          <div className='row bg-main-color m-0 py-5'>
            <div className='col-sm-12 col-lg-6 p-2 p-sm-5 text-center right-border'>
              <h4 className='syd-title dark fw-bold px-sm-5'>{TranslationsService.labels('what_can_we_help_you_achieve')}</h4>
              <button className="syd-button btn-main mt-5" onClick={() => navigate("/contacts")}>
                {TranslationsService.labels('let_get_the_work')}
              </button>
            </div>
            <div className='col-sm-12 col-lg-6 p-2 p-sm-5 text-center'>
              <h4 className='syd-title dark fw-bold px-sm-5'>{TranslationsService.labels('where_will_your_career_yake_you')}</h4>
              <button className="syd-button btn-main mt-5" onClick={() => navigate("/careers")}>
              {TranslationsService.labels('come_find_out')}
              </button>
            </div>
          </div>
        </div> */}

        
        {
          TranslationsService.childMenuAvailable('insightsSections.client-stories') && 
          <ClientStoriesSection />
        }
        
        <div className="container">
        {
          appOwner === 'sydea' &&
          <div className="bg-emotional p-5 d-flex flex-column align-items-center justify-content-center font-title">
            <p className="label-emotional m-0 p-0">Creativity</p>
            <p className="label-emotional m-0 p-0">Expertise</p>
            <p className="label-emotional m-0 p-0">Impact</p>
          </div>
        }
        </div>
        {
          TranslationsService.getGlobalValue('clients').length > 0 &&
          <div className="bkg-light">
            <Clients />
          </div>
        }

        {
          appOwner === 'sydea' &&
          <div className="map-container">
            <div className="zoom-container">
              <img
                src={require('../../assets/image/clients_map1.png')}
                alt='Sydea Clients'
                className="world-map"
              />
              {/* <img src={require('../../assets/image/clients_map1.png')} className='w-100' alt='Sydea Clients'></img> */}
            </div>
          </div>
        }
      
      
    </>
  );
};