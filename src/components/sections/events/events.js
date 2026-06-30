import React, {useContext} from 'react';
import { AppContext } from '../../../services/translationContext';
import './events.scss';
import { Link, NavLink, useParams } from "react-router-dom";
import { EventCard } from '../../cards/event-card';
import Slider from '../../slider/slider';

const eventsList = [
  {
    "link": "https://www.wemakefuture.it/",
    "image": "https://d3t3s6w5yvhc3g.cloudfront.net/images/blog/wmf2026.jpg",
    "title": "We Make Future",
    "where": "Bologna",
    "date": "24/06/2026",
    "dateRange": "24-26",
    "textButton": "learn_more"
  },
  {
    "link": "https://www.odoo.com/it_IT/event/business-show-bologna-11003/register?utm_campaign=20260616-business-show-bologna-it&utm_source=partner-sydea&utm_medium=partner",
    "image": "https://www.odoo.com/web/image/52481552-71eb4f3c/221012_NICO091.webp",
    "title": "Odoo Business Show",
    "where": "Bologna",
    "date": "16/06/2026",
    "textButton": "learn_more"
  },
  {
    "link": "https://www.odoo.com/fr_FR/event/business-show-skopje-9967/register?utm_campaign=20260317-business-show-skopje-en&utm_source=partner-sydea&utm_medium=partner",
    "image": "https://odoocdn.com/web/image/43049809-91c3dcb1/auditorium-exhibitors.webp",
    "title": "Odoo Business Show",
    "where": "Skopje",
    "date": "17/03/2026",
    "textButton": "learn_more"
  },
  {
    "link": "https://www.odoo.com/it_IT/event/business-show-firenze-9750/register?utm_campaign=20260310-business-show-firenze-it&utm_source=partner-sydea&utm_medium=partner",
    "image": "https://odoocdn.com/openerp_website/static/src/img/odoo-experience/2025/introduction-business-solution.webp",
    "title": "Odoo Business Show",
    "where": "Firenze",
    "date": "10/03/2026",
    "textButton": "learn_more"
  }
];

export const EventsSection = ({isMenu = false}) => {
  const { services: {TranslationsService} } = useContext(AppContext);

  const getEventDate = (event) => {
    const [, month, year] = event.date.split('/');

    let endDay;

    // Se esiste dateRange usa l'ultimo numero del range
    if (event.dateRange) {
      const range = event.dateRange.split('-');
      endDay = range[range.length - 1];
    } else {
      endDay = event.date.split('/')[0];
    }

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(endDay),
      23, 59, 59
    );
  };

  // Oggi
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // const upcomingEvents = eventsList.filter(
  //   event => getEventDate(event) >= today
  // );

  // const pastEvents = eventsList.filter(
  //   event => getEventDate(event) < today
  // );

  const upcomingEvents = eventsList
    .filter(event => getEventDate(event) >= today)
    .sort((a, b) => getEventDate(a) - getEventDate(b));

  const pastEvents = eventsList
    .filter(event => getEventDate(event) < today)
    .sort((a, b) => getEventDate(b) - getEventDate(a));

  return (
    <div className={`${isMenu ? '':'bkg-light'} d-flex flex-column`}>
      {!isMenu && upcomingEvents.length > 0 &&<h2 className='syd-title dark fw-bold pt-5 pb-3 px-3'>{TranslationsService.labels('upcoming_events')}</h2>}

      {
        upcomingEvents.length > 0 && (
          <Slider>
            {upcomingEvents.map((event, i) => (
              <EventCard
                key={`upcoming-${i}`}
                colMD={3}
                colSM={12}
                title={event.title}
                link={event.link}
                date={event.date}
                dateRange={event.dateRange || ''}
                bgImage={event.image}
                where={event.where}
                textButton={event.textButton}
              />
            ))}
          </Slider>
        )
      }

      {!isMenu && pastEvents.length > 0 && (
        <h2 className='syd-title dark fw-bold pt-5 pb-3 px-3'>
          {TranslationsService.labels('past_events')}
        </h2>
      )}

      {pastEvents.length > 0 && (
        <Slider>
          {pastEvents.map((event, i) => (
            <EventCard
              key={`past-${i}`}
              colMD={3}
              colSM={12}
              title={event.title}
              link={event.link}
              date={event.date}
              dateRange={event.dateRange || ''}
              bgImage={event.image}
              where={event.where}
              textButton={event.textButton}
            />
          ))}
        </Slider>
      )}
      
      {/* <Slider>
        {
          eventsList.map((event, i) => (
            <EventCard 
              key={i}
              colMD={3}
              colSM={12}
              title={event.title}
              link={event.link}
              date={event.date}
              dateRange={event.dateRange || ''}
              bgImage={event.image}
              where={event.where}
              textButton={event.textButton}
            />
          ))
        }
      </Slider> */}
    </div>
  );
};