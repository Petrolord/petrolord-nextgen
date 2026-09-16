# FC4-0. Gas Processing: recon findings

Subject: `engines/facilities/gasProcessing.js` at engines `fa53f7f`, which is
byte-for-byte `709172f` on every gas-processing path, vendored into NextGen at
`fa33717f` sha-identical with its golden, its oracle and its gate.

Also in scope, because two of the three Facilities courses before this one
found their worst defects there: the Suite composition layer, which is
`src/contexts/GasProcessingContext.jsx`, `src/components/gasprocessing/*` and
`src/pages/apps/GasTreatingDehydration.jsx`, live today at the route
`/dashboard/apps/gas-treating-dehydration`.

**49 findings. 20 FAILS OPEN (16 of them LIVE), 5 FAILS SILENT (all 5 LIVE),
9 CONVENTION (2 LIVE), 10 in the golden and oracle layer, 5 in the Suite
layer (3 LIVE). 21 are reachable today by typing into a box in a shipped
Suite studio.**

LIVE means exactly that: a user of the Gas Processing Studio can produce the
behaviour by typing a number into an input that accepts it.

---

## The headline

**F-E1 is a wrong answer on four screens at the app's own shipped defaults,
and the gate that should have caught it cannot.**

The Joule-Thomson coefficient is computed as

    muJT = (R / (Cp * 5.40395)) * T^2 * (dz/dT) / (z * P)

and the correct relation carries no `z` in the denominator:

    mu_JT = (R T^2 / (Cp P)) (dz/dT)_P

The derivation is one line and admits no alternative. With V = zRT/P,

    T (dV/dT)_P  =  (R/P)(T z + T^2 (dz/dT))  =  V + (R T^2 / P)(dz/dT)
    mu = (1/Cp)[ T (dV/dT)_P - V ]  =  (R T^2 / (Cp P)) (dz/dT)

The module's own docstring states the wrong form as well, so this is a
documented error rather than a typo, and a repair has to correct both.

Verified against **two independent routes**, neither of which shares the
engine's algebraic rearrangement:

1. `(T dV/dT - V)/Cp` with V formed from the same correlation and
   differentiated NUMERICALLY, so nothing but the state equation is shared;
2. `-(dH/dP)_T / Cp` with the isothermal enthalpy departure `V - T(dV/dT)_P`.

The two agree to every digit printed, and the engine equals both times `1/z`:

| psia | degF | z | engine, degF/psi | both independent routes | engine / correct | 1/z |
|---|---|---|---|---|---|---|
| 20 | 100 | 0.9973 | 0.052107 | 0.051964 | 1.00276 | 1.002756 |
| 600 | 100 | 0.9196 | 0.060853 | 0.055960 | 1.08742 | 1.087420 |
| 1000 | 100 | 0.8710 | 0.065765 | 0.057283 | 1.14807 | 1.148070 |
| 1000 | 60 | 0.8289 | 0.086119 | 0.071386 | 1.20640 | 1.206400 |
| 2500 | 100 | 0.7899 | 0.047072 | 0.037184 | 1.26591 | 1.265914 |

The error is zero in the ideal-gas limit and grows with pressure, which is
the shape that makes it hard to notice: it is smallest exactly where a
sanity check is easiest.

**What is on screen today.** The Dew Point tab's shipped defaults are 1000
psia to 600 psia at 100 degF, gravity 0.65, Cp 9.5. Four of its four numbers
are wrong:

| stat on screen | engine today | with the `/z` removed |
|---|---|---|
| JT coefficient, degF per 100 psi | 6.6 | 5.7 |
| Cooling across the drop, degF | 27.3 | 24.0 |
| Downstream temperature, degF | 72.7 | 76.0 |
| Water the cold gas can hold, lb/MMscf | 31.5 | 35.1 |

The direction matters. A dew point skid is BOUGHT for the cooling it
delivers, so a coefficient 15 percent high says a given let-down buys a dew
point depression it does not buy. The corrected figure also moves TOWARDS
the published screening charts for lean gas at those conditions rather than
away from them.

**And the gate cannot see it.** `jouleThomsonFPerPsi` has no golden row, no
oracle route and no check except a band of 5 to 9 degF per 100 psi. Both
6.576 and 5.728 sit inside that band. **Negative control run: the whole
correct formula substituted into the engine leaves the suite at 12 of 12
passing.** This is the FC3 lesson word for word, in a different domain: the
strongest available check could not fail.

