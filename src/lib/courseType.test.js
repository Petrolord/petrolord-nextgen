// COURSE TYPES AND THE PRACTICE COURSE CERTIFICATE PATH (SC5 platform, lead
// decisions 1 and 2, 2026-09-27).
//
// What this file proves:
//   - the type of every course: the six engine courses are 'engine', the
//     practice course is 'practice', everything else keeps the default 'app';
//     a live academy_apps.course_type wins and an unknown one is ignored;
//   - the static fallback maps are the migration's backfill list and the
//     practice wave's own dates (wave.json), so they cannot drift apart;
//   - the review line, the overdue boundary (the review date itself is not
//     overdue), the certificate basis and course line, the claim button rule
//     and the final exam copy for each type;
//   - the platform migration touches only academy_apps and the two functions
//     it names, carries no transaction lines of its own, and returns every key
//     the previous academy_verify_certificate returned, plus course_type;
//   - nothing a learner reads in the new code breaks the owner copy rule.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COURSE_TYPES, ENGINE_COURSES, PRACTICE_COURSES, PRACTICE_BADGE_LABEL,
  courseTypeOf, isPracticeCourse, practiceDates, isReviewOverdue, reviewLine,
  certificateBasis, certificateCourseLine, canClaimPracticeCertificate, finalExamCopy,
} from './courseType';
import { HOME_COURSES, mergeCatalog } from './homeCatalog';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MIG = 'migrations/20261116_sc5_contracts_platform_course_types.sql';
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

