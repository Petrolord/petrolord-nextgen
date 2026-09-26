// EVERY course panel must RENDER. Not compute correctly, which each course's
// own lab test already pins, but render at all without throwing.
//
// This gate did not exist until DR10, and its absence hid a live crash in
// THIRTY of the eighty panels, spread across ten courses: all nine built
// Drilling courses and Well Test Analysis. The shared panelKit SelectField
// destructured its options as `([v, l])`, the array-pair form, while a great
// many panels pass `{ value, label }` objects. Array-destructuring an object
// throws "object is not iterable", so those panels died the instant their
// select rendered.
//
// Nothing caught it because every gate in the suite checked NUMBERS. The
// teaching labs pinned hundreds of engine values, the content lint checked
// that every panel id resolved in the registry, the migrations asserted their
// own preconditions, and not one of them ever mounted a component. All ten
// affected courses were seeded and held from go-live, so no learner had
// reached one, and the next production upload would have shipped all thirty.
//
// THE RULE: a suite that verifies what a component COMPUTES has said nothing
// about whether it RENDERS. One cheap smoke render per component is the
// difference between finding that in a test and finding it in production.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

const panels = {
  ...import.meta.glob('/src/components/course/panels/**/*Explorer.jsx'),
  ...import.meta.glob('/src/components/course/panels/**/*Lab.jsx'),
  // Engine courses whose practicals are calculator panels (SC2 procurement, EC7 pia).
  ...import.meta.glob('/src/components/course/panels/**/*Calculator.jsx'),
};

