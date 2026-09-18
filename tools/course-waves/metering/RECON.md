# FC8 `metering` RECON: Metering, Control Valves & Storage

Subject: three engines, two goldens, two oracles, two jest suites and
three LIVE Suite studios.

    engines/facilities/metering.js
    engines/facilities/controlValve.js
    engines/facilities/storageTank.js
    test-data/facilities/goldens/tanksmetering_cases.json
    test-data/facilities/goldens/controlvalve_cases.json
    tools/validation/facilities/oracle_tanksmetering.py
    tools/validation/facilities/oracle_controlvalve.py
    __tests__/facilities.tanksmetering.test.js
    __tests__/facilities.controlvalve.test.js

    src/contexts/MeterStudioContext.jsx   + src/components/meterstudio/*
    src/contexts/ValveStudioContext.jsx   + src/components/valvestudio/*
    src/contexts/TankStudioContext.jsx    + src/components/tankstudio/*
    src/pages/apps/FlowMeteringDesigner.jsx
    src/pages/apps/ControlValveSizing.jsx
    src/pages/apps/StorageTankDesigner.jsx

Engines canonical `82ec6d4` (`origin/main` of `petrolord-engines`), branch
`fix/fc8-0-metering` in `/root/wt-fc80-engines`. Every figure below was
produced by running the engine, the oracle or the suite, never by reading
the source.

> RECON.md, FINDINGS.md AND THE ENGINE SOURCE ARE PROVENANCE. They are a
> repair brief, not teaching truth. No writer may quote this file, and no
> number in it may reach a lesson, a panel or a bank question. The
> teaching digest is built after FC8-0 lands, from the repaired engines.

A `node_modules` symlink was created in the engines worktree to run jest
(`ln -s /root/petrolord-engines/node_modules`). It is UNTRACKED and was
left in place; `git status --porcelain` shows nothing else.


## 1. Why this is one course

Three engines, but one argument. A meter run, a control valve and a tank
are the three places on a facility where a number that looks like a
measurement is really a design judgement with a standard behind it, and
where the interesting behaviour lives at a boundary the ordinary equation
does not know about. The orifice equation is easy and its UNCERTAINTY is
the whole subject. The valve equation is easy and its CHOKING BOUNDARY is
the whole subject. The tank shell equation is easy and its VENTING is
what actually destroys tanks. Three engines, three boundaries, one habit
of mind. No engine imports any other.

Twenty-nine exports in all. Every returned value, by export:

### metering.js (9 exports)

| export | returns |
|---|---|
| `dischargeCoefficient` | `cd`, `beta`, `reynolds`, `l1`, `m2Prime`, `unusedM2`, or `error` |
| `expansibility` | a bare number or `NaN`, never an error |
| `orificeFlow` | `beta`, `cd`, `expansibility`, `reynolds`, `massLbHr`, `volumetricFt3Hr`, `dpPsi`, `warning` (three branches), or `error` |
| `sizeOrifice` | `beta`, `orificeIdIn`, plus every `orificeFlow` field spread in, or `error` (two branches), or BOTH |
| `permanentLoss` | `lossInH2O`, `lossFraction`, or `error` |
| `orificeUncertainty` | `totalUncertaintyPct`, `contributions[{name, sensitivity, uncertaintyPct, contributionPct, squared, shareOfVariancePct}]`, `dominant`, `note`, or `error` |
| `transmitterUncertaintyPct` | `uncertaintyPctOfReading`, `turndown`, `warning`, or `error` (two branches) |
| `turbineVolume` | `indicatedBbl`, `grossBbl`, `meterFactor`, or `error` |
| `straightRunDiameters` | `upstreamDiameters`, `downstreamDiameters`, `note`, or `error` |

### controlValve.js (10 exports)

| export | returns |
|---|---|
| `VALVE_STYLES` | 8 rows of `{id, label, fl, xt, fd}` |
| `styleOf` | a style row or `null` |
| `liquidCriticalRatioFF` | a bare number or `NaN` |
| `liquidValve` | `cv`, `fl`, `ff`, `dpStatedPsi`, `dpAllowablePsi`, `dpUsedPsi`, `choked`, `flashing`, `sigma`, `regime` (5 values), `warning` (4 branches), or `error` (4 branches) |
| `specificHeatFactor` | a bare number or `NaN` |
| `gasValve` | `cv`, `xt`, `fk`, `x`, `xChoked`, `xUsed`, `y`, `choked`, `warning` (3 branches), or `error` (3 branches) |
| `valveAuthority` | `authority`, `verdict` (3 values), `note` (3 branches), or `error` (2 branches) |
| `characteristicFor` | `characteristic` (2 values), `reason`, or `error` |
| `noiseIndication` | `pressureRatio`, `streamPowerKw`, `band` (4 values), `note`, `warning`, or `error` |
| `travelCheck` | `minTravelPct`, `normalTravelPct`, `maxTravelPct`, `warnings[]` (4 kinds), `pass`, or `error` |

### storageTank.js (10 exports)

| export | returns |
|---|---|
| `tankCapacity` | `crossSectionFt2`, `nominalBbl`, `nominalFt3`, `workingBbl`, `bblPerFt`, or `error` |
| `shellCourse` | `headFt`, `tDesignIn`, `tTestIn`, `requiredIn`, `governing` (3 values), `note`, or `error` (2 branches) |
| `shellCourses` | `courses[{course, bottomFt, topFt, ...shellCourse}]`, `count`, or `error` |
| `thermalVenting` | `inbreathingScfh`, `outbreathingScfhLowVolatility`, `outbreathingScfhHighVolatility`, `note`, or `error` |
| `movementVenting` | `outbreathingScfh`, `inbreathingScfh`. NO error path at all |
| `normalVenting` | `thermal`, `movement`, `outbreathingScfh`, `inbreathingScfh`, `governing` (2 values), `warning`, or `error` |
| `wettedAreaFt2` | `areaFt2`, `effectiveHeightFt`, `note`, or `error` |
| `fireVenting` | `qBtuHr`, `ventScfhAir`, `note`, or `error` |
| `evaporativeLosses` | `vapourSpaceFt3`, `vapourDensityLbFt3`, `expansionFactorKe`, `saturationFactorKs`, `standingLossLbYr`, `workingLossLbYr`, `totalLossLbYr`, `totalLossTonsYr`, `turnoversPerYear`, `note`, or `error` (2 branches) |
| `lossControl` | `savedLbYr`, `remainingLbYr`, `note`, or `error` |

That is 29 exports returning roughly 90 distinct named values, 12 status
or verdict labels, and 18 warning branches.


## 2. The LIVE surface

Three routes, all behind `ProtectedAppRoute`:

    /dashboard/apps/facilities/control-valve-sizing    ControlValveSizing.jsx
    /dashboard/apps/facilities/storage-tank-designer   StorageTankDesigner.jsx
    /dashboard/apps/facilities/flow-metering-designer  FlowMeteringDesigner.jsx

Each is a context plus a `*Panels.jsx` plus a shared `fields.jsx` plus a
help guide, and each persists to its own `saved_*_projects` table. Every
input is an `<Input type="number">` bound straight through a
`num(v, fallback)` helper over `parseFloat`. `type="number"` blocks the
thousands-separator laundering FC7 found, so "50,000" does not become 50
here; what it does not block is a CLEARED box turning into a silent
flattering default, which is finding A12 and which is how the valve
cavitation screen is switched off (A1).

All nine engine-side files are byte-identical between canonical
`82ec6d4` and the Suite's `packages/engines`, verified with `cmp`. The
three `src/utils/facilities/engine/*.js` files are one-line re-export
shims. The engines import nothing, so the closure is those nine paths
plus three shims. A repair will grow it; re-walk rather than assume, and
stage by explicit path because the Suite worktree is shared.


## 3. Findings

64 findings, 29 LIVE, 13 FAILS OPEN, 10 HELD FOR LITERATURE. Full
statements, exact inputs and reproductions are in FINDINGS.md. Counted
there. The five that matter most are listed at the top of that file.


## 4. What the oracles compute, and what they do not

### 4a. oracle_tanksmetering.py

Computes four groups: `shell` (3 rows), `orifice` (3), `cd` (4),
`uncertainty` (2). Twelve rows.

It covers, of 19 exports across two modules:

- `shellCourse.tDesignIn` and `.tTestIn`
- `orificeFlow.beta`, `.cd`, `.expansibility`, `.reynolds`, `.massLbHr`
- `dischargeCoefficient.cd`
- `orificeUncertainty.totalUncertaintyPct`

**SEVEN OF THE TEN STORAGE TANK EXPORTS HAVE NO ORACLE ROUTE AND NO
GOLDEN ROW AT ALL:** `tankCapacity`, `shellCourses`, `thermalVenting`,
`movementVenting`, `normalVenting`, `wettedAreaFt2`, `fireVenting`,
`evaporativeLosses` and `lossControl`. That is eight, and the ninth,
`shellCourse`, is covered only on two of its six returned values. The
whole of API 2000 normal venting, the whole of the fire case and the
whole of the AP-42 evaporative loss chain are unvalidated by anything but
inequalities typed into the test file.

**FOUR OF THE NINE METERING EXPORTS HAVE NO ORACLE ROUTE:** `sizeOrifice`,
`permanentLoss`, `transmitterUncertaintyPct` and `turbineVolume`. So has
`straightRunDiameters`, which makes five.

Returned values no golden carries: `dischargeCoefficient.l1`,
`.m2Prime`, `.unusedM2`; `orificeFlow.volumetricFt3Hr`, `.dpPsi` and all
three `warning` branches; every field of `sizeOrifice` as such; both
fields of `permanentLoss`; every element of
`orificeUncertainty.contributions` and its `dominant` and `note`; all
three fields of `transmitterUncertaintyPct`; all three of
`turbineVolume`; all three of `straightRunDiameters`; all five of
`tankCapacity`; `shellCourse.requiredIn`, `.governing`, `.headFt`,
`.note`; both fields of `shellCourses`; all four of `thermalVenting`;
both of `movementVenting`; all six of `normalVenting` including
`governing` and `warning`; all three of `wettedAreaFt2`; both of
`fireVenting`; all ten of `evaporativeLosses`; both of `lossControl`.

### 4b. oracle_controlvalve.py

Computes five groups: `liquid` (4 rows), `boundary` (2), `gasMarch`
(41 rows), `gas` (3), `travel` (5 points). Fifty-five rows.

It covers, of 10 exports:

- `liquidValve.cv`, `.ff`, `.dpAllowablePsi`, `.choked`
- `gasValve.cv`, `.x`, `.xChoked`, `.y`, `.choked`
- `specificHeatFactor` (as `fk` inside the march)
- `travelCheck.normalTravelPct`

**THREE EXPORTS HAVE NO ORACLE ROUTE AND NO GOLDEN ROW AT ALL:**
`valveAuthority`, `characteristicFor` and `noiseIndication`. So do
`VALVE_STYLES` and `styleOf`, which makes five of ten.

Returned values no golden carries: `liquidValve.fl`, `.dpStatedPsi`,
`.dpUsedPsi`, `.flashing`, `.sigma`, `.regime`, `.warning`;
`gasValve.xt`, `.fk`, `.xUsed`, `.warning`; every field of
`valveAuthority`, `characteristicFor` and `noiseIndication`; and
`travelCheck.minTravelPct`, `.maxTravelPct`, `.warnings` and `.pass`.

**That the noise indication has no route is exactly where its defects
are.** Three separate defects planted in it all left the suite green, and
the function's own band ignores the only quantity it computes (C3).

### 4c. Which routes are genuinely independent, measured rather than described

Three and a half of the nine groups are real:

- **`orifice` is a real unit-system check.** The oracle computes the mass
  flow entirely in SI from Pa and kg/m3; the engine packages 0.0361273,
  144 and 32.174 into field units. Every one of those packagings went RED
  when planted. The rows agree to 5.4 to 5.7 percent of a 1e-5 tolerance,
  which is the signature of two different arithmetics landing close but
  not identically.
- **`uncertainty` is a real method check.** A 200,000-sample Monte Carlo
  propagation against a root-sum-square. The rows sit at 9.4 and 10.8
  percent of a 2 percent tolerance. Dropping the square root from the RSS
  went red, as did two of the three sensitivity exponents.
- **`travel` is a real round trip.** The oracle generates a Cv from a
  travel through the equal-percentage law and requires the engine to
  return that travel. It caught the log-base plant four times over.
- **`shell` is HALF a real check.** The oracle re-derives the one-foot
  method in SI from rho g H D over 2 S, so the field constant 2.6 IS
  genuinely checked: the rows sit at 38.7 to 44.8 percent of a 1e-3
  tolerance, which is the 2.6 rounding, exactly as the test comment says.
  But the ONE FOOT itself is transcribed, and a two-foot method planted
  in both files left the suite green.

Five of the nine groups are transcriptions. Measured, not assumed:
**51 of the 53 rows in the `cd`, `liquid`, `gas`, `gasMarch` and
`boundary` groups reproduce BIT FOR BIT**, at exactly 0.000 percent of
tolerances as tight as 1e-12. Two independent arithmetics do not land on
the same IEEE double. The two that do not match differ only in the last
digit of a JSON round trip.

The oracle docstrings claim two independent routes that do not exist.
`oracle_controlvalve.py` says "the ISA liquid and gas constants (1 and
1360) are checked by dimensional re-derivation in SI where that is
meaningful"; there is no such re-derivation anywhere in the file, and
planting 1360 to 1400 in BOTH files left the suite green.
`oracle_controlvalve.py` also describes the boundary bisection as
independent, but `is_choked` restates the engine's own inequality, so the
route is an independent ROOT FIND on a TRANSCRIBED PREDICATE.


## 5. Golden inventory and provenance

**67 rows in 9 groups. NONE is a published measurement.** Every row was
generated by the oracles' own arithmetic. There is no vendor Cv, no
proving report, no published orifice calibration, no tank test record and
no measured emission factor anywhere in either file.

| group | rows | provenance |
|---|---|---|
| `shell` | 3 | oracle-generated, SI re-derivation. The 2.6 constant is independent; the one-foot offset is transcribed |
| `orifice` | 3 | oracle-generated, INDEPENDENT unit system |
| `cd` | 4 | oracle-generated, TRANSCRIBED (bit-identical) |
| `uncertainty` | 2 | oracle-generated, INDEPENDENT method (Monte Carlo) |
| `liquid` | 4 | oracle-generated, TRANSCRIBED (bit-identical) |
| `boundary` | 2 | oracle-generated, independent root find on a transcribed predicate (bit-identical) |
| `gasMarch` | 41 | oracle-generated, TRANSCRIBED (bit-identical) |
| `gas` | 3 | oracle-generated, TRANSCRIBED (bit-identical) |
| `travel` | 5 | oracle-generated, INDEPENDENT round trip |

Margins, so the next wave knows its room: the shell rows sit at 38.7 to
44.8 percent of 1e-3, the orifice mass flows at 5.4 to 5.7 percent of
1e-5 and their Cd at 5.9 to 8.6 percent of 1e-6, the uncertainty rows at
9.4 to 10.8 percent of 2 percent, and the cd, liquid and gas rows at
0.000 percent of 1e-12, which is not slack but proof of transcription.


## 6. The gate, measured rather than described

Baseline: `__tests__/facilities.tanksmetering.test.js` and
`facilities.controlvalve.test.js`, **40 tests, 40 passing, 2.1 s.** Both
oracles regenerate their committed goldens byte for byte.

The suites are behaviourally richer than FC7's: they carry ordering
assertions, monotonicity checks, refusal probes, exact literals for FF
and the 2/3 expansion floor, and a whole describe block dedicated to the
travel warnings printing one decimal. Those assertions do most of the
catching. The goldens do much less than the file count suggests.


## 7. Sixty-four defects planted in the ENGINES ALONE

**25 OF 64 LEFT BOTH SUITES 40 OF 40 GREEN.** Thirty-nine went red.

By module: metering 6 green of 25, controlValve 6 of 19, storageTank
**13 of 20**.

| planted in the engine alone | result |
|---|---|
| metering: small-bore correction 0.011 -> 0.022 | GREEN |
| metering: beta warning threshold 0.75 -> 0.95 | GREEN |
| metering: uncertainty bore sensitivity 2 -> 1 | GREEN |
| metering: `permanentLoss` default cd 0.61 -> 0.75 | GREEN |
| metering: singleElbow straight run 18 -> 30 diameters | GREEN |
| metering: downstream straight run 4/5 -> 2/3 | GREEN |
| valve: sigma thresholds 2 and 3 -> 1 and 1.5 | GREEN |
| valve: globeCage FL 0.90 -> 0.85 | GREEN |
| valve: globeCage xT 0.75 -> 0.60 | GREEN |
| valve: noise bands 2/4/10 -> 3/8/20 | GREEN |
| valve: noise 379.49 scf per lbmol -> 380 | GREEN |
| valve: drop ln(ratio) from the stream power entirely | GREEN |
| tank: minimum plate 0.1875 -> 0.3125 in | GREEN |
| tank: barrel 42 gal -> 55 gal (every capacity) | GREEN |
| tank: thermal inbreathing 1.0 -> 0.5 scfh per bbl | GREEN |
| tank: low-volatility outbreathing 0.6 -> 0.9 | GREEN |
| tank: insulation credit 0.25 -> 0.05 | GREEN |
| tank: fire band 199300 A^0.566 -> A^0.500 | GREEN |
| tank: fire vent constant 1107 -> 2214 | GREEN |
| tank: drop sqrt(tempR) from the fire vent | GREEN |
| tank: AP-42 gas constant 10.731 -> 10.0 | GREEN |
| tank: AP-42 saturation 0.053 -> 0.030 | GREEN |
| tank: standing loss 365 days -> 300 days | GREEN |
| tank: drop Ks from the standing loss entirely | GREEN |
| tank: drop Ke from the standing loss entirely | GREEN |

Read that block again. **The whole of the AP-42 evaporative loss
calculation can be wrong in five different ways and the suite is green.
The whole of API 2000 thermal venting can be wrong in three ways and the
suite is green. The emergency vent conversion can be doubled and the
suite is green.** And the barrel is a free parameter: the capacity test
asserts `nominalBbl === bblPerFt * 40`, which holds for any constant
whatever, so 42 gallons to 55 gallons is invisible. That is a
self-consistent test that validates nothing, which is the same class as
FC7's `oilDensityKgM3` row that the golden carried and never called.

Red, for the record: every term of the Reader-Harris/Gallagher equation
except the small-bore correction; every field-unit packaging in the
orifice flow; the expansibility constants; the iteration count; the dp
and density sensitivities; the RSS itself; the transmitter default and
its warning threshold; the permanent loss sign; the meter factor;
FF; the FL-squared allowable drop; the liquid Cv grouping; the choked
substitution; the gas Y divisor; 1360; Fk; the Rankine offset; the
authority thresholds; the characteristic rule; the equal-percentage log
base; the rangeability default; the 20-to-80 band; the API 650 2.6
constant; the one-foot offset (engine only); the design stress; the
high-volatility doubling; the 30 ft wetted limit; the fire band above
2800 ft2; and the loss-control swap.


## 8. Thirteen defects planted in the ENGINE AND THE ORACLE TOGETHER

Golden regenerated each time. **8 of 13 left the suite green.** A
transcribed oracle catches nothing, and the five that were caught were all
caught by a LITERAL TYPED INTO THE TEST, never by the golden.

| planted in both | result | what caught it |
|---|---|---|
| RG 0.5961 -> 0.6100 | **GREEN** | nothing |
| RG -0.216 b^8 -> -0.300 b^8 | **GREEN** | nothing |
| RG small-bore 2.8 -> 4.0 | **GREEN** | nothing |
| expansibility 0.351 -> 0.401 | **GREEN** | nothing |
| expansibility 0.93 b^8 -> 0.50 b^8 | **GREEN** | nothing |
| API 650 one-foot -> two-foot | **GREEN** | nothing |
| gas constant 1360 -> 1400 | **GREEN** | nothing |
| FF 0.96 -> 0.98 | red | the 0.96 and 0.68 literals in the test |
| liquid allowable drop FL^2 -> FL^1 | red | the boundary and regime assertions |
| Fk = k/1.4 -> k/1.3 | red | `specificHeatFactor(1.4)` must be 1 |
| gas Y divisor 3 -> 4 | red | the exact 2/3 floor literal |
| Rankine offset 459.67 -> 460 | **GREEN** | nothing |
| equal-percentage base R -> base 10 | red | the `cvAt` helper's hardcoded 50 |

**The control on the controls:** six defects planted in the ORACLES
ALONE, with the golden regenerated, went red 5 times out of 6. The
harness can tell the two files apart. The sixth, changing the Monte Carlo
seed, is green by design because the 2 percent tolerance is meant to
absorb sampling noise. Cutting the sample count from 200,000 to 2,000
went red, so the tolerance is not so loose that the method is decorative.

**Honest measure of these goldens: 25 of 64 engine-only defects and 8 of
13 shared defects survive. The target for the FC8-0 re-run is zero
green.**


## 9. Held for literature

Recorded, exposed as stated limits, never graded, never invented. Ten
items, cross-referenced to FINDINGS.md.

- **F1. The API 2000 emergency vent air-equivalence relation.** The
  engine divides by `sqrt(molecularWeight * tempR)` with a dead
  `* Math.sqrt(1)` beside it. What is NOT held, because it needs no
  source: a field-unit packaged constant cannot coexist with a free
  absolute temperature in the same denominator, and `tempR` is an
  unexposed input that moves the headline answer by 29 percent over a
  plausible range. The correct relation needs API 2000. If it is the
  customary `1107 Q / (L sqrt(M))` the engine under-states the required
  vent by 23.7 times.
- **E7. API 650's minimum shell plate thickness by diameter band.** The
  engine hardcodes 0.1875 in for every tank. The band table needs the
  standard.
- **E8. The diameter limit on the one-foot method** and the
  variable-design-point alternative above it.
- **A11. The wetted-area ceiling on the fire case**, and whether the
  above-2800 relation has an upper bound at all.
- **E9. The API 2000 normal thermal venting table above 20,000 bbl**, and
  the latitude and insulation credits the standard actually allows.
- **E1 and E2. The ISO 5167 / AGA 3 straight-run table.** One column is
  non-monotonic in beta today, which no published table is. The repair
  needs the table, not a guess.
- **E3. The published Reynolds floor of the Reader-Harris/Gallagher
  correlation** at each beta and bore, which is what the Suite's chart
  currently plots below.
- **E6. The ISA 75.01 / IEC 60534 Reynolds number factor FR** and its
  valve-style modifier `fd`, which is in the table and read by nothing.
- **H4. The API MPMS temperature and pressure correction tables** that
  turn an indicated turbine volume into a net standard volume. The module
  names custody transfer as the subject and returns only gross.
- **F5 and F6. Every FL, xT and fd in the style table, and the sigma
  thresholds of 2 and 3.** These are properly vendor and trim data. A
  repair may keep them as the engine's stated choices; no lesson may
  present one as published.

Do not guess which clause of ISA 75.01, IEC 60534, AGA 3, ISO 5167,
API 12, API 620, API 650, API 2000 or AP-42 chapter 7 says what. Every
one of those labels appears somewhere in these three modules or their
Suite copy, and not one of them is cited to a document anywhere in the
repo.


## 10. SCOPE NOTE for the course writer

Swept against `petrolord-nextgen` main plus the FC1, FC2, FC3 and FC4
branches. Free ground, measured at zero hits across the whole catalogue:
**control valve sizing, Cv, ISA 75.01, IEC 60534, valve authority, equal
percentage, rangeability, expansibility, beta ratio, API 650, API 2000,
storage tank, custody transfer, turbine meter, breathing loss,
evaporative loss, floating roof.** The subject is genuinely new. There is
no facilities course that teaches any of it.

Four real collisions, all of them adjacency rather than duplication:

- **The word "orifice" is already taken, by `gaslift`, in 13 lessons.**
  There it is a gas lift valve PORT with its own throughput correlation,
  a different device answering a different question. `hydraulics` owns
  the "discharge coefficient" in the bit-nozzle sense across 4 lessons,
  and `gaslift` owns it in 2 more. FC8 must not open as though the
  orifice were new; it must distinguish the metering orifice from the
  valve port and the bit nozzle, and it may lean on the fact that the
  reader has already met a discharge coefficient.
- **CHOKED FLOW is already taught, by `nodal` (10 lessons), `network`
  (3), `welltest` (2), `gaslift` (3) and `stimulation` (1)**, as critical
  flow through a wellhead choke. FC8's choking is the vena contracta of a
  trim, which is the same idea one device later. Reference it; do not
  re-derive critical flow.
- **CAVITATION is already taught, by FC3 `rotating`, in 5 lessons under
  NPSH**, including `intermediate/m01-npsh-available/l04-a-liquid-already-flashing.md`
  and `m02-.../l03-the-three-severities.md`. FC3 owns the phenomenon at a
  pump suction. FC8 owns the VALVE index, its thresholds, and the
  distinction FC3 does not make: that a flashing service and a cavitating
  service need different valves, and an anti-cavitation trim will not
  help a flashing one.
- **"UNCERTAINTY BUDGET" is already a phrase in the catalogue**, in
  `welldesign` (4 lessons) and `mapping` (1), meaning survey and position
  uncertainty. Different subject, same words. FC8's budget is a
  MEASUREMENT budget with a named dominant term.

Ceded by module, so FC8 does not re-teach:

- **FC1 `separation`** owns vessel sizing, Stokes between two liquids,
  droplet settling and the fail-open-verdict lesson. FC8's A1, A2 and D1
  are the same defect class in a third engine, which is a callback the
  course can make in one sentence and must not rebuild.
- **FC2 `linesizing`** owns line hydraulics, friction factors and the
  RP 14E erosional velocity. FC8's H2 finding is that the Control Valve
  studio reuses RP 14E and never compares it to anything; the course must
  not re-teach RP 14E, only the fact that a valve body is where the
  fluid moves fastest.
- **FC3 `rotating`** owns pumps, compression, NPSH and cavitation as
  above, and owns the observation that a control valve absorbing the
  difference between a pump's curve and a station's need is paid for in
  electricity (`beginner/m05-.../l04-what-each-region-costs.md`). FC8 can
  answer that lesson from the valve's side, which is valve authority.
- **FC4 `gasprocessing`** owns Joule-Thomson cooling across 6 lessons,
  which is the reason a gas valve's outlet is cold and its noise is loud.
  Reference, do not re-derive.

**FC8's own ground** is therefore: the uncertainty of a measurement
rather than the measurement, the boundary past which a bigger valve buys
nothing, the difference between a flashing service and a cavitating one,
the authority a loop needs before any Cv matters, the thin-walled vessel
that is destroyed by an undersized vacuum vent rather than by pressure,
and the annual evaporation that is simultaneously a money number and a
reportable one.


## 11. REPAIR PLAN for FC8-0

Ordered. The first five are wrong numbers a user can reach today. The
rest is the gate that let them through.

### In `storageTank.js`

1. **Settle the emergency vent conversion (F1).** Get API 2000, fix the
   relation, and until then either refuse or emit an explicit
   "unvalidated conversion" flag rather than a number. Delete the
   `* Math.sqrt(1)`. Whatever the answer, `tempR` must either be a stated
   input the app exposes or must not appear.
2. **Make the loss chain honest (A3, A4, B1).** Refuse a true vapour
   pressure at or above the stated atmospheric pressure instead of
   returning a negative standing loss. Either compute AP-42's Kn from
   `turnoversPerYear` or delete the parameter and the echoed field. Give
   `lossControl` a refusal for a missing efficiency and a flag rather
   than a silent clamp for an impossible one.
3. **Close the guardless exports (A5, A6, A11).** `movementVenting` needs
   an error path. `tankCapacity` must refuse a negative fill.
   `fireVenting` must bound the environment factor at 1 and state its
   wetted-area limit.
4. **Make the shell say what governs it (E7, D2, D4).** The minimum plate
   thickness must be an explicit, diameter-aware, stated value, and
   `shellCourses` must return a summary: the governing course, the
   thickest course, how many courses the water test governs, and the
   minimum in force. Refuse or warn above the one-foot method's diameter
   limit (E8).
5. **One predicate for the governing vent case (C2)**, computed once, and
   state the thermal venting basis and its capacity band (E9), the 0.6
   factor, the insulation credit and the latitude factor with whatever
   provenance the standard gives (F2).

### In `controlValve.js`

6. **Refuse a liquid sizing with no vapour pressure (A1).** This is the
   single most important line in the wave. A cavitation index that cannot
   fire is worse than no index, because it is green.
7. **Make `travelCheck` count its checks (A2, D1).** Return
   `checksPerformed`, withhold `pass` when any of the three flows is
   missing, and separate "beyond the valve" from "not given".
8. **Make the noise indication honest (C3, A7, B4).** Either the stream
   power enters the band or it comes out. Guard the outlet pressure and
   the gas properties. If the power stays, the app must show it.
9. **One vocabulary for the characteristic (C4).** `characteristicFor`
   and `travelCheck` must agree, and an unrecognised characteristic must
   be an error rather than a silent equal percentage.
10. **Bound the overrides (A8)** and state the FL, xT, fd and sigma
    thresholds as the engine's choices with whatever source exists (F5,
    F6). Delete `fd` or use it. Add the Reynolds factor FR or state its
    absence as a limit (E6). Compute sigma on the drop the valve
    actually uses (C6).

### In `metering.js`

11. **Wire the transmitter into the budget, or drop the claim (C1, G1).**
    `orificeUncertainty` should accept a reading and a span and derive
    the differential term, and `transmitterUncertaintyPct` must report a
    differential turndown by that name and judge it against the
    differential equivalent of the flow rule, not against 3.
12. **Fix the straight-run table (E1, E2).** Non-monotonic in beta today;
    it needs the standard, a citation, and a refusal above beta 0.75.
13. **Name the real refusals (E5, A10, A9).** A differential above the
    static pressure must be refused by name. `expansibility` must return
    an error object. `sizeOrifice` must not return a bore beside an
    error, must not bracket past 0.75, and should report a stock bore.
14. **Clean the dead weight (B5, B6, F7, G2).** Delete the empty range
    block and `unusedM2`. Require the discharge coefficient in
    `permanentLoss` rather than defaulting it to the one constant the
    module exists to disprove. Rename `volumetricFt3Hr` to say it is at
    flowing conditions.
15. **Guard the correlation's band (E4, E3, M14).** Warn outside the
    published Reynolds range and outside the beta range, and add at least
    one small-bore case so the correction is reachable. Bound the meter
    factor (A13) and say what `grossBbl` is not (H4).

### In the three Suite studios

16. **Expose or delete the two hidden inputs (B7, B8).** `fp` scales
    every Cv by 50 percent over its range; `latitudeFactor` scales the
    governing vacuum case by 75 percent. Neither has a field. Both come
    back from a saved study.
17. **Fix the tank's own defaults (H1).** A 40 ft shell at a 38 ft level
    has 2 ft of vapour space, not 12. Either derive the vapour space from
    the geometry or refuse to let them contradict.
18. **Make the erosional card do something or take it out (H2).** No
    velocity is computed, so the check advertised cannot fire, and a
    two-phase C factor is being applied to a single-phase liquid.
19. **Print travel to one decimal (D7)**, matching the engine warnings
    the tiles sit beside, and render the sizing result's own warning
    (H7).
20. **Pass or surface the seven silent engine defaults (H3)**, give the
    two "Vapour MW" fields distinct labels (G3), say short tons (G4),
    compare the emergency vent to the normal vent (D3), wire or explain
    the recommended characteristic (C5), stop treating a cleared box as a
    typed number (A12), and add `try/catch` to the derived blocks (H6).
21. **Fix the copy the arithmetic denies:** the "differential transmitter
    dominates" paragraph (C1), the flow-turndown paragraph (G1), and the
    seven-percent chart caption (H5). The owner copy rule is already
    clean: zero em dashes in all six files (H8).

### In the oracles and the goldens

22. **Add INDEPENDENT routes, not transcriptions, for everything in
    section 4 that has none.** Priority order: `fireVenting` and
    `evaporativeLosses` first, because they are the two chains where five
    and three planted defects respectively went green; then
    `normalVenting` and `thermalVenting`; then `noiseIndication`,
    `valveAuthority` and `travelCheck`'s min, max, warnings and pass;
    then `sizeOrifice`, `permanentLoss`, `transmitterUncertaintyPct`,
    `turbineVolume` and `tankCapacity`.
23. **Make the transcribed groups independent.** The Reader-Harris
    coefficient, the liquid and gas Cv, the expansion factor march and
    the choking boundary predicate are bit-identical to the engine today.
    An independent route for a Cv means deriving it from a different
    starting point, for example an energy balance through the vena
    contracta, not regrouping the same terms. Delete the two docstring
    claims that describe routes the file does not contain.
24. **Fix `tankCapacity`'s self-consistent test.** Assert the barrel
    against 42 gallons and 231 cubic inches explicitly, not against
    itself.
25. **Fix the band-continuity test.** `expect(q).toBeGreaterThan(prev * 0.5)`
    tolerates a factor-of-two discontinuity, which is why the 0.566
    exponent plant went green. Assert continuity within a few percent at
    each of 200, 1000 and 2800 ft2.
26. **Add a golden row for every warning branch and every status label:**
    18 warning branches and 12 verdict labels across the three modules,
    of which the goldens currently carry none.
27. **Re-run the planting battery after the repair.** 25 of 64 and 8 of
    13 is the number to beat and **the target is zero green.** The
    battery scripts are in `/root/fc-wip-metering/scratch/`
    (`plant.sh`, `battery_engine.sh`, `battery_shared.sh`,
    `battery_oracle.sh`) and restore the worktree after every plant.

**Capstone conditions are OFF LIMITS as engine test conditions, in both
directions.** Every golden row added under items 22 and 26 must be
checked against the wave's `fields.json` before it lands. FC4's repair
took a capstone's exact conditions for a golden row and the golden handed
back a graded answer. The realistic conditions here (a 120 ft tank, a
6 in meter run, a globe valve at 200 to 150 psia) are exactly the ones
the course will want.
