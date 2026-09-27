// THE PRACTICE COURSE IN THE PAGES A LEARNER SEES (SC5 platform).
//
// Rendered with react-dom/server (effects never run, so no request is made):
//   - the catalogue card of the practice course carries the "Practice course"
//     badge beside its status pill; an engine course and an app course carry
//     none;
//   - the practice notice on a course page shows the badge, the date the
//     sources were checked and the review date, and renders nothing for an app
//     or an engine course;
//   - the certificate card stands where a capstone would: locked until the
//     final exam is passed, then a button naming the tier's certificate; the
//     Expert card names the written case; an engine course never gets a button;
//   - the course home of the practice course shows that card and no capstone,
//     and the course home of an engine course is unchanged (its capstone card,
//     no badge, no certificate card);
//   - the practice course page shows the notice, the syllabus from the
//     manifests and the written scenario work.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PracticeCourseBadge from './PracticeCourseBadge';
import PracticeCourseNotice from './PracticeCourseNotice';
import PracticeCertificateCard from './PracticeCertificateCard';
import { CourseCard } from '@/pages/LandingPage';
import CourseHomePage from '@/pages/course/CourseHomePage';
import { PracticeCourseBody } from '@/pages/apps/PracticeCourseLearningPage';
import { HOME_COURSES } from '@/lib/homeCatalog';
import { getManifest } from '@/lib/courseContent';

const html = (el) => renderToStaticMarkup(el);
// The contracts tile is a HOME_COURSES row since the ship phase, beside its
// academy_apps row (20261116_sc5_contracts_course.sql).
const CONTRACTS = HOME_COURSES.find((c) => c.slug === 'contracts');
const card = (slug) => html(<CourseCard c={HOME_COURSES.find((c) => c.slug === slug)} />);
const count = (s, needle) => s.split(needle).length - 1;
const NOW = new Date('2026-10-01T00:00:00Z');

describe('the practice course badge', () => {
  it('renders the label, marked, in both looks, and nothing when not shown', () => {
    expect(html(<PracticeCourseBadge />)).toMatch(/data-course-type="practice"[^>]*>Practice course</);
    expect(html(<PracticeCourseBadge variant="home" />)).toBe('<span class="pill practice" data-course-type="practice">Practice course</span>');
    expect(html(<PracticeCourseBadge show={false} />)).toBe('');
  });

  it('is on the practice course catalogue card and on no other', () => {
    const c = card('contracts');
    expect(count(c, 'Practice course')).toBe(1);
    expect(c).toContain('Coming soon');
    expect(c).toContain('Contract &amp; Supplier Management');
    for (const slug of ['procurement', 'prms', 'welldata', 'supply']) expect(card(slug)).not.toContain('Practice course');
    const badged = HOME_COURSES.filter((co) => html(<CourseCard c={co} />).includes('Practice course')).map((co) => co.slug);
    expect(badged).toEqual(['contracts']);
    expect(html(<CourseCard c={{ ...CONTRACTS, status: 'available' }} />)).toContain('Associate · Professional · Expert');
  });
});

describe('the practice notice on a course page', () => {
  it('shows the badge, the check date and the review date for the practice course', () => {
    const n = html(<PracticeCourseNotice app="contracts" apps={[]} now={NOW} />);
    expect(n).toContain('Practice course');
    expect(n).toContain('Sources checked on 27 September 2026. Next review due by 27 September 2027.');
    expect(n).toContain('certificate is issued when you pass that tier&#x27;s final exam');
  });

  it('prints the live review date when the catalogue row carries one', () => {
    const n = html(<PracticeCourseNotice app="contracts" apps={[{ slug: 'contracts', course_type: 'practice', review_date: '2027-06-30', sources_checked_on: '2026-09-27' }]} now={NOW} />);
    expect(n).toContain('Next review due by 30 June 2027.');
  });

  it('renders nothing for an engine course or an app course', () => {
    for (const app of ['procurement', 'prms', 'welldata', 'cashflow']) expect(html(<PracticeCourseNotice app={app} apps={[]} now={NOW} />)).toBe('');
  });
});

describe('the practice certificate card', () => {
  it('is locked until the final exam is passed', () => {
    const c = html(<PracticeCertificateCard app="contracts" tier="beginner" progress={{ final_exam: { unlocked: true, passed: false } }} />);
    expect(c).toContain('Associate certificate');
    expect(c).toContain('Locked until the final exam is passed.');
    expect(c).not.toContain('Issue my');
  });

  it('offers the tier certificate once the final exam is passed, at every tier', () => {
    const passed = { final_exam: { passed: true } };
    expect(html(<PracticeCertificateCard app="contracts" tier="beginner" progress={passed} />)).toContain('Issue my Associate certificate');
    expect(html(<PracticeCertificateCard app="contracts" tier="intermediate" progress={passed} />)).toContain('Issue my Professional certificate');
    const e = html(<PracticeCertificateCard app="contracts" tier="advanced" progress={passed} />);
    expect(e).toContain('Issue my Expert certificate');
    expect(e).toContain('The Expert final exam is a written case');
  });

  it('never offers a button to an engine course', () => {
    const c = html(<PracticeCertificateCard app="procurement" tier="beginner" courseType="engine" progress={{ final_exam: { passed: true } }} />);
    expect(c).not.toContain('Issue my');
  });
});

const home = (app, tier) => html(
  <HelmetProvider>
    <MemoryRouter initialEntries={[`/dashboard/apps/${app}/course/${tier}`]}>
      <Routes><Route path="/dashboard/apps/:appSlug/course/:tier" element={<CourseHomePage />} /></Routes>
    </MemoryRouter>
  </HelmetProvider>,
);

describe('the course home', () => {
  it('shows the practice course its notice and certificate card, and no capstone', () => {
    const h = home('contracts', 'beginner');
    expect(h).toContain('Practice course');
    expect(h).toContain('Next review due by 27 September 2027.');
    expect(h).toContain('data-practice-certificate="beginner"');
    expect(h).toContain('a final exam that issues the certificate');
    expect(h).not.toContain('Capstone practical');
    expect(h).not.toContain('graded practical');
  });

  it('leaves an engine course home unchanged: its capstone, no badge, no certificate card', () => {
    const h = home('procurement', 'beginner');
    expect(h).toContain('Capstone practical');
    expect(h).toContain('the course closes with a final exam and a graded practical.');
    expect(h).not.toContain('Practice course');
    expect(h).not.toContain('data-practice-certificate');
  });
});

describe('the practice course page', () => {
  it('shows the notice, the syllabus from the manifest and the written scenario work', () => {
    const p = html(
      <MemoryRouter>
        <PracticeCourseBody app="contracts" apps={[]} tier="advanced" setTier={() => {}} progress={null} subtitle="Supply Chain, course five, a practice course" intro="Intro." />
      </MemoryRouter>,
    );
    expect(p).toContain('Practice course');
    expect(p).toContain('Written scenario work');
    const m = getManifest('contracts', 'advanced');
    expect(m.modules).toHaveLength(6);
    for (const mod of m.modules) expect(p).toContain(mod.title.replace(/&/g, '&amp;'));
    expect(p).toContain('The written case brief');
    expect(p).toContain('data-practice-certificate="advanced"');
    expect(p).not.toMatch(/capstone practical|calculator panel/i);
  });
});
