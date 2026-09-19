# `crude` RECON: Crude Assay & Blending

Academy module `downstream` ("Midstream & Downstream"), path_order 48, slug
`crude`, the first of the three Commercial & Trading courses. Subject:
`engines/downstream/crudeAssay.js`, `engines/downstream/productBlending.js` and
`lib/lp/simplex.js`, vendored sha-identical from petrolord-engines **60ee266**
by the shared vendor commit b1f29251 (`gate_vendor.sh`: 16 paths, engines,
oracles, FINDINGS, goldens and the six jest suites, all identical; the six
suites run 866 of 866 green in the worktree). The live Suite apps are the Crude
Assay & Blending Studio and the Product Blending Optimizer at Suite main
3e5506561 (`src/contexts/CrudeAssayContext.jsx`,
`src/contexts/BlendOptimizerContext.jsx`, `src/components/crudeassay/`,
`src/components/blendoptimizer/`, MD1-0 sections of DS1 and DS2 STATUS).

> RECON.md IS PROVENANCE. No writer may quote a figure from this file. The
> teaching truth is `digest.txt`, and every figure below that is not a count of
> files or cases was produced by running the engine or the oracle, and is
> reproduced by the command shown beside it.

## THE ONE SENTENCE

**Every property of a blend is computed on its own basis (gravity through
specific gravity on volume, sulfur and the other per-mass properties on mass,
viscosity through an index, yields on volume off the curve), and every
least-cost recipe is a linear programme whose binding specifications, value of
relief and infeasibility are answers in their own right.**

## WHAT THE COURSE CHOSE TO TEACH, AND WHAT IT LEAVES OUT

- **Associate, THE ASSAY AND THE BLEND** (crudeAssay): the API definition and
  its hyperbola; density on volume and API through specific gravity; volume
  shares to mass shares; sulfur, TAN, nitrogen and metals on mass; a blank is
  not a zero; the Refutas index; the TBP curve between and outside its points;
  cut yields of one crude; the CII and the gravity screen that can raise a flag
  and never clear one. Graded: blend API, sulfur wt%, vanadium ppm, a mass
  share, the CII, one crude's cut yield.
- **Professional, THE BLENDED BARREL AND WHAT IT IS WORTH**
  (blendDistillationCurves, temperatureAtVolumePercent, watsonK, cutYields on
  the blend, netbackValue): yields add on volume, the blend's own curve, T50
  interpolated, the refinery's own cut points, netback with losses on the
  product side, blank costs named, unpriced cuts named, the marker
  differential, D86 refused without its table. Graded: T50, two blend cut
  yields, gross value, loss value and netback per bbl.
- **Expert, THE LEAST-COST RECIPE, and LP for the whole module** (solveLP,
  optimiseBlend, propertyOfBlend, valueGiveaway, SPEC_TEMPLATES, rvpIndex):
  what an LP is, rows and bounds, the vertex, the two phases, optimal /
  infeasible / unbounded; a ratio limit as a linear row; volume, mass and index
  bases; binding and giveaway; the shadow price as the money one unit of relief
  saves per unit of the property, with rowPrice beside it; the marginal barrel
  against the average; infeasible, refused and skipped. Graded: least total
  cost, two recipe volumes, and the value of relief on sulfur, RVP and RON.

