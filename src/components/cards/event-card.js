import React, { useContext } from 'react';
import './cards.scss';
import { AppContext } from '../../services/translationContext';
import { Link, useParams } from 'react-router-dom';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TranslationsService from '../../services/translationService';

export const EventCard = ({colMD, colSM, title, link, date, dateRange, bgImage, where, textButton}) => {
  const { lang } = useParams();
  const { services: {TranslationsService} } = useContext(AppContext);

  const getDateParts = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    const locale = lang === "it" ? "it-IT" : "en-GB";

    const dayFormatted = date.toLocaleDateString(locale, { day: "2-digit" });
    const monthFormatted = date.toLocaleDateString(locale, { month: "short" });
    const yearFormatted = date.toLocaleDateString(locale, { year: "numeric" });

    return {
      day: dayFormatted,
      month: monthFormatted,
      year: yearFormatted
    };
  };

  const { day, month, year } = getDateParts(date);

  const isEventFinished = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const eventDate = new Date(`${year}-${month}-${day}`);
    eventDate.setDate(eventDate.getDate() + 1);

    const today = new Date();

    eventDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    return today > eventDate; 
  };

  const finished = isEventFinished(date);

  return (
    <div className={`col-sm-${colSM} col-md-${colMD}`}>
      <Link to={link} className='insights-card-prev text-deco-none tile-client-story' target='_blank' draggable={false}>
        <div className='syd-box flat d-flex position-relative p-0 overflow-hidden syd-client-stories-box'>
          <img src={bgImage} alt={title} className='insights-image transition-03s-eio client-story-tile-img' draggable={false}></img>
          <div className='d-flex flex-column h-100 w-100 p-3 bkg-tile-client-story' style={{zIndex:1}}>
            <div style={{width:'100%'}}>
            {/* <div style={{width:'100%', display:'flex', justifyContent: 'end'}}> */}
              {/* <CalendarTodayOutlinedIcon style={{color: '#f6f6f6', fontSize: '0.9rem', marginRight:'0.3rem'}}/><span style={{color: '#f6f6f6', fontSize: '0.9rem', lineHeight: '0.9rem'}}>{formatDate(date)}</span> */}
              
              <div className={`event-date-box ${finished ? 'finished' : ''}`}>
                
                <div className="event-date-day">
                  {dateRange ? dateRange : day}
                </div>

                <div className="event-date-right">
                  <div className={`event-date-month ${finished ? 'finished' : ''}`}>{month}</div>
                  <div className="event-date-year">{year}</div>
                </div>
              </div>
              {/* <div className="event-date-box">
                <div className="event-date-day">
                  {day}
                </div>

                <div className="event-date-right">
                  <div className="event-date-month">{month}</div>
                  <div className="event-date-year">{year}</div>
                </div>
              </div> */}
            </div>
             <div className='tile-center-events'>
              <h4 className="fw-bold" style={{color: '#f6f6f6', fontSize: '2.7rem', lineHeight: '2.7rem'}}>{title}</h4>
              <h5 style={{color: '#f6f6f6', fontSize: '1rem', lineHeight: '1rem'}}><PinDropOutlinedIcon style={{fontSize:'1rem', marginRight:'0.3rem'}}/>{where}</h5>
            </div>
            <div className='btn-action-event mt-3'>
              <p className='m-0'>{TranslationsService.labels(textButton)}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};