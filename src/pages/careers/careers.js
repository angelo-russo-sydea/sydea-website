import React, { useContext, useEffect, useState } from 'react';
import "./careers.scss";
import { AppContext } from '../../services/translationContext';
import { Buffer } from 'buffer';
import Box from '@mui/material/Box';
import CircularProgress, {circularProgressClasses} from '@mui/material/CircularProgress';
import parse from 'html-react-parser';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MailIcon from '@mui/icons-material/Mail';
import { useParams } from 'react-router-dom';
import { PageHero } from '../../components/page-hero/page-hero';

const api = process.env.REACT_APP_URL_API;

export const Careers = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `${TranslationsService.labels(`menu.careers.label`)} | ${TranslationsService.getMainInfoCompany('name')}`;
  const [showToast, setShowToast] = useState('hide');
  const [jobopen, setJobopen] = useState([]);
  const { lang } = useParams();

  useEffect(() => {
    const fetchLabel = async () => {
      const label = await TranslationsService.labels("careers.open_roles");
      setJobopen(label);
    };
    fetchLabel();
  }, []);

  const formatTextWithBr = (text) => {
    let textArea = '';
    text.split('\n').map((line, index) => (
      textArea +=`${line}<br />`
    ));
    return textArea;
  };

  const initialFormData = {
    name: '',
    mailSubject: '',
    email: '',
    bodyMail: '',
    isChecked: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (event) => {
    const mailForm = TranslationsService.getMailTemaplateCareers();
    event.preventDefault();
    const { name, mailSubject, email, bodyMail } = formData;

    let body_mail = mailForm.template;
    const variables = { name, mailSubject, email, bodyMail };

    Object.keys(variables).forEach(key => {
      const regex = new RegExp('\\${' + key + '}', 'g');
      if (body_mail.indexOf('${' + key + '}') !== -1) {
        if (key === 'bodyMail') {
          const formattedValue = formatTextWithBr(variables[key]);
          body_mail = body_mail.replace(regex, formattedValue);
        } else {
          body_mail = body_mail.replace(regex, variables[key]);
        }
      } else {
        console.error(`La stringa iniziale non contiene ${key}`);
      }
    });

    let buffer = Buffer.from(body_mail);
    let base64String = buffer.toString('base64');

    let _body = {
      to: [email],
      subject: `Careers: Confirmation of Request Receipt - ${mailSubject}`,
      body: base64String,
    };

    setIsLoading(true);
    setTimeout(() => {
      setFormData(initialFormData);
      setShowToast('show');
      setTimeout(() => {
        setShowToast('hide');
        setIsLoading(false);
      }, 2000);
    }, 1000);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-origin-verify': 'BB6a2U8jgygBYCqo8yfW8HT9P8EKafR2' },
      body: JSON.stringify(_body)
    };
    fetch(`${api}/mail`, requestOptions).then((response) => {
      // setFormData(initialFormData);
      // setShowToast('show');
      // setTimeout(() => {
      //   setShowToast('hide');
      // }, 3000);
    })
    .catch((error) => {
      setFormData(initialFormData);
    });
  };

  function CustomCircularProgress(props) {
    return (
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          sx={(theme) => ({
            color: theme.palette.grey[800],
            ...theme.applyStyles('dark', {
              color: theme.palette.grey[800],
            }),
          })}
          size={50}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={(theme) => ({
            color: '#fece2f',
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
            ...theme.applyStyles('dark', {
              color: '#308fe8',
            }),
          })}
          size={50}
          thickness={4}
          {...props}
        />
      </Box>
    );
  }

  return (
    <div className="section-home light">

      <PageHero
        bgImage={TranslationsService.labels('hero_sections.careers.img_path')}
        breadcrumb={[]}
        title={TranslationsService.labels(`menu.careers.label`)}
        subtitle={TranslationsService.labels(`hero_sections.careers.text`)}
        hideBreadcrumb={true}
      />

          {/* {items.map(({ id, text, children, cssClass }) => (
            <li key={id} className={cssClass}>
              <a href={`#${id}`}>{text}</a>
              {renderIndex(children)}
            </li>
          ))} */}

      {
        jobopen && jobopen.length > 0 &&
         <div className='p-3 width-open-roles'>
          <h2><b>{TranslationsService.labels(`openRoles`)}</b></h2>
          <br/>
          { jobopen.map((job, i) => (
            <div key={i}>
              <h3 className='m-0' style={{fontSize: '4rem'}}><b>{job.role}</b></h3>
              <div className='d-flex gap-3'>
                <div className='d-flex gap-1 align-items-center' style={{color:'#6e6e6eff'}}>
                  <LocationOnOutlinedIcon/>
                  <span>{job.location}</span>
                </div>
                <div className='d-flex gap-1 align-items-center' style={{color:'#6e6e6eff'}}>
                  <BusinessCenterOutlinedIcon/>
                  <span>{job.time}</span>
                </div>
              </div>
              <br/>
              <div>{parse(job.jobDescription)}</div>
              <div className='d-flex justify-content-center'>
                <a href={job.linkedinBtn} className='flex items-center text-white px-4 py-2 shadow-sm d-flex' style={{backgroundColor: '#0a66c2', textDecoration:'none', width:'max-content', alignItems:'center', gap:'0.5rem', fontFamily:'Helvetica', borderRadius:'99.9rem'}}>
                  <svg version="1.1" id="Layer_1" x="0px" y="0px" width="16px" height="16px" viewBox="-3.5 0.5 16 16" enable-background="new -3.5 0.5 16 16" xmlSpace="preserve">
                    <path fill="#FFFFFF" d="M-3.5,16.5h3.2V5.323h-3.2V16.5z M8.325,5.134C6.4,5.134,5.515,6.157,5.033,6.9V5.323h-3.2
                      c0.046,1.021,0,11.177,0,11.177h3.2l0.023-6.23c0-0.329,0.022-0.652,0.118-0.888c0.263-0.654,0.993-1.415,1.993-1.415
                      c1.312,0,2.133,0.667,2.133,2.133V16.5h3.2v-6.396C12.5,6.754,10.71,5.134,8.325,5.134z"></path>
                    <path fill="#FFFFFF" d="M-1.927,3.701h0.02c0.99,0,1.607-0.652,1.607-1.467c-0.019-0.834-0.617-1.467-1.588-1.467
                      c-0.976,0-1.612,0.632-1.612,1.467C-3.501,3.049-2.881,3.701-1.927,3.701z"></path>
                  </svg>
                  <span className='ml-4'><b>{TranslationsService.labels(`apply_with_linkedin`)}</b></span>
                </a>
              </div>
              <div className='d-flex justify-content-center mt-3'>
                {
                  lang === 'it' ?
                  (
                    <a href={`mailto:hr@sydea.com?subject=Candidatura spontanea - ${job.role}`} className='flex items-center text-white px-4 py-2 shadow-sm d-flex' style={{backgroundColor: '#848484ff', textDecoration:'none', width:'max-content', alignItems:'center', gap:'0.5rem', fontFamily:'Helvetica', borderRadius:'99.9rem'}}>
                      <MailIcon />
                      <span className='ml-4'><b>Candidati tramite mail</b></span>
                    </a>
                  )
                  :
                  (
                    <a href={`mailto:hr@sydea.com?subject=Speculative Application - ${job.role}`} className='flex items-center text-white px-4 py-2 shadow-sm d-flex' style={{backgroundColor: '#848484ff', textDecoration:'none', width:'max-content', alignItems:'center', gap:'0.5rem', fontFamily:'Helvetica', borderRadius:'99.9rem'}}>
                      <MailIcon />
                      <span className='ml-4'><b>Apply by email</b></span>
                    </a>
                  )
                }
              </div>
            </div>
          ))}

         </div>
      }

      {
        TranslationsService.labels(`careers.our_work`) && Object.keys(TranslationsService.labels(`careers.our_work`)).length > 0 &&
        <section className='p-3 bg-main-color'>
          <div className='row'>
            <div className='col-sm-12 col-lg-6 p-5 d-flex flex-column justify-content-center'>
              <h3 className='fw-bold fs-1'>{TranslationsService.labels(`careers.our_work.title`)}</h3>
              <p className='syd-body-article-p' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`careers.our_work.text`) }}></p>
            </div>
            <div className='col-sm-12 col-lg-6 d-flex flex-column justify-content-center'>
              <img src={require('../../assets/careers/our_work.jpg')} className='img-fluid' alt={TranslationsService.labels(`careers.our_work.title`)}></img>
            </div>
          </div>
        </section>
      }

      {
        TranslationsService.labels(`careers.our_values`) && Object.keys(TranslationsService.labels(`careers.our_values`)).length > 0 &&
        <section className='p-3 light-mode-bg'>
          <div className='row light-mode-text'>
            <div className='col-sm-12 col-lg-6 d-flex flex-column justify-content-center'>
              <img src={require('../../assets/careers/our_values.png')} className='img-fluid' alt={TranslationsService.labels(`careers.our_values.title`)}></img>
            </div>
            <div className='col-sm-12 col-lg-6 p-5 d-flex flex-column justify-content-center'>
            <h3 className='fw-bold fs-1'>{TranslationsService.labels(`careers.our_values.title`)}</h3>
              <p className='syd-body-article-p' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`careers.our_values.text`) }}></p>
            </div>
          </div>
        </section>
      }

      {
        TranslationsService.labels(`careers.who_are_we_looking_for`) && Object.keys(TranslationsService.labels(`careers.who_are_we_looking_for`)).length > 0 &&
        <section className='p-3 dark-mode-bg'>
          <div className='row dark-mode-text'>
            <div className='col-sm-12 col-lg-6 p-5 d-flex flex-column justify-content-center'>
              <h3 className='fw-bold fs-1 dark-mode-title'>{TranslationsService.labels(`careers.who_are_we_looking_for.title`)}</h3>
              <p className='syd-body-article-p dark-mode-text' dangerouslySetInnerHTML={{ __html: TranslationsService.labels(`careers.who_are_we_looking_for.text`) }}></p>
            </div>
            <div className='col-sm-12 col-lg-6 d-flex flex-column justify-content-center'>
              <img src={require('../../assets/careers/we_want_u.png')} className='img-fluid' alt={TranslationsService.labels(`careers.who_are_we_looking_for.title`)}></img>
            </div>
          </div>
        </section>
      }
      
      {
        TranslationsService.showContactFormCareers() &&
        <div className="p-3">
        <div className="box-contact m-auto p-4">
          <h2 className="syd-title dark fw-bold py-3">
            {TranslationsService.labels(`menu.contact-us.label`)}
          </h2>
          <form onSubmit={handleSubmit} className="width-form" id="contact-form">
            <div className="my-3">
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={`${TranslationsService.labels('formName')}*`}
                className="w-100 p-2 input-contact"
                disabled={isLoading}
              />
            </div>
            <div className="my-3">
              <input
                required
                type="text"
                name="mailSubject"
                value={formData.mailSubject}
                onChange={handleChange}
                placeholder={`${TranslationsService.labels('formSubject')}*`}
                className="w-100 p-2 input-contact"
                disabled={isLoading}
              />
            </div>
            <div className="my-3">
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={`${TranslationsService.labels('formMail')}*`}
                className="w-100 p-2 input-contact"
                disabled={isLoading}
              />
            </div>
            <div className="my-3">
              <textarea
                required
                name="bodyMail"
                value={formData.bodyMail}
                onChange={handleChange}
                rows={5}
                placeholder={TranslationsService.labels(`formComment`)}
                className="w-100 p-2 input-contact"
                disabled={isLoading}
              />
            </div>
            <label className="my-3 syd-checkbox-label">
              <input className="syd-checkbox" type="checkbox" required
                name="isChecked"
                checked={formData.isChecked}
                onChange={handleChange}
                disabled={isLoading}
              />
              {TranslationsService.labels(`textSubmitForm`)}
            </label>
            <button type="submit" className="syd-button m-0 mb-3 px-5" disabled={isLoading}>
              {TranslationsService.labels(`buttonSubmitForm`)}
            </button>
          </form>
          
          {
            isLoading &&
            <div className='box-fixed-loader'>
              <CustomCircularProgress />
            </div>
          }

          <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex:'11'}}>
            <div id="liveToast" className={`toast ${showToast} text-white bg-success`} role="alert" aria-live="assertive" aria-atomic="true">
              <div className="d-flex">
                <div className="toast-body" style={{fontSize:'18px'}}>
                  {TranslationsService.labels(`msg_toast_submit_form`)}
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      }

    </div>
  );
};

