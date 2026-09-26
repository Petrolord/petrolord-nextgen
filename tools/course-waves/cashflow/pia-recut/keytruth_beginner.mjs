// Key-truth checks for the cashflow Associate rows this re-cut changes. Every
// value is an engine return value (lib.mjs); nothing restates a formula.
const k = (L, name) => L.run(L.CASE[name]).kpis;
export default [
  { q: 'beginner final 7', where: 'option 1', printed: '617004738.36', value: (L) => k(L, 'pia_worked_example').total_tax },
  { q: 'beginner final 7', where: 'option 1', printed: '1460000000.00', value: (L) => k(L, 'pia_worked_example').total_revenue },
  { q: 'beginner final 33', where: 'key', printed: '2.844931', value: (L) => k(L, 'multiyear_pia_real').payback_years },
  { q: 'beginner final 33', where: 'key', printed: '2.889357', value: (L) => k(L, 'multiyear_jv_real').payback_years },
  { q: 'beginner final 33', where: 'prompt', printed: 'prints payback', value: (L) => k(L, 'multiyear_pia_real').payback === `${(2.84).toFixed(2)} years` && k(L, 'multiyear_jv_real').payback === `${(2.89).toFixed(2)} years` },
  { q: 'beginner final 33', where: 'prompt', printed: 'third row', value: (L) => {
      const x = (n) => L.run(L.CASE[n]).cashFlowData.findIndex((r) => r.cumulative_cash_flow > 0);
      return x('multiyear_pia_real') === 2 && x('multiyear_jv_real') === 2; } },
  { q: 'beginner m01 5', where: 'prompt', printed: 'engine, version', value: (L) => L.E.ENGINE_VERSION === ['3', '12', '0'].join('.') },
  { q: 'beginner m01 7', where: 'prompt', printed: '350425980.24', value: (L) => k(L, 'multiyear_pia_nominal').total_net_cash_flow },
  { q: 'beginner m01 7', where: 'prompt', printed: '305105917.37', value: (L) => k(L, 'multiyear_pia_real').total_net_cash_flow },
  { q: 'beginner m01 7', where: 'option 2', printed: '219158380.04', value: (L) => k(L, 'multiyear_pia_real').npv },
  { q: 'beginner final 31', where: 'explanation', printed: '5397727.27', value: (L) => L.run(L.withCfg(L.CASE.jv_analytic_decision_kpis, { jv_working_interest_pct: 25 })).kpis.npv },
  { q: 'beginner m04 13', where: 'explanation', printed: '66.1723', value: (L) => L.run(L.withCfg(L.AKATA, { jv_working_interest_pct: 25 })).kpis.government_take_pct },
  { q: 'beginner m06 6', where: 'explanation', printed: '66.1723', value: (L) => L.run(L.withCfg(L.AKATA, { jv_working_interest_pct: 60 })).kpis.government_take_pct },
];