---

## FAILS OPEN

A wrong number presented confidently, with no error and no warning.

| id | finding | LIVE | evidence |
|---|---|---|---|
| F-E1 | `jouleThomsonFPerPsi` divides by `z`. Overstated by 1/z: +0.3 pct at 20 psia, +14.8 pct at 1000 psia, +26.6 pct at 2500 psia. Docstring carries the same error. | **LIVE** | two independent routes above |
| F-E2 | `jtDrop` inherits F-E1 across the whole march. 27.3 degF of cooling at the app defaults against 24.0. | **LIVE** | table above |
| F-E3 | The water the cold gas can hold inherits F-E1 through the outlet temperature. 31.5 lb/MMscf against 35.1. | **LIVE** | table above |
| F-E4 | `tegPackage` accepts a reboiler temperature BELOW the absorber temperature. Sensible heat, duty per gallon and reboiler duty all go negative. No warning at all. | **LIVE** | absorber 380, reboiler 100: reboiler duty -0.32 MMBtu/hr, hint "-1432 sensible + 458 overhead Btu/gal", `warning` null |
| F-E5 | `tegPackage` accepts a negative circulation ratio: -5.52 gpm of glycol and -0.32 MMBtu/hr. Only the customary-band warning fires, which reads as a style note. | **LIVE** | ratio -3 |
| F-E6 | `tegPackage` accepts a negative reflux ratio, which SUBTRACTS from the overhead the still has to boil. | **LIVE** | reflux -2: duty 1065.5 against 1890.5 |
| F-E7 | `tegPackage` accepts a BTEX absorbed fraction outside zero to one. | **LIVE** | fraction 5, no error, no warning |
| F-E8 | `tegPackage` accepts a NEGATIVE outlet spec, and removes more water than the gas carries. | **LIVE** | outlet -20 on a 60 inlet: 8.33 gpm against 5.52 |
| F-E9 | `tegPackage` accepts a glycol density of zero: the sensible half silently vanishes and the duty falls to the overhead alone. | no | the Suite never passes it |
| F-E10 | `aminePackage` accepts a solution strength above 100 weight percent. | **LIVE** | 150 wt pct: 111.7 gpm |
| F-E11 | `aminePackage` accepts a NEGATIVE solution strength: -372 gpm and -17.9 MMBtu/hr. | **LIVE** | -45 wt pct |
| F-E12 | `aminePackage` accepts a negative lean loading. | **LIVE** | lean -1 |
| F-E13 | `aminePackage` accepts a negative duty per gallon: a regenerator that produces heat. | **LIVE** | -800 Btu/gal: -17.9 MMBtu/hr |
| F-E14 | `contactorDiameter` accepts a caller-supplied `z` of any sign. z = 0 gives an infinite gas density; z < 0 gives a negative one. | no | the Suite never passes z |
| F-E15 | `contactorDiameter` DISCARDS `dakZ`'s `converged` flag and reports z = 2.48 at 20000 psia and z = 11.00 at 60000 psia, far outside the band DAK was fitted to, with a finite diameter and no note. | **LIVE** | any pressure the box accepts |
| F-E16 | `jouleThomsonFPerPsi` discards the same flag. Above gas gravity 5.08 Sutton's pseudo-critical pressure is NEGATIVE, `dakZ` takes its non-positive-ppr branch and returns z = 1, so the coefficient comes back EXACTLY ZERO: "this gas does not cool". At 5.07 it comes back NEGATIVE, which says the gas HEATS on expansion, with z reported as 38.5. | **LIVE** | sg 5.07 and 5.08 |
| F-E17 | `jouleThomsonFPerPsi` accepts a temperature below absolute zero. -600 degF gives mu = -1.4e-10 and z = 1.000000001, no error. | **LIVE** | |
| F-E18 | `jtDrop` with `steps` at or below zero returns `dropF` = 0, "no cooling", with no error, because the loop never runs. | no | `steps` not exposed |
| F-E19 | `jtDrop` with a non-integer `steps` marches PAST the outlet pressure. `steps` 0.4 on a 1000 to 400 drop marches to 250 psia and reports 83.4 degF of cooling against the correct 41.2. | no | `steps` not exposed |
| F-E20 | `waterSatPsia`'s guard runs to 100 degC while its own docstring claims the fit holds to 60 degC, and the refusal message quotes a third figure. At the guard's own upper edge the fit puts the vapour pressure of water at 15.0951 psia, where the definition of the normal boiling point fixes 14.6959, so it reads 1.027157 times the defining value. | **LIVE** | the gas temperature box takes 200 degF |

