import React, {useContext} from 'react';
import './client-stories.scss';
import { NavLink, Link, useParams } from "react-router-dom";
import { AppContext } from '../../../services/translationContext';
import { FlatCard } from '../../cards/flat-card';
import Slider from '../../slider/slider';

export const ClientStoriesSection = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  const { lang } = useParams();

  return (
    <div className='syd-bg-light'>
      <div className='container'>
        <h2 className="syd-title light fw-bold pt-5 px-3">{TranslationsService.labels(`client_stories`)}</h2>
        {
          TranslationsService.labels(`hero_sections.client_stories.text`) &&
          <p className='px-3 fs-4'>{TranslationsService.labels(`hero_sections.client_stories.text`)}</p>
        }
        <div className='p-3 d-flex flex-column'>
          <div className='row gap-3 gap-lg-0'>
            <Slider>

            {
              TranslationsService.labels(`client_stories_sect`).map((_cStory, i) => (
                _cStory.show_home &&

                <FlatCard
                  key={i}
                  colMD={3}
                  colSM={12}
                  title={_cStory.title}
                  link={`/${lang}/insights/client-stories/${_cStory.id}`}
                  backgroundColor={_cStory.backgroundColor}
                  textColor={_cStory.text_color}
                  logo={_cStory.client_logo}
                  titleColor={_cStory.title_color}
                  buArea={_cStory.bu_area}
                  buService={_cStory.bu_service}
                />

                // <div className='col-sm-12 col-lg-3' key={i}>
                //   <Link to={`/${lang}/insights/client-stories/${_cStory.id}`} className='text-deco-none tile-client-story'>
                //     <div className='syd-box d-flex position-relative p-0 overflow-hidden syd-client-stories-box client-story-tile-img transition-03s-eio' style={{backgroundColor: _cStory.backgroundColor, color: _cStory.text_color, flexDirection:'column'}}>
                //       <div className='d-flex align-items-center justify-content-center' style={{overflow: 'hidden', flexBasis: '100%', maxWidth:'100%', padding: '2rem'}}>
                //         <img src={_cStory.client_logo} style={{maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain'}}></img>
                //       </div>
                //       <div className='body-stories-sect d-flex flex-column h-100 w-100 p-4 pt-0 bkg-tile-client-story syd-vertical-box-body'>
                //         <h4 className="fw-bold" style={{color:_cStory.title_color}}>{_cStory.title}</h4>
                //         <div className='d-flex align-items-center gap-2'>
                //             <div
                //               style={{ height: '0.6rem', width: '0.6rem', borderRadius: 50 }}
                //               className='bg-main-color'
                //             />
                //             <p className='m-0 text-uppercase' style={{ fontSize: '0.8rem' }}>
                //               {TranslationsService.labels(`services.${_cStory.bu_area.key}.title`)}
                //               {_cStory.bu_area.sub_items && (
                //                 <span>
                //                   {' '}– {TranslationsService.labels('services')[_cStory.bu_area.key].items[_cStory.bu_area.sub_items].title}
                //                 </span>
                //               )}
                //             </p>
                //           </div>
                //         <br/>
                //         {
                //           _cStory.bu_service.map(service => {
                //             const title = getServiceTitle(
                //               _cStory.bu_area.key,
                //               _cStory.bu_area.sub_items,
                //               service
                //             );

                //             if (!title) return null;

                //             return (
                //               <div className='d-flex align-items-center gap-2' key={service}>
                //                 <p className='m-0 text-uppercase' style={{ fontSize: '0.8rem' }}>
                //                   {title}
                //                 </p>
                //               </div>
                //             );
                //           })
                //         }


                //         </div>
                //     </div>
                //   </Link>
                // </div>
              ))
            }
            </Slider>
          </div>

          <NavLink to={`/${lang}/insights/client-stories`} className="fw-bold fs-4 ref-syd-nav transition-03s-eio light-mode-text px-2 py-3">
            {TranslationsService.labels('view_all_stories')}
            <svg viewBox="0 0 7.48 11.59" className='icon-arrow ms-2'><polyline className="arrow-all transition-03s-eio" stroke='currentColor' points="1 1 6.48 5.8 1 10.59"/></svg>
          </NavLink>
        </div>
      </div>
    </div>
  );
};