**Taught but never graded:** every basis word, CII band and stable verdict;
viscosity (HELD C12) and Watson K (HELD C13); valueGiveaway dollars and the
marker differential (no oracle computes either, see section 6); the gravity
screen's thresholds (not exported; the digest finds them by probing the
engine). **Left out:** `d86ToTbp` beyond its two refusals (it ships no
coefficient table, by design), `resolveFractions` as a separately named export
(taught through blendCrudes' fractions), and the fuel oil template beyond the
SPEC_TEMPLATES table.

## 1. What the modules compute

| module | functions | constants and tables |
|---|---|---|
| crudeAssay | 18 | 1 (CII_BANDS) |
| productBlending | 5 | 4 (BINDING_TOLERANCE, BLEND_BASIS, RVP_INDEX_EXPONENT, SPEC_TEMPLATES) |
| lib/lp/simplex | 1 (solveLP) | 1 (LP_STATUS) |

(`node crude_dump.mjs`, SECTION 1, counts them from the modules.) Return shapes
that matter to grading: `blendCrudes` -> `{fractions[{volumeFraction,
massFraction}], properties{sg, api, sulfurWtPct, tanMgKohG, nitrogenWtPct,
nickelPpm, vanadiumPpm, viscosityCSt}, missing, bases, stability{basis, cii,
blendedSara, stable, band, message}}` or `{error}`; `cutYields` -> `{cuts[{id,
name, fromF, toF, yieldVolPercent|null}], totalVolPercent, unknownCuts,
closes}`; `blendDistillationCurves` -> points; `temperatureAtVolumePercent` ->
F or null; `netbackValue` -> `{rows, grossValue, lossValue,
processingCostPerBbl, freightPerBbl, netback, unpricedCuts, assumedZero,
complete, marker{netback, differential}}` or `{error}`; `optimiseBlend` ->
`{status, recipe[{volume, volumeFraction, cost}], totalVolume, totalCost,
unitCost, achieved[{value, giveaway, binding, applied}], shadowPrices[{kind,
name, price, rowPrice, per}], bindingSpecs, skippedSpecs}` or `{status,
error}`; `solveLP` -> `{status, x, objective, shadowPrices, iterations}`.

## 2. The live surface

| app | engine calls (non-test source, Suite main) | what the page prints |
|---|---|---|
| Crude Assay & Blending Studio (`CrudeAssayContext`) | blendCrudes, blendDistillationCurves, cutYields (blend and per crude), netbackValue, sgFromApi, temperatureAtVolumePercent(blended, 50), watsonK | blend API 2 dp, sulfur 3 dp, viscosity 1 dp with the engine's basis string; stability with the CII to 2 dp or "not screened"; yields 1 dp with the unknown-cut and not-closing warnings; netback terms 2 dp, assumed-zero and unpriced notes; Watson K labelled a screening figure |
| Product Blending Optimizer (`BlendOptimizerContext`) | optimiseBlend, valueGiveaway, SPEC_TEMPLATES, BLEND_BASIS | the recipe, achieved properties 2 dp with basis, giveaway, binding / slack / not applied; "What each constraint is costing": `price` to 2 dp with its unit; "Quality giveaway" valued with the user's unit values (default RON 0.6, sulfur 0) |

Both contexts send a blank box as ABSENT (MD1-0), so the course teaches the
engine's own absence rules as the app's.

## 3. FINDINGS-crude.md: repaired and HELD, and how the course carries them

Nineteen defects were repaired in MD1-0 (L1 to L3, B1 to B4, B6, C1 to C11)
plus one hardening (B5). The course teaches every repaired rule as current
behaviour and never as history: the shadow price per unit of the property
(B1, SECTION 23), a typed 0 is none (B2, SECTION 25), a blank cost is refused
(B3), a stream with no density skips the mass spec (B4), relative binding
(B5, BINDING_TOLERANCE printed), refused bad bounds (B6), T50 interpolated
(C1, SECTION 14, the studio's default pair prints 617.1429 against the grid's
690), the gravity screen cannot clear (C2, C3), the uncertain band is no verdict
(C4), a blank per-mass property is not blended (C5), the refusals (C6), the
curve answers only where it says so (C7), one blended-curve interpolation (C8),
an inverted cut has no yield (C9), netback names blank costs and refuses losses
outside 0 to 100 (C10), and the LP kernel's floor-shifted rows and phase one
(L1, L2).

**HELD, taught as limits in SECTION 27 and never graded:** L4 (absolute LP
tolerances; the capstone LP is barrel scale, 10,000 bbl, costs near 90 $/bbl),
C12 (Refutas index on mass; SECTION 8 prints the volume-basis figure beside it
so the disagreement is visible, and no lesson may key either as right), C13
(Watson K on T50).

## 4. The clock

None. `grep -nE '\bDate\b|performance\.now|Math\.random'` over the three engine
files and the four generators finds nothing (`gate_clock.sh` check 1), and the
digest and the eighteen graded values are byte-identical with the machine clock
moved 400 days back and 900 forward. The digest is byte-identical across two
rebuilds and TZ=UTC, Africa/Lagos, Pacific/Kiritimati and Pacific/Pago_Pago;
the negative control (a planted zone read) moves one line in each of the three
non-UTC zones.

## 5. Findings (rule 5)

Three engine behaviours found in recon. **None is on a graded path, none is
printed by the digest in the shape that shows the defect, and no lesson may
teach them.** Each is STOPPED here for the lead: repair in petrolord-engines
and re-vendor, or hold as a stated limit.

### R1. netbackValue values a cut with NO YIELD as a zero-yield cut, and reports the valuation complete. (Reachable in the live studio.)

`netbackValue` reads each cut's yield as `num(cut.yieldVolPercent, 0)`, so a
cut that `cutYields` returned as unknown (`yieldVolPercent: null`, named in
`unknownCuts`) is valued at zero barrels, and `complete` is `true` whenever
every cut has a price. The studio passes `yields.cuts` straight in
(`CrudeAssayContext.valuation`), so the Netback box shows a finished netback
with no warning of its own (the Yields chart above it does warn that the cut
has no yield). Reproduction, digest SECTION 15's partial blend on Kwale's cuts
and valuation:

    node --input-type=module -e "
    const F = await import('/root/md-wip-crude/crude_fields.mjs');
    const C = await import('/root/wt-md-crude-nextgen/packages/engines/engines/downstream/crudeAssay.js');
    const comps = [{...F.KWALE_LIGHT, volumeFraction: 50}, {...F.EBOCHA_PARTIAL, volumeFraction: 50}];
    const b = C.blendCrudes(comps);
    const y = C.cutYields({curve: C.blendDistillationCurves(comps, b.fractions.map(f => f.volumeFraction)), cuts: F.KWALE_CUTS});
    const n = C.netbackValue({cuts: y.cuts, ...F.KWALE_VALUATION});
    console.log(y.unknownCuts, n.netback, n.complete, n.unpricedCuts);"
    -> [ 'LPG / Light ends', 'Naphtha' ] 48.33926281178059 true []

The unknown LPG and naphtha rows print a value of 0 per bbl of crude. The
oracle's `netback_cargo` also skips a `None` yield, so it agrees with the engine
and cannot catch this. It is the same shape as B3/C5 (a missing value read as
a zero) on the valuation side. Suggested repair: a cut with a null yield is
named (e.g. `unknownYieldCuts`) and `complete` is false. The digest prints the
partial blend's yields (SECTION 15) and never its netback.

### R2. propertyOfBlend drops a component with no value from the property's denominator, so a SKIPPED specification prints an achieved value. (Reachable in the live optimizer.)

`propertyOfBlend`'s mass, index and volume branches `return` early for a
component whose property is not finite, so the property is formed over the rest
of the recipe as if that component were not in the tank. `optimiseBlend` then
reports it in `achieved[].value` for the skipped specification, and
`RecipeResults` prints it in the Achieved column beside "not applied".
Reproduction, the Apapa PMS pool with isomerate's sulfur blank:

    node --input-type=module -e "
    const F = await import('/root/md-wip-crude/crude_fields.mjs');
    const P = await import('/root/wt-md-crude-nextgen/packages/engines/engines/downstream/productBlending.js');
    const r = P.optimiseBlend({components: F.APAPA_PMS_POOL.map(c => c.id === 'iso' ? {...c, sulfurPpm: undefined} : c),
      specs: P.SPEC_TEMPLATES.gasoline_50ppm.specs, targetVolume: 8000});
    console.log(r.recipe.find(x => x.id === 'iso').volume, r.achieved.find(a => a.id === 'sulfurPpm'));"
    -> 656.24... { ..., value: 60.564843296503796, giveaway: null, binding: false, applied: false }

A sulfur of 60.5648 ppm is printed for a 8,000 bbl blend whose 656 bbl of
isomerate has no sulfur figure. (With the density missing instead, the same row
reads null, correctly.) The file's own header rule is "a sulfur content nobody
supplied is not zero sulfur"; dropping it from the denominator is the same
error by another route. Suggested repair: `propertyOfBlend` returns null when
any component with volume lacks the value, as `blendCrudes` does. The digest
prints the skipped specification, its reason and the recipe cost (SECTION 25)
and never the achieved value of a skipped specification.

### R3. The gravity-screen message says "No SARA analysis supplied" when some SARA was supplied. (Copy.)

`screenBlendStability` falls back to the API-contrast screen unless EVERY crude
carries a full SARA, and both fallback messages open "No SARA analysis
supplied". With SARA on one crude of two, that sentence contradicts the input.
Reproduction: `blendCrudes([{...OBIGBO_LIGHT, volumeFraction: 65}, {...EGBEMA_MEDIUM,
sara: undefined, volumeFraction: 35}]).stability.message`. Suggested repair:
"No SARA analysis for <names>". The digest quotes the message only on pairs
where no crude carries SARA.

### Notes, not defects, that shaped the design

- **N1. API blends linearly on MASS.** API = A / SG - B and A / SG is specific
  volume, which is additive on mass, so the mass-weighted mean of the API
  numbers IS the blend API (to 1e-14 on every digest row). The engine's own
  comment says API "does not blend at all"; its basis string ("computed from the
  volume-blended specific gravity, never averaged directly") is true of what it
  does. The digest prints the identity as a computed column (SECTION 4), and
  discriminate never models "API averaged on mass" as a wrong route. The lead
  may want the engine comment softened; it is not a defect.
- **N2. The oracle's RVP relief carries about 6e-5 of float noise.**
  `oracle_productblending.rvp_index` is a float power, so its exact re-solve
  over a 1e-7 step is exact only up to the float index: the relax and tighten
  quotients on ONNE's RVP row differ by 6.0e-5. `oracle_check.py` therefore
  requires the engine's relief to lie between the two quotients (widened by the
  5e-5 tolerance) and the two to agree within twice the tolerance; the sulfur
  and RON rows are rational throughout (sides within 2e-8 and 0).
- **N3. With no availability bound active, the marginal barrel equals the
  average barrel.** Every specification row has a zero right-hand side, so the
  optimum is homogeneous in the target volume. ONNE's optimum has no component
  at a bound, so "marginal barrel x cargo" equals the total cost and is not a
  wrong route there; the digest teaches marginal against average on APAPA,
  where butane sits at its availability (SECTION 23: 87.5108 against 87.3377).
- **N4. Sulfur blended on volume makes ONNE infeasible.** discriminate prints it
  as NO RECIPE and never counts it toward the three numeric routes a field needs.
- **N5. The gravity screen's thresholds are not exported.** The digest finds
  them by probing screenBlendStability either side of each (SECTION 11) rather
  than typing them.

## 6. The gradeable set

**The academy grader is numeric only** (`academy_submit_capstone` casts to
numeric). Every graded field is an engine return, printed-class four decimals,
graded at 5e-5. Oracle coverage, confirmed by CALLING the vendored oracle on the
capstone records (`oracle_check.py`, 18 of 18), not by reading goldens:

| graded output | oracle function |
|---|---|
| blendCrudes properties.api, sulfurWtPct, vanadiumPpm | oracle_crudeassay.blend_cargo (barrels and pounds) |
| blendCrudes fractions[].massFraction (x 100) | oracle_crudeassay.blend_cargo massFractions |
| blendCrudes stability.cii | oracle_crudeassay.blend_cargo cii (SARA on pounds) |
| cutYields yieldVolPercent, one crude | oracle_crudeassay.cut_yield (segment overlap) |
| temperatureAtVolumePercent(blended, 50) | oracle_crudeassay.blended_curve + t_at (bisection) |
| cutYields on the blended curve | oracle_crudeassay.blended_curve + cut_yield |
| netbackValue grossValue, lossValue, netback | oracle_crudeassay.netback_cargo (100,000 bbl account) |
| optimiseBlend totalCost, recipe volumes | oracle_productblending.case (exact rational vertex enumeration; unique optimum asserted) |
| optimiseBlend shadowPrices[].price on sulfur, RVP, RON | oracle_productblending.case relief (exact re-solve, both sides) |

**Deliberately NOT graded:** `viscosityCSt` (HELD C12, the basis is an open
decision, so grading it would key one side of it); `watsonK` (HELD C13);
`valueGiveaway().value` (no oracle computes it; it is also a user-typed unit
value times a giveaway); `marker.differential` (no oracle computes it); the
volume-row price (oracle covered as marginalBarrel, left out because ONNE's
equals its unit cost, N3); every basis string, band, `stable` verdict, status
and refusal sentence.

## 7. The seams

This course OWNS linear programming for the module (Expert m01, m03, m04, m05):
`refinery` uses the same kernel for its plan and must not re-teach LP
fundamentals or grade any productBlending output. `supply` owns measurement and
logistics. No NPV, IRR, Monte Carlo or decision tree anywhere.

## 8. Scope against the live catalogue

Swept on the worktree's `src/content/courses` (other courses only): "shadow
price", "linear program", "simplex", "Refutas" and "colloidal instability"
appear in ZERO live lessons. "Watson" appears in three `fluid` lessons (the same
Tb^(1/3)/SG form, on a plus fraction; this course points to it and teaches the
blend's screening basis). "API gravity" appears across twelve lessons in other
courses as a fluid property; none teaches blending it. "netback" appears once, in
an unrelated DCA lesson. Free ground.

## 9. Vendoring

Not re-vendored: the branch is based on the lead's shared vendor commit
b1f29251 (`chore(engines): vendor the downstream family (engines 60ee266)`),
which pins canonical 60ee266 in VENDOR.json and removes `downstream` from
`excludedDomains`. `gate_vendor.sh` compares the 16 paths this wave stands on
against `git show 60ee266:<path>` in /root/petrolord-engines: all identical.