---

## FAILS SILENT

Non-finite with no `error` key, so every `if (r.error)` guard downstream
passes and the panel renders a blank where a fault belongs.

| id | finding | LIVE | evidence |
|---|---|---|---|
| F-S1 | `kremserFractionRemoved` returns a BARE NUMBER and therefore returns `NaN` rather than an error for a non-positive absorption factor or stage count. It is the ONLY export in the module outside the object-carrying-an-error contract, so it is the one place a caller has no property to check. | **LIVE** | type 0 in the stages box: "Removal at the stated stages" shows `--` |
| F-S2 | `tegPackage` at a circulation ratio of exactly zero: `dutyBtuPerGal` Infinity, `reboilerMMBtuHr` NaN, no error, and the customary-band warning fires as though the only problem were style. | **LIVE** | |
| F-S3 | `aminePackage` at a solution strength of exactly zero: circulation Infinity, regenerator duty Infinity, no error. | **LIVE** | |
| F-S4 | `contactorDiameter` with a missing or non-numeric temperature: z, gas density, allowed velocity and diameter all NaN, no error. The hint line then reads "Souders-Brown at z = --". | **LIVE** | clear the temperature box |
| F-S5 | `jouleThomsonFPerPsi` with a missing or non-numeric temperature: coefficient and z both NaN, no error. | **LIVE** | clear the temperature box |

One candidate was CHECKED AND NOT FOUND, and is recorded so nobody re-runs
it: the Souders-Brown square root cannot be driven negative by making the gas
denser than the assumed liquid, because the compressibility inflates faster
than the density at every pressure and temperature tried (10000 psia at -100
degF gives 27.08 lb/ft3; 30000 psia at -250 degF gives 37.35). It is
unreachable at any condition the studio can be driven to, not merely
unlikely.

---

## CONVENTION

| id | finding | LIVE |
|---|---|---|
| F-C1 | The comment on `LBMOL_SCF` names the wrong base. 379.49 scf per lbmol is the value at 14.696 psia and 519.67 degR; the comment says 14.65 psia. Measured from the module's own gas constant and Rankine offset, the pressure that gives that molar volume at 60 degF is 14.695751 psia, 1.003123 times the 14.65 named. | no |
| F-C2 | The contactor converts standard cubic feet at a DIFFERENT base from the one the module's own pound mole implies: 14.65 psia over 520 degR against 14.696 over 519.67. Measured group 0.028173077 against 0.028279006 psia per degR, a factor of 0.996254, which moves a diameter by 0.187 percent. Two standard conditions inside one file. | no |
| F-C3 | Two glycol densities in one file. The contactor sizes against a typed 69.9 lb/ft3; the dehydration balance is handed 9.3 lb/gal, which is 69.568831 lb/ft3. A factor of 1.004760. | no |
| F-C4 | The contactor's liquid density is a GLYCOL density used for an AMINE column. The module's own amine table carries a solution gravity for each amine, 1.01, 1.02 and 1.04, and the sizing never reads it. | **LIVE** |
| F-C5 | The module violates its own stated doctrine. Its header criticises the predecessor app for hiding 4 gal per lb, 750 Btu per gal and 15 percent BTEX inside constants. Two of those three are now inputs. It then hides three new ones: 1100 Btu per lb of water overhead, 69.9 lb per ft3 of liquid, and 8.34 lb per gal of water. | no |
| F-C6 | The 970 Btu per lb latent heat the comment names is NOT IN THE CODE. Only the folded 1100 exists, and the split the comment describes cannot be recovered from outside. | no |
| F-C7 | `leanTegWtPct` is range-checked, refused outside 90 to 100, and then NEVER USED. Proven: the package run at 99.0 and at 90.001 returns every field bit-identical. A user can ask for a 0.1 lb/MMscf cryogenic outlet spec on 90.001 weight percent lean glycol, which no glycol can deliver, and get a confident answer. A validated input that moves nothing is worse than an absent one, because the validation asserts that it matters. | **LIVE** |
| F-C8 | `aminePackage` checks in the wrong order, so the more specific message never fires in one direction. A CO2 spec above the CO2 inlet with no H2S reports "no acid gas to remove at these specs" rather than "a spec above the inlet is already met". | no |
| F-C9 | `btexMw` defaults to 92, which is toluene, standing for a four-compound cut. | no |

