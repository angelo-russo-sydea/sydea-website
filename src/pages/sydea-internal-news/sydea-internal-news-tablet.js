import React, { useState, useEffect } from 'react';
import "./sydea-internal-news.scss";
import { Link, useParams } from "react-router-dom";
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import SydeaLogoLightNoText from '../../assets/logo/sydea-white-no-text.svg';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const textMonitor = [
  {
    "category": "News",
    "title": "Thanks Marco, good luck!",
    "shortText": "Sydea comunica che quella trascorsa è stata l'ultima di Marco Tugnolo come membro del nostro team di sviluppo.",
    "longText": "<p>Sydea comunica che quella trascorsa è stata l'ultima di <b>Marco Tugnolo</b> come membro del nostro team di sviluppo.</p><p>L\'azienda vuole ringraziare Marco per aver lavorato duramente e con impegno durante tutto il suo trascorso in Sydea e gli augura le migliori fortune professionali per il proseguo della sua carriera di developer.</p><p>Un grande abbraccio Marco, e buona fortuna!</p><p>----------------------------------------------------------------</p><p>Sydea would like to announce that this was <b>Marco Tugnolo</b>\'s last year as a member of our development team.</p><p>The company would like to thank Marco for his hard work and commitment throughout his time at Sydea, and wishes him the best of luck in his professional career as a developer.</p><p>Big hugs Marco, and good luck!</p>",
    "date": "17/07/2023"
  },
  {
    "category": "News",
    "title": "ITIL® 4: Grande traguardo per Cesario Marino! - ITIL® 4: Great achievement for Cesario Marino!",
    "shortText": "Una notizia che ha Sydea accoglie, e comunica, con grande orgoglio!",
    "longText": " <p>Una notizia che ha Sydea accoglie, e comunica, con grande orgoglio!</p><p>In questi giorni, <b>Cesario Marino</b>, dipendente attivo sulla sede di Bologna, ha conseguito un traguardo che ha il dolce sapore del successo.</p><p>Cesario ha infatti superato in maniera eccellente, l'esame per la certificazione <b>ITIL® 4 FOUNDATION</b>, dopo un percorso d'apprendimento importante ed impegnativo.</p><p>Sydea si augura che questo sia solo il primo di tanti successi ed upgrade personali che i propri dipendenti potranno realizzare nel corso della carriera.</p><p>--------------------------------------------------------------------------------------------------------</p><p>News that Sydea welcomes, and communicates, with great pride!</p><p>In the last few days, <b>Cesario Marino</b>, an employee working in the Bologna office, has achieved a goal that has the sweet taste of success.</p><p>Cesario has in fact passed, in an excellent manner, the exam for the <b>ITIL® 4 FOUNDATION</b> certification, after an important and demanding learning path.</p><p>Sydea hopes that this is only the first of many successes and personal upgrades that its employees will be able to achieve throughout their careers.</p><h2>Che cos è ITIL® 4 FOUNDATION?</h2><p>ITIL 4 è senza dubbio il framework più conosciuto e di maggior successo per la gestione di servizi IT. <b>ITIL Foundation (ITIL 4 Foundation Edition)</b> introduce i partecipanti al Service Value System (SVS), che descrive il modo in cui tutti i componenti e le attività dell'organizzazione lavorano insieme come un sistema per facilitare la creazione di valore nella fornitura di servizi (generalmente servizi IT, ma non solo). L’ITIL SVS supporta molti approcci di lavoro, come Agile, DevOps e Lean, oltre al procedimento tradizionale e il project management, con un modello operativo flessibile orientato al valore e infine un modello end-to-end per la creazione, la fornitura ed il miglioramento continuo di prodotti e servizi tecnologici.</p><p>Al livello di conoscenze Foundation, comprenderete come operano le moderne organizzazioni supportate dalle tecnologie digitali, l'importanza di ottimizzare i flussi di valore per aumentare l'efficienza e l'efficacia, l’importanza dell'aspetto culturale e dei principi comportamentali nonché tutta la terminologia utilizzata e necessaria nella gestione dei servizi IT. Il <b>corso ITIL 4 Foundation</b> è erogato da iLEARN online (autoapprendimento), in aula e da remoto.</p><p>--------------------------------------------------------------------------------------------------------</p><h2>What is ITIL® 4 FOUNDATION?</h2><p>ITIL 4 is without doubt the best known and most successful framework for IT service management. <b>ITIL Foundation (ITIL 4 Foundation Edition)</b> introduces participants to the Service Value System (SVS), which describes how all components and activities of the organisation work together as a system to facilitate the creation of value in the delivery of services (generally IT services, but not only). The ITIL SVS supports many working approaches, such as Agile, DevOps and Lean, as well as traditional process and project management, with a flexible value-oriented operating model and ultimately an end-to-end model for the creation, delivery and continuous improvement of technology products and services.</p><p>At the Foundation level of knowledge, you will understand how modern digitally-supported organisations operate, the importance of optimising value streams to increase efficiency and effectiveness, the importance of cultural and behavioural principles as well as all terminology used and needed in IT service management. The <b>ITIL 4 Foundation course</b> is delivered by iLEARN online (self-study), in the classroom and remotely.</p><h2>A cosa serve ITIL® 4 FOUNDATION?</h2><p>A questo livello di conoscenze, ITIL Foundation (ITIL4 Foundation Edition), le risorse sono in grado di interagire in modo efficace e di far parte di team di Service Management seguendo o con l’obiettivo di seguire le best practice in questo ambito. In particolare, saranno in grado di comprendere i concetti, i processi e le pratiche fondamentali e di dare maggiore contributo all'eccellenza dell’organizzazione.</p><p>Tuttavia, il raggiungimento di questa conoscenza è importante non solo per l'organizzazione di appartenenza ma anche per l'individuo. Le certificazioni IT e, tra queste, sicuramente ITIL Foundation, rappresentano un fattore chiave di successo ed un requisito fondamentale per molti datori di lavoro. Questo perché molte ricerche suggeriscono che i dipendenti che possiedono delle certificazioni adeguate al lavoro sono più sicuri, affidabili e competenti; diventano abili nei propri ruoli più rapidamente dopo l'assunzione iniziale e svolgono il proprio lavoro in modo più efficace. Ciò è particolarmente vero per ITIL Foundation nell’ambito dell'IT Service Management.</p><p>--------------------------------------------------------------------------------------------------------</p><h2>What is ITIL® 4 FOUNDATION for?</h2><p>At this level of knowledge, ITIL Foundation (ITIL4 Foundation Edition), resources are able to interact effectively and be part of Service Management teams following or aiming to follow best practices in this area. In particular, they will be able to understand the fundamental concepts, processes and practices and make a greater contribution to organisational excellence.</p><p>However, achieving this knowledge is important not only for the organisation but also for the individual. IT certifications, and certainly ITIL Foundation among them, are a key success factor and a prerequisite for many employers. This is because much research suggests that employees with the right certifications for the job are more confident, trustworthy and competent; they become proficient in their roles more quickly after initial hire and perform their jobs more effectively. This is especially true for ITIL Foundation in the area of IT Service Management.</p>",
    "date": "04/06/2023"
  },
  {
    'category': 'Comunication',
    'title': 'Visita Medica Aziendale',
    'shortText': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore tempor incididunt ut labore labore tempor incididunt ut labore.',
    'longText': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore tempor incididunt ut labore.',
    'date': '04/09/2024'
  },
  
  
  // {'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore', 'author': 'Batman', 'date': '2020-01-01' },
  // {'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod', 'author': 'Thor', 'date': '2020-01-01' },
  // {'text': 'Lorem ipsum ', 'author': 'AAA', 'date': '2020-01-01' },
  // {'text': 'sed do eiusmod', 'author': '', 'date': '2020-01-01' },
  // {'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', 'author': 'Birdman', 'date': '2020-01-01' },
  // {'text': 'Lorem ipsum dolor sit amet, consectetur', 'author': 'Spiderman', 'date': '2020-01-01' }
]

