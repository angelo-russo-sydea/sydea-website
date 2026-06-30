import React, { useContext } from 'react';
import './solutions.scss';
import { Link, useParams } from "react-router-dom";
import { AppContext } from '../../services/translationContext';
import { PageHero } from '../../components/page-hero/page-hero';
import { ServiceCard } from '../../components/cards/service-card';
import { SolutionCard } from '../../components/cards/solution-card';

export const Solutions = () => {
    const { lang } = useParams();
    const { services: {TranslationsService} } = useContext(AppContext);
    document.title = `${TranslationsService.labels(`menu.solutions.label`)} | ${TranslationsService.getMainInfoCompany('name')}`;
    const servicesList = TranslationsService.labels('services');
    const solutionsList = TranslationsService.labels('solutions');

  return (
    <div className="section-home">
      <PageHero
        bgImage={TranslationsService.labels('hero_sections.solutions.img_path')}
        breadcrumb={[]}
        title={TranslationsService.labels(`menu.solutions.label`)}
        subtitle={TranslationsService.labels(`hero_sections.solutions.text`)}
        hideBreadcrumb={true}
      />
        <div className='container'>
            <div className='my-2 title-service-sticky'>
                <Link to={`/${lang}/solutions`} className='text-deco-none d-flex gap-3 align-items-center title-area' style={{width:'max-content'}}>
                    <h2 className='syd-title white m-0 fw-bold transition-03s-eio' style={{color:'#fece2f', fontSize:'4rem', zIndex: 9999}}>{TranslationsService.labels('menu.solutions.label')}</h2>
                </Link>
            </div>
            <div className='container px-md-5'>
                <div className='row'>
                {
                    solutionsList?.items?.map((solution, ind) => (
                        <SolutionCard 
                            key={ind}
                            colMD={4}
                            colSM={12}
                            data={solution}
                            link={`/${lang}/solutions/${solution.id}`}
                        />
                    ))
                }
                </div>
            </div>
        </div>
    </div>
  );
};