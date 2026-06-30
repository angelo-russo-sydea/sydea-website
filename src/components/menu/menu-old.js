import React, { useState, useContext, useEffect, useRef } from "react";
import './menu.scss';
import SydeaLogoDark from '../../assets/logo/sydea_b.svg';
import IndastriaLogoDark from '../../assets/logo/indastria_b.svg';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../services/translationContext";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useParams } from 'react-router-dom';

const currentYear = new Date().getFullYear();
const appOwner = process.env.REACT_APP_OWNER;

const useLanguageDropdown = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { services: { TranslationsService } } = useContext(AppContext);

  const pathSegments = location.pathname.split('/');
  const currentLang = (pathSegments[1] === 'it' || pathSegments[1] === 'en') ? pathSegments[1] : 'en';

  const [selectedLang, setSelectedLang] = useState(currentLang);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen(prev => !prev);

  const handleLanguageSelect = (lang) => {
    if(lang === selectedLang){
        setOpen(false);
        return;
    }
    TranslationsService.setLanguageFromRouter(lang);
    setSelectedLang(lang);
    setOpen(false);
    pathSegments[1] = lang;
    const newPath = pathSegments.join('/') || `/${lang}`;
    // navigate(newPath);
    window.location.href = newPath;
  };

  useEffect(() => {
    TranslationsService.setLanguageFromRouter(currentLang);
  }, [currentLang]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    selectedLang,
    open,
    toggleDropdown,
    handleLanguageSelect,
    dropdownRef,
    TranslationsService,
  };
};

const LanguageDropdown = () => {
    const {
      selectedLang,
      open,
      toggleDropdown,
      handleLanguageSelect,
      dropdownRef
    } = useLanguageDropdown();
 
  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={toggleDropdown}>
        <span>
            <svg fill="currentcolor" height="20px" width="20px" version="1.1" viewBox="0 0 512 512" enableBackground="new 0 0 512 512">
                <g>
                    <path d="m256,11c-135.3,0-245,109.7-245,245 0,135.3 109.7,245 245,245s245-109.7 245-245c0-135.3-109.7-245-245-245zm10,467.9c-0.5,0-1.1,0-1.6,0.1v-95.3h77.9c-17.5,51.9-45.1,88.2-76.3,95.2zm-98.4-95.2h76v95.1c-0.1,0-0.1,0-0.2,0-31-7.3-58.4-43.5-75.8-95.1zm-134.5-117.3h94.3c0.7,34.7 5,67.3 12.2,96.5h-79.5c-15.8-28.9-25.4-61.7-27-96.5zm309.2-138.1h-77.9v-95.3c0.5,0 1.1,0 1.6,0.1 31.2,7 58.8,43.3 76.3,95.2zm6.2,20.8c7.7,29.1 12.4,61.9 13.2,96.5h-97.4v-96.5h84.2zm-105.1-115.9c0.1,0 0.1,0 0.2,0v95.1h-76c17.4-51.6 44.8-87.8 75.8-95.1zm.2,115.9v96.5h-95.4c0.8-34.6 5.5-67.5 13.2-96.5h82.2zm-116.2,96.5h-94.3c1.6-34.9 11.2-67.6 27-96.5h79.5c-7.2,29.2-11.5,61.8-12.2,96.5zm20.8,20.8h95.4v96.5h-82.2c-7.7-29.1-12.4-61.9-13.2-96.5zm116.2,96.5v-96.5h97.4c-0.8,34.6-5.5,67.5-13.2,96.5h-84.2zm118.1-96.5h96.4c-1.6,34.9-11.2,67.6-27,96.5h-81.6c7.2-29.2 11.5-61.8 12.2-96.5zm0-20.8c-0.7-34.7-5-67.3-12.2-96.5h81.6c15.8,28.9 25.4,61.7 27,96.5h-96.4zm56.5-117.3h-74.5c-11.3-36.4-27.5-66.3-46.9-86.8 49.8,14.3 92.5,45.4 121.4,86.8zm-247.5-86c-19,20.5-34.9,50.1-46.1,86h-72.4c28.4-40.6 70-71.3 118.5-86zm-118.5,341.4h72.4c11.2,35.9 27.1,65.5 46.1,86-48.5-14.7-90.1-45.4-118.5-86zm244.6,86.8c19.4-20.5 35.6-50.5 46.9-86.9h74.5c-28.9,41.5-71.6,72.7-121.4,86.9z"/>
                </g>
            </svg>
        </span>
        {selectedLang.toUpperCase()}
        <span className={`arrow-drop-lang ${open ? 'rotate' : ''}`}>
            <svg width="12px" height="12px" viewBox="0 0 383.33 216.67">
                <path d="M358.33,25l-166.67,166.67L25,25" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="50"/>
            </svg>
        </span>
      </div>
      {open && (
        <div className="dropdown-list">
          <div className="dropdown-item" onClick={() => handleLanguageSelect('en')}>EN</div>
          <div className="dropdown-item" onClick={() => handleLanguageSelect('it')}>IT</div>
        </div>
      )}
    </div>
  );
};
export default LanguageDropdown;

const LanguageDropdownMobile = ({ 
    selectedLang, 
    handleLanguageSelect, 
    showLanguageMob, 
    setShowLanguageMob 
 }) => {
  
    return (
        <li className='nav-menu-item-mob py-2'>
            <p className="fs-2 text-uppercase m-0 d-flex align-items-center justify-content-between"
            onClick={() => setShowLanguageMob(true)}>
            {/* onClick={() => handleLanguageSelect(selectedLang === 'it' ? 'en' : 'it')}> */}
            <span className="d-flex gap-3">
                <span>
                    <svg fill="currentcolor" height="20px" width="20px" version="1.1" viewBox="0 0 512 512" enableBackground="new 0 0 512 512">
                        <g>
                            <path d="m256,11c-135.3,0-245,109.7-245,245 0,135.3 109.7,245 245,245s245-109.7 245-245c0-135.3-109.7-245-245-245zm10,467.9c-0.5,0-1.1,0-1.6,0.1v-95.3h77.9c-17.5,51.9-45.1,88.2-76.3,95.2zm-98.4-95.2h76v95.1c-0.1,0-0.1,0-0.2,0-31-7.3-58.4-43.5-75.8-95.1zm-134.5-117.3h94.3c0.7,34.7 5,67.3 12.2,96.5h-79.5c-15.8-28.9-25.4-61.7-27-96.5zm309.2-138.1h-77.9v-95.3c0.5,0 1.1,0 1.6,0.1 31.2,7 58.8,43.3 76.3,95.2zm6.2,20.8c7.7,29.1 12.4,61.9 13.2,96.5h-97.4v-96.5h84.2zm-105.1-115.9c0.1,0 0.1,0 0.2,0v95.1h-76c17.4-51.6 44.8-87.8 75.8-95.1zm.2,115.9v96.5h-95.4c0.8-34.6 5.5-67.5 13.2-96.5h82.2zm-116.2,96.5h-94.3c1.6-34.9 11.2-67.6 27-96.5h79.5c-7.2,29.2-11.5,61.8-12.2,96.5zm20.8,20.8h95.4v96.5h-82.2c-7.7-29.1-12.4-61.9-13.2-96.5zm116.2,96.5v-96.5h97.4c-0.8,34.6-5.5,67.5-13.2,96.5h-84.2zm118.1-96.5h96.4c-1.6,34.9-11.2,67.6-27,96.5h-81.6c7.2-29.2 11.5-61.8 12.2-96.5zm0-20.8c-0.7-34.7-5-67.3-12.2-96.5h81.6c15.8,28.9 25.4,61.7 27,96.5h-96.4zm56.5-117.3h-74.5c-11.3-36.4-27.5-66.3-46.9-86.8 49.8,14.3 92.5,45.4 121.4,86.8zm-247.5-86c-19,20.5-34.9,50.1-46.1,86h-72.4c28.4-40.6 70-71.3 118.5-86zm-118.5,341.4h72.4c11.2,35.9 27.1,65.5 46.1,86-48.5-14.7-90.1-45.4-118.5-86zm244.6,86.8c19.4-20.5 35.6-50.5 46.9-86.9h74.5c-28.9,41.5-71.6,72.7-121.4,86.9z"/>
                        </g>
                    </svg>
                </span>
                {selectedLang.toUpperCase()}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--sydYellow)">
                <path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/>
            </svg>
            </p>
        </li>
    );
  };
  