export const SydeaInternalNews = () => {
  const { lang } = useParams();
  const { instance } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = 'Sydea | News & Communications';

  const [showFormNewIdea, setShowFormNewIdea] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [time, setTime] = useState('');

  const handleCancel = () => {
    setSelectedNews(null);
    setShowFormNewIdea(false);
  };

  const showSelectedNews = (news) => {
    setSelectedNews(news);
    setShowFormNewIdea(true);
  }

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // const seconds = String(now.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';

    return `${hours}:${minutes} ${ampm}`;
    // return `${hours}:${minutes}:${seconds} ${ampm}`;
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);
    setTime(getFormattedTime());
    return () => clearInterval(interval);
  }, []);
  
  
  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='section-home rnd-hub-bg position-relative'>

        <img src={require('../../assets/sydea-hub/acquario.png')} className='img-acquario' alt='Decoration hub'></img>
        <img src={require('../../assets/sydea-hub/tubi.png')} className='img-soffitto' alt='Background hub'></img>
        <img src={require('../../assets/sydea-hub/table.png')} className='img-tavolo' alt='Table hub'></img>

        <Link to={`/${lang}/sydea-hub`} className="text-deco-none btn-hub-back" style={{color:'#ffffff'}}>
          <ArrowBackIosIcon/>
          <span>Hub</span>
        </Link>
        
        <div className='container-sydea-hub d-flex flex-column'>
          <svg className="chain m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 70">
            <path d="M50,0 
                    Q45,15 50,30 
                    Q55,45 50,60 
                    Q45,75 50,90 
                    Q55,105 50,120 
                    Q45,135 50,150 
                    Q55,165 50,180 
                    Q45,195 50,210 
                    Q55,225 50,240 
                    Q45,255 50,270 
                    Q55,285 50,300
                    "
                fill="none" stroke="black" strokeWidth="5"/>
            <circle cx="50" cy="0" r="10" fill="black"/>
            <circle cx="50" cy="300" r="10" fill="black"/>
          </svg>
          <div className="neon-sign">News&Communications</div>
        </div>
        
        <div className='proposal-container d-flex align-items-end gap-2'>
          <div className='monitor-container'>
            <div className='monitor-base'></div>
            <div id="monitor">
              <div id="monitorscreen" className={`h-100`}>

                <div className='p-4'>
                  <ul className='list-rnd-hub'>
                  {textMonitor.map((item, index) => (
                    <li key={index} className='px-3 pb-2 row-news-monitor' onClick={() => showSelectedNews(item)}>
                      <p className='m-0 fw-bold text-uppercase fs-5'>{item.title}</p>
                      <p className='m-0 label-font-normal text-desc-news'>{item.shortText}</p>
                      <p className='m-0 label-author my-2'>{(item.date)}</p>
                      <div className='screen-category-box'>
                          <span className='m-0 text-uppercase label-font-normal' style={{color:'#fff'}}>{(item.category)}</span>
                        </div>
                    </li>
                  ))}
                  </ul>
                </div>
              </div>
              <div className='tv-btns d-flex align-items-center justify-content-center'>
                <div className='width-1-3'>
                  <p>News & Communications</p>
                </div>
                <div className='width-1-3 d-flex align-items-center justify-content-center gap-2'>
                  <div className='circle-monitor d-flex align-items-center justify-content-center'>
                    <div className='btn-off-tv'></div>
                  </div>
                    <div className='circle-monitor d-flex align-items-center justify-content-center'>
                      <div className='btn-on-tv'></div>
                    </div>
                    <div className='circle-monitor d-flex align-items-center justify-content-center'>
                      <div className='btn-off-tv'></div>
                    </div>
                </div>
                <div className='width-1-3 d-flex align-items-center justify-content-end pe-2'>
                  <img src={SydeaLogoLightNoText} className='sydea-logo-monitor'></img>
                </div>
              </div>
              <div className="reflection"></div>
            </div>
          </div>
        </div>

        {
          showFormNewIdea &&
          <div className='overlay-tablet' onClick={handleCancel}>
            <div className='tablet d-flex align-items-end justify-content-center'>
              <div className='tablet-screen' onClick={stopPropagation}>
                <div className='tablet-camera d-flex align-items-center justify-content-center'>
                  <div className='internal-camera'>
                    <span></span>
                  </div>
                </div>
                <div className='header-tablet-rnd p-2 d-flex justify-content-between'>
                  {
                    activeAccount && activeAccount.name && (
                        <div className='d-flex gap-3'>
                          <div className='header-user-circle'>
                            <p className='m-0 fw-bold' style={{lineHeight:'normal'}}>{activeAccount.name.split(' ').map(word => word.charAt(0)).join('')}</p>
                          </div>
                          <div>
                            <p className='m-0' style={{fontSize:'1rem', width:'max-content'}}>{activeAccount.name}</p>
                            <p className='m-0' style={{fontSize:'0.6rem', width:'max-content'}}>{activeAccount.username}</p>
                          </div>
                        </div>
                      )
                  }
                  <div className='d-flex gap-3 align-items-center'>
                    <p className='m-0'>{time}</p>
                    <div style={{width:'40px', cursor:'pointer'}} onClick={handleCancel}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                        <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className='p-3'>
                  <div className='screen-category-box dark mb-2'>
                    <span className='m-0 text-uppercase label-font-normal'>{(selectedNews.category)}</span>
                  </div>
                  <h3 className='fs-2 text-uppercase fw-bold'>{selectedNews.title}</h3>
                  <h3 className='fs-6 mb-4'>{selectedNews.date}</h3>
                  <div dangerouslySetInnerHTML={{ __html: selectedNews.longText }}></div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>


    </MsalAuthenticationTemplate>
  );
};