---

## The golden and oracle layer

This is the second-largest finding after F-E1, and it is the reason the
first one survived.

| id | finding |
|---|---|
| F-O1 | **THREE OF THE FIVE ORACLE ROUTES ARE TRANSCRIPTIONS OF THE ENGINE.** The TEG, amine and contactor routes carry the same constants as the engine (1100, 8.34, 69.9, 28.9625, 10.7316, 14.65, 520, 379.49, 18.01528) and the same expression shapes. The TEG and amine routes' claimed "SI re-derivation" is a multiply by 0.45359237 followed by a divide by 0.45359237: `water_kg_day = removed*gas*LB` and then `waterLbDay = water_kg_day/LB`, proven bit-identical to the engine's `removed*gas`. The contactor route is entirely in field units despite the oracle docstring saying SI. |
| F-O2 | The Joule-Thomson chain has NO golden row, NO oracle route and NO check but a range. |
| F-O3 | `kremserStagesFor` is checked only against its own forward function. A self-inversion is an algebraic identity and validates nothing about either half. |
| F-O4 | `acidMolesDay` is IN the golden and asserted by NOTHING. |
| F-O5 | Eleven engine outputs are un-oracled: `yWater`, `circGpd`, `sensiblePerGal`, `vaporPerGal`, `btexTonsYear`, `richLoadingUsed`, the contactor's computed `z` and `rhoG`, `muFPerPsi`, `dzdT`, and both fields of `jtDrop`. |
| F-O6 | The contactor golden passes `z` IN on every case, so the default correlation branch, which is the branch the Suite actually uses, is exercised by no published case. |
| F-O7 | The 1000 psia warning boundary is untested at the boundary. Case 2 sits at exactly 1000 psia, where the strict comparison means the warning does not fire. |
| F-O8 | The oracle's `water_content` has no guard that the total pressure exceeds the vapour pressure, so a low-pressure case added later would silently produce a mole fraction above one. |
| F-O9 | Dead code in the oracle: `import itertools` inside `kremser_march`, unused, and a docstring describing a geometric-series derivation the function does not use. |
| F-O10 | The gate's comment misplaces the largest Magnus-against-Antoine gap. It says "about 0.6 percent at Antoine's 1 degC band edge"; the 0.638 percent case is at 40 degF, which is 4.4 degC. |

### Negative controls, all run, all recorded

The point of every one of these is that **a gate going green and a gate
examining anything are two separate claims.**

| control | golden regenerated? | result |
|---|---|---|
| the CORRECT Joule-Thomson formula substituted into the engine | n/a, no golden exists | **12 of 12 PASS** |
| contactor liquid density 69.9 to 62.4 | yes, by the oracle | **12 of 12 PASS** |
| TEG water overhead 1100 to 1400 Btu/lb | yes, by the oracle | **12 of 12 PASS** |
| amine water density 8.34 to 9.00 lb/gal | yes, by the oracle | **12 of 12 PASS** |
| `acidMolesDay` multiplied by 1.5 | no | **12 of 12 PASS** |
| water content inflated by 0.9 percent | no | **1 FAILS**, correctly |
| contactor base pressure 14.65 to 14.696 | no | **1 FAILS**, correctly |
| Kremser closed form perturbed by 0.5 percent | no | **2 FAIL**, correctly |

### Two routes that ARE independent and must not be touched

Credit where it is owed, because a repair that "tidied" these would destroy
the only real validation in the file:

- **Water content.** The oracle uses ANTOINE where the engine uses MAGNUS.
  Two different published vapour-pressure fits meeting inside their shared
  band, worst gap 0.638 percent across the four cases against a gate
  tolerance of 1 percent. The negative control proves it discriminates.