export const MenuOld = () => {
    const { lang } = useParams();
    const { services: {TranslationsService} } = useContext(AppContext);
    const { services, language } = useContext(AppContext);

    const { instance, inProgress } = useMsal();
    let activeAccount;
  
    if (instance) {
        activeAccount = instance.getActiveAccount();
    }

    const isAuthenticated = useIsAuthenticated();

    const signIn = () => {
        instance.loginRedirect().catch((error) => console.log(error));
      };

    // useEffect(() => {
    //     // console.log('activeAccount', activeAccount);
    //   }, [isAuthenticated]);

    const [showServices, setShowServices] = useState(false);
    const [showServicesFake, setShowServicesFake] = useState(true);
    const [showProducts, setShowProducts] = useState(false);
    const [showIndustries, setShowIndustries] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [showCareers, setShowCareers] = useState(false);
    const [showLanguageMob, setShowLanguageMob] = useState(false);
    const [showLocationsMob, setShowLocationsMob] = useState(false);

    const {
        selectedLang,
        toggleDropdown,
        handleLanguageSelect,
        dropdownRef
      } = useLanguageDropdown();

    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };

    const navigate = useNavigate();
    
    const setSelectedLangue = (languSel) =>{
        TranslationsService.setLanguage(languSel);
      }

    const mouseEventServices = (isShow) => {
        closeAllTabs();
        setShowServices(isShow);
    }
    const mouseEventProducts = (isShow) => {
        closeAllTabs();
        setShowProducts(isShow);
    }
    const mouseEventIndustries = (isShow) => {
        closeAllTabs();
        setShowIndustries(isShow);
    }
    const mouseEventInsights = (isShow) => {
        closeAllTabs();
        setShowInsights(isShow);
    }
    const mouseEventAbout = (isShow) => {
        closeAllTabs();
        setShowAbout(isShow);
    }
    const mouseEventCareers = (isShow) => {
        closeAllTabs();
        setShowCareers(isShow);
    }

    const closeAllTabs = () =>{
        setShowCareers(false);
        setShowInsights(false);
        setShowServices(false);
        setShowProducts(false);
        setShowIndustries(false);
        setShowAbout(false);
    }

    const navMouseLeave = () => {
        closeAllTabs();
    };
    
    document.addEventListener("mouseleave", navMouseLeave);

    const hideMobileMenu = () => {
        const target = document.querySelector('#btn-close-off-mobile');
        target.click();
    };

    const signOut = () => {
        instance.logoutRedirect();
      };

  return (
    <>
        {/* {
            isAuthenticated &&
            <div className="nav-auth px-3 p-1 d-flex align-items-center justify-content-between">
                <div className="w-75">
                    <ul className="d-flex">
                    {
                        TranslationsService.getEmployeeMenu()?.map((item,indice) => (
                            <li key={indice}>
                                <a href={item.link} target="_blank">{item.label}</a>
                            </li>
                    ))
                    }
                    </ul>
                </div>
                <div className="d-flex gap-2 align-items-center w-25 justify-content-end">
                {
                    activeAccount && 
                    <div>
                        <p className='m-0'>{activeAccount.username}</p>
                    </div>
                }
                {
                    activeAccount && 
                    <button className='syd-button m-0 btn-signout-nav p-2 d-flex' onClick={signOut} title='Sign out'>
                        <svg fill="#ffffff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 198.715 198.715" stroke="#ffffff">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <g>
                                    <path d="M161.463,48.763c-2.929-2.929-7.677-2.929-10.607,0c-2.929,2.929-2.929,7.677,0,10.606 c13.763,13.763,21.342,32.062,21.342,51.526c0,19.463-7.579,37.761-21.342,51.523c-14.203,14.204-32.857,21.305-51.516,21.303 c-18.659-0.001-37.322-7.104-51.527-21.309c-28.405-28.405-28.402-74.625,0.005-103.032c2.929-2.929,2.929-7.678,0-10.606 c-2.929-2.929-7.677-2.929-10.607,0C2.956,83.029,2.953,138.766,37.206,173.019c17.132,17.132,39.632,25.697,62.135,25.696 c22.497-0.001,44.997-8.564,62.123-25.69c16.595-16.594,25.734-38.659,25.734-62.129C187.199,87.425,178.059,65.359,161.463,48.763 z"></path>
                                    <path d="M99.332,97.164c4.143,0,7.5-3.358,7.5-7.5V7.5c0-4.142-3.357-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v82.164 C91.832,93.807,95.189,97.164,99.332,97.164z"></path>
                                </g>
                            </g>
                        </svg>
                    </button>
                }
                </div>
            </div>
        } */}
        <nav id="main-nav" className="navbar sticky-top d-block p-0 navbar-bg d-none d-lg-flex align-items-center justify-content-between transition-03s-eio">
        {
            appOwner === 'sydea' && isAuthenticated &&
            <ul className="w-100 m-0 p-0" id="auth-menu">
                <div className="nav-auth px-3 p-1 d-flex align-items-center justify-content-between w-100">
                    {/* <div className="w-75">
                        <ul className="d-flex">
                        {
                            TranslationsService.getEmployeeMenu()?.map((item,indice) => (
                                <li key={indice}>
                                    <a href={item.link} target={`${item.link === '/org-chart' ? 'self':'_blank'}`}>{item.label}</a>
                                </li>
                        ))
                        }
                        </ul>
                    </div> */}
                    <div className="d-flex gap-2 align-items-center w-100 justify-content-end">
                    {
                        activeAccount && 
                        <div>
                            <p className='m-0'>{activeAccount.username}</p>
                        </div>
                    }
                    {
                        activeAccount && 
                        <button className='syd-button m-0 btn-signout-nav p-2 d-flex' onClick={signOut} title='Sign out'>
                            <svg fill="#ffffff" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 198.715 198.715" stroke="#ffffff">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <path d="M161.463,48.763c-2.929-2.929-7.677-2.929-10.607,0c-2.929,2.929-2.929,7.677,0,10.606 c13.763,13.763,21.342,32.062,21.342,51.526c0,19.463-7.579,37.761-21.342,51.523c-14.203,14.204-32.857,21.305-51.516,21.303 c-18.659-0.001-37.322-7.104-51.527-21.309c-28.405-28.405-28.402-74.625,0.005-103.032c2.929-2.929,2.929-7.678,0-10.606 c-2.929-2.929-7.677-2.929-10.607,0C2.956,83.029,2.953,138.766,37.206,173.019c17.132,17.132,39.632,25.697,62.135,25.696 c22.497-0.001,44.997-8.564,62.123-25.69c16.595-16.594,25.734-38.659,25.734-62.129C187.199,87.425,178.059,65.359,161.463,48.763 z"></path>
                                        <path d="M99.332,97.164c4.143,0,7.5-3.358,7.5-7.5V7.5c0-4.142-3.357-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v82.164 C91.832,93.807,95.189,97.164,99.332,97.164z"></path>
                                    </g>
                                </g>
                            </svg>
                        </button>
                    }
                    </div>
                </div>
            </ul>
        }
            <ul id="syd-menu" className='d-flex p-3 align-items-center'>
                <li>
                    <Link to={`/${lang}`}  onMouseEnter={()=>closeAllTabs()} >
                        {
                            appOwner === 'sydea' &&
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

                                // <svg id="sydea-10th-anniversary" viewBox="0 0 758 262.26" className='logo-nav transition-03s-eio'>
                                //     <path d="M443,55.9v75c0,14-2.8,24.8-8.2,32.5-5.5,7.7-14.5,13.1-27,16.2s-29.8,4.7-52,4.7h-87v-67.5l42.8-65.3v101.4h42.2c12.1,0,21.3-.5,27.4-1.6,6.2-1,10.6-3.1,13.4-6.1,2.7-3,4.1-7.8,4.1-14.2V55.2c0-8.7-3.4-14.8-10.4-18.3-6.5-3.3-16.6-5-30.3-5.2h-.8l-69.9.1-47.9,78.3v74.4h-44.3v-73.8l-47.9-79.3c-30.7.1-67.6.4-75.3.4-14.9,0,1.5.1-7.3.1-12,0-20.3,9.8-20.3,15.5v10.3c0,9.6,8.1,14.5,24.4,14.5h37.5c21,0,36.2,3.9,45.7,11.6,9.5,7.8,14.2,19.6,14.2,35.5v12.2c0,22-4.1,35.3-15.9,43.8-10.6,7.6-26,9.1-36.2,9.1-9.3,0-14.1.7-27.5.5-16.2-.1-55.9.3-86.4-.1v-29.5c31.3,0,76.1.1,87.9.1,21.2,0,33.9.7,33.9-19.1v-11.9c0-6-1.8-10.7-5.3-13.9-3.5-3.2-9.8-4.8-18.9-4.8h-36.9C20.3,105.7,0,89.6,0,57.4v-13.6C0,27.7,6.7,15.9,20.2,8.3,33.6.7,34.2.4,63.4.4h65.2l-.1-.1h50.2l38.9,72.1L256.2.3h99.4c6.1,0,11.8.1,17.1.4,13.6.7,25,2.2,34,4.6,12.5,3.3,21.7,9,27.5,17.2,5.8,7.8,8.8,19,8.8,33.4Z" className="syd-logo-main-color"/>
                                //     <polygon points="563.4 147.3 563.4 184.2 455.3 184.2 455.3 120.9 492.4 120.9 492.4 147.3 563.4 147.3" className="syd-logo-main-color"/>
                                //     <path d="M587.2,120.9l-23.4,63.4h43.7l21.3-63.4h-41.6ZM729.5,120.9h-43.2l21.2,63.4h44.8l-22.8-63.4ZM685.9,0h-53.9l-33,89.3h40.5l17.6-52.4h1.1l17.6,52.4h42.5L685.9,0Z" className="syd-logo-main-color"/>
                                //     <polygon points="563.8 0 563.8 36.9 492.4 36.9 492.4 89.4 455.3 89.4 455.3 0 563.8 0" className="syd-logo-main-color"/>
                                //     <polygon points="492.4 120.9 492.4 89.3 563.5 89.4 563.5 48 587.3 120.9 492.4 120.9" fill="#fece2f"/>
                                //     <polygon points="758 120.9 628.8 120.9 639.4 89.4 746.6 89.4 758 120.9" fill="#fece2f"/>
                                //     <polygon points="581.59 217.54 581.59 262.26 626.35 262.26 608.06 239.9 626.35 217.54 581.59 217.54" fill="#f9b903"/>
                                //     <polygon points="176.41 217.54 176.41 262.26 131.65 262.26 149.94 239.9 131.65 217.54 176.41 217.54" fill="#f9b903"/>
                                //     <rect x="165.28" y="204.54" width="427.45" height="50.96" fill="#fece2f"/>
                                //     <path d="M187.55,221.48l-8.53,5.58v-3.55l8.57-5.93h3.72v28.1h-3.77v-24.2Z"/>
                                //     <path d="M212.08,245.99c-.79-.09-1.64-.26-2.53-.52-.95-.26-1.71-.64-2.27-1.15-.56-.5-1.03-1.22-1.41-2.14-.38-.87-.56-1.95-.56-3.25v-14.2c0-1.3.19-2.44.56-3.42s.87-1.76,1.47-2.34c.55-.49,1.28-.89,2.19-1.19.91-.3,1.83-.5,2.75-.58,1.04-.06,2.01-.09,2.9-.09,1.27,0,2.3.04,3.1.13.79.09,1.64.26,2.53.52.95.29,1.72.69,2.32,1.21.59.52,1.08,1.25,1.45,2.21.38.95.56,2.12.56,3.51v14.24c0,1.18-.19,2.24-.56,3.16-.38.92-.87,1.65-1.47,2.17-.58.49-1.31.89-2.21,1.19-.9.3-1.8.48-2.73.54-.81.09-1.8.13-2.99.13-1.27,0-2.3-.04-3.1-.13ZM218.81,243.24c.84-.22,1.44-.64,1.82-1.28.37-.63.56-1.57.56-2.81v-14.72c0-1.36-.19-2.37-.58-3.05-.39-.68-1-1.13-1.82-1.36s-2.01-.35-3.57-.35-2.79.12-3.62.35-1.42.69-1.8,1.36c-.38.68-.56,1.7-.56,3.05v14.72c0,1.24.19,2.18.58,2.81.39.64,1,1.06,1.84,1.28.84.22,2.04.33,3.59.33s2.71-.11,3.55-.33Z"/>
                                //     <path d="M264.53,217.58h4.85l10.91,28.1h-4.37l-3.2-8.53h-12.04l-3.16,8.53h-4.16l11.17-28.1ZM271.67,234.25l-4.76-12.69h-.39l-4.76,12.69h9.91Z"/>
                                //     <path d="M288.38,217.58h5.07l15.28,23.21v-23.21h3.68v28.1h-5.07l-15.28-23.6v23.6h-3.68v-28.1Z"/>
                                //     <path d="M323.5,217.58h5.07l15.28,23.21v-23.21h3.68v28.1h-5.07l-15.28-23.6v23.6h-3.68v-28.1Z"/>
                                //     <path d="M358.61,217.58h4.2v28.1h-4.2v-28.1Z"/>
                                //     <path d="M370.9,217.58h4.37l9.01,24.12h.39l9.01-24.12h4.16l-11.17,28.1h-4.85l-10.91-28.1Z"/>
                                //     <path d="M405.93,217.58h18.88v2.94h-14.68v9.18h13.25v2.94h-13.25v10.09h15.11v2.94h-19.31v-28.1Z"/>
                                //     <path d="M434.85,217.58h9.87c2.48,0,4.42.15,5.82.45,1.4.3,2.42.84,3.07,1.62s.97,1.92.97,3.42v4.85c0,1.67-.69,2.97-2.06,3.88-1.37.91-3.11,1.36-5.22,1.36l9.01,12.51h-5.15l-8.05-11.99h-4.07v11.99h-4.2v-28.1ZM444.55,230.92c2.08,0,3.57-.25,4.48-.76.91-.5,1.36-1.42,1.36-2.75v-3.9c0-2.11-1.82-3.16-5.46-3.16h-5.89v10.56h5.5Z"/>
                                //     <path d="M465.55,245.42v-3.51c3.35.72,6.29,1.08,8.83,1.08,2.14,0,3.69-.24,4.68-.71.98-.48,1.47-1.36,1.47-2.66v-3.64c0-1.21-.35-2.06-1.04-2.55-.69-.49-1.91-.74-3.64-.74h-3.29c-2.74,0-4.69-.55-5.85-1.65-1.15-1.1-1.73-2.8-1.73-5.11v-2.25c0-1.53.34-2.77,1.02-3.72.68-.95,1.82-1.66,3.42-2.12,1.6-.46,3.8-.69,6.6-.69,1.88,0,4.29.16,7.23.48v3.16c-3.29-.49-5.8-.74-7.53-.74-2.68,0-4.46.26-5.33.78-.9.55-1.34,1.46-1.34,2.73v3.2c0,.98.35,1.7,1.06,2.14.71.45,1.93.67,3.66.67h3.38c1.93,0,3.44.23,4.52.69,1.08.46,1.85,1.16,2.29,2.1.45.94.67,2.2.67,3.79v2.04c0,1.99-.37,3.57-1.1,4.72-.74,1.15-1.87,1.98-3.4,2.47-1.53.49-3.54.74-6.02.74s-5.25-.23-8.57-.69Z"/>
                                //     <path d="M502.65,217.58h4.85l10.91,28.1h-4.37l-3.2-8.53h-12.04l-3.16,8.53h-4.16l11.17-28.1ZM509.79,234.25l-4.76-12.69h-.39l-4.76,12.69h9.91Z"/>
                                //     <path d="M526.5,217.58h9.87c2.48,0,4.42.15,5.82.45,1.4.3,2.42.84,3.07,1.62s.97,1.92.97,3.42v4.85c0,1.67-.69,2.97-2.06,3.88-1.37.91-3.11,1.36-5.22,1.36l9.01,12.51h-5.15l-8.05-11.99h-4.07v11.99h-4.2v-28.1ZM536.2,230.92c2.08,0,3.57-.25,4.48-.76.91-.5,1.36-1.42,1.36-2.75v-3.9c0-2.11-1.82-3.16-5.46-3.16h-5.89v10.56h5.5Z"/>
                                //     <path d="M564.56,234.34l-10.17-16.75h4.81l7.49,13.21,7.49-13.21h4.81l-10.22,16.62v11.47h-4.2v-11.34Z"/>
                                //     <path d="M233.96,223.36c-.32-.12-.54-.33-.68-.62-.14-.29-.21-.71-.21-1.24v-3.85h-1.46v-.8h1.46v-2.03h1.23v2.03h2.34v.8h-2.34v3.91c0,.33.04.57.12.73.08.16.21.28.41.34.19.07.48.1.85.1.12,0,.44-.04.98-.11v.8c-.46.07-.92.11-1.37.11-.56,0-1-.06-1.31-.18Z"/>
                                //     <path d="M239.16,213.93h1.22v3.72c.13-.62.84-.93,2.15-.93.84,0,1.43.15,1.77.45.34.3.51.78.51,1.43v4.81h-1.22v-4.73c0-.17-.01-.31-.04-.42-.03-.11-.08-.22-.16-.33-.18-.23-.58-.34-1.21-.34-.5,0-.87.03-1.13.1-.26.07-.43.18-.53.33s-.14.37-.14.65v4.73h-1.22v-9.48Z"/>
                                // </svg>

                                // <img src={require('../../assets/logo/sydea-christmas.png')} alt="Sydea logo" className="logo-nav"></img>
                        }
                        {
                            appOwner === 'indastria' &&
                            <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1799.22 237.53" className='logo-nav-indastria transition-03s-eio'>
                                <path className="syd-logo-main-color" d="M858.48,40.53c-19.16,0,1.93.13-9.39.13-15.44,0-26.11,12.6-26.11,19.94v13.24c0,12.35,10.41,18.65,31.38,18.65h48.22c27,0,46.55,5.02,58.77,14.92,12.21,10.03,18.26,25.21,18.26,45.65v15.69c0,28.3-5.27,45.39-20.45,56.33-13.63,9.77-33.43,11.7-46.55,11.7-11.96,0-18.13.9-35.37.65-20.83-.13-71.88.38-111.1-.13v-37.93c40.25,0,97.86.13,113.03.13,27.26,0,43.59.9,43.59-24.56v-15.3c0-7.71-2.31-13.76-6.82-17.88-4.5-4.11-12.6-6.17-24.31-6.17h-47.45c-52.08,0-78.19-20.7-78.19-62.11v-17.49c0-20.7,8.61-35.88,25.98-45.65C809.23.54,810,.16,847.55.16h83.84l-.13-.13h48.48v40h-24.43c-39.48.13-86.93.51-96.83.51h0Z"/>
                                <path className="syd-logo-main-color" d="M529.3,155.55l-30.09,81.53h56.2l27.39-81.53h-53.5ZM712.3,155.55h-55.55l27.26,81.53h57.61l-29.32-81.53ZM656.23.08h-69.31l-42.44,114.84h52.08l22.63-67.38h1.41l22.63,67.38h54.65L656.23.08Z"/>
                                <polygon className="syd-logo-main-color" points="748.95 155.55 582.8 155.55 596.43 115.05 734.29 115.05 748.95 155.55"/>
                                <path className="syd-logo-main-color" d="M1579.58,155.99l-30.09,81.53h56.2l27.39-81.53h-53.5ZM1762.57,155.99h-55.55l27.26,81.53h57.61l-29.32-81.53ZM1706.5.52h-69.31l-42.44,114.84h52.08l22.63-67.38h1.41l22.63,67.38h54.65L1706.5.52Z"/>
                                <polygon className="syd-logo-arrow" points="1799.22 155.99 1633.07 155.99 1646.71 115.48 1784.56 115.48 1799.22 155.99"/>
                                <path className="syd-logo-main-color" d="M0,0h60.69v237.51H0V0Z"/>
                                <path className="syd-logo-main-color" d="M1074.63,40.63h-77.8V0h215.9v40.62h-77.41v196.89h-60.69V40.63Z"/>
                                <path className="syd-logo-main-color" d="M1229.8,0h113.59c33.71,0,58.09,3.84,73.13,11.53,15.04,7.68,22.56,20.56,22.56,38.61v41.72c0,13.91-5.25,24.83-15.76,32.75-10.5,7.93-24.45,12.99-41.82,15.19l73.13,97.71h-70.02l-66.13-93.32h-28.01v93.32h-60.69V0h.02ZM1342.62,106.5c14.26,0,23.99-1.77,29.18-5.31,5.19-3.53,7.78-10.43,7.78-20.68v-16.83c0-8.78-2.79-14.82-8.36-18.11-5.58-3.29-15.11-4.94-28.59-4.94h-52.13v65.87h52.13-.01Z"/>
                                <path className="syd-logo-main-color" d="M1471.73,0h60.69v237.51h-60.69V0Z"/>
                                <path className="syd-logo-main-color" d="M470.09,28.54c-8.03-10.48-20.6-17.84-37.72-22.14C415.23,2.14,391.88,0,362.31,0h-100.95v162.11l-6.39-8.46L139.21,0h-61.45v237.53h54.07V72.85l122.15,164.68h108.74c30.34,0,54.07-2.02,71.19-6.03s29.43-10.99,36.95-20.89c7.52-9.86,11.28-23.85,11.28-41.88v-96.65c0-18.49-4.02-33.03-12.04-43.54h-.01ZM421.48,168.72c0,8.29-1.92,14.4-5.65,18.3-3.75,3.89-9.86,6.54-18.3,7.86-8.41,1.35-20.96,2.02-37.55,2.02h-44.33V40.61h46.28c20.75,0,35.87,2.28,45.32,6.8,9.47,4.52,14.23,12.38,14.23,23.58v97.73h0Z"/>
                            </svg>
                        }
                    </Link>
                </li>
                {/* {
                    TranslationsService.sectionAvailable('services') &&
                    <li>
                        <NavLink to={`/${lang}/services`} className={({ isActive }) => `${isActive ? "is-active-navlink " : ""}d-flex gap-1 fw-bold`} onMouseEnter={()=>mouseEventServices(true)} onClick={() => mouseEventServices(false)}>
                            {TranslationsService.labels(`menu.services.label`)}
                            <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 17.12" className={`arrow-icon-nav ${showServices ? 'rotated':''} transition-03s-eio`}><path d="m29.96,2.14c0,.55-.21,1.09-.63,1.51l-12.84,12.84c-.4.4-.94.63-1.51.63s-1.11-.22-1.51-.63L.63,3.65C-.21,2.82-.21,1.47.63.63,1.47-.21,2.82-.21,3.65.63l11.32,11.32L26.3.63c.84-.84,2.19-.84,3.03,0,.42.42.63.96.63,1.51Z"/></svg>
                        </NavLink>
                        <ul className={`nav-box-detail p-4 detail-menu-services transition-03s-eio ${showServices ? 'show':'hide'}`} onMouseLeave={()=>mouseEventServices(false)}>
                            <li>
                                <section>
                                    <div className="d-flex">
                                        <div className="primary-nav-col">
                                        <ul id="syd-submenu" className="d-flex flex-wrap">
                                        {
                                            Object.entries(TranslationsService.labels('services')).map(([area, areaValue], indice) => (
                                            <li key={indice} className="w-50" style={{ order: areaValue.orderMenu }} >
                                                <Link to={`/${lang}/services/${area}`} className="category-submenu" onClick={() => mouseEventServices(false)}>
                                                    {areaValue.title}
                                                </Link>
                                                <div>
                                                <ul>
                                                    {
                                                    areaValue.items && Object.keys(areaValue.items).length > 0 ? (
                                                        Object.entries(areaValue.items)
                                                        .filter(([key, val]) => typeof val === 'object' && val.title)
                                                        .map(([subKey, subValue], i) => (
                                                            <li key={i}>
                                                            <Link to={`/${lang}/services/${area}/${subKey}`} className="category-submenu" onClick={() => mouseEventServices(false)}>
                                                                {subValue.title}
                                                            </Link>
                                                            {
                                                                Object.entries(subValue)
                                                                .filter(([k, v]) => typeof v === 'object' && v.title)
                                                                .map(([subSubKey, subSubValue], j) => (
                                                                    <li key={j} className="ms-2 my-1">
                                                                    <Link to={`/${lang}/services/${area}/${subKey}/${subSubKey}`} onClick={() => mouseEventServices(false)}>
                                                                        {subSubValue.title}
                                                                    </Link>
                                                                    </li>
                                                                ))
                                                            }
                                                            </li>
                                                        ))
                                                    ) : (
                                                        Object.entries(areaValue)
                                                        .filter(([key, val]) => typeof val === 'object' && val.title)
                                                        .map(([subKey, subValue], i) => (
                                                            <li key={i} className="ms-2 my-1">
                                                                <Link to={`/${lang}/services/${area}/${subKey}`} onClick={() => mouseEventServices(false)}>
                                                                    {subValue.title}
                                                                </Link>
                                                            </li>
                                                        ))
                                                    )
                                                    }
                                                </ul>
                                                </div>
                                            </li>
                                            ))
                                        }
                                        </ul>

                                        </div>
                                    </div>
                                </section>
                            </li>
                        </ul>
                    </li>
                } */}
                {
                    TranslationsService.sectionAvailable('services') &&
                    <li>
                        <NavLink to={`/${lang}/services`} className={({ isActive }) => `${isActive ? "is-active-navlink " : ""}d-flex gap-1 fw-bold`} onMouseEnter={()=>mouseEventServices(true)} onClick={() => mouseEventServices(false)}>
                            {TranslationsService.labels(`menu.services.label`)}
                            <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 17.12" className={`arrow-icon-nav ${showServices ? 'rotated':''} transition-03s-eio`}><path d="m29.96,2.14c0,.55-.21,1.09-.63,1.51l-12.84,12.84c-.4.4-.94.63-1.51.63s-1.11-.22-1.51-.63L.63,3.65C-.21,2.82-.21,1.47.63.63,1.47-.21,2.82-.21,3.65.63l11.32,11.32L26.3.63c.84-.84,2.19-.84,3.03,0,.42.42.63.96.63,1.51Z"/></svg>
                        </NavLink>

                        <ul className={`nav-box-detail p-4 detail-menu-services transition-03s-eio ${showServices ? 'show':'hide'}`} onMouseLeave={()=>mouseEventServices(false)}>
                            <li>
                                <section>
                                    <div className="d-flex">
                                        <div className="primary-nav-col">
                                        {
                                            (() => {
                                                const areaList = Object.entries(TranslationsService.labels('services'));
                                                return (
                                                    <ul id="syd-submenu" className="d-flex flex-wrap">
                                                        <li className="w-50">
                                                            <ul>
                                                                {
                                                                    areaList
                                                                    .filter(([area, areaValue]) => areaValue.orderMenu === 1)
                                                                    .map(([area, areaValue], indice) => (
                                                                        <li key={indice}>
                                                                            <Link to={`/${lang}/services/${area}`} className="category-submenu" onClick={() => mouseEventServices(false)} style={{fontSize:'1.5rem'}}>
                                                                                {areaValue.title}
                                                                            </Link>
                                                                            <div>
                                                                                <ul>
                                                                                    {
                                                                                        areaValue.items && Object.keys(areaValue.items).length > 0 ? (
                                                                                            Object.entries(areaValue.items)
                                                                                            .filter(([key, val]) => typeof val === 'object' && val.title)
                                                                                            .map(([subKey, subValue], i) => (
                                                                                                <li key={i}>
                                                                                                    <Link to={`/${lang}/services/${area}/${subKey}`} className="category-submenu" onClick={() => mouseEventServices(false)}>
                                                                                                        {subValue.title}
                                                                                                    </Link>
                                                                                                    {
                                                                                                        Object.entries(subValue)
                                                                                                        .filter(([k, v]) => typeof v === 'object' && v.title)
                                                                                                        .map(([subSubKey, subSubValue], j) => (
                                                                                                            <li key={j} className="ms-2 my-1">
                                                                                                                <Link to={`/${lang}/services/${area}/${subKey}/${subSubKey}`} onClick={() => mouseEventServices(false)}>
                                                                                                                    {subSubValue.title}
                                                                                                                </Link>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </li>
                                                                                            ))
                                                                                        ) : (
                                                                                            Object.entries(areaValue)
                                                                                            .filter(([key, val]) => typeof val === 'object' && val.title)
                                                                                            .map(([subKey, subValue], i) => (
                                                                                                <li key={i} className="ms-2 my-1">
                                                                                                    <Link to={`/${lang}/services/${area}/${subKey}`} onClick={() => mouseEventServices(false)}>
                                                                                                        {subValue.title}
                                                                                                    </Link>
                                                                                                </li>
                                                                                            ))
                                                                                        )
                                                                                    }
                                                                                </ul>
                                                                            </div>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </li>

                                                        <li className="w-50">
                                                            <ul>
                                                                {
                                                                    areaList
                                                                    .filter(([area, areaValue]) => areaValue.orderMenu !== 1)
                                                                    .map(([area, areaValue], indice) => (
                                                                        <li key={indice}>
                                                                            <Link to={`/${lang}/services/${area}`} className="category-submenu" onClick={() => mouseEventServices(false)} style={{fontSize:'1.5rem'}}>
                                                                                {areaValue.title}
                                                                            </Link>
                                                                            <div>
                                                                                <ul>
                                                                                    {
                                                                                        areaValue.items && Object.keys(areaValue.items).length > 0 ? (
                                                                                            Object.entries(areaValue.items)
                                                                                            .filter(([key, val]) => typeof val === 'object' && val.title)
                                                                                            .map(([subKey, subValue], i) => (
                                                                                                <li key={i}>
                                                                                                    <Link to={`/${lang}/services/${area}/${subKey}`} className="category-submenu" onClick={() => mouseEventServices(false)}>
                                                                                                        {subValue.title}
                                                                                                    </Link>
                                                                                                    {
                                                                                                        Object.entries(subValue)
                                                                                                        .filter(([k, v]) => typeof v === 'object' && v.title)
                                                                                                        .map(([subSubKey, subSubValue], j) => (
                                                                                                            <li key={j} className="ms-2 my-1">
                                                                                                                <Link to={`/${lang}/services/${area}/${subKey}/${subSubKey}`} onClick={() => mouseEventServices(false)}>
                                                                                                                    {subSubValue.title}
                                                                                                                </Link>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    }
                                                                                                </li>
                                                                                            ))
                                                                                        ) : (
                                                                                            Object.entries(areaValue)
                                                                                            .filter(([key, val]) => typeof val === 'object' && val.title)
                                                                                            .map(([subKey, subValue], i) => (
                                                                                                <li key={i} className="ms-2 my-1">
                                                                                                    <Link to={`/${lang}/services/${area}/${subKey}`} onClick={() => mouseEventServices(false)}>
                                                                                                        {subValue.title}
                                                                                                    </Link>
                                                                                                </li>
                                                                                            ))
                                                                                        )
                                                                                    }
                                                                                </ul>
                                                                            </div>
                                                                            <br/>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                );
                                            })()
                                        }
                                        </div>
                                    </div>
                                </section>
                            </li>
                        </ul>
                    </li>
                }

                {
                    TranslationsService.sectionAvailable('products') &&
                    <li>
                        <NavLink to={`/${lang}/products`}  className={({ isActive }) => `${isActive ? "is-active-navlink " : ""}d-flex gap-1 fw-bold`} onMouseEnter={()=>mouseEventProducts(true)} onClick={() => mouseEventProducts(false)}>
                            {TranslationsService.labels(`menu.products.label`)}
                            <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 17.12" className={`arrow-icon-nav ${showProducts ? 'rotated':''} transition-03s-eio`}><path d="m29.96,2.14c0,.55-.21,1.09-.63,1.51l-12.84,12.84c-.4.4-.94.63-1.51.63s-1.11-.22-1.51-.63L.63,3.65C-.21,2.82-.21,1.47.63.63,1.47-.21,2.82-.21,3.65.63l11.32,11.32L26.3.63c.84-.84,2.19-.84,3.03,0,.42.42.63.96.63,1.51Z"/></svg>
                        </NavLink>
                        <ul className={`nav-box-detail p-4 detail-menu-services transition-03s-eio ${showProducts ? 'show':'hide'}`} onMouseLeave={()=>mouseEventProducts(false)}>
                            <li>
                                <section>
                                    <div className="d-flex">
                                        <div className="w-100">
                                            <ul className=" justify-content-center">
                                            {
                                                Object.keys(TranslationsService.labels(`products`)).map((_sub, i) => (
                                                    <li key={i} className="fw-bold my-2 text-capitalize-menu">
                                                        <Link to={`/${lang}/products/${_sub}`} onClick={() => mouseEventProducts(false)}>{TranslationsService.labels(`products.${_sub}.title`)}</Link>
                                                    </li>
                                                ))
                                            }
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </li>
                        </ul>
                    </li>
                }
                {
                    TranslationsService.sectionAvailable('industries') &&
                    <li>
                        <NavLink to={`/${lang}/industries`}  className={({ isActive }) => `${isActive ? "is-active-navlink " : ""}d-flex gap-1 fw-bold`} onMouseEnter={()=>mouseEventIndustries(true)} onClick={() => mouseEventIndustries(false)}>
                            {TranslationsService.labels(`menu.industries.label`)}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 17.12" className={`arrow-icon-nav ${showIndustries ? 'rotated':''} transition-03s-eio`}><path d="m29.96,2.14c0,.55-.21,1.09-.63,1.51l-12.84,12.84c-.4.4-.94.63-1.51.63s-1.11-.22-1.51-.63L.63,3.65C-.21,2.82-.21,1.47.63.63,1.47-.21,2.82-.21,3.65.63l11.32,11.32L26.3.63c.84-.84,2.19-.84,3.03,0,.42.42.63.96.63,1.51Z"/></svg>
                        </NavLink>
                        <ul className={`nav-box-detail p-4 detail-menu-services transition-03s-eio ${showIndustries ? 'show':'hide'}`} onMouseLeave={()=>mouseEventIndustries(false)}>
                            <li>
                                <section>
                                    <div className="d-flex">
                                        <div className="w-100">
                                            <ul className="nav-industries-list justify-content-center">
                                            {
                                                Object.keys(TranslationsService.labels(`industries`)).map((_sub, i) => (
                                                    <li key={i} className="fw-bold my-2 text-capitalize-menu">
                                                        <Link to={`/${lang}/industries/${_sub}`} onClick={() => mouseEventIndustries(false)}>{TranslationsService.labels(`industries.${_sub}.title`)}</Link>
                                                    </li>
                                                ))
                                            }
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </li>
                        </ul>
                    </li>
                }
                {
                    TranslationsService.sectionAvailable('insights') &&
                    <li>
                        <NavLink to={`/${lang}/insights`} className={({ isActive }) => `${isActive ? "is-active-navlink " : ""}d-flex gap-1 fw-bold`} onMouseEnter={()=>mouseEventInsights(true)} onClick={() => mouseEventInsights(false)}>
                            Insights
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 17.12" className={`arrow-icon-nav ${showInsights ? 'rotated':''} transition-03s-eio`}><path d="m29.96,2.14c0,.55-.21,1.09-.63,1.51l-12.84,12.84c-.4.4-.94.63-1.51.63s-1.11-.22-1.51-.63L.63,3.65C-.21,2.82-.21,1.47.63.63,1.47-.21,2.82-.21,3.65.63l11.32,11.32L26.3.63c.84-.84,2.19-.84,3.03,0,.42.42.63.96.63,1.51Z"/></svg>
                        </NavLink>

                        <ul className={`nav-box-detail p-4 detail-menu-services transition-03s-eio ${showInsights ? 'show':'hide'}`} onMouseLeave={()=>mouseEventInsights(false)}>
                            <li>
                                <section>
                                    <div className="d-flex">
                                    {
                                        (TranslationsService.childMenuAvailable('insightsSections.blog') || TranslationsService.childMenuAvailable('insightsSections.client-stories')) && 
                                        <ul className="px-5 lt-box-nav-insights w-25 d-flex flex-column justify-content-center">
                                            {
                                                TranslationsService.childMenuAvailable('insightsSections.blog') && 
                                                <li className="py-2">
                                                    <NavLink to={`/${lang}/insights/blog`} className="text-capitalize fw-bold" onClick={() => mouseEventInsights(false)}>Blog</NavLink>
                                                </li>
                                            }
                                            {
                                                TranslationsService.childMenuAvailable('insightsSections.client-stories') && 
                                                <li className="py-2">
                                                    <NavLink to={`/${lang}/insights/client-stories`} className="text-capitalize fw-bold" onClick={() => mouseEventInsights(false)}>{TranslationsService.labels('client_stories')}</NavLink>
                                                </li>
                                            }
                                            {/* <li className="py-2">
                                                <a href="#about" className="text-capitalize fw-bold">{TranslationsService.labels(`event_and_webinars`)}</a>
                                            </li> */}
                                        </ul>
                                    }
                                        <ul className="px-5 w-75">
                                            <div className="d-flex gap-3">
                                            {
                                                TranslationsService.labels(`home_page.carousel`) &&
                                                TranslationsService.labels(`home_page.carousel`).slice(0, 3).map((ftopic, i) => (
                                                    ftopic.internal_link ?
                                                    (
                                                        <Link key={i} to={`/${lang}${ftopic.internal_link}`} className="cover-img-news-menu">
                                                            <div className="box-img-nav-menu p-2 d-flex align-items-end transition-03s-eio h-100 w-100" style={{backgroundImage:`url(${ftopic.image})`}}>
                                                                <p className="dark-mode-text fw-bold m-0 transition-03s-eio">{ftopic.title}</p>
                                                            </div>
                                                        </Link>
                                                    )
                                                    :
                                                    (
                                                        <a key={i} href={ftopic.external_link} target='_blank' rel='noreferrer' className="cover-img-news-menu">
                                                            <div className="box-img-nav-menu p-2 d-flex align-items-end transition-03s-eio h-100 w-100" style={{backgroundImage:`url(${ftopic.image})`}}>
                                                                <p className="dark-mode-text fw-bold m-0 transition-03s-eio">{ftopic.title}</p>
                                                            </div>
                                                        </a>
                                                    )
                                                ))
                                            }
                                            </div>
                                        </ul>
                                    </div>
                                </section>
                            </li>
                        </ul>
                    </li>
                }
                {
                    TranslationsService.sectionAvailable('about') &&
                    <li>
                        <NavLink to={`/${lang}/about`} className={({ isActive }) => `${isActive ? "is-active-navlink " : ""}d-flex gap-1 fw-bold`} onMouseEnter={()=>mouseEventAbout(true)} onClick={() => mouseEventAbout(false)}>
                            {TranslationsService.labels(`menu.about.label`)}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.96 17.12" className={`arrow-icon-nav ${showAbout ? 'rotated':''} transition-03s-eio`}><path d="m29.96,2.14c0,.55-.21,1.09-.63,1.51l-12.84,12.84c-.4.4-.94.63-1.51.63s-1.11-.22-1.51-.63L.63,3.65C-.21,2.82-.21,1.47.63.63,1.47-.21,2.82-.21,3.65.63l11.32,11.32L26.3.63c.84-.84,2.19-.84,3.03,0,.42.42.63.96.63,1.51Z"/></svg>
                        </NavLink>
                        <ul className={`nav-box-detail p-4 detail-menu-services transition-03s-eio ${showAbout ? 'show':'hide'}`} onMouseLeave={()=>mouseEventAbout(false)}>
                            <li>
                                <section>
                                    <div className="d-flex">
                                        <ul className="px-5 lt-box-nav-insights m-auto">
                                            <li className="py-2">
                                                <NavLink to={`/${lang}/about`} className="text-capitalize fw-bold" onClick={() => mouseEventAbout(false)}>{TranslationsService.labels('our_history')}</NavLink>
                                            </li>
                                            {
                                                TranslationsService.childMenuAvailable('aboutSections.r&d') && 
                                                <li className="py-2 pre-w-space">
                                                    <NavLink to={`/${lang}/about/rnd`} className="text-capitalize fw-bold" onClick={() => mouseEventAbout(false)}>R&D</NavLink>
                                                </li>
                                            }
                                            {
                                                TranslationsService.childMenuAvailable('aboutSections.certifications') && 
                                                <li className="py-2 pre-w-space">
                                                    <NavLink to={`/${lang}/about/our-certifications`} className="text-capitalize fw-bold" onClick={() => mouseEventAbout(false)}>{TranslationsService.labels('our_certifications')}</NavLink>
                                                </li>
                                            }
                                            {
                                                TranslationsService.childMenuAvailable('aboutSections.partners') && 
                                                <li className="py-2 pre-w-space">
                                                    <NavLink to={`/${lang}/about/our-partners`} className="text-capitalize fw-bold" onClick={() => mouseEventAbout(false)}>{TranslationsService.labels('our_partners')}</NavLink>
                                                </li>
                                            }
                                            {
                                                appOwner === 'sydea' &&
                                                <li className="py-2 pre-w-space">
                                                    <NavLink to={`/${lang}/about/the-real-submarine`} className="text-capitalize fw-bold" onClick={() => mouseEventAbout(false)}>The Real Submarine</NavLink>
                                                </li>
                                            }
                                        </ul>
                                        <div className="w-100 m-auto p-3">
                                            <p className="p-0 m-0 label-sub-nav">{TranslationsService.labels('locations')}</p>
                                            <div className="w-100 d-flex justify-content-between row">

                                                    {
                                                        TranslationsService.getOffice().map((office, ind) => (
                                                        <div key={ind} className="py-3 col-6">
                                                            <a href={office.mapsLink || undefined} target="_blank" rel="noreferrer">
                                                                <span className="me-2">
                                                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" transform="rotate(270)">
                                                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                                                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
                                                                        <g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M17.1218 1.87023C15.7573 0.505682 13.4779 0.76575 12.4558 2.40261L9.61062 6.95916C9.61033 6.95965 9.60913 6.96167 9.6038 6.96549C9.59728 6.97016 9.58336 6.97822 9.56001 6.9848C9.50899 6.99916 9.44234 6.99805 9.38281 6.97599C8.41173 6.61599 6.74483 6.22052 5.01389 6.87251C4.08132 7.22378 3.61596 8.03222 3.56525 8.85243C3.51687 9.63502 3.83293 10.4395 4.41425 11.0208L7.94975 14.5563L1.26973 21.2363C0.879206 21.6269 0.879206 22.26 1.26973 22.6506C1.66025 23.0411 2.29342 23.0411 2.68394 22.6506L9.36397 15.9705L12.8995 19.5061C13.4808 20.0874 14.2853 20.4035 15.0679 20.3551C15.8881 20.3044 16.6966 19.839 17.0478 18.9065C17.6998 17.1755 17.3043 15.5086 16.9444 14.5375C16.9223 14.478 16.9212 14.4114 16.9355 14.3603C16.9421 14.337 16.9502 14.3231 16.9549 14.3165C16.9587 14.3112 16.9606 14.31 16.9611 14.3098L21.5177 11.4645C23.1546 10.4424 23.4147 8.16307 22.0501 6.79853L17.1218 1.87023ZM14.1523 3.46191C14.493 2.91629 15.2528 2.8296 15.7076 3.28445L20.6359 8.21274C21.0907 8.66759 21.0041 9.42737 20.4584 9.76806L15.9019 12.6133C14.9572 13.2032 14.7469 14.3637 15.0691 15.2327C15.3549 16.0037 15.5829 17.1217 15.1762 18.2015C15.1484 18.2752 15.1175 18.3018 15.0985 18.3149C15.0743 18.3316 15.0266 18.3538 14.9445 18.3589C14.767 18.3699 14.5135 18.2916 14.3137 18.0919L5.82846 9.6066C5.62872 9.40686 5.55046 9.15333 5.56144 8.97583C5.56651 8.8937 5.58877 8.84605 5.60548 8.82181C5.61855 8.80285 5.64516 8.7719 5.71886 8.74414C6.79869 8.33741 7.91661 8.56545 8.68762 8.85128C9.55668 9.17345 10.7171 8.96318 11.3071 8.01845L14.1523 3.46191Z" fill="currentColor"/> </g>
                                                                    </svg>
                                                                </span>
                                                                <span className="syd-black fw-bold">{office.name}</span><br/><span className="text-capitalize">{office.address}</span></a>
                                                        </div>
                                                    ))}
                                                {/* <div className="col-image-locations">
                                                    <img src={require('../../assets/about/nav_about.png')} alt="Offices location" className="d-block ms-auto"></img>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </li>
                        </ul>
                    </li>
                }
                {
                    TranslationsService.sectionAvailable('careers') &&
                    <li>
                        <NavLink to={`/${lang}/careers`} className={({ isActive }) => `${isActive ? "is-active-navlink " : ""} fw-bold`} onMouseEnter={()=>mouseEventCareers(true)} onClick={() => mouseEventCareers(false)}>{TranslationsService.labels(`menu.careers.label`)}</NavLink>
                        {/* <ul className={`nav-box-detail p-4 detail-menu-services transition-03s-eio ${showCareers ? 'show':'hide'}`} onMouseLeave={()=>mouseEventCareers(false)}>
                            <li>
                                <section className="d-flex">
                                    <div className="box-nav-careers">
                                        <div className="d-flex">
                                            <div className="primary-nav-col">
                                                <ul>
                                                    <li>
                                                        <h3 className="fs-5 fw-bold">Your career at Sydea</h3>
                                                        <button className="syd-button m-0" onClick={() => {navigate("/contacts"); mouseEventCareers(false);}}>
                                                            Explore our vacancies
                                                        </button>
                                                    </li>
                                                </ul>
                                                <ul className="mt-4">
                                                    <h3 className="fs-5 fw-bold">Sydea Offices</h3>
                                                    <li>
                                                    <a href={TranslationsService.getGlobalValue('bologna_google_maps')} target='_blank' rel="noreferrer" className="link-feat-top">Bologna - ITA</a>
                                                    </li>
                                                    <li>
                                                        <a href={TranslationsService.getGlobalValue('bologna_google_maps')} target='_blank' rel="noreferrer" className="link-feat-top">Napoli - ITA</a>
                                                    </li>
                                                    <li>
                                                        <a href={TranslationsService.getGlobalValue('skopje_google_maps')} target='_blank' rel="noreferrer" className="link-feat-top">Skopje - NMK</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="primary-nav-col">
                                                <ul id="syd-submenu">
                                                    <li>
                                                        <Link to={`careers/roles`} className="category-submenu" onClick={() => mouseEventCareers(false)}>{TranslationsService.labels(`explore_all_roles`)}</Link>
                                                        <div>
                                                            <ul>
                                                            {
                                                                Object.keys(TranslationsService.labels(`roles`)).map((_sub, i) => (
                                                                    <li key={i} className="my-2 text-capitalize-menu">
                                                                        <Link to={`careers/roles/${_sub}`} onClick={() => mouseEventCareers(false)}>{TranslationsService.labels(`roles.${_sub}.name`)}</Link>
                                                                    </li>
                                                                ))
                                                            }
                                                            </ul>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        TranslationsService.labels('hero_sections.careers.img_path') &&
                                        <div className="d-flex box-nav-careers-img">
                                            <img src={`${TranslationsService.labels('hero_sections.careers.img_path')}`} alt="Careers" className="w-100"></img>
                                        </div>
                                    }
                                </section>
                            </li>
                        </ul> */}
                    </li>
                }
                {
                    appOwner === 'sydea' && isAuthenticated &&
                    <li>
                        <NavLink to={`/${lang}/sydea-hub`} className='fw-bold'>Sydea Hub</NavLink>
                    </li>
                }
            </ul>
            <div className="d-flex gap-2 align-items-center pe-2">
                {
                    TranslationsService.sectionAvailable('contacts') &&
                    <button className="syd-button fw-bold" onClick={() => navigate(`/${lang}/contacts`)} style={{textTransform:'inherit'}}>
                        {TranslationsService.labels(`menu.contact-us.label`)}
                    </button>
                }
                <LanguageDropdown />
            </div>
        </nav>


        <nav id="main-nav-mob" className="navbar sticky-top d-block px-3 d-flex d-lg-none align-items-center transition-03s-eio">
            <a className="hamburger-menu" data-bs-toggle="offcanvas" href="#offcanvasMenu" role="button" aria-controls="offcanvasMenu">
                <svg viewBox="0 0 11 9"><path className="hamburger-icon syd-logo-main-color" d="m0,8.5c0-.28.22-.5.5-.5h10c.28,0,.5.22.5.5s-.22.5-.5.5H.5c-.28,0-.5-.22-.5-.5Zm0-4c0-.28.22-.5.5-.5h10c.28,0,.5.22.5.5s-.22.5-.5.5H.5c-.28,0-.5-.22-.5-.5ZM0,.5C0,.22.22,0,.5,0h10c.28,0,.5.22.5.5s-.22.5-.5.5H.5c-.28,0-.5-.22-.5-.5Z"/></svg>
            </a>
            <Link to={`/${lang}`} className="m-auto">
                {
                    appOwner === 'sydea' &&
                    // <svg id="Livello_1" viewBox="0 0 758 246" className='logo-nav color-logo-mob transition-03s-eio m-auto'>
                    //         <path
                    //             className="syd-logo-main-color"
                    //             d="m117.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7-.7-.5-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.6-.2-9.2-.7"
                    //         />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="157.7 233.5 146.9 215.8 152 215.8 159.9 229.8 167.9 215.8 173 215.8 162.1 233.4 162.1 245.5 157.7 245.5 157.7 233.5"
                    //         />
                    //         <path
                    //             className="syd-logo-main-color"
                    //             d="m182.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7s-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.7-.2-9.2-.7"
                    //         />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="222.3 218.9 212.2 218.9 212.2 215.8 236.9 215.8 236.9 218.9 226.8 218.9 226.8 245.5 222.3 245.5 222.3 218.9"
                    //         />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="245.9 215.8 265.9 215.8 265.9 218.9 250.3 218.9 250.3 228.6 264.4 228.6 264.4 231.7 250.3 231.7 250.3 242.4 266.3 242.4 266.3 245.5 245.9 245.5 245.9 215.8"
                    //         />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="275.9 215.8 282.5 215.8 292.1 240.5 292.2 240.6 301.3 215.8 307.7 215.8 307.7 245.5 303.8 245.5 303.8 220.4 303.6 220.4 294 245.5 290 245.5 280.1 220.4 279.9 220.4 279.9 245.5 275.9 245.5 275.9 215.8"
                    //         />
                    //         <rect className="syd-logo-main-color" x="340.8" y="215.8" width="4.4" height="29.8" />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="354.4 215.8 359.7 215.8 375.9 240.4 375.9 215.8 379.8 215.8 379.8 245.5 374.4 245.5 358.3 220.5 358.3 245.5 354.4 245.5 354.4 215.8"
                    //         />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="399 218.9 388.9 218.9 388.9 215.8 413.6 215.8 413.6 218.9 403.5 218.9 403.5 245.5 399 245.5 399 218.9"
                    //         />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="422.7 215.8 442.7 215.8 442.7 218.9 427.2 218.9 427.2 228.6 441.2 228.6 441.2 231.7 427.2 231.7 427.2 242.4 443.2 242.4 443.2 245.5 422.7 245.5 422.7 215.8"
                    //         />
                    //         <path
                    //             className="syd-logo-main-color"
                    //             d="m462.3,245.8c-1.1-.1-2.2-.4-3.4-.7-1.3-.4-2.5-.8-3.4-1.4s-1.7-1.3-2.2-2.3c-.6-1-.9-2.2-.9-3.5v-14.1c0-1.7.4-3.2,1.3-4.4.9-1.2,2.1-2.1,3.7-2.7,1.5-.5,2.9-.9,4.3-1.1s2.8-.3,4.4-.3c3.8,0,7.2.2,10.3.7v3.4c-1.2-.3-2.8-.5-5-.8-2.2-.2-3.9-.3-5.2-.3-6.3,0-9.4,1.8-9.4,5.4v14c0,1,.3,1.8.9,2.6.6.7,1.4,1.3,2.5,1.6,1,.4,2,.6,2.9.8,1,.1,2.1.2,3.3.2,2,0,4.2-.3,6.6-.8v-10.4h-7v-3.1h11v16c-4,.9-7.6,1.4-11,1.4-1.4,0-2.6-.1-3.7-.2"
                    //         />
                    //         <path
                    //             className="syd-logo-main-color"
                    //             d="m488,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.5v-29.7Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z"
                    //         />
                    //         <path
                    //             className="syd-logo-main-color"
                    //             d="m529.8,215.8h5.1l11.6,29.8h-4.6l-3.4-9h-12.8l-3.4,9h-4.3l11.8-29.8Zm7.6,17.6l-5-13.4h-.4l-5,13.4h10.4Z"
                    //         />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="561.9 218.9 551.8 218.9 551.8 215.8 576.4 215.8 576.4 218.9 566.4 218.9 566.4 245.5 561.9 245.5 561.9 218.9"
                    //         />
                    //         <path
                    //             className="syd-logo-main-color"
                    //             d="m585.6,237.9v-14.1c0-5.7,4.2-8.5,12.5-8.5s12.6,2.8,12.6,8.5v14.1c0,2.9-1.2,4.9-3.5,6.2-2.3,1.3-5.4,1.9-9.1,1.9-8.4,0-12.5-2.7-12.5-8.1m20.7,0v-14.2c0-3.7-2.8-5.5-8.3-5.5-2.7,0-4.7.4-6.1,1.2-1.4.8-2.1,2.3-2.1,4.3v14.2c0,3.4,2.8,5.1,8.3,5.1s8.2-1.7,8.2-5.1"
                    //         />
                    //         <path
                    //             className="syd-logo-main-color"
                    //             d="m619.8,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.4l-.1-29.7h0Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z"
                    //         />
                    //         <path
                    //             className="syd-logo-main-color"
                    //             d="m443,55.9v75c0,14-2.8,24.8-8.2,32.5-5.5,7.7-14.5,13.1-27,16.2s-29.8,4.7-52,4.7h-87v-67.5l42.8-65.3v101.4h42.2c12.1,0,21.3-.5,27.4-1.6,6.2-1,10.6-3.1,13.4-6.1,2.7-3,4.1-7.8,4.1-14.2V55.2c0-8.7-3.4-14.8-10.4-18.3-6.5-3.3-16.6-5-30.3-5.2h-.8l-69.9.1-47.9,78.3v74.4h-44.3v-73.8l-47.9-79.3c-30.7.1-67.6.4-75.3.4-14.9,0,1.5.1-7.3.1-12,0-20.3,9.8-20.3,15.5v10.3c0,9.6,8.1,14.5,24.4,14.5h37.5c21,0,36.2,3.9,45.7,11.6,9.5,7.8,14.2,19.6,14.2,35.5v12.2c0,22-4.1,35.3-15.9,43.8-10.6,7.6-26,9.1-36.2,9.1-9.3,0-14.1.7-27.5.5-16.2-.1-55.9.3-86.4-.1v-29.5c31.3,0,76.1.1,87.9.1,21.2,0,33.9.7,33.9-19.1v-11.9c0-6-1.8-10.7-5.3-13.9-3.5-3.2-9.8-4.8-18.9-4.8h-36.9C20.3,105.7,0,89.6,0,57.4v-13.6C0,27.7,6.7,15.9,20.2,8.3,33.6.7,34.2.4,63.4.4h65.2l-.1-.1h50.2l38.9,72.1L256.2.3h99.4c6.1,0,11.8.1,17.1.4,13.6.7,25,2.2,34,4.6,12.5,3.3,21.7,9,27.5,17.2,5.8,7.8,8.8,19,8.8,33.4Z"
                    //         />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="563.4 147.3 563.4 184.2 455.3 184.2 455.3 120.9 492.4 120.9 492.4 147.3 563.4 147.3"
                    //         />
                    //         <path
                    //             className="syd-logo-main-color"
                    //             d="m587.2,120.9l-23.4,63.4h43.7l21.3-63.4h-41.6Zm142.3,0h-43.2l21.2,63.4h44.8l-22.8-63.4ZM685.9,0h-53.9l-33,89.3h40.5l17.6-52.4h1.1l17.6,52.4h42.5L685.9,0Z"
                    //         />
                    //         <polygon
                    //             className="syd-logo-main-color"
                    //             points="563.8 0 563.8 36.9 492.4 36.9 492.4 89.4 455.3 89.4 455.3 0 563.8 0"
                    //         />
                    //         <polygon
                    //             className="syd-logo-arrow"
                    //             points="492.4 120.9 492.4 89.3 563.5 89.4 563.5 48 587.3 120.9 492.4 120.9"
                    //         />
                    //         <polygon
                    //             className="syd-logo-arrow"
                    //             points="758 120.9 628.8 120.9 639.4 89.4 746.6 89.4 758 120.9"
                    //         />
                    // </svg>
                    // <img src={require('../../assets/logo/sydea-christmas.png')} alt="Sydea logo" className="logo-nav"></img>
                    <svg id="sydea-10th-anniversary" viewBox="0 0 758 262.26" className='logo-nav color-logo-mob transition-03s-eio m-auto'>
                        <path d="M443,55.9v75c0,14-2.8,24.8-8.2,32.5-5.5,7.7-14.5,13.1-27,16.2s-29.8,4.7-52,4.7h-87v-67.5l42.8-65.3v101.4h42.2c12.1,0,21.3-.5,27.4-1.6,6.2-1,10.6-3.1,13.4-6.1,2.7-3,4.1-7.8,4.1-14.2V55.2c0-8.7-3.4-14.8-10.4-18.3-6.5-3.3-16.6-5-30.3-5.2h-.8l-69.9.1-47.9,78.3v74.4h-44.3v-73.8l-47.9-79.3c-30.7.1-67.6.4-75.3.4-14.9,0,1.5.1-7.3.1-12,0-20.3,9.8-20.3,15.5v10.3c0,9.6,8.1,14.5,24.4,14.5h37.5c21,0,36.2,3.9,45.7,11.6,9.5,7.8,14.2,19.6,14.2,35.5v12.2c0,22-4.1,35.3-15.9,43.8-10.6,7.6-26,9.1-36.2,9.1-9.3,0-14.1.7-27.5.5-16.2-.1-55.9.3-86.4-.1v-29.5c31.3,0,76.1.1,87.9.1,21.2,0,33.9.7,33.9-19.1v-11.9c0-6-1.8-10.7-5.3-13.9-3.5-3.2-9.8-4.8-18.9-4.8h-36.9C20.3,105.7,0,89.6,0,57.4v-13.6C0,27.7,6.7,15.9,20.2,8.3,33.6.7,34.2.4,63.4.4h65.2l-.1-.1h50.2l38.9,72.1L256.2.3h99.4c6.1,0,11.8.1,17.1.4,13.6.7,25,2.2,34,4.6,12.5,3.3,21.7,9,27.5,17.2,5.8,7.8,8.8,19,8.8,33.4Z" className="syd-logo-main-color"/>
                        <polygon points="563.4 147.3 563.4 184.2 455.3 184.2 455.3 120.9 492.4 120.9 492.4 147.3 563.4 147.3" className="syd-logo-main-color"/>
                        <path d="M587.2,120.9l-23.4,63.4h43.7l21.3-63.4h-41.6ZM729.5,120.9h-43.2l21.2,63.4h44.8l-22.8-63.4ZM685.9,0h-53.9l-33,89.3h40.5l17.6-52.4h1.1l17.6,52.4h42.5L685.9,0Z" className="syd-logo-main-color"/>
                        <polygon points="563.8 0 563.8 36.9 492.4 36.9 492.4 89.4 455.3 89.4 455.3 0 563.8 0" className="syd-logo-main-color"/>
                        <polygon points="492.4 120.9 492.4 89.3 563.5 89.4 563.5 48 587.3 120.9 492.4 120.9" fill="#fece2f"/>
                        <polygon points="758 120.9 628.8 120.9 639.4 89.4 746.6 89.4 758 120.9" fill="#fece2f"/>
                        <polygon points="581.59 217.54 581.59 262.26 626.35 262.26 608.06 239.9 626.35 217.54 581.59 217.54" fill="#f9b903"/>
                        <polygon points="176.41 217.54 176.41 262.26 131.65 262.26 149.94 239.9 131.65 217.54 176.41 217.54" fill="#f9b903"/>
                        <rect x="165.28" y="204.54" width="427.45" height="50.96" fill="#fece2f"/>
                        <path d="M187.55,221.48l-8.53,5.58v-3.55l8.57-5.93h3.72v28.1h-3.77v-24.2Z"/>
                        <path d="M212.08,245.99c-.79-.09-1.64-.26-2.53-.52-.95-.26-1.71-.64-2.27-1.15-.56-.5-1.03-1.22-1.41-2.14-.38-.87-.56-1.95-.56-3.25v-14.2c0-1.3.19-2.44.56-3.42s.87-1.76,1.47-2.34c.55-.49,1.28-.89,2.19-1.19.91-.3,1.83-.5,2.75-.58,1.04-.06,2.01-.09,2.9-.09,1.27,0,2.3.04,3.1.13.79.09,1.64.26,2.53.52.95.29,1.72.69,2.32,1.21.59.52,1.08,1.25,1.45,2.21.38.95.56,2.12.56,3.51v14.24c0,1.18-.19,2.24-.56,3.16-.38.92-.87,1.65-1.47,2.17-.58.49-1.31.89-2.21,1.19-.9.3-1.8.48-2.73.54-.81.09-1.8.13-2.99.13-1.27,0-2.3-.04-3.1-.13ZM218.81,243.24c.84-.22,1.44-.64,1.82-1.28.37-.63.56-1.57.56-2.81v-14.72c0-1.36-.19-2.37-.58-3.05-.39-.68-1-1.13-1.82-1.36s-2.01-.35-3.57-.35-2.79.12-3.62.35-1.42.69-1.8,1.36c-.38.68-.56,1.7-.56,3.05v14.72c0,1.24.19,2.18.58,2.81.39.64,1,1.06,1.84,1.28.84.22,2.04.33,3.59.33s2.71-.11,3.55-.33Z"/>
                        <path d="M264.53,217.58h4.85l10.91,28.1h-4.37l-3.2-8.53h-12.04l-3.16,8.53h-4.16l11.17-28.1ZM271.67,234.25l-4.76-12.69h-.39l-4.76,12.69h9.91Z"/>
                        <path d="M288.38,217.58h5.07l15.28,23.21v-23.21h3.68v28.1h-5.07l-15.28-23.6v23.6h-3.68v-28.1Z"/>
                        <path d="M323.5,217.58h5.07l15.28,23.21v-23.21h3.68v28.1h-5.07l-15.28-23.6v23.6h-3.68v-28.1Z"/>
                        <path d="M358.61,217.58h4.2v28.1h-4.2v-28.1Z"/>
                        <path d="M370.9,217.58h4.37l9.01,24.12h.39l9.01-24.12h4.16l-11.17,28.1h-4.85l-10.91-28.1Z"/>
                        <path d="M405.93,217.58h18.88v2.94h-14.68v9.18h13.25v2.94h-13.25v10.09h15.11v2.94h-19.31v-28.1Z"/>
                        <path d="M434.85,217.58h9.87c2.48,0,4.42.15,5.82.45,1.4.3,2.42.84,3.07,1.62s.97,1.92.97,3.42v4.85c0,1.67-.69,2.97-2.06,3.88-1.37.91-3.11,1.36-5.22,1.36l9.01,12.51h-5.15l-8.05-11.99h-4.07v11.99h-4.2v-28.1ZM444.55,230.92c2.08,0,3.57-.25,4.48-.76.91-.5,1.36-1.42,1.36-2.75v-3.9c0-2.11-1.82-3.16-5.46-3.16h-5.89v10.56h5.5Z"/>
                        <path d="M465.55,245.42v-3.51c3.35.72,6.29,1.08,8.83,1.08,2.14,0,3.69-.24,4.68-.71.98-.48,1.47-1.36,1.47-2.66v-3.64c0-1.21-.35-2.06-1.04-2.55-.69-.49-1.91-.74-3.64-.74h-3.29c-2.74,0-4.69-.55-5.85-1.65-1.15-1.1-1.73-2.8-1.73-5.11v-2.25c0-1.53.34-2.77,1.02-3.72.68-.95,1.82-1.66,3.42-2.12,1.6-.46,3.8-.69,6.6-.69,1.88,0,4.29.16,7.23.48v3.16c-3.29-.49-5.8-.74-7.53-.74-2.68,0-4.46.26-5.33.78-.9.55-1.34,1.46-1.34,2.73v3.2c0,.98.35,1.7,1.06,2.14.71.45,1.93.67,3.66.67h3.38c1.93,0,3.44.23,4.52.69,1.08.46,1.85,1.16,2.29,2.1.45.94.67,2.2.67,3.79v2.04c0,1.99-.37,3.57-1.1,4.72-.74,1.15-1.87,1.98-3.4,2.47-1.53.49-3.54.74-6.02.74s-5.25-.23-8.57-.69Z"/>
                        <path d="M502.65,217.58h4.85l10.91,28.1h-4.37l-3.2-8.53h-12.04l-3.16,8.53h-4.16l11.17-28.1ZM509.79,234.25l-4.76-12.69h-.39l-4.76,12.69h9.91Z"/>
                        <path d="M526.5,217.58h9.87c2.48,0,4.42.15,5.82.45,1.4.3,2.42.84,3.07,1.62s.97,1.92.97,3.42v4.85c0,1.67-.69,2.97-2.06,3.88-1.37.91-3.11,1.36-5.22,1.36l9.01,12.51h-5.15l-8.05-11.99h-4.07v11.99h-4.2v-28.1ZM536.2,230.92c2.08,0,3.57-.25,4.48-.76.91-.5,1.36-1.42,1.36-2.75v-3.9c0-2.11-1.82-3.16-5.46-3.16h-5.89v10.56h5.5Z"/>
                        <path d="M564.56,234.34l-10.17-16.75h4.81l7.49,13.21,7.49-13.21h4.81l-10.22,16.62v11.47h-4.2v-11.34Z"/>
                        <path d="M233.96,223.36c-.32-.12-.54-.33-.68-.62-.14-.29-.21-.71-.21-1.24v-3.85h-1.46v-.8h1.46v-2.03h1.23v2.03h2.34v.8h-2.34v3.91c0,.33.04.57.12.73.08.16.21.28.41.34.19.07.48.1.85.1.12,0,.44-.04.98-.11v.8c-.46.07-.92.11-1.37.11-.56,0-1-.06-1.31-.18Z"/>
                        <path d="M239.16,213.93h1.22v3.72c.13-.62.84-.93,2.15-.93.84,0,1.43.15,1.77.45.34.3.51.78.51,1.43v4.81h-1.22v-4.73c0-.17-.01-.31-.04-.42-.03-.11-.08-.22-.16-.33-.18-.23-.58-.34-1.21-.34-.5,0-.87.03-1.13.1-.26.07-.43.18-.53.33s-.14.37-.14.65v4.73h-1.22v-9.48Z"/>
                    </svg>
                }
                {
                    appOwner === 'indastria' &&
                    <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1799.22 237.53" className='logo-nav large color-logo-mob transition-03s-eio m-auto'>
                        <path className="syd-logo-main-color" d="M858.48,40.53c-19.16,0,1.93.13-9.39.13-15.44,0-26.11,12.6-26.11,19.94v13.24c0,12.35,10.41,18.65,31.38,18.65h48.22c27,0,46.55,5.02,58.77,14.92,12.21,10.03,18.26,25.21,18.26,45.65v15.69c0,28.3-5.27,45.39-20.45,56.33-13.63,9.77-33.43,11.7-46.55,11.7-11.96,0-18.13.9-35.37.65-20.83-.13-71.88.38-111.1-.13v-37.93c40.25,0,97.86.13,113.03.13,27.26,0,43.59.9,43.59-24.56v-15.3c0-7.71-2.31-13.76-6.82-17.88-4.5-4.11-12.6-6.17-24.31-6.17h-47.45c-52.08,0-78.19-20.7-78.19-62.11v-17.49c0-20.7,8.61-35.88,25.98-45.65C809.23.54,810,.16,847.55.16h83.84l-.13-.13h48.48v40h-24.43c-39.48.13-86.93.51-96.83.51h0Z"/>
                        <path className="syd-logo-main-color" d="M529.3,155.55l-30.09,81.53h56.2l27.39-81.53h-53.5ZM712.3,155.55h-55.55l27.26,81.53h57.61l-29.32-81.53ZM656.23.08h-69.31l-42.44,114.84h52.08l22.63-67.38h1.41l22.63,67.38h54.65L656.23.08Z"/>
                        <polygon className="syd-logo-main-color" points="748.95 155.55 582.8 155.55 596.43 115.05 734.29 115.05 748.95 155.55"/>
                        <path className="syd-logo-main-color" d="M1579.58,155.99l-30.09,81.53h56.2l27.39-81.53h-53.5ZM1762.57,155.99h-55.55l27.26,81.53h57.61l-29.32-81.53ZM1706.5.52h-69.31l-42.44,114.84h52.08l22.63-67.38h1.41l22.63,67.38h54.65L1706.5.52Z"/>
                        <polygon className="syd-logo-arrow" points="1799.22 155.99 1633.07 155.99 1646.71 115.48 1784.56 115.48 1799.22 155.99"/>
                        <path className="syd-logo-main-color" d="M0,0h60.69v237.51H0V0Z"/>
                        <path className="syd-logo-main-color" d="M1074.63,40.63h-77.8V0h215.9v40.62h-77.41v196.89h-60.69V40.63Z"/>
                        <path className="syd-logo-main-color" d="M1229.8,0h113.59c33.71,0,58.09,3.84,73.13,11.53,15.04,7.68,22.56,20.56,22.56,38.61v41.72c0,13.91-5.25,24.83-15.76,32.75-10.5,7.93-24.45,12.99-41.82,15.19l73.13,97.71h-70.02l-66.13-93.32h-28.01v93.32h-60.69V0h.02ZM1342.62,106.5c14.26,0,23.99-1.77,29.18-5.31,5.19-3.53,7.78-10.43,7.78-20.68v-16.83c0-8.78-2.79-14.82-8.36-18.11-5.58-3.29-15.11-4.94-28.59-4.94h-52.13v65.87h52.13-.01Z"/>
                        <path className="syd-logo-main-color" d="M1471.73,0h60.69v237.51h-60.69V0Z"/>
                        <path className="syd-logo-main-color" d="M470.09,28.54c-8.03-10.48-20.6-17.84-37.72-22.14C415.23,2.14,391.88,0,362.31,0h-100.95v162.11l-6.39-8.46L139.21,0h-61.45v237.53h54.07V72.85l122.15,164.68h108.74c30.34,0,54.07-2.02,71.19-6.03s29.43-10.99,36.95-20.89c7.52-9.86,11.28-23.85,11.28-41.88v-96.65c0-18.49-4.02-33.03-12.04-43.54h-.01ZM421.48,168.72c0,8.29-1.92,14.4-5.65,18.3-3.75,3.89-9.86,6.54-18.3,7.86-8.41,1.35-20.96,2.02-37.55,2.02h-44.33V40.61h46.28c20.75,0,35.87,2.28,45.32,6.8,9.47,4.52,14.23,12.38,14.23,23.58v97.73h0Z"/>
                    </svg>
                }
            </Link>
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasMenu" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <img src={appOwner === 'sydea' ? SydeaLogoDark : IndastriaLogoDark} alt='Sydea logo' className={`logo-nav ${appOwner === 'sydea' ? '' : 'logo-nav-indastria-mob-menu'}`}></img>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" id="btn-close-off-mobile"></button>
                </div>
                <div className="offcanvas-body position-relative">
                    <div>
                        <ul id="syd-menu">
                        {
                            TranslationsService.sectionAvailable('services') &&
                            <li className={`nav-menu-item-mob py-2`} onClick={() => mouseEventServices(true)}>
                                <p className="fs-2 fw-bold m-0 d-flex align-items-center justify-content-between">
                                    <span>{TranslationsService.labels(`menu.services.label`)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--sydYellow)"><path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/></svg>
                                </p>
                            </li>
                        }
                        {
                            TranslationsService.sectionAvailable('products') &&
                            <li className={`nav-menu-item-mob py-2`} onClick={() => mouseEventProducts(true)}>
                                <p className="fs-2 fw-bold m-0 d-flex align-items-center justify-content-between">
                                    <span>{TranslationsService.labels(`menu.products.label`)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--sydYellow)"><path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/></svg>
                                </p>
                            </li>
                        }
                        {
                            TranslationsService.sectionAvailable('industries') &&
                            <li className={`nav-menu-item-mob py-2`} onClick={() => mouseEventIndustries(true)}>
                                <p className="fs-2 fw-bold m-0 d-flex align-items-center justify-content-between">
                                    <span>{TranslationsService.labels(`menu.industries.label`)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--sydYellow)"><path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/></svg>
                                </p>
                            </li>
                        }
                        {
                            TranslationsService.sectionAvailable('insights') &&
                            <li className={`nav-menu-item-mob py-2`} onClick={() => mouseEventInsights(true)}>
                                <p className="fs-2 fw-bold m-0 d-flex align-items-center justify-content-between">
                                    <span>Insights</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--sydYellow)"><path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/></svg>
                                </p>
                            </li>
                        }
                            {/* <li className={`nav-menu-item-mob py-2`} onClick={() => hideMobileMenu()}>
                                <NavLink to="/sydea-blog">
                                    <p className="fs-2 text-uppercase m-0 d-flex align-items-center justify-content-between">
                                        <span>Blog</span>
                                    </p>
                                </NavLink>
                            </li> */}
                        {
                            TranslationsService.sectionAvailable('about') &&
                            <li className={`nav-menu-item-mob py-2`} onClick={() => mouseEventAbout(true)}>
                                <p className="fs-2 fw-bold m-0 d-flex align-items-center justify-content-between">
                                    <span>{TranslationsService.labels(`menu.about.label`)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--sydYellow)"><path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/></svg>
                                </p>
                            </li>
                        }
                        {
                            TranslationsService.sectionAvailable('careers') &&
                            <li className={`nav-menu-item-mob py-2`} onClick={() => hideMobileMenu()}>
                                <NavLink to={`/${lang}/careers`}>
                                    <p className="fs-2 fw-bold m-0 d-flex align-items-center justify-content-between">
                                        <span>{TranslationsService.labels(`menu.careers.label`)}</span>
                                    </p>
                                </NavLink>
                            </li>
                        }
                        </ul>
                    </div>
                    <div>
                        <ul id="syd-menu">
                            <li className='nav-menu-item-mob py-2' onClick={() => setShowLocationsMob(true)}>
                                <p className="fs-2 fw-bold m-0 d-flex align-items-center justify-content-between">
                                    <span>Locations</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--sydYellow)"><path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/></svg>
                                </p>
                            </li>
                            {/* <li className='nav-menu-item-mob py-2' onClick={() => setShowLanguageMob(true)}>
                                <p className="fs-2 text-uppercase m-0 d-flex align-items-center justify-content-between">
                                    <span className="d-flex gap-3">
                                        <span className={`fi fi-${TranslationsService.getGlobalValue(`available_language']['${TranslationsService.getCurrentLanguage()}']['flag`)}`}></span>
                                        <span className="text-capitalize">{TranslationsService.getGlobalValue(`available_language']['${TranslationsService.getCurrentLanguage()}']['name`)}</span>
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--sydYellow)"><path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/></svg>
                                </p>
                            </li> */}
                        {
                            TranslationsService.sectionAvailable('contacts') &&
                            <li className='nav-menu-item-mob py-2' onClick={() => hideMobileMenu()}>
                                <NavLink to={`/${lang}/contacts`}>
                                    <p className="fs-2 fw-bold m-0 d-flex align-items-center justify-content-between">
                                        <span>{TranslationsService.labels(`menu.contact-us.label`)}</span>
                                    </p>
                                </NavLink>
                            </li>
                        }

                        {
                            appOwner === 'sydea' && !isAuthenticated && 
                            <>
                                <br/>
                                <br/>
                                <p className="fs-2 fw-bold m-0 d-flex align-items-center justify-content-between" onClick={signIn}>
                                    <span>Restricted Area</span>
                                </p>
                            </>
                        }
                        
                        {appOwner === 'sydea' && isAuthenticated && (
                            <div style={{border:'1px solid'}} className="p-3">
                                <div className="d-flex align-items-center pb-3">
                                {
                                    activeAccount && 
                                    <div className="w-75">
                                        <p className='m-0'>{activeAccount.username}</p>
                                    </div>
                                }
                                {
                                    activeAccount && 
                                    <div className="w-25 d-flex justify-content-end">
                                        <button className='syd-button m-0 btn-signout-nav py-1 px-2 d-flex align-items-center gap-2' onClick={signOut} title='Sign out'>
                                            <svg fill="#ffffff" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 198.715 198.715" stroke="#ffffff">
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <g>
                                                        <path d="M161.463,48.763c-2.929-2.929-7.677-2.929-10.607,0c-2.929,2.929-2.929,7.677,0,10.606 c13.763,13.763,21.342,32.062,21.342,51.526c0,19.463-7.579,37.761-21.342,51.523c-14.203,14.204-32.857,21.305-51.516,21.303 c-18.659-0.001-37.322-7.104-51.527-21.309c-28.405-28.405-28.402-74.625,0.005-103.032c2.929-2.929,2.929-7.678,0-10.606 c-2.929-2.929-7.677-2.929-10.607,0C2.956,83.029,2.953,138.766,37.206,173.019c17.132,17.132,39.632,25.697,62.135,25.696 c22.497-0.001,44.997-8.564,62.123-25.69c16.595-16.594,25.734-38.659,25.734-62.129C187.199,87.425,178.059,65.359,161.463,48.763 z"></path>
                                                        <path d="M99.332,97.164c4.143,0,7.5-3.358,7.5-7.5V7.5c0-4.142-3.357-7.5-7.5-7.5s-7.5,3.358-7.5,7.5v82.164 C91.832,93.807,95.189,97.164,99.332,97.164z"></path>
                                                    </g>
                                                </g>
                                            </svg>
                                        </button>
                                    </div>
                                }
                                </div>
                                {/* {TranslationsService.getEmployeeMenu()?.map((item, indice) => (
                                    <a className="fs-6 m-0 d-flex align-items-center justify-content-between nav-menu-item-mob py-1" key={indice} href={item.link} style={{textTransform:'capitalize'}} target={`${item.link === '/org-chart' ? 'self':'_blank'}`}>
                                        <span>{item.label}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/></svg>
                                    </a>
                                ))} */}
                                
                                <li className='nav-menu-item-mob py-2' onClick={() => hideMobileMenu()}>
                                    <NavLink to={`/${lang}/sydea-hub`} className='fs-6 m-0 d-flex align-items-center justify-content-between nav-menu-item-mob py-1 fw-bold'>
                                        <span>Sydea Hub</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="m1,14c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41l5.29-5.29L.29,1.71C-.1,1.32-.1.68.29.29.68-.1,1.32-.1,1.71.29l6,6c.19.19.29.44.29.71s-.11.52-.29.71L1.71,13.71c-.2.2-.45.29-.71.29Z"/></svg>
                                    </NavLink>
                                </li>

                            </div>
                        )}

                        <LanguageDropdownMobile 
                            selectedLang={selectedLang}
                            handleLanguageSelect={handleLanguageSelect}
                            showLanguageMob={showLanguageMob}
                            setShowLanguageMob={setShowLanguageMob}
                        />

                        </ul>
                        <img src={appOwner === 'sydea' ? SydeaLogoDark : IndastriaLogoDark} alt='Sydea logo' className='logo-mob-nav-b'></img>
                        <div className='d-flex py-3 gap-3 justify-content-center'>
                            {
                                TranslationsService.itemFooter('socialContacts.linkedin.status') &&
                                <a href={TranslationsService.itemFooter('socialContacts.linkedin.link')} target='_blank' rel="noreferrer" className='social-link mob-nav'>
                                    <img src={require('../../assets/social/linkedin.png')} className='logo-social' alt='Linkedin logo'></img>
                                </a>
                            }
                            {
                                TranslationsService.itemFooter('socialContacts.facebook.status') &&
                                <a href={TranslationsService.itemFooter('socialContacts.facebook.link')} target='_blank' rel="noreferrer" className='social-link mob-nav'>
                                    <img src={require('../../assets/social/facebook.png')} className='logo-social' alt='Facebook logo'></img>
                                </a>
                            }
                            {
                                TranslationsService.itemFooter('socialContacts.instagram.status') &&
                                <a href={TranslationsService.itemFooter('socialContacts.instagram.link')} target='_blank' rel="noreferrer" className='social-link mob-nav'>
                                    <img src={require('../../assets/social/instagram.png')} className='logo-social' alt='Instagram logo'></img>
                                </a>
                            }
                            {
                                TranslationsService.itemFooter('socialContacts.x.status') &&
                                <a href={TranslationsService.itemFooter('socialContacts.x.link')} target='_blank' rel="noreferrer" className='social-link mob-nav'>
                                    <img src={require('../../assets/social/twitter.png')} className='logo-social' alt='Twitter logo'></img>
                                </a>
                            }
                            {
                                TranslationsService.itemFooter('socialContacts.tiktok.status') &&
                                <a href={TranslationsService.itemFooter('socialContacts.tiktok.link')} target='_blank' rel="noreferrer" className='social-link mob-nav'>
                                    <img src={require('../../assets/social/tiktok.png')} className='logo-social' alt='TikTok logo'></img>
                                </a>
                            }
                        </div>
                        <p className="m-0 footer-text">© {currentYear} { TranslationsService.itemFooter('text') }</p>
                    </div>
                    {
                        TranslationsService.sectionAvailable('services') &&
                        <div className={`sub-nav-mob ${showServices ? 'show-services-menu':''} transition-03s-eio`}>
                            <div className="d-flex p-3" onClick={() => mouseEventServices(false)}>
                                <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.43 20" width="10" fill="var(--sydYellow)"><path d="m10,20c-.37,0-.73-.14-1.01-.42L.42,11.01c-.27-.27-.42-.63-.42-1.01s.15-.74.42-1.01L8.99.42c.56-.56,1.46-.56,2.02,0s.56,1.46,0,2.02l-7.56,7.56,7.56,7.56c.56.56.56,1.46,0,2.02-.28.28-.64.42-1.01.42Z"/></svg>
                                <p className="m-0 fw-bold ms-2 fs-3">{TranslationsService.labels(`menu.services.label`)}</p>
                            </div>
                            <ul>
                            {
                                Object.keys(TranslationsService.labels('services')).map((area, indice) => (
                                    <li key={indice} style={{order: `${TranslationsService.labels('services')[area].orderMenu}`}} className="pb-4">
                                        <Link to={`/${lang}/services/${area}`} className="text-capitalize fw-bold fs-3" onClick={() => mouseEventServices(false)}>
                                            {TranslationsService.labels('services')[area].title}
                                        </Link>
                                        <div>
                                            <ul>
                                            {
                                                TranslationsService.labels('services')[area].items ?
                                                (
                                                Object.keys(TranslationsService.labels('services')[area].items).map((_sub, i) => (
                                                    <ul key={i} className="p-0 m-0">
                                                        <b className="text-capitalize fs-5">{TranslationsService.labels('services')[area].items[_sub].title}</b>
                                                    {
                                                        TranslationsService.labels('services')[area].items[_sub] ?
                                                        (
                                                        Object.keys(TranslationsService.labels('services')[area].items[_sub]).map((_subItem, j) => (
                                                            typeof TranslationsService.labels('services')[area].items[_sub][_subItem] === 'object' &&
                                                            TranslationsService.labels('services')[area].items[_sub][_subItem].title ?
                                                            (
                                                            <li key={j} className="ms-2 mb-2">
                                                                <Link to={`/${lang}/services/${area}/${_sub}/${_subItem}`} className="text-capitalize fs-5" onClick={() => { mouseEventServices(false); hideMobileMenu(); }}>
                                                                    {TranslationsService.labels('services')[area].items[_sub][_subItem].title}
                                                                </Link>
                                                            </li>
                                                            ) : null
                                                        ))
                                                        ) : null
                                                    }
                                                    </ul>
                                                ))
                                                )
                                                :
                                                (
                                                    <li key={indice} className="pb-4">
                                                        {/* <Link to={`services/${area}`} className="text-capitalize fw-bold fs-3" onClick={() => { mouseEventServices(false); hideMobileMenu(); }}>
                                                            {TranslationsService.labels('services')[area].title}
                                                        </Link> */}
                                                        <ul className="p-0 m-0">
                                                            {Object.keys(TranslationsService.labels('services')[area]).map((_sub, i) => (
                                                                <li key={i} className="mb-2">
                                                                    <Link to={`/${lang}/services/${area}/${_sub}`} className="text-capitalize fs-5" onClick={() => { mouseEventServices(false); hideMobileMenu(); }}>
                                                                        {TranslationsService.labels('services')[area][_sub].title}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                )
                                            }
                                            </ul>
                                        </div>
                                    </li>
                                ))
                            }
                            {/* {
                                Object.keys(TranslationsService.labels('services')).map((area, indice) => (
                                    <li key={indice} className="pb-4">
                                        <Link to={`services/${area}`} className="text-capitalize fw-bold fs-3" onClick={() => { mouseEventServices(false); hideMobileMenu(); }}>
                                            {TranslationsService.labels('services')[area].title}
                                        </Link>
                                        <ul>
                                            {Object.keys(TranslationsService.labels('services')[area]).map((_sub, i) => (
                                                <li key={i}>
                                                    <Link to={`services/${area}/${_sub}`} className="text-capitalize fs-5" onClick={() => { mouseEventServices(false); hideMobileMenu(); }}>
                                                        {TranslationsService.labels('services')[area][_sub].title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))
                            } */}
                            </ul>
                        </div>
                    }
                    {
                        TranslationsService.sectionAvailable('products') &&
                        <div className={`sub-nav-mob ${showProducts ? 'show-products-menu':''} transition-03s-eio`}>
                            <div className="d-flex p-3" onClick={() => mouseEventProducts(false)}>
                                <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.43 20" width="10" fill="var(--sydYellow)"><path d="m10,20c-.37,0-.73-.14-1.01-.42L.42,11.01c-.27-.27-.42-.63-.42-1.01s.15-.74.42-1.01L8.99.42c.56-.56,1.46-.56,2.02,0s.56,1.46,0,2.02l-7.56,7.56,7.56,7.56c.56.56.56,1.46,0,2.02-.28.28-.64.42-1.01.42Z"/></svg>
                                <p className="m-0 fw-bold ms-2 fs-3">{TranslationsService.labels(`menu.products.label`)}</p>
                            </div>
                            <ul>
                                {
                                    Object.keys(TranslationsService.labels(`products`)).map((_sub, i) => (
                                        <li key={i} className="mb-3">
                                            <Link to={`/${lang}/products/${_sub}`} className="text-uppercase fs-5" onClick={() => {mouseEventProducts(false); hideMobileMenu();}}>{TranslationsService.labels(`products.${_sub}.title`)}</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    }
                    {
                        TranslationsService.sectionAvailable('industries') &&
                        <div className={`sub-nav-mob ${showIndustries ? 'show-industries-menu':''} transition-03s-eio`}>
                            <div className="d-flex p-3" onClick={() => mouseEventIndustries(false)}>
                                <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.43 20" width="10" fill="var(--sydYellow)"><path d="m10,20c-.37,0-.73-.14-1.01-.42L.42,11.01c-.27-.27-.42-.63-.42-1.01s.15-.74.42-1.01L8.99.42c.56-.56,1.46-.56,2.02,0s.56,1.46,0,2.02l-7.56,7.56,7.56,7.56c.56.56.56,1.46,0,2.02-.28.28-.64.42-1.01.42Z"/></svg>
                                <p className="m-0 fw-bold ms-2 fs-3">{TranslationsService.labels(`menu.industries.label`)}</p>
                            </div>
                            <ul>
                                {
                                    Object.keys(TranslationsService.labels(`industries`)).map((_sub, i) => (
                                        <li key={i} className="mb-3">
                                            <Link to={`/${lang}/industries/${_sub}`} className="fs-5" onClick={() => {mouseEventIndustries(false); hideMobileMenu();}}>{TranslationsService.labels(`industries.${_sub}.title`)}</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    }
                    {
                        TranslationsService.sectionAvailable('insights') &&
                        <div className={`sub-nav-mob ${showInsights ? 'show-insights-menu':''} transition-03s-eio`}>
                            <div className="d-flex p-3" onClick={() => mouseEventInsights(false)}>
                                <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.43 20" width="10" fill="var(--sydYellow)"><path d="m10,20c-.37,0-.73-.14-1.01-.42L.42,11.01c-.27-.27-.42-.63-.42-1.01s.15-.74.42-1.01L8.99.42c.56-.56,1.46-.56,2.02,0s.56,1.46,0,2.02l-7.56,7.56,7.56,7.56c.56.56.56,1.46,0,2.02-.28.28-.64.42-1.01.42Z"/></svg>
                                <p className="m-0 fw-bold ms-2 fs-3">Insights</p>
                            </div>
                            {
                                (TranslationsService.childMenuAvailable('insightsSections.blog') || TranslationsService.childMenuAvailable('insightsSections.client-stories')) && 
                                <ul>
                                    {
                                        TranslationsService.childMenuAvailable('insightsSections.blog') && 
                                        <li className="mb-3">
                                            <Link to={`/${lang}/insights/blog`} className="text-uppercase fs-5" onClick={() => {mouseEventInsights(false); hideMobileMenu();}}>Blog</Link>
                                        </li>
                                    }
                                    {
                                        TranslationsService.childMenuAvailable('insightsSections.client-stories') && 
                                        <li className="mb-3">
                                            <Link to={`/${lang}/insights/client-stories`} className="text-uppercase fs-5" onClick={() => {mouseEventInsights(false); hideMobileMenu();}}>{TranslationsService.labels('client_stories')}</Link>
                                        </li>
                                    }
                                    {/* {
                                        Object.keys(TranslationsService.labels(`products`)).map((_sub, i) => (
                                            <li key={i} className="mb-3">
                                                <Link to={`products/${_sub}`} className="text-uppercase fs-5" onClick={() => {mouseEventProducts(false); hideMobileMenu();}}>{TranslationsService.labels(`products.${_sub}.title`)}</Link>
                                            </li>
                                        ))
                                    } */}
                                </ul>
                            }

                        </div>
                    }
                    {
                        TranslationsService.sectionAvailable('about') &&
                        <div className={`sub-nav-mob ${showAbout ? 'show-about-menu':''} transition-03s-eio`}>
                            <div className="d-flex p-3" onClick={() => mouseEventAbout(false)}>
                                <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.43 20" width="10" fill="var(--sydYellow)"><path d="m10,20c-.37,0-.73-.14-1.01-.42L.42,11.01c-.27-.27-.42-.63-.42-1.01s.15-.74.42-1.01L8.99.42c.56-.56,1.46-.56,2.02,0s.56,1.46,0,2.02l-7.56,7.56,7.56,7.56c.56.56.56,1.46,0,2.02-.28.28-.64.42-1.01.42Z"/></svg>
                                <p className="m-0 fw-bold ms-2 fs-3">{TranslationsService.labels(`menu.about.label`)}</p>
                            </div>
                            <ul>
                                <li className="mb-3">
                                    <Link to={`/${lang}/about`} className="text-uppercase fs-5" onClick={() => {mouseEventAbout(false); hideMobileMenu();}}>{TranslationsService.labels('our_history')}</Link>
                                </li>
                                {
                                    TranslationsService.childMenuAvailable('aboutSections.r&d') && 
                                    <li className="my-3">
                                        <Link to={`/${lang}/about/rnd`} className="text-uppercase fs-5" onClick={() => {mouseEventAbout(false); hideMobileMenu();}}>R&D</Link>
                                    </li>
                                }
                                {
                                    TranslationsService.childMenuAvailable('aboutSections.certifications') && 
                                    <li className="my-3">
                                        <Link to={`/${lang}/about/our-certifications`} className="text-uppercase fs-5" onClick={() => {mouseEventAbout(false); hideMobileMenu();}}>{TranslationsService.labels('our_certifications')}</Link>
                                    </li>
                                }
                                {
                                    TranslationsService.childMenuAvailable('aboutSections.partners') && 
                                    <li className="my-3">
                                        <Link to={`/${lang}/about/our-partners`} className="text-uppercase fs-5" onClick={() => {mouseEventAbout(false); hideMobileMenu();}}>{TranslationsService.labels('our_partners')}</Link>
                                    </li>
                                }
                                <li className="my-3">
                                    <Link to={`/${lang}/about/the-real-submarine`} className="text-uppercase fs-5" onClick={() => {mouseEventAbout(false); hideMobileMenu();}}>The Real Submarine</Link>
                                </li>
                            </ul>
                        </div>
                    }

                    <div className={`sub-nav-mob ${showLanguageMob ? 'show-language-menu':''} transition-03s-eio`}>
                        <div className="d-flex p-3 navbar-sub-nav" onClick={() => setShowLanguageMob(false)}>
                            <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.43 20" width="10" fill="var(--sydYellow)"><path d="m10,20c-.37,0-.73-.14-1.01-.42L.42,11.01c-.27-.27-.42-.63-.42-1.01s.15-.74.42-1.01L8.99.42c.56-.56,1.46-.56,2.02,0s.56,1.46,0,2.02l-7.56,7.56,7.56,7.56c.56.56.56,1.46,0,2.02-.28.28-.64.42-1.01.42Z"/></svg>
                            <p className="m-0 fw-bold ms-2 fs-3">Language</p>
                        </div>
                        <ul className="sub-nav-list">
                            <li onClick={() => {handleLanguageSelect('en'); setShowLanguageMob(false); hideMobileMenu()}} className="mb-3">
                                <span className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio">
                                    <span className={`fi fi-gb`}></span>
                                    <span className="text-uppercase fs-5">EN</span>
                                </span>
                            </li>
                            <li onClick={() => {handleLanguageSelect('it'); setShowLanguageMob(false); hideMobileMenu()}} className="mb-3">
                                <span className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio">
                                    <span className={`fi fi-it`}></span>
                                    <span className="text-uppercase fs-5">IT</span>
                                </span>
                            </li>
                            {/* {
                                Object.keys(TranslationsService.getGlobalValue('available_language')).map((_langu,i) =>(
                                <li key={i} onClick={() => setSelectedLangue(_langu)} className="mb-3">
                                    <span className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio">
                                        <span className={`fi fi-${TranslationsService.getGlobalValue(`available_language']['${_langu}']['flag`)}`}></span>
                                        <span className="text-uppercase fs-5">{TranslationsService.getGlobalValue(`available_language']['${_langu}']['name`)}</span>
                                    </span>
                                </li>
                                ))
                            } */}
                        </ul>
                    </div>

                    <div className={`sub-nav-mob ${showLocationsMob ? 'show-language-menu':''} transition-03s-eio`}>
                        <div className="d-flex p-3" onClick={() => setShowLocationsMob(false)}>
                            <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.43 20" width="10" fill="var(--sydYellow)"><path d="m10,20c-.37,0-.73-.14-1.01-.42L.42,11.01c-.27-.27-.42-.63-.42-1.01s.15-.74.42-1.01L8.99.42c.56-.56,1.46-.56,2.02,0s.56,1.46,0,2.02l-7.56,7.56,7.56,7.56c.56.56.56,1.46,0,2.02-.28.28-.64.42-1.01.42Z"/></svg>
                            <p className="m-0 fw-bold ms-2 fs-3">Locations</p>
                        </div>
                        {/* <ul>
                            <li className="mb-3">
                                <a href={TranslationsService.getGlobalValue('bologna_google_maps')} target="_blank" rel="noreferrer">
                                    <span className="dark-mode-title fw-bold text-uppercase">{TranslationsService.getGlobalValue('bologna_office_label')}</span><br/>{TranslationsService.getGlobalValue('bologna_adress')}
                                </a>
                            </li>
                            <li className="mb-3">
                                <a href={TranslationsService.getGlobalValue('napoli_google_maps')} target="_blank" rel="noreferrer">
                                    <span className="dark-mode-title fw-bold text-uppercase">{TranslationsService.getGlobalValue('napoli_office_label')}</span><br/>{TranslationsService.getGlobalValue('napoli_adress')}
                                </a>
                            </li>
                            <li className="mb-3">
                                <a href={TranslationsService.getGlobalValue('skopje_google_maps')} target="_blank" rel="noreferrer">
                                    <span className="dark-mode-title fw-bold text-uppercase">{TranslationsService.getGlobalValue('skopje_office_label')}</span><br/>{TranslationsService.getGlobalValue('skopje_adress')}
                                </a>
                            </li>
                            <li className="mb-3">
                                <a href={TranslationsService.getGlobalValue('vancouver_google_maps')} target="_blank" rel="noreferrer">
                                    <span className="dark-mode-title fw-bold text-uppercase">{TranslationsService.getGlobalValue('vancouver_office_label')}</span><br/>{TranslationsService.getGlobalValue('vancouver_adress')}
                                </a>
                            </li>
                        </ul> */}
                        <ul>
                        {
                        TranslationsService.getOffice()?.map((office, ind) => (
                            <li key={ind} className="mb-3">
                                <a href={office.mapsLink || undefined} target="_blank" rel="noreferrer">
                                    <span className="dark-mode-title fw-bold text-uppercase">{office.name}</span><br/>{office.address}
                                </a>
                            </li>
                        ))}
                        </ul>


                    </div>

                </div>
            </div>
        </nav>
    </>    
  );
};