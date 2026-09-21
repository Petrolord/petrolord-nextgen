# gasvalue REVISE: the extension round on engines df31f53 (MD45-1)

The digest was rebuilt on df31f53 and extended. It grew from 895 to 1030
lines and still has 36 sections. **No graded field moved** (fields.json and
capstone.json are unchanged). The line numbers below are the NEW digest's.
Lesson paths are under `src/content/courses/gasvalue/`. The lessons were
NOT edited in this round; this file is the lesson reviser's worklist.

## 1. Digest lines that changed, and the lessons that quote them

| old line (f0aef14 digest) | new line | lessons to revise |
|---|---|---|
| preamble "ENGINES: ... at petrolord-engines f0aef14" | 3: "... at petrolord-engines df31f53 (MD45-1, after MD4-0)" | none quote it |
| S1 "... the compressor train in facilities/compression rather than writing its own" | 12: "... and writes none of the three itself" | none quote it (beginner m01 l01 paraphrases the call list: check it does not say "rather than") |
| S1 export count "8 (BTU_PER_MWH, ...)" for flareToValue | 16: "10 (..., FLARE_MOLAR_MASS, ..., RICHNESS_GPM, ...)" | any lesson giving the count of flareToValue constants (beginner m01 l01): now 10 |
| S4 "The same sheet typed short, with less methane:" | 90: "... with less methane, ethane and propane:" | **beginner/m01/l04 line 11** ("The same sheet typed short, with less methane, reads:") must say methane, ethane and propane |
| S7 "The richness word is read off gpmC3Plus. The engine was asked where the word changes, by bisection ..." | 184: "... against the lower edges the engine exports as RICHNESS_GPM (a screening word; a route's own liquids limit governs):" | **beginner/m03/l03 line 11** ("The engine was asked where the word changes, by bisection ...") must say the edges are the engine's export RICHNESS_GPM; the two figures 1.0000 and 2.5000 do not change |
| S8 ghvNote "... makes the mixture value missing, not partial." | 201: "A heating value missing on any component leaves the mixture value missing too. No partial average is reported." | **beginner/m03/l04 line 27** paraphrases the old note. It may now quote the new note verbatim, since the contrastive shape is gone |
| S10 "The molar masses the flare is weighed at are not exported. Asked about itself ..." | 227: "... as the engine exports them in FLARE_MOLAR_MASS (an all-CO2 flare and an all-methane flare give the same figures back). The reference table carries CO2 at its tabulated molar mass for the gas's mass and liquids (SECTION 3); the flare's tonnes use these:" | **beginner/m04/l01 line 39** ("The engine was asked about itself for the molar masses ...") must say they are exported as FLARE_MOLAR_MASS; 44.009 and 16.043 do not change |
| S10 "... computed from the engine's own carbon per mole:" | 254: "... computed here as the lb-mol a year (scfPerYear over SCF_PER_LBMOL) times carbonPerMol (every carbon atom, the CO2's included) times one less the destruction efficiency, weighed at FLARE_MOLAR_MASS.CH4 and converted with LB_PER_KG:" | beginner/m04/l04 lines 27, 36 and 52 and beginner/m02/l03 line 41 may now state the formula (Associate gap 5 closed); 2083.055 and 1.8329 do not change |
| S26 "... The vapour space is not spare capacity: it is what keeps a vessel of expanding liquid from rupturing." | 687: "... The vapour space is the vessel less the usable liquid; the fill-limit refusal below states what it is for." | **advanced/m01/l03 line 24** quotes the old sentence. Replace it with the new line and quote the engine's fill-limit refusal ("LPG expands and a vessel filled liquid-full ruptures hydraulically") for the reason |
| S27 floor note "... It is a floor, not the duty." | 726: "... It is a floor: the full duty is at least this." | advanced/m02/l02 line 42 and advanced/m02/l01 line 46 paraphrase "calls the figure a floor". Both are still true, and either may now quote the new note verbatim |
| S29 "The fleet is the ceiling of that plus a spares allowance." | 780: "The cycle is the sum of its stage days, and the fleet is the ceiling of (the assets in circulation plus the spares allowance), the spares allowance being the assets in circulation times the spares fraction." | **advanced/m02/l05 line 9** and **advanced/m05/l04 line 9** quote the old sentence verbatim and must quote the new one (Expert gap: ceiling of the SUM) |
| S30 "The mass is m = P V M over Z R T, with Z by ..." | 826: the same, plus the variables (P in Pa, V m3, M = SG x air, T K, R, ideal with Z = 1) | advanced/m03/l01: the "In practice" framing of the variables can now quote the digest |
| S31 "IBAFO's cascade: ... A bus tank ..." | 858: adds "The gas is IBAFO's, specific gravity 0.62 at 30 C." | advanced/m04 lessons may now state the cascade's gas |
| footer "Refusals printed ...: 55." | 1030: the new count | no lesson quotes it |

## 2. Newly closed gaps the lessons can use (all new lines, all engine-derived)

- **Every section** opens with a `function:` line naming the function(s) it reads (line 10 onwards). Professional gap "the yield refusals are not attributed to a function" is closed by S18's line.
- S2, 59 on: kgPerMscf built from SCF_PER_LBMOL and LB_PER_KG, with a hand calculation and a 0.0000 difference column.
- S5, 124 on: inertMoleFraction = N2 plus CO2, one row a gas.
- S7, 171 on: the rows each cut sums, EGBEMA's gallons per component, and their sums (gpmC2Plus and gpmC3Plus).
- S9, 217: the mass ceiling reads no liquid density (the propane-density-blank probe).
- S10, 243: methaneShareOfFlareCo2e = flareCh4Tonnes x GWP over flareCo2eTonnes.
- S11, 269: a combustion efficiency typed blank behaves as left out (same CO2 and the same note).
- S13, 322: the on-stream days default, 350, as routeEconomics reports it.
- S17, 427: the screening margin rule (actual less limit on a minimum, limit less actual on a maximum).
- S19, 485 and 486: grossMarginPerYear = revenue less operating cost; on-stream days omitted from routeEconomics.
- S20, 520 and 521: the capital is scaled to the parcel's 7.5 MMscfd; a blank scaling exponent takes the MODULAR 0.9.
- S22, 577 and 578: creditRevenuePerYear and totalMarginPerYear rules; the breakeven's numerator (hurdle less margin) printed.
- S25, 673: the reworded blend note (a blank latent heat).
- S26, 689 to 708: the storage rules as a checked table (cover, safety stock, reorder, ullage), a coverDays rounding note, **the basis typed blank (refused) and OMITTED (liquid_volume, named in the output: lead ruling)**, and the lead time omitted (reorder = the safety stock alone).
- S27, 724: the three vaporizer terms and the margin as formulas.
- S28, 748: the positions rounded to the nearest whole one (17), labelled as the shortcut the engine does not take.
- S29, 780: cycleDays = the sum of the stage days; the fleet as the ceiling of the sum.
- S31, 866 and 875: storedKg = the three bank masses summed; what hitFillLimit means.
- S34, 971 and 972: the payback as conversion cost over annual saving, and the derived consumption formula.

## 3. Gaps not closed (reported in RECON 8)

The maxFills cap value (inline, not exported), the gas constant as a figure,
blockedBy's precedence with two inputs missing, a blank credit-price entry, and
a route payback (no oracle computes one). Lessons stay silent on each.
