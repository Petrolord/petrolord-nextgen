# FC1. Separation & Slug Catching. The writing brief.

The first Facilities course. Module `facilities`, `path_order` 39, slug
`separation`, no prerequisite. Engines, as repaired before this course in
FC1-0 (engines #188, owner decisions 2026-09-15):
`packages/engines/engines/facilities/separatorSizing.js` (the Suite's
Separator & Slug Catcher Designer: the DAK z factor inside its range, K with
its published derating, Souders-Brown settling, vertical and horizontal
two-phase sizing, three-phase sizing with an exact oil-water interface and
two droplet verdicts, and the L/D family with feasibility, reasons and a
preferred row) and
`packages/engines/engines/facilities/spacing.js` (the Facility Layout
Mapper's missing half: the spacing table, haversine distances, computed
flare and pool fire setbacks, and the layout check with its completeness
reading). Goldens:
`packages/engines/test-data/facilities/goldens/separator_cases.json` (42
cases) and `spacing_cases.json` (16). Findings:
`packages/engines/tools/validation/facilities/FINDINGS-separation.md`.
Teaching digest: `/root/fc-wip-separation/digest.txt`, built by
`build_digest.sh` from `fc1_dump.mjs` and never hand-edited. Teaching lab
(to be built): `src/components/course/panels/separation/separationLab.js`.

## The one-sentence thesis

A separator is sized by asking which of several competing requirements binds
first, and the discipline of separation is knowing which requirement each
dimension came from, which verdict the vessel has to survive, and which of
the numbers on the page is a calculation rather than a table somebody copied.

## What each tier OWNS

- **Associate, THE STREAM AND THE SIMPLE VESSEL.** What a sizing engine does
  and what it refuses to guess; the gas at separator conditions (gauge to
  absolute, the pseudo-criticals, the z factor and the range it is honest
  in, the density, and the rate the vessel actually sees); the K value, its
  six published rows, its pressure derating and its floor; settling, the two
  liquid densities and the mixture the gas load sees; and the vertical
  vessel, whose diameter comes from the gas and whose height comes from the
  retention volume plus an allowance.
- **Professional, THE HORIZONTAL VESSEL AND THE PLOT.** A circle cut by a
  level, and the areas, the gas height and the chord that follow; the two
  length requirements and which one controls; gas capacity in the gas space
  and what the gas length can never exceed; slug catchers as a vessel and as
  a harp of fingers; and distances on a site, where a table figure is a
  table and a flare or pool fire setback is computed from its own duty.
- **Expert, THE THREE-PHASE VESSEL, THE FAMILY AND THE JUDGEMENT.** The
  oil-water split the retentions imply and the interface at its exact
  height; Stokes between two liquids and the two verdicts a sized vessel has
  to survive; the L/D family, its reasons, its preferred row and its three
  statuses; judging a layout, where complete and pass answer different
  questions and two rankings disagree; and the four things this method does
  not know.

## The results the course is built on (every one run against the engine; digest section in brackets)

1. **Conditions decide everything downstream** [2]. ABANA at 600.000000
   psig and 95.000000 degF with a gravity of 0.680000 gives Ppr 0.922896,
   Tpr 1.488478, z 0.908065 and a gas density of 2.239712 lb/ft3. The
   retired app used 0.850000 for every gas at every condition.
2. **A rate is not a rate until it is at conditions** [2]. ABANA-2 carries
   110.000000 MMscfd, which is 1273.148148 standard ft3/s and 29.490437
   ft3/s in the vessel.
3. **K is derated, and the derating is a rule of thumb** [3]. The vertical
   mesh pad falls from 0.350000 to 0.300000 at 600.000000 psig, and at
   3000.000000 psig the rule gives -0.110000 and the floor holds K at
   0.120000. HELD FOR LITERATURE.
4. **The liquid density is weighted by rate** [4]. On AGBAMI the weighted
   mixture is 59.632353 lb/ft3 where the average of the two would be
   60.613628.
5. **A vertical vessel trades height for diameter** [5]. ABANA-1 needs
   2.052551 ft of diameter for its gas; at 2.000000 ft the margin is
   0.949450 and the vessel fails, at 3.000000 ft it is 10.964382 ft tall
   with a margin of 2.136263.
6. **Half full is an assumption** [7, 8]. ABANA-2 at 8.000000 ft and level
   0.500000 needs 23.270539 ft of length; drop the level to 0.300000 and the
   same duty needs 46.113917 ft.
7. **Gas capacity is a verdict, not a comment** [9]. Across the ABANA-2
   family the margin runs 0.651911, 0.938751, 1.277745, 1.668891, 2.112190,
   2.607642, and the first two vessels cannot carry the gas at all.
8. **A slug catcher holds more than the slug** [10]. A 350.000000 bbl slug
   with 12000.000000 bpd still arriving over 5.000000 minutes is 391.666667
   bbl of working volume, a drum 10.527155 ft across and 42.108619 ft long,
   or 5.000000 fingers of 225.184350 ft.
9. **A setback is computed and a table is copied** [11]. The ERHA flare
   releases 828000.0000 kW and needs 64.6458 m. The bund of 18.000000 m
   needs 59.5294 m from the pool CENTRE and 50.5294 m from the pool edge,
   and the difference of 9.0000 m is the defect that failed open.
10. **The interface is not the chord** [13]. AGBAMI holds 0.516129 of its
    liquid area as water, which puts the interface at 3.049149 ft. The
    retired chord rule gave 2.026834 ft and the carryunder check was reading
    a layer that was not there.
11. **A droplet specification decides feasibility** [14, 15]. At
    500.000000 micron the water drop crosses the oil layer in 111.4796 s
    against 300.0000 s of residence. At 150.000000 micron it needs
    1238.6620 s, waterCarryover is true, and every vessel in the family
    becomes infeasible.
12. **The preferred vessel is the smallest FEASIBLE one in band** [15].
    ABANA-2 prefers 7.000000 ft. Widen the band from 3 to 5 out to 3 to 7
    and the 6.000000 ft row comes in band and stays infeasible, so the
    answer does not move. A rule that took the first row in band would have
    moved.
13. **Judging a layout is four answers, not one** [12, 16]. ERHA reports 69
    checks, 21 pairs with no requirement, 12 unknown type pairs, 2 skipped
    items, complete false and pass false, with worstAbsolute 43.8223 m and
    worstRelative 0.597753 naming different pairs.
14. **The published cases are synthetic** [17]. The oracle re-derives Stokes
    in SI and sits 1.004184 times the engine's field constant on every case,
    in the same direction each time.

## Hard rules for every lesson

- 420 to 560 prose words, ranked by `est_minutes` (`lengths.py`). Five short
  sections, a small table, numbers first. No sentence announcing what the
  reader is about to read.
- Every number is copied from the digest at the digest's precision, or is
  arithmetic on digest numbers stated in the lesson. No number from memory,
  no number from a golden's description.
- Quote a golden's NUMBERS, never a golden's description text.
- Owner copy rule: no em dashes, no en dashes, no "X, not Y" contrastives
  built with a dash.
- A lesson title carries counts only, never a measurement.
- The panel line `{{panel:<id>}}` appears exactly as `structure.py` lists it.
- Vessel work prints to six decimals; metres, kilowatts and seconds to four;
  counts are whole numbers. "psig" and "psia" are never mixed.
- Nothing in this course is a percentile, so no P-label belongs anywhere.
- Teach the engine as repaired, and the pre-repair behaviour as history
  ("before FC1-0 the sweep preferred"). Four items are HELD FOR LITERATURE
  and are taught as limits and never as answers: the K pressure derating and
  its floor, the horizontal use of Souders-Brown as the droplet settling
  velocity, the API 521 radiation labels, and the spacing table figures.
- Three teaching models share nothing: ABANA-1 is a vertical test separator,
  ABANA-2 the horizontal production separator on the same stream, AGBAMI a
  three-phase separator, and the ERHA flow station is a plot. The published
  golden cases are other vessels entirely. Never mix their numbers.

## LEAKAGE BAN

The capstone runs its own streams and its own site, written in
`fc1_fields_capstone.mjs` and `fields.json`. Its separators are called
EJULEBE, its flow station ODEAMA and its yard ADANGA. Lesson writers never
read those files, never name EJULEBE, ODEAMA or ADANGA, never guess a
capstone value, and never print a number that is not in the digest.

## Section map of the digest (the headers read "SECTION n:")

| section | content | owned by |
| --- | --- | --- |
| 1 | what the engine sizes, and every refusal | Associate m01 |
| 2 | the gas at conditions, the DAK range | Associate m02 |
| 3 | the K table, the derating, the floor | Associate m03 |
| 4 | densities, the mixture, Souders-Brown | Associate m04 |
| 5 | the vertical vessel across its diameters | Associate m05 |
| 6 | one chain end to end | Associate m06 |
| 7 | the cross-section at a level, the chord | Professional m01 |
| 8 | the two length requirements | Professional m02 |
| 9 | gas capacity and what gas length cannot exceed | Professional m03 |
| 10 | slug catchers, vessel and harp | Professional m04 |
| 11 | the table, distances, flare and pool setbacks | Professional m05 |
| 12 | a station judged, and its nearest neighbours | Professional m06 |
| 13 | the three-phase split and the interface | Expert m01 |
| 14 | droplets, residence and the two verdicts | Expert m02 |
| 15 | the family, its reasons and its three statuses | Expert m03 |
| 16 | the layout reading and the two rankings | Expert m04 |
| 17 | the four held items and the DAK range | Expert m05 |
| 18 | a stream and a site together | Expert m06 |
