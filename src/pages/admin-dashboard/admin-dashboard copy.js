import React, { useState, useContext, useMemo, useEffect, useRef } from "react";
import "./admin-dashboard.scss";
import { Link } from "react-router-dom";
import { AppContext } from "../../services/translationContext";
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { Loader } from "../../components/loader/loader";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import jsonData from "../../assets/mainData.json";
import SydeaLogoLight from '../../assets/logo/sydea_w.svg';

const currentYear = new Date().getFullYear();

const varNameMail = '${name}';
const varBodyMail = '${varBodyMail}';

const ColorPicker = ({ colorProps, textProps }) => {
  return (
    <span className="color-picker-container">
      <input type="color" {...colorProps} />
      <input type="text" {...colorProps} />
    </span>
  );
};

export const AdminDashboardCopy = () => {
  const { services: { TranslationsService } } = useContext(AppContext);
  const [selLangu, setLangu] = useState("en");
  const [labelsList, setLabelsList] = useState({});
  const [showData, setShowData] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState('hide');
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState('company');

  const [selectedFile, setSelectedFile] = useState(null);

  const [globalDataState, setGlobalDataState] = useState(jsonData);

  const { instance, inProgress, accounts } = useMsal();
  let activeAccount;

  if (instance) {
      activeAccount = instance.getActiveAccount();
  }

  useMemo(() => {
    // setShowLoader(true);
    // fetch(`https://www.sydea.it/static/label.json?_cache_buster=${new Date().getTime()}`).then((response) => response.json()).then((data) => {
    //   setLabelsList(data);
    //   setShowData(true);
    //   setShowLoader(false);
    // });
  }, []);

  const onchangeSelectedTab = (selTab) => {
    setSelectedTab(selTab);
  }

  const createColorChangeHandler = (updateFunction) => (e) => {
    const newColor = e.target.value;
    setGlobalDataState((prevState) => ({
      ...prevState,
      style: {
        ...prevState.style,
        brandColors: {
          ...prevState.style.brandColors,
          main: newColor,
        },
      },
    }));
  };

  const createDynamicColorChangeHandler = (sections, colorKey) => (newColor) => {
    setGlobalDataState((prevState) => (
      {...prevState, style: {...prevState.style, [sections]: {...prevState.style[sections], [colorKey]: newColor.target.value}}}
    ));
  };
  
  const handleColorChange = createDynamicColorChangeHandler("brandColors", "main");
  const handleColorChangeSecondary = createDynamicColorChangeHandler("brandColors", "secondary");
  const handleDetailColorChange = createDynamicColorChangeHandler("brandColors", "details");
  
  const handleLightTitleColorChange = createDynamicColorChangeHandler("lightMode", "title");
  const handleLightTextColorChange = createDynamicColorChangeHandler("lightMode", "text");
  const handleLightBgColor = createDynamicColorChangeHandler("lightMode", "background");
  const handleLightButtonBgColorChange = createDynamicColorChangeHandler("lightMode", "btnBackground");
  const handleLightButtonTextColorChange = createDynamicColorChangeHandler("lightMode", "btnText");

  const handleDarkTitleColorChange = createDynamicColorChangeHandler("darkMode", "title");
  const handleDarkTextColorChange = createDynamicColorChangeHandler("darkMode", "text");
  const handleDarkBgColor = createDynamicColorChangeHandler("darkMode", "background");
  const handleDarkButtonBgColorChange = createDynamicColorChangeHandler("darkMode", "btnBackground");
  const handleDarkButtonTextColorChange = createDynamicColorChangeHandler("darkMode", "btnText");
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = () => {
    // console.log('File da caricare:', selectedFile);
    setSelectedFile(null);
  };

  const handleCheckboxMainSectionChange = (key) => {
    setGlobalDataState((prevState) => {
      const newState = { ...prevState, mainSections: { ...prevState.mainSections, [key]: !prevState.mainSections[key] } };
      if (key === 'insights' && !newState.mainSections[key]) {
        setGlobalDataState((prevState) => {
          const newInsightsState = { ...prevState, insightsSections: { ...prevState.insightsSections, ...Object.fromEntries(Object.entries(prevState.insightsSections).map(([_key]) => [_key, false])) } };
          return newInsightsState;
        });
      }
      if (key === 'about' && !newState.mainSections[key]) {
        setGlobalDataState((prevState) => {
          const newAboutState = { ...prevState, aboutSections: { ...prevState.aboutSections, ...Object.fromEntries(Object.entries(prevState.aboutSections).map(([_key]) => [_key, false])) } };
          return newAboutState;
        });
      }
      return newState;
    });
  };
  
  const handleCheckboxInsightsSectionChange = (key) => {
    setGlobalDataState((prevState) => {
      const updatedInsightsSections = { ...prevState.insightsSections, [key]: !prevState.insightsSections[key] };
      const isAnyInsightTrue = Object.values(updatedInsightsSections).some(val => val);
      if (isAnyInsightTrue) {
        setGlobalDataState((prev) => ({ ...prev, mainSections: { ...prev.mainSections, insights: true } }));
      }
      return { ...prevState, insightsSections: updatedInsightsSections };
    });
  };
  
  const handleCheckboxAboutSectionChange = (key) => {
    setGlobalDataState((prevState) => {
      const updatedAboutSections = { ...prevState.aboutSections, [key]: !prevState.aboutSections[key] };
      const isAnyAboutSectionTrue = Object.values(updatedAboutSections).some(val => val);
      if (isAnyAboutSectionTrue) {
        setGlobalDataState((prev) => ({ ...prev, mainSections: { ...prev.mainSections, about: true } }));
      }
      return { ...prevState, aboutSections: updatedAboutSections };
    });
  };

  const editorRef = useRef(null);

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const editorRefCareers = useRef(null);

  const handleFormatCodeHtmlCareers = () => {
    if (editorRefCareers.current) {
      editorRefCareers.current.getAction('editor.action.formatDocument').run();
    }
  };

  const onChangeOffices = (index, key, newValue) => {
    setGlobalDataState((prevState) => {
      const newOffices = [...prevState.offices];
      newOffices[index][key] = newValue;
      return {...prevState, offices: newOffices};
    });
  };

  const onChangeEmployeeMenu = (index, key, newValue) => {
    setGlobalDataState((prevState) => {
      const newEmployeeMenu = [...prevState.employee_menu];
      newEmployeeMenu[index][key] = newValue;
      return {...prevState, employee_menu: newEmployeeMenu};
    });
  };

  const onAddOffice = () => {
    const newOffices = [...globalDataState.offices, { "name": "", "address": "", "phone": "", "mapsLink": "" }];
    setGlobalDataState((prevState) => ({...prevState, offices: newOffices}));
  };

  const onDeleteOffice = (index) => {
    const newOffices = [...globalDataState.offices.slice(0, index), ...globalDataState.offices.slice(index + 1)];
    setGlobalDataState((prevState) => ({...prevState, offices: newOffices}));
  };

  const onAddEmployeeMenu = () => {
    const newEmployeeMenu = [...globalDataState.employee_menu, { "label":"", "link": "" }];
    setGlobalDataState((prevState) => ({...prevState, employee_menu: newEmployeeMenu}));
  };

  const onDeleteEmployeeMenu = (index) => {
    const newEmployeeMenu = [...globalDataState.employee_menu.slice(0, index), ...globalDataState.employee_menu.slice(index + 1)];
    setGlobalDataState((prevState) => ({...prevState, employee_menu: newEmployeeMenu}));
  };

  const handleFooterVisiblePagesChange = (key) => {
    setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, elements: {...prevState.footer.elements, [key]: !prevState.footer.elements[key]}}}));
  };

  const onchangeShowMainContactForm = () => {
    setGlobalDataState((prevState) => ({...prevState, contactForms: {...prevState.contactForms, showContactFormMain: !prevState.contactForms.showContactFormMain}}));
  };

  const onchangeShowContactFormCareers = () => {
      setGlobalDataState((prevState) => ({...prevState, contactForms: {...prevState.contactForms, showContactFormCareers: !prevState.contactForms.showContactFormCareers}}));
    };

  const onchangeFooterShowOffices = () => {
    setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, showOffice: !prevState.footer.showOffice}}));
  };

  const onchangeFooterMultiLanguage= () => {
    setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, multiLanguage: !prevState.footer.multiLanguage}}));
  };

  const onchangeFooterShowEmail = () => {
    setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, email: { ...prevState.footer?.email, show: !prevState.footer?.email?.show}}}));
  };
  
  const onChangeFooterEmail = (e) => {
    setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, email: { ...prevState.footer?.email, mail: e.target.value}}}));
  };
  
  const handleFooterLinkChange = (key, newValue) => {
    setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, socialContacts: {...prevState.footer.socialContacts, [key]: {...prevState.footer.socialContacts[key], link: newValue}}}}));
  };
  
  const handleFooterStatusChange = (key) => {
    setGlobalDataState((prevState) => ({
      ...prevState, footer: {...prevState.footer, socialContacts: {...prevState.footer.socialContacts, [key]: {...prevState.footer.socialContacts[key], status: !prevState.footer.socialContacts[key].status}}}}));
  };
  
  const onChangeFooterText = (e) => {
    setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, text: e.target.value}}));
  };

  const onChangePrivacyPolicyLink = (e) => {
    setGlobalDataState({...globalDataState, privacyPolicyLink: e.target.value});
  };

  const onChangeCookiePolicyLink = (e) => {
    setGlobalDataState({...globalDataState, cookiePolicyLink: e.target.value});
  };

  const onChangeAvailableLangu = (index) => {
    const updatedLanguages = [...globalDataState.available_language];
    updatedLanguages[index].selected = !updatedLanguages[index].selected;

    const selectedLanguagesCount = updatedLanguages.filter(language => language.selected).length;
    const allLanguagesDeselected = selectedLanguagesCount === 0;

    if (!allLanguagesDeselected || selectedLanguagesCount > 1) {
      const languageToChange = updatedLanguages[index];
      const languageToChangeIsDefault = languageToChange.id === globalDataState.default_language;
      if (languageToChangeIsDefault) {
        const selectedLanguages = updatedLanguages.filter(language => language.selected);
        const newDefaultLanguage = selectedLanguages.length > 0 ? selectedLanguages[0].id : "en";
        setGlobalDataState({...globalDataState, default_language: newDefaultLanguage, available_language: updatedLanguages});
      }
      else {
        setGlobalDataState({...globalDataState, available_language: updatedLanguages});
      }
    }
  };

  const handleLanguageChange = (event) => {
    const selectedLanguageId = event.target.value;
    setGlobalDataState({...globalDataState, default_language: selectedLanguageId});
  };

  const saveGlobalData = () => {
    console.log(globalDataState);
  }

  const onChangeInputMainInfo = (e) => {
    const { name, value } = e.target;
    setGlobalDataState((prevState) => ({
      ...prevState,
      mainInfo: {
        ...prevState.mainInfo,
        [name]: value,
      },
    }));
  };

  const onChange = (e) => {
    setGlobalDataState({...globalDataState, mailForm:{template: e}});
  }

  const onChangeHtmlCareers = (e) => {
    setGlobalDataState({...globalDataState, mailFormCareers:{template: e}});
  }

  useEffect(() => {
    setTimeout(() => {
      handleFormatCode();
    }, 500);
  }, []);

  const headerRef = useRef(null);
  const [remainingHeight, setRemainingHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        setRemainingHeight(windowHeight - headerHeight - 10);
      }
    };

    // Calcola l'altezza rimanente all'inizializzazione
    handleResize();

    // Aggiungi un event listener per aggiornare l'altezza rimanente al ridimensionamento della finestra
    window.addEventListener('resize', handleResize);

    // Rimuovi l'event listener al cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
  <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
    {
      showLoader &&
      <Loader />
    }
    
    <div ref={headerRef} className="p-3 d-flex justify-content-between align-items-center toolbar-stick-priv">
      <Link to='/syd-admin' className='btn-dash text-deco-none p-3 text-uppercase transition-03s-eio'>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
      </svg>
      <span className='px-1'>Back</span>
      </Link>
      <button className="syd-button m-0" onClick={saveGlobalData}>Save</button>
    </div>

    {/* const [selectedTab, setSelectedTab] = useState('company'); */}

    <div className="bg-light row container-columns">

        <div className="col-3 side-sx p-3" style={{ height: remainingHeight }}>
          <div className={`py-2 px-3 mb-2 tab-sx-side ${selectedTab === 'company' ? 'selected':''}`} onClick={(e) => onchangeSelectedTab('company')}>
            <span className="fw-bold text-uppercase fs-5 syd-yellow">Company</span>
          </div>
          <div className={`py-2 px-3 mb-2 tab-sx-side ${selectedTab === 'brand' ? 'selected':''}`} onClick={(e) => onchangeSelectedTab('brand')}>
            <span className="fw-bold text-uppercase fs-5 syd-yellow">Brand</span>
          </div>
          <div className={`py-2 px-3 mb-2 tab-sx-side ${selectedTab === 'style' ? 'selected':''}`} onClick={(e) => onchangeSelectedTab('style')}>
            <span className="fw-bold text-uppercase fs-5 syd-yellow">Style</span>
          </div>
          <div className={`py-2 px-3 mb-2 tab-sx-side ${selectedTab === 'sections' ? 'selected':''}`} onClick={(e) => onchangeSelectedTab('sections')}>
            <span className="fw-bold text-uppercase fs-5 syd-yellow">Sections</span>
          </div>
          <div className={`py-2 px-3 mb-2 tab-sx-side ${selectedTab === 'contactform' ? 'selected':''}`} onClick={(e) => onchangeSelectedTab('contactform')}>
            <span className="fw-bold text-uppercase fs-5 syd-yellow">Contact Form</span>
          </div>
          <div className={`py-2 px-3 mb-2 tab-sx-side ${selectedTab === 'language' ? 'selected':''}`} onClick={(e) => onchangeSelectedTab('language')}>
            <span className="fw-bold text-uppercase fs-5 syd-yellow">Language</span>
          </div>
          <div className={`py-2 px-3 mb-2 tab-sx-side ${selectedTab === 'footer' ? 'selected':''}`} onClick={(e) => onchangeSelectedTab('footer')}>
            <span className="fw-bold text-uppercase fs-5 syd-yellow">Footer</span>
          </div>
        </div>
        <div className="col-9 side-dx p-3" style={{ height: remainingHeight }}>
          {
            selectedTab === 'company' &&
            <div className="mx-3">
              <div className="p-3 card-dash-admin">
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <p className="m-0 fw-bold">Name</p>
                    <input type="text" value={globalDataState.mainInfo.name} name="name" onChange={onChangeInputMainInfo} placeholder='Company name...' className="w-100 p-2 input-contact mb-2" />
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <p className="m-0 fw-bold">Address</p>
                    <input type="text" value={globalDataState.mainInfo.address} name="address" onChange={onChangeInputMainInfo} placeholder='Address...' className="w-100 p-2 input-contact  mb-2" />
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <p className="m-0 fw-bold">VAT</p>
                    <input type="text" value={globalDataState.mainInfo.vat} name="vat" onChange={onChangeInputMainInfo} placeholder='VAT...' className="w-100 p-2 input-contact  mb-2" />
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <p className="m-0 fw-bold">Mail</p>
                    <input type="text" value={globalDataState.mainInfo.mail} name="mail" onChange={onChangeInputMainInfo} placeholder='Mail...' className="w-100 p-2 input-contact mb-2" />
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <p className="m-0 fw-bold">Slogan</p>
                    <input type="text" name="slogan" value={globalDataState.mainInfo.slogan} onChange={onChangeInputMainInfo} placeholder='Company slogan...' className="w-100 p-2 input-contact  mb-2" />
                  </div>
                </div>
              </div>
            </div>
          }
          {
            selectedTab === 'brand' &&
            <div className="mx-3">
              <div className="p-3 card-dash-admin">
                <div className="row">
                  <div className="col-12">
                    <p className="fw-bold fs-5">Colors</p>
                    <div className="row">
                      <div className="col-4">
                        <div className="w-100 my-3">
                          <p className="m-0 fw-bold">Main</p>
                          <ColorPicker colorProps={{ onChange: handleColorChange, value: globalDataState.style.brandColors.main }} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="w-100 my-3">
                          <p className="m-0 fw-bold">Secondary</p>
                          <ColorPicker colorProps={{ onChange: handleColorChangeSecondary, value: globalDataState.style.brandColors.secondary }} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="w-100 my-3">
                          <p className="m-0 fw-bold">Details</p>
                          <ColorPicker colorProps={{ onChange: handleDetailColorChange, value: globalDataState.style.brandColors.details }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <p className="fw-bold fs-5">Logo</p>
                    <div className="row">
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Main</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Main dark</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Main light</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Icon</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Icon dark</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Icon light</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {
            selectedTab === 'style' &&
            <div className="mx-3">
              <div className="p-3 w-100 card-dash-admin">
                <p className="fw-bold fs-5">Light</p>
                  <div className="row">
                    <div className="col-sm-12 col-md-7">
                      <div className="row">
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Title</p>
                          <ColorPicker colorProps={{ onChange: handleLightTitleColorChange, value: globalDataState.style.lightMode.title }} />
                        </div>
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Text</p>
                          <ColorPicker colorProps={{ onChange: handleLightTextColorChange, value: globalDataState.style.lightMode.text }} />
                        </div>
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Background</p>
                          <ColorPicker colorProps={{ onChange: handleLightBgColor, value: globalDataState.style.lightMode.background }} />
                        </div>
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Button Background</p>
                          <ColorPicker colorProps={{ onChange: handleLightButtonBgColorChange, value: globalDataState.style.lightMode.btnBackground }} />
                        </div>
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Button text</p>
                          <ColorPicker colorProps={{ onChange: handleLightButtonTextColorChange, value: globalDataState.style.lightMode.btnText }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-5 box-example-card-style p-3">
                      <div className="example-card-style p-3 w-100" style={{backgroundColor: globalDataState.style.lightMode.background}}>
                        <p style={{fontSize:'30px', color: globalDataState.style.lightMode.title}} className="m-0">Lorem Ipsum</p>
                        <p style={{color: globalDataState.style.lightMode.text}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <button className="btn-example" style={{backgroundColor: globalDataState.style.lightMode.btnBackground, color: globalDataState.style.lightMode.btnText}}>Click here</button>
                      </div>
                    </div>
                  </div>

                  <p className="fw-bold fs-5">Dark</p>
                  <div className="row">
                    <div className="col-sm-12 col-md-5 box-example-card-style p-3">
                      <div className="example-card-style p-3 w-100" style={{backgroundColor: globalDataState.style.darkMode.background}}>
                        <p style={{fontSize:'30px', color: globalDataState.style.darkMode.title}} className="m-0">Lorem Ipsum</p>
                        <p style={{color: globalDataState.style.darkMode.text}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <button className="btn-example" style={{backgroundColor: globalDataState.style.darkMode.btnBackground, color: globalDataState.style.darkMode.btnText}}>Click here</button>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-7">
                      <div className="row">
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Title</p>
                          <ColorPicker colorProps={{ onChange: handleDarkTitleColorChange, value: globalDataState.style.darkMode.title }} />
                        </div>
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Text</p>
                          <ColorPicker colorProps={{ onChange: handleDarkTextColorChange, value: globalDataState.style.darkMode.text }} />
                        </div>
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Background</p>
                          <ColorPicker colorProps={{ onChange: handleDarkBgColor, value: globalDataState.style.darkMode.background }} />
                        </div>
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Button Background</p>
                          <ColorPicker colorProps={{ onChange: handleDarkButtonBgColorChange, value: globalDataState.style.darkMode.btnBackground }} />
                        </div>
                        <div className="col-sm-12 col-md-4 my-2">
                          <p className="m-0 fw-bold">Button text</p>
                          <ColorPicker colorProps={{ onChange: handleDarkButtonTextColorChange, value: globalDataState.style.darkMode.btnText }} />
                        </div>
                      </div>
                    </div>

                  </div>
              </div>
            </div>
          }
          {
            selectedTab === 'sections' &&
            <div className="mx-3">
              <div className="row p-3 w-100">
              <div className="col-sm-12 col-md-12 ps-0 card-dash-admin">
                <div className="p-3 w-100">
                  <div className="row">
                    <div className="col-sm-12 col-md-6">
                      <p className="fw-bold fs-5">Available</p>
                      {
                        Object.entries(globalDataState.mainSections).map(([key, value]) => (
                          <div key={key} className="d-flex gap-3 align-items-center my-4">
                            <label className="switch">
                              <input type="checkbox" checked={value} onChange={() => handleCheckboxMainSectionChange(key)}/>
                              <span className="slider"></span>
                            </label>
                            <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
                          </div>
                        )
                      )}
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <p className="fw-bold fs-5">Insights</p>
                      {
                        Object.entries(globalDataState.insightsSections).map(([key, value]) => (
                          <div key={key} className="d-flex gap-3 align-items-center my-4">
                            <label className="switch">
                              <input type="checkbox" checked={value} onChange={() => handleCheckboxInsightsSectionChange(key)}/>
                              <span className="slider"></span>
                            </label>
                            <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
                          </div>
                        )
                      )}
                      <p className="fw-bold fs-5 pt-5">About</p>
                      {
                        Object.entries(globalDataState.aboutSections).map(([key, value]) => (
                          <div key={key} className="d-flex gap-3 align-items-center my-4">
                            <label className="switch">
                              <input type="checkbox" checked={value} onChange={() => handleCheckboxAboutSectionChange(key)}/>
                              <span className="slider"></span>
                            </label>
                            <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 pe-0">
                <div className="p-3 my-3 w-100">
                  <nav id="main-nav" className="navbar-bg transition-03s-eio d-flex align-items-center justify-content-between" style={{transform:'scale(0.6)', transformOrigin:'top left', width:'100vw'}}>
                    <ul id="syd-menu" className='d-flex p-3 align-items-center'>
                      <li>
                        <a>
                            <svg id="Livello_1" viewBox="0 0 758 246" className='logo-nav transition-03s-eio'>
                                <path
                                    className="syd-logo-main-color"
                                    d="m117.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7-.7-.5-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.6-.2-9.2-.7"
                                />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="157.7 233.5 146.9 215.8 152 215.8 159.9 229.8 167.9 215.8 173 215.8 162.1 233.4 162.1 245.5 157.7 245.5 157.7 233.5"
                                />
                                <path
                                    className="syd-logo-main-color"
                                    d="m182.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7s-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.7-.2-9.2-.7"
                                />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="222.3 218.9 212.2 218.9 212.2 215.8 236.9 215.8 236.9 218.9 226.8 218.9 226.8 245.5 222.3 245.5 222.3 218.9"
                                />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="245.9 215.8 265.9 215.8 265.9 218.9 250.3 218.9 250.3 228.6 264.4 228.6 264.4 231.7 250.3 231.7 250.3 242.4 266.3 242.4 266.3 245.5 245.9 245.5 245.9 215.8"
                                />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="275.9 215.8 282.5 215.8 292.1 240.5 292.2 240.6 301.3 215.8 307.7 215.8 307.7 245.5 303.8 245.5 303.8 220.4 303.6 220.4 294 245.5 290 245.5 280.1 220.4 279.9 220.4 279.9 245.5 275.9 245.5 275.9 215.8"
                                />
                                <rect className="syd-logo-main-color" x="340.8" y="215.8" width="4.4" height="29.8" />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="354.4 215.8 359.7 215.8 375.9 240.4 375.9 215.8 379.8 215.8 379.8 245.5 374.4 245.5 358.3 220.5 358.3 245.5 354.4 245.5 354.4 215.8"
                                />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="399 218.9 388.9 218.9 388.9 215.8 413.6 215.8 413.6 218.9 403.5 218.9 403.5 245.5 399 245.5 399 218.9"
                                />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="422.7 215.8 442.7 215.8 442.7 218.9 427.2 218.9 427.2 228.6 441.2 228.6 441.2 231.7 427.2 231.7 427.2 242.4 443.2 242.4 443.2 245.5 422.7 245.5 422.7 215.8"
                                />
                                <path
                                    className="syd-logo-main-color"
                                    d="m462.3,245.8c-1.1-.1-2.2-.4-3.4-.7-1.3-.4-2.5-.8-3.4-1.4s-1.7-1.3-2.2-2.3c-.6-1-.9-2.2-.9-3.5v-14.1c0-1.7.4-3.2,1.3-4.4.9-1.2,2.1-2.1,3.7-2.7,1.5-.5,2.9-.9,4.3-1.1s2.8-.3,4.4-.3c3.8,0,7.2.2,10.3.7v3.4c-1.2-.3-2.8-.5-5-.8-2.2-.2-3.9-.3-5.2-.3-6.3,0-9.4,1.8-9.4,5.4v14c0,1,.3,1.8.9,2.6.6.7,1.4,1.3,2.5,1.6,1,.4,2,.6,2.9.8,1,.1,2.1.2,3.3.2,2,0,4.2-.3,6.6-.8v-10.4h-7v-3.1h11v16c-4,.9-7.6,1.4-11,1.4-1.4,0-2.6-.1-3.7-.2"
                                />
                                <path
                                    className="syd-logo-main-color"
                                    d="m488,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.5v-29.7Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z"
                                />
                                <path
                                    className="syd-logo-main-color"
                                    d="m529.8,215.8h5.1l11.6,29.8h-4.6l-3.4-9h-12.8l-3.4,9h-4.3l11.8-29.8Zm7.6,17.6l-5-13.4h-.4l-5,13.4h10.4Z"
                                />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="561.9 218.9 551.8 218.9 551.8 215.8 576.4 215.8 576.4 218.9 566.4 218.9 566.4 245.5 561.9 245.5 561.9 218.9"
                                />
                                <path
                                    className="syd-logo-main-color"
                                    d="m585.6,237.9v-14.1c0-5.7,4.2-8.5,12.5-8.5s12.6,2.8,12.6,8.5v14.1c0,2.9-1.2,4.9-3.5,6.2-2.3,1.3-5.4,1.9-9.1,1.9-8.4,0-12.5-2.7-12.5-8.1m20.7,0v-14.2c0-3.7-2.8-5.5-8.3-5.5-2.7,0-4.7.4-6.1,1.2-1.4.8-2.1,2.3-2.1,4.3v14.2c0,3.4,2.8,5.1,8.3,5.1s8.2-1.7,8.2-5.1"
                                />
                                <path
                                    className="syd-logo-main-color"
                                    d="m619.8,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.4l-.1-29.7h0Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z"
                                />
                                <path
                                    className="syd-logo-main-color"
                                    d="m443,55.9v75c0,14-2.8,24.8-8.2,32.5-5.5,7.7-14.5,13.1-27,16.2s-29.8,4.7-52,4.7h-87v-67.5l42.8-65.3v101.4h42.2c12.1,0,21.3-.5,27.4-1.6,6.2-1,10.6-3.1,13.4-6.1,2.7-3,4.1-7.8,4.1-14.2V55.2c0-8.7-3.4-14.8-10.4-18.3-6.5-3.3-16.6-5-30.3-5.2h-.8l-69.9.1-47.9,78.3v74.4h-44.3v-73.8l-47.9-79.3c-30.7.1-67.6.4-75.3.4-14.9,0,1.5.1-7.3.1-12,0-20.3,9.8-20.3,15.5v10.3c0,9.6,8.1,14.5,24.4,14.5h37.5c21,0,36.2,3.9,45.7,11.6,9.5,7.8,14.2,19.6,14.2,35.5v12.2c0,22-4.1,35.3-15.9,43.8-10.6,7.6-26,9.1-36.2,9.1-9.3,0-14.1.7-27.5.5-16.2-.1-55.9.3-86.4-.1v-29.5c31.3,0,76.1.1,87.9.1,21.2,0,33.9.7,33.9-19.1v-11.9c0-6-1.8-10.7-5.3-13.9-3.5-3.2-9.8-4.8-18.9-4.8h-36.9C20.3,105.7,0,89.6,0,57.4v-13.6C0,27.7,6.7,15.9,20.2,8.3,33.6.7,34.2.4,63.4.4h65.2l-.1-.1h50.2l38.9,72.1L256.2.3h99.4c6.1,0,11.8.1,17.1.4,13.6.7,25,2.2,34,4.6,12.5,3.3,21.7,9,27.5,17.2,5.8,7.8,8.8,19,8.8,33.4Z"
                                />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="563.4 147.3 563.4 184.2 455.3 184.2 455.3 120.9 492.4 120.9 492.4 147.3 563.4 147.3"
                                />
                                <path
                                    className="syd-logo-main-color"
                                    d="m587.2,120.9l-23.4,63.4h43.7l21.3-63.4h-41.6Zm142.3,0h-43.2l21.2,63.4h44.8l-22.8-63.4ZM685.9,0h-53.9l-33,89.3h40.5l17.6-52.4h1.1l17.6,52.4h42.5L685.9,0Z"
                                />
                                <polygon
                                    className="syd-logo-main-color"
                                    points="563.8 0 563.8 36.9 492.4 36.9 492.4 89.4 455.3 89.4 455.3 0 563.8 0"
                                />
                                <polygon
                                    className="syd-logo-arrow"
                                    points="492.4 120.9 492.4 89.3 563.5 89.4 563.5 48 587.3 120.9 492.4 120.9"
                                />
                                <polygon
                                    className="syd-logo-arrow"
                                    points="758 120.9 628.8 120.9 639.4 89.4 746.6 89.4 758 120.9"
                                />
                            </svg>
                        </a>
                      </li>
                      {
                        Object.entries(globalDataState.mainSections).map(([key, value]) => (
                          value && key !== 'sitemap' && key !== 'contacts' && key !== 'privacy' &&
                          <li key={key}>
                            <a className='d-flex gap-1'>{key}
                              <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 17.12" className={`arrow-icon-nav transition-03s-eio`}><path d="m29.96,2.14c0,.55-.21,1.09-.63,1.51l-12.84,12.84c-.4.4-.94.63-1.51.63s-1.11-.22-1.51-.63L.63,3.65C-.21,2.82-.21,1.47.63.63,1.47-.21,2.82-.21,3.65.63l11.32,11.32L26.3.63c.84-.84,2.19-.84,3.03,0,.42.42.63.96.63,1.51Z"/></svg>
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                    {
                      globalDataState.mainSections.contacts && (
                        <button className="syd-button">Contact us</button>
                      )
                    }
                  </nav>
                </div>
              </div>

              <div className="col-12 p-3 my-3 card-dash-admin w-100">
                <p className="fw-bold fs-4">Employee menu</p>
                <div className="row">
                  {globalDataState.employee_menu.map((item, index) => (
                    <div key={index}  className="col-6 position-relative">
                      <div className="card-dash-admin p-3 mb-3">
                        <div className="row">
                          {Object.entries(item).map(([key, value]) => (
                            <div key={key} className="my-2 col-sm-12 col-md-6">
                            <p className="m-0 fw-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                            <input 
                              type="text"
                              value={value}
                              onChange={(e) => onChangeEmployeeMenu(index, key, e.target.value)}
                              placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
                              className="w-100 p-2 input-contact"
                            />
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="btn-admin-delete-office p-0" onClick={() => onDeleteEmployeeMenu(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <button className="btn-admin-add-office p-0 px-3 gap-1" onClick={onAddEmployeeMenu}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                  </svg>
                  Add item
                </button>
              </div>
              
              <div className="col-12 p-3 my-3 card-dash-admin w-100">
                <p className="fw-bold fs-4">Office</p>

                  <div className="row">
                    {globalDataState.offices.map((office, index) => (
                      <div key={index} className="col-6">
                        <div className="row card-dash-admin m-2 p-3 mb-4 position-relative">
                          <button className="btn-admin-delete-office p-0" onClick={() => onDeleteOffice(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                          </button>
                          {Object.entries(office).map(([key, value]) => (
                            <div key={key} className="my-2 col-sm-12 col-md-6">
                              <p className="m-0 fw-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                              <input 
                                type="text"
                                value={value}
                                onChange={(e) => onChangeOffices(index, key, e.target.value)}
                                placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
                                className="w-100 p-2 input-contact"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <button className="btn-admin-add-office p-0 px-3 gap-1" onClick={onAddOffice}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                      </svg>
                      Add office
                    </button>
                  </div>

              </div>
              </div>
            </div>
          }
          {
            selectedTab === 'contactform' &&
            <div className="row px-3">
              <div className="col-6">
                <div className="card-dash-admin p-3">
                  <p className="fw-bold fs-5">Main Contact Form - Mail Template</p>
                    <div className="d-flex gap-3 align-items-center my-4">
                      <label className="switch">
                        <input type="checkbox" checked={globalDataState.contactForms.showContactFormMain} onChange={() => onchangeShowMainContactForm()}/>
                        <span className="slider"></span>
                      </label>
                      <p className={`text-uppercase fw-bold m-0 ${globalDataState.contactForms.showContactFormMain ? '':'disabled-label'}`}>Visible</p>
                    </div>
                  <p className="fs-6">Variables that can be used in the template:</p>
                  <ul>
                    <li className="pb-3">
                      <code>{varNameMail}</code> recipient's name
                    </li>
                    <li>
                      <code>{varBodyMail}</code> the message written by the user in the contact form
                    </li>
                  </ul>
                  <Editor
                    width="90%"
                    height="60vh" 
                    theme="vs-dark"
                    defaultLanguage="html" 
                    defaultValue={globalDataState.mailForm.template}
                    onMount={(editor, monaco) => {
                      editorRef.current = editor;
                    }}
                    onChange={onChange}
                  />
                  <button onClick={handleFormatCode} className="p-2 text-uppercase my-2 btn-dash-global">Format Code</button>
                </div>
              </div>
              <div className="col-6">
                <div className="card-dash-admin p-3">
                  <p className="fw-bold fs-5">Careers Contact Form - Mail Template</p>
                  <div className="d-flex gap-3 align-items-center my-4">
                      <label className="switch">
                        <input type="checkbox" checked={globalDataState.contactForms.showContactFormCareers} onChange={() => onchangeShowContactFormCareers()}/>
                        <span className="slider"></span>
                      </label>
                      <p className={`text-uppercase fw-bold m-0 ${globalDataState.contactForms.showContactFormCareers ? '':'disabled-label'}`}>Visible</p>
                    </div>
                  <p className="fs-6">Variables that can be used in the template:</p>
                  <ul>
                    <li className="pb-3">
                      <code>{varNameMail}</code> recipient's name
                    </li>
                    <li>
                      <code>{varBodyMail}</code> the message written by the user in the contact form
                    </li>
                  </ul>
                  <Editor
                    width="90%"
                    height="60vh" 
                    theme="vs-dark"
                    defaultLanguage="html" 
                    defaultValue={globalDataState.mailFormCareers.template}
                    onMount={(editor, monaco) => {
                      editorRefCareers.current = editor;
                    }}
                    onChange={onChangeHtmlCareers}
                  />
                  <button onClick={handleFormatCodeHtmlCareers} className="p-2 text-uppercase my-2 btn-dash-global">Format Code</button>
                </div>
              </div>
            </div>
          }
          {
            selectedTab === 'language' &&
            <div className="mx-3">
              <div className="p-3 w-100 card-dash-admin">
                <div className="row">
                {globalDataState.available_language.map((langu, index) => (
                  <div key={index} className="col-sm-12 col-md-3">
                    <label className="my-3 syd-checkbox-label d-flex gap-1 align-items-center">
                      <input className="syd-checkbox" type="checkbox"
                      checked={langu.selected}
                      onChange={() => onChangeAvailableLangu(index)}
                      />
                      <p className={`fs-5 m-0 d-flex gap-3 ${langu.selected ? '':'disabled-label'}`}>{langu.name} <span className={`fi fi-${langu.flag}`}></span></p>
                    </label>
                  </div>
                ))}
                </div>
                <p className="fw-bold fs-5 pt-4">Default language</p>
                <p>{globalDataState.default_language}</p>
                <select name="languages" id="langu-select" className="p-2" onChange={handleLanguageChange}>
                  {
                  globalDataState.available_language.map((language, index) => (
                    language.selected &&
                    <option key={index} value={language.id} selected={language.id === globalDataState.default_language}>
                      {language.name}
                    </option>
                  ))}
                </select>

              </div>
            </div>
          }
          {
            selectedTab === 'footer' &&
            <div className="mx-3">
              <div className="p-3 w-100 card-dash-admin">
                <div className="row">
                <div className="col-sm-12 col-md-6">
                  <div className="d-flex gap-3 align-items-center my-4">
                      <label className="switch">
                        <input type="checkbox" checked={globalDataState.footer.showOffice} onChange={() => onchangeFooterShowOffices()}/>
                        <span className="slider"></span>
                      </label>
                      <p className={`text-uppercase fw-bold m-0 ${globalDataState.footer.showOffice ? '':'disabled-label'}`}>Show office</p>
                    </div>

                    <div className="d-flex gap-3 align-items-center my-4">
                      <label className="switch">
                        <input type="checkbox" checked={globalDataState.footer.multiLanguage} onChange={() => onchangeFooterMultiLanguage()}/>
                        <span className="slider"></span>
                      </label>
                      <p className={`text-uppercase fw-bold m-0 ${globalDataState.footer.multiLanguage ? '':'disabled-label'}`}>Multi languages</p>
                    </div>

                    <p className="fw-bold fs-5 pt-4">Visible pages</p>
                    {
                      Object.entries(globalDataState.footer.elements).map(([key, value]) => (
                        <div key={key} className="d-flex gap-3 align-items-center my-4">
                          <label className="switch">
                            <input type="checkbox" checked={value} onChange={() => handleFooterVisiblePagesChange(key)}/>
                            <span className="slider"></span>
                          </label>
                          <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
                        </div>
                      )
                    )}

                  </div>
                  <div className="col-sm-12 col-md-6 pe-5">
                    <p className="fw-bold fs-5">E-mail</p>
                      <div className="d-flex gap-3 align-items-center pb-5">
                        <input 
                          type="text"
                          value={globalDataState.footer.email.mail}
                          onChange={onChangeFooterEmail}
                          placeholder='E-mail'
                          className="w-100 p-2 input-contact"
                        />
                        <label className="switch">
                          <input type="checkbox" checked={globalDataState.footer.email.show} onChange={() => onchangeFooterShowEmail()}/>
                          <span className="slider"></span>
                        </label>
                      </div>
                    <p className="fw-bold fs-5">Visible contacts</p>
                    {
                      Object.entries(globalDataState.footer['socialContacts']).map(([key, value]) => (
                        <div key={key} className="my-4">
                          <p className="text-uppercase fw-bold m-0">{key}</p>
                          <div className="d-flex gap-3 align-items-center">
                            <input 
                              type="text"
                              value={value.link}
                              onChange={(e) => handleFooterLinkChange(key, e.target.value)}
                              placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
                              className="w-100 p-2 input-contact"
                            />
                            <label className="switch">
                              <input type="checkbox" checked={value.status} onChange={() => handleFooterStatusChange(key)}/>
                              <span className="slider"></span>
                            </label>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="col-12">
                    <p className="fw-bold fs-5">Bottom text</p>
                    <textarea 
                      rows="8" cols="40"
                      value={globalDataState.footer.text}
                      onChange={onChangeFooterText}
                      placeholder='Bottom text...'
                      className="w-100 p-2 input-contact"
                    />
                  </div>
                </div>

                <p className="fw-bold fs-6 pt-4">Privacy policy</p>
                <input 
                  type="text"
                  value={globalDataState.privacyPolicyLink}
                  onChange={onChangePrivacyPolicyLink}
                  placeholder='E-mail'
                  className="w-75 p-2 input-contact"
                />

                <p className="fw-bold fs-6 pt-4">Cookie policy</p>
                <input 
                  type="text"
                  value={globalDataState.cookiePolicyLink}
                  onChange={onChangeCookiePolicyLink}
                  placeholder='E-mail'
                  className="w-75 p-2 input-contact"
                />
                <br/>
                <br/>
                <div className="footer p-3">

                  <div className='p-4 pb-0'>
                    <div className='d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-center'>
                      <img src={SydeaLogoLight} className='footer-logo' alt='Sydea Logo'></img>
                      <div>
                        <div className='d-flex flex-column gap-3'></div>
                        {
                          globalDataState.footer.multiLanguage && 
                          <div className="dropdown mb-3">
                            <span className="btn-language text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center dark-mode-text transition-03s-eio">
                              <span className={`fi fi-gb`}></span>
                              <span>English</span>
                            </span>
                          </div>
                        }
                          {
                            globalDataState.footer.email.show && 
                            <p>{globalDataState.footer.email.mail}</p>
                          }
                        </div>
                    </div>
                    
                    <div className='d-flex flex-column flex-sm-row py-3 justify-content-between'>
                      <ul id='footer-items' className='d-flex flex-column flex-sm-row align-items-start align-items-sm-center m-0 p-0 gap-4'>
                      {
                        Object.entries(globalDataState.footer.elements).map(([key, value]) => (
                          value &&
                          <li key={key}>
                            <div className="text-deco-none transition-03s-eio syd-yellow">
                              <p className="m-0">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                            </div>
                          </li>
                        )
                      )}
                      </ul>
                      <div className='d-flex py-3 gap-3'>
                      {
                        Object.entries(globalDataState.footer['socialContacts']).map(([key, value]) => (
                          (
                            value.status && 
                            <div className='social-link'>
                              <img src={require(`../../assets/social/${key}.png`)} className='logo-social' alt='Linkedin logo'></img>
                            </div>
                          )
                        )
                      )}
                      </div>
                    </div>
                    
                    {
                      globalDataState.footer.showOffice &&
                      <div className='pt-3 d-flex aling-items-center justify-content-center'>
                        {globalDataState.offices.map((office, index) => (
                          <div className="m-0 d-flex justify-content-between">
                            <p key={index}  href={TranslationsService.getGlobalValue('bologna_google_maps')} target='_blank' rel="noreferrer" className="text-deco-none transition-03s-eio ref-offices-footer">
                              {office.name}
                            </p>
                            {
                              globalDataState.offices.length > (index + 1) && 
                              <span className="px-2">|</span>
                            }
                          </div>
                        ))}
                      </div>
                    }
                    
                    <div className='pt-3'>
                      <p className='syd-paragraph text-center m-0'>© {currentYear} {globalDataState.footer.text}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          }
      </div>
    </div>

    {/* <div className="bg-light p-3">
      <div className="accordion" id="accordionExample">

        <div className="accordion-item my-2" key='company'>
          <h2 className="accordion-header" id={`heading-company`}>
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-company`} aria-expanded="true" aria-controls={`#collapse-company`}>
              <span className="fw-bold text-uppercase fs-5 syd-yellow">Company</span>
            </button>
          </h2>
          <div className="collapse p-3" id={`collapse-company`}>
            <div className="p-3">
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <p className="m-0 fw-bold">Name</p>
                  <input 
                    type="text"
                    value={globalDataState.mainInfo.name}
                    name="name"
                    onChange={onChangeInputMainInfo}
                    placeholder='Company name...'
                    className="w-100 p-2 input-contact mb-2"
                  />
                </div>
                <div className="col-sm-12 col-md-6">
                  <p className="m-0 fw-bold">Address</p>
                  <input 
                    type="text"
                    value={globalDataState.mainInfo.address}
                    name="address"
                    onChange={onChangeInputMainInfo}
                    placeholder='Address...'
                    className="w-100 p-2 input-contact  mb-2"
                  />
                </div>
                <div className="col-sm-12 col-md-6">
                  <p className="m-0 fw-bold">VAT</p>
                  <input 
                    type="text"
                    value={globalDataState.mainInfo.vat}
                    name="vat"
                    onChange={onChangeInputMainInfo}
                    placeholder='VAT...'
                    className="w-100 p-2 input-contact  mb-2"
                  />
                </div>
                <div className="col-sm-12 col-md-6">
                  <p className="m-0 fw-bold">Mail</p>
                  <input 
                    type="text"
                    value={globalDataState.mainInfo.mail}
                    name="mail"
                    onChange={onChangeInputMainInfo}
                    placeholder='Mail...'
                    className="w-100 p-2 input-contact mb-2"
                  />
                </div>
                <div className="col-sm-12 col-md-6">
                  <p className="m-0 fw-bold">Slogan</p>
                  <input 
                    type="text"
                    name="slogan"
                    value={globalDataState.mainInfo.slogan}
                    onChange={onChangeInputMainInfo}
                    placeholder='Company slogan...'
                    className="w-100 p-2 input-contact  mb-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion-item my-2" key='brand'>
          <h2 className="accordion-header" id={`heading-brand`}>
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-brand`} aria-expanded="true" aria-controls={`#collapse-brand`}>
              <span className="fw-bold text-uppercase fs-5 syd-yellow">Brand</span>
            </button>
          </h2>
          <div className="collapse p-3" id={`collapse-brand`}>
            <div className="p-3">
              <div className="row">
                  <div className="col-sm-12 col-md-8">
                    <p className="fw-bold fs-5">Logo</p>
                    <div className="row">
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Main</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Main dark</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Main light</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Icon</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Icon dark</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Icon light</p>
                        <div className="file-upload-container d-grid p-2">
                          <input type="file" onChange={handleFileChange} className="file-input" />
                          <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
                            Carica
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4">
                    <p className="fw-bold fs-5 text-end">Colors</p>
                    <div className="w-100 text-end my-3">
                      <p className="m-0 fw-bold">Main</p>
                      <ColorPicker colorProps={{ onChange: handleColorChange, value: globalDataState.style.brandColors.main }} />
                    </div>
                    <div className="w-100 text-end my-3">
                      <p className="m-0 fw-bold">Secondary</p>
                      <ColorPicker colorProps={{ onChange: handleColorChangeSecondary, value: globalDataState.style.brandColors.secondary }} />
                    </div>
                    <div className="w-100 text-end my-3">
                      <p className="m-0 fw-bold">Details</p>
                      <ColorPicker colorProps={{ onChange: handleDetailColorChange, value: globalDataState.style.brandColors.details }} />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div className="accordion-item my-2" key='style'>
          <h2 className="accordion-header" id={`heading-style`}>
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-style`} aria-expanded="true" aria-controls={`#collapse-style`}>
              <span className="fw-bold text-uppercase fs-5 syd-yellow">Style</span>
            </button>
          </h2>
          <div className="collapse p-3" id={`collapse-style`}>
            <div className="p-3 w-100">
              <p className="fw-bold fs-5">Light</p>
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="row">
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Title</p>
                        <ColorPicker colorProps={{ onChange: handleLightTitleColorChange, value: globalDataState.style.lightMode.title }} />
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Text</p>
                        <ColorPicker colorProps={{ onChange: handleLightTextColorChange, value: globalDataState.style.lightMode.text }} />
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Background</p>
                        <ColorPicker colorProps={{ onChange: handleLightBgColor, value: globalDataState.style.lightMode.background }} />
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Button Background</p>
                        <ColorPicker colorProps={{ onChange: handleLightButtonBgColorChange, value: globalDataState.style.lightMode.btnBackground }} />
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Button text</p>
                        <ColorPicker colorProps={{ onChange: handleLightButtonTextColorChange, value: globalDataState.style.lightMode.btnText }} />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 box-example-card-style p-3">
                    <div className="example-card-style p-3 w-100" style={{backgroundColor: globalDataState.style.lightMode.background}}>
                      <p style={{fontSize:'30px', color: globalDataState.style.lightMode.title}} className="m-0">Lorem Ipsum</p>
                      <p style={{color: globalDataState.style.lightMode.text}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <button className="btn-example" style={{backgroundColor: globalDataState.style.lightMode.btnBackground, color: globalDataState.style.lightMode.btnText}}>Click here</button>
                    </div>
                  </div>
                </div>

                <p className="fw-bold fs-5">Dark</p>
                <div className="row">
                  <div className="col-sm-12 col-md-6 box-example-card-style p-3">
                    <div className="example-card-style p-3 w-100" style={{backgroundColor: globalDataState.style.darkMode.background}}>
                      <p style={{fontSize:'30px', color: globalDataState.style.darkMode.title}} className="m-0">Lorem Ipsum</p>
                      <p style={{color: globalDataState.style.darkMode.text}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <button className="btn-example" style={{backgroundColor: globalDataState.style.darkMode.btnBackground, color: globalDataState.style.darkMode.btnText}}>Click here</button>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <div className="row">
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Title</p>
                        <ColorPicker colorProps={{ onChange: handleDarkTitleColorChange, value: globalDataState.style.darkMode.title }} />
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Text</p>
                        <ColorPicker colorProps={{ onChange: handleDarkTextColorChange, value: globalDataState.style.darkMode.text }} />
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Background</p>
                        <ColorPicker colorProps={{ onChange: handleDarkBgColor, value: globalDataState.style.darkMode.background }} />
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Button Background</p>
                        <ColorPicker colorProps={{ onChange: handleDarkButtonBgColorChange, value: globalDataState.style.darkMode.btnBackground }} />
                      </div>
                      <div className="col-sm-12 col-md-4 my-2">
                        <p className="m-0 fw-bold">Button text</p>
                        <ColorPicker colorProps={{ onChange: handleDarkButtonTextColorChange, value: globalDataState.style.darkMode.btnText }} />
                      </div>
                    </div>
                  </div>

                </div>
            </div>
          </div>
        </div>

        <div className="accordion-item my-2" key='sections'>
          <h2 className="accordion-header" id={`heading-sections`}>
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-sections`} aria-expanded="true" aria-controls={`#collapse-sections`}>
              <span className="fw-bold text-uppercase fs-5 syd-yellow">Sections</span>
            </button>
          </h2>
          <div className="collapse p-3" id={`collapse-sections`}>
          <div className="row p-3 my-3">
            <div className="col-sm-12 col-md-5 ps-0">
              <div className="p-3 w-100">
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <p className="fw-bold fs-5">Available</p>
                    {
                      Object.entries(globalDataState.mainSections).map(([key, value]) => (
                        <div key={key} className="d-flex gap-3 align-items-center my-4">
                          <label className="switch">
                            <input type="checkbox" checked={value} onChange={() => handleCheckboxMainSectionChange(key)}/>
                            <span className="slider"></span>
                          </label>
                          <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
                        </div>
                      )
                    )}
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <p className="fw-bold fs-5">Insights</p>
                    {
                      Object.entries(globalDataState.insightsSections).map(([key, value]) => (
                        <div key={key} className="d-flex gap-3 align-items-center my-4">
                          <label className="switch">
                            <input type="checkbox" checked={value} onChange={() => handleCheckboxInsightsSectionChange(key)}/>
                            <span className="slider"></span>
                          </label>
                          <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
                        </div>
                      )
                    )}
                    <p className="fw-bold fs-5 pt-5">About</p>
                    {
                      Object.entries(globalDataState.aboutSections).map(([key, value]) => (
                        <div key={key} className="d-flex gap-3 align-items-center my-4">
                          <label className="switch">
                            <input type="checkbox" checked={value} onChange={() => handleCheckboxAboutSectionChange(key)}/>
                            <span className="slider"></span>
                          </label>
                          <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-7 pe-0">
              <div className="p-3 my-3 card-dash-admin w-100">
                <nav id="main-nav" className="navbar-bg transition-03s-eio d-flex align-items-center justify-content-between" style={{transform:'scale(0.5)', transformOrigin:'top left', width:'100vw'}}>
                  <ul id="syd-menu" className='d-flex p-3 align-items-center'>
                    <li>
                      <a>
                          <svg id="Livello_1" viewBox="0 0 758 246" className='logo-nav transition-03s-eio'>
                              <path
                                  className="syd-logo-main-color"
                                  d="m117.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7-.7-.5-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.6-.2-9.2-.7"
                              />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="157.7 233.5 146.9 215.8 152 215.8 159.9 229.8 167.9 215.8 173 215.8 162.1 233.4 162.1 245.5 157.7 245.5 157.7 233.5"
                              />
                              <path
                                  className="syd-logo-main-color"
                                  d="m182.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7s-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.7-.2-9.2-.7"
                              />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="222.3 218.9 212.2 218.9 212.2 215.8 236.9 215.8 236.9 218.9 226.8 218.9 226.8 245.5 222.3 245.5 222.3 218.9"
                              />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="245.9 215.8 265.9 215.8 265.9 218.9 250.3 218.9 250.3 228.6 264.4 228.6 264.4 231.7 250.3 231.7 250.3 242.4 266.3 242.4 266.3 245.5 245.9 245.5 245.9 215.8"
                              />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="275.9 215.8 282.5 215.8 292.1 240.5 292.2 240.6 301.3 215.8 307.7 215.8 307.7 245.5 303.8 245.5 303.8 220.4 303.6 220.4 294 245.5 290 245.5 280.1 220.4 279.9 220.4 279.9 245.5 275.9 245.5 275.9 215.8"
                              />
                              <rect className="syd-logo-main-color" x="340.8" y="215.8" width="4.4" height="29.8" />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="354.4 215.8 359.7 215.8 375.9 240.4 375.9 215.8 379.8 215.8 379.8 245.5 374.4 245.5 358.3 220.5 358.3 245.5 354.4 245.5 354.4 215.8"
                              />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="399 218.9 388.9 218.9 388.9 215.8 413.6 215.8 413.6 218.9 403.5 218.9 403.5 245.5 399 245.5 399 218.9"
                              />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="422.7 215.8 442.7 215.8 442.7 218.9 427.2 218.9 427.2 228.6 441.2 228.6 441.2 231.7 427.2 231.7 427.2 242.4 443.2 242.4 443.2 245.5 422.7 245.5 422.7 215.8"
                              />
                              <path
                                  className="syd-logo-main-color"
                                  d="m462.3,245.8c-1.1-.1-2.2-.4-3.4-.7-1.3-.4-2.5-.8-3.4-1.4s-1.7-1.3-2.2-2.3c-.6-1-.9-2.2-.9-3.5v-14.1c0-1.7.4-3.2,1.3-4.4.9-1.2,2.1-2.1,3.7-2.7,1.5-.5,2.9-.9,4.3-1.1s2.8-.3,4.4-.3c3.8,0,7.2.2,10.3.7v3.4c-1.2-.3-2.8-.5-5-.8-2.2-.2-3.9-.3-5.2-.3-6.3,0-9.4,1.8-9.4,5.4v14c0,1,.3,1.8.9,2.6.6.7,1.4,1.3,2.5,1.6,1,.4,2,.6,2.9.8,1,.1,2.1.2,3.3.2,2,0,4.2-.3,6.6-.8v-10.4h-7v-3.1h11v16c-4,.9-7.6,1.4-11,1.4-1.4,0-2.6-.1-3.7-.2"
                              />
                              <path
                                  className="syd-logo-main-color"
                                  d="m488,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.5v-29.7Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z"
                              />
                              <path
                                  className="syd-logo-main-color"
                                  d="m529.8,215.8h5.1l11.6,29.8h-4.6l-3.4-9h-12.8l-3.4,9h-4.3l11.8-29.8Zm7.6,17.6l-5-13.4h-.4l-5,13.4h10.4Z"
                              />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="561.9 218.9 551.8 218.9 551.8 215.8 576.4 215.8 576.4 218.9 566.4 218.9 566.4 245.5 561.9 245.5 561.9 218.9"
                              />
                              <path
                                  className="syd-logo-main-color"
                                  d="m585.6,237.9v-14.1c0-5.7,4.2-8.5,12.5-8.5s12.6,2.8,12.6,8.5v14.1c0,2.9-1.2,4.9-3.5,6.2-2.3,1.3-5.4,1.9-9.1,1.9-8.4,0-12.5-2.7-12.5-8.1m20.7,0v-14.2c0-3.7-2.8-5.5-8.3-5.5-2.7,0-4.7.4-6.1,1.2-1.4.8-2.1,2.3-2.1,4.3v14.2c0,3.4,2.8,5.1,8.3,5.1s8.2-1.7,8.2-5.1"
                              />
                              <path
                                  className="syd-logo-main-color"
                                  d="m619.8,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.4l-.1-29.7h0Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z"
                              />
                              <path
                                  className="syd-logo-main-color"
                                  d="m443,55.9v75c0,14-2.8,24.8-8.2,32.5-5.5,7.7-14.5,13.1-27,16.2s-29.8,4.7-52,4.7h-87v-67.5l42.8-65.3v101.4h42.2c12.1,0,21.3-.5,27.4-1.6,6.2-1,10.6-3.1,13.4-6.1,2.7-3,4.1-7.8,4.1-14.2V55.2c0-8.7-3.4-14.8-10.4-18.3-6.5-3.3-16.6-5-30.3-5.2h-.8l-69.9.1-47.9,78.3v74.4h-44.3v-73.8l-47.9-79.3c-30.7.1-67.6.4-75.3.4-14.9,0,1.5.1-7.3.1-12,0-20.3,9.8-20.3,15.5v10.3c0,9.6,8.1,14.5,24.4,14.5h37.5c21,0,36.2,3.9,45.7,11.6,9.5,7.8,14.2,19.6,14.2,35.5v12.2c0,22-4.1,35.3-15.9,43.8-10.6,7.6-26,9.1-36.2,9.1-9.3,0-14.1.7-27.5.5-16.2-.1-55.9.3-86.4-.1v-29.5c31.3,0,76.1.1,87.9.1,21.2,0,33.9.7,33.9-19.1v-11.9c0-6-1.8-10.7-5.3-13.9-3.5-3.2-9.8-4.8-18.9-4.8h-36.9C20.3,105.7,0,89.6,0,57.4v-13.6C0,27.7,6.7,15.9,20.2,8.3,33.6.7,34.2.4,63.4.4h65.2l-.1-.1h50.2l38.9,72.1L256.2.3h99.4c6.1,0,11.8.1,17.1.4,13.6.7,25,2.2,34,4.6,12.5,3.3,21.7,9,27.5,17.2,5.8,7.8,8.8,19,8.8,33.4Z"
                              />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="563.4 147.3 563.4 184.2 455.3 184.2 455.3 120.9 492.4 120.9 492.4 147.3 563.4 147.3"
                              />
                              <path
                                  className="syd-logo-main-color"
                                  d="m587.2,120.9l-23.4,63.4h43.7l21.3-63.4h-41.6Zm142.3,0h-43.2l21.2,63.4h44.8l-22.8-63.4ZM685.9,0h-53.9l-33,89.3h40.5l17.6-52.4h1.1l17.6,52.4h42.5L685.9,0Z"
                              />
                              <polygon
                                  className="syd-logo-main-color"
                                  points="563.8 0 563.8 36.9 492.4 36.9 492.4 89.4 455.3 89.4 455.3 0 563.8 0"
                              />
                              <polygon
                                  className="syd-logo-arrow"
                                  points="492.4 120.9 492.4 89.3 563.5 89.4 563.5 48 587.3 120.9 492.4 120.9"
                              />
                              <polygon
                                  className="syd-logo-arrow"
                                  points="758 120.9 628.8 120.9 639.4 89.4 746.6 89.4 758 120.9"
                              />
                          </svg>
                      </a>
                    </li>
                    {
                      Object.entries(globalDataState.mainSections).map(([key, value]) => (
                        value && key !== 'sitemap' && key !== 'contacts' && key !== 'privacy' &&
                        <li key={key}>
                          <a className='d-flex gap-1'>{key}
                            <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 17.12" className={`arrow-icon-nav transition-03s-eio`}><path d="m29.96,2.14c0,.55-.21,1.09-.63,1.51l-12.84,12.84c-.4.4-.94.63-1.51.63s-1.11-.22-1.51-.63L.63,3.65C-.21,2.82-.21,1.47.63.63,1.47-.21,2.82-.21,3.65.63l11.32,11.32L26.3.63c.84-.84,2.19-.84,3.03,0,.42.42.63.96.63,1.51Z"/></svg>
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                  {
                    globalDataState.mainSections.contacts && (
                      <button className="syd-button">Contact us</button>
                    )
                  }
                </nav>
              </div>
            </div>

            <div className="col-12 p-3 my-3 card-dash-admin w-100">
              <p className="fw-bold fs-4">Employee menu</p>
              <div className="row">
                {globalDataState.employee_menu.map((item, index) => (
                  <div key={index}  className="col-6 position-relative">
                    <div className="card-dash-admin p-3 mb-3">
                      <div className="row">
                        {Object.entries(item).map(([key, value]) => (
                          <div key={key} className="my-2 col-sm-12 col-md-6">
                          <p className="m-0 fw-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                          <input 
                            type="text"
                            value={value}
                            onChange={(e) => onChangeEmployeeMenu(index, key, e.target.value)}
                            placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
                            className="w-100 p-2 input-contact"
                          />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="btn-admin-delete-office p-0" onClick={() => onDeleteEmployeeMenu(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button className="btn-admin-add-office p-0 px-3 gap-1" onClick={onAddEmployeeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
                Add item
              </button>
            </div>
            
            <div className="col-12 p-3 my-3 card-dash-admin w-100">
              <p className="fw-bold fs-4">Office</p>

                <div className="row">
                  {globalDataState.offices.map((office, index) => (
                    <div key={index} className="col-6">
                      <div className="row card-dash-admin m-2 p-3 mb-4 position-relative">
                        <button className="btn-admin-delete-office p-0" onClick={() => onDeleteOffice(index)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                          </svg>
                        </button>
                        {Object.entries(office).map(([key, value]) => (
                          <div key={key} className="my-2 col-sm-12 col-md-6">
                            <p className="m-0 fw-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                            <input 
                              type="text"
                              value={value}
                              onChange={(e) => onChangeOffices(index, key, e.target.value)}
                              placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
                              className="w-100 p-2 input-contact"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button className="btn-admin-add-office p-0 px-3 gap-1" onClick={onAddOffice}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                    Add office
                  </button>
                </div>


            </div>
          </div>
          </div>
        </div>

        <div className="accordion-item my-2" key='contact-form'>
          <h2 className="accordion-header" id={`heading-contact-form`}>
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-contact-form`} aria-expanded="true" aria-controls={`#collapse-contact-form`}>
              <span className="fw-bold text-uppercase fs-5 syd-yellow">Contact Form</span>
            </button>
          </h2>
          <div className="collapse p-3" id={`collapse-contact-form`}>
            <div className="row">
              <div className="col-6">
                <div className="card-dash-admin p-3">
                  <p className="fw-bold fs-5">Main Contact Form - Mail Template</p>
                    <div className="d-flex gap-3 align-items-center my-4">
                      <label className="switch">
                        <input type="checkbox" checked={globalDataState.contactForms.showContactFormMain} onChange={() => onchangeShowMainContactForm()}/>
                        <span className="slider"></span>
                      </label>
                      <p className={`text-uppercase fw-bold m-0 ${globalDataState.contactForms.showContactFormMain ? '':'disabled-label'}`}>Visible</p>
                    </div>
                  <p className="fs-6">Variables that can be used in the template:</p>
                  <ul>
                    <li className="pb-3">
                      <code>{varNameMail}</code> recipient's name
                    </li>
                    <li>
                      <code>{varBodyMail}</code> the message written by the user in the contact form
                    </li>
                  </ul>
                  <Editor
                    width="90%"
                    height="60vh" 
                    theme="vs-dark"
                    defaultLanguage="html" 
                    defaultValue={globalDataState.mailForm.template}
                    onMount={(editor, monaco) => {
                      editorRef.current = editor;
                    }}
                    onChange={onChange}
                  />
                  <button onClick={handleFormatCode} className="p-2 text-uppercase my-2 btn-dash-global">Format Code</button>
                </div>
              </div>
              <div className="col-6">
                <div className="card-dash-admin p-3">
                  <p className="fw-bold fs-5">Careers Contact Form - Mail Template</p>
                  <div className="d-flex gap-3 align-items-center my-4">
                      <label className="switch">
                        <input type="checkbox" checked={globalDataState.contactForms.showContactFormCareers} onChange={() => onchangeShowContactFormCareers()}/>
                        <span className="slider"></span>
                      </label>
                      <p className={`text-uppercase fw-bold m-0 ${globalDataState.contactForms.showContactFormCareers ? '':'disabled-label'}`}>Visible</p>
                    </div>
                  <p className="fs-6">Variables that can be used in the template:</p>
                  <ul>
                    <li className="pb-3">
                      <code>{varNameMail}</code> recipient's name
                    </li>
                    <li>
                      <code>{varBodyMail}</code> the message written by the user in the contact form
                    </li>
                  </ul>
                  <Editor
                    width="90%"
                    height="60vh" 
                    theme="vs-dark"
                    defaultLanguage="html" 
                    defaultValue={globalDataState.mailFormCareers.template}
                    onMount={(editor, monaco) => {
                      editorRefCareers.current = editor;
                    }}
                    onChange={onChangeHtmlCareers}
                  />
                  <button onClick={handleFormatCodeHtmlCareers} className="p-2 text-uppercase my-2 btn-dash-global">Format Code</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion-item my-2" key='language'>
          <h2 className="accordion-header" id={`heading-language`}>
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-language`} aria-expanded="true" aria-controls={`#collapse-language`}>
              <span className="fw-bold text-uppercase fs-5 syd-yellow">Language</span>
            </button>
          </h2>
          <div className="collapse p-3" id={`collapse-language`}>
            <div className="p-3 w-100">
              <div className="row">
              {globalDataState.available_language.map((langu, index) => (
                <div key={index} className="col-sm-12 col-md-3">
                  <label className="my-3 syd-checkbox-label d-flex gap-1 align-items-center">
                    <input className="syd-checkbox" type="checkbox"
                    checked={langu.selected}
                    onChange={() => onChangeAvailableLangu(index)}
                    />
                    <p className={`fs-5 m-0 d-flex gap-3 ${langu.selected ? '':'disabled-label'}`}>{langu.name} <span className={`fi fi-${langu.flag}`}></span></p>
                  </label>
                </div>
              ))}
              </div>
              <p className="fw-bold fs-5 pt-4">Default language</p>
              <p>{globalDataState.default_language}</p>
              <select name="languages" id="langu-select" className="p-2" onChange={handleLanguageChange}>
                {
                globalDataState.available_language.map((language, index) => (
                  language.selected &&
                  <option key={index} value={language.id} selected={language.id === globalDataState.default_language}>
                    {language.name}
                  </option>
                ))}
              </select>

            </div>
          </div>
        </div>

        <div className="accordion-item my-2" key='footer'>
          <h2 className="accordion-header" id={`heading-footer`}>
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-footer`} aria-expanded="true" aria-controls={`#collapse-footer`}>
              <span className="fw-bold text-uppercase fs-5 syd-yellow">Footer</span>
            </button>
          </h2>
          <div className="collapse p-3" id={`collapse-footer`}>
            <div className="p-3 w-100">
              <div className="row">
              <div className="col-sm-12 col-md-3">
                <div className="d-flex gap-3 align-items-center my-4">
                    <label className="switch">
                      <input type="checkbox" checked={globalDataState.footer.showOffice} onChange={() => onchangeFooterShowOffices()}/>
                      <span className="slider"></span>
                    </label>
                    <p className={`text-uppercase fw-bold m-0 ${globalDataState.footer.showOffice ? '':'disabled-label'}`}>Show office</p>
                  </div>

                  <div className="d-flex gap-3 align-items-center my-4">
                    <label className="switch">
                      <input type="checkbox" checked={globalDataState.footer.multiLanguage} onChange={() => onchangeFooterMultiLanguage()}/>
                      <span className="slider"></span>
                    </label>
                    <p className={`text-uppercase fw-bold m-0 ${globalDataState.footer.multiLanguage ? '':'disabled-label'}`}>Multi languages</p>
                  </div>

                  <p className="fw-bold fs-5 pt-4">Visible pages</p>
                  {
                    Object.entries(globalDataState.footer.elements).map(([key, value]) => (
                      <div key={key} className="d-flex gap-3 align-items-center my-4">
                        <label className="switch">
                          <input type="checkbox" checked={value} onChange={() => handleFooterVisiblePagesChange(key)}/>
                          <span className="slider"></span>
                        </label>
                        <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
                      </div>
                    )
                  )}

                </div>
                <div className="col-sm-12 col-md-5 pe-5">
                  <p className="fw-bold fs-5">E-mail</p>
                    <div className="d-flex gap-3 align-items-center pb-5">
                      <input 
                        type="text"
                        value={globalDataState.footer.email.mail}
                        onChange={onChangeFooterEmail}
                        placeholder='E-mail'
                        className="w-100 p-2 input-contact"
                      />
                      <label className="switch">
                        <input type="checkbox" checked={globalDataState.footer.email.show} onChange={() => onchangeFooterShowEmail()}/>
                        <span className="slider"></span>
                      </label>
                    </div>
                  <p className="fw-bold fs-5">Visible contacts</p>
                  {
                    Object.entries(globalDataState.footer['socialContacts']).map(([key, value]) => (
                      <div key={key} className="my-4">
                        <p className="text-uppercase fw-bold m-0">{key}</p>
                        <div className="d-flex gap-3 align-items-center">
                          <input 
                            type="text"
                            value={value.link}
                            onChange={(e) => handleFooterLinkChange(key, e.target.value)}
                            placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
                            className="w-100 p-2 input-contact"
                          />
                          <label className="switch">
                            <input type="checkbox" checked={value.status} onChange={() => handleFooterStatusChange(key)}/>
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="col-sm-12 col-md-4">
                  <p className="fw-bold fs-5">Bottom text</p>
                  <textarea 
                    rows="8" cols="40"
                    value={globalDataState.footer.text}
                    onChange={onChangeFooterText}
                    placeholder='Bottom text...'
                    className="w-100 p-2 input-contact"
                  />
                </div>
              </div>

              <p className="fw-bold fs-6 pt-4">Privacy policy</p>
              <input 
                type="text"
                value={globalDataState.privacyPolicyLink}
                onChange={onChangePrivacyPolicyLink}
                placeholder='E-mail'
                className="w-75 p-2 input-contact"
              />

              <p className="fw-bold fs-6 pt-4">Cookie policy</p>
              <input 
                type="text"
                value={globalDataState.cookiePolicyLink}
                onChange={onChangeCookiePolicyLink}
                placeholder='E-mail'
                className="w-75 p-2 input-contact"
              />
              <br/>
              <br/>
              <div className="footer p-3">

                <div className='p-4 pb-0'>
                  <div className='d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-center'>
                    <img src={SydeaLogoLight} className='footer-logo' alt='Sydea Logo'></img>
                    <div>
                      <div className='d-flex flex-column gap-3'></div>
                      {
                        globalDataState.footer.multiLanguage && 
                        <div className="dropdown mb-3">
                          <span className="btn-language text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center dark-mode-text transition-03s-eio">
                            <span className={`fi fi-gb`}></span>
                            <span>English</span>
                          </span>
                        </div>
                      }
                        {
                          globalDataState.footer.email.show && 
                          <p>{globalDataState.footer.email.mail}</p>
                        }
                      </div>
                  </div>
                  
                  <div className='d-flex flex-column flex-sm-row py-3 justify-content-between'>
                    <ul id='footer-items' className='d-flex flex-column flex-sm-row align-items-start align-items-sm-center m-0 p-0 gap-4'>
                    {
                      Object.entries(globalDataState.footer.elements).map(([key, value]) => (
                        value &&
                        <li key={key}>
                          <div className="text-deco-none transition-03s-eio syd-yellow">
                            <p className="m-0">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                          </div>
                        </li>
                      )
                    )}
                    </ul>
                    <div className='d-flex py-3 gap-3'>
                    {
                      Object.entries(globalDataState.footer['socialContacts']).map(([key, value]) => (
                        (
                          value.status && 
                          <div className='social-link'>
                            <img src={require(`../../assets/social/${key}.png`)} className='logo-social' alt='Linkedin logo'></img>
                          </div>
                        )
                      )
                    )}
                    </div>
                  </div>
                  
                  {
                    globalDataState.footer.showOffice &&
                    <div className='pt-3 d-flex aling-items-center justify-content-center'>
                      {globalDataState.offices.map((office, index) => (
                        <div className="m-0 d-flex justify-content-between">
                          <p key={index}  href={TranslationsService.getGlobalValue('bologna_google_maps')} target='_blank' rel="noreferrer" className="text-deco-none transition-03s-eio ref-offices-footer">
                            {office.name}
                          </p>
                          {
                            globalDataState.offices.length > (index + 1) && 
                            <span className="px-2">|</span>
                          }
                        </div>
                      ))}
                    </div>
                  }
                  
                  <div className='pt-3'>
                    <p className='syd-paragraph text-center m-0'>© {currentYear} {globalDataState.footer.text}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div> */}

    </MsalAuthenticationTemplate>
  );
};





// import React, { useState, useContext, useMemo, useEffect, useRef } from "react";
// import "./admin-dashboard.scss";
// import { Link } from "react-router-dom";
// import { AppContext } from "../../services/translationContext";
// import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
// import { InteractionType } from '@azure/msal-browser';
// import {
//   InteractionRequiredAuthError,
//   InteractionStatus,
// } from "@azure/msal-browser";
// import { Loader } from "../../components/loader/loader";
// import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
// import jsonData from "../../assets/mainData.json";
// import SydeaLogoLight from '../../assets/logo/sydea_w.svg';

// const currentYear = new Date().getFullYear();

// const varNameMail = '${name}';
// const varBodyMail = '${varBodyMail}';

// const ColorPicker = ({ colorProps, textProps }) => {
//   return (
//     <span className="color-picker-container">
//       <input type="color" {...colorProps} />
//       <input type="text" {...colorProps} />
//     </span>
//   );
// };

// export const AdminDashboard = () => {
//   const { services: { TranslationsService } } = useContext(AppContext);
//   const [selLangu, setLangu] = useState("en");
//   const [labelsList, setLabelsList] = useState({});
//   const [showData, setShowData] = useState(false);
//   const [showSuccessToast, setShowSuccessToast] = useState('hide');
//   const [showLoader, setShowLoader] = useState(false);

//   const [selectedFile, setSelectedFile] = useState(null);

//   const [globalDataState, setGlobalDataState] = useState(jsonData);

//   const { instance, inProgress, accounts } = useMsal();
//   let activeAccount;

//   if (instance) {
//       activeAccount = instance.getActiveAccount();
//   }

//   useMemo(() => {
//     // setShowLoader(true);
//     // fetch(`https://www.sydea.it/static/label.json?_cache_buster=${new Date().getTime()}`).then((response) => response.json()).then((data) => {
//     //   setLabelsList(data);
//     //   setShowData(true);
//     //   setShowLoader(false);
//     // });
//   }, []);

//   const createColorChangeHandler = (updateFunction) => (e) => {
//     const newColor = e.target.value;
//     setGlobalDataState((prevState) => ({
//       ...prevState,
//       style: {
//         ...prevState.style,
//         brandColors: {
//           ...prevState.style.brandColors,
//           main: newColor,
//         },
//       },
//     }));
//   };

//   const createDynamicColorChangeHandler = (sections, colorKey) => (newColor) => {
//     setGlobalDataState((prevState) => (
//       {...prevState, style: {...prevState.style, [sections]: {...prevState.style[sections], [colorKey]: newColor.target.value}}}
//     ));
//   };
  
//   const handleColorChange = createDynamicColorChangeHandler("brandColors", "main");
//   const handleColorChangeSecondary = createDynamicColorChangeHandler("brandColors", "secondary");
//   const handleDetailColorChange = createDynamicColorChangeHandler("brandColors", "details");
  
//   const handleLightTitleColorChange = createDynamicColorChangeHandler("lightMode", "title");
//   const handleLightTextColorChange = createDynamicColorChangeHandler("lightMode", "text");
//   const handleLightBgColor = createDynamicColorChangeHandler("lightMode", "background");
//   const handleLightButtonBgColorChange = createDynamicColorChangeHandler("lightMode", "btnBackground");
//   const handleLightButtonTextColorChange = createDynamicColorChangeHandler("lightMode", "btnText");

//   const handleDarkTitleColorChange = createDynamicColorChangeHandler("darkMode", "title");
//   const handleDarkTextColorChange = createDynamicColorChangeHandler("darkMode", "text");
//   const handleDarkBgColor = createDynamicColorChangeHandler("darkMode", "background");
//   const handleDarkButtonBgColorChange = createDynamicColorChangeHandler("darkMode", "btnBackground");
//   const handleDarkButtonTextColorChange = createDynamicColorChangeHandler("darkMode", "btnText");
  
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//   };
//   const handleUpload = () => {
//     console.log('File da caricare:', selectedFile);
//     setSelectedFile(null);
//   };

//   const handleCheckboxMainSectionChange = (key) => {
//     setGlobalDataState((prevState) => {
//       const newState = { ...prevState, mainSections: { ...prevState.mainSections, [key]: !prevState.mainSections[key] } };
//       if (key === 'insights' && !newState.mainSections[key]) {
//         setGlobalDataState((prevState) => {
//           const newInsightsState = { ...prevState, insightsSections: { ...prevState.insightsSections, ...Object.fromEntries(Object.entries(prevState.insightsSections).map(([_key]) => [_key, false])) } };
//           return newInsightsState;
//         });
//       }
//       if (key === 'about' && !newState.mainSections[key]) {
//         setGlobalDataState((prevState) => {
//           const newAboutState = { ...prevState, aboutSections: { ...prevState.aboutSections, ...Object.fromEntries(Object.entries(prevState.aboutSections).map(([_key]) => [_key, false])) } };
//           return newAboutState;
//         });
//       }
//       return newState;
//     });
//   };
  
//   const handleCheckboxInsightsSectionChange = (key) => {
//     setGlobalDataState((prevState) => {
//       const updatedInsightsSections = { ...prevState.insightsSections, [key]: !prevState.insightsSections[key] };
//       const isAnyInsightTrue = Object.values(updatedInsightsSections).some(val => val);
//       if (isAnyInsightTrue) {
//         setGlobalDataState((prev) => ({ ...prev, mainSections: { ...prev.mainSections, insights: true } }));
//       }
//       return { ...prevState, insightsSections: updatedInsightsSections };
//     });
//   };
  
//   const handleCheckboxAboutSectionChange = (key) => {
//     setGlobalDataState((prevState) => {
//       const updatedAboutSections = { ...prevState.aboutSections, [key]: !prevState.aboutSections[key] };
//       const isAnyAboutSectionTrue = Object.values(updatedAboutSections).some(val => val);
//       if (isAnyAboutSectionTrue) {
//         setGlobalDataState((prev) => ({ ...prev, mainSections: { ...prev.mainSections, about: true } }));
//       }
//       return { ...prevState, aboutSections: updatedAboutSections };
//     });
//   };

//   const editorRef = useRef(null);

//   const handleFormatCode = () => {
//     if (editorRef.current) {
//       editorRef.current.getAction('editor.action.formatDocument').run();
//     }
//   };

//   const editorRefCareers = useRef(null);

//   const handleFormatCodeHtmlCareers = () => {
//     if (editorRefCareers.current) {
//       editorRefCareers.current.getAction('editor.action.formatDocument').run();
//     }
//   };

//   const onChangeOffices = (index, key, newValue) => {
//     setGlobalDataState((prevState) => {
//       const newOffices = [...prevState.offices];
//       newOffices[index][key] = newValue;
//       return {...prevState, offices: newOffices};
//     });
//   };

//   const onChangeEmployeeMenu = (index, key, newValue) => {
//     setGlobalDataState((prevState) => {
//       const newEmployeeMenu = [...prevState.employee_menu];
//       newEmployeeMenu[index][key] = newValue;
//       return {...prevState, employee_menu: newEmployeeMenu};
//     });
//   };

//   const onAddOffice = () => {
//     const newOffices = [...globalDataState.offices, { "name": "", "address": "", "phone": "", "mapsLink": "" }];
//     setGlobalDataState((prevState) => ({...prevState, offices: newOffices}));
//   };

//   const onDeleteOffice = (index) => {
//     const newOffices = [...globalDataState.offices.slice(0, index), ...globalDataState.offices.slice(index + 1)];
//     setGlobalDataState((prevState) => ({...prevState, offices: newOffices}));
//   };

//   const onAddEmployeeMenu = () => {
//     const newEmployeeMenu = [...globalDataState.employee_menu, { "label":"", "link": "" }];
//     setGlobalDataState((prevState) => ({...prevState, employee_menu: newEmployeeMenu}));
//   };

//   const onDeleteEmployeeMenu = (index) => {
//     const newEmployeeMenu = [...globalDataState.employee_menu.slice(0, index), ...globalDataState.employee_menu.slice(index + 1)];
//     setGlobalDataState((prevState) => ({...prevState, employee_menu: newEmployeeMenu}));
//   };

//   const handleFooterVisiblePagesChange = (key) => {
//     setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, elements: {...prevState.footer.elements, [key]: !prevState.footer.elements[key]}}}));
//   };

//   const onchangeShowMainContactForm = () => {
//     setGlobalDataState((prevState) => ({...prevState, contactForms: {...prevState.contactForms, showContactFormMain: !prevState.contactForms.showContactFormMain}}));
//   };

//   const onchangeShowContactFormCareers = () => {
//       setGlobalDataState((prevState) => ({...prevState, contactForms: {...prevState.contactForms, showContactFormCareers: !prevState.contactForms.showContactFormCareers}}));
//     };

//   const onchangeFooterShowOffices = () => {
//     setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, showOffice: !prevState.footer.showOffice}}));
//   };

//   const onchangeFooterMultiLanguage= () => {
//     setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, multiLanguage: !prevState.footer.multiLanguage}}));
//   };

//   const onchangeFooterShowEmail = () => {
//     setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, email: { ...prevState.footer?.email, show: !prevState.footer?.email?.show}}}));
//   };
  
//   const onChangeFooterEmail = (e) => {
//     setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, email: { ...prevState.footer?.email, mail: e.target.value}}}));
//   };
  
//   const handleFooterLinkChange = (key, newValue) => {
//     setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, socialContacts: {...prevState.footer.socialContacts, [key]: {...prevState.footer.socialContacts[key], link: newValue}}}}));
//   };
  
//   const handleFooterStatusChange = (key) => {
//     setGlobalDataState((prevState) => ({
//       ...prevState, footer: {...prevState.footer, socialContacts: {...prevState.footer.socialContacts, [key]: {...prevState.footer.socialContacts[key], status: !prevState.footer.socialContacts[key].status}}}}));
//   };
  
//   const onChangeFooterText = (e) => {
//     setGlobalDataState((prevState) => ({...prevState, footer: {...prevState.footer, text: e.target.value}}));
//   };

//   const onChangePrivacyPolicyLink = (e) => {
//     setGlobalDataState({...globalDataState, privacyPolicyLink: e.target.value});
//   };

//   const onChangeCookiePolicyLink = (e) => {
//     setGlobalDataState({...globalDataState, cookiePolicyLink: e.target.value});
//   };

//   const onChangeAvailableLangu = (index) => {
//     const updatedLanguages = [...globalDataState.available_language];
//     updatedLanguages[index].selected = !updatedLanguages[index].selected;

//     const selectedLanguagesCount = updatedLanguages.filter(language => language.selected).length;
//     const allLanguagesDeselected = selectedLanguagesCount === 0;

//     if (!allLanguagesDeselected || selectedLanguagesCount > 1) {
//       const languageToChange = updatedLanguages[index];
//       const languageToChangeIsDefault = languageToChange.id === globalDataState.default_language;
//       if (languageToChangeIsDefault) {
//         const selectedLanguages = updatedLanguages.filter(language => language.selected);
//         const newDefaultLanguage = selectedLanguages.length > 0 ? selectedLanguages[0].id : "en";
//         setGlobalDataState({...globalDataState, default_language: newDefaultLanguage, available_language: updatedLanguages});
//       }
//       else {
//         setGlobalDataState({...globalDataState, available_language: updatedLanguages});
//       }
//     }
//   };

//   const handleLanguageChange = (event) => {
//     const selectedLanguageId = event.target.value;
//     setGlobalDataState({...globalDataState, default_language: selectedLanguageId});
//   };

//   const saveGlobalData = () => {
//     console.log(globalDataState);
//   }

//   const onChangeInputMainInfo = (e) => {
//     const { name, value } = e.target;
//     setGlobalDataState((prevState) => ({
//       ...prevState,
//       mainInfo: {
//         ...prevState.mainInfo,
//         [name]: value,
//       },
//     }));
//   };

//   const onChange = (e) => {
//     setGlobalDataState({...globalDataState, mailForm:{template: e}});
//   }

//   const onChangeHtmlCareers = (e) => {
//     setGlobalDataState({...globalDataState, mailFormCareers:{template: e}});
//   }

//   useEffect(() => {
//     setTimeout(() => {
//       handleFormatCode();
//     }, 500);
//   }, []);

//   return (
//   <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
//     {
//       showLoader &&
//       <Loader />
//     }
    
//     <div className="p-3 d-flex justify-content-between align-items-center toolbar-stick-priv">
//       <Link to='/syd-admin' className='btn-dash text-deco-none p-3 text-uppercase transition-03s-eio'>
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
//         <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
//       </svg>
//       <span className='px-1'>Back</span>
//       </Link>
//       <button className="syd-button m-0" onClick={saveGlobalData}>Save</button>
//     </div>

//     <div className="bg-light p-3">
//       <div className="accordion" id="accordionExample">

//         <div className="accordion-item my-2" key='company'>
//           <h2 className="accordion-header" id={`heading-company`}>
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-company`} aria-expanded="true" aria-controls={`#collapse-company`}>
//               <span className="fw-bold text-uppercase fs-5 syd-yellow">Company</span>
//             </button>
//           </h2>
//           <div className="collapse p-3" id={`collapse-company`}>
//             <div className="p-3">
//               <div className="row">
//                 <div className="col-sm-12 col-md-6">
//                   <p className="m-0 fw-bold">Name</p>
//                   <input 
//                     type="text"
//                     value={globalDataState.mainInfo.name}
//                     name="name"
//                     onChange={onChangeInputMainInfo}
//                     placeholder='Company name...'
//                     className="w-100 p-2 input-contact mb-2"
//                   />
//                 </div>
//                 <div className="col-sm-12 col-md-6">
//                   <p className="m-0 fw-bold">Address</p>
//                   <input 
//                     type="text"
//                     value={globalDataState.mainInfo.address}
//                     name="address"
//                     onChange={onChangeInputMainInfo}
//                     placeholder='Address...'
//                     className="w-100 p-2 input-contact  mb-2"
//                   />
//                 </div>
//                 <div className="col-sm-12 col-md-6">
//                   <p className="m-0 fw-bold">VAT</p>
//                   <input 
//                     type="text"
//                     value={globalDataState.mainInfo.vat}
//                     name="vat"
//                     onChange={onChangeInputMainInfo}
//                     placeholder='VAT...'
//                     className="w-100 p-2 input-contact  mb-2"
//                   />
//                 </div>
//                 <div className="col-sm-12 col-md-6">
//                   <p className="m-0 fw-bold">Mail</p>
//                   <input 
//                     type="text"
//                     value={globalDataState.mainInfo.mail}
//                     name="mail"
//                     onChange={onChangeInputMainInfo}
//                     placeholder='Mail...'
//                     className="w-100 p-2 input-contact mb-2"
//                   />
//                 </div>
//                 <div className="col-sm-12 col-md-6">
//                   <p className="m-0 fw-bold">Slogan</p>
//                   <input 
//                     type="text"
//                     name="slogan"
//                     value={globalDataState.mainInfo.slogan}
//                     onChange={onChangeInputMainInfo}
//                     placeholder='Company slogan...'
//                     className="w-100 p-2 input-contact  mb-2"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="accordion-item my-2" key='brand'>
//           <h2 className="accordion-header" id={`heading-brand`}>
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-brand`} aria-expanded="true" aria-controls={`#collapse-brand`}>
//               <span className="fw-bold text-uppercase fs-5 syd-yellow">Brand</span>
//             </button>
//           </h2>
//           <div className="collapse p-3" id={`collapse-brand`}>
//             <div className="p-3">
//               <div className="row">
//                   <div className="col-sm-12 col-md-8">
//                     <p className="fw-bold fs-5">Logo</p>
//                     <div className="row">
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Main</p>
//                         <div className="file-upload-container d-grid p-2">
//                           <input type="file" onChange={handleFileChange} className="file-input" />
//                           <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
//                             Carica
//                           </button>
//                         </div>
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Main dark</p>
//                         <div className="file-upload-container d-grid p-2">
//                           <input type="file" onChange={handleFileChange} className="file-input" />
//                           <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
//                             Carica
//                           </button>
//                         </div>
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Main light</p>
//                         <div className="file-upload-container d-grid p-2">
//                           <input type="file" onChange={handleFileChange} className="file-input" />
//                           <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
//                             Carica
//                           </button>
//                         </div>
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Icon</p>
//                         <div className="file-upload-container d-grid p-2">
//                           <input type="file" onChange={handleFileChange} className="file-input" />
//                           <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
//                             Carica
//                           </button>
//                         </div>
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Icon dark</p>
//                         <div className="file-upload-container d-grid p-2">
//                           <input type="file" onChange={handleFileChange} className="file-input" />
//                           <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
//                             Carica
//                           </button>
//                         </div>
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Icon light</p>
//                         <div className="file-upload-container d-grid p-2">
//                           <input type="file" onChange={handleFileChange} className="file-input" />
//                           <button onClick={handleUpload} className="upload-btn" disabled={!selectedFile}>
//                             Carica
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-sm-12 col-md-4">
//                     <p className="fw-bold fs-5 text-end">Colors</p>
//                     <div className="w-100 text-end my-3">
//                       <p className="m-0 fw-bold">Main</p>
//                       <ColorPicker colorProps={{ onChange: handleColorChange, value: globalDataState.style.brandColors.main }} />
//                     </div>
//                     <div className="w-100 text-end my-3">
//                       <p className="m-0 fw-bold">Secondary</p>
//                       <ColorPicker colorProps={{ onChange: handleColorChangeSecondary, value: globalDataState.style.brandColors.secondary }} />
//                     </div>
//                     <div className="w-100 text-end my-3">
//                       <p className="m-0 fw-bold">Details</p>
//                       <ColorPicker colorProps={{ onChange: handleDetailColorChange, value: globalDataState.style.brandColors.details }} />
//                     </div>
//                   </div>
//                 </div>
//             </div>
//           </div>
//         </div>

//         <div className="accordion-item my-2" key='style'>
//           <h2 className="accordion-header" id={`heading-style`}>
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-style`} aria-expanded="true" aria-controls={`#collapse-style`}>
//               <span className="fw-bold text-uppercase fs-5 syd-yellow">Style</span>
//             </button>
//           </h2>
//           <div className="collapse p-3" id={`collapse-style`}>
//             <div className="p-3 w-100">
//               <p className="fw-bold fs-5">Light</p>
//                 <div className="row">
//                   <div className="col-sm-12 col-md-6">
//                     <div className="row">
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Title</p>
//                         <ColorPicker colorProps={{ onChange: handleLightTitleColorChange, value: globalDataState.style.lightMode.title }} />
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Text</p>
//                         <ColorPicker colorProps={{ onChange: handleLightTextColorChange, value: globalDataState.style.lightMode.text }} />
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Background</p>
//                         <ColorPicker colorProps={{ onChange: handleLightBgColor, value: globalDataState.style.lightMode.background }} />
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Button Background</p>
//                         <ColorPicker colorProps={{ onChange: handleLightButtonBgColorChange, value: globalDataState.style.lightMode.btnBackground }} />
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Button text</p>
//                         <ColorPicker colorProps={{ onChange: handleLightButtonTextColorChange, value: globalDataState.style.lightMode.btnText }} />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-sm-12 col-md-6 box-example-card-style p-3">
//                     <div className="example-card-style p-3 w-100" style={{backgroundColor: globalDataState.style.lightMode.background}}>
//                       <p style={{fontSize:'30px', color: globalDataState.style.lightMode.title}} className="m-0">Lorem Ipsum</p>
//                       <p style={{color: globalDataState.style.lightMode.text}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
//                       <button className="btn-example" style={{backgroundColor: globalDataState.style.lightMode.btnBackground, color: globalDataState.style.lightMode.btnText}}>Click here</button>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="fw-bold fs-5">Dark</p>
//                 <div className="row">
//                   <div className="col-sm-12 col-md-6 box-example-card-style p-3">
//                     <div className="example-card-style p-3 w-100" style={{backgroundColor: globalDataState.style.darkMode.background}}>
//                       <p style={{fontSize:'30px', color: globalDataState.style.darkMode.title}} className="m-0">Lorem Ipsum</p>
//                       <p style={{color: globalDataState.style.darkMode.text}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
//                       <button className="btn-example" style={{backgroundColor: globalDataState.style.darkMode.btnBackground, color: globalDataState.style.darkMode.btnText}}>Click here</button>
//                     </div>
//                   </div>
//                   <div className="col-sm-12 col-md-6">
//                     <div className="row">
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Title</p>
//                         <ColorPicker colorProps={{ onChange: handleDarkTitleColorChange, value: globalDataState.style.darkMode.title }} />
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Text</p>
//                         <ColorPicker colorProps={{ onChange: handleDarkTextColorChange, value: globalDataState.style.darkMode.text }} />
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Background</p>
//                         <ColorPicker colorProps={{ onChange: handleDarkBgColor, value: globalDataState.style.darkMode.background }} />
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Button Background</p>
//                         <ColorPicker colorProps={{ onChange: handleDarkButtonBgColorChange, value: globalDataState.style.darkMode.btnBackground }} />
//                       </div>
//                       <div className="col-sm-12 col-md-4 my-2">
//                         <p className="m-0 fw-bold">Button text</p>
//                         <ColorPicker colorProps={{ onChange: handleDarkButtonTextColorChange, value: globalDataState.style.darkMode.btnText }} />
//                       </div>
//                     </div>
//                   </div>

//                 </div>
//             </div>
//           </div>
//         </div>

//         <div className="accordion-item my-2" key='sections'>
//           <h2 className="accordion-header" id={`heading-sections`}>
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-sections`} aria-expanded="true" aria-controls={`#collapse-sections`}>
//               <span className="fw-bold text-uppercase fs-5 syd-yellow">Sections</span>
//             </button>
//           </h2>
//           <div className="collapse p-3" id={`collapse-sections`}>
//           <div className="row p-3 my-3">
//             <div className="col-sm-12 col-md-5 ps-0">
//               <div className="p-3 w-100">
//                 <div className="row">
//                   <div className="col-sm-12 col-md-6">
//                     <p className="fw-bold fs-5">Available</p>
//                     {
//                       Object.entries(globalDataState.mainSections).map(([key, value]) => (
//                         <div key={key} className="d-flex gap-3 align-items-center my-4">
//                           <label className="switch">
//                             <input type="checkbox" checked={value} onChange={() => handleCheckboxMainSectionChange(key)}/>
//                             <span className="slider"></span>
//                           </label>
//                           <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
//                         </div>
//                       )
//                     )}
//                   </div>
//                   <div className="col-sm-12 col-md-6">
//                     <p className="fw-bold fs-5">Insights</p>
//                     {
//                       Object.entries(globalDataState.insightsSections).map(([key, value]) => (
//                         <div key={key} className="d-flex gap-3 align-items-center my-4">
//                           <label className="switch">
//                             <input type="checkbox" checked={value} onChange={() => handleCheckboxInsightsSectionChange(key)}/>
//                             <span className="slider"></span>
//                           </label>
//                           <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
//                         </div>
//                       )
//                     )}
//                     <p className="fw-bold fs-5 pt-5">About</p>
//                     {
//                       Object.entries(globalDataState.aboutSections).map(([key, value]) => (
//                         <div key={key} className="d-flex gap-3 align-items-center my-4">
//                           <label className="switch">
//                             <input type="checkbox" checked={value} onChange={() => handleCheckboxAboutSectionChange(key)}/>
//                             <span className="slider"></span>
//                           </label>
//                           <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-sm-12 col-md-7 pe-0">
//               <div className="p-3 my-3 card-dash-admin w-100">
//                 <nav id="main-nav" className="navbar-bg transition-03s-eio d-flex align-items-center justify-content-between" style={{transform:'scale(0.5)', transformOrigin:'top left', width:'100vw'}}>
//                   <ul id="syd-menu" className='d-flex p-3 align-items-center'>
//                     <li>
//                       <a>
//                           <svg id="Livello_1" viewBox="0 0 758 246" className='logo-nav transition-03s-eio'>
//                               <path
//                                   className="syd-logo-main-color"
//                                   d="m117.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7-.7-.5-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.6-.2-9.2-.7"
//                               />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="157.7 233.5 146.9 215.8 152 215.8 159.9 229.8 167.9 215.8 173 215.8 162.1 233.4 162.1 245.5 157.7 245.5 157.7 233.5"
//                               />
//                               <path
//                                   className="syd-logo-main-color"
//                                   d="m182.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7s-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.7-.2-9.2-.7"
//                               />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="222.3 218.9 212.2 218.9 212.2 215.8 236.9 215.8 236.9 218.9 226.8 218.9 226.8 245.5 222.3 245.5 222.3 218.9"
//                               />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="245.9 215.8 265.9 215.8 265.9 218.9 250.3 218.9 250.3 228.6 264.4 228.6 264.4 231.7 250.3 231.7 250.3 242.4 266.3 242.4 266.3 245.5 245.9 245.5 245.9 215.8"
//                               />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="275.9 215.8 282.5 215.8 292.1 240.5 292.2 240.6 301.3 215.8 307.7 215.8 307.7 245.5 303.8 245.5 303.8 220.4 303.6 220.4 294 245.5 290 245.5 280.1 220.4 279.9 220.4 279.9 245.5 275.9 245.5 275.9 215.8"
//                               />
//                               <rect className="syd-logo-main-color" x="340.8" y="215.8" width="4.4" height="29.8" />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="354.4 215.8 359.7 215.8 375.9 240.4 375.9 215.8 379.8 215.8 379.8 245.5 374.4 245.5 358.3 220.5 358.3 245.5 354.4 245.5 354.4 215.8"
//                               />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="399 218.9 388.9 218.9 388.9 215.8 413.6 215.8 413.6 218.9 403.5 218.9 403.5 245.5 399 245.5 399 218.9"
//                               />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="422.7 215.8 442.7 215.8 442.7 218.9 427.2 218.9 427.2 228.6 441.2 228.6 441.2 231.7 427.2 231.7 427.2 242.4 443.2 242.4 443.2 245.5 422.7 245.5 422.7 215.8"
//                               />
//                               <path
//                                   className="syd-logo-main-color"
//                                   d="m462.3,245.8c-1.1-.1-2.2-.4-3.4-.7-1.3-.4-2.5-.8-3.4-1.4s-1.7-1.3-2.2-2.3c-.6-1-.9-2.2-.9-3.5v-14.1c0-1.7.4-3.2,1.3-4.4.9-1.2,2.1-2.1,3.7-2.7,1.5-.5,2.9-.9,4.3-1.1s2.8-.3,4.4-.3c3.8,0,7.2.2,10.3.7v3.4c-1.2-.3-2.8-.5-5-.8-2.2-.2-3.9-.3-5.2-.3-6.3,0-9.4,1.8-9.4,5.4v14c0,1,.3,1.8.9,2.6.6.7,1.4,1.3,2.5,1.6,1,.4,2,.6,2.9.8,1,.1,2.1.2,3.3.2,2,0,4.2-.3,6.6-.8v-10.4h-7v-3.1h11v16c-4,.9-7.6,1.4-11,1.4-1.4,0-2.6-.1-3.7-.2"
//                               />
//                               <path
//                                   className="syd-logo-main-color"
//                                   d="m488,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.5v-29.7Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z"
//                               />
//                               <path
//                                   className="syd-logo-main-color"
//                                   d="m529.8,215.8h5.1l11.6,29.8h-4.6l-3.4-9h-12.8l-3.4,9h-4.3l11.8-29.8Zm7.6,17.6l-5-13.4h-.4l-5,13.4h10.4Z"
//                               />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="561.9 218.9 551.8 218.9 551.8 215.8 576.4 215.8 576.4 218.9 566.4 218.9 566.4 245.5 561.9 245.5 561.9 218.9"
//                               />
//                               <path
//                                   className="syd-logo-main-color"
//                                   d="m585.6,237.9v-14.1c0-5.7,4.2-8.5,12.5-8.5s12.6,2.8,12.6,8.5v14.1c0,2.9-1.2,4.9-3.5,6.2-2.3,1.3-5.4,1.9-9.1,1.9-8.4,0-12.5-2.7-12.5-8.1m20.7,0v-14.2c0-3.7-2.8-5.5-8.3-5.5-2.7,0-4.7.4-6.1,1.2-1.4.8-2.1,2.3-2.1,4.3v14.2c0,3.4,2.8,5.1,8.3,5.1s8.2-1.7,8.2-5.1"
//                               />
//                               <path
//                                   className="syd-logo-main-color"
//                                   d="m619.8,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.4l-.1-29.7h0Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z"
//                               />
//                               <path
//                                   className="syd-logo-main-color"
//                                   d="m443,55.9v75c0,14-2.8,24.8-8.2,32.5-5.5,7.7-14.5,13.1-27,16.2s-29.8,4.7-52,4.7h-87v-67.5l42.8-65.3v101.4h42.2c12.1,0,21.3-.5,27.4-1.6,6.2-1,10.6-3.1,13.4-6.1,2.7-3,4.1-7.8,4.1-14.2V55.2c0-8.7-3.4-14.8-10.4-18.3-6.5-3.3-16.6-5-30.3-5.2h-.8l-69.9.1-47.9,78.3v74.4h-44.3v-73.8l-47.9-79.3c-30.7.1-67.6.4-75.3.4-14.9,0,1.5.1-7.3.1-12,0-20.3,9.8-20.3,15.5v10.3c0,9.6,8.1,14.5,24.4,14.5h37.5c21,0,36.2,3.9,45.7,11.6,9.5,7.8,14.2,19.6,14.2,35.5v12.2c0,22-4.1,35.3-15.9,43.8-10.6,7.6-26,9.1-36.2,9.1-9.3,0-14.1.7-27.5.5-16.2-.1-55.9.3-86.4-.1v-29.5c31.3,0,76.1.1,87.9.1,21.2,0,33.9.7,33.9-19.1v-11.9c0-6-1.8-10.7-5.3-13.9-3.5-3.2-9.8-4.8-18.9-4.8h-36.9C20.3,105.7,0,89.6,0,57.4v-13.6C0,27.7,6.7,15.9,20.2,8.3,33.6.7,34.2.4,63.4.4h65.2l-.1-.1h50.2l38.9,72.1L256.2.3h99.4c6.1,0,11.8.1,17.1.4,13.6.7,25,2.2,34,4.6,12.5,3.3,21.7,9,27.5,17.2,5.8,7.8,8.8,19,8.8,33.4Z"
//                               />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="563.4 147.3 563.4 184.2 455.3 184.2 455.3 120.9 492.4 120.9 492.4 147.3 563.4 147.3"
//                               />
//                               <path
//                                   className="syd-logo-main-color"
//                                   d="m587.2,120.9l-23.4,63.4h43.7l21.3-63.4h-41.6Zm142.3,0h-43.2l21.2,63.4h44.8l-22.8-63.4ZM685.9,0h-53.9l-33,89.3h40.5l17.6-52.4h1.1l17.6,52.4h42.5L685.9,0Z"
//                               />
//                               <polygon
//                                   className="syd-logo-main-color"
//                                   points="563.8 0 563.8 36.9 492.4 36.9 492.4 89.4 455.3 89.4 455.3 0 563.8 0"
//                               />
//                               <polygon
//                                   className="syd-logo-arrow"
//                                   points="492.4 120.9 492.4 89.3 563.5 89.4 563.5 48 587.3 120.9 492.4 120.9"
//                               />
//                               <polygon
//                                   className="syd-logo-arrow"
//                                   points="758 120.9 628.8 120.9 639.4 89.4 746.6 89.4 758 120.9"
//                               />
//                           </svg>
//                       </a>
//                     </li>
//                     {
//                       Object.entries(globalDataState.mainSections).map(([key, value]) => (
//                         value && key !== 'sitemap' && key !== 'contacts' && key !== 'privacy' &&
//                         <li key={key}>
//                           <a className='d-flex gap-1'>{key}
//                             <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 17.12" className={`arrow-icon-nav transition-03s-eio`}><path d="m29.96,2.14c0,.55-.21,1.09-.63,1.51l-12.84,12.84c-.4.4-.94.63-1.51.63s-1.11-.22-1.51-.63L.63,3.65C-.21,2.82-.21,1.47.63.63,1.47-.21,2.82-.21,3.65.63l11.32,11.32L26.3.63c.84-.84,2.19-.84,3.03,0,.42.42.63.96.63,1.51Z"/></svg>
//                           </a>
//                         </li>
//                       )
//                     )}
//                   </ul>
//                   {
//                     globalDataState.mainSections.contacts && (
//                       <button className="syd-button">Contact us</button>
//                     )
//                   }
//                 </nav>
//               </div>
//             </div>

//             <div className="col-12 p-3 my-3 card-dash-admin w-100">
//               <p className="fw-bold fs-4">Employee menu</p>
//               <div className="row">
//                 {globalDataState.employee_menu.map((item, index) => (
//                   <div key={index}  className="col-6 position-relative">
//                     <div className="card-dash-admin p-3 mb-3">
//                       <div className="row">
//                         {Object.entries(item).map(([key, value]) => (
//                           <div key={key} className="my-2 col-sm-12 col-md-6">
//                           <p className="m-0 fw-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
//                           <input 
//                             type="text"
//                             value={value}
//                             onChange={(e) => onChangeEmployeeMenu(index, key, e.target.value)}
//                             placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
//                             className="w-100 p-2 input-contact"
//                           />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <button className="btn-admin-delete-office p-0" onClick={() => onDeleteEmployeeMenu(index)}>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
//                         <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
//                       </svg>
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               <button className="btn-admin-add-office p-0 px-3 gap-1" onClick={onAddEmployeeMenu}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
//                   <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
//                 </svg>
//                 Add item
//               </button>
//             </div>
            
//             <div className="col-12 p-3 my-3 card-dash-admin w-100">
//               <p className="fw-bold fs-4">Office</p>

//                 <div className="row">
//                   {globalDataState.offices.map((office, index) => (
//                     <div key={index} className="col-6">
//                       <div className="row card-dash-admin m-2 p-3 mb-4 position-relative">
//                         <button className="btn-admin-delete-office p-0" onClick={() => onDeleteOffice(index)}>
//                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
//                             <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
//                           </svg>
//                         </button>
//                         {Object.entries(office).map(([key, value]) => (
//                           <div key={key} className="my-2 col-sm-12 col-md-6">
//                             <p className="m-0 fw-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
//                             <input 
//                               type="text"
//                               value={value}
//                               onChange={(e) => onChangeOffices(index, key, e.target.value)}
//                               placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
//                               className="w-100 p-2 input-contact"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
                  
//                   <button className="btn-admin-add-office p-0 px-3 gap-1" onClick={onAddOffice}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
//                       <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
//                     </svg>
//                     Add office
//                   </button>
//                 </div>


//             </div>
//           </div>
//           </div>
//         </div>

//         <div className="accordion-item my-2" key='contact-form'>
//           <h2 className="accordion-header" id={`heading-contact-form`}>
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-contact-form`} aria-expanded="true" aria-controls={`#collapse-contact-form`}>
//               <span className="fw-bold text-uppercase fs-5 syd-yellow">Contact Form</span>
//             </button>
//           </h2>
//           <div className="collapse p-3" id={`collapse-contact-form`}>
//             <div className="row">
//               <div className="col-6">
//                 <div className="card-dash-admin p-3">
//                   <p className="fw-bold fs-5">Main Contact Form - Mail Template</p>
//                     <div className="d-flex gap-3 align-items-center my-4">
//                       <label className="switch">
//                         <input type="checkbox" checked={globalDataState.contactForms.showContactFormMain} onChange={() => onchangeShowMainContactForm()}/>
//                         <span className="slider"></span>
//                       </label>
//                       <p className={`text-uppercase fw-bold m-0 ${globalDataState.contactForms.showContactFormMain ? '':'disabled-label'}`}>Visible</p>
//                     </div>
//                   <p className="fs-6">Variables that can be used in the template:</p>
//                   <ul>
//                     <li className="pb-3">
//                       <code>{varNameMail}</code> recipient's name
//                     </li>
//                     <li>
//                       <code>{varBodyMail}</code> the message written by the user in the contact form
//                     </li>
//                   </ul>
//                   <Editor
//                     width="90%"
//                     height="60vh" 
//                     theme="vs-dark"
//                     defaultLanguage="html" 
//                     defaultValue={globalDataState.mailForm.template}
//                     onMount={(editor, monaco) => {
//                       editorRef.current = editor;
//                     }}
//                     onChange={onChange}
//                   />
//                   <button onClick={handleFormatCode} className="p-2 text-uppercase my-2 btn-dash-global">Format Code</button>
//                 </div>
//               </div>
//               <div className="col-6">
//                 <div className="card-dash-admin p-3">
//                   <p className="fw-bold fs-5">Careers Contact Form - Mail Template</p>
//                   <div className="d-flex gap-3 align-items-center my-4">
//                       <label className="switch">
//                         <input type="checkbox" checked={globalDataState.contactForms.showContactFormCareers} onChange={() => onchangeShowContactFormCareers()}/>
//                         <span className="slider"></span>
//                       </label>
//                       <p className={`text-uppercase fw-bold m-0 ${globalDataState.contactForms.showContactFormCareers ? '':'disabled-label'}`}>Visible</p>
//                     </div>
//                   <p className="fs-6">Variables that can be used in the template:</p>
//                   <ul>
//                     <li className="pb-3">
//                       <code>{varNameMail}</code> recipient's name
//                     </li>
//                     <li>
//                       <code>{varBodyMail}</code> the message written by the user in the contact form
//                     </li>
//                   </ul>
//                   <Editor
//                     width="90%"
//                     height="60vh" 
//                     theme="vs-dark"
//                     defaultLanguage="html" 
//                     defaultValue={globalDataState.mailFormCareers.template}
//                     onMount={(editor, monaco) => {
//                       editorRefCareers.current = editor;
//                     }}
//                     onChange={onChangeHtmlCareers}
//                   />
//                   <button onClick={handleFormatCodeHtmlCareers} className="p-2 text-uppercase my-2 btn-dash-global">Format Code</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="accordion-item my-2" key='language'>
//           <h2 className="accordion-header" id={`heading-language`}>
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-language`} aria-expanded="true" aria-controls={`#collapse-language`}>
//               <span className="fw-bold text-uppercase fs-5 syd-yellow">Language</span>
//             </button>
//           </h2>
//           <div className="collapse p-3" id={`collapse-language`}>
//             <div className="p-3 w-100">
//               <div className="row">
//               {globalDataState.available_language.map((langu, index) => (
//                 <div key={index} className="col-sm-12 col-md-3">
//                   <label className="my-3 syd-checkbox-label d-flex gap-1 align-items-center">
//                     <input className="syd-checkbox" type="checkbox"
//                     checked={langu.selected}
//                     onChange={() => onChangeAvailableLangu(index)}
//                     />
//                     <p className={`fs-5 m-0 d-flex gap-3 ${langu.selected ? '':'disabled-label'}`}>{langu.name} <span className={`fi fi-${langu.flag}`}></span></p>
//                   </label>
//                 </div>
//               ))}
//               </div>
//               <p className="fw-bold fs-5 pt-4">Default language</p>
//               <p>{globalDataState.default_language}</p>
//               <select name="languages" id="langu-select" className="p-2" onChange={handleLanguageChange}>
//                 {
//                 globalDataState.available_language.map((language, index) => (
//                   language.selected &&
//                   <option key={index} value={language.id} selected={language.id === globalDataState.default_language}>
//                     {language.name}
//                   </option>
//                 ))}
//               </select>

//             </div>
//           </div>
//         </div>

//         <div className="accordion-item my-2" key='footer'>
//           <h2 className="accordion-header" id={`heading-footer`}>
//             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-footer`} aria-expanded="true" aria-controls={`#collapse-footer`}>
//               <span className="fw-bold text-uppercase fs-5 syd-yellow">Footer</span>
//             </button>
//           </h2>
//           <div className="collapse p-3" id={`collapse-footer`}>
//             <div className="p-3 w-100">
//               <div className="row">
//               <div className="col-sm-12 col-md-3">
//                 <div className="d-flex gap-3 align-items-center my-4">
//                     <label className="switch">
//                       <input type="checkbox" checked={globalDataState.footer.showOffice} onChange={() => onchangeFooterShowOffices()}/>
//                       <span className="slider"></span>
//                     </label>
//                     <p className={`text-uppercase fw-bold m-0 ${globalDataState.footer.showOffice ? '':'disabled-label'}`}>Show office</p>
//                   </div>

//                   <div className="d-flex gap-3 align-items-center my-4">
//                     <label className="switch">
//                       <input type="checkbox" checked={globalDataState.footer.multiLanguage} onChange={() => onchangeFooterMultiLanguage()}/>
//                       <span className="slider"></span>
//                     </label>
//                     <p className={`text-uppercase fw-bold m-0 ${globalDataState.footer.multiLanguage ? '':'disabled-label'}`}>Multi languages</p>
//                   </div>

//                   <p className="fw-bold fs-5 pt-4">Visible pages</p>
//                   {
//                     Object.entries(globalDataState.footer.elements).map(([key, value]) => (
//                       <div key={key} className="d-flex gap-3 align-items-center my-4">
//                         <label className="switch">
//                           <input type="checkbox" checked={value} onChange={() => handleFooterVisiblePagesChange(key)}/>
//                           <span className="slider"></span>
//                         </label>
//                         <p className={`text-uppercase fw-bold m-0 ${value ? '':'disabled-label'}`}>{key}</p>
//                       </div>
//                     )
//                   )}

//                 </div>
//                 <div className="col-sm-12 col-md-5 pe-5">
//                   <p className="fw-bold fs-5">E-mail</p>
//                     <div className="d-flex gap-3 align-items-center pb-5">
//                       <input 
//                         type="text"
//                         value={globalDataState.footer.email.mail}
//                         onChange={onChangeFooterEmail}
//                         placeholder='E-mail'
//                         className="w-100 p-2 input-contact"
//                       />
//                       <label className="switch">
//                         <input type="checkbox" checked={globalDataState.footer.email.show} onChange={() => onchangeFooterShowEmail()}/>
//                         <span className="slider"></span>
//                       </label>
//                     </div>
//                   <p className="fw-bold fs-5">Visible contacts</p>
//                   {
//                     Object.entries(globalDataState.footer['socialContacts']).map(([key, value]) => (
//                       <div key={key} className="my-4">
//                         <p className="text-uppercase fw-bold m-0">{key}</p>
//                         <div className="d-flex gap-3 align-items-center">
//                           <input 
//                             type="text"
//                             value={value.link}
//                             onChange={(e) => handleFooterLinkChange(key, e.target.value)}
//                             placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
//                             className="w-100 p-2 input-contact"
//                           />
//                           <label className="switch">
//                             <input type="checkbox" checked={value.status} onChange={() => handleFooterStatusChange(key)}/>
//                             <span className="slider"></span>
//                           </label>
//                         </div>
//                       </div>
//                     )
//                   )}
//                 </div>
//                 <div className="col-sm-12 col-md-4">
//                   <p className="fw-bold fs-5">Bottom text</p>
//                   <textarea 
//                     rows="8" cols="40"
//                     value={globalDataState.footer.text}
//                     onChange={onChangeFooterText}
//                     placeholder='Bottom text...'
//                     className="w-100 p-2 input-contact"
//                   />
//                 </div>
//               </div>

//               <p className="fw-bold fs-6 pt-4">Privacy policy</p>
//               <input 
//                 type="text"
//                 value={globalDataState.privacyPolicyLink}
//                 onChange={onChangePrivacyPolicyLink}
//                 placeholder='E-mail'
//                 className="w-75 p-2 input-contact"
//               />

//               <p className="fw-bold fs-6 pt-4">Cookie policy</p>
//               <input 
//                 type="text"
//                 value={globalDataState.cookiePolicyLink}
//                 onChange={onChangeCookiePolicyLink}
//                 placeholder='E-mail'
//                 className="w-75 p-2 input-contact"
//               />
//               <br/>
//               <br/>
//               <div className="footer p-3">

//                 <div className='p-4 pb-0'>
//                   <div className='d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-center'>
//                     <img src={SydeaLogoLight} className='footer-logo' alt='Sydea Logo'></img>
//                     <div>
//                       <div className='d-flex flex-column gap-3'></div>
//                       {
//                         globalDataState.footer.multiLanguage && 
//                         <div className="dropdown mb-3">
//                           <span className="btn-language text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center dark-mode-text transition-03s-eio">
//                             <span className={`fi fi-gb`}></span>
//                             <span>English</span>
//                           </span>
//                         </div>
//                       }
//                         {
//                           globalDataState.footer.email.show && 
//                           <p>{globalDataState.footer.email.mail}</p>
//                         }
//                       </div>
//                   </div>
                  
//                   <div className='d-flex flex-column flex-sm-row py-3 justify-content-between'>
//                     <ul id='footer-items' className='d-flex flex-column flex-sm-row align-items-start align-items-sm-center m-0 p-0 gap-4'>
//                     {
//                       Object.entries(globalDataState.footer.elements).map(([key, value]) => (
//                         value &&
//                         <li key={key}>
//                           <div className="text-deco-none transition-03s-eio syd-yellow">
//                             <p className="m-0">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
//                           </div>
//                         </li>
//                       )
//                     )}
//                     </ul>
//                     <div className='d-flex py-3 gap-3'>
//                     {
//                       Object.entries(globalDataState.footer['socialContacts']).map(([key, value]) => (
//                         (
//                           value.status && 
//                           <div className='social-link'>
//                             <img src={require(`../../assets/social/${key}.png`)} className='logo-social' alt='Linkedin logo'></img>
//                           </div>
//                         )
//                       )
//                     )}
//                     </div>
//                   </div>
                  
//                   {
//                     globalDataState.footer.showOffice &&
//                     <div className='pt-3 d-flex aling-items-center justify-content-center'>
//                       {globalDataState.offices.map((office, index) => (
//                         <div className="m-0 d-flex justify-content-between">
//                           <p key={index}  href={TranslationsService.getGlobalValue('bologna_google_maps')} target='_blank' rel="noreferrer" className="text-deco-none transition-03s-eio ref-offices-footer">
//                             {office.name}
//                           </p>
//                           {
//                             globalDataState.offices.length > (index + 1) && 
//                             <span className="px-2">|</span>
//                           }
//                         </div>
//                       ))}
//                     </div>
//                   }
                  
//                   <div className='pt-3'>
//                     <p className='syd-paragraph text-center m-0'>© {currentYear} {globalDataState.footer.text}</p>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>

//       </div>

//     </div>

//     </MsalAuthenticationTemplate>
//   );
// };
