import React, { useContext } from 'react';
import "./partners.scss";
import { AppContext } from '../../services/translationContext';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import parse, { domToReact } from 'html-react-parser';

export const Partners = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `${TranslationsService.labels(`our_partners`)} | ${TranslationsService.getMainInfoCompany('name')}`;
  
  const popoverHoverFocus = (textPartner) => (
    <Popover id="popover-trigger-hover-focus">
      <p className='dark-mode-text transition-03s-eio' dangerouslySetInnerHTML={{ __html: textPartner }}></p>
    </Popover>
  );


  const checkIfFirstOrLastTwo = (index) => {
    const elementIndexInRow = index % 4;
    if (elementIndexInRow === 0 || elementIndexInRow === 1) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="section-home light p-5">
      <div className='container'>
        <h2 className='syd-title fw-bold'>{TranslationsService.labels('our_partners')}</h2>
        <div className='row g-4'>
          {
            TranslationsService.labels('partners').map((_partner, ind) => (
              // <div key={ind} className='col-sm-6 col-lg-3 position-relative main-box-pa'>
              //   <div className='partner-box d-flex align-items-center justify-content-center transition-03s-eio'>
              //     <a href={_partner.path} target='_blank' rel="noreferrer" className='d-flex flex-column align-items-center justify-content-center text-deco-none position-relative pad-box-ref'>
              //       <OverlayTrigger
              //         trigger={['hover', 'focus']}
              //         placement={checkIfFirstOrLastTwo(ind) ? 'right' : 'left'}
              //         overlay={popoverHoverFocus(_partner.text)}
              //       >
              //         <img src={_partner.logo} alt={_partner.name} className='w-100 transition-03s-eio'></img>
              //       </OverlayTrigger>
              //     </a>
              //   </div>
              // </div>
              <div key={ind} className='col-sm-6 col-lg-3 position-relative'>
                <OverlayTrigger trigger={['hover', 'focus']} placement={checkIfFirstOrLastTwo(ind) ? 'right' : 'left'} overlay={popoverHoverFocus(_partner.text)}>
                  <a href={_partner.path} target='_blank' rel="noreferrer" className='partner-box d-flex align-items-center justify-content-center transition-03s-eio'>
                    <img src={_partner.logo} />
                  </a>
                  </OverlayTrigger>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

