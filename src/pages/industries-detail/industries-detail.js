import React, {useState, useEffect, useContext} from 'react';
import './industries-detail.scss';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { AppContext } from '../../services/translationContext';
import { Loader } from '../../components/loader/loader';

const api = process.env.REACT_APP_URL_API;

export const IndustriesDetail = () => {
    let { industries_id, lang } = useParams();
    const [listClientStories, setListClientStories] = useState([]);
    const { services: {TranslationsService} } = useContext(AppContext);
    const [showLoader, setShowLoader] = useState(false);
    document.title = `${TranslationsService.labels(`industries.${industries_id}.title`)} | ${TranslationsService.getMainInfoCompany('name')}`;

    useEffect(() => {
      if(!TranslationsService.childMenuAvailable('insightsSections.client-stories')){
        return;
      }
      setShowLoader(true);
      fetch(`${api}/content-public?id=client-stories&language=${TranslationsService.getCurrentLanguage()}&industries=${industries_id}`)
      .then(response => response.json()).then(data => {
        setListClientStories(data.data);
        setShowLoader(false);
      });
    },[industries_id, TranslationsService]);
    
  return (
    <div id='container-news' className="section-home light">
      {
        showLoader &&
        <Loader />
      }
      <section className='hero-industries-det syd-hero position-relative' style={{backgroundImage:`url(${TranslationsService.labels(`industries.${industries_id}.hero_image`)})`}}>
        <div className='my-auto mx-0 w-75'>
          <p className='dark-mode-text m-0 breadcrumb-detail'>
            <Link to={`/${lang}`} className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
            &nbsp;&#9656;&nbsp;
            <Link to={`/${lang}/industries`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.industries.label`)}</Link>
          </p>
          <h2 className='syd-title light text-uppercase'>{TranslationsService.labels(`industries.${industries_id}.title`)}</h2>
          {
            TranslationsService.labels(`industries.${industries_id}.desc`) &&
            <p className='dark-mode-text fs-1 m-0'>{TranslationsService.labels(`industries.${industries_id}.desc`)}</p>
          }
        </div>
      </section>

      <div className='p-3'>
        <div className='px-5'>
          <p className='syd-body-article-p box-desc-industry' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`industries.${industries_id}.text`) }}>
          </p>
        </div>

        {
          TranslationsService.labels(`industries.${industries_id}.my_company_for`) &&
          <div className='p-4 syd-bg-dark w-75 mt-5'>
            <h3 className='fs-2 dark-mode-title'>{TranslationsService.getMainInfoCompany('name')} for <span className='text-uppercase dark-mode-text fw-bold'>{TranslationsService.labels(`industries.${industries_id}.title`)}</span></h3>
            <p className='syd-body-article-p dark-mode-text m-0' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`industries.${industries_id}.my_company_for`) }}></p>
          </div>
        }
        
      </div>

      {
        listClientStories?.length > 0 &&
        <div className='p-3'>
          <h2 className='syd-dark fw-bold'>{TranslationsService.labels('client_stories')}</h2>
          <div className='row gap-3 gap-lg-0'>
          {
          listClientStories.map((_cStory, ind) =>(
            <div className='col-sm-12 col-lg-4' key={ind}>
              <Link to={`/${lang}/insights/client-stories/${_cStory.url_path}`} className='text-deco-none tile-client-story'>
                <div className='syd-box small flat d-flex position-relative cards-cl-sto'>
                  <div className='bg-client-stories' style={{backgroundImage:`url(https://d3t3s6w5yvhc3g.cloudfront.net/images/${_cStory.image})`}}></div>
                  <div className='body-stories-sect d-flex flex-column h-100 w-100'>
                    <h4 className="syd-title light">{_cStory.title}</h4>
                    <p className='syd-paragraph syd-body-article-p pt-2'>{_cStory.description}</p>
                    <div className='row pt-5 mt-auto'>
                      <h5 className='dark-mode-text m-0 fs-6 d-flex flex-column flex-lg-row justify-content-between w-100'>
                        <span>{TranslationsService.labels(`services.${_cStory.service.split(',')[0]}.title`)} - {TranslationsService.labels(`services.${_cStory.service.split(',')[0]}.${_cStory.service.split(',')[1]}.title`)}</span>
                        <span className='text-end'>{TranslationsService.labels(`industries.${_cStory.industries}.title`)}</span>
                      </h5>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            ))
          }
          </div>
        </div>
      }
    </div>
  );
};