// SECTION 60 OF THE QI TEACHING DIGEST: the vocabulary the course legislates.
import { section } from './qi_digest_kit.mjs';

export function sectionsV() {
  const rules = [
    ['AI', 'acoustic impedance, Vp x density, in kg/(m2 s); the course writes the word impedance beside it the first time a lesson uses it, and uses AI for nothing else'],
    ['SI', 'shear impedance, Vs x density'],
    ['net sand', 'a sample of the reservoir with Vsh at or below the stated cut-off'],
    ['oil leg, water leg', 'net sand above, and at or below, the stated oil-water contact'],
    ['cap rock', 'the stated thickness of log above the top of the reservoir, read as one layer by its means'],
    ['the -6 dB band', 'the frequencies between the two -6 dB edges of the mean spectrum of stated traces with a stated taper; its width is the -6 dB bandwidth'],
    ['centroid', 'the power-weighted mean frequency of a spectrum'],
    ['signal to noise', 'a POWER ratio, from trace coherency, with its decibel form 10 log10 of the ratio'],
    ['footprint', 'a periodic stripe on a slice of RMS amplitude, called one only by a stated rule'],
    ['the local shear trend', 'a least squares fit of measured Vs on Vp on stated samples, with its prediction interval at a stated level'],
    ['substitution', 'Gassmann through the dry rock from one pore fluid to another, at stated conditions, mineral and porosity'],
    ['the wet trend', 'the fluid line through the origin fitted to the intercept and gradient of the brine-substituted block boundaries; the published line is the Castagna, Swan and Foster slope, and a lesson names which line it means'],
    ['distance', 'the signed perpendicular distance of an (A, B) point from a stated line; negative is the hydrocarbon side'],
    ['class', 'the Rutherford and Williams class from A and B, with class IV, at the stated 0.02 band; a class is never graded'],
    ['feasibility', 'the Associate question: can this seismic, on this data, see this fluid, written as a verdict that states its numbers and its choices'],
  ];
  const body = `THE RULE. Each term below means one thing everywhere a learner reads, and a lesson that uses it in another sense is a defect.

${rules.map(([t, d]) => `- **${t}**: ${d}.`).join('\n')}`;
  return [section(60, 'Vocabulary this course legislates before a word is written', 'Associate m01 and Professional m01 and Expert m01', body)];
}
