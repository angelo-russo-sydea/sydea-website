import React, { useState, useContext, useMemo, useEffect } from "react";
import "./admin-labels.scss";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../../services/translationContext";
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { Loader } from "../../components/loader/loader";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const pathUrl = process.env.REACT_APP_BASE_URL;
const appOwner = process.env.REACT_APP_OWNER;
const api = process.env.REACT_APP_URL_API;
const clientId = process.env.REACT_APP_CLIENT_ID;

export const AdminLabels = () => {
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
  const [state, setState] = useState({
    vertical: 'bottom',
    horizontal: 'right',
  });
  const { vertical, horizontal } = state;

  useEffect(()=>{
    if(appOwner === 'indastria'){
      setLangu('it');
    }
  })

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
      setEditedJsonData(JSON.stringify(data, null, 4))
    });
  }, []);

  const setSelLangu = (lngSel) => {
    setLangu(lngSel);
  };

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
      scopes: [`api://${clientId}/User.Read`],
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
            Labels
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
              <Button variant="outlined" startIcon={<SaveIcon />} onClick={saveLabels} style={{color:'#fece2f', borderColor:'#fece2f'}} disabled={showLoader} className="showDesktop">Save</Button>
              <IconButton variant="outlined" style={{color:'#fece2f', borderColor:'#fece2f'}} className="me-3 showMobile" disabled={showLoader} onClick={saveLabels}>
                <SaveIcon/>
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </Box>



      {/* <div className="p-3 d-flex justify-content-between align-items-center toolbar-stick-priv">
        <Link to='/syd-admin' className='btn-dash text-deco-none p-3 text-uppercase transition-03s-eio'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
          <span className='px-1'>Back</span>
        </Link>
        <div className="d-flex gap-5">
          <div className="dropdown w-auto">
            <a className="btn-langue-article syd-black text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center syd-white transition-03s-eio" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              <span className={`fi fi-${TranslationsService.getGlobalValue(`available_language']['${selLangu}']['flag`)}`}></span>
              <span className='syd-black'>{TranslationsService.getGlobalValue(`available_language']['${selLangu}']['name`)}</span>
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
          <button className="syd-button m-0" onClick={saveLabels}>Save</button>
        </div>
      </div> */}
      <div style={{height:'100px'}}></div>
      <div className="p-3">
        <div className="w-100">
            {showData &&
              Object.keys(labelsList[selLangu]).map((topic, i) => (
                typeof(labelsList[selLangu][topic]) === 'object' ?
                (
                  <Accordion key={i}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                      <span className="fw-bold text-uppercase fs-5 syd-yellow">{topic}</span>
                    </AccordionSummary>
                    <AccordionDetails>
                    {
                    typeof(labelsList[selLangu][topic]) === 'object' ?
                    (
                      Object.keys(labelsList[selLangu][topic]).map((area, ind) => (
                        <div className="box-area-lbl my-1 p-1" key={ind}>
                          <p className="fw-bold lbl-area py-1 px-3">{area}</p>
                          {
                            typeof(labelsList[selLangu][topic][area]) === 'object' ?

                          (Object.keys(labelsList[selLangu][topic][area]).map((_item, index) => (
                            <div className={`${typeof(labelsList[selLangu][topic][area][_item]) === 'string' ? 'd-flex':''} align-items-center gap-3 py-3 w-100 box-item`} key={index}>
                              {/* <p className="m-0 fw-bold">{_item}</p> */}
                              {
                                typeof(labelsList[selLangu][topic][area][_item]) === 'string' ?
                                ( 
                                  <TextField
                                    id={`outlined-multiline-static-${index}`}
                                    label={`${_item}`}
                                    placeholder={`${_item}...`}
                                    multiline
                                    value={labelsList[selLangu][topic][area][_item]}
                                    onChange={(e) =>handleChange([topic,area,_item], e)}
                                    className="w-100"
                                  />
                                  // <textarea className="w-75 p-2" value={labelsList[selLangu][topic][area][_item]} onChange={(e) =>handleChange([topic,area,_item], e)} placeholder={`${_item}...`}></textarea>
                                )
                                : (
                                  // <div className="w-100">
                                  // { Object.keys(labelsList[selLangu][topic][area][_item]).map((_sub, indice) => (
                                  //   <div className="d-flex align-items-center gap-3 py-3" key={indice}>
                                  //     <p>{typeof(labelsList[selLangu][topic][area][_item])}</p>
                                  //     <TextField
                                  //       id={`outlined-multiline-static-${indice}`}
                                  //       label={`${_sub}`}
                                  //       placeholder={`${_sub}...`}
                                  //       multiline
                                  //       value={labelsList[selLangu][topic][area][_item][_sub]}
                                  //       onChange={(e) =>handleChange([topic,area,_item,_sub], e)}
                                  //       className="w-100"
                                  //     />
                                  //   </div>
                                  // ))}
                                  // </div>
                                  <div className="w-100">
                                    {Object.keys(labelsList[selLangu][topic][area][_item]).map((_sub, indice) => (
                                      <div className="d-flex align-items-center gap-3 py-3" key={indice}>
                                        {/* Check if the sub-item is an object or a string */}
                                        {typeof labelsList[selLangu][topic][area][_item][_sub] === 'object' ? (
                                          // Additional loop to handle deeper nesting
                                          <div className="w-100">
                                            {Object.keys(labelsList[selLangu][topic][area][_item][_sub]).map((subItem, subIndex) => (
                                              <div className="d-flex align-items-center gap-3 py-3" key={subIndex}>
                                                {typeof labelsList[selLangu][topic][area][_item][_sub][subItem] === 'object' ? (
                                                  // Handle further nested objects
                                                  <div className="w-100">
                                                    {Object.keys(labelsList[selLangu][topic][area][_item][_sub][subItem]).map((deepSubItem, deepSubIndex) => (
                                                      <div className="d-flex align-items-center gap-3 py-3" key={deepSubIndex}>
                                                        <TextField
                                                          id={`outlined-multiline-static-${indice}-${subIndex}-${deepSubIndex}`}
                                                          label={deepSubItem}
                                                          placeholder={`${deepSubItem}...`}
                                                          multiline
                                                          value={labelsList[selLangu][topic][area][_item][_sub][subItem][deepSubItem]}
                                                          onChange={(e) => handleChange([topic, area, _item, _sub, subItem, deepSubItem], e)}
                                                          className="w-100"
                                                        />
                                                      </div>
                                                    ))}
                                                  </div>
                                                ) : (
                                                  <TextField
                                                    id={`outlined-multiline-static-${indice}-${subIndex}`}
                                                    label={subItem}
                                                    placeholder={`${subItem}...`}
                                                    multiline
                                                    value={labelsList[selLangu][topic][area][_item][_sub][subItem]}
                                                    onChange={(e) => handleChange([topic, area, _item, _sub, subItem], e)}
                                                    className="w-100"
                                                  />
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <TextField
                                            id={`outlined-multiline-static-${indice}`}
                                            label={`${_sub}`}
                                            placeholder={`${_sub}...`}
                                            multiline
                                            value={labelsList[selLangu][topic][area][_item][_sub]}
                                            onChange={(e) => handleChange([topic, area, _item, _sub], e)}
                                            className="w-100"
                                          />
                                        )}
                                      </div>
                                    ))}
                                  </div>


                                )
                              }
                            </div>
                          )))
                          :
                          (
                            // <textarea className="w-75 p-2" value={labelsList[selLangu][topic][[area]]} onChange={(e) =>handleChange([topic,area], e)} placeholder={`${area}...`}></textarea>
                            <TextField
                              id={`outlined-multiline-static-${ind}`}
                              label={`${area}`}
                              placeholder={`${area}...`}
                              multiline
                              value={labelsList[selLangu][topic][[area]]} 
                              onChange={(e) =>handleChange([topic,area], e)}
                              className="w-100"
                            />
                          )
                        }
                        </div>
                      ))
                    )
                    :
                    (
                      <div className="p-3">
                        <TextField
                          id="outlined-multiline-static"
                          label={`${topic}`}
                          placeholder={`${topic}...`}
                          multiline
                          value={labelsList[selLangu][topic]}
                          onChange={(e) =>handleChange([topic], e)}
                          className="w-100"
                        />
                        {/* <textarea className="w-75 p-2" value={labelsList[selLangu][topic]} onChange={(e) =>handleChange([topic], e)} placeholder={`${topic}...`}></textarea> */}
                      </div>
                    )
                  }
                    </AccordionDetails>
                {/* <div className="accordion-item my-2" key={i}> */}
                  {/* <h2 className="accordion-header" id={`heading-0${i}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-0${i}`} aria-expanded="true" aria-controls={`#collapse-0${i}`}>
                      <span className="fw-bold text-uppercase fs-5 syd-yellow">{topic}</span>
                    </button>
                  </h2> */}
                  {/* <div className="collapse p-3" id={`collapse-0${i}`}>
                  {
                    typeof(labelsList[selLangu][topic]) === 'object' ?
                    (
                      Object.keys(labelsList[selLangu][topic]).map((area, ind) => (
                        <div className="box-area-lbl my-2 p-3" key={ind}>
                          <p className="fw-bold lbl-area py-1 px-3">{area}</p>
                          {
                            typeof(labelsList[selLangu][topic][area]) === 'object' ?

                          (Object.keys(labelsList[selLangu][topic][area]).map((_item, index) => (
                            <div className={`${typeof(labelsList[selLangu][topic][area][_item]) === 'string' ? 'd-flex':''} align-items-center gap-3 py-3 w-100 box-item`} key={index}>
                              <p className="m-0 fw-bold">{_item}</p>
                              {
                                typeof(labelsList[selLangu][topic][area][_item]) === 'string' ?
                                ( 
                                  <textarea className="w-75 p-2" value={labelsList[selLangu][topic][area][_item]} onChange={(e) =>handleChange([topic,area,_item], e)} placeholder={`${_item}...`}></textarea>
                                )
                                : (
                                  <div className="w-75">
                                { Object.keys(labelsList[selLangu][topic][area][_item]).map((_sub, indice) => (
                                    <div className="d-flex align-items-center gap-3 py-3" key={indice}>
                                      <p>{_sub}</p>
                                      <textarea className="w-75 p-2" value={labelsList[selLangu][topic][area][_item][_sub]} onChange={(e) =>handleChange([topic,area,_item,_sub], e)} placeholder={`${_sub}...`}></textarea>
                                    </div>
                                  ))}
                                  </div>
                                )
                              }
                            </div>
                          )))
                          :
                          (
                            <textarea className="w-75 p-2" value={labelsList[selLangu][topic][[area]]} onChange={(e) =>handleChange([topic,area], e)} placeholder={`${area}...`}></textarea>
                          )
                        }
                        </div>
                      ))
                    )
                    :
                    (
                      <div className="p-3">
                        <textarea className="w-75 p-2" value={labelsList[selLangu][topic]} onChange={(e) =>handleChange([topic], e)} placeholder={`${topic}...`}></textarea>
                      </div>
                    )
                  }
                </div> */}
                {/* </div> */}
                </Accordion>
                )
                :
                (
                  <div className="p-3" key={i}>
                    <TextField
                      id="outlined-multiline-static"
                      label={`${topic}`}
                      placeholder={`${topic}...`}
                      multiline
                      value={labelsList[selLangu][topic]} 
                      onChange={(e) =>handleChange([topic], e)}
                      className="w-100"
                    />
                    {/* <p className="fw-bold">{topic}</p>
                    <textarea className="w-75 p-2" value={labelsList[selLangu][topic]} onChange={(e) =>handleChange([topic], e)} placeholder={`${topic}...`}></textarea> */}
                  </div>
                )
            ))}
          </div>
        {/* <div className="accordion" id="accordionExample">
          {showData &&
            Object.keys(labelsList[selLangu]).map((topic, i) => (
              typeof(labelsList[selLangu][topic]) === 'object' ?
              (
              <div className="accordion-item my-2" key={i}>
                <h2 className="accordion-header" id={`heading-0${i}`}>
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-0${i}`} aria-expanded="true" aria-controls={`#collapse-0${i}`}>
                    <span className="fw-bold text-uppercase fs-5 syd-yellow">{topic}</span>
                  </button>
                </h2>
                <div className="collapse p-3" id={`collapse-0${i}`}>
                {
                  typeof(labelsList[selLangu][topic]) === 'object' ?
                  (
                    Object.keys(labelsList[selLangu][topic]).map((area, ind) => (
                      <div className="box-area-lbl my-2 p-3" key={ind}>
                        <p className="fw-bold lbl-area py-1 px-3">{area}</p>
                        {
                          typeof(labelsList[selLangu][topic][area]) === 'object' ?

                        (Object.keys(labelsList[selLangu][topic][area]).map((_item, index) => (
                          <div className={`${typeof(labelsList[selLangu][topic][area][_item]) === 'string' ? 'd-flex':''} align-items-center gap-3 py-3 w-100 box-item`} key={index}>
                            <p className="m-0 fw-bold">{_item}</p>
                            {
                              typeof(labelsList[selLangu][topic][area][_item]) === 'string' ?
                              ( 
                                <textarea className="w-75 p-2" value={labelsList[selLangu][topic][area][_item]} onChange={(e) =>handleChange([topic,area,_item], e)} placeholder={`${_item}...`}></textarea>
                              )
                              : (
                                <div className="w-75">
                              { Object.keys(labelsList[selLangu][topic][area][_item]).map((_sub, indice) => (
                                  <div className="d-flex align-items-center gap-3 py-3" key={indice}>
                                    <p>{_sub}</p>
                                    <textarea className="w-75 p-2" value={labelsList[selLangu][topic][area][_item][_sub]} onChange={(e) =>handleChange([topic,area,_item,_sub], e)} placeholder={`${_sub}...`}></textarea>
                                  </div>
                                ))}
                                </div>
                              )
                            }
                          </div>
                        )))
                        :
                        (
                          <textarea className="w-75 p-2" value={labelsList[selLangu][topic][[area]]} onChange={(e) =>handleChange([topic,area], e)} placeholder={`${area}...`}></textarea>
                        )
                      }
                      </div>
                    ))
                  )
                  :
                  (
                    <div className="p-3">
                      <textarea className="w-75 p-2" value={labelsList[selLangu][topic]} onChange={(e) =>handleChange([topic], e)} placeholder={`${topic}...`}></textarea>
                    </div>
                  )
                }
              </div>
              </div>
              )
              :
              (
                <div className="p-3" key={i}>
                  <p className="fw-bold">{topic}</p>
                  <textarea className="w-75 p-2" value={labelsList[selLangu][topic]} onChange={(e) =>handleChange([topic], e)} placeholder={`${topic}...`}></textarea>
                </div>
              )
          ))}
        </div> */}
      </div>
      
      <div className="p-3 m-3 box-gl-admin">
        <p className="fw-bold text-uppercase fs-1">General</p>
        {showData &&
          Object.keys(labelsList['_global']).map((glb, indi) => (
            (typeof(labelsList['_global'][glb]) === 'string') ?
            (
              <div key={indi}>
                {/* <p className="fw-bold text-uppercase fs-5 syd-black m-0 pt-3">{glb}</p> */}
                <TextField
                  label={`${glb}`}
                  placeholder={`${glb}...`}
                  multiline
                  value={labelsList['_global'][glb]} 
                  onChange={(e) =>handleChangeGlobalValue([glb], e)}
                  className="w-100 my-2"
                />
                {/* <input className="w-75 p-2" value={labelsList['_global'][glb]} onChange={(e) =>handleChangeGlobalValue([glb], e)} placeholder={`${glb}...`}></input> */}
              </div>
            )
            :
            (
              Array.isArray(labelsList['_global'][glb]) ?
              (
                <div key={indi}>
                  {/* <p className="fw-bold text-uppercase fs-5 syd-black m-0 pt-3">{glb}</p> */}
                  {/* <textarea className="w-75 p-2" value={labelsList['_global'][glb]} onChange={(e) =>handleChangeGlobalValue([glb], e)} placeholder={`${glb}...`}></textarea> */}
                  <TextField
                    label={`${glb}`}
                    placeholder={`${glb}...`}
                    multiline
                    value={labelsList['_global'][glb]} 
                    onChange={(e) =>handleChangeGlobalValue([glb], e)}
                    className="w-100 my-2"
                  />
                </div>
              )
              :
              (
                <div key={indi}>
                  <p className="fw-bold text-uppercase fs-5 syd-black m-0 pt-3">{glb}</p>
                  {
                    Object.keys(labelsList['_global'][glb]).map((_val, _index) => (
                      <div className="box-item-gl p-3 mb-3" key={_index}>
                        <p className="fw-bold lbl-area py-1 px-3">{_val}</p>
                        {
                          Object.keys(labelsList['_global'][glb][_val]).map((_item, _indi) => (
                            <div className="d-flex align-items-center gap-3 my-2" key={_indi}>
                              {/* <p className="m-0">{_item}</p> */}
                              <TextField
                                label={`${_item}`}
                                placeholder={`${_item}...`}
                                multiline
                                value={labelsList['_global'][glb][_val][_item]}
                                onChange={(e) =>handleChangeGlobalValue([glb, _val, _item], e)}
                                className="w-50 my-2"
                              />
                              {/* <input className="w-75 p-2" value={labelsList['_global'][glb][_val][_item]} onChange={(e) =>handleChangeGlobalValue([glb, _val, _item], e)} placeholder={`${glb}...`}></input> */}
                            </div>
                          ))
                        }
                      </div>
                    ))
                  }
                </div>
              )
            )
          ))
        }
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
