import React, { useState } from 'react';
import {
  STARTS, pretty, blockKeysOf, viewRun, estimatesFor, setStated,
} from './prmsLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextField, Refusal, EngineNote, Reasons, Source, useJsonBox, StatedControl, MissingStated,
  statedIn, WordStated, RewriteControl, BlockSelector, BOOL, castBool, list,
} from './panelBits';

// The classification calculator (Associate): the class and sub-class of a
// project from its stated facts, its chance of commerciality, the commerciality
// criteria it meets, and the categories of a set of estimates (1P/2P/3P,
// 1C/2C/3C, 1U/2U/3U) with the P90/P50/P10 labels and the increments. Every
// figure is a return value of the vendored engine
// (engines/economics/prms.js) through prmsLab. This is the course's own
// calculator: there is no Suite app for this course.

export const Box = ({ box, label, rows = 10 }) => (
  <FieldGrid>
    <TextField label={label} value={box.text} onChange={box.setText} rows={rows} />
  </FieldGrid>
);

/**
 * A JSON box for one view, with the block of a pasted case file it reads.
 * Returns the box, the block key the view runs at (the view's own name when the
 * box holds one call's inputs), the blocks a case file offers and a setter.
 */
export const useViewBox = (view, start, { initialCase = null, initialText = null, initialBlock = null } = {}) => {
  const box = useJsonBox(initialCase || start, initialText);
  const blocks = box.parsed.error ? [] : blockKeysOf(box.parsed.value, view);
  const [chosen, setChosen] = useState(initialBlock);
  const blockKey = blocks.length ? (blocks.includes(chosen) ? chosen : blocks[0]) : view;
  return { box, blocks, blockKey, setBlock: setChosen };
};

/** A start selector that loads a teaching case into the box. */
export const Starts = ({ box, starts }) => {
  const [start, setStart] = useState(starts[0][0]);
  const choose = (k) => { setStart(k); box.setText(pretty(STARTS[k])); };
  return (
    <FieldGrid>
      <SelectField label="Start from" value={start} onChange={choose} options={starts} />
    </FieldGrid>
  );
};

const DISCOVERY = [['discovered', 'a known accumulation (discovered)'], ['undiscovered', 'a potential accumulation (undiscovered)']];
const RECOVERY = [['established-technology', 'a project with established technology'], ['technology-under-development', 'a project with technology under development'], ['none', 'no recovery project applies (none)']];
const SUB_CLASSES = [
  ['on-production', 'on-production (Reserves)'], ['approved-for-development', 'approved-for-development (Reserves)'], ['justified-for-development', 'justified-for-development (Reserves)'],
  ['development-pending', 'development-pending (Contingent)'], ['development-on-hold', 'development-on-hold (Contingent)'], ['development-unclarified', 'development-unclarified (Contingent)'], ['development-not-viable', 'development-not-viable (Contingent)'],
  ['prospect', 'prospect (Prospective)'], ['lead', 'lead (Prospective)'], ['play', 'play (Prospective)'],
];
const ECONOMIC = [['viable', 'viable'], ['not-viable', 'not-viable'], ['undetermined', 'undetermined']];
const RESERVES_STATUS = [['developed-producing', 'developed-producing'], ['developed-non-producing', 'developed-non-producing'], ['undeveloped', 'undeveloped']];
const DECLARATIONS = [['commercial-discovery', 'a commercial discovery (PIA 2021 s.78(8)(a))'], ['significant-crude-oil-discovery', 'a significant crude oil discovery (s.78(8)(b))'], ['significant-gas-discovery', 'a significant gas discovery (s.78(8)(b))'], ['no-interest', 'a discovery of no interest (s.78(8)(c))']];
const CRITERIA = [
  ['developmentPlan', '(1) a technically mature, feasible development plan'],
  ['financialAppropriations', '(2) financial appropriations in place or highly likely'],
  ['market', '(5) a reasonable expectation of a market'],
  ['facilities', '(6) production and transportation facilities'],
  ['approvals', '(7) approvals in place or forthcoming'],
  ['firmIntention', 'the firm intention to proceed'],
];

/**
 * Every input of a classification, each a visible control that writes the
 * stated input into the block. Which inputs the engine reads depends on the
 * facts (a Prospective project states chances and no commerciality); an input
 * the class does not read is refused by name if it is stated, and a missing one
 * the class needs is refused by name too.
 */
