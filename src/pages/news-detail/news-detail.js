import React, { useContext, useMemo, useState, useEffect } from 'react';
import "./news-detail.scss";
import { Link, useParams } from "react-router-dom";
import { Buffer } from 'buffer';
import { AppContext } from '../../services/translationContext';
import { Loader } from '../../components/loader/loader';
import axios from 'axios';
import XMLParser from 'react-xml-parser';

const api = process.env.REACT_APP_URL_API;
const pathUrl = process.env.REACT_APP_BASE_URL;
// https://d3t3s6w5yvhc3g.cloudfront.net/images/blog/mk-efaktura.png
const textstring = `
<p class='syd-art-lead'>North Macedonia is entering a new phase of <b>tax digitalization</b>. With the introduction of <b>e-Faktura</b>, the country is moving toward <b>mandatory electronic invoicing for non-cash transactions</b>, aiming to make invoicing more transparent, efficient, and easier to control. </p><p>For companies, this is not just a regulatory update. It’s a <b>fundamental operational change</b> that has a direct impact on ERP systems, administrative processes, and accounting workflows. </p><h2>What is e-Faktura </h2><p><b>e-Faktura</b> is the new centralized electronic invoicing system managed by the <b>Public Revenue Office (PRO)</b> of North Macedonia. Instead of sending invoices as PDF files via email, companies will need to issue <b>structured electronic invoices</b> that are transmitted and validated through a central platform. </p><p>For all non-cash transactions, invoices must be submitted to the DAP platform and validated in real time. Only after validation does the system assign a <b>unique code (eID)</b> that certifies the authenticity of the document. </p><div class='syd-art-highlight-box'><p><strong>Continuous Transaction Control (CTC)</strong></p><p>This approach follows the Continuous CTC model, increasingly adopted worldwide, where tax authorities gain real-time visibility into business transactions. </p></div><h2>How the process works</h2><p>The invoicing process becomes fully structured and controlled:</p><div class='syd-art-steps'><div class='syd-art-step'><div class='syd-art-step-num'>01</div><div class='syd-art-step-content'><h4>Issuance</h4><p>The invoice is created in the company’s ERP or via the official PRO application </p></div></div><div class='syd-art-step'><div class='syd-art-step-num'>02</div><div class='syd-art-step-content'><h4>Submission</h4><p>The invoice is automatically sent to the e-Faktura platform </p></div></div><div class='syd-art-step'><div class='syd-art-step-num'>03</div><div class='syd-art-step-content'><h4>Validation</h4><p>The system checks and validates the data in real time </p></div></div><div class='syd-art-step'><div class='syd-art-step-num'>04</div><div class='syd-art-step-content'><h4>Confirmation</h4><p>A unique identifier (eID) is assigned</p></div></div><div class='syd-art-step'><div class='syd-art-step-num'>05</div><div class='syd-art-step-content'><h4>Delivery</h4><p>The invoice is delivered electronically to the recipient, without the need for email or physical documents</p></div></div></div><p>In this model, the ERP system becomes a <b>critical component for compliance</b>. </p><h2>Key milestones </h2><p>The rollout is already underway and follows a phased approach.</p><div class='syd-art-timeline'><div class='syd-art-timeline-card'><div class='date-badge'>January 2026</div><h4>Pilot phase</h4><p>Companies registered in the e-UJP system can begin testing API integrations and sending test invoices.</p></div><div class='syd-art-timeline-card featured'><div class='date-badge'>Q3 2026 — October</div><h4>Entry into force</h4><p>A widespread requirement for all taxpayers who issue invoices for non-cash transactions.</p></div></div><h3>Why this change matters </h3><div class='syd-art-highlight-box syd-art-stat-inline'><span class='num'>~30%</span><span class='label'>the informal economy accounts for this proportion of Macedonia’s GDP (Ministry of Finance)</span></div><p>The introduction of e-Faktura addresses a specific need within the Macedonian tax system. The objectives are clear: to reduce tax evasion, modernise the tax administration, strengthen VAT enforcement and improve real-time monitoring of economic activity.</p><h2>A dual-track system </h2><p>One of the most important aspects is the presence of two parallel workflows:</p><div class='syd-art-binario'><div class='syd-art-binario-col'><div class='syd-art-binario-label'>e-Faktura system</div><h4>Non-cash transactions</h4><p>All B2B and B2G transactions will be covered by the new centralised electronic invoicing system.</p></div><div class='syd-art-binario-col'><div class='syd-art-binario-label'>Tax regime</div><h4>Cash transactions</h4><p>The traditional tax reporting rules currently in force continue to apply.</p></div></div><p>This means companies will need to manage <b>parallel processes</b>, with different rules and controls. For businesses handling both types of transactions, it is essential to implement controls that clearly distinguish the two flows. </p><h2>Operational impact for companies</h2><p>This change goes beyond invoice format. It reshapes how invoicing is handled across the organization.</p><p>To comply, companies will need to:</p><ul><li>Integrate their systems with the <b>e-Faktura APIs</b></li><li>Manage <b>structured invoice formats</b> (not only PDFs) </li><li>Track invoice status </li><li>Handle errors and exceptional cases </li><li>Update accounting and internal control processes </li></ul><h3>Business benefits </h3><p>While the transition requires effort, the long-term benefits are significant:</p><ul><li><b>Paperless processes</b>: no printing, physical archiving, or manual processes </li><li><b>Cost reduction</b>: lower logistics, storage, and administrative costs </li><li><b>Higher efficiency:</b> automation and fewer manual errors </li><li><b>Data reliability</b>: real-time validation and full traceability </li></ul><p>Preparing early helps avoid operational issues and turn a regulatory requirement into a <b>business advantage</b>.</p><h2>Technical considerations </h2><h3>Invoice format </h3><p>The e-Faktura system is based on structured electronic invoices in <b>XML UBL format</b>. This means generating a PDF is not enough: the document must contain structured data that the platform can validate automatically. </p><h3>Integration options </h3><p>Companies can choose between two main approaches: </p><ol><li><b>Web portal</b>: A free portal provided by PRO, suitable for small businesses or low invoice volumes.</li><li><b>API integration</b>: For medium and large companies, API integration allows ERP systems to communicate directly to the e-Faktura platform, enabling full automation</li></ol><h3>What companies should do now </h3><ul class='syd-art-checklist'><li>Check whether their ERP software is compatible with the new system </li><li>Integrate their ERP systems with the e-Faktura platform via API </li><li>Train internal teams on new requirements and formats </li><li>Define procedures for handling validations, rejections, and corrections </li><li>Implement controls to separate e-Faktura and fiscalized transactions </li></ul><h2>Sydea’s solution</h2><p>At Sydea, we are well aware of the challenges involved in integrating legislation with business systems, and we closely monitor developments in e-Faktura legislation.</p><div class='syd-art-why'><div class='syd-art-why-text'><div class='hero-syd-art-tag' style='margin-bottom: 16px;'>Why choose Sydea </div><p style='color: rgba(255,255,255,0.7); font-size: 16px; margin-bottom: 0;'>With over <strong style='color: var(--yellow);'>years of experience</strong> in ERP integration and business process digitalization, Sydea is the ideal partner to support your company on the path to tax compliance in North Macedonia.</p><p style='color: rgba(255,255,255,0.7); font-size: 16px; margin-top: 16px; margin-bottom: 0;'>Our team based in <strong style='color: var(--yellow);'>Skopje</strong> has a deep understanding of the local regulatory environment and can support you at every stage of the project: from requirements analysis to implementation, from staff training to post-go-live assistance.</p></div><div class='syd-art-why-stats'><div class='syd-art-why-stat'><span class='syd-art-why-num'>10+</span><span class='syd-art-why-label'>years in ERP</span></div><div class='syd-art-why-stat'><span class='syd-art-why-num'>360°</span><span class='syd-art-why-label'>support</span></div><div class='syd-art-why-stat'><span class='syd-art-why-num'>MK</span><span class='syd-art-why-label'>local team in Skopje</span></div></div></div><div class='syd-art-cta-section'><span class='product-name'>Get ready for e-invoicing </span><h2>The roll-out is already underway</h2><p>Acting in advance is essential to be fully prepared and avoid operational disruptions. If you need guidance on how to update your systems or correctly integrate the new requirements into your business processes, the Sydea team is ready to support you. .</p><div class='syd-art-cta-pills'><span class='syd-art-cta-pill'>Native ERP integration</span><span class='syd-art-cta-pill'>Guaranteed UBL XML compliance</span><span class='syd-art-cta-pill'>Dual-track management</span><span class='syd-art-cta-pill'>Local team in Skopje</span></div><a href='/en/contacts' target='_blank' class='syd-art-cta-btn'>Contact us to find out more →</a></div>
`;

// https://d3t3s6w5yvhc3g.cloudfront.net/media/presentazione-hd.mp4

export const NewsDetail = () => {
  // let { news_id } = useParams();
  // const { services: {TranslationsService} } = useContext(AppContext);
  // const [newsInfo, setNewsInfo] = useState([]);
  // const [showLoader, setShowLoader] = useState(false);

  // useMemo(() => {
  //   setShowLoader(true);
  //   fetch(`${api}/content-public?url_path=${news_id}`)
  //   .then(response => response.json())
  //   .then(data => {
  //     setNewsInfo(data.data[0]);
  //     document.title = `${TranslationsService.labels(`client_stories`)} - ${data.data[0].title} | ${TranslationsService.getMainInfoCompany('name')}`;
  //     setShowLoader(false);
  //   });
  // }, [TranslationsService, news_id]);

  // const getHtmlContent = () => {
  //   try{
  //     let htmlText = Buffer.from(newsInfo.content, "base64");
  //     return htmlText;
  //   }
  //   catch(e){
  //     return '';
  //   }

  // }

  // return (
  //   <div className="section-home light">
  //     {
  //       showLoader &&
  //       <Loader />
  //     }
  //     <section className='hero-story-det syd-hero position-relative p-0' style={{backgroundImage:newsInfo.image?`url(https://d3t3s6w5yvhc3g.cloudfront.net/images/${newsInfo.image})`:''}}>
  //       <div className='overlay-area-info w-100 d-flex flex-column justify-content-center p-5'>
  //         <p className='dark-mode-text m-0 breadcrumb-detail'>
  //           <Link to='/' className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
  //           &nbsp;&#9656;&nbsp;
  //           <Link to='/sydea-blog' className='text-deco-none dark-mode-text transition-03s-eio'>Blog</Link>
  //         </p>
  //         <h2 className='syd-title light text-uppercase'>{newsInfo.title}</h2>
  //         <p className='dark-mode-text fs-1 m-0'>{newsInfo.description}</p>
  //       </div>
  //     </section>

  //     <div dangerouslySetInnerHTML={{ __html: getHtmlContent() }} className='w-100 p-3 area-text-cs'></div>
  //   </div>
  // );

  let { news_id, lang } = useParams();
  const { services: {TranslationsService} } = useContext(AppContext);
  const [newsInfo, setNewsInfo] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await axios.get('https://www.carloliaci.com/feed', {
  //         headers: {'Content-Type': 'application/xml; charset=utf-8'},
  //       });

  //       const xml = new XMLParser().parseFromString(response.data);
  //       const items = xml.getElementsByTagName('item');

  //       setPosts(items);
  //       console.log(items);
  //     } catch (error) {
  //       setError('Errore nel fetch dei dati: ' + error.message);
  //     } finally {
  //       setShowLoader(false);
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  // useMemo(() => {
  //   setTimeout(() => {
  //     const story = TranslationsService.labels(`blog_sect`).filter(x => x.id === news_id)[0];
  //     setNewsInfo(story);
  //     document.title = `Blog - ${story.title} | ${TranslationsService.getMainInfoCompany('name')}`;
  //   }, 10);
  // }, [TranslationsService, news_id]);

useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          // `${pathUrl}/static/content/blog.json?_cache_buster=${Date.now()}`
          `${pathUrl}/static/content/blog.json?_cache_buster=${new Date().getTime()}`, {cache: 'no-store'}
        );

        if (!response.ok) {
          throw new Error(`Errore HTTP ${response.status}`);
        }

        const data = await response.json();
        const story = data[lang].find((x) => x.id === news_id);

        if (story && story.id !== newsInfo?.id) {
          setNewsInfo(story);
        }
      } catch (err) {
        console.error("Errore nel caricamento del blog:", err);
        setError("Impossibile caricare la notizia.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [news_id]);

  useEffect(() => {
    if (newsInfo?.title) {
      document.title = `Blog - ${newsInfo.title} | ${TranslationsService.getMainInfoCompany("name")}`;
    }
  }, [newsInfo]);

   if (loading) return <p>Caricamento in corso...</p>;

  return (
    <div className="section-home light">
      {
        showLoader &&
        <Loader />
      }
      <section className='hero-story-det syd-hero position-relative p-0' style={{backgroundImage: `url(${newsInfo.image_url})`}}>
        <div className='overlay-area-info w-100 d-flex flex-column justify-content-center'>
          <div className='box-text-section'>
            <div className='area-text-section'>
              <p className='dark-mode-text m-0 breadcrumb-detail'>
                <Link to={`/${lang}`}  className='text-deco-none dark-mode-text transition-03s-eio'>Home</Link>
                &nbsp;&#9656;&nbsp;
                <Link to={`/${lang}/insights`} className='text-deco-none dark-mode-text transition-03s-eio'>{TranslationsService.labels(`menu.insights.label`)}</Link>
                &nbsp;&#9656;&nbsp;
                <Link to={`/${lang}/insights/blog`} className='text-deco-none dark-mode-text transition-03s-eio'>Blog</Link>
              </p>
              <h2 className='title-insights-section fw-bold font-title'>{newsInfo.title}</h2>
              {/* <p className='dark-mode-text fs-4 m-0'>{newsInfo.desc}</p> */}
              <div className='insights-desc-box'>
                <div className='box-line-insights-desc'>
                  <div className='line-insights-desc'></div>
                </div>
                <div className='box-text-insights-desc'>
                  <div className='box-format-text-insights'>
                    <p className='dark-mode-text syd-body-article-p m-0'>{newsInfo.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='syd-article-container'>
        <div className='body-text area-text-cs syd-body-article-p syd-art-paper'>
          {/* <div dangerouslySetInnerHTML={{ __html: textstring }}></div> */}
          <div dangerouslySetInnerHTML={{ __html: newsInfo.long_text }}></div>
        </div>

        {
          Object.keys(newsInfo).length > 0 && newsInfo.bu_area.key &&
          <div className='d-flex flex-wrap p-3'>

            <Link to={`/${lang}/services/${newsInfo.bu_area.key}`} className='syd-chips transition-03s-eio text-deco-none syd-black breadcrumb-detail' style={{color:'#141414'}}>
              <p className='m-0'>{TranslationsService.labels(`services.${newsInfo.bu_area.key}.title`)}
              {
                newsInfo.bu_area.sub_items &&
                <span> - {TranslationsService.labels('services')[newsInfo.bu_area.key].items[newsInfo.bu_area.sub_items].title}</span>
              }
              </p>
            </Link>
            
            {
              newsInfo.bu_service?.map((service, i) => (
                newsInfo.bu_area.sub_items ?
                (
                  <Link key={i} to={`/${lang}/services/${newsInfo.bu_area.key}/${newsInfo.bu_area.sub_items}/${service}`} className='syd-chips transition-03s-eio text-deco-none syd-black breadcrumb-detail' style={{color:'#141414'}}>
                    <p className='m-0 text-end'>{TranslationsService.labels('services')[newsInfo.bu_area.key].items[newsInfo.bu_area.sub_items][service].title}</p>
                  </Link>
                )
                :
                (
                  <Link key={i} to={`/${lang}/services/${newsInfo.bu_area.key}/${service}`} className='syd-chips transition-03s-eio text-deco-none syd-black breadcrumb-detail' style={{color:'#141414'}}>
                    <p className='m-0'>{TranslationsService.labels(`services.${newsInfo.bu_area.key}.${newsInfo.bu_service}.title`)}</p>
                  </Link>
                )
              ))
            }

          </div>
          }
      </div>

      {/* <div>
        <h1>WordPress Posts</h1>
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              <h2>{post.title[0]}</h2>
              <div dangerouslySetInnerHTML={{ __html: post.description[0] }} />
            </li>
          ))}
        </ul>
      </div> */}

      {/* <div dangerouslySetInnerHTML={{ __html: getHtmlContent() }} className='w-100 p-3 area-text-cs'></div> */}
    </div>
  );
};
