import React, { useContext, useEffect, useState, useRef } from "react";
import "./contacts.scss";
import { AppContext } from "../../services/translationContext";
import { Buffer } from 'buffer';
import Box from '@mui/material/Box';
import CircularProgress, {circularProgressClasses} from '@mui/material/CircularProgress';

const appOwner = process.env.REACT_APP_OWNER;
const api = process.env.REACT_APP_URL_API;
const turnstile_key = process.env.REACT_APP_TURNSTILE;

export const Contacts = () => {
  const { services: { TranslationsService } } = useContext(AppContext);
  document.title = `${TranslationsService.labels(`menu.contact-us.label`)} | ${TranslationsService.getMainInfoCompany('name')}`;
  const [showToast, setShowToast] = useState('hide');
  const [isLoading, setIsLoading] = useState(false);

  const widgetRef = useRef(null);
  const widgetId = useRef(null);

  useEffect(() => {
    const renderWidget = () => {
      if (!window.turnstile || !widgetRef.current) {
        setTimeout(renderWidget, 100);
        return;
      }
      if (widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: turnstile_key,
      });
    };
    renderWidget();
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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (event) => {
    const mailForm = TranslationsService.getMailTemaplateContact();
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

    // let body_mail = '';
    // console.log(body_mail);

    // let body_mail = `
    // <div style='font-size:14px;'>
    //   <p>Dear ${name},</p>
    //   <p>Thank you for contacting us through the form on our website. We have received your message and all the information you provided.</p>
    //   <p>The content of your message is as follows:</p>
    //   <div style="font-size:12px; width:max-content; min-width:75%; white-space: pre-wrap;">
    //   <p>${formatTextWithBr(bodyMail)}</p>
    //   </div>
    //   <p>Our team is working diligently to carefully review your request and provide you with a comprehensive response as soon as possible.</p>
    //   <p>If you have any further questions or needs, please do not hesitate to contact us.</p>
    //   <br/>
    //   <p>Best regards,<br/>Sydea</p>
    //   <div style="display:flex; gap:20px; align-items:center; background: #e5e5e5; padding: 10px;">
    //     <div style="width:150px">
    //       <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 758 246">
    //       <path d="m117.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7-.7-.5-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.6-.2-9.2-.7" style="fill:#0b0c0c;"/><polygon points="157.7 233.5 146.9 215.8 152 215.8 159.9 229.8 167.9 215.8 173 215.8 162.1 233.4 162.1 245.5 157.7 245.5 157.7 233.5" style="fill:#0b0c0c;"/>
    //       <path d="m182.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7s-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.7-.2-9.2-.7" style="fill:#0b0c0c;"/><polygon points="222.3 218.9 212.2 218.9 212.2 215.8 236.9 215.8 236.9 218.9 226.8 218.9 226.8 245.5 222.3 245.5 222.3 218.9" style="fill:#0b0c0c;"/><polygon points="245.9 215.8 265.9 215.8 265.9 218.9 250.3 218.9 250.3 228.6 264.4 228.6 264.4 231.7 250.3 231.7 250.3 242.4 266.3 242.4 266.3 245.5 245.9 245.5 245.9 215.8" style="fill:#0b0c0c;"/><polygon points="275.9 215.8 282.5 215.8 292.1 240.5 292.2 240.6 301.3 215.8 307.7 215.8 307.7 245.5 303.8 245.5 303.8 220.4 303.6 220.4 294 245.5 290 245.5 280.1 220.4 279.9 220.4 279.9 245.5 275.9 245.5 275.9 215.8" style="fill:#0b0c0c;"/><rect x="340.8" y="215.8" width="4.4" height="29.8" style="fill:#0b0c0c;"/><polygon points="354.4 215.8 359.7 215.8 375.9 240.4 375.9 215.8 379.8 215.8 379.8 245.5 374.4 245.5 358.3 220.5 358.3 245.5 354.4 245.5 354.4 215.8" style="fill:#0b0c0c;"/><polygon points="399 218.9 388.9 218.9 388.9 215.8 413.6 215.8 413.6 218.9 403.5 218.9 403.5 245.5 399 245.5 399 218.9" style="fill:#0b0c0c;"/><polygon points="422.7 215.8 442.7 215.8 442.7 218.9 427.2 218.9 427.2 228.6 441.2 228.6 441.2 231.7 427.2 231.7 427.2 242.4 443.2 242.4 443.2 245.5 422.7 245.5 422.7 215.8" style="fill:#0b0c0c;"/>
    //       <path d="m462.3,245.8c-1.1-.1-2.2-.4-3.4-.7-1.3-.4-2.5-.8-3.4-1.4s-1.7-1.3-2.2-2.3c-.6-1-.9-2.2-.9-3.5v-14.1c0-1.7.4-3.2,1.3-4.4.9-1.2,2.1-2.1,3.7-2.7,1.5-.5,2.9-.9,4.3-1.1s2.8-.3,4.4-.3c3.8,0,7.2.2,10.3.7v3.4c-1.2-.3-2.8-.5-5-.8-2.2-.2-3.9-.3-5.2-.3-6.3,0-9.4,1.8-9.4,5.4v14c0,1,.3,1.8.9,2.6.6.7,1.4,1.3,2.5,1.6,1,.4,2,.6,2.9.8,1,.1,2.1.2,3.3.2,2,0,4.2-.3,6.6-.8v-10.4h-7v-3.1h11v16c-4,.9-7.6,1.4-11,1.4-1.4,0-2.6-.1-3.7-.2" style="fill:#0b0c0c;"/>
    //       <path d="m488,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.5v-29.7Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z" style="fill:#0b0c0c;"/>
    //       <path d="m529.8,215.8h5.1l11.6,29.8h-4.6l-3.4-9h-12.8l-3.4,9h-4.3l11.8-29.8Zm7.6,17.6l-5-13.4h-.4l-5,13.4h10.4Z" style="fill:#0b0c0c;"/><polygon points="561.9 218.9 551.8 218.9 551.8 215.8 576.4 215.8 576.4 218.9 566.4 218.9 566.4 245.5 561.9 245.5 561.9 218.9" style="fill:#0b0c0c;"/>
    //       <path d="m585.6,237.9v-14.1c0-5.7,4.2-8.5,12.5-8.5s12.6,2.8,12.6,8.5v14.1c0,2.9-1.2,4.9-3.5,6.2-2.3,1.3-5.4,1.9-9.1,1.9-8.4,0-12.5-2.7-12.5-8.1m20.7,0v-14.2c0-3.7-2.8-5.5-8.3-5.5-2.7,0-4.7.4-6.1,1.2-1.4.8-2.1,2.3-2.1,4.3v14.2c0,3.4,2.8,5.1,8.3,5.1s8.2-1.7,8.2-5.1" style="fill:#0b0c0c;"/>
    //       <path d="m619.8,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.4l-.1-29.7h0Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z" style="fill:#0b0c0c;"/>
    //       <path d="m443,55.9v75c0,14-2.8,24.8-8.2,32.5-5.5,7.7-14.5,13.1-27,16.2s-29.8,4.7-52,4.7h-87v-67.5l42.8-65.3v101.4h42.2c12.1,0,21.3-.5,27.4-1.6,6.2-1,10.6-3.1,13.4-6.1,2.7-3,4.1-7.8,4.1-14.2V55.2c0-8.7-3.4-14.8-10.4-18.3-6.5-3.3-16.6-5-30.3-5.2h-.8l-69.9.1-47.9,78.3v74.4h-44.3v-73.8l-47.9-79.3c-30.7.1-67.6.4-75.3.4-14.9,0,1.5.1-7.3.1-12,0-20.3,9.8-20.3,15.5v10.3c0,9.6,8.1,14.5,24.4,14.5h37.5c21,0,36.2,3.9,45.7,11.6,9.5,7.8,14.2,19.6,14.2,35.5v12.2c0,22-4.1,35.3-15.9,43.8-10.6,7.6-26,9.1-36.2,9.1-9.3,0-14.1.7-27.5.5-16.2-.1-55.9.3-86.4-.1v-29.5c31.3,0,76.1.1,87.9.1,21.2,0,33.9.7,33.9-19.1v-11.9c0-6-1.8-10.7-5.3-13.9-3.5-3.2-9.8-4.8-18.9-4.8h-36.9C20.3,105.7,0,89.6,0,57.4v-13.6C0,27.7,6.7,15.9,20.2,8.3,33.6.7,34.2.4,63.4.4h65.2l-.1-.1h50.2l38.9,72.1L256.2.3h99.4c6.1,0,11.8.1,17.1.4,13.6.7,25,2.2,34,4.6,12.5,3.3,21.7,9,27.5,17.2,5.8,7.8,8.8,19,8.8,33.4Z" style="fill:#0b0c0c;"/><polygon points="563.4 147.3 563.4 184.2 455.3 184.2 455.3 120.9 492.4 120.9 492.4 147.3 563.4 147.3" style="fill:#0b0c0c;"/>
    //       <path d="m587.2,120.9l-23.4,63.4h43.7l21.3-63.4h-41.6Zm142.3,0h-43.2l21.2,63.4h44.8l-22.8-63.4ZM685.9,0h-53.9l-33,89.3h40.5l17.6-52.4h1.1l17.6,52.4h42.5L685.9,0Z" style="fill:#0b0c0c;"/><polygon points="563.8 0 563.8 36.9 492.4 36.9 492.4 89.4 455.3 89.4 455.3 0 563.8 0" style="fill:#0b0c0c;"/><polygon points="492.4 120.9 492.4 89.3 563.5 89.4 563.5 48 587.3 120.9 492.4 120.9" style="fill:#feca21;"/><polygon points="758 120.9 628.8 120.9 639.4 89.4 746.6 89.4 758 120.9" style="fill:#feca21;"/>
    //       <path d="m117.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7-.7-.5-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.6-.2-9.2-.7" style="fill:#0b0c0c;"/><polygon points="157.7 233.5 146.9 215.8 152 215.8 159.9 229.8 167.9 215.8 173 215.8 162.1 233.4 162.1 245.5 157.7 245.5 157.7 233.5" style="fill:#0b0c0c;"/>
    //       <path d="m182.5,245.3v-3.7c3.5.8,6.7,1.1,9.4,1.1,2.3,0,3.9-.3,5-.8,1-.5,1.6-1.4,1.6-2.8v-3.9c0-1.3-.4-2.2-1.1-2.7s-2-.8-3.9-.8h-3.5c-2.9,0-5-.6-6.2-1.7-1.2-1.2-1.8-3-1.8-5.4v-2.4c0-1.6.4-2.9,1.1-3.9.7-1,1.9-1.8,3.6-2.2,1.7-.5,4-.7,7-.7,2,0,4.5.2,7.7.5v3.3c-3.5-.5-6.1-.8-8-.8-2.8,0-4.7.3-5.6.8-.9.6-1.4,1.5-1.4,2.9v3.4c0,1,.4,1.8,1.1,2.3.7.5,2,.7,3.9.7h3.6c2,0,3.6.2,4.8.7,1.1.5,2,1.2,2.4,2.2.5,1,.7,2.3.7,4v2.2c0,2.1-.4,3.8-1.2,5s-2,2.1-3.6,2.6-3.7.8-6.4.8-5.7-.2-9.2-.7" style="fill:#0b0c0c;"/><polygon points="222.3 218.9 212.2 218.9 212.2 215.8 236.9 215.8 236.9 218.9 226.8 218.9 226.8 245.5 222.3 245.5 222.3 218.9" style="fill:#0b0c0c;"/><polygon points="245.9 215.8 265.9 215.8 265.9 218.9 250.3 218.9 250.3 228.6 264.4 228.6 264.4 231.7 250.3 231.7 250.3 242.4 266.3 242.4 266.3 245.5 245.9 245.5 245.9 215.8" style="fill:#0b0c0c;"/><polygon points="275.9 215.8 282.5 215.8 292.1 240.5 292.2 240.6 301.3 215.8 307.7 215.8 307.7 245.5 303.8 245.5 303.8 220.4 303.6 220.4 294 245.5 290 245.5 280.1 220.4 279.9 220.4 279.9 245.5 275.9 245.5 275.9 215.8" style="fill:#0b0c0c;"/><rect x="340.8" y="215.8" width="4.4" height="29.8" style="fill:#0b0c0c;"/><polygon points="354.4 215.8 359.7 215.8 375.9 240.4 375.9 215.8 379.8 215.8 379.8 245.5 374.4 245.5 358.3 220.5 358.3 245.5 354.4 245.5 354.4 215.8" style="fill:#0b0c0c;"/><polygon points="399 218.9 388.9 218.9 388.9 215.8 413.6 215.8 413.6 218.9 403.5 218.9 403.5 245.5 399 245.5 399 218.9" style="fill:#0b0c0c;"/><polygon points="422.7 215.8 442.7 215.8 442.7 218.9 427.2 218.9 427.2 228.6 441.2 228.6 441.2 231.7 427.2 231.7 427.2 242.4 443.2 242.4 443.2 245.5 422.7 245.5 422.7 215.8" style="fill:#0b0c0c;"/>
    //       <path d="m462.3,245.8c-1.1-.1-2.2-.4-3.4-.7-1.3-.4-2.5-.8-3.4-1.4s-1.7-1.3-2.2-2.3c-.6-1-.9-2.2-.9-3.5v-14.1c0-1.7.4-3.2,1.3-4.4.9-1.2,2.1-2.1,3.7-2.7,1.5-.5,2.9-.9,4.3-1.1s2.8-.3,4.4-.3c3.8,0,7.2.2,10.3.7v3.4c-1.2-.3-2.8-.5-5-.8-2.2-.2-3.9-.3-5.2-.3-6.3,0-9.4,1.8-9.4,5.4v14c0,1,.3,1.8.9,2.6.6.7,1.4,1.3,2.5,1.6,1,.4,2,.6,2.9.8,1,.1,2.1.2,3.3.2,2,0,4.2-.3,6.6-.8v-10.4h-7v-3.1h11v16c-4,.9-7.6,1.4-11,1.4-1.4,0-2.6-.1-3.7-.2" style="fill:#0b0c0c;"/>
    //       <path d="m488,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.5v-29.7Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z" style="fill:#0b0c0c;"/>
    //       <path d="m529.8,215.8h5.1l11.6,29.8h-4.6l-3.4-9h-12.8l-3.4,9h-4.3l11.8-29.8Zm7.6,17.6l-5-13.4h-.4l-5,13.4h10.4Z" style="fill:#0b0c0c;"/><polygon points="561.9 218.9 551.8 218.9 551.8 215.8 576.4 215.8 576.4 218.9 566.4 218.9 566.4 245.5 561.9 245.5 561.9 218.9" style="fill:#0b0c0c;"/>
    //       <path d="m585.6,237.9v-14.1c0-5.7,4.2-8.5,12.5-8.5s12.6,2.8,12.6,8.5v14.1c0,2.9-1.2,4.9-3.5,6.2-2.3,1.3-5.4,1.9-9.1,1.9-8.4,0-12.5-2.7-12.5-8.1m20.7,0v-14.2c0-3.7-2.8-5.5-8.3-5.5-2.7,0-4.7.4-6.1,1.2-1.4.8-2.1,2.3-2.1,4.3v14.2c0,3.4,2.8,5.1,8.3,5.1s8.2-1.7,8.2-5.1" style="fill:#0b0c0c;"/>
    //       <path d="m619.8,215.8h10.5c2.6,0,4.7.2,6.2.5s2.6.9,3.3,1.7c.7.8,1,2,1,3.6v5.1c0,1.8-.7,3.1-2.2,4.1s-3.3,1.4-5.5,1.4l9.5,13.3h-5.5l-8.5-12.7h-4.3v12.7h-4.4l-.1-29.7h0Zm10.3,14.1c2.2,0,3.8-.3,4.7-.8,1-.5,1.4-1.5,1.4-2.9v-4.2c0-2.2-1.9-3.3-5.8-3.3h-6.2v11.2h5.9Z" style="fill:#0b0c0c;"/><polygon points="563.4 147.3 563.4 184.2 455.3 184.2 455.3 120.9 492.4 120.9 492.4 147.3 563.4 147.3" style="fill:#0b0c0c;"/>
    //       <path d="m587.2,120.9l-23.4,63.4h43.7l21.3-63.4h-41.6Zm142.3,0h-43.2l21.2,63.4h44.8l-22.8-63.4ZM685.9,0h-53.9l-33,89.3h40.5l17.6-52.4h1.1l17.6,52.4h42.5L685.9,0Z" style="fill:#0b0c0c;"/><polygon points="563.8 0 563.8 36.9 492.4 36.9 492.4 89.4 455.3 89.4 455.3 0 563.8 0" style="fill:#0b0c0c;"/><polygon points="492.4 120.9 492.4 89.3 563.5 89.4 563.5 48 587.3 120.9 492.4 120.9" style="fill:#feca21;"/><polygon points="758 120.9 628.8 120.9 639.4 89.4 746.6 89.4 758 120.9" style="fill:#feca21;"/></svg>
    //     </div>
    //     <div>
    //       <ul style="list-style:none; margin:0; display:flex; gap:20px">
    //         <li>
    //           <p style="font-size:10px; margin:0"><b>Bologna</b></p>
    //           <p style="font-size:10px; margin:0">${TranslationsService.getGlobalValue('bologna_adress')}</p>
    //         </li>
    //         <li>
    //           <p style="font-size:10px; margin:0"><b>Napoli</b></p>
    //           <p style="font-size:10px; margin:0">${TranslationsService.getGlobalValue('napoli_adress')}</p>
    //         </li>
    //         <li>
    //           <p style="font-size:10px; margin:0"><b>Skopje</b></p>
    //           <p style="font-size:10px; margin:0">${TranslationsService.getGlobalValue('skopje_adress')}</p>
    //         </li>
    //         <li>
    //           <p style="font-size:10px; margin:0"><b>Vancouver</b></p>
    //           <p style="font-size:10px; margin:0">${TranslationsService.getGlobalValue('vancouver_adress')}</p>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </div>
    // `;

    let buffer = Buffer.from(body_mail);
    let base64String = buffer.toString('base64');

    let _body = {
      to: [email],
      subject: `Confirmation of Request Receipt - ${mailSubject}`,
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

    const turnstileToken = window.turnstile.getResponse(widgetId.current);
    if (!turnstileToken) {
      alert("Complete Human Verification before continue");
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'x-origin-verify': 'BB6a2U8jgygBYCqo8yfW8HT9P8EKafR2',
        'x-turnstile-response': turnstileToken,
      },
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

      <div className="p-3 text-end box-locations-mobile">
      {
        TranslationsService.getGlobalValue('offices')?.map((offices, i) => ((
          <div key={i}>
            <h2 className="fs-4 fw-bold m-0 dark-mode-title">{offices.city}</h2>
            <p className="m-0">
              <a href={offices.google_maps ? offices.google_maps : undefined} target='_blank' rel="noreferrer" className='text-deco-none link-office-contact'>
                {offices.address}
              </a>
            </p>
            {
              offices.phone_number &&
              <p className="m-0">
                <a href={`tel:offices.phone_number`} className='text-deco-none link-office-contact m-0'> 
                  {`${offices.phone_number.substring(0, 3)} ${offices.phone_number.substring(3, 6)} ${offices.phone_number.substring(6, offices.phone_number.length)}`}
                </a>
              </p>
            }
          </div>
        )))
      }
      </div>

    <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ backgroundColor: '#FECE2F' }}>
      <span style={{ fontWeight: '600', fontSize: '1rem', color: '#090909' }}>
        {TranslationsService.labels('textContactBanner')}
      </span>
      <a
        href="mailto:info@sydea.com"
        style={{
          backgroundColor: '#090909',
          color: '#fff',
          fontWeight: '700',
          fontSize: '0.95rem',
          padding: '0.6rem 1.8rem',
          textDecoration: 'none',
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
          marginLeft: '1.5rem',
        }}
      >
        {TranslationsService.labels('textButtonContactBanner')}
      </a>
    </div>
      
      <div className="position-relative map-locations">
        
        {
          appOwner === 'sydea' &&
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 860" className='w-100 position-absolute'>
              <rect className="cls-1-map" width="1920" height="860"/>
              <circle className="cls-4-map" cx="1662.92" cy="508.81" r="5"/>
              <rect className="cls-3-map" x="1036.84" y="194.77" width="540.66" height="111.17"/>
              <text className="cls-8-map" transform="translate(1064.15 262.63)">
                <tspan className="cls-5-map">
                  <tspan x="0" y="0">
                    <a href={TranslationsService.getGlobalValue('offices')[0].google_maps ? TranslationsService.getGlobalValue('offices')[0].google_maps : undefined} target='_blank' rel="noreferrer" className='cls-3-map text-deco-none cls-5-map transition-03s-eio'>
                      {TranslationsService.getGlobalValue('offices')[0].address}
                    </a>
                  </tspan>
                </tspan>
                {
                  TranslationsService.getGlobalValue('offices')[0].phone_number &&
                  <tspan className="cls-6-map"><tspan x="0" y="24">
                    <a href={`tel:${TranslationsService.getGlobalValue('offices')[0].phone_number}`} className='text-deco-none transition-03s-eio'> 
                      {`${TranslationsService.getGlobalValue('offices')[0].phone_number.substring(0, 3)} ${TranslationsService.getGlobalValue('offices')[0].phone_number.substring(3, 6)} ${TranslationsService.getGlobalValue('offices')[0].phone_number.substring(6, TranslationsService.getGlobalValue('offices')[0].phone_number.length)}`}
                    </a>
                  </tspan>
                  </tspan>
                }
              </text>
              <text className="cls-7-map" transform="translate(1064.15 234.51)">
                <tspan x="0" y="0" className="text-uppercase">{TranslationsService.getGlobalValue('offices')[0].city}</tspan>
              </text>
              <rect className="cls-3-map" x="871.97" y="496.85" width="540.57" height="111.15"/>
              <polyline className="cls-2-map" points="871.97 496.85 1412.53 496.85 1700.79 566.65"/>
              <text className="cls-8-map" transform="translate(890.15 564.7)">
                <tspan className="cls-5-map">
                  <tspan x="0" y="0">
                    <a href={TranslationsService.getGlobalValue('offices')[1].google_maps ? TranslationsService.getGlobalValue('offices')[1].google_maps : undefined} target='_blank' rel="noreferrer" className='cls-3-map text-deco-none cls-5-map transition-03s-eio'>
                      {TranslationsService.getGlobalValue('offices')[1].address}
                    </a>
                  </tspan>
                </tspan>
                {
                  TranslationsService.getGlobalValue('offices')[1].phone_number &&
                  <tspan className="cls-6-map"><tspan x="0" y="24">
                    <a href={`tel:${TranslationsService.getGlobalValue('offices')[1].phone_number}`} className='text-deco-none transition-03s-eio'> 
                      {`${TranslationsService.getGlobalValue('offices')[1].phone_number.substring(0, 3)} ${TranslationsService.getGlobalValue('offices')[1].phone_number.substring(3, 6)} ${TranslationsService.getGlobalValue('offices')[1].phone_number.substring(6, TranslationsService.getGlobalValue('offices')[1].phone_number.length)}`}
                    </a>
                  </tspan>
                  </tspan>
                }
                </text>
                <text className="cls-7-map" transform="translate(890.15 536.57)">
                  <tspan x="0" y="0" className="text-uppercase">{TranslationsService.getGlobalValue('offices')[1].city}</tspan>
                </text>
                <circle className="cls-4-map" cx="1701.13" cy="566.82" r="5"/>
                <rect className="cls-3-map" x="1129.83" y="714.99" width="540.64" height="111.49"/>
                <polyline className="cls-2-map" points="1129.83 715.54 1670.48 715.54 1786.23 554.4"/>
                <text className="cls-8-map" transform="translate(1148.48 782.91)">
                  <tspan className="cls-5-map">
                    <tspan x="0" y="0">
                      <a href={TranslationsService.getGlobalValue('offices')[2].google_maps ? TranslationsService.getGlobalValue('offices')[2].google_maps : undefined} target='_blank' rel="noreferrer" className='cls-3-map text-deco-none cls-5-map transition-03s-eio'>
                        {TranslationsService.getGlobalValue('offices')[2].address}
                      </a>
                    </tspan>
                  </tspan>
                  {
                    TranslationsService.getGlobalValue('offices')[2].phone_number &&
                    <tspan className="cls-6-map"><tspan x="0" y="24">
                      <a href={`tel:${TranslationsService.getGlobalValue('offices')[2].phone_number}`} className='text-deco-none transition-03s-eio'> 
                        {`${TranslationsService.getGlobalValue('offices')[2].phone_number.substring(0, 3)} ${TranslationsService.getGlobalValue('offices')[2].phone_number.substring(3, 6)} ${TranslationsService.getGlobalValue('offices')[2].phone_number.substring(6, TranslationsService.getGlobalValue('offices')[2].phone_number.length)}`}
                      </a>
                    </tspan>
                    </tspan>
                  }
                </text>
                <text className="cls-7-map" transform="translate(1148.48 754.79)">
                  <tspan x="0" y="0" className="text-uppercase">{TranslationsService.getGlobalValue('offices')[2].city}</tspan>
                </text>
                <circle className="cls-4-map" cx="1786.23" cy="554.4" r="5"/>
                <polyline className="cls-2-map" points="1036.84 194.77 1577.49 194.77 1662.98 508.52"/>
                <rect className="cls-3-map" x="369.17" y="130.72" width="641" height="111.17"/>
                <text className="cls-8-map" transform="translate(396.48 198.58)">
                  <tspan className="cls-5-map">
                    <tspan x="0" y="0">
                    <a href={TranslationsService.getGlobalValue('offices')[3].google_maps ? TranslationsService.getGlobalValue('offices')[3].google_maps : undefined} target='_blank' rel="noreferrer" className='cls-3-map text-deco-none cls-5-map transition-03s-eio'>
                        {TranslationsService.getGlobalValue('offices')[3].address}
                      </a>
                    </tspan>
                  </tspan>
                  {
                    TranslationsService.getGlobalValue('offices')[3].phone_number &&
                    <tspan className="cls-6-map"><tspan x="0" y="24">
                      <a href={`tel:${TranslationsService.getGlobalValue('offices')[3].phone_number}`} className='text-deco-none transition-03s-eio'> 
                        {`${TranslationsService.getGlobalValue('offices')[3].phone_number.substring(0, 3)} ${TranslationsService.getGlobalValue('offices')[3].phone_number.substring(3, 6)} ${TranslationsService.getGlobalValue('offices')[3].phone_number.substring(6, TranslationsService.getGlobalValue('offices')[3].phone_number.length)}`}
                      </a>
                    </tspan>
                    </tspan>
                  }
                </text>
                <text className="cls-7-map" transform="translate(396.48 170.45)">
                  <tspan x="0" y="0" className="text-uppercase">{TranslationsService.getGlobalValue('offices')[3].city}</tspan>
                </text>
              <circle className="cls-4-map" cx="95.77" cy="345.39" r="5"/>
              <polyline className="cls-2-map" points="1010.23 130.72 369.17 130.72 95.83 345.1"/>
            </svg>
            <img
              src={require("../../assets/image/offices_map.png")}
              className="w-100"
              alt="Sydea Offices"
            ></img>
          </>
        }
      </div>

      {
        TranslationsService.showContactFormMain() &&
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
                className="w-100 p-3 input-contact"
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
                className="w-100 p-3 input-contact"
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
                className="w-100 p-3 input-contact"
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
                className="w-100 p-3 input-contact"
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
            <div ref={widgetRef}></div>
            <button type="submit" className="syd-button m-0 mb-3 px-5" disabled={isLoading} style={{textTransform: 'inherit', borderRadius:0, fontWeight: 'bold', padding: '1rem 4rem !important', fontSize:'1.125rem'}}>
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