- **Kremser.** The oracle solves the stage cascade as a LINEAR SYSTEM by
  Gaussian elimination. Genuinely different arithmetic, agreeing to 1.1e-16.
  The negative control proves it discriminates.

The contrast is the whole teaching point and Section 17 of the digest is
built on it: the two independent ratios sit near one, and the three
transcribed ratios sit AT one to twelve decimals. **Identical to twelve
decimals is a WEAKER result than agreeing to six**, because it is what two
copies of one calculation produce.

---

## The Suite composition layer

| id | finding | LIVE |
|---|---|---|
| F-U1 | `GasProcessingContext` calls ONE `contactorDiameter` for both units, so the amine contactor is sized against glycol (F-C4). On the app's own amine defaults the diameter comes out 4.436 ft where the MDEA solution density gives 4.524 ft, 1.94 percent small. | **LIVE** |
| F-U2 | The dehydration and sweetening contactors are both called WITHOUT a `z`, so the whole live app runs the correlation branch that no published case exercises (F-O6). | **LIVE** |
| F-U3 | `NumberInput` is a bare `type="number"` with no minimum, no maximum and no validation, and `num()` passes any finite value straight through to the engine. That is what makes twenty-one of the findings above LIVE rather than theoretical. `fmt()` renders NaN and Infinity as `--`, so a silent failure is indistinguishable on screen from an empty field. | **LIVE** |
| F-U4 | `DewpointResults` labels a coefficient computed at the INLET pressure only, while the march that produced the temperature beside it used the coefficient at twenty different pressures. The number on screen is not the number the answer used. | no |
| F-U5 | Nothing in the Suite surfaces `dakZ.converged`, so F-E15 and F-E16 have no route to the user even in principle. | no |

---

## Recommended repair shape, for whoever runs FC4-0

In this order, because the later ones depend on the earlier ones being
settled.

1. **F-E1, F-E2, F-E3.** Remove the `/z` from `jouleThomsonFPerPsi` and
   correct the docstring. Then WRITE THE ORACLE ROUTE THAT WOULD HAVE
   CAUGHT IT: an independent numerical `T(dV/dT) - V` over the same
   correlation, and golden rows for `muFPerPsi`, `dzdT`, `t2F` and `dropF`.
   Fixing the formula without adding the route leaves the next error
   equally invisible.
2. **F-O1.** Rewrite the TEG, amine and contactor oracle routes so they do
   not carry the engine's constants. If a constant genuinely has to be
   shared it must be DECLARED as shared in the oracle, with the note that
   the route cannot check it. The SI claim in the oracle docstring must go
   or become true.
3. **F-O3, F-O4, F-O5, F-O6, F-O7.** Golden rows and assertions for every
   un-oracled output, `kremserStagesFor` against the independent cascade,
   `acidMolesDay` asserted, one contactor case with no `z`, and the warning
   boundary read from both sides.
4. **The fails-open and fails-silent list.** Guard every input the engine
   accepts and should not: temperature ordering, the sign of every ratio and
   loading, strengths in 0 to 100, fractions in 0 to 1, a positive integer
   step count, and a temperature above absolute zero. Give
   `kremserFractionRemoved` the module's own contract or document in one
   line why it alone is outside it.
5. **F-C7.** Decide what `leanTegWtPct` is for. Either it constrains the
   achievable outlet spec, or it is removed along with its validation. A
   validated input that moves nothing is the worst of the three states.
6. **F-C4 and F-U1.** The contactor's liquid density becomes an INPUT with
   the glycol value as its default, and the Suite passes the amine table's
   own solution density on the sweetening tab.
7. **F-C1, F-C2, F-C3, F-C5, F-C6.** One standard condition for the file,
   one glycol density, the overhead as an input with its current value as
   the default, and comments that match the code.
8. **F-E15, F-E16, F-U5.** Carry `dakZ.converged` out of both consumers and
   refuse or warn when the correlation is off its band.

## What this recon is NOT

**Nothing in this file is teaching truth.** Every number above describes the
engine AS FOUND, and the repairs will move most of them. A lesson that
quotes this document quotes a state of the world that no longer exists.
The digest is the only source a writer reads, and Section 14 of it is
WITHHELD for exactly this reason.
