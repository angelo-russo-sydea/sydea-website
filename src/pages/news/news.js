import React, { useState, useMemo, useContext, useEffect } from 'react';
import './news.scss';
import { AppContext } from '../../services/translationContext';
import { Link, useParams } from 'react-router-dom';
import { Loader } from '../../components/loader/loader';
import { PageHero } from '../../components/page-hero/page-hero';
import { EmotionalCard } from '../../components/cards/emotional-card';

const api = process.env.REACT_APP_URL_API;
const pathUrl = process.env.REACT_APP_BASE_URL;

export const News = () => {
  const { lang } = useParams();
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `Blog | ${TranslationsService.getMainInfoCompany('name')}`;
  const [newsList, setNewsList] = useState([]);
  const [pagingState, setPagingState] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  // useMemo(() => {
  //   setShowLoader(true);
  //   fetch(`${api}/content-public?id=news&language=${TranslationsService.getCurrentLanguage()}`)
  //   .then(response => response.json()).then(data => {
  //     setNewsList(data.data);
  //     setPagingState(data.paging_state);
  //     setShowLoader(false);
  //   });
  // }, [TranslationsService]);

  // useMemo(() => {
  //   setNewsList(TranslationsService.labels(`blog_sect`));
  // }, [TranslationsService]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `${pathUrl}/static/content/blog.json?_cache_buster=${Date.now()}`
        );
        const data = await response.json();
        setNewsList(data[lang]);
      } catch (error) {
        console.error("Errore nel caricamento del blog:", error);
      }
    };
    fetchNews();
  }, [pathUrl]);

  // useEffect(() => {
  //   if(pagingState){
  //     const observer = new IntersectionObserver(([entry]) =>{
  //       console.log(pagingState)
  //       if(entry.isIntersecting){
  //         setShowLoader(true);
  //         fetch(`https://yoywairyo0.execute-api.eu-west-1.amazonaws.com/content-public?id=news&language=${TranslationsService.getCurrentLanguage()}&paging_state=${pagingState}`)
  //         .then(response => response.json()).then(data => {          
  //           let _listEl = [...newsList];
  //           _listEl = [..._listEl,...data.data]
  //           setNewsList(_listEl);
  //           setPagingState(data.paging_state);
  //           setShowLoader(false);
  //         });
  //       }}
  //     );
  //     observer.observe(ref.current);
  //     return () => {
  //       observer.disconnect();
  //     };
  //   }

  // }, [ref, pagingState, TranslationsService, newsList]);

  const showMoreNews = () => {
    setShowLoader(true);
    fetch(`${api}/content-public?id=news&language=${TranslationsService.getCurrentLanguage()}&paging_state=${pagingState}`)
      .then(response => response.json()).then(data => {          
        let _listEl = [...newsList];
        _listEl = [..._listEl,...data.data]
        setNewsList(_listEl);
        setPagingState(data.paging_state);
        setShowLoader(false);
      });
  }

  return (
    <div id='container-news' className="section-home light pb-3">
      {/* <section className='main-hero syd-hero position-relative' style={{backgroundImage:`url(${TranslationsService.labels('hero_sections.news.img_path')})`}}>
        <div className='my-auto mx-0'>
          <p className='dark-mode-text m-0 breadcrumb-detail'>
            <Link to={`/${lang}`}  className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
            &nbsp;&#9656;&nbsp;
            <Link to={`/${lang}/insights`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.insights.label`)}</Link>
          </p>
          <h2 className='syd-title light text-uppercase'>Blog</h2>
          <p className='dark-mode-text fs-1 m-0'>{TranslationsService.labels(`hero_sections.news.text`)}</p>
        </div>
      </section> */}

      <PageHero 
        bgImage={TranslationsService.labels('hero_sections.news.img_path')}
        breadcrumb={[
          { label: TranslationsService.labels(`menu.insights.label`), path: 'insights' }
        ]}
        title='Blog'
        subtitle={TranslationsService.labels(`hero_sections.news.text`)}
      />

      {
        showLoader &&
        <Loader />
      }

      {/* <div className='syd-news-grid'>
      {
        newsList?.length > 0 &&
        newsList.map((news, ind) => (
          <div key={ind} className={`grid-news-card-s grid-news-card-${ind}`}>
            <Link to={`/insights/blog/${news.id}`} className='insights-card-news card-l'>
              <img className='insights-image transition-03s-eio' src={news.image_url} alt={news.title}></img>
              <div className='insights-card-content'>
                <div className='insights-card-body'>
                  <h4 className='insights-title-card fs-1'>{news.title}</h4>
                  <h6 className='text-news-desc'>{news.desc}</h6>
                </div>
              </div>
            </Link>
          </div>
        ))
      }
      </div> */}


      <div className='p-3 d-flex flex-column'>
        <div className='row gap-3 gap-lg-0'>
        {
          newsList?.length > 0 &&
          newsList.map((news, ind) => (
            <EmotionalCard 
              key={ind}
              colMD={3}
              colSM={12}
              title={news.title} link={`/${lang}/insights/blog/${news.id}`} 
              bgImage={news.image_url}
              category={news.category}
              desc={news.desc}
            />
// EmotionalCard = ({colMD, colSM, title, link, bgImage, category, desc}) => {
          // <div className='col-sm-12 col-lg-3 p-2' key={ind}>
          //   <Link to={`/${lang}/insights/blog/${news.id}`} style={{textDecoration: 'none'}}>
          //     <div className='box-stories-card d-flex flex-column border-0'>
          //       <div className='background-card' style={{backgroundImage:`linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(${news.image_url})`}}></div>
          //       <div className='box-stories-card-overlay-bottom' style={{ background: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(42, 42, 42, 0.51) 85%)'}}></div>
          //       <div className='box-stories-card-overlay'></div>
          //       <div className='box-stories-card-category text-uppercase'>{news.category}</div>
          //       <div className='box-stories-card-body mt-auto'>
          //         <div className='box-stories-card-title mt-auto'>
          //           <h4 style={{fontSize: '1.5rem', lineHeight: '2rem'}} className='fw-bold'>{news.title}</h4>
          //         </div>
          //         <div className='box-stories-card-desc mt-3'>{news.desc}</div>
          //       </div>
          //       <div className='arrow-stories-card'>
          //         <TrendingFlatIcon />
          //       </div>
          //     </div>
          //   </Link>
          // </div>
          ))
        }
        </div>
      </div>

      {/* <div className='p-3 d-flex flex-column'>
        <div className='row gap-3 gap-lg-0'>
        {
          newsList?.length > 0 &&
          newsList.map((news, ind) => (
          <div className='col-sm-12 col-lg-3 p-2' key={ind}>
            <Link to={`/${lang}/insights/blog/${news.id}`} className='insights-card-prev text-deco-none tile-client-story'>
              <div className='d-flex position-relative p-0 overflow-hidden syd-vertical-box'>
                <img src={news.image_url} alt={news.title} className='insights-image transition-03s-eio client-story-tile-img'></img>
                <div className='body-stories-sect d-flex flex-column h-100 w-100 p-4 bkg-tile-client-story syd-vertical-box-body'>
                  <h4 className="insights-title-card fs-2">{news.title}</h4>
                  <h6 className='text-news-desc'>{news.desc}</h6>
                </div>
              </div>
            </Link>
          </div>
          ))
        }
        </div>
      </div> */}
      
      {
        pagingState &&
        <div className='news-btn-more py-3 px-5 m-auto text-uppercase transition-03s-eio d-flex align-items-center gap-1' onClick={showMoreNews}>
          Show more
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
      }

    </div>
  );
};