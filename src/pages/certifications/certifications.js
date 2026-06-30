import React, {useContext, useEffect, useRef, useState} from 'react';
import "./certifications.scss";
import { AppContext } from '../../services/translationContext';
import { Link, useParams } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/material';
import { PageHero } from '../../components/page-hero/page-hero';

const CertificationCard = ({ cert, keyId }) => {
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > 400) {
      setShowReadMore(true);
    }
  }, []);

  return (
    <div key={keyId} className="col-sm-12 col-lg-4 p-3">
      <div
        className="box-certifications p-3 d-flex flex-column transition-03s-eio"
        style={{
          maxHeight: expanded ? '100%' : '300px',
          overflow: 'hidden',
          position: 'relative',
          transition: 'max-height 0.3s ease',
        }}
      >
        <div ref={contentRef}>
          <div className='row align-items-center'>
            <div className='col-3 pb-2'>
              <img src={cert.logo} className="" style={{display: "flex", width: "100%", height: "auto"}} alt={cert.title} />
            </div>
            <div className='col-9 ps-2'>
              <h3 className="fw-bold">{cert.title}</h3>
            </div>
          </div>
          <p dangerouslySetInnerHTML={{ __html: cert.desc }}></p>
        </div>

        {/* {cert.link_file && (
          <div className="syd-black transition-03s-eio btn-download-cert mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-file-pdf" viewBox="0 0 16 16">
              <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
              <path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.701 19.701 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.716 5.716 0 0 1-.911-.95 11.642 11.642 0 0 0-1.997.406 11.311 11.311 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.27.27 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.647 12.647 0 0 1 1.01-.193 11.666 11.666 0 0 1-.51-.858 20.741 20.741 0 0 1-.5 1.05zm2.446.45c.15.162.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.881 3.881 0 0 0-.612-.053zM8.078 5.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
            </svg>
            <span>Download</span>
          </div>
        )} */}

        {showReadMore && (
          <div
            style={{
              textAlign: 'center',
              background: expanded ? 'none' : 'linear-gradient(to top, white, transparent)',
              marginTop: '1rem',
              paddingTop: expanded ? '0.5rem' : '2rem',
              position: expanded ? 'static' : 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};


export const Certifications = () => {

  const [certification, setCertification] = useState(null);

  const { lang } = useParams();
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `${TranslationsService.labels('our_certifications')} | ${TranslationsService.getMainInfoCompany('name')}`;

  useEffect(() => {
    setCertification(TranslationsService.labels('certifications'));
  }, [TranslationsService]);

  return (
    <div className="section-home light">

      <PageHero
        bgImage={TranslationsService.labels('hero_sections.certifications.img_path')}
        breadcrumb={[
           { label: TranslationsService.labels(`menu.about.label`), path: 'about' }
        ]}
        title={TranslationsService.labels(`our_certifications`)}
        subtitle={TranslationsService.labels(`hero_sections.certifications.text`)}
      />

      {/* <div className='p-3'>
        <div className='container-fluid'>
          <div className='row'>
            {
              Object.keys(TranslationsService.labels('certifications')).map((_cert, i) => (
                <div className='col-sm-12 col-lg-4 p-3' key={i}>
                  <div className='box-certifications h-100 p-3 d-flex flex-column'>
                    <div>
                      <div className='d-flex'>
                        <img src={TranslationsService.labels(`certifications.${_cert}.logo`)} className='icon-certifications my-4' alt={TranslationsService.labels(`certifications.${_cert}.title`)}></img>
                      </div>
                      <h3 className='fw-bold dark-mode-title'>{TranslationsService.labels(`certifications.${_cert}.title`)}</h3>
                      <p dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`certifications.${_cert}.desc`) }}></p>
                    </div>
                    <div className='syd-black transition-03s-eio btn-download-cert mt-auto'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-file-pdf" viewBox="0 0 16 16">
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                        <path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.701 19.701 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.187-.012.395-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.065.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.716 5.716 0 0 1-.911-.95 11.642 11.642 0 0 0-1.997.406 11.311 11.311 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.27.27 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.647 12.647 0 0 1 1.01-.193 11.666 11.666 0 0 1-.51-.858 20.741 20.741 0 0 1-.5 1.05zm2.446.45c.15.162.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.881 3.881 0 0 0-.612-.053zM8.078 5.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
                      </svg>
                      <span>Download</span>
                    </div>
                  </div>
                </div>
              ))
            }

          </div>
        </div>
      </div> */}

      <div className='p-3'>
        <div className='container-fluid'>
          <div className='row'>
          {certification && Object.entries(certification).map(([category, certList], i) => (
            <React.Fragment key={i}>
              <div className="col-12">
                <h3 className="text-capitalize fw-bold mb-3">{category.replace('-',' ')}</h3>
              </div>
              {certList.map((cert, j) => (
                cert.show_desc ?
                (
                   <CertificationCard keyId={`${i}-${j}`} cert={cert} key={j}/>
                )
                :
                (
                <div key={`${i}-${j}`} className='p-3 d-flex align-items-center justify-content-center text-center box-cert'>
                  <img src={cert.logo} style={{display: "flex", width: "100%", height: "auto", maxWidth:'150px'}} alt={cert.title} />
                  <h3 className="text-desc-cert">{cert.title}</h3>
                </div>
                )
              ))}
            </React.Fragment>
          ))}
          </div>
        </div>
      </div>

    </div>
    
  );
};

