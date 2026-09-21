import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 qra, Expert tier, module 01 "The ALARP Regions".
# Digest sections drawn on: 25 (the three regions, the presets, the R2P2 box),
# 26 (a threshold belongs to the lower band, the boundary snap), the alarpBand
# refusals of section 3, and the vocabulary of section 34.

q(1,
 "For 2e-5 per year under `r2p2-workers`, what does `alarpBand` hand back beside its band word?",
 "TOLERABLE with `alarpDemonstrationRequired` set true, and the ratios 0.020000 of the upper limit and 20.000000 times the lower limit.",
 ["BROADLY_ACCEPTABLE with no demonstration required, because 2e-5 per year sits comfortably below the public upper limit of 1e-4 per year.",
  "TOLERABLE with `alarpDemonstrationRequired` set false, since the demonstration is only asked for when a limit is touched exactly.",
  "UNACCEPTABLE, and the ratios 20.000000 of the upper limit and 0.020000 times the lower limit, read the other way round."],
 "Between 1e-6 and 1e-3 per year a worker individual risk is TOLERABLE only if reduced as low as reasonably practicable, so the engine sets `alarpDemonstrationRequired` true, and it returns 0.020000 of the upper limit and 20.000000 times the lower. The public upper limit plays no part against the worker preset, the demonstration flag is set across the whole middle region, and the swapped ratios invert both quantities."),

q(3,
 "What thresholds do the two R2P2 presets `r2p2-workers` and `r2p2-public` carry in the engine?",
 "Workers unacceptable above 1e-3 per year and the public above 1e-4, with both broadly acceptable at or below 1e-6 per year.",
 ["Workers unacceptable above 1e-4 per year and the public above 1e-3, with both broadly acceptable at or below 1e-6 per year.",
  "Workers unacceptable above 1e-3 per year and broadly acceptable at or below 1e-5, the public above 1e-4 and at or below 1e-6.",
  "Both unacceptable above 1e-3 per year, with the public preset differing only in its lower limit of 1e-7 per year."],
 "The course shows the presets: workers above 1e-3 and at or below 1e-6, the public above 1e-4 and at or below 1e-6. Swapping the two upper limits puts the looser limit on the public. There is no 1e-5 lower limit for workers and no 1e-7 lower limit for the public, so the other two pairs are invented thresholds."),

q(0,
 "An individual risk of 5e-4 per year is banded under each preset in turn. Which pair of band words comes back?",
 "TOLERABLE against `r2p2-workers` and UNACCEPTABLE against `r2p2-public`, because it lies between 1e-4 and 1e-3.",
 ["UNACCEPTABLE against both presets, since any individual risk above 1e-4 per year is intolerable whoever carries it.",
  "TOLERABLE against both presets, since 5e-4 per year lies below the upper limit of 1e-3 that R2P2 prints for everyone.",
  "TOLERABLE against `r2p2-public` and UNACCEPTABLE against `r2p2-workers`, the looser limit belonging to the public."],
 "The worker upper limit is 1e-3 per year and the public one is 1e-4, so 5e-4 is TOLERABLE for a worker and UNACCEPTABLE for a member of the public, which is the row the course shows. The upper limit of 1e-4 applies to the public preset only, 1e-3 applies to workers only, and the reversed pair gives the public the looser limit."),

q(2,
 "A worker's individual risk sits exactly on the upper limit, 1e-3 per year. Which band holds it, and on whose authority?",
 "TOLERABLE with the boundary `unacceptable` named, by the owner's decision that a value exactly at a threshold belongs to the lower band.",
 ["UNACCEPTABLE, because R2P2's bias to safety puts every value sitting at a threshold in the worse band, and the engine follows that reading.",
  "TOLERABLE with no boundary named, because the engine rounds 1e-3 down to the band below before it compares anything at all.",
  "A refusal, because a value exactly on a threshold is ambiguous and the engine asks the caller to move it off the line."],
 "The course records it as the owner's decision: a value exactly at a threshold belongs to the lower band, so 1e-3 is TOLERABLE for workers and the result names the boundary `unacceptable` it touched. R2P2's bias to safety is the argument the other way, which the engine declined. Nothing is rounded, and the boundary is reported, never refused."),

q(1,
 "A member of the public carries exactly 1e-6 per year. Where does the engine place that value?",
 "BROADLY_ACCEPTABLE, with the boundary `broadly-acceptable` named and no ALARP demonstration required.",
 ["TOLERABLE, with the boundary `broadly-acceptable` named and an ALARP demonstration required because the value is on the limit.",
  "BROADLY_ACCEPTABLE, with no boundary named, because a lower limit is written at or below and so is never touched by the engine.",
  "TOLERABLE, with no boundary named, because the lower limit is exclusive and 1e-6 per year has to fall strictly below it."],
 "The lower limit is written 'at or below', so 1e-6 per year is BROADLY_ACCEPTABLE, the flag is false, and the engine still names the boundary `broadly-acceptable` that the value sits on, as the course's row shows. Putting the value in TOLERABLE would place a threshold in the upper band, which is the convention the engine did not take, and the boundary name is reported at either limit."),

q(3,
 "Three stated factors, 0.1 x 0.1 x 0.1, multiply to 0.0010000000000000002 in IEEE double. Against the worker preset, what band does the engine return, and why?",
 "TOLERABLE with the boundary `unacceptable`, because a value within 1e-9 relative of a threshold IS the threshold.",
 ["UNACCEPTABLE, because the product lies above 1e-3 in double and the engine compares the value exactly as it arrives.",
  "UNACCEPTABLE with the boundary `unacceptable` named, because the engine flags the touch and then bands the value above it.",
  "A refusal, because the engine detects the rounding error in the product."],
 "BOUNDARY_SNAP is 1e-9 relative: a computed value that close to a threshold is taken as the threshold, so the product stays TOLERABLE for workers and `atBoundary` names `unacceptable`. Without the snap a plain comparison would call it UNACCEPTABLE, although the exact product is the threshold itself. The engine never refuses a value for being close to a limit."),

q(2,
 "An individual risk of 1.0000001e-6 per year, one part in ten million above the lower limit, is banded against the public preset. What comes back?",
 "TOLERABLE with the boundary null, because the snap is 1e-9 relative and this value lies outside it.",
 ["BROADLY_ACCEPTABLE with the boundary `broadly-acceptable`, because the snap treats anything within a part in ten million as the limit.",
  "BROADLY_ACCEPTABLE with the boundary null, because the engine rounds every individual risk to six significant figures before banding.",
  "TOLERABLE with the boundary `broadly-acceptable`, because the engine names the nearest limit whenever the value is close to one."],
 "The snap is narrow: 1e-9 relative. One part in ten million is a hundred times wider, so 1.0000001e-6 per year is TOLERABLE for the public with boundary null, the golden case the course shows. Reading the snap as a part in ten million widens it wrongly, the engine rounds nothing before banding, and a boundary is named only when the value is taken as the threshold."),

q(0,
 "Which sources does the course cite for the claim that every source the engine read words its threshold so that equality falls in the lower band?",
 "R2P2 paragraph 136 says \"more than\" and Bevi says \"ten hoogste\" (at most), and the checklist says costs over benefits \"greater than\" the DF.",
 ["The Purple Book Figure 6.8 caption, \"F < 1e-3 N^-2\", and R2P2's bias to safety, which together put a value lying on a line in the band above it.",
  "R2P2 paragraph 136 says \"at least\" and Bevi says \"more than\", and the engine therefore rounds a value at the threshold to the band below.",
  "The checklist says costs over benefits \"at least\" the DF and R2P2 says limits are guidelines, so equality is left to the analyst."],
 "The course quotes R2P2 paragraph 136 \"more than\", Bevi \"ten hoogste\" and the checklist \"greater than\", each of which puts equality in the lower band. The Figure 6.8 caption and R2P2's bias to safety are the two things that argue the other way, so they cannot support the claim. Neither \"at least\" wording appears in the course, and the engine rounds nothing."),

q(2,
 "Which argument does the course name as pointing the OTHER way from the owner's decision on a value exactly at a threshold?",
 "R2P2's bias to safety, which could argue that a value at the limit should fall in the worse band, together with the Figure 6.8 caption that reads the other way at equality.",
 ["The IEEE double product 0.0010000000000000002, which shows the exact product lying above 1e-3 per year and so in the upper band at every threshold.",
  "Bevi's wording \"ten hoogste\", which the course translates as at least and which puts a value on the Dutch line in the band above.",
  "The checklist's DF of more than 10 being unlikely, which argues that a cost at DF times the benefit is always grossly disproportionate."],
 "The course names R2P2's bias to safety as the argument for the other convention, and notes the Purple Book Figure 6.8 caption, \"F < 1e-3 N^-2\", reads the other way at equality. The double product is a rounding artefact that the snap exists to absorb. \"Ten hoogste\" means at most, which supports the lower band, and the DF note says nothing about equality."),

q(1,
 "The R2P2 box prints the 1999/00 service sector rate as 1 in 388 565 a year, which the golden writes as 0.000002573572 per year. What band does the engine return against the worker preset?",
 "TOLERABLE, because it is still above 1 in a million, although well below the upper limit.",
 ["BROADLY_ACCEPTABLE, because R2P2 says worker rates are normally well below the upper limit of 1 in 1000 a year.",
  "BROADLY_ACCEPTABLE, because the box bands every industry rate against the public preset whatever its source names.",
  "UNACCEPTABLE, because a rate read from a published statistic counts every death across the whole workforce at once."],
 "0.000002573572 per year sits above the worker lower limit of 1e-6 and below the upper limit of 1e-3, so the engine returns TOLERABLE, and the box's own note says it is still above 1 in a million. Being well below the upper limit is not the same as being broadly acceptable. Each rate is banded against the preset its source names, which for the service sector is workers."),