export const ClassifyControls = ({ box, viewKey }) => {
  const discovered = statedIn(box, viewKey, 'discovery') === 'discovered';
  const none = statedIn(box, viewKey, 'recoveryProject') === 'none';
  return (
    <>
      <FieldGrid>
        <StatedControl box={box} viewKey={viewKey} path="discovery" label="Discovery (stated)" options={DISCOVERY} />
        <StatedControl box={box} viewKey={viewKey} path="recoveryProject" label="Recovery project (stated)" options={RECOVERY} />
        <StatedControl box={box} viewKey={viewKey} path="subClass" label="Sub-class (stated)" options={SUB_CLASSES} />
        <StatedControl box={box} viewKey={viewKey} path="chances.geologicDiscoveryPct" label="Chance of geologic discovery, percent (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="chances.developmentPct" label="Chance of development, percent (stated)" />
      </FieldGrid>
      {discovered && !none && (
        <FieldGrid>
          <StatedControl box={box} viewKey={viewKey} path="economicStatus" label="Economic status (stated)" options={ECONOMIC} />
          {CRITERIA.map(([k, l]) => <StatedControl key={k} box={box} viewKey={viewKey} path={`commerciality.${k}`} label={`${l} (stated)`} options={BOOL} cast={castBool} />)}
          <StatedControl box={box} viewKey={viewKey} path="commerciality.timeFrame.startWithinYears" label="Development starts within, years (stated)" />
          <StatedControl box={box} viewKey={viewKey} path="commerciality.timeFrame.longerJustified" label="A longer time-frame justified (stated)" options={BOOL} cast={castBool} />
          <StatedControl box={box} viewKey={viewKey} path="projectStatus.finalInvestmentDecision" label="Final investment decision taken (stated, Reserves)" options={BOOL} cast={castBool} />
          <StatedControl box={box} viewKey={viewKey} path="projectStatus.onProduction" label="On production (stated, Reserves)" options={BOOL} cast={castBool} />
          <StatedControl box={box} viewKey={viewKey} path="reservesStatus" label="Reserves status (stated, Reserves)" options={RESERVES_STATUS} />
        </FieldGrid>
      )}
      {discovered && (
        <FieldGrid>
          <StatedControl box={box} viewKey={viewKey} path="nigeria.declaration" label="Nigerian declaration (optional)" options={DECLARATIONS} />
          <StatedControl box={box} viewKey={viewKey} path="nigeria.yearsSinceDeclaration" label="Years since the declaration (optional)" />
        </FieldGrid>
      )}
      <MissingStated box={box} viewKey={viewKey} required={[['discovery', 'discovery'], ['recoveryProject', 'recoveryProject']]} />
    </>
  );
};

/** What the engine returns for a classification. */
export const ClassifyResult = ({ r }) => (
  <>
    <TileGrid>
      <Tile label="Class" value={r.class} />
      <Tile label="Sub-class" value={r.subClass || 'none'} />
      <Tile label="Economic status" value={r.economicStatus || 'none'} />
      <Tile label="Reserves status" value={r.reservesStatus || 'none'} />
      <Tile label="Chance of commerciality, percent" value={six(r.chanceOfCommercialityPct)} />
    </TileGrid>
    {r.criteria.length > 0 && (
      <Tbl head={['criterion', 'the engine\'s wording', 'section', 'met']} rows={r.criteria.map((c) => [c.criterion, c.what, c.section, c.met ? 'met' : 'not met'])} />
    )}
    <Tbl head={['decision', 'section', 'outcome']} rows={r.decisions.map((d) => [d.rule, d.section, d.outcome])} />
    {r.labels && <Tbl head={['case', 'cumulative label']} rows={Object.entries(r.labels.cumulative).map(([k, v]) => [k, v])} />}
    {r.unmet.length > 0 && <EngineNote text={`held back by: ${list(r.unmet)}`} />}
    {r.nigeria && r.nigeria.notes.map((n) => <EngineNote key={n} text={n} />)}
    <Reasons items={r.reasons} />
    <Source text={[r.basis.classification, r.basis.categories, r.basis.nigeria].filter(Boolean).join('; ')} />
  </>
);

export const CLASSIFY_STARTS = [
  ['classEkn1', 'EKN-1 Ekene Main waterflood'], ['classEkn2', 'EKN-2 Ekene infill wells'], ['classEkn3', 'EKN-3 Ekene East gas'], ['classEkn4', 'EKN-4 Ekene North appraisal'],
  ['classEkn5', 'EKN-5 Ekene West tight sand'], ['classEkn6', 'EKN-6 Ekene Deep prospect'], ['classEkn7', 'EKN-7 Ekene Shallow lead'], ['classEkn8', 'EKN-8 Ekene Main residual oil'],
  ['classJustified', 'Justified for development'], ['classTimeFrame5', 'Development starting at five years'], ['classTimeFrame6', 'Development starting at six years'],
  ['classTechOnly', 'Technology under development alone'], ['classPlay', 'A play'], ['classPgZero', 'A chance of geologic discovery of 0'],
  ['classRetention10', 'A significant discovery ten years on'], ['classRetention11', 'A significant discovery eleven years on'], ['classNoInterest', 'A discovery of no interest'],
];

