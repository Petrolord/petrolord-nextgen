import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Download, ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { sponsorLearnerProgress } from '@/services/academyService';
import {
  TIER_LABELS, INACTIVE_DAYS, progressPct, scoreText, quizSummary, daysSinceActive, isInactive, summarizeProgress, progressCsv,
} from '@/lib/sponsorPools';

// Learner progress for a sponsor pool (owner decision 2026-09-23): how far
// each sponsored learner is through the assigned course and how they are
// scoring, so a training lead can supervise. The server returns only the
// assigned course and tier, scores for attempts made while the seat was
// active, and nothing for a cancelled seat; answers never leave the server.
// Disclosed to learners in the privacy policy (section 6).

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

const Passed = ({ ok }) => (ok ? <CheckCircle2 className="inline h-3.5 w-3.5 text-emerald-400 ml-1" aria-label="passed" /> : null);

function lastActiveText(row, nowMs) {
  const d = daysSinceActive(row, nowMs);
  if (d == null) return 'no activity yet';
  if (d === 0) return 'today';
  if (d === 1) return 'yesterday';
  return `${d} days ago`;
}

/**
 * The table itself, pure: rows as academy_sponsor_learner_progress returns
 * them. Only active seats are listed; ended ones are counted underneath.
 */
export function ProgressTable({ rows, nowMs = Date.now(), open = null, onToggle = () => {} }) {
  const active = (Array.isArray(rows) ? rows : []).filter((r) => r.status === 'active');
  const sum = summarizeProgress(rows, nowMs);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" data-testid="sponsor-progress-table">
        <thead className="text-xs uppercase text-gray-500">
          <tr>
            <th className="text-left py-1 pr-3">Learner</th>
            <th className="text-left py-1 pr-3">Course</th>
            <th className="text-left py-1 pr-3 min-w-[140px]">Progress</th>
            <th className="text-left py-1 pr-3">Module quizzes</th>
            <th className="text-left py-1 pr-3">Final exam</th>
            <th className="text-left py-1 pr-3">Capstone</th>
            <th className="text-left py-1 pr-3">Certificate</th>
            <th className="text-left py-1 pr-3">Last active</th>
          </tr>
        </thead>
        <tbody>
          {active.map((r) => {
            const pct = progressPct(r);
            const q = quizSummary(r);
            const quiet = isInactive(r, nowMs);
            const isOpen = open === r.assignment_id;
            return (
              <React.Fragment key={r.assignment_id}>
                <tr className="border-t border-gray-700 text-gray-200 cursor-pointer hover:bg-gray-800/40" onClick={() => onToggle(r.assignment_id)} data-testid={`sponsor-progress-row-${r.assignment_id}`}>
                  <td className="py-1.5 pr-3">
                    <div className="flex items-center gap-1">
                      {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-gray-500" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-500" />}
                      <span>{r.display_name || r.email}</span>
                    </div>
                    <div className="text-xs text-gray-500 pl-4">{r.email}</div>
                  </td>
                  <td className="py-1.5 pr-3">{r.course_name || r.app_slug}<div className="text-xs text-gray-500">{TIER_LABELS[r.course_tier] || r.course_tier}</div></td>
                  <td className="py-1.5 pr-3">
                    {r.deep ? (
                      <>
                        <Progress value={pct} className="h-2" />
                        <div className="text-xs text-gray-400 mt-1">{pct}%: {r.lessons_read}/{r.lessons_total} lessons, {r.modules_complete}/{r.modules_total} modules</div>
                      </>
                    ) : <span className="text-xs text-gray-500">not tracked for this course</span>}
                  </td>
                  <td className="py-1.5 pr-3 whitespace-nowrap">
                    {q.passed}/{q.total} passed
                    <div className="text-xs text-gray-500">{q.avgPct == null ? 'none taken' : `average best ${q.avgPct}%`}</div>
                  </td>
                  <td className="py-1.5 pr-3 whitespace-nowrap">
                    {scoreText(r.final_exam?.best_score, r.final_exam?.max_score)}<Passed ok={r.final_exam?.passed} />
                    <div className="text-xs text-gray-500">{r.final_exam?.attempts || 0} attempt{r.final_exam?.attempts === 1 ? '' : 's'}</div>
                  </td>
                  <td className="py-1.5 pr-3 whitespace-nowrap">
                    {scoreText(r.capstone?.best_score, r.capstone?.max_score)}<Passed ok={r.capstone?.passed} />
                    <div className="text-xs text-gray-500">{r.capstone?.attempts || 0} attempt{r.capstone?.attempts === 1 ? '' : 's'}</div>
                  </td>
                  <td className="py-1.5 pr-3 whitespace-nowrap">
                    {r.certificate ? (
                      <><span className="text-[#BFFF00]">{r.certificate.certificate_number}</span><div className="text-xs text-gray-500">valid until {fmtDate(r.certificate.valid_until)}</div></>
                    ) : <span className="text-gray-500">not yet</span>}
                  </td>
                  <td className={`py-1.5 pr-3 whitespace-nowrap ${quiet ? 'text-yellow-400' : ''}`}>
                    {quiet && <AlertTriangle className="inline h-3.5 w-3.5 mr-1" aria-label="inactive" />}
                    {lastActiveText(r, nowMs)}
                  </td>
                </tr>
                {isOpen && (
                  <tr className="bg-gray-900/40" data-testid={`sponsor-progress-detail-${r.assignment_id}`}>
                    <td colSpan={8} className="p-3">
                      {(r.modules || []).length ? (
                        <table className="w-full text-xs">
                          <thead className="text-gray-500 uppercase">
                            <tr><th className="text-left pr-3">Module</th><th className="text-left pr-3">Lessons read</th><th className="text-left pr-3">Quiz best</th><th className="text-left pr-3">Quiz attempts</th><th className="text-left pr-3">Complete</th></tr>
                          </thead>
                          <tbody>
                            {r.modules.map((m, i) => (
                              <tr key={m.key} className="text-gray-300">
                                <td className="pr-3 py-0.5">{i + 1}. {m.title || m.key}</td>
                                <td className="pr-3">{m.lessons_read}/{m.lessons_total}</td>
                                <td className="pr-3">{scoreText(m.quiz_best_score, m.quiz_max_score)}<Passed ok={m.quiz_passed} /></td>
                                <td className="pr-3">{m.quiz_attempts}</td>
                                <td className="pr-3">{m.complete ? <span className="text-emerald-400">yes</span> : <span className="text-gray-500">no</span>}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : <p className="text-xs text-gray-500">This course has no module breakdown.</p>}
                      <p className="text-xs text-gray-500 mt-2">Assigned {fmtDate(r.assigned_at)}.</p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
          {!active.length && <tr><td colSpan={8} className="py-3 text-gray-500">No active learners in this pool.</td></tr>}
        </tbody>
      </table>
      {sum.ended > 0 && <p className="text-xs text-gray-500 mt-2">{sum.ended} ended sponsorship{sum.ended === 1 ? '' : 's'} not shown: progress is visible only while the seat is active.</p>}
    </div>
  );
}

export default function SponsorProgressPanel({ poolId, fileStem = 'sponsor' }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);
  const nowMs = Date.now();

  useEffect(() => {
    let cancelled = false;
    if (!poolId) { setRows([]); return undefined; }
    setLoading(true); setError(null); setOpen(null);
    sponsorLearnerProgress(poolId)
      .then((r) => { if (!cancelled) setRows(r); })
      .catch((e) => { if (!cancelled) { setRows([]); setError(e.message || 'Could not load learner progress'); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [poolId]);

  const active = useMemo(() => rows.filter((r) => r.status === 'active'), [rows]);
  const sum = useMemo(() => summarizeProgress(rows, nowMs), [rows, nowMs]);

  const exportCsv = () => {
    const blob = new Blob([progressCsv(rows, nowMs)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${fileStem}-progress.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  return (
    <Card className="bg-[#1E293B] border-gray-700" data-testid="sponsor-progress">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-white flex items-center gap-2"><TrendingUp className="h-4 w-4" />Learner progress</CardTitle>
          <CardDescription>
            {sum.learners} active learner{sum.learners === 1 ? '' : 's'}, {sum.avgProgressPct}% average progress, {sum.finalPassed} final exam{sum.finalPassed === 1 ? '' : 's'} passed, {sum.capstonePassed} capstone{sum.capstonePassed === 1 ? '' : 's'} passed, {sum.certified} certified.
            {sum.inactive > 0 && <span className="text-yellow-400"> {sum.inactive} inactive for {INACTIVE_DAYS}+ days.</span>}
            {' '}Scores count attempts made since the seat was assigned. Learners' answers are not shown.
          </CardDescription>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!active.length} className="border-gray-600 text-gray-200" data-testid="sponsor-progress-csv"><Download className="h-4 w-4 mr-2" />CSV</Button>
      </CardHeader>
      <CardContent>
        {loading && <Loader2 className="h-5 w-5 animate-spin text-[#BFFF00]" />}
        {!loading && error && <p className="text-sm text-gray-400" data-testid="sponsor-progress-error">Learner progress is not available right now ({error}).</p>}
        {!loading && !error && (
          <ProgressTable rows={rows} nowMs={nowMs} open={open} onToggle={(id) => setOpen(open === id ? null : id)} />
        )}
      </CardContent>
    </Card>
  );
}
