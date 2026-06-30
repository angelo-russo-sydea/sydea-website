import React, { useContext, useEffect, useState } from 'react';
import './solutions-detail.scss';
import { useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';
import { Link } from "react-router-dom";
import { VectorAnimated } from '../../components/vector-animated/vector-animated';
import DOMPurify from 'dompurify';
import { Loader } from '../../components/loader/loader';
import { Helmet } from 'react-helmet-async';
import SeoHelmet from '../../components/SeoHelmet';
import { FlatCard } from '../../components/cards/flat-card';
import parse from 'html-react-parser';

const api = process.env.REACT_APP_URL_API;

export const SolutionsDetail = () => {
    const text_test1 = `
    
    `;

    let { solution_id } = useParams();
    let { lang } = useParams();

    const { services: {TranslationsService} } = useContext(AppContext);

    const [showLoader, setShowLoader] = useState(false);
    const [listClientStories, setListClientStories] = useState([]);
    const [solution, setSolution] = useState({});

    useEffect(() => {
      const solutionUrl = TranslationsService
        .labels('solutions.items')
        .find((x) => x.id === solution_id);

      setSolution(solutionUrl || {});
    }, [solution_id, TranslationsService]);

    useEffect(() => {
      if (!solution.fulltext) return;

      const reveals = document.querySelectorAll(".reveal-solution");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
        }
      );

      reveals.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, [solution.fulltext]);
  
 

  return (
    <>
    <SeoHelmet 
      title={solution['meta-title']}
      description={solution['meta-description']}
    />
    <div className="section-home light">
      {/* <div className='syd-background-service' style={{backgroundImage: `url(${getBgPage()})`}}></div> */}
      <div className='syd-background-solution' style={{backgroundImage: solution.hero ? `url(${solution.hero})` : 'none'}}></div>
      <div style={{ position: 'relative', zIndex: 2 }}>

        <section className="hero">
          <div className="hero-content">
            <p className='dark-mode-text m-0 breadcrumb-detail'>
              <Link to={`/${lang}`} className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
              &nbsp;&#9656;&nbsp;
              <Link to={`/${lang}/solutions`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.solutions.label`)}</Link>
            </p>
              <div className="hero-text">
                  <h1 className="hero-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <div className='logo-solutions'>{solution?.svg_logo ? parse(solution.svg_logo) : null}</div>
                    {solution.id !== 'sap-intelligence' && <span className="highlight">{solution.title}</span>}
                  </h1>
                  <h2 className="hero-subtitle">
                      {solution.det_subtitle}
                  </h2>
                  <p className="hero-description">
                    {solution.hero_desc ? parse(solution.hero_desc) : null}
                  </p>
                  <div className="hero-cta-group">
                      <a href="#contatti" className="cta-primary">
                          {solution.cta_primary}
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                      </a>
                      <a href="#come-funziona" className="cta-secondary">{solution.cta_secondary}</a>
                  </div>
              </div>
            </div>
        </section>

        <div>
          {solution.fulltext ? parse(solution.fulltext) : null}
        </div>

      </div>
    </div>
    </>
  );
};