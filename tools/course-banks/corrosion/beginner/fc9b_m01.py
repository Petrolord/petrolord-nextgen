import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Associate m01, What This Screen Answers and What It Withdrew.
# Sources: digest sections 1, 2, 3, 21 and 24. No corrosion rate the
# correlation produced is keyed anywhere in this bank.

q(1, "A screening comes back and the reader wants to know what this module will refuse to answer. Where does that list come from?",
 "The engine carries both lists itself and returns them with every screening, 8 items it will not pretend to answer and 11 numbers with no source in the repository.",
 ["The studio assembles the list from whichever result fields came back empty, so its length depends on which boxes were filled in before the run.",
  "Both lists hold 11 entries, one naming the held constants and the other naming the constants the vendored golden pins, and they are returned so the two can be compared.",
  "The refusals live in the studio help text and the screening carries only the numbers, which is why a caller has to read the documentation to find out what is missing."],
 "`NOT_PROVIDED` carries 8 items and `HELD_FOR_LITERATURE` carries 11. `screen` returns both, so a caller shows them rather than discovering them one support call at a time."),

q(3, "Ask this studio for a sour service severity region and for the material choice that would follow from one. What comes back?",
 "Two fields declaring the absence, `regionProvided` false and `materialGuidanceProvided` false, beside a comparison of one partial pressure against one threshold.",
 ["A severity region computed from the H2S partial pressure and then flagged as held, sitting on exactly the same footing as the band label the engine prints beside the rate.",
  "A null region and a null material string, which a caller is expected to fill from its own materials database.",
  "A severity region in words with no material recommendation attached, because the second was withdrawn and the first was not."],
 "The absence is published as a value of its own. A caller reading a missing property cannot tell a deliberate refusal from an unset one, so both flags come back false on every screening."),

q(0, "The digest proves the withdrawn severity region is genuinely gone three separate ways. Which of these is one of them?",
 "None of the three material guidance strings and neither standard name appears anywhere in the 775 lines of the engine source.",
 ["The function is still exported, and every call to it now returns an error object that names the standard it is no longer willing to cite.",
  "The vendored golden carries no row for the region, so a case that asked for one would fail the suite.",
  "The studio hides the region rows behind a disclosure, so nothing reaches the screen even when the field is populated."],
 "The three checks are that `sourServiceRegion` is not exported so typeof it is undefined, that neither standard name nor any of the three guidance strings is anywhere in the source, and that no returned string in three whole screenings names either standard."),

q(2, "The expression behind the withdrawn region was not retuned. Why is retuning the wrong repair for that particular defect?",
 "The number is not where the claim sits. Labelling a curve with a standard's name claims that the standard says this, and no amount of measurement makes that true.",
 ["Retuning was attempted and the validation suite stayed entirely green all the way through it, so the measurements that would have settled the constants could never be made at all.",
  "A sour service region comes out as a discrete label rather than as a continuous number, so there is no constant anywhere inside it that a tuning exercise could have moved.",
  "The expression depended on a pH that was often absent, and an expression that cannot be fed reliably cannot be fitted reliably either."],
 "A fit out by a factor of two in a number is a tolerance problem and you repair it by measuring. A fit invented and then given somebody else's authority is a different kind of thing, and the only honest repair is to stop claiming it."),

q(2, "The screening threshold the sour door still compares against was left exactly where it was. What is the reasoning?",
 "Moving a live number to another unsourced value would repeat the original mistake with the sign flipped, so the engine keeps it and declares it held.",
 ["The threshold is the one constant anywhere in this module that carries a published source of its own, so it survived a review that removed a good deal else.",
  "The threshold is exported by name, and an exported constant cannot be moved without breaking any caller reading it by that name.",
  "A threshold only ever drives a boolean flag, so its value cannot reach any number the screening actually prints and there was nothing at all to be gained."],
 "`thresholdHeld` comes back true, which is the engine saying the number is not sourced in this repository. The engine prints the threshold in both units so nobody has to guess which one a comparison was made against."),

q(0, "A colleague quotes the sour screening threshold as a round 0.05 psia. What is wrong with that, and what must a writer watch when saying how far off it is?",
 "The round figure is not the one the engine works to, and two sections state two different relationships for the same pair of numbers.",
 ["The two agree to six decimals in psia and part company only in bar, because the conversion back through the engine's own exact factor is what introduces the difference in the first place.",
  "The round figure is what the studio displays, so the two live at different layers.",
  "Nothing is wrong with it, since the threshold value is held and a held number carries no precision claim."],
 "Section 3 gives the gap between the two as a fraction of THE SMALLER, at 1.526417 percent. Section 24 says a threshold of exactly 0.05 psia is 1.503467 percent BELOW THE ONE THE ENGINE ACTUALLY USES. Quote whichever section you are teaching from and weld neither figure to the other's wording."),

q(1, "Digest section 3 measures every held constant out of the engine's behaviour and also prints what the engine exports. Why print both columns?",
 "An export says what the module declares and a measurement says what it actually uses, so the two disagreeing would itself be a finding.",
 ["A measurement only reaches a constant that appears in a returned field, so the export column covers the rest.",
  "One column is what the studio prints behind its disclosure and the other is what the oracle carries.",
  "Exports are literals and measurements are bisections, so printing both gives the relative difference column something to compare."],
 "The engine exports 15 of the pinned constants. An export agreeing with a measurement checks the export. A measurement on its own checks the behaviour. Both columns are printed so a disagreement would be visible."),

