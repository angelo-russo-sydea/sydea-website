import React, { useState, useContext, useMemo } from 'react';
import "./admin-article.scss";
import { Link, useLocation, useParams } from "react-router-dom";
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState,convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Buffer } from 'buffer';
import { AppContext } from '../../services/translationContext';
import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { InteractionStatus } from "@azure/msal-browser";
import { v4 as uuid } from 'uuid';
import { Loader } from '../../components/loader/loader';

const api = process.env.REACT_APP_URL_API;
const clientId = process.env.REACT_APP_CLIENT_ID;

export const AdminArticle = () => {
  const { instance, inProgress, accounts } = useMsal();
  let activeAccount;
  if (instance) {
      activeAccount = instance.getActiveAccount();
  }

  let { id_group } = useParams();
  document.title = 'Admin | Sydea';
  const { services: {TranslationsService} } = useContext(AppContext);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleDesc, setArticleDesc] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [articleLanguage, setArticleLangu] = useState('en');
  const [clientStoryIndustry, setClientStoryIndustry] = useState('');
  const [clientStoryService, setClientStoryService] = useState('');
  const [titleHeroImage, setTitleHeroImage] = useState('');
  const [showToast, setShowToast] = useState('hide');
  const [severityToast, setSeverityToast] = useState('danger');
  const [toastMsg, setToastMsg] = useState('');
  const [urlPathEdit, setUrlPathEdit] = useState('');
  const [editArticle, setEditArticle] = useState([]);
  const [prevArticletext, setPrevArticletext] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search)

  useMemo(() => {
    setPrevArticletext('');
    if(queryParameters.get("url_path")){
      setUrlPathEdit(queryParameters.get("url_path"));
      fetch(`${api}/content-public?url_path=${queryParameters.get("url_path")}`)
      .then(response => response.json())
      .then(data => {
        setEditArticle(data.data[0]);
        setArticleTitle(data.data[0].title);
        setArticleLangu(data.data[0].language);
        setArticleDesc(data.data[0].description);
        setTitleHeroImage(data.data[0].image);
        
        if(id_group === 'client-stories'){
          setClientStoryIndustry(data.data[0].industries);
          setClientStoryService(data.data[0].service);
        }
        let htmlText = Buffer.from(data.data[0].content, "base64");
        let str = htmlText.toString("utf8");
        setPrevArticletext(str);
        setEditorState(EditorState.createWithContent(customContentStateConverter(ContentState.createFromBlockArray(convertFromHTML(str)))));
        // setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(str))));
        setFile(`https://d3t3s6w5yvhc3g.cloudfront.net/images/${data.data[0].image}`);
      });
    }
  }, []);

  const customContentStateConverter = (contentState) => {
    const newBlockMap = contentState.getBlockMap().map((block) => {
      const entityKey = block.getEntityAt(0);
      if (entityKey !== null) {
        const entityBlock = contentState.getEntity(entityKey);
        const entityType = entityBlock.getType();
        switch (entityType) {
            case 'IMAGE': {
                const newBlock = block.merge({
                    type: 'atomic',
                    text: 'img',
                });
                return newBlock;
            }
            default:
                return block;
        }
      }
      return block;
    });
    const newContentState = contentState.set('blockMap', newBlockMap);
    return newContentState;
}

  const saveText = () =>{
    setShowToast('hide');
    setSeverityToast('danger');
    setTimeout(() => {
      if(!articleTitle){
        setToastMsg('Enter the Title!');
        setShowToast('show');
        return;
      }
      if(!titleHeroImage){
        setToastMsg('Enter the Image!');
        setShowToast('show');
        return;
      }
      if(id_group === 'client-stories'){
        if(!clientStoryIndustry){
          setToastMsg('Enter the Industry!');
          setShowToast('show');
          return;
        }
        if(!clientStoryService){
          setToastMsg('Enter the Service!');
          setShowToast('show');
          return;
        }
      }
      setShowLoader(true);
      let _htmlText = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      let buff = Buffer.from(_htmlText, "utf8");
      let base64 = buff.toString("base64");

      if(prevArticletext){
        const regex = /<img\b[^>]*src=['"]([^'"]+)['"][^>]*>/g;
        const risultati_prev = [];
        const risultati = [];
        let match;
        
        while ((match = regex.exec(_htmlText))) {
          const src = match[1];
          risultati.push(src);
        }
  
        while ((match = regex.exec(prevArticletext))) {
          const src = match[1];
          risultati_prev.push(src);
        }
        if (risultati.length > 0) {
          if(risultati_prev.length > 0){
            risultati_prev.forEach((prev_ris,i)=>{
              if(!risultati.includes(prev_ris)){
                const accessTokenRequest = { scopes: [`api://${clientId}/User.Read`] };
                instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
                  const requestOptions = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessTokenResponse.accessToken}` }
                  };
                  fetch(`${api}/images?image_name=${prev_ris.split('d3t3s6w5yvhc3g.cloudfront.net')[1]}`, requestOptions).then((response) => {
                  });
                });
              }
            })
          }
        }
        else{
          if(risultati_prev.length > 0){
            risultati_prev.forEach((prev_ris,i)=>{
              const accessTokenRequest = { scopes: [`api://${clientId}/User.Read`] };
              instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
                const requestOptions = {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessTokenResponse.accessToken}` }
                };
                fetch(`${api}/images?image_name=${prev_ris.split('d3t3s6w5yvhc3g.cloudfront.net/images/')[1]}`, requestOptions).then((response) => {
                });
              });
            })
          }
        }
      }

      const accessTokenRequest = { scopes: [`api://${clientId}/User.Read`] };
      instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
        let accessToken = accessTokenResponse.accessToken;
        let parthUuid = uuid();
        
        let _body = {
          author: activeAccount.username,
          author_signature: activeAccount.name,
          category: id_group,
          description: articleDesc,
          content: base64,
          language: articleLanguage,
          public_content: true,
          title: articleTitle,
          image: titleHeroImage,
          url_path: `${articleTitle.replace(/\s/g,'')}_${parthUuid}`
        };
        if(urlPathEdit){
          _body['timestamp'] = editArticle.timestamp;
        }
        if(id_group === 'client-stories'){
          _body['industries'] = clientStoryIndustry;
          _body['service'] = clientStoryService;
        }

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
          body: JSON.stringify(_body)
        };
        fetch(`${api}/content`, requestOptions).then((response) => {
          setSeverityToast('success');
          setToastMsg('Saved correctly!');
          setShowToast('show');
          setShowLoader(false);
        });
      });
    }, 0);
  }

  const setArticleLanguage = (languSel) =>{
    setArticleLangu(languSel);
  }

  const handleChangeTitle = (val) => {
    setArticleTitle(val.target.value);
  }

  const handleChangeDesc = (val) => {
    setArticleDesc(val.target.value);
  }

  const setSelIndustries = (indu) => {
    setClientStoryIndustry(indu)
  };

  const setSelService= (area, serv) => {
    setClientStoryService(`${area},${serv}`);
  };

  const [file, setFile] = useState(null);

  function handleChange(e) {
    const accessTokenRequest = { scopes: [`api://${clientId}/User.Read`] };
    const newUuid = uuid();

    instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
      let accessToken = accessTokenResponse.accessToken;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ "image_name": `${id_group}_${newUuid}` })
      };
      fetch(`${api}/images`, requestOptions).then((response) => response.json()).then((data) => {
        var upl_file = e.target.files[0];
        setFile(URL.createObjectURL(e.target.files[0]));
        const requestOptions = {
          method: 'PUT',
          body: upl_file
        };
        fetch(data.presigned_url, requestOptions).then((response) => {
          setTitleHeroImage(`${id_group}_${newUuid}`);
        });
      });
    });
  }

  const deleteMainImg = () => {
    const accessTokenRequest = { scopes: [`api://${clientId}/User.Read`] };
    instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
      const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessTokenResponse.accessToken}` }
      };
      fetch(`${api}/images?image_name=${titleHeroImage}`, requestOptions).then((response) => {
        setFile(null);
      });
    });
  }

  const uploadImageCallBack = async (file) => {
    return new Promise(
      (resolve, reject) => {
        const accessTokenRequest = {scopes: [`api://${clientId}/User.Read`]};
        const newUuid = uuid();

        instance.acquireTokenSilent(accessTokenRequest).then((accessTokenResponse) => {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessTokenResponse.accessToken}` },
            body: JSON.stringify({ "image_name": `${id_group}_${newUuid}` })
          };
          fetch(`${api}/images`, requestOptions).then((response) => response.json()).then((dataResp) => {
            const requestOptions = {
              method: 'PUT',
              body: file
            };
            fetch(dataResp.presigned_url, requestOptions).then((response) => {
              const imageObject = {
                file: file,
                localSrc: URL.createObjectURL(file),
              }
                resolve({ data: { link: `https://d3t3s6w5yvhc3g.cloudfront.net/images/${id_group}_${newUuid}` } });
            });
          });
        });
      });
  };
  
  return (
    // <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <div className='section-home light px-5 py-3'>
        
        {
          showLoader &&
          <Loader />
        }

        <div className='py-3 d-flex justify-content-between align-items-center toolbar-stick-priv'>
          <Link to={`/syd-admin/${id_group}`} className='btn-dash text-deco-none p-3 text-uppercase transition-03s-eio'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            <span className='px-1'>Back</span>
          </Link>
          <div className='d-flex gap-5 align-items-center'>
            <div className="dropdown">
              <a className="btn-langue-article syd-black text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center dark-mode-text transition-03s-eio" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
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
            <button className='syd-button m-0' onClick={saveText}>Save</button>
          </div>
        </div>

     
        <h1 className='fw-bold text-uppercase mt-4'>{id_group.replace('-', ' ')}</h1>

        <div className='row'>
          <div className='col-9'>
            <div>
              <h2 className='fw-bold'>Title</h2>
              <input className='toolbar-editor p-3' placeholder='Title...' value={articleTitle} onChange={(e) =>handleChangeTitle(e)}></input>
            </div>

            <div>
              <h2 className='fw-bold mt-2'>Description</h2>
              <textarea className='toolbar-editor p-3' placeholder='Description...' value={articleDesc} onChange={(e) =>handleChangeDesc(e)}></textarea>
            </div>

              {/* <div className={`toast-editor ${showToast ? 'show':''}`} onClick={() => setShowToast(false)}>
                <p className='m-0 fw-bold fs-5 py-3 px-4'>{toastMsg}</p>
              </div> */}
              
              <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                toolbarClassName='toolbar-editor'
                editorClassName='area-editor'
                toolbar={{
                  inline: {
                    options: ['bold', 'italic', 'underline', 'strikethrough'],
                  },
                  fontFamily: {
                    options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Play', 'Verdana'],
                  },
                  fontSize: {
                    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                  },
                  list: {
                    options: [],
                  },
                  image: { 
                    uploadCallback: uploadImageCallBack,  
                    alt: { present: true, mandatory: false },
                    previewImage: true,
                    alignmentEnabled: true,
                    inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                    defaultSize: {
                      height: 'auto',
                      width: '50%',
                    },
                    alignmentEnabled: true,
                  },
                }}
              />

              <textarea
                className='w-100 my-3'
                disabled
                value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
              />
          </div>
          <div className='col-3'>
            <h4 className='fw-bold'>Image</h4>
            <div className='btn-langue-article w-100 mb-2 p-2 d-grid'>
              {
                !file ?
                (<input type="file" onChange={handleChange} />)
                :
                (
                  <span className='btn-delete-img' onClick={deleteMainImg}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                    </svg>
                  </span>
                )
              }
              <img src={file} className='w-100 my-2'/>
            </div>

            {
              id_group === 'client-stories' &&
              <>
              <h4 className='fw-bold'>Industry</h4>
              <div className="dropdown">
                <a className="btn-langue-article drop-article-admin syd-black text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center dark-mode-text transition-03s-eio justify-content-between" type="button" id="dropDownIndustries" data-bs-toggle="dropdown" aria-expanded="false">
                <span className='box-lbl-drop'>{TranslationsService.labels(`industries.${clientStoryIndustry}.title`)}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-items" aria-labelledby="dropDownIndustries">
                  {
                    Object.keys(TranslationsService.labels(`industries`)).map((_sub, i) => (
                      <li key={i} className="fw-bold my-2 text-capitalize-menu"  onClick={() => setSelIndustries(_sub)}>
                        <span className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio">
                          {TranslationsService.labels(`industries.${_sub}.title`)}
                        </span>
                      </li>
                  ))
                  }
                </ul>
              </div>
  
              <h4 className='fw-bold mt-5'>Services</h4>
              <div className="dropdown">
                <a className="btn-langue-article drop-article-admin syd-black text-deco-none dropdown-toggle px-3 py-2 d-flex gap-2 align-items-center dark-mode-text transition-03s-eio justify-content-between" type="button" id="dropDownIndustries" data-bs-toggle="dropdown" aria-expanded="false">
                <span className='box-lbl-drop'>{clientStoryService}</span>
                {/* <span className='box-lbl-drop'>{TranslationsService.labels(`industries.${clientStoryIndustry}.title`)}</span> */}
                </a>
                <ul className="dropdown-menu dropdown-menu-items" aria-labelledby="dropDownIndustries">
                {
                  Object.keys(TranslationsService.labels(`services.sap`)).map((_sub, i) => (
                    TranslationsService.labels(`services.sap.${_sub}.title`) &&
                    <li key={i} className="fw-bold my-2 text-capitalize-menu"  onClick={() => setSelService('sap', _sub)}>
                      <span className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio">
                        SAP - {TranslationsService.labels(`services.sap.${_sub}.title`)}
                      </span>
                    </li>
                  ))
                }
                {
                  Object.keys(TranslationsService.labels(`services.neptune-software`)).map((_sub, i) => (
                    TranslationsService.labels(`services.neptune-software.${_sub}.title`) &&
                    <li key={i} className="fw-bold my-2 text-capitalize-menu"  onClick={() => setSelService('neptune-software', _sub)}>
                      <span className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio">
                        Neptune - {TranslationsService.labels(`services.neptune-software.${_sub}.title`)}
                      </span>
                    </li>
                  ))
                }
                {
                  Object.keys(TranslationsService.labels(`services.digital`)).map((_sub, i) => (
                    TranslationsService.labels(`services.digital.${_sub}.title`) &&
                    <li key={i} className="fw-bold my-2 text-capitalize-menu"  onClick={() => setSelService('digital', _sub)}>
                      <span className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio">
                        Digital - {TranslationsService.labels(`services.digital.${_sub}.title`)}
                      </span>
                    </li>
                  ))
                }
                {
                  Object.keys(TranslationsService.labels(`services.training`)).map((_sub, i) => (
                    TranslationsService.labels(`services.training.${_sub}.title`) &&
                    <li key={i} className="fw-bold my-2 text-capitalize-menu"  onClick={() => setSelService('training', _sub)}>
                      <span className="dropdown-item d-flex gap-2 align-items-center transition-03s-eio">
                        Training - {TranslationsService.labels(`services.training.${_sub}.title`)}
                      </span>
                    </li>
                  ))
                }
                </ul>
              </div>
              </>
            }


          </div>
        </div>
        
        <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex:'11'}}>
          <div id="liveToast" className={`toast ${showToast} text-white bg-${severityToast}`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body fs-5">
                {toastMsg}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>
      </div>
    // </MsalAuthenticationTemplate>
  );
};

