import React from 'react';
import PracticeCourseLearningPage from '@/pages/apps/PracticeCourseLearningPage';

// Contract & Supplier Management, the fifth course of the Supply Chain &
// Logistics module and the academy's first PRACTICE COURSE: no engine, no
// calculator panel and no numeric capstone. The page is the shared practice
// course page; this file carries only the course's own words.
export const CONTRACTS_INTRO = 'A contract is managed through rules and records that can be written down and checked. '
  + 'The course follows one set of synthetic Ekene contracts from award to close-out: handover, performance measures, '
  + 'payment and records and the Nigerian content duties at Associate; supplier segmentation, performance reviews, change '
  + 'control, supplier risk and poor performance at Professional; and contract strategy, claims, disputes, termination, '
  + 'close-out and integrity at Expert.';

const ContractsLearningPage = () => (
  <PracticeCourseLearningPage
    app="contracts"
    subtitle="Supply Chain, course five, a practice course"
    intro={CONTRACTS_INTRO}
    gateText={'Enrol in Contract & Supplier Management, the fifth course of the Supply Chain module, and activate your '
      + 'account to open it in Learning Mode. It is a practice course: every lesson teaches from dated, cited Acts, '
      + 'regulations and published guidance, closes with written scenario work, and each tier ends in a final exam '
      + 'that issues the certificate.'}
  />
);

export default ContractsLearningPage;
