# crude REVISE: what the extension round changed, lesson by lesson

The digest was rebuilt on engines e4d3b10 (MD1-1) and extended to close the
writers' gaps in DIGEST-GAPS.md. The digest is the only source; every figure
named below is printed in it. Grep the quoted phrase in `digest.txt` to find it.

## What changed in the digest, in one place

**One printed figure moved.** Every printed difference is now the difference of
the two printed four-decimal figures. SECTION 2's API step at SG 0.95 reads
**-8.2748** (was -8.2749). No other printed figure moved, and no graded value moved.

**Five lines were reworded** (the flagged fixes):
- SECTION 5: "A crude denser than the blend carries more of the mass than of the
  volume, and a crude lighter than the blend carries less." (The heavier-crude
  sentence was false for Egbema Medium in the three-crude blend.)
- SECTION 10 and SECTION 15: a first cut starts at 0 percent and a last cut with
  no upper bound "runs to 100 percent: it takes everything not yet distilled at
  its lower bound". Cut-set tables now print "no lower bound (from 0 percent)"
  and "no upper bound (to 100 percent)" in place of "start of the curve" and
  "end of the curve".
- SECTION 11: the no-gravity row is labelled "(screenBlendStability called on its
  own)", with a sentence saying that blendCrudes refuses the crude first (SECTION 7).
- SECTION 15: on the partial blend, "a cut with a bound below 110 F has no yield";
  the open residue cut has one.
- SECTION 20: RVP's template basis prints "index, on volume".
- SECTION 27: the C12 row prints both Obigbo viscosities itself (7.4743 on mass,
  7.3107 on volume) and no longer cites SECTION 8.

**Added material** (all additive, after existing lines): the SG and sulfur of
the by-mass and by-volume three-crude blends (S5); the blank-sulfur and typed-0
sulfur blends with every other property (S7); the linear cSt average minus the
engine (S8); the CII difference on volume, the thresholds 15.0000 and 35.0000
found by bisection, and the MD1-1 partial-SARA message (S11); Closes for the
export blend (S12); the three T50 shortcuts minus the engine (S14); the known-cut
total 76.3376, unyieldedCuts and complete false on the partial blend (S15);
complete true for the blank-cost netback (S16); a sentence that single-crude
netbacks use Kwale's cuts, prices, costs and losses (S17); the oracle_crudeassay
block (S18); what iterations counts (S19); the AGO rowPrices, scales and the
index-on-volume re-solve (S24); which 10 ppm limits cause infeasibility (RON and
sulfur, one at a time on the 50 ppm template), skipped specifications achieved
"not formed", density applied at 0.7536, and butane 339.9340 inside its 400 bbl
at the isomerate floor (S25); the default pool's bounds and marginal minus unit
cost 0.0000 (S26).

## Module ruling (already applied by this round)

The academy module is `commercial_trading` ("Commercial & Trading"). `supply`
is in `supply_chain` ("Supply Chain & Logistics"). Three lesson lines were
fixed in this commit: advanced m01 l01, advanced m06 l03 (opening paragraph,
"The second belongs to the whole Commercial & Trading module", the supply
paragraph and the heading "What neither module teaches"), and intermediate m06
l03. Write no new "Midstream & Downstream" anywhere. The engine path
engines/downstream is correct and stays.

## Associate (beginner)

- **m01 l01** `four-questions-an-assay-answers`: the table row "screenBlendStability
  (inside blendCrudes)" still matches S1. If the lesson says a no-gravity crude is
  screened, add that blendCrudes refuses it first (S7, S11).
- **m01 l02** `api-gravity-is-a-hyperbola`: MUST CHANGE. The step table row for
  SG 0.95 reads -8.2749. Change it to **-8.2748**.
- **m02 l03** `volume-shares-become-mass-shares`: MUST CHANGE the "heavier crude
  carries more of the mass" sentence to S5's denser-than-the-blend wording. It is
  false for Egbema Medium in the three-crude blend (+0.0063). May add the by-mass
  blend SG 0.8783 and sulfur 0.5840 against by-volume 0.8804 and 0.6138.
- **m02 l05** `a-blank-is-not-a-zero`: may add S7's new table. With the sulfur
  blank, API 32.8173, TAN 0.3915 and viscosity 7.4743 still blend. With the
  sulfur typed as 0, the blend sulfur is 0.0888 on mass.
- **m03 l01/l03**: may quote S8's "linear average minus the engine" column
  (3.4833, 330.3100, 232.9041) in place of any two-figure comparison.
