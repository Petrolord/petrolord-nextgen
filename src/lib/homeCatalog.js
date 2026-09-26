// Homepage course catalogue: the marketing copy for every academy course,
// keyed by academy_apps.slug. Status comes from academy_apps when the page
// can read it (anon SELECT is allowed), so a course whose go-live migration
// is still held shows as "Coming soon" and is left out of the counts. The
// static `status` below is only the fallback when that read fails.
//
// Add a row here alongside any new academy_apps row. homeCatalog.test.js
// checks slugs are unique and every module key is known.

export const HOME_MODULES = [
  { key: 'geoscience', label: 'Geoscience', tagline: 'Find it, and find it right.' },
  { key: 'reservoir', label: 'Reservoir', tagline: 'Get more out of every field.' },
  { key: 'drilling', label: 'Drilling & Completions', tagline: 'Safer, faster, cheaper wells.' },
  { key: 'production', label: 'Production', tagline: 'Every well at its best.' },
  { key: 'facilities', label: 'Facilities', tagline: 'The plant that pays the bills.' },
  { key: 'economics', label: 'Economics & Commercial', tagline: 'Turn engineering into value, from fiscal terms to field plans.' },
  { key: 'commercial_trading', label: 'Midstream & Downstream', tagline: 'From crude assay to refinery plan.' },
  { key: 'supply_chain', label: 'Supply Chain', tagline: 'Keep product flowing.' },
  { key: 'energy_transition', label: 'Energy Transition', tagline: 'Lower emissions, new revenue.' },
  { key: 'assurance', label: 'Assurance', tagline: 'Govern with confidence.' },
  { key: 'hse', label: 'HSE', tagline: 'Everyone goes home safe.' },
  { key: 'data_ai', label: 'Data & AI', tagline: 'The newest school in the academy.' },
];

const c = (slug, module, name, blurb, status = 'available', isNew = false) => ({ slug, module, name, blurb, status, isNew });

