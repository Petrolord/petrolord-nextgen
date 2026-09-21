import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 Professional m05: One Published Point and the Boundary.
# Digest sections 22 (the R2P2 point, no slope, a line the analyst supplies),
# 23 (touching the line, the snap, the state words) and 3 (the two unknown
# preset refusals of fnCriterionComparison).

q(2,
 "What is the engine's preset r2p2-para-136?",
 "One point, N = 50 at 0.000200000000 per year, with no slope",
 ["A line through N = 50 at 0.000200000000 per year, slope minus one",
  "A line with C = 1e-3 and alpha = 2, capped at N = 50",
  "Two points, N = 50 and N = 100, with a slope taken between them"],
 "R2P2 paragraph 136 gives a single point, an accident killing 50 or more at more than one in five thousand a year, and the preset is that one point, N = 50 at 0.000200000000 per year, with no slope. The slope minus one line is common practice and no preset. C = 1e-3 with alpha 2 is the Dutch line. R2P2 prints no second point.")

q(0,
 "Why does the engine give the R2P2 point no slope?",
 "R2P2 defers extrapolation to other N to a reference the engine did not read",
 ["R2P2 prints a slope of zero, so the criterion is flat at every value of N",
  "A slope would double count the aversion already inside the R2P2 frequency",
  "The engine infers the slope from the Dutch line and so needs none of its own"],
 "The digest says R2P2 defers extrapolation to other N to a reference the engine did not read, so the engine gives the point NO SLOPE and compares the curve at N = 50 only. R2P2 prints no slope at all, flat or otherwise. The engine carries no aversion weighting of any kind. It borrows nothing from the Dutch line, which is a separate preset from another source.")

q(3,
 "Set against the R2P2 point, how does the JISIKE off-site curve come out?",
 "BELOW, ratio 0.001000 at N = 50.000000",
 ["EXCEEDS, ratio 18.000000 at N = 300.000000",
  "TOUCHES, ratio 1.000000 at N = 50.000000",
  "BELOW, ratio 0.014910 at N = 3.000000"],
 "F(50) is 0.000000200000 per year against the point's 0.000200000000, a ratio of 0.001000, and the state is BELOW. EXCEEDS at 18.000000 is the same curve against the Dutch line. TOUCHES at 1.000000 is the golden r2p2-touch case, whose curve is built to sit on the point. BELOW at 0.014910 is the curve against the line of slope minus one an analyst supplies.")

q(1,
 "R2P2 paragraph 136 speaks of 50 or more deaths. How often a year does the JISIKE off-site set reach that?",
 "0.000000200000, from the toxic cloud at N = 300 alone",
 ["0.000001700000, from the explosion and the toxic cloud",
  "0.000000000000, since no scenario has exactly 50 deaths",
  "0.000001500000, from the explosion at 40, the corner below"],
 "F(50) is the frequency of 50 OR MORE deaths, and only the toxic cloud at N = 300 has that many, so it is 0.000000200000 per year. 0.000001700000 is F(40), which includes the explosion with 40 deaths, fewer than 50. Zero is the exactly N reading, which N or more never takes. The explosion alone is 0.000001500000 and has too few deaths to count at 50.")

q(0,
 "An analyst wants the common line of slope minus one through the R2P2 point. How is it given to the engine?",
 "As their own criterion, C = 0.01 and alpha = 1, from N = 1 by default",
 ["As the preset r2p2-para-136 with a flag that switches the slope on for them",
  "As the preset vrom-establishments with C changed to 0.01 by the engine",
  "As the preset r2p2-line, which the engine keeps beside the published point"],
 "The digest says the slope minus one line is common practice but is not in R2P2 and is not a preset, so the analyst gives it as their own criterion, C = 0.01 and alpha = 1, from N = 1 by default. The R2P2 preset has no slope flag. The Dutch preset has fixed constants. The name r2p2-line is refused as an unknown preset.")

q(2,
 "An analyst supplies C = 0.01 and alpha = 1. Where is the worst corner of the JISIKE curve against that line, and what is the state?",
 "BELOW, worst ratio 0.014910 at N = 3.000000",
 ["BELOW, worst ratio 0.001000 at N = 50.000000",
  "EXCEEDS, worst ratio 1.396800 at N = 12.000000",
  "BELOW, worst ratio 0.014910 at N = 300.000000"],
 "The digest prints BELOW with a worst ratio of 0.014910 at N = 3.000000 against that line, which runs from N = 1 and so checks the corner at 3 as well. 0.001000 at N = 50 is the published point. 1.396800 at N = 12 is the first exceeding corner against the Dutch line. The worst ratio sits at N = 3, where F is largest against the line, and the corner at 300 is not it.")

q(3,
 "When an analyst supplies their own line, what source does the engine's basis name?",
 "criterion as given",
 ["UK HSE, Reducing risks, protecting people (2001) para 136",
  "TNO Purple Book CPR 18E (1999) Figure 6.8",
  "the analyst's line, as extrapolated from R2P2 paragraph 136"],
 "The digest says the basis then names the source as \"criterion as given\", so the result shows the line is the analyst's own. The R2P2 paragraph is the source of the preset point, and the Purple Book figure is a source of the Dutch line. The engine never claims to extrapolate R2P2, which is exactly why the line must be supplied.")