q(3,
 "The R2P2 box's public gas rate, 1 in 1 510 000 over 1994/5 to 1998/9, is written 0.000000662252 per year. Against which preset is it banded, and what comes back?",
 "Against `r2p2-public`, and BROADLY_ACCEPTABLE, matching the source's words \"below the limit of what is often regarded as broadly acceptable\".",
 ["Against `r2p2-workers`, and TOLERABLE, because a rate read from an industry statistic always carries a worker's ALARP demonstration along with it.",
  "Against `r2p2-public`, and TOLERABLE with the boundary `broadly-acceptable`, because the value lies inside the snap of 1e-6 per year.",
  "Against `r2p2-public`, and UNACCEPTABLE, because every rate carried by a member of the public is judged against the upper limit of 1e-4 per year."],
 "The course bands each rate against the preset its source names, and the public gas rate goes against `r2p2-public`: 0.000000662252 per year is below 1e-6, so it is BROADLY_ACCEPTABLE, as the source says. It is nowhere near the 1e-9 relative snap of the lower limit, it lies far below the public upper limit of 1e-4, and a worker preset would not be the preset its source names."),

q(0,
 "`alarpBand` is called with an individual risk and no thresholds at all. What does the engine return?",
 "A refusal naming `thresholds`, in the engine's own words: thresholds: a preset name or { unacceptableAbovePerYr, broadlyAcceptableAtOrBelowPerYr } is required",
 ["The band against `r2p2-workers`, the preset the engine falls back on whenever the caller has not named another one.",
  "The band against `r2p2-public`, the stricter preset, which the engine chooses when nothing is given because it errs to safety.",
  "The two ratios with a band of null, so that the analyst can read the individual risk against limits of their own later."],
 "The quoted message is the engine's own, and it names the field `thresholds`. The engine invents no input, so there is no default preset, strict or loose, and a refusal returns an error in place of any result, which rules out ratios with a null band."),

q(3,
 "A caller passes the thresholds preset name `constructor`, a name every JavaScript object carries. What does the engine do?",
 "It refuses, in its own words: thresholds: unknown preset 'constructor'; one of r2p2-workers, r2p2-public, or give { unacceptableAbovePerYr, broadlyAcceptableAtOrBelowPerYr }",
 ["It resolves the name to the object constructor, finds no limits there and bands every individual risk as BROADLY_ACCEPTABLE.",
  "It ignores the unknown name and bands the individual risk against `r2p2-workers`, the first preset in its own list of presets.",
  "It throws an uncaught type error, since the name resolves to a function where the engine expects an object of limits."],
 "A preset name is looked up only among the names the engine itself defines, so `constructor` is refused like any other unknown name, and the message quoted is the engine's own. It never resolves an inherited name, never falls back to a preset it was not given, and returns a refusal object with a field rather than throwing."),

q(1,
 "A caller gives thresholds of their own with `unacceptableAbovePerYr` of 1e-6 and `broadlyAcceptableAtOrBelowPerYr` of 1e-3. What does the engine return?",
 "A refusal naming the lower limit, in the engine's own words: thresholds.broadlyAcceptableAtOrBelowPerYr: must lie below unacceptableAbovePerYr",
 ["A band computed after the engine quietly swaps the two limits into the order it expects, with a note added in the basis block to say that it did so.",
  "UNACCEPTABLE for every individual risk above 1e-6 per year, since the upper limit is taken exactly as the caller typed it.",
  "BROADLY_ACCEPTABLE for every individual risk at or below 1e-3 per year, since the lower limit is applied before the upper one."],
 "Thresholds in the wrong order are refused, and the quoted message is the engine's own, naming `thresholds.broadlyAcceptableAtOrBelowPerYr`. The engine does not repair a caller's input by swapping it, and it does not band anything against an inverted pair, which is why the two partial readings are both wrong."),

q(2,
 "The two exported constants BOUNDARY_SNAP and BRANCH_SUM_TOLERANCE are both 1e-9. How do they differ in the way the engine applies them?",
 "BOUNDARY_SNAP is relative to the threshold it tests, while BRANCH_SUM_TOLERANCE is absolute on the sum of a branch set.",
 ["BOUNDARY_SNAP is absolute on an individual risk per year, while BRANCH_SUM_TOLERANCE is relative to the size of the tree.",
  "They are one constant exported under two names, and the engine applies the same absolute test wherever a value meets a limit.",
  "BOUNDARY_SNAP rounds an individual risk to nine decimals before banding, and BRANCH_SUM_TOLERANCE rounds each branch."],
 "The course describes BOUNDARY_SNAP as 1e-9 relative, a computed value within that distance of a threshold being the threshold, and BRANCH_SUM_TOLERANCE as 1e-9 absolute on a branch sum. An absolute 1e-9 would swamp an individual risk near 1e-6 per year, so the snap cannot be absolute. Neither constant rounds anything; each decides when two values count as equal."),

emit(Q, '/root/hse-wip-qra/banks/h5a_m01.json', expect_n=15)
finish()
