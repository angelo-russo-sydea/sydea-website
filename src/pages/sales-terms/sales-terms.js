import React, {useContext} from 'react';
import { AppContext } from '../../services/translationContext';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { PageHero } from '../../components/page-hero/page-hero';

export const SalesTerms = () => {
  const { lang } = useParams();
  const { services: {TranslationsService} } = useContext(AppContext);
  document.title = `${TranslationsService.labels('sales-terms-title-page')} | ${TranslationsService.getMainInfoCompany('name')}`;
  
  const text_test = 
  `
  <h1 class="syd-dark text-uppercase pt-5 pb-3">Welcome to our R&D Hub!</h1>
  <p>At Sydea, we are dedicated to driving <b>innovation</b> and staying at the forefront of <b>technological advancements</b>.
  <br/>
  Our R&D department plays a pivotal role in achieving this goal. Through cutting-edge research and continuous development, we constantly push the boundaries of what's possible.</p>
  <h2 class="syd-yellow">What is R&D?</h2>
  <p><b>R&D</b> stands for <b>Research and Development</b>, and it's the backbone of our company's success. It encompasses a wide range of activities aimed at creating new products, improving existing ones, and enhancing our overall processes.
  <br/>
  Our team of brilliant minds collaborates to explore new ideas, conduct experiments, and solve complex challenges.
  <br/>
  We invest time, resources, and expertise into the R&D process to create groundbreaking solutions that address real-world needs.</p>
  <h2 class="syd-yellow">Innovation is Key</h2>
  <p>Innovation drives everything we do. It is not just a buzzword for us, but a mindset that permeates our entire organization. Our dedicated R&D team focuses on exploring emerging technologies, market trends, and customer demands.
  <br/>
  By staying ahead of the curve, we aim to anticipate the needs of our customers and deliver products and services that exceed their expectations
  </p>
  <h2 class="syd-yellow">Our R&D Process</h2>
  <p>
  The R&D process at Sydea is a well-structured and dynamic journey. It starts with identifying potential areas for improvement and breakthroughs. Our team conducts in-depth market research and analysis to identify gaps and opportunities.
  <br/>
  Based on these insights, we define clear objectives and set specific milestones.
  </p>
  <p>
  Next comes the experimentation phase, where our experts work tirelessly to develop prototypes and test new concepts rigorously. We foster a culture of creativity and curiosity, encouraging our team members to think outside the box and challenge the status quo
  </p>
  <h2 class="syd-yellow">The Future of R&D</h2>
  <p>As technology evolves and new challenges arise, our commitment to R&D remains steadfast. We believe that investing in research and innovation is an investment in the future of our company and the well-being of society. With a focus on sustainability, inclusivity, and ethical practices, we aim to create a positive impact on the world.</p>
  `;

  return (
    <div className="section-home light">
      <br/>
      <div className='container'>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(TranslationsService.labels('sales-terms')) }} className='syd-body-article-p m-3 p-3'></div>
      </div>

    </div>
  );
};

