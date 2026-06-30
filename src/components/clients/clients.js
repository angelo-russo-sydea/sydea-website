import React, { useContext } from 'react';
import './clients.scss';
import { AppContext } from '../../services/translationContext';

export const Clients = () => {
  const { services: {TranslationsService} } = useContext(AppContext);

  return (
    <div className='container'>
      <h2 className='syd-title light fw-bold pt-5 pb-3 px-3'>{TranslationsService.labels('our_clients_include')}</h2>
      <div className='px-3 pb-5 d-flex flex-wrap gap-5 justify-content-between'>
        {
          TranslationsService.getGlobalValue('clients').map((client, i) => ((
            <img src={`${client.image}`} alt={`${client.name}`} className='logo-client-ext' key={i}></img>
          )
          ))
        }
      </div>
    </div>
  );
};