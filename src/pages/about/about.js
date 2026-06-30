import React, { useEffect, useContext } from 'react';
import "./about.scss";
import { AppContext } from '../../services/translationContext';
import { Link, useParams } from 'react-router-dom';

const appOwner = process.env.REACT_APP_OWNER;

export const About = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `${TranslationsService.labels(`menu.about.label`)} | ${TranslationsService.getMainInfoCompany('name')}`;

  const timeline = TranslationsService.labels('about_timeline');
  const { lang } = useParams();

  useEffect(() => {
    for (let i = 0; i < timeline.length; i++) {
      let _selctorStep = document.querySelector(`#i-${timeline[i].year}`);
      if(_selctorStep && _selctorStep.getBoundingClientRect().top < window.innerHeight){
          _selctorStep?.classList.add('visible');
      }
    }
    const onScroll = () => {
      for (let i = 0; i < timeline.length; i++) {
        let _selctorStep = document.querySelector(`#i-${timeline[i].year}`);
        if(_selctorStep && _selctorStep.getBoundingClientRect().top < window.innerHeight){
            _selctorStep?.classList.add('visible');
          }
        }
      };
      window.removeEventListener('scroll', onScroll);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, [timeline]);

  return (
    <div className="section-home light">
      <section className='p-3 py-5 main-hero position-relative' style={{backgroundImage:`url(${TranslationsService.labels('hero_sections.about.img_path')})`}}>
        <div className='syd-box w-2_3 m-0'>
          <h2 className='syd-title light fw-bold'>{TranslationsService.labels(`menu.about.label`)}</h2>
          <p className='syd-paragraph syd-body-article-p' dangerouslySetInnerHTML={{ __html: TranslationsService.labels('hero_sections.about.text') }}></p>
        </div>
        <div className='d-flex flex-column flex-sm-row counter-row'>
          {
            Object.keys(TranslationsService.labels(`about_kpi`)).map((kpi,i) =>(
              <div className='text-center' key={i}>
                <p className='m-0 lbl-counter font-title fw-bold'>{TranslationsService.labels(`about_kpi.${kpi}.value`)}</p>
                <p className='m-0 lbl-val text-uppercase dark-mode-text'>{TranslationsService.labels(`about_kpi.${kpi}.label`)}</p>
              </div>
            ))
          }
        </div>

      </section>

      <div className='container'>
        <h2 className="syd-title dark fw-bold pt-5 pb-3 px-3" id='history-syd'>
          {TranslationsService.labels('our_history')}
        </h2>

        <section className="timeline p-3">
          <div className="container">
              <div className="steps">
                  {
                  timeline.map((_time, ind) => (
                    _time.year &&
                    <div key={ind} className="step" id={`i-${_time.year}`}>
                        <div className="content p-4">
                            <p className='m-0' dangerouslySetInnerHTML={{ __html: _time.desc }}></p>
                        </div>
                        <i className="step-line"></i>
                        <div className="date fw-bold">{_time.year}</div>
                    </div>
                    ))
                  }
              </div>
          </div>
        </section>

        <section className='p-3'>
          <div className='row'>
            <div className='col-lg-6 col-sm-12 syd-bg-dark p-5'>
              <h2 className="syd-title light fw-bold text-center">{TranslationsService.labels('vision_title')}</h2>
              <p className='text-banner-about dark-mode-text' dangerouslySetInnerHTML={{ __html: TranslationsService.labels('vision_text') }}></p>
            </div>
            <div className='col-lg-6 col-sm-12 bg-main-color p-5'>
              <h2 className="syd-title light-mode-text fw-bold text-center">{TranslationsService.labels('mission_title')}</h2>
              <p className='text-banner-about syd-black' dangerouslySetInnerHTML={{ __html: TranslationsService.labels('mission_text') }}></p>
            </div>
          </div>
        </section>

        {/* {
                TranslationsService.childMenuAvailable('aboutSections.r&d') && 
                <Route path="rnd" exact element={<RnD />} />
              }
              {
                TranslationsService.childMenuAvailable('aboutSections.partners') && 
                <Route path="our-partners" exact element={<Partners />} />
              }
              {
                TranslationsService.childMenuAvailable('aboutSections.certifications') && 
                <Route path="our-certifications" exact element={<Certifications />} />
              } */}

        <section className='py-3'>
          <div className='row'>
          {
            TranslationsService.childMenuAvailable('aboutSections.r&d') && 
            <div className='col-sm-3'>
              <div className='box-short-about p-3'>
                <Link to={`/${lang}/about/rnd`} className='text-deco-none row-section-service' style={{color: '#141414'}}>
                  <h4 className='transition-03s-eio d-flex align-items-center justify-content-between m-0'>R&D
                    <span className='arrow-box-services d-flex p-1 transition-03s-eio'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </span>
                  </h4>
                </Link>
              </div>
            </div>
          }
          {
            TranslationsService.childMenuAvailable('aboutSections.certifications') && 
            <div className='col-sm-3'>
              <div className='box-short-about p-3'>
                <Link to={`/${lang}/about/our-certifications`} className='text-deco-none row-section-service' style={{color: '#141414'}}>
                  <h4 className='transition-03s-eio d-flex align-items-center justify-content-between m-0'>{TranslationsService.labels('our_certifications')}
                    <span className='arrow-box-services d-flex p-1 transition-03s-eio'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </span>
                  </h4>
                </Link>
              </div>
            </div>
          }
          {
            TranslationsService.childMenuAvailable('aboutSections.partners') && 
            <div className='col-sm-3'>
              <div className='box-short-about p-3'>
                <Link to={`/${lang}/about/our-partners`} className='text-deco-none row-section-service' style={{color: '#141414'}}>
                  <h4 className='transition-03s-eio d-flex align-items-center justify-content-between m-0'>{TranslationsService.labels('our_partners')}
                    <span className='arrow-box-services d-flex p-1 transition-03s-eio'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </span>
                  </h4>
                </Link>
              </div>
            </div>
          }
          {/* {
            appOwner === 'sydea' &&
            <div className='col-sm-3'>
              <div className='box-short-about p-3'>
                <Link to={`/${lang}/about/the-real-submarine`} className='text-deco-none dark-mode-title row-section-service'>
                  <h4 className='transition-03s-eio d-flex align-items-center justify-content-between m-0'>The Real Submarine
                    <span className='arrow-box-services d-flex p-1 transition-03s-eio'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </span>
                  </h4>
                </Link>
              </div>
            </div>
          } */}

          </div>
        </section>
      </div>

    </div>
  );
};
