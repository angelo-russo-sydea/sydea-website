import React, { useState } from 'react';
import "./sydea-internal-news.scss";
import { Link } from "react-router-dom";
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';

const textMonitor = [
  {'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore', 'author': 'Batman', 'date': '2020-01-01' },
  {'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod', 'author': 'Thor', 'date': '2020-01-01' },
  {'text': 'Lorem ipsum ', 'author': 'AAA', 'date': '2020-01-01' },
  {'text': 'sed do eiusmod', 'author': '', 'date': '2020-01-01' },
  {'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', 'author': 'Birdman', 'date': '2020-01-01' },
  {'text': 'Lorem ipsum dolor sit amet, consectetur', 'author': 'Spiderman', 'date': '2020-01-01' }
]

export const SydeaInternalNews = () => {
  const { instance } = useMsal();
  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  document.title = 'Sydea Hub';

  const [showFormNewIdea, setShowFormNewIdea] = useState(false);
  const [author, setAuthor] = useState('');
  const [proposal, setProposal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (proposal.trim() === '') {
      setErrorMessage('The Proposal field cannot be empty.');
      return;
    }
    setAuthor('');
    setProposal('');
    setErrorMessage('');
  };

  const handleCancel = () => {
    setAuthor('');
    setProposal('');
    setErrorMessage('');
    setShowFormNewIdea(false);
  };
  
  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='section-home rnd-hub-bg position-relative'>

        <img src={require('../../assets/sydea-hub/acquario.png')} className='img-acquario' alt='Decoration hub'></img>
        <img src={require('../../assets/sydea-hub/tubi.png')} className='img-soffitto' alt='Background hub'></img>
        <img src={require('../../assets/sydea-hub/table.png')} className='img-tavolo' alt='Table hub'></img>

        {/* <div className="neon-sign">Sydea Hub</div> */}

        {/* <div className='syd-hub-signal'>
          <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 669.28 166.67">
            <defs><style></style></defs>
            <path className="cls-1" d="M655.6,111.16l-62.46,48.19c-6.15,4.74-13.7,7.32-21.47,7.32H13.61c-7.52,0-13.61-6.1-13.61-13.61V13.61C0,6.1,6.1,0,13.61,0h558.06c7.77,0,15.32,2.57,21.47,7.32l62.46,48.2c18.23,14.07,18.23,41.58,0,55.65Z"/>
            <path className="cls-2 filter-neon" d="M37.57,112.22v-9.75c9.31,2.01,17.49,3.01,24.56,3.01,5.94,0,10.27-.66,13-1.99,2.73-1.32,4.09-3.79,4.09-7.4v-10.11c0-3.37-.96-5.74-2.89-7.1-1.93-1.36-5.3-2.05-10.11-2.05h-9.15c-7.62,0-13.04-1.52-16.25-4.57-3.21-3.05-4.81-7.78-4.81-14.2v-6.26c0-4.25.94-7.7,2.83-10.35,1.88-2.65,5.06-4.61,9.51-5.9,4.45-1.28,10.57-1.93,18.36-1.93,5.22,0,11.92.44,20.1,1.32v8.79c-9.15-1.36-16.13-2.05-20.94-2.05-7.46,0-12.4.72-14.81,2.17-2.49,1.53-3.73,4.05-3.73,7.58v8.91c0,2.73.98,4.71,2.95,5.96,1.97,1.25,5.36,1.87,10.17,1.87h9.39c5.38,0,9.57.64,12.58,1.93,3.01,1.28,5.13,3.23,6.38,5.84,1.24,2.61,1.87,6.12,1.87,10.53v5.66c0,5.54-1.02,9.91-3.07,13.12-2.05,3.21-5.2,5.5-9.45,6.86-4.25,1.36-9.83,2.05-16.73,2.05s-14.61-.64-23.83-1.93Z"/>
            <path className="cls-2 filter-neon" d="M120.51,113.79l-22.51-59.1h11.8l16.25,47.55h.24l14.69-47.55h10.95l-29.25,83.3h-11.32l9.15-24.19Z"/>
            <path className="cls-2 filter-neon" d="M169.26,112.4c-3.29-1.16-5.68-3.07-7.16-5.72-1.49-2.65-2.23-6.34-2.23-11.07v-25.64c0-5.86,1.82-10.07,5.48-12.64,3.65-2.57,9.69-3.85,18.12-3.85,5.06,0,9.41.64,13.06,1.93,3.65,1.28,5.52,3.13,5.6,5.54h.24l-.24-14.81v-17.45h10.83v84.26h-10.59v-6.86c0,2.17-1.73,4.01-5.18,5.54-3.45,1.69-8.23,2.53-14.32,2.53-5.78,0-10.31-.58-13.6-1.75ZM198.14,104.64c2.65-1.36,3.97-3.69,3.97-6.98v-28.77c0-5.22-5.34-7.82-16.01-7.82-6.42,0-10.59.48-12.52,1.44-2.01.96-3.01,3.09-3.01,6.38v28.77c0,3.29,1.1,5.62,3.31,6.98,2.21,1.37,5.96,2.05,11.25,2.05,6.02,0,10.35-.68,13-2.05Z"/>
            <path className="cls-2 filter-neon" d="M228.6,96.33v-22.99c0-7.06,2.03-12.14,6.08-15.23,4.05-3.09,10.61-4.63,19.68-4.63,8.59,0,14.79,1.49,18.6,4.45,3.81,2.97,5.72,8.11,5.72,15.41v12.88h-39.12v8.79c0,4.01,1.4,6.9,4.21,8.67,2.81,1.77,7.14,2.65,13,2.65,5.54,0,12.08-.96,19.62-2.89v8.3c-7.38,1.6-14.4,2.41-21.06,2.41-17.81,0-26.72-5.94-26.72-17.82ZM267.84,79.12v-9.15c0-3.53-1.06-5.96-3.19-7.28-2.13-1.32-5.76-1.99-10.89-1.99s-8.59.66-10.83,1.99c-2.25,1.32-3.37,3.75-3.37,7.28v9.15h28.29Z"/>
            <path className="cls-2 filter-neon" d="M300.28,112.58c-3.01-1.04-5.18-2.89-6.5-5.54-1.32-2.65-1.99-6.46-1.99-11.43,0-4.41.62-7.84,1.87-10.29,1.24-2.45,3.37-4.19,6.38-5.24,3.01-1.04,7.28-1.56,12.82-1.56h17.45v-9.27c0-2.17-.42-3.83-1.26-5-.84-1.16-2.25-1.99-4.21-2.47-1.97-.48-4.84-.72-8.61-.72-6.02,0-12.68.48-19.98,1.44v-7.94c7.94-.72,15.12-1.08,21.55-1.08,6.74,0,11.72.5,14.93,1.5,3.21,1,5.42,2.75,6.62,5.24,1.2,2.49,1.81,6.34,1.81,11.56v41.17h-10.47v-5.54c-.88,4.5-6.74,6.74-17.57,6.74-5.54,0-9.81-.52-12.82-1.57ZM314.9,107.05c3.93,0,7.26-.28,9.99-.84,3.61-.72,5.42-2.41,5.42-5.05v-15.89h-16.73c-3.45,0-5.94.26-7.46.78-1.53.52-2.53,1.5-3.01,2.95-.48,1.45-.72,3.77-.72,6.98,0,2.89.28,5.12.84,6.68.56,1.57,1.56,2.69,3.01,3.37,1.44.68,3.61,1.02,6.5,1.02h2.17Z"/>
            <path className="cls-2 filter-neon" d="M388.33,34.83h11.68v33.7h41.53v-33.7h11.68v78.12h-11.68v-36.23h-41.53v36.23h-11.68V34.83Z"/>
            <path className="cls-2 filter-neon" d="M477.22,110.12c-3.01-2.69-4.51-6.92-4.51-12.7v-42.73h10.83v42.13c0,1.53.14,2.75.42,3.67.28.92.78,1.87,1.5,2.83,1.44,2.09,4.97,3.13,10.59,3.13,5.94,0,10.11-.56,12.52-1.69,2.33-1.12,3.49-3.17,3.49-6.14v-43.94h10.83v58.26h-10.83v-7.1c-1.04,5.54-7.42,8.31-19.14,8.31-7.46,0-12.7-1.34-15.71-4.03Z"/>
            <path className="cls-2 filter-neon" d="M557.26,113.49c-2.61-.44-5.2-1.26-7.76-2.47-5.22-2.49-7.82-8.19-7.82-17.09V28.69h10.83v24.31c-.08,2.09-.12,4.41-.12,6.98.4-1.85,2.09-3.41,5.06-4.69,3.05-1.2,7.46-1.81,13.24-1.81,16.05,0,24.07,5.5,24.07,16.49v23.95c0,3.45-.5,6.46-1.5,9.03-1,2.57-2.31,4.57-3.91,6.02-1.44,1.37-3.43,2.45-5.96,3.25-2.53.8-5.04,1.32-7.52,1.57-2.25.24-4.98.36-8.19.36-4.33,0-7.8-.22-10.41-.66ZM577.49,106.15c2.21-.6,3.79-1.7,4.75-3.31.96-1.6,1.44-4.05,1.44-7.34v-22.87c0-3.29-.48-5.76-1.44-7.4-.96-1.64-2.55-2.73-4.75-3.25-2.21-.52-5.44-.78-9.69-.78-3.93,0-6.98.32-9.15.96-2.17.64-3.73,1.79-4.69,3.43-.96,1.65-1.44,3.99-1.44,7.04v22.87c0,3.29.46,5.74,1.38,7.34.92,1.61,2.47,2.71,4.63,3.31,2.17.6,5.3.9,9.39.9s7.36-.3,9.57-.9Z"/></svg>
        </div> */}

        <div className='container-sydea-hub d-flex flex-column'>
          <svg className="chain m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 70">
            <path d="M50,0 
                    Q45,15 50,30 
                    Q55,45 50,60 
                    Q45,75 50,90 
                    Q55,105 50,120 
                    Q45,135 50,150 
                    Q55,165 50,180 
                    Q45,195 50,210 
                    Q55,225 50,240 
                    Q45,255 50,270 
                    Q55,285 50,300
                    "
                fill="none" stroke="black" strokeWidth="5"/>
            <circle cx="50" cy="0" r="10" fill="black"/>
            <circle cx="50" cy="300" r="10" fill="black"/>
          </svg>
          <div className="neon-sign">Sydea Hub</div>
          {/* <div className='box-sydea-hub'>
            <p className='m-0 fs-1'>Sydea Hub</p>
          </div> */}
        </div>
        
        <div className='proposal-container d-flex align-items-end gap-2'>
          <div className='monitor-container'>
            <div className='monitor-base'></div>
            <div id="monitor">
              <div id="monitorscreen" className={`h-100`}>
                <p className='fw-bold fs-4 sticky-top px-3 m-0' style={{backgroundColor:'#073500', zIndex:'1'}}>Proposal</p>
                <div className='p-4'>
                  <ul className='list-rnd-hub'>
                  {textMonitor.map((item, index) => (
                    <li key={index} className='pb-4'>
                      <p className='m-0 fw-bold'>{item.text}</p>
                      <p className='m-0 label-author'>
                        {
                          item.author &&
                          <span className='m-0'>{(item.author)}</span>
                        }
                        {
                          item.author && item.date &&
                          <span className='m-0'>,&nbsp;</span>
                        }
                        {
                          item.date &&
                          <span className='m-0'>{(item.date)}</span>
                        }
                      </p>
                    </li>
                  ))}
                  </ul>
                </div>
              </div>
              {/* <div id="monitorscreen" className={`h-100 ${isLoading ? 'animation-tv' : ''}`}>
                {
                  !isLoading &&
                  <>
                    <p className='fw-bold fs-4 sticky-top px-3 m-0' style={{backgroundColor:'#073500', zIndex:'1'}}>Proposal</p>
                    <div className='p-4'>
                      <ul className='list-rnd-hub'>
                      {textMonitor.map((item, index) => (
                        <li key={index} className='pb-4'>
                          <p className='m-0 fw-bold'>{item.text}</p>
                          <p className='m-0 label-author'>
                            {
                              item.author &&
                              <span className='m-0'>{(item.author)}</span>
                            }
                            {
                              item.author && item.date &&
                              <span className='m-0'>,&nbsp;</span>
                            }
                            {
                              item.date &&
                              <span className='m-0'>{(item.date)}</span>
                            }
                          </p>
                        </li>
                      ))}
                      </ul>
                    </div>
                  </>
                }
              </div> */}
              <div className="reflection"></div>
            </div>
          </div>
          <div className='btn-proposal-container'>
            <div className='chiodo top-left'></div>
            <div className='chiodo top-right'></div>
            <div className='chiodo bottom-left'></div>
            <div className='chiodo bottom-right'></div>
            <p className='m-0 text-make-proposal'>Make <br/>your proposal</p>
            <div className="background-button d-flex m-auto">
              <button className="button-red-proposal" onClick={() => setShowFormNewIdea(true)}>PUSH</button>
            </div>
          </div>
        </div>

        {
          showFormNewIdea &&
          <div className='form-new-idea'>
            {
              activeAccount && 
              <div className='header-tablet-rnd p-2 d-flex justify-content-between'>
                {activeAccount && activeAccount.name && (
                  <div className='d-flex gap-3'>
                    <div className='header-user-circle'>
                      <p className='m-0 fw-bold' style={{lineHeight:'normal'}}>{activeAccount.name.split(' ').map(word => word.charAt(0)).join('')}</p>
                    </div>
                    <div>
                      <p className='m-0' style={{fontSize:'0.8rem'}}>{activeAccount.name}</p>
                      <p className='m-0' style={{fontSize:'0.6rem'}}>{activeAccount.username}</p>
                    </div>
                  </div>
                )}
              </div>
            }
            <div className='p-3'>
              <h3 className='fs-3 fw-bold mb-4'>Proposal</h3>
              <form onSubmit={handleSubmit}>
                <div>                
                  <label htmlFor="author" className='m-0 fw-bold'>Author</label>
                  <input
                    type="text"
                    id="author"
                    className='w-100 input-new-idea'
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder='Name'
                  />
                </div>
                <br/>
                <br/>
                <div>
                  <label htmlFor="proposal" className='m-0 fw-bold'>Proposal*</label>
                  <textarea
                    id="proposal"
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    className='w-100 input-new-idea'
                    placeholder='Write your proposal here'
                    rows="10"
                  />
                </div>
                <div style={{minHeight:'2rem'}}>
                  {errorMessage && <p style={{ color: '#ffa600' }} className='m-0 p-0 fw-bold'>{errorMessage}</p>}
                </div>
                <div className='d-flex justify-content-between pt-5'>
                  <button className='btn btn-new-idea first-action fw-bold' type="submit">Submit</button>
                  <button className='btn btn-new-idea fw-bold' onClick={handleCancel}>Cancel</button>
                </div> 
              </form>
            </div>
          </div>
        }
      </div>
      <div id='footer-hub' className='p-4'>
        <Link to='/' className='d-flex aling-items-center gap-1 width-max-content p-2' style={{width:'max-content', border:'1px solid'}}>
          <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 333.33" style={{width:'20px', height:'auto'}}>
            <path d="M33.33,166.67h533.33M33.33,166.67L166.67,33.33M33.33,166.67l133.33,133.33" style={{ fill: 'none', stroke: 'currentcolor', strokeLinecap:'round', strokeLinejoin:'round', strokeWidth:'66.67px'}}/>
          </svg>
          Home
        </Link>

      </div>
    </MsalAuthenticationTemplate>
  );
};

