import React, {useContext} from 'react';
import "./the-real-submarine.scss";
import { AppContext } from '../../services/translationContext';

export const TheRealSubmarine = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `The Real Submarine | ${TranslationsService.getMainInfoCompany('name')}`;

  return (
    <div className="section-home light">
      <div className='syd-bg-dark p-5'>
        <img src={require('../../assets/logo/trs_w.png')} alt='The Real Submarine logo' className='w-75 d-block m-auto'></img>
        <p dangerouslySetInnerHTML={{ __html: TranslationsService.labels('the_real_submarine_text') }} className='syd-paragraph syd-body-article-p mt-5'></p>
        <img src={require('../../assets/wir_screen.png')} className='w-75 m-auto d-block py-5' alt='YawClub App'></img>
      </div>
    </div>
  );
};
