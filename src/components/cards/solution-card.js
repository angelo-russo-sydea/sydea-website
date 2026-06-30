import React, { useContext } from 'react';
import './cards.scss';
import { AppContext } from '../../services/translationContext';
import { Link, NavLink } from 'react-router-dom';
import parse, { domToReact } from 'html-react-parser';

export const SolutionCard = ({colMD, colSM, data, link}) => {
  const { services: {TranslationsService} } = useContext(AppContext);

  return (
    <div className={`col-md-${colMD} col-sm-${colSM} p-4`}>
      <div className={`solution-card ${data.comingSoon ? 'comingsoon':''}`}>
        <NavLink to={link}>
          <div className="solution-tags">
            {
              data?.categorie?.map((category, ind) => (
                  <span className="solution-tag" key={ind}>{category}</span>
              ))
            }
          </div>
          <h3 className="solution-name m-0">{data.title}</h3>
          <p className="solution-tagline">{data.subtitle}</p>
          <p className="solution-description">
              {parse(data.desc)}
          </p>
          {
            !data.comingSoon &&
            <div className="solution-cta">
                {data.textButton}
                <svg className="arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
          }
          {
            data.comingSoon &&
            <div className="solution-comingsoon">
                coming soon
            </div>
          }
        </NavLink>
      </div>
    </div>
  );
};