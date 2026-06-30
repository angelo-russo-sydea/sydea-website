import React, { useContext, useEffect, useState, useRef } from 'react';
import './hero.scss';
import { AppContext } from '../../services/translationContext';
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper";
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export const Hero = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  const [listSlider, setListSlider] = useState([]);
  const [fullSlideSize, setfullSlideSize] = useState('');
  const [marginTopHero, setMarginTopHero] = useState('');
  const [displayScrollbar, setDisplayScrollbar] = useState('block');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const { lang } = useParams();

  const swiperElRef = useRef(null);

  useEffect(() => {
    function shuffle(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    const shuffled = shuffle(TranslationsService.labels(`home_page.carousel`));
    setListSlider(shuffled);
  }, [TranslationsService]);

  useEffect(() => {
    let _navbar = document.getElementById('main-nav');
    setfullSlideSize(`100%`);

    try{
      if(window.getComputedStyle(_navbar).display === 'none'){
        _navbar = document.getElementById('main-nav-mob');
      }
      setMarginTopHero(`-${_navbar.offsetHeight + 1}px`);
    }
    catch(e){}

  }, []);

  const onSlideChange = (swiper) =>{
    setActiveIndex(swiper.realIndex);
    setDisplayScrollbar('none');
    setTimeout(() => {
      setDisplayScrollbar('block');
    }, 100);
  }

  const scrollDownHero = () =>{
    window.scrollTo(0, (window.innerHeight - 80));
  }

  return (
    <div className="hero-container">

      <div className='btn-scroll-down' onClick={scrollDownHero}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
      </div>
      
      <Swiper
        ref={swiperElRef}
        spaceBetween={30}
        effect={"fade"}
        loop={true}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        // // navigation={true}
        // // pagination={{
        // //   type: "progressbar",
        // // }}
        // // pagination={true}
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        className="swiper-hero"
        style={{height: fullSlideSize, marginTop: marginTopHero}}
        onSlideChange={onSlideChange}
        // onSlideChange={() => onSlideChange()}
      >
        {
          listSlider.map((slider, i) => (
          <SwiperSlide key={i}>
            {slider.internal_link || slider.external_link ? (
              // <Link to={`/${lang}${slider.internal_link}`} className='text-deco-none transition-03s-eio'>
                <div className='slide-home-hero pos-relative'>
                  <div className='slide-overlay'>
                  {slider.date_label && (
                    <div className={`date-pill-badge date-pill-${slider.date_type || 'event'}`}>
                      <span className="date-pill-icon">
                        {slider.date_type === 'deadline' ? 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 721.72 721.72"><circle cx="360.86" cy="360.86" r="335.86" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="360.86" y1="136.95" x2="360.86" y2="360.86" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="539.99" y1="360.86" x2="360.86" y2="360.86" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/></svg>
                         :
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 698.99 698.99"><line x1="68.27" y1="673.99" x2="630.73" y2="673.99" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="25" y1="630.73" x2="25" y2="89.9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="673.99" y1="630.73" x2="673.99" y2="89.9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="25" y1="89.9" x2="673.99" y2="89.9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="154.8" y1="25" x2="154.8" y2="154.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="284.6" y1="25" x2="284.6" y2="154.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="414.4" y1="25" x2="414.4" y2="154.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="544.2" y1="25" x2="544.2" y2="154.8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="133.17" y1="284.6" x2="133.17" y2="371.13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="219.7" y1="284.6" x2="219.7" y2="371.13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="133.17" y1="371.13" x2="219.7" y2="371.13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="219.7" y1="284.6" x2="133.17" y2="284.6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><path d="M25,630.73c0,23.91,19.35,43.27,43.27,43.27" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><path d="M673.99,630.73c0,23.91-19.35,43.27-43.27,43.27" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="522.56" y1="327.86" x2="522.56" y2="327.86" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="349.5" y1="327.86" x2="349.5" y2="327.86" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="522.56" y1="500.93" x2="522.56" y2="500.93" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="349.5" y1="500.93" x2="349.5" y2="500.93" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/><line x1="176.43" y1="500.93" x2="176.43" y2="500.93" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50"/></svg>
                         }
                      </span>
                      {slider.date_label}
                    </div>
                  )}
                    <div className='col-slide-hero d-flex flex-column justify-content-center pt-5'>
                      <h2 className='dark-mode-text fw-bold slide-hero-title font-title'>{slider.title}</h2>
                      { slider.subtitle && <h3 className='dark-mode-text slide-hero-subtitle'>{slider.subtitle}</h3> }
                      <div className='box-action-hero d-flex align-items-center gap-2 transition-03s-eio'>
                        {
                          slider.internal_link ? (
                            <Link to={`/${lang}${slider.internal_link}`} className='text-deco-none transition-03s-eio btn-discover-slider'>
                              <span className='m-0 p-0'>{slider.callToAction ? TranslationsService.labels(slider.callToAction) : TranslationsService.labels(`learn_more`)}</span>
                            </Link>
                          )
                          :
                          (
                            <a href={slider.external_link} target='_blank' rel='noreferrer' className='text-deco-none transition-03s-eio btn-discover-slider'>
                              <span className='m-0 p-0'>{slider.callToAction ? TranslationsService.labels(slider.callToAction) : TranslationsService.labels(`learn_more`)}</span>
                            </a>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <img src={slider.image} alt={slider.title} className='img-slide-hero'/>
                </div>
            ) : (
              <div className='slide-home-hero pos-relative'>
                <div className='slide-overlay p-5'>
                  {slider.date_label && (
                    <div className={`date-pill-badge date-pill-${slider.date_type || 'event'}`}>
                      <span className="date-pill-icon">
                        {slider.date_type === 'deadline' ? 
                        <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78.75 78.75"><circle cx="39.38" cy="39.37" r="37.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="39.38" y1="14.38" x2="39.38" y2="39.38" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="59.38" y1="39.38" x2="39.38" y2="39.38" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/></svg>
                         :
                         <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78.75 78.75"><line x1="6.88" y1="76.87" x2="71.88" y2="76.87" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="1.88" y1="71.87" x2="1.88" y2="9.38" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="76.88" y1="71.87" x2="76.88" y2="9.38" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="1.88" y1="9.38" x2="76.88" y2="9.38" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="16.88" y1="1.88" x2="16.88" y2="16.88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="31.88" y1="1.88" x2="31.88" y2="16.88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="46.88" y1="1.88" x2="46.88" y2="16.88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="61.88" y1="1.88" x2="61.88" y2="16.88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="14.38" y1="31.88" x2="14.38" y2="41.87" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="24.38" y1="31.88" x2="24.38" y2="41.87" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="14.38" y1="41.87" x2="24.38" y2="41.87" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="24.38" y1="31.88" x2="14.38" y2="31.88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><path d="M1.88,71.87c0,2.76,2.24,5,5,5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><path d="M76.88,71.87c0,2.76-2.24,5-5,5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="59.38" y1="36.88" x2="59.38" y2="36.88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="39.38" y1="36.88" x2="39.38" y2="36.88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="59.38" y1="56.87" x2="59.38" y2="56.87" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="39.38" y1="56.87" x2="39.38" y2="56.87" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/><line x1="19.38" y1="56.87" x2="19.38" y2="56.87" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.75"/></svg>
                         }
                      </span>
                      {slider.date_label}
                    </div>
                  )}
                  <div className='col-slide-hero d-flex flex-column justify-content-center pt-5'>
                    <h2 className='dark-mode-text fw-bold slide-hero-title font-title'>{slider.title}</h2>
                  </div>
                </div>
                <img src={slider.image} alt={slider.title} className='img-slide-hero'/>
              </div>
            )}
          </SwiperSlide>
          ))
        }
        
        {/* <div className='hero-progressbar' style={{display:displayScrollbar}}></div> */}
        {
          listSlider && listSlider.length >0 &&
          <div className='box-progress-bar'>
            <div>            
                <IconButton style={{color: '#fcfcfc'}} onClick={() => swiperElRef.current.swiper.slidePrev()} size='small'>
                <ArrowBackIcon />
              </IconButton>
              <IconButton style={{color: '#fcfcfc'}} onClick={() => {
                const swiper = swiperElRef.current.swiper;
                if (isPlaying) {
                  swiper.autoplay.pause();
                } else {
                  swiper.autoplay.resume();
                }
                setIsPlaying(!isPlaying);
              }}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </div>
            {listSlider.map((_, i) => (
              <div className={`hero-progress-segment ${activeIndex === i ? 'active' : ''}`} key={i} onClick={() => {
                if (swiperElRef.current && swiperElRef.current.swiper) {
                  swiperElRef.current.swiper.slideToLoop(i);
                }
              }}>
                {activeIndex === i && (
                  <div
                    key={activeIndex}
                    className={`hero-progress-fill ${!isPlaying ? 'paused' : ''}`}
                  />
                )}
              </div>
            ))}
            <div>
              <IconButton style={{color: '#fcfcfc'}}  onClick={() => swiperElRef.current.swiper.slideNext()}>
                <ArrowForwardIcon />
              </IconButton>
            </div>
          </div>
        }
      </Swiper>
    </div>
  );
};