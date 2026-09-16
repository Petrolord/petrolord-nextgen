# FC4 Gas Processing. Recon.

The engine, its validation layer, the Suite app that composes it, and the
scope seams against the live NextGen catalogue. Written before a lesson
exists, which is the point.

**READ THIS FIRST IF YOU ARE ABOUT TO WRITE ANYTHING.**

This file and `FINDINGS.md` describe the engine AS FOUND, before FC4-0
repaired it. **Repair history is not teaching truth.** What the engine used
to do is true of the WORK and is absent from the digest. The digest is the
only source a lesson quotes.

**FRAMED HISTORY IS CURRICULUM. UNFRAMED HISTORY IS A DEFECT.** You may teach
what this engine used to do, provided you say that is what you are doing.
Digest **Section 20** is the one section whose subject is history, framed in
its own title and first line, and `Expert m05 l01` owns it with the frame in
its heading. Nothing else in the digest is history.

**THE THIRD SOURCE, which nothing can gate.** The repaired
`engines/facilities/gasProcessing.js` carries comment lines describing its
own former behaviour, and there are dozens across the vendored engines,
because a good repair records what it changed. **Digest Section 20 counts
them by reading the source and states the rule it counted with**, so the
figure is checkable rather than quoted. A sibling course carries 12
history instances in its lesson text, five of them H2 headings, traced to a
changelog block in one engine file. **Engine source comments are provenance
on exactly the same terms as this file.** The danger is not the subject. It
is that a sentence lifted out of a comment arrives with no frame around it,
and a writer cannot frame what they did not know was history.

FC4-0 is merged (engines `82ec6d4`) and vendored. Digest Section 14, which
was withheld and printed nothing rather than printing behind a banner, is
built. **No lesson ever took a wrong Joule-Thomson number, which is what the
withholding bought.**

---

## 1. What the engine is

`engines/facilities/gasProcessing.js`, 277 lines, eleven exports, one import
(`engines/production/gasProperties.js`, for the Sutton pseudo-criticals, the
DAK compressibility correlation and the Rankine door).

It conditions a gas stream in three unit operations:

| unit | what it answers | exports |
|---|---|---|
| water content | how much water a gas carries at line conditions | `waterSatPsia`, `saturatedWaterContent` |
| staged absorption | how many stages a removal spec demands, and what a given column removes | `kremserFractionRemoved`, `kremserStagesFor` |
| dehydration | glycol circulation, and a reboiler duty assembled from named parts | `tegPackage` |
| sweetening | amine circulation and regenerator duty from an acid gas mole balance | `AMINES`, `amineOf`, `aminePackage` |
| vessel sizing | the contactor diameter by Souders-Brown | `contactorDiameter` |
| dew point | the Joule-Thomson coefficient and the temperature after a let-down | `jouleThomsonFPerPsi`, `jtDrop` |

**The doctrine it was written against, in its own header:** everything that
is a design choice or a chart value is an INPUT with its customary range
named, and everything computable from first principles is computed. It names
the three constants the predecessor app hid: 4 gal per lb, 750 Btu per gal,
15 percent BTEX. Two of those three are now inputs. The doctrine is the most
interesting thing about the module and it is also the thing the module
breaks three times (FINDINGS F-C5).

**What is not in it:** no hydrate boundary, no compositional flash, no
rate-based absorber, no stage efficiency, no molecular sieve, no
refrigeration, no NGL recovery, no turboexpander.

## 2. What the validation layer is

- Golden: `test-data/facilities/goldens/gasprocessing_cases.json`, 13 cases
  across four blocks (water 4, kremser 5, teg 2, amine 2, contactor 2).
- Oracle: `tools/validation/facilities/oracle_gasprocessing.py`, 192 lines,
  stdlib only, writes the golden.
- Gate: `__tests__/facilities.gasprocessing.test.js`, 12 tests, all green.

**Two of the five oracle routes are genuinely independent and three are
transcriptions of the engine.** Eight negative controls were run to establish
which is which; they are tabulated in `FINDINGS.md`. The short version: the
water content is checked against a DIFFERENT published vapour-pressure
equation and the Kremser relation against a linear-system stage cascade, and
both discriminate. The TEG, amine and contactor routes carry the engine's own
constants and expression shapes, and regenerating the golden after changing
any of them leaves the suite green at 12 of 12.

**One whole routine has no published case at all**, and that is where the
worst defect in the module was found.

## 3. What the Suite composes

Route `/dashboard/apps/gas-treating-dehydration`.

- `src/contexts/GasProcessingContext.jsx`, 312 lines: three `useMemo` blocks,
  one per tab, each calling the engine directly. A saved study is inputs only
  and every derivation is live.
- `src/components/gasprocessing/DehydrationPanels.jsx` and
  `SweeteningDewPanels.jsx`: the three tabs' inputs and results.
- `src/components/gasprocessing/fields.jsx`: `NumberInput`, `fmt`, `Stat`.
- `src/pages/apps/GasTreatingDehydration.jsx`: the shell.

Read for org scoping, save/load and error handling: it is a clean studio-kit
app and none of those are findings. **Every Suite-layer finding is about the
INPUT SURFACE**: `NumberInput` is a bare `type="number"` with no bounds, and
`fmt()` renders a non-finite result as `--`, which is the same thing it
renders for an empty field. That combination is what turns most of the
engine's missing guards from theoretical into LIVE.

## 4. Scope against the live catalogue

Checked against all 47 live course slugs in `src/content/courses`, the bank
seeds in `migrations/*.sql`, and the unmerged `linesizing` branch.

### Free and clear. No existing course teaches any of this.

TEG and glycol dehydration as a unit operation; the water content of natural
gas; the Kremser relation, the absorption factor and theoretical stages;
amine sweetening in every form, the three amines, acid gas loading, the
loading swing, amine circulation and regenerator duty; BTEX in a still
overhead; molecular sieve and adsorption dehydration; refrigeration,
turboexpanders and C3-plus recovery; stripping gas. The terms `Kremser`,
`absorption factor`, `contactor`, `sweeten`, `acid gas`, `MDEA`, `BTEX`,
`reboiler`, `McKetta`, `molecular sieve`, `water content` and `Antoine`
return ZERO hits across the whole live catalogue.

### Three real collisions, and how FC4 stands off each

**1. Souders-Brown is owned by `separation` (FC1).** That course owns the
equation, the six published K rows, the mist extractor that sets them, the
vertical-vessel diameter step, and the held-for-literature critique of
borrowing a settling velocity for the horizontal gas length. Paths in
`src/content/courses/separation/beginner/m04-settling/l03-souders-brown.md`
and `m03-the-k-value/`.

> **FC4 does not re-derive it.** Professional m05 teaches the CONTACTOR's own
> duty, which is a mass transfer column rather than a knockout drum, the gas
> density the correlation gives at contactor pressure, and the liquid the
> engine assumes it is sizing against. It cites `separation` for the
> equation. Digest Section 12 opens by saying so in as many words.

**2. Joule-Thomson is owned by `flowassurance` (PD6).** An entire five-lesson
advanced module, `src/content/courses/flowassurance/advanced/m01-joule-thomson/`,
covering the coefficient, mu times delta P, and a critique of applying the
term undamped along a flowline.

> **This is a SEAM, not a collision, and it is the best thing FC4 has.**
> `engines/production/flowlineThermal.js` takes `jtCoeffFPerPsi` as a USER
> INPUT and never computes one. `gasProcessing.js` is the ONLY module in the
> whole package that computes a Joule-Thomson coefficient. So FC4's Expert
> tier does not re-teach mu times delta P: it teaches where the number
> flowassurance asks a caller to TYPE actually comes from, and starts from
> the plant application, a let-down into a low temperature separator.
> **This is also why F-E1 matters beyond one app: FC4 will be the course
> that tells a learner what number to type into the other one.**

**3. Hydrates are owned by `flowassurance`.** Subcooling, Hammerschmidt,
Nielsen-Bucklin, the inhibitor dose, the injection rate, lean strength.

> **And it explicitly REFUSES to compute a hydrate boundary of its own.**
> That leaves FC4 a clean opening rather than an overlap: dehydration is the
> OTHER answer to the same question. Taking the water out and injecting an
> inhibitor are two routes to one margin, and the seam between them is a
> course boundary. Digest Section 16 states the hand-off in both directions.

### One soft collision

"Dew point" already means the SATURATION PRESSURE OF A RESERVOIR FLUID in
`fluid` advanced m02. FC4 must disambiguate on first use: water dew point,
hydrocarbon dew point and the PVT dew point are three different things and a
learner arrives with the third.

### One adjacency worth one cross-reference

`gaslift` beginner m02 teaches the Wichert-Aziz sour-gas compressibility
correction, which is the only other place in the catalogue where CO2 and H2S
mole fractions do any arithmetic. Worth a single line when acid gas loading
is introduced, and nothing more.

## 5. Panels

`src/content/courses/panelRegistry.js` carries three `fc-` facilities panels
today (`fc-separator-explorer`, `fc-layout-explorer`, `fc-slug-explorer`),
all FC1's. FC4 registers three new ones over one lab. See `PANELS.md`.

## 6. What state this wave is in

- Re-vendored at engines `82ec6d4`, the FC4-0 repair. **The closure was ten
  paths, not four**: the repaired engine imports the DAK validity band from
  `separatorSizing.js`, which pulls FC1's engine, golden, oracle and suite
  with it, plus two findings records. Proven sha-identical three independent
  ways (git blob hash, `cmp` byte compare, sha256) and walked as an import
  closure inside the vendored tree.
- Vendoring guard clean over 551 paths, ledger carries five new pinned rows.
- Vendored gate green **47 of 47**, up from 12. The separator suite it now
  shares a module with is green at 63 of 63.
- Digest rebuilt, 675 lines, **19 sections, Section 14 BUILT**.
- Seven gates green with counts (see `wave.json`), each proven by a negative
  control.
- **NOT ONE LESSON WRITTEN.** All 78 are now writable.

### What the re-vendoring moved

Fourteen of the eighteen graded capstone fields moved, every one with a cause
`gate_movement.mjs` measures rather than asserts. Eleven moved by the
standard-base factor alone, one by that factor amplified by a typed spec, and
the Joule-Thomson chain by its own two causes compounded. Four held
bit-identical. The full table is in the gate's own output.