export const ClassifyMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = CLASSIFY_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('classify', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('classify', box.parsed.value, blockKey);
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <ClassifyControls box={box} viewKey={blockKey} />
      <Box box={box} label="classify inputs (JSON: name, discovery, recoveryProject, subClass, commerciality, economicStatus, projectStatus, reservesStatus, chances, nigeria), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <ClassifyResult r={r} />}
    </>
  );
};

const CLASSES = [['reserves', 'Reserves'], ['contingent', 'Contingent Resources'], ['prospective', 'Prospective Resources']];
const METHODS = [['cumulative', 'cumulative: low, best and high'], ['incremental', 'incremental: first, second and third']];

/** Every input of a category set, each a visible control. */
export const CategorizeControls = ({ box, viewKey }) => {
  const method = statedIn(box, viewKey, 'method');
  const keys = method === 'incremental' ? [['first', 'first increment'], ['second', 'second increment'], ['third', 'third increment']]
    : [['low', 'low estimate'], ['best', 'best estimate'], ['high', 'high estimate']];
  return (
    <>
      <FieldGrid>
        <StatedControl box={box} viewKey={viewKey} path="resourceClass" label="Class (stated)" options={CLASSES} />
        <RewriteControl box={box} viewKey={viewKey} path="method" label="Method (stated)" options={METHODS}
          current={(b) => statedIn(b, viewKey, 'method')}
          rewrite={(v) => {
            // the method and the estimates are written together, so no key of the old form stays behind
            const a = setStated(box.text, viewKey, 'method', v);
            if (a.error) return;
            const b = v === undefined ? a : setStated(a.text, viewKey, 'estimates', estimatesFor(v, statedIn(box, viewKey, 'estimates')));
            if (!b.error) box.setText(b.text);
          }} />
        <WordStated box={box} viewKey={viewKey} path="unit" label="Unit (stated)" />
        {keys.map(([k, l]) => <StatedControl key={k} box={box} viewKey={viewKey} path={`estimates.${k}`} label={`${l} (stated)`} />)}
      </FieldGrid>
      <MissingStated box={box} viewKey={viewKey} required={[['resourceClass', 'resourceClass'], ['method', 'method'], ['unit', 'unit']]} />
    </>
  );
};

/** What the engine returns for a category set. */
export const CategorizeResult = ({ r }) => (
  <>
    <Tbl head={['label', 'case', 'probability label', 'value']} rows={r.cumulative.map((x) => [x.label, x.case, x.probability, six(x.value)])} />
    {r.incremental && <Tbl head={['increment', 'value']} rows={r.incremental.map((x) => [x.label, six(x.value)])} />}
    <TileGrid>
      <Tile label="Class" value={r.resourceClass} />
      <Tile label="Method" value={r.method} />
      <Tile label="Unit" value={r.unit} />
      <Tile label="One value for the range" value={String(r.singleValue)} />
    </TileGrid>
    <EngineNote text={r.exceedance} />
    <Reasons items={r.reasons} />
    <Source text={`${r.basis.categories}; ${r.basis.labels}`} />
  </>
);

export const CATEGORIZE_STARTS = [
  ['catReservesCumulative', 'Ekene Main Reserves, stated cumulatively'], ['catFaq33', 'Incremental example (FAQ 3.3)'],
  ['catContingentIncremental', 'Ekene North, stated incrementally'], ['catContingentCumulative', 'Ekene North, stated cumulatively'],
  ['catProspective', 'Prospective Resources'], ['catSingleValue', 'One value for the range'], ['catZeroIncrement', 'A zero increment'],
];

export const CategorizeMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = CATEGORIZE_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('categorize', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('categorize', box.parsed.value, blockKey);
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <CategorizeControls box={box} viewKey={blockKey} />
      <Box box={box} label="categorize inputs (JSON: resourceClass, method, estimates, unit), or a whole case file" rows={10} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <CategorizeResult r={r} />}
    </>
  );
};

export const MODES = [
  ['classify', 'The class, the sub-class and the chance of commerciality'],
  ['categorize', 'The categories of a set of estimates'],
];

const ClassificationCalculator = ({ initialMode = 'classify', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Classification calculator"
      subtitle="The resources class of a project from its stated facts, its chance of commerciality, and the categories of its low, best and high estimates with the P90, P50 and P10 labels."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'classify' && <ClassifyMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
        {mode === 'categorize' && <CategorizeMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Ekene field is synthetic; paste your own inputs, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default ClassificationCalculator;
