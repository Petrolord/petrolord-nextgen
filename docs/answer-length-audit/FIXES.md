# B4 follow-on: question fixes, item by item

Every item the owner asked to be reviewed on 2026-09-21, with its verdict, the reason, and the old and new text of every field that changed. Generated from `tools/answer-length-audit/fixes/*.json` (the migrations are generated from the same files by `fix.py sql`).

## defects

Migration: `migrations/20261021a_b4_fix_defects.sql`

### stimulation advanced module m02-from-slurry-to-pack ord 14: fixed (defect)

- Flag: the correct option said the pseudo-skin halves with the damage factor; it passes through the logarithmic Cinco-Ley and Samaniego correlation, so it does not
- Reason: correct option and explanation now say conductivity and dimensionless conductivity halve while the pseudo-skin worsens less than proportionally (engine fracDesign.js fracProductivity; halving the published case moves it from -5.31 to about -4.77)
- Correct option or prompt changed: owner 2026-09-21: the keyed statement was physically wrong
- Explanation before: Because it carries straight through, the factor should be quoted beside the answer rather than buried in the inputs.
- Explanation after: The factor multiplies the retained permeability, so conductivity and dimensionless conductivity halve with it. The pseudo-skin passes through a logarithmic correlation, so it rises toward zero and does not halve. Quote the factor beside the answer.
- Option 0 before: The conductivity, the dimensionless conductivity and the pseudo-skin all halve along with the factor.
- Option 0 after: Conductivity and dimensionless conductivity halve, and the pseudo-skin rises toward zero without halving.

### wellcontrol advanced module m02-kick-tolerance ord 7: fixed (defect)

- Flag: the explanation ended "so the shut-in limit is generous", which contradicts the keyed shut-in case (lesson m02 l04: on the slant well the shut-in case binds)
- Reason: explanation rewritten to the lesson mechanism; key and options unchanged
- Explanation before: A large gap means the influx can be tall at the bottom before the shoe notices, so the shut-in limit is generous.
- Explanation after: A large gap lets the influx rise and expand a long way before its top reaches the shoe, so the circulated case comes out the larger. The shut-in headroom is the tighter limit, and the smaller case wins.

### perfsand beginner module m01-what-this-course-decides ord 12: fixed (defect)

- Flag: the prompt asked what happens to a thirty degree phasing while the options list four conditions and the explanation classifies result, warning and null
- Reason: prompt now asks which condition the engine refuses outright (lesson m01 l04 "What it will refuse"); explanation names why; key unchanged
- Prompt before: Somebody enters a thirty degree phasing. What happens, and why?
- Prompt after: Which of these does the engine refuse outright, where the others come back as a result, a warning or a null?
- Explanation before: A positive skin is a result, an out-of-range group is a warning, and a short sieve returns nulls.
- Explanation after: A phasing outside the six published angles, thirty degrees for one, is refused. A positive skin is a result, an out-of-range group is a warning, and a short sieve returns nulls.

### hydraulics beginner module m06-the-associate-reading ord 13: fixed (defect)

- Flag: the explanation said "The first is the one the whole next tier is built on", but option 0 in stored order is the bit square law and the key is option 2
- Reason: explanation now names the keyed idea instead of an order reference (lesson m06 l03: the next tier is about the one loss that reaches the rock)
- Explanation before: All three are true. The first is the one the whole next tier is built on.
- Explanation after: All four are true of this system. Only the annulus loss reaches the rock, and the next tier is about what the rock feels.

## cashflow

Migration: `migrations/20261021b_b4_fix_cashflow.sql`

### cashflow advanced final ord 13: fixed (duplicate)

- Flag: duplicate of advanced module m06-the-expert-reading 11 (near p0.62 k0.75): both ask who chooses between the two deep offshore HCT readings, key counsel
- Reason: True duplicate of the m06 question; kept the module question and rewrote the final copy to test the m06 point that the terrain string outweighs the price sweep.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: The engine models the conservative and aggressive readings of deep offshore HCT, 141623594.88 and 61725382.46 on AKATA, and will not choose. Who does?
- Prompt after: AKATA under the PIA reports NPV 43223505.88 in shallow water, 128984232.18 at an oil price of 120, and 141623594.88 in deep offshore under the conservative reading. What does that comparison tell a negotiator?
- Explanation before: The engine models one reading of the law at a time; conservative_zero is a default, not a finding.
- Explanation after: Deep offshore under the conservative reading lowers the production royalty rate and zeroes the HCT, which lifts NPV to 141623594.88, further than the 128984232.18 an oil price of 120 buys. A cap, a lease status or a reading moves NPV further than the market, and those are words in a document.
- Option 0 before: The engine's default, conservative_zero, which the course records as a finding of the extraction.
- Option 0 after: That the price is the bigger lever, since a market move is worth more than any word in the fiscal terms.
- Option 1 before: The terrain string, which carries the reading with it and settles the rate once the terrain is entered.
- Option 1 after: That the two moves are the same size, because deep offshore lowers only the royalty and a price rise lifts revenue by as much.
- Option 2 before: The owner of the discount rate, since the two readings differ only in the rate at which the HCT is discounted.
- Option 2 after: That the terrain string is a price effect in disguise, since a lower royalty rate acts exactly like a higher realised price on every barrel.
- Option 3 before: Counsel; a ledger that reports one without the other has taken a legal position without saying so.
- Option 3 after: That a word in the document outweighs the market: the terrain string moves NPV further than the price sweep to 120.

## casingtubing

Migration: `migrations/20261021b_b4_fix_casingtubing.sql`

### casingtubing beginner final ord 28: fixed (double-key)

- Flag: beginner final ord 28: option 2 restates correct option 3
- Reason: Option 2 named the same omission (wear) with a similar reason; replaced with a sour service distractor that the lesson says the grade name does reveal.
- Option 2 before: The wear, because the wall removed depends on rotating hours and side force alone.
- Option 2 after: The sour service rating, because a grade name says nothing about whether it suits hydrogen sulphide.

### casingtubing advanced module m04-buckling ord 11: fixed (double-key)

- Flag: advanced module m04 ord 11: option 2 close to correct
- Reason: Option 2 restated the lesson (floor stops an infinite limit) and option 0 was also literally in the lesson (division by zero); both replaced with misapplied mechanisms (couplings, which the lesson says are ignored; ovality tolerance).
- Option 0 before: To avoid a division by zero in the square root.
- Option 0 after: To allow for the tubing couplings that narrow the gap.
- Option 2 before: Because a zero or negative clearance would give an infinite limit, and the floor converts that into a large but finite one instead.
- Option 2 after: Because below a millimetre the clearance is smaller than the ovality tolerance of the casing, so the computed limit would carry no meaning.

### casingtubing beginner module m05-reading-a-rating-table ord 14: fixed (double-key)

- Flag: beginner module m05 ord 14: option 2 matches the explanation
- Reason: Option 2 was the lesson claim (narrows a hundred rows to two or three); rewritten so it claims screening signs off the survivors, which the lesson says it does not.
- Option 2 before: Because it narrows a hundred rows to two or three, and the elimination it performs is what the later verification needs.
- Option 2 after: Because it narrows a hundred rows to two or three, and the survivors can then be signed off directly because every formula is published.

### casingtubing intermediate module m01-a-load-case-is-two-columns ord 7: fixed (double-key)

- Flag: intermediate module m01 ord 7: option 2 matches the correct option
- Reason: Option 2 (naming advisory, engine cannot tie a name to a check) paraphrased the lesson; replaced with a wrong mechanism (a second run with the columns swapped).
- Option 2 before: Because the naming convention is advisory only, and the engine has no way to associate a case name with a particular check.
- Option 2 after: Because the engine evaluates every case a second time with the two columns swapped, so a collapse case always yields a burst run.

### casingtubing intermediate module m04-axial-and-triaxial ord 9: fixed (double-key)

- Flag: intermediate module m04 ord 9: option 2 essentially the correct option 3
- Reason: Option 2 restated the lesson reason; replaced with connection efficiency, which the lesson applies explicitly through joint strength and not through the factor.
- Option 2 before: Because parting a string is unrecoverable, and because the real running load contains shock and drag that none of this captures.
- Option 2 after: Because the connection efficiency cuts the usable tension rating below the body yield, and the larger factor exists to absorb that loss.

### casingtubing intermediate module m04-axial-and-triaxial ord 15: fixed (double-key)

- Flag: intermediate module m04 ord 15: option 2 is the correct reasoning
- Reason: Option 2 listed the lesson peak locations, which is the correct reasoning; replaced with a false different-grids claim (the lesson walks every grid point once for all four).
- Option 2 before: Because tension peaks at the top and collapse at the bottom, and burst can do either by case.
- Option 2 after: Because the four checks are sampled on different grids, so each minimum sits on points the others skip.

### casingtubing intermediate module m05-reading-a-string-check ord 9: fixed (double-key)

- Flag: intermediate module m05 ord 9: option 2 arguably correct
- Reason: Option 2 (three things acting at once) was the lesson explanation; replaced with the false claim that no pipe change can clear the warning (the lesson says a grade or wall would).
- Option 2 before: Because the triaxial number is low from three things acting at once, and only one of them is a property of the pipe.
- Option 2 after: Because a triaxial WARNING cannot be cleared by any change of grade or wall, so only the test pressure or the dogleg can be revisited.

### casingtubing intermediate module m06-the-professional-reading ord 7: fixed (double-key)

- Flag: intermediate module m06 ord 7: option 2 same as correct option 3
- Reason: Option 2 gave the correct location and the lesson reason; replaced with an upper-section answer resting on friction loss, which contradicts the same-force-everywhere model.
- Option 2 before: On the lower section, since the overpull is a larger fraction of its total axial load than of the upper section's.
- Option 2 after: On the upper section, since the pull is applied at surface and part of it is lost to wall friction before it reaches the lower section.

### casingtubing intermediate final ord 41: fixed (double-key)

- Flag: intermediate final ord 41: option 2 essentially correct
- Reason: Option 2 (columns cross inside the upper section) is true (crossing near 464 m); replaced with a top-of-cement mechanism that does not apply to this case.
- Option 2 before: Because the two columns cross at a depth inside the upper section, so the differential changes sign partway down it.
- Option 2 after: Because the heavy outside column only acts below the top of cement, so above it the upper section sees the inside column alone.

### casingtubing intermediate final ord 34: fixed (double-key)

- Flag: intermediate final ord 34: option 1 partly true as physics
- Reason: A lower internal pressure does raise the collapse differential, so option 1 was defensible; replaced with the false claim that the test pressure also acts in the annulus.
- Option 1 before: The collapse number, as a lower internal pressure raises the external differential there.
- Option 1 after: The collapse number, because the test pressure also acts in the annulus and sets its column.

### casingtubing beginner final ord 21: fixed (other)

- Flag: beginner final ord 21: option 2 (Poisson ratio barely varies between grades) borderline
- Reason: Poisson ratio does enter the elastic ring buckling solution and is grade independent, so it was defensible; replaced with the yield to tensile ratio, a strength property that does not enter elastic collapse.
- Option 2 before: The Poisson ratio, which appears in the elastic buckling solution and barely varies between grades.
- Option 2 after: The yield to tensile ratio, which sets the elastic buckling solution and is alike for every grade.

## cementing

Migration: `migrations/20261021b_b4_fix_cementing.sql`

### cementing advanced module m02-the-centralizer ord 14: fixed (double-key)

- Flag: options 1 and 2 both algebraically equal to the correct formula
- Reason: Both distractors were the same ratio rewritten; replaced with the post-sag standoff and the washout case, both wrong for the reported number.
- Option 1 before: The blade less the casing, over twice the clearance between the casing and the bore.
- Option 1 after: The standoff at mid-span, after the sag between two centralizers is subtracted.
- Option 2 before: The ratio of the two annular gaps, blade to casing and bore to casing.
- Option 2 after: The blade ratio worked on the effective bore of a washed-out hole.

### cementing advanced module m04-choosing-a-spacing ord 15: fixed (double-key)

- Flag: option 2 is correct
- Reason: Option 2 restated the sag-only ceiling; now uses the deflection term, which the ceiling excludes. Option 1 lengthened slightly to keep a 6-character gap to the key.
- Option 1 before: The standoff a rigid centralizer with a blade equal to the bore would reach, which is the theoretical maximum for the geometry.
- Option 1 after: The standoff a rigid centralizer with a blade equal to the bore would reach, which is the theoretical maximum for the geometry of the hole.
- Option 2 before: One less the sag over the clearance, which caps what any spring can achieve at that spacing.
- Option 2 after: One less the spring deflection over the clearance, which caps what any spacing can achieve.

### cementing advanced module m05-the-checklist-and-its-edges ord 11: fixed (double-key)

- Flag: option 2 nearly restates the correct option
- Reason: Option 2 restated the lesson's reasons; now claims booleans cannot be weighted, which the lesson shows other software doing.
- Option 2 before: Because the weights are unmeasured, a score hides which item failed, and no log gives one.
- Option 2 after: Because the five items are booleans, and a boolean cannot be weighted into a percentage.

### cementing beginner final ord 22: fixed (double-key)

- Flag: option 2 (float collar depth difference times bore capacity) is the correct explanation
- Reason: Option 2 was the key reworded; now uses the shoe depths and the annular capacity, the wrong capacity for displacement.
- Option 2 before: Their float collars are at different depths, times the casing bore capacity.
- Option 2 after: Their casing shoes are 200 m apart, times the annular capacity of the open hole.

### cementing beginner final ord 23: fixed (double-key)

- Flag: options 2 and 3 both true
- Reason: Both were true statements; option 2 now claims the survey converts rows to vertical height, option 3 claims a deviated hole needs less cement at the same measured depth, both contradicted by the lesson.
- Option 2 before: The true vertical depth has to be computed separately for the hydrostatic head.
- Option 2 after: The survey is used to convert each annulus row to its vertical height first.
- Option 3 before: A deviated well needs more cement than a vertical one to the same true vertical depth.
- Option 3 after: A deviated well needs less cement than a vertical one of the same measured depth.

### cementing beginner module m01-what-a-primary-cement-job-is ord 12: fixed (double-key)

- Flag: option 2 arguably correct
- Reason: Option 2 paraphrased the lesson's two-levers point; now claims the engine answer is an upper bound, the reverse of the lesson and the explanation.
- Option 2 before: Because it is one of the two biggest levers, and the model can only quantify the other one.
- Option 2 after: Because without it the engine's answer is an upper bound on what a good job achieves.

### cementing beginner module m03-open-hole-excess ord 12: fixed (double-key)

- Flag: option 2 answers the same as the correct option
- Reason: Option 2 gave the same answer (one); now counts the top of cement as a guess, which the lesson treats as a design decision. Option 1 lengthened to keep a 6-character gap to the key.
- Option 1 before: Two, the excess and the slurry yield, since the yield is measured on a laboratory blend rather than on the field mix.
- Option 1 after: Two, the excess and the slurry yield, since the yield is measured on a laboratory blend rather than on the actual field mix.
- Option 2 before: One, the open hole excess, and every other input is either a measurement or a design choice.
- Option 2 after: Two, the open hole excess and the top of cement, because neither can be measured before the job.

### cementing beginner module m04-the-volumes ord 9: fixed (double-key)

- Flag: option 2 essentially correct
- Reason: The lesson gives option 2's reason as part of the geometric reason; now claims the casing above needs strong tail to carry its weight, where the lesson calls the lead a filler there.
- Option 2 before: Because it is the deepest point protected by the casing above, so strong cement goes in open hole.
- Option 2 after: Because the casing string above that depth needs the strong tail behind it to carry its weight.

### cementing intermediate final ord 19: fixed (double-key)

- Flag: option 2 matches the correct option
- Reason: Option 2 restated the key and option 1 was also defensible; option 2 now says nothing changes until the plug bumps, option 1 points at the constant denominator, neither of which explains the flat stretch.
- Option 1 before: Because the friction above the shoe is constant at a constant rate, and the head there is fixed by the mud density.
- Option 1 after: Because it is divided by the true vertical depth of the previous shoe, which stays the same all through the job.
- Option 2 before: Because nothing above that shoe changes until cement or spacer crosses it going up.
- Option 2 after: Because the annulus sees no change at all until the top plug bumps at the end.

### cementing intermediate module m03-the-job-over-time ord 7: fixed (double-key)

- Flag: option 2 matches the correct option
- Reason: Option 2 restated the key; now claims cement stays inside the casing, whereas the lesson has it in the annulus below the previous shoe by then.
- Option 2 before: Because the annulus above that shoe holds only mud until cement or spacer crosses it.
- Option 2 after: Because the whole cement column stays inside the casing until the last third of the job.

### cementing intermediate final ord 23: fixed (double-key)

- Flag: option 2 is the correct answer
- Reason: Option 2 restated the key; now includes friction, which is the end pump pressure relation.
- Option 2 before: The annulus head less the inside head at the last step, with the friction term excluded.
- Option 2 after: The annulus head plus friction less the inside head, at the step where the plug bumps.

### cementing intermediate final ord 35: fixed (double-key)

- Flag: option 2 matches the correct order
- Reason: Option 2 gave the same four steps in the same order; now puts the rate window before the fluid programme that sets it.
- Option 2 before: The top of cement, then the fluid programme, then the rate window, and the rate last.
- Option 2 after: The top of cement, then the rate window, then a fluid programme to fit inside it.

### cementing intermediate module m04-two-programmes-one-well ord 15: fixed (double-key)

- Flag: option 2 matches the correct order
- Reason: Option 2 gave the same order; now swaps the density profile and the rate window.
- Option 2 before: The top of cement, then the fluid programme, then the rate window, and the rate last.
- Option 2 after: The top of cement, then the rate window, then the density profile, and the rate last.

### cementing intermediate module m03-the-job-over-time ord 15: fixed (double-key)

- Flag: option 2 correct
- Reason: Option 2 was a true statement from the lesson about the rest; now names a free-fall deficit, which the slant well never has.
- Option 2 before: Friction at the last step, which is why the bump falls when the final rate is reduced.
- Option 2 after: The free-fall deficit at the last step, which the pumps have to make up at the bump.

### cementing intermediate module m05-reading-a-placement-result ord 11: fixed (double-key)

- Flag: option 2 essentially correct
- Reason: Option 2 restated the key; now claims the heads are unknown, but the densities are known and only the rate is lost.
- Option 2 before: The rate is unknown, and so is all computed from it, so that stretch has no numbers.
- Option 2 after: The hydrostatic heads, because the fluid densities cannot be tracked while it falls.

### cementing intermediate final ord 21: fixed (duplicate)

- Flag: near duplicate of intermediate module m03-the-job-over-time ord 9 (same ECD at the casing shoe question, same key)
- Reason: True duplicate; kept the module question and rewrote the final copy to test the null previous-shoe ECD case from the same lesson (ECD at the shoe).
- Correct option or prompt changed: Duplicate rewritten into a new question; the key is the new question's answer at the same index.
- Prompt before: The horizontal well's ECD at the CASING shoe is 1837.9218199066345 kg/m3 before anything is pumped. Why?
- Prompt after: When is the ECD at the previous shoe reported as null for the whole run?
- Explanation before: The friction is generated along the hole and the depth is measured vertically.
- Explanation after: With no cased section above the casing shoe there is no shallower shoe to protect, so the peak ECD at the previous shoe is null as well.
- Option 0 before: Its mud is heavier than the slant well's.
- Option 0 after: When no fracture limit is supplied as an input.
- Option 1 before: It divides the friction of a 1600 m lateral by 1214.859173174059 m of true vertical depth.
- Option 1 after: When no cased section sits above the casing shoe, as on a conductor or a surface string.
- Option 2 before: Its annulus is narrower, so the same rate gives a higher velocity and more friction.
- Option 2 after: When cement never reaches the previous shoe, so the annulus there holds only mud.
- Option 3 before: Its previous shoe is shallower, so its head gives a higher equivalent density.
- Option 3 after: When the previous shoe is shallower than the top of cement on the well.

## completion

Migration: `migrations/20261021b_b4_fix_completion.sql`

### completion advanced final ord 35: fixed (double-key)

- Flag: distractor 0 (drift table from the specification) arguably true
- Reason: The drift table is independent of the equipment rows, so under the old prompt it was also correct; prompt sharpened to the lesson wording (depends on none of the catalog: pipe tables or equipment), which leaves only the space out.
- Correct option or prompt changed: Correct option text unchanged; the prompt was sharpened so the drift table (which depends on the API pipe tables) no longer also qualifies.
- Prompt before: Which calculation in this course is completely independent of the equipment catalog?
- Prompt after: Which calculation in this course depends on none of the catalog at all, neither the API pipe tables nor the approximate equipment rows?

### completion intermediate module m03-getting-through-it-afterwards ord 14: fixed (double-key)

- Flag: distractor 1 (every component same bore) arguably correct
- Reason: With a uniform bore the extreme equals the extent and the headline is a complete summary, so option 1 was defensible; replaced with reaching a depth above the restriction, where the lesson says the running minimum is the right number.
- Option 1 before: When every component in the string has the same bore throughout.
- Option 1 after: When the tool only has to reach a depth above the smallest bore.

### completion beginner final ord 29: fixed (double-key)

- Flag: distractor 2 only wrong under this tier framing
- Reason: The setting-depth distractor is genuinely right when a liner governs; prompt now gives the drift of the single string the packer runs through, and option 2 is replaced by the nominal bore, which the given drift already contains.
- Correct option or prompt changed: Correct option text unchanged; the prompt was sharpened to one casing string so the governing-drift question of the next tier no longer makes option 2 correct.
- Prompt before: You are given only a drift value and asked whether a five and seven eighths inch packer will pass. What else do you need?
- Prompt after: You are given only the drift of the single casing string a five and seven eighths inch packer will run through. What else do you need to say whether it passes?
- Option 2 before: The packer setting depth, since the quoted drift may not govern there.
- Option 2 after: The nominal bore of the casing, since the drift is deducted from it.

### completion beginner module m02-api-drift ord 12: fixed (other)

- Flag: twelve inch mandrel coverage depends on casing size (API drift mandrel lengths)
- Reason: API casing drift mandrel length varies with size, so a fixed twelve inch mandrel is not guaranteed for every joint; option 1 now names the standard mandrel for the pipe size.
- Option 1 before: A twelve inch mandrel passing through a new joint that has never been in a well.
- Option 1 after: The standard drift mandrel for that pipe size passing through a new joint never run in a well.

### completion intermediate module m04-the-volumes ord 12: fixed (duplicate)

- Flag: near duplicate of beginner module m01-what-a-completion-is ord 14 (uncovered interval: skip and warn)
- Reason: Same concept and answer as the beginner m01 question; kept the beginner one and rewrote this into the l05 point that warnings catch missing data and never incorrect data.
- Correct option or prompt changed: Duplicate rewritten into a new question on the same lesson; answer_index kept at 3.
- Prompt before: What does the engine do when the profile does not cover an interval it is integrating?
- Prompt after: A complete casing program is entered with a typo in one bore. What does the volume integration return?
- Explanation before: The number that comes back is real and incomplete, and the warning is the only thing that says so.
- Explanation after: Warnings catch missing data and nothing here catches incorrect data, so a complete program with a typo gives a complete profile, no warnings and a wrong volume.
- Option 0 before: It refuses the calculation and returns nothing, since a partial volume would mislead.
- Option 0 after: A refusal, since a bore that disagrees with the pipe tables fails validation before any integration starts.
- Option 1 before: It uses the bore of the nearest covered interval, which keeps the volume complete at the cost of a small unquantified error.
- Option 1 after: The volume over the correct intervals only, plus a warning naming the depths where the mistyped bore sits.
- Option 2 before: It returns the volume computed over the covered intervals only, with no indication that anything at all has been left out.
- Option 2 after: A volume built from the nearest valid catalog bore, since the engine replaces any bore it cannot match to a pipe size.
- Option 3 before: It skips the interval, continues, and adds a warning naming the depths.
- Option 3 after: A complete looking volume that is wrong, with an empty warning list.

## corrosion

Migration: `migrations/20261021b_b4_fix_corrosion.sql`

### corrosion beginner final ord 11: fixed (duplicate)

- Flag: duplicate of advanced final 7 (near p0.71 k1.00): both ask which set is made up entirely of range guards, same key
- Reason: True duplicate across the two finals and of the beginner m02 range-guard question; kept the advanced final and rewrote this copy to test the m02 lesson point on the mole percent box.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: Which set is made up entirely of range guards this module enforces on what a caller types, rather than published validity bands it holds?
- Prompt after: A partial pressure on the screen looks about a hundred times too large. What does the course tell a reader to check before anything else, and why there?
- Explanation before: Every published validity band of every correlation is held, so a screening well outside one still returns a number and says nothing about it.
- Explanation after: Carbon dioxide typed as 3 mol% is a mole fraction of 0.030000, and the conversion is a division by a hundred. A partial pressure is the total pressure times that fraction with no correlation constant in it, so a factor lost at the box shows straight through to the screen.
- Option 0 before: The published validity band of each correlation, the fugacity cap, the pH reference and the film stripping threshold.
- Option 0 after: The fugacity coefficient, because it falls with pressure and is the one step between a mole fraction and the partial pressure.
- Option 1 before: Nought to one on every fraction, the fugacity pressure cap, the pH reference and a positive velocity on the transport term.
- Option 1 after: The total pressure box, since the engine reads psia there and a figure typed in bar inflates every partial pressure.
- Option 2 before: Nought to one on every fraction, nought to fourteen on pH, a temperature above absolute zero, and the partial pressure sum against the total.
- Option 2 after: The mole percent box, because the studio takes mol% and the division by a hundred to a mole fraction is the commonest place to lose a factor of ten.
- Option 3 before: A temperature above absolute zero, a positive total pressure, and the published validity band of the transport term on velocity and line size.
- Option 3 after: The hydrogen sulphide flag, since an uncorrected partial pressure reads high against a fugacity at any line pressure the engine is handed and never says so.

### corrosion advanced module m02-what-the-module-does-not-have ord 13: fixed (duplicate)

- Flag: duplicate of intermediate module m05-the-allowance 9 (near p0.73 k0.80): both ask which course owns the calculation that says what the allowance is taken off, key Pipeline Network Associate / Barlow
- Reason: True duplicate across tiers; kept the intermediate m05 question and rewrote this copy to test the m02 vocabulary rule on the word erosion.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: This module cannot say what the corrosion allowance is being taken off. Which course owns the calculation that would say?
- Prompt after: This course never writes the bare word erosion when it means wall loss. What does it write instead, and why?
- Explanation before: This module has no minimum thickness, so it cannot say what the allowance is taken off. Wall loss to a derated burst pressure is a separate owner again, and this module consumes an allowance and never computes a pressure, so that comparison is a pivot rather than a derivation. This engine has no erosional-velocity criterion of its own either.
- Explanation after: In the Basin Modelling course erosion is material removed from a sedimentary column over geological time, and nothing in that is about steel. This module models no mechanical erosion and has no erosional-velocity criterion, and every use of the term carries that statement. Film stripping is a chemistry verdict about a film.
- Option 0 before: The Pipeline Network course at its Associate tier, which owns the Barlow thin-wall relation with a design factor.
- Option 0 after: Mechanical erosion or erosional wall loss, because in the Basin Modelling course erosion is a geological process.
- Option 1 before: The Torque and Drag course at its Expert tier, which owns wall loss taken to a derated burst pressure and therefore owns the wall the allowance sits on.
- Option 1 after: Erosion corrosion, because the Casing and Tubing Design course owns the erosional velocity criterion and keeps the bare word for its own limit.
- Option 2 before: The Well Integrity and Plug and Abandonment course, which owns the barrier envelope the allowance is measured inside on any line in service.
- Option 2 after: Film stripping, because above the 100 Pa threshold the wall shear strips the inhibitor film, and that is the only erosion this module models.
- Option 3 before: The Casing and Tubing Design course at its Expert tier, which owns the erosional velocity criterion and the wall thickness that criterion is applied to.
- Option 3 after: Erosional velocity, because the one quantity the word could name in this studio is a velocity limit, and naming the limit avoids implying a wall loss.

## dca

Migration: `migrations/20261021b_b4_fix_dca.sql`

### dca intermediate final ord 37: fixed (other)

- Flag: two options both open with "2 percent", near-duplicate options; make the wrong one clearly distinct
- Reason: option 2 shared the right figure and differed only in its clause; replaced with a distinct wrong fraction (reading 0.00002 straight off as a percentage)
- Option 2 before: 2 percent, wide enough to admit any fit in the Excellent band
- Option 2 after: 0.02 percent, reading 0.00002 straight off as a percentage

## decision

Migration: `migrations/20261021b_b4_fix_decision.sql`

### decision advanced module m06-the-expert-reading ord 10: fixed (duplicate)

- Flag: duplicate of intermediate module m06-the-professional-reading 3 (near p0.72 k0.62): both ask what reading the 0.850000 likelihood as a posterior does, key 298.2500 against 207.7989
- Reason: True duplicate across tiers, also asked in advanced final 25; kept the intermediate m06 question and rewrote this copy to test the m06 onward point on capital portfolio decisions.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: An expert reads the EKPAN lottery survey's likelihood of 0.850000, a bright spot given success, as the chance of success after a bright spot. What does that do to the drill after a bright spot?
- Prompt after: The onward lesson takes decision analysis on to capital portfolio decisions under one budget. Why is the best set of projects not simply the set of individually best ones?
- Explanation before: Bayes turns 0.850000 into 0.646739 because a bright spot also appears on 0.250000 of dry holes, which makes a bright spot 0.460000 likely overall. 9.2361 is the farm-out's value after no bright spot.
- Explanation after: Capital portfolio decisions choose among many projects under one budget, and money spent on one is unavailable to the next, so the choice is of a set under that constraint. Decision Studio already sets capital allocation from a saved portfolio beside the decision analysis in one brief.
- Option 0 before: Nothing to the value, because a likelihood and a posterior are the same number whenever the survey passes its consistency check.
- Option 0 after: Because each project's EMV has to be turned into a net value of information before projects on different prospects can be compared at all.
- Option 1 before: It values the drill at 207.7989 regardless, because the engine converts any typed 0.850000 into the posterior before weighting the drill.
- Option 1 after: Because a portfolio rolls every project back at the discount rate of its riskiest member, which lowers each value unevenly and so reorders them.
- Option 2 before: It values the drill at 298.2500 in place of 207.7989, because the posterior after a bright spot is 0.646739.
- Option 2 after: Because money spent on one project is unavailable to the next, so each is judged against what else the same budget buys.
- Option 3 before: It lowers the drill after a bright spot to 9.2361, since that likelihood belongs to the reading on which the farm-out is chosen.
- Option 3 after: Because an individually best project was valued with its own information already bought, and a portfolio has to strip every survey value out first.

## earthmodel

Migration: `migrations/20261021b_b4_fix_earthmodel.sql`

### earthmodel intermediate module m02-minimum-curvature ord 13: fixed (double-key)

- Flag: intermediate module m02-minimum-curvature ord 13: distractor 0 prints the same x value as the correct option
- Reason: Distractor 0 printed the correct x 1794.719681048036 (only its stated reasoning was wrong, and 300 m was not even the hold length); it now prints the station TVD, a real column-misread mistake.
- Explanation before: The 400 m hold contributes 400/sqrt 2 = 282.84 m east. Doubling the build increment or equating x with MD are both real mistakes the numbers punish.
- Explanation after: The 400 m hold contributes 400/sqrt 2 = 282.84 m east. Reading the TVD column as easting, doubling the build increment or equating x with MD are all real mistakes the numbers punish.
- Option 0 before: x 1794.719681048036, adding the 300 m hold length as easting.
- Option 0 after: x 1752.9376073217509, the TVD column read as easting.

## fdp

Migration: `migrations/20261021b_b4_fix_fdp.sql`

### fdp beginner final ord 14: fixed (duplicate)

- Flag: duplicate of beginner module m02-reserves-per-fluid 2 (near p0.60 k0.73): both ask why the gas row count of 1 matters, key one reservoir estimate carried through
- Reason: True duplicate of the m02 question; kept the module question and rewrote the final copy to test the m02 lesson point that a barrel of oil equivalent total is a decision left to a person.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: The gas total reads 70.0000 Bcf on a row count of 1. Why does that row count matter as much as the total beside it?
- Prompt after: A manager asks the studio for EGINA's reserves as one total on a barrel of oil equivalent basis. Why does the reserves table leave that figure to a person?
- Explanation before: The oil P50 of 130.0000 MMbbl is two rows added and the gas P50 of 70.0000 Bcf is one row carried through, and the row count is what tells the two apart.
- Explanation after: Gas can be expressed on a barrel of oil equivalent basis, and the factor is a commercial assumption about heating value and price. The table keeps oil in MMbbl and gas in Bcf, returns one total per fluid, and leaves the combining to a person who will say what factor they used. Condensate is kept apart from oil too.
- Option 0 before: A count of 1 means the engine could not aggregate the distributions it was given, so the gas figure is a sum of low cases in the way the oil column of 80.0000 MMbbl is.
- Option 0 after: Because the gas row count of 1 is too few rows for the engine to aggregate into a converted total.
- Option 1 before: The count decides the unit: one gas row stays in Bcf, while two or more would be totalled onto a barrel of oil equivalent basis.
- Option 1 after: Because the engine converts only condensate to oil equivalent, and gas needs a recovery factor below 0.650000 before it can be put on a barrel basis.
- Option 2 before: A fluid with one row has no aggregation in it, so 70.0000 Bcf is a single reservoir estimate carried through rather than a sum of anything.
- Option 2 after: Because converting gas to barrels equivalent is a commercial assumption about heating value and price, which somebody has to make and defend.
- Option 3 before: A count of 1 marks the fluid as unverified, because the engine will not label a column P50 until it has at least two independent estimates of the same volume to read it from.
- Option 3 after: Because a barrel equivalent is a P50 quantity only, and the table also carries P90 and P10 columns that no conversion factor can be applied to at all.

## fluid

Migration: `migrations/20261021b_b4_fix_fluid.sql`

### fluid beginner final ord 5: fixed (duplicate)

- Flag: duplicate candidate (near p0.67 k0.85) with beginner module m01-where-a-number-comes-from 6: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m01-where-a-number-comes-from 6; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What does a tier tell you?
- Prompt after: A carefully applied correlation inside its range turns out closer to the truth than a badly run laboratory experiment. Which tiers do the two numbers carry?
- Explanation before: An oracle gated flash is arithmetically exact and can still describe the wrong fluid. A published method correlation has no independent check and may be fine for a screening study.
- Explanation after: The tier is not a quality score. It says what kind of evidence stands behind a number and so what you would have to do to check it, and a closer answer does not change the evidence behind either value.
- Option 0 before: What kind of confidence you have rather than how much, so reading it means asking what the tier is confidence about.
- Option 0 after: The correlation stays published method and the experiment stays measured, because a tier records the kind of evidence rather than the size of the error.
- Option 1 before: How large the error is likely to be, on a scale calibrated against the engine's gate suite.
- Option 1 after: The correlation moves up to measured and the experiment down to screening, because the ladder ranks numbers by how close they are to the truth.
- Option 2 before: Whether the number may be used in a reserves booking, which is what the ladder was designed to decide.
- Option 2 after: Both drop to screening until a third source settles which is right, since two disagreeing routes cannot both keep their tiers.
- Option 3 before: How much a number would cost to improve, which is what makes the ladder useful for planning.
- Option 3 after: The correlation becomes oracle gated, since the experiment now acts as an independent check that agrees with its arithmetic.

### fluid beginner final ord 6: fixed (duplicate)

- Flag: duplicate candidate (near p0.80 k0.61) with beginner module m01-where-a-number-comes-from 7: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m01-where-a-number-comes-from 7; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Which tier does this course refuse to grade?
- Prompt after: The course teaches screening quantities and grades none of them. Which two quantities does that rule affect most?
- Explanation before: The Expert tier has a whole module on screening quantities and grades none of it. Teaching a number and certifying it are different acts.
- Explanation after: The untuned LBC viscosity can be out by a factor of two on an oil, and the separator's gas partition is a labelled approximation. Both appear in the course and neither is graded, because certifying a learner can produce them would imply they are worth producing.
- Option 0 before: Lab tuned, because a tuned value depends entirely on which measurements it was tuned to and is not reproducible.
- Option 0 after: The Standing bubble point and the Hall-Yarborough z factor, which the Associate tier's capstone asks for on the Ekene fluid.
- Option 1 before: Screening, because certifying that a learner can produce a number implies the number is worth producing.
- Option 1 after: The LBC viscosity in compositional mode and the black-oil separator's gas partition, both taught and neither graded.
- Option 2 before: Published method, because a method with no independent check cannot support a graded field.
- Option 2 after: The Vasquez-Beggs bubble point and the Beggs-Robinson dead oil viscosity, which the capstone warns about.
- Option 3 before: Measured, because the course has no laboratory and cannot ask a learner to reproduce an experiment.
- Option 3 after: The tuned saturation pressure and the tuned stock tank gravity, whose values depend on the chosen knobs.

### fluid beginner final ord 10: fixed (duplicate)

- Flag: duplicate candidate (near p1.00 k0.75) with beginner module m02-the-bubble-point 4: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m02-the-bubble-point 4; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What was Standing's correlation fitted to?
- Prompt after: In Standing's form, Rs over gas gravity is raised to the power 0.83. What does that say?
- Explanation before: That is the definition rather than a criticism, and it is why three correlations disagree. The others describe Vasquez-Beggs, the z chart and Glaso.
- Explanation after: More gas raises the bubble point and a power below one makes the increase less than proportional. Heavier gas lowers the bubble point at fixed Rs, and the 18.2 and the 1.4 are fitting constants with no physical meaning.
- Option 0 before: Over 6000 measurements from a worldwide data set, split into two coefficient sets at 30 API.
- Option 0 after: Bubble point falls as dissolved gas rises, since a power below one inverts the whole dependence on Rs.
- Option 1 before: 105 bubble points from 22 crude oil and natural gas mixtures, all Californian.
- Option 1 after: More dissolved gas raises the bubble point, less than proportionally, so the effect saturates.
- Option 2 before: The Standing-Katz chart, itself assembled from measurements on natural gases in the 1940s.
- Option 2 after: The gas gravity dominates the fit, since it is divided into Rs before the exponent is applied to both.
- Option 3 before: A set of North Sea oils, which is why the engine labels it screening rather than published method.
- Option 3 after: Bubble point is almost exactly proportional to Rs, since 0.83 is close enough to one to treat as linear.

### fluid beginner final ord 11: fixed (duplicate)

- Flag: duplicate candidate (near p0.81 k1.00) with beginner module m02-the-bubble-point 5: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m02-the-bubble-point 5; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Standing gives Ekene 1912.1923059028293 psia against a designed 2000. What is that?
- Prompt after: A field has a measured bubble point and a published correlation disagrees with it. What is the trap?
- Explanation before: The designed 2000 is a decision and the correlated 1912 is what a fit to Californian oils says. Neither is a measurement of Ekene, because nobody has measured Ekene.
- Explanation after: When a measurement exists it wins over a correlation. Moving it toward a curve fitted to other oils throws away the one number that describes this fluid.
- Option 0 before: About 4.4 percent low, which exceeds the correlation's own stated accuracy and therefore indicates an input error.
- Option 0 after: Averaging the measurement with the correlation, which gives a value that splits the difference and carries both errors.
- Option 1 before: About 8.8 percent low, since the 88 psia difference should have been taken against the correlated value.
- Option 1 after: Discarding the correlation entirely, since one measurement proves it was fitted to the wrong population of oils.
- Option 2 before: Exactly the gap the designed fluid was chosen to have, so the course would have something to measure.
- Option 2 after: Reporting the correlation spread as the uncertainty, since that is how the course treats disagreement between methods.
- Option 3 before: About 4.4 percent low, which is an entirely ordinary distance for a published correlation to sit from any particular oil.
- Option 3 after: Adjusting the measured value toward the correlation because it looks more reasonable, which prefers somebody else's oils to your own.

### fluid beginner final ord 14: fixed (duplicate)

- Flag: duplicate candidate (near p0.79 k0.85) with beginner module m02-the-bubble-point 10: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m02-the-bubble-point 10; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Why do all three Rs correlations take a bubble point as well as a pressure?
- Prompt after: A laboratory has measured the bubble point but not the solution gas. Which way should the correlation be run?
- Explanation before: A correlation that kept increasing Rs above the bubble point would be describing an oil that dissolves gas which is not there.
- Explanation after: Use the direction the measurement supports. Feeding a correlation a number it should have produced and then quoting its output as independent is circular.
- Option 0 before: Because the bubble point selects which coefficient set applies, as Vasquez-Beggs splits at 30 API.
- Option 0 after: Feed it an assumed solution gas and adjust that until the returned bubble point matches the laboratory value.
- Option 1 before: Because an undersaturated oil has released no gas, so Rs above the bubble point is constant at Rsb.
- Option 1 after: Feed it the measured bubble point and let it return Rs, so that the measurement is the input.
- Option 2 before: Because the correlations were fitted on data reporting both, so dropping either leaves the fit under-determined.
- Option 2 after: Run it both ways and average the results, since each direction holds half the fit.
- Option 3 before: Because the bubble point sets the validity range the warning function checks the pressure against.
- Option 3 after: Use the correlation's own bubble point, since it matches the rest of the table.

### fluid beginner final ord 19: fixed (duplicate)

- Flag: duplicate candidate (near p0.80 k0.82) with beginner module m03-solution-gas-and-volume 6: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m03-solution-gas-and-volume 6; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Standing gives Ekene 1.2407824121407645 rb/stb at the designed 400 scf/stb. What does the gap do?
- Prompt after: A field-unit simulation deck carries Ekene's solution gas as 0.4. What has happened?
- Explanation before: On Ekene's booked 12.139 million barrels that is roughly 400 thousand barrels, and it is sixty times the residual the simulation course closed on its structure.
- Explanation after: Field decks often carry Mscf/stb, so 400 scf/stb becomes 0.4. A black oil holds hundreds of scf/stb, so 0.4 is either Mscf/stb or a fluid that is barely live at all, and a value that crosses between the two without conversion is out by a factor of a thousand.
- Option 0 before: About 3.4 percent, which becomes a 3.4 percent error in every volume the field ever books.
- Option 0 after: Nothing is wrong: it is in Mscf/stb, a thousand times larger unit, so it is the designed 400 scf/stb.
- Option 1 before: About 3.4 percent, which cancels against the voidage calculation because Bo appears in both.
- Option 1 after: The deck has stored the oil as nearly dead, because 0.4 scf/stb is roughly what is left in solution at the stock tank.
- Option 2 before: About 34 percent, taking the ratio of the correlated value to the designed 1.2 directly.
- Option 2 after: It is the ratio of correlated to designed value, stored as a fraction.
- Option 3 before: Nothing measurable, since it is well inside the uncertainty of the porosity and saturation inputs.
- Option 3 after: It is a reservoir volume ratio, rb of gas per rb of oil, which field decks use in place of the surface volumes.

### fluid beginner final ord 23: fixed (duplicate)

- Flag: duplicate candidate (near p0.78 k1.00) with beginner module m04-viscosity 2: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m04-viscosity 2; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Beal raises API gravity to the power 4.53 in a denominator. What follows?
- Prompt after: Run Beal on Ekene's 32 API oil at 100 F instead of 180 F. What happens to the dead oil viscosity?
- Explanation before: It also makes viscosity correlations far more sensitive to a gravity error than volume correlations are.
- Explanation after: Cooling the oil from 180 F to 100 F roughly doubles Beal's answer. A dead oil viscosity quoted without its temperature is a number and a missing argument.
- Option 0 before: Viscosity falls extremely steeply with gravity, so a 20 API and a 40 API oil differ by more than an order of magnitude.
- Option 0 after: It roughly doubles, because liquid viscosity depends strongly and roughly exponentially on temperature, so every viscosity must carry one.
- Option 1 before: Viscosity is largely insensitive to gravity, since a large exponent compresses the range of outcomes.
- Option 1 after: It barely moves, because the API term dominates Beal's form and temperature enters only as a small correction.
- Option 2 before: The correlation cannot be used below 20 API, because the denominator grows without bound there.
- Option 2 after: It falls, because a cooler oil holds its light ends more tightly and so flows more easily at the same gravity.
- Option 3 before: Gravity must be known to four figures, because the exponent amplifies rounding in the input.
- Option 3 after: It cannot be computed, because Beal's range starts at reservoir temperature and a warning stops the call.

### fluid beginner final ord 24: fixed (duplicate)

- Flag: duplicate candidate (near p0.95 k0.76) with beginner module m04-viscosity 3: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m04-viscosity 3; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Beal gives Ekene 2.3437444714709295 cp against a designed live oil viscosity of 1.8 cp. Is that the right way round?
- Prompt after: Beal was fitted to 655 measurements on 492 oils. How well does it do?
- Explanation before: Dissolved gas thins oil substantially and putting it back is the next step of the chain. The two are directly comparable and the ordering is the check.
- Explanation after: The data set is broad and the scatter is still substantial, because viscosity depends on molecular structure that gravity and temperature do not capture. A correlated dead oil viscosity is the weakest number in a black-oil description.
- Option 0 before: No: a dead oil should be thinner, having lost the heavy components that make a live oil viscous.
- Option 0 after: Better than the volume correlations, because its data set is several times larger than Standing's 105 points.
- Option 1 before: Yes, but only because the two are quoted at different temperatures and would agree at a common one.
- Option 1 after: Exactly within its range, because a broad data set leaves no real scatter once the conditions are inside the fit.
- Option 2 before: It cannot be judged, since dead and live oil viscosities are not comparable quantities.
- Option 2 after: It cannot be judged, since dead oil viscosity is an intermediate nobody produces.
- Option 3 before: Yes: the dead oil is thicker because the gas that thins it has not been put back into it.
- Option 3 after: Less well than volume correlations: two oils of the same gravity at one temperature can differ twofold.

### fluid beginner final ord 26: fixed (duplicate)

- Flag: duplicate candidate (near p0.94 k0.79) with beginner module m04-viscosity 6: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m04-viscosity 6; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: The chain gives 0.7559673199800581 cp at 400 scf/stb and 0.7341185203712621 cp at 421.94. Which is correct?
- Prompt after: The effect of dissolved gas on viscosity saturates. What follows for a live oil correlation?
- Explanation before: Same correlations, same fluid, different answer, because the input differed. The number plus the chain that produced it is the answer.
- Explanation after: The direction is simple and the magnitude is not. A correlation fitted mostly to moderate solution gas ratios will not extrapolate well to a rich oil.
- Option 0 before: The second, since 421.94 is what Standing returns at the designed bubble point.
- Option 0 after: Beyond a few hundred scf/stb dissolved gas begins to thicken the oil again, reversing the direction of the effect.
- Option 1 before: Both, and quoting either without saying which solution gas ratio went in is what is wrong.
- Option 1 after: The first 100 scf/stb thins the oil far more than the next 100, so it extrapolates poorly to a rich oil.
- Option 2 before: The first, since the designed 400 is what the rest of the series carries and consistency governs.
- Option 2 after: The correlation stops depending on the dead oil viscosity once the solution gas is high enough.
- Option 3 before: Neither, since mixing a designed solution gas ratio with a correlated viscosity chain is indefensible.
- Option 3 after: The effect is linear in Rs up to the bubble point, so a fit at moderate ratios extrapolates safely to rich oils.

### fluid beginner final ord 28: fixed (duplicate)

- Flag: duplicate candidate (near p0.90 k0.80) with beginner module m04-viscosity 12: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m04-viscosity 12; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What does composing three viscosity correlations do to the uncertainty?
- Prompt after: Run Ekene's viscosity chain at 320 F rather than 180 F. What does the engine do?
- Explanation before: Beal's dead oil scatter is the widest of the three, so an undersaturated viscosity that looks precise inherits a dead oil viscosity that was never precise.
- Explanation after: Every correlation carries its published training range, and the warning names the correlation and the bound. Warnings arriving with the number is what lets a chain be audited after the fact.
- Option 0 before: The errors partly cancel, since the three were fitted to different data sets with independent biases.
- Option 0 after: It refuses the call, because a chain cannot return a value once any stage is outside its range.
- Option 1 before: The uncertainty is set by the last stage, where the final number is produced and rounded.
- Option 1 after: It clamps the temperature to the top of the fitted range and returns that value without comment.
- Option 2 before: The errors compound rather than average, and the first stage usually contributes the most.
- Option 2 after: It returns a value with a warning naming Vasquez-Beggs and the temperature bound it left.
- Option 3 before: The uncertainty becomes unquantifiable, since no published scatter exists for a composed chain.
- Option 3 after: It silently switches to another correlation whose range covers that temperature.

### fluid beginner final ord 30: fixed (duplicate)

- Flag: duplicate candidate (near p0.73 k0.87) with beginner module m05-gas-and-water 3: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m05-gas-and-water 3; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Why does one z chart serve all natural gases?
- Prompt after: Ekene's gas has a z near 0.86 at initial pressure. What does that mean for the gas in a pore volume?
- Explanation before: The pseudo-criticals are a mixture average, and for a gas of known gravity the engine uses Sutton (1985) to obtain them.
- Explanation after: z is the ratio of the real molar volume to the ideal one. A z of 0.86 means the gas takes 14 percent less space than ideal, and nothing about a gas inventory survives ignoring it.
- Option 0 before: Because natural gases are all mostly methane, so one component dominates the behaviour in every case.
- Option 0 after: Almost nothing, since a z close to one means the gas behaves ideally and the correction can be dropped.
- Option 1 before: Corresponding states: two gases at the same reduced pressure and temperature behave alike.
- Option 1 after: It occupies 14 percent less space than ideal, so the pore volume holds about 14 percent more gas.
- Option 2 before: Because the chart is drawn for a reference gas with a gravity correction applied afterward.
- Option 2 after: It occupies 14 percent more space than ideal, so the same pore volume holds about 14 percent less gas overall.
- Option 3 before: Because the departures from ideality are small enough that one average curve is adequate.
- Option 3 after: The gas is 14 percent more compressible than ideal, which matters only for drive.

### fluid beginner final ord 31: fixed (duplicate)

- Flag: duplicate candidate (near p0.88 k0.83) with beginner module m05-gas-and-water 5: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m05-gas-and-water 5; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: For a 0.75 gas at 3200 psia and 180 F, what is the reduced state?
- Prompt after: Rounding the Rankine offset to 460 rather than 459.67 shifts the absolute temperature by how much, and when does that matter?
- Explanation before: Reduced properties are absolute, so temperature must be in Rankine. The engine uses 459.67 throughout, and that offset is the first thing to check when two calculations differ in the fourth decimal.
- Explanation after: A third of a degree is about 0.05 percent of the absolute temperature. The engine uses 459.67 throughout, and when two calculations of the same z differ in the fourth decimal this is the first thing to check.
- Option 0 before: A reduced pressure of 4.874147976086212 and a reduced temperature of 1.6414421349756225 in Rankine.
- Option 0 after: About 0.05 percent, negligible for most work but not when checking two implementations agree.
- Option 1 before: A reduced pressure of 4.874147976086212 and a reduced temperature of 0.4618, taking temperature in Fahrenheit.
- Option 1 after: About 0.05 percent, which the z correlations amplify into several percent at a reduced temperature near 1.6.
- Option 2 before: A reduced pressure of 4.234 and a reduced temperature of 1.6414421349756225, using 460 not 459.67.
- Option 2 after: About a third of a percent, the same size as the gap between the two z correlations.
- Option 3 before: A reduced pressure of 0.205 and a reduced temperature of 0.609, taking both ratios the other way up.
- Option 3 after: Nothing measurable, since the reduced temperature is a ratio and the offset cancels between top and bottom.

### fluid beginner final ord 35: fixed (duplicate)

- Flag: duplicate candidate (near p0.61 k1.00) with beginner module m05-gas-and-water 13: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m05-gas-and-water 13; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Why does formation water matter on a field that has never produced water?
- Prompt after: Why does the water formation volume factor usually sit slightly above one?
- Explanation before: Above the bubble point, water and rock expansion can be a serious fraction of the drive, because the water volume is large even though its compressibility is small.
- Explanation after: Bw typically lies between 1.00 and 1.06. The engine uses McCain on a pure water baseline because the salinity correction to Bw is small, although salinity raises water viscosity appreciably.
- Option 0 before: Because connate water is present everywhere and its expansion contributes to the drive in an undersaturated reservoir.
- Option 0 after: Because reservoir temperature expands the water and reservoir pressure compresses it, and the temperature effect usually wins by a small margin.
- Option 1 before: Because a simulator refuses a deck without a water formation volume factor, whatever the field produces.
- Option 1 after: Because water compressibility is so small that pressure has no effect, leaving thermal expansion alone to set it.
- Option 2 before: Because the water saturation enters the relative permeability curves the description must be consistent with.
- Option 2 after: Because salinity adds dissolved solids, and the brine occupies more volume than the fresh water it replaced.
- Option 3 before: Because an aquifer will eventually encroach, so the properties are needed for the later forecast.
- Option 3 after: Because the stock tank barrel of water is measured at 60 F, and a reference below ambient always gives a ratio above one.

### fluid beginner final ord 42: fixed (duplicate)

- Flag: duplicate candidate (near p0.60 k1.00) with beginner module m06-the-associate-reading 14: same concept and same answer, trivially reworded
- Reason: True duplicate of beginner module m06-the-associate-reading 14; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What is the habit this tier builds?
- Prompt after: Before submitting the capstone, what three things should be written down for each answer?
- Explanation before: A screening number that happens to be right is still a screening number, and quoting it as measured misleads the next reader whatever its value. The others are good practice and narrower.
- Explanation after: Every likely mistake in the capstone is a different correlation, a different input, or the same correlation run the other way, so most wrong answers come from getting one of those three silently different from what the field asked.
- Option 0 before: Round every correlated number to two significant figures before it enters a downstream calculation.
- Option 0 after: The value, its sixteen digits and its units, so the tolerance check can be reproduced exactly.
- Option 1 before: Ask what tier a number is on before asking whether it is right.
- Option 1 after: Which correlation, which inputs, and which pressure.
- Option 2 before: Run every available correlation and report the spread rather than any single value.
- Option 2 after: The tier, the validity warning and the spread across every correlation the engine carries for it.
- Option 3 before: Prefer measured values wherever they exist and correlated values only where they do not.
- Option 3 after: The designed value, the correlated value and the percentage gap between the two of them.

### fluid intermediate final ord 9: fixed (duplicate)

- Flag: duplicate candidate (near p1.00 k1.00) with intermediate module m02-the-good-oil-report 3: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m02-the-good-oil-report 3; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: The report quotes pressures in psig on a 14.65 psia base. A reported 2620 psig is what?
- Prompt after: The report prints the optimum separator at 100 psig. What absolute pressure does the fixture carry?
- Explanation before: A study reproduced with the wrong base is out by about 15 psi everywhere, which is small enough to look like scatter.
- Explanation after: The report's pressures are psig on a 14.65 psia base, stated in the report itself, so 100 psig is 114.65 psia and the stock tank it implies sits at 14.65 psia.
- Option 0 before: 2634.7 psia, using the more usual atmospheric base of 14.7 psia.
- Option 0 after: 100 psia, since the fixture keeps the separator pressure exactly as the report prints it.
- Option 1 before: 2605.35 psia, since a gauge pressure is an absolute pressure less the base.
- Option 1 after: Whatever the laboratory's elevation gives, since a gauge base varies with altitude.
- Option 2 before: It cannot be converted without knowing the elevation of the laboratory.
- Option 2 after: It adds the 14.696 psia standard atmosphere, as the engine does for every conversion.
- Option 3 before: 2634.65 psia.
- Option 3 after: 114.65 psia.

### fluid intermediate final ord 10: fixed (duplicate)

- Flag: duplicate candidate (near p0.69 k0.85) with intermediate module m02-the-good-oil-report 6: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m02-the-good-oil-report 6; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Methane is 0.3647 and C7+ is 0.3329. What kind of fluid is this?
- Prompt after: The eleven mole fractions in the analysis sum to one. What does that establish?
- Explanation before: Reading those two numbers first is the quickest way to know what kind of fluid a report describes.
- Explanation after: The sum is a useful arithmetic check and says nothing about quality. A recombination at the wrong gas-oil ratio, or C7+ properties measured on a partly weathered sample, still sum to one.
- Option 0 before: A volatile oil, since a black oil would have methane well below 0.3 and a much larger heavy fraction.
- Option 0 after: That the recombination ratio was right, since a wrong ratio would leave the eleven fractions summing above or below one.
- Option 1 before: A black oil, since a condensate has methane above 0.7 and C7+ below 0.05 and a volatile oil sits between.
- Option 1 after: Only that the arithmetic closes: a composition can sum perfectly and still be wrong in its light end or its C7+.
- Option 2 before: A gas condensate, since the methane fraction is the largest single entry in the analysis.
- Option 2 after: That the C7+ properties are consistent, since the plus fraction is the residual that closes the sum.
- Option 3 before: It cannot be determined from the composition alone without knowing where the reservoir sits on the envelope.
- Option 3 after: That the sample was representative, since a sample that had lost gas would show a deficit in the sum.

### fluid intermediate final ord 11: fixed (duplicate)

- Flag: duplicate candidate (near p0.91 k1.00) with intermediate module m02-the-good-oil-report 8: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m02-the-good-oil-report 8; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: How much of this fluid does the single C7+ entry carry?
- Prompt after: Why does the laboratory report C7+ as one lump rather than compound by compound?
- Explanation before: Its molecular weight is 218 against methane's 16. One entry out of eleven carries most of the fluid, and its properties come from two measurements and six correlations.
- Explanation after: C7+ in a real crude is hundreds of compounds. Separating it further costs more than it returns for most purposes, so the laboratory reports a molecular weight and a specific gravity instead.
- Option 0 before: A third of the moles and about the same share of the mass, since molecular weight cancels in a mole fraction.
- Option 0 after: Because an equation of state can accept only one heavy component, so a finer analysis would be discarded.
- Option 1 before: A tenth of the moles and a third of the mass, which is typical for the heavy end of a black oil.
- Option 1 after: Because the heavy compounds are all paraffins of similar behaviour, so listing them separately adds nothing.
- Option 2 before: A third of the moles and something over two thirds of the mass.
- Option 2 after: Beyond about C10 a crude is a continuum rather than a list.
- Option 3 before: It cannot be stated in mass terms, since a lumped fraction has no single molecular weight.
- Option 3 after: Because the heavy end is below the chromatograph's detection limit and so cannot be quantified at all.

### fluid intermediate final ord 13: fixed (duplicate)

- Flag: duplicate candidate (near p0.87 k1.00) with intermediate module m02-the-good-oil-report 12: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m02-the-good-oil-report 12; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: The report lists one separator stage. How many flash stages does reproducing it need?
- Prompt after: The fixture stores only the reported separator stage. What does the engine do when it reproduces the study?
- Explanation before: The stock tank is a flash stage the report does not call one, because liquid arriving at 14.65 psia from 114.65 psia releases gas, and that gas is in the reported 768 scf/stb.
- Explanation after: That appended stage is not in the report. It is the modelling step that turns a reported test into a reproducible calculation, and it has to be written down somewhere or the calculation is not reproducible.
- Option 0 before: One, since the report lists one and the tank is where oil ends up rather than a separation step.
- Option 0 after: It flashes once to 114.65 psia and scales the result by the reported gas-oil ratio to recover the tank gas.
- Option 1 before: Three, since the fluid must first be flashed from reservoir conditions to the separator inlet.
- Option 1 after: It asks the user for the stock tank conditions, since the report does not state them anywhere in the tables.
- Option 2 before: Four, one for each of the separator tests the report contains, run from high pressure to low.
- Option 2 after: It reads the tank stage from the differential liberation, which ends at atmospheric pressure and 60 F.
- Option 3 before: Two: the separator at 114.65 psia and the stock tank at 14.65 psia.
- Option 3 after: It appends the stock tank stage at 75 F and 14.65 psia.

### fluid intermediate final ord 14: fixed (duplicate)

- Flag: duplicate candidate (near p0.60 k1.00) with intermediate module m02-the-good-oil-report 13: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m02-the-good-oil-report 13; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Omit the stock tank stage. What happens?
- Prompt after: Omitting the stock tank stage pushes the gas-oil ratio, stock tank volume and formation volume factor one way each. What about the stock tank gravity?
- Explanation before: The model runs and produces a full set of numbers, every one of them wrong. It is a reading error rather than a physics error, which is what makes it the classic one.
- Explanation after: Three of the four errors point in a consistent direction. The liquid retains material that should have gone to gas, but that material is intermediates, so its effect on the stock tank density is not simply signed.
- Option 0 before: The gas-oil ratio comes out too high, since all the gas is attributed to the one remaining stage.
- Option 0 after: It comes out much too light, because the gas left in the liquid lowers its density at 60 F.
- Option 1 before: The gas-oil ratio comes out too low, the stock tank volume too large, the formation volume factor too small, and nothing fails.
- Option 1 after: Its direction is less obvious than it looks, because the retained components are intermediates whose effect on density is not trivially signed.
- Option 2 before: The calculation fails at initialisation, since a train must terminate at atmospheric pressure.
- Option 2 after: It is unchanged, because gravity is measured on the tank liquid at 60 F whatever the path it took there.
- Option 3 before: Nothing measurable changes, since the tank releases only a few percent of the total gas.
- Option 3 after: It moves by exactly the ratio of the two stage pressures, since the tank flash scales the liquid density.

### fluid intermediate final ord 18: fixed (duplicate)

- Flag: duplicate candidate (near p0.82 k0.87) with intermediate module m03-characterizing-the-plus-fraction 7: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m03-characterizing-the-plus-fraction 7; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What does the acentric factor control in the equation of state?
- Prompt after: How does the engine's gate suite test the characterization correlations?
- Explanation before: That is its whole role. Good Oil's C7+ comes out at 0.6690835265426222, against methane near 0.011 and normal decane near 0.49.
- Explanation after: nC10 has a measured boiling point and measured criticals, so that test has a real answer. It is also the honest limit of testing: the chain can be shown to work on pure substances and cannot be shown to work on a lump, which has no true answer.
- Option 0 before: The covolume, so that a less spherical molecule occupies proportionally more space.
- Option 0 after: By comparing the C7+ properties against the values in the laboratory report.
- Option 1 before: The binary interaction parameter against methane, which is why heavy components need large values.
- Option 1 after: By checking the Watson K of every fluid lands between 10 and 12.5, the range of ordinary crude families.
- Option 2 before: The critical compressibility, corrected from the two-parameter value toward the real one.
- Option 2 after: By running Soreide and Kesler-Lee against each other and requiring the two to agree.
- Option 3 before: How fast the attraction term weakens with temperature, through kappa in the alpha function.
- Option 3 after: By feeding them the MW and SG of known normal alkanes and checking the recovered criticals.

### fluid intermediate final ord 24: fixed (duplicate)

- Flag: duplicate candidate (near p0.75 k1.00) with intermediate module m04-the-untuned-model 5: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m04-the-untuned-model 5; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: The model returns 31.8056416463794 API against a measured 40.7. Where does that come from?
- Prompt after: The literature gate sets the API tolerance at 10, just above the observed 8.9 bias. Why there?
- Explanation before: The pure C7+ pseudo recovers a standard-condition specific gravity of 0.9075 against the defined 0.8515, and a six percent error in specific gravity becomes nine API because the scale is compressed.
- Explanation after: The fixture's citation text says the tolerance regression-pins a documented bias rather than certifying an acceptable answer. A loose gate hides the bias and a gate at the correct answer fails and gets ignored.
- Option 0 before: The missing stock tank stage, which leaves intermediates in the liquid and weighs it down.
- Option 0 after: Because ten API is the accepted accuracy of an untuned cubic equation on stock tank oil.
- Option 1 before: The binary interaction parameter with methane, which controls how much light material stays in the tank oil.
- Option 1 after: Because a looser tolerance would let the later tuning step reach the measured gravity purely by construction.
- Option 2 before: The Jhaveri-Youngren volume shift on the C7+ pseudo-component, which makes that lump too dense.
- Option 2 after: So it passes today and fails the moment the bias changes, which is what a regression pin is for.
- Option 3 before: The critical pressure of the pseudo-component, the least reliable output of the characterization chain.
- Option 3 after: Because the API scale is compressed, so ten API corresponds to the six percent tolerance on the density.

### fluid intermediate final ord 29: fixed (duplicate)

- Flag: duplicate candidate (near p0.94 k0.61) with intermediate module m05-correlations-against-a-study 1: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m05-correlations-against-a-study 1; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Standing had 105 points from one region, Vasquez-Beggs over 6000 from everywhere. Which is better?
- Prompt after: Why is a correlation usually enough for ranking two prospects on the same kind of fluid?
- Explanation before: A small coherent sample does well on oils like its own. A broad heterogeneous one is mediocre everywhere rather than good somewhere.
- Explanation after: A correlation's error is largely systematic, and it shifts both options the same way, so the order between them holds. It stops being enough when the decision turns on the difference.
- Option 0 before: Vasquez-Beggs, since more measurements always means a better constrained fit.
- Option 0 after: Because a ranking needs only one significant figure, which any correlation inside its range provides.
- Option 1 before: Neither in general; they are different trades between breadth and specificity.
- Option 1 after: Because systematic errors cancel in a comparison, so the ranking survives.
- Option 2 before: Standing, since a coherent regional sample gives a tighter fit than a heterogeneous one.
- Option 2 after: Because ranking uses the screening tier, which need not be accurate.
- Option 3 before: Whichever was published later, having had access to the earlier data as well as its own.
- Option 3 after: Because both prospects will be measured before sanction, so the correlation's error never propagates.

### fluid intermediate final ord 30: fixed (duplicate)

- Flag: duplicate candidate (near p0.90 k1.00) with intermediate module m05-correlations-against-a-study 2: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m05-correlations-against-a-study 2; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What does a measurement change about running three correlations?
- Prompt after: A laboratory bubble point comes in 40 percent off every correlation. What is the honest use of the correlations?
- Explanation before: Do that on enough fluids and you know something about your basin that no published correlation does.
- Explanation after: Sanity checking a measurement is one of the honest uses of a correlation. A sample from a well producing below its bubble point, for example, has lost gas and reads low, and the correlations are what flag it.
- Option 0 before: It converts a spread into an error, so you can say which is closer, by how much and in which direction.
- Option 0 after: As a cross-check: a measurement that far from every correlation is worth re-examining before it is used.
- Option 1 before: It removes the need to run them at all, since a measurement always supersedes a correlation on its own fluid.
- Option 1 after: As the replacement value, since three published methods agreeing outweigh one laboratory sample from one well.
- Option 2 before: It lets you pick the correlation that agrees, which is how a correlation is chosen for a basin.
- Option 2 after: As an average with the measurement, weighting each correlation by the size of its fitted data set.
- Option 3 before: It narrows the spread, the measurement being added to each correlation's fitted data.
- Option 3 after: None, since a measurement always supersedes a correlation on the fluid it was taken from.

### fluid intermediate final ord 39: fixed (duplicate)

- Flag: duplicate candidate (near p0.92 k0.93) with intermediate module m06-the-professional-reading 7: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m06-the-professional-reading 7; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What do three of the six Professional fields have in common?
- Prompt after: Before submitting the Professional capstone, what two things should be written down for each field?
- Explanation before: The commonest way to get a plausible wrong answer on any of the six is to report the measured value where the model value was asked for, or the reverse.
- Explanation after: Three fields ask for a model output and three for a comparison against a measurement. Reporting the measured value where the model value was asked for, or the reverse, is the commonest plausible wrong answer.
- Option 0 before: They depend on the characterization, so a C7+ error propagates into all three of them.
- Option 0 after: The tier of the number and the tolerance the field applies, so the grading band is known.
- Option 1 before: They can be read straight from the study explorer panel without any arithmetic outside it.
- Option 1 after: The correlation that produced it and its validity range, since both are needed to reproduce it.
- Option 2 before: They are evaluated at the separator conditions rather than at the study's reservoir conditions.
- Option 2 after: The number of significant figures and the unit, where most plausible wrong answers come from.
- Option 3 before: They ask for a comparison against a measurement rather than for a bare model output on its own.
- Option 3 after: Whether the number came out of the model or out of the report, and which direction its error should run.

### fluid intermediate final ord 40: fixed (duplicate)

- Flag: duplicate candidate (near p0.79 k1.00) with intermediate module m06-the-professional-reading 8: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m06-the-professional-reading 8; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Which two experiments supply a reservoir engineer's Bo and Rs?
- Prompt after: Reading a PVT report you did not commission, what is the first question to ask?
- Explanation before: Neither measures them alone. Combining them by the Amyx correction is a modelling choice, exact at the bubble point and approximate below it.
- Explanation after: A sample from a well producing below its bubble point has already lost gas and its bubble point reads low. The next two questions are which separator conditions the reported Bo corresponds to and whether the differential data was corrected.
- Option 0 before: The differential liberation supplies the shape and the separator test supplies the level.
- Option 0 after: How the sample was taken, and whether the well was flowing above its bubble point.
- Option 1 before: The constant composition expansion supplies the shape and the differential liberation the level.
- Option 1 after: Which laboratory ran it, since the procedure differs enough between laboratories to matter.
- Option 2 before: The separator test supplies both, being the only experiment referenced to a stock tank barrel.
- Option 2 after: Whether the composition sums to one, since a report that fails that check cannot be used at all.
- Option 3 before: Neither; both come from the composition run through an equation of state.
- Option 3 after: Whether a tuned equation of state model is supplied with it.

### fluid intermediate final ord 41: fixed (duplicate)

- Flag: duplicate candidate (near p0.83 k0.68) with intermediate module m06-the-professional-reading 9: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m06-the-professional-reading 9; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Which number in a PVT report is most often misused?
- Prompt after: The constant composition expansion reports a relative volume column. What is it referenced to, and what does it give?
- Explanation before: It is the biggest table in the report and it is labelled with things that look like what a simulator wants. Using them directly overstates both by several percent.
- Explanation after: Relative volume equals one at the bubble point by construction, while Bo at the bubble point is around 1.4 for this fluid. Turning cell volumes into Bo needs the separator test.
- Option 0 before: The bubble point, quoted without its temperature and therefore meaningless elsewhere.
- Option 0 after: A stock tank barrel, so above the bubble point it is the undersaturated formation volume factor.
- Option 1 before: The total gas-oil ratio, quoted without its separator conditions and therefore incomplete.
- Option 1 after: The residual oil at 60 F, so it matches the differential liberation's Bod.
- Option 2 before: The differential liberation's Bod and Rsd, used directly when they are referenced to a residual oil.
- Option 2 after: The volume at the bubble point, so it equals one there, and its slope above it gives co.
- Option 3 before: The relative volume, mistaken for the formation volume factor because both of them are dimensionless.
- Option 3 after: The initial cell volume, so it stays below one and gives the oil's shrinkage.

### fluid intermediate module m06-the-professional-reading ord 12: fixed (duplicate)

- Flag: duplicate candidate (near p0.64 k0.62) with intermediate module m04-the-untuned-model 11: same concept and same answer, trivially reworded
- Reason: True duplicate of intermediate module m04-the-untuned-model 11; kept that question, whose module teaches the point, and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What four things make a bias documented rather than a defect?
- Prompt after: What did the Professional tier deliberately not do?
- Explanation before: A defect is behaviour nobody intended and nobody knows about. Each of this tier's biases is understood by mechanism, reproducible run to run, recorded in the gates, and directional across fluids.
- Explanation after: Every model number came from composition and published characterization correlations with nothing adjusted, the saturation pressure, flash and separator train were used as they come, and the screening quantities are left for an ungraded Expert module.
- Option 0 before: Small, systematic, published and correctable, which are the four properties a regression pin requires.
- Option 0 after: It did not read a real study, working instead from the designed Ekene fluid carried through the series.
- Option 1 before: Understood, reproducible, recorded and directional.
- Option 1 after: It tuned nothing, opened no equation of state, and touched no screening quantity.
- Option 2 before: Measured, bounded, disclosed and accepted, which is the sequence a limitation goes through before release.
- Option 2 after: It did not run a compositional model, comparing only correlations against the laboratory report.
- Option 3 before: Known to the author, stated in the manual, flagged at run time and covered by a test.
- Option 3 after: It did not compare anything against measurement, leaving that for the Expert tier's regression.

### fluid advanced final ord 1: fixed (duplicate)

- Flag: duplicate candidate (near p0.67 k1.00) with advanced module m01-the-equation-of-state 3: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m01-the-equation-of-state 3; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Why does the cubic FORM matter for phase behaviour?
- Prompt after: Would replacing Peng-Robinson with a far more accurate equation much improve a model of Good Oil?
- Explanation before: Three roots means a two-phase region: largest is the vapour volume, smallest the liquid, middle one meaningless. The mathematics produces the split rather than having it bolted on.
- Explanation after: A better equation would be more accurate for pure substances whose parameters are known. Improving it would optimise the part of the chain that is already the most rigorous, while the uncertainty sits in the characterized heavy end.
- Option 0 before: Because a cubic can be solved in closed form, which is what makes a compositional simulation fast enough to run at all.
- Option 0 after: Yes, because the cubic's liquid density error is the model's largest bias, and a better equation would remove that bias at its source.
- Option 1 before: Because a cubic has one or three real roots, so the equation itself says whether there is one phase or two.
- Option 1 after: Little, because a third of the moles is a lumped pseudo-component on correlated properties, so the equation is not the limit.
- Option 2 before: Because a cubic is the lowest order reproducing the critical point's inflection in the isotherm.
- Option 2 after: Yes, because a reference equation would fix the saturation pressure bias the tuning had to chase.
- Option 3 before: Because a cubic guarantees a unique liquid root, which is what a flash needs to converge.
- Option 3 after: No, because every equation of state reduces to the same cubic once mixing rules are applied.

### fluid advanced final ord 2: fixed (duplicate)

- Flag: duplicate candidate (near p0.67 k0.77) with advanced module m01-the-equation-of-state 4: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m01-the-equation-of-state 4; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Why are multi-parameter reference equations not used for reservoir fluids?
- Prompt after: Why does Peng-Robinson dominate reservoir work over Soave-Redlich-Kwong?
- Explanation before: The thing we most need to model, the heavy fraction, is what they cannot describe. A cubic loses only on pure-substance accuracy, which matters least here.
- Explanation after: The two differ in the form of the attraction term's volume dependence. The engine implements Peng-Robinson 1978 alone, which is a stated scope decision rather than a claim that the other is wrong.
- Option 0 before: They need per-substance parameters a pseudo-component does not have, they do not extend to mixtures easily, and they are slow.
- Option 0 after: Because its attraction term's denominator was chosen to improve liquid density predictions, and it generally does better on them.
- Option 1 before: They are proprietary, so a simulator cannot embed them without licensing every substance.
- Option 1 after: Because it is the only cubic with an exact closed form for the fugacity coefficient.
- Option 2 before: They were fitted for cryogenic work and never extended above C6 in the hydrocarbon series.
- Option 2 after: Because it needs no acentric factor, so a pseudo-component needs one fewer correlation.
- Option 3 before: They require an iterative volume solve, which a cubic avoids with its closed-form root.
- Option 3 after: Because it reproduces the critical compressibility exactly for every hydrocarbon.

### fluid advanced final ord 4: fixed (duplicate)

- Flag: duplicate candidate (near p0.80 k0.77) with advanced module m01-the-equation-of-state 7: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m01-the-equation-of-state 7; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Where do 0.457235529 and 0.077796074 come from?
- Prompt after: Why are components with an acentric factor near 0.49 worth knowing about?
- Explanation before: They are not fitted constants, which matters when deciding what in the equation may legitimately be adjusted.
- Explanation after: The harness records a C10 component sitting near the switch, at 0.4 against 0.491, where the branch choice was visible in the result. The engine implements both branches and selects on the acentric factor.
- Option 0 before: A least-squares fit to whatever pure-substance volumetric data happened to be available when Peng and Robinson published.
- Option 0 after: Because the 1976 and 1978 kappa forms give their largest difference there, so tuning should target them.
- Option 1 before: The critical compressibility of methane, taken as the family's reference substance.
- Option 1 after: Because above that value the acentric factor stops affecting the attraction term at all.
- Option 2 before: Exact algebra at the critical point, where the first and second derivatives of pressure with respect to volume vanish.
- Option 2 after: Because two implementations that place the kappa branch switch differently will disagree on them.
- Option 3 before: A convention chosen so the equation reduces to van der Waals at zero acentric factor.
- Option 3 after: Because Lee-Kesler and Edmister diverge there, so the characterization is least reliable.

### fluid advanced final ord 7: fixed (duplicate)

- Flag: duplicate candidate (near p0.90 k0.86) with advanced module m01-the-equation-of-state 15: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m01-the-equation-of-state 15; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Why does the volume translation not appear in the equilibrium?
- Prompt after: Why is the equilibrium condition written in fugacities rather than chemical potentials?
- Explanation before: The engine reports untranslated fugacities and translates only volumes and densities. It improves densities and provably leaves the phase behaviour alone.
- Explanation after: Fugacity is the same physics in more usable coordinates. A residual expressed in fugacities is a quantity an engineer can reason about.
- Option 0 before: Because it is applied only to reported outputs, after the flash has already converged.
- Option 0 after: Because chemical potential is not defined for a pseudo-component, which has no reference state to measure it from.
- Option 1 before: Because its effect falls below the tolerance the outer iteration converges to.
- Option 1 after: Because fugacity already includes the volume translation, which a chemical potential formulation would miss.
- Option 2 before: Because a constant shift changes every component's fugacity in a phase by the same factor, leaving the ratio across the phases unchanged.
- Option 2 after: Fugacity expresses the same condition in pressure units and stays well behaved at zero composition, where chemical potential diverges.
- Option 3 before: Because the fugacity depends on the compressibility factor rather than on the molar volume.
- Option 3 after: Because fugacities are measured directly in the laboratory, so the residual is anchored to real data.

### fluid advanced final ord 8: fixed (duplicate)

- Flag: duplicate candidate (near p0.93 k0.79) with advanced module m02-flash-and-envelope 1: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m02-flash-and-envelope 1; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Why can a flash not decide by itself how many phases there are?
- Prompt after: A traced phase envelope puts the critical point somewhere implausible. What is it telling you?
- Explanation before: It can converge on the trivial answer for a mixture that IS two phase, if the starting estimate is poor. Detecting it afterwards is possible and fragile.
- Explanation after: For a mixture with a lumped pseudo-component the critical point is a model output rather than a fluid property, and it moves when the characterization moves.
- Option 0 before: Because it converges on a trivial solution where both phases carry the feed composition, which satisfies equal fugacities and means nothing.
- Option 0 after: That the plus fraction was probably characterized wrongly, a check far more sensitive than any single saturation pressure.
- Option 1 before: Because the K values are an input to it rather than an output, so the phase count is assumed.
- Option 1 after: That the stability test has failed near the critical point, and the tracing should simply be rerun on a finer grid.
- Option 2 before: Because its material balance assumes two phases, making a single-phase feed inconsistent.
- Option 2 after: That the fluid is genuinely unusual, since the critical point on the envelope is a measured property of the fluid.
- Option 3 before: Because its tolerance cannot distinguish a very small vapour fraction from exactly zero.
- Option 3 after: That the volume shift is wrong, since it sets where the two branches of the envelope meet.

### fluid advanced final ord 9: fixed (duplicate)

- Flag: duplicate candidate (near p0.86 k0.80) with advanced module m02-flash-and-envelope 2: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m02-flash-and-envelope 2; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What does a stability test ask?
- Prompt after: What is the cricondentherm, and what does it explain?
- Explanation before: If a trial phase of any composition lowers the energy the mixture is unstable. That is stronger and more reliable than counting roots.
- Explanation after: To the right of the cricondentherm the mixture is single phase at every pressure, so depletion never enters the two-phase region. The highest pressure on the loop is the cricondenbar.
- Option 0 before: Whether the cubic returns three real roots, which signals a two-phase region.
- Option 0 after: The highest pressure on the loop, above which no gas can remain dissolved in the liquid phase.
- Option 1 before: Whether Wilson's K values straddle one, which indicates a mixture that will split.
- Option 1 after: Where the bubble and dew branches meet and the phases become one.
- Option 2 before: Whether the feed lies inside the phase envelope traced at that temperature.
- Option 2 after: The temperature of greatest retrograde condensation in a condensate.
- Option 3 before: Whether adding an infinitesimal trial phase would lower the total Gibbs energy.
- Option 3 after: The highest temperature two phases can exist at, which is what makes a dry gas dry.

### fluid advanced final ord 10: fixed (duplicate)

- Flag: duplicate candidate (near p0.89 k0.86) with advanced module m02-flash-and-envelope 3: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m02-flash-and-envelope 3; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Why run the stability test from both sides?
- Prompt after: Why does the engine scan for a saturation pressure on a logarithmic grid?
- Explanation before: A mixture mostly liquid just below its bubble point is unstable to a vapour-like trial and not a liquid-like one. Test only the liquid side and you wrongly call it stable.
- Explanation after: A heavy oil saturates at a few hundred psia and a rich condensate near ten thousand. A linear scan either misses the low end or wastes many evaluations at the high end.
- Option 0 before: Because the two sides use different starting estimates and running both improves convergence.
- Option 0 after: Because the stability flag changes logarithmically with pressure, so a linear grid would bias the bracket.
- Option 1 before: Because a mixture can be unstable to a vapour-like trial and not to a liquid-like one, and one side alone misses those cases.
- Option 1 after: Because saturation pressures span orders of magnitude, from a few hundred psia to ten thousand.
- Option 2 before: Because the vapour side finds dew points and the liquid side finds bubble points, and any given fluid may turn out to have either.
- Option 2 after: Because a log grid gives the bisection its tolerance at every pressure.
- Option 3 before: Because the energy surface has two minima and only both probes find the global one.
- Option 3 after: Because the cubic's roots are spaced logarithmically, and the grid matches that spacing.

### fluid advanced final ord 15: fixed (duplicate)

- Flag: duplicate candidate (near p0.73 k0.71) with advanced module m03-tuning 1: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m03-tuning 1; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What rule decides which parameters may be knobs?
- Prompt after: Why is adjusting Kesler-Lee's own coefficients ruled out as a tuning knob?
- Explanation before: It is the same rule the simulation course applied to its structural calibration: calibrate the unconstrained parameter against the constrained quantity, never the reverse.
- Explanation after: Tuning adjusts the constructed properties of the pseudo-component. Changing a published correlation's coefficients would rewrite a method fitted to many substances using a single fluid.
- Option 0 before: Tune whichever parameters most reduce the residual, since that converges fastest.
- Option 0 after: Because the coefficients are exact algebra from the critical point, like the Peng-Robinson constants.
- Option 1 before: Tune exactly as many parameters as there are targets, so the system is determined.
- Option 1 after: Because the coefficients have zero-width bounds, so the solver cannot move them.
- Option 2 before: Tune constructed quantities to reproduce measured ones, and never adjust a measured quantity.
- Option 2 after: Because that would not be tuning; it would be publishing a new correlation on a sample of one.
- Option 3 before: Tune whichever parameters carry no published uncertainty, since nobody is in a position to defend those.
- Option 3 after: Because Kesler-Lee does not affect any of the four targets once the multipliers exist.

### fluid advanced final ord 16: fixed (duplicate)

- Flag: duplicate candidate (near p0.62 k0.75) with advanced module m03-tuning 3: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m03-tuning 3; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What would happen if the regression could move methane's critical temperature?
- Prompt after: What is the practical payoff of confining every knob to the pseudo-component?
- Explanation before: The model would reproduce the four numbers and be wrong about methane everywhere. That is what happens when a regression is given a parameter it should not have.
- Explanation after: A model that had absorbed its errors into methane would be wrong about methane for every question the tuning did not cover. Holding to the rule is worth it even when a wider regression would fit better.
- Option 0 before: It would, because methane at 0.3647 strongly affects the saturation pressure and a least-squares solver takes efficient routes.
- Option 0 after: The model stays correct about its library components everywhere, so it can answer questions the tuning did not cover, within reason.
- Option 1 before: It would not, since the bounds on library components are set to zero width.
- Option 1 after: The regression converges faster, because the library components need no derivatives and drop out of the Jacobian.
- Option 2 before: It would, but negligibly, since methane's published properties are already near optimal.
- Option 2 after: The tuned values can then be booked as measured, since the pseudo-component has no other source of properties.
- Option 3 before: It would fail to converge, since the library properties feed the characterization too.
- Option 3 after: The fit becomes exact, because the pseudo-component carries most of the mass of the fluid.

### fluid advanced final ord 18: fixed (duplicate)

- Flag: duplicate candidate (near p0.78 k1.00) with advanced module m03-tuning 8: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m03-tuning 8; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Which knob cannot affect the saturation pressure?
- Prompt after: Raise the C7+ critical temperature multiplier. What happens to the saturation pressure?
- Explanation before: That gives it an almost private effect on the stock tank gravity, which makes the regression better conditioned than four knobs fighting over the same residuals.
- Explanation after: The criticals set a and b for the pseudo-component, which set how strongly it holds on to the light components. A more liquid-like heavy fraction holds methane more tightly.
- Option 0 before: The critical pressure multiplier, since the saturation pressure depends on temperature instead.
- Option 0 after: It rises, because a hotter critical point makes methane leave the liquid more readily.
- Option 1 before: The interaction parameter, since it enters the attraction and not the phase split.
- Option 1 after: Nothing; the multipliers act only on density.
- Option 2 before: None; all four affect it through the mixture's a and b parameters.
- Option 2 after: It rises and falls in turn, since the alpha function reverses sign near Tr of one.
- Option 3 before: The volume shift, because the translation cancels in the equilibrium.
- Option 3 after: It falls: the heavy fraction becomes more liquid-like.

### fluid advanced final ord 20: fixed (duplicate)

- Flag: duplicate candidate (near p0.62 k1.00) with advanced module m03-tuning 13: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m03-tuning 13; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What is the Jacobian gotcha?
- Prompt after: Why does the stock tank gravity enter the objective as a specific gravity rather than in API?
- Explanation before: The default nudge is about one part in a million against a 0.05 psia tolerance. Three of the four knobs affect the saturation pressure and the fit would have stalled with them untouched.
- Explanation after: The objective sums squared relative errors so that a pressure in thousands of psia and a gravity in tens of API contribute comparably. Every residual is of order 0.01 per percent of mismatch.
- Option 0 before: The saturation pressure is quantized to the bisection tolerance, so a small finite-difference step moves it by nothing and returns a zero derivative.
- Option 0 after: Because API is a compressed scale, and a residual in API would weight the gravity target far more heavily than the other three.
- Option 1 before: The Jacobian is singular because two knobs affect the same target identically.
- Option 1 after: Because the laboratory reports specific gravity directly, and the API value is only derived from it afterwards.
- Option 2 before: The step is taken in tuned rather than physical space, so the multipliers are mis-scaled.
- Option 2 after: Because API is not defined for the pseudo-component, which has no stock tank density of its own.
- Option 3 before: The Jacobian is computed once and reused after the knobs have moved substantially.
- Option 3 after: Because the volume shift correlation is expressed against specific gravity rather than against API.

### fluid advanced final ord 21: fixed (duplicate)

- Flag: duplicate candidate (near p0.60 k1.00) with advanced module m03-tuning 14: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m03-tuning 14; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Why was that failure hard to notice?
- Prompt after: After a finite-difference regression one knob has barely moved. What could that mean?
- Explanation before: Nothing errored and nothing warned. The only way to notice was to look at how far each knob moved, see three had barely moved, and ask why.
- Explanation after: The three look identical in the output. Perturbing the knob by hand tells them apart: if the objective changes and the solver did not move it, the step size is wrong.
- Option 0 before: Because the warning it raised was suppressed by default in the engine's configuration.
- Option 0 after: That it has hit its bound, since a bounded knob pressed against its limit cannot move any further.
- Option 1 before: Because the regression converged, reported success and reduced the residual, since the one knob whose target was not quantized still worked.
- Option 1 after: That it is well determined, unconstrained by the data, or invisible to the derivative, and each needs a different response.
- Option 2 before: Because the affected knobs moved slightly, so it looked like a normal under-determined fit.
- Option 2 after: That the prior pull is too strong and should be removed so the fit can move the knob freely.
- Option 3 before: Because the tuned model still reproduced all four targets, so the fit appeared to succeed.
- Option 3 after: That the knob is irrelevant to every target and can be dropped from the tuning set with no loss.

### fluid advanced final ord 27: fixed (duplicate)

- Flag: duplicate candidate (near p0.83 k1.00) with advanced module m04-what-tuning-costs 12: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m04-what-tuning-costs 12; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: Which five lines does a tuned model's write-up need?
- Prompt after: If only one sentence of the write-up survives into a summary, what must it keep?
- Explanation before: Without the scope a reader assumes the whole model was fitted. Without the targets they cannot tell what it was fitted to. Without the cost they will find it themselves.
- Explanation after: Drop the scope and a reader assumes the whole model was fitted. Drop the targets and they cannot tell what it was fitted to. Drop the cost and they will find it themselves.
- Option 0 before: The knobs, the bounds, the solver, the iteration count and the final residual.
- Option 0 after: The final residual and the reduction factor, which together say how good the fit was.
- Option 1 before: The composition, the characterization, the conditions, the train and the targets.
- Option 1 after: The four tuned knob values, to rebuild the model.
- Option 2 before: The model, the fluid, the date, the engine version and who ran it.
- Option 2 after: The engine version and the date of the run.
- Option 3 before: What was tuned, against what, the ledger, what was held fixed, and what it cost.
- Option 3 after: The scope of the knobs, the targets matched and the cost.

### fluid advanced final ord 32: fixed (duplicate)

- Flag: duplicate candidate (near p0.78 k0.61) with advanced module m05-the-tiers-this-course-will-not-grade 7: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m05-the-tiers-this-course-will-not-grade 7; kept the module question and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What is gated about LBC and what is not?
- Prompt after: What would it take to improve the compositional model's LBC viscosity, and does the engine do it?
- Explanation before: An implementation can be provably correct and still produce a number nobody should book. That distinction is the whole tier system in one example.
- Explanation after: The four tuning knobs are aimed at phase behaviour and density, so every viscosity this model reports is untuned by design, and the tier label says so.
- Option 0 before: The answer is gated against the study's viscosities and the implementation only reviewed.
- Option 0 after: Switching to the black-oil chain inside the flash, which the engine does whenever the fluid is a black oil.
- Option 1 before: Both are gated, the answer against the eight Coats and Smart fluids in the harness.
- Option 1 after: Adding more knobs to the phase tuning, which the engine does automatically once a viscosity target is supplied.
- Option 2 before: The arithmetic is verified by transcription and NIST anchors; the answer is not, because no measured viscosities exist for this fluid.
- Option 2 after: Tuning the critical volumes to measured viscosities, standard commercial practice that sits on the engine's out-of-scope register.
- Option 3 before: Neither is gated, which is what the screening label means.
- Option 3 after: Nothing, since the arithmetic is already gated against NIST anchors and so cannot be improved further.

### fluid advanced module m06-the-expert-reading ord 11: fixed (duplicate)

- Flag: duplicate candidate (near p0.78 k0.76) with advanced module m03-tuning 15: same concept and same answer, trivially reworded
- Reason: True duplicate of advanced module m03-tuning 15; kept that question, whose module teaches the point, and rewrote this one into a new question on a different point from the same module's lessons.
- Correct option or prompt changed: The question is replaced by a new one testing a different lesson point, so the keyed option is new text; answer_index and the keyed option's length rank are unchanged.
- Prompt before: What is the general form of the quantized-objective trap?
- Prompt after: How was the quantized saturation pressure made visible to the regression?
- Explanation before: The symptom is always the same: a parameter the solver decides has no effect. The check is to perturb it by hand and see whether the objective changes.
- Explanation after: One part in a thousand is large enough to move the saturation pressure across several bisection quanta and small enough to remain a local derivative, and every existing caller of the shared solver keeps the default.
- Option 0 before: Any objective evaluated by an iterative solver inherits that solver's convergence noise as derivative noise.
- Option 0 after: By tightening the bisection tolerance until the default step of one part in a million could see it.
- Option 1 before: Any target from a search with a tolerance, any counted quantity, or any rounded value returns a zero finite-difference derivative for a small enough step.
- Option 1 after: By an explicit absolute Jacobian step of one part in a thousand, added as a backward-compatible per-parameter option on the shared solver.
- Option 2 before: Any parameter whose effect is smaller than the objective's own tolerance is unidentifiable from the data.
- Option 2 after: By replacing the finite differences with an analytic derivative of the saturation pressure in the solver.
- Option 3 before: Any regression on a non-smooth objective will converge to a point on a discontinuity rather than a minimum.
- Option 3 after: By dropping the saturation pressure from the objective and fitting it separately after the other three.

## gasprocessing

Migration: `migrations/20261021b_b4_fix_gasprocessing.sql`

### gasprocessing advanced final ord 34: fixed (duplicate)

- Flag: duplicate of beginner module m01-what-this-engine-conditions 6 (near p0.64 k0.89): both ask how the standard cubic feet in a pound mole was measured out of the engine, same key
- Reason: True duplicate of the beginner m01 question; kept the module question and rewrote the final copy to ask how a different measured constant, the water overhead, was measured.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: How was the standard cubic feet in a pound mole measured out of the engine rather than read from an export?
- Prompt after: How was the water overhead of 1100.000000000000 Btu a lb measured out of the engine rather than read from its export?
- Explanation before: To measure a constant, ask the engine a question whose answer is that constant and nothing else, then print the ratio of the measurement to the export. The saturation route is how the molecular weight of water was measured.
- Explanation after: To measure a constant, ask the engine a question whose answer is that constant and nothing else. At one gallon per pound a gallon carries one pound of water, and with no reflux the overhead is charged once, so the term reads the Btu a lb directly. A reflux ratio of 0.250000 adds a quarter on top, and the BTEX still overhead is aromatics.
- Option 0 before: By dividing the gas constant by the standard pressure and multiplying by the standard temperature, which are all exported.
- Option 0 after: By dividing the overhead term at a reflux ratio of 0.250000 by the water a gallon carries, which leaves the constant alone.
- Option 1 before: By taking the saturation answer over the mole fraction the same call returns, which leaves the constant alone.
- Option 1 after: By running the BTEX mole balance at a unit absorbed fraction, where the still overhead in pounds a day is the constant.
- Option 2 before: By running the BTEX mole balance at one MMscfd, a million ppmv, a unit absorbed fraction and a unit molecular weight, where the answer is a million over the constant and nothing else.
- Option 2 after: By running the reboiler at a circulation ratio of one gallon per pound with no reflux, where the vaporization term is the overhead alone and nothing else.
- Option 3 before: By comparing the engine's water content against the golden's, since the golden builds the same volume from the SI gas constant.
- Option 3 after: By comparing the reboiler duty against the golden's, since the golden builds the same overhead from a steam table value.

## gaswell

Migration: `migrations/20261021b_b4_fix_gaswell.sql`

### gaswell intermediate final ord 7: fixed (duplicate)

- Flag: duplicate of advanced module m01-chosen-once-used-everywhere 4 (near p0.60 k1.00): both ask what the recommendation returns at each of the six EBOCHA-5 stations, same key
- Reason: True duplicate across tiers; kept the advanced module question and rewrote this final copy to test the m01 lesson point that interfacial tension and liquid density are typed inputs.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: Asked at each of the six EBOCHA-5 stations rather than once at the gauge, what does recommendCorrelation return?
- Prompt after: EBOCHA-5 is profiled with an interfacial tension of 62.0 dyne/cm and a liquid density of 66.2 lbm/ft3. Where did those two figures come from?
- Explanation before: The comparison is strict against 1000.0 psia, so the wellhead choice is coleman while the controlling station would have chosen turner.
- Explanation after: Interfacial tension and liquid density are inputs, and neither is a function of anything the modules know. The published Turner properties, water at 60.0 dyne/cm and 67.0 lbm/ft3, are labelled starting points rather than correlations, and EBOCHA-5 does not use them.
- Option 0 before: coleman at every station, because the function is handed the wellhead pressure by the profile and has no other pressure available to it.
- Option 0 after: They were computed at the shoe from its pressure, temperature and z, which is why the controlling station carries them.
- Option 1 before: turner at every station, since each station inherits the correlation the study was run under and the study was run under a single name.
- Option 1 after: They were read off the published water row and corrected for each station's pressure, since tension falls as the gas gets denser.
- Option 2 before: coleman at 880.0 psia and 978.0 psia, then turner at 1090.0, 1218.0, 1350.0 and 1500.0 psia.
- Option 2 after: They were typed in as inputs, and nothing the modules know computes either of them.
- Option 3 before: coleman down to 4500.0 ft, then turner below it.
- Option 3 after: They are the Turner defaults loadingProfile applies to every well.

## geomech

Migration: `migrations/20261021b_b4_fix_geomech.sql`

### geomech beginner final ord 41: fixed (double-key)

- Flag: "taken entirely on trust": friction angle and Poisson ratio arguably also on trust
- Reason: The friction angle and Poisson ratio are unmeasured seeds, so "on trust" alone could fit them; the prompt now says the inputs arrive from upstream of the engine, which the seeds (the engine's own lithology table) do not, and the explanation says so.
- Prompt before: The Associate tier takes two of its six inputs entirely on trust. Which, and from where?
- Prompt after: The Associate tier takes two of its six inputs entirely on trust from upstream of the engine. Which, and from where?
- Explanation before: Neither can be checked from inside this course, and an error in either propagates everywhere.
- Explanation after: Both arrive with the profile from upstream and neither can be checked from inside this course, so an error in either propagates everywhere. The friction angle and Poisson ratio are seeds from the engine's own lithology table, and the horizontal stresses are estimated by the engine itself.

### geomech beginner module m06-the-associate-reading ord 9: fixed (double-key)

- Flag: "taken entirely on trust": friction angle and Poisson ratio arguably also on trust
- Reason: Same ambiguity as beginner final 41; the prompt now asks what arrived on trust from upstream of the engine, which excludes the seeded friction angle and Poisson ratio (m04 l05: the engine carries that table and imports nothing from another domain).
- Prompt before: What did this tier take entirely on trust?
- Prompt after: Which inputs did this tier take entirely on trust from upstream of the engine?
- Explanation before: The engine deliberately does not compute the pore pressure, so a geomechanics answer cannot contain a circular argument about it.
- Explanation after: The overburden and the pore pressure arrive with the profile from upstream, and the engine deliberately does not compute the pore pressure, so no circular argument can hide in it. The friction angle and Poisson ratio are seeds from the engine's own lithology table, starting values that a sensitivity run tests.

### geomech advanced final ord 27: fixed (other)

- Flag: "which line is nearly always absent": soft prompt
- Reason: "Nearly always absent" from "a real stability summary" was loose; the prompt now anchors it to the collapse number being unlabelled, as advanced m04 l01 and l04 put it.
- Prompt before: One line is nearly always absent from a real stability summary. Which?
- Prompt after: A stability summary quotes a collapse gradient with nothing said about it. Which missing line would label that number?

### geomech advanced final ord 31: fixed (duplicate)

- Flag: editor-flagged: advanced final 31 = advanced m04-using-it-in-a-well-plan ord 9 (same options)
- Reason: Same question and options as the module question, kept there; the final copy now asks the learner to diagnose losses on a fast trip in as surge (advanced m04 l03), a point no question tested.
- Correct option or prompt changed: The question is replaced by a new one on a different point, so its key is new text; answer_index is unchanged.
- Prompt before: Everything a hole actually experiences has to sit in one range. List it.
- Prompt after: Returns are lost while running in fast, with a static mud weight comfortably inside the window. What mechanism fits?
- Explanation before: Four numbers in one window, and this course computes none of the transient three.
- Explanation after: Running pipe in surges the well, a transient pressure on top of the static mud weight, and a fast trip can exceed the fracture gradient with a mud weight comfortably inside the static window. Swab comes from pulling pipe and lowers the pressure, circulating density needs the pumps on, and thermal cooling builds over hours of circulation.
- Option 0 before: Only the static mud weight.
- Option 0 after: Thermal cooling of the wall.
- Option 1 before: The static mud weight, plus the circulating uplift, plus the surge, and minus the swab.
- Option 1 after: Surge from running pipe, added on top of the static mud weight, pushing past the fracture gradient.
- Option 2 before: The static mud weight and circulating density, both from the hydraulics course.
- Option 2 after: Swab from running pipe, which adds to the bottom hole pressure at the fracture end.
- Option 3 before: The kill mud weight and the trip margin from the well control calculation.
- Option 3 after: Circulating density, since the pumps add annulus friction on every trip.

### geomech advanced module m04-using-it-in-a-well-plan ord 9: judged fine (duplicate)

- Flag: editor-flagged duplicate of advanced final 31
- Reason: Kept as the module question; the final copy was rewritten to a different point.

### geomech advanced final ord 38: fixed (duplicate)

- Flag: editor-flagged: advanced final 38 = advanced m05-the-edges-of-the-model ord 11 (same key)
- Reason: Same concept and key as the module question, kept there; the final copy now asks what the isothermal assumption makes of the fracture gradient in a cooled hole (advanced m05 l03, "the honest position"), a point no question tested.
- Correct option or prompt changed: The question is replaced by a new one on a different point, so its key is new text; answer_index is unchanged.
- Prompt before: Returns disappear after six hours of steady circulation. What mechanism fits?
- Prompt after: The model is isothermal. What does that make its fracture gradient in a hole cooled by circulation?
- Explanation before: The cooling penetrates further the longer it goes on, and the effective fracture gradient falls with it.
- Explanation after: Cooling the wall reduces the hoop stress and brings it closer to tension, so an isothermal fracture gradient is an upper estimate in a cooled hole. The error grows with depth, where mud and rock differ most in temperature, and with circulating time, as the cooling penetrates further. The benefit against collapse is on the other bound.
- Option 0 before: Losses starting the moment the pumps come on, as the circulating pressure is added to the static column at once.
- Option 0 after: A lower estimate, because cooling raises the hoop stress, so the wall can carry more mud before it splits.
- Option 1 before: Losses that stop when the pumps are shut down, which is the signature of an equivalent circulating density problem.
- Option 1 after: An exact answer at the wall, since the cooling only reaches a thin skin that the Kirsch solution ignores.
- Option 2 before: Losses starting after hours of trouble-free circulation with nothing else having changed.
- Option 2 after: An upper estimate, with the error growing with depth and with circulating time.
- Option 3 before: Losses that only happen while tripping, which is the signature of a surge exceeding the fracture gradient.
- Option 3 after: A conservative number, because the thermal stress helps against collapse and the model leaves that out.

### geomech advanced module m05-the-edges-of-the-model ord 11: judged fine (duplicate)

- Flag: editor-flagged duplicate of advanced final 38
- Reason: Kept as the module question; the final copy was rewritten to a different point.

### geomech intermediate final ord 33: fixed (duplicate)

- Flag: editor-flagged and near p0.70 k0.93: intermediate final 33 = intermediate m04-against-the-oracle ord 7 (vertical collapse closed form)
- Reason: Same closed form as the module question, kept there; the final copy now asks which wall stresses are largest and smallest at the breakout in the two-line derivation (intermediate m04 l03), a step no question tested.
- Correct option or prompt changed: The question is replaced by a new one on a different point, so its key is new text; answer_index is unchanged.
- Prompt before: Write the vertical closed-form collapse pressure.
- Prompt after: In the vertical fixture's two-line collapse derivation, which wall stresses are the largest and the smallest at the breakout?
- Explanation before: One plus q is the amplification: the largest wall stress falls by one and the smallest rises by one per unit of pressure.
- Explanation after: At theta of 90 degrees the hoop stress is 95000000 Pa less dP, the axial is 42500000 Pa and the radial is dP, so for small dP the hoop is the largest and the radial the smallest. Mohr-Coulomb with q of 3 then gives dP of 13750000 Pa and a collapse pressure of 33750000 Pa.
- Option 0 before: Pore pressure plus UCS divided by q.
- Option 0 after: Hoop largest, axial smallest.
- Option 1 before: Three times effective Shmin less effective SHmax, less the strength, plus the pore pressure.
- Option 1 after: The axial is the largest, as at ninety degrees it gains the Poisson term from the stress difference.
- Option 2 before: Pore pressure plus three times effective SHmax less effective Shmin less UCS, all over one plus q.
- Option 2 after: The hoop stress is the largest and the radial stress, which is just dP, is the smallest, while dP is small.
- Option 3 before: The effective overburden over the frictional ratio, plus the pore pressure and the UCS.
- Option 3 after: The radial stress is the largest, because the mud pressure pushes straight on the wall there.

### geomech intermediate module m04-against-the-oracle ord 7: judged fine (duplicate)

- Flag: duplicate of intermediate final 33
- Reason: Kept as the module question; the final copy was rewritten to a different point.

### geomech intermediate final ord 15: fixed (duplicate)

- Flag: near p0.64 k0.67: intermediate final 15 vs advanced m05-the-edges-of-the-model ord 13 (upper bound in fractured ground); prompt also dangles on "instead"
- Reason: Same concept and answer as the Expert module question (and advanced final 40), kept there; the Professional final copy now tests the tensile strength point of intermediate m02 l03, which no question tested, with a self-contained prompt.
- Correct option or prompt changed: The question is replaced by a new one on a different point, so its key is new text; answer_index is unchanged.
- Prompt before: In a naturally fractured formation, what should the upper bound be instead?
- Prompt after: Setting the tensile strength to zero, as is often done, changes the fracture initiation pressure how?
- Explanation before: A hole meeting a natural fracture does not have to split anything: it only has to open a plane that already exists.
- Explanation after: The criterion is least wall stress no lower than minus T0, so taking T0 as zero lowers the fracture initiation pressure by exactly T0. Rock is weak in tension and microcracked rock is effectively zero, so zero is the conservative choice. The slope q belongs to the shear criterion.
- Option 0 before: The fracture initiation pressure, unchanged.
- Option 0 after: It raises it by exactly T0.
- Option 1 before: The minimum horizontal stress, or a measured loss pressure.
- Option 1 after: It lowers it by exactly T0, which is the conservative choice.
- Option 2 before: The overburden gradient, since a fracture cannot propagate against a stress larger than the vertical one in a normal regime.
- Option 2 after: It changes nothing, because tensile strength only matters for propagation, which the minimum horizontal stress governs.
- Option 3 before: The pore pressure plus the tensile strength, which is the pressure at which a pre-existing fracture would first open.
- Option 3 after: It lowers it by T0 times q, because the tensile strength enters through the slope of the failure line.

### geomech advanced module m05-the-edges-of-the-model ord 13: judged fine (duplicate)

- Flag: near duplicate of intermediate final 15
- Reason: Kept as the module question; the intermediate final copy was rewritten to a different point.

### geomech advanced final ord 40: fixed (duplicate)

- Flag: lead review: advanced final 40 duplicates advanced module m05-the-edges-of-the-model ord 13 (same key)
- Reason: Same concept and key as the module question, kept there; the final copy now asks what evidence says the intact-rock upper bound may not be operative (advanced m05 l04, image logs and offset losses), a point no question tested.
- Correct option or prompt changed: The question is replaced by a new one on a different point, so its key is new text; answer_index is unchanged.
- Prompt before: In a formation full of existing planes, what number should cap the mud weight?
- Prompt after: Without a fracture network model, what tells you the intact-rock upper bound may not be the operative one?
- Explanation before: Using the minimum horizontal stress is a cheap and defensible conservatism.
- Explanation after: Fracture orientation and density are directly observable on image logs, and a field with losses at low equivalent circulating densities is telling you the intact-rock upper bound is not the operative one. The quality score and the collapse gradient say nothing about natural fractures.
- Option 0 before: The computed fracture initiation pressure, since it already includes the tensile strength of the wall.
- Option 0 after: A quality score below 100, which flags that the stress model has stopped believing itself at that depth.
- Option 1 before: The overburden gradient, since a fracture cannot propagate against a stress larger than the vertical in a normal regime.
- Option 1 after: A collapse gradient above the pore pressure, which shows the rock at the wall is already failing in shear.
- Option 2 before: The pore pressure plus the intact tensile strength, which is when the first natural fracture would begin to open.
- Option 2 after: A wide static window at the tightest point, which leaves room for any natural fracture to stay closed.
- Option 3 before: A measured leak-off, a loss history, or the minimum horizontal stress.
- Option 3 after: Image logs of fracture density, and offset losses at low circulating densities.

## heattransfer

Migration: `migrations/20261021b_b4_fix_heattransfer.sql`

### heattransfer intermediate module m06-the-professional-reading ord 2: fixed (duplicate)

- Flag: duplicate of beginner module m06-the-associate-reading 8 (near p0.79 k1.00): both ask for the tube count trail on the studio case, same key
- Reason: True duplicate across tiers; kept the beginner m06 question and rewrote this copy to test the m06 capstone point on the free check of the fouling penalty.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: What is the tube count trail on the studio case, and how many passes of the loop does it take?
- Prompt after: The fouling penalty on a capstone stack can be reached twice, from U clean and U dirty and as the two fouling terms' share of the total. What does a disagreement between the two routes point to?
- Explanation before: The ladder of seeds the studio walks is 2, 12, 60 and 300 tubes, and the first seed that evaluates starts the loop. The trail is what the loop left behind on the way to the answer.
- Explanation after: The fouling penalty in percent is the same number as the two fouling terms taken as a share of the total, so on one stack the two routes must agree. If they do not, something upstream of both is wrong, and it is usually an inside term that never reached the reference surface.
- Option 0 before: 2, 12, 60 and 300 tubes, converged in 4 passes.
- Option 0 after: Nothing in particular, since the two routes measure different quantities.
- Option 1 before: 4, 56 and 64 tubes, converged in 3 passes.
- Option 1 after: The wall term, which the share column reads on a flat plate while the two coefficients read it on the tube itself.
- Option 2 before: 2, 60, 72 and 74 tubes, converged in 2 passes.
- Option 2 after: Rounding in the printed penalty, which carries six decimals and so cannot match a share of the stack to the last place.
- Option 3 before: 2, 60, 72 and 74 tubes, converged in 4 passes.
- Option 3 after: Something upstream of both, usually an inside term put into the stack without the diameter ratio on it.

## hydraulics

Migration: `migrations/20261021b_b4_fix_hydraulics.sql`

### hydraulics advanced final ord 22: fixed (other)

- Flag: explanation mostly about the distractor and never restates why "it is a plan" is right; tighten explanation
- Reason: explanation now states the key (the calculation is a speed-limit plan; the trip tank measurement detects a kick) and why the pore-pressure option is wrong
- Explanation before: It has no pore pressure either, and that is why it cannot say whether a given swab is dangerous without one being supplied.
- Explanation after: The surge and swab calculation is a plan: it gives the trip speed that avoids causing a kick. Detecting one is a measurement, made by comparing the volume the hole takes against the computed displacement at every stand, and that is the trip tank's job. A missing pore pressure limits what the plan can say; a kick is recognised against a computed volume.

### hydraulics intermediate module m06-the-professional-reading ord 13: fixed (other)

- Flag: "the first is the frame" wording; check that it refers to the explanation list and is unambiguous
- Reason: "the first" pointed at nothing (the key is option 2); explanation now names the window idea explicitly
- Explanation before: All three are worth carrying. The first is the frame the Expert tier puts the other two into.
- Explanation after: The three distractors are all worth carrying, but the frame is the window: pore and fracture pressure bound four pressures, and this tier computed two of them, the static mud weight and the equivalent circulating density. The Expert tier adds surge and swab and puts everything else into that window.

### hydraulics advanced module m06-the-expert-reading ord 15: fixed (other)

- Flag: "the first is the frame" wording; check that it refers to the explanation list and is unambiguous
- Reason: explanation was oblique; now restates the lesson line behind the key
- Explanation before: Two models, one missing mechanism, and the way to see it is to watch both of them drift at once.
- Explanation after: The cuttings beds this course cannot model are the largest single thing the torque and drag friction factor absorbs. The two courses look at the same missing mechanism from opposite sides, which is why both of them drift at once when a bed builds.

### hydraulics intermediate module m04-the-flow-rate-decision ord 11: fixed (duplicate)

- Flag: editor-flagged duplicate: beginner m04 ord 11 = intermediate m04 ord 11 (both key "The nozzle total flow area"; intermediate final 19 also asks it)
- Reason: kept the beginner module question; rewrote this one to test the size of the nozzle lever from the same lesson (l05, inverse-square law, 2.33 in area buys 5.4 in bit pressure)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: What is the one lever that relieves the pump constraint alone?
- Prompt after: On the slant well at 0.025 m3/s, opening the nozzles from 0.0003 to 0.0007 m2 cuts the bit pressure by roughly what factor?
- Explanation before: It leaves the pipe loss, the annulus loss, the ECD and the cleaning all exactly unchanged.
- Explanation after: The bit pressure drop is inversely proportional to the square of the total flow area: 5540166.204986151 Pa at 0.0003 m2 against 1017581.5478545991 Pa at 0.0007 m2, a factor of 5.4 for a factor of 2.33 in area. The pipe loss, the annulus loss and the equivalent circulating density are exactly unchanged.
- Option 0 before: The mud weight, through its density.
- Option 0 after: About 2.33, in step with the area ratio.
- Option 1 before: The nozzle total flow area.
- Option 1 after: About 5.4, the inverse square.
- Option 2 before: The flow rate, since reducing it lowers the pump pressure faster than it lowers the equivalent circulating density.
- Option 2 after: None, because the bit pressure is set by the flow rate, and the flow rate has not moved at all.
- Option 3 before: The rate of penetration, since drilling more slowly reduces the cuttings load and therefore the annular pressure.
- Option 3 after: About 5.4, and the equivalent circulating density falls with it, since the pump pressure is lower along the whole string.

### hydraulics advanced final ord 27: fixed (duplicate)

- Flag: editor-flagged duplicate: advanced final 27 = intermediate final 29 (same 58 in a 60 kg/m3 window, same key)
- Reason: kept intermediate final 29 (its example is taught in intermediate m04 l04); rewrote this one to test where the static weight sits in the window (advanced m02 l02)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: A window is 60 kg/m3 wide and the circulating uplift is 58. What is the finding?
- Prompt after: The static mud weight is placed toward the pore side of the window instead of at its middle. Why?
- Explanation before: Halving the rate does help by that much and it also halves the cleaning. Lowering the mud weight that far would go below the pore pressure.
- Explanation after: The equivalent circulating density and the surge both go up from the static weight and only the swab goes down, so the weight is offset toward the pore side to leave room above it. On the slant well the equivalent circulating density is the largest of the four, 58.33 kg/m3 above the mud weight.
- Option 0 before: There is adequate margin, since the uplift is smaller than the window and the well stays inside it.
- Option 0 after: Because the swab is the largest of the four pressures, so the pore side needs the most room left.
- Option 1 before: The mud weight should be lowered by 58 kg/m3, which places the ECD at the middle of the window.
- Option 1 after: Because the fracture limit only applies while circulating, so the static weight can sit well away from it.
- Option 2 before: Circulating at all takes the well essentially to the fracture gradient.
- Option 2 after: Because two of the four pressures rise above it and only one falls below it.
- Option 3 before: The flow rate should be halved, which by the 0.75 exponent would take the uplift to about 35 kg/m3.
- Option 3 after: Because the equivalent circulating density falls below the mud weight, as friction unloads the column.

### hydraulics beginner module m04-the-bit ord 6: judged fine (duplicate)

- Flag: near duplicate of intermediate final 35 (bit share vs annulus share as rate rises)
- Reason: opposite elements and opposite answers (bit share rises, annulus share falls); the same exponent idea from two genuinely different angles

### hydraulics beginner module m05-pump-pressure ord 9: judged fine (duplicate)

- Flag: near duplicate of intermediate final 22 (oracle value count and tolerance vs worst disagreement)
- Reason: one asks the tolerance the goldens ask for, the other the disagreement achieved; the lesson draws that distinction, and the distractors differ

### hydraulics intermediate module m05-against-the-oracle ord 7: fixed (duplicate)

- Flag: near duplicate of beginner m05 ord 11 (identical key: pump pressure is the longest chain); intermediate final 23 also asks it
- Reason: kept beginner m05 11; rewrote this one to test the rheology residual from the same lesson (l01: 1e-10 is the rounding of the published nine-decimal values)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: Why is the pump pressure the largest disagreement?
- Prompt after: Why do the rheology fits agree only to about 1e-10 when the surge and swab agree at machine precision?
- Explanation before: About 1e-7 over that chain is what a long floating-point calculation looks like, and it is a function of the length rather than of a choice.
- Explanation after: The lesson reads it directly: the rheology fits agree to about 1e-10, which is the rounding of the published nine-decimal values rather than a real disagreement. The fit is a short calculation; the pump pressure is the longest chain and carries the largest residual, about 1e-7.
- Option 0 before: Because it is the largest number.
- Option 0 after: Because the fits are least-squares.
- Option 1 before: Because it is the longest chain: a fit, a local power law per element, a Reynolds number, a friction factor, a sum.
- Option 1 after: Because 1e-10 is the rounding of the published nine-decimal values, so it is no real disagreement between the two codes.
- Option 2 before: Because the two implementations use different blend widths, and the pipe elements sit inside the transition band.
- Option 2 after: Because the fits are a long chain of per-element steps, and rounding builds up along it as it does for the pump.
- Option 3 before: Because it includes the surface loss, which one implementation sets to zero and the other omits entirely.
- Option 3 after: Because the rheology is read at surface temperature and the two codes correct it to downhole conditions.

### hydraulics beginner final ord 8: fixed (duplicate)

- Flag: near duplicate of intermediate m02 ord 2 (where is annular velocity lowest; same key)
- Reason: kept the intermediate module question; rewrote this final question to test why the annulus loss is small (beginner m03 l05)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: Where in this course's well is the annular velocity lowest?
- Prompt after: Why is the annulus loss so much smaller than the pipe loss on this well?
- Explanation before: Velocity is flow rate over area, so the widest annulus is the slowest, and it is the shallowest part of the hole.
- Explanation after: The space between a 0.127 m drill pipe and a 0.2159 m hole has about four times the area of the pipe's bore, so the velocity is a quarter and the velocity squared is a sixteenth. The annular flow is also largely laminar, which partly cancels the velocity dependence.
- Option 0 before: Around the collars in open hole.
- Option 0 after: The annulus is shorter than the pipe.
- Option 1 before: At total depth, where the annulus has the most cuttings in it and the effective flow area is therefore smallest.
- Option 1 after: Because the annular flow is turbulent, and a turbulent friction factor is far lower than a laminar one at the same velocity.
- Option 2 before: It is the same everywhere, because the flow rate is constant and the annulus is a single continuous path.
- Option 2 after: Because the mud is thicker in the annulus, where the shear rate is low, and a higher viscosity lowers the friction loss.
- Option 3 before: In the cased section, which is the widest annulus.
- Option 3 after: Its area is about four times the bore, so its velocity is a quarter.

### hydraulics intermediate final ord 23: judged fine (duplicate)

- Flag: lead follow-up: cross-tier near duplicate of beginner m05 ord 11 (pump pressure carries the largest residual because it is the longest chain)
- Reason: same idea, but after the intermediate m05 ord 7 rewrite this is the only intermediate question on the short-chain against long-chain residual pattern that intermediate m05 l01 re-teaches with its own numbers; its distractors (surface loss, blend width) test the method specification material

## integrity

Migration: `migrations/20261021b_b4_fix_integrity.sql`

### integrity advanced final ord 38: fixed (double-key)

- Flag: option 3 (excess fraction for the next plug) close to partly right
- Reason: Advanced m02 l05 says the tag-minus-calculation gap is the best hole enlargement estimate and is worth carrying into the next plug in the section, so informing the next plug's excess was half right; the distractor now claims a settle rate to carry between wells, which the same lesson calls a per-well number.
- Explanation before: The gap between the tag and the calculated settled top is the best hole enlargement estimate that job will ever produce.
- Explanation after: The settled top is a prediction that assumes the hole is the size you told it, and the tag is the measurement. The gap between them is the best hole enlargement estimate that job will ever produce. A tag cannot prove balance or bond, and the settle rate is fixed by one well's hole and stinger.
- Option 3 before: The excess fraction that the next plug in the section should be pumped with.
- Option 3 after: A settle rate to carry to the next well, since the drop is the same on every job.

### integrity advanced final ord 42: fixed (double-key)

- Flag: distractor 0 (override to a default length) arguably worth looking for
- Reason: Overriding a default such as plugMinLengthM does change an answer with the well unchanged (m03 l01, l05), so option 0 was defensible; the prompt now fixes the rule set between the two runs and option 0 now blames the excess, which cannot move a rule check because the checks read the proposed interval (as advanced module m05 ord 13 and final 10 teach).
- Prompt before: A rule in this engine changes its answer while the well in front of you has not changed at all. What should you go looking for?
- Prompt after: Between two runs on the same rule set, a rule in this engine changes its answer while the well in front of you has not changed at all. What should you go looking for?
- Explanation before: Foundation on a plug, verifiedByLog on annular cement and element status on an envelope each move a threshold in the same way.
- Explanation after: Foundation on a plug, verifiedByLog on annular cement and element status on an envelope each move a threshold in the same way, and each is a claim a person entered by hand. The rule checks read the proposed plug interval rather than the settled top, so the excess cannot move them.
- Option 0 before: An override applied to one of the default lengths, since a changed rule set moves every threshold that reads from it.
- Option 0 after: A change in the excess, since excess moves the settled top and every length check in the rule set reads from it.

## mapping

Migration: `migrations/20261021b_b4_fix_mapping.sql`

### mapping advanced final ord 7: fixed (duplicate)

- Flag: near duplicate of advanced m02-leave-one-out ord 12 (what the Ekene-6 residual measures; identical key)
- Reason: kept the module question; rewrote the final copy to test the size of the residual against the structural relief (m02 l01: 20 percent of the 49 m relief)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: What is the Ekene-6 residual measuring, at bottom?
- Prompt after: How large is the Ekene-6 leave-one-out residual against the structural relief across the six picks?
- Explanation before: Ekene-6 is a local high none of the five can see. No interpolator recovers a feature no control point sampled, so the response that would help is more control rather than a better method.
- Explanation after: The six picks span 49 m, from 1541 m to 1590 m, and the five-well map missed Ekene-6 by +9.84 m, so a single prediction was wrong by 20 percent of the relief the map exists to describe. Set against the 1546 m depth it looks small, but depth is the wrong yardstick for a structure map.
- Option 0 before: The bending energy penalty the thin-plate spline applies between control points.
- Option 0 after: About 2 percent, since 9.84 m is small beside a 1546 m depth.
- Option 1 before: The extrapolation error of a five-well map at a location on its boundary.
- Option 1 after: About 50 percent, because the five-well map misses half of the structure at the crest.
- Option 2 before: The mismatch between the well spacing and the scale of the structure.
- Option 2 after: About 20 percent, nearly 10 m of the 49 m relief.
- Option 3 before: The difference between a five-well map and a six-well map at a single node.
- Option 3 after: Too small to matter, since a residual is judged against the pick uncertainty rather than the relief.

## mbal

Migration: `migrations/20261021b_b4_fix_mbal.sql` (not written: nothing fixed)

### mbal advanced final ord 41: judged fine (other)

- Flag: two options share the correct figure and differ only in the denominator clause; judge whether fine
- Reason: the question asks both the figure and why the denominator matters; option 3 has the right figure but the wrong reason (revisable freely), which the explanation (errors propagate into every fraction of it) rules out, so only option 0 stands

## perfsand

Migration: `migrations/20261021b_b4_fix_perfsand.sql`

### perfsand beginner module m06-the-associate-reading ord 14: fixed (other)

- Flag: beginner final ord 40 vs beginner module m06 ord 14: near-same question with different keys (tunnel length vs converging-flow term); a learner may read them as contradicting
- Reason: with the rock changing the tunnel, the plane-flow and blockage distractors (both read the tunnel length) became defensible; the prompt now holds the tunnel length as given, which is how the engine works (m02 l05), so only the anisotropy term moves
- Prompt before: Which of these would you expect to change if the same gun were run in a different rock?
- Prompt after: The same gun is run in a different rock, and the engine is given the same tunnel length. Which skin term would you expect to change?
- Explanation before: Anisotropy is the one rock property in the skin calculation, and it enters only that term.
- Explanation after: The engine takes the penetration it is given and applies no concrete-to-rock correction, so with the tunnel length held the geometric terms are unchanged. Anisotropy is the one rock property in the skin calculation, and it enters only the converging-flow term.

### perfsand beginner final ord 40: fixed (other)

- Flag: beginner final ord 40 vs beginner module m06 ord 14: near-same question with different keys (tunnel length vs converging-flow term); a learner may read them as contradicting
- Reason: key kept; explanation now says the engine does not make the concrete-to-rock correction itself, which reconciles it with m06 ord 14
- Explanation before: The catalog row is unchanged. What the rock does to the penetration is not.
- Explanation after: The catalog row is unchanged, but what the rock does to the penetration is not: formation penetration is generally less than the concrete figure, and it depends on the rock strength and the effective stress. This engine applies no such correction and takes the penetration it is given, so making it is your job.

## petrophysics

Migration: `migrations/20261021b_b4_fix_petrophysics.sql`

### petrophysics beginner module m03-porosity ord 14: judged fine (number-options)

- Flag: beginner module m03 ord 14 bare numbers: review only
- Reason: Key 0.21 and 0.14 matches the lesson pay averages 0.208 and 0.142; distractors are the swap, the cutoff pairing and the shale apparent value, one defensible answer

### petrophysics intermediate module m03-neutron-density-porosity ord 9: judged fine (number-options)

- Flag: intermediate module m03 ord 9 bare numbers: review only
- Reason: Key 0.0803 is the lesson worked example 0.1803 - 1.0 x 0.10; distractors are plausible arithmetic slips, one defensible answer

### petrophysics intermediate final ord 29: fixed (duplicate)

- Flag: true duplicate of intermediate module m01 ord 2 and m05 ord 1 (why Archie reads Sw too high in shaly sand); editor also flagged option 0 as internally incoherent
- Reason: Kept the module question (m05 ord 1); the final now tests how the Archie error scales with clay volume, from the why Archie fails lesson, which also retires the incoherent option 0
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: Why does Archie read water saturation too HIGH in shaly sand?
- Prompt after: In shaly sand, how does the error in the Archie water saturation behave as clay volume rises?
- Explanation before: The rock conducts more than Archie expects because clay-bound water conducts alongside the pore brine. Extra conductivity is misread as extra water, inflating Sw. On the typewell shale point Archie gives 0.8769 against Simandoux 0.5730.
- Explanation after: Clay adds a parallel conductive path that Archie can only read as extra water, and more clay means more of that path, so Archie reads Sw too high by an amount that grows with clay volume. A sand half full of oil can grade as wet.
- Option 0 before: Clay minerals raise the resistivity of the formation, and Archie compensates by assigning more water to the pore space than exists
- Option 0 after: It shrinks as clay rises, because shale lowers porosity and Archie then needs less water
- Option 1 before: The gamma ray correction is not applied to RT, so the radioactivity of the clay inflates the resistivity used in Archie
- Option 1 after: It stays constant, since the clay term is a fixed offset added to every sample
- Option 2 before: Shale lowers porosity below the Archie range, and the equation then overstates water in any rock tighter than clean sand
- Option 2 after: It changes sign above Vsh 0.5, where Archie starts to read too dry
- Option 3 before: Clay surfaces add a parallel conductive path, and Archie attributes all conductivity to brine in clean pores
- Option 3 after: It grows with clay volume, reading ever wetter

### petrophysics intermediate module m01-the-professional-workflow ord 2: fixed (duplicate)

- Flag: true duplicate of intermediate module m05 ord 1 (both ask why Archie overstates Sw in shaly sand)
- Reason: Kept m05 ord 1 in the module that teaches shaly-sand saturation; m01 ord 2 now tests where the clean-rock assumption costs most, from the beyond the quicklook lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: Why does the Archie equation overstate water saturation in a shaly sand?
- Prompt after: Where does the clean-rock assumption behind Archie do the most commercial damage?
- Explanation before: Archie assumes brine is the only conductor. Conductive clay adds signal that the equation can only explain as more water.
- Explanation after: Archie blames clay conduction on water and reads Sw too high, which understates hydrocarbons in the shaly, marginal intervals where booking decisions are closest. In clean sand the shaly-sand models collapse to Archie, and a shale is never booked anyway.
- Option 0 before: Clay minerals lower the gamma ray reading, which biases the porosity input
- Option 0 after: In clean sands, where the absence of clay leaves Archie with too little conductivity to explain
- Option 1 before: Archie attributes all measured conductivity to pore water, so clay conduction is booked as extra water
- Option 1 after: In shaly sands of marginal quality, where reading Sw too high understates hydrocarbons exactly where the reservoir is weakest
- Option 2 before: Shale increases the resistivity of the formation, which Archie reads as hydrocarbon
- Option 2 after: In the thick shale at 2000 m, where Archie books the clay-bound water as producible oil
- Option 3 before: The n exponent doubles in the presence of clay-bound water
- Option 3 after: In the water leg, where Archie reads the brine as hydrocarbon and books false pay

### petrophysics intermediate module m05-shaly-sand-saturation ord 1: fixed (other)

- Flag: option 3 has the same self-contradiction as final 29 (shale raises resistivity, which Archie converts into extra water)
- Reason: Option 3 now names a coherent but wrong mechanism (a shorter current path lowering the true m) instead of a resistivity rise that would make Archie read drier
- Option 3 before: Shale raises the measured resistivity, which Archie converts into extra water
- Option 3 after: Clay shortens the current paths, so the true m drops below the m of 2 Archie assumes

### petrophysics beginner final ord 1: fixed (duplicate)

- Flag: near duplicate of beginner module m02-shale-volume ord 1 (what the gamma ray tool measures)
- Reason: Kept the module question; the final now tests API calibration from the same gamma ray lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: What does the gamma ray (GR) log actually measure?
- Prompt after: What makes gamma ray readings in API units comparable between different tools and wells?
- Explanation before: The GR tool counts natural gamma radiation, which comes mostly from potassium, thorium and uranium concentrated in clay minerals, which is why GR is the workhorse shale indicator.
- Explanation after: A test pit at the University of Houston holds an artificial shale defined as 200 API, and every tool is calibrated to it. Normalising to clean and clay lines is a later interpretation step that turns API readings into IGR.
- Option 0 before: The electrical conductivity of the formation
- Option 0 after: Each log is normalised to its own clean and clay lines before it is displayed
- Option 1 before: The hydrogen content of the pore fluid
- Option 1 after: The tool counts only potassium, whose abundance is the same in every shale
- Option 2 before: Natural radioactivity from potassium, thorium and uranium in the rock
- Option 2 after: Every tool is calibrated against a standard test pit whose artificial shale is defined as 200 API
- Option 3 before: The bulk density of the formation
- Option 3 after: API units are scaled to the bit size, which removes the effect of the hole

### petrophysics beginner final ord 14: fixed (duplicate)

- Flag: near duplicate of beginner module m03-porosity ord 5 (RHOB 2.485 gives 0.10); final ord 17 also reuses 2.485
- Reason: Kept the module question; the final now tests the fluid density sensitivity from the choosing matrix and fluid lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: With matrix density 2.65 g/cm3 and fluid density 1.0 g/cm3, what porosity does RHOB = 2.485 g/cm3 give?
- Prompt after: The 2020 m sample (RHOB 2.3035 g/cm3, matrix 2.65 g/cm3) is recomputed with salty filtrate at 1.1 g/cm3 in place of 1.0 g/cm3. What happens to density porosity?
- Explanation before: phiD = (2.65 - 2.485) / (2.65 - 1.0) = 0.165 / 1.65 = 0.10.
- Explanation after: phiD = (2.65 - 2.3035) / (2.65 - 1.1) = 0.3465 / 1.55 = 0.2235, a little over one porosity unit higher. The measured RHOB does not change; a denser fluid only shrinks the denominator.
- Option 0 before: 0.10
- Option 0 after: It rises from 0.2100 to about 0.2235
- Option 1 before: 0.165
- Option 1 after: It falls, because a denser pore fluid brings the bulk density closer to the matrix value
- Option 2 before: 0.20
- Option 2 after: It is unchanged at 0.2100
- Option 3 before: 0.08
- Option 3 after: It falls to about 0.20

### petrophysics beginner final ord 24: fixed (duplicate)

- Flag: near duplicate of beginner module m04-resistivity-and-saturation ord 8 (Sw 0.35 at 2020 m)
- Reason: Kept the module question; the final now tests reading the resistivity index against the wet baseline from the Archie lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: At 2020 m the typewell reads porosity 0.21 and Rt = 9.2554 ohm.m, with a = 1, m = 2, n = 2, Rw = 0.05 ohm.m. Sw is closest to:
- Prompt after: At 2020 m the wet baseline R0 is 1.134 ohm.m, yet the sand reads Rt = 9.2554 ohm.m. What does a resistivity index of about 8 tell the interpreter?
- Explanation before: phi^2 = 0.0441, so Sw = sqrt(0.05 / (0.0441 x 9.2554)) = sqrt(0.1225) = 0.35.
- Explanation after: R0 = Rw / phi^2 = 0.05 / 0.0441 = 1.134 ohm.m already accounts for porosity, so a sand reading about eight times its wet baseline must hold an insulator in place of brine: unambiguous pay. Clay conduction would lower the resistivity rather than raise it.
- Option 0 before: 0.35
- Option 0 after: Much of the brine has been displaced by insulating hydrocarbon, so the sand is clear pay
- Option 1 before: 0.21
- Option 1 after: The porosity must be far below 0.21, since tighter rock reads more resistive
- Option 2 before: 0.50
- Option 2 after: The sand is shaly, since clay conduction raises the measured resistivity
- Option 3 before: 0.65
- Option 3 after: The sand is wet, because both Rt and R0 read above Rw

### petrophysics beginner module m04-resistivity-and-saturation ord 8: judged fine (duplicate)

- Flag: near pair with advanced final ord 5 (Sw about 0.35 at 2020 m)
- Reason: Different tiers and different point: the advanced item uses the Arps-corrected Rw 0.049910 and its distractor 0.53 tests the raw-Rw error, so it examines the correction, not basic Archie

### petrophysics advanced module m02-temperature-and-the-arps-correction ord 15: judged fine (duplicate)

- Flag: near pair with advanced module m02 ord 8 (two Arps calculations)
- Reason: Two separate Arps exercises with different inputs and answers; ord 15 adds the raw-ratio-without-offsets trap (0.1500), so both earn their place

### petrophysics advanced final ord 4: fixed (duplicate)

- Flag: near duplicate of advanced module m01-the-rw-problem ord 13 (why the 0.114 lab value cannot be used directly)
- Reason: Kept the module question; the final now tests what the brief does not contain, from the typewell brief lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: Why can the typewell's lab water resistivity of 0.114 ohm.m not be used directly in the saturation equations?
- Prompt after: The typewell brief includes no salinity report for the laboratory water sample. What does that absence leave unverified?
- Explanation before: Resistivity is temperature dependent; the bench value must be corrected to formation temperature (Arps) before use.
- Explanation after: Arps is calibrated for NaCl-dominated brines, and without a salinity report that assumption goes unverified. The 180 degF formation temperature, the SSP and the Pickett fit do not depend on a salinity analysis; a real study would list the missing report as an assumption carried.
- Option 0 before: Because laboratory resistivity meters read equivalent rather than true resistivity
- Option 0 after: The formation temperature of 180 degF, which the brief can only derive from the salt content
- Option 1 before: Because the sample was measured on a NaCl scale and the formation brine is not NaCl
- Option 1 after: The static SP reading of -93 mV, which must be calibrated against a measured salinity
- Option 2 before: Because 0.114 ohm.m is outside the valid range of the Archie equation
- Option 2 after: The Pickett product a times Rw, because the water-leg fit needs a salinity input
- Option 3 before: Because it was measured at 75 degF while the formation sits at 180 degF, and brine resistivity falls strongly with temperature
- Option 3 after: The NaCl assumption behind the Arps correction, since the sample salt chemistry was never analysed

### petrophysics advanced final ord 36: fixed (duplicate)

- Flag: near duplicate of advanced module m06-the-expert-standard ord 9 (the six capstone quantities)
- Reason: Kept the module question; the final now tests the real-field evidence from the beyond the typewell lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: Which six quantities does the Petrophysics Expert capstone grade?
- Prompt after: Beyond the typewell, which real-field evidence locates fluid contacts independently of any resistivity argument?
- Explanation before: Two triangulation routes, the water-leg validation, the corrected booking pair, and the raw-Rw counterfactual net: the six numbers of the Expert workflow.
- Explanation after: Wireline formation testers measure pressure gradients, and the change of gradient locates fluid contacts without any resistivity interpretation. Image logs resolve thin beds, core refines m and n, and catalogs only give context for Rw.
- Option 0 before: Three porosity means, the Pickett fit pair, and SAND_B net pay, covering the density, neutron-density and sonic porosity estimates, the fitted a*Rw and m from the water leg, and the thinner lower sand's booked net thickness
- Option 0 after: Image logs, which reveal the thin beds and laminations that standard tools average away
- Option 1 before: The Arps-corrected sample Rw, the SP-quicklook Rwe, the water-leg mean Sw with the Arps Rw, SAND_A net pay with the Arps Rw, SAND_A pay-average Sw with the Arps Rw, and SAND_A net pay with the raw sample value
- Option 1 after: Pressure gradients from wireline formation testers
- Option 2 before: Rw from six different temperature assumptions, each one run through the Arps correction from bench to formation conditions so that the grade tests how the learner handles the full range of thermal gradients in the typewell
- Option 2 after: Core plugs, whose laboratory m and n replace the classic Archie defaults
- Option 3 before: Net, NTG and average Sw for both SAND_A and SAND_B, giving three booking quantities per zone so that the capstone grades the corrected interpretation of each sand directly and leaves the Rw routes themselves ungraded
- Option 3 after: Regional water catalogs, which give the expected Rw for the aquifer and depth

### petrophysics advanced module m01-the-rw-problem ord 13: fixed (duplicate)

- Flag: true duplicate of advanced module m02 ord 1 (why the 0.114 lab value cannot be used directly)
- Reason: Kept m02 ord 1 in the temperature module that owns the point; m01 ord 13 now tests the one exception to the inherited booking recipe, from the typewell brief lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: Why can the lab value of 0.114 ohm.m not be used directly in the typewell saturation work?
- Prompt after: The Expert capstone reuses the Associate recipe for its SAND_A bookings. Which check is the single exception to that recipe?
- Explanation before: The sample is genuine formation water, but bench temperature is far below reservoir temperature; the Arps correction brings it to formation conditions.
- Explanation after: Both SAND_A bookings keep density porosity, Larionov tertiary Vsh, Archie and the standard cutoffs so that only Rw changes. The single exception is the water-leg validation, which uses neutron-density porosity to match how the Professional tier characterised the leg.
- Option 0 before: It was measured on mud filtrate rather than formation water, so it describes the invaded zone instead of the virgin formation brine
- Option 0 after: The raw-Rw booking, which switches to Simandoux so the clay term absorbs the error
- Option 1 before: It was measured at 75 degF while the formation is at 180 degF, and brine resistivity falls steeply with temperature
- Option 1 after: The water-leg check, which uses neutron-density porosity
- Option 2 before: The resistivity cell only works on NaCl solutions, and a produced formation brine carries other ions that corrupt the bench reading
- Option 2 after: The SAND_A booking, which uses Larionov older rocks for the consolidated sand
- Option 3 before: It is the equivalent resistivity Rwe, not the true Rw, so it must first pass through the SP chain before Archie can use it
- Option 3 after: The SP quicklook, which books SAND_A with sonic porosity from the Wyllie transform

### petrophysics advanced final ord 22: judged fine (duplicate)

- Flag: near pair with advanced module m04 ord 1 (the three-route spread)
- Reason: Different angle: m04 ord 1 is the spread arithmetic, while final 22 asks for the adoption judgment and rejects the shared-water-leg misconception, a point no module question tests

### petrophysics advanced final ord 25: fixed (duplicate)

- Flag: true duplicate of advanced module m04 ord 10 (why the engine does not clamp Sw at 1)
- Reason: Kept the module question; the final now tests why the constancy of the water-leg result matters, from the water-leg check lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: Run with the RAW sample value 0.114 ohm.m, the water-leg sample at 2076 m returns Archie Sw = 1.51. The engine reports this value without clamping it to 1. Why?
- Prompt after: Across the typewell water leg all six samples return Sw = 0.99910. Why does that constancy matter as much as the level?
- Explanation before: An impossible Sw in a known water leg is the failure signature of a bad parameter. Silently clamping it to 1 would hide the error.
- Explanation after: Porosity and resistivity move together down the leg exactly as Archie at Sw = 1 demands, so every sample reads the same. A leg whose saturations drift or scatter is reporting shale, invasion or a transition zone even when its mean looks acceptable. At Sw = 1 the exponent n drops out, so the leg cannot confirm it.
- Option 0 before: Because the engine has a bug in its saturation routine
- Option 0 after: It shows the engine rounds every sample to five decimals
- Option 1 before: Because saturations above 1 are physically possible in transition zones, where capillary effects let the water phase exceed the pore volume it occupies
- Option 1 after: It proves the Pickett fit was made on other samples, since a fit through these same points could never return them so uniformly
- Option 2 before: Because Sw greater than 1 is information: it announces that the parameter set is wrong (here, an uncorrected Rw) before it can corrupt a booking
- Option 2 after: Drift or scatter across a leg flags shale, invasion or a transition zone even when the mean looks right
- Option 3 before: Because clamping is only applied to porosity, never to saturation, so the engine has no routine that could cap an Archie result at one in any zone of the well
- Option 3 after: It confirms n = 2 directly, because constant saturation across the leg is only possible when the saturation exponent is correct

### petrophysics advanced final ord 38: fixed (duplicate)

- Flag: true duplicate of advanced module m06 ord 10 (deep-path gate order)
- Reason: Kept the module question; the final now tests the order in which the three tiers are run on a new well, from the three-tier workflow lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: On the deep path, in what order must a learner clear the Expert course's gates?
- Prompt after: When you evaluate a new well in practice, in what order does the course say you run the three tiers?
- Explanation before: Lessons unlock module quizzes, quizzes unlock the exam, and the exam unlocks the capstone; the server enforces the sequence.
- Explanation after: Each tier only makes sense once the one below is settled: there is no use triangulating Rw without the loop that consumes it, or comparing saturation models on an unexamined porosity. So the order is loop, methods, parameters, and then the booking with its sensitivities.
- Option 0 before: All module quizzes (75 percent pass each), then the final exam (70 percent), and only then does the capstone unlock
- Option 0 after: The loop, then the methods, then the parameters, then the booking with its sensitivities
- Option 1 before: The capstone first, then the final exam as confirmation
- Option 1 after: Methods first, then the loop, then the parameters
- Option 2 before: The final exam at any time, with module quizzes optional, since only the exam and the capstone count toward the certificate
- Option 2 after: Parameters first, since triangulating Rw before any loop is run keeps the booking free of every given value
- Option 3 before: Any order, as long as everything is passed eventually
- Option 3 after: All three at once, in whichever order the data allow

### petrophysics advanced final ord 39: fixed (duplicate)

- Flag: true duplicate of advanced module m06 ord 12 (the Expert discount code)
- Reason: Kept the module question; the final now tests how route spreads compare in field data, from the uncertainty and defensibility lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: What does earning the Expert certification trigger commercially?
- Prompt after: The typewell Rw routes span about 0.4 percent. What spread between routes does the course say is common in field data?
- Explanation before: The Suite bridge issues the discount code automatically on Expert certification, linking the academy ladder to the professional tools.
- Explanation after: The typewell spread is small because the dataset was built to converge. In field data a spread of 10 to 20 percent between routes is common, and reporting it honestly lets the next user decide whether it matters for their question.
- Option 0 before: Lifetime free access to the NextGen Academy
- Option 0 after: Under 0.1 percent
- Option 1 before: An automatic upgrade of the Professional certificate, which is reissued at Expert grade and extended for a further renewal window at no extra cost
- Option 1 after: About 0.4 percent as well, because every well converges once its routes are corrected to formation temperature
- Option 2 before: A personal single-use 50 percent discount code for the corresponding Petrolord Suite module, valid for the certificate's 12-month window
- Option 2 after: 10 to 20 percent, which is why the spread must be reported honestly
- Option 3 before: Nothing beyond the certificate document itself, since the academy keeps its certification separate from any Suite licensing or commercial offer
- Option 3 after: Over 50 percent, so field routes are compared only for direction and never adopted as a value

### petrophysics advanced final ord 40: fixed (duplicate)

- Flag: true duplicate of advanced module m06 ord 7 (definition of a defensible evaluation)
- Reason: Kept the module question; the final now tests thin-bed and laminated sands, from the beyond the typewell lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: Which statement best captures the course's definition of a defensible evaluation?
- Prompt after: Where sands and shales interleave below tool resolution, how do the saturation models of this ladder read?
- Explanation before: Defensibility is reproducibility plus examined assumptions: provenance, uncertainty and sensitivity for every load-bearing parameter.
- Explanation after: Standard tools average thin sands with their conductive shale laminae, so the models of this ladder read too pessimistic and dedicated thin-bed and laminated-sand techniques take over. Shale laminae lower the averaged resistivity rather than raising it.
- Option 0 before: One produced by the most senior petrophysicist available
- Option 0 after: Exactly right, since the averaging cancels out
- Option 1 before: Another expert, given the report and the data, reproduces the numbers and can find no unexamined assumption doing load-bearing work
- Option 1 after: Too pessimistic, so dedicated thin-bed and laminated-sand techniques take over
- Option 2 before: One where every number is quoted to at least four decimal places, so that another reviewer can match each reported value exactly to the output
- Option 2 after: Too optimistic, because the deep tool blends the shale laminae into the sand and reads a higher resistivity than the sand holds
- Option 3 before: One that matches the pre-drill estimate
- Option 3 after: Unaffected, as the logs resolve every lamina

### petrophysics advanced final ord 41: fixed (duplicate)

- Flag: true duplicate of advanced module m06 ord 8 (false precision)
- Reason: Kept the module question; the final now tests which added log partitions porosity into bound and free fluid, from the beyond the typewell lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: A report quotes SAND_A water saturation as 0.3609 while its Rw came from a single uncorrected lab measurement. What failure does the course name here?
- Prompt after: A real study adds logs the typewell never needed. Which one gives porosity partitioned into bound and free fluid?
- Explanation before: Precision in the output means nothing while the input parameter's provenance is unexamined; the fix is triangulation and sensitivity, not more decimals.
- Explanation after: NMR gives porosity partitioned into bound and free fluid. Dielectric tools estimate water-filled porosity almost independently of salinity, image logs reveal thin beds and laminations, and the caliper measures hole size.
- Option 0 before: Over-rounding: the saturation should carry more decimals, because a booking figure cut at four places hides the true resolution of the Archie result
- Option 0 after: Dielectric logging, which reads the salinity of the formation water directly and so replaces the SP quicklook
- Option 1 before: Under-booking: the cutoffs were too strict
- Option 1 after: The caliper log
- Option 2 before: Instrument error: the lab meter needs recalibration, because a single bench resistivity reading that high points to a drifting conductivity cell
- Option 2 after: Image logging, which measures the pore-size distribution around the borehole and converts it into bound water
- Option 3 before: False precision: four-decimal output resting on an unexamined single-source input, the exact failure the Expert tier exists to prevent
- Option 3 after: NMR, which splits porosity into bound and free fluid

### petrophysics advanced final ord 42: fixed (duplicate)

- Flag: true duplicate of advanced module m06 ord 15 (what transfers unchanged from the typewell)
- Reason: Kept the module question; the final now tests multi-well consistency, from the beyond the typewell lesson
- Correct option or prompt changed: the duplicate is rewritten into a new question, so its key is the new correct option; answer_index is unchanged
- Prompt before: The typewell deliberately keeps hole conditions ideal. What transfers unchanged from this course to real-field petrophysics?
- Prompt after: What validation does a field study gain that no single well can provide?
- Explanation before: Real studies add core, pressure data and advanced logs, but the parameter discipline is the same; the typewell's ideal conditions exist so that logic stays visible.
- Explanation after: A field study interprets every well with one parameter set and one documented set of exceptions, and the field-wide coherence of the result is itself a validation no single well can provide.
- Option 0 before: The triangulate, validate and stress-test discipline, the provenance ladder, and the refusal to let one unexamined number drive a booking
- Option 0 after: The coherence of one documented parameter set, with its stated exceptions, across every well in the field
- Option 1 before: The specific values Rw = 0.05 and m = 2, which are universal constants that every clastic reservoir shares and can be carried to any field unchanged
- Option 1 after: The deepest well alone, whose water leg becomes the reference and whose parameters are then copied to every other well unchanged
- Option 2 before: The assumption that water legs are always present and clean
- Option 2 after: A separate Rw for each well, chosen freely
- Option 3 before: The exact 0.6 Sw cutoff, mandated for all reservoirs
- Option 3 after: The average of all the capstone answers

### petrophysics beginner final ord 41: inserted (parity)

- Reason: tier parity: beginner final held 40 questions where every other final holds 42
- Prompt: Between the pay in SAND_B and its water leg, computed Sw climbs smoothly toward 1.0 instead of jumping. What does this pattern show?
- Option 0: A change from sand to shale, which the gamma ray would confirm with a rising clay volume
- Option 1 (correct): A capillary transition zone grading from pay down to the aquifer
- Option 2: A deepening invasion front, where filtrate lowers the deep resistivity reading
- Option 3: A gas cap above an oil leg
- Explanation: Capillary forces hold more water in the smaller pores as the free water level approaches, so Sw grades from pay values to 1.0 at the aquifer while porosity stays roughly constant. SAND_B is clean on GR, and the deep reading is designed to see past invasion.

### petrophysics beginner final ord 42: inserted (parity)

- Reason: tier parity: beginner final held 40 questions where every other final holds 42
- Prompt: In a deviated well, net pay is summed from samples along measured depth (MD). Compared with the true vertical thickness of the bed, that sum:
- Option 0: Understates it, because the tool leans on the low side of the hole and misses part of the bed
- Option 1: Equals it, as the sampling is fixed
- Option 2 (correct): Overstates it, because MD runs along the inclined well path
- Option 3: Understates it by half
- Explanation: MD is distance along the well path and TVD is vertical distance, so in a deviated well an MD thickness sum overstates the vertical thickness of a bed. On the vertical typewell the two coincide, but the first question to ask of any real net pay is whether it is measured or vertical thickness.

## porepressure

Migration: `migrations/20261021b_b4_fix_porepressure.sql`

### porepressure advanced final ord 14: fixed (duplicate)

- Flag: near duplicate of advanced m03-the-exponent-lever ord 8 (window shape under n 1.2; same key)
- Reason: kept the module question; rewrote the final copy to test what the n 1.2 calibration does to the fracture ceiling at TD (m03 l01, l03: a third of the floor move, 29.07 against 87.22)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: What does the window's shape do under the n 1.2 calibration?
- Prompt after: Under the n 1.2 calibration the TD floor drops 87.22 kg/m3. What does the fracture ceiling do there?
- Explanation before: The quiet floor no longer outruns the ceiling. Shape is calibration-conditional; re-read it after any refit, since it moves where sections pinch.
- Explanation after: The ceiling moves only through the mixture, a third of the floor's change: 1903.92 to 1874.85 kg/m3 at TD, a drop of 29.07 for the floor's 87.22. The window therefore widens by the other two thirds, 58.15 kg/m3, with both walls moving down.
- Option 0 before: Narrows below the onset exactly as at n 3, from the same 750.28 maximum.
- Option 0 after: Drops the same 87.22 kg/m3, so the window keeps its width at TD.
- Option 1 before: Widens with depth below the onset: 750.28, 761.16, 782.97.
- Option 1 after: Drops 29.07 kg/m3, a third of the floor move.
- Option 2 before: Becomes exactly flat.
- Option 2 after: Stays put at 1903.92.
- Option 3 before: Inverts outright, with the floor crossing above the ceiling at the deepest samples of the well.
- Option 3 after: Rises 58.15 kg/m3, since the window widens by that amount while the floor falls beneath it.

## qra

Migration: `migrations/20261021b_b4_fix_qra.sql`

### qra advanced final ord 29: fixed (duplicate)

- Flag: duplicate of beginner module m04-location-specific-individual-risk 13 (near p0.66 k1.00): both run the Appendix 6.B last step through locationIndividualRisk, same key
- Reason: True duplicate of the beginner m04 question; kept the module question and rewrote the final copy to test the m05 consequence-seam point on where Appendix 6.B passes into QRA arithmetic.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: Purple Book Appendix 6.B's last step is run through `locationIndividualRisk` with f PM Pphi = 1.84e-8 per year and the printed Pd of 0.381. What comes back, and what does the source print?
- Prompt after: Purple Book Appendix 6.B works one individual risk contribution at one grid point. Where does its chain pass from consequence modelling into QRA arithmetic?
- Explanation before: Through `locationIndividualRisk`, 1.84e-8 times 0.381 is 0.000000007010, and the source prints 7e-9. 0.000000006997 is the whole chain's contribution, which rests on the golden whole-chain Pd of 0.380294556093. 7.0104e-9 is the step by step value from the printed figures, and the source prints only 7e-9. The last figure is a probability of death, which has no unit per year at all.
- Explanation after: The early steps of Appendix 6.B are consequence modelling and belong to the consequence course; from the effective cloud width onward they are QRA arithmetic. The probability of death that comes out is an input to the contribution, which the source prints as 7e-9 per year.
- Option 0 before: 0.000000006997 per year, which the source prints as 7e-9 and which follows from the printed Pd alone.
- Option 0 after: At the release rate: only the source term belongs to the consequence course, and the dispersion, the cloud width and the Pd are QRA arithmetic worked here.
- Option 1 before: 0.000000007010 per year, which the source prints as 7e-9.
- Option 1 after: At the effective cloud width: the steps before it are consequence modelling, and from it onward the chain is QRA arithmetic.
- Option 2 before: 0.000000007010 per year, which the source prints as 7.0104e-9 exactly, matching the engine to five figures.
- Option 2 after: At the probability of death: every step up to the printed Pd of 0.381 is QRA arithmetic this course grades, and only the contribution belongs elsewhere.
- Option 3 before: 0.380294556093 per year, which is the whole chain's Pd reported as though it were the contribution.
- Option 3 after: At the contribution of 7e-9 per year: every step before it, the cloud width and the Pd included, is consequence modelling this course takes as stated.

## reservoircalc

Migration: `migrations/20261021b_b4_fix_reservoircalc.sql`

### reservoircalc advanced final ord 3: fixed (duplicate)

- Flag: near duplicate of advanced module m01-from-a-constant-to-a-grid 2 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test why P-1 needs no interpolation (m02 l03).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Why did the volume engine need no modification to accept a porosity grid?
- Prompt after: Why does the panel report the trend porosity at P-1 without any interpolation?
- Explanation before: The tiers below filled those arrays with the same value at every node, which is why the chain collapsed into four multiplications on the total.
- Explanation after: The frame starts at an easting of 400 m and a northing of 800 m with 100 m spacing, so 1600 m falls on a node in both directions and the reported value is the plane evaluated there. P-1 has no well; the nearest is 300 m away.
- Option 0 before: It was always summing node by node and always receiving arrays.
- Option 0 after: Because P-1 sits exactly on a grid node in both easting and northing.
- Option 1 before: It converts any grid to an effective constant before summing.
- Option 1 after: Because the panel evaluates the plane analytically everywhere.
- Option 2 before: It reruns the chain once per distinct property value.
- Option 2 after: Because P-1 lies at the centroid, where the plane is pinned.
- Option 3 before: It applies porosity after the summation rather than inside it.
- Option 3 after: Because P-1 is a control point, so its measured value is shown.

### reservoircalc advanced final ord 4: fixed (duplicate)

- Flag: near duplicate of advanced module m01-from-a-constant-to-a-grid 3 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the no-locality property of a plane (m02 l02).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Why does the chain stop factorising when porosity varies?
- Prompt after: In a least squares plane every well influences every node. What follows from that?
- Explanation before: Pulling a constant out of a sum leaves it unchanged; pulling a varying quantity out changes the arithmetic. That is why three different means exist at this tier.
- Explanation after: Change one well's porosity and all three coefficients move, so every node in the frame changes, including nodes on the far side of the field. The same lack of locality means no node can be dragged around by a single nearby measurement.
- Option 0 before: Because the cell area can no longer be taken outside the sum.
- Option 0 after: A wrong well value shifts only the nodes nearest to that one well.
- Option 1 before: Because a sum of products is not the product of the sums.
- Option 1 after: A bad value taints the whole map, yet the map stays stable.
- Option 2 before: Because the accumulation order changes when a grid is supplied.
- Option 2 after: The plane passes exactly through each well that lies inside the hull.
- Option 3 before: Because the porosity and the oil column become correlated.
- Option 3 after: Wells far from a node are ignored once the search radius is exceeded.

### reservoircalc advanced final ord 5: fixed (duplicate)

- Flag: near duplicate of advanced module m01-from-a-constant-to-a-grid 4 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the west against east well averages (m01 l03 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: What are the six Ekene well porosities and their arithmetic mean?
- Prompt after: The three wells west of the fault average 0.22 and the three east of it 0.193333. Why be careful with that comparison?
- Explanation before: Their range of 0.06 is 29 percent of the mean. The figure 0.210822 is the volume weighted mean, which is a property of the model rather than of the data.
- Explanation after: Ekene-6 at 0.22 is 100 m from the fault and behaves like its western neighbours, so the eastern average carries a well that does not belong with the other two. The west is still better rock by 0.026667, which supports the eastward decline, and all six wells supply porosity, including the two that are dry.
- Option 0 before: 0.20 at all six, which is the constant handed out below.
- Option 0 after: Because the eastern average includes two dry wells that carry no porosity value.
- Option 1 before: 0.22, 0.19, 0.23, 0.17, 0.21, 0.22, averaging 0.210822.
- Option 1 after: Because three values cannot show a spatial pattern.
- Option 2 before: 0.22, 0.19, 0.23, 0.17, 0.21, 0.22, averaging 0.206667.
- Option 2 after: Because Ekene-6 sits in the east block yet reads like a western well.
- Option 3 before: 0.17 to 0.23 in even steps, averaging 0.20 exactly.
- Option 3 after: Because the block averages are weighted by area rather than one third per well.

### reservoircalc advanced final ord 12: fixed (duplicate)

- Flag: EXACT duplicate of advanced module m02-the-trend-plane 8 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test when a plane fit first has residuals (m02 l02 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Why do the residuals of a least squares plane sum to zero?
- Prompt after: How many wells does a trend fit need before it has any residuals at all?
- Explanation before: The plane passes through the centroid of the data, so it is unbiased over the wells as a set and can still be wrong at every individual well.
- Explanation after: Three non collinear points determine a plane exactly and leave nothing over, so with three or fewer the residuals are zero by construction and measure only that the arithmetic worked. Six wells leave three degrees of freedom to measure the misfit.
- Option 0 before: Because positive and negative measurement errors cancel.
- Option 0 after: Three, since any three wells leave one residual per well.
- Option 1 before: Because the model has an intercept.
- Option 1 after: Four, since three points fit a plane exactly.
- Option 2 before: Because the residuals are normalised after fitting.
- Option 2 after: Six, since the normal equations need twice the unknowns.
- Option 3 before: Because the method minimises their sum rather than their squares.
- Option 3 after: Two, since a plane is fitted separately in each direction.

### reservoircalc advanced final ord 16: fixed (duplicate)

- Flag: EXACT duplicate of advanced module m03-three-means 2 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the mean of the dry live nodes (m03 l03).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: What are the three means at Ekene under the trend model?
- Prompt after: Under the trend, what do the 32 live nodes that hold no oil average?
- Explanation before: They are the arithmetic mean of the wells, the plain mean over the 169 oil cells, and the mean weighted by the rock each cell carries.
- Explanation after: The plane averages 0.206686 over all 201 live nodes; taking out the 169 oil bearing nodes leaves 32 dry live nodes averaging 0.192526. That ground lies to the east, where the plane predicts the poorest rock.
- Option 0 before: 0.20, 0.206667 and 0.210822.
- Option 0 after: 0.206686, the same as the whole live area.
- Option 1 before: 0.206667, 0.209368 and 0.210822.
- Option 1 after: 0.192526, about 8.7 percent poorer than the oil bearing ground.
- Option 2 before: 0.206667, 0.210822 and 0.219745.
- Option 2 after: 0.206667, the same as the arithmetic well mean.
- Option 3 before: 0.209368, 0.210822 and 0.219745.
- Option 3 after: 0.17, the value measured at Ekene-4.

### reservoircalc advanced final ord 17: fixed (duplicate)

- Flag: near duplicate of advanced module m03-three-means 5 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the live node mean trap (m02 l05).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: What does the step from the well mean to the node mean measure?
- Prompt after: The plane averages 0.206686 over the 201 live nodes, almost the well mean. Why is that no sign that the model changes nothing?
- Explanation before: The oil sits on the structural high, which is where the plane predicts the better rock, so the low end of the distribution is absent from the population being averaged.
- Explanation after: The plane passes through the centroid of the wells and the live area is roughly centred on them, so its live mean lands near the pivot. The booking averages it over the 169 oil cells weighted by column, which gives 0.210822.
- Option 0 before: That the thicker cells carry better rock than the thin ones.
- Option 0 after: Because the live nodes include ground well beyond the 800 m extrapolation limit.
- Option 1 before: That the model disagrees with the measurements at the wells.
- Option 1 after: Because the live area mean leaves out both dry wells.
- Option 2 before: That the oil bearing cells are not a representative sample.
- Option 2 after: Because the booking averages the plane over the oil, weighted by rock.
- Option 3 before: That the plane extrapolates beyond the measured range.
- Option 3 after: Because the plane overshoots to 0.232281, above every value the wells measured.

### reservoircalc advanced final ord 19: fixed (duplicate)

- Flag: EXACT duplicate of advanced module m03-three-means 9 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test recovering the effective porosity from a report (m03 l04 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: What is the volume weighted mean equal to?
- Prompt after: A report books a net volume of 40 and a pore volume of 9.2 million cubic metres, and quotes an average porosity of 0.21. What follows?
- Explanation before: At Ekene that gives 0.210822, and the hand route of summed column times porosity over summed column agrees to the seventeenth digit.
- Explanation after: Pore over net gives 9.2 / 40 = 0.23, the volume weighted porosity the booking used. The quoted 0.21 is most likely a plain average of the wells or the grid, and the volumes are the numbers to trust since they are what the chain computed.
- Option 0 before: The pore volume divided by the net volume.
- Option 0 after: The booking used 0.23, so the quoted 0.21 is a different average.
- Option 1 before: The pore volume divided by the gross rock volume.
- Option 1 after: The report is consistent, since net times 0.21 rounds to the pore volume.
- Option 2 before: The node mean weighted by cell area.
- Option 2 after: The report double counts the water saturation.
- Option 3 before: The well mean weighted by each well's oil column.
- Option 3 after: The pore volume must be wrong, since it should equal net volume times 0.21.

### reservoircalc advanced final ord 21: fixed (duplicate)

- Flag: near duplicate of advanced module m03-three-means 8 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test which means depend on the contact (m03 l01 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: What does quoting the node mean where the volume weighted mean belongs cost at Ekene?
- Prompt after: The contact moves from 1560 m to 1550 m. Which of the three means stays put?
- Explanation before: The error is small enough to survive any sanity check and large enough to matter across a portfolio. The defence is structural: sum the products and divide afterwards.
- Explanation after: The well mean depends only on the six measured values. The node mean changes because the set of oil bearing cells changes, and the volume weighted mean changes for that reason and because every surviving cell's column, and so its weight, changes.
- Option 0 before: About 0.404 MMstb, overstated.
- Option 0 after: All three, since the porosity model itself has not changed.
- Option 1 before: About 0.657 MMstb, understated.
- Option 1 after: The well mean and the node mean over the oil cells.
- Option 2 before: About 0.088 MMstb, understated.
- Option 2 after: Only the arithmetic mean of the six wells.
- Option 3 before: Nothing, since the two agree to four decimals.
- Option 3 after: None of the three.

### reservoircalc advanced final ord 23: fixed (duplicate)

- Flag: EXACT duplicate of advanced module m04-what-the-model-buys 4 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test applying the ratio audit to a report (m04 l02 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: What is the ratio of the trend booking to the constant 0.20 booking?
- Prompt after: Two porosity models book 20.0 and 21.6 MMstb, each on a net volume of 30.0, with pore volumes of 6.0 and 6.5. Are the figures consistent?
- Explanation before: The whole property model, over all 169 cells, delivers exactly one number to the booking, and it is recoverable from two volumes and a division.
- Explanation after: The effective porosities are 0.20 and 0.216667, a ratio of 1.083333, while the STOIIP ratio is 1.08. A gap of 0.3 percent is far beyond storage noise, so something besides the porosity model changed, or a figure was rounded or transcribed wrongly.
- Option 0 before: 1.054111.
- Option 0 after: No, the two ratios disagree.
- Option 1 before: 1.033333, the ratio of the well mean to 0.20.
- Option 1 after: Yes, since both runs share the same net volume of 30.0.
- Option 2 before: 1.098726, which the kriged model gives.
- Option 2 after: Yes, since 21.6 over 20.0 matches 6.5 over 6.0 closely.
- Option 3 before: 1.210822, the effective porosity itself.
- Option 3 after: No, since the net volumes should differ between the two models.

### reservoircalc advanced final ord 25: fixed (duplicate)

- Flag: near duplicate of advanced module m04-what-the-model-buys 8 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the decomposition applied to another field (m04 l03 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: How does the 0.656868 MMstb uplift decompose?
- Prompt after: A field books 50 MMstb at a handed out porosity of 0.18. Its wells average 0.175 and a trend model books 51.2 MMstb. Which part of the change is robust?
- Explanation before: Nearly two thirds of what the property model appears to be worth is the correction of a constant that sat below the well average.
- Explanation after: Booking at the well average gives 50 times 0.175 / 0.18 = 48.61 MMstb, a step of minus 1.39, and the trend then adds 2.59. The first step follows from the measurements; the second depends entirely on the trend and is larger than the total change, so it needs the method and residuals attached.
- Option 0 before: 0.163936 from selection and 0.492932 from weighting.
- Option 0 after: The plus 2.59 from the trend, since it is the larger step.
- Option 1 before: 0.252229 from a better constant and 0.404640 from spatial variation.
- Option 1 after: The whole plus 1.2, since both steps use the same wells.
- Option 2 before: 0.404640 from a better constant and 0.252229 from spatial variation.
- Option 2 after: The minus 1.39 from the well average, which follows from the measurements.
- Option 3 before: It does not decompose, since the model acts on every cell at once.
- Option 3 after: Neither, since steps of opposite sign cannot be separated from each other at all.

### reservoircalc advanced final ord 26: fixed (duplicate)

- Flag: near duplicate of advanced module m04-what-the-model-buys 10 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test per point weights in the constant method (m03 l02).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Split into three, what are the parts of the Ekene uplift?
- Prompt after: How could the constant method book a weighted mean of the wells rather than the arithmetic one?
- Explanation before: Only the last two are spatial, and the weighting part, which this tier works hardest to explain, is the smallest of the three.
- Explanation after: The engine's constant method accepts per point weights, and area weighting by a Voronoi partition of the wells is the usual choice. Nobody supplied weights at Ekene, so all six count equally and the constant is 0.206667.
- Option 0 before: 0.163936 better constant, 0.404640 selection, 0.088293 weighting.
- Option 0 after: By switching to the trend method, which weights the wells by distance.
- Option 1 before: 0.404640 better constant, 0.088293 selection, 0.163936 weighting.
- Option 1 after: By averaging the modelled grid over the 169 oil bearing cells.
- Option 2 before: 0.252229 better constant, 0.240703 selection, 0.163936 weighting.
- Option 2 after: It cannot, since the constant method gives every well one sixth.
- Option 3 before: 0.404640 better constant, 0.163936 selection, 0.088293 weighting.
- Option 3 after: By supplying per point weights, such as Voronoi areas.

### reservoircalc advanced final ord 27: fixed (duplicate)

- Flag: near duplicate of advanced module m04-what-the-model-buys 9 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test using the decomposition to allocate effort (m04 l03).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Why does the decomposition matter more than the total?
- Prompt after: A study has a week left: measure porosity in a seventh well, or refine the property model. Which does the decomposition favour?
- Explanation before: The first part rests on six measurements and one division. The second rests on a plane that misses four of six wells by more than 8 percent.
- Explanation after: The spatial part is worth 0.252229 MMstb in total, the whole effect rather than its uncertainty. A seventh well moves the 0.404640 part by roughly its deviation divided by seven, and with the largest residuals near 0.019 it would also support or contradict the plane.
- Option 0 before: The two parts carry different confidence and need different work.
- Option 0 after: The seventh well, which moves the solid part and tests the trend as well.
- Option 1 before: The total cannot be reproduced without the intermediate bookings.
- Option 1 after: Refining the model, since the spatial part is the larger.
- Option 2 before: Only the spatial part depends on the choice of method.
- Option 2 after: Refining the model, since only software can shrink the residuals.
- Option 3 before: Only the better constant part can have the wrong sign.
- Option 3 after: Neither, since a week cannot change a booking of this size.

### reservoircalc advanced final ord 30: fixed (duplicate)

- Flag: near duplicate of advanced module m04-what-the-model-buys 13 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the perpendicular trend case (m04 l04).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: When does a property model remove barrels relative to a constant?
- Prompt after: If the porosity trend ran perpendicular to the structural trend, what would happen to the weighting effect?
- Explanation before: A reader who has learned that property models increase volumes has generalised from a common case. What they do is replace an unweighted assumption with a weighted one.
- Explanation after: The weighting step is the covariance of column and porosity divided by the mean column. Two trends at right angles are uncorrelated whatever the strength of either, so the gap between the node mean and the volume weighted mean disappears.
- Option 0 before: When the contact is shallow enough that few cells hold oil.
- Option 0 after: It would double, since the two trends would then reinforce each other.
- Option 1 before: When the model extrapolates below the measured range.
- Option 1 after: It would reverse sign, since the best rock would then sit downdip.
- Option 2 before: When the wells over sample the poorest rock.
- Option 2 after: It would stay at 0.088293, since the weights come from column alone.
- Option 3 before: When the best rock lies downdip, so the covariance is negative.
- Option 3 after: It would vanish, since the covariance of column and porosity would be near zero.

### reservoircalc advanced final ord 31: fixed (duplicate)

- Flag: EXACT duplicate of advanced module m04-what-the-model-buys 14 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the uncertainty on the well mean against the uplift (m04 l05).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: How does the Ekene property model compare with the contact sensitivity?
- Prompt after: Each of the six well porosities is uncertain by one to two porosity units. What uncertainty does that put on the Ekene booking?
- Explanation before: The contact dominates by an order of magnitude, and pinning it is worth more than any property work the study could do.
- Explanation after: Six values uncertain by one to two units give an uncertainty on the mean of around 0.6 porosity units, which is 3 percent of the booking. That is comparable to the 0.66 MMstb uplift, and it exists whatever population method is used.
- Option 0 before: Roughly a fifteenth the size: 0.66 against 8 to 10 MMstb per 10 m.
- Option 0 after: About 0.36 MMstb, or 3 percent, whether or not you model spatially.
- Option 1 before: Roughly the same size, so both deserve equal attention.
- Option 1 after: About 3.64 MMstb, the full range from 0.17 to 0.23.
- Option 2 before: Larger, since the contact was measured and the porosity was not.
- Option 2 after: None once a trend is fitted, since the plane averages it out.
- Option 3 before: They cannot be compared, since one changes the geometry.
- Option 3 after: About 0.088 MMstb, the size of the weighting step.

### reservoircalc advanced final ord 32: fixed (duplicate)

- Flag: near duplicate of advanced module m04-what-the-model-buys 15 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the spatial part in the league table (m04 l05).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Which is worth more at Ekene: choosing the population method, or using one at all?
- Prompt after: How large is the spatial part of the property model beside the conventions priced in the tier below?
- Explanation before: Constant books 12.543848, trend 12.796077 and krige 13.337665. A report that omits which method was used has left out the larger of the two decisions.
- Explanation after: The spatial part is 0.252229 MMstb, against 0.901423 for the boundary cell convention and 1.989889 for the map's ignorance of the fault. The genuinely spatial modelling is among the smallest effects priced in the course.
- Option 0 before: Using one at all, at 0.656868 MMstb.
- Option 0 after: Roughly equal to the tie break convention and half the cross fault control effect.
- Option 1 before: The choice of method, at 0.793817 MMstb across the three.
- Option 1 after: About a quarter of the tie break and an eighth of the cross fault control.
- Option 2 before: They are identical, since the constant is one of the three.
- Option 2 after: Too different in kind to be compared.
- Option 3 before: Neither, since both fall below the fault position uncertainty.
- Option 3 after: Larger than both, since it acts on every one of the 169 oil bearing cells in the field.

### reservoircalc advanced final ord 33: fixed (duplicate)

- Flag: near duplicate of advanced module m05-the-limits-of-a-property-model 2 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test why the tier stopped at porosity (m05 l01).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Which constant left standing has the strongest reason to vary?
- Prompt after: Why did this tier model porosity first, although water saturation probably matters more?
- Explanation before: A single 0.35 is a thickness weighted average of a curve applied uniformly to cells whose columns run from a sliver to 20.28 m.
- Explanation after: A saturation height model needs capillary pressure measurements on core, a free water level and a rock typing scheme, which is a different body of work. The machinery for a varying property is the same whichever property varies.
- Option 0 before: The formation volume factor, which varies with pressure.
- Option 0 after: Saturation is a fluid property, so it stays uniform within a single accumulation.
- Option 1 before: Net to gross, which falls away from the depocentre.
- Option 1 after: Saturation cannot vary between cells of a single grid.
- Option 2 before: Water saturation, which falls with height above the contact.
- Option 2 after: Porosity is measured at each well, while saturation needs capillary data.
- Option 3 before: None, since all three are already averages over the reservoir.
- Option 3 after: Porosity has the larger effect on the booking.

### reservoircalc advanced final ord 34: fixed (duplicate)

- Flag: near duplicate of advanced module m05-the-limits-of-a-property-model 4 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the weight for a saturation average (m05 l01 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: If net to gross also varied, what weight would the effective porosity take?
- Prompt after: What weight belongs in a volume weighted average of water saturation when every property may vary?
- Explanation before: The weight is whatever the property multiplies. Area and net to gross cancelled at Ekene only because they are uniform there.
- Explanation after: The weight is whatever the saturation term multiplies, which is each cell's pore volume. Weighting by column alone is correct only when net to gross and porosity are both uniform.
- Option 0 before: The net to gross alone, since it is applied first.
- Option 0 after: The oil column alone, since saturation depends on height.
- Option 1 before: The oil column alone, since net to gross cancels.
- Option 1 after: The net rock of each cell, since saturation follows porosity.
- Option 2 before: The pore volume of each cell.
- Option 2 after: The hydrocarbon pore volume, since that is what saturation sets.
- Option 3 before: The product of the oil column and the net to gross at each node.
- Option 3 after: The pore volume of each cell, column times net to gross times porosity.

### reservoircalc advanced final ord 35: fixed (duplicate)

- Flag: EXACT duplicate of advanced module m05-the-limits-of-a-property-model 8 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test cross validating a kriged model (m05 l03 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: What does kriging promise that a trend does not?
- Prompt after: Kriging's residuals are zero at every well. How can a kriged model still be tested?
- Explanation before: The trade is that its residuals become zero by construction, so the model can no longer be tested against the data at all.
- Explanation after: The residuals only show the exactness property working. Leave one out cross validation rekriges without each well in turn and compares the prediction with the withheld measurement, the procedure the mapping tier used on the structural grid.
- Option 0 before: That at a data location it returns the measured value.
- Option 0 after: Withhold one well, krige from the rest, and compare at that well.
- Option 1 before: That the modelled values stay inside the range of the data.
- Option 1 after: Compare the kriged residuals against the uncertainty of each well value.
- Option 2 before: That every well influences every node in the frame.
- Option 2 after: Check that the residuals sum to zero.
- Option 3 before: That the residuals sum to zero across the control set.
- Option 3 after: Refit the variogram to the six wells alone.

### reservoircalc advanced final ord 36: fixed (duplicate)

- Flag: near duplicate of advanced module m05-the-limits-of-a-property-model 9 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test what bounds trend extrapolation (m02 l05).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: At how many Ekene wells does the kriged grid return the measured value exactly?
- Prompt after: A trend has no mechanism to flatten off. What keeps its far field values out of the Ekene booking?
- Explanation before: The failure at Ekene-2 has nothing to do with the kriging and everything to do with where that well sits relative to the grid.
- Explanation after: Nodes more than 800 m from a well are dead, so the plane is never evaluated far outside the data in a way that reaches the booking. Ten kilometres west the same gradient would predict 0.43, and nothing in the plane itself would stop it.
- Option 0 before: All six, which the exactness property guarantees.
- Option 0 after: The fallback ladder, which switches to a constant far from control.
- Option 1 before: Five. Ekene-2 reads 0.191177 against 0.19.
- Option 1 after: The 800 m mask on the structural grid.
- Option 2 before: Four, since the two dry wells are excluded.
- Option 2 after: A cap that holds modelled values inside the measured range.
- Option 3 before: None, since the grid is sampled bilinearly everywhere.
- Option 3 after: The least squares fit, which pins the plane at the data centroid.

### reservoircalc advanced final ord 37: fixed (duplicate)

- Flag: near duplicate of advanced module m05-the-limits-of-a-property-model 12 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test when a constant formation volume factor stops being safe (m05 l01).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Why does the off node sampling at Ekene-2 cost the trend nothing?
- Prompt after: When does the argument for a constant formation volume factor weaken?
- Explanation before: A plane has no curvature to lose, so the average of two nodes either side of the well is the plane's value at the well. A kriged surface bends toward the data and loses its peak.
- Explanation after: The formation volume factor is set by the composition, pressure and temperature of the oil, and within one accumulation in pressure communication it is close to uniform. Compartments with independent histories need not share it.
- Option 0 before: Ekene-2 was included in the trend fit but not in the kriging.
- Option 0 after: Wherever the oil column rises more than 20 m above the contact.
- Option 1 before: The trend is evaluated analytically rather than read from the grid.
- Option 1 after: When porosity is modelled as a grid, since the chain is then nonlinear.
- Option 2 before: Bilinear interpolation of a linear function is exact.
- Option 2 after: Across compartments that never communicated.
- Option 3 before: The trend uses a finer internal grid than kriging does.
- Option 3 after: Toward the crest, where the water saturation is lowest.

### reservoircalc advanced final ord 38: fixed (duplicate)

- Flag: near duplicate of advanced module m05-the-limits-of-a-property-model 13 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test reading the property panel colour scale (m01 l04).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: How did the mapping tier meet Ekene-2?
- Prompt after: Why should map shades not be compared between population methods on the property panel?
- Explanation before: There a value could not be reported at all. Here the property grid is populated at every node, so a value always comes back and the failure is quieter.
- Explanation after: Every coloured cell is an oil bearing cell shaded from the lowest to the highest modelled porosity in the current model, so the same shade means different values under different methods. Compare the numbers instead.
- Option 0 before: It was excluded from the structural grid entirely.
- Option 0 after: The shading shows each cell's oil column rather than porosity.
- Option 1 before: It was the only well outside the convex hull of the control.
- Option 1 after: The trend and krige maps are drawn on different grid sizes.
- Option 2 before: Its pick was the only one the spline failed to honour.
- Option 2 after: The kriged map also colours the 32 live nodes without oil.
- Option 3 before: Three of the four nodes around it were dead.
- Option 3 after: The colour scale rescales to each model's range.

### reservoircalc advanced final ord 39: fixed (duplicate)

- Flag: near duplicate of advanced module m05-the-limits-of-a-property-model 14 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test what a property map cannot resolve (m05 l05).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: How many modelled porosity values does Ekene produce from six measurements?
- Prompt after: Two candidate locations 500 m apart differ by 0.010 on the Ekene trend map. What should a planner conclude?
- Explanation before: About 28 modelled values per measurement among the booked cells, and the model overrides four of the six measurements it was fitted to.
- Explanation after: At 0.020437 per kilometre the plane gives 0.010 over 500 m, a difference that comes entirely from a fit to six wells, four of which it misses by more than 8 percent. The map cannot distinguish locations closer than the well spacing, though it will appear to.
- Option 0 before: 500 across the frame, of which 169 reach the booking.
- Option 0 after: Nothing, since the plane misses four of its wells by more than that.
- Option 1 before: 169, one per oil bearing cell.
- Option 1 after: Drill the western one, since the plane predicts it better.
- Option 2 before: 201, one per live node.
- Option 2 after: That the gradient is confirmed at that scale.
- Option 3 before: 6, extended by the constant method.
- Option 3 after: That the difference is worth 5 percent of the booking.

### reservoircalc advanced final ord 40: fixed (duplicate)

- Flag: EXACT duplicate of advanced module m05-the-limits-of-a-property-model 15 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test applying the resolution test (m05 l05 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: What is the resolution test for a property map?
- Prompt after: A property map has a gradient of 0.05 per kilometre, wells 2 km apart and a largest residual of 0.01. Beyond what distance do its predictions exceed its misfit?
- Explanation before: At Ekene the plane predicts about 0.020 over a kilometre and its largest residual is 0.019309, so its signal to noise ratio at the well spacing scale is about one.
- Explanation after: The map predicts a change of 0.01 over 0.01 / 0.05 = 0.2 km, so beyond about 200 m its differences exceed the largest residual. Over the 2 km spacing it predicts 0.10 against 0.01, which is genuine resolution, unlike Ekene's ratio of about one.
- Option 0 before: Compare the modelled range against the measured range.
- Option 0 after: About 2 km, since the test runs at the well spacing.
- Option 1 before: Compare the gradient times the well spacing against the residual.
- Option 1 after: About 200 m, giving a signal to noise of ten at the well spacing.
- Option 2 before: Compare the cell size against the mean well spacing.
- Option 2 after: About 5 km, the residual divided by the gradient.
- Option 3 before: Compare the effective porosity against the arithmetic well mean.
- Option 3 after: Nowhere, since the residual is larger than the gradient.

### reservoircalc advanced final ord 41: fixed (duplicate)

- Flag: near duplicate of advanced module m06-the-property-workflow 8 (same concept, same key)
- Reason: Kept the module question; rewrote the final copy to test the failure at the collection step (m06 l01).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Which check tells you how much a result depends on the property model at all?
- Prompt after: How does the first step of the property workflow, collecting the values, usually fail?
- Explanation before: At Ekene it says 62 percent of the uplift would survive the property model being wholly discredited. The other checks verify the arithmetic rather than its importance.
- Explanation after: Each value is already an average with its own uncertainty, and a porosity from a density log with an assumed matrix density is a different animal from one from core. Recording provenance is what lets them be weighted or separated deliberately.
- Option 0 before: The ratio check across the three lower chain rows.
- Option 0 after: The values are averaged before the population method is chosen.
- Option 1 before: The geometry check against the constant booking.
- Option 1 after: Dry wells are dropped because they carry no oil.
- Option 2 before: The decomposition, costing two extra bookings and one subtraction.
- Option 2 after: Core and log porosities are pooled without comment and weighted equally.
- Option 3 before: The residual inspection at the control points.
- Option 3 after: Values are fitted before their range is examined.

### reservoircalc intermediate final ord 10: fixed (duplicate)

- Flag: near duplicate of intermediate module m02-labelling-the-grid 14 (same concept, same key)
- Reason: Kept the module question; rewrote this copy to test where the fault sweep stops (m02 l05).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: At a fault of 1500 m the split is 78 and 91 cells; at 1600 m it is 91 and 78. What does that show?
- Prompt after: Why does a fault placed at 2300 m or further east partition nothing at the 1560 m contact?
- Explanation before: The mirror is in area only. The barrels split evenly nearer 1450 m, because the western cells carry taller columns.
- Explanation after: The sweep table has the east block at 4 cells for a fault at 2200 m and none at 2300 m, so a fault out there leaves the west block as the whole field, 169 cells and 12.139208 MMstb. A fault only matters where there is something to divide.
- Option 0 before: That the barrels split evenly somewhere between those two positions.
- Option 0 after: Because the mask ends at 2300 m, so the frame holds no nodes beyond it.
- Option 1 before: That the sweep is linear in cell count across the full range.
- Option 1 after: Because the fault then lies outside the frame.
- Option 2 before: That both positions book the same volume in the west block.
- Option 2 after: Because both blocks then share a single contact.
- Option 3 before: That the accumulation is nearly symmetric in area about 1550 m.
- Option 3 after: Because no oil bearing cell lies east of 2200 m at that contact.

### reservoircalc intermediate final ord 11: fixed (duplicate)

- Flag: near duplicate of intermediate module m03-the-block-volumes 3 (same concept, same key)
- Reason: Kept the module question; rewrote this copy to test where accumulation order starts to matter (m03 l02).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Which rows of a partitioned chain add to the field total bit for bit?
- Prompt after: At which step of the partitioned chain does the order of summation first change the last bits?
- Explanation before: Pore volume, hydrocarbon pore volume and STOIIP differ in the last bits, because the chain stops being exactly representable once it multiplies by a float32 porosity.
- Explanation after: Thicknesses from a float32 grid times 10,000 and 0.8 keep the running sums exactly representable, so gross and net volume agree bit for bit. At the pore step the chain multiplies by 0.20 stored as a float32, rounding begins, and the grouping starts to matter.
- Option 0 before: Cell count, gross rock volume and net volume.
- Option 0 after: At the pore volume step.
- Option 1 before: Every row, since a partition is exact arithmetic on the same set of cells.
- Option 1 after: At the gross rock volume step, where column multiplies cell area.
- Option 2 before: Cell count only, since integer addition alone is exact.
- Option 2 after: At the net volume step, since net to gross is a fraction.
- Option 3 before: Cell count, gross rock volume, net volume and pore volume.
- Option 3 after: Only at the final barrel conversion into STOIIP.

### reservoircalc intermediate final ord 24: fixed (duplicate)

- Flag: near duplicate of intermediate module m04-the-fault-the-map-does-not-know 12 (same concept, same key)
- Reason: Kept the module question; rewrote this copy to test what the east block rests on if Ekene-6 changes sides (m04 l05 exercise).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: What do the two dry Ekene wells contribute?
- Prompt after: If the fault were remapped 200 m further east so that Ekene-6 fell in the west block, what would the east block's booking rest on?
- Explanation before: Without them the map would not know how fast the surface falls away eastward. What they cannot do is confirm that the eastern compartment holds oil, which only Ekene-6 does.
- Explanation after: Ekene-2 and Ekene-4 are both dry at the contact, so the eastern oil would be an entirely mapped quantity with no direct confirmation, while the west gained both the well and the volume. Moving a line 200 m changes confidence far more than barrels.
- Option 0 before: Nothing, since a dry well cannot inform a volumetric estimate.
- Option 0 after: Ekene-2 alone, which would then become the eastern discovery.
- Option 1 before: They define the eastern flank of the structure and so constrain the surfaces.
- Option 1 after: No oil bearing well at all, since both remaining eastern wells are dry.
- Option 2 before: They fix the eastern contact, since water was found at their tops.
- Option 2 after: The same evidence as before, since the map itself is unchanged.
- Option 3 before: They confirm that the eastern compartment holds no economic oil.
- Option 3 after: The western wells, whose contact now applies to the east.

### reservoircalc intermediate final ord 28: fixed (duplicate)

- Flag: near duplicate of intermediate module m05-two-blocks-two-contacts 3 (same concept, same key)
- Reason: Kept the module question; rewrote this copy to test a free water level from pressure gradients (m05 l01).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Take the east contact from 1560 m to 1550 m. What happens to the east block?
- Prompt after: How can pressure data give a compartment its own contact without a well that crosses it?
- Explanation before: Raising a contact removes area and column together and the two compound. A block whose mean column is 8.06 m cannot survive a 10 m rise with much left.
- Explanation after: Gradients measured in the oil and water legs, extended to their intersection, give a free water level for that compartment. Two compartments with genuinely different contacts usually show different pressure regimes too, a second and independent signature.
- Option 0 before: It falls by about 10 percent, in proportion to the change.
- Option 0 after: Average the pressures measured in the compartment's wells and convert to a depth.
- Option 1 before: It falls from 52 to 18 cells and loses 86 percent of its oil.
- Option 1 after: Extrapolate the oil and water leg gradients to where they intersect.
- Option 2 before: It is unchanged, since both its wells were already dry.
- Option 2 after: Borrow the contact from the neighbouring compartment.
- Option 3 before: It falls from 52 to 39 cells, matching a one column fault move.
- Option 3 after: Take the top of the shallowest dry well as the contact.

### reservoircalc intermediate final ord 29: fixed (duplicate)

- Flag: near duplicate of intermediate module m05-two-blocks-two-contacts 7 (same concept, same key)
- Reason: Kept the module question; rewrote this copy to test seal capacity bounding a contact difference (m04 l04).
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: Why is the east block's contact response asymmetric about 1560 m?
- Prompt after: What limits how far the contacts can differ across a real, partially sealing fault?
- Explanation before: Going up 10 m costs 1.955732 MMstb and going down 10 m gains 3.527386 MMstb. On a flank the downside is bounded by the oil running out and the upside only by the spill point.
- Explanation after: Fault seal is a capacity rather than a switch: above a certain height the buoyancy pressure exceeds what the fault rock can hold. The contact difference is therefore bounded, while this tier treats the two contacts as free to differ, which is the simple case.
- Option 0 before: Because the mask limits how far the mapped area can extend eastward.
- Option 0 after: The fault position uncertainty, which sets the shift between blocks.
- Option 1 before: Because the properties scale the two directions differently.
- Option 1 after: The dip of the fault, which fixes the offset between top and base.
- Option 2 before: Because deepening floods new area on a broad gentle flank while raising only removes column.
- Option 2 after: The seal capacity, since the fault rock supports only a limited column before it leaks.
- Option 3 before: Because the western contact was held fixed throughout.
- Option 3 after: Nothing, since sealed compartments have independent histories.

### reservoircalc intermediate module m02-labelling-the-grid ord 11: fixed (duplicate)

- Flag: near duplicate of intermediate module m04-the-fault-the-map-does-not-know 6 (same concept, same key)
- Reason: Kept the home module question; rewrote this copy to test why the fault lands on a node and what a shifted origin does (m02 l02 exercise); the cell counts against depths rule stays in m04, its home lesson.
- Correct option or prompt changed: Full rewrite of a duplicated question into a new one; the key stays at the same index.
- Prompt before: A partitioned model is edited and the block cell counts hold while both block volumes fall. What changed?
- Prompt after: If the frame started at an easting of 450 m with the same 100 m spacing, what would the tie break rule decide at the 1800 m fault?
- Explanation before: Cell counts move when geometry moves and volumes move when depths move. A contact change would have moved the counts and a fault move cannot change the field total.
- Explanation after: With an origin of 450 m the node eastings are 450, 550, 650 and so on, so every node is strictly on one side of 1800 m. The 13 cells at 1750 m go west and the 13 at 1850 m go east without the tie break ever firing.
- Option 0 before: The contact, which has removed column from every cell.
- Option 0 after: It would send the column at 1800 m east, exactly as it does now.
- Option 1 before: The fault position, which has relabelled cells between blocks.
- Option 1 after: It would send the 1750 m column east, since it is nearest the fault.
- Option 2 before: The mapped depths, while the control positions stayed put.
- Option 2 after: Nothing, since the fault would fall between the columns at 1750 and 1850 m.
- Option 3 before: The property set, which has been revised downward.
- Option 3 after: It would split each boundary cell in half between the two blocks, since both halves are real.

### reservoircalc intermediate module m02-labelling-the-grid ord 12: fixed (double-key)

- Flag: intermediate module m02 ord 12: "the fault has no displacement" only wrong if the course states the fault has throw
- Reason: The course states the model fault has no displacement (m04 l04), so the distractor's premise was true; rewrote it to misapply the depth/mask mechanism (the mask reads positions only).
- Option 0 before: Because the fault has no displacement, so the surfaces and the mask are continuous across its trace.
- Option 0 after: Because the mask is built from the mapped depths, and the smooth surfaces carry no step at the fault.

### reservoircalc intermediate final ord 8: fixed (double-key)

- Flag: same true-premise distractor ("the fault has no displacement") as module m02 ord 12; found while fixing that flag
- Reason: Same fix as module m02 ord 12: the model fault really has no displacement, so the distractor now misapplies the depth/mask mechanism instead.
- Option 0 before: Because the fault has no displacement, so the surfaces are continuous.
- Option 0 after: Because the mask reads mapped depths, which run smoothly across it.

### reservoircalc advanced module m05-the-limits-of-a-property-model ord 15: fixed (other)

- Flag: advanced module m05 ord 15: correct option only 1 character longer than option 0 (length margin, not a content defect; review)
- Reason: Shortened distractor 0 so the correct option clears every distractor by at least 6 characters; content unchanged.
- Option 0 before: Compare the effective porosity against the arithmetic well mean.
- Option 0 after: Compare the effective porosity with the well mean.

### reservoircalc advanced module m06-the-property-workflow ord 12: fixed (defect)

- Flag: NEW: explanation and option 3 state a 0.001 tolerance on the node mean; the capstone lesson (m06 l03) sets it at 0.0002, and the old explanation said the wrong value fails by half again the tolerance
- Reason: Corrected the tolerance to the lesson's 0.0002 in the explanation and option 3; shortened option 1, which tied the correct option at 87 characters.
- Explanation before: They differ by 0.001455 and the tolerance is 0.001, so the volume weighted value fails by half again the tolerance. Both are on the panel, so read the tile labels.
- Explanation after: They differ by 0.001455 and the tolerance on that field is 0.0002, so the volume weighted value fails by more than seven times the tolerance. Both are on the panel, so read the tile labels.
- Option 1 before: The volume weighted 0.210822; the node mean 0.209368 misses by more than the tolerance.
- Option 1 after: The volume weighted 0.210822; the node mean 0.209368 falls outside the tolerance.
- Option 3 before: Either, since both lie inside the 0.001 tolerance on that field.
- Option 3 after: Either, since both lie inside the 0.0002 tolerance on that field.

## rockphysics

Migration: `migrations/20261021b_b4_fix_rockphysics.sql`

### rockphysics advanced final ord 2: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m01-from-a-rock-to-an-interface 1: 'What does this tier add to the tier below?'
- Reason: final exam copy of advanced module m01-from-a-rock-to-an-interface 1 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What does this tier add to the tier below?
- Prompt after: Why is forward modelling the right boundary for this tier's work?
- Explanation before: A reflection is a property of a boundary rather than of a rock, and the tier below produced rocks.
- Explanation after: The forward model is what an interpretation is compared against, and if it is wrong the comparison is meaningless whatever the data quality. The tier therefore models what the data should look like, given two rocks, and leaves processing and inversion aside.
- Option 0 before: A property model across the field.
- Option 0 after: Real gathers carry no fluid information at all.
- Option 1 before: An overburden, turning two rocks into two interfaces.
- Option 1 after: An interpretation is only as good as the model it is compared against.
- Option 2 before: A saturation height model for the reservoir.
- Option 2 after: Inversion of a gather needs no rock model.
- Option 3 before: A processing sequence turning reflectivity into a trace.
- Option 3 after: Forward models remove the need for well control and for seismic processing alike.

### rockphysics advanced final ord 3: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m01-from-a-rock-to-an-interface 2: 'What are the Ekene shale's logged properties?'
- Reason: final exam copy of advanced module m01-from-a-rock-to-an-interface 2 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What are the Ekene shale's logged properties?
- Prompt after: Why does the step down in velocity ratio across the Ekene interface matter for AVO?
- Explanation before: The other two triples are the gas sand and the logged brine sand. The same shale sits over both, so every difference between the responses is a fluid difference.
- Explanation after: The shale's velocity ratio of 1.968 steps down to 1.778 in the brine sand and 1.537 in the gas sand. Poisson's ratio is a function of the velocity ratio, and the AVO gradient is essentially a contrast in it, so that step is where the gradient comes from.
- Option 0 before: 2743 m/s, 1394 m/s, 2450 kg/m3.
- Option 0 after: The gradient is essentially a contrast in Poisson's ratio.
- Option 1 before: 2905.6972280296195 m/s, 1890.9758806113214 m/s, 2038.7104517793223 kg/m3.
- Option 1 after: The intercept is set by the contrast in velocity ratio across the interface alone.
- Option 2 before: 3200 m/s, 1800 m/s, 2250 kg/m3.
- Option 2 after: It sets the critical angle.
- Option 3 before: 2743 m/s, 1800 m/s, 2250 kg/m3.
- Option 3 after: It decides the tuning thickness.

### rockphysics advanced final ord 4: fixed (duplicate)

- Flag: near p0.83 k0.86 duplicate of advanced module m01-from-a-rock-to-an-interface 5: 'Is the Ekene gas sand faster or slower than the shale?'
- Reason: final exam copy of advanced module m01-from-a-rock-to-an-interface 5 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Is the Ekene gas sand faster or slower than the shale?
- Prompt after: By how much does the Ekene gas sand's impedance fall short of the shale's?
- Explanation before: The velocity contrast stays positive. The reflection is negative anyway, because the density falls by 411.29 kg/m3 across the interface.
- Explanation after: The gas sand is 5.9 percent faster and 16.8 percent lighter than the shale, and impedance is the product, so 5,923,875 sits 11.9 percent below 6,720,350. The brine sand sits 7.1 percent above the shale.
- Option 0 before: Slower, by 162.69722802961946 m/s.
- Option 0 after: 16.8 percent, which is the density deficit alone.
- Option 1 before: Faster, by 162.69722802961946 m/s.
- Option 1 after: 11.9 percent, from the product of the two.
- Option 2 before: The same speed, within a metre per second.
- Option 2 after: 7.1 percent, the same margin as the brine sand has.
- Option 3 before: Slower, by 457 m/s.
- Option 3 after: 5.9 percent.

### rockphysics advanced final ord 5: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m01-from-a-rock-to-an-interface 6: 'What flips the sign of the Ekene reflection?'
- Reason: final exam copy of advanced module m01-from-a-rock-to-an-interface 6 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What flips the sign of the Ekene reflection?
- Prompt after: Why is the density change behind the Ekene sign flip a robust result?
- Explanation before: The gas sand is 5.9 percent faster and 16.8 percent lighter than the shale, and impedance is the product.
- Explanation after: The density change is mass bookkeeping that depends only on the porosity and the two fluid densities, and involves none of Gassmann's assumptions about pore connectivity, frequency or anisotropy. It does depend on the porosity, and there was no gas zone log to read it from.
- Option 0 before: The shear contrast reversing between the fluid cases.
- Option 0 after: It is read directly from the density log in the gas zone.
- Option 1 before: The velocity contrast reversing across the interface.
- Option 1 after: It follows from the shear modulus, which is fluid blind.
- Option 2 before: The density contrast outweighing the velocity.
- Option 2 after: It needs no Gassmann assumptions.
- Option 3 before: The critical angle falling inside the recorded range.
- Option 3 after: It does not depend on the assumed porosity of the sand.

### rockphysics advanced final ord 6: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m01-from-a-rock-to-an-interface 8: 'What are the exact normal incidence reflections at Ekene?'
- Reason: final exam copy of advanced module m01-from-a-rock-to-an-interface 8 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What are the exact normal incidence reflections at Ekene?
- Prompt after: A sand and its shale have equal impedance when the sand holds brine. What does gas do to the normal incidence reflection?
- Explanation before: The second pair is the Shuey intercepts, which are the linearised versions and differ in the fourth decimal.
- Explanation after: With equal impedances the brine case reflects nothing. Gas lowers the sand's impedance, so the reflection turns negative and the interface appears: the cleanest possible direct hydrocarbon indicator, and a warning that an absent reflection is not evidence of an absent interface.
- Option 0 before: 0.076897 brine and 0.028803 gas.
- Option 0 after: It stays at zero, since the two impedances still match exactly.
- Option 1 before: 0.03434399848203321 brine and -0.06282494068620303 gas.
- Option 1 after: It becomes positive, since the sand gets faster.
- Option 2 before: 0.034457 brine and -0.124566 gas.
- Option 2 after: It vanishes.
- Option 3 before: 0.034457 brine and -0.0629911815139045 gas.
- Option 3 after: It goes from zero to negative, so the interface appears.

### rockphysics advanced final ord 7: fixed (duplicate)

- Flag: near p0.90 k0.67 duplicate of advanced module m01-from-a-rock-to-an-interface 9: 'Could any porosity make the Ekene gas reflection positive?'
- Reason: final exam copy of advanced module m01-from-a-rock-to-an-interface 9 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Could any porosity make the Ekene gas reflection positive?
- Prompt after: Over porosities of 0.20 to 0.30, how does the Ekene gas contrast against the shale change?
- Explanation before: It rises with porosity to a maximum near 0.41 and falls again, never reaching 6,720,350. The sign is robust; the impedance sits 16.1 percent below the shale's at a porosity of 0.20 and 9.9 percent below it at 0.30.
- Explanation after: The gas impedance rises with porosity, so the contrast shrinks from 16.1 percent at 0.20 to 9.9 percent at 0.30. The sign is robust, since the impedance peaks near a porosity of 0.413 still below the shale's, but the magnitude varies by a factor of 1.6.
- Option 0 before: No. The gas impedance peaks below the shale's.
- Option 0 after: It shrinks from 16.1 to 9.9 percent, a factor of 1.6.
- Option 1 before: Yes, below a porosity of about 0.10.
- Option 1 after: It stays at 11.9 percent at every porosity.
- Option 2 before: Yes, above a porosity of about 0.40.
- Option 2 after: It grows as the porosity rises.
- Option 3 before: Yes, but only outside the range the engine accepts.
- Option 3 after: It reverses sign as the porosity approaches 0.30, where the gas impedance peaks.

### rockphysics advanced final ord 8: fixed (duplicate)

- Flag: near p0.67 k1.00 duplicate of advanced module m02-intercept-and-gradient 1: 'What did Shuey's rewrite achieve?'
- Reason: final exam copy of advanced module m02-intercept-and-gradient 1 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What did Shuey's rewrite achieve?
- Prompt after: Shuey's form comes from linearising the exact solution. Which two limitations does that bring?
- Explanation before: Three coefficients from the rocks and three functions of angle. That separation is what lets a gather be fitted for two rock properties.
- Explanation after: The linearisation assumes small contrasts and small angles, so the form degrades when the two rocks are very different and past about 30 degrees, which is inside the range modern surveys record.
- Option 0 before: It extended the exact solution past the critical angle.
- Option 0 after: Low frequencies and a noise free recorded gather.
- Option 1 before: It separated the rocks from the angle.
- Option 1 after: Small contrasts and small angles.
- Option 2 before: It removed the shear velocity from the problem.
- Option 2 after: A fixed velocity ratio and no density contrast.
- Option 3 before: It made the exact solution faster to evaluate.
- Option 3 after: Elastic isotropy and a zero phase wavelet.

### rockphysics advanced final ord 9: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m02-intercept-and-gradient 4: 'Which property is absent from the intercept?'
- Reason: final exam copy of advanced module m02-intercept-and-gradient 4 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Which property is absent from the intercept?
- Prompt after: Which Shuey coefficient controls the response over the roughly 0 to 35 degree range a survey records?
- Explanation before: At normal incidence there is no shear motion at the interface. The shear velocity appears twice in the gradient instead, which is why the gradient carries fluid information.
- Explanation after: The intercept fixes the value at zero angle, the gradient controls the behaviour over the recorded range of roughly 0 to 35 degrees, and the curvature only matters at large angles where the tangent pulls away from the sine.
- Option 0 before: The compressional velocity.
- Option 0 after: The curvature term, C, throughout the range.
- Option 1 before: The density.
- Option 1 after: All three equally.
- Option 2 before: The shear velocity.
- Option 2 after: The gradient, B, above all.
- Option 3 before: The porosity.
- Option 3 after: The intercept, A.

### rockphysics advanced final ord 10: fixed (duplicate)

- Flag: EXACT/diffkey duplicate of advanced module m02-intercept-and-gradient 6: 'What are the two halves of the Ekene gas intercept?'
- Reason: final exam copy of advanced module m02-intercept-and-gradient 6 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What are the two halves of the Ekene gas intercept?
- Prompt after: Which inputs move the Ekene gas intercept most directly?
- Explanation before: The velocity half is positive because the gas sand is faster than the shale, and the density half is more than three times larger.
- Explanation after: For this rock the intercept is a density observation more than a velocity one, so anything that changes the density prediction moves it directly. A gas density computed at the wrong pressure moves the intercept, while the shear velocity does not appear in it at all.
- Option 0 before: Both about -0.0314, contributing equally.
- Option 0 after: The shear velocities of the sand and of the shale that sits above it.
- Option 1 before: Velocity -0.09162755152933573, density +0.028802610843132695.
- Option 1 after: The threshold and wavelet frequency.
- Option 2 before: Velocity +0.076897, density -0.042553.
- Option 2 after: The curvature and the angle range.
- Option 3 before: Velocity +0.028802610843132695, density -0.09162755152933573.
- Option 3 after: The porosity and the gas density at reservoir conditions.

### rockphysics advanced final ord 11: fixed (duplicate)

- Flag: near p0.75 k0.60 duplicate of advanced module m02-intercept-and-gradient 7: 'Change only the density from the brine case. What is the intercept?'
- Reason: final exam copy of advanced module m02-intercept-and-gradient 7 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Change only the density from the brine case. What is the intercept?
- Prompt after: Changing density and velocity one at a time from the brine case, what work does each do to the Ekene intercept?
- Explanation before: The velocity half stays at +0.076897 and the density half becomes -0.091628. The velocity change then more than quadruples the negative value.
- Explanation after: The density change alone takes the intercept from +0.034344 to -0.014730, flipping its sign, and the velocity change then more than quadruples the negative value. The shear velocity plays no part in the intercept.
- Option 0 before: -0.014730, so density alone flips it.
- Option 0 after: Density does the qualitative work and velocity the quantitative.
- Option 1 before: -0.06282494068620303, the full gas value.
- Option 1 after: Velocity flips the sign and density sets the size.
- Option 2 before: +0.034344, unchanged.
- Option 2 after: Each supplies half of the change.
- Option 3 before: -0.091628, the density half alone.
- Option 3 after: Density sets the size of the change and the shear contrast flips its sign.

### rockphysics advanced final ord 12: fixed (duplicate)

- Flag: EXACT/samekey duplicate of advanced module m02-intercept-and-gradient 8: 'What are the two Ekene gradients?'
- Reason: final exam copy of advanced module m02-intercept-and-gradient 8 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What are the two Ekene gradients?
- Prompt after: Between the brine and gas cases, which gradient contributions push toward a shallower gradient?
- Explanation before: Brine first, gas second. Both are negative and the gas case is 53 percent steeper; -0.409318 is the gas case's shear term alone.
- Explanation after: The compressional contrast shrinks and the density contrast grows more negative, both making the gradient less negative, while the growing shear contrast makes it steeper. The shear term wins, so the gas gradient is steeper overall.
- Option 0 before: +0.16766246414664518 and -0.2565633444602355.
- Option 0 after: The shear and density contrasts, acting together.
- Option 1 before: -0.16766246414664518 and -0.2565633444602355.
- Option 1 after: The density and compressional contrasts.
- Option 2 before: -0.2565633444602355 and -0.16766246414664518.
- Option 2 after: All three, offset by w.
- Option 3 before: -0.409318 and -0.256563.
- Option 3 after: The shear contrast alone.

### rockphysics advanced final ord 13: fixed (duplicate)

- Flag: EXACT/samekey duplicate of advanced module m02-intercept-and-gradient 10: 'What are the three terms of the Ekene gas gradient?'
- Reason: final exam copy of advanced module m02-intercept-and-gradient 10 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What are the three terms of the Ekene gas gradient?
- Prompt after: Which order of influence holds for the intercept at a shale over sand interface?
- Explanation before: The shear term is 2.7 times the other two combined, and the density term is positive, pushing the gradient up rather than down.
- Explanation after: The intercept contains only the compressional and density contrasts, with density leading. Shear, then density, then compressional is the ranking for the gradient, and the two lists differing is why two coefficients carry more information than one.
- Option 0 before: -0.028803 velocity, +0.123952 density, -0.409318 shear.
- Option 0 after: Shear first, then density, then compressional velocity.
- Option 1 before: +0.028803 velocity, -0.123952 density, +0.409318 shear.
- Option 1 after: Compressional velocity, then density, then shear last.
- Option 2 before: +0.028803 velocity, +0.123952 density, -0.409318 shear.
- Option 2 after: Density, then compressional, with shear absent.
- Option 3 before: +0.123952 velocity, +0.028803 density, -0.409318 shear.
- Option 3 after: Density and shear equally.

### rockphysics advanced final ord 14: fixed (duplicate)

- Flag: near p0.73 k1.00 duplicate of advanced module m02-intercept-and-gradient 11: 'Why is the density term positive in the gradient?'
- Reason: final exam copy of advanced module m02-intercept-and-gradient 11 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why is the density term positive in the gradient?
- Prompt after: What happens to the gradient where the sand and the shale share the same shear velocity?
- Explanation before: Intercept and gradient respond to density in opposite directions, which is part of why crossplotting the two separates fluid effects.
- Explanation after: With no shear contrast only the compressional and density terms remain, which for a typical shale over sand interface leaves the gradient small and possibly positive. A very shaly sand can approach this, which is one reason it can show a muted or reversed response.
- Option 0 before: The gradient uses the reciprocal of the density contrast.
- Option 0 after: It becomes exactly zero, the shear term being all of it.
- Option 1 before: The density contrast is positive across this interface.
- Option 1 after: It steepens, as the density term then dominates it.
- Option 2 before: The weighting factor is negative for a shale over sand pair.
- Option 2 after: Nothing, since the weighting factor absorbs it.
- Option 3 before: It enters as $-2w\Delta\rho/\bar\rho$ rather than $+\tfrac{1}{2}\Delta\rho/\bar\rho$.
- Option 3 after: The shear term vanishes, leaving it small and possibly positive.

### rockphysics advanced final ord 16: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m02-intercept-and-gradient 14: 'Where do the two Ekene cases sit on a crossplot?'
- Reason: final exam copy of advanced module m02-intercept-and-gradient 14 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Where do the two Ekene cases sit on a crossplot?
- Prompt after: On the intercept and gradient crossplot, what does changing the class II threshold move?
- Explanation before: The fluid displacement is -0.097169 in intercept and -0.088901 in gradient, at 42.4 degrees below the negative intercept direction.
- Explanation after: Setting the threshold to 0.04 changes no coefficient, so neither point moves. The crossplot position is a property of the rocks, and only the label attached to a region of the plane is a convention.
- Option 0 before: Brine lower left, gas lower right.
- Option 0 after: Both Ekene points, toward the origin.
- Option 1 before: Brine lower right, gas lower left.
- Option 1 after: Only the labels.
- Option 2 before: Both lower left, separated along the gradient axis.
- Option 2 after: The brine point, into the class II region.
- Option 3 before: Both lower right, separated along the intercept axis.
- Option 3 after: The background trend of ordinary interfaces.

### rockphysics advanced final ord 17: fixed (duplicate)

- Flag: near p0.67 k0.86 duplicate of advanced module m02-intercept-and-gradient 15: 'What is a crossplot anomaly measured against?'
- Reason: final exam copy of advanced module m02-intercept-and-gradient 15 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What is a crossplot anomaly measured against?
- Prompt after: When are fluid and lithology confounded on an intercept and gradient crossplot?
- Explanation before: Shale over shale, shale over brine sand and sand over shale interfaces all fall along a trend, and a displacement from it in the fluid direction is the candidate.
- Explanation after: Where the fluid direction and the background trend are close together, a fluid displacement looks like a lithology change and AVO does not discriminate. Where they are near perpendicular it discriminates well. At Ekene the fluid vector points down and to the left, a favourable geometry.
- Option 0 before: The fluid vector from the substitution.
- Option 0 after: When the fluid vector points down and to the left.
- Option 1 before: The origin of the crossplot.
- Option 1 after: When both fluid cases share one class.
- Option 2 before: The local background trend of interfaces.
- Option 2 after: When the fluid direction lies close to the background trend.
- Option 3 before: The class boundaries at the threshold.
- Option 3 after: When the two cases have equal intercepts.

### rockphysics advanced final ord 18: fixed (duplicate)

- Flag: near p0.86 k0.67 duplicate of advanced module m03-the-class-flip 1: 'What is a class I response?'
- Reason: final exam copy of advanced module m03-the-class-flip 1 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What is a class I response?
- Prompt after: Which Rutherford-Williams class is hardest to see on a stack?
- Explanation before: The sand is harder than the shale, so the near offsets are positive and the reflection often changes polarity within the gather.
- Explanation after: In class II the impedances nearly match, so the near offsets show almost nothing and the response is dominated by the gradient. These are the cases AVO was invented for. Class III stacks well because every offset has the same sign.
- Option 0 before: Negative intercept, positive gradient.
- Option 0 after: Class III, negative at every recorded offset.
- Option 1 before: Negative intercept, negative gradient.
- Option 1 after: Class IV, dimming steadily as the offset grows.
- Option 2 before: Intercept near zero.
- Option 2 after: Class I, from a hard sand.
- Option 3 before: Positive intercept, negative gradient.
- Option 3 after: Class II, with an intercept near zero.

### rockphysics advanced final ord 19: fixed (duplicate)

- Flag: EXACT/diffkey duplicate of advanced module m03-the-class-flip 3: 'What is a class IV response and why does it matter?'
- Reason: final exam copy of advanced module m03-the-class-flip 3 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What is a class IV response and why does it matter?
- Prompt after: A prospect models at A = -0.05 and B = +0.02. What is its class?
- Explanation before: It occurs where the sand's shear velocity is barely above the shale's, and it breaks the rule of thumb that a gas sand brightens with offset.
- Explanation after: The intercept is below -0.02, so the sign of the gradient decides, and a positive gradient gives class IV. The gather is negative at the near offsets and weakens with offset, which an interpreter using the class III rule of thumb could dismiss.
- Option 0 before: Negative intercept with a positive gradient, dimming with offset.
- Option 0 after: Class IV, negative and dimming with offset.
- Option 1 before: Positive intercept with a positive gradient, brightening with offset.
- Option 1 after: Class III, negative and brightening as offset grows.
- Option 2 before: An intercept of exactly zero, invisible on a stack.
- Option 2 after: Class II, the gradient being small.
- Option 3 before: A response that changes polarity twice across the gather.
- Option 3 after: Class I, the gradient being positive.

### rockphysics advanced final ord 20: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m03-the-class-flip 8: 'How robust are the two Ekene class calls?'
- Reason: final exam copy of advanced module m03-the-class-flip 8 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: How robust are the two Ekene class calls?
- Prompt after: What would it take to move the Ekene gas case into class II?
- Explanation before: The gas intercept is more than three times the widest band and the brine intercept only 1.72 times the default. The two calls are not equally informed.
- Explanation after: The intercept would have to rise above -0.02, which means a gas case density near 2222 kg/m3, needing a porosity of about 0.033 or a pore fluid far denser than gas. Widening the band to 0.05 still leaves the case outside it, and the shear velocity does not enter the intercept.
- Option 0 before: Both robust at every threshold tried.
- Option 0 after: A shear velocity error of about 10 percent in the sand.
- Option 1 before: Gas robust throughout; brine class II at 0.04.
- Option 1 after: A porosity near 0.033, which is no reservoir.
- Option 2 before: Brine robust; gas becomes class IV at a wider threshold.
- Option 2 after: Widening the band to 0.05.
- Option 3 before: Neither, since both intercepts are near the boundary.
- Option 3 after: A gas density computed at the wrong reservoir pressure.

### rockphysics advanced final ord 21: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m03-the-class-flip 10: 'Where does the class II band come from?'
- Reason: final exam copy of advanced module m03-the-class-flip 10 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Where does the class II band come from?
- Prompt after: Why does the class II threshold matter more than its size suggests?
- Explanation before: It reflects a judgement about what counts as a small intercept, made when the classification was introduced, and it travels invisibly with the label unless stated.
- Explanation after: The class is what gets communicated, into prospect summaries and portfolio reviews, and the convention travels invisibly with it. Two teams using thresholds of 0.02 and 0.04 describe the same rock differently, while the coefficients themselves do not change.
- Option 0 before: The range over which Shuey's form is valid.
- Option 0 after: It changes the intercept and gradient values that are reported.
- Option 1 before: The noise level of a typical modern survey.
- Option 1 after: It sets the angle of the polarity crossing.
- Option 2 before: A convention with no derivation, usually 0.02.
- Option 2 after: The class travels into summaries without its threshold.
- Option 3 before: The intercept uncertainty from a standard inversion.
- Option 3 after: It controls Shuey's error at wide angles.

### rockphysics advanced final ord 22: fixed (duplicate)

- Flag: near p0.86 k1.00 duplicate of advanced module m03-the-class-flip 11: 'Which is larger at Ekene: the threshold's effect or Shuey's error?'
- Reason: final exam copy of advanced module m03-the-class-flip 11 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Which is larger at Ekene: the threshold's effect or Shuey's error?
- Prompt after: How far would the brine sand's velocity have to fall to put the Ekene brine intercept on the default class boundary?
- Explanation before: A convention with no derivation has a larger effect on the reported result than the difference between an approximate theory and an exact one.
- Explanation after: The intercept must fall by 0.014344, so the sum of the fractional contrasts must fall by 0.028688, which a velocity drop of about 85 m/s supplies. That is within the uncertainty of a velocity log calibration, so the class is a plausible measurement error away from changing.
- Option 0 before: Neither, both being below the intercept uncertainty.
- Option 0 after: About 457 m/s, all of it.
- Option 1 before: The approximation error, at 0.002175.
- Option 1 after: About 200 m/s, matching its density deficit.
- Option 2 before: They are comparable in size.
- Option 2 after: Under 1 m/s.
- Option 3 before: The threshold, which renames a case entirely.
- Option 3 after: About 85 m/s, from 3200 to 3115.

### rockphysics advanced final ord 23: fixed (duplicate)

- Flag: EXACT/samekey duplicate of advanced module m03-the-class-flip 13: 'Where does the Ekene brine reflection change polarity?'
- Reason: final exam copy of advanced module m03-the-class-flip 13 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Where does the Ekene brine reflection change polarity?
- Prompt after: Had the Ekene brine gradient been half as steep, what would have changed?
- Explanation before: All three angles are correct for their own method and the question asks for the exact one. They are spread over three degrees, which is large for a quantity used to design a stack.
- Explanation after: The class call uses only the intercept, so it would stay class I. What changes is the gather: the polarity flip would move beyond the recorded offsets and the interface would look like a simple weakening positive reflection. Same class, different gather.
- Option 0 before: 29.870555217606523 degrees, on the exact solution.
- Option 0 after: The polarity flip would fall outside the recorded range.
- Option 1 before: 26.92 degrees, on the two term form.
- Option 1 after: The class would change from I to II, at the default threshold.
- Option 2 before: 29.293564554985373 degrees, on the three term form.
- Option 2 after: The intercept would halve as well.
- Option 3 before: It does not, within 40 degrees.
- Option 3 after: The reflection would brighten with offset.

### rockphysics advanced final ord 24: fixed (duplicate)

- Flag: near p0.89 k0.67 duplicate of advanced module m03-the-class-flip 14: 'Why is a polarity crossing hard to locate?'
- Reason: final exam copy of advanced module m03-the-class-flip 14 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why is a polarity crossing hard to locate?
- Prompt after: How is the polarity crossing used in stack design?
- Explanation before: It applies to any quantity located by a zero crossing, and it implies the crossing should be found with the exact solution rather than an approximation.
- Explanation after: A full offset stack averages the positive near and negative far contributions and partially cancels, so stacking only the offsets inside the crossing preserves the amplitude. Misplacing the crossing by three degrees includes or excludes offsets of the opposite sign.
- Option 0 before: The exact solution goes complex near the crossing.
- Option 0 after: Stacking only beyond it doubles the far offset amplitude.
- Option 1 before: The reflection is near zero there.
- Option 1 after: Stacking inside it preserves amplitude.
- Option 2 before: The wavelet changes phase at the crossing.
- Option 2 after: It sets the far offset mute for the gas case.
- Option 3 before: The gradient is undefined where the reflection is zero.
- Option 3 after: It fixes the offset at which the intercept is measured.

### rockphysics advanced final ord 25: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m03-the-class-flip 15: 'What does a full offset stack do to the Ekene brine reflection?'
- Reason: final exam copy of advanced module m03-the-class-flip 15 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What does a full offset stack do to the Ekene brine reflection?
- Prompt after: At 30 degrees, how do Shuey and the exact solution compare for the Ekene brine reflection?
- Explanation before: Averaging the five tabulated exact values to 20 degrees gives 0.026711 and all five to 40 gives 0.014671, so a full stack is about 55 percent of a limited one.
- Explanation after: Shuey gives -0.001164 and the exact solution -0.000190. Both are small, they agree in sign, and their ratio is six. The exact crossing is at 29.87 degrees, so the reflection is already negative at 30.
- Option 0 before: Leaves it unchanged, the crossing being beyond 40 degrees.
- Option 0 after: Opposite in sign, Shuey positive and exact negative.
- Option 1 before: Doubles it, since every offset adds with the same sign.
- Option 1 after: Both positive, the crossing lying beyond 30 degrees.
- Option 2 before: Cancels about half of it, from 0.026711 to 0.014671.
- Option 2 after: Both small and negative, six times apart.
- Option 3 before: Reverses its polarity, the far offsets dominating.
- Option 3 after: Identical at -0.000190.

### rockphysics advanced final ord 26: fixed (duplicate)

- Flag: near p0.78 k1.00 duplicate of advanced module m04-approximation-and-exact 1: 'What does Zoeppritz give that Shuey does not?'
- Reason: final exam copy of advanced module m04-approximation-and-exact 1 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What does Zoeppritz give that Shuey does not?
- Prompt after: What happens to the exact solution past the critical angle?
- Explanation before: What it cannot do is be inverted, since a curve cannot determine six independent rock properties. Shuey's approximation buys invertibility.
- Explanation after: Past the critical angle the transmitted compressional wave stops propagating, the reflection coefficient acquires a phase as well as an amplitude, and the transmitted wave becomes evanescent. At Ekene that angle is 70.7 degrees, far outside the recorded range.
- Option 0 before: A form that stays real past the critical angle.
- Option 0 after: It reduces to the plain impedance contrast.
- Option 1 before: Two coefficients a gather can be fitted for.
- Option 1 after: It matches Shuey's three term form exactly.
- Option 2 before: A separation of the rocks from the geometry.
- Option 2 after: It stops depending on the shear velocity.
- Option 3 before: An exact answer at any contrast and angle.
- Option 3 after: It turns complex and gains a phase.

### rockphysics advanced final ord 27: fixed (duplicate)

- Flag: EXACT/diffkey duplicate of advanced module m04-approximation-and-exact 4: 'Where is the Ekene critical angle for the gas case?'
- Reason: final exam copy of advanced module m04-approximation-and-exact 4 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Where is the Ekene critical angle for the gas case?
- Prompt after: Why does the complexity of the exact solution not matter in practice?
- Explanation before: $\arcsin(2743/2905.6972)$. The imaginary part of the solution is zero throughout 0 to 40 degrees, which is not always the case.
- Explanation after: The usual reason given for avoiding it is that it is complicated, which is true and irrelevant to a computer. The real obstacle is that it cannot be inverted, since a curve cannot determine six rock properties.
- Option 0 before: 70.7 degrees, far outside the recorded range.
- Option 0 after: A computer evaluates it as easily as Shuey.
- Option 1 before: 30 degrees, which is why the capstone uses that angle.
- Option 1 after: Its imaginary part is zero at every possible angle.
- Option 2 before: 40 degrees, at the edge of the modelled range.
- Option 2 after: It reduces to Shuey's three term form below 30 degrees.
- Option 3 before: There is none, the gas sand being slower than the shale.
- Option 3 after: Only its real part is ever recorded by a seismic survey.

### rockphysics advanced final ord 28: fixed (duplicate)

- Flag: near p0.93 k0.60 duplicate of advanced module m04-approximation-and-exact 7: 'How wrong is the two term form at 40 degrees for the gas case?'
- Reason: final exam copy of advanced module m04-approximation-and-exact 7 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: How wrong is the two term form at 40 degrees for the gas case?
- Prompt after: At 30 degrees, what does the third Shuey term add to the Ekene gas reflection?
- Explanation before: The third term is worth a factor of 35 in accuracy at the far offsets, and it is still the two term form that should be fitted to a real gather.
- Explanation after: The contribution is C times the bracket, 0.0288 times 0.0833, which is 0.002400 or 2 percent of the reflection. At 20 degrees it is 0.000444 and at 40 degrees 0.008379, so the term starts to matter around 25 to 30 degrees.
- Option 0 before: 0.000246, against 0.008625 for three terms.
- Option 0 after: 0.008379, about 5 percent.
- Option 1 before: 0.008625, against 0.000246 for three terms.
- Option 1 after: 0.002400, which is about 2 percent of it.
- Option 2 before: 0.002175, the same as at 30 degrees.
- Option 2 after: Nothing, since the term vanishes below 40 degrees.
- Option 3 before: It is exact there.
- Option 3 after: 0.000444, or 0.5 percent.

### rockphysics advanced final ord 29: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m04-approximation-and-exact 8: 'Which form for modelling and which for inversion?'
- Reason: final exam copy of advanced module m04-approximation-and-exact 8 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Which form for modelling and which for inversion?
- Prompt after: Why is the two term form a weaker approximation now than when it was introduced?
- Explanation before: There is no reason to approximate when the inputs are known, and a noisy gather over a limited angle range cannot resolve three coefficients stably.
- Explanation after: The third term starts to matter around 25 to 30 degrees, which is exactly the range modern wide azimuth surveys record. The two term form was a good approximation for the offset ranges available when it was introduced.
- Option 0 before: Three for both.
- Option 0 after: Modern gathers are noisier at far offsets.
- Option 1 before: Two to model, three to invert.
- Option 1 after: Rocks in modern plays have larger contrasts.
- Option 2 before: Three terms to model, two to invert.
- Option 2 after: Modern surveys record the 25 to 30 degree range where the third term starts to matter.
- Option 3 before: Two for both.
- Option 3 after: Computers now evaluate Zoeppritz cheaply.

### rockphysics advanced final ord 30: fixed (duplicate)

- Flag: near p0.93 k0.78 duplicate of advanced module m04-approximation-and-exact 10: 'What is the gap between Shuey and exact at 30 degrees for the gas case?'
- Reason: final exam copy of advanced module m04-approximation-and-exact 10 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What is the gap between Shuey and exact at 30 degrees for the gas case?
- Prompt after: Why is the Ekene gas gap between Shuey and exact smaller at 40 degrees than at 20?
- Explanation before: That is why the capstone asks for the exact value at 30 degrees rather than the Shuey one.
- Explanation after: The gas gap grows to 30 degrees and then shrinks again, because the three term form happens to bend back toward the exact curve at wide angle for this contrast. That is luck rather than design, and the brine gap does the opposite.
- Option 0 before: Zero, Shuey being exact at 30 degrees.
- Option 0 after: The critical angle is approached and the errors cancel.
- Option 1 before: 0.000166, the same as at zero degrees.
- Option 1 after: The curvature term vanishes at wide angles.
- Option 2 before: 0.008625, the two term error at 40 degrees.
- Option 2 after: The gas contrast weakens with angle.
- Option 3 before: 0.0021746462042847164, 2.17 times the tolerance.
- Option 3 after: The three term form happens to bend back toward the exact curve, which is luck.

### rockphysics advanced final ord 31: fixed (duplicate)

- Flag: EXACT/samekey duplicate of advanced module m04-approximation-and-exact 11: 'Do Shuey and the exact solution agree at normal incidence?'
- Reason: final exam copy of advanced module m04-approximation-and-exact 11 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Do Shuey and the exact solution agree at normal incidence?
- Prompt after: What is the largest Shuey error on the Ekene brine curve, as a share of its intercept?
- Explanation before: The intercept is the linearised impedance contrast rather than the contrast itself. The gas gap also peaks near 30 degrees and shrinks again by 40.
- Explanation after: The largest brine error is 0.005972 against an intercept of 0.0343, which is 17.4 percent. The gas error of 0.002192 is 3.5 percent of its intercept. Quoting errors relative to the intercept is what makes the difference visible.
- Option 0 before: No. They differ by 0.000166 for the gas case.
- Option 0 after: 17.4 percent, a large systematic error.
- Option 1 before: Yes, exactly, since the angle terms vanish.
- Option 1 after: 3.5 percent, the same share as for the gas case.
- Option 2 before: Yes, to machine precision.
- Option 2 after: 0.5 percent.
- Option 3 before: No, and the gap grows monotonically with angle.
- Option 3 after: Under 1 percent, so negligible.

### rockphysics advanced final ord 32: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m04-approximation-and-exact 12: 'Which case does Shuey approximate worse at Ekene?'
- Reason: final exam copy of advanced module m04-approximation-and-exact 12 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Which case does Shuey approximate worse at Ekene?
- Prompt after: The square law predicts an Ekene Shuey error ratio of about 8 between the brine and gas cases. What is observed?
- Explanation before: Shuey's error depends on how different the two rocks are rather than how large the reflection is, and the brine sand differs from the shale by 16.7 percent in velocity against 5.9.
- Explanation after: Squaring the 16.7 and 5.9 percent velocity contrasts gives a ratio of about 8, while the observed maximum error ratio is 2.7. The direction is right and the size is over-estimated, so the size should be checked against the exact solution.
- Option 0 before: The gas case, at 0.005972 against 0.002192.
- Option 0 after: 8, confirming the square law to the last digit.
- Option 1 before: The brine case, 0.005972 against 0.002192.
- Option 1 after: 2.7, so the square law over-estimates.
- Option 2 before: Both equally.
- Option 2 after: 0.5, the gas case being worse.
- Option 3 before: The brine case, but only beyond 40 degrees.
- Option 3 after: 35, the third term's accuracy factor at 40 degrees.

### rockphysics advanced final ord 33: fixed (duplicate)

- Flag: EXACT/samekey duplicate of advanced module m04-approximation-and-exact 14: 'What cheap diagnostic predicts where Shuey will be weak?'
- Reason: final exam copy of advanced module m04-approximation-and-exact 14 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What cheap diagnostic predicts where Shuey will be weak?
- Prompt after: Which Ekene case should be modelled with the exact solution, or at least checked against it?
- Explanation before: At Ekene the curvature ratio is 2.6698 and the maximum error ratio 2.7246, agreeing to within 2 percent.
- Explanation after: The wet case is where the approximation is weakest, and it is also the baseline the anomaly is measured against, so an error in it propagates into the apparent difference between wet and gas before any data are involved.
- Option 0 before: The gradient, measuring the shear contrast.
- Option 0 after: The gas case, since it is the louder anomaly.
- Option 1 before: The intercept, measuring the impedance contrast.
- Option 1 after: Neither, since Shuey is within the tolerance.
- Option 2 before: The curvature coefficient, in one line.
- Option 2 after: The wet case, the baseline.
- Option 3 before: The critical angle, bounding the valid range.
- Option 3 after: Only a case beyond its critical angle.

### rockphysics advanced final ord 34: fixed (duplicate)

- Flag: EXACT/diffkey duplicate of advanced module m04-approximation-and-exact 15: 'What should be reported as a value and what as a coefficient?'
- Reason: final exam copy of advanced module m04-approximation-and-exact 15 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What should be reported as a value and what as a coefficient?
- Prompt after: Which item of the reflectivity report for a forward model is rarely included?
- Explanation before: The coefficients are the common currency between a model and an inversion. Quoting a Shuey evaluation as the reflection coefficient introduces an avoidable error.
- Explanation after: It is one number per case and it is cheap. At Ekene it would read 0.006 for the brine case and 0.002 for the gas case, and it stops a reader over-interpreting a small mismatch between a Shuey model and an exact one.
- Option 0 before: Both as Shuey.
- Option 0 after: The class for each case with its threshold.
- Option 1 before: Shuey values as values, exact results as coefficients.
- Option 1 after: The exact value at one or two angles.
- Option 2 before: Both as exact.
- Option 2 after: The intercept and the gradient for each case, as Shuey coefficients.
- Option 3 before: Exact as values, Shuey as coefficients.
- Option 3 after: The largest approximation error over the modelled range.

### rockphysics advanced final ord 36: fixed (duplicate)

- Flag: EXACT/samekey duplicate of advanced module m05-resolution 8: 'What happens to the tuning thickness if the reflection coefficients double?'
- Reason: final exam copy of advanced module m05-resolution 8 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What happens to the tuning thickness if the reflection coefficients double?
- Prompt after: Why does the engine's tuning thickness differ slightly from the Ricker theory value?
- Explanation before: Plus and minus 0.08 gives 16 ms and a peak of 0.1155947595834732; plus and minus 0.1 gives 16 ms and 0.1444934457540512. The ratio is 1.25, exactly 0.1 over 0.08.
- Explanation after: The engine evaluates the tuning curve on a 1 ms grid, so it reports an integer number of milliseconds, the theoretical value rounded up. At 25 Hz that is 16 ms against 15.593936024673521, a discretisation artefact rather than a disagreement with theory.
- Option 0 before: It doubles too.
- Option 0 after: It uses the Kallweit and Wood relation.
- Option 1 before: Nothing. Only the amplitude doubles.
- Option 1 after: It samples the curve on a 1 ms grid and rounds up.
- Option 2 before: It halves.
- Option 2 after: Its reflection pair is unequal.
- Option 3 before: It moves to the next grid sample.
- Option 3 after: The 0.1 pair broadens the wavelet.

### rockphysics advanced final ord 37: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m05-resolution 9: 'Which course established that tuning belongs to the wavelet?'
- Reason: final exam copy of advanced module m05-resolution 9 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Which course established that tuning belongs to the wavelet?
- Prompt after: Once the bed thickness is accounted for, what does the tuning amplitude still carry?
- Explanation before: It derived the law that a Ricker depends on frequency and thickness only through their product. This tier confirms it on a different fixture rather than re-deriving it.
- Explanation after: The tuning thickness is a property of the wavelet, while the tuning amplitude scales directly with the interface reflection coefficient. That separation is what makes a tuning correction possible at all.
- Option 0 before: The Rock Physics Associate tier.
- Option 0 after: Only the frequency content of the survey's own wavelet.
- Option 1 before: This tier, on the plus and minus 0.1 pair.
- Option 1 after: The bed thickness in metres, and nothing about the rocks.
- Option 2 before: The Seismolord Expert tier.
- Option 2 after: Rock information, scaling with the coefficient.
- Option 3 before: The Mapping Expert tier.
- Option 3 after: Only noise.

### rockphysics advanced final ord 38: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m05-resolution 10: 'What are the frequency and thickness products at Ekene?'
- Reason: final exam copy of advanced module m05-resolution 10 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What are the frequency and thickness products at Ekene?
- Prompt after: Using the product law, what tuning thickness does a 35 Hz survey give?
- Explanation before: The three at 400 share an identical peak and the 15 Hz case is higher, because 390 is nearer the ideal 389.8484.
- Explanation after: The peak occurs where f T is about 390, so T = 390/35 = 11.1 ms. No reflection coefficients, rocks or fluid are needed, which is why a tuning thickness belongs in a survey's specification. 19.5 ms is the 20 Hz answer.
- Option 0 before: They depend on the reflection coefficients too.
- Option 0 after: It cannot be predicted without the reflection coefficients.
- Option 1 before: 400 at every frequency.
- Option 1 after: 16 ms, as at 25 Hz.
- Option 2 before: 390 at every frequency.
- Option 2 after: About 19.5 ms.
- Option 3 before: 400 at 25, 40 and 50 Hz, and 390 at 15 Hz.
- Option 3 after: About 11.1 ms, from 390 divided by 35.

### rockphysics advanced final ord 39: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m05-resolution 11: 'What is the Ekene tuning thickness in metres?'
- Reason: final exam copy of advanced module m05-resolution 11 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What is the Ekene tuning thickness in metres?
- Prompt after: What is the tuning thickness at 30 Hz for a sand at 2900 m/s, in metres?
- Explanation before: $16 \times 2905.6972280296195/2000$, using two way time. Many producing sands are thinner than that.
- Explanation after: 389.8484/30 = 13.0 ms, and h = 13.0 x 2900/2000 = 18.8 m, using two way time. A sand thinner than about 19 m would be at or below tuning in that survey. 23.2 m is the Ekene figure at 25 Hz.
- Option 0 before: 23.2 m at 25 Hz.
- Option 0 after: About 18.8 m, from 13.0 ms two way.
- Option 1 before: 16 m at 25 Hz.
- Option 1 after: About 23.2 m.
- Option 2 before: 46.5 m at 25 Hz.
- Option 2 after: About 13.0 m.
- Option 3 before: 11.6 m at 25 Hz.
- Option 3 after: About 26 m.

### rockphysics advanced final ord 40: fixed (duplicate)

- Flag: EXACT/diffkey duplicate of advanced module m05-resolution 12: 'Why is an amplitude map not a fluid map?'
- Reason: final exam copy of advanced module m05-resolution 12 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why is an amplitude map not a fluid map?
- Prompt after: Why are amplitude maps usually accompanied by isochron maps?
- Explanation before: A prospect thinning from 40 m to 5 m would show a strong centre fading to nothing with identical rock throughout, and reading that as a fluid map implies a different volume and different wells.
- Explanation after: A reservoir passing through tuning thickness produces a bright rim or arc with nothing to do with fluid. Mapping the isochron shows whether the bright feature coincides with the contour where thickness equals tuning thickness.
- Option 0 before: It is recorded at one offset rather than stacked.
- Option 0 after: To remove residual moveout from the gathers.
- Option 1 before: It mixes the contrast with the thickness.
- Option 1 after: To catch tuning artefacts.
- Option 2 before: It has not been corrected for wavelet phase.
- Option 2 after: To correct amplitudes for the wavelet phase.
- Option 3 before: It measures the base rather than the top reflection.
- Option 3 after: To locate a flat spot at the fluid contact.

### rockphysics advanced final ord 41: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of advanced module m05-resolution 15: 'How does tuning affect the intercept and gradient differently?'
- Reason: final exam copy of advanced module m05-resolution 15 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: How does tuning affect the intercept and gradient differently?
- Prompt after: For a bed below the vertical tuning thickness, what does tuning do to the measured gradient?
- Explanation before: The path grows as $1/\cos\theta$, 1.155 at 30 degrees, so a bed at vertical tuning is 15 percent above tuning for a far ray. Since class is decided by the sign of the gradient, a thickness bias can change a class.
- Explanation after: Below tuning the far offsets see a thicker bed that is closer to tuning, so they are boosted more than the near offsets and the gradient steepens. Above tuning the effect reverses and the gradient flattens.
- Option 0 before: It affects the intercept only, being an amplitude effect.
- Option 0 after: It flattens it, the far offsets being boosted less.
- Option 1 before: It affects the gradient only, the intercept being at zero offset.
- Option 1 after: Nothing, since the gradient is an interface property.
- Option 2 before: A far offset ray travels further through the bed.
- Option 2 after: It steepens it.
- Option 3 before: It affects both identically, preserving their ratio.
- Option 3 after: It flips its sign in every case.

### rockphysics intermediate final ord 2: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m01-putting-the-fluid-in-the-rock 1: 'What single input changes between the Associate booking and this tier's?'
- Reason: final exam copy of intermediate module m01-putting-the-fluid-in-the-rock 1 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What single input changes between the Associate booking and this tier's?
- Prompt after: Why is a fluid substitution worth doing before a well is drilled?
- Explanation before: The conditions, the fluid properties and the mineral frame are all reused unchanged from the tier below. What is new is a logged rock to put them into.
- Explanation after: Knowing what the reservoir rock looks like wet, and predicting what it would look like charged, says what the seismic ought to show in each case, which can be checked against a survey before drilling.
- Option 0 before: The conditions at which the fluids are computed.
- Option 0 after: It measures the saturation of the undrilled prospect directly.
- Option 1 before: The ingredients go into a rock with porosity.
- Option 1 after: It predicts what seismic should show for each fluid.
- Option 2 before: The mineral mixing rule used for the frame.
- Option 2 after: It replaces the need for a shear log in every offset well.
- Option 3 before: The saturation at which the pore fluid is mixed.
- Option 3 after: It fixes the porosity.

### rockphysics intermediate final ord 6: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m02-the-dry-frame 2: 'How much of the Ekene saturated bulk modulus does the brine supply?'
- Reason: final exam copy of intermediate module m02-the-dry-frame 2 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: How much of the Ekene saturated bulk modulus does the brine supply?
- Prompt after: An inverse Gassmann result comes out above the saturated modulus. What does that mean?
- Explanation before: If the fluid contributed only a few percent there would be no such thing as a direct hydrocarbon indicator. It contributes nearly half, which is why fluid changes show up on seismic.
- Explanation after: Adding a fluid can only stiffen a rock in compression, so the saturated modulus must always exceed the dry one. A dry frame above the saturated value means the inputs are inconsistent and the answer is meaningless.
- Option 0 before: 4.8 percent, since fluids are soft.
- Option 0 after: The fluid is stiffer than the frame.
- Option 1 before: 80 percent, matching the Biot coefficient.
- Option 1 after: The rock is fluid sensitive, with Biot near 1.
- Option 2 before: 25 percent, matching the porosity.
- Option 2 after: The frame has been cemented since logging.
- Option 3 before: 44.8 percent, or 5.9697 GPa.
- Option 3 after: The inputs are inconsistent.

### rockphysics intermediate final ord 7: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m02-the-dry-frame 3: 'Why is the dry frame far softer than the mineral frame?'
- Reason: final exam copy of intermediate module m02-the-dry-frame 3 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why is the dry frame far softer than the mineral frame?
- Prompt after: How would a tight cemented limestone at 25 percent porosity compare with the Ekene sand?
- Explanation before: 7.350343061720982 against 30.87940062475596 GPa. Porosity removes material and the contacts, not the grain interiors, control the frame stiffness.
- Explanation after: Cement welds the grains, so the dry frame might be around 30 GPa against calcite near 71 GPa, giving a Biot coefficient of 0.577. The stiffer the frame relative to its mineral, the less a fluid substitution does.
- Option 0 before: Grains touch only at contacts, which carry the load.
- Option 0 after: Biot near 0.577, so a weaker fluid effect.
- Option 1 before: The dry frame is computed at reservoir pressure and the mineral frame at surface.
- Option 1 after: Biot near 0.80, so the same fluid effect as Ekene.
- Option 2 before: The Voigt Reuss Hill average is an upper bound rather than an estimate.
- Option 2 after: Biot near 0.95, so an even stronger fluid effect.
- Option 3 before: The dry frame still contains irreducible water.
- Option 3 after: No fluid effect.

### rockphysics intermediate final ord 8: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m02-the-dry-frame 4: 'What is the Ekene Biot coefficient and what does it say?'
- Reason: final exam copy of intermediate module m02-the-dry-frame 4 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What is the Ekene Biot coefficient and what does it say?
- Prompt after: In which rocks do direct hydrocarbon indicators work best?
- Explanation before: $1 - 7.350343061720982/37$. A value near 1 means most of the fluid's stiffness is transmitted, and a tight cemented rock at 0.4 would show a much weaker fluid effect.
- Explanation after: The stiffer the frame relative to its mineral, the less a fluid substitution does, so direct hydrocarbon indicators work well in soft young sandstones and poorly in tight cemented rocks. The Biot coefficient says which you have.
- Option 0 before: 0.20, since the frame is nearly as stiff as its mineral.
- Option 0 after: Tight cemented rocks, whose frames are stiff.
- Option 1 before: 0.80, so the frame is compliant and the rock is fluid sensitive.
- Option 1 after: Soft young sandstones, whose frames are compliant against their mineral.
- Option 2 before: 0.55, the ratio of dry to saturated modulus.
- Option 2 after: Carbonates, whose mineral modulus is high.
- Option 3 before: 0.25, equal to the porosity.
- Option 3 after: Any rock at 25 percent porosity.

### rockphysics intermediate final ord 9: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m02-the-dry-frame 6: 'Why can a fluid not change the shear modulus?'
- Reason: final exam copy of intermediate module m02-the-dry-frame 6 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why can a fluid not change the shear modulus?
- Prompt after: How does a rock behave at sonic log frequencies compared with Gassmann's prediction?
- Explanation before: The value is exactly zero rather than small, so $\mu_{sat} = \mu_{dry}$ is exact within Gassmann's assumptions rather than an approximation.
- Explanation after: Gassmann assumes loading slow enough for pore pressure to equilibrate. At a sonic log's 10 kHz the fluid cannot equilibrate between pores during a cycle, so the rock is stiffer than predicted and the shear modulus can move a little, usually upward.
- Option 0 before: Shear waves do not enter the pore space at all.
- Option 0 after: Softer, since the pore fluid escapes during a cycle.
- Option 1 before: Its shear modulus is small compared with the frame's.
- Option 1 after: Exactly as predicted, at any frequency.
- Option 2 before: A fluid at rest has no restoring force against a change of shape.
- Option 2 after: Stiffer, since the fluid cannot equilibrate, which is called dispersion.
- Option 3 before: Gassmann's relation neglects the fluid's shear stiffness.
- Option 3 after: Its shear modulus drops to zero.

### rockphysics intermediate final ord 11: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m03-substituting-the-fluid 9: 'How much Gassmann arithmetic does the substituted shear velocity need?'
- Reason: final exam copy of intermediate module m03-substituting-the-fluid 9 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: How much Gassmann arithmetic does the substituted shear velocity need?
- Prompt after: How large is the Ekene shear velocity rise compared with the compressional fall?
- Explanation before: The whole of Gassmann's relation is spent on the compressional velocity. The shear velocity follows from a quantity that did not change and a density that is bookkeeping.
- Explanation after: The shear velocity moves about 5 percent while the compressional velocity moves 9 percent. It is the sign of the shear change that carries the information, and the faster shear velocity is no evidence that gas stiffens the rock.
- Option 0 before: None at all.
- Option 0 after: About 5 percent against 9.
- Option 1 before: The forward relation only.
- Option 1 after: The same, 9 percent each, in opposite directions.
- Option 2 before: The inverse relation only.
- Option 2 after: Larger, 13.6 percent against 9 percent.
- Option 3 before: Both, since the shear modulus is recomputed.
- Option 3 after: About 1 percent against 17.7 percent.

### rockphysics intermediate final ord 12: fixed (duplicate)

- Flag: near p0.62 k1.00 duplicate of intermediate module m01-putting-the-fluid-in-the-rock 8: 'How is the substituted density computed?'
- Reason: final exam copy of intermediate module m01-putting-the-fluid-in-the-rock 8 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: How is the substituted density computed?
- Prompt after: Why is the density change the first thing to verify in someone else's substitution?
- Explanation before: $2250 + 0.25(172.66679461728904 - 1017.8249875) = 2038.7104517793223$. It involves none of Gassmann's assumptions, which is why it is the robust half of the answer.
- Explanation after: The density change is exact bookkeeping, so a 25 percent porosity sand losing brine for gas must lose about 211 kg/m3. If it has not, either the porosity or a fluid density is wrong.
- Option 0 before: From the forward Gassmann relation alongside the modulus.
- Option 0 after: It is the only step that uses Gassmann's relation.
- Option 1 before: $\rho + \phi(\rho_{fl}' - \rho_{fl})$, which is mass bookkeeping.
- Option 1 after: It is large and predictable, about 211 kg/m3 at 25 percent porosity.
- Option 2 before: By scaling the logged density by the fluid modulus ratio.
- Option 2 after: It carries no information about the porosity.
- Option 3 before: From the substituted velocities and the shear modulus.
- Option 3 after: It is graded to the tightest tolerance.

### rockphysics intermediate final ord 13: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m03-substituting-the-fluid 6: 'What does the grain density check test, and what does it give at Ekene?'
- Reason: final exam copy of intermediate module m03-substituting-the-fluid 6 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What does the grain density check test, and what does it give at Ekene?
- Prompt after: A sand logs 2300 kg/m3 at an assumed porosity of 0.30 with brine at 1020 kg/m3. What does the grain density check give?
- Explanation before: $(\rho - \phi\rho_{fl})/(1-\phi)$, consistent with a 70/30 quartz and clay mixture. The value 2629 is the Associate tier's mineral frame density, which is a different quantity.
- Explanation after: (2300 - 0.30 x 1020)/0.70 = 2848.6 kg/m3, which is high for a quartz rich sand. Either the porosity is too high, the density log reads high, or the lithology is not what the model assumes.
- Option 0 before: The fluid density, and it gives 1017.8 kg/m3.
- Option 0 after: 2660.7 kg/m3, consistent with a quartz and clay mix.
- Option 1 before: The mineral modulus, and it gives 2629 kg/m3.
- Option 1 after: 2467 kg/m3, which is below every clastic mineral.
- Option 2 before: The porosity, and it gives 2660.7 kg/m3.
- Option 2 after: 2848.6 kg/m3, high for a quartz rich sand.
- Option 3 before: The dry frame, and it gives 2250 kg/m3.
- Option 3 after: 2300 kg/m3.

### rockphysics intermediate final ord 14: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m03-substituting-the-fluid 7: 'A 2250 kg/m3 sand assumed at 0.15 porosity gives what grain density?'
- Reason: final exam copy of intermediate module m03-substituting-the-fluid 7 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: A 2250 kg/m3 sand assumed at 0.15 porosity gives what grain density?
- Prompt after: Why is a shear log without a density log not enough to get the moduli?
- Explanation before: The porosity is rejected on density grounds alone. That same porosity would give a dry frame of 1.36 GPa, and below 0.14 the calculation refuses outright.
- Explanation after: The shear modulus is the density times the shear velocity squared, and the bulk modulus needs the density times the compressional velocity squared less the shear term. Both conversions need the density.
- Option 0 before: 2661 kg/m3, unchanged from the 0.25 case.
- Option 0 after: The density fixes the porosity used in Gassmann's relation, which needs it first.
- Option 1 before: 2661 kg/m3, which is quartz to within logging accuracy.
- Option 1 after: Shear logs are unreliable in slow rocks.
- Option 2 before: 2849 kg/m3, high but possible.
- Option 2 after: Density sets the fluid modulus.
- Option 3 before: 2467 kg/m3, below every common clastic mineral.
- Option 3 after: Both conversions multiply the density by a squared velocity.

### rockphysics intermediate final ord 15: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m03-substituting-the-fluid 10: 'What is the Ekene impedance drop on gas substitution?'
- Reason: final exam copy of intermediate module m03-substituting-the-fluid 10 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What is the Ekene impedance drop on gas substitution?
- Prompt after: A sand shows a 10 percent impedance drop between two wells and no change in its velocity ratio. What is the most likely cause?
- Explanation before: Impedance is the product of the two, so a 9.2 percent velocity fall and a 9.4 percent density fall compound rather than add.
- Explanation after: A porosity increase lowers both velocities in similar proportion and lowers the density, so the impedance drops while the ratio barely moves. Gas would have moved the ratio substantially, by 13.6 percent for a full substitution at Ekene.
- Option 0 before: 17.72 percent, from 7.200e6 to 5.923875e6.
- Option 0 after: A porosity increase.
- Option 1 before: 9.2 percent, matching the velocity fall alone.
- Option 1 after: Gas, which lowers the impedance the most.
- Option 2 before: 9.4 percent, matching the density fall alone.
- Option 2 after: More clay in the sand, raising the ratio.
- Option 3 before: 13.6 percent, matching the velocity ratio fall.
- Option 3 after: Oil, which leaves the ratio alone.

### rockphysics intermediate final ord 16: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m03-substituting-the-fluid 11: 'Which contributes more to that drop?'
- Reason: final exam copy of intermediate module m03-substituting-the-fluid 11 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Which contributes more to that drop?
- Prompt after: What does more clay do to the velocity ratio?
- Explanation before: Velocity alone gives 6,537,819 and density alone 6,523,873, against 7,200,000. Half of a gas anomaly's impedance signature is bookkeeping about what the pores weigh.
- Explanation after: Clays have low shear stiffness, so more clay raises the velocity ratio. Gas lowers it sharply and porosity barely moves it, which is why impedance against velocity ratio separates fluid from lithology.
- Option 0 before: The velocity, by a factor of two.
- Option 0 after: Lowers it sharply, as gas does.
- Option 1 before: The density, marginally.
- Option 1 after: Raises it.
- Option 2 before: The velocity, marginally.
- Option 2 after: Leaves it unchanged, like porosity.
- Option 3 before: Neither. They are equal by construction.
- Option 3 after: Lowers it slightly.

### rockphysics intermediate final ord 17: fixed (duplicate)

- Flag: near p0.90 k1.00 duplicate of intermediate module m03-substituting-the-fluid 12: 'What happens to the Ekene velocity ratio on substitution?'
- Reason: final exam copy of intermediate module m03-substituting-the-fluid 12 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What happens to the Ekene velocity ratio on substitution?
- Prompt after: What does gas substitution do to the Ekene Poisson's ratio?
- Explanation before: The two velocities move in opposite directions so the ratio falls 13.6 percent, more than either velocity moved. The value 1.968 is the overlying shale's.
- Explanation after: Poisson's ratio is a one to one function of the velocity ratio, so it falls with it, from 0.268571 to 0.132671. The 13.6 percent fall is the velocity ratio's own. The Expert tier's AVO gradient is essentially a contrast in this quantity.
- Option 0 before: It is unchanged, since both velocities scale together.
- Option 0 after: It rises, since the shear velocity rises.
- Option 1 before: It rises, since the shear velocity rises.
- Option 1 after: It is unchanged, being a frame property.
- Option 2 before: It falls from 1.7777777777777777 to 1.5366125278606173.
- Option 2 after: It falls from 0.268571 to 0.132671, a factor of 2.02.
- Option 3 before: It falls from 1.968 to 1.778.
- Option 3 after: It falls by 13.6 percent.

### rockphysics intermediate final ord 18: fixed (duplicate)

- Flag: near p0.92 k0.82 duplicate of intermediate module m03-substituting-the-fluid 13: 'Why is the velocity ratio a better fluid discriminator than either velocity?'
- Reason: final exam copy of intermediate module m03-substituting-the-fluid 13 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why is the velocity ratio a better fluid discriminator than either velocity?
- Prompt after: Which mechanism raises the shear velocity while lowering the compressional one?
- Explanation before: A porosity increase lowers both velocities in proportion and barely moves the ratio, more clay raises it, and gas lowers it sharply. That is why the standard crossplot is impedance against ratio.
- Explanation after: Higher porosity, a shale and overpressure all lower both velocities. Only a lighter pore fluid with the frame intact raises the shear velocity while lowering the compressional one, which is why a simultaneous shear rise is such a specific signature.
- Option 0 before: It needs no density log to compute.
- Option 0 after: A porosity increase in the same rock.
- Option 1 before: It has a smaller measurement uncertainty.
- Option 1 after: More clay in the frame.
- Option 2 before: Both velocities come from the same tool, so the ratio cancels what they share.
- Option 2 after: Overpressure, which softens the grain contacts of the frame.
- Option 3 before: Porosity and lithology move it much less than gas does.
- Option 3 after: A drop in pore fluid density with the frame intact.

### rockphysics intermediate final ord 19: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m03-substituting-the-fluid 14: 'Where does an oil substitution land at Ekene?'
- Reason: final exam copy of intermediate module m03-substituting-the-fluid 14 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Where does an oil substitution land at Ekene?
- Prompt after: To a compressional velocity, what does an Ekene oil sand resemble?
- Explanation before: The drop from brine to oil is 191.62 m/s and the further drop to gas only 102.68, which is why oil and gas are the hard pair to distinguish.
- Explanation after: The oil case velocity is 3008.4 m/s, and a brine and gas mixture reaches that near a water saturation of 0.99, since one percent of gas already drops the velocity to 3078.9. That equivalence is why a bright spot can come from worthless residual gas.
- Option 0 before: 3008.378760376558 m/s, two thirds of the way.
- Option 0 after: A brine sand with one to two percent free gas.
- Option 1 before: 2905.6972280296195 m/s, the same as gas.
- Option 1 after: A full gas sand.
- Option 2 before: 3100 m/s, one third of the way to gas.
- Option 2 after: A dry frame with no fluid.
- Option 3 before: 3008.378760376558 m/s, one third of the way to gas.
- Option 3 after: A sand holding half brine and half gas throughout its pores.

### rockphysics intermediate final ord 20: fixed (duplicate)

- Flag: near p0.71 k0.86 duplicate of intermediate module m03-substituting-the-fluid 15: 'Why can an amplitude not separate oil from gas at Ekene?'
- Reason: final exam copy of intermediate module m03-substituting-the-fluid 15 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why can an amplitude not separate oil from gas at Ekene?
- Prompt after: Why is oil so much stiffer than gas at the Ekene conditions?
- Explanation before: A porosity range of plus or minus 0.05 moves the predicted velocity by over 300 m/s, three times the 103 m/s oil to gas separation. Either can still be separated from brine.
- Explanation after: Compressing a liquid means pushing molecules against their repulsive cores, while a gas at 25 MPa still has space between its molecules to remove. Dissolved gas softens a live oil, and neither fluid has any shear stiffness.
- Option 0 before: Oil and gas have the same density once substituted.
- Option 0 after: Oil carries a small shear stiffness that the gas lacks.
- Option 1 before: They differ by 10 percent in impedance, less than the porosity uncertainty.
- Option 1 after: A liquid's molecules are already close packed.
- Option 2 before: Gassmann returns the same saturated modulus for both, since both are hydrocarbons.
- Option 2 after: Dissolved gas stiffens the live oil.
- Option 3 before: Their bulk moduli are within one percent of each other.
- Option 3 after: Gas at 25 MPa has no bulk modulus.

### rockphysics intermediate final ord 21: fixed (duplicate)

- Flag: EXACT/diffkey duplicate of intermediate module m04-the-gas-effect 1: 'What does one percent of gas do to the Ekene velocity?'
- Reason: final exam copy of intermediate module m04-the-gas-effect 1 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What does one percent of gas do to the Ekene velocity?
- Prompt after: How much of the full Ekene impedance anomaly does one percent of gas produce?
- Explanation before: Five percent delivers 77.01 percent, and the full drop to the minimum is 369.72080941195463 m/s. That saturation is why amplitude cannot count gas.
- Explanation after: At Sw 0.99 the impedance is 6,920,944 against 7,200,000, a fall of 3.9 percent against 17.7 percent at full gas. That is roughly a fifth, rather than the third seen in velocity, because the density is linear in saturation and has barely moved.
- Option 0 before: Takes it to 3190 m/s, roughly one percent down.
- Option 0 after: A third, the same share it produces in velocity.
- Option 1 before: Takes it to 3078.87 m/s, which is a tenth of the available drop.
- Option 1 after: Nothing measurable.
- Option 2 before: Takes it to 3078.87 m/s, a third of the available drop.
- Option 2 after: About a fifth, a fall of 3.9 percent.
- Option 3 before: Nothing detectable, since it is below the noise.
- Option 3 after: All of it, 17.7 percent.

### rockphysics intermediate final ord 22: fixed (duplicate)

- Flag: EXACT/diffkey duplicate of intermediate module m04-the-gas-effect 2: 'Why does so little gas do so much?'
- Reason: final exam copy of intermediate module m04-the-gas-effect 2 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why does so little gas do so much?
- Prompt after: Why does gas beyond the first few percent change the velocity so little?
- Explanation before: $1/K_{mix} = S_w/K_{brine} + (1-S_w)/K_{gas}$ with gas 48 times more compliant, so one percent already supplies a third of the mixture's compliance.
- Explanation after: Once the fluid modulus is far below the frame's contribution, lowering it further changes almost nothing, since the fluid's contribution cannot go below zero. The density keeps falling linearly, which is what turns the velocity back up.
- Option 0 before: Gas displaces brine from the load bearing pores first.
- Option 0 after: The density stops falling past five percent gas.
- Option 1 before: Gassmann's relation is quadratic in the fluid modulus.
- Option 1 after: Wood's equation caps the mixture modulus at the brine value once gas enters.
- Option 2 before: One percent of gas already lowers the mixture density enough to slow the rock.
- Option 2 after: The frame softens to match the gas.
- Option 3 before: Wood's equation adds compliances, so the soft phase dominates.
- Option 3 after: The fluid's share of the stiffness is already near zero.

### rockphysics intermediate final ord 23: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m04-the-gas-effect 3: 'Where is the Ekene velocity minimum, and what is it?'
- Reason: final exam copy of intermediate module m04-the-gas-effect 3 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Where is the Ekene velocity minimum, and what is it?
- Prompt after: What moves the Ekene velocity minimum toward pure gas?
- Explanation before: The slowest rock holds 27 percent gas, and pure gas is 75.42 m/s faster. The curve is not monotonic in saturation.
- Explanation after: The position of the minimum depends on the frame stiffness, the porosity and the fluid contrast. A stiffer frame or a lower porosity moves it toward pure gas and a very soft frame moves it toward pure brine.
- Option 0 before: Sw 0.73 at 2830.2791905880454 m/s.
- Option 0 after: A stiffer frame or a lower porosity than Ekene's.
- Option 1 before: Sw 0.00 at 2905.6972280296195 m/s.
- Option 1 after: A softer frame.
- Option 2 before: Sw 0.50 at 2844.3861 m/s.
- Option 2 after: More brine in the pores.
- Option 3 before: Sw 0.95 at 2915.2644777573832 m/s.
- Option 3 after: A higher gas density.

### rockphysics intermediate final ord 24: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m04-the-gas-effect 4: 'Why does the velocity turn back up before pure gas?'
- Reason: final exam copy of intermediate module m04-the-gas-effect 4 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why does the velocity turn back up before pure gas?
- Prompt after: Why is the velocity minimum rarely noticed in real data?
- Explanation before: The numerator effect is complete within a few percent and the denominator effect is linear in gas fraction all the way, so with nothing left to soften the lightening wins.
- Explanation after: From Sw 0.73 to Sw 0.00 the velocity moves 75 m/s, which is 2.6 percent, and real data carry more scatter than that. The practical shape is a cliff followed by a nearly flat floor.
- Option 0 before: The dry frame stiffens as the last of the brine leaves the pore space.
- Option 0 after: It lies beyond the range of saturations any real reservoir can hold.
- Option 1 before: The density keeps falling after the fluid modulus has collapsed.
- Option 1 after: The rise beyond it is only 2.6 percent, within the scatter.
- Option 2 before: Wood's equation reverses above 50 percent gas.
- Option 2 after: The shear velocity masks it.
- Option 3 before: The shear modulus rises at high gas saturation.
- Option 3 after: It exists only at sonic frequencies.

### rockphysics intermediate final ord 25: fixed (duplicate)

- Flag: near p0.92 k0.67 duplicate of intermediate module m04-the-gas-effect 7: 'What separates five percent gas from a full gas column in velocity?'
- Reason: final exam copy of intermediate module m04-the-gas-effect 7 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What separates five percent gas from a full gas column in velocity?
- Prompt after: How do residual gas saturations of a few percent commonly arise in an undrilled trap?
- Explanation before: 2915.2644777573832 against 2905.6972280296195. In impedance the separation is better, at 9.26 percent, and still not measurable against the porosity uncertainty.
- Explanation after: They occur where a trap once held gas and leaked, where gas has come out of solution near a fault, and where a small charge arrived and stopped. None is worth drilling, and all look much like a full column on amplitude alone.
- Option 0 before: 75 m/s, the size of the turn.
- Option 0 after: Gas exsolving into the borehole while the well is logged.
- Option 1 before: 294 m/s, the full gas effect.
- Option 1 after: A gas cap thinner than the seismic wavelet above oil.
- Option 2 before: 9.6 m/s, or 0.33 percent.
- Option 2 after: Leakage, exsolution, or a small charge.
- Option 3 before: 185 m/s, half the full drop.
- Option 3 after: Gas released from the oil by production drawdown.

### rockphysics intermediate final ord 26: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m04-the-gas-effect 8: 'What is fizz gas and why does it matter?'
- Reason: final exam copy of intermediate module m04-the-gas-effect 8 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What is fizz gas and why does it matter?
- Prompt after: Which is the strongest statement the tier supports about a bright Ekene amplitude?
- Explanation before: Residual saturations of a few percent are common and none is worth drilling, yet all look much like a full column on amplitude alone. It is a standard cause of a dry hole on a bright spot.
- Explanation after: The modelled brine and gas cases give 7.200e6 and 5.924e6, so a full column should produce a 17.7 percent contrast. The amplitude does not discriminate saturation, and a porosity uncertainty of plus or minus 0.05 outweighs the oil to gas separation.
- Option 0 before: A saturation too low to show on an amplitude map but high enough to log.
- Option 0 after: The prospect holds gas rather than oil, since the amplitude is so bright.
- Option 1 before: Gas exsolving in the borehole during logging.
- Option 1 after: The gas saturation is above 50 percent.
- Option 2 before: A gas cap thinner than the seismic wavelet.
- Option 2 after: The porosity is 0.25.
- Option 3 before: A residual saturation producing nearly the full anomaly.
- Option 3 after: A full gas column should produce a 17.7 percent impedance contrast.

### rockphysics intermediate final ord 27: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m04-the-gas-effect 10: 'Which observation best distinguishes a column from residual gas?'
- Reason: final exam copy of intermediate module m04-the-gas-effect 10 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Which observation best distinguishes a column from residual gas?
- Prompt after: Which anomaly geometry points to a column rather than residual gas?
- Explanation before: Residual gas produces no contact reflection. Conformance to structure is good supporting evidence, and the other two are consistent with a few percent of gas.
- Explanation after: An amplitude conforming to structure, with its base at a consistent depth across the prospect, is evidence of a column. A patchy anomaly that ignores structure is not.
- Option 0 before: A flat spot, reflecting from the contact.
- Option 0 after: Conformance to structure.
- Option 1 before: A bright amplitude conforming to the closure.
- Option 1 after: A patchy anomaly that ignores the structure.
- Option 2 before: A strongly negative intercept at the near offsets.
- Option 2 after: A bright ring around a dimmer centre.
- Option 3 before: A low velocity ratio measured on the gather.
- Option 3 after: The brightest amplitude at the crest alone.

### rockphysics intermediate final ord 28: fixed (duplicate)

- Flag: near p0.60 k0.90 duplicate of intermediate module m05-when-there-is-no-shear-log 1: 'Why do many wells lack a shear log?'
- Reason: final exam copy of intermediate module m05-when-there-is-no-shear-log 1 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Why do many wells lack a shear log?
- Prompt after: Where a dipole tool was run, why can a shear log still be missing?
- Explanation before: A monopole tool needs the shear velocity to exceed the mud velocity, which fails in most shallow sands and nearly all shales. Dipole tools record it and are more recent.
- Explanation after: The interval may not have been logged, the data may be unusable from cycle skipping or a washed out hole, or the log may miss the specific bed. Recording shear only in fast formations is the limitation of monopole tools.
- Option 0 before: Shear is only logged when a study requires it.
- Option 0 after: Dipole tools record shear only in fast formations.
- Option 1 before: Monopole tools record no usable shear in slow formations.
- Option 1 after: Poor hole conditions, cycle skipping, or the wrong interval logged.
- Option 2 before: The shear arrival is discarded during processing.
- Option 2 after: The flexural mode never propagates in shales.
- Option 3 before: Shear cannot be measured in a fluid filled borehole.
- Option 3 after: Shear is discarded unless a study asks for it.

### rockphysics intermediate final ord 29: fixed (duplicate)

- Flag: near p0.80 k0.73 duplicate of intermediate module m05-when-there-is-no-shear-log 2: 'What can be computed with a compressional velocity and a density but no shear?'
- Reason: final exam copy of intermediate module m05-when-there-is-no-shear-log 2 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What can be computed with a compressional velocity and a density but no shear?
- Prompt after: Why does a missing shear log stop inverse Gassmann for the Ekene sand?
- Explanation before: One measured quantity and two unknown moduli, so they cannot be separated. An estimate of the shear velocity unlocks everything, which is why the module exists.
- Explanation after: With only the compressional velocity and density you have 23.04 GPa, which is K plus four thirds of the shear modulus, and not either of them. Without the shear modulus there is no saturated bulk modulus, so inverse Gassmann has nothing to work on.
- Option 0 before: The saturated bulk modulus, given the porosity.
- Option 0 after: Inverse Gassmann takes the shear velocity as a direct input.
- Option 1 before: The shear modulus, from an empirical relation only.
- Option 1 after: The density log cannot be trusted without shear.
- Option 2 before: Impedance, and the combination $K + \tfrac{4}{3}\mu$.
- Option 2 after: Without a shear modulus the saturated bulk modulus cannot be separated out.
- Option 3 before: Neither modulus, and not the impedance either.
- Option 3 after: The porosity is derived from the shear log.

### rockphysics intermediate final ord 31: fixed (duplicate)

- Flag: EXACT/diffkey duplicate of intermediate module m05-when-there-is-no-shear-log 7: 'What is the Greenberg-Castagna mixing rule?'
- Reason: final exam copy of intermediate module m05-when-there-is-no-shear-log 7 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What is the Greenberg-Castagna mixing rule?
- Prompt after: What mixing geometry does the harmonic mean represent in Greenberg-Castagna?
- Explanation before: At Ekene the arithmetic mean is 1522.136 and the harmonic 1520.2585531342977, giving the graded 1521.197276567149. It is the Voigt Reuss Hill idea applied to velocities.
- Explanation after: The arithmetic mean is the stiffest plausible mixture, the components acting in parallel, and the harmonic mean the softest, acting in series. Averaging the two splits the difference when the geometry is unknown, the same idea as Voigt Reuss Hill.
- Option 0 before: The mean of the arithmetic and harmonic means.
- Option 0 after: Components acting in series, the softest mixture.
- Option 1 before: The volume weighted arithmetic mean of the estimates.
- Option 1 after: Components acting in parallel, the stiffest possible mixture.
- Option 2 before: The harmonic mean weighted by volume fraction.
- Option 2 after: The dominant lithology on its own.
- Option 3 before: The estimate for the dominant lithology alone.
- Option 3 after: A random pack between the two bounds.

### rockphysics intermediate final ord 32: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m05-when-there-is-no-shear-log 9: 'How does the composite compare with the mudrock line at 3000 m/s?'
- Reason: final exam copy of intermediate module m05-when-there-is-no-shear-log 9 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: How does the composite compare with the mudrock line at 3000 m/s?
- Prompt after: What is ten percent of clay volume worth in the Greenberg-Castagna estimate at 3000 m/s?
- Explanation before: Choosing a lithology aware method matters about ten times more than getting the split exactly right, which is worth 11.6 m/s for a ten percent change in clay volume.
- Explanation after: A 60/40 split gives a composite near 1509.6 against 1521.20 for 70/30, about 11.6 m/s. Choosing a lithology aware method, worth 107 m/s, matters about ten times more than getting the split exactly right.
- Option 0 before: 213.68 m/s higher, or about 13 percent.
- Option 0 after: About 107 m/s, as large as the mudrock line gap.
- Option 1 before: 107.29727656714931 m/s higher, or about 7 percent.
- Option 1 after: About 11.6 m/s, moving it near 1509.6.
- Option 2 before: 11.6 m/s higher, the same as a lithology split error.
- Option 2 after: About 115 m/s, the full sand to shale difference.
- Option 3 before: Identical, since both are fitted to brine clastics.
- Option 3 after: About 1.88 m/s.

### rockphysics intermediate final ord 33: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m05-when-there-is-no-shear-log 10: 'What does Greenberg-Castagna predict at the Ekene sand's own logged velocity?'
- Reason: final exam copy of intermediate module m05-when-there-is-no-shear-log 10 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What does Greenberg-Castagna predict at the Ekene sand's own logged velocity?
- Prompt after: Used as a baseline, where do gas sands plot against the mudrock line?
- Explanation before: It is 120.05415453482057 m/s low, or 6.7 percent, because this sand sits at the stiff edge of the population the regression passes through.
- Explanation after: Plotting a measured shear log against the mudrock line shows departures from the clastic brine trend: carbonates and gas sands plot above it and very clay rich rocks plot below. That baseline use is its best one.
- Option 0 before: 1890.9758806113214 m/s, which is the shear velocity of the gas case.
- Option 0 after: Below it, along with very clay rich rocks.
- Option 1 before: 1800 m/s, matching the measurement.
- Option 1 after: On it, like any clastic.
- Option 2 before: 1679.9458454651794 m/s, under-predicting the measured 1800.
- Option 2 after: Above it, along with the carbonates.
- Option 3 before: 1556.6 m/s, the sandstone only curve at 3000 m/s.
- Option 3 after: Below it.

### rockphysics intermediate final ord 34: fixed (duplicate)

- Flag: near p0.69 k0.71 duplicate of intermediate module m05-when-there-is-no-shear-log 11: 'What does that test say about the graded estimate at 3000 m/s?'
- Reason: final exam copy of intermediate module m05-when-there-is-no-shear-log 11 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What does that test say about the graded estimate at 3000 m/s?
- Prompt after: Calibrating on the Ekene well, what is the corrected shear estimate at 3000 m/s?
- Explanation before: If the same 6.7 percent bias applies, the true value at 3000 m/s would be nearer 1630 m/s. Knowing whether you have a method output or a rock property is the point.
- Explanation after: The ratio of measured to estimated shear at the logged velocity is 1800 over 1679.95, and applying it to the 1521.20 m/s estimate gives 1629.906764680661 m/s. That rests on the lithology and cementation at 3000 m/s matching the calibration depth.
- Option 0 before: It is wrong and needs correcting before submission.
- Option 0 after: 1521.20 m/s, since calibration leaves the estimate unchanged.
- Option 1 before: It should be replaced by this well's own measured 1800 m/s.
- Option 1 after: 1413.90 m/s, the mudrock line value.
- Option 2 before: It is more reliable than the check itself, since 3000 m/s is nearer the fit centre.
- Option 2 after: 1800 m/s, the calibration well's own shear.
- Option 3 before: It is the method's correct output rather than the rock's shear velocity.
- Option 3 after: 1629.906764680661 m/s, from the calibration ratio.

### rockphysics intermediate final ord 35: fixed (duplicate)

- Flag: near p0.83 k0.75 duplicate of intermediate module m05-when-there-is-no-shear-log 14: 'In what order must shear estimation and substitution be done, and why?'
- Reason: final exam copy of intermediate module m05-when-there-is-no-shear-log 14 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: In what order must shear estimation and substitution be done, and why?
- Prompt after: A gas bearing pay with no shear log is to be modelled as brine. What breaks the deadlock?
- Explanation before: Applying Greenberg-Castagna to the Ekene gas case velocity gives 1446.343832922053 against a true 1890.98, out by 23.5 percent, because the rock no longer lies on the brine trend.
- Explanation after: The estimator cannot be applied to a gas bearing rock, and with no shear the substitution to brine cannot run. Breaking it needs an external input, such as an offset well's shear in the same rock at brine conditions, a frame model, or a shear log from elsewhere in the unit.
- Option 0 before: Estimate on the brine case first.
- Option 0 after: An external shear input.
- Option 1 before: Substitute first, since the estimate needs the final density.
- Option 1 after: Estimating shear from the gas sand's own compressional velocity.
- Option 2 before: Either, since the two are independent operations.
- Option 2 after: Substituting to brine first, then estimating shear.
- Option 3 before: Estimate, substitute, then re-estimate to converge.
- Option 3 after: Running the round trip to recover the shear.

### rockphysics intermediate final ord 36: fixed (duplicate)

- Flag: near p0.80 k0.75 duplicate of intermediate module m06-the-substitution-workflow 5: 'Which quality control check tests the whole chain at once?'
- Reason: final exam copy of intermediate module m06-the-substitution-workflow 5 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Which quality control check tests the whole chain at once?
- Prompt after: A substitution gives almost no velocity change in a rock with a Biot coefficient of 0.8. What does that indicate?
- Explanation before: It exercises both Gassmann directions, the density bookkeeping and both conversions, and at Ekene returns 3200.0000, 1800.0000 and 2250.0000 exactly.
- Explanation after: The Biot coefficient says whether the answer should be fluid sensitive at all. Near 1 the fluid matters greatly, so a near zero velocity change at 0.8 means an error, as would a huge change in a rock at 0.3.
- Option 0 before: The grain density from the log and porosity.
- Option 0 after: Correct behaviour, the Biot coefficient being irrelevant to velocity.
- Option 1 before: The round trip back to the original fluid.
- Option 1 after: An error, since that rock should be fluid sensitive.
- Option 2 before: The Biot coefficient from the two moduli.
- Option 2 after: A stiff frame, which is what a coefficient of 0.8 implies.
- Option 3 before: The four direction checks on the substitution.
- Option 3 after: A gas case, which always changes little.

### rockphysics intermediate final ord 37: fixed (duplicate)

- Flag: near p0.70 k0.71 duplicate of intermediate module m06-the-substitution-workflow 6: 'What does the round trip check fail to test?'
- Reason: final exam copy of intermediate module m06-the-substitution-workflow 6 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What does the round trip check fail to test?
- Prompt after: Why is the recovered dry frame not an independent measurement of the rock?
- Explanation before: It passes at every porosity, because it tests internal consistency rather than the truth of an assumption. The grain density check is the one that tests the porosity.
- Explanation after: The frame cannot be recovered without the porosity, so it inherits whatever porosity was assumed. That is why steps four and six of the workflow have a fixed order.
- Option 0 before: Whether the density bookkeeping is right.
- Option 0 after: It is computed from the shear log alone.
- Option 1 before: Whether the forward relation is implemented right.
- Option 1 after: It changes with each substituted fluid.
- Option 2 before: Whether the assumed porosity is right.
- Option 2 after: It inherits the assumed porosity.
- Option 3 before: Whether the conversion to moduli is right.
- Option 3 after: It is copied straight from the mineral frame.

### rockphysics intermediate final ord 38: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m06-the-substitution-workflow 8: 'Which two failures pass every check in this tier?'
- Reason: final exam copy of intermediate module m06-the-substitution-workflow 8 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: Which two failures pass every check in this tier?
- Prompt after: Why should the round trip check be automated rather than performed by hand?
- Explanation before: Both are established outside the substitution. The negative frame and the frame above the mineral modulus are exactly what the engine's guards catch.
- Explanation after: The round trip is the strongest check in the tier and also the one people skip, because the answer is known in advance. Automating it removes the temptation. Its result does not change with porosity, which is why it cannot test the porosity.
- Option 0 before: An uncalibrated shear estimate, and a transposed fluid pair.
- Option 0 after: It needs more numerical precision than any calculator can hold.
- Option 1 before: A wrong porosity, and a wrong mineral modulus.
- Option 1 after: Its result drifts with every change to the assumed porosity.
- Option 2 before: A negative dry frame, and a frame above the mineral modulus.
- Option 2 after: It is too slow by hand.
- Option 3 before: A wrong fluid state, and a violated Gassmann assumption.
- Option 3 after: Its answer is known in advance, so it gets skipped.

### rockphysics intermediate final ord 39: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m02-the-dry-frame 12: 'At which end of the porosity range does inverse Gassmann refuse for this rock?'
- Reason: final exam copy of intermediate module m02-the-dry-frame 12 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: At which end of the porosity range does inverse Gassmann refuse for this rock?
- Prompt after: If inverse Gassmann drives the dry frame negative, what is the likely input error?
- Explanation before: Explaining 13.32 GPa with almost no fluid needs a frame stiffer than the mineral. The frame rises with porosity and reaches only 12.0 GPa at 0.95, nowhere near 37.
- Explanation after: Too high an assumed porosity with a soft log can drive the computed frame negative. A frame above the mineral modulus points the other way, to a porosity that is too low, which is what fires the guard for the Ekene sand.
- Option 0 before: At low porosity, below about 0.14.
- Option 0 after: The porosity is too high.
- Option 1 before: At high porosity, above about 0.45.
- Option 1 after: The saturation control is set to 0.00.
- Option 2 before: At both ends, outside 0.15 to 0.40.
- Option 2 after: The wavelet frequency is set too high.
- Option 3 before: At neither, for any porosity between 0 and 1.
- Option 3 after: The assumed porosity is too low for the log.

### rockphysics intermediate final ord 42: fixed (duplicate)

- Flag: similarity pass (lead follow-up) duplicate of intermediate module m06-the-substitution-workflow 14: 'What does the Expert tier add, and which result of this tier feeds it most?'
- Reason: final exam copy of intermediate module m06-the-substitution-workflow 14 (module question kept); rewritten into a new question on a different point from the same lesson
- Correct option or prompt changed: duplicate rewritten into a new question, so the correct option is new text; answer_index unchanged
- Prompt before: What does the Expert tier add, and which result of this tier feeds it most?
- Prompt after: Across this course's tiers, where do the errors mostly live?
- Explanation before: The AVO gradient is dominated by the shear contrast, so an uncalibrated shear estimate can change the predicted class. The intercept is driven by the density instead.
- Explanation after: Each tier is a thin layer of new arithmetic on top of a thick stack of inherited assumptions. The conversion between velocities and moduli is exact in both directions.
- Option 0 before: A probabilistic treatment; the porosity range feeds the distribution.
- Option 0 after: In the new arithmetic each tier adds on top.
- Option 1 before: A property model across the field; the porosity feeds the volumes.
- Option 1 after: In the conversion between velocities and moduli.
- Option 2 before: A saturation height model; the density feeds the contacts.
- Option 2 after: In rounding.
- Option 3 before: A shale above the sand; the shear velocity feeds the gradient.
- Option 3 after: In the stack of inherited assumptions.

### rockphysics advanced final ord 15: judged fine (duplicate)

- Flag: similarity pass: pair with advanced module m02-intercept-and-gradient 13: 'What happens to the gradient with an uncalibrated shear estimate?'
- Reason: different scenario and answer: the uncalibrated 23.5 percent low estimate turning the gradient positive (class IV) against a 10 percent error that leaves it negative

### rockphysics advanced final ord 35: judged fine (duplicate)

- Flag: similarity pass: pair with advanced module m05-resolution 7: 'What is the Ekene tuning thickness and the amplitude there?'
- Reason: asks the capstone pair of tuning thickness and peak amplitude at 25 Hz; the module question lists thicknesses at four frequencies and never the peak value

### rockphysics intermediate final ord 3: judged fine (duplicate)

- Flag: similarity pass: pair with intermediate module m01-putting-the-fluid-in-the-rock 4: 'Compute the shear modulus of a rock at 2250 kg/m3 and 1800 m/s.'
- Reason: same calculation on different data (the Ekene point, 7.29 GPa, against a 2200 kg/m3, 1500 m/s rock, 4.95 GPa); a different answer

### rockphysics intermediate final ord 4: judged fine (duplicate)

- Flag: similarity pass: pair with intermediate module m01-putting-the-fluid-in-the-rock 15: 'How is the saturated bulk modulus obtained from a log?'
- Reason: asks for the formula; the module question applies it to a different rock and asks for the number

### rockphysics intermediate final ord 10: judged fine (duplicate)

- Flag: similarity pass: pair with intermediate module m03-substituting-the-fluid 8: 'What is the Ekene gas case shear velocity?'
- Reason: asks for the value 1890.98 m/s; the module question asks why the shear velocity rises

### rockphysics intermediate final ord 30: judged fine (duplicate)

- Flag: similarity pass: pair with intermediate module m05-when-there-is-no-shear-log 3: 'What does the Castagna mudrock line give at 3000 m/s?'
- Reason: asks for the mudrock value at 3000 m/s; the module question asks for the relation itself

### rockphysics intermediate final ord 40: judged fine (duplicate)

- Flag: similarity pass: pair with intermediate module m02-the-dry-frame 9: 'Rank these Ekene sensitivities from largest to smallest.'
- Reason: ranks three sensitivities together (porosity, oil to gas, mineral modulus); the module questions each give a single sweep

### rockphysics advanced module m03-the-class-flip ord 2: judged fine (duplicate)

- Flag: near p0.75 k0.83 pair with advanced module m03-the-class-flip 1: 'What is a class I AVO response?' / 'What is a class III AVO response?'
- Reason: parallel definitions of two different classes (I and III) with different correct answers; the similarity is the shared prompt template only

## rotating

Migration: `migrations/20261021b_b4_fix_rotating.sql`

### rotating intermediate module m06-the-professional-reading ord 7: fixed (duplicate)

- Flag: duplicate of beginner module m06-the-associate-reading 13 (near p0.65 k1.00): both ask for the three ways a duty point fails, same key
- Reason: True duplicate across tiers; kept the beginner m06 question and rewrote this copy to test the m06 onward point on a machine count against a stage count.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: The tier is built on the idea that a duty point which works on paper fails in three ways. What are they?
- Prompt after: A pump station's machine count and a compressor's stage count are both whole numbers. How does the onward lesson say they differ?
- Explanation before: The suction side, the affinity laws and the trim, and the fact that a catalogue curve is a water curve.
- Explanation after: Everything in this tier had a curve to work with, and the machine count was typed in. A compressor's stage count is discovered from two limits at once, the engine names which one governed, and the stages then chain into a train with a real cooling duty between them.
- Option 0 before: On suction, on power and on the fluid.
- Option 0 after: Neither is an input: both are solved from the duty flow.
- Option 1 before: On change, on the fluid and on the count of machines.
- Option 1 after: The stage count is an input the user types, and the machine count is solved from the system curve crossing.
- Option 2 before: On suction, on change and on the region the duty lands in.
- Option 2 after: Both are inputs, but the stage count is capped by the 300 degF default discharge limit before the train is run.
- Option 3 before: On suction, on change and on the fluid.
- Option 3 after: The machine count is an input, and the stage count is an answer out of two limits at once.

## scal

Migration: `migrations/20261021b_b4_fix_scal.sql`

### scal beginner final ord 23: fixed (duplicate)

- Flag: near duplicate of beginner m04-the-welge-tangent ord 3 (Ekene front saturation Swf; same key 0.6372)
- Reason: kept the module question; rewrote the final copy to test how far through the mobile window the front sits (m04 l03: 72 percent, the mark of a favorable displacement)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: What is the Ekene front saturation Swf?
- Prompt after: The mobile saturation window on the Ekene sand runs from 0.35 to 0.75. How far through it has the front saturation already come?
- Explanation before: The tangency lands at 0.6372. The 0.6807702744481854 figure is the AVERAGE saturation behind the front at breakthrough, which always exceeds the front value; 0.5964 is the front for the no 3.0 sensitivity case; 0.75 is the top of the mobile range.
- Explanation after: The front at 0.6372 has covered 0.2872 of the window's width of 0.40, about 72 percent. That is what a favorable displacement at a mobility ratio of 1.2 looks like: water builds a thick bank before it moves. 0.2872 is the size of the saturation jump itself, and 0.33077027444818546 is the pore volumes injected at breakthrough.
- Option 0 before: 0.6372
- Option 0 after: About 72 percent of it
- Option 1 before: 0.6807702744481854
- Option 1 after: About 33 percent
- Option 2 before: 0.5964
- Option 2 after: 0.2872, the jump
- Option 3 before: 0.75
- Option 3 after: About 64 percent of it, the front value read directly as a fraction of the window

### scal advanced final ord 22: fixed (duplicate)

- Flag: near duplicate of advanced m04-gravity-and-the-dip-term ord 3 (designed-case gravity coefficient; same key 0.019367108489507776)
- Reason: kept the module question; rewrote the final copy to test the gravity-stable warning threshold on the designed geometry (m04 l05: about 34 rb/d, where G reaches 1.1334444444444445 at the first sample)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: For the designed Ekene dip case (k 250 md, A 20000 ft2, qt 2000 rb/d, dip 10 degrees updip, gammaW 1.03, gammaO 0.8654434250764526), what gravity coefficient does makeFwFunction report?
- Prompt after: Lowering the rate on the designed dip geometry, at about what total rate does the gravity-stable warning first fire?
- Explanation before: At the designed rate the coefficient is 0.019367108489507776. The larger value belongs to the 500 rb/d case, the smaller to 8000 rb/d, and the negated value is the downdip case at the design rate; the coefficient scales as one over qt and flips sign with the dip.
- Explanation after: G scales as one over qt from 0.019367108489507776 at 2000 rb/d. The clamp must reach the first sample above connate, where kro is 0.8822664444662288, so the threshold is G of 1.1334444444444445, crossed near 34 rb/d. At 35 rb/d G is 1.1066919136861587, above 1 but under the threshold, and the warning stays silent; at 30 it fires.
- Option 0 before: 0.0774684339580311
- Option 0 after: About 50 rb/d, once G passes three quarters.
- Option 1 before: 0.004841777122376944
- Option 1 after: About 35 rb/d, the first rate on the ladder at which G has already climbed above 1.
- Option 2 before: -0.019367108489507776
- Option 2 after: Never, because kro stays below 0.9 above connate, so G times kro cannot reach 1 at any rate.
- Option 3 before: 0.019367108489507776
- Option 3 after: About 34 rb/d, when G reaches 1.1334444444444445 at the first sampled point.

## seismolord

Migration: `migrations/20261021b_b4_fix_seismolord.sql`

### seismolord beginner final ord 1: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 119 to 73 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: A depth to time relationship, so the precise well depths can be compared directly against the broad seismic reflections
- Option 1 after: A depth to time relationship that places well tops on seismic reflections

### seismolord beginner final ord 2: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 130 to 56 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 2 before: Essentially nothing, because seismic responds to contrasts in impedance at interfaces rather than to the value of impedance itself
- Option 2 after: Essentially nothing, as only impedance contrasts reflect

### seismolord beginner final ord 7: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 103 to 68 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 2 before: Wells are precise and recorded in depth, while seismic is vertically broad and recorded in two way time
- Option 2 after: Wells are precise and in depth; seismic is broad and in two way time

### seismolord beginner final ord 12: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 143 to 44 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 3 before: Because reflections are produced by contrasts in acoustic impedance, so the impedance log is exactly the input the reflection calculation needs
- Option 3 after: Because impedance contrasts make reflections

### seismolord beginner final ord 14: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 123 to 64 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: That the section holds real contrasts in rock properties, so a non trivial reflection coefficient series should be expected
- Option 1 after: That real contrasts exist, so non zero coefficients are expected

### seismolord beginner final ord 16: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 100 to 64 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 3 before: Because TWT = 2z / 2000 s means two way time in milliseconds is numerically equal to depth in metres
- Option 3 after: Because two way time in milliseconds then equals depth in metres

### seismolord beginner final ord 20: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 94 to 61 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 3 before: Because the seismic data the synthetic has to be compared against lives on a two way time axis
- Option 3 after: Because the seismic it is compared with lives in two way time

### seismolord beginner final ord 21: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 98 to 57 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: The log occupies 1500 ms to 1650 ms, so it sits inside the grid with empty time above and below it
- Option 0 after: The log occupies 1500 ms to 1650 ms, well inside the grid

### seismolord beginner final ord 25: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 120 to 80 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: The layer below has lower acoustic impedance than the layer above, so the reflected pulse returns with reversed polarity
- Option 0 after: The layer below has lower impedance, so the pulse returns with reversed polarity

### seismolord beginner final ord 27: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 143 to 86 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 2 before: It is the peak of a run of similar negative coefficients, so the impedance drop is spread over several samples rather than being one sharp step
- Option 2 after: A run of similar negative values, so the impedance drop is spread over several samples

### seismolord beginner final ord 28: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 70 to 38 chars, same meaning; B4-padded distractor(s) 0,1 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: RC = +1, and the synthetic shows a full amplitude peak, as it would at a perfect mirror
- Option 0 after: RC = +1, and the synthetic shows a full amplitude peak
- Option 1 before: RC = -1, and the synthetic shows a full amplitude trough, because the wave comes back inverted
- Option 1 after: RC = -1, and the synthetic shows a full amplitude trough
- Option 3 before: RC = 0, and that interface contributes nothing at all to the synthetic
- Option 3 after: RC = 0, and the interface adds nothing

### seismolord beginner final ord 29: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 119 to 69 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: The shape of the pulse the seismic source sends into the ground, a scaled copy of which comes back from every reflector
- Option 0 after: The source pulse, a scaled copy of which returns from every reflector

### seismolord beginner final ord 32: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 128 to 54 chars, same meaning; B4-padded distractor(s) 1,2 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Taking the difference between neighbouring reflection coefficients, so that the synthetic trace becomes the time derivative of the reflectivity series
- Option 1 after: Taking the difference between neighbouring reflection coefficients
- Option 2 before: Stretching one wavelet so that it spans the whole logged interval, then scaling that single stretched wavelet by the average reflection coefficient
- Option 2 after: Stretching one wavelet so that it spans the whole logged interval
- Option 3 before: Placing a copy of the wavelet at every reflection coefficient, scaling each copy by that coefficient, and summing all the copies
- Option 3 after: Scaling a wavelet copy by each coefficient and summing

### seismolord beginner final ord 33: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 189 to 73 chars, same meaning; B4-padded distractor(s) 1,2,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Because the long 15 Hz wavelet reaches across several closely spaced coefficients of the same sign and sums them constructively, while the shorter high frequency wavelet keeps them separate
- Option 0 after: Because the long 15 Hz wavelet sums several nearby same sign coefficients
- Option 1 before: Because a low frequency Ricker wavelet has a larger peak value than a high frequency one, so every event on the low frequency synthetic is scaled up before any summing takes place along the trace
- Option 1 after: Because a low frequency Ricker wavelet has a larger peak value than a high frequency one
- Option 2 before: Because the reflection coefficients themselves become larger when the frequency is lowered, since the impedance contrasts are averaged over a longer window and the averaged interfaces then reflect more strongly
- Option 2 after: Because the reflection coefficients themselves become larger when the frequency is lowered
- Option 3 before: Because 15 Hz shifts every reflector to a shallower two way time, where the overburden is thinner and the impedance contrasts between the shallower layers on this well are much sharper than they are deeper down
- Option 3 after: Because 15 Hz shifts every reflector to a shallower two way time

### seismolord beginner final ord 34: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 134 to 74 chars, same meaning; B4-padded distractor(s) 0,2,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Two clearly separated events, each at its own correct time, because the convolution keeps every reflection coefficient on its own sample of the time grid
- Option 0 after: Two clearly separated events, each at its own correct time
- Option 1 before: The two wavelet copies overlap and interfere, giving one composite event whose amplitude and timing match neither interface on its own
- Option 1 after: The copies overlap into one composite event that matches neither interface
- Option 2 before: The shallower of the two interfaces is dropped from the calculation, since the engine keeps only one coefficient per wavelet length and retains the deeper one
- Option 2 after: The shallower of the two interfaces is dropped from the calculation
- Option 3 before: An amplitude equal to the sum of the two impedances, because the synthetic adds the rock properties on either side of each interface into a single composite value
- Option 3 after: An amplitude equal to the sum of the two impedances

### seismolord beginner final ord 35: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 130 to 65 chars, same meaning; B4-padded distractor(s) 0,1,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Resolution falls but amplitudes rise, because the shorter wavelet blurs neighbouring reflectors together while its sharper peak carries more energy into every event
- Option 0 after: Resolution falls but amplitudes rise
- Option 1 before: Both resolution and amplitude rise together, since a higher frequency wavelet is both shorter in time and brighter at its peak, so every event gains on both counts
- Option 1 after: Both resolution and amplitude rise together
- Option 2 before: Resolution improves, because the shorter wavelet separates closely spaced reflectors, but each event carries less summed amplitude
- Option 2 after: Resolution improves, but each event carries less summed amplitude
- Option 3 before: Nothing changes, because the reflection coefficients are the same either way and the synthetic is fully determined by the reflectivity series whatever the wavelet
- Option 3 after: Nothing changes, because the reflection coefficients are the same either way

### seismolord beginner final ord 36: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 220 to 99 chars, same meaning; B4-padded distractor(s) 0,1,2 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Mean gamma ray over the logged interval, mean neutron porosity over the same interval, mean bulk density from the RHOB curve, mean sonic transit time from the DT curve, the count of finite samples used, and the depth step of the log
- Option 0 after: Mean gamma ray, mean neutron porosity, mean density, mean sonic, sample count and log step
- Option 1 before: Wavelet frequency in hertz, wavelet length in milliseconds, the side lobe value of the Ricker, its central peak value, the sample rate of the time grid and the total grid length, all read from the wavelet and time grid settings
- Option 1 after: Wavelet frequency, wavelet length, side lobe value, peak value, sample rate and grid length
- Option 2 before: Mean velocity over the interval, mean density over the interval, mean acoustic impedance, the mean reflection coefficient across all interfaces, the mean synthetic amplitude along the trace and the count of finite samples behind them
- Option 2 after: Mean velocity, mean density, mean impedance, mean reflection coefficient, mean amplitude and sample count
- Option 3 before: Mean sonic velocity, two way time at the log top, maximum impedance, the strongest reflection coefficient by absolute value, the two way time of that coefficient, and the two way time of the strongest synthetic amplitude
- Option 3 after: Mean sonic velocity, log top TWT, maximum impedance, strongest RC, its TWT, strongest amplitude TWT

### seismolord beginner final ord 39: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: B4-padded distractor(s) 3 returned to pre-B4 wording; key and explanation unchanged
- Option 3 before: They should be used to mark the top and the base of the logged interval when the depth range is set
- Option 3 after: They should be used to mark the top and the base of the logged interval

### seismolord beginner final ord 40: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 214 to 64 chars, same meaning; B4-padded distractor(s) 0,1,2 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: The synthetic was accidentally shifted by 60 ms during the depth to time conversion, so every event on the trace now sits later than the interface that produced it and a bulk shift of the same size would simply realign them all
- Option 0 after: The synthetic was accidentally shifted by 60 ms during the depth to time conversion
- Option 1 before: The reflection coefficient at 1642 ms must be larger than the one at 1582 ms, since the strongest amplitude on a synthetic always sits on the strongest single interface and the reported coefficient ranking has to be wrong
- Option 1 after: The reflection coefficient at 1642 ms must be larger than the one at 1582 ms
- Option 2 before: One of the two numbers is a reporting error, which the capstone tolerance absorbs, because a synthetic amplitude cannot peak anywhere except at the time of the largest reflection coefficient that drives it on the synthetic trace
- Option 2 after: One of the two numbers is a reporting error, which the capstone tolerance absorbs
- Option 3 before: The synthetic amplitude at any time is the sum of wavelet copies from every nearby reflector, so a cluster of moderate coefficients near 1642 ms can add up to more than the single strongest coefficient near 1582 ms
- Option 3 after: Coefficients near 1642 ms add up to more than the one at 1582 ms

### seismolord beginner final ord 41: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 122 to 77 chars, same meaning; B4-padded distractor(s) 1 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: That a tie can be systematically early or late, so the shift has to be measured and applied rather than assumed to be zero
- Option 0 after: That a tie can be systematically early or late, so its shift must be measured
- Option 1 before: That the wavelet frequency must always be raised to 40 Hz before tying, because a sharper wavelet removes the lag and lets the events line up by eye
- Option 1 after: That the wavelet frequency must always be raised to 40 Hz before tying

### seismolord beginner final ord 42: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 133 to 90 chars, same meaning; B4-padded distractor(s) 2 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Module quizzes at 75 percent with a 24 hour cooldown after three failed attempts, the final exam at 70 percent, and the capstone last
- Option 1 after: Quizzes at 75 percent, 24 hour cooldown after three fails, final 70 percent, capstone last
- Option 2 before: Module quizzes at 75 percent with no cooldown, the final exam at 75 percent, and the capstone first, so the graded numbers are read before any module quiz is attempted
- Option 2 after: Module quizzes at 75 percent with no cooldown, the final exam at 75 percent, and the capstone first

### seismolord beginner module m01-seismic-and-the-well-tie ord 3: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 96 to 56 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: A seismic trace is approximately the earth's reflectivity series convolved with a source wavelet
- Option 0 after: A seismic trace is reflectivity convolved with a wavelet

### seismolord beginner module m01-seismic-and-the-well-tie ord 13: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 99 to 78 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Several moderate coefficients near 1642 ms interfere constructively once convolved with the wavelet
- Option 1 after: Several moderate coefficients near 1642 ms interfere constructively in the sum

### seismolord beginner module m01-seismic-and-the-well-tie ord 15: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 89 to 68 chars, same meaning; B4-padded distractor(s) 0,2,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Seismic amplitudes are always too weak to pick without a well to boost them into a usable event
- Option 0 after: Seismic amplitudes are always too weak to pick without a well to boost them
- Option 1 before: Only the tie establishes which seismic reflection corresponds to which geological surface
- Option 1 after: Only the tie shows which reflection carries which geological surface
- Option 2 before: Seismic surveys record depth directly, so the tie merely confirms the depths already on the section
- Option 2 after: Seismic surveys record depth directly, so the tie merely confirms the depths
- Option 3 before: Horizon mapping is done in the well domain, so seismic contributes nothing to it between the wells
- Option 3 after: Horizon mapping is done in the well domain, so seismic contributes nothing to it

### seismolord beginner module m02-velocity-and-impedance ord 1: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 96 to 34 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Interval transit time, or slowness, the time a wave takes to cross a fixed distance of formation
- Option 1 after: Interval transit time, or slowness

### seismolord beginner module m02-velocity-and-impedance ord 7: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 120 to 52 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: The curve must be converted, because feeding a foot-based DT into the metre formula yields a velocity in the wrong units
- Option 1 after: It must be converted to microseconds per metre first

### seismolord beginner module m02-velocity-and-impedance ord 10: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 133 to 55 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Because reflections respond to impedance, which is the product of the two, so a velocity increase can be offset by a density decrease
- Option 1 after: Because reflections respond to their product, impedance

### seismolord beginner module m02-velocity-and-impedance ord 11: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: B4-padded distractor(s) 0,1 returned to pre-B4 wording; key and explanation unchanged
- Option 0 before: The difference between velocity and density at each sample
- Option 0 after: The difference between velocity and density
- Option 1 before: The ratio of velocity to density, measured in the rock matrix
- Option 1 after: The ratio of velocity to density

### seismolord beginner module m03-depth-to-time ord 2: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 116 to 88 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Because converting to depth needs a velocity model, which is one of the things interpretation is supposed to produce
- Option 1 after: Because converting to depth needs a velocity model, which interpretation itself produces

### seismolord beginner module m03-depth-to-time ord 3: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 111 to 75 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 2 before: Depth to time is straightforward given a velocity model, while time to depth inherits every error in that model
- Option 2 after: Depth to time is straightforward, while time to depth inherits model errors

### seismolord beginner module m03-depth-to-time ord 5: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 103 to 71 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 3 before: Because the source and receiver are on the same side of the target, so the energy travels down and back
- Option 3 after: Because the energy travels down to the reflector and then back up again

### seismolord beginner module m03-depth-to-time ord 7: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 87 to 63 chars, same meaning; B4-padded distractor(s) 1,3 returned to pre-B4 wording; distractor(s) 2 trimmed to clear the correct option's length; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Halving the two-way time and multiplying by velocity returns the depth you started with
- Option 0 after: Half the two-way time times velocity gives back the start depth
- Option 1 before: The two-way time in milliseconds is always larger than the depth in metres on the teaching well at every depth
- Option 1 after: The two-way time in milliseconds is always larger than the depth in metres
- Option 2 before: The computed depth falls somewhere inside the 0 to 1798 ms grid
- Option 2 after: The computed depth falls inside the 0 to 1798 ms grid
- Option 3 before: Multiplying the full two-way time by velocity returns the depth you started with at the well
- Option 3 after: Multiplying the two-way time by velocity returns the depth you started with

### seismolord beginner module m03-depth-to-time ord 11: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 143 to 72 chars, same meaning; B4-padded distractor(s) 1,2 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: The 2000 m/s places the log on the time axis, while the 3145.29 m/s is measured rock velocity that builds impedance and reflection coefficients
- Option 0 after: The 2000 m/s positions the log in time; the 3145.29 m/s builds impedance
- Option 1 before: The 2000 m/s is the measured rock velocity, and the 3145.29 m/s is the assumed overburden average used only to hang the log on the time axis at the well
- Option 1 after: The 2000 m/s is the measured rock velocity, and the 3145.29 m/s is the assumed overburden average
- Option 2 before: They are two estimates of the same quantity, and the more precise one should be preferred, which makes the measured sonic average the one to carry through both the time axis and the impedance
- Option 2 after: They are two estimates of the same quantity, and the more precise one should be preferred

### seismolord beginner module m03-depth-to-time ord 12: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 103 to 64 chars, same meaning; B4-padded distractor(s) 0,1 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: By assuming the seismic sample interval matches the log sample interval, so each log sample can be assigned the time of its matching seismic sample
- Option 0 after: By assuming the seismic sample interval matches the log sample interval
- Option 1 before: By reading the two-way time straight off the seismic display at the well location, where the strongest event is taken as the target top
- Option 1 after: By reading the two-way time straight off the seismic display at the well location
- Option 3 before: By a checkshot survey or a vertical seismic profile, with the sonic log then drift corrected against it
- Option 3 after: By a checkshot or VSP, with the sonic drift corrected against it

### seismolord beginner module m03-depth-to-time ord 14: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 99 to 51 chars, same meaning; B4-padded distractor(s) 0,2 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Because the sonic log is recorded at exactly 2 ms intervals in the borehole, so the synthetic has to inherit that step
- Option 0 after: Because the sonic log is recorded at exactly 2 ms intervals in the borehole
- Option 1 before: Because discrete convolution requires a constant spacing, and real seismic is recorded that way too
- Option 1 after: Because discrete convolution needs constant spacing
- Option 2 before: Because uneven spacing would make the well tops land at odd millisecond values that the display cannot label
- Option 2 after: Because uneven spacing would make the well tops land at odd millisecond values

### seismolord beginner module m04-reflection-coefficients ord 12: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 97 to 63 chars, same meaning; B4-padded distractor(s) 0,2,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Because positive coefficients paint as peaks only above about 0.1 in magnitude, with weaker ones shown as troughs
- Option 0 after: Because positive coefficients paint as peaks only above about 0.1 in magnitude
- Option 1 before: Because recording, processing and display polarity conventions differ between surveys and regions
- Option 1 after: Because polarity conventions differ between surveys and regions
- Option 2 before: Because the sign of the coefficient changes with the depth of the interface as the overburden compacts it
- Option 2 after: Because the sign of the coefficient changes with the depth of the interface
- Option 3 before: Because peaks and troughs are assigned at random by interpretation software each time a section is loaded
- Option 3 after: Because peaks and troughs are assigned at random by interpretation software

### seismolord beginner module m04-reflection-coefficients ord 13: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 69 to 63 chars, same meaning; B4-padded distractor(s) 1 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: At 1582 ms, which is 1582 m under the teaching time to depth function
- Option 0 after: At 1582 ms, which is 1582 m on the teaching time-depth function
- Option 1 before: At 1580 ms, which is 1580 m under the teaching time to depth function on this well
- Option 1 after: At 1580 ms, which is 1580 m under the teaching time to depth function

### seismolord beginner module m04-reflection-coefficients ord 14: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 92 to 60 chars, same meaning; B4-padded distractor(s) 0 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: The peak is a noise spike, because five consecutive samples share the same sign and a real event would change sign
- Option 0 after: The peak is a noise spike, because five consecutive samples share the same sign
- Option 2 before: The peak is a genuine event, because the values rise and fall smoothly around a single crest
- Option 2 after: A genuine event, rising and falling smoothly about one crest

### seismolord beginner module m04-reflection-coefficients ord 15: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 77 to 47 chars, same meaning; B4-padded distractor(s) 0 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Zero, so the trace stays continuous through the missing interval and the convolution can run unbroken
- Option 0 after: Zero, so the trace stays continuous through the missing interval
- Option 1 before: A no-data value, because zero would falsely claim that nothing reflects there
- Option 1 after: A no-data value, since zero means no reflection

### seismolord beginner module m05-wavelets-and-convolution ord 1: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 109 to 71 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 2 before: The short band limited oscillating pulse the source emits, a scaled copy of which appears at every reflection
- Option 2 after: The short pulse the source emits, copied and scaled at every reflection

### seismolord beginner module m05-wavelets-and-convolution ord 6: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 158 to 57 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 3 before: Sampling: the continuous minimum is minus 0.4463 at any frequency, and the 2 ms grid happens to land almost on it at 15 Hz but between samples at 25 and 40 Hz
- Option 3 after: Sampling: the 2 ms grid lands nearer the minimum at 15 Hz

### seismolord beginner module m05-wavelets-and-convolution ord 7: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 109 to 62 chars, same meaning; B4-padded distractor(s) 0 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: It guarantees the synthetic and the seismic have the same amplitude scale, so the two traces can be compared without any normalisation
- Option 0 after: It guarantees the synthetic and the seismic have the same amplitude scale
- Option 1 before: The wavelet is symmetric with its peak at the centre, so the event sits on the boundary rather than beside it
- Option 1 after: The peak sits at the centre, so the event sits on the boundary

### seismolord beginner module m05-wavelets-and-convolution ord 8: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 129 to 48 chars, same meaning; B4-padded distractor(s) 1,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Replace each wavelet sample with the nearest reflection coefficient, so the wavelet shape is resampled onto the reflectivity time grid before it is displayed
- Option 1 after: Replace each wavelet sample with the nearest reflection coefficient
- Option 2 before: Place a copy of the wavelet at every reflection coefficient, scaled by that coefficient, then add all the copies sample by sample
- Option 2 after: Add up wavelet copies scaled by each coefficient
- Option 3 before: Average the reflectivity series over a window as long as the wavelet, which smooths the coefficients into a band limited trace at the seismic frequency
- Option 3 after: Average the reflectivity series over a window as long as the wavelet

### seismolord beginner module m05-wavelets-and-convolution ord 9: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 68 to 39 chars, same meaning; B4-padded distractor(s) 1 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: A trough of about minus 0.02 with positive side lobes on either side
- Option 0 after: A trough of about minus 0.02 at 1600 ms
- Option 1 before: A peak of about plus 0.02 with negative side lobes on either side, as for any Ricker
- Option 1 after: A peak of about plus 0.02 with negative side lobes on either side

### seismolord beginner module m05-wavelets-and-convolution ord 10: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 113 to 51 chars, same meaning; B4-padded distractor(s) 2 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Higher frequency gives a shorter wavelet and finer resolution, lower frequency gives a longer wavelet that smears
- Option 1 after: Higher frequency: shorter wavelet, finer resolution
- Option 2 before: Frequency changes the amplitude of the wavelet but not its length, so resolution stays the same whichever frequency is chosen
- Option 2 after: Frequency changes the amplitude of the wavelet but not its length

### seismolord beginner module m05-wavelets-and-convolution ord 11: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 121 to 86 chars, same meaning; B4-padded distractor(s) 3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: The lowest frequency gives the largest peak, because its longer wavelet sums more neighbouring reflections constructively
- Option 0 after: The lowest frequency gives the largest peak, as its long wavelet sums more reflections
- Option 3 before: The 15 Hz result must be a processing error, since higher frequency should always be brighter for the same underlying reflectivity series
- Option 3 after: The 15 Hz result must be a processing error, since higher frequency should always be brighter

### seismolord beginner module m05-wavelets-and-convolution ord 12: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 153 to 70 chars, same meaning; B4-padded distractor(s) 0,1,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: The time to depth function is 60 ms out and the synthetic needs a bulk shift, after which the strongest amplitude would land back on the strongest coefficient where it belongs
- Option 0 after: The time to depth function is 60 ms out and the synthetic needs a bulk shift
- Option 1 before: The strongest coefficient was excluded from the convolution because it is negative, and the engine only convolves positive coefficients, so its wavelet copy never reaches the trace
- Option 1 after: The strongest coefficient was excluded from the convolution because it is negative
- Option 2 before: A cluster of moderate coefficients near 1642 ms reinforces constructively and sums to more than the isolated larger coefficient at 1582 ms produces alone
- Option 2 after: Moderate coefficients near 1642 ms sum to more than the one at 1582 ms
- Option 3 before: The wavelet peak is offset from its centre by 60 ms, so every event on the synthetic appears later than the interface that produced it and the brightest one inherits that delay
- Option 3 after: The wavelet peak is offset from its centre by 60 ms

### seismolord beginner module m05-wavelets-and-convolution ord 13: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 164 to 90 chars, same meaning; B4-padded distractor(s) 0,1,2 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Because the wavelet delays every event by half its length, so the brightest point of the synthetic always lands later than the coefficient that caused it by that same fixed amount
- Option 0 after: Because the wavelet delays every event by half its length
- Option 1 before: Because reflection coefficients are computed in depth and amplitudes in time, so the two maxima are reported on different axes and only agree once the depth scale is converted
- Option 1 after: Because reflection coefficients are computed in depth and amplitudes in time
- Option 2 before: Because negative coefficients are plotted at the following sample, which pushes the brightest amplitude one step later than the coefficient whenever the strongest reflection is negative
- Option 2 after: Because negative coefficients are plotted at the following sample
- Option 3 before: Because each amplitude sample is a sum of overlapping wavelet copies, so a reinforcing group of moderate coefficients can outproduce one larger isolated coefficient
- Option 3 after: Because overlapping copies from a group of moderate coefficients can outsum one larger one

### seismolord beginner module m05-wavelets-and-convolution ord 14: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 122 to 45 chars, same meaning; B4-padded distractor(s) 1 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Only the 15 Hz result is trustworthy, because its peak matches a real interface, so the higher frequency run should be discarded before any tie is attempted
- Option 1 after: Only the 15 Hz result is trustworthy, because its peak matches a real interface
- Option 2 before: Where the trace is brightest depends on the wavelet as well as the earth, since the reflectivity is identical in both runs
- Option 2 after: The brightest time depends on the wavelet too

### seismolord beginner module m05-wavelets-and-convolution ord 15: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 156 to 70 chars, same meaning; B4-padded distractor(s) 2,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: A bright amplitude is not automatically a strong interface, since it can also be constructive summing, tuning, or a long wavelet smearing a package together
- Option 1 after: A bright event may be summing or tuning rather than a strong interface
- Option 2 before: Amplitude should be ignored, since only the reflectivity series is meaningful and everything the wavelet adds on top of it is an artefact of the chosen wavelet frequency
- Option 2 after: Amplitude should be ignored, since only the reflectivity series is meaningful
- Option 3 before: Destructive interference is harmless because cancelled events reappear at higher frequency, so any dim interval can be recovered simply by rerunning with a sharper wavelet
- Option 3 after: Destructive interference is harmless because cancelled events reappear at higher frequency

### seismolord beginner module m06-reading-the-synthetic ord 4: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 124 to 72 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 3 before: It comes from the convolved trace, and only samples inside the valid window are searched because the rest are marked as gaps
- Option 3 after: It comes from the convolved trace, searched only inside the valid window

### seismolord beginner module m06-reading-the-synthetic ord 5: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 108 to 67 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: A zero asserts an amplitude nobody measured, while a gap asserts nothing, and the panel statistics skip gaps
- Option 1 after: A zero asserts an unmeasured amplitude, while a gap asserts nothing

### seismolord beginner module m06-reading-the-synthetic ord 7: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 101 to 56 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Every reported time is exactly halved, so the top of the teaching log reads 750 ms instead of 1500 ms
- Option 0 after: Every time is halved, so the top of the log reads 750 ms

### seismolord beginner module m06-reading-the-synthetic ord 8: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 164 to 57 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 3 before: Because polarity is a display convention, so two interpreters using opposite conventions tie the same well half a loop apart with nothing in the display to show why
- Option 3 after: Because opposite conventions tie a well half a loop apart

### seismolord beginner module m06-reading-the-synthetic ord 9: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 202 to 80 chars, same meaning; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 2 before: It corrupts that velocity, then the impedance, then the reflection coefficients that sample takes part in, and the wavelet then spreads the error across a band of the synthetic tens of milliseconds wide
- Option 2 after: It corrupts the velocity, impedance and coefficients, then the wavelet smears it

### seismolord beginner module m06-reading-the-synthetic ord 10: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: B4-padded distractor(s) 3 returned to pre-B4 wording; key and explanation unchanged
- Option 3 before: A polarity convention problem that will disappear once the sign is flipped on the seismic display
- Option 3 after: A polarity convention problem that will disappear when the sign is flipped

### seismolord beginner module m06-reading-the-synthetic ord 11: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 199 to 144 chars, same meaning; B4-padded distractor(s) 1 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 1 before: Mean sonic velocity, TWT at the top of the log, maximum impedance, the strongest reflection coefficient, the strongest synthetic amplitude and the recovered bulk shift from the cross-correlation scan against the seismic
- Option 1 after: Mean sonic velocity, TWT at the top of the log, maximum impedance, the strongest reflection coefficient, the strongest synthetic amplitude and the recovered bulk shift
- Option 2 before: Mean sonic velocity, TWT at the top of the log, maximum impedance, the strongest reflection coefficient in absolute value, the TWT of that coefficient and the TWT of the strongest synthetic amplitude
- Option 2 after: Mean sonic velocity, TWT at the log top, maximum impedance, the strongest reflection coefficient, its TWT and the TWT of the strongest amplitude

### seismolord beginner module m06-reading-the-synthetic ord 12: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 197 to 133 chars, same meaning; B4-padded distractor(s) 0,2 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Pass the final exam at 75 percent, then the module quizzes at 70 percent, then the capstone, so that the exam acts as the entry test and the module quizzes follow it as revision before the final gate opens
- Option 0 after: Pass the final exam at 75 percent, then the module quizzes at 70 percent, then the capstone
- Option 2 before: Read every lesson, pass each module quiz at 70 percent, then the capstone, with no final exam involved, since the capstone itself stands in for the exam and grants the certification once the quizzes are cleared
- Option 2 after: Read every lesson, pass each module quiz at 70 percent, then the capstone, with no final exam involved
- Option 3 before: Read every lesson, pass each module quiz at 75 percent with a 24 hour cooldown after three failures, clear all six modules, pass the final exam at 70 percent, and only then does the capstone unlock
- Option 3 after: Every lesson, each module quiz at 75 percent with a 24 hour cooldown after three failures, the final at 70 percent, then the capstone

### seismolord beginner module m06-reading-the-synthetic ord 13: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 170 to 93 chars, same meaning; B4-padded distractor(s) 0,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: Nothing, because the two always coincide when the wavelet is zero phase, since a symmetric wavelet centres every copy on its own coefficient and the brightest point must fall on the largest one
- Option 0 after: Nothing, because the two always coincide when the wavelet is zero phase
- Option 1 before: That the trace is a sum of overlapping wavelet copies, so its largest excursion need not sit at the largest single coefficient; on this well the two times are 60 ms apart
- Option 1 after: That the trace sums overlapping copies, so its peak can sit away from the largest coefficient
- Option 3 before: That the two-way factor has to be applied twice, once to each entry, because the coefficient time comes from the depth to time conversion while the amplitude time is read off the trace separately
- Option 3 after: That the two-way factor has to be applied twice, once to each entry

### seismolord beginner module m06-reading-the-synthetic ord 14: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 159 to 47 chars, same meaning; B4-padded distractor(s) 3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: So the shift recovered by the cross-correlation scan can be checked against a known truth, which shows that a tie is a measurement rather than an eye judgement
- Option 0 after: So the recovered shift has a known right answer
- Option 3 before: Because the capstone grades the recovered lag alongside the other numbers, so the planted value has to be fixed in advance for every learner to be marked against the same answer
- Option 3 after: Because the capstone grades the recovered lag alongside the other numbers

### seismolord beginner module m06-reading-the-synthetic ord 15: fixed (tighten)

- Flag: BEGINNER tier: correct options ran far longer than distractors and B4 padded distractors to compensate; tighten the correct option, trim the padded distractors, re-band
- Reason: correct option tightened from 183 to 44 chars, same meaning; B4-padded distractor(s) 0,1,3 returned to pre-B4 wording; key and explanation unchanged
- Correct option or prompt changed: owner: tighten seismolord beginner correct options
- Option 0 before: A second sonic curve so the velocity can be averaged for redundancy, which reduces the noise in the impedance log and therefore in every reflection coefficient and synthetic amplitude built from it
- Option 0 after: A second sonic curve so the velocity can be averaged for redundancy
- Option 1 before: An automatic depth conversion of the whole seismic volume, using the tied time to depth function from the well to move every trace from two way time into depth so the horizons can be mapped in metres
- Option 1 after: An automatic depth conversion of the whole seismic volume
- Option 2 before: Wedge modelling of a reflection pair with equal and opposite coefficients, to find the tuning thickness where amplitude peaks and to compare it against the classical theoretical value
- Option 2 after: Wedge modelling to find the tuning thickness
- Option 3 before: A null handling pass over the input curves before the impedance is formed, so that gaps in DT and RHOB are filled by interpolation and the reflectivity series runs unbroken through the whole logged interval
- Option 3 after: A null handling pass over the input curves before the impedance is formed

### seismolord beginner final ord 19: fixed (duplicate)

- Flag: near duplicate of beginner module m03-depth-to-time ord 13 (same 900 x 2 ms last-sample question, same key 1798 ms)
- Reason: true duplicate; module copy kept, final copy rewritten into a new question on the m03 time grid lesson (grid quantisation vs exact arithmetic in the capstone tolerances), answer_index kept at 2
- Correct option or prompt changed: duplicate rewritten into a new question from the same lesson
- Prompt before: The synthetic is computed on a regular 2 ms grid of 900 samples starting at 0 ms. What is the time of the last sample?
- Prompt after: The capstone allows 2 ms of tolerance on the two peak times but only 0.5 ms on the two way time at the log top. Why the difference?
- Explanation before: With the first sample at 0 ms there are 899 steps of 2 ms after it, so the last sample sits at 899 times 2 = 1798 ms. Multiplying 900 by 2 gives 1800 ms, which counts one step too many.
- Explanation after: The two peak times are grid search results, so they can only land on multiples of 2 ms, and one sample either way is the smallest difference the grid can show. The log top time comes straight from the time-depth function applied to 1500 m, so it is exact arithmetic and can be held to 0.5 ms. The capstone runs at a fixed 25 Hz and uses no checkshot.
- Option 0 before: 1800 ms
- Option 0 after: The log top time is measured by a checkshot, while the peak times are estimated from the sonic
- Option 1 before: 1802 ms
- Option 1 after: The peak times shift with wavelet frequency, so they need room for whichever frequency is chosen
- Option 2 before: 1798 ms
- Option 2 after: Peak times come from the 2 ms grid, while the log top time is exact arithmetic
- Option 3 before: 900 ms
- Option 3 after: Deeper events carry more velocity error, so their times are looser

### seismolord advanced final ord 37: fixed (duplicate)

- Flag: near duplicate of advanced module m05-theory-and-the-grid ord 14 (which error the check against theory would not detect, same key)
- Reason: true duplicate, and the final copy was also double keyed (its radians-per-second distractor is, per the lesson and its own explanation, also undetected); module copy kept, final rewritten into a new question on the three checks named in the same lesson, answer_index kept at 3
- Correct option or prompt changed: duplicate rewritten into a new question from the same lesson
- Prompt before: Which error would the check against theory NOT detect?
- Prompt after: Besides checking the tuning thickness against theory, which two checks does this tier use so that together the three pin the wedge model at unrelated points?
- Explanation before: The theoretical value does not involve the coefficients, so it agrees just as well with a wrong pair; the thick end check catches that. A frequency unit error moves both routes together, which is a reminder that a check catches process errors rather than input errors.
- Explanation after: The lesson names three checks: the tuning thickness against theory, the isolated amplitude against the reflection coefficient, and the zero at zero thickness against exact cancellation. The rules of thumb and the resolution conventions are values to compare against the exact expression, and they test nothing about whether the model itself is behaving.
- Option 0 before: A base coefficient entered with the wrong sign, which moves the argmax to zero thickness.
- Option 0 after: The rule of thumb against the exact expression, and the overshoot against 2.6 percent
- Option 1 before: A frequency entered as radians per second rather than hertz.
- Option 1 after: The quarter wavelength rule against 20 m, and the Widess limit against detection
- Option 2 before: A search window too narrow to reach the peak on the thinnest beds.
- Option 2 after: The peak time against the top of the bed, and the trace length against 91 samples
- Option 3 before: A reflection pair of plus and minus 0.20 rather than 0.08.
- Option 3 after: The isolated amplitude against the coefficient, and zero at zero thickness

### seismolord beginner final ord 37: judged fine (number-options)

- Flag: bare number options: review only, fix only if defective
- Reason: 3145.29 m/s is the lesson mean; 2501.65 and 3603.95 are single-sample velocities and 317.94 is its reciprocal as a transit time; one defensible key, explanation matches

### seismolord beginner module m03-depth-to-time ord 13: judged fine (number-options)

- Flag: bare number options: review only, fix only if defective; also the kept half of the duplicate pair with final ord 19
- Reason: 1798 ms is the lesson value (899 x 2 ms); 1800, 1802 and 900 are the classic off-by-one and forgot-the-spacing slips; kept as the module copy of the duplicate pair

## sim

Migration: `migrations/20261021b_b4_fix_sim.sql`

### sim beginner final ord 4: fixed (duplicate)

- Flag: near duplicate of beginner module m01-what-a-deck-is ord 4 (why the six sections are in a fixed order)
- Reason: Final copy rewritten to test why SOLUTION must follow PROPS, from lesson m01 l02; the module question keeps the single-pass idea.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Why must the six deck sections appear in a fixed order?
- Prompt after: Why can the SOLUTION section not be placed before PROPS in a deck?
- Explanation before: RUNSPEC declares dimensions so GRID can be checked, GRID establishes cells so PROPS has something to apply to, PROPS defines fluids so SOLUTION can equilibrate, and SOLUTION sets the state SCHEDULE starts from. Nothing goes back to reinterpret an earlier section.
- Explanation after: SOLUTION puts the fluids where gravity would have put them, and that integration needs the fluid densities and PVT that PROPS defines. A simulator reads a deck in a single pass and never goes back. The grid dimensions come from RUNSPEC, and the contacts and datum sit in SOLUTION's own EQUIL line.
- Option 0 before: Because the sections are stored as separate records and the file's index assumes them in that sequence.
- Option 0 after: Because PROPS declares the grid dimensions that SOLUTION sizes its arrays by, and a simulator cannot allocate cells it has not yet been told about.
- Option 1 before: Because a simulator reads a deck in a single pass, so each section depends on the ones before it having been read already.
- Option 1 after: Because SOLUTION equilibrates the fluids under gravity, which needs the densities and PVT tables that PROPS defines.
- Option 2 before: Because reordering them changes which defaults apply, since a default is taken from the most recently read section.
- Option 2 after: Because PROPS carries the contacts and the datum, and SOLUTION needs both of them to assign each cell a fluid.
- Option 3 before: Because the format was standardised before random access was practical, so the ordering is historical rather than functional.
- Option 3 after: It can be; the order is only a convention, and a simulator reading SOLUTION first returns to PROPS later.

### sim beginner final ord 9: fixed (duplicate)

- Flag: near duplicate of beginner module m02-the-grid ord 3 (what the half-cell origin offset buys)
- Reason: Final copy rewritten to test where the grid places Ekene-2, the well that misses the lattice, from lesson m02 l01.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: The deck's origin is half a cell south-west of the field's map origin. What does that achieve?
- Prompt after: Ekene-2 is posted at (2200, 1150). Where does the block-centred grid place it?
- Explanation before: A well on a boundary belongs to two cells and needs a tie-break, and tie-breaks differ between tools. Ekene-1 at (1000, 1000) sits at the centre of cell (11, 11) because of the offset, while Ekene-2 at a northing of 1150 m does not, which the Professional tier takes up.
- Explanation after: With the offset, cell (i, j) is centred at (i - 1) x 100 m east and (j - 1) x 100 m north, so a well on multiples of 100 m lands on a centre. 1150 is not a multiple of 100, so Ekene-2 falls in cell (23, 13) with its centre at 1200 m. The well index does not move a well within its cell, and the Professional tier measures what the offset costs.
- Option 0 before: It removes the need to transform coordinates between the map frame and the deck frame at all.
- Option 0 after: Exactly on a cell centre, because the half-cell offset of the deck's origin puts every Ekene well on one.
- Option 1 before: It centres the accumulation in the grid so the structure is symmetric about the model's middle.
- Option 1 after: Across the boundary between two cells, with its connections shared equally between the cells either side.
- Option 2 before: A well at map coordinates that are multiples of 100 m lands on a cell centre rather than on a boundary.
- Option 2 after: In cell (23, 13), whose centre is at a northing of 1200 m, so the well sits half a cell from where the grid places it.
- Option 3 before: It aligns the model with the seismic bin grid, which is conventionally offset by half a bin from the map grid.
- Option 3 after: In cell (23, 13), with its well index adjusted for the well's true position so that the grid carries it exactly where it was posted.

### sim beginner final ord 11: fixed (duplicate)

- Flag: near duplicate of beginner module m02-the-grid ord 7 (how the deck carries net-to-gross)
- Reason: Final copy rewritten to test where the one-tenth kv/kh ratio comes from, from lesson m02 l03.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: The Ekene deck has no NTG keyword. How is net-to-gross carried?
- Prompt after: In every Ekene layer the vertical permeability is one tenth of the horizontal. Where does that ratio come from?
- Explanation before: The alternative is a gross thickness of about 43 ft with an NTG applied separately, and both give the same pore volume. They give different depths to every interface below layer 1, so a deck must state which convention it uses because nothing about the numbers reveals it.
- Explanation after: The lesson states the one-tenth ratio as a design constant of the deck. The Dykstra-Parsons fit concerns the spread of horizontal permeability between the layers, and the net-to-gross is carried in the thicknesses. Real kv/kh ratios run from 0.01 to 1 and are rarely measured directly.
- Option 0 before: In the layer thicknesses, which are already net pay, combined with a porosity of 0.2 that is the porosity of net rock.
- Option 0 after: It is a design constant of this deck; real fields have a kv/kh between 0.01 and 1, and it is rarely measured directly.
- Option 1 before: In the porosity, which is the gross value already multiplied by the net-to-gross of 0.8.
- Option 1 after: From the SCAL course's core plugs, which measured vertical and horizontal permeability on each layer.
- Option 2 before: In the permeability, which is scaled down so that the layer's flow capacity comes out correct in spite of the gross thickness used.
- Option 2 after: From the waterflood course's Dykstra-Parsons column, whose log-normal fit to the five layers fixes the vertical permeability at a tenth of the horizontal.
- Option 3 before: It is not carried at all, which is the reason the deck's pore volume exceeds the volumetric booking's.
- Option 3 after: From the net-to-gross of 0.8, which scales down the vertical flow capacity of each layer.

### sim beginner final ord 13: fixed (duplicate)

- Flag: near duplicate of beginner module m02-the-grid ord 9 (which GRID block does not compress)
- Reason: Final copy rewritten to test why compressed blocks give reviewable diffs, from lesson m02 l04.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Which block in Ekene's GRID section does not compress, and what does that tell you?
- Prompt after: When a deck is kept under version control, why do compressed blocks make its changes easier to review?
- Explanation before: PORO, PERMX, PERMY and PERMZ are all layer-constant and compress to five tokens each. TOPS is 900 distinct values and is most of the section's length. That diagnostic works on any deck: the incompressible blocks are where the modelling effort went.
- Explanation after: The lesson gives two reasons deck size matters, review and diffs. A layer-constant block such as PERMX compresses to one token per layer, so editing one layer's value changes one token, while the same edit in an expanded block touches 900 lines. Line wrapping has no meaning to the simulator either way.
- Option 0 before: PERMX, because permeability differs between the five layers rather than being constant across the grid.
- Option 0 after: Because version control stores a repeat count natively and records only the count when a value changes.
- Option 1 before: PORO, because porosity was populated cell by cell from a geostatistical property model.
- Option 1 after: Because a compressed block is read faster, so each committed version can be test-run before review.
- Option 2 before: TOPS, because every column has its own depth, and the blocks that resist compression are the ones carrying real spatial variation.
- Option 2 after: Because a change to one layer's permeability is then a one-token edit in the block, where an expanded block would show a 900-line change.
- Option 3 before: DZ, because layer thickness varies with the structure and therefore differs from column to column.
- Option 3 after: Because compression removes the line wrapping, and wrapping is what makes most deck diffs unreadable.

### sim beginner final ord 15: fixed (duplicate)

- Flag: near duplicate of beginner module m03-the-tables ord 1 (what the five PROPS keywords have in common)
- Reason: Final copy rewritten to test what the DENSITY value for oil is, from lesson m03 l01.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: What do DENSITY, PVTO, PVDG, PVTW and ROCK have in common?
- Prompt after: Ekene's DENSITY block gives oil at 54.02790214067278 lb/ft3. What is that number?
- Explanation before: A deck contains no correlations. PVTW and ROCK are lines of constants rather than tables, none is optional for a live-oil model, and DENSITY covers all three phases at once. What they share is that they are values, and their provenance lives outside the file.
- Explanation after: DENSITY carries the three phases at surface conditions, from gravities of 32 API for oil, 1.03 for brine and 0.75 for gas. The simulator combines them with the formation volume factors to get the reservoir densities that drive segregation and the contacts. Dividing 64.30084 by 1.2 does not give the deck's oil density.
- Option 0 before: Each hands the simulator numbers rather than a correlation, so the choice of correlation stays with whoever wrote the deck.
- Option 0 after: The surface density that follows from the oil's 32 API gravity, which the simulator combines with Bo to get reservoir density.
- Option 1 before: Each is indexed by pressure, so the simulator interpolates all five identically between their rows.
- Option 1 after: The reservoir density at the initial 3200 psia, which the simulator divides by Bo to recover a surface value.
- Option 2 before: Each is optional, since a simulator falls back on internal correlations for any block absent from the deck.
- Option 2 after: The water density of 64.30084 lb/ft3 divided by the oil formation volume factor of 1.2, which is how the deck states the oil's buoyancy against brine.
- Option 3 before: Each describes a single phase, so a three-phase model needs exactly three of them and the remaining two exist only for reporting.
- Option 3 after: The density measured on the Material Balance course's bottom-hole sample, at reservoir conditions.

### sim beginner final ord 24: fixed (duplicate)

- Flag: near duplicate of beginner module m04-initialisation ord 5 (how a cell straddling the contact is treated)
- Reason: Final copy rewritten to test what a 10 ft deeper contact does to the crest column and the oil area, from lesson m04 l02.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: How is a cell straddling the contact treated?
- Prompt after: Ekene's crest oil column is about 62 ft. What does moving the contact 10 ft deeper do?
- Explanation before: There is no partial cell. The staircase's tread is a cell and its riser is a layer thickness, and that roughness is exactly what the Professional tier's volumetric reconciliation measures against the booking.
- Explanation after: 10 ft on a 62 ft crest column is about a sixth. A deeper contact also brings more columns into the oil leg, so the area grows by more than the column does. The datum and its pressure are a separate pair. Contacts are usually the most uncertain input and the cheapest to change, which is why a contact sensitivity is standard practice.
- Option 0 before: Partially, with saturation proportional to the fraction of the cell lying above the contact depth.
- Option 0 after: It raises the pressure at the datum by the water gradient over 10 ft, and leaves the oil in place unchanged.
- Option 1 before: Entirely oil or entirely water depending on which side its centre falls, so the modelled contact is a staircase.
- Option 1 after: It adds roughly a sixth to the column at the crest, and more than that in area, as more columns come into the oil leg.
- Option 2 before: As a transition cell, with saturations interpolated from the capillary pressure curve across the whole of its own thickness.
- Option 2 after: It adds roughly a sixth to the column at the crest and leaves the oil area unchanged, because the area is fixed by the TOPS surface alone.
- Option 3 before: It is subdivided automatically so the contact can be represented at the depth where it actually falls.
- Option 3 after: It adds 10 ft to the crest column out of 161 ft of relief, about six percent, with the area unchanged.

### sim beginner final ord 28: fixed (duplicate)

- Flag: exact-key duplicate of beginner module m04-initialisation ord 14 (the no-well first check)
- Reason: Final copy rewritten to test why a state at rest is an assumption, from lesson m04 l04.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: What is the standard first check on a new deck's initialisation?
- Prompt after: Equilibration asserts that the model starts at rest. Why is that an assumption rather than an observation?
- Explanation before: If the initial state is not in equilibrium the model moves with no wells open, and the drift looks like a physical response. The usual culprits are a density inconsistent with the PVT tables or a contact outside the grid. Comparing against the booking is also worth doing and tests something different.
- Explanation after: Equilibrium means every phase pressure gradient is balanced by gravity, so nothing moves. A real field at discovery need not be in that state, and a deck that equilibrates has assumed regional flow, tilted contacts and active aquifers away. The zero capillary pressures only remove the transition zone.
- Option 0 before: Compare the reported oil in place against the booking, which is the only test of whether the contact is right.
- Option 0 after: Because pressure is only measured after production starts, so the state at time zero is never observed at all.
- Option 1 before: Run it with no wells for a short period and confirm nothing changes; a pressure drift means the initialisation and the property fields disagree.
- Option 1 after: Because a real reservoir at discovery may have regional flow, tilted contacts or an active aquifer sweeping across it, and equilibrating assumes them all away.
- Option 2 before: Confirm the datum lies within the grid's depth range, since a datum outside it cannot be integrated from.
- Option 2 after: Because the simulator cannot compute flow at time zero, so rest is imposed until the first well opens.
- Option 3 before: Check the equilibration iteration count in the log, which rises sharply when the initial state is inconsistent.
- Option 3 after: Because zero capillary pressure forces every phase to be stationary, whatever the reservoir was doing.

### sim beginner final ord 33: fixed (duplicate)

- Flag: near duplicate of beginner module m05-wells-and-schedule ord 9 (report steps against solver steps)
- Reason: Final copy rewritten to test why frequent control changes cost run time, from lesson m05 l03.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: A DATES entry defines a report step. What is its relationship to the solver's own steps?
- Prompt after: Why is a history-matching deck that changes well controls every month more expensive to run than one that changes them yearly?
- Explanation before: Ekene's 36 history entries are 36 points at which results are written rather than 36 solves. Report steps cost output volume and nothing else; a tiny report interval buys a larger file and the same answer.
- Explanation after: Report steps cost output volume and solver steps cost run time. A control change forces the solver to cut its step and rebuild, so a deck with a change every month costs more even when the physics is identical. The 36 history entries are 36 points where results are written rather than 36 solves.
- Option 0 before: None directly: the solver chooses its own step size adaptively and may take many internal steps inside one report step.
- Option 0 after: Because each abrupt control change forces the solver to cut its step and rebuild, so frequent changes cost run time.
- Option 1 before: They coincide one for one, so refining the report interval is how a modeller reduces the time-discretisation error of the solution.
- Option 1 after: Because every DATES entry is a separate solve, so 36 monthly entries mean 36 solves where a yearly schedule needs only three.
- Option 2 before: The report step bounds the solver step, so a shorter report interval forces shorter solver steps everywhere and therefore more accuracy.
- Option 2 after: Because each report step writes the full state of every cell, and that output volume is what dominates the run time of a history match.
- Option 3 before: The solver takes a fixed number of internal steps per report step, configurable through a RUNSPEC option.
- Option 3 after: Because WCONHIST rates are re-read from the ledger at every internal step.

### sim beginner final ord 42: fixed (duplicate)

- Flag: near duplicate of beginner module m06-the-associate-reading ord 14 (two thirds of the deck is SCHEDULE); module m01 ord 5 carries the same point
- Reason: Final copy rewritten to test what a tiny PROPS section suggests, from the reading habit in lesson m01 l02.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Two thirds of the Ekene deck is SCHEDULE. What does that say about the study?
- Prompt after: When you open an unfamiliar deck, what does a very small PROPS section suggest?
- Explanation before: A deck that is nearly all GRID is a big static model with a short run; one with a tiny PROPS section is probably using defaults worth checking. Ekene's GRID section is short because its properties are constant and compress, and its PROPS section is a full set of tables.
- Explanation after: The reading habit is to find the six section headers and note their line ranges first. A deck that is nearly all SCHEDULE is a history-matched study, one that is nearly all GRID is a big static model, and one with a tiny PROPS section is probably using defaults. A deck hands the simulator numbers rather than correlations, and PROPS tables do not grow with the grid.
- Option 0 before: It has an unusually detailed grid, since the completions for every well are written into the schedule.
- Option 0 after: That the fluid is dead oil, since a live oil would need a PVTO table carrying one record per solution gas ratio.
- Option 1 before: It was generated rather than hand-written, since a hand-written deck would balance its sections more evenly.
- Option 1 after: That the fluid is described by a correlation, which the simulator evaluates internally from a handful of gravities.
- Option 2 before: It carries a long production history, which is what a history-matched study looks like from the outside.
- Option 2 after: That the deck is probably relying on defaults, which you should go and check before trusting its fluids.
- Option 3 before: It is largely defaulted elsewhere, which is why the sections carrying explicit data look disproportionately large.
- Option 3 after: That the model has few cells, since PROPS grows with the grid.

### sim intermediate final ord 2: fixed (duplicate)

- Flag: near duplicate of intermediate module m01-where-the-structure-comes-from ord 2 (the three decisions an interpolator makes)
- Reason: Final copy rewritten to test what the sill does to the estimate, from lesson m01 l02.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Which three things must an interpolator decide that the data does not determine?
- Prompt after: Ekene's kriging carries a sill of 400. What does changing the sill alone do to the deck's depths?
- Explanation before: Range, regional behaviour and exactness at the data. None is determined by six depths and each visibly changes the map. Cell size and layering are gridding decisions downstream of the surface.
- Explanation after: The sill is the variance the surface reaches at large separation. On its own it does not change the estimate, because it appears in both the weights and the system they solve, and it matters only for the uncertainty, which this deck does not carry. The range sets how far influence reaches and the nugget decides whether the surface passes through the data.
- Option 0 before: How far a well's influence reaches, what the surface does far from any well, and whether it passes exactly through the data.
- Option 0 after: Nothing to the estimate, since the sill scales the covariance in both the weights and the system they solve; it matters for uncertainty.
- Option 1 before: The cell size, the number of layers, and the depth reference the finished surface is quoted against in the deck.
- Option 1 after: It moves the whole surface toward the regional mean, so a larger sill deepens every column away from the wells.
- Option 2 before: Which of the wells to include, how heavily to weight the measurement error carried by each, and where to place the grid origin relative to the map.
- Option 2 after: It changes how far each well's influence reaches, so a larger sill spreads every well's measured depth across more of the 900 columns in the deck.
- Option 3 before: Whether to grid in time or depth, which velocity model to use, and how to tie the converted surface back to the wells.
- Option 3 after: It sets how closely the surface honours each well, so a larger sill lets the map smooth through the tops.

### sim intermediate final ord 5: fixed (duplicate)

- Flag: near duplicate of intermediate module m01-where-the-structure-comes-from ord 6 (the 2.3e-13 m residual)
- Reason: Final copy rewritten to test when a non-zero nugget is the right choice, from lesson m01 l03.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Two of the exactly-recovered wells carry a residual of about 2.3e-13 m. What is that?
- Prompt after: When would a non-zero nugget be the better choice for a surface like Ekene's?
- Explanation before: Two tenths of a picometre is arithmetic rather than structure. A discrepancy at the thirteenth decimal is floating point and one at the second is a modelling decision, and knowing which you are looking at is the skill.
- Explanation after: A nugget tells the interpolator how much of the scatter to treat as noise. A well top is picked from a log by a person and two people pick differently, so forcing the surface through every pick puts a spurious feature at every well. Ekene uses zero because its six tops are exact by construction.
- Option 0 before: The metre to foot and back round trip, because the deck stores depths in feet and the conversion is not exact in binary.
- Option 0 after: When the well tops carry pick error, so the surface should pass near the data instead of honouring noise as signal.
- Option 1 before: The convergence tolerance of the kriging solve, which stops when successive estimates differ by less than that amount.
- Option 1 after: When the wells are further apart than the range, so the surface needs a nugget to carry influence across the gaps between them.
- Option 2 before: A genuine structural residual, since simple kriging is only exact in the limit and this nugget is small rather than zero.
- Option 2 after: When the deck stores depths in feet, so the nugget can absorb the unit round-trip residual the kriging would otherwise leave.
- Option 3 before: The precision of the coordinate transform between the map frame and the deck frame, applied twice in opposite directions.
- Option 3 after: When the regional mean is unknown and must be estimated from six points.

### sim intermediate final ord 20: fixed (duplicate)

- Flag: near duplicate of intermediate module m03-fluid-provenance ord 7 (symptom of a deck-only PVT update)
- Reason: Final copy rewritten to test how the fluid rule inverts when the deck is built first, from lesson m03 l03.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: A new PVT report arrives and somebody updates the deck alone. What is the symptom months later?
- Prompt after: Occasionally the simulation model is built before the other analyses. What does the fluid rule say then?
- Explanation before: The deck runs perfectly and returns different answers. Volumes drift from the booking, the match stops reproducing pressures, and the ledger's factors are stale, and none of it appears as an error.
- Explanation after: When the deck is the first thing built, its PVT is the reference and everything else adopts it. What is never acceptable is two authoritative sources, because a tank model on one fluid and a simulation model on another give two answers for the size of the field and no way to choose.
- Option 0 before: A model that used to match and no longer does, with no change to the geology, until somebody finds the PVT commit.
- Option 0 after: It inverts: the deck's PVT becomes the reference and the other analyses must adopt it, so there is one source.
- Option 1 before: A deck that fails to validate, because the new tables disagree with the RSVD value in the SOLUTION section.
- Option 1 after: Nothing changes: the deck takes the latest laboratory report and the other analyses follow when revised.
- Option 2 before: An error raised at initialisation, since the oil in place the deck reports no longer matches the value carried in the study document.
- Option 2 after: The deck carries a correlated fluid until the laboratory report arrives, since no other analysis exists yet that it could be matched against.
- Option 3 before: Results that differ between runs, because the two fluid descriptions are being mixed between report steps.
- Option 3 after: Each analysis may keep its own fluid, provided the deck records which one it used.

### sim intermediate final ord 21: fixed (duplicate)

- Flag: near duplicate of intermediate module m03-fluid-provenance ord 11 (why the gas is correlated and the oil designed)
- Reason: Final copy rewritten to test what the gas table shows across its pressure range, from lesson m03 l04.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Why is Ekene's gas table correlated while its oil is designed?
- Prompt after: Ekene's gas table runs from 400 to 3800 psia. What does it show the gas doing across that range?
- Explanation before: The material balance course modelled Ekene as undersaturated, the ledger set the gas factor to zero and the SCAL course worked in oil and water. A correlation on the field's own gas gravity is the honest fallback.
- Explanation after: Across the twelve rows Bg falls by a factor of ten and viscosity roughly doubles. That is gas doing what gas does: it compresses hard, and compressed gas is more viscous. The table comes from the Hall and Yarborough z-factor with Lee, Gonzalez and Eakin viscosity on a gas gravity of 0.75.
- Option 0 before: Gas properties are insensitive to the correlation chosen, so a correlated gas adds negligible uncertainty to anything.
- Option 0 after: Bg rises steadily with pressure while viscosity stays nearly constant, as a dry gas would at 180 F.
- Option 1 before: The gas table is only used below the bubble point, which Ekene never reaches, so its provenance does not matter.
- Option 1 after: Bg falls by a factor of ten while viscosity roughly halves, as the gas approaches the oil's properties.
- Option 2 before: No earlier course built a gas description, so there was nothing to inherit and inventing one would mean designing a fluid nobody would check.
- Option 2 after: Bg falls by a factor of ten while the viscosity roughly doubles, because gas compresses hard and compressed gas is more viscous.
- Option 3 before: Designing a gas table needs a compositional analysis, which the field's fluid sampling programme never included.
- Option 3 after: Bg and viscosity both stay near their bubble-point values, since no free gas forms in Ekene's history.

### sim intermediate final ord 23: fixed (duplicate)

- Flag: near duplicate of intermediate module m04-rock-curves-from-the-lab ord 3 (why the deck carries a table rather than the Corey model)
- Reason: Final copy rewritten to test how to judge the SWOF row count, from lesson m04 l01.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Why does the deck carry a table rather than the Corey model?
- Prompt after: Ekene's SWOF carries 22 rows. What is a useful test of whether that row count is enough?
- Explanation before: That is a deliberate design: it keeps the simulator independent of any particular saturation model, at the cost of losing the provenance at the boundary. The same trade appears throughout PROPS.
- Explanation after: The row count is a judgement: too few and the polyline departs from the curve, too many and the table is decoration. A sensitivity on the count is the direct test. Twenty two uniformly spaced rows is fine for a curve this smooth.
- Option 0 before: Because a table is faster to evaluate at run time than a power law would be at every timestep of the run.
- Option 0 after: Check that the rows bracket the full saturation range, since the end rows decide the interpolation.
- Option 1 before: Because the format has no way to express a saturation model: every simulator interpolates rows and there is no keyword for Corey.
- Option 1 after: Halve the row count and see whether anything downstream moves; if nothing does, the original count was generous.
- Option 2 before: Because simulators implement Corey differently, so a table is the only portable way to state the same curve.
- Option 2 after: Use one row per percent of mobile saturation, which is the standard resolution for a Corey table.
- Option 3 before: Because the model was fitted to laboratory points and the table is those points rather than the fit through them.
- Option 3 after: Confirm the rows reproduce the six Corey parameters exactly when a curve is fitted back.

### sim intermediate final ord 24: fixed (duplicate)

- Flag: exact-key duplicate of intermediate module m04-rock-curves-from-the-lab ord 4 (the four numbers that set scale)
- Reason: Final copy rewritten to test what a higher residual oil costs in movable oil, from lesson m04 l02.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Which four numbers set the scale of the displacement rather than its shape?
- Prompt after: Ekene's residual oil is 0.25. What would a value of 0.30 do?
- Explanation before: Connate water sets the oil in place, residual oil sets the maximum displacement efficiency, and the endpoint mobilities set the mobility ratio. Everything between them is shape, which the exponents control.
- Explanation after: The movable oil is one minus connate water minus residual oil, 0.4 of the pore space at a residual of 0.25. Raising the residual by 0.05 removes 0.05 of that 0.4, which is an eighth. The two curves look nearly identical over most of their range and differ only where they stop, which is why endpoint errors hide.
- Option 0 before: Connate water, residual oil and the two endpoint mobilities.
- Option 0 after: Remove an eighth of the movable oil from the field.
- Option 1 before: The two Corey exponents and the two endpoint mobilities, since exponents give curvature and endpoints give magnitude.
- Option 1 after: Leave the movable oil unchanged, since residual oil only moves the curve's end point and not the volume that can be displaced.
- Option 2 before: The first and last rows of each table, which bracket the range every interior row is interpolated within.
- Option 2 after: Remove a twentieth of the movable oil, since the residual rises by 0.05 on a total pore space of one.
- Option 3 before: Connate water, residual oil, the row count and the row spacing, which set both the range and its resolution.
- Option 3 after: Raise the water endpoint mobility, since the table must reach its krw endpoint at a lower water saturation.

### sim intermediate final ord 28: fixed (duplicate)

- Flag: near duplicate of intermediate module m04-rock-curves-from-the-lab ord 10 (what one saturation region assumes)
- Reason: Final copy rewritten to test what the zero Pc column leaves out of the SCAL work, from lesson m04 l04.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: One saturation region across five layers spanning a factor of six in permeability. What does that assume?
- Prompt after: Ekene's tables carry zero capillary pressure. What did the SCAL course build that the deck leaves out?
- Explanation before: Pore structure is what makes one layer 600 md and another 100. Simulators support multiple regions for exactly this reason, and this deck uses one because the SCAL course fitted one curve.
- Explanation after: The SCAL course built a real capillary pressure curve for this sand from a Leverett J-function and used it to show that the crest is drier than the flanks. None of that is in the deck. For a field with 49 m of relief and a transition zone of a few metres that is a reasonable simplification, and the study should say so.
- Option 0 before: That pore structure, and so the shape of the relative permeability curves, is the same in the 607 md layer as in the 102 md one.
- Option 0 after: A Leverett J-function capillary curve showing the crest drier than the flanks, a fair omission for a thin transition zone.
- Option 1 before: That the five layers sit in capillary equilibrium with one another, so a single averaged curve describes their combined behaviour adequately.
- Option 1 after: A hysteresis pair of drainage and imbibition curves, which a monotonic waterflood would need.
- Option 2 before: That the flood sweeps all five layers simultaneously, so their individual curves would be averaged in any case.
- Option 2 after: A second saturation region for the 607 md layer, whose lower connate water the SCAL course measured separately from the other four layers.
- Option 3 before: That the simulator rescales the curves per cell by permeability, which is why a single region is sufficient here.
- Option 3 after: A gas-oil relative permeability set, which the deck replaced with three design constants.

### sim intermediate final ord 31: fixed (duplicate)

- Flag: near duplicate of intermediate module m05-wells-on-a-real-field ord 4 (what weights the five connections)
- Reason: Final copy rewritten to test which completion change is the conformance-control move, from lesson m05 l02.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Ekene's five connections per producer are not five equal contributions. What weights them?
- Prompt after: Which completion change on an Ekene producer would be the conformance-control move, and why?
- Explanation before: A connection in the 607 md layer delivers far more than one in the 102 md layer, so the producer's output is dominated by layer 2. That is how the waterflood course's conclusion follows in the deck.
- Explanation after: Layer 2 at 607 md is the fast layer, so a selective completion of layers 1 to 3 still includes it. Shutting that layer specifically is what conformance control would do, and doing it during the run needs a schedule that changes completions at dates.
- Option 0 before: The layer thickness alone, since the wellbore length in each layer sets the connection's transmissibility.
- Option 0 after: Shutting layer 4 specifically, since it is the least permeable layer and it waters out first.
- Option 1 before: The well index of each connection, which scales roughly with the permeability-thickness product of the layer it sits in.
- Option 1 after: Shutting layer 2 specifically, since it is the fast layer and a completion in layers 1 to 3 would still include it.
- Option 2 before: The distance from each cell centre to the wellbore itself, which differs from layer to layer because the well does not pass exactly through the centre.
- Option 2 after: Opening layers 4 and 5 only, since the deeper layers sit closest to the contact and carry most of the injected water to the producer.
- Option 3 before: The pressure drop between each layer and the wellbore, recomputed by the simulator at every timestep of the run.
- Option 3 after: Completing layers 1 to 3 only, since the top three layers carry the fast streak.

### sim intermediate final ord 33: fixed (duplicate)

- Flag: near duplicate of intermediate module m05-wells-on-a-real-field ord 8 (why mean-month errors do not cancel)
- Reason: Final copy rewritten to test the ledger's monthly volume convention, from lesson m05 l03.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Why do mean-month divisor errors not cancel over three years?
- Prompt after: What convention does the waterflood ledger state for a monthly volume?
- Explanation before: February is over-produced by nearly ten percent. A history match whose residuals correlate with month length has this bug and nothing else, which makes the symptom distinctive.
- Explanation after: The waterflood course stated that a monthly volume is the rate on the first of the month held flat for that month, so the conversion to a schedule rate is exact. A real production database often holds daily allocated volumes and monthly totals that disagree, and which one a deck uses should be recorded.
- Option 0 before: Because they compound, since each month's error shifts the starting cumulative for the next month.
- Option 0 after: It is the month's total divided by a mean month of 30.4375 days, so every month has one length.
- Option 1 before: Because production declines through the history, so later months carry more weight in the total.
- Option 1 after: It is the average of the daily allocated volumes, which is why it differs from the monthly total.
- Option 2 before: Because they follow the calendar: every 31-day month is over-produced and every 30-day month under-produced.
- Option 2 after: It is the rate on the first of the month held flat for that month, so the ledger and the schedule agree by construction.
- Option 3 before: Because leap years add a day to February that the 30.4375 divisor has already accounted for twice within the same calendar year.
- Option 3 after: It is the rate at the end of the month applied backward over the whole month, which is how the DATES block closing the period is read.

### sim intermediate final ord 35: fixed (duplicate)

- Flag: near duplicate of intermediate module m05-wells-on-a-real-field ord 11 (injectors below the contact inject water into water)
- Reason: Final copy rewritten to test why Ekene-2 and Ekene-4 became the injectors, from lesson m05 l04.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Both Ekene injectors found the sand below the contact. What does that do in the model?
- Prompt after: Why were Ekene-2 and Ekene-4 chosen as the field's injectors?
- Explanation before: The oil is up-structure and the injection supports it by pressure and by displacing water toward it. That is the two-jobs distinction falling out of the deck's geometry rather than being asserted separately.
- Explanation after: Both found the top of the sand below the 1560 m contact, so they came in wet. That is how flood patterns are usually chosen: the injectors were not picked for their geometry. In the model their cells initialise at a water saturation of one.
- Option 0 before: Their cells are excluded from the oil in place, which is why the deck's oil cell count differs from the booking's.
- Option 0 after: They sit on the crest, so water injected there pushes oil down-structure toward the producers.
- Option 1 before: Their cells initialise at a water saturation of one, so they inject water into water and support the oil indirectly.
- Option 1 after: They were drilled as producers and came in wet, so converting them to injection cost a pump and a line rather than a well.
- Option 2 before: Their completions must be restricted to layers above the contact, or the simulator refuses the well at initialisation.
- Option 2 after: They sit at the corners of a regular pattern around the producers, which the waterflood course designed first and drilled second.
- Option 3 before: Their injection is booked as out of zone, which is where the waterflood course's twelve percent figure comes from.
- Option 3 after: They were the two wells with the highest permeability-thickness, which favours injectivity.

### sim intermediate final ord 37: fixed (duplicate)

- Flag: exact-key duplicate of intermediate module m06-the-professional-reading ord 8 (what a validation would have needed)
- Reason: Final copy rewritten to test why the Expert tier's results module is ungraded, from lesson m06 l03.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: The structure is described as calibrated rather than validated. What would a validation have needed?
- Prompt after: The Expert tier ends with a results module that grades nothing. Why?
- Explanation before: Ekene has none spare: all six wells went into the interpolation. That is the honest closing line and it tells the next person what to go and get. The sensitivity run is worth doing and tests nothing the model was not already tuned against.
- Explanation after: The engines this course is built on emit decks and do geometry, and they do not solve flow equations, so there is no simulated number the course could check an answer against. The module teaches what a practitioner needs whether or not it can be checked.
- Option 0 before: A formal review by a second engineer, with the acceptance criterion agreed before any tuning began.
- Option 0 after: Because reading results is a skill only a running simulator can teach, and the Studio grades it separately after each run.
- Option 1 before: Something the model was not tuned to reproduce, such as a seventh well whose top the surface then predicts.
- Option 1 after: The course's engines emit decks and do geometry without solving flow, and a course grades what it can check.
- Option 2 before: An independent volumetric booking computed on the deck's own frame, so the two could be compared like with like.
- Option 2 after: Because results depend on the history match, and grading them would reward whichever learner tuned the most parameters.
- Option 3 before: A sensitivity run at a shallower and a deeper regional mean, showing the booking falls inside the resulting spread.
- Option 3 after: Because the results would reveal the capstone answers.

### sim intermediate final ord 39: fixed (duplicate)

- Flag: near duplicate of intermediate module m06-the-professional-reading ord 11 (what the Expert tier assumes)
- Reason: Final copy rewritten to test what the Expert tier's validation module works through, from lesson m06 l03.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: What does the Expert tier assume from this one?
- Prompt after: What does the Expert tier's validation module work through?
- Explanation before: Its calibration module picks the reconciliation up directly. Every volumetric statement there depends on knowing that Eclipse decides a cell's fluid by its centre depth and that the alternative gives a different and equally defensible number.
- Explanation after: The validation module isolates the validator's rules with deliberately broken specifications, one rule each, and then turns to the harder question of what a validator cannot catch, which is most of what goes wrong. SPE1 belongs to the results module.
- Option 0 before: The kriging parameters and the well positions, since the Expert tier re-intersects deviated trajectories against the very same grid.
- Option 0 after: A full run of the Ekene deck in the Studio, with each warning the simulator raises traced back to its keyword.
- Option 1 before: The PVT and rock curve provenance, since its calibration adjusts both to match the volumetric booking.
- Option 1 after: The history match residuals, with each misfit traced back to the structure, the fluid or the rock curves.
- Option 2 before: The reconciliation and that it was arranged, and the cell-centre rule for assigning a cell to oil or water.
- Option 2 after: Deliberately broken specs that each trip one rule, then what a validator cannot catch.
- Option 3 before: The naming rule and the completion strategy, since the Expert tier adds a new well to the model that already exists.
- Option 3 after: The SPE1 problem, run against the published envelope.

### sim intermediate final ord 42: fixed (duplicate)

- Flag: near duplicate of intermediate module m06-the-professional-reading ord 10 (auditing to authoring)
- Reason: Final copy rewritten to test how the Expert tier turns a deviated well into completions, from lesson m06 l03.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: The Expert tier is described as moving from auditing to authoring. What follows?
- Prompt after: How does the Expert tier turn a deviated well into completions?
- Explanation before: A trajectory becomes a completion list, a database becomes a schedule, and a free parameter is tuned and the tuning reported. The Expert tier has a results module and grades none of it, and the course never runs a deck.
- Explanation after: A deviated well is a path in three dimensions, and its completions are wherever that path crosses a cell. The answer is a list with a direction flag per cell rather than a k1 and a k2, and Ekene's side-track is the worked example.
- Option 0 before: It stops reading the deck and starts reading results, which is where a study's conclusions actually live.
- Option 0 after: By extending k1 and k2 to cover every column the well passes through between heel and toe.
- Option 1 before: It moves from the static model to the dynamic one, so the questions become about flow rather than geometry.
- Option 1 after: By reading the perforated intervals off the well's log and mapping each to the nearest layer.
- Option 2 before: Every decision must now be made and defended rather than found and checked, which is why its central lesson is about reporting.
- Option 2 after: As an intersection problem: the connections are wherever the path crosses a cell, listed with a direction flag per cell.
- Option 3 before: It begins running the deck, which is the step the course has deliberately deferred until its final module.
- Option 3 after: By projecting the path onto the structure map and completing each column it crosses in full.

### sim advanced final ord 6: fixed (duplicate)

- Flag: near duplicate of advanced module m01-trajectories ord 12 (merging a re-entered cell)
- Reason: Final copy rewritten to test what merging does for a path grazing a cell face, from lesson m01 l04.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: A trajectory enters the same cell twice. What does the intersector do?
- Prompt after: A path runs almost exactly along a cell face. What does merging do with the result?
- Explanation before: Two connections to the same cell would double-count the flow path. Simulators do accept duplicate COMPDAT records for a cell, and the result is exactly that double coupling.
- Explanation after: A step near a cell face can land alternately either side of it, which is a numerical artifact rather than a real feature of the well. Without merging there would be a long list of tiny connections, each with a well index near zero, and a well that appeared connected to twenty cells while barely producing.
- Option 0 before: It keeps both, because each represents a distinct interval of open wellbore with its own position in the sequence.
- Option 0 after: It keeps every short connection, since each is a real pass of the wellbore through a distinct cell.
- Option 1 before: It discards the second of the two visits, because the connection order is defined by first entry and a repeat would break that sequence.
- Option 1 after: It discards the whole trajectory, since a path alternating between two cells indicates a survey integration error that must be corrected before intersecting.
- Option 2 before: It merges the visits into one connection whose length is the total, because a cell has one pressure and the well one pressure there.
- Option 2 after: It collapses the rapid alternation between the two cells into two connections with sensible totals instead of many tiny ones.
- Option 3 before: It refuses the trajectory, because a path re-entering a cell indicates a survey integration error worth correcting.
- Option 3 after: It averages the two cells' properties into one connection placed on the shared face itself.

### sim advanced final ord 10: fixed (duplicate)

- Flag: near duplicate of intermediate module m05-wells-on-a-real-field ord 7 and of advanced module m02-the-history-schedule ord 5 (Ekene-1's January rate)
- Reason: Final copy rewritten to test when LRAT is the right history control mode, from lesson m02 l01.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Ekene-1 produced 998.5247575266284 stb in January 2023. What rate goes in the schedule?
- Prompt after: When is LRAT the right control mode for a history period?
- Explanation before: The days come from the actual calendar. A mean-month divisor gives a rate 1.8 percent high, which the simulator then applies over the 31 days the DATES block spans.
- Explanation after: LRAT honours total liquid, which suits a well on a pump with a known liquid capacity where the oil-water split is the uncertain part. ORAT honours oil and RESV honours reservoir volume. Each choice makes a different quantity exact and leaves the others free, so it decides what the match tests.
- Option 0 before: 32.804 stb/d, from dividing by the 30.4375-day mean month the prediction tail uses.
- Option 0 after: When oil is the best-measured stream at the separator, so the model should honour the oil rate and compute water and gas.
- Option 1 before: 32.210476049246076 stb/d, from dividing by January's own 31 days.
- Option 1 after: When a pump fixes the liquid and the oil-water split is uncertain.
- Option 2 before: 998.5247575266284 stb/d, since WCONHIST accepts the monthly volume when the periods are months.
- Option 2 after: When voidage is the quantity you trust most, as in the waterflood course's ledger of reservoir barrels.
- Option 3 before: 31.79 stb/d, from dividing by 31.4 days, the average month length over the calendar year 2023.
- Option 3 after: When the well has no reliable rate measurements at all, so the model is left to reproduce the observed pressures.

### sim advanced module m02-the-history-schedule ord 5: fixed (duplicate)

- Flag: near duplicate of intermediate module m05-wells-on-a-real-field ord 7 (Ekene-1's January rate from dividing by 31 days)
- Reason: Advanced module copy rewritten to test why history and forecast share one deck, from lesson m02 l04; the Professional module keeps the rate conversion.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Ekene-1 produced 998.5247575266284 stb in January 2023. What rate does the schedule carry, and how is it obtained?
- Prompt after: Why does Ekene's deck carry its history and its forecast in one file?
- Explanation before: The days come from the actual calendar. There is no uptime correction: a rate that reproduces the observed volume over the period is what the schedule wants, whether the well ran all month or not.
- Explanation after: Pressures, saturations and cumulative volumes carry across the join, so the forecast inherits the history's end state. Long studies often run the history once, save a restart and run many forecasts from it, which changes nothing about the physics; Ekene keeps both in one file because its history costs seconds.
- Option 0 before: 32.210476049246076 stb/d, from dividing by January's own 31 days rather than by any average month.
- Option 0 after: Because the forecast must start from the history's end state, and the only way to get that state is to run the history.
- Option 1 before: 32.804 stb/d, from dividing by the mean month of 30.4375 days the prediction tail also uses.
- Option 1 after: Because a restart file cannot be written from a history period, so a separate forecast would have to begin again from the initial state.
- Option 2 before: 998.5247575266284 stb/d, because WCONHIST accepts a monthly volume directly when the history is monthly.
- Option 2 after: Because the simulator resets pressures and saturations at the join unless both halves are read in a single pass of the same deck.
- Option 3 before: 32.210476049246076 stb/d, from dividing by 31 days and then correcting for the well's uptime in the month.
- Option 3 after: Because TSTEP is only legal after a DATES block.

### sim advanced module m02-the-history-schedule ord 7: fixed (duplicate)

- Flag: near duplicate of intermediate module m05-wells-on-a-real-field ord 9 (the round-trip check on a history schedule)
- Reason: Advanced module copy rewritten to test the rates-after-the-date off-by-one, from lesson m02 l03; the Professional module keeps the round trip.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: What does the round trip check on a history schedule consist of?
- Prompt after: A schedule writes each DATES block before the rates it was meant to close. What happens?
- Explanation before: It catches every divisor mistake at once and costs one line. It requires no simulator run, which is the point: the check is on the deck rather than on the results.
- Explanation after: A rate block applies from the current time to the next date, so the DATES that follows it defines its period. Written the other way round, January's rates apply to February and every volume lands a month late. The arithmetic is otherwise correct, so no total reveals it; plotting rates does.
- Option 0 before: Re-deriving each month's volume from the simulator's output vectors and comparing against the schedule's rates.
- Option 0 after: The validator refuses the deck, since each rate block must be closed by the DATES that follows it.
- Option 1 before: Multiplying each rate by the days its period spans, summing over wells and periods, and comparing against the ledger's own total.
- Option 1 after: The history shifts by a month: cumulative production is right while the timing is wrong, which a rate plot shows and a cumulative plot hides.
- Option 2 before: Comparing the schedule's first and last dates against the ledger's, confirming the two cover the same interval.
- Option 2 after: Nothing, since the simulator applies each rate block to the period whose date sits immediately above it.
- Option 3 before: Confirming that the number of rate blocks equals the number of dates, which catches a dropped or duplicated period.
- Option 3 after: The volumes double in every month, since each rate block is applied over two periods at once.

### sim advanced final ord 15: fixed (duplicate)

- Flag: near duplicate of advanced module m03-calibration ord 1 (calibration against validation)
- Reason: Final copy rewritten to test what the calibration does not establish, from lesson m03 l01.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: What separates a calibration from a validation?
- Prompt after: The regional mean has been calibrated to the booking. What does that calibration not establish?
- Explanation before: Both are legitimate. A study that calls a calibration a validation believes it has an independent check when it has none.
- Explanation after: The surface now reproduces one integral of the field. It could still be the wrong shape, put the crest in the wrong place or close in the wrong direction, and the volume would still match. With all six wells used in the interpolation there is nothing spare to check it against, so the model is calibrated and unvalidated.
- Option 0 before: A validation uses a measurement and a calibration uses another model's output, so only one is grounded in data.
- Option 0 after: That the volume matches, since a residual of minus 0.056 percent sits outside the stated tolerance.
- Option 1 before: A validation is performed once and a calibration is repeated whenever new data arrives during a study.
- Option 1 after: That the model reproduces the booking under the cell-centre convention, since the search ran on the column-clipped volume instead.
- Option 2 before: A validation is a test the model could fail; a calibration is an adjustment it cannot fail, only be tuned through.
- Option 2 after: That the structure is right: the surface reproduces one integral and could still put the crest in the wrong place.
- Option 3 before: A validation adjusts several parameters at once while a calibration adjusts exactly one of them against exactly one target.
- Option 3 after: That the porosity is right, since tuning the regional mean moves the porosity with it.

### sim advanced final ord 19: fixed (duplicate)

- Flag: near duplicate of advanced module m03-calibration ord 8 (the three sanity checks on the bisected answer)
- Reason: Final copy rewritten to test why the calibrated value belongs to the calibration, from lesson m03 l02.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Which three sanity checks does the tier apply to a bisected answer?
- Prompt after: Why is the calibrated regional mean a property of the calibration rather than of the field?
- Explanation before: 1570 m is about 10 m below the contact and a little below the deepest well at 1590 m. A calibrated mean of 1400 m, shallower than every well, would have signalled that something else was wrong.
- Explanation after: The search found the regional mean that makes this model reproduce this booking under the cell-centre clipping convention. Bisecting on the column-clipped volume, or on a different grid or variogram, gives a different value. The contact is mapped and was held fixed, and bisection is deterministic.
- Option 0 before: That it is physically reasonable, that it lies inside the bracket rather than at an edge, and that the volume responds in the expected direction.
- Option 0 after: Because it is the mean that makes this model reproduce this booking under this convention; change the grid, the variogram or the convention and it moves.
- Option 1 before: That it converged, that the residual is under tolerance, and that a second search from a wider bracket agrees with it.
- Option 1 after: Because the regional mean is measured at the wells, and the calibration only corrects it for the grid offset.
- Option 2 before: That it honours the six well tops, that it respects the contact, and that the resulting surface closes structurally.
- Option 2 after: Because bisection finds a different answer each time it runs, so the value carries the search's randomness.
- Option 3 before: That it is deeper than the contact, shallower than the deepest well, and inside the mapped area of the field.
- Option 3 after: Because the contact was adjusted along with it, so the two cannot be separated afterwards.

### sim advanced final ord 21: fixed (duplicate)

- Flag: exact-key duplicate of advanced module m03-calibration ord 13 (calibrating on cell count)
- Reason: Final copy rewritten to test the standard response to the concealed uncertainty, from lesson m03 l04.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Calibrating on cell count instead would give exactly 169 oil cells. What would the model hold?
- Prompt after: The regional mean is unconstrained, so the calibrated volume conceals an uncertainty. What is the standard response?
- Explanation before: Every forecast from that model would be low by a factor of two, because a forecast is a fraction of the oil in place. That is the decisive argument for matching volume.
- Explanation after: Hiding the uncertainty in a single number is the thing to avoid. Building the model at a shallower and a deeper regional mean and forecasting on all three converts a hidden assumption into a stated sensitivity. The residual is the size of the model's smallest step and cannot be driven to zero.
- Option 0 before: Roughly the booked volume, since matching area with the same isochore reproduces the same integral.
- Option 0 after: Recalibrate against the column-clipped volume as well, and report the midpoint of the two regional means as the field's best estimate.
- Option 1 before: Roughly half the booked volume, because most of those 169 cells would be partial columns rather than full ones.
- Option 1 after: Build the model at a shallower and a deeper regional mean too, run the forecast on all three, and report the spread.
- Option 2 before: Roughly twice the booked volume, since a tighter structure concentrates the oil into fuller columns at the crest.
- Option 2 after: Tighten the bisection tolerance until the residual is exactly zero, which removes the uncertainty.
- Option 3 before: The same volume, since on a monotonic surface the two objectives have the same solution.
- Option 3 after: Report the calibrated volume alone, since the booking already carries the uncertainty.

### sim advanced final ord 35: fixed (duplicate)

- Flag: exact-key duplicate of advanced module m05-reading-results ord 15 (field water cut matches, wells do not)
- Reason: Final copy rewritten to test the usual suspects when water arrives early everywhere, from lesson m05 l04.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: A field water cut matches and three of four wells do not. What does that pattern mean?
- Prompt after: In a history match, water arrives too early at every well. What are the usual suspects?
- Explanation before: It is invisible on a field plot, which is why the deck requests per-well water cut as well. Water arriving too early everywhere points at relative permeability or vertical communication instead.
- Explanation after: Water arriving too early everywhere means the model's sweep is too poor or its water too mobile, and the usual suspects are relative permeability and vertical communication. Water too late everywhere points at permeability that is too low or at connectivity the model does not have.
- Option 0 before: The observed per-well split is an allocation and only the field total is measured, so the per-well mismatch is expected.
- Option 0 after: Permeability that is too low or a connectivity the model does not have, which holds the water front back.
- Option 1 before: The relative permeability needs more than one saturation region, since a single curve cannot match wells that differ.
- Option 1 after: The allocation of the observed water between wells, since the per-well split is an allocation and only the field total is measured.
- Option 2 before: The total water is right and it is coming from the wrong places, which is the most common and most informative pattern.
- Option 2 after: The relative permeability and the vertical communication, since the model's sweep is too poor or its water too mobile.
- Option 3 before: The model's sweep is too poor, since compensating per-well errors always indicate an under-swept region.
- Option 3 after: The oil rate control, since ORAT forces water to arrive with the imposed oil.

### sim advanced final ord 42: fixed (duplicate)

- Flag: exact-key duplicate of advanced module m06-the-expert-reading ord 14 (the five steps on an unfamiliar deck)
- Reason: Final copy rewritten to test the four kinds of number the course names, from lesson m06 l03.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: What are the five steps the tier recommends on an unfamiliar deck?
- Prompt after: The course says every number in a deck is one of four kinds. Which four?
- Explanation before: If nothing was calibrated, ask why the model agrees with anything. If nothing could falsify it, the model is not making a claim. The security grep is worth doing on a deck from outside and it is not one of the five.
- Explanation after: Every tier came back to the same question: where did this number come from, and what was assumed to get it. The skill is knowing which of a deck's numbers are measurements, which are correlations, which are conventions and which are decisions, and being able to say so about each one.
- Option 0 before: Validate it, run it, check the initial oil in place against the booking, read the warnings, and plot the history match.
- Option 0 after: An input, an output, a default or a derived value, depending on which section of the deck it sits in.
- Option 1 before: Grep it for scripting and inclusion keywords, validate it against the parser, read every warning it raises, run the four comparisons, and recalibrate the regional mean.
- Option 1 after: A static property, a dynamic property, a control or an observation, sorted by whether it changes with time.
- Option 2 before: Read the RUNSPEC for dimensions and units, check the grid against the structure map, check the fluid against the laboratory report, run it, and read the results it writes.
- Option 2 after: Measured, assumed, copied or computed.
- Option 3 before: Read the six sections and note their line ranges, run the four external comparisons, find what was calibrated, read the warnings once, and ask what would falsify it.
- Option 3 after: A measurement, a correlation, a convention or a decision.

### sim beginner module m06-the-associate-reading ord 14: fixed (duplicate)

- Flag: module-to-module duplicate of beginner module m01-what-a-deck-is ord 5 (two thirds of the deck is SCHEDULE); also restated by beginner final 42 before its rewrite
- Reason: Module m06 copy rewritten to test how the side-track's completions differ from the vertical wells', from the tier summary in lesson m06 l01; m01 keeps the SCHEDULE proportion.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Two thirds of the Ekene deck is its SCHEDULE section. What does that proportion say about the study?
- Prompt after: The tier's summary lists seven wells. How were the side-track's completions obtained, unlike those of the six vertical wells?
- Explanation before: A deck that is nearly all GRID is a big static model with a short run; one with a tiny PROPS section is probably using defaults you should go and check. Ekene's GRID section is short precisely because its properties are constant and compress, and its PROPS section is a full set of tables.
- Explanation after: The summary describes six vertical Ekene wells completed through all five layers and one deviated side-track whose completions came from a trajectory rather than from a completion interval. A path that crosses columns has no single k1 and k2, which the Expert tier takes up.
- Option 0 before: It has an unusually detailed grid description, since the schedule carries the completions for every well and each one repeats the cell indices it connects.
- Option 0 after: From the vertical wells' own k1 and k2, copied across to each neighbouring column the side-track passes through, so every one receives five connections.
- Option 1 before: It was generated rather than written by hand, since a hand-written deck would balance the sections more evenly.
- Option 1 after: From the waterflood course's completion list, which named its cells directly.
- Option 2 before: It carries a long production history, one rate block and one date per month, which is what a history-matched study looks like from the outside.
- Option 2 after: From a trajectory, by finding the cells its path crosses, where each vertical well simply spans layers 1 to 5 of its own column.
- Option 3 before: It has been left largely at defaults elsewhere, which is why the few sections that do carry explicit data end up appearing disproportionately large by comparison.
- Option 3 after: From the perforated intervals on the side-track's log, each mapped to the nearest layer of the column beneath the heel, so all of them share one column.

### sim intermediate final ord 1: fixed (duplicate)

- Flag: duplicate of intermediate module m06-the-professional-reading ord 12 (894 of the 900 column depths are interpolated); module m01 ord 1 carries the same ratio
- Reason: Final copy rewritten to test the tell of a flat placeholder structure, from lesson m01 l01; the module questions keep the 894 of 900 point.
- Correct option or prompt changed: Duplicate rewritten into a new question testing a different point; the new correct option keeps the same answer_index and length rank.
- Prompt before: Ekene has six wells and 900 grid columns. What does that ratio say about the model's structure?
- Prompt after: What is the tell that a deck's structure is a flat placeholder nobody replaced?
- Explanation before: That is the normal condition of every reservoir model ever built, and saying it out loud is the point. The deck carries no uncertainty at all, and the wells were placed by drilling history rather than by a sampling design.
- Explanation after: Setting every column top to the average of the six wells gives a flat grid whose contact includes everything or nothing. It happens as a placeholder that nobody replaced, and the tell is a TOPS block that compresses to one repeat count. Exactness at the wells is what a zero-nugget interpolator does anyway.
- Option 0 before: That the model is under-constrained and its structure should not be used for volumetrics until more wells are drilled.
- Option 0 after: A crest that sits exactly on a mapped well top, since an exact interpolator puts it there.
- Option 1 before: That the six wells were placed to sample the structure evenly, which is why the interpolation between them is reliable.
- Option 1 after: A datum depth equal to the contact, which the equilibration forces for a flat grid.
- Option 2 before: That 894 of the 900 column depths are interpolated, so the structure of the model is a hypothesis carrying only six anchors.
- Option 2 after: A TOPS block that compresses to a single repeat count, because every column then carries the same depth.
- Option 3 before: That the interpolation carries an estimation variance the deck records alongside each column, which is how the structural uncertainty is propagated forward.
- Option 3 after: A TOPS block holding exactly six distinct values, one per mapped well, repeated across the columns nearest to each well.

### sim beginner module m06-the-associate-reading ord 4: fixed (other)

- Flag: editor note: the keyed option ('Giving the first saturation of SGOF instead') does not answer the prompt 'Which table have they actually read?'
- Reason: Prompt reworded to ask what mistake produced the 0, which every option (all phrased as mistakes) answers; key and options untouched.
- Prompt before: A learner submits 0 as the saturation at which the water-oil table begins. Which table have they actually read?
- Prompt after: A learner submits 0 for capstone field 4, the saturation at which the water-oil table begins. What mistake produced that?

### sim intermediate module m06-the-professional-reading ord 4: fixed (other)

- Flag: editor note: the keyed option ('Reporting the mapped top of 1565 m') does not answer the prompt 'What have they read?'; option 2 (kriged value at the well, also 1565 m) is a second defensible key once the prompt asks what produced 1565
- Reason: Prompt reworded to ask what mistake produced 1565 m; option 2 rewritten from the kriged-at-the-well value (also exactly 1565, a second key) to the cell-centre sampling, which gives the deck's shallower depth; explanation updated; key untouched.
- Prompt before: A learner submits 1565 m as the depth the model carries at Ekene-2. What have they read?
- Prompt after: A learner submits 1565 m for capstone field 4, the depth the model carries at Ekene-2. What mistake produced that?
- Explanation before: The check is that the answer should be shallower than 1565 and by less than a metre. If it equals 1565 exactly you have read the well database rather than the deck. Reading the kriged value at the well's own position is the same mistake seen from the other side, and it is the reason it happens.
- Explanation after: The check is that the answer should be shallower than 1565 and by less than a metre. If it equals 1565 exactly you have read the well database rather than the deck. The deck samples the surface at the centre of cell (23, 13), 50 m north of the well, which is why its depth differs from the mapped top.
- Option 2 before: Reporting the kriged value at the well's exact position, which is 1565 m and is what an exact interpolator must return there.
- Option 2 after: Reporting the depth at the centre of cell (23, 13), 50 m north of the well, which is where the grid samples the surface.

## stimulation

Migration: `migrations/20261021b_b4_fix_stimulation.sql`

### stimulation advanced module m06-the-expert-reading ord 10: fixed (double-key)

- Flag: distractors 0 and 3 also absent from bookkeeping, each arguably correct
- Reason: Non-Darcy flow and long-term creep are genuinely absent from the tier; replaced with closure crushing and gel residue/fines, which the tier does carry (catalogue interpolation at closure, damage factor 0.5).
- Option 0 before: Non-Darcy flow, which lowers the effective permeability at high rates once inertial losses build up in the pore throats of the pack.
- Option 0 after: Closure stress crushing, which this tier never applied, so the pack keeps the full catalogue permeability however hard the faces close.
- Option 3 before: Closure creep, which keeps narrowing the pack for years after the job as the grains slowly embed into the two faces of the fracture.
- Option 3 after: Gel residue and fines in the pack, which this tier ignored entirely, so the conductivity is credited with the whole laboratory figure.

### stimulation intermediate module m02-two-two-dimensional-models ord 10: fixed (double-key)

- Flag: option 2 restates the correct answer
- Reason: Option 2 was a longer paraphrase of the key; rewritten to misstate the half-length/height and model-name refusals (the lesson says all are refused).
- Option 2 before: It refuses non-positive rate, viscosity, half-length, height or modulus, and refuses a model name it does not recognise, yet it will not refuse a badly matched model and geometry.
- Option 2 after: It refuses a non-positive rate, viscosity or modulus, but it clamps a non-positive half-length or height to a small positive value and runs, and it falls back to PKN on a model name it does not know.

### stimulation intermediate module m03-width-net-pressure-and-height ord 14: fixed (double-key)

- Flag: option 2 same as correct
- Reason: Option 2 paraphrased the key; rewritten to apply the KGD height dependence (inverse, under the quarter power) to PKN. Explanation, which described volume and leakoff area rather than the keyed quantities, now explains the key.
- Explanation before: Fracture volume and leaking area both scale with height directly, so they halve alongside it.
- Explanation after: The PKN width bracket holds rate, viscosity, half-length and modulus and no height, so the width stays put, while PKN net pressure is E' w_max over twice the height, so halving the height doubles it.
- Option 2 before: The width is untouched since no height appears in its bracket, and the net pressure doubles because height divides it directly.
- Option 2 after: The width grows by the quarter power of two, since height sits inversely under the quarter power, and the net pressure doubles with it.

### stimulation intermediate module m05-where-the-models-stop ord 12: fixed (double-key)

- Flag: option 3 restates the correct option
- Reason: Option 3 paraphrased the key; rewritten to name viscous pressure drop and elastic compliance, which the models do contain (width from elasticity and viscous flow).
- Option 3 before: Dilatancy in the damaged rock at the tip, together with a lag region ahead of the fluid front that sits at very low pressure.
- Option 3 after: The viscous pressure drop in the fluid running up to the tip, and the elastic compliance of the rock that holds the crack faces apart.

### stimulation intermediate module m06-the-professional-reading ord 10: fixed (double-key)

- Flag: option 2 restates the correct option
- Reason: Option 2 paraphrased the key; rewritten to two conditions the engine does not refuse (bad model/geometry pairing, zero leakoff treated as no loss).
- Option 2 before: A modulus that is not positive and a Poisson ratio outside the open interval from zero to one half, which is what a value entered in field units rather than strict SI produces.
- Option 2 after: A half-length shorter than the height and a leakoff coefficient of exactly zero, which is what a value entered in field units rather than strict SI tends to produce.

### stimulation intermediate module m06-the-professional-reading ord 15: fixed (double-key)

- Flag: option 3 arguably correct
- Reason: Option 3 was the lesson statement (downstream of the same geometry, limits carried forward) and so also correct; rewritten to the false claim that the Expert tier replaces the geometry.
- Option 3 before: No, because the extra work of the Expert tier happens downstream of the same geometry, so every limit listed in module five is carried forward unchanged.
- Option 3 after: No, because the Expert tier sets the PKN and KGD geometry aside and builds the fracture from the pack outward, so the limits of module five no longer bind it.

## torquedrag

Migration: `migrations/20261021b_b4_fix_torquedrag.sql`

### torquedrag beginner final ord 31: fixed (double-key)

- Flag: explanation says options 2 and 3 also make it optimistic
- Reason: A factor fitted on the vertical section and a sparse survey both genuinely understate lateral loads, as the old explanation admitted; they now name a factor fitted on the lateral itself (already carries its cuttings) and rotation while tripping (lowers real drag), both wrong but tempting.
- Explanation before: A friction factor fitted elsewhere and a survey with too few stations would also make it optimistic, and the buckling one is the only one the model itself flags.
- Explanation after: A buckled string presses on the wall harder than soft string assumes, and the model flags it. A factor fitted on the same lateral already carries that lateral's cuttings, rotating while tripping lowers the real drag, and a finer step only moves the answer toward its converged value.
- Option 2 before: A friction factor fitted on the vertical section, missing lateral cuttings.
- Option 2 after: A friction factor fitted on the same lateral, which absorbs its cuttings.
- Option 3 before: A survey with too few stations, understating curvature and side force.
- Option 3 after: Rotating while tripping, which moves part of the friction out of the drag.

### torquedrag beginner module m06-the-associate-reading ord 10: fixed (double-key)

- Flag: explanation opens "All three are true"; option 1 true per other questions
- Reason: All three distractors were true statements from the tier (no drag on a vertical well, step matters in compression, pick up always largest); each now states the tier's point wrongly in a tempting way.
- Explanation before: All three are true. The first is the one that changes how you read every report the model produces.
- Explanation after: Every number in this tier is a geometry you can check times a friction factor somebody chose, and that constant is the subject of the next tier. The vertical well has no drag at any friction factor, the step matters where the string is in compression, and pick up is always the largest of the three hookloads.
- Option 1 before: That the vertical well has no drag, whatever friction factor the model is set to use.
- Option 1 after: That the vertical well's drag grows with the friction factor, just as every other well's does.
- Option 2 before: That the step size matters most where the string is in compression, which is where the model is least reliable anyway.
- Option 2 after: That the step size matters most where the string is in tension, which is where the friction accumulates fastest.
- Option 3 before: That pick up is always larger than slack off, which is the ordering the sign of the axial friction produces.
- Option 3 after: That rotating off bottom always gives the largest of the three hookloads, since rotation adds friction.

### torquedrag intermediate final ord 39: fixed (double-key)

- Flag: explanation says heavier mud "does help", undercuts option 2
- Reason: A heavier mud does lower the buoyed weight and so the side force, which the explanation conceded; the distractor now proposes a lighter mud with the buoyancy mechanism misapplied (a higher buoyancy factor makes the string heavier).
- Explanation before: A heavier mud reduces the buoyed weight and therefore the side force, so it does help, and it also raises the equivalent circulating density.
- Explanation after: Torque is friction acting at the contact radius, so the levers are the friction factor, through mud or torque reduction subs, the pipe's contact radius, and a rotary steerable in place of sliding. A lighter mud raises the buoyancy factor, which makes the buoyed string heavier and raises the side force, and the step is a numerical setting that changes no physical load.
- Option 2 before: A heavier mud, which raises the buoyancy factor and lightens the string.
- Option 2 after: A lighter mud, which raises the buoyancy factor and so lightens the string.

### torquedrag intermediate final ord 40: fixed (double-key)

- Flag: explanation calls refitting "a real consequence"; option 3 arguably correct
- Reason: Refitting a factor that was fitted at the coarse step is a legitimate consequence; the distractor now proposes tuning the friction factor to make the coarse run reproduce the finer answer, which hides a numerical error inside the factor.
- Explanation before: The refitting point is a real consequence if a calibration was done at the coarse step, and it follows from the first.
- Explanation after: A kilonewton of movement under refinement is discretisation, so the default step is too coarse for that case and should be refined until the answer stops moving. Tuning the friction factor to cover it would make the factor absorb a numerical error, and the oracle is converging too.
- Option 3 before: The friction factor should be refitted at the finer step, as the fit used a coarse run.
- Option 3 after: The friction factor should be tuned until the 10 m run matches the finer answer.

### torquedrag advanced module m03-casing-wear ord 14: fixed (double-key)

- Flag: options 1 and 2 nearly the same field calibration
- Reason: Backing a wear factor out of an offset caliper log is taught in m04 l04 and keyed correct in advanced final 19, so both caliper options were defensible; they now name a friction-factor scaling and a derivation from the T&D run itself, neither of which yields the constant.
- Explanation before: Fitting to a caliper log is a real and better option when one exists, and it is the field-calibrated version of the same number.
- Explanation after: The wear factor is measured by running a joint against a casing sample in a laboratory rig and measuring the volume removed. It is a separate constant from the friction factor, and the side force and sliding distance are what it multiplies. A caliper log can later calibrate it, which is a second step on top of the laboratory number.
- Option 1 before: By fitting it to a caliper log.
- Option 1 after: By scaling the friction factor.
- Option 2 before: By back-analysis of wells with a caliper log, the way friction factors are obtained.
- Option 2 after: From the torque and drag run itself, as side force times the sliding distance.

### torquedrag intermediate module m02-torque ord 15: fixed (double-key)

- Flag: explanation says downhole measurement is "genuinely better"
- Reason: A near-bit downhole torque tool does separate the two where it exists, so option 2 was defensible; it now proposes comparing two on-bottom readings at different weights on bit, which fails because weight on bit changes the side force and so the friction torque (m02 l04).
- Explanation before: A downhole measurement is genuinely better where it exists. The pick-up-and-read comparison is what a driller can do on every connection.
- Explanation after: An off-bottom reading and an on-bottom reading at the same depth minutes apart is what a driller can take on every connection. Going on bottom changes the side force as well as adding the bit torque, so the two are coupled, and the engine takes the bit torque as an input rather than computing it.
- Option 2 before: Measure the torque with a downhole tool near the bit, which is the only method that separates the two directly.
- Option 2 after: Compare two on-bottom readings at different weights on bit, as friction torque does not depend on it.

### torquedrag beginner final ord 15: fixed (duplicate)

- Flag: near duplicate of intermediate module m02-torque ord 9 (friction share of surface torque)
- Reason: Same question and answer as the Professional module question, kept there; the beginner final copy now tests a point of beginner m02 l04 no question covered: why piston, ballooning and thermal effects can be left out of a drill string.
- Correct option or prompt changed: The question is replaced by a new one on a different point, so its key is new text; answer_index stays 1.
- Prompt before: How much of a deviated well's surface torque is friction rather than bit torque?
- Prompt after: Why can the model leave out piston forces, ballooning and thermal length change on a drill string?
- Explanation before: That high friction share is why torque is a better hole-condition indicator than hookload on a long well.
- Explanation after: Pressure inside and outside the string produces piston forces and ballooning, and temperature changes its length. For a drill string both are second order, so one mud density and a single buoyancy factor serve; for a completion string they are first order, which is why completion analysis uses a different model.
- Option 0 before: About half.
- Option 0 after: They cancel along the string.
- Option 1 before: Around 80 to 90 percent on the wells in this course.
- Option 1 after: Because for a drill string they are second order effects.
- Option 2 before: Nearly all of it, since bit torque is applied at the bit and is attenuated to nothing by the time it reaches surface.
- Option 2 after: Because the buoyancy factor already includes them, as it is computed from the pressure of the mud on the string.
- Option 3 before: It depends on the rate of penetration, which sets the bit torque, and cannot be stated without knowing it.
- Option 3 after: Because the midpoint predictor corrects each interval for pressure and temperature as the recursion marches up.

### torquedrag intermediate module m02-torque ord 9: judged fine (duplicate)

- Flag: near duplicate of beginner final ord 15
- Reason: Kept as the module question; the beginner final copy was rewritten to a different point.

### torquedrag advanced final ord 27: fixed (duplicate)

- Flag: same key as intermediate module m05-against-the-oracle ord 12 (what the vertical case does not settle); prompt also dangles on "that case"
- Reason: Same concept and identical key as the Professional module question, kept there; the advanced final copy now asks, self-contained, what makes the weight integral the plausible source of the small residual (advanced m05 l04), a point no question tested.
- Correct option or prompt changed: The question is replaced by a new one on a different point, so its key is new text; answer_index stays 1.
- Prompt before: What does that case NOT settle?
- Prompt after: What makes it plausible that the small residual between the engine and its oracle comes from the weight integral?
- Explanation before: It exercises the weight integral, the buoyancy factor, the composition lookup and the grid, and none of the friction machinery.
- Explanation after: The residual settles at a few tens of newtons on every well, including the least deviated, and the oracle is 42.6 N off the vertical well's closed form, which has no friction in it. That points at the weight integral. It is plausible and not proved, because the vertical well never exercises the friction terms.
- Option 0 before: Whether the buoyancy factor is right.
- Option 0 after: It halves each time the step is halved.
- Option 1 before: Whether the engine is right on the friction, curvature and direction-cosine terms.
- Option 1 after: The residual appears on every well, including the least deviated of them.
- Option 2 before: Whether the string composition lookup is right, as all three occur.
- Option 2 after: It is largest on the horizontal well, where friction is highest.
- Option 3 before: Whether the integration grid is right, since the recursion walks it all.
- Option 3 after: It vanishes on the vertical well, which has no friction terms.

### torquedrag intermediate module m05-against-the-oracle ord 12: judged fine (duplicate)

- Flag: same key as advanced final ord 27
- Reason: Kept as the module question; the advanced final copy was rewritten to a different point.

### torquedrag intermediate final ord 33: fixed (duplicate)

- Flag: lead review: intermediate final 33 duplicates intermediate module m02-torque ord 10 (why going on bottom adds less than the bit torque)
- Reason: Same concept and answer as the module question, kept there; the final copy now asks for the catch in using surface torque as the hole-condition signal (intermediate m02 l03), a point no question tested.
- Correct option or prompt changed: The question is replaced by a new one on a different point, so its key is new text; answer_index is unchanged.
- Prompt before: Going on bottom raises the torque by less than the bit torque on three of five wells. Why?
- Prompt after: Torque is the better hole-condition signal on a long well. What is the catch?
- Explanation before: On the horizontal well the effect reverses and the torque rises by more, because a buckling string presses outward.
- Explanation after: The better signal comes through a worse instrument. Top drive torque is noisy, affected by the drive's own losses and swings hard in stick-slip, so both readings are watched and a downhole measurement near the bit is better than either. The friction share grows with the lateral, and the tool joint radius carries the moment.
- Option 0 before: The bit torque is partly absorbed by the mud motor before it reaches the drill string above.
- Option 0 after: Its friction share falls as the lateral lengthens, so the signal weakens on exactly the wells where it matters.
- Option 1 before: The rotary speed falls when weight is applied, which changes the tangential share of the friction.
- Option 1 after: It needs a friction factor fitted to torque, because a factor fitted to a hookload cannot be used to predict it.
- Option 2 before: The engine applies the bit torque as a boundary condition rather than adding it to the surface value.
- Option 2 after: It is set by the pipe body radius, which wear changes, so the same friction reads differently over time.
- Option 3 before: The compression it adds reduces the side force in the curved sections near the bit.
- Option 3 after: It comes through the top drive, a noisy instrument with its own losses that swings in stick-slip.

### torquedrag intermediate module m02-torque ord 10: judged fine (duplicate)

- Flag: lead review: duplicate of intermediate final 33
- Reason: Kept as the module question; the final copy was rewritten to a different point.

### torquedrag intermediate module m06-the-professional-reading ord 15: fixed (duplicate)

- Flag: lead review: intermediate module m06 ord 15 duplicates intermediate module m02-torque ord 9 (friction share of surface torque)
- Reason: Same fact as the teaching module question, kept there; the summary-module copy now asks for the units of the capstone side force and why they matter (intermediate m06 l02 traps), a point no question tested.
- Correct option or prompt changed: The question is replaced by a new one on a different point, so its key is new text; answer_index is unchanged.
- Prompt before: What is the friction share of surface torque on a deviated well, and why does it matter?
- Prompt after: The capstone asks for a maximum side force. What units does the engine report it in, and why does that matter?
- Explanation before: The signal comes through a noisier instrument, which is why both are watched and a downhole measurement beats either.
- Explanation after: The engine reports side force as force per unit length of string, so the capstone field is in N/m. A total force over an interval would be a much bigger number, and the maximum is a summary of the whole profile rather than the value at one depth.
- Option 0 before: Around 83 to 90 percent, which is why torque is the better hole-condition indicator.
- Option 0 after: Newtons per metre, since side force is per unit length of string, and a total over an interval is far larger.
- Option 1 before: About half, so both signals are equal.
- Option 1 after: Newtons, as a total contact force.
- Option 2 before: Nearly nothing, since the bit torque dominates the surface reading.
- Option 2 after: Newton-metres, since it is a moment about the pipe axis.
- Option 3 before: It depends on the rate of penetration, so no general statement is possible.
- Option 3 after: Newtons per square metre, as a contact pressure on the wall.

### torquedrag beginner final ord 34: fixed (defect)

- Flag: lead review: prompt "why is torque zero while sliding above the motor" contradicts beginner m04 l04 and module m04 ord 5 (surface torque is exactly the bit torque, 2700 N.m)
- Reason: The engine starts the torque at the bit torque and adds no tangential friction with ft = 0, so the torque along the string while sliding is the bit torque (l04 table: 2700 N.m on every well); it is the FRICTION torque that is zero. The prompt now asks that, the key stands, and the explanation agrees; module m04 ord 5 was already right.
- Prompt before: Why is torque zero while sliding above the motor?
- Prompt after: Why does sliding add no friction torque anywhere above the motor?
- Explanation before: The surface torque equals the bit torque exactly, and that is true on every well in this course.
- Explanation after: With no rotation above the motor the tangential direction cosine is zero, so no friction torque accumulates. The surface torque is the bit torque alone, 2700 N.m on every well in this course, which is why sliding is not a zero-torque operation at surface.

### torquedrag beginner module m04-the-operations ord 5: judged fine (defect)

- Flag: lead review: checked against beginner final 34 on sliding torque
- Reason: Matches beginner m04 l04 and the engine (torque starts at the bit torque, ft = 0 while sliding): surface torque is exactly the bit torque; the contradiction was in final 34, now fixed.

## uncertainty

Migration: `migrations/20261021b_b4_fix_uncertainty.sql`

### uncertainty beginner final ord 37: fixed (duplicate)

- Flag: duplicate of beginner module m06-the-associate-reading 12 (near p0.63 k0.72): both ask how the sampled breakeven percentiles are named, same key
- Reason: True duplicate of the m06 question; kept the module question and rewrote the final copy to test the m06 story-so-far point on how many ledger years pay tax.
- Correct option or prompt changed: True duplicate rewritten into a new question on a different point, so the key is new text for the new question.
- Prompt before: ISIALA's sampled breakeven over 5000 iterations returns 62.1713, 73.3297 and 85.5912 USD per bbl. How are they reported?
- Prompt after: Across ISIALA's twenty ledger rows tax is positive in some years and 0.0000 in others. How many years pay tax, and what sets the others to 0.0000?
- Explanation before: A breakeven price takes no P-label at all, which two of the wrong readings apply; the base case at the stated medians is 71.6277, a single run and not a percentile.
- Explanation after: Capex is expensed in the year it is spent, so revenue less royalty, capex and opex is negative in 2027 and 2028 and tax is 0.0000 there. No loss is carried forward, so 2029 pays 35 percent of its own positive base, 19.3660, and tax is positive in 18 of 20 years.
- Option 0 before: As a Low case P90 of 62.1713, a Best case P50 of 73.3297 and a High case P10 of 85.5912, as for any outcome of a model.
- Option 0 after: 20 of 20: capex is split half and half over 2027 and 2028, and an even split keeps both years' taxable income above zero.
- Option 1 before: As P10 62.1713, P50 73.3297 and P90 85.5912, since for a price the labels simply follow the sorted order of the sample.
- Option 1 after: 18 of 20: the last two years pay 0.0000, because by then the declined volume no longer covers the opex and the royalty.
- Option 2 before: As a Base of 62.1713, a median of 73.3297 and an upside of 85.5912, spread around the stated-median breakeven of 71.6277.
- Option 2 after: 16 of 20: the losses of 2027 and 2028 are carried forward and shelter 2029 and 2030 as well, before tax resumes in 2031.
- Option 3 before: As the 10th percentile, median and 90th percentile of breakeven price, because a higher breakeven is worse.
- Option 3 after: 18 of 20: capex is expensed in 2027 and 2028, so taxable income is negative there and those two years pay 0.0000.

## waterflood

Migration: `migrations/20261021b_b4_fix_waterflood.sql`

### waterflood advanced final ord 40: judged fine (other)

- Flag: explanation quotes a 2023-04 trough miss no option uses; judge
- Reason: the trough miss is the evidence that rebuts option 1 (interpolated track more accurate than the model track); explanation is consistent with the key and the lessons

### waterflood intermediate final ord 21: fixed (duplicate)

- Flag: near duplicate of intermediate m03-advice ord 11 (differentiated targets double count a belief; same argument and key)
- Reason: kept the module question; rewrote the final copy to test the deliverability argument from the same lesson (m03 l04: Ekene-4 is the well whose injectivity degrades)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: The lesson gives an argument that differentiated targets can double count a belief. What is it?
- Prompt after: Holding the South element at the field target means sending much more water through Ekene-4. Why does the lesson count that as an argument for a separate South target?
- Explanation before: Connectivity judgements live in the matrix. Encoding the same belief a second time as a lower target for that element counts it twice and puts it in two places, which makes the recommendation harder to audit. Simplicity is also worth something: one field target is easier to operate against and harder to let quietly drift.
- Explanation after: This is the deliverability argument: increasing the South element means pushing harder on Ekene-4, the well whose injectivity degrades, and a target that cannot be delivered is not a target. At 1.05 the South scale is 1.726255853400599, inside the clamp; the scale rule knows nothing about injectivity; and the well that has never produced water is the producer Ekene-5.
- Option 0 before: A belief that one element is less connected belongs in the allocation matrix, which already encodes it once.
- Option 0 after: Because Ekene-4 is the well whose injectivity degrades, and a target that cannot be delivered is not a target.
- Option 1 before: Applying two targets means running the scale rule twice, which compounds the proportional correction.
- Option 1 after: Because the clamp caps the South scale at 2.0, so Ekene-4 cannot lift the element to the target.
- Option 2 before: A differentiated target changes the rolling window as well as the scale.
- Option 2 after: Because Ekene-4 has never produced water, so the flood response there is unproven.
- Option 3 before: The clamp is applied per element, so two targets mean two clamps and an element can be limited twice.
- Option 3 after: Because the scale rule already caps Ekene-4 at its Hall slope limit, so the rest falls short.

## wellcontrol

Migration: `migrations/20261021b_b4_fix_wellcontrol.sql`

### wellcontrol beginner final ord 14: fixed (other)

- Flag: distractor "The theoretical liner displacement" arguably partly correct to "what kind of quantity"
- Reason: the theoretical displacement is also a volume a liner change alters; replaced it with the volumetric efficiency, a dimensionless ratio the engine has no term for (m02 l03)
- Option 3 before: The theoretical liner displacement, before any allowance for leakage or compressibility.
- Option 3 after: A dimensionless efficiency: the fraction of the swept volume the pump delivers.

### wellcontrol intermediate final ord 2: fixed (duplicate)

- Flag: near duplicate of beginner final 39 (identical key: the two shut-in gauge readings and the pit gain; intermediate m01 ord 2 asks it too)
- Reason: kept beginner final 39; rewrote this one to test what the kill sheet does NOT output (intermediate m01 l01: whether the shoe will hold is the separate kick tolerance call)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: Which three inputs come only from the kick?
- Prompt after: All four outputs of the kill sheet are filled in. Which question about the well does the sheet still leave unanswered?
- Explanation before: Everything else belongs to the standing part and is kept current between events.
- Explanation after: Formation pressure, kill mud density and the two circulating pressures are the outputs, with the schedule and the stroke counts between them. Whether the shoe will hold is the kick tolerance calculation, a separate call; the casing pressure history and the choice of method are not outputs either.
- Option 0 before: The pump output, the mud weight and the bit depth.
- Option 0 after: What the string gauge should read once the kill mud has reached the bit and beyond.
- Option 1 before: The two shut-in gauge readings and the pit gain.
- Option 1 after: Whether the shoe will hold, which is a separate call.
- Option 2 before: The slow circulating rate pressure at both rates, together with the volumetric efficiency measured at the same time.
- Option 2 after: How heavy the kill mud has to be to balance the formation at the bit, since that needs the influx density first.
- Option 3 before: The fracture gradient, the pore pressure and the temperature, all of which change as the section is drilled.
- Option 3 after: How many strokes it takes to get kill mud from surface to the bit, which depends on the pump rate chosen.

### wellcontrol advanced module m05-the-edges-of-the-model ord 1: fixed (duplicate)

- Flag: near duplicate of beginner m01 ord 12 (BOP at surface with no riser and no choke line; beginner final 41 asks it as well)
- Reason: kept the beginner module question; rewrote this one to test what the surface-BOP assumption leaves out of the volumes (advanced m05 l01)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: What does this engine assume about the blowout preventer's position?
- Prompt after: On a floating rig, which volumes are absent from this engine's span walk altogether?
- Explanation before: Every number the engine produces is correct for a land or jack-up well and needs correcting on a floater.
- Explanation after: The engine assumes the annulus runs from the bit to a surface gauge. On a floater the returns come up a riser or, during a kill, a choke line from the seabed stack, and those volumes are not in the span walk at all, so the volumes and stroke counts need a correction along with every casing pressure.
- Option 0 before: That it sits on the seabed, with the choke line friction measured and removed.
- Option 0 after: The string above the seabed, since the walk starts its annulus at the stack.
- Option 1 before: That it is close enough to surface for the choke line friction to be negligible at the rates used during a kill.
- Option 1 after: The open hole below the last shoe, since the walk treats the whole annulus as cased to total depth on a floater.
- Option 2 before: That it sits at surface, with no riser and no choke line below it.
- Option 2 after: The riser and the choke line, which run from the seabed to the rig.
- Option 3 before: That its position does not matter, because the calculation works from true vertical depths rather than from geometry.
- Option 3 after: The annulus around the collars, since on a floater the walk uses one average capacity for the whole open hole.

### wellcontrol beginner final ord 41: fixed (duplicate)

- Flag: lead follow-up: near duplicate of beginner m01 ord 12 (BOP at surface with no riser and no choke line; same key, same tier)
- Reason: true duplicate within the tier; kept the module question and rewrote the final copy to test what closing the BOP achieves (m01 l01: secondary barrier, buys time, does not kill the well)
- Correct option or prompt changed: duplicate rewritten into a new question; answer_index kept, correct option is the new key
- Prompt before: Where is the stack taken to be, and what lies between it and the gauges?
- Prompt after: The well is shut in on a kick. What has closing the blowout preventer achieved?
- Explanation before: The Expert tier states the assumption formally and supplies the offshore correction.
- Explanation after: The blowout preventer is the secondary barrier. It holds the influx back from surface while the primary barrier, the mud column, is repaired: it buys time to read the formation pressure and to build a mud that balances it. Closing it does not kill the well.
- Option 0 before: That it is at surface, with no riser and no choke line between it and the gauges.
- Option 0 after: It has bought time to find the formation pressure and build kill mud; the well is not yet killed.
- Option 1 before: That it is a subsea stack on a floater.
- Option 1 after: It has killed the well by sealing off the formation.
- Option 2 before: That it is rated well above any pressure the well can develop, so its rating never appears in the arithmetic.
- Option 2 after: It has restored the primary barrier, since the trapped pressure now stands in for the missing mud weight for good.
- Option 3 before: That it is kept closed for the whole operation, including the period while the kill mud is being circulated round.
- Option 3 after: It lets the influx be bled off at the choke, after which drilling simply carries on at the same mud weight.

## wellcorrelation

Migration: `migrations/20261021b_b4_fix_wellcorrelation.sql`

### wellcorrelation beginner final ord 4: fixed (duplicate)

- Flag: near duplicate of module m03-the-structural-section ord 2 (same 167 m span from the same two picks)
- Reason: trivial reword of the module question, which is kept; rewritten to m05 l03: reading the flattened TOP_A line as the TOP_A to TOP_SAND interval (deepest point = thinnest interval).
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: In the structural view of the Ekene fixture the shallowest pick is Ekene-3 TOP_A at 1495 m and the deepest is Ekene-2 TOP_B at 1662 m. What is the displayed depth span of that view?
- Prompt after: On the panel flattened on TOP_SAND at 1500 m, TOP_A displays at 1452, 1447, 1454 and 1440 m in Ekene-1 to Ekene-4. What does the deepest of those four points tell you?
- Explanation before: 1662 minus 1495 is 167 m. In the structural view every shift is zero, so the displayed span equals the true measured depth span of the picks.
- Explanation after: With TOP_SAND pinned at 1500 m, each flattened TOP_A depth is 1500 minus that well's TOP_A to TOP_SAND interval, so the deeper the point sits the thinner the interval. Ekene-3 at 1454 m has 46 m, the thinnest. Structurally it is the highest well, and its shift of -41 m is the smallest of the four.
- Option 0 before: 150 m
- Option 0 after: Ekene-3 is the structurally lowest well on TOP_A, since its point hangs deepest on the panel
- Option 1 before: 157 m
- Option 1 after: Ekene-3 has the thickest TOP_A to TOP_SAND interval, since its line sits deepest there
- Option 2 before: 162 m
- Option 2 after: Ekene-3 carries the largest flattening shift, so it moved furthest of the four to reach the datum
- Option 3 before: 167 m
- Option 3 after: Ekene-3 has the thinnest TOP_A to TOP_SAND interval, 1500 minus 1454 giving 46 m

### wellcorrelation beginner final ord 14: fixed (duplicate)

- Flag: near duplicate of module m03-the-structural-section ord 7 (same TOP_A picks, same 35 m key)
- Reason: trivial reword of the module question, which is kept; rewritten to m03 l04: the SAND thickness ranking differs from the structural ranking, so the thickest well is the third highest.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: TOP_A is picked at 1500 m in Ekene-1, 1512 m in Ekene-2, 1495 m in Ekene-3 and 1530 m in Ekene-4. What is the structural relief on TOP_A across the four wells?
- Prompt after: Structurally the Ekene wells rank Ekene-3, Ekene-1, Ekene-2, Ekene-4 from high to low. How does their ranking by SAND gross thickness compare?
- Explanation before: Relief is the deepest pick minus the shallowest pick on that surface, so 1530 minus 1495 gives 35 m. Ekene-4 is the structurally lowest well on TOP_A and Ekene-3 the highest.
- Explanation after: By SAND gross thickness the wells rank Ekene-2 at 36 m, Ekene-1 at 32 m, Ekene-3 at 29 m and Ekene-4 at 25 m, a different order from the structural one, so the thickest well is the third highest. Thickness comes from the pick table in either view; the pattern is simply hard to see on the structural panel.
- Option 0 before: 17 m
- Option 0 after: They match, since the structurally highest well on a structure always holds the thickest sand of the section
- Option 1 before: 35 m
- Option 1 after: They differ: Ekene-2 is thickest and Ekene-4 thinnest, so the thickest is only third highest
- Option 2 before: 30 m
- Option 2 after: They run exactly in reverse, with the lowest well holding the thickest sand
- Option 3 before: 45 m
- Option 3 after: They cannot be compared, since thickness is only defined on a flattened section

### wellcorrelation beginner final ord 15: fixed (duplicate)

- Flag: near duplicate of module m03-the-structural-section ord 6 (same TOP_SAND picks, same 49 m key; also a capstone-graded value)
- Reason: trivial reword of the module question, which is kept; rewritten to m05 l04: an interpolated TOP_B depth for Ekene-4 is inference, kept in the report and never entered as a pick.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: TOP_SAND is picked at 1548, 1565, 1541 and 1590 m in Ekene-1 to Ekene-4. What is the structural relief on TOP_SAND?
- Prompt after: TOP_B sits about 60 m below BASE_SAND in Ekene-1 to Ekene-3, so in Ekene-4, whose BASE_SAND is at 1615 m, it would be expected near 1675 m. What should be done with that estimate?
- Explanation before: 1590 minus 1541 is 49 m. Relief must be read in the structural view, where all shifts are zero. In a section flattened on TOP_SAND the same surface displays flat, which would wrongly suggest zero relief.
- Explanation after: About 1675 m is a reasonable geological expectation and it is not a pick. Typing it into the tops table turns an expectation into data that nobody will later tell apart from a real pick, so the line stays short and the estimate stays in the report as inference. Nothing points to faulting: Ekene-4 simply ended above TOP_B.
- Option 0 before: 49 m
- Option 0 after: Keep it in the report labelled as inference, and leave Ekene-4 with no TOP_B pick on the section
- Option 1 before: 42 m
- Option 1 after: Enter it as the Ekene-4 TOP_B pick, so the correlation line can reach all four wells
- Option 2 before: 25 m
- Option 2 after: Enter it as a provisional pick, so TOP_B relief can be quoted as a four-well number
- Option 3 before: 0 m
- Option 3 after: Discard it, since a missing top is itself evidence that TOP_B was faulted out there

### wellcorrelation beginner final ord 22: fixed (duplicate)

- Flag: near duplicate of module m04-flattening-and-datums ord 3 (same Ekene-2 shift, same -65 m key; also a capstone-graded value)
- Reason: trivial reword of the module question, which is kept; rewritten to m04 l03 'reliably picked': an uncertain datum pick moves every other surface in that well by the same amount.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Ekene-2 has TOP_SAND at a measured depth of 1565 m. The section is flattened on TOP_SAND with a datum of 1500 m. What shift is applied to Ekene-2?
- Prompt after: The datum pick in one well is uncertain by 10 m. What does that uncertainty do to that well on the flattened panel?
- Explanation before: The shift is datum minus the measured depth of the flattening top, so 1500 minus 1565 gives -65 m. The sign is negative because the pick sits below the datum and must be lifted to reach it.
- Explanation after: The datum pick sets that well's shift, and the shift is applied to every top in the well, so a 10 m error in the anchor moves every other surface in the well by 10 m on the display. Thicknesses inside the well are unaffected because both ends take the same shift, and the other wells keep their own shifts. That is why the datum should be a reliably picked top.
- Option 0 before: +65 m
- Option 0 after: It spreads across all four wells, since the shifts are solved together as one set
- Option 1 before: -65 m
- Option 1 after: It moves every other surface in that well by the same 10 m on the display
- Option 2 before: -1500 m
- Option 2 after: It changes the zone thicknesses in that well, since the shift reaches only one end of each zone
- Option 3 before: +1565 m
- Option 3 after: It moves only the datum top, since the other picks in that well keep their own depths

### wellcorrelation beginner final ord 29: fixed (duplicate)

- Flag: near duplicate of module m05-zones-and-correlation-lines ord 5 (same Ekene-3 picks, same 29 m key; also a capstone-graded value)
- Reason: trivial reword of the module question, which is kept; rewritten to m05 l01: BASE_SAND is an ordinary pick and the interpreter decides which pair of picks bounds a zone.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Ekene-3 has TOP_SAND at 1541 m and BASE_SAND at 1570 m. What is the gross thickness of the SAND zone in Ekene-3?
- Prompt after: In the data model BASE_SAND is stored exactly like TOP_SAND, as a named pick with a measured depth. What makes it the base of the SAND zone?
- Explanation before: 1570 minus 1541 is 29 m. A zone spans between its two bounding tops in a single well, so its gross thickness is simply the difference of those two measured depths.
- Explanation after: Software treats every picked surface the same way. The engine's zoneSpan is handed the names of the upper and lower bounding tops, so it is the interpreter who decides which pair bounds a zone. There is no base flag, and no automatic pairing by name or by depth.
- Option 0 before: 32 m
- Option 0 after: A base flag stored with the pick that marks it as closing a zone
- Option 1 before: 36 m
- Option 1 after: Its name, since the engine pairs any BASE_ pick with the TOP_ pick of the same name
- Option 2 before: 29 m
- Option 2 after: The interpreter's choice of which two picked surfaces bound the SAND zone
- Option 3 before: 25 m
- Option 3 after: Its depth, since the engine treats the next pick below any top as that top's base

### wellcorrelation beginner final ord 8: fixed (duplicate)

- Flag: same concept and same answer as module m02-formation-tops ord 1 (the three things a top carries: name, well, measured depth)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m02 l01: why tops are versioned, attributable and challengeable (a top is an interpretation).
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: A formation top has been picked. What is the minimum set of information that makes it a usable record?
- Prompt after: Tops are described as versioned, attributable and challengeable. Why?
- Explanation before: A top is an interpretation that carries a surface name, the well it was picked in, and the measured depth of the pick. Without all three the pick cannot be placed on a section or joined to picks in other wells.
- Explanation after: A top is an interpretation: it records a belief about where a surface is penetrated, and competent interpreters can differ by a metre or two. So tops change as understanding changes, it matters who picked them and when, and a correlation resting on a weak pick can be challenged. A log reading is the thing a tool reproduces.
- Option 0 before: A depth and a log curve name
- Option 0 after: Because each one is a tool reading, reproduced whenever the same log is run down the hole again
- Option 1 before: A name and a depth, with the well inferred from context
- Option 1 after: Because the engine keeps several depths under each name and averages them when it draws a line
- Option 2 before: A name, a depth and the interpreter's confidence score
- Option 2 after: Because a second interpreter must approve each top before it is drawn
- Option 3 before: A name, the well it belongs to, and a measured depth
- Option 3 after: Because each one records an interpreter's argument, which can change and has an author

### wellcorrelation beginner final ord 9: fixed (duplicate)

- Flag: same concept and same answer as module m02-formation-tops ord 10 (a mistyped sand name adds a phantom surface and splits the line)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m02 l04 'missing is not zero': an absent top is excluded or reported, never treated as zero.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: An interpreter types the Ekene-2 sand pick as TOP_SND instead of TOP_SAND. What happens on the section?
- Prompt after: Ekene-4 has no TOP_B. How should a calculation that touches TOP_B treat that missing top?
- Explanation before: Correlation lines are built by matching names. A typo produces a new surface that owns exactly one pick, and it simultaneously removes that well from the real surface's line. Name consistency is a QC item for this reason.
- Explanation after: Missing is not zero. An absent top is neither a top at depth zero nor a zero thickness: it is the absence of information, so every calculation that touches it should exclude that well or say that it did. Filling it with an estimate turns an observation into a guess.
- Option 0 before: The pick is rejected, because only known surface names are accepted
- Option 0 after: As a top at depth zero, so the well still adds a value to every TOP_B statistic
- Option 1 before: A phantom surface appears with a single pick, and the real TOP_SAND line now joins only three wells
- Option 1 after: As absent information, so the calculation either excludes Ekene-4 or reports that it did
- Option 2 before: The pick is silently corrected to the nearest matching name
- Option 2 after: As a zero thickness for any zone bounded by TOP_B, keeping zone averages four-well
- Option 3 before: Nothing changes, because lines are drawn from depth order rather than from names
- Option 3 after: As the average of the neighbouring picks, so the line reaches all four wells

### wellcorrelation beginner final ord 16: fixed (duplicate)

- Flag: same concept and same answer as module m01-correlation-and-the-section ord 4 and m03-the-structural-section ord 1 (structural view = zero shift, true measured depth)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m03 l01: depths quoted against different reference points are not comparable until converted.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: What defines the structural view of a section?
- Prompt after: One well's depths are quoted from the kelly bushing and another's from mean sea level. What follows for the correlation?
- Explanation before: The structural view applies a shift of zero everywhere. What you see is measured depth, which makes it the only view where depths can be read off and quoted directly.
- Explanation after: Measured depth is counted from a surface reference point, so the reference must always be stated. Two wells quoted against different references are not comparable until one is converted, and a survey conversion to vertical depth does not change the reference. The Ekene wells share one datum, so their depths compare as they stand.
- Option 0 before: Every well is shifted so its shallowest top lines up with the others
- Option 0 after: Nothing, since measured depth is distance along the hole from any starting point
- Option 1 before: Every well is shifted so the section span is minimised
- Option 1 after: They compare directly once both are converted to true vertical depth
- Option 2 before: The shift is zero in every well, so displayed depth equals true measured depth
- Option 2 after: They are not comparable until one well's depths are converted to the other's reference
- Option 3 before: Depths are converted to true vertical depth before display
- Option 3 after: They compare directly, since both record depth in metres along the hole

### wellcorrelation beginner final ord 17: fixed (duplicate)

- Flag: same concept and same answer as module m03-the-structural-section ord 9 (TOP_B relief reported as 34 m over three wells)
- Reason: true duplicate; the earlier question is kept and this one rewritten to the m06 l01 exercise: a new question about the TOP_A to TOP_SAND interval changes only the datum step.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: TOP_B is picked at 1640 m in Ekene-1, 1662 m in Ekene-2 and 1628 m in Ekene-3, and is not picked in Ekene-4. What is the structural relief on TOP_B, and over how many wells is it measured?
- Prompt after: The Ekene section is now asked how the TOP_A to TOP_SAND interval varies across the wells. Which step of the workflow changes?
- Explanation before: 1662 minus 1628 gives 34 m, and only Ekene-1, Ekene-2 and Ekene-3 contribute because Ekene-4 has no TOP_B pick. Reporting the relief over four wells overstates the well control behind the number.
- Explanation after: Only step three changes: the question is now about the interval below TOP_A, so TOP_A becomes the sensible datum. The structural view is still read first and still shows 49 m of relief on TOP_SAND, and the thicknesses read in step four do not depend on the datum.
- Option 0 before: 22 m over three wells
- Option 0 after: The structural look, which is skipped since relief no longer matters to the question
- Option 1 before: 34 m over four wells
- Option 1 after: The interval reading, since thickness now depends on the datum chosen for it
- Option 2 before: 102 m over three wells
- Option 2 after: Every step, since a new question needs a new section
- Option 3 before: 34 m over three wells
- Option 3 after: Only the datum choice, which moves to TOP_A for the new question

### wellcorrelation beginner final ord 24: fixed (duplicate)

- Flag: same concept and same answer as module m04-flattening-and-datums ord 4 (Ekene-4 BASE_SAND displays at 1525 m under a -90 m shift)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m04 l02: moving the datum to 1600 m gives Ekene-1 a positive shift of +52 m, sliding it down.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Ekene-4 has TOP_SAND at 1590 m and BASE_SAND at 1615 m. The section is flattened on TOP_SAND at a datum of 1500 m. What shift does Ekene-4 receive, and where does its BASE_SAND display?
- Prompt after: The section stays flattened on TOP_SAND but the datum moves from 1500 m to 1600 m. What shift does Ekene-1, with TOP_SAND at 1548 m, now take?
- Explanation before: The shift is 1500 minus 1590, which is -90 m. BASE_SAND then displays at 1615 plus -90, which is 1525 m. Its true measured depth is still 1615 m; only the display has moved.
- Explanation after: Shift is datum minus the datum-top depth, so 1600 minus 1548 gives +52 m. A positive shift adds depth, so the column slides down the display. The sign follows entirely from where the datum line sits relative to the picks.
- Option 0 before: Shift +90 m, BASE_SAND displays at 1705 m
- Option 0 after: A shift of -52 m, moving it up the display to reach the datum
- Option 1 before: Shift -90 m, BASE_SAND displays at 1615 m
- Option 1 after: Its shift of -48 m, since a shift belongs to the well and stays put
- Option 2 before: Shift -90 m, BASE_SAND displays at 1525 m
- Option 2 after: A shift of +52 m, sliding it down the display
- Option 3 before: Shift -115 m, BASE_SAND displays at 1500 m
- Option 3 after: A shift of +48 m, the capstone shift with its sign flipped

### wellcorrelation beginner final ord 30: fixed (duplicate)

- Flag: same concept and same answer as module m04-flattening-and-datums ord 7 (why a thickness inside a well is unchanged: the shift cancels)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m05 l02: a difference between two different wells is what flattening changes.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Why is gross zone thickness described as view independent?
- Prompt after: The Ekene section is flattened on TOP_SAND at 1500 m. Which of these quantities changes from its structural value?
- Explanation before: A flattening shift is one number per well applied to every pick in that well. Subtracting two shifted depths cancels the shift, so thickness is identical in the structural view and in any flattened view.
- Explanation after: Any quantity that subtracts depths from two different wells changes under flattening, because the wells carry different shifts and nothing cancels. Within one well both ends take the same shift, so thicknesses survive, and stored depths never change because flattening changes the display and never the data.
- Option 0 before: Both bounding tops in a well receive the same shift, so their difference is unchanged in any view
- Option 0 after: The depth difference between TOP_SAND in Ekene-2 and TOP_SAND in Ekene-4
- Option 1 before: Thickness is stored separately from the tops and is never recomputed
- Option 1 after: The gross thickness of the SAND zone in Ekene-2, as measured on the flattened panel
- Option 2 before: Thickness is measured in true vertical depth, which flattening does not touch
- Option 2 after: The TOP_A to TOP_SAND interval in Ekene-4
- Option 3 before: Flattening rescales the depth axis of each well column, so every zone thickness is stretched back to its structural value
- Option 3 after: The true measured depth stored for Ekene-4's BASE_SAND

### wellcorrelation beginner final ord 34: fixed (duplicate)

- Flag: same concept and same answer as module m01-correlation-and-the-section ord 11 (thickest TOP_A to TOP_SAND interval: Ekene-4, 60 m)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m03 l02: interval thickening toward the low side, with relief growing downward, is the growth signature.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: The TOP_A to TOP_SAND interval measures 48 m in Ekene-1, 53 m in Ekene-2, 46 m in Ekene-3 and 60 m in Ekene-4. Which well has the thickest interval, and by how much does it exceed the thinnest?
- Prompt after: TOP_SAND carries 14 m more relief than TOP_A, and the TOP_A to TOP_SAND interval is thickest in Ekene-4, the structurally low well. What does that pattern classically indicate?
- Explanation before: Ekene-4 at 60 m is the thickest and Ekene-3 at 46 m is the thinnest, so the spread is 14 m. This same 14 m spread is what the Professional view flattened on TOP_A makes visible as the scatter of displayed TOP_SAND depths.
- Explanation after: An interval that thickens toward the structurally low side is the classic signature of growth: sediment accumulated preferentially where there was more room, on the sinking side, so the structure grew as the rocks were laid down. A rigidly tilted slab would show equal relief on every surface.
- Option 0 before: Ekene-2, by 7 m
- Option 0 after: A rigid slab tilted after deposition, since the deeper surface always takes more relief
- Option 1 before: Ekene-4, by 14 m
- Option 1 after: Deposition while the structure grew, with more sediment where it was subsiding
- Option 2 before: Ekene-4, which is 12 m thicker than the thinnest
- Option 2 after: A mistyped TOP_A pick in Ekene-4, since relief ought to be equal on every surface of a section
- Option 3 before: Ekene-3, exceeding the thinnest by 14 m
- Option 3 after: Erosion at Ekene-3, where the structure sits highest

### wellcorrelation beginner final ord 38: fixed (duplicate)

- Flag: same concept and same answer as module m06-the-correlation-workflow ord 11 (the six quantities the capstone grades)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m06 l03: the capstone grants the Associate certification, which gates the tier above.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Which six quantities does the DC6 capstone grade?
- Prompt after: What does passing the Associate capstone for this course grant?
- Explanation before: The capstone grades one shift, one thickness, two displayed depths, one relief and one well count. Together they test shift arithmetic, view independence of thickness, displayed versus true depth, reading relief in the structural view, and partial correlation lines.
- Explanation after: Passing the capstone grants the Associate certification for this course, and that certification is the gate on the tier above. The final exam is not replaced: it comes first and must be passed at 70 percent before the capstone opens.
- Option 0 before: Four structural reliefs, one each for TOP_A, TOP_SAND, BASE_SAND and TOP_B, plus the structural span and the flattened span of the whole section, since the capstone is built around reading relief rather than shifts
- Option 0 after: Direct entry to the Expert tier, skipping the Professional tier
- Option 1 before: The four SAND gross thicknesses, one per well, plus the datum surface used for flattening and the section well count, because the capstone is treated as a pure test of the view independence of thickness
- Option 1 after: A pass on the final exam, which the capstone replaces for this course
- Option 2 before: Ekene-2 flattening shift, Ekene-3 SAND thickness, Ekene-4 BASE_SAND displayed depth, TOP_SAND structural relief, the number of wells the TOP_B line reaches, and Ekene-1 TOP_B displayed depth
- Option 2 after: The Associate certification, the gate on the tier above
- Option 3 before: Ekene-2 flattening shift, Ekene-3 SAND thickness, Ekene-4 BASE_SAND true depth, TOP_SAND flattened relief, the total pick count across all wells, and the datum value chosen for the flattened section display
- Option 3 after: Edit rights on the Ekene tops table, so later tiers can move picks

### wellcorrelation beginner final ord 39: fixed (duplicate)

- Flag: same concept and same answer as module m04-flattening-and-datums ord 5 (Ekene-1 TOP_B displays at 1592 m under a -48 m shift)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m04 l04: the same pick displays differently under different datums, so every flattened reading carries its datum.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Ekene-1 has TOP_SAND at 1548 m and TOP_B at 1640 m. In the capstone view, flattened on TOP_SAND at a datum of 1500 m, where does Ekene-1 TOP_B display?
- Prompt after: Ekene-1's TOP_SAND displays at 1500 m under the capstone datum and at 1498 m under the TOP_A datum at 1450 m. What does that show?
- Explanation before: The shift is 1500 minus 1548, which is -48 m, and 1640 plus -48 gives 1592 m. Adding the shift with the wrong sign gives 1688 m, and leaving the pick at 1640 m ignores the shift entirely.
- Explanation after: The same surface displays at different numbers under different datums, so a displayed depth without its datum is meaningless. The pick itself is still 1548 m in both views; only the view changed.
- Option 0 before: 1688 m
- Option 0 after: One of the two views was built wrongly, since a pick has only one displayed depth on any panel
- Option 1 before: 1592 m
- Option 1 after: A displayed depth means nothing without its datum, so the datum must be stated
- Option 2 before: 1640 m
- Option 2 after: Ekene-1's TOP_SAND pick was moved by 2 m between the views
- Option 3 before: 1548 m
- Option 3 after: The TOP_A view is the true one, since its reading is off the datum

### wellcorrelation beginner final ord 40: fixed (duplicate)

- Flag: same concept and same answer as module m06-the-correlation-workflow ord 14 (the server gates: lessons, module quizzes at 75 percent, final at 70 percent)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m06 l04: two disagreeing Expert estimates are reported with their spread as the uncertainty.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Which statement matches the assessment gates for this course?
- Prompt after: The Expert tier predicts Ekene-4's missing TOP_B in two independent ways, and the two estimates disagree. What should be done with them?
- Explanation before: The module gate is 75 percent, three failed attempts trigger a 24 hour cooldown, the final exam gate is 70 percent, and the capstone is the last item in the course.
- Explanation after: The two methods lean on different reference surfaces, and with growth in the section those surfaces are not parallel. The spread between the estimates is the uncertainty on the prediction and the most honest number in the exercise; averaging throws it away.
- Option 0 before: Module quizzes need 70 percent, the final exam needs 75 percent, and the capstone may be taken at any time
- Option 0 after: Average them, since splitting the difference cancels the error in each method
- Option 1 before: Module quizzes need 75 percent with no retry limit or cooldown of any kind, and the final exam becomes optional once the capstone has been passed
- Option 1 after: Keep the layer-cake one, as TOP_A is best picked
- Option 2 before: Module quizzes and the final exam both need 70 percent, with a 24 hour cooldown after a single fail
- Option 2 after: Enter the deeper one as the Ekene-4 pick
- Option 3 before: Module quizzes need 75 percent with a 24 hour cooldown after three fails, the final exam needs 70 percent, and the capstone comes last
- Option 3 after: Report the spread between them as the uncertainty on the prediction

### wellcorrelation beginner module m03-the-structural-section ord 1: fixed (duplicate)

- Flag: same concept and same answer as module m01-correlation-and-the-section ord 4 (structural view: every well hung on its true measured depth with no shift)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m03 l01: a deviated well's structural depths need a directional survey.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: In the engine's terms, what shift does the structural view apply to each well?
- Prompt after: A deviated well is added to the Ekene section. Where must its structural depths come from?
- Explanation before: The structural mode is the special case where every well gets a shift of zero. Displayed depth equals true depth for all four wells at every point on the panel. Non-zero shifts are what flattening introduces.
- Explanation after: In a deviated well measured and true vertical depth diverge; at 60 degrees from vertical the hole gains two metres of measured depth for every metre of vertical depth. Structural depths must then come from a directional survey, integrated by a method such as minimum curvature, and a section built on raw measured depth shows structure that does not exist.
- Option 0 before: A shift equal to the depth of the chosen datum surface in that well
- Option 0 after: The log header, since measured depth equals vertical depth once the well is logged
- Option 1 before: A shift that lines up the shallowest surface across all wells
- Option 1 after: The flattened view, which removes the extra depth
- Option 2 before: A shift of zero to every well, so displayed depth equals true depth
- Option 2 after: A directional survey, integrated by a method such as minimum curvature
- Option 3 before: A shift equal to the average depth of all wells on the panel
- Option 3 after: The measured depths just as they were logged

### wellcorrelation beginner module m03-the-structural-section ord 2: fixed (duplicate)

- Flag: same concept and same answer as module m01-correlation-and-the-section ord 9 (structural range 1495 to 1662 m, span 167 m)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m03 l04: an 11 m thickness story fills about seven percent of a 167 m panel.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: The shallowest pick in the Ekene dataset is TOP_A in Ekene-3 at 1495 m and the deepest is TOP_B in Ekene-2 at 1662 m. What is the displayed span of the structural section?
- Prompt after: On the structural panel the SAND thickness varies by 11 m while the panel spans 167 m. Why is the thickness story hard to read there?
- Explanation before: 1662 minus 1495 is 167 m. The panel has to accommodate every pick, so its vertical extent is set by the two most extreme values in the whole dataset, not by any single surface.
- Explanation after: The panel is scaled to the full 167 m between the shallowest and deepest picks, so the 11 m thickness spread takes about seven percent of its height and draws as a sliver. Thickness is computed the same way in either view; flattening only makes it visible.
- Option 0 before: 167 m
- Option 0 after: The 11 m fills only about seven percent of the panel height, a few pixels at that scale
- Option 1 before: 150 m
- Option 1 after: The structural view shifts each well, which distorts every thickness drawn
- Option 2 before: 135 m
- Option 2 after: Thickness cannot be computed until the section is flattened
- Option 3 before: 49 m
- Option 3 after: The panel is scaled to the 49 m of TOP_SAND relief, which swamps smaller changes

### wellcorrelation beginner module m03-the-structural-section ord 6: fixed (duplicate)

- Flag: same concept and same answer as module m01-correlation-and-the-section ord 7 (TOP_SAND relief 49 m)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m03 l02: relief depends on which wells are on the panel, so a fifth well can widen it.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: TOP_SAND sits at 1548 m in Ekene-1, 1565 m in Ekene-2, 1541 m in Ekene-3 and 1590 m in Ekene-4. What is its structural relief?
- Prompt after: A fifth well is added to the Ekene section. What can happen to the structural relief on TOP_SAND?
- Explanation before: The shallowest is 1541 m in Ekene-3 and the deepest is 1590 m in Ekene-4, so the relief is 1590 minus 1541, which is 49 m. This is one of the six numbers the Associate capstone grades.
- Explanation after: Relief is the deepest occurrence minus the shallowest across the wells that carry the surface, so it depends on which wells are on the panel. A fifth well deeper than 1590 m or shallower than 1541 m would widen it; adding a well can never shrink it, and relief is never a dip because it ignores the distance between wells.
- Option 0 before: 42 m
- Option 0 after: Nothing, since relief is a fixed property of the surface
- Option 1 before: 49 m
- Option 1 after: It can grow, because relief is measured across the wells on the panel
- Option 2 before: 25 m
- Option 2 after: It can only shrink, since more wells average out the extreme picks on the surface
- Option 3 before: 17 m
- Option 3 after: It turns into a dip, since five wells measure a gradient

### wellcorrelation beginner module m04-flattening-and-datums ord 6: fixed (duplicate)

- Flag: same concept and same answer as module m01-correlation-and-the-section ord 6 (Ekene-2 gross sand 36 m) and ord 12 (gross sand unchanged by flattening)
- Reason: true duplicate; the earlier question is kept and this one m04 ord 6 repeated the flattening-invariance question of m01 ord 12 on m01 ord 6's 36 m; rewritten to the m04 l03 exercise: a BASE_SAND datum flattens all four wells but the interval covers three.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Ekene-2's gross sand is 36 m thick in the structural view. What is its gross sand thickness on the panel flattened on TOP_SAND at 1500 m?
- Prompt after: To compare the BASE_SAND to TOP_B interval, the section is flattened on BASE_SAND at 1550 m. Which wells can that comparison cover?
- Explanation before: Both ends take the same shift: the top displays at 1565 - 65 = 1500 and the base at 1601 - 65 = 1536, so 1536 - 1500 = 36 m. Thickness is a property of the well, not of the view.
- Explanation after: All four wells carry BASE_SAND, so all four flatten cleanly, with shifts of -30, -51, -20 and -65 m. The interval comparison still covers only three wells, because Ekene-4 has no TOP_B to measure down to.
- Option 0 before: 1500 m, because the top lands on the datum
- Option 0 after: All four, since every well flattens cleanly on BASE_SAND
- Option 1 before: 101 m, the shift added to the thickness
- Option 1 after: None until TOP_B is chosen as the datum instead
- Option 2 before: 36 m, unchanged
- Option 2 after: Ekene-1, Ekene-2 and Ekene-3 only
- Option 3 before: It cannot be read from a flattened panel
- Option 3 after: Only Ekene-4, which takes the largest shift

### wellcorrelation beginner module m04-flattening-and-datums ord 9: fixed (duplicate)

- Flag: same concept and same answer as module m02-formation-tops ord 15 (a well lacking the datum top is drawn at true depth and flagged)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m04 l03 and l05: a datum should be a surface that was near level when laid down, such as a flooding surface.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: A well in the section has no pick for the chosen datum top. What does the engine do with that well?
- Prompt after: On the geological-meaning criterion, which kind of surface makes the most defensible flattening datum?
- Explanation before: The engine never guesses. It returns a null shift, marks the well as lacking the datum top, and draws it unflattened with a flag, so nobody mistakes a true-depth column for a flattened one.
- Explanation after: Flattening asserts that the datum surface was near enough level at one moment. A marine flooding surface or a widespread shale supports that claim. An unconformity records removal that varies from place to place, and a pick chosen only because it was easy to see carries no such meaning.
- Option 0 before: It interpolates the missing top from the neighbouring wells and flattens normally.
- Option 0 after: The pick quickest to see, since speed keeps picks consistent
- Option 1 before: It removes the well from the section until the top is picked.
- Option 1 after: An erosional unconformity, since it marks one sharp moment across the whole field
- Option 2 before: It applies the average shift of the other wells to keep the panel tidy.
- Option 2 after: The deepest surface, since it carries the most relief
- Option 3 before: It gives the well a null shift, draws it at true measured depth, and flags it.
- Option 3 after: A marine flooding surface or widespread shale, near level when laid down

### wellcorrelation beginner module m05-zones-and-correlation-lines ord 5: fixed (duplicate)

- Flag: same concept and same answer as module m02-formation-tops ord 8 (Ekene-1 32 m and Ekene-3 29 m gross sand)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m05 l01: a zone has no identity of its own beyond its two bounding names.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Ekene-3 has TOP_SAND at 1541 and BASE_SAND at 1570. What is its gross SAND thickness?
- Prompt after: Why does naming discipline matter as much for zones as it does for tops?
- Explanation before: 1570 minus 1541 is 29 m. This is one of the six numbers the capstone asks you to reproduce.
- Explanation after: There is no separate zone object in the data: a zone is the interval between two correlated tops and takes its identity from them. If TOP_SAND means the same surface in every well, the SAND zone is comparable across wells; if the names drift, the zone drifts with them and every quoted thickness is quietly wrong.
- Option 0 before: 25 m
- Option 0 after: Because the engine stores each zone as a separate object with its own name and its own thickness
- Option 1 before: 26 m
- Option 1 after: Because zone thickness is read from the log curve, which the engine looks up by the name of the top
- Option 2 before: 29 m
- Option 2 after: Because a zone takes its identity from its two bounding names, so drifting names move it
- Option 3 before: 32 m
- Option 3 after: Because the engine computes no zone until every name is in capitals

### wellcorrelation beginner module m05-zones-and-correlation-lines ord 6: fixed (duplicate)

- Flag: same concept and same answer as module m04-flattening-and-datums ord 7 (thickness unchanged because the shift cancels)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m05 l02: state the thickness observation cleanly; four wells cannot settle its cause.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Why is gross thickness the same in the structural view and in any flattened view?
- Prompt after: The SAND zone thickens toward Ekene-2 and thins into Ekene-4. What can a four-well beginner correlation claim about it?
- Explanation before: Flattening adds one shift s to every depth in a well, so (base + s) minus (top + s) equals base minus top. The shift appears once with a plus and once with a minus and cancels.
- Explanation after: Four wells cannot settle whether the pattern is depositional thickening toward Ekene-2 or something structural removing section at Ekene-4. The habit is to state the observation cleanly before reaching for an explanation. The 11 m spread on a mean near 30.5 m is roughly a third of the average thickness, well beyond noise.
- Option 0 before: Both ends of the zone carry the same per-well shift, so the shift cancels in the subtraction
- Option 0 after: The observation itself, stated cleanly, with its cause left as an open question
- Option 1 before: The engine recomputes thickness from measured depth and ignores the displayed depths entirely
- Option 1 after: That structure has removed section at Ekene-4, since it is the deepest well on every surface
- Option 2 before: Flattening only moves the datum top and leaves the other tops at their true depths
- Option 2 after: That the sand thickens depositionally toward Ekene-2
- Option 3 before: Thickness is rounded to the nearest metre, which hides the difference the shift makes
- Option 3 after: Nothing, since an 11 m spread is measurement noise

### wellcorrelation beginner module m05-zones-and-correlation-lines ord 11: fixed (duplicate)

- Flag: same concept and same answer as module m04-flattening-and-datums ord 15 (the flat TOP_SAND line is flat by construction)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m05 l03: the non-datum lines show geometry relative to the datum.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: In the capstone flattened view the TOP_SAND correlation line is dead flat at 1500 in every well. What does that tell you?
- Prompt after: On the capstone panel flattened on TOP_SAND, what do the correlation lines other than TOP_SAND show?
- Explanation before: A flat datum line is a construction, never an observation. Structural statements must be made from the structural view, where TOP_SAND reads 1548, 1565, 1541 and 1590.
- Explanation after: Only the datum line is forced flat and carries no information. The other lines no longer show structure; they show geometry relative to the datum surface, close to what the layers looked like when it was deposited, which is why the flattened BASE_SAND line reads as a thickness plot.
- Option 0 before: That TOP_SAND is a genuinely flat surface across the area
- Option 0 after: The structure of each surface, with the datum's own relief added back in
- Option 1 before: That the four wells were drilled from the same structural elevation
- Option 1 after: True measured depths, since only the datum line has been moved
- Option 2 before: That the section has no structural relief worth discussing
- Option 2 after: Nothing useful, since every line on a flattened panel is flat
- Option 3 before: Nothing at all, because the shifts were computed precisely to produce that flat line
- Option 3 after: Geometry relative to the datum, close to how the layers lay when it was deposited

### wellcorrelation beginner module m05-zones-and-correlation-lines ord 13: fixed (duplicate)

- Flag: same concept and same answer as module m02-formation-tops ord 14 (the TOP_B line reaches 3 wells and does not extend to Ekene-4)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m05 l04: drawing a line through a well asserts a pick nobody made.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Ekene-4 has no TOP_B pick. How many wells does the TOP_B correlation line reach, and what does the engine do about the gap?
- Prompt after: Why is drawing the TOP_B line straight through Ekene-4 to the next well wrong?
- Explanation before: correlationPolyline skips wells where the lookup returns null, so the line reaches 3 wells. Drawing through would assert a pick nobody made, and interpolating would invent data.
- Explanation after: A line drawn through a well is a visual assertion that the top was picked there. TOP_B was not picked in Ekene-4, so the engine skips that well and the line stops: what was observed stays on the section and anything inferred stays in the report, labelled as inference.
- Option 0 before: 3 wells, because the engine simply skips a well that lacks the top
- Option 0 after: It asserts a TOP_B pick in Ekene-4 that nobody made
- Option 1 before: 4 wells, because the engine draws through to the next well that has the top
- Option 1 after: It changes the TOP_B relief, which is read off the drawn line
- Option 2 before: 4 wells, because the engine interpolates a position from the neighbouring wells
- Option 2 after: It drags the Ekene-4 BASE_SAND pick onto the line of TOP_B
- Option 3 before: 0 wells, because a line is only drawn when every well carries the top
- Option 3 after: It breaks the flattening, since the engine needs TOP_B in every well

### wellcorrelation beginner module m05-zones-and-correlation-lines ord 14: fixed (duplicate)

- Flag: same concept and same answer as module m03-the-structural-section ord 9 (TOP_B relief reported as 34 m over three wells)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m04 l04 and m05 l04: the flattened 10 m TOP_B spread shows the interval below the sand is uniform.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: TOP_B is at 1640, 1662 and 1628 in Ekene-1, Ekene-2 and Ekene-3, and is absent in Ekene-4. How should its structural relief be reported?
- Prompt after: Under the capstone datum TOP_B displays with a spread of 10 m, against 34 m in true depth. What does the difference show?
- Explanation before: 1662 minus 1628 is 34 m, but it describes only the wells that carry the top. Quoting the well count alongside any statistic from a partial line stops a reader assuming Ekene-4 was covered.
- Explanation after: Relief is a structural quantity and stays 34 m over three wells in the structural view. The flattened spread describes geometry relative to TOP_SAND: once the sand's structure is removed, the interval below it is far more uniform than the structural section suggested. Both figures are three-well numbers.
- Option 0 before: As 34 m, with no qualifier, since relief is a property of the surface and does not depend on well count
- Option 0 after: The TOP_B relief is really 10 m, since the flattened view strips out the errors in every pick
- Option 1 before: As 10 m over 3 wells, taken from the flattened displayed depths
- Option 1 after: Flattening has compressed the interval below the sand by 24 m
- Option 2 before: As 34 m over 3 wells, so a reader knows the statistic comes from a partial line
- Option 2 after: Once the sand's structure is removed, the interval below the sand is far more uniform
- Option 3 before: As 34 m over 4 wells, since the section contains four wells
- Option 3 after: The 34 m covered four wells, while the flattened 10 m covers three

### wellcorrelation beginner module m06-the-correlation-workflow ord 6: fixed (duplicate)

- Flag: same concept and same answer as module m02-formation-tops ord 12 (a negative gross thickness means the tops were swapped)
- Reason: true duplicate; the earlier question is kept and this one rewritten to the m06 l02 exercise: a negative thickness and a line crossing are one swap seen twice.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: A quality control run computes a zone thickness of -7 m in one well. What does that tell you?
- Prompt after: One well's zone thickness computes to -7 m, and a correlation line crosses another between that well and its neighbour. What is the most likely cause?
- Explanation before: A negative thickness is impossible geology, not an unusual case. Base minus top must be positive in every well, so a negative result means the two picks are reversed in the tops table.
- Explanation after: A negative thickness means the top and base picks were entered swapped, and with those two picks reversed in one well the two lines must trade places between it and its neighbour. One data-entry error explains both symptoms. Fix the picks, then rerun every check.
- Option 0 before: The well was flattened on a datum it does not carry
- Option 0 after: A fault between the two wells, which both the crossing and the negative interval record
- Option 1 before: The zone is genuinely absent in that well
- Option 1 after: Two separate errors, a mistyped pick and a misdrawn line
- Option 2 before: The top and base picks in that well were entered swapped
- Option 2 after: A single swap of the top and base picks in that well, which explains both
- Option 3 before: The section was read in the structural view instead of the flattened one
- Option 3 after: A datum pick error, which moves every surface in the well

### wellcorrelation beginner module m06-the-correlation-workflow ord 10: fixed (duplicate)

- Flag: same concept and same answer as module m01-correlation-and-the-section ord 8 (TOP_B reaches three wells because Ekene-4 stopped above it)
- Reason: true duplicate; the earlier question is kept and this one rewritten to m06 l02: an extreme thickness must be explained out loud.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: Why is every TOP_B statistic on the Ekene section reported as a three-well number?
- Prompt after: One well's sand reads 300 m where its neighbours read 25 to 36 m. What does the thickness plausibility check require?
- Explanation before: Ekene-4 stopped above TOP_B, so the surface has no pick in that well and the correlation line stops short of it. Quoting a TOP_B figure as a four-well number claims data that does not exist.
- Explanation after: Extreme numbers are not forbidden, but they must be accounted for out loud. Three hundred metres might be a stacked sequence or a base pick that landed on the wrong surface; ordinary values such as the Ekene range of 25 to 36 m need no explanation.
- Option 0 before: Because TOP_B is the deepest surface and deep picks are less reliable
- Option 0 after: Rejecting the well outright, since the check forbids any thickness that sits far from the mean
- Option 1 before: Because one well never reached TOP_B, so no pick exists there
- Option 1 after: An explanation out loud, such as a stacked sequence or a base pick on the wrong surface
- Option 2 before: Because the correlation line for TOP_B is drawn only in the structural view
- Option 2 after: Nothing more, since gross thickness is view-independent and so needs no further plausibility check
- Option 3 before: Because TOP_B lies below the flattening datum
- Option 3 after: Averaging it with its neighbours, so the spread stays believable

### wellcorrelation beginner final ord 28: judged fine (duplicate)

- Flag: final 28 against module m01 ord 9 and m04 ord 13 (167 m structural span, 157 m flattened span)
- Reason: tests why the span narrows by 10 m under flattening, a different point from reading either span; kept.

### wellcorrelation beginner final ord 41: judged fine (duplicate)

- Flag: final 41 against module m01 ord 7 and m06 ord 12 (TOP_SAND relief 49 m, read in the structural view)
- Reason: tests the method trap of reading relief on a panel flattened on that same surface; kept as a different angle.

### wellcorrelation beginner final ord 19: judged fine (duplicate)

- Flag: final 19 against module m01 ord 7 (relief values across the surfaces)
- Reason: compares four given reliefs to name the largest; no module question asks that; kept.

### wellcorrelation beginner module m01-correlation-and-the-section ord 15: judged fine (duplicate)

- Flag: module m01 ord 15 against module m03 ord 9 (TOP_B relief is a three-well number)
- Reason: m01 asks for the caveat and m03 for the reporting form; related but distinct; kept both.

### wellcorrelation beginner final ord 32: judged fine (duplicate)

- Flag: final 32 against module m02 ord 14 (TOP_B line reaches 3 wells)
- Reason: adds the segment count (two), which no module question tests; kept.

### wellcorrelation beginner module m05-zones-and-correlation-lines ord 15: judged fine (duplicate)

- Flag: module m05 ord 15 against module m01 ord 8 (Ekene-4 stopped above TOP_B)
- Reason: m05 asks which of the four missing-top reasons the section alone can establish, a different point; kept.

### wellcorrelation beginner final ord 11: judged fine (duplicate)

- Flag: final 11 against module m01 ord 8 (Ekene-4 absence of TOP_B)
- Reason: tests that the absence is not evidence the surface is missing there; a different angle; kept.

### wellcorrelation beginner final ord 31: judged fine (duplicate)

- Flag: final 31 against module m01 ord 6 (Ekene-2 gross sand 36 m)
- Reason: reads the thickness from the displayed pair 1536 minus 1500 on the flattened panel; kept as the only displayed-pair thickness item.

### wellcorrelation beginner module m05-zones-and-correlation-lines ord 8: judged fine (duplicate)

- Flag: module m05 ord 8 against module m03 ord 14 and final 18 (the 11 m thickness spread)
- Reason: m05 asks for the mean, m03 compares with relief, final 18 asks what the ratio says about the structural view; distinct; kept all three.

### wellcorrelation beginner final ord 23: judged fine (duplicate)

- Flag: final 23 against module m04 ord 2 (the shift formula)
- Reason: final asks for both formulas, adding displayed = md + shift; kept.

### wellcorrelation beginner module m06-the-correlation-workflow ord 9: judged fine (duplicate)

- Flag: module m06 ord 9 against module m02 ord 15 (a well lacking the datum top is drawn at true depth)
- Reason: m06 asks for the diagnosis from the symptom on a flattened panel; a different direction of reasoning; kept.

### wellcorrelation beginner final ord 12: judged fine (duplicate)

- Flag: final 12 against module m02 ord 10 (a name typo splits the line)
- Reason: tests case sensitivity (Top_Sand) and the resulting well count; kept.

### wellcorrelation beginner module m06-the-correlation-workflow ord 5: judged fine (duplicate)

- Flag: module m06 ord 5 against module m02 ord 10 and ord 11 (typo becomes a phantom surface)
- Reason: m06 is the QC diagnosis from a surface count; kept.

### wellcorrelation beginner final ord 33: judged fine (duplicate)

- Flag: final 33 against module m05 ord 10 (what a correlation line connects)
- Reason: m05 asks the mechanics, final 33 what the line asserts; both lesson points; kept.

### wellcorrelation beginner final ord 36: judged fine (duplicate)

- Flag: final 36 against module m06 ord 1 (the workflow order)
- Reason: m06 asks the step after gathering, final 36 the full sequence; kept.

### wellcorrelation beginner final ord 13: judged fine (duplicate)

- Flag: final 13 against module m01 ord 14 (log character guides picks)
- Reason: final asks what guides a pick (log character and marker beds), m01 what the curve on the panel is for; kept.

### wellcorrelation beginner final ord 25: judged fine (duplicate)

- Flag: final 25 against module m04 ord 11 and ord 12 (TOP_A datum at 1450 m)
- Reason: different well (Ekene-4) and a different answer (1510 m); kept.

### wellcorrelation beginner final ord 7: judged fine (duplicate)

- Flag: final 7 against module m01 ord 9 (1495 to 1662 m)
- Reason: asks which picks set the extremes, not the span; kept.

### wellcorrelation beginner final ord 26: judged fine (duplicate)

- Flag: final 26 against module m04 ord 5 (Ekene-1 TOP_B displays at 1592 m)
- Reason: asks which depth goes in the database (true 1640 m); a different point; kept.

### wellcorrelation beginner final ord 1: judged fine (duplicate)

- Flag: final 1 against module m01 ord 3 and m03 ord 3 (horizontal axis is well order)
- Reason: an applied scenario with a reviewer measuring screen gaps; kept.

### wellcorrelation beginner module m05-zones-and-correlation-lines ord 3: judged fine (duplicate)

- Flag: module m05 ord 3 against module m02 ord 12 (swapped top and base)
- Reason: m05 tests the engine's ordered span, m02 the negative thickness from plain subtraction; kept.

## wellcost

Migration: `migrations/20261021b_b4_fix_wellcost.sql`

### wellcost advanced module m05-reading-a-risked-result ord 13: fixed (double-key)

- Flag: option 0 arguably also unanswered by a converged run
- Reason: l05 says the run takes the engine as given, so 'whether the engine evaluated each realisation correctly' is also unanswered; option 0 now claims the run cannot give the mean, which l01 shows it reports beside the median.
- Option 0 before: Whether the engine evaluated each realisation correctly when it rolled up the nine cost lines for every draw of the run.
- Option 0 after: Whether the mean sits above or below the median, since percentiles read off a sorted list by index cannot give the average of the draws.

### wellcost advanced module m01-the-cost-time-curve ord 13: fixed (double-key)

- Flag: option 3 overlaps the correct option
- Reason: option 3 (schedule slipped / NPT allowance too low, extra rig hours billed) restates the correct 'running late' story and could be defended; it now gives the l04 below-the-line story (not yet drilled, money still owed), misapplied to a well above the line.
- Option 3 before: Either the schedule slipped or the non-productive allowance was set too low, so extra rig hours are being billed.
- Option 3 after: Either it has not yet drilled the section or it is behind on depth, so the money it has not spent is still owed.

### wellcost intermediate final ord 30: fixed (double-key)

- Flag: option 2 hours are the published fixture hour set; follow-on: explanation shows no working
- Reason: option 2 is the intended m05 l01 fixture trap and stays; the explanation now shows the three hour terms from m05 l02 and why 16 is wrong.
- Explanation before: Every hour in the form is productive, so none of the three carries the non productive allowance the schedule applies.
- Explanation after: Drilling is 1,000 m at 10 m/hr, which is 100 hours; the flat connection allowance is 4 hours; and the round trip is twice 3,000 m over 500 m/hr, which is 12 hours. The 16 hour trip belongs to the published fixture, which is no section of this well. Every hour in the form is productive, so none of the three carries the non productive allowance.

## welldata

Migration: `migrations/20261021b_b4_fix_welldata.sql`

### welldata beginner module m06-the-qc-workflow ord 13: fixed (double-key)

- Flag: distractor 0 "Access to the Professional tier ... otherwise locked" may be true
- Reason: passing the Associate capstone plausibly does open this course's Professional tier, so option 0 could be defended; it now claims the QC panel itself is locked until the capstone, which m06 l03 contradicts (practise in the QC panel any time).
- Option 0 before: Access to the Professional tier of Well Data Manager, which is otherwise locked to every learner on the platform
- Option 0 after: Use of the Well Data Manager QC panel itself, which stays closed to a learner until the capstone has been passed

### welldata beginner module m01-well-data-and-the-registry ord 10: judged fine (number-options)

- Flag: bare file-name options; review only, fix only if defective
- Reason: nullheavy_20 is the only teaching file that declares NULL -9999 (m01 l03); file-name options are the natural form for a teaching-file recall question and each distractor is a real teaching file.

### welldata beginner module m01-well-data-and-the-registry ord 11: judged fine (number-options)

- Flag: bare file-name options; review only, fix only if defective
- Reason: wrapped_12 is the only LAS 1.2 wrapped file (m01 l03, l04); the other three are real LAS 2.0 teaching files, so exactly one option stands.

### welldata beginner final ord 2: fixed (duplicate)

- Flag: near duplicate of module m01 ord 4 and of module m03 ord 10 (same 1500 to 1650 m at 0.5 m log, same 301 key); the final also keeps a fence-post count at ord 6
- Reason: trivial reword of two module questions; rewritten to the m03 l02 point that each converted curve stores its source unit and factor (provenance), which the beginner final did not test.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: A log runs from 1500 m to 1650 m with a constant 0.5 m step. How many depth samples does it contain?
- Prompt after: When the import pipeline converts the feet_20 sonic from US/F to US/M, what does it store on the converted curve?
- Explanation before: Fence-post counting: (1650 - 1500) / 0.5 = 300 intervals, and intervals + 1 = 301 samples. basic_20 shows exactly this.
- Explanation after: Every converted curve keeps the source unit and the factor used, so the conversion is auditable forever. The unconverted flag belongs to a curve whose unit the importer does not recognise, which it passes through unchanged.
- Option 0 before: 300
- Option 0 after: Nothing but the converted values, since the source unit is dropped for good once the curve is in metres
- Option 1 before: 301
- Option 1 after: The source unit and the factor used, stored on the curve so the conversion stays auditable
- Option 2 before: 299
- Option 2 after: A second index curve holding the original feet depths beside the new metric frame
- Option 3 before: 302
- Option 3 after: An unconverted flag, so the import screen asks a human to confirm the unit

### welldata beginner module m03-depth-units-and-steps ord 10: fixed (duplicate)

- Flag: near duplicate of module m01 ord 4 (same log, same 301 key), found while reviewing the final ord 2 pairs; m03 already has its own count at ord 3
- Reason: the fence-post count is m01's point; m03 ord 10 now tests m03 l04 'resampling is modelling': the spacing and interpolation choice belongs in the professional import pipeline with the original samples preserved.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: basic_20 runs from 1500 m to 1650 m with a uniform 0.5 m step. How many depth samples does it contain?
- Prompt after: An irregular well must eventually live on a uniform grid. Where does the choice of spacing and interpolation belong?
- Explanation before: (1650 - 1500) / 0.5 + 1 = 300 + 1 = 301. Dropping the plus one gives 300, the increment count rather than the sample count.
- Explanation after: Choosing a spacing and an interpolation alters the data, so resampling is an interpretive trade and belongs where interpretation lives: the professional import pipeline, chosen explicitly and recorded, with the original samples kept underneath. The parser's job is fidelity, so it never regrids.
- Option 0 before: 301
- Option 0 after: In the professional import pipeline, chosen explicitly, with the original samples preserved underneath
- Option 1 before: 300
- Option 1 after: In the parser, which regrids each irregular file onto its average increment as it reads it
- Option 2 before: 299
- Option 2 after: In the header, by writing the chosen spacing into STEP so every consumer reads one grid
- Option 3 before: 151
- Option 3 after: In each downstream app, which interpolates onto whatever spacing its arithmetic needs

### welldata intermediate module m01-from-qc-to-import ord 7: judged fine (duplicate)

- Flag: near duplicate pair with module m06-the-import-workflow ord 5 (same prompt, same key)
- Reason: kept as the stronger copy (its distractors are real misreadings of the unit and position); m06 ord 5 is rewritten instead.

### welldata intermediate module m06-the-import-workflow ord 5: fixed (duplicate)

- Flag: near duplicate of module m01-from-qc-to-import ord 7 (same prompt, same key)
- Reason: rewritten to m06 l02 check 3: a curve whose mnemonic matches no name list is kept but carries no kind, so apps that ask by kind cannot see it.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: What input does the importer use to decide a curve's kind?
- Prompt after: A curve's mnemonic matches none of the importer's fixed name lists. What happens to that curve?
- Explanation before: Kind comes from the mnemonic with any run suffix after a colon stripped, and the unit is never consulted. That makes the kind column and the converted column independent findings during QC.
- Explanation after: Kind comes from the mnemonic alone and the unit is never consulted. A curve with no match is neither dropped nor a reason to stop the import; it simply carries no kind, which makes it invisible to any app that picks curves by kind, so accept that deliberately or correct the mnemonic at source.
- Option 0 before: The unit string, since kinds and units go together
- Option 0 after: It is dropped at import, since a curve with no kind has no place in the registry
- Option 1 before: The curve's position in the file, for every curve
- Option 1 after: It takes the kind of a curve sharing its unit, since kind falls back to the unit
- Option 2 before: The curve description text in the curve section
- Option 2 after: The import stops until someone maps it, as it does for an unrecognised depth unit
- Option 3 before: The mnemonic alone, upper-cased and matched against fixed name lists
- Option 3 after: It is kept without a kind, and any app that asks for curves by kind will not see it at all

### welldata intermediate module m06-the-import-workflow ord 2: fixed (duplicate)

- Flag: near duplicate of module m01-from-qc-to-import ord 6 (how the importer decides a curve needs converting: exact lookup of the unit string in a fixed table)
- Reason: true duplicate (same concept, same key); m01 ord 6 is kept as the earlier module and m06 ord 2 is rewritten to the m06 l01 point that parsing, through the native depth unit it reads, governs every conversion after it.
- Correct option or prompt changed: the question is replaced by a new one testing a different point, so the correct option is new text at the same answer_index
- Prompt before: How does the importer decide whether a curve needs unit conversion?
- Prompt after: Which stage of the import workflow produces no number of its own, yet governs every number that comes after it?
- Explanation before: The unit string is trimmed, upper-cased and looked up in a fixed table, with no reasoning about what the unit means. Assuming general dimensional analysis is the error that makes an unconverted length unit look like a bug.
- Explanation after: Stage 1 parses the file and reads the native depth unit, and that unit selects the conversion factor for the depth column and for every curve denominated in feet. The step test, the kinds and the provenance record all work on what that choice produced.
- Option 0 before: By asking whether the curve's kind is one that carries a length
- Option 0 after: Testing the step, since the measured step decides how every later depth is spaced
- Option 1 before: By analysing the unit for a length dimension in the numerator or denominator
- Option 1 after: Recording provenance, since the stored source unit and factor fix every value the registry keeps
- Option 2 before: By comparing the curve unit against the depth unit in the well section
- Option 2 after: Assigning kinds, since every app then finds its curves by kind
- Option 3 before: By an exact lookup of the unit string in a fixed conversion table
- Option 3 after: Parsing, whose native depth unit selects the factor for every conversion

## welltest

Migration: `migrations/20261021b_b4_fix_welltest.sql`

### welltest advanced module m04-gas ord 15: fixed (double-key)

- Flag: distractor 2 (three points too few to fit reliably) close to partly valid
- Reason: 'too few points' echoes l05's point that real tests have too few stabilised points, so it could be half-defended; it now claims three points leave the back-pressure fit underdetermined, which l05 contradicts (two parameters, one degree of freedom left over, r squared near 1).
- Option 2 before: Because the three points are too few to determine two parameters plus an exponent reliably in either fit.
- Option 2 after: Because three points leave the back-pressure fit underdetermined, so its exponent is only loosely fixed by the data.

