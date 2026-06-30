import React, {useContext} from 'react';
import "./events.scss";
import { AppContext } from '../../services/translationContext';
import { InsightsSection } from '../../components/sections/insights/insights';
import { ClientStoriesSection } from '../../components/sections/client-stories/client-stories';
import { PageHero } from '../../components/page-hero/page-hero';
import { EventsSection } from '../../components/sections/events/events';

export const Events = () => {
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `${TranslationsService.labels(`menu.insights.label`)} | ${TranslationsService.getMainInfoCompany('name')}`;

  return (
    <div className="section-home light">
      {/* <PageHero
        bgImage={TranslationsService.labels('hero_sections.insights.img_path')}
        breadcrumb={[]}
        title={TranslationsService.labels(`menu.insights.label`)}
        subtitle={TranslationsService.labels(`hero_sections.insights.text`)}
        hideBreadcrumb={true}
      /> */}
      <div className='container pb-3'>
        <EventsSection />
      </div>
    </div>
  );
};
