// The QI capstone case files: held-out synthetic cases, never the Ekene field,
// written by the wave's qi_cases.mjs. Only the capstone card imports this
// module: no panel preloads a case, and the graded answers are not stored
// anywhere in the app. The Professional and Expert cases are added when their
// graders are wired.
import tamberlo_case from './tamberlo_case.json?raw';

export const QI_CASE_FILES = {
  beginner: [
    { name: 'tamberlo_case.json', text: tamberlo_case },
  ],
  intermediate: [],
  advanced: [],
};
