import { useContext, useMemo, useState } from 'react';
import "./client-stories-detail.scss";
import { Link, useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';

const api = process.env.REACT_APP_URL_API;
const textstring = `
        <p>Nel percorso di evoluzione digitale delle imprese, la gestione efficace dei progetti è un elemento chiave per garantire competitività e capacità di risposta alle esigenze del mercato. </p><p><b>TXT Group</b>, realtà internazionale nel settore della tecnologia e della fornitura di soluzioni software ha promosso l’adozione di uno strumento più intuitivo ed evoluto, integrato con il sistema SAP, per <b>innovare e rendere ancora più efficace la gestione di commesse e progetti complessi</b>. In questo contesto nasce <b>GeCo</b>, la soluzione progettata e realizzata da Sydea. </p><div style='display: flex; margin: 1rem auto;'><img src='https://d3t3s6w5yvhc3g.cloudfront.net/images/client-stories/txt-geco-homepage.png' style='width: 100%; display: flex'></div><h2><b>L’obiettivo: rendere la gestione progetti più semplice e potente </b></h2><p>TXT Group ha scelto di dotarsi di una piattaforma capace di superare i limiti dell’interfaccia <i>SAP ECC</i> e di integrare nuove funzionalità rispetto al sistema originario. Gli obiettivi principali individuati per la nuova soluzione comprendevano: </p><ul><li>Un’interfaccia utente più semplice e interattiva</li><li>Moduli dedicati a planning, staffing e gestione workflow per clienti e fornitori</li><li>Un sistema di approvazioni più articolato</li><li>Una gestione integrata delle quotation (opportunità commerciali)</li></ul><h2><b>La risposta di Sydea: GeCo</b></h2><p>Per rispondere a queste esigenze, Sydea ha sviluppato <b>GeCo</b>, un’interfaccia avanzata <b>completamente integrata con SAP</b>, dotata di <b>moduli personalizzati per la gestione delle commesse</b>. Le sue funzionalità coprono l’intero ciclo di vita del progetto, dalla creazione iniziale alla pianificazione, monitoraggio e approvazione. </p><h2><b>Creazione e gestione delle commesse </b></h2><p>Con GeCo, il Project Manager può <b>creare e gestire progetti in vari stati</b>: dall’<i>opportunity</i> iniziale a progetti interni, PoC, bandi o accordi quadro. La gestione modulare consente un’elevata flessibilità anche per le commesse più articolate. </p><div style='display: flex; margin: 1rem auto;'><img src='https://d3t3s6w5yvhc3g.cloudfront.net/images/client-stories/txt-geco-gestione-commesse.png ' style='width: 100%; display: flex'></div><h3>Budget e pianificazione economica</h3><p>Il sistema consente di <b>pianificare le risorse</b> (persone, ruoli, fornitori), <b>i costi e i ricavi attesi</b>, con possibilità di intervenire dinamicamente anche dopo l’approvazione iniziale. Questo approccio flessibile permette di aggiornare il piano in base all’evoluzione del progetto, mantenendo sempre sotto controllo il budget. </p><h3>Offerte e milestone</h3><p>Ogni progetto è monitorabile anche da un punto di vista commerciale, con milestone di fatturazione, calcolo del WIP e monitoraggio in tempo reale di costi e ricavi effettivi. Tutto questo tramite una dashboard grafica semplice da interpretare. </p><div style='display: flex; margin: 1rem auto;'><img src='https://d3t3s6w5yvhc3g.cloudfront.net/images/client-stories/txt-geco-3.png ' style='width: 100%; display: flex'></div><h3>Un’interfaccia che semplifica e potenzia</h3><p>Uno dei punti di forza di GeCo è la sua interfaccia intuitiva e altamente interattiva, che permette ai Project Manager di intervenire facilmente sulla pianificazione: sostituire risorse, spostare attività, modificare tempistiche senza compromettere la coerenza del piano. </p><p>È possibile assegnare le risorse specificando la percentuale di impegno: ad esempio, un collaboratore può essere pianificato per lavorare su un progetto metà del tempo, per un periodo determinato. Le modifiche sono immediate e l’intero progetto può essere ripianificato con pochi click. </p><p>GeCo consente di gestire anche commesse condivise tra più aziende, applicando automaticamente i markup sulle risorse esterne. Questo rende più trasparente la gestione economica dei progetti, anche in contesti multi-azienda. </p><h2><b>Sfide tecniche e team di progetto </b></h2><p>Il progetto ha rappresentato anche una sfida tecnica: l’interfaccia è stata sviluppata utilizzando le librerie grafiche <b>SAPUI5</b>, fondamentali per garantire piena coerenza con l’ambiente SAP. Inoltre, è stato sviluppato un modulo di planning su misura per la gestione delle commesse, integrato perfettamente con l’ecosistema SAP. </p><p>Un team dedicato di professionisti Sydea ha lavorato alla realizzazione di GeCo, utilizzando tecnologie come ReactJS, SAP, SAPUI5 e SAP ABAP. </p><h2><b>Il risultato: una gestione progetti agile e strategica </b></h2><p>Grazie a GeCo, TXT Group ha uno strumento flessibile, potente e integrato che ha trasformato la gestione delle commesse in un processo più efficace, trasparente e strategico.<br />La combinazione tra un’interfaccia visuale avanzata e una gestione dati accurata consente decisioni rapide e basate su informazioni aggiornate in tempo reale. </p>
`;

export const ClientStoriesDetail = () => {
  let { story_id, lang } = useParams();
  const { services: {TranslationsService} } = useContext(AppContext);
  const [storyInfo, setStoryInfo] = useState([]);

  useMemo(() => {
    setTimeout(() => {
      const story = TranslationsService.labels(`client_stories_sect`).filter(x => x.id === story_id)[0];
      setStoryInfo(story);
      document.title = `${TranslationsService.labels(`client_stories`)} - ${story.title} | ${TranslationsService.getMainInfoCompany('name')}`;
    }, 10);
  }, [TranslationsService, story_id]);

  return (
    <div className="section-home light">
      <section className='hero-story-det syd-hero position-relative p-0' style={{backgroundImage: `url(${storyInfo.image_url})`}}>
        <div className='overlay-area-info w-100 d-flex flex-column justify-content-center'>
          <p className='dark-mode-text m-0 breadcrumb-detail'>
            <Link to={`/${lang}`} className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
            &nbsp;&#9656;&nbsp;
            <Link to={`/${lang}/insights`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.insights.label`)}</Link>
            &nbsp;&#9656;&nbsp;
            <Link to={`/${lang}/insights/client-stories`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`client_stories`)}</Link>
          </p>
          <div className='w-75'>
            <h2 className='syd-title light fw-bold sydea-title-xl'>{storyInfo.title}</h2>
            <p className='dark-mode-text fs-3 m-0'>{storyInfo.desc}</p>
          </div>
        </div>
      </section>

      <div className='syd-article-container'>
        {
          Object.keys(storyInfo).length > 0 && (
            <div className='d-flex flex-wrap p-3'>

              <Link
                to={`/${lang}/services/${storyInfo.bu_area.key}`}
                className='syd-chips transition-03s-eio text-deco-none syd-black breadcrumb-detail'
                style={{ color: '#141414' }}
              >
                <p className='m-0'>
                  {TranslationsService.labels(`services.${storyInfo.bu_area.key}.title`)}

                  {
                    storyInfo.bu_area.sub_items && (
                      <span>
                        {' '}– {
                          (
                            TranslationsService.labels('services')
                              ?. [storyInfo.bu_area.key]
                              ?.items
                              ? TranslationsService.labels('services')
                                  ?. [storyInfo.bu_area.key]
                                  ?.items
                                  ?. [storyInfo.bu_area.sub_items]
                                  ?.title
                              : TranslationsService.labels('services')
                                  ?. [storyInfo.bu_area.key]
                                  ?. [storyInfo.bu_area.sub_items]
                                  ?.title
                          )
                        }
                      </span>
                    )
                  }
                </p>
              </Link>

              {/* SERVICES */}
              {
                storyInfo.bu_service.map(service => {

                  const servicesRoot =
                    TranslationsService.labels('services')?.[storyInfo.bu_area.key];

                  const title =
                    servicesRoot?.items
                      ? servicesRoot?.items
                          ?. [storyInfo.bu_area.sub_items]
                          ?. [service]
                          ?.title
                      : storyInfo.bu_area.sub_items
                        ? servicesRoot
                            ?. [storyInfo.bu_area.sub_items]
                            ?. [service]
                            ?.title
                        : servicesRoot
                            ?. [service]
                            ?.title;

                  if (!title) return null;

                  return (
                    <Link
                      key={service}
                      to={
                        storyInfo.bu_area.sub_items
                          ? `/${lang}/services/${storyInfo.bu_area.key}/${storyInfo.bu_area.sub_items}/${service}`
                          : `/${lang}/services/${storyInfo.bu_area.key}/${service}`
                      }
                      className='syd-chips transition-03s-eio text-deco-none syd-black breadcrumb-detail'
                      style={{ color: '#141414' }}
                    >
                      <p className='m-0 text-end'>{title}</p>
                    </Link>
                  );
                })
              }

            </div>
          )
        }

        <div className='body-text p-3 area-text-cs syd-body-article-p client-story-content'>
          <div dangerouslySetInnerHTML={{ __html: storyInfo.long_text }}></div>
          {/* <div dangerouslySetInnerHTML={{ __html: textstring }}></div> */}
        </div>
      </div>

    </div>
  );
};
