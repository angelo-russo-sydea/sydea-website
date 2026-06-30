import React, { useState, useContext, useMemo } from 'react';
import "./admin-list.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';
import { MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';

const api = process.env.REACT_APP_URL_API;
const clientId = process.env.REACT_APP_CLIENT_ID;

export const AdminList = () => {
  const { lang } = useParams();
  const { instance, inProgress, accounts } = useMsal();
  let activeAccount;
  if (instance) {
      activeAccount = instance.getActiveAccount();
  }

  document.title = 'Admin List | Sydea';
  const { services: {TranslationsService} } = useContext(AppContext);
  let { id_group } = useParams();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [elements, setElements] = useState([]);
  const [articleLanguage, setArticleLangu] = useState('en');
  const [pagState, setPagState] = useState('');

  useMemo(() => {
    fetch(`${api}/content-public?id=${id_group}&language=${articleLanguage}`)
    .then(response => response.json())
    .then(data => {
      setElements(data.data);
      setPagState(data.paging_state);
    });
  }, []);

  const setArticleLanguage = (languSel) =>{
    setArticleLangu(languSel);
    fetch(`${api}/content-public?id=${id_group}&language=${languSel}`)
    .then(response => response.json())
    .then(data => {
      setElements(data.data);
    });
  }

  const onselItem = (elem, _rowSel) =>{
    if(elem.target.checked){
      setSelectedItems(current => [...current, _rowSel]);
    }
    else{
      setSelectedItems(
        current => [
          ...current.filter((item) => item.id !== _rowSel.id)
        ]
        );
    }
    // console.log(selectedItems);
  }

  const gotoEditEditor = () =>{
    navigate({
      pathname: `/syd-admin/${id_group}/editor`,
      search: `?url_path=${selectedItems[0].url_path}`,
    });
  }

  const deleteItem = () =>{
    const accessTokenRequest = { scopes: [`api://${clientId}/User.Read`] };
    instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessTokenResponse.accessToken}` }
      };
      fetch(`${api}/content?id=${selectedItems[0].id}&timestamp=${selectedItems[0].timestamp}`, requestOptions).then((response) => {
        let _elementsFilter = [...elements];
        let _index = _elementsFilter.indexOf(selectedItems[0]);
        _elementsFilter.splice(_index, 1);
        setElements(_elementsFilter);
        
        const requestOptions = {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessTokenResponse.accessToken}` }
        };
        fetch(`${api}/images?image_name=${selectedItems[0].image}`, requestOptions);
      });
    });
  }

  const loadMoreData = () => {
    let _listEl = [...elements];
    fetch(`${api}/content-public?id=${id_group}&language=${articleLanguage}&paging_state=${pagState}`)
    .then(response => response.json())
    .then(data => {
      _listEl = [..._listEl,...data.data]
      setElements(_listEl);
      setPagState(data.paging_state);
    });
  }
  
  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='section-home light px-5 py-3 pt-5'>
        <Link to={`/${lang}/syd-admin`}  className='btn-dash text-deco-none p-3 text-uppercase transition-03s-eio'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
          <span className='px-1'>Back</span>
        </Link>
        <h1 className='fw-bold text-uppercase mt-4'>{id_group.replace('-', ' ')}</h1>

        <div className='d-flex justify-content-between'>
          <div>
            <button type="button" className="btn btn-primary px-5 text-uppercase fw-bold" onClick={() => navigate(`/syd-admin/${id_group}/editor`)}>New</button>
            <button type="button" className="btn btn-warning mx-2 px-5 text-uppercase fw-bold" onClick={gotoEditEditor} disabled={selectedItems.length == 0 || selectedItems.length > 1}>Edit</button>
            <button type="button" className="btn btn-danger mx-2 px-5 text-uppercase fw-bold" disabled={selectedItems.length == 0} onClick={deleteItem}>Delete</button>
          </div>
          <div>
            <div className="dropdown">
              <a className="btn-langue-article syd-black text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center syd-white transition-03s-eio" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              <span className={`fi fi-${TranslationsService.getGlobalValue(`available_language']['${articleLanguage}']['flag`)}`}></span>
              <span className='syd-black'>{TranslationsService.getGlobalValue(`available_language']['${articleLanguage}']['name`)}</span>
              </a>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {
                  Object.keys(TranslationsService.getGlobalValue('available_language')).map((_langu,i) =>(
                    <li key={i} onClick={() => setArticleLanguage(_langu)}>
                      <a className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio" href="#">
                        <span className={`fi fi-${TranslationsService.getGlobalValue(`available_language']['${_langu}']['flag`)}`}></span>
                        <span>{TranslationsService.getGlobalValue(`available_language']['${_langu}']['name`)}</span>
                      </a>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>

        <div>
          {
            elements?.map((el, i) => (
              <div key={i} className='d-flex align-items-start row-info-doc py-2'>
                <div className='col-ckbx m-auto'>
                  <input type="checkbox" className='ckbx-admin-list' onChange={(e) => onselItem(e, el)}></input>
                </div>
                <div className='col-info d-flex align-items-center justify-content-between'>
                  <div>
                    <p className='m-0 fs-4 fw-bold'>{el.title}</p>
                    <p className='m-0'>{el.author_signature}, {(new Date(el.timestamp)).toLocaleString()}</p>
                    <p className='m-0 fw-bold'>
                      {
                        el.industries &&
                        <span>{TranslationsService.labels(`industries.${el.industries}.title`)} - </span>
                      }
                      {
                        el.service &&
                        <span>{el.service}</span>
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {
          pagState &&
          <div className='btn-load-more-list mx-auto my-3 w-25 text-center p-2' onClick={loadMoreData}>
            <p className='m-0 text-uppercase fs-4'>Load more</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-down-circle" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
            </svg>
          </div>
        }

      </div>
    </MsalAuthenticationTemplate>
  );
};

