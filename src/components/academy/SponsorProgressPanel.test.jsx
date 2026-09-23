// A TRAINING LEAD SEES PROGRESS AND SCORES, AND NOTHING ELSE (2026-09-23).
//
// The server decides what a sponsor may read (academy_sponsor_learner_progress
// and migrations/docs/sponsor-learner-progress-pentest.md); this proves the
// table shows what it returns faithfully: an active seat's progress, quiz,
// final exam and capstone scores, certificate and last activity; the module
// breakdown only when opened; an ended seat counted and never listed.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { ProgressTable } from './SponsorProgressPanel';

const NOW = Date.parse('2026-09-23T12:00:00Z');
const DAY = 86400000;
const iso = (daysAgo) => new Date(NOW - daysAgo * DAY).toISOString();
const text = (el) => renderToStaticMarkup(el).replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');

const ada = {
  assignment_id: 'a1', display_name: 'Ada Obi', email: 'ada@example.com', app_slug: 'petrophysics', course_name: 'Petrophysics',
  course_tier: 'intermediate', status: 'active', assigned_at: iso(20), deep: true,
  lessons_total: 26, lessons_read: 13, modules_total: 2, modules_complete: 1,
  modules: [
    { key: 'm1', title: 'Porosity', lessons_total: 4, lessons_read: 4, complete: true, quiz_attempts: 2, quiz_best_score: 4, quiz_max_score: 5, quiz_passed: true },
    { key: 'm2', title: 'Saturation', lessons_total: 5, lessons_read: 1, complete: false, quiz_attempts: 0, quiz_best_score: null, quiz_max_score: null, quiz_passed: false },
  ],
  final_exam: { attempts: 1, best_score: 31, max_score: 40, passed: true },
  capstone: { attempts: 2, best_score: 5, max_score: 6, passed: false },
  certificate: null, last_active_at: iso(2),
};
const idle = { ...ada, assignment_id: 'a2', display_name: 'Tunde Idle', email: 'tunde@example.com', lessons_read: 0, modules_complete: 0,
  modules: [], final_exam: { attempts: 0, best_score: null, max_score: null, passed: false },
  capstone: { attempts: 0, best_score: null, max_score: null, passed: false }, last_active_at: null, assigned_at: iso(30) };
const certified = { ...ada, assignment_id: 'a3', display_name: 'Ngozi Done', lessons_read: 26,
  certificate: { certificate_number: 'PLA-2026-000123', issued_at: iso(1), valid_until: '2027-09-22T00:00:00Z' } };
const ended = { assignment_id: 'a4', display_name: 'Ended Seat', email: 'gone@example.com', status: 'cancelled', course_tier: 'beginner', app_slug: 'petrophysics' };

describe('the sponsor progress table', () => {
  const t = text(<ProgressTable rows={[ada, idle, certified, ended]} nowMs={NOW} />);

  it('lists each active learner with progress and every score', () => {
    expect(t).toContain('Ada Obi');
    expect(t).toContain('50%: 13/26 lessons, 1/2 modules');
    expect(t).toContain('1/2 passed');
    expect(t).toContain('average best 80%');
    expect(t).toContain('31/40');
    expect(t).toContain('5/6');
    expect(t).toContain('2 attempts');
    expect(t).toContain('2 days ago');
  });
  it('shows the certificate number when earned, and "not yet" otherwise', () => {
    expect(t).toContain('PLA-2026-000123');
    expect(t).toContain('not yet');
  });
  it('flags a learner with no activity 30 days after assignment', () => {
    expect(t).toContain('Tunde Idle');
    expect(t).toContain('no activity yet');
    expect(renderToStaticMarkup(<ProgressTable rows={[idle]} nowMs={NOW} />)).toContain('aria-label="inactive"');
    expect(renderToStaticMarkup(<ProgressTable rows={[ada]} nowMs={NOW} />)).not.toContain('aria-label="inactive"');
  });
  it('never lists an ended seat, only counts it', () => {
    expect(t).not.toContain('Ended Seat');
    expect(t).not.toContain('gone@example.com');
    expect(t).toContain('1 ended sponsorship not shown');
  });
  it('shows the module breakdown only for the opened learner', () => {
    expect(t).not.toContain('Saturation');
    const opened = text(<ProgressTable rows={[ada, idle]} nowMs={NOW} open="a1" />);
    expect(opened).toContain('1. Porosity');
    expect(opened).toContain('2. Saturation');
    expect(opened).toContain('4/5');
    expect(opened).toContain('no attempt');
  });
  it('says so when a pool has no active learners', () => {
    expect(text(<ProgressTable rows={[ended]} nowMs={NOW} />)).toContain('No active learners in this pool.');
  });
});
