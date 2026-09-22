// W5b re-case, dca: every graded value is what the course panel shows once
// the learner sets the case the brief states. Each key calls the same lab
// function the panel calls (src/components/course/panels/dca/declineLab.js,
// on the vendored engines), with the case read from dca.json.
import {
  fitWell, bookFromFit, arpsCum, daysBetween, typeCurvePipeline, bLeverageRow,
  fieldClosedFormEur, triangularSummary,
} from '../../../src/components/course/panels/dca/declineLab.js';

const fitOn = (well, win, model = 'Auto-Select') => (typeof win === 'string'
  ? fitWell(well, model, win)
  : fitWell(well, model, 'custom', { startDate: win[0], endDate: win[1] })).fit;

export function compute(tiers) {
  const out = {};
  const b = tiers.beginner.case;
  const f = fitOn(b.well, b.window);
  const p = f.parameters;
  const book = bookFromFit(p, b.limit_bpd, f.t0);
  out.beginner = {
    qi_bpd: p.qi,
    di_per_day: p.Di,
    eur_limit_stb: book.eur,
    t_limit_days: book.timeToLimitDays,
    np_to_date_stb: arpsCum(p.modelType.toLowerCase(), p.qi, p.Di, p.b, daysBetween(f.t0.slice(0, 10), b.np_date)),
    eff_decline_pct: book.effectiveDeclinePct,
  };
  const i = tiers.intermediate.case;
  const fLate = fitOn(i.late_well, i.late_window);
  const fEur = fitOn(i.eur_well, 'primary');
  const fSub = fitOn(i.sub_well, i.sub_window);
  const fNaive = fitOn(i.naive_well, i.naive_window || 'full');
  out.intermediate = {
    late_di: fLate.parameters.Di,
    well_eur_stb: bookFromFit(fEur.parameters, i.limit_bpd, fEur.t0).eur,
    sub_di: fSub.parameters.Di,
    naive_r2: fNaive.R2,
    tc_eur_stb: typeCurvePipeline(i.tc_pool, i.tc_target, i.limit_bpd).eurFixedB,
    field_eur_stb: fieldClosedFormEur(i.limit_bpd),
  };
  const a = tiers.advanced.case;
  const fa = fitOn(a.late_well_a, a.late_window);
  const fb = fitOn(a.late_well_b, a.late_window);
  const lever = bLeverageRow(a.b, { qLimit: a.limit_bpd });
  const tri = triangularSummary({ min: a.tri_min, mode: fieldClosedFormEur(a.limit_bpd), max: a.tri_max });
  out.advanced = {
    late_di_a: fa.parameters.Di,
    late_di_b: fb.parameters.Di,
    b_eur_stb: lever.eur,
    b_ratio: lever.ratioToExponential,
    p90_stb: tri.p90,
    p10_stb: tri.p10,
  };
  return out;
}
