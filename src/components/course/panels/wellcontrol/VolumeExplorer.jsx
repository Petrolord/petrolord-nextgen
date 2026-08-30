import React, { useMemo, useState } from 'react';
import { WELLS, volumes, oracleCheck, IWCF, iwcfCheck } from './wellcontrolLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Volume explorer: the numbers every well control calculation starts from, and
// the hand example a reader can check without a computer.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const MODES = [
  { value: 'volumes', label: 'Volumes and strokes' },
  { value: 'rows', label: 'The span walk' },
  { value: 'hand', label: 'The hand example' },
];
const WELL_OPTIONS = WELLS.map((w) => ({ value: w.id, label: w.id }));

const Volumes = () => {
  const [id, setId] = useState('horizontal');
  const [pump, setPump] = useState('0.012');
  const v = useMemo(() => volumes(id), [id]);
  const q = Number(pump);
  const ok = Number.isFinite(q) && q > 0;
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Well" value={id} onChange={setId} options={WELL_OPTIONS} />
        <NumField label="Pump output (m3/stroke)" value={pump} onChange={setPump} />
      </div>
      <TileGrid>
        <Tile label="String volume" value={fmt(v.stringVolumeM3, 8)} unit="m3" />
        <Tile label="Annulus volume" value={fmt(v.annulusVolumeM3, 8)} unit="m3" />
        <Tile label="Total circulating" value={fmt(v.totalCirculatingM3, 8)} unit="m3" />
        <Tile label="Strokes to the bit" value={ok ? fmt(v.stringVolumeM3 / q, 6) : '-'} />
        <Tile label="Bottoms up" value={ok ? fmt(v.annulusVolumeM3 / q, 6) : '-'} />
        <Tile label="Full cycle" value={ok ? fmt(v.totalCirculatingM3 / q, 6) : '-'} />
        <Tile label="Bit measured depth" value={fmt(v.bitMd, 1)} unit="m" />
        <Tile label="TVD at the bit" value={fmt(v.tvdBhM, 6)} unit="m" />
        <Tile label="TVD at the shoe" value={fmt(v.tvdShoeM, 6)} unit="m" />
        <Tile label="Annulus capacity at the bit" value={fmt(v.capBitM2, 9)} unit="m2" />
        <Tile label="Annulus capacity at the shoe" value={fmt(v.capShoeM2, 9)} unit="m2" />
        <Tile label="Shoe measured depth" value={fmt(v.shoeMd, 1)} unit="m" />
      </TileGrid>
      <Note>
        Everything else in this course is built on these twelve numbers. The two capacities are the
        same on both wells, because the casing and the drill pipe are shared, and the two TVDs are
        not, because the surveys are not. Read the gap between the bit TVD and the shoe TVD: on the
        horizontal well it is tens of metres, which is what makes its kick tolerance so different.
      </Note>
    </>
  );
};

const Rows = () => {
  const [id, setId] = useState('horizontal');
  const v = useMemo(() => volumes(id), [id]);
  return (
    <>
      <SelectField label="Well" value={id} onChange={setId} options={WELL_OPTIONS} />
      <div className="mt-3 rounded border border-gray-700 overflow-x-auto max-h-72">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400 sticky top-0">
            <tr>
              <th className="text-left p-2">Side</th>
              <th className="text-right p-2">From (m)</th>
              <th className="text-right p-2">To (m)</th>
              <th className="text-right p-2">Capacity (m2)</th>
              <th className="text-right p-2">Volume (m3)</th>
            </tr>
          </thead>
          <tbody>
            {v.stringRows.map((r) => (
              <tr key={`s${r.fromMd}`} className="border-t border-gray-800">
                <td className="p-2 text-white">string</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.fromMd, 1)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.toMd, 1)}</td>
                <td className="p-2 text-right text-gray-400">{fmt(r.capM2, 9)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.volM3, 6)}</td>
              </tr>
            ))}
            {v.annulusRows.map((r) => (
              <tr key={`a${r.fromMd}`} className="border-t border-gray-800">
                <td className="p-2 text-[#BFFF00]">annulus</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.fromMd, 1)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.toMd, 1)}</td>
                <td className="p-2 text-right text-gray-400">{fmt(r.capM2, 9)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.volM3, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Note>
        The volumes are a walk down the string and back up the annulus, one span at a time. The
        capacity of a span is its area, and its volume is that area times its length. Nothing here
        is a correlation or a fit: it is arithmetic on the string description and the hole geometry,
        and it is the only part of this course that is exact.
      </Note>
    </>
  );
};

const Hand = () => {
  const r = useMemo(() => iwcfCheck(), []);
  const check = useMemo(() => oracleCheck(), []);
  const i = IWCF.inputs;
  return (
    <>
      <div className="rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400"><tr><th className="text-left p-2">Input</th><th className="text-right p-2">Value</th></tr></thead>
          <tbody>
            {Object.entries(i).map(([k, val]) => (
              <tr key={k} className="border-t border-gray-800">
                <td className="p-2 text-white">{k}</td>
                <td className="p-2 text-right text-gray-200">{fmt(val, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TileGrid>
        <Tile label="Strokes to the bit" value={fmt(i.stringVolumeM3 / i.pumpOutputM3PerStroke, 0)} />
        <Tile label="Bottoms up" value={fmt(i.annulusVolumeM3 / i.pumpOutputM3PerStroke, 0)} />
        <Tile label="Kill mud weight" value={fmt(r.killSheet.killMudDensityKgM3, 6)} unit="kg/m3" />
        <Tile label="Initial circulating pressure" value={fmt(r.killSheet.icpPa / 1e6, 4)} unit="MPa" />
        <Tile label="Final circulating pressure" value={fmt(r.killSheet.fcpPa / 1e6, 4)} unit="MPa" />
        <Tile label="Influx height" value={fmt(r.killSheet.influx.heightM, 3)} unit="m" />
        <Tile label="Influx density" value={fmt(r.killSheet.influx.densityKgM3, 6)} unit="kg/m3" />
        <Tile label="Influx kind" value={r.killSheet.influx.kind} />
        <Tile label="MAASP" value={fmt(r.kickTolerance.maaspPa / 1e6, 6)} unit="MPa" />
      </TileGrid>
      <Note>
        This case was built by hand with round numbers so that its answers have closed forms.
        4000 strokes to the bit and 12000 bottoms up are exact divisions. The influx is exactly
        200 m tall, because 4 m3 of pit gain divided by 0.02 m2 of annulus capacity is 200. And
        MAASP is the fracture gradient less the mud weight, times gravity, times 2000 m of shoe TVD.
        The engine reproduces every published value in this course to a worst relative error of
        {' '}{check.worstRel.toExponential(2)} over {check.checked} checks.
      </Note>
    </>
  );
};

const VolumeExplorer = () => {
  const [mode, setMode] = useState('volumes');
  return (
    <PanelShell
      title="Volume explorer"
      subtitle="The twelve numbers every well control calculation starts from, and the hand example that checks them"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'volumes' && <Volumes />}
        {mode === 'rows' && <Rows />}
        {mode === 'hand' && <Hand />}
      </div>
    </PanelShell>
  );
};

export default VolumeExplorer;
