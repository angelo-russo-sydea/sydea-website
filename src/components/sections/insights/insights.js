import React, {useContext} from 'react';
import { AppContext } from '../../../services/translationContext';
import './insights.scss';
import { Link, NavLink, useParams } from "react-router-dom";
import { TransitionalCard } from '../../cards/transitional-card';
import Slider from '../../slider/slider';

export const InsightsSection = ({isMenu = false}) => {
  const { services: {TranslationsService} } = useContext(AppContext);
  const { lang } = useParams();

  return (
    <div className={`${isMenu ? '':'bkg-light'} d-flex flex-column`}>
      {!isMenu &&<h2 className='syd-title dark fw-bold pt-5 pb-3 px-3'>{TranslationsService.labels('latest_insights')}</h2>}
      <div className={`${isMenu ? '':'p-3'} d-flex flex-column`}>
        {/* <div className='row gap-3 gap-lg-0'>
        {
            TranslationsService.labels(`home_page.carousel`).slice(0, 4).map((slider, i) => (
              <TransitionalCard
                key={i}
                colMD={3}
                colSM={12}
                title={slider.title}
                link={`${slider.internal_link ? `/${lang}${slider.internal_link}` : slider.external_link}`}
                target={slider.internal_link ? '_self':'_blank'}
                bgImage={slider.image}
                category={isMenu ? TranslationsService.labels(slider.category) : ''}
              />
            ))
          }
        </div> */}
        <Slider>
          {
            TranslationsService.labels(`home_page.carousel`).slice(0, 8).map((slider, i) => (
              <TransitionalCard
                key={i}
                colMD={3}
                colSM={12}
                title={slider.title}
                link={`${slider.internal_link ? `/${lang}${slider.internal_link}` : slider.external_link}`}
                target={slider.internal_link ? '_self':'_blank'}
                bgImage={slider.image}
                category={isMenu ? TranslationsService.labels(slider.category) : ''}
              />
            ))
          }
        </Slider>
      </div>
      {
        TranslationsService.childMenuAvailable('insightsSections.blog') && !isMenu &&
        <NavLink to={`/${lang}/insights/blog`} className="fw-bold fs-4 ref-syd-nav transition-03s-eio light-mode-text px-2 py-3">
          {TranslationsService.labels('see_all_news')}
          <svg viewBox="0 0 7.48 11.59" className='icon-arrow ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
        </NavLink>
      }
    </div>
  );
};