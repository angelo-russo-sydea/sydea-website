import React, { useContext, useEffect, useState } from 'react';
import './services-detail.scss';
import { useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';
import { Link } from "react-router-dom";
import { VectorAnimated } from '../../components/vector-animated/vector-animated';
import DOMPurify from 'dompurify';
import { Loader } from '../../components/loader/loader';
import { Helmet } from 'react-helmet-async';
import SeoHelmet from '../../components/SeoHelmet';
import { FlatCard } from '../../components/cards/flat-card';

const api = process.env.REACT_APP_URL_API;

export const ServicesDetail = () => {
    const text_test1 = `
<div class="box-hero">
            <p class="hero-desc">
                In qualità di <b>partner ufficiale Odoo</b>, supportiamo le aziende nell’implementazione,
                personalizzazione e ottimizzazione del proprio sistema ERP, trasformando Odoo in uno strumento
                strategico per il business.
            </p>
            <p class="hero-desc">
                Affianchiamo i nostri clienti in ogni fase del progetto: dall’analisi iniziale fino al supporto
                continuativo, con un approccio consulenziale e orientato ai risultati.
            </p>
        </div>
        <section class="service-section">
            <div class="section-tag">I nostri servizi</div>
            <h2 class="section-title">Tutto il supporto<br />di cui hai bisogno.</h2>
            <p class="section-intro">
Supportiamo i clienti lungo tutto il ciclo di vita del progetto, dall’analisi iniziale fino all’assistenza continua, mettendo in campo competenze trasversali che spaziano dall’implementazione allo sviluppo e all’integrazione.
            </p>
            <div class="services-grid">
                <div class="service-card">
                    <p class="service-number">01</p>
                    <h3 class="service-title">Implementazione e Consulenza</h3>
                    <p class="service-text">Implementiamo Odoo adattandolo alle esigenze specifiche della tua azienda.</p>
                    <p class="service-text">Ti affianchiamo nelle scelte strategiche, individuando moduli, configurazioni e ottimizzazioni per rendere i processi più efficienti e scalabili.</p>
                    <div class="service-tags">
                        <span class="tag">Analisi</span><span class="tag">Strategia</span
                        ><span class="tag">Go-live</span>
                    </div>
                </div>
                <div class="service-card">
                    <p class="service-number">02</p>
                    <h3 class="service-title">Personalizzazioni e Sviluppo</h3>
                    <p class="service-text">Adattiamo Odoo alle logiche della tua organizzazione con personalizzazioni mirate e sviluppi su misura.</p>
                    <p class="service-text">Automatizziamo workflow, integriamo regole aziendali e realizziamo moduli dedicati, allineando il sistema ai tuoi obiettivi.</p>
                    <div class="service-tags">
                        <span class="tag">Custom modules</span><span class="tag">Automazioni</span><span class="tag">API</span>
                    </div>
                </div>
                <div class="service-card">
                    <p class="service-number">03</p>
                    <h3 class="service-title">Integrazione e Migrazione</h3>
                    <p class="service-text">Colleghiamo Odoo al tuo ecosistema applicativo garantendo continuità e coerenza dei dati.</p>
                    <p class="service-text">Gestiamo migrazioni e aggiornamenti riducendo al minimo l’impatto operativo.</p>
                    <div class="service-tags">
                        <span class="tag">ERP migration</span><span class="tag">Connettori</span><span class="tag">Data integrity</span>
                    </div>
                </div>
                <div class="service-card">
                    <p class="service-number">04</p>
                    <h3 class="service-title">Supporto e Formazione</h3>
                    <p class="service-text">Ti supportiamo anche dopo il go-live con assistenza tecnica e manutenzione evolutiva.</p>
                    <p class="service-text">Formiamo il tuo team per garantire un utilizzo efficace e autonomo della piattaforma.</p>
                    <div class="service-tags">
                        <span class="tag">Help desk</span><span class="tag">Training</span><span class="tag">Aggiornamenti</span>
                    </div>
                </div>
            </div>
        </section>
      
        <div class="kpi-strip">
            <div class="kpi-grid">
                <div class="kpi-item">
                    <div class="kpi-number">10<sup>+</sup></div>
                    <div class="kpi-label">Anni di<br />Esperienza ERP</div>
                </div>
                <div class="kpi-item">
                    <div class="kpi-number">12</div>
                    <div class="kpi-label">Settimane medie<br />al go-live</div>
                </div>
                <div class="kpi-item">
                    <div class="kpi-number">10<sup>+</sup></div>
                    <div class="kpi-label">Settori verticali<br />coperti</div>
                </div>
                <div class="kpi-item">
                    <div class="kpi-number">100<sup>%</sup></div>
                    <div class="kpi-label">Sviluppo<br />interno</div>
                </div>
            </div>
        </div>
      
        <div class="photo-split">
            <div class="photo-split-image">
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=60"
                    alt="Consulenza Sydea" />
            </div>
            <div class="photo-split-content">
                <p class="section-label">Il nostro approccio</p>
                <h2 class="section-title">Dalla strategia<br />al risultato</h2>
                <p class="section-intro">
                    Non ci limitiamo a installare un software: progettiamo soluzioni pensate per durare e crescere insieme al tuo business.
                </p>
                <ul class="approach-list">
                    <li>
                        <span
                            ><strong>Analisi approfondita</strong><br/> prima di ogni scelta tecnica</span
                        >
                    </li>
                    <li>
                        <span
                            ><strong>Metodologia strutturata</strong><br/> con milestone chiare</span
                        >
                    </li>
                    <li>
                        <span><strong>Team dedicato</strong><br/> con competenze funzionali e tecniche</span>
                    </li>
                    <li>
                        <span
                            ><strong>Supporto continuativo</strong><br/> anche dopo il go-live</span
                        >
                    </li>
                </ul>
            </div>
        </div>
        <div class="why-section">
            <div>
                <p class="section-label">Perché Sydea</p>
                <h2 class="section-title">Un partner ERP, non solo un fornitore</h2>
                <p class="section-intro">
                    Affidarsi a Sydea significa lavorare con un team che unisce competenze ERP, capacita di sviluppo e
                    visione strategica per trasformare Odoo in un reale vantaggio competitivo.
                </p>
            </div>
            <div class="why-points">
                <div class="why-point">
                    <span class="why-point-index">01</span>
                    <div>
                        <p class="why-point-title">Competenza certificata</p>
                        <p class="why-point-text">
                            Partner ufficiale Odoo con certificazioni aggiornate e un team formato direttamente dalla
                            casa madre.
                        </p>
                    </div>
                </div>
                <div class="why-point">
                    <span class="why-point-index">02</span>
                    <div>
                        <p class="why-point-title">Approccio consulenziale</p>
                        <p class="why-point-text">
                            Partiamo dai processi, non dal software. Ogni progetto nasce da un’analisi concreta delle esigenze aziendali.
                        </p>
                    </div>
                </div>
                <div class="why-point">
                    <span class="why-point-index">03</span>
                    <div>
                        <p class="why-point-title">Sviluppo interno</p>
                        <p class="why-point-text">
                            Sviluppo gestito interamente dal team Sydea, con controllo su qualità e tempistiche.
                        </p>
                    </div>
                </div>
                <div class="why-point">
                    <span class="why-point-index">04</span>
                    <div>
                        <p class="why-point-title">Relazione di lungo periodo</p>
                        <p class="why-point-text">
                            Supporto continuo ed evoluzione del sistema sono parte integrante del progetto.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <section class="cta-section">
            <p class="cta-label">Inizia il tuo progetto</p>
            <h2 class="cta-title">Parliamo del<br />tuo business</h2>
            <p class="cta-text">
                Raccontaci le tue esigenze: che tu stia valutando Odoo o voglia evolvere il tuo ERP, ti supportiamo con un approccio strutturato e orientato al risultato
            </p>
            <a href='../../../contacts' style='display: inline-block; padding: 0.9rem 2rem; background-color: #fece2f; color: #000; text-decoration: none; border-radius: 3px; font-weight: 600;'>Contattaci </a>
        </section>
    
    `;

    let { area_id } = useParams();
    let { service_id } = useParams();
    let { sub_area } = useParams();
    let { lang } = useParams();

    const { services: {TranslationsService} } = useContext(AppContext);

    const [showLoader, setShowLoader] = useState(false);
    const [listClientStories, setListClientStories] = useState([]);

    const determineTitleAndAnimation = () => {
      let title;
      let animationName;
      let description;
      if (area_id && service_id) {
        if(sub_area){
          title = TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.meta-title`);
          description = TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.meta-description`);
        }
        else {
          title = TranslationsService.labels(`services.${area_id}.items.${service_id}.meta-title`) || TranslationsService.labels(`services.${area_id}.${service_id}.meta-title`);
          description = TranslationsService.labels(`services.${area_id}.items.${service_id}.meta-description`) || TranslationsService.labels(`services.${area_id}.${service_id}.meta-description`);
        }
      } else if (area_id){
        title = TranslationsService.labels(`services.${area_id}.meta-title`);
        description = TranslationsService.labels(`services.${area_id}.meta-description`);
      }
      // if (area_id && service_id) {
      //   // title = `${TranslationsService.labels(`services.${area_id}.title`)} - ${TranslationsService.labels(`services.${area_id}.items.${service_id}.title`)}`;
      //   title = TranslationsService.labels(`services.${area_id}.items.${service_id}.meta-title`);
      //   animationName = area_id;
      // } else if (service_id && sub_area) {
      //   title = TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.title`);
      //   animationName = TranslationsService.labels(`services.${area_id}.items.${sub_area}.${service_id}.animation`);
      // } else if (service_id) {
      //   title = TranslationsService.labels(`services.${area_id}.${service_id}.title`);
      //   animationName = TranslationsService.labels(`services.${area_id}.${service_id}.animation`);
      // } else {
      //   title = TranslationsService.labels(`services.${area_id}.meta-title`);
      //   animationName = area_id;
      // }
      return { title, animationName, description };
    };
  
    const { title, animationName, description } = determineTitleAndAnimation();
  
    // useEffect(() => {
    //   document.title = `${title} | ${TranslationsService.getMainInfoCompany('name')}`;
    // }, [title]);

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
      
      if (!service_id || !TranslationsService.childMenuAvailable('insightsSections.client-stories')) {
        return;
      }
    
      let listStories = TranslationsService.labels(`client_stories_sect`);
    
      const filteredStories = listStories.filter(story => 
        story.bu_service && story.bu_service.includes(service_id)
      );
    
      setListClientStories(filteredStories);
    }, [area_id, service_id, TranslationsService]);    
  
    const getBgPage = () => {
      if(service_id){
        if(!sub_area){
          if(TranslationsService.labels('services')[area_id].items){
            return TranslationsService.labels('services')[area_id].items[service_id].image;
          }
          else {
            return TranslationsService.labels(`services.${area_id}.${service_id}.image`);
          }
        }

        if(sub_area){
          return TranslationsService.labels('services')[area_id].items[sub_area][service_id].image;
        }
      }
      return TranslationsService.labels('services')[area_id].image || 'https://d3t3s6w5yvhc3g.cloudfront.net/images/services/erp/technical-solutions.webp';
    }
    
  return (
    <>
    <SeoHelmet 
      title={title}
      description={description}
    />
    <div className="section-home">
    {/* <div className="section-home light"> */}
      <div className='syd-background-service' style={{backgroundImage: `url(${getBgPage()})`}}></div>
      <div style={{ position: 'relative', zIndex: 2 }}>
      {
        showLoader &&
        <Loader />
      }
      {
        service_id ?
        (
          <header className='p-3 sydea-header-page'>
            {/* <VectorAnimated animationName={animationName} /> */}
            <div className='p-2 w-75'>
              {
                sub_area ?
                (
                  <>
                    <p className='dark-mode-text m-0 breadcrumb-detail'>
                      <Link to={`/${lang}`} className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
                      &nbsp;&#9656;&nbsp;
                      <Link to={`/${lang}/services`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.services.label`)}</Link>
                      &nbsp;&#9656;&nbsp;
                      <Link to={`/${lang}/services/${area_id}`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`services.${area_id}.title`)}</Link>
                      &nbsp;&#9656;&nbsp;
                      <Link to={`/${lang}/services/${area_id}/${sub_area}`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels('services')[area_id].items[sub_area].title}</Link>
                    </p>
                    <h1 className='syd-title light fw-bold sydea-title-xl'>{TranslationsService.labels('services')[area_id].items[sub_area][service_id].title}</h1>
                    <p className='pre-line-w-space dark-mode-text syd-subtitle-article box-sub-service' dangerouslySetInnerHTML={{ __html: TranslationsService.labels('services')[area_id].items[sub_area][service_id].desc }}></p>
                  </>
                )
                :
                (
                  <>
                    <p className='dark-mode-text m-0 breadcrumb-detail'>
                      <Link to={`/${lang}`}  className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
                      &nbsp;&#9656;&nbsp;
                      <Link to={`/${lang}/services`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.services.label`)}</Link>
                      &nbsp;&#9656;&nbsp;
                      <Link to={`/${lang}/services/${area_id}`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`services.${area_id}.title`)}</Link>
                    </p>
                    {
                      area_id && TranslationsService.labels(`services.${area_id}.items`)?
                      (
                        <>
                        <h1 className='syd-title light fw-bold sydea-title-xl'>{TranslationsService.labels(`services.${area_id}.items.${service_id}.title`)}</h1>
                        <p className='pre-line-w-space dark-mode-text syd-subtitle-article box-sub-service' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`services.${area_id}.items.${service_id}.desc`) }}></p>
                        </>
                      )
                      :
                      (
                        <>
                        <h1 className='syd-title light fw-bold sydea-title-xl'>{TranslationsService.labels(`services.${area_id}.${service_id}.title`)}</h1>
                        <p className='pre-line-w-space dark-mode-text syd-subtitle-article box-sub-service' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`services.${area_id}.${service_id}.desc`) }}></p>
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
        <header className='p-3 sydea-header-page'>
          <div>
            <p className='dark-mode-text m-0 breadcrumb-detail'>
              <Link to={`/${lang}`}  className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
              &nbsp;&#9656;&nbsp;
              <Link to={`/${lang}/services`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.services.label`)}</Link>
            </p>
            <h1 className='syd-title light fw-bold sydea-title-xl'>{TranslationsService.labels(`services.${area_id}.title`)}</h1>
            <p className='pre-line-w-space dark-mode-text syd-body-article-p' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`services.${area_id}.desc`) }}></p>
          </div>
        </header>
        )
      }
      
      <div className='container'>
      {
        service_id ?
        (
          <div>
            {
              sub_area ?
              (
                <div className='container'>
                  {/* <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text_test1) }} className='dark-mode-text syd-body-article-p'></div> */}
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(TranslationsService.labels('services')[area_id].items[sub_area][service_id].text) }} className='dark-mode-text syd-body-article-p'></div>
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
                  <div className='container px-md-5'>
                    <div className='row'>
                    {                  
                      TranslationsService.labels('services')[area_id].items[service_id] &&
                      Object.keys(TranslationsService.labels(`services.${area_id}.items.${service_id}`)).map((_subItem, j) => (
                        typeof TranslationsService.labels('services')[area_id].items[service_id][_subItem] === 'object' &&
                        TranslationsService.labels('services')[area_id].items[service_id][_subItem].title &&
                        (
                          <div className='col-md-4 col-sm-12 p-4' key={j}>
                            <div className='syd-card-container'>
                              <div className='image-background' style={{backgroundImage: `url(${TranslationsService.labels(`services.${area_id}.items.${service_id}.${_subItem}.image`)})`}}/>
                              <div className='syd-content-card'>
                                <h2>{TranslationsService.labels('services')[area_id].items[service_id][_subItem].title}</h2>
                                <Link to={`/${lang}/services/${area_id}/${service_id}/${_subItem}`} className='text-deco-none'>
                                  <div className='syd-button-card'>
                                    {TranslationsService.labels('explore_more')}
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        )
                      ))
                    }
                  </div>
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
          <div className='container px-md-5'>
            <div className='row'>
            {
              TranslationsService.labels('services')[area_id].items ?
              (
                Object.keys(TranslationsService.labels('services')[area_id].items).map((_sub, i) => (
                  <div key={i}>
                    <Link to={`/${lang}/services/${area_id}/${_sub}`} className='text-deco-none d-flex gap-3 align-items-center title-area pb-3'>
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
                                  <Link to={`/${lang}/services/${area_id}/${_sub}/${_subItem}`} className='text-deco-none'>
                                    <div className='syd-button-card'>
                                      {TranslationsService.labels('explore_more')}
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
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
                          <Link to={`/${lang}/services/${area_id}/${_sub}`} className='text-deco-none'>
                            <div className='syd-button-card'>
                              {TranslationsService.labels('explore_more')}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                ))
              )
            }
            </div>
          </div>
        )
      }
      </div>

      {
        listClientStories.length > 0 &&
        <div className='p-5'>
          <h3 className='dark-mode-title fw-bold'>
            {TranslationsService.labels('client_stories')}
          </h3>

          <div className='row gap-3 gap-lg-0'>
            {
              listClientStories.map((clientStory, i) => (
              <FlatCard
                key={i}
                colMD={3}
                colSM={12}
                title={clientStory.title}
                link={`/${lang}/insights/client-stories/${clientStory.id}`}
                backgroundColor={clientStory.backgroundColor}
                textColor={clientStory.text_color}
                logo={clientStory.client_logo}
                titleColor={clientStory.title_color}
                buArea={clientStory.bu_area}
                buService={clientStory.bu_service}
              />
                // <div className='col-sm-12 col-lg-3' key={i}>
                //   <Link
                //     to={`/${lang}/insights/client-stories/${clientStory.id}`}
                //     className='text-deco-none tile-client-story'
                //   >
                //     <div
                //       className='syd-box d-flex position-relative p-0 overflow-hidden syd-client-stories-box client-story-tile-img transition-03s-eio'
                //       style={{
                //         backgroundColor: clientStory.backgroundColor,
                //         color: clientStory.text_color,
                //         flexDirection: 'column'
                //       }}
                //     >
                //     <div className='d-flex align-items-center justify-content-center' style={{overflow: 'hidden', flexBasis: '100%', maxWidth:'100%', padding: '2rem'}}>
                //       <img src={clientStory.client_logo} style={{maxWidth: '100%', maxHeight: '100%', width: '90%', height: 'auto', objectFit: 'contain'}}></img>
                //     </div>
                //       <div className='body-stories-sect d-flex flex-column h-100 w-100 p-4 bkg-tile-client-story'>
                //         <h4 style={{ color: clientStory.title_color }}>
                //           {clientStory.title}
                //         </h4>

                //         <div className='d-flex align-items-center gap-2'>
                //           <div
                //             className='bg-main-color'
                //             style={{ height: '0.6rem', width: '0.6rem', borderRadius: 50 }}
                //           />
                //           <p className='m-0 text-uppercase' style={{ fontSize: '0.8rem' }}>
                //             {TranslationsService.labels(`services.${clientStory.bu_area.key}.title`)}

                //             {
                //               clientStory.bu_area.sub_items && (
                //                 <span>
                //                   {' '}– {
                //                     TranslationsService.labels('services')
                //                       ?. [clientStory.bu_area.key]
                //                       ?.items
                //                       ? TranslationsService.labels('services')
                //                           ?. [clientStory.bu_area.key]
                //                           ?.items
                //                           ?. [clientStory.bu_area.sub_items]
                //                           ?.title
                //                       : TranslationsService.labels('services')
                //                           ?. [clientStory.bu_area.key]
                //                           ?. [clientStory.bu_area.sub_items]
                //                           ?.title
                //                   }
                //                 </span>
                //               )
                //             }
                //           </p>
                //         </div>
                //         <br />
                //         {
                //           clientStory.bu_service.map(service => {
                //             const base = TranslationsService.labels('services')?.[clientStory.bu_area.key];

                //             const title = base?.items
                //               ? base?.items?.[clientStory.bu_area.sub_items]?.[service]?.title
                //               : clientStory.bu_area.sub_items
                //                 ? base?.[clientStory.bu_area.sub_items]?.[service]?.title
                //                 : base?.[service]?.title;

                //             return title ? (
                //               <p
                //                 key={service}
                //                 className='m-0 text-uppercase'
                //                 style={{ fontSize: '0.8rem' }}
                //               >
                //                 {title}
                //               </p>
                //             ) : null;
                //           })
                //         }

                //       </div>
                //     </div>
                //   </Link>
                // </div>
              ))
            }
          </div>
        </div>
      }



        {/* {
        listClientStories?.length > 0 &&
        <div className='p-3'>
          <h1 className='dark-mode-title fw-bold'>{TranslationsService.labels('client_stories')}</h1>
          <div className='row gap-3 gap-lg-0'>
          {
          listClientStories.map((_cStory, ind) =>(
            <div className='col-sm-12 col-lg-4' key={ind}>
              <Link to={`/${lang}/insights/client-stories/dropsa`} className='text-deco-none tile-client-story'>
                <div className='syd-box small flat d-flex position-relative cards-cl-sto'>
                  <div className='bg-client-stories' style={{backgroundImage:`url(https://d3t3s6w5yvhc3g.cloudfront.net/images/${_cStory.image})`}}></div>
                  <div className='body-stories-sect d-flex flex-column h-100 w-100'>
                    <h4 className="syd-title light">{_cStory.title}</h4>
                    <p className='syd-paragraph fs-5 pt-2'>{_cStory.description}</p>
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
      } */}
      </div>
    </div>
    </>
  );
};