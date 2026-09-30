// TEST-ONLY. The course kit (docs/scope/DesignSystem-Rollout.md section 4,
// batch 1B) in every state it can show, for the theme test
// (courseKitTheme.test.jsx).
//
// A test file using these scenes mocks '@/hooks/useActivation',
// '@/contexts/RoleContext' and '@/services/academyService' so the Learning
// Mode gate reads `globalThis.__courseKitGate` ({ activation, enrollments };
// enrollments null keeps the gate loading). Each scene is
// { name, element, act? }: `act({ screen, fireEvent, waitFor })` drives the
// scene to the state it names.
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import LearningModeGate from '@/components/academy/LearningModeGate';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import LockedCard from '@/components/course/LockedCard';
import QuizRunner from '@/components/course/QuizRunner';
import PracticeCourseBadge from '@/components/course/PracticeCourseBadge';
import PracticeCertificateCard from '@/components/course/PracticeCertificateCard';
import PracticeCourseNotice from '@/components/course/PracticeCourseNotice';
import {
  PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';

const NOW = new Date('2026-10-01T00:00:00Z');
const inRouter = (el) => <MemoryRouter>{el}</MemoryRouter>;

const gate = (activation, enrollments) => () => { globalThis.__courseKitGate = { activation, enrollments }; };
const gateScene = (name, activation, enrollments) => ({
  name: `LearningModeGate ${name}`,
  before: gate(activation, enrollments),
  element: inRouter(<LearningModeGate app="dca" title="This course is locked" onRetry={() => {}}>Enrol to open it.</LearningModeGate>),
  act: enrollments === null ? undefined : async ({ screen }) => { await screen.findAllByRole('button'); },
});
const active = [{ app_slug: 'dca', status: 'active', door: 'self_pay' }];
const pending = [{ app_slug: 'dca', status: 'pending', door: 'self_pay' }];

const QUESTIONS = [
  { id: 'q1', prompt: 'First question', options: ['Alpha', 'Beta'] },
  { id: 'q2', prompt: 'Second question', options: ['Gamma', 'Delta'] },
];
const quiz = (name, fetchQuiz, submitQuiz, act, props = {}) => ({
  name: `QuizRunner ${name}`,
  element: inRouter(<QuizRunner title="Module 1 quiz" description="Five questions." fetchQuiz={fetchQuiz}
    submitQuiz={submitQuiz || (async () => ({}))} continueTo="/next" {...props} />),
  act,
});
const answerAndSubmit = async ({ screen, fireEvent }) => {
  await screen.findByText(/First question/);
  fireEvent.click(screen.getByLabelText('Alpha'));
  fireEvent.click(screen.getByLabelText('Delta'));
  fireEvent.click(screen.getByRole('button', { name: /Submit for grading/ }));
  await screen.findByText('Module 1 quiz');
  await screen.findByText(/Pass mark|pass mark/);
};
const open = async () => ({ attempt_id: 'a1', questions: QUESTIONS });
const PASS = { passed: true, score: 2, max_score: 2, pct: 100, pass_pct: 70, explanations: [{ id: 'q1', prompt: 'First question', explanation: 'Because.' }] };
const FAIL = { passed: false, score: 0, max_score: 2, pct: 0, pass_pct: 70 };

const cert = (name, props, act) => ({
  name: `PracticeCertificateCard ${name}`,
  element: inRouter(<PracticeCertificateCard app="contracts" tier="beginner" {...props} />),
  act,
});
const claimWith = (fn) => async ({ screen, fireEvent }) => {
  fireEvent.click(screen.getByRole('button', { name: /Issue my/ }));
  await fn(screen);
};
const passed = { final_exam: { passed: true } };

export const COURSE_KIT_SCENES = [
  gateScene('loading', null, null),
  gateScene('activate', { activated: false }, active),
  gateScene('stalled', { activated: true }, active),
  gateScene('pending', { activated: true }, pending),
  gateScene('enrol', { activated: true }, []),
  gateScene('enrol and activate', { activated: false }, []),

  { name: 'DeepCourseBanner practice', element: inRouter(<DeepCourseBanner app="contracts" tier="advanced" />) },
  { name: 'DeepCourseBanner engine', element: inRouter(<DeepCourseBanner app="procurement" tier="beginner" />) },
  { name: 'DeepCourseBanner none', element: inRouter(<DeepCourseBanner app="no-such-app" tier="beginner" />) },

  {
    name: 'panelKit',
    element: (
      <PanelShell title="Archie explorer" subtitle="Move the inputs.">
        <FieldGrid>
          <NumField label="Porosity" value="0.2" onChange={() => {}} placeholder="0.25" />
          <SelectField label="Lithology" value="ss" onChange={() => {}} options={[['ss', 'Sandstone'], { value: 'ls', label: 'Limestone' }]} />
        </FieldGrid>
        <TileGrid>
          <Tile label="Sw" value="0.35" unit="v/v" />
          <Tile label="Bulk volume water" value="0.07" />
        </TileGrid>
        <Note>Archie holds in clean rock.</Note>
      </PanelShell>
    ),
  },
  { name: 'PanelShell no subtitle', element: <PanelShell title="Plain">body</PanelShell> },

  { name: 'CapstoneCaseFiles', element: <CapstoneCaseFiles files={[{ name: 'case.csv', text: 'a,b' }, { name: 'brief.txt', text: 'x' }]} note="Open them in the panels." /> },
  { name: 'CapstoneCaseFiles no note', element: <CapstoneCaseFiles files={[{ name: 'case.csv', text: 'a,b' }]} /> },

  { name: 'LockedCard', element: inRouter(<LockedCard title="Locked" note="Pass the quiz first." backTo="/back" />) },
  { name: 'LockedCard bare', element: inRouter(<LockedCard title="Locked" />) },

  quiz('loading', () => new Promise(() => {})),
  quiz('error', async () => { throw new Error('No questions.'); }, null, async ({ screen }) => { await screen.findByText('No questions.'); }),
  quiz('locked', async () => ({ locked: true, locked_until: null }), null, async ({ screen }) => { await screen.findByText('Attempts are on cooldown'); }),
  quiz('active', open, null, async ({ screen }) => { await screen.findByText(/First question/); }),
  quiz('active part answered', open, null, async ({ screen, fireEvent }) => {
    await screen.findByText(/First question/);
    fireEvent.click(screen.getByLabelText('Alpha'));
    await screen.findByText('1/2 answered');
  }),
  quiz('passed', open, async () => PASS, answerAndSubmit),
  quiz('failed', open, async () => FAIL, async (ctx) => {
    await answerAndSubmit(ctx);
    await ctx.screen.findByText(/Try again with a fresh set/);
  }),
  quiz('failed on cooldown', open, async () => ({ ...FAIL, locked_until: '2026-10-02T10:00:00Z' }), async (ctx) => {
    await answerAndSubmit(ctx);
    await ctx.screen.findByText(/Attempts are on cooldown until/);
  }),

  { name: 'PracticeCourseBadge app', element: <PracticeCourseBadge /> },
  { name: 'PracticeCourseBadge home', element: <PracticeCourseBadge variant="home" /> },
  { name: 'PracticeCourseNotice', element: <PracticeCourseNotice app="contracts" apps={[]} now={NOW} /> },

  cert('locked', { progress: { final_exam: { unlocked: true, passed: false } } }),
  cert('ready', { progress: passed }),
  cert('expert ready', { tier: 'advanced', progress: passed }),
  cert('issued', {
    progress: passed,
    claim: async () => ({ passed: true, certificate_number: 'NG-0001', verify_code: 'abc' }),
  }, claimWith((screen) => screen.findByText('NG-0001'))),
  cert('already certified', {
    progress: passed,
    claim: async () => ({ passed: true, already_certified: true }),
  }, claimWith((screen) => screen.findByText(/You already hold/))),
  cert('error', {
    progress: passed,
    claim: async () => { throw new Error('Not today.'); },
  }, claimWith((screen) => screen.findByText('Not today.'))),
];