q(3, "A paired experiment moved constants in the engine and in the vendored oracle at the same time. What did it show?",
 "15 of 17 constants moved in both files at once left the suite entirely green, because a constant living in two files cannot be validated by comparing those two files.",
 ["Every one of the 17 was caught by the suite exactly as written, which is the reason the vendored oracle is treated throughout as an independent second derivation of the engine's own answers.",
  "Only the constants that appear in a returned field were caught, so the experiment showed that the suite tests outputs rather than internals.",
  "The suite failed on all 17, but each failure named the wrong constant."],
 "That is why section 3 compares each measured value against a literal in a THIRD file, and why the golden's own copy of the constants is treated as a FOURTH. Any two of them agreeing is no longer enough."),

q(2, "How many held constants does the digest pin, how many does the engine export by name, and how many does the vendored golden carry in its own block?",
 "30 pinned, 15 exported and 28 in the golden's own block.",
 ["11 pinned, 8 exported and 17 in the golden, which are the sizes of the two exported lists and of the case block beside them.",
  "30 pinned, 30 exported and 30 carried in the golden, since the whole point of a pin is to force all three independent copies to hold exactly the same entries.",
  "28 pinned, 15 exported and 30 in the golden, so the generator is the widest of the three copies and the golden the narrowest."],
 "30 constants are pinned in section 3, the engine exports 15 of them by name, and the golden's `heldConstants` block carries 28 that are re-measured against the engine's behaviour."),

q(0, "What kind of quantity is the single rate this engine returns?",
 "A general uniform rate, which the engine states in its own list of absences by naming a localised attack rate as something it does not provide.",
 ["A worst case rate over the wetted surface, which is why the band label beside it is described as possibly optimistic by a step or two.",
  "A rate for the bottom of the line, since the wetting regime and the water cut are what the calculation is built around.",
  "A general rate with a localised multiplier available separately for welds and bends through a door of its own."],
 "Uniform means metal loss spread over the wetted surface at the stated conditions. It is no kind of pitting rate, weld rate or top of line rate, and the module holds no localised model to compare one against."),

q(1, "Four things a reader opens a Corrosion & Integrity studio expecting to find are absent from it. Which set is right?",
 "An inspection interval, a minimum thickness, a retirement thickness and a fitness for service assessment.",
 ["A partial pressure, a wall shear, a remaining life and a binding constraint, none of which this screening returns.",
  "A rate category, a sour flag, a corrosion product regime and a controlling word, all four of which are withheld on every case.",
  "A design life, an allowance, a consumed depth and a water cut."],
 "All four are in `NOT_PROVIDED`. Producing any of them means adopting a standard this module does not carry, so the course reads the word integrity narrowly as an allowance divided by a rate."),

q(3, "This module computes a wall shear. What is it for, and what does its presence not imply?",
 "It decides whether a corrosion inhibitor film survives, and it is not an erosional velocity limit, which this engine does not have at all.",
 ["It converts a velocity into a metal loss from entrained solids, which is what erosional wall loss means on a production line.",
  "It sets the retirement thickness the allowance is measured down to, which is why the allowance and the shear appear on the same rail.",
  "It is the erosional velocity criterion under another name, given as a stress rather than a velocity."],
 "Mechanical erosion from entrained solids or impingement is not modelled here at all, and the engine carries no erosional velocity criterion. The Casing & Tubing Design course owns that criterion and Nodal Analysis and Gas Well Deliverability cite it."),

q(2, "One of the studio's unit conversions is truncated where the engine's own factor is exact. Which one, and by how much?",
 "The psig to bar conversion. The studio divides by 14.5038 where the engine exports 14.503773800722, so the studio's divisor is larger by 1.806e-6 as a fraction.",
 ["The rate conversion to mils a year, where a division by 25.4 and a multiplication by a thousand round before the engine's own figure does.",
  "The density conversion, where 16.0185 stands in for a factor the engine exports to twelve figures and carries into the Reynolds number.",
  "The allowance conversion, where a multiplication by 25.4 loses the definition of the inch that the remaining life arithmetic then divides by."],
 "The exact factor is exact by the definition of the bar and of the pound force, and it is measured out of the psia the engine reports for a partial pressure of exactly 1 bar."),

q(0, "What is that truncated divisor worth on the shipped case, and what follows for this course?",
 "Two rates that differ by 1.434e-6 as a fraction, which is why no graded field in this course is converted through the studio.",
 ["Two rates that differ in the second decimal, which is enough to move the band label and is the reason the label is never graded.",
  "Nothing measurable, because the difference falls below the precision the digest prints and the two conversions give the same double.",
  "Two rates that differ by 1.806e-6 as a fraction, which is the same figure as the divisor gap because the rate is linear in the pressure."],
 "Through the studio's divisor the shipped case gives 0.754523654262 mm/yr and through the engine's exact factor 0.754524736514 mm/yr. All three capstones therefore state their conditions in the engine's units."),

q(3, "In this course the word integrity is used narrowly. What does it cover?",
 "One arithmetic, a corrosion allowance divided by a rate, and nothing beyond that.",
 ["A fitness for service assessment carried out against a minimum thickness the module computes from the allowance and the consumed depth.",
  "The barrier envelope argument the Well Integrity and P&A course owns, restated as wall thickness.",
  "The whole screening, which is why the binding constraint reconciles every field into one verdict."],
 "Reading it narrowly is what keeps the app honest. A screen offering an interval, a thickness and a verdict off the same unsourced chain would look far more useful and be far harder to argue with."),

emit(Q, '/root/fc-wip-corrosion/banks/fc9b_m01.json', expect_n=15)
finish()
