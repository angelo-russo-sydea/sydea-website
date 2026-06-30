import React, {useState, useEffect, useMemo, useContext, useRef} from 'react';
import "./client-stories.scss";
import { Link, useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';
import { Loader } from '../../components/loader/loader';
import { PageHero } from '../../components/page-hero/page-hero';
import { FlatCard } from '../../components/cards/flat-card';

const api = process.env.REACT_APP_URL_API;

export const ClientStories = () => {
  const { lang } = useParams();
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `${TranslationsService.labels(`client_stories`)} | ${TranslationsService.getMainInfoCompany('name')}`;
  const [filterClient, setFilterClient] = useState({});
  const [listFilterSel, setListFilterSel] = useState([]);
  const [listClientStories, setListClientStories] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const chipsRowRef = useRef(null);

  useMemo(() => {
    setListClientStories(TranslationsService.labels(`client_stories_sect`));
  }, [TranslationsService]);

  useEffect(() => {
    const extractTitles = (obj) => {
      let result = [];

      const extract = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (obj[key].title) {
              result.push({ key: key, title: obj[key].title, isActive: false });
            }
            extract(obj[key]);
          }
        }
      };

      extract(obj);
      return result;
    };
    const extractedTitles = extractTitles(TranslationsService.labels(`services`));
    setFilterClient(extractedTitles);
  },[TranslationsService]);

  const onSelectedFilter = (filterSel) => {
    setShowLoader(true);
    let _tmpFilterList =  {...filterClient};
    _tmpFilterList[filterSel].isActive = !_tmpFilterList[filterSel].isActive;
    setFilterClient(_tmpFilterList);

    let _listFilterSel = [...listFilterSel];
    if(_tmpFilterList[filterSel].isActive){
      _listFilterSel.push(filterSel);
    }
    else{
      let _index = _listFilterSel.indexOf(filterSel);
      _listFilterSel.splice(_index, 1);
    }

    setListFilterSel(_listFilterSel);
    if(_listFilterSel.length === 0){
      setListClientStories(TranslationsService.labels(`client_stories_sect`));
      setShowLoader(false);
      return;
    }

    let filterKeysSelected = [];
    for (var i = 0; i < _listFilterSel.length; i++) {
      filterKeysSelected.push(filterClient[_listFilterSel[i]]?.key);
    }
    
    let updatedListStories = [];
    const allStories = TranslationsService.labels(`client_stories_sect`);
    for (var i = 0; i < allStories.length; i++) {
      if (filterKeysSelected.includes(allStories[i].bu_area.key) || 
          filterKeysSelected.includes(allStories[i].bu_area.sub_items)) {
        if (!updatedListStories.some(story => story.id === allStories[i].id)) {
          updatedListStories.push(allStories[i]);
        }
      }
    
      for (var ind = 0; ind < allStories[i].bu_service.length; ind++) {
        if (filterKeysSelected.includes(allStories[i].bu_service[ind])) {
          
          if (!updatedListStories.some(story => story.id === allStories[i].id)) {
            updatedListStories.push(allStories[i]);
            break;
          }
        }
      }
    }
    
    setListClientStories(updatedListStories);
    setShowLoader(false);
    if (chipsRowRef.current) {
    chipsRowRef.current.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
  }
  }

  const clearFilter = () =>{
    setShowLoader(true);
    let filterList =  {...filterClient};
    for (var i = 0; i < Object.keys(filterList).length; i++) 
    {
      filterList[Object.keys(filterList)[i]].isActive = false;
    }
    setFilterClient(filterList);
    setListFilterSel([]);
    setListClientStories(TranslationsService.labels(`client_stories_sect`));
    setShowLoader(false);
  }

  const getServiceTitle = (buKey, subKey, serviceKey) => {
    if(subKey){
      return TranslationsService.labels('services')[buKey].items[subKey][serviceKey].title;
    }
    else {
      return TranslationsService.labels('services')[buKey][serviceKey].title;
    }
  };

  return (
    <div className="section-home light">

      <PageHero
        bgImage={TranslationsService.labels('hero_sections.client_stories.img_path')}
        breadcrumb={[
           { label: TranslationsService.labels(`menu.insights.label`), path: 'insights' }
        ]}
        title={TranslationsService.labels(`client_stories`)}
        subtitle={TranslationsService.labels(`hero_sections.client_stories.text`)}
      />

      {
        showLoader &&
        <Loader />
      }

      <div className='p-3'>
        <div ref={chipsRowRef} className='d-flex row-chips-client-stories' style={{overflow: 'auto'}}>
          {
            Object.keys(filterClient)
              .sort((a, b) => {
                const aActive = filterClient[a].isActive;
                const bActive = filterClient[b].isActive;

                if (aActive === bActive) return 0;
                return aActive ? -1 : 1; // attivi prima
              })
              .map((_filter) => (
                <div
                  key={filterClient[_filter].title}
                  className={`syd-chips ${filterClient[_filter].isActive ? 'active' : ''} transition-03s-eio`}
                  onClick={() => onSelectedFilter(_filter)}
                  style={{ textWrapMode: 'nowrap' }}
                >
                  <p className='m-0' style={{ fontSize: '12px' }}>
                    {filterClient[_filter].title}
                  </p>
                </div>
              ))
          }
        </div>
        <div className={`btn-clear-filter ${listFilterSel.length > 0 ? 'visible':'invisible'} py-1 px-2 d-flex align-items-center gap-1`} onClick={clearFilter}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          <span>Clear</span>
        </div>

        <div className='p-1'>

          <div className='row gap-3 gap-lg-0'>
          
          {
            listClientStories?.map((clientStory, i) => (
              <FlatCard
                key={i}
                colMD={3}
                colSM={12}
                title={clientStory.title}
                link={`/${lang}/insights/client-stories/${clientStory.id}`}
                backgroundColor={clientStory.backgroundColor}
                textColor={clientStory.text_color}
                logo={clientStory.client_logo}
                titleColor={clientStory.title_color}
                buArea={clientStory.bu_area}
                buService={clientStory.bu_service}
              />
            ))
          }
          
          </div>
        </div>
      </div>
    </div>
  );
};

