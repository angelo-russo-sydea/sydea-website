import React, {useContext} from 'react';
import "./insights.scss";
import { AppContext } from '../../services/translationContext';
import { InsightsSection } from '../../components/sections/insights/insights';
import { ClientStoriesSection } from '../../components/sections/client-stories/client-stories';
import { PageHero } from '../../components/page-hero/page-hero';

export const Insights = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `${TranslationsService.labels(`menu.insights.label`)} | ${TranslationsService.getMainInfoCompany('name')}`;

  return (
    <div className="section-home light">
      <PageHero
        bgImage={TranslationsService.labels('hero_sections.insights.img_path')}
        breadcrumb={[]}
        title={TranslationsService.labels(`menu.insights.label`)}
        subtitle={TranslationsService.labels(`hero_sections.insights.text`)}
        hideBreadcrumb={true}
      />
      <div className='container'>
        <InsightsSection />
      </div>
      {
        TranslationsService.childMenuAvailable('insightsSections.client-stories') && 
        <div className='syd-bg-dark'>
          <ClientStoriesSection />
        </div>
      }
    </div>
  );
};