- **m04 l01, l04, l05** `a-cut-is-a-difference`, `a-cut-set-that-closes`: MUST
  CHANGE "start of the curve" and "end of the curve" (quoted cut tables or prose)
  to S10's wording. The residue runs to 100 percent.
- **m05 l02/l03/l04**: the gravity thresholds may now be quoted as 15.0000 and
  35.0000 (S11). The CII volume difference column (0.2104, -0.0020, 0.0037) may
  replace any two-figure comparison. The "No SARA analysis supplied" quotes stay
  correct. l04 may add the partial-SARA message ("SARA was not supplied for every
  crude").
- **m05 l05** `no-gravity-no-screen`: MUST CHANGE to say the no-gravity row is
  screenBlendStability called on its own. blendCrudes refuses first.
- **m06 l01** `the-obigbo-blend-end-to-end`: may add "Closes: true" (S12).

## Professional (intermediate)

- **m02 l02/l03**: may quote S14's shortcut-minus-engine columns. For Kwale they
  are 62.6816, -3.3184 and -1.2681; for the studio pair, 72.8571, -5.1429 and
  -2.9207.
- **m03 l01, l02, l04**: MUST CHANGE any quoted "start of the curve" or "end of
  the curve" cut-table cell to S15's new wording.
- **m03 l03** `a-cut-the-curve-cannot-answer`: MUST CHANGE "the two cuts whose
  bounds lie outside the curve" to S15's qualifier (a bound below 110 F; the open
  residue cut has a yield). May add the known-cut total 76.3376. May add the
  MD1-1 netback: unyieldedCuts LPG / Light ends and Naphtha, complete false,
  48.3393 $/bbl over the cuts it can value.
- **m04 l04** `a-blank-cost-is-named`: may add "Complete: true" and S16's sentence
  on what makes a valuation incomplete (a missing price or a missing yield).
- **m04 l05** `an-unpriced-cut`: may set the unpriced cut beside the unyielded cut
  (S15). Both make the valuation incomplete.
- **m05 l02** `each-crude-on-its-own-netback`: may quote S17's sentence that each
  crude alone uses Kwale's cuts, prices, costs and losses.
- **m06 l02** `what-the-oracle-checks-on-a-cargo`: MUST re-source to S18's new
  "WHAT THE ORACLE CHECKS ON A CARGO" block (6 blends, 4 curve cases, 1 blended
  default curve). Do not cite SECTION 27, which the Expert tier owns.
- **m06 l03**: module wording fixed in this round; nothing else.

## Expert (advanced)

- **m01 l01**: module wording fixed in this round.
- **m01 l02, l05**: may quote S19's sentence that iterations counts the pivots of
  both phases together (the textbook case took 2).
- **m02 l01/l03**: where a lesson quotes the SPEC_TEMPLATES table, RVP's basis
  reads "index, on volume".
- **m02 l04 / m04**: may use S24's AGO rows. Cetane has rowPrice 0.1932, scale
  6000.0000 and price 1159.3909. Density has rowPrice -142.0756, rowPrice x scale
  -852453.4687 and price 852453.4687. The mass-row scale is 5070.0000, and the
  index-on-volume re-solve gives the same recipe and cost 594720.9475. rowPrice x
  scale is formed from the unrounded rowPrice. Quote the printed product and do
  not multiply the printed figures.
- **m03 l02** `binding-specifications`: the achieved table's basis column (the
  engine's word "index") is unchanged.
- **m04 l04** `the-marginal-barrel`: may replace "print the same figure" with S26.
  Components at their availability: nothing. At zero: Isomerate. Marginal barrel
  minus unit cost: 0.0000, with the reason printed there.
- **m05 l01** `infeasible-is-an-answer`: may add S25's two tables. No single 10
  ppm limit moved back rescues the pool. Tightened one at a time on the 50 ppm
  template, the RON minimum and the sulfur maximum are each infeasible; MON and
  RVP are not.
- **m05 l04** `a-specification-not-applied`: may add that the skipped
  specification's achieved value is "not formed". Density, which needs no SG, is
  applied at 0.7536 in both cases.
- **m05 l05** `bounds-that-cross` (or wherever the floor is taught): butane is
  339.9340 bbl, inside its 400, at the isomerate-floor optimum.
- **m06 l02** `what-is-held-and-what-the-oracles-check`: MUST CHANGE the quoted
  C12 row. It now prints 7.4743 and 7.3107 itself and no longer cites SECTION 8.
- **m06 l03**: module wording fixed in this round; re-check the supply paragraph
  reads as written.

After revising, run digestprose with `--lessons`, the copy rule, and leakage
(`run_gates.sh` runs leakage over the lessons and expects exit 0).
