import React, { useState } from 'react';
import { STARTS, viewRun } from './marineLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, Refusal, EngineNote, Source, StatedControl, MissingStated, statedIn, WordStated, BlockSelector,
} from './panelBits';
import { Box, Starts, useViewBox } from './VoyageCalculator';

// The deck calculator (Professional): stated deck cargo items packed onto a
// stated number of voyages by a stated rule, first-fit decreasing by area
// (ties heavier first, then item id, then unit number) or first fit in the
// booked order, against the usable deck area and the deck load, with every
// overflow unit named with its reason and the lower bound on voyages. An area
// bound: nothing is stacked and no footprint is checked against the deck's
// shape. Every figure is a return value of the vendored engine
// (engines/supplychain/marineLogistics.js) through marineLab.

const RULES = [['first-fit-decreasing-area', 'first-fit decreasing by area (first-fit-decreasing-area)'], ['first-fit', 'first fit in the booked order (first-fit)']];

/** Every input of a deck plan, each a visible control; the item lines one by one. */
export const DeckControls = ({ box, viewKey }) => {
  const items = statedIn(box, viewKey, 'items');
  const its = Array.isArray(items) ? items : [];
  return (
    <>
      <FieldGrid>
        <WordStated box={box} viewKey={viewKey} path="deck.name" label="Deck name (optional)" />
        <StatedControl box={box} viewKey={viewKey} path="deck.areaM2" label="Deck area, m2 (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="deck.usableFraction" label="Usable deck fraction (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="deck.loadT" label="Deck load, t (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="voyages" label="Voyages (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="rule" label="Packing rule (stated)" options={RULES} />
      </FieldGrid>
      {its.map((x, i) => {
        const who = `item ${x && x.id !== undefined ? x.id : i + 1}`;
        return (
          <div key={i} className="mt-2">
            <FieldGrid>
              <StatedControl box={box} viewKey={viewKey} path={`items.${i}.lengthM`} label={`${who}: length, m (stated)`} />
              <StatedControl box={box} viewKey={viewKey} path={`items.${i}.widthM`} label={`${who}: width, m (stated)`} />
              <StatedControl box={box} viewKey={viewKey} path={`items.${i}.weightT`} label={`${who}: weight, t (stated)`} />
              <StatedControl box={box} viewKey={viewKey} path={`items.${i}.quantity`} label={`${who}: quantity (stated)`} />
            </FieldGrid>
          </div>
        );
      })}
      <MissingStated box={box} viewKey={viewKey} required={[['deck', 'the deck'], ['items', 'the items'], ['voyages', 'voyages'], ['rule', 'rule']]} />
      <Note>The item lines are listed in the box below, in the order booked; each input they carry has its control above.</Note>
    </>
  );
};

/** What the engine returns for a deck plan. */
export const DeckPlanResult = ({ r }) => (
  <>
    <Tbl head={['voyage', 'units', 'area, m2', 'weight, t', 'area utilisation', 'load utilisation']}
      rows={r.voyages.map((v) => [String(v.voyage), String(v.units.length), six(v.areaM2), six(v.weightT), six(v.areaUtilisation), six(v.loadUtilisation)])} />
    <Tbl head={['voyage', 'units carried, in the order packed']} rows={r.voyages.filter((v) => v.units.length).map((v) => [String(v.voyage), v.units.join(', ')])} />
    {r.overflow.length > 0 && (
      <Tbl head={['overflow unit', 'footprint, m2', 'weight, t', 'the engine\'s reason, verbatim']} rows={r.overflow.map((o) => [o.unit, six(o.areaM2), six(o.weightT), o.reason])} />
    )}
    <TileGrid>
      <Tile label="Usable area, m2" value={six(r.usableAreaM2)} />
      <Tile label="Voyages used" value={String(r.voyagesUsed)} />
      <Tile label="Lower bound on voyages" value={String(r.lowerBound)} />
      <Tile label="Overflow units" value={String(r.overflow.length)} />
      <Tile label="Total area, m2" value={six(r.totalAreaM2)} />
      <Tile label="Total weight, t" value={six(r.totalWeightT)} />
    </TileGrid>
    <EngineNote text={`packing order: ${r.packingOrder.join(', ')}`} />
    <EngineNote text={r.basis.rule} />
    <Source text={r.basis.source} />
  </>
);

export const DECK_STARTS = [
  ['deckEkeneFfd', 'Ekene deck cargo, one voyage, first-fit decreasing'], ['deckEkeneFirstFit', 'Ekene deck cargo, one voyage, first fit'],
  ['deckEkeneTwo', 'Ekene deck cargo, two voyages'], ['deckLightLoad', 'Ekene deck cargo on a light deck'], ['deckCgj60', 'The capacity 60 example'],
  ['deckCgj61', 'The capacity 61 example'], ['deckCgjFirstFit', 'The capacity 60 list by first fit'], ['deckHuangLu', 'Huang and Lu at capacity 75'],
  ['deckDosa', 'The tight worst case'], ['deckTies', 'Equal footprints'], ['deckExactFit', 'An exact fit'], ['deckTooLarge', 'A unit larger than the deck'],
  ['deckTooHeavy', 'A unit heavier than the deck load'],
];

export const DeckPlanMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = DECK_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('deckPlan', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('deckPlan', box.parsed.value, blockKey);
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <DeckControls box={box} viewKey={blockKey} />
      <Box box={box} label="deckPlan inputs (JSON: deck, items, voyages, rule), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <DeckPlanResult r={r} />}
    </>
  );
};

export const MODES = [['deckPlan', 'The deck plan']];

const DeckCalculator = ({ initialMode = 'deckPlan', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Deck calculator"
      subtitle="Stated deck cargo packed onto a stated number of voyages by a stated rule, against the usable deck area and the deck load, with every overflow unit named."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'deckPlan' && <DeckPlanMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
      </div>
      <Note>This is the course&apos;s own calculator, and the Suite&apos;s Marine Logistics Planner runs the same engine: every number here is a return value of the vendored engine. The plan is an area bound: nothing is stacked and no footprint is checked against the deck&apos;s shape.</Note>
    </PanelShell>
  );
};

export default DeckCalculator;
