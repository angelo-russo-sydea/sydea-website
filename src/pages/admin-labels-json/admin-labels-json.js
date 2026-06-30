import React, { useState, useContext, useMemo, useEffect } from "react";
import "./admin-labels-json.scss";
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

export const AdminLabelsJson = () => {
  const { lang } = useParams();
  const { services: { TranslationsService } } = useContext(AppContext);
  const [selLangu, setLangu] = useState("en");
  const [labelsList, setLabelsList] = useState({});
  const [showData, setShowData] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

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

  // function handleEditorChange(value, event) {
  //   console.log('here is the current model value:', value);
  // }

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

  const handleChange = (asset, event) => {
    let _tmpLblList = {...labelsList};
    let childitem = '';
    for (let i = 0; i < asset.length; i++) {
     childitem += `['${asset[i]}']`;
    }
    eval(`_tmpLblList['${selLangu}']${childitem} = event.target.value`);
    setLabelsList(_tmpLblList);
  };

  const handleChangeGlobalValue = (asset, event) => {
    let _tmpLblList = {...labelsList};
    let childitem = '';
    for (let i = 0; i < asset.length; i++) {
     childitem += `['${asset[i]}']`;
    }
    if(asset[0] == ['clients']){
      let fullClients = event.target.value.split(',');
      let _arrClients = [];
      for (let i = 0; i < fullClients.length; i++) {
        _arrClients.push(fullClients[i]);
      }
      eval(`_tmpLblList['_global']${childitem} = _arrClients`);
    }
    else if(asset[0] == ['available_language']){
      let childitem = '';
      for (let i = 0; i < asset.length; i++) {
       childitem += `['${asset[i]}']`;
      }
      eval(`_tmpLblList['_global']${childitem} = event.target.value`);
    }
    else{
      eval(`_tmpLblList['_global']${childitem} = event.target.value`);
    }
    setLabelsList(_tmpLblList);
  };

  const saveLabels = () =>{
    setShowLoader(true);
    setShowSuccessToast(false);
    const accessTokenRequest = {
      // scopes: ["user.read"],
      scopes: [`api://${clientId}/User.Read`]
      // account: accounts[0],
    };
    instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
      let accessToken = accessTokenResponse.accessToken;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ "labels": JSON.stringify(labelsList) })
      };
      fetch(`${api}/labels`, requestOptions).then((response) => {
        // setApiData(response);
        setShowSuccessToast(true);
        setShowLoader(false);
      });
    });
  }

  const saveFromJson = () => {
    setShowLoader(true);
    setShowSuccessToast(false);
    let jsonParsed = editedJsonData;
    if(typeof(editedJsonData) === 'string'){
      jsonParsed = JSON.parse(editedJsonData);
    }
    const accessTokenRequest = { scopes: [`api://${clientId}/User.Read`] };
    instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
      let accessToken = accessTokenResponse.accessToken;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ "labels": JSON.stringify(jsonParsed) })
      };
      fetch(`${api}/labels`, requestOptions).then((response) => {
        // setApiData(response);
        setShowSuccessToast(true);
        setShowLoader(false);
      });
    });
  }

  const formatJSON = (json) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 4);
    } catch (e) {
      console.error('Errore nella formattazione del JSON:', e);
      return json;
    }
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
            <Button variant="outlined" startIcon={<SaveIcon />} onClick={saveFromJson} style={{color:'#fece2f', borderColor:'#fece2f'}} disabled={showLoader} className="showDesktop">Save</Button>
            <IconButton variant="outlined" style={{color:'#fece2f', borderColor:'#fece2f'}} className="me-3 showMobile" disabled={showLoader} onClick={saveFromJson}>
              <SaveIcon/>
            </IconButton>
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

      <div className="p-3">
        <div className="py-1 d-flex gap-2">
          <Button onClick={handleCopyClick}>Copy JSON</Button>
        </div>
        {
          Object.keys(editedJsonData).length !== 0 &&
          <Editor
            width="90%"
            height="80vh" 
            theme="vs-dark"
            defaultLanguage="json" 
            defaultValue={editedJsonData}
            // defaultValue={JSON.stringify(editedJsonData)}
            // defaultValue={formatJSON(JSON.stringify(editedJsonData))}
            onChange={handleJsonEdit}
          />
        }
      </div>

      <div className="p-3">
        <p className="fs-2 fw-bold">Template</p>
        <pre className="code code-html">
          <code dangerouslySetInnerHTML={{ __html: infoData }}></code>
        </pre>
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