q(1,
 "A curve is built from a touching scenario at 1e-5 per year with N = 10 and a small scenario at 2e-5 per year with N = 1. What does the engine return against the Dutch line?",
 "TOUCHES, with the corner at N = 10 AT_LINE at ratio 1.000000",
 ["EXCEEDS, since a corner equal to the line is taken as above it",
  "BELOW, since the corner at N = 1 is below the line's range",
  "AT_LINE overall, with the corner at N = 10 marked as TOUCHES"],
 "At N = 10 F is 0.000010000000 and so is the line, a ratio of 1.000000, and that corner is AT_LINE; with no corner above, the curve TOUCHES. EXCEEDS means strictly above at some corner. The corner at N = 1 is outside the range and is not checked, so BELOW misses the corner that is on the line. AT_LINE is the word for one corner and TOUCHES the word for the curve, so the reading that swaps them has the roles reversed.")

q(0,
 "What does EXCEEDS mean in the engine's state words?",
 "At least one checked corner lies strictly above the line or point",
 ["Every checked corner lies above the line, with none on or below it",
  "The worst ratio is at least one, counting a corner on the line too",
  "The expected fatalities per year exceed the line's value at N = 1"],
 "The digest defines EXCEEDS as at least one corner strictly above. A single corner is enough, so every corner above is not needed. A corner on the line within the snap is AT_LINE and leaves the curve at TOUCHES, so a ratio of exactly one does not count. The state compares frequencies at corners and never uses the expected fatalities.")

q(3,
 "The golden case r2p2-touch has F(50) = 1.5e-4 + 5e-5, which is 0.00019999999999999998 in double. What does the engine return, and why?",
 "TOUCHES, because a corner within 1e-9 relative of the point counts as on it",
 ["BELOW, because the sum in double falls a hair under the point's frequency",
  "EXCEEDS, because the engine rounds every sum up before it compares it",
  "A refusal, because the frequencies at the corner do not sum to one"],
 "The digest prints ratio 0.9999999999999999 and state TOUCHES: within 1e-9 relative of the criterion counts as on it. Without the snap a plain comparison would call the curve BELOW, although on paper it sits exactly on the point. The engine rounds nothing up. Scenario frequencies are rates per year and are never required to sum to one.")

q(2,
 "fnCriterionComparison is given the criterion 'r2p2-line'. Which message does the engine return, in its own words?",
 "criterion: unknown preset 'r2p2-line'; one of vrom-establishments, r2p2-para-136, or give { constantC, exponentAlpha } or { points }",
 ["criterion.exponentAlpha: must be above 0 (1 is risk neutral, 2 risk averse)",
  "tree.branches[1].name: 'fire' appears twice in one branch set",
  "substance: must be one of k1-liquid, gas-low-reactivity, gas-average-high-reactivity (PB Table 4.7 classifies reactivity)"],
 "The refusal table gives this exact string, naming the field criterion and listing the two presets the engine has. The exponentAlpha message is the same function refusing a line with no slope. The branch message is the event tree refusing one name twice in a branch set. The substance message is the direct ignition lookup refusing a class its table does not have.")

q(1,
 "The criterion 'valueOf' is passed to fnCriterionComparison. Every JavaScript object carries that name. What happens?",
 "It is refused like any other unknown preset, since the engine looks a preset up only among the names it defines",
 ["It is accepted and treated as the Dutch line, since the first preset is used whenever the name is unrecognised",
  "It is accepted and returns BELOW with no checks, since an inherited name carries no constants to compare",
  "It raises an exception inside the engine, since an inherited name cannot be looked up at all by any function"],
 "The digest says a preset name is looked up only among the names the engine itself defines, and the refusal table shows 'valueOf' refused with the engine's own words: criterion: unknown preset 'valueOf'. No fallback preset is ever substituted. A result with no checks would read as a real comparison. The engine returns an error and a field, which is data, and throws nothing.")

q(0,
 "How wide is the snap that decides whether a corner is on the line?",
 "1e-9 relative to the criterion",
 ["1e-9 per year, taken absolute",
  "1e-6 relative to the criterion",
  "One per cent of the line value"],
 "The digest says a corner within 1e-9 relative of the line is AT_LINE, the same width as BOUNDARY_SNAP. An absolute 1e-9 per year would swallow the whole of a line near 1e-9 at N = 1000. 1e-6 would call corners on the line that are measurably off it. One per cent is no figure the engine uses.")

q(3,
 "A comparison comes back BELOW. Which condition held at the checks the engine made?",
 "No corner in range reached the criterion; each sat strictly under it",
 ["Most checked corners lie below the criterion, with at most one of them above",
  "The corner with the largest N lies below the line or point",
  "The curve lies below the line at N = 1, where the line is at its very highest"],
 "The digest defines BELOW as every checked corner strictly below the line or point. One corner above makes the curve EXCEED, and one on the line makes it TOUCH. The corner with the largest N is only one of the checks. N = 1 lies outside the Dutch line's range, and the state reads every corner in range.")

q(2,
 "Which pair of words does the engine use for a corner on the line and for a curve with no exceedance and at least one such corner?",
 "AT_LINE for the corner and TOUCHES for the curve",
 ["TOUCHES for the corner and AT_LINE for the curve",
  "ON_LINE for the corner and BELOW for the curve",
  "AT_LINE for the corner and EXCEEDS for the curve"],
 "The digest's state words table gives AT_LINE as the state of one corner on the line and TOUCHES as the overall state when no corner is above and at least one is on the line. Swapping them misreads the table. ON_LINE is no state word. A curve with no corner above cannot EXCEED, since EXCEEDS needs a corner strictly above.")

emit(Q, '/root/hse-wip-qra/banks/h5i_m05.json', expect_n=15)
finish()
