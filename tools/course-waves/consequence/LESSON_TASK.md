# H4 Consequence Modelling: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task file
is quoted from it. The engine's FINDINGS record, the oracle and the engine's
source comments are PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares the precisions: mass rates, distances, tilts, concentrations, heat
fluxes, surface emissive powers, overpressures, probits, thermal doses, toxic
loads and probabilities to SIX decimals; view factors, hole areas, mass transfer
coefficients and evaporation fluxes to TWELVE; stated inputs as typed.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. It self-checks and reports zero
problems. Do not add, rename or reorder a lesson.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, markdown table rows and `{{panel` lines are excluded, and headings are
counted. `python3 lengths.py --tier <tier>` reads one tier.

Keep the H1 heading that `scaffold.py` writes (the lesson title exactly) and the
panel line where `structure.py` says one goes. An opening paragraph under it,
then short `##` sections ending in `## Exercise`: four or five `##` headings, the
Exercise included. A small table where it helps, numbers first, and an
`## Exercise` that asks the learner to DO something with a number the lesson
printed or with the panel, never to recall one.

## THE TIER LINE

Every tier's lessons may use a lower tier's arithmetic. **No tier's lessons may
use a higher tier's.** An Associate lesson never computes a heat flux or a
probit; a Professional lesson never computes an overpressure or a probit. The
kit's `leakage.mjs` judges a reach by which digest section owns the figure:
sections 1 to 13 are Associate, 14 to 22 Professional, 23 to 33 Expert.

## THE REFUSALS, BY NAME

Digest section 3 tables 37 refusals across 24 functions. **Quote the engine's
message in a blockquote.** A paraphrase teaches a message the learner will never
see. The ones each tier must teach:

* Associate m01 l05: a discharge coefficient above one, an ullage below ambient
  and no head, no bund area and no thickness, calm air for the plume, a class the
  table does not carry.
* Professional m06 l03: a boiling point below ambient for Burgess, no air
  viscosity for the tilt, a flame over the target, a path too short for Bagster,
  a distance search with no fixed transmissivity.
* Expert m03 l01: the TNT energy typed in kJ/kg, a scaled distance beyond the
  range, a probability of one, ppm on a mg/m3 preset with no molar mass.

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **The head, section 5.** With the ullage at ambient the AMENAM line's driving
   pressure is the head alone, and the jet velocity is Torricelli's 10.848032 m/s.
2. **Choked, section 6.** Once choked the methane line's mass rate grows by
   40.000000 from 250000 to 10000000 Pa, the same as the pressure ratio.
3. **The class, section 11.** At 500 m the stable class F gives 1562.900663 mg/m3,
   6.519887 times class D.
4. **Two roots, section 13.** From a 25 m stack the concentration peaks at
   153.887548 mg/m3 at 347.557177 m, and 100 mg/m3 is met at 221.924194 and
   656.636313 m.
5. **Three powers, section 17.** One heptane fire carries a surface emissive power
   of 30886.154395, 180128.456236 or 52025.691247 W/m2 depending on the method.
6. **Two sources, section 29.** Chlorine at 400 ppm for 10 minutes reads
   0.441437 under Lees and 0.309443 under the Purple Book.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices, in the digest's own words:
effects and no frequency; units in every name; choked at the critical ratio; no
spreading model; ground reflection; the solid flame of radius D/2; the overhang
refusal; a stated transmissivity for every graded heat flux; Kinney and Graham
over a judged range; presets named by source; an approximate inverse.

## THE SINGLE ROUTE QUANTITIES

Mackay and Matsugu, Bagster, Burgess, the TNT equivalence and Thomas in still air
are taught, and every lesson that teaches one says it carries no graded answer
and why (section 32).

## THE VOCABULARY AND THE SEAMS

Binding. Digest section 34, and the seams of section 22. "Flux" always
qualified; "beta" only inside "k beta"; "dose" always qualified; never
"severity" or "likelihood"; "radiation" always "heat radiation" or "thermal
radiation". A point source, a setback, individual risk, the potential loss of
life, the F-N curve, a risk matrix and emissions may be NAMED only in the seam
lessons `gate_vocabulary.py` lists, and the Facilities courses' heat radiation level figures never appear.

## NO HISTORY

This engine has none. A sentence that begins "the engine used to" is a defect.
The errata are about published SOURCES, and a lesson says so.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included.

## WHAT GATES YOUR WORK

`gate_copy_rule.py`; `gate_vocabulary.py` for the vocabulary and the seams; the
kit's `leakage.mjs` for graded answers and cross-tier reaches; the kit's
`numsweep.mjs` and `litsweep.py` for literals that resolve against nothing;
`gate_capstone_leak.mjs` WITH ITS LESSONS DIRECTION for any capstone facility,
distinctive input or answer; `lengths.py` for the band; and `gate_claims.mjs`
for every number in every brief. Read the counts rather than the exit code.