describe('course types', () => {
  it('types every course: six engine courses, one practice course, the rest app', () => {
    for (const slug of ['procurement', 'pia', 'gsa', 'joa', 'farmout', 'prms']) expect(courseTypeOf(slug)).toBe('engine');
    expect(courseTypeOf('contracts')).toBe('practice');
    for (const slug of ['welldata', 'petrophysics', 'supply', 'cashflow', 'appliedai', 'nosuchcourse']) expect(courseTypeOf(slug)).toBe('app');
    expect(COURSE_TYPES).toEqual(['app', 'engine', 'practice']);
  });

  it('takes the live course_type when it is one of the three, and ignores anything else', () => {
    expect(courseTypeOf('welldata', [{ slug: 'welldata', course_type: 'practice' }])).toBe('practice');
    expect(courseTypeOf('procurement', [{ slug: 'procurement', course_type: 'app' }])).toBe('app');
    expect(courseTypeOf('contracts', [{ slug: 'contracts', course_type: 'bogus' }])).toBe('practice');
    expect(courseTypeOf('contracts', [{ slug: 'contracts' }])).toBe('practice');
    expect(courseTypeOf('contracts', null)).toBe('practice');
    expect(isPracticeCourse('procurement')).toBe(false);
  });

  it('keeps the engine list equal to the platform migration backfill', () => {
    const sql = read(MIG);
    const m = sql.match(/set course_type = 'engine'\s+where slug in \(([^)]*)\)/);
    expect(m, 'the backfill update is in the migration').toBeTruthy();
    const slugs = m[1].split(',').map((x) => x.trim().replace(/'/g, ''));
    expect(slugs).toEqual(ENGINE_COURSES);
    // each named engine course has its own committed course migration
    const files = fs.readdirSync(path.join(ROOT, 'migrations'));
    for (const slug of ENGINE_COURSES) {
      expect(files.some((f) => f.endsWith(`_${slug}_course.sql`)), `${slug} course migration`).toBe(true);
    }
  });

  it('keeps each practice course date equal to its wave.json', () => {
    for (const [slug, d] of Object.entries(PRACTICE_COURSES)) {
      const w = JSON.parse(read(`tools/course-waves/${slug}/wave.json`));
      expect(w.course_type).toBe('practice');
      expect(d.sourcesCheckedOn).toBe(w.sources_checked_on);
      expect(d.reviewDate).toBe(w.review_date);
      expect(d.reviewDate > d.sourcesCheckedOn, 'the review date is after the check date').toBe(true);
    }
  });

  it('reads practice dates live first, each on its own, and none for other types', () => {
    expect(practiceDates('contracts')).toEqual({ sourcesCheckedOn: '2026-09-27', reviewDate: '2027-09-27' });
    expect(practiceDates('contracts', [{ slug: 'contracts', course_type: 'practice', review_date: '2028-01-31' }]))
      .toEqual({ sourcesCheckedOn: '2026-09-27', reviewDate: '2028-01-31' });
    expect(practiceDates('procurement')).toBeNull();
    expect(practiceDates('welldata')).toBeNull();
  });

  it('is overdue only after the review date, by UTC calendar day', () => {
    expect(isReviewOverdue('2027-09-27', new Date('2027-09-27T23:59:00Z'))).toBe(false);
    expect(isReviewOverdue('2027-09-27', new Date('2027-09-28T00:00:00Z'))).toBe(true);
    expect(isReviewOverdue(null)).toBe(false);
    expect(isReviewOverdue('not a date')).toBe(false);
  });

  it('prints the review line in the certificate date form', () => {
    const d = practiceDates('contracts');
    expect(reviewLine(d, new Date('2026-10-01T00:00:00Z')))
      .toBe('Sources checked on 27 September 2026. Next review due by 27 September 2027.');
    expect(reviewLine(d, new Date('2027-10-01T00:00:00Z')))
      .toBe('Sources checked on 27 September 2026. The review due on 27 September 2027 is under way.');
  });

  it('certifies a practice course from the final exam, and says so on the certificate', () => {
    expect(certificateBasis('practice')).toBe('final_exam');
    expect(certificateBasis('engine')).toBe('capstone');
    expect(certificateBasis('app')).toBe('capstone');
    expect(certificateCourseLine('Contract & Supplier Management', 'practice')).toBe('Contract & Supplier Management (practice course)');
    expect(certificateCourseLine('Procurement, Tendering & Contracting', 'engine')).toBe('Procurement, Tendering & Contracting');
    expect(PRACTICE_BADGE_LABEL).toBe('Practice course');
  });

  it('offers the certificate button only for a practice course with its final exam passed', () => {
    expect(canClaimPracticeCertificate('practice', { final_exam: { passed: true } })).toBe(true);
    expect(canClaimPracticeCertificate('practice', { final_exam: { passed: false, unlocked: true } })).toBe(false);
    expect(canClaimPracticeCertificate('practice', null)).toBe(false);
    expect(canClaimPracticeCertificate('engine', { final_exam: { passed: true } })).toBe(false);
    expect(canClaimPracticeCertificate('app', { final_exam: { passed: true } })).toBe(false);
  });

  it('keeps the app and engine final exam copy exactly as it was, and points a practice course home', () => {
    for (const t of ['app', 'engine']) {
      expect(finalExamCopy(t, 'beginner', 'procurement')).toEqual({
        description: 'A randomized exam across the whole course. Passing it unlocks the capstone practical.',
        continueTo: '/dashboard/apps/procurement',
        continueLabel: 'Open the capstone',
      });
    }
    const b = finalExamCopy('practice', 'beginner', 'contracts');
    expect(b.continueTo).toBe('/dashboard/apps/contracts/course/beginner');
    expect(b.continueLabel).toBe('Issue my certificate');
    expect(b.description).not.toMatch(/capstone/i);
    expect(finalExamCopy('practice', 'advanced', 'contracts').description).toMatch(/written case/);
  });

  it('carries the course type onto the homepage catalogue, static and live', () => {
    const contracts = HOME_COURSES.find((c) => c.slug === 'contracts');
    expect(contracts).toMatchObject({ module: 'supply_chain', status: 'coming_soon', courseType: 'practice' });
    expect(HOME_COURSES.filter((c) => c.courseType === 'practice').map((c) => c.slug)).toEqual(['contracts']);
    expect(HOME_COURSES.filter((c) => c.courseType === 'engine').map((c) => c.slug).sort())
      .toEqual([...ENGINE_COURSES].sort());
    const merged = mergeCatalog(HOME_COURSES, [{ slug: 'contracts', status: 'available', course_type: 'practice' }, { slug: 'welldata', status: 'available', course_type: 'app' }]);
    expect(merged.find((c) => c.slug === 'contracts').courseType).toBe('practice');
    expect(merged.find((c) => c.slug === 'welldata').courseType).toBe('app');
  });
});

describe('the platform migration', () => {
  const sql = read(MIG);
  const code = sql.replace(/--[^\n]*/g, '');

  it('has no transaction lines of its own', () => {
    expect(code).not.toMatch(/^\s*(begin|commit|rollback)\s*;/im);
  });

  it('changes academy_apps and defines exactly the two functions it names', () => {
    const altered = [...code.matchAll(/alter table\s+([a-z_.]+)/gi)].map((m) => m[1]);
    expect(new Set(altered)).toEqual(new Set(['public.academy_apps']));
    const fns = [...code.matchAll(/create or replace function\s+([a-z_.]+)/gi)].map((m) => m[1]).sort();
    expect(fns).toEqual(['public.academy_claim_practice_certificate', 'public.academy_verify_certificate']);
    for (const untouched of ['academy_submit_capstone', 'academy_course_progress', 'academy_grade_quiz', 'academy_get_final_exam', 'academy_submit_final_exam', 'academy_issue_certification']) {
      expect(code.includes(`function public.${untouched}`), untouched).toBe(false);
    }
    expect(code).not.toMatch(/\b(drop|truncate|delete from)\b/i);
    expect(code).not.toMatch(/create table/i);
  });

  it('returns every key the previous verification returned, plus course_type', () => {
    const keysOf = (text) => {
      const body = text.slice(text.indexOf('create or replace function public.academy_verify_certificate'));
      const fn = body.slice(0, body.indexOf('$$;'));
      return [...fn.matchAll(/^\s*'([a-z_]+)',/gm)].map((m) => m[1]);
    };
    const before = keysOf(read('migrations/20261105_catalog_course_titles.sql'));
    const after = keysOf(sql);
    expect(before.length).toBe(8);
    expect(after).toEqual([...before.slice(0, 4), 'course_type', ...before.slice(4)]);
  });

  it('refuses a claim on any course that is not a practice course, and on an unpassed final exam', () => {
    expect(code).toMatch(/if v_app\.course_type is distinct from 'practice' then\s+raise exception/);
    expect(code).toMatch(/if not public\.academy_quiz_passed\(v_uid, p_app, p_tier, 'final', null\) then\s+raise exception/);
    expect(code).toMatch(/revoke all on function public\.academy_claim_practice_certificate\(text, text\) from public, anon;/);
    expect(code).not.toMatch(/reviewer-door/);
  });

  it('requires both dates on a practice row, with the review after the check', () => {
    expect(code).toMatch(/check \(course_type <> 'practice'\s+or \(review_date is not null\s+and sources_checked_on is not null\s+and review_date > sources_checked_on\)\)/);
    expect(code).toMatch(/check \(course_type in \('app', 'engine', 'practice'\)\)/);
  });
});

describe('the owner copy rule over the new learner-facing code', () => {
  const FILES = [
    'src/lib/courseType.js',
    'src/components/course/PracticeCourseBadge.jsx',
    'src/components/course/PracticeCourseNotice.jsx',
    'src/components/course/PracticeCertificateCard.jsx',
    'src/pages/apps/PracticeCourseLearningPage.jsx',
    'src/pages/apps/ContractsLearningPage.jsx',
  ];
  it.each(FILES)('%s has no dash and no contrastive', (rel) => {
    const t = read(rel);
    expect(t).not.toMatch(/[–—]/);
    expect(t).not.toMatch(/,\s+not\s+\w|\brather than\b|,\s+never\b|\binstead of\b|\band (?:not|never)\b/i);
  });
});
