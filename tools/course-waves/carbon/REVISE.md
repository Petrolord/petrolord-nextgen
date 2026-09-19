# carbon REVISE: the extension round on engines df31f53 (MD45-1)

The digest was rebuilt on engines df31f53 (engines PR #228, MD45-1, which
repaired recon findings F1 to F7 and the writers' F8 and F9). It grew from 695
to 913 lines. It still has 26 sections, and every section keeps its number and
its owner. **No graded field moved:** fields.json and capstone.json rebuild
byte-identical, and so do the capstone prompts.

This file lists every lesson line that quotes a digest line or engine string
that changed or went away, or that teaches behaviour that changed. Each entry
gives the lesson file and line (at aca842f3), what it says now, and the new
digest line it should point at (line numbers are the new digest's). After
those, it lists the writers' gaps now closed that lessons can use. The lesson
pass applies these fixes. `gate_copy_rule.py` exempts the three retired engine
sentences (A, B and C below) only until that pass; remove the exemption in the
same pass.

## A. Engine strings that were reworded (the copy rule sweep made them clean)

| lesson line | now quotes | new digest line |
|---|---|---|
| beginner/m02-carbon-in-co2-out/l01-the-atom-balance.md:9 | "...conservation of mass, not an empirical factor, so it needs..." | 97: "Atom balance: carbon in equals CO2 out. This is conservation of mass, so it needs no source document." |
| beginner/m06-the-associate-reading/l01-the-igbogene-inventory-end-to-end.md:41 | "This is a quantitative inventory, not a regulatory compliance register. Obligations..." | 215: "This is a quantitative inventory. It is not a regulatory compliance register: obligations, ..." |
| intermediate/m05-steam-condensate-and-the-pinch/l04-condensate-return-and-its-floor.md:34 | "A floor, not the value: ..." | 532: "A floor on the value: Treatment not repeated not priced. ..." |
| intermediate/m06-the-professional-reading/l02-the-isiokpo-steam-and-streams-end-to-end.md:32 | "A floor, not the value: ..." | 532 |
| intermediate/m02-excess-air-and-stack-oxygen/l04-an-oxygen-the-fuel-cannot-reach.md:23-25 (table) and :31 ("states the range as 0 to 20.95 percent") | the old refusal | 382-384: "Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned." The message now states the bound the engine applies; drop the line 31 reading that the printed bound is rounded (W3 is closed). |
| advanced/m01-the-cost-of-a-tonne-abated/l05-one-year-against-a-life.md:11 and advanced/m01-the-cost-of-a-tonne-abated/l03-a-blank-is-not-free.md:13 | "...Comparing a one-off capital cost against a recurring saving makes every measure look expensive." | 660: "...Set against one year's saving, a one-off capital cost overstates the cost per tonne of a capital measure." |
| advanced/m01-the-cost-of-a-tonne-abated/l05-one-year-against-a-life.md:3 ("makes every capital measure look expensive") | the tier's trap sentence | reword to the engine's new sentence (660); hdr_advanced.txt now reads "overstates the cost per tonne of a capital measure" |
| intermediate/m05-steam-condensate-and-the-pinch/l01-a-failed-trap-is-choked-flow.md:42 and :46 (the header clause "much the same steam") | "Choked flow: the loss depends on the upstream pressure and not on what is downstream, ..." | 479: "Choked flow: the pressure ratio 0.1126 is at or below the critical 0.5774, so the loss depends on the upstream pressure alone." Line 46's claim that a trap into a condensate header loses much the same steam now holds only at or below the critical ratio: SECTION 15's downstream table (499-506) shows 5 bar a still choked at 42.3520 kg an hour and 6, 7 and 8 bar a subsonic at 41.4785, 37.5765 and 29.0510. |

## B. Numbers that changed (none graded)

| lesson line | old | new digest line |
|---|---|---|
| intermediate/m01-combustion-from-the-fuel-analysis/l03-inerts-ride-through.md:13 | FUEL_REFERENCE CO2 44.010 | 44: 44.009 (propane 44.097 and butane 58.124 moved too, lines 41-42). Line 48 now says in one sentence that the CO2 row, PRODUCT_MOLAR_MASS.CO2 and MW_CO2 are one number. |
| intermediate/m01-combustion-from-the-fuel-analysis/l02-air-and-the-flue-gas.md:26 | stoichAirKgPerKgFuel 15.612760 | 319: 15.612763 |
| intermediate/m01-combustion-from-the-fuel-analysis/l02-air-and-the-flue-gas.md:53, l04-atmospheric-nitrogen-and-its-argon.md:36 and :40 | out less in -0.000003 | 347: 0.000001 (the fuel's molar mass is now built from the same atomic weights as the flue gas) |
| intermediate/m01-combustion-from-the-fuel-analysis/l04-atmospheric-nitrogen-and-its-argon.md (the ATMOSPHERIC_N2_MOLAR_MASS derivation) | "from the air constants printed above it" | 30: now "derived by the engine from the three air constants above", with the formula printed (W1 closed) |

## C. Behaviour that changed

**The refused flare is now a blocked line (F8).** The lines below say it contributes no line:

- beginner/m03-the-flare-as-an-inventory-line/l02-a-blank-box-is-missing.md:28-30: "the flare contributes no line at all", "the inventory has 3 lines", and "At both steps the reasons ... read the same". Now: SECTION 9, 258-259. The first pass and the GWP-declared step each have 4 lines. The first pass gives "3 line(s) could not be computed" and the GWP-declared step "1 factor(s) have no source or version; 2 line(s) could not be computed", so the reasons no longer read the same. Line 264 says the refusal becomes one blocked line named Flaring, and 267 prints it. New row 271-275: with every other gap closed and only the flare blank, the inventory has 4 lines, totals 40268.048 tCO2e and is NOT reportable. This closes Associate gap 1.
- beginner/m05-lines-factors-and-provenance/l04-computed-and-reportable.md:15-16 (table), :25 ("2 line(s) could not be computed ... The flare is refused and contributes no line at all") and :30 ("The line count goes from 3 to 5 ... The reasons do not change"). Now: 258-259 as above. The count goes from 4 to 5, and the reasons DO change: the flare's blocked line clears when its efficiency is entered.
- beginner/m05-lines-factors-and-provenance/l02-blocked-and-unsourced-lines.md:20-24: "1 factor(s) have no source or version; 1 line(s) could not be computed" at the GWP-declared step now reads "... 2 line(s) could not be computed" (259), and the blocked lines are the flare and the electricity. The first pass has 3 blocked lines, including the flare (264-269).

**The curve verdicts in SECTION 21 (F1, and Expert gap 10).** Rows 1 and 3 are now meetsTarget none, "not assessed: no computed emission to check the claims on ...":

- advanced/m03-interactions-and-over-claims/l04-a-source-with-no-emission-passed.md:20 quotes the retired sentence "A source whose emission is not passed cannot be checked, and the claim against it stands unexamined." Replace it with 753: "Where a claim acts on a source whose emission is not passed, it cannot be checked, the verdict is none and the basis names the source." Line 22 ("The digest prints a target verdict on this third row ... this course teaches none from that row") is now what the engine says (733). Lines 26 and 30 (the claims "stand unexamined" and "without it, the claim is unexamined") should read the engine's own list: uncheckedClaims (737-742) and uncheckedSources (743).
- advanced/m03-interactions-and-over-claims/l01-two-measures-on-one-source.md:42 and advanced/m03-interactions-and-over-claims/l03-a-verdict-left-unassessed.md:38 quote "Where measures only interact, the verdict stands and is labelled an upper bound." The sentence is now 753: "Where measures only interact and every claim is checked, the verdict stands and is labelled an upper bound. ..." The only row that still shows "upper bound: measures interact" is the what-if at 735, where the trap repair is checked against the heaters.
- advanced/m03-interactions-and-over-claims/l03-a-verdict-left-unassessed.md:34 (the forward pointer to the next lesson's case): the digest now prints it as a verdict with the named sources (731, 733, 734).
- advanced/m06-the-expert-reading/l01-the-agbor-programme-end-to-end.md:27 and :41 ("a ranked curve that is an upper bound"): the first row's verdict is none (731); the interaction note (SECTION 20) is unchanged.
- advanced/m06-the-expert-reading/l02-what-is-held-and-what-is-decided.md:32 (the rules table): the over-claim row is unchanged, and the MD45-1 rules follow at 887-900.
- advanced/m06-the-expert-reading/l03-what-the-oracles-check.md:12: the oracle row now says the tuning saving is duty_ledger (exported since MD45-1) and that the trap nozzle's throat sits at the larger of the downstream and critical pressures (909).

**Other rules in force (SECTION 25 gains an MD45-1 table, 887-900).** These lessons quote "SECTION 25 lists" and stay true, but can cite the new rows:

- intermediate/m05-steam-condensate-and-the-pinch/l02-the-isentropic-exponent.md:36
- intermediate/m06-the-professional-reading/l02-the-isiokpo-steam-and-streams-end-to-end.md:56
- intermediate/m04-what-tuning-is-worth/l03-the-safe-oxygen-floor.md:27
- advanced/m04-targets-and-the-path/l04-measures-with-no-start-year.md:18
- advanced/m01-the-cost-of-a-tonne-abated/l03-a-blank-is-not-free.md:30
- advanced/m01-the-cost-of-a-tonne-abated/l04-a-rate-is-a-fraction.md:13

**Line-number references.** The digest grew by 218 lines. A lesson that names a digest line number rather than a section must be re-pointed. The sweep found no "line NNN" reference in the committed lessons; the reference numbers appear only in DIGEST-GAPS.md.

## D. Writers' gaps now closed (DIGEST-GAPS.md), for the lessons to use

| gap | now printed |
|---|---|
| Expert 1, simple payback | 823: implementation cost over one year's value, undiscounted |
| Expert 2, gap and emissions relations | 782 (checked on every row) |
| Expert 3, unscheduled | 794-803: the difference 1850.000 t equals the vapour recovery tonnes, and a year-by-year table |
| Expert 4, partial inventory | 791: the difference 10988.000 tCO2e is the purchased electricity line |
| Expert 5, start years | SECTION 22 start-year table (after the heading) |
| Expert 6, pays-for-itself share | 695: 0.343467 |
| Expert 7, over-claim cost | SECTION 21: net annual cost 484221.51 USD, cost per tonne 51.5129 USD at 9400 t |
| Expert 8, the saving's abatementCost | 824: CRF 0.18744402, annualised capital, net annual cost, paysForItself true, and priceSaving passes its life and rate |
| Expert 9, intensity formulas | 852 |
| Expert 10, row 1 verdict | 731 (see C) |
| Expert 11, the life refusal wording | 660 (see A) |
| Associate 1, the refused flare | 258-275 (see C) |
| Associate 2, header precision | header PRECISION line: molar masses to three, ATMOSPHERIC_N2 and a mixture molar mass to four, kmol per kmol fuel to six, saving fraction to ten |
| Associate 3, two CO2 molar masses | 48 (now one number) |
| Associate 4, flare carbonKmolPerYear | 152: 50820.000 |
| Associate 5, line formula and scope sums | 211 |
| Associate 6, blanked intensity equals Scope 1 intensity | 305 |
| Professional P1, per-component O2 demand | 328-336 |
| Professional P2, air, flue gas and water relations | 336 onward and 367-376 |
| Professional P3, the loss ledger | 410 |
| Professional P4, the dry loss by basis | 411 |
| Professional P5, a CO case | NOT closed: the engine models complete combustion only |
| Professional P6, trap relations | 493 |
| Professional P7, the cascade rule, balance check and heat recovered | 570 and 592 |
| Professional P8, function labels | every section except 25 and 26 opens with "Engine functions behind this section: ..." |
| W1, W2, W3 | 30, the header, 382 |
| Panels 3, composite curves | 576-591 (compositeCurve; no oracle recomputes it) |

New teaching material the lessons may use:
- The heating value basis is read without regard to case or spaces (424). An unknown basis, a blank basis, a negative radiation loss and a negative unburned loss are refused (419-422).
- A GWP of zero or below is refused (86-87).
- A negative activity or factor blocks its line (285-290).
- A refused measure is named in refusedMeasures, with refusedNote (SECTION 19, 667 onward).
- Over-abatement of the baseline is refused (805).
- The trap's downstream pressure, pressure ratio, critical ratio and choked flag, and the three downstream refusals (SECTION 15, 495-511).
- A condensate target below the current return is refused (539).
- The molar masses are built from ATOMIC_WEIGHT, with PRODUCT_MOLAR_MASS and ATMOSPHERE_BAR_A (SECTION 1, 32-34).
