import React, { useContext, useEffect, useState } from 'react';
import './services-detail.scss';
import { useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';
import { Link } from "react-router-dom";
import { VectorAnimated } from '../../components/vector-animated/vector-animated';
import DOMPurify from 'dompurify';
import { Loader } from '../../components/loader/loader';
import { Helmet } from 'react-helmet-async';

const api = process.env.REACT_APP_URL_API;

export const ServicesDetail = () => {
    const text_test1 = `
    <h1 style='color:#fece2f'>SAP Edition</h1><p>Accelerate the creation of full-stack, modern business solutions across your SAP landscape with the <b>Neptune DXP SAP Edition</b>. This rapid, low-code, SAP-certified app development platform is embedded within your existing ABAP stack, ensuring a zero IT footprint.</p><p>Quickly deliver custom SAP Fiori apps, microservices, and reports at scale, empowering your enterprise to innovate faster.</p><br/><h4><b>Empower Developers</b></h4><p>Transform any ABAP class into a <b>RESTful API</b> effortlessly by simply adding the Neptune Software interface.<br/> Public methods in your ABAP classes seamlessly become operations in your APIs, enabling more flexible and scalable integration.</p><br/><h4><b>Drag-and-Drop Simplicity</b></h4><p>Create <b>responsive UIs</b> and bind them to your data sources using Neptune's visual <b>App Designer</b>.<br/> Our drag-and-drop interface makes building and integrating apps easier than ever. Consume ABAP APIs as data sources and leverage prebuilt UI components and Neptune-curated building blocks to design dynamic apps without requiring deep technical expertise or complex coding.</p><br/><h4><b>Centralized App Management</b></h4><p>Expose your apps as tiles in the launchpad, making distribution and management simple. <br>/You can generate a library of bespoke apps and assign them to tiles with just a few clicks. The launchpad keeps tiles updated with live data and doesn’t require rebuilding mobile clients when changes are made.<br/> Your apps are ready to use instantly, with <b>PWA</b> and <b>native compatibility</b> out of the box.</p><br/><h1 style='color:#fece2f'>Open Edition</h1><p>Embrace new digital directions with <b>Neptune DXP Open Edition</b>, a platform-independent solution for building apps at scale, with ease. Connect your on-premise backend systems to the cloud using our no-code/low-code platform, powered by standards-based APIs.</p><p>The Open Edition provides a central launchpad for both internal and external users, enabling seamless access and integration across multiple systems.</p><br/><h1 style='color:#fece2f'>Neptune DX Platform</h1><p><b>Neptune DX Platform</b> combines no-code, low-code, and pro-code approaches, driving productivity across your organization. It comes in two main editions:</p><ul><li><span style='color:#fece2f'><b>SAP Edition</b></span><br/> A platform developed specifically for SAP backend solutions, running embedded within the SAP NetWeaver stack. P8 is the only fully certified rapid application development platform built for SAP.</li><li><span style='color:#fece2f'><b>Open Edition</b></span><br/> An API-driven platform that supports rapid application development across any backend, cloud, or architecture. It offers unparalleled flexibility for non-SAP systems.</li></ul><p>Both editions share core functionalities but also include specialized features tailored to their respective environments. Additionally, SAP Edition apps can be run natively within the Open Edition landscape, enabling integration with frontend libraries like React or Angular.</p><br/><h4><b>API-Driven Application Development</b></h4><p>Neptune Software reduces development efforts by up to 80%. With our low-code designer, developers have full control over the entire lifecycle—from design to deployment. Neptune DXP also supports code portability, allowing developers to import and export functionalities, ensuring you’re never locked into the platform.</p>
    `;

    let { area_id } = useParams();
    let { service_id } = useParams();
    let { sub_area } = useParams();

    const { services: {TranslationsService} } = useContext(AppContext);
    // document.title = `${service_id ? TranslationsService.labels(`services.${area_id}.${service_id}.title`) : TranslationsService.labels(`services.${area_id}.title`)} | ${TranslationsService.getMainInfoCompany('name')}`;
    const [showLoader, setShowLoader] = useState(false);
    const [listClientStories, setListClientStories] = useState([]);

    const determineTitleAndAnimation = () => {
      let title;
      let animationName;
  
      if (area_id && service_id) {
        title = `${TranslationsService.labels(`services.${area_id}.title`)} - ${TranslationsService.labels(`services.${area_id}.items.${service_id}.title`)}`;
        animationName = area_id;
      } else if (service_id && sub_area) {
        title = TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.title`);
        animationName = TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.animation`);
      } else if (service_id) {
        title = TranslationsService.labels(`services.${area_id}.${service_id}.title`);
        animationName = TranslationsService.labels(`services.${area_id}.${service_id}.animation`);
      } else {
        title = TranslationsService.labels(`services.${area_id}.title`);
        animationName = area_id;
      }
      return { title, animationName };
    };
  
    const { title, animationName } = determineTitleAndAnimation();
  
    useEffect(() => {
      document.title = `${title} | ${TranslationsService.getMainInfoCompany('name')}`;
    }, [title]);

    const openMailForContact = () => {
      if(sub_area){
        const recipient = TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.contact-mail`);
        const subject = `[${TranslationsService.labels(`services.${area_id}.title`)}-${TranslationsService.labels('services')[area_id].items[sub_area].title}-${TranslationsService.labels('services')[area_id].items[sub_area][service_id].title}] ${TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.subject-mail`)}`
        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
        window.location.href = mailtoLink;
      }
      else {
        const recipient = TranslationsService.labels(`services.${area_id}.${service_id}.contact-mail`);
        const subject = `[${TranslationsService.labels(`services.${area_id}.title`)}-${TranslationsService.labels(`services.${area_id}.${service_id}.title`)}] ${TranslationsService.labels(`services.${area_id}.${service_id}.subject-mail`)}`
        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
        window.location.href = mailtoLink;
      }
    }

    // useEffect(() => {
    //   setListClientStories([]);
    //   if(!service_id || !TranslationsService.childMenuAvailable('insightsSections.client-stories')){
    //     return;
    //   }
    //   setShowLoader(true);
    //   fetch(`${api}/content-public?id=client-stories&language=${TranslationsService.getCurrentLanguage()}&service=${area_id},${service_id}`)
    //   .then(response => response.json()).then(data => {
    //     setListClientStories(data.data);
    //     setShowLoader(false);
    //   });
    // },[area_id, service_id, TranslationsService]);

    useEffect(() => {
      setListClientStories([]);
      if(!service_id || !TranslationsService.childMenuAvailable('insightsSections.client-stories')){
        return;
      }
      console.log(`service=${area_id},${service_id}`);
      // setShowLoader(true);
      // fetch(`${api}/content-public?id=client-stories&language=${TranslationsService.getCurrentLanguage()}&service=${area_id},${service_id}`)
      // .then(response => response.json()).then(data => {
      //   setListClientStories(data.data);
      //   setShowLoader(false);
      // });
    },[area_id, service_id, TranslationsService]);

    // setListClientStories(TranslationsService.labels(`client_stories_sect`));
    
  return (
    
    <div className="section-home">
      {
        showLoader &&
        <Loader />
      }
      {
        service_id ?
        (
          <header className='p-3 header-services-detail position-relative d-flex align-items-center'>
            <VectorAnimated animationName={animationName} />
            <div className='p-2 w-75'>
              {
                sub_area ?
                (
                  <>
                    <p className='dark-mode-text m-0 breadcrumb-detail'>
                      <Link to='/' className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
                      &nbsp;&#9656;&nbsp;
                      <Link to='/services' className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.services.label`)}</Link>
                      &nbsp;&#9656;&nbsp;
                      <Link to={`/services/${area_id}`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`services.${area_id}.title`)} - {TranslationsService.labels('services')[area_id].items[sub_area].title}</Link>
                      {/* &nbsp;&#9656;&nbsp;
                      <Link to={`/services/${area_id}/${sub_area}`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels('services')[area_id].items[sub_area].title}</Link> */}
                    </p>
                    <h1 className='syd-title light fw-bold'>{TranslationsService.labels('services')[area_id].items[sub_area][service_id].title}</h1>
                    <p className='pre-line-w-space dark-mode-text syd-body-article-p box-sub-service' dangerouslySetInnerHTML={{ __html: TranslationsService.labels('services')[area_id].items[sub_area][service_id].desc }}></p>
                  </>
                )
                :
                (
                  <>
                    {/* <nav aria-label="breadcrumb" className='dark-mode-text m-0 breadcrumb-detail'>
                      <ol>
                        <li><Link to='/' className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link></li>
                        <li><a href="/services">Servizi</a></li>
                        <li>Nome del servizio</li>
                      </ol>
                    </nav> */}
                    <p className='dark-mode-text m-0 breadcrumb-detail'>
                      <Link to='/' className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
                      &nbsp;&#9656;&nbsp;
                      <Link to='/services' className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.services.label`)}</Link>
                      &nbsp;&#9656;&nbsp;
                      <Link to={`/services/${area_id}`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`services.${area_id}.title`)}</Link>
                    </p>
                    {
                      area_id && TranslationsService.labels(`services.${area_id}.items`)?
                      (
                        <>
                        <h1 className='syd-title light fw-bold'>{TranslationsService.labels(`services.${area_id}.items.${service_id}.title`)}</h1>
                        <p className='pre-line-w-space dark-mode-text syd-body-article-p box-sub-service' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`services.${area_id}.items.${service_id}.desc`) }}></p>
                        </>
                      )
                      :
                      (
                        <>
                        <h1 className='syd-title light fw-bold'>{TranslationsService.labels(`services.${area_id}.${service_id}.title`)}</h1>
                        <p className='pre-line-w-space dark-mode-text syd-body-article-p box-sub-service' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`services.${area_id}.${service_id}.desc`) }}></p>
                        </>
                      )
                    }
                  </>
                )
              }
            </div>
          </header>
        )
        :
        (
        <header className='p-3 syd-bg-dark header-services-detail area-service d-flex align-items-center'>
          <div>
            <p className='dark-mode-text m-0 breadcrumb-detail'>
              <Link to='/' className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
              &nbsp;&#9656;&nbsp;
              <Link to='/services' className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.services.label`)}</Link>
            </p>
            <h1 className='syd-title light fw-bold'>{TranslationsService.labels(`services.${area_id}.title`)}</h1>
            <p className='pre-line-w-space dark-mode-text syd-body-article-p' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`services.${area_id}.desc`) }}></p>
          </div>
        </header>
        )
      }

      {/* <div className='container-fluid box-main-text-desc-service'>
        {
        service_id &&
          sub_area ?
            (
              <p className='main-text-desc-service' dangerouslySetInnerHTML={{ __html: TranslationsService.labels('services')[area_id].items[sub_area][service_id].desc }}></p>
            )
            :
            (
              <p className='main-text-desc-service' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`services.${area_id}.${service_id}.desc`) }}></p>
            )
        }
      </div> */}
      
      <div className='container-fluid p-0'>
      {
        service_id ?
        (
          <div>
            {
              sub_area ?
              (
                <div>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(TranslationsService.labels('services')[area_id].items[sub_area][service_id].text) }} className='dark-mode-text syd-body-article-p box-desc-serv'></div>
                  {/* <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text_test1) }} className='dark-mode-text fs-5 box-desc-serv'></div> */}
                  {
                    TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.contact-text`) && TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.contact-mail`) &&
                    <div className='box-more-info-service p-5 mb-5 w-max-content'>
                      <h4 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.contact-text`)) }} className='text-more-info'></h4>
                      <button className='btn-more-info-service syd-button m-0' onClick={openMailForContact}>
                        {TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.contact-button-text`)}
                      </button>
                    </div>
                  }
                </div>
              )
              :
              (
                area_id && TranslationsService.labels('services')[area_id].items ?
                (
                  <div className='row p-2 row-gap-3 p-3'>
                    {                  
                      TranslationsService.labels('services')[area_id].items[service_id] &&
                      Object.keys(TranslationsService.labels(`services.${area_id}.items.${service_id}`)).map((_subItem, j) => (
                        typeof TranslationsService.labels('services')[area_id].items[service_id][_subItem] === 'object' &&
                        TranslationsService.labels('services')[area_id].items[service_id][_subItem].title &&
                        (
                          <div className={`col-sm-6 col-lg-${((j - 2) % 7) < 4 ? '3':'4'}`} key={j}>
                            <Link to={`/services/${area_id}/${service_id}/${_subItem}`} className='text-deco-none'>
                              <div className='syd-box small syd-box-service'>
                                <div className='d-flex justify-content-between align-items-center'>
                                  <div>
                                    <h4 className='syd-title small light'>{TranslationsService.labels('services')[area_id].items[service_id][_subItem].title}</h4>
                                  </div>
                                  <div>
                                    <svg viewBox="0 0 10 11.55" className='box-arrow-item'>
                                      <polygon className="arrow-item" points="10 5.77 0 0 0 11.55 10 5.77"/>
                                    </svg>
                                  </div>
                                </div>
                                <p className='syd-paragraph' dangerouslySetInnerHTML={{ __html: TranslationsService.labels('services')[area_id].items[service_id][_subItem].desc }}></p>
                              </div>
                            </Link>
                          </div>
                        )
                      ))
                    }
                  </div>
                )
                :
                (                
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(TranslationsService.labels(`services.${area_id}.${service_id}.text`)) }} className='dark-mode-text syd-body-article-p box-desc-serv'></div>
                    {
                      TranslationsService.labels(`services.${area_id}.${service_id}.contact-text`) && TranslationsService.labels(`services.${area_id}.${service_id}.contact-mail`) &&
                      <div className='box-more-info-service p-5 mb-5 w-max-content'>
                        <h4 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(TranslationsService.labels(`services.${area_id}.${service_id}.contact-text`)) }} className='text-more-info'></h4>
                        <button className='btn-more-info-service syd-button m-0' onClick={openMailForContact}>
                          {TranslationsService.labels(`services.${area_id}.${service_id}.contact-button-text`)}
                        </button>
                      </div>
                    }
                  </div>)
                )
            }
          </div>
        )
        :
        (
          // <div className='row p-2 row-gap-3'>
          <div className='container px-md-5'>
            <div className='row'>
            {
              TranslationsService.labels('services')[area_id].items ?
              (
                Object.keys(TranslationsService.labels('services')[area_id].items).map((_sub, i) => (
                  <div key={i}>
                    <Link to={`/services/${area_id}/${_sub}`} className='text-deco-none d-flex gap-3 align-items-center title-area pb-3'>
                      <h4 className='dark-mode-text m-0 fw-bold transition-03s-eio fs-3'>{TranslationsService.labels('services')[area_id].items[_sub].title}</h4>
                    </Link>
                    <div className='row row-gap-3'>
                      {
                        TranslationsService.labels('services')[area_id].items[_sub] &&
                        Object.keys(TranslationsService.labels('services')[area_id].items[_sub]).map((_subItem, j) => (
                          typeof TranslationsService.labels('services')[area_id].items[_sub][_subItem] === 'object' &&
                          TranslationsService.labels('services')[area_id].items[_sub][_subItem].title &&
                          (
                            <div className='col-md-4 col-sm-12 p-4' key={j}>
                              <div className='syd-card-container'>
                                <div className='image-background' style={{backgroundImage: `url(${TranslationsService.labels('services')[area_id].items[_sub][_subItem].image})`}}/>
                                <div className='syd-content-card'>
                                  <h2>{TranslationsService.labels('services')[area_id].items[_sub][_subItem].title}</h2>
                                  <Link to={`/services/${area_id}/${_sub}/${_subItem}`} className='text-deco-none'>
                                    <div className='syd-button-card'>
                                      {TranslationsService.labels('explore_more')}
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                            // <div className={`col-sm-6 col-lg-${((j - 2) % 7) < 4 ? '3':'4'}`} key={j}>
                            //   <Link to={`/services/${area_id}/${_sub}/${_subItem}`} className='text-deco-none'>
                            //     <div className='syd-box small syd-box-service'>
                            //       <div className='d-flex justify-content-between align-items-center'>
                            //         <div>
                            //           <h4 className='syd-title small light'>{TranslationsService.labels('services')[area_id].items[_sub][_subItem].title}</h4>
                            //         </div>
                            //         <div>
                            //           <svg viewBox="0 0 10 11.55" className='box-arrow-item'>
                            //             <polygon className="arrow-item" points="10 5.77 0 0 0 11.55 10 5.77"/>
                            //           </svg>
                            //         </div>
                            //       </div>
                            //       <p className='syd-paragraph' dangerouslySetInnerHTML={{ __html: TranslationsService.labels('services')[area_id].items[_sub][_subItem].desc }}></p>
                            //     </div>
                            //   </Link>
                            // </div>
                          )
                        ))
                      }
                    </div>
                  </div>
                ))
              )
              :
              (
                Object.keys(TranslationsService.labels(`services.${area_id}`)).map((_sub, i) => (
                  TranslationsService.labels(`services.${area_id}.${_sub}.title`) && 
                    <div className='col-md-4 col-sm-12 p-4' key={i}>
                      <div className='syd-card-container'>
                        <div className='image-background' style={{backgroundImage: `url(${TranslationsService.labels(`services.${area_id}.${_sub}.image`)})`}}/>
                        <div className='syd-content-card'>
                          <h2>{TranslationsService.labels(`services.${area_id}.${_sub}.title`)}</h2>
                          <Link to={`/services/${area_id}/${_sub}`} className='text-deco-none'>
                            <div className='syd-button-card'>
                              {TranslationsService.labels('explore_more')}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  // <div className={`col-sm-6 col-lg-${((i - 3) % 7) < 4 ? '3':'4'}`} key={i}>
                  //   <Link to={`/services/${area_id}/${_sub}`} className='text-deco-none'>
                  //     <div className='syd-box small syd-box-service'>
                  //       <div className='d-flex justify-content-between align-items-center'>
                  //         <div>
                  //           <h4 className='syd-title small light'>{TranslationsService.labels(`services.${area_id}.${_sub}.title`)}</h4>
                  //         </div>
                  //         <div>
                  //           <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 11.55" className='box-arrow-item'>
                  //             <polygon className="arrow-item" points="10 5.77 0 0 0 11.55 10 5.77"/>
                  //           </svg>
                  //         </div>
                  //       </div>
                  //       <p className='syd-paragraph' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`services.${area_id}.${_sub}.desc`) }}></p>
                  //     </div>
                  //   </Link>
                  // </div>
                ))
              )
            }
            </div>
          </div>
        )
      }
      </div>


        {
        listClientStories?.length > 0 &&
        <div className='p-3'>
          <h1 className='dark-mode-title fw-bold'>{TranslationsService.labels('client_stories')}</h1>
          <div className='row gap-3 gap-lg-0'>
          {
          listClientStories.map((_cStory, ind) =>(
            <div className='col-sm-12 col-lg-4' key={ind}>
              <Link to='/insights/client-stories/dropsa' className='text-deco-none tile-client-story'>
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