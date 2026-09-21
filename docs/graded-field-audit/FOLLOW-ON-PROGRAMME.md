# B5 group 3: costed follow-on programme

Status: APPROVED 2026-09-21. The owner approved all seven decisions (D1 to D7) as recommended ("Follow your recommended options for the seven decisions"). Building starts with W1. Written 2026-09-21 after the owner chose to finish the small B4/B5 items now and to cost group 3 as its own programme.

Sources: this folder (`README.md`, `fields.json`, `annot/<course>.json`), `docs/answer-length-audit/README.md` ("Owner decisions raised"), the panel probe output `/root/b5/probe/`, and a read-only look at the Suite files named below. Every count here is recomputed from `fields.json` on main b9e3683b9.

Effort is in agent-days (d). S is up to 0.5 d, M is 0.5 to 2 d, L is over 2 d. Estimates include the gate or test that proves the change and the migration where one is needed. They exclude owner apply and upload time.

## Owner decisions

Only the choices that need the owner. Each has a recommendation.

| # | Decision | Options | Recommended (all APPROVED 2026-09-21) |
|---|---|---|---|
| D1 | Route per course for the 188 unobtainable fields (§1) | (a) publish inputs in the prompt; (b) typed "your case" panel mode | Approve the §1 table as written. It follows the README except **gaswell**, moved to (a): stating z at each station makes every gaswell field a taught closed form, moves no graded value, and costs 0.5 d against about 3 d for three panel modes. |
| D2 | `panelCapstoneGuard` policy once panels take typed input (§1 route b) | keep "no panel can reach the capstone case"; or change to "no panel **default** state lands on a graded answer" | Change to the default-state rule. Typing the case is the work the capstone asks for. The guard keeps catching preloads. |
| D3 | How Suite apps show course precision (§2) | raise printed decimals in product cards; add a per-app "Full precision" toggle (off by default) that prints graded quantities at 6 significant decimals; or loosen tolerances to what the app prints (FC6 rule) | A shared "Full precision" toggle in the 12 Suite apps. Product cards stay as they are for Suite users. FC6 tolerance only for fiscal (reviewer tolerances already written, 8 fields). |
| D4 | The 295 answers printed before the learner works (§3) | (A) re-case onto an unpreloaded case and strip walkthroughs; (B) strip walkthrough values and move panel defaults off the case, same keys; (C) declare open-book | C now for all 21 courses as an honest interim label (1 d). Then A for the 43 tiers where every field leaks, B for the 13 tiers where some do. |
| D5 | Re-keying a tier that already has capstone attempts (welldata beginner has 7) | hold the tier; or sign it off per tier | Per-tier sign-off: the migration names the tier in an explicit allowlist, lists the attempt ids, and never touches stored scores. Every other tier keeps the refuse-if-attempts guard. |
| D6 | The 8 held tightenings (§4) | apply; drop | Apply all 8, each behind the attempts guard. Each one closes a default or wrong-method value that passes today. |
| D7 | Finals that restate module questions (§5) | keep as reprise and label them; full rewrite; one-third rule | One-third rule: 14 of each 42-question final become transfer items on a case the modules never work. The rest may stay reprise. |

## Totals and wave order

| Wave | What | Items | Effort | Re-keys live fields |
|---|---|---|---|---|
| W0 | Prerequisites (owner): B4 pending files and the B5 tolerance migration applied; `apply.sh attempts --prod` listing captured | none | 0 d agent | no |
| W1 | Grade-integrity quick wins: petrophysics auto-submit, 17 guessable replacements, 8 tightenings, seismolord tune40, sim, scal, rodpump, gasprocessing beginner; open-book labels on 21 courses | §4, §3 C | 7 d | yes (attempts guard) |
| W2 | Publish inputs in prompts and lessons (route a) | §1 (a) | 6 d | no |
| W3 | Suite "Full precision" toggle and print fixes, two as-of inputs, fiscal FC6 tolerances | §2, §1 Suite rows | 11 d | fiscal loosens only |
| W4 | NextGen typed-case panel modes (route b) and panel print fixes | §1 (b), §2 panels | 19 d | no |
| W5 | Leak re-case (A) and strip (B), carrying W1's new keys | §3 | 50 d | A yes; B no |
| W6 | Finals one-third rewrite, after B4's bank recut is applied | §5 | 16 d | no (bank items) |
| | **Total** | | **about 109 d** | |

W1 to W3 (24 d) remove every "pass without working" and every "cannot be worked" that a prompt or print change can fix. W4 and W5 are the heavy build.

**Rules for every wave**
- Every file that changes a live `expected` or tightens a `tol` repeats the guard in `migrations/20260921_lesson_leak_grader_tolerances.sql`: it counts `academy_capstone_attempts` on its tiers and refuses if any exist, unless D5 allowlists the tier.
- Migrations are content-addressed on the published key and tolerance, idempotent, proven on the local scratch replay with `audit.py --post`, and logged PENDING in MIGRATIONS.md. The owner applies them. Nothing here touches production.
- Prompt-only changes keep key, expected and tol, so they re-score nobody. They still ship as content-addressed migrations.
- `audit.py` is updated per wave so a fixed field moves to its new class and the gate stays green.
- Suite changes reach learners only with a Suite zip; NextGen changes only with a NextGen zip.

## §1 Fields with no route to the answer (188)

Route (a) publishes the inputs so the key becomes hand or spreadsheet work. Route (b) adds a typed "your case" mode to the tier's panel, printing at the graded precision, with no capstone preset. Neither route moves a graded value, so neither needs the attempts check.

| Course | Tiers (fields) | Route | Why | Repos | Effort | Wave |
|---|---|---|---|---|---|---|
| integrity | beg 2, int 6, adv 6 (+4 prompt-given counts, §4) | a | The rosters, annulus inputs and P&A geometry exist only in `/root/dr-wip-integrity/dr11_fields.mjs`. Once published, every field is a closed form at the current tol. Also fix the advanced `program_slurry_takeoff_m3` wording and cut the beginner summary counts. | NextGen capstone prompt | M 1 | W2 |
| wellcost | beg 6, int 6, adv 6 | a | The MERLIN A-12 case lives only in `dr12_fields.mjs`. Beginner and intermediate are spreadsheet work once published. Advanced risked fields also need a downloadable case file for the Suite Well Cost and Time studio with its seed, and `RiskTab.jsx:24, :171` at full precision (behind D3's toggle). | NextGen prompt; Suite | M 2 | W2, W3 |
| nodal | int 6, adv 6 | a | State `bhp(q) = pWh + 3835 / (1 + q/600) + 0.000238 q^2` and the 49-point spacing. The form is already taught. | NextGen prompt | S 0.5 | W2 |
| gaswell | beg 6, int 6, adv 4 | a (README said b) | Every field needs DAK z and nothing else the lessons omit. z per station in the prompt makes Turner, Coleman and plunger closed forms hand-calc. | NextGen prompt | S 0.5 | W2 |
| cementing | adv 2 | a | State E x I = 12266792.85346564 N m2. | NextGen prompt | S 0.25 | W2 |
| cementing | int 6 | b | Placement march and bisections are engine-only. "Your job" mode on `PlacementExplorer.jsx`. | NextGen panel | M 1.5 | W4 |
| stimulation | beg 1 | a | State frac and reservoir pressure at 2033.000 m TVD. | NextGen prompt | S 0.25 | W2 |
| separation | adv 2 | a | State the ADANGA yard offsets. Print the shortfall fraction to 6 dp in Facility Layout Mapper `SpacingPanel.jsx:179`. | NextGen prompt; Suite | S 0.5 | W2, W3 |
| linesizing | int 4 | a | Print the Weymouth and Panhandle B forms (constants 433.5, 737) in int m02 l01/l02. A spreadsheet then reproduces all four. | NextGen lesson | S 0.5 | W2 |
| heattransfer | int 1 | a | Write the equivalent single-shell P conversion into int m02 l01 (one line). | NextGen lesson | S 0.25 | W2 |
| producedwater | beg 1 | a | State the 15.56 C reference. | NextGen prompt, lesson | (in row below) | W2 |
| producedwater | beg 4, int 3, adv 6 | b | The water fits and the 60-bin train are engine-only. "Your stream" mode on Water, Device and Train explorers. | NextGen panels | M 2 | W4 |
| hydraulics | beg 4, int 5, adv 6 | b | Pipe, annulus, cleaning and surge all need the capstone mud. Add dial readings and density inputs to the three explorers, and teach the yield rule in beg m02 l04. | NextGen panels, lesson | M 1.5 | W4 |
| gaslift | beg 6, int 6, adv 6 | b | DAK z, 96-step march, valve design on a port catalogue: engine-only. Case modes on Column, Valve and Unloading explorers, printing z at 8 dp. | NextGen panels | L 3 | W4 |
| network | int 6, adv 5 | b | An 8-unknown looped turbulent solve. Editable network on Network and Fight explorers. | NextGen panels | L 3 | W4 |
| rodpump | int 5, adv 6 | b | Wave-equation march, balancing and Gibbs outputs. Editable inputs on Card and Balance explorers. | NextGen panels | L 2.5 | W4 |
| geomech | int 6, adv 6 | b | Theta scan and bisection. Parameter inputs on Stability and Window explorers, plus a collapse-at-tightest tile. | NextGen panels | M 1.5 | W4 |
| torquedrag | beg 4, int 6, adv 3 | b | The lab already takes `mudDensityKgM3`. Add a mud box to three explorers and print N and N.m finely. | NextGen panels | M 1 | W4 |
| perfsand | adv 4 | b | Add top and bottom MD to the Sanding view; the engine already accepts them. | NextGen panel | S 0.5 | W4 |
| gasprocessing | adv 1 | b | Make `ColdEndExplorer.jsx` inputs editable (it already prints 9 to 12 dp). | NextGen panel | M 1 | W4 |
| casingtubing | beg 1 | b | Add 0.55 to the axial fractions and print Pa as integers (same change as §2). | NextGen panel | S 0.25 | W4 |
| welldesign | int 1 | b | Add a north-north variance tile to `UncertaintyExplorer.jsx:56`. | NextGen panel | S 0.25 | W4 |
| fdp | adv 2 | Suite | Project Management Pro pins as-of to today. Add an as-of input (`ProjectManagementPro.jsx:111`) and print PV to whole USD. | Suite | M 1 | W3 |
| fiscal | int 1 | Suite | Print total tax per regime in the Designer (`ResultsPanel.jsx:129-166`). | Suite | S 0.5 | W3 |
| relief | beg 2, adv 1 | Suite | Print the critical pressure ratio and the choked floor at 6 dp (`PsvResultsPanel.jsx:46`, `BlowdownPanel.jsx:52`). | Suite | S 0.25 | W3 |
| uncertainty | adv 1 | Suite | Export the sorted Monte Carlo sample (`npv/ResultsPanel.jsx:57-86`). | Suite | (in §2) | W3 |
| earthmodel | adv 1 | tile + tightening | See §4. | NextGen panel | (in §4) | W1 |
| gasprocessing | beg 1 | re-key | See §4. | NextGen | (in §4) | W1 |
| sim | int 1, adv 1 | re-case | See §3. | NextGen | (in §3) | W5 |
| **Total** | **188** | | | | **about 26 d** | |

Engines: no change expected. Each route (b) panel calls functions the vendored engines already export. The build checks each export first; a missing one becomes an engines PR and a re-vendor.

## §2 Display misses (86 flagged, plus 16 display-class fields that print too coarsely)

"Suite print" means the D3 toggle prints the listed quantities at 6 significant decimals (money in $MM to 4 dp). "FC6" means the prompt's instructed precision is lowered to what the app prints and tol set to half a unit of it. None of these re-keys a field; FC6 only loosens.

| App | Fields | Suite file(s) | Suite print change | FC6 alternative | Pick | Effort |
|---|---|---|---|---|---|---|
| rotating: Pump and Compressor Station Designers | 11 | `pumpstudio/PumpPanels.jsx:101-110, :241-260`, `compressorstudio/CompressorPanels.jsx:121, :152, :204` | duty flow, head, hp, kW, poly head, gas hp, fuel | tol 0.5 gpm and 0.5 ft on a pump curve read loses the speed-law lesson | Suite print | M 1 |
| portfolio: Capital Portfolio Studio, AFE | 10 | `capitalportfoliostudio/OptimizationResults.jsx:13, :53-65, :130`, `afe/AFEDashboard.jsx:39, :57, :115` | $MM to 4 dp; CPI to 5 dp; as-of date input for SPI | whole $MM cannot separate the limits; SPI stays unreachable without the as-of input | Suite print + as-of | M 1.5 |
| decision: Decision Tree Builder, Decision Studio | 8 | `DecisionTreeBuilder.jsx:26`, `decisionstudio/briefModel.js:87-89` | fmtMM to 4 dp | the rollback is hand-taught, so FC6 would be workable | Suite print (one formatter) | S 0.5 |
| separation: Separator Studio | 4 open (3 shipped as tol in B5; 2 in §1) | `separatorstudio/SeparatorPanels.jsx:123, :126, :190, :262` | density, actual flow, diameter, height | prompt asks 4 dp | Suite print | S 0.5 |
| crude: Product Blending Optimizer | 6 | `blendoptimizer/RecipeResults.jsx:55, :197`, `PoolPanel.jsx:58` | cost, volumes, shadow prices to 4 dp | shadow prices at 2 dp lose the relief ranking | Suite print | S 0.5 |
| uncertainty: NPV Scenario Builder, Breakeven Analyzer | 6 flagged + 8 display | `npv/ResultsPanel.jsx:22, :225-231, :321-324`, `breakevenanalyzer/ResultsPanel.jsx:67` | $MM to 4 dp in cards and cashflow; breakevens and tornado to 4 dp; sample export | compact "$45M" cards cannot carry any course tol | Suite print | M 1 |
| fdp: FDP Accelerator, Project Management Pro | 5 open (irrReason shipped, Suite #553) | `fdp/modules/wells/WellInventory.jsx:50`, `FacilitiesCostEstimation.jsx:19-42`, `SnapshotCard.jsx:88` | whole-USD well cost; facilities to 4 dp; SPI to 6 dp (as-of input from §1) | a 37500 USD well-cost miss has no sane tol | Suite print | S 0.5 |
| relief: Relief and Flare Studio | 5 | `reliefstudio/PsvResultsPanel.jsx:35`, `BlowdownPanel.jsx:47` | areas to 6 dp; blowdown seconds | prompt asks 6 dp | Suite print | S 0.25 |
| gasprocessing: Gas Processing | 3 (adv) | `gasprocessing/SweeteningDewPanels.jsx:130-149` | dew-point chain to 6 dp | primary route is the NextGen panel in §1 | Suite print as backup | S 0.25 |
| linesizing: Line Sizing | 3 + 1 display | `linesizing/SizingPanel.jsx:27, :31, :41` | f to 10 dp, drops and p2 to 6 dp, a friction-drop stat | f at 4 dp against tol 1e-9 | Suite print | S 0.25 |
| carbon: Energy Efficiency | 1 | `energyefficiency/CombustionResults.jsx:72, :120` | efficiency to 4 dp | | Suite print | S 0.1 |
| heattransfer: Heat Exchanger | 1 + §1 | `heatexchanger/SizingPanels.jsx:160-166` | P, R, F to 6 dp | | Suite print | S 0.1 |
| refinery: Refinery Planning | 1 display | `refineryplanning/PlanResults.jsx:98` | utilisation to 2 dp | hand route exists | Suite print | S 0.1 |
| rodpump: Rod Pump | 2 | `rodpump/UnitPanel.jsx:92`, `LoadsPanel.jsx:90` | stroke to 6 dp | | Suite print | S 0.1 |
| fiscal: Fiscal Designer | 8 | `fiscaldesigner/ResultsPanel.jsx:144-236` | full-precision ledger export | reviewer tolerances 0.05 and 0.1 already written | FC6 (skip if taken in the small-items pass) | S 0.5 |
| shared toggle | all Suite rows | new shared component plus per-app wiring and jest tests | | | build once first | M 1.5 |
| casingtubing (NextGen panel) | 4 | `panels/casingtubing/RatingExplorer.jsx:17, :23, :92` | Pa to the integer, D/t to 10 dp, 0.55 fraction | tol would need 500 Pa | panel print | S 0.25 |
| consequence (NextGen panel) | 2 | `panels/consequence/FireExplorer.jsx:146` | Heat view driven by the learner's pool inputs | tol about 2.5e-9 throws the chain away | panel change | M 1 |
| stimulation | 1 | | solved by §1 (a) | | | |
| **Total** | **86 + 16** | | | | | **about 11 d** |

Suite work is read-only in this programme's planning pass. Each Suite row is its own branch and PR in the Suite repo, merged before the Suite zip that carries it.

## §3 Answers printed before the learner works (295 fields, 21 courses)

"Default" is the number of leaked fields the probe finds on a panel's first render (a match within tol, so indicative). The rest are printed by the tier's walkthrough or "story so far" lesson.

- **A, re-case (FC-wave pattern):** a new case the panels do not preload; keys regenerated from the vendored engine; walkthrough values stripped; `panelCapstoneGuard` and the leakage gate extended to the course. Re-keys every field on the tier, so the attempts check applies. About 1 d per tier.
- **B, strip:** walkthrough values replaced with a worked teaching case; panel defaults moved off the capstone case. Same keys, no attempts check. About 0.5 d per tier.
- **C, open-book label:** one sentence on the capstone brief and the course page. About 1 d for all 21 courses, done in W1 and removed as each course is re-cased.

| Course | Leaked / fields | Default | Pick | Effort |
|---|---|---|---|---|
| reservoircalc | 18 / 18 | 18 | A all tiers | L 3 |
| rockphysics | 19 / 19 | 18 | A all tiers | L 3 |
| earthmodel | 18 / 18 | 17 | A all tiers | L 3 |
| porepressure | 18 / 18 | 16 | A all tiers | L 3 |
| welldata | 18 / 18 | 14 | A all tiers (beginner needs D5 sign-off) | L 3 |
| mapping | 18 / 18 | 13 | A all tiers | L 3 |
| wellcorrelation | 18 / 18 | 11 | A all tiers | L 3 |
| basin | 18 / 18 | 10 | A all tiers | L 3 |
| petrophysics | 18 / 18 | 10 | A all tiers | L 3 |
| dca | 18 / 18 | 9 | A all tiers | L 3 |
| sim | 18 / 18 | 8 | A all tiers (annotation: re-case on a new contact, toe or booking target) | L 3 |
| waterflood | 18 / 18 | 7 | A all tiers | L 3 |
| fluid | 18 / 18 | 6 | A all tiers | L 3 |
| scal | 14 / 18 | 11 | A beginner; B intermediate, advanced | M 2 |
| mbal | 13 / 18 | 6 | A beginner; B intermediate, advanced | M 2 |
| welltest | 9 / 18 | 5 | A beginner; B intermediate, advanced | M 2 |
| seismolord | 8 / 18 | 8 | A beginner; B advanced | M 1.5 |
| welldesign | 8 / 18 | 6 | B all three tiers | M 1.5 |
| perfsand | 5 / 18 | 0 | B advanced (lesson only) | S 0.5 |
| completion | 2 / 18 | 2 | B beginner | S 0.5 |
| wellcontrol | 1 / 18 | 0 | B beginner | S 0.5 |
| **Total** | **295** | | 43 tiers A, 13 tiers B, C on all 21 | **about 50 d** |

Order inside W5: most panel-default leaks first (a learner sees the answer without reading), then the rest. Every course here is an older Ekene or typewell course; the FC, EC and H waves need nothing.

## §4 Guessable fields and held tightenings

All rows re-key or tighten a live field, so every file carries the attempts guard. Where a course is later re-cased (§3), W5 keeps these new keys.

| Course / tier | Field | Now | Replacement or change | Repos | Effort |
|---|---|---|---|---|---|
| petrophysics / beg | whole capstone | auto-submitted (`PetrophysicsLearningPage.jsx:130`) | typed answers like every other tier | NextGen page | M 1 |
| petrophysics / int | `pickett_a_rw`, `pickett_m` | fit returns the given 0.05 and 2 | fit over 2072 to 2078 m: 0.68869 and 0.87845 | NextGen DB | S |
| petrophysics / adv | `sw_waterleg_mean` | 1 passes | tol 0.005 to 0.0005 (held tightening) | NextGen DB | S |
| petrophysics / int, adv | `phind_avg_sand_a`, `phiw_avg_sand_a`, `rw_arps`, `rwe_ssp` | wrong-method value and known 0.05 pass | tol 0.005 to 0.002; 0.0005 to 0.00005 (held) | NextGen DB | S |
| seismolord / int | `bulk_shift_ms` | prompt and subtitle state 8 ms | drop the lag from prompt and `ShiftExplorer.jsx:55` | NextGen prompt, panel | S |
| seismolord / int | `corr` | exactly 1 | zero-lag correlation 0.621742, tol 0.0005 | NextGen DB | S |
| seismolord / adv | `tune40_amp` | identical to `tune25_amp` | amplitude at a stated wedge thickness at 40 Hz (author picks one that differs), read from `WedgeExplorer.jsx` at 10 dp | NextGen DB | S |
| mbal / beg | `r_squared` | exactly 1 | `eo_last_rb_stb` 0.0158974810175952, tol 5e-5 | NextGen DB | S |
| mbal / int | `pot_r2` | 1 passes | tol 0.002 to 1e-4 (held) | NextGen DB | S |
| mbal / adv | `a111_index_sum` | 1 by definition | `a111_ddi` 0.438545199391884 | NextGen DB | S |
| mapping / int, adv | `iso_live`, `live_with_e7` | re-grade 201 | live nodes above the well mean; depth at P-1 with Ekene-7 | NextGen DB | S |
| integrity / beg | four as-found counts | given in the prompt | cut the summary when the rosters are published (§1) | NextGen prompt | (in §1) |
| rockphysics / adv | `gas_class` | 1 of 4, slug names it | largest brine Shuey error 0.005972 | NextGen DB | S |
| wellcorrelation / beg, int | two well counts | 1 of 4 | TOP_B displayed depth; shallowest flattened depth | NextGen DB | S |
| earthmodel / adv | `krige_probe` | naive mean passes | new tile at 6 dp; tol 0.001 to 0.0002 (held) | NextGen panel, DB | S |
| earthmodel / adv | `krige_at_w1` | prompt-given | porosity jump across the fault on y = 2200 | NextGen DB | S |
| waterflood / int | `hall_ratio_e4` | a default tile (1.4304) passes | tol 0.002 to 0.0005 (held) | NextGen DB | S |
| scal / adv | `fitted_nw` | recovers its plant 2.5 | fit on the 3-dp printed grid, new fit-mode tile in DesignExplorer | NextGen panel, DB | M 1 |
| rodpump / beg | `string_natural_freq_spm` | product of two prompt numbers | drop the two figures from the prompt; editable string explorer | NextGen prompt, panel | M 1 |
| sim / adv | `validator_rules_refused` | equals the fixture count | validator error messages across the seven cases (8) | NextGen DB, lesson | S |
| gasprocessing / beg | `btexTonsYear` | untaught, Suite 1 dp | `reboilerMMBtuHr` from the worked lesson | NextGen DB | S |
| **Total** | 17 guessable + 8 tightenings + 5 others | | | | **about 5 d plus 1 d for the migrations and `audit.py --post`** |

## §5 Finals that restate module questions

Courses: sim, fluid, rockphysics, reservoircalc, geomech, wellcorrelation, corrosion. Each has three 42-question finals (882 questions).

| Option | What | Repos | Effort |
|---|---|---|---|
| Keep and label | finals declared a module review | NextGen course copy | S 0.5 |
| One-third rule (pick) | 14 per final (294 questions) become transfer items on a case no module works; the rest may be reprise; the duplicate heuristic becomes a gate for these 7 courses | NextGen banks (seed migrations), gates | L 16 (0.75 d per tier) |
| Full rewrite | every final question new | NextGen banks | L about 45 |

Bank items are not capstone fields, so no attempts check applies. Stored quiz scores are never recomputed. W6 starts only after B4's bank recut is applied, and each new item passes the answer-length and leakage gates.
