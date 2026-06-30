import React, { useContext, useEffect, useState, useRef } from 'react';
import './page-hero.scss';
import { AppContext } from '../../services/translationContext';
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper";

export const PageHero = ({bgImage, breadcrumb, title, subtitle, hideBreadcrumb=false}) => {
  const { services: {TranslationsService} } = useContext(AppContext);

  const { lang } = useParams();

  return (
    <section className='main-hero syd-hero position-relative' style={{backgroundImage:`url(${bgImage})`}}>
      <div className='container my-auto'>
        {/* <p className='dark-mode-text m-0 breadcrumb-detail'>
          <Link to={`/${lang}`}  className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
          &nbsp;&#9656;&nbsp;
          <Link to={`/${lang}/insights`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.insights.label`)}</Link>
        </p> */}

        {
          !hideBreadcrumb &&
          <p className='dark-mode-text m-0 breadcrumb-detail'>
            <Link to={`/${lang}`} className='text-deco-none dark-mode-text transition-03s-eio'>
              Home
            </Link>

            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                &nbsp;&#9656;&nbsp;
                <Link to={`/${lang}/${item.path}`} className='text-deco-none dark-mode-text transition-03s-eio'>
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </p>
        }


        <h2 className='syd-title light fw-bold m-0'>{title}</h2>
        <p className='dark-mode-text fs-5 mt-2'>{subtitle}</p>
      </div>
    </section>
  );
};