import React, { useState, useContext, useMemo, useEffect } from "react";
import "./admin-labels-preview.scss";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../../services/translationContext";
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { Loader } from "../../components/loader/loader";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginIcon from '@mui/icons-material/Login';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const pathUrl = process.env.REACT_APP_BASE_URL;
const api = process.env.REACT_APP_URL_API;
const appOwner = process.env.REACT_APP_OWNER;
const clientId = process.env.REACT_APP_CLIENT_ID;

const infoData =`
{
  "it": {
    "home_page": {
      "carousel": [
        {
          "title": <span>text</span>,
          "image": <span class="link-code">link</span>
          "internal_link": <span class="link-code">application path</span>,
          "external_link": <span class="link-code">link</span>
        },
        ...
      ],
      "services": {
        "text": <span>text</span>,
        "key-service-1": {
          "title": <span>text</span>,
          "text": <span>text</span>
        },
        "key-service-2": {
          "title": <span>text</span>,
          "text": <span>text</span>
        },
        ...
      },
      "slogan": <span class="html-code">text/HTML</span>
    },
    "menu": {
      "services": {
          "label": <span>text</span>
      },
      "products": {
          "label": <span>text</span>
      },
      "industries": {
          "label": <span>text</span>
      },
      "insights": {
          "label": <span>text</span>
      },
      "about": {
          "label": <span>text</span>
      },
      "careers": {
          "label": <span>text</span>
      },
      "contact-us": {
          "label": <span>text</span>
      }
    },
    "services": {
      "key-service-1": {
        "title": <span>text</span>,
        "desc": <span>text</span>,
        "orderMenu": number,
        "key-sub-service-1": {
          "title": <span>text</span>,
          "desc": <span>text</span>,
          "text": <span class="html-code">text/HTML</span>,
          "animation": <span>text</span> // tail, track, lineUp, circles, yoyo, square, labyrinth, doors, positive, sea, mountain, rectangles, cloud, webMobile, perspective, arrow
        },
        ...
      },
      ...
    },
    "industries": {
      "industries-key-1": {
        "hero_image": <span class="link-code">link</span>,
        "title": <span>text</span>,
        "desc": <span>text</span>,
        "text": <span class="html-code">text/HTML</span>,
        "my_company_for": <span class="html-code">text/HTML</span>
      },
      ...
    },
    "careers": {
      "our_work": {
          "title": <span>text</span>,
          "text": <span class="html-code">text/HTML</span>
      },
      "our_values": {
          "title": <span>text</span>,
          "text": <span class="html-code">text/HTML</span>
      },
      "who_are_we_looking_for": {
          "title": <span>text</span>,
          "text": <span class="html-code">text/HTML</span>
      }
    },
    "about_timeline": [
      {
          "year": <span>text</span>,
          "desc": <span class="html-code">text/HTML</span>
      },
      ...
    ],
    "about_kpi": {
      "value1": {
          "value": <span>text</span>,
          "label": <span>text</span>
      },
      ...
    },
    "partners": [
      {
          "name": <span>text</span>,
          "logo": <span class="link-code">link</span>,
          "path": <span class="link-code">link</span>,
          "text": <span class="html-code">text</span>
      },
      ...
    ],
    "certifications": {
      "cert-1": {
          "title": <span>text</span>,
          "logo": <span class="link-code">link</span>,
          "desc": <span class="html-code">text</span>,
          "link_file": <span class="link-code">link</span>
      },
      ...
    },
    "hero_sections": {
      "services": {
          "text": <span>text</span>,
          "img_path": <span class="link-code">link</span>
      },
      ...
    },
    "vision_title": <span>text</span>,
    "vision_text": <span>text</span>,
    "mission_title": <span>text</span>,
    "mission_text": <span>text</span>,
    "client_stories_subtitle": <span>text</span>,
    "the_real_submarine_text": <span class="html-code">text/HTML</span>,
    "our_clients_include": <span>text</span>,
    "what_can_we_help_you_achieve": <span>text</span>,
    "where_will_your_career_yake_you": <span>text</span>,
    "let_get_the_work": <span>text</span>,
    "come_find_out": <span>text</span>,
    "our_partners": <span>text</span>,
    "our_history": <span>text</span>,
    "learn_more": <span>text</span>,
    "locations": <span>text</span>,
    "textSubmitForm": <span>text</span>,
    "formName": <span>text</span>,
    "formSubject": <span>text</span>,
    "formMail": <span>text</span>,
    "formComment": <span>text</span>,
    "buttonSubmitForm": <span>text</span>,
    "allow": <span>text</span>,
    "decline": <span>text</span>
    ...
  },
  "_global": {
      ...
      "clients": [
          {
              "name": <span>text</span>,
              "image": <span class="link-code">link</span>
          }
      ]
  }
`;

export const AdminLabelsPreview = () => {
  const { lang } = useParams();
  const { services: { TranslationsService } } = useContext(AppContext);
  const [selLangu, setLangu] = useState("en");
  const [labelsList, setLabelsList] = useState({});
  const [showData, setShowData] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [page, setPage] = useState(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const slug = "sales_terms";

  const { instance, inProgress, accounts } = useMsal();
  // const [apiData, setApiData] = useState(null);
  let activeAccount;

  if (instance) {
      activeAccount = instance.getActiveAccount();
  }

  const [editedJsonData, setEditedJsonData] = useState({});

  // Funzione per gestire le modifiche del JSON
  const handleJsonEdit = (value, event) => {
  // const handleJsonEdit = (edit) => {
    setEditedJsonData(value);
  };

      const test = {
  "title": "Condizioni di vendita",
  "content": "<div class='body-document'><h1>Condizioni Generali di fornitura</h1><h2>Definizioni</h2><div><p style='margin: 0'><b>Fornitore:</b><br />società che presenta l’offerta, ovvero SYDEA S.r.l. (di seguito definita “Sydea” o “Offerente” o “Fornitore”); </p><p style='margin: 0'><b>Cliente:</b><br />società che riceve l’offerta (di seguito definita “Cliente”); </p><p style='margin: 0'><b>Le Parti:</b><br />Congiuntamente Cliente e Fornitore.</p><p style='margin: 0'><b>Contratto:</b><br />Il documento di offerta comprensivo di tutti i suoi citati allegati, </p><p style='margin: 0'><b>Servizi professionali:</b><br />i servizi che saranno prestati dalla società Offerente alla Società Committente in relazione all’assistenza professionale, come meglio specificato nella presente Offerta. </p><p style='margin: 0'><b>Network SYDEA:</b><br />Aziende nazionali o internazionali controllate da SYDEA o in formale collaborazione con SYDEA, collaboratori o corrispondenti esclusivi di SYDEA. </p></div><br/><h2>Modificazioni dell’Offerta</h2><ol class='articoli'><li>In caso di necessità da parte del Cliente di modificare l’oggetto dell’Offerta, in termini di contesto di progetto o modalità di implementazione, quest’ultimo è tenuto a darne immediata comunicazione scritta a SYDEA che si riserva la possibilità di rivederne la fattibilità, la pianificazione e le condizioni economiche alla luce dei cambiamenti introdotti entro 10 (dieci) giorni lavorativi dalla comunicazione della suddetta. Sarà facoltà di SYDEA qualora non accetti le modifiche, esercitare il proprio diritto di recesso dandone notizia al Cliente entro 10 (dieci) giorni lavorativi dalla comunicazione suddetta, con conseguente applicazione delle norme di cui all’articolo “Diritto di Recesso” delle presenti condizioni generali. Diversamente le modifiche si intendono accettate </li></ol><h2>Sicurezza</h2><ol class='articoli'><li>Posto che le attività oggetto del presente documento potrebbero essere svolte anche all’interno dei luoghi di lavoro del Cliente, le Parti si danno reciprocamente atto che saranno assolti, nel caso, in funzione della specificità dei rischi lavorativi e delle modalità di svolgimento della collaborazione, gli obblighi derivanti dalla vigente legislazione sulla tutela della salute e sicurezza sul lavoro, con particolare riferimento agli adempimenti previsti dal D.lgs. n. 81/2008 e successive modificazioni e integrazioni. </li><li>Nel caso di cui al punto che precede, le Parti adempiranno, in particolare, agli specifici obblighi derivanti dall’art. 26 del predetto D. Lgs., e nello specifico s’impegnano a cooperare nell’attuazione delle misure di prevenzione e protezione dai rischi di lavoro incidenti sull’attività oggetto dell’appalto, oltre che a coordinare i propri interventi di prevenzione e protezione dai rischi in comune a cui sono esposti i lavoratori. In particolare, il fornitore si impegna ad operare senza alterare in alcun modo le caratteristiche ed i livelli di sicurezza e di protezione dei luoghi di lavoro, nonché delle macchine, attrezzature ed impianti presenti nei locali aziendali di cui alle premesse. </li><li>Si precisa che i Servizi afferenti alle presenti condizioni generali includono attività a basso rischio e ad alto contenuto professionale che ricadono nella disciplina prevista dall’art. 26, comma 3 bis, del predetto D. Lgs. 81/2008. </li></ol><h2>Riservatezza</h2><ol class='articoli'><li>In virtù delle caratteristiche dell’attività, SYDEA si impegna per sé e per il personale dipendente e/o collaboratori e/o professionisti di cui la stessa si avvarrà per l’esecuzione dei Servizi riferiti alle presenti condizioni generali, anche dopo che sia stato superato il termine finale per l’esecuzione della fornitura, ai seguenti vincoli comportamentali: (i) assoluto riserbo, in ordine a caratteristiche tecniche ed economiche, aspetti organizzativi e metodi di espletamento dei servizi, nonché ad informazioni aziendali segrete non correlate all’attività d’impresa in senso stretto; (ii) divieto di uso diretto ed indiretto, nell’interesse proprio o altrui, di informazioni aziendali riservate, conosciute dal fornitore per effetto dell’espletamento dell’attività concordata; (iii) divieto di copiare, decompilare, installare presso terze parti, materiale hardware e/o software di proprietà e/o di disponibilità del Cliente, il cui accesso sia stato garantito per le finalità del presente contratto. In particolare, il fornitore si impegna a rispettare i diritti di privativa del Cliente e/o di terze parti, impegnandosi a non rimuovere eventuali disclaimer inerenti il copyright ed eventuali limiti nell’uso di siffatto materiale. </li></ol><h2>Proprietà Intellettuale</h2><ol class='articoli'><li>Il presente documento non attribuisce al fornitore, in merito alle informazioni riservate e confidenziali della Committente e all’utilizzo delle tecnologie connesse, alcun diritto d’uso e sfruttamento commerciale relativo a brevetti o ad altri diritti di proprietà intellettuale. Qualora dall’attività di cui ai Servizi che riferiscono alle presenti condizioni generali, derivino nuove applicazioni e soluzioni brevettabili e non, le Parti convengono che il regime e l’utilizzazione di tali nuovi applicazioni sia di esclusiva titolarità della SYDEA, che concederà una licenza irrevocabile, non esclusiva, valida in tutto il mondo e senza costi aggiuntivi, al fine di usarle, eseguirle, riprodurle, visualizzarle e distribuirle, solo all’interno del gruppo aziendale della Committente. </li></ol><h2>Limitazione di responsabilità</h2><ol class='articoli'><li>La responsabilità complessiva di SYDEA, dei soci, dipendenti, collaboratori, e delle entità appartenenti al network SYDEA nei confronti del Cliente deve intendersi limitata all’importo massimo pari ai corrispettivi indicati nella proposta, salvo in caso di dolo o colpa grave. </li><li>Qualsiasi pretesa – derivante dal presente incarico – che la Committente intenda avanzare, sia per responsabilità contrattuale che extra-contrattuale o per altre forme di responsabilità previste dalla legge, dovrà essere avanzata entro un anno dal momento in cui l’oggetto del contendere sia venuto alla luce, esclusivamente nei confronti di SYDEA, con rinuncia da parte del Cliente ad avanzare pretese contro ogni altra entità del Network SYDEA diversa da SYDEA stessa. </li></ol><h2>Richieste di terze parti</h2><ol class='articoli'><li>Il Cliente si impegna a manlevare e tenere indenne SYDEA, nonché i suoi soci, dipendenti e collaboratori e consulenti ed eventuali corrispondenti italiani od esteri coinvolti nell’incarico, da ogni e qualsiasi perdita, danno e/o costo che gli stessi dovessero subire come conseguenze di richieste o pretese ad essi avanzate da terze parte in relazione all’esecuzione dell’incarico. </li></ol><h2>Modalità di svolgimento dei servizi</h2><ol class='articoli'><li>Il contratto in oggetto costituisce l’intero accordo esistente tra SYDEA e il Cliente in relazione ai Servizi, sostituisce ogni eventuale precedente diverso accordo e può essere modificato o integrato, in tutto o in parte, solo per iscritto. In caso di incongruenze tra quanto scritto nell’offerta e quanto presente negli Allegati, prevarrà il documento di offerta. </li><li>Le attività eventualmente prestate da SYDEA precedentemente alla accettazione dell’offerta da parte del Cliente saranno regolate dalle condizioni dell’Offerta stessa, nessuna esclusa. </li><li>Ai fini dello svolgimento dell’incarico, SYDEA potrà avvalersi anche di propri corrispondenti oltre che di entità del network SYDEA. </li><li>Qualsiasi documento riconducibile a SYDEA, nonché i prodotti o servizi forniti da SYDEA, dovranno essere utilizzati unicamente per gli scopi per cui sono stati predisposti, nella loro interezza e senza alcun tipo di alterazione o modifica e non potranno essere mostrati, riprodotti, copiati o consegnati sia in termini di contenuto sia di referenze a terzi, senza preventiva autorizzazione scritta. </li><li>Il Contratto potrà essere ceduto a terzi con il solo preventivo consenso scritto della parte ceduta, che non sarà irragionevolmente negato. </li></ol><h2>Obbligazioni del Cliente</h2><ol class='articoli'><li>Il cliente avrà la responsabilità della direzione dei lavori intrapresi con l’assistenza di SYDEA nell’ambito della espletazione dei Servizi, compresa quella della supervisione e del controllo degli stessi nonché della individuazione dei propri obiettivi. </li><li>Il cliente di impegna a: (i) Mettere a disposizione di SYDEA, a propria cura e spese, nei tempi e nei modi che verranno comunicati da SYDEA, le proprie risorse umane. Il cliente garantisce che detti soggetti, tra i quali vi dovranno essere pure i titolari di mansioni e capacità a livello dirigenziale, saranno dotati delle conoscenze relative all’organizzazione, ai processi ed ai Sistemi Informativi in uso da parte del Cliente stesso; (ii) predisporre – qualora il lavoro oggetto dell’incarico fosse da espletare presso le sedi del Cliente – a propria cura e spese l’ambiente di lavoro ove SYDEA dovrà operare (locali, macchine e relativo software); (iii) mettere a disposizione di SYDEA, a richiesta e per il tempo da questa reputato necessario, le proprie macchine, nonché ogni documento ed informazione relativi all’azienda (processi, procedure gestionali, et cetera) ed ai sistemi hardware e software in uso, qualora l’esigenza dovesse essere un requisito per l’esecuzione dei servizi; (iv) adottare appropriate misure per la protezione dei dati, particolarmente approntando procedure alternative, salvando i dati, diagnosticando le deficienze ed operando verifiche regolari; (v) notificare a SYDEA qualsivoglia malfunzionamento immediatamente dopo la sua scoperta. </li></ol><h2>Ritardi</h2><ol class='articoli'><li>SYDEA si adopererà secondo diligenza, allo scopo di prestare con tempestività i Servizi e non sarà in alcun caso responsabile per ritardi nei confronti del cliente se non per causa di grave negligenza. In particolare, SYDEA non risponderà per ritardi o impossibilità sopravvenute nella prestazione dei Servizi cagionate dall’inadempimento del Cliente ai propri obblighi, ovvero qualora il Cliente fornisca a SYDEA materiale, elementi, dati o informazioni errate e/o incomplete. </li></ol><h2>Garanzia</h2><ol class='articoli'><li>Per ciascun Servizio SYDEA garantisce che lo eseguirà con ragionevole cura e competenza, nonché in conformità alla descrizione fornita (inclusi i criteri di completamento) nell’Offerta e nelle presenti condizioni generali. Qualora non specificato diversamente nell’offerta, SYDEA fornisce una garanzia di due mesi solari a partire dalla data rilascio in produzione o di messa in funzionamento di quanto realizzato, a copertura di tutto quanto specificato nei documenti di analisi. </li></ol><h2>Diritto di recesso</h2><ol class='articoli'><li>Laddove, nel corso dello svolgimento dei lavori relativi alla presente offerta, alcune attività da intraprendere o eventualmente già intraprese comportino l’insorgere di un conflitto di interesse non altrimenti risolvibile o di una causa di incompatibilità per una qualsiasi entità del gruppo SYDEA, e non fosse possibile limitare l’incarico escludendo tali attività, SYDEA potrà recedere dal presente incarico con un preavviso di 10 giorni, senza nulla dovere al Cliente e senza gravami di sorta a carico di SYDEA o di altre entità del gruppo, fermo restando il diritto al pagamento dei corrispettivi per le attività svolte sino al momento della cessazione dell’incarico. </li></ol><h2>Interessi di mora e risoluzione espressa</h2><ol class='articoli'><li>In caso di mancato rispetto dei termini di pagamento, SYDEA si riserva la facoltà di addebitare interessi moratori, nella misura prevista dal D.lgs. 231/2002 e s.m.. L’ammontare di tali interessi sarà proporzionale al numero di giorni di ritardato pagamento. Fermo restando quanto sopra, eventuali inadempimenti del Cliente ai propri obblighi di pagamento, daranno a SYDEA la facoltà di sospendere i Servizi in corso e/o la facoltà di ritenere il contratto risolto di diritto, qualora il ritardo nei pagamenti sia superiore a 15 (quindici) giorni di calendario, oltre al risarcimento del danno in favore di SYDEA </li></ol><h2>Pubblicità e uso del logo</h2><ol class='articoli'><li>In relazione allo svolgimento delle attività oggetto del presente incarico, il Cliente concede a SYDEA il diritto, non esclusivo e revocabile in qualunque momento da parte del Cliente, di utilizzare logo/loghi, marchio/marchi e/o altri segni distintivi del Cliente (i) all’interno delle proprie presentazioni, relazioni o rapporti indirizzati al Cliente, (ii) nell’ambito di presentazioni o pubblicazioni rivolte esclusivamente al Network SYDEA, inclusa la pubblicazione sul proprio sito intranet, (iii) in presentazioni rivolte a terzi (non escludendo i siti web www.sydea.it o www.sydea.com) esclusivamente per fini di referenze e menzione di incarichi conferiti a SYDEA </li></ol><h2>Non concorrenza e distrazione del personale</h2><ol class='articoli'><li>Ai sensi dell’art. 2125 del codice civile, si stipula il patto di non concorrenza secondo cui il Cliente si impegna – per tutta la durata della fornitura e per due anni successivi al suo completamento/scadenza/risoluzione – a non esercitare distrazione del personale SYDEA, del network SYDEA e corrispondenti attraverso eventuali tentativi di storno del dipendente oppure a non tentare alcuna forma di collaborazione lavorativa, sia essa di lavoro dipendente o meno, senza la preventiva autorizzazione scritta di SYDEA. </li><li>In caso di inadempimento della presente clausola, SYDEA sarà legittimata a richiedere al Cliente risarcimento pari a 2 (due) volte la retribuzione annua lorda del dipendente/collaboratore stornato, fatto salvo il risarcimento del danno di immagine commerciale qualora lo storno comporti lesione della reputazione aziendale di SYDEA o di entità del Network SYDEA. </li><li>per tutto quanto non espressamente previsto trovano applicazione le norme di legge.</li></ol><h2>Domicilio delle parti</h2><ol class='articoli'><li>Ai fini della esecuzione dei Servizi che riferiscono alle presenti condizioni generali, il cliente elegge domicilio nel luogo indicato come sede legale; SYDEA elegge domicilio il luogo indicato come sede legale della Società. </li></ol><h2>Foro competente</h2><ol class='articoli'><li>Il presente Contratto è regolato e disciplinato dalla legge italiana. Per eventuali controversie che dovessero insorgere in relazione alla interpretazione ed esecuzione del presente Contratto, è esclusivamente competente il foro di Bologna. </li></ol></div>"
};

  // function handleEditorChange(value, event) {
  //   console.log('here is the current model value:', value);
  // }

  useEffect(() => {
        setPage(test);
        setHtml(test.content || "");
        setLoading(false);

    // fetch(`/pages/${lang}/${slug}.json?_=${Date.now()}`)
    //   .then((r) => r.json())
    //   .then((data) => {
    //     setPage(data);
    //     setHtml(data.content || "");
    //     setLoading(false);
    //   })
    //   .catch(() => {
    //     alert("Errore caricamento pagina");
    //     setLoading(false);
    //   });
  }, []);

  const savePage = async () => {
    if (!page) return;

    setSaving(true);
    

    const updatedPage = {
      ...page,
      content: html,
      lastUpdate: new Date().toISOString()
    };
    return;

    try {
      await fetch("/api/save-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lang,
          slug,
          data: updatedPage
        })
      });

      alert("Pagina salvata");
      setPage(updatedPage);
    } catch {
      alert("Errore salvataggio");
    }

    setSaving(false);
  };

  useEffect(()=>{
    if(appOwner === 'indastria'){
      setLangu('it');
    }
  })

  const handleCopyClick = () => {
    try {
      const jsonData = JSON.parse(editedJsonData);
      const formattedData = JSON.stringify(jsonData, null, 2);
      navigator.clipboard.writeText(formattedData);
    } catch (error) {}
  };

  useMemo(() => {
    setShowLoader(true);
    const baseUrl = window.location.origin;
    let currentPathUrl = pathUrl;

    if (baseUrl === 'https://www.sydea.com') {
      currentPathUrl = baseUrl;
    }
    fetch(`${currentPathUrl}/static/label.json?_cache_buster=${new Date().getTime()}`).then((response) => response.json()).then((data) => {
      setLabelsList(data);
      setShowData(true);
      setShowLoader(false);
      // try {
      //   return JSON.stringify(JSON.parse(data), null, 4);
      // } catch (e) {
      //   console.error('Errore nella formattazione del JSON:', e);
      //   return json;
      // }
      setEditedJsonData(JSON.stringify(data, null, 4))
    });
  }, []);

  const setSelLangu = (lngSel) => {
    setLangu(lngSel);
  };

  const [state, setState] = useState({
    vertical: 'bottom',
    horizontal: 'right',
  });
  const { vertical, horizontal } = state;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccessToast(false);
  };


  return (
  <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
    {
      showLoader &&
      <Loader />
    }
    <div className="bg-light">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" style={{backgroundColor:'#141414'}}>
          <Toolbar className='justify-content-between'>
          <IconButton variant="outlined" style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showMobile">
            <Link to={`/${lang}/syd-admin`}  className="text-deco-none" style={{color:'#ffffff'}}>
              <ArrowBackIosIcon/>
            </Link>
          </IconButton>
          <Button variant="outlined" startIcon={<ArrowBackIosIcon />} style={{color:'#ffffff', borderColor:'#ffffff'}} className="me-3 showDesktop">
            <Link to={`/${lang}/syd-admin`}  className="text-deco-none" style={{color:'#ffffff'}}>
              <span className='px-1'>Back</span>
            </Link>
          </Button>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="showDesktop">
              Labels JSON
            </Typography>
            <div className='d-flex gap-3 align-items-center'>
              <div className="d-flex gap-5">
                <div className="dropdown w-auto">
                  <a className="btn-langue-article syd-black text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center syd-white transition-03s-eio" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style={{border:'1px solid #ffffff', color:'#ffffff', borderRadius:'5px'}}>
                    <span className={`fi fi-${TranslationsService.getGlobalValue(`available_language']['${selLangu}']['flag`)}`}></span>
                    <span className='syd-black showDesktop'>{TranslationsService.getGlobalValue(`available_language']['${selLangu}']['name`)}</span>
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    {
                      Object.keys(TranslationsService.getGlobalValue('available_language')).map((_langu,i) =>(
                        <li key={i} onClick={() => setSelLangu(_langu)}>
                          <a className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio" href="#">
                            <span className={`fi fi-${TranslationsService.getGlobalValue(`available_language']['${_langu}']['flag`)}`}></span>
                            <span>{TranslationsService.getGlobalValue(`available_language']['${_langu}']['name`)}</span>
                          </a>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                {/* <Button variant="outlined" startIcon={<SaveIcon />} onClick={saveFromJson} style={{color:'#fece2f', borderColor:'#fece2f'}} disabled={showLoader} className="showDesktop">Save</Button>
                <IconButton variant="outlined" style={{color:'#fece2f', borderColor:'#fece2f'}} className="me-3 showMobile" disabled={showLoader} onClick={saveFromJson}>
                  <SaveIcon/>
                </IconButton> */}
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <div style={{height:'100px'}}></div>
      {/* <div className="p-3 d-flex justify-content-between align-items-center toolbar-stick-priv">
        <Link to='/syd-admin' className='btn-dash text-deco-none p-3 text-uppercase transition-03s-eio'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
          <span className='px-1'>Back</span>
        </Link>
        <div className="d-flex gap-5">
          <button className="syd-button m-0" onClick={saveFromJson}>Save</button>
        </div>
      </div> */}

      <div style={{ padding: 20 }}>
      <h2>Editor pagina</h2>

      <input
        style={{
          fontSize: 20,
          padding: 8,
          width: "100%",
          marginBottom: 20
        }}
        value={page?.title || ""}
        onChange={(e) =>
          setPage({ ...(page || {}), title: e.target.value })
        }
      />

      <div style={{ display: "flex", gap: 20 }}>
        {/* Editor */}
        <div style={{ width: "50%" }}>
          <h3>Editor</h3>

          <ReactQuill
            theme="snow"
            value={html}
            onChange={setHtml}
            style={{ height: 400, marginBottom: 40 }}
          />

          <button
            onClick={savePage}
            disabled={saving}
            style={{
              padding: "10px 20px",
              fontSize: 16
            }}
          >
            {saving ? "Salvataggio..." : "Salva"}
          </button>
        </div>

      </div>
    </div>

    </div>

    {/* <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex:'11'}}>
      <div id="liveToast" className={`toast ${showSuccessToast} text-white bg-success`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body fs-5">
            Success!
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    </div> */}
    <Snackbar anchorOrigin={{ vertical, horizontal }} open={showSuccessToast} key={vertical + horizontal}>
      <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
        Data saved successfully!
      </Alert>
    </Snackbar>

    </MsalAuthenticationTemplate>
  );
};
