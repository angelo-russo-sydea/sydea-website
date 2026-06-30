import React, { useState, useContext, useEffect, useRef } from "react";
import './mega-menu.scss';
import SydeaLogoDark from '../../assets/logo/sydea_b.svg';
import IndastriaLogoDark from '../../assets/logo/indastria_b.svg';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../services/translationContext";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { InsightsSection } from "../sections/insights/insights";
import parse, { domToReact } from 'html-react-parser';
import { Divider } from "@mui/material";

const currentYear = new Date().getFullYear();
const appOwner = process.env.REACT_APP_OWNER;



export const MegaMenu = ({show, menu, lang, onClose}) => {
    const { services: { TranslationsService } } = useContext(AppContext);

    const label = TranslationsService.labels(`menu.${menu}.label`);

    const renderContent = () => {
        switch (menu) {
            case "services":
                return renderServicesContent();
            case "insights":
                return renderInsightsContent();
            case "about":
                return renderAboutContent();
            case "solutions":
                return renderSolutionsContent();
            default:
                return null;
        }
    };

    const renderServicesContent = () => {
        return(
            <ul>
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
                                                                        <Link to={`/${lang}/services/${area}`} className="category-submenu" onClick={onClose} style={{fontSize:'1.5rem'}}>
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
                                                                                                <Link to={`/${lang}/services/${area}/${subKey}`} className="category-submenu" onClick={onClose}>
                                                                                                    {subValue.title}
                                                                                                </Link>
                                                                                                {
                                                                                                    Object.entries(subValue)
                                                                                                    .filter(([k, v]) => typeof v === 'object' && v.title)
                                                                                                    .map(([subSubKey, subSubValue], j) => (
                                                                                                        <div key={j} className="ms-4 my-1">
                                                                                                            <Link to={`/${lang}/services/${area}/${subKey}/${subSubKey}`} onClick={onClose}>
                                                                                                                {subSubValue.title}
                                                                                                            </Link>
                                                                                                        </div>
                                                                                                    ))
                                                                                                }
                                                                                            </li>
                                                                                        ))
                                                                                    ) : (
                                                                                        Object.entries(areaValue)
                                                                                        .filter(([key, val]) => typeof val === 'object' && val.title)
                                                                                        .map(([subKey, subValue], i) => (
                                                                                            <li key={i} className="ms-4 my-1">
                                                                                                <Link to={`/${lang}/services/${area}/${subKey}`} onClick={onClose}>
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
                                                                        <Link to={`/${lang}/services/${area}`} className="category-submenu" onClick={onClose} style={{fontSize:'1.5rem'}}>
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
                                                                                                <Link to={`/${lang}/services/${area}/${subKey}`} className="category-submenu" onClick={onClose}>
                                                                                                    {subValue.title}
                                                                                                </Link>
                                                                                                {
                                                                                                    Object.entries(subValue)
                                                                                                    .filter(([k, v]) => typeof v === 'object' && v.title)
                                                                                                    .map(([subSubKey, subSubValue], j) => (
                                                                                                        <li key={j} className="ms-4 my-1">
                                                                                                            <Link to={`/${lang}/services/${area}/${subKey}/${subSubKey}`} onClick={onClose}>
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
                                                                                            <li key={i} className="ms-4 my-1">
                                                                                                <Link to={`/${lang}/services/${area}/${subKey}`} onClick={onClose}>
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
        )
    }

    const renderInsightsContent = () => {
        return(
            <ul>
                <li>
                    <section>
                        <div>
                        {
                            (TranslationsService.childMenuAvailable('insightsSections.blog') || TranslationsService.childMenuAvailable('insightsSections.client-stories')) && 
                            <ul className="px-5 lt-box-nav-insights w-100 d-flex flex-column justify-content-center">
                                {
                                    TranslationsService.childMenuAvailable('insightsSections.blog') && 
                                    <li className="py-2">
                                        <NavLink to={`/${lang}/insights/blog`} className="text-capitalize text-item-mega-menu" onClick={onClose}>{TranslationsService.labels('blog')}</NavLink>
                                    </li>
                                }
                                {
                                    TranslationsService.childMenuAvailable('insightsSections.client-stories') && 
                                    <li className="py-2">
                                        <NavLink to={`/${lang}/insights/client-stories`} className="text-capitalize text-item-mega-menu" onClick={onClose}>{TranslationsService.labels('client_stories')}</NavLink>
                                    </li>
                                }
                                {/* <li className="py-2">
                                    <a href="#about" className="text-capitalize text-item-mega-menu">{TranslationsService.labels(`event_and_webinars`)}</a>
                                </li> */}
                                <li className="py-2">
                                    <NavLink to={`/${lang}/insights/events`} className="text-capitalize text-item-mega-menu" onClick={onClose}>{TranslationsService.labels('events')}</NavLink>
                                </li>
                            </ul>
                        }
                        <Divider sx={{borderColor: '#929292'}}/>
                            <ul className="px-5 w-100 mt-3">
                                <InsightsSection isMenu={true}/>
                            </ul>
                        </div>
                    </section>
                </li>
            </ul>
        )
    }

    const renderAboutContent = () => {
        return(
            <ul>
                <li>
                    <section>
                        <div>
                            <ul className="px-5 lt-box-nav-insights m-auto">
                                <li className="py-2">
                                    <NavLink to={`/${lang}/about`} className="text-capitalize text-item-mega-menu" onClick={onClose}>{TranslationsService.labels('our_history')}</NavLink>
                                </li>
                                {
                                    TranslationsService.childMenuAvailable('aboutSections.r&d') && 
                                    <li className="py-2 pre-w-space">
                                        <NavLink to={`/${lang}/about/rnd`} className="text-capitalize text-item-mega-menu" onClick={onClose}>R&D</NavLink>
                                    </li>
                                }
                                {
                                    TranslationsService.childMenuAvailable('aboutSections.certifications') && 
                                    <li className="py-2 pre-w-space">
                                        <NavLink to={`/${lang}/about/our-certifications`} className="text-capitalize text-item-mega-menu" onClick={onClose}>{TranslationsService.labels('our_certifications')}</NavLink>
                                    </li>
                                }
                                {
                                    TranslationsService.childMenuAvailable('aboutSections.partners') && 
                                    <li className="py-2 pre-w-space">
                                        <NavLink to={`/${lang}/about/our-partners`} className="text-capitalize text-item-mega-menu" onClick={onClose}>{TranslationsService.labels('our_partners')}</NavLink>
                                    </li>
                                }
                                {/* {
                                    appOwner === 'sydea' &&
                                    <li className="py-2 pre-w-space">
                                        <NavLink to={`/${lang}/about/the-real-submarine`} className="text-capitalize text-item-mega-menu" onClick={onClose}>The Real Submarine</NavLink>
                                    </li>
                                } */}
                            </ul>
                            <hr></hr>
                            <div className="w-100 m-auto p-3">
                                <p className="p-0 m-0 label-sub-nav">{TranslationsService.labels('locations')}</p>
                                <div className="w-100 d-flex justify-content-between row">
                                        {
                                            TranslationsService.getOffice()?.map((office, ind) => (
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
        )
    }

    const renderSolutionsContent = () => {
        return(
            <>
            {/* <h3 className="lh-1 d-flex align-items-center gap-2 mt-2 fs-4">{TranslationsService.labels('solutions.desc')}</h3> */}
                <section className="mt-3">
                    <div className="row gy-3">
                        {
                            (() => {
                                const solutions = TranslationsService.labels('solutions');
                                return (
                                    solutions.items.map((solution, i) => (
                                        <div key={i} className="col-sm-12 col-md-6">
                                            <div className={`solution-card ${solution.comingSoon ? 'comingsoon':''}`}>
                                                <NavLink to={`/${lang}/solutions/${solution.id}`}onClick={onClose}>
                                                    <div className="solution-tags">
                                                        {
                                                            solution?.categorie?.map((category, ind) => (
                                                                <span className="solution-tag" key={ind}>{category}</span>
                                                            ))
                                                        }
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div dangerouslySetInnerHTML={{ __html: solution.svg_logo }} style={{display: 'flex', height: '50px', width: 'auto', maxWidth: '150px'}}/>
                                                        <h3 className="solution-name m-0">{solution.title}</h3>
                                                    </div>
                                                    <p className="solution-tagline">{solution.subtitle}</p>
                                                    <p className="solution-description">
                                                        {parse(solution.desc)}
                                                    </p>
                                                    {
                                                        !solution.comingSoon &&
                                                        <div className="solution-cta">
                                                            {solution.textButton}
                                                            <svg className="arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                        </div>
                                                    }
                                                {/* </a> */}
                                                </NavLink>
                                            </div>
                                        </div>
                                    ))
                                );
                            })()
                        }
                    </div>
                </section>
            </>
        )
    }

return (
    <div className={`syd-mega-menu ${show ? "show" : ""}`}>
        <div className="container">
            <div className="d-flex justify-content-between align-items-center">
                <NavLink to={`/${lang}/${menu}`} className="d-flex gap-1 fw-bold title-mega-menu" onClick={onClose}>
                    <h2 className="fw-bold m-0 lh-1 d-flex align-items-center gap-2">{label} <ArrowForwardIcon style={{ fontSize: "2rem" }} /></h2>
                </NavLink>
                <IconButton onClick={onClose}>
                    <CloseIcon style={{ fontSize: "2rem", color: '#ffffff' }} />
                </IconButton>
            </div>
            {renderContent()}
        </div>
    </div>
    );
};