export const HOME_COURSES = [
  c('welldata', 'geoscience', 'Well Data Management', 'Clean, trusted well data stops bad logs from becoming bad wells.'),
  c('petrophysics', 'geoscience', 'Petrophysics', 'Porosity, saturation and net pay from logs. Fewer bypassed zones.'),
  c('wellcorrelation', 'geoscience', 'Well Correlation', 'A consistent picture of the reservoir across every well.'),
  c('seismolord', 'geoscience', 'Seismic Interpretation', 'Tie wells to seismic and read the subsurface between them.'),
  c('mapping', 'geoscience', 'Subsurface Mapping', 'Honest structure and property maps that drive well placement.'),
  c('reservoircalc', 'geoscience', 'Reservoir Volumetrics', 'In-place volumes with contacts and uncertainty, ready for partners.'),
  c('rockphysics', 'geoscience', 'Rock Physics', 'See fluids and lithology in the seismic before you drill.'),
  c('porepressure', 'geoscience', 'Pore Pressure', 'Predict pressure ahead of the bit. Prevent kicks and losses.'),
  c('earthmodel', 'geoscience', 'Earth Modeling', 'The 3D model every development plan depends on.'),
  c('basin', 'geoscience', 'Basin & Charge', 'Was oil generated and trapped? Smarter exploration bets.'),
  c('dca', 'reservoir', 'Decline Curve Analysis', 'Forecasts and reserves that anchor budgets and valuations.'),
  c('mbal', 'reservoir', 'Material Balance', 'How much is really there, and what is driving production.'),
  c('scal', 'reservoir', 'SCAL & Displacement', 'Predict how fluids really move through the rock.'),
  c('waterflood', 'reservoir', 'Waterflood Management', 'Lift recovery from mature fields at low cost per barrel.'),
  c('sim', 'reservoir', 'Reservoir Simulation Essentials', 'Build, check and trust the models behind big decisions.'),
  c('fluid', 'reservoir', 'Fluid Properties & PVT', 'The fluid model every downstream calculation depends on.'),
  c('welltest', 'reservoir', 'Well Test Analysis', 'Permeability, skin and boundaries. Find wells worth stimulating.'),
  c('welldesign', 'drilling', 'Well Design & Surveys', 'Trajectories that hit targets and avoid collisions.'),
  c('torquedrag', 'drilling', 'Torque, Drag & Casing Wear', 'Know the string will reach TD before you spud.'),
  c('hydraulics', 'drilling', 'Drilling Hydraulics', 'Better hole cleaning, faster ROP, fewer losses.'),
  c('wellcontrol', 'drilling', 'Well Control', 'Kick detection and kill competence that protects lives.'),
  c('geomech', 'drilling', 'Geomechanics and Wellbore Stability', 'The mud weight window that keeps the hole open.'),
  c('casingtubing', 'drilling', 'Casing and Tubing Design', 'Strings that survive burst, collapse and tension loads.'),
  c('cementing', 'drilling', 'Cementing', 'Zonal isolation delivered right the first time.'),
  c('completion', 'drilling', 'Completion Design', 'Connect the reservoir to surface for lasting deliverability.'),
  c('perfsand', 'drilling', 'Perforation & Sand Control', 'Maximum inflow with sand kept out of your equipment.'),
  c('stimulation', 'drilling', 'Stimulation Design', 'Acid and fracture treatments that multiply productivity.'),
  c('integrity', 'drilling', 'Well Integrity & P&A', "Barriers through the well's life and safe abandonment."),
  c('wellcost', 'drilling', 'Well Cost & Time', 'Credible AFEs and time-depth curves. Fewer overruns.'),
  c('nodal', 'production', 'Nodal Analysis & Well Performance', 'Find the bottleneck in every well.'),
  c('gaslift', 'production', 'Gas Lift Design', 'More oil for every unit of lift gas injected.'),
  c('esp', 'production', 'ESP Design', 'Pumps sized right, longer run life, fewer workovers.'),
  c('rodpump', 'production', 'Rod Pump Design', 'Efficient, reliable beam pumping in mature fields.'),
  c('gaswell', 'production', 'Gas Well Performance', 'Deliverability and liquid loading for gas portfolios.'),
  c('flowassurance', 'production', 'Flow Assurance', 'Keep hydrates, wax and slugs from shutting you in.'),
  c('network', 'production', 'Production Networks', 'Optimise the whole gathering system at once.'),
  c('intervention', 'production', 'Well Intervention', 'Pick the right candidate and the right job.'),
  c('surveillance', 'production', 'Production Surveillance', 'Spot underperformers early and act daily.'),
  c('separation', 'facilities', 'Separation & Slug Catching', 'Separators sized for the real flow.'),
  c('linesizing', 'facilities', 'Pipeline & Line Sizing', 'Right-sized lines, lower capital, no erosion surprises.'),
  c('rotating', 'facilities', 'Rotating Equipment', 'Pumps and compressors that cost less to own.'),
  c('gasprocessing', 'facilities', 'Gas Processing', 'Raw gas to saleable, on-spec product.'),
  c('relief', 'facilities', 'Relief & Flare Systems', 'Protect plant and people from overpressure.'),
  c('heattransfer', 'facilities', 'Heat Exchange & Cooling', 'Exchangers and coolers that keep the process on spec.'),
  c('producedwater', 'facilities', 'Produced Water Treatment', 'Meet discharge limits and protect your licence.'),
  c('metering', 'facilities', 'Metering, Control Valves & Storage', 'Accurate measurement is money.'),
  c('corrosion', 'facilities', 'Corrosion & Integrity', 'Longer asset life, fewer leaks and shutdowns.'),
  c('crude', 'commercial_trading', 'Crude Assay & Blending', 'Value crudes correctly and blend for margin.'),
  c('refinery', 'commercial_trading', 'Refinery Feasibility & Planning', 'Test refinery economics before you commit capital.'),
  c('supply', 'supply_chain', 'Terminals, Depots & Fuel Supply', 'Storage and distribution with lean working capital.'),
  c('procurement', 'supply_chain', 'Procurement, Tendering & Contracting', 'Run a fair tender and choose the contract that fits the risk.', 'coming_soon', true),
  c('gasvalue', 'energy_transition', 'Flare Gas to Value & LPG/CNG', 'Turn a flare into a revenue stream.'),
  c('carbon', 'energy_transition', 'Carbon & Energy Efficiency', 'Cut emissions and energy cost. Stronger ESG reporting.'),
  c('cashflow', 'economics', 'Cash Flow & NPV', 'The common language of every investment decision.'),
  c('fiscal', 'economics', 'Fiscal Regime Design', 'Royalties, taxes and PSCs. What a barrel is worth to you.'),
  c('uncertainty', 'economics', 'Probabilistic Economics', 'P10, P50 and P90 ranges that boards can trust.'),
  c('decision', 'economics', 'Decision Analysis & Value of Information', 'When to buy more data and when to act.'),
  c('portfolio', 'economics', 'Capital Portfolio & Cost Control', 'Capital to the best projects, spend kept on track.'),
  c('fdp', 'economics', 'Field Development Planning', 'Every discipline in one bankable plan.'),
  c('pia', 'economics', 'Petroleum Industry Act 2021 & Nigerian Fiscal Terms', 'Read Nigerian royalty and tax the way the Act writes them.', 'coming_soon', true),
  c('gsa', 'economics', 'Gas Commercialisation & Gas Sales Agreements', 'Work take-or-pay, make-up and gas price formulas the way the contract writes them.', 'coming_soon', true),
  c('riskchange', 'assurance', 'Risk, Change & Learning', 'Risk registers, MOC and lessons learned done properly.'),
  c('compliance', 'assurance', 'Compliance, Audit & Quality', 'Audit-ready teams and consistent quality.'),
  c('safetystats', 'hse', 'Safety Performance Statistics & KPIs', 'Act on real safety trends instead of noise in the data.'),
  c('hygiene', 'hse', 'Occupational Hygiene', 'Noise, chemical and heat exposure kept within limits.'),
  c('lopa', 'hse', 'Process Safety: LOPA & SIL', 'How many layers of protection each hazard needs.'),
  c('consequence', 'hse', 'Consequence Modelling', 'Fire, explosion and toxic release impacts, quantified.'),
  c('qra', 'hse', 'Quantitative Risk Assessment', 'Show risk is as low as reasonably practicable.'),
  c('dataqc', 'data_ai', 'Oilfield Data Quality', 'Fix bad data before it poisons models and decisions.', 'available', true),
  c('mlcore', 'data_ai', 'Machine Learning on Well Data', 'Predict missing logs with methods engineers can explain.', 'available', true),
  c('facies', 'data_ai', 'Electrofacies Classification', 'Classify rock types from logs across many wells.', 'available', true),
  c('forecastml', 'data_ai', 'Data-Driven Production Forecasting', 'Machine learning forecasts alongside classic decline.', 'coming_soon', true),
  c('appliedai', 'data_ai', 'Applied AI and Language Models', 'Use AI tools productively and evaluate them critically.', 'coming_soon', true),
];

/**
 * Overlay live academy_apps status onto the static catalogue. A course the
 * live catalogue lists takes its status from there; a course it does not list
 * yet is coming soon. With no live rows (read failed or empty) the static
 * status stands.
 */
export function mergeCatalog(courses, liveApps) {
  if (!Array.isArray(liveApps) || liveApps.length === 0) return courses;
  const bySlug = new Map(liveApps.map((a) => [a.slug, a.status]));
  return courses.map((co) => ({
    ...co,
    status: bySlug.get(co.slug) === 'available' ? 'available' : 'coming_soon',
  }));
}

export function catalogStats(courses) {
  const live = courses.filter((co) => co.status === 'available');
  const disciplines = new Set(live.map((co) => co.module)).size;
  return { courses: live.length, disciplines, certifications: live.length * 3 };
}