describe('every course panel renders with no props', () => {
  const entries = Object.entries(panels);
  it('finds the panels', () => {
    expect(entries.length).toBeGreaterThan(70);
  });

  // Named rather than left to the glob, so a panel that is renamed, moved or
  // deleted fails here instead of quietly dropping out of the sweep.
  it('finds the PD4 rod pump panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('rodpump/StringExplorer.jsx');
    expect(names).toContain('rodpump/CardExplorer.jsx');
    expect(names).toContain('rodpump/BalanceExplorer.jsx');
  });
  it('finds the PD6 flow assurance panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('flowassurance/ThermalExplorer.jsx');
    expect(names).toContain('flowassurance/LineExplorer.jsx');
    expect(names).toContain('flowassurance/HydrateExplorer.jsx');
  });
  it('finds the PD7 network panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('network/TrunkExplorer.jsx');
    expect(names).toContain('network/NetworkExplorer.jsx');
    expect(names).toContain('network/FightExplorer.jsx');
  });
  it('finds the PD8 intervention panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('intervention/DiagnosticExplorer.jsx');
    expect(names).toContain('intervention/ChannelExplorer.jsx');
    expect(names).toContain('intervention/CandidateExplorer.jsx');
  });
  it('finds the FC3 rotating equipment panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('rotating/PumpExplorer.jsx');
    expect(names).toContain('rotating/SuctionExplorer.jsx');
    expect(names).toContain('rotating/CompressorExplorer.jsx');
  });
  it('finds the PD9 production surveillance panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('surveillance/LedgerExplorer.jsx');
    expect(names).toContain('surveillance/ExceptionExplorer.jsx');
    expect(names).toContain('surveillance/ReadingExplorer.jsx');
  });
  it('finds the FC2 line sizing panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('linesizing/LiquidExplorer.jsx');
    expect(names).toContain('linesizing/GasLineExplorer.jsx');
    expect(names).toContain('linesizing/WallPigExplorer.jsx');
  });
  it('finds the H3 LOPA and SIL panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('lopa/WorksheetExplorer.jsx');
    expect(names).toContain('lopa/SifExplorer.jsx');
    expect(names).toContain('lopa/ProofTestExplorer.jsx');
  });
  it('every H3 LOPA and SIL view renders, not only the default one', async () => {
    const MODES = {
      'lopa/WorksheetExplorer.jsx': ['row', 'loop', 'bands'],
      'lopa/SifExplorer.jsx': ['subsystem', 'sif', 'published'],
      'lopa/ProofTestExplorer.jsx': ['sensitivity', 'longest', 'coverage'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        const html = renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode }));
        expect(html, `${name} in the ${mode} view rendered nothing`).toMatch(/<table/);
        rendered += 1;
      }
    }
    expect(rendered).toBe(9);
  });
  it('finds the H5 QRA panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('qra/EventTreeExplorer.jsx');
    expect(names).toContain('qra/SocietalExplorer.jsx');
    expect(names).toContain('qra/AlarpExplorer.jsx');
  });
  it('every H5 QRA view renders, not only the default one', async () => {
    const MODES = {
      'qra/EventTreeExplorer.jsx': ['tree', 'lsir', 'irpa'],
      'qra/SocietalExplorer.jsx': ['pll', 'fn', 'fractions'],
      'qra/AlarpExplorer.jsx': ['band', 'cba', 'conventions'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        const html = renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode }));
        expect(html, `${name} in the ${mode} view rendered nothing`).toMatch(/<table/);
        rendered += 1;
      }
    }
    expect(rendered).toBe(9);
  });
  it('finds the H4 consequence modelling panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('consequence/ReleaseExplorer.jsx');
    expect(names).toContain('consequence/FireExplorer.jsx');
    expect(names).toContain('consequence/HarmExplorer.jsx');
  });
  it('every H4 consequence modelling view renders, not only the default one', async () => {
    const MODES = {
      'consequence/ReleaseExplorer.jsx': ['outflow', 'pool', 'plume'],
      'consequence/FireExplorer.jsx': ['flame', 'view', 'heat'],
      'consequence/HarmExplorer.jsx': ['blast', 'probit', 'toxic'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        const html = renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode }));
        expect(html, `${name} in the ${mode} view rendered nothing`).toMatch(/<table/);
        rendered += 1;
      }
    }
    expect(rendered).toBe(9);
  });
  it('finds the compliance (Compliance, Audit & Quality) panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('compliance/RegisterExplorer.jsx');
    expect(names).toContain('compliance/PlanExplorer.jsx');
    expect(names).toContain('compliance/ReadinessExplorer.jsx');
  });
  it('finds the crude (Crude Assay & Blending) panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('crude/AssayExplorer.jsx');
    expect(names).toContain('crude/ValuationExplorer.jsx');
    expect(names).toContain('crude/RecipeExplorer.jsx');
  });
  it('finds the refinery (Refinery Feasibility & Planning) panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('refinery/ScreenExplorer.jsx');
    expect(names).toContain('refinery/PlanExplorer.jsx');
    expect(names).toContain('refinery/VarianceExplorer.jsx');
  });
  it('finds the carbon (Carbon & Energy Efficiency) panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('carbon/InventoryExplorer.jsx');
    expect(names).toContain('carbon/EfficiencyExplorer.jsx');
    expect(names).toContain('carbon/AbatementExplorer.jsx');
  });
  it('finds the supply (Terminals, Depots & Fuel Supply) panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('supply/TankExplorer.jsx');
    expect(names).toContain('supply/DepotExplorer.jsx');
    expect(names).toContain('supply/PriceExplorer.jsx');
  });
  it('finds the gasvalue (Flare Gas to Value & LPG/CNG) panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('gasvalue/FlareExplorer.jsx');
    expect(names).toContain('gasvalue/RouteExplorer.jsx');
    expect(names).toContain('gasvalue/RolloutExplorer.jsx');
  });
  it('finds the FC8 metering, control valve and storage panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('metering/MeterRunExplorer.jsx');
    expect(names).toContain('metering/ChokingExplorer.jsx');
    expect(names).toContain('metering/VentingExplorer.jsx');
    expect(names).toContain('metering/WithheldExplorer.jsx');
  });
  it('finds the FC9 corrosion and integrity panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('corrosion/ChemistryExplorer.jsx');
    expect(names).toContain('corrosion/RateExplorer.jsx');
    expect(names).toContain('corrosion/InhibitorIntegrityExplorer.jsx');
  });
  it('finds the H1 safety statistics panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('safetystats/RatesExplorer.jsx');
    expect(names).toContain('safetystats/IntervalsExplorer.jsx');
    expect(names).toContain('safetystats/UChartExplorer.jsx');
  });
  it('every H1 safety statistics view renders, not only the default one', async () => {
    const MODES = {
      'safetystats/RatesExplorer.jsx': ['rate', 'kinds', 'pool', 'rolling'],
      'safetystats/IntervalsExplorer.jsx': ['interval', 'zero', 'compare', 'ladder'],
      'safetystats/UChartExplorer.jsx': ['chart', 'revise', 'beforeafter'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        expect(
          () => renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode })),
          `${name} in the ${mode} view`,
        ).not.toThrow();
        rendered += 1;
      }
    }
    expect(rendered).toBe(11);
  });
  it('finds the D1 data quality panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('dataqc/ChecksExplorer.jsx');
    expect(names).toContain('dataqc/OutliersExplorer.jsx');
    expect(names).toContain('dataqc/MonitorExplorer.jsx');
  });
  it('every D1 data quality view renders, not only the default one', async () => {
    const MODES = {
      'dataqc/ChecksExplorer.jsx': ['there', 'valid', 'index', 'agree', 'names'],
      'dataqc/OutliersExplorer.jsx': ['z', 'modz', 'fences', 'hampel', 'grubbs', 'mahalanobis'],
      'dataqc/MonitorExplorer.jsx': ['individuals', 'ewma', 'cusum', 'scorecard'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        expect(
          () => renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode })),
          `${name} in the ${mode} view`,
        ).not.toThrow();
        rendered += 1;
      }
    }
    expect(rendered).toBe(15);
  });
  it('finds the D2 machine learning panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('mlcore/FitExplorer.jsx');
    expect(names).toContain('mlcore/ValidateExplorer.jsx');
    expect(names).toContain('mlcore/DiagnoseExplorer.jsx');
  });
  it('every D2 machine learning view renders, not only the default one', async () => {
    const MODES = {
      'mlcore/FitExplorer.jsx': ['split', 'scale', 'ols', 'metrics'],
      'mlcore/ValidateExplorer.jsx': ['ridge', 'kfold', 'leakage', 'scaleleak', 'logistic', 'confusion', 'roc'],
      'mlcore/DiagnoseExplorer.jsx': ['condition', 'separation', 'convergence', 'importance', 'learning', 'missing'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        expect(
          () => renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode })),
          `${name} in the ${mode} view`,
        ).not.toThrow();
        rendered += 1;
      }
    }
    expect(rendered).toBe(17);
  }, 60000);
  it('finds the D3 electrofacies panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('facies/ClusterExplorer.jsx');
    expect(names).toContain('facies/JudgeExplorer.jsx');
    expect(names).toContain('facies/ClassifyExplorer.jsx');
  });
  it('every D3 electrofacies view renders, not only the default one', async () => {
    const MODES = {
      'facies/ClusterExplorer.jsx': ['scale', 'distance', 'pca', 'kmeans', 'assign'],
      'facies/JudgeExplorer.jsx': ['elbow', 'silhouette', 'tree', 'match', 'ari'],
      'facies/ClassifyExplorer.jsx': ['knn', 'cart', 'ties', 'uncored', 'bounds'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        expect(
          () => renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode })),
          `${name} in the ${mode} view`,
        ).not.toThrow();
        rendered += 1;
      }
    }
    expect(rendered).toBe(15);
  }, 120000);
  it('finds the D4 forecastml panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('forecastml/SmoothingExplorer.jsx');
    expect(names).toContain('forecastml/BacktestExplorer.jsx');
    expect(names).toContain('forecastml/UncertaintyExplorer.jsx');
  });
  it('every D4 forecastml view renders, not only the default one', async () => {
    const MODES = {
      'forecastml/SmoothingExplorer.jsx': ['fit', 'recursion', 'forecast', 'alpha', 'methods'],
      'forecastml/BacktestExplorer.jsx': ['accuracy', 'holdout', 'scale', 'backtest', 'horizon'],
      'forecastml/UncertaintyExplorer.jsx': ['intervals', 'paths', 'arps', 'compare', 'bounds'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        expect(
          () => renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode })),
          `${name} in the ${mode} view`,
        ).not.toThrow();
        rendered += 1;
      }
    }
    expect(rendered).toBe(15);
  }, 120000);
  it('finds the SC2 procurement calculator panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('procurement/EnvelopeCalculator.jsx');
    expect(names).toContain('procurement/AwardCalculator.jsx');
    expect(names).toContain('procurement/ContractCalculator.jsx');
  });
  it('every SC2 procurement view renders, not only the default one', async () => {
    const MODES = {
      'procurement/EnvelopeCalculator.jsx': ['technical', 'arithmetic', 'evaluated', 'combined', 'tender'],
      'procurement/AwardCalculator.jsx': ['lifecycle', 'band', 'alb', 'content', 'preference'],
      'procurement/ContractCalculator.jsx': ['contracts', 'shouldcost', 'tender', 'bounds', 'refusals'],
  it('finds the EC7 pia calculator panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('pia/RoyaltyCalculator.jsx');
    expect(names).toContain('pia/HctCalculator.jsx');
    expect(names).toContain('pia/LedgerCalculator.jsx');
  });
  it('every EC7 pia view renders, not only the default one', async () => {
    const MODES = {
      'pia/RoyaltyCalculator.jsx': ['tranches', 'gas', 'price', 'stack', 'refusals'],
      'pia/HctCalculator.jsx': ['rate', 'allowance', 'capital', 'base', 'cit'],
      'pia/LedgerCalculator.jsx': ['ledger', 'framework', 'readings', 'moved', 'notes'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        expect(
          () => renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode })),
          `${name} in the ${mode} view`,
        ).not.toThrow();
        rendered += 1;
      }
    }
    expect(rendered).toBe(15);
  }, 120000);
  it('finds the D5 appliedai panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('appliedai/RetrievalExplorer.jsx');
    expect(names).toContain('appliedai/ScoringExplorer.jsx');
    expect(names).toContain('appliedai/TrustExplorer.jsx');
  });
  it('every D5 appliedai view renders, not only the default one', async () => {
    const MODES = {
      'appliedai/RetrievalExplorer.jsx': ['tokens', 'tfidf', 'bm25', 'run', 'claims'],
      'appliedai/ScoringExplorer.jsx': ['evaluate', 'answers', 'extraction', 'grounded', 'compare'],
      'appliedai/TrustExplorer.jsx': ['kappa', 'calibration', 'murphy', 'bootstrap', 'bounds'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        expect(
          () => renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode })),
          `${name} in the ${mode} view`,
        ).not.toThrow();
        rendered += 1;
      }
    }
    expect(rendered).toBe(15);
  }, 120000);
  // EVERY MODE, not only the default one. A panel with four views renders one
  // of them with no props, and the other three are exactly where a crash hides:
  // the sweep below mounted eighty panels and touched a quarter of their views.
  it('every FC9 corrosion view renders, not only the default one', async () => {
    const MODES = {
      'corrosion/ChemistryExplorer.jsx': ['fugacity', 'sour', 'ratio', 'absent'],
      'corrosion/RateExplorer.jsx': ['series', 'film', 'ph', 'wetting'],
      'corrosion/InhibitorIntegrityExplorer.jsx': ['programme', 'shear', 'allowance', 'binding'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        expect(
          () => renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode })),
          `${name} in the ${mode} view`,
        ).not.toThrow();
        rendered += 1;
      }
    }
    expect(rendered).toBe(12);
  });
  for (const [path, load] of entries) {
    it(path.split('/panels/')[1], async () => {
      const mod = await load();
      const Panel = mod.default;
      expect(Panel, `${path} has no default export`).toBeTruthy();
      expect(() => renderToStaticMarkup(React.createElement(Panel))).not.toThrow();
    });
  }
});
