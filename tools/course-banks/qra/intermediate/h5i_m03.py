import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 Professional m03: The F-N Curve.
# Digest sections 17 (the frequency of N or more, the step, zero-death
# scenarios), 18 (reading it wrongly: more than N, one N alone) and 19 (the
# area identity and no published worked example). Every F-N figure here is
# checked by SELF-CONSISTENCY ONLY and is never presented as published.

q(0,
 "The JISIKE off-site scenarios are stated as a toxic cloud over the town at 2e-7 per year with N of 300, a vapour cloud explosion at 1.5e-6 with N of 40, a flash fire at the road at 8e-6 with N of 12, two jet fires at the fence at 3e-5 and 1e-5 each with N of 3, and a release that reaches no one at 5e-5 with N of 0. What is F(3)?",
 "0.000049700000",
 ["0.000009700000","0.000040000000","0.000050000000"],
 "F(3) is the frequency of all scenarios with 3 OR MORE deaths: both jet fires, the flash fire, the explosion and the toxic cloud, 0.000049700000 per year. 0.000009700000 is \"more than 3\", which drops the two jet fires sitting on the corner. 0.000040000000 counts only the scenarios with exactly 3. 0.000050000000 is the frequency of the release that reaches no one, which is kept out of the curve.")

q(2,
 "Continuing with those scenarios, what frequency does the curve carry at its second corner, N = 12?",
 "0.000009700000",
 ["0.000001700000","0.000008000000","0.000049700000"],
 "F(12) sums every scenario with 12 or more deaths, the flash fire, the explosion and the toxic cloud, which the engine returns as 0.000009700000 per year. 0.000001700000 reads \"more than 12\" and loses the flash fire. 0.000008000000 is the flash fire alone, the scenarios with exactly 12. 0.000049700000 is the previous corner, F(3).")

q(3,
 "At the corner N = 40, which F does the JISIKE off-site step curve carry?",
 "0.000001700000",
 ["0.000000200000","0.000001500000","0.000009700000"],
 "Two scenarios reach 40 deaths or more, the vapour cloud explosion and the toxic cloud over the town, and their frequencies add to 0.000001700000 per year. Dropping the explosion, as a strict reading does, leaves 0.000000200000. Keeping the explosion without the town cloud leaves 0.000001500000. The value 0.000009700000 still includes the flash fire at the road, which kills 12 and belongs to the step before.")

q(1,
 "An analyst reads F(12) on the JISIKE off-site set as 0.000008000000. What did they do?",
 "They counted only the scenario with exactly 12 deaths",
 ["They read \"more than 12\", which the introduction of the Purple Book prints",
  "They added in the release that reaches no one, at 5e-5 per year",
  "They divided F(12) by the 12 deaths at that corner, as a frequency per death"],
 "The digest's table prints 0.000008000000 as the frequency of the scenarios with exactly N at the corner of 12, which is the flash fire alone. Reading \"more than 12\" gives 0.000001700000. Adding the release that reaches no one would raise the figure, and that scenario is kept out of the curve anyway. Dividing a corner by its N has no meaning on a curve of frequencies and gives no figure the digest prints.")

q(0,
 "Reading the JISIKE off-site curve as a step function, what is F(5)?",
 "0.000009700000 per year, the value it takes at F(12)",
 ["0.000049700000 per year, the value it takes at F(3)",
  "0.000000000000 per year, since no scenario has an N of 5",
  "0.000040000000 per year, the jet fires carried forward"],
 "F(5) is the frequency of 5 or more deaths, and no scenario has an N between 3 and 12, so F(5) = F(12) = 0.000009700000 per year, as the digest reads the step. F(3) includes the two jet fires, whose 3 deaths are fewer than 5. A curve of N or more is never zero merely because no scenario sits at that N. The jet fires sum to 0.000040000000, and they have fewer than 5 deaths.")

q(3,
 "Two JISIKE jet fires share N = 3. How does the engine place them on the curve?",
 "As one corner at N = 3 carrying both frequencies",
 ["As two corners at N = 3, drawn one above the other",
  "As one corner carrying the larger of the two frequencies",
  "As one corner at N = 6, the sum of their two N values"],
 "The digest says two scenarios sharing N = 3 make ONE corner, carrying both frequencies, since the curve takes a value at each distinct N. Two corners at one N is not a step function. Taking only the larger frequency drops the 1e-5 per year of the second jet fire. Adding their N values would claim a single event killing six, which neither scenario describes.")

q(2,
 "What does the engine do with the release that reaches no one, stated at 5e-5 per year with N of 0?",
 "It keeps it out of the curve and reports its 0.000050000000 per year separately",
 ["It places it at a corner at N = 0 at the foot of the curve, at 0.000050000000 per year",
  "It refuses the call, since an F-N curve needs every N to be above zero",
  "It adds its frequency to every corner, since it is counted with N or more"],
 "Scenarios with no deaths are kept out of the curve, and the engine reports their frequency, 0.000050000000 per year, beside it. The model string takes corners only at each distinct N above zero, so there is no corner at N = 0. The call is accepted, since an N of 0 is allowed. Adding it to a corner would count a release that kills nobody among scenarios with 3 or more deaths.")

q(1,
 "Besides the F-N points, what expected fatalities per year does fnCurve return for the JISIKE off-site set?",
 "0.000336000000",
 ["0.000049700000","0.002420000000","0.000050000000"],
 "fnCurve returns the expected fatalities per year, the sum of f times N, as 0.000336000000 for the off-site set. 0.000049700000 is F(3), the top of the curve, which is a frequency of events with 3 or more deaths and no expected count. 0.002420000000 is the JISIKE crew PLL on other scenarios. 0.000050000000 is the frequency of the release that reaches no one.")

q(3,
 "The area under the JISIKE off-site step curve is summed step by step, as F at each corner times the width of its step. What does it equal?",
 "The expected fatalities per year, 0.000336000000, which is the off-site PLL",
 ["F at the first corner, 0.000049700000, since each later step sits under it",
  "The sum of the four corner values, since every step is one death wide",
  "The frequency kept out of the curve, 0.000050000000, since it closes the area"],
 "The digest calls it the area identity: summed step by step, the area is 0.000336000000 per year, equal to the expected fatalities per year, and for the off-site set also the off-site PLL. It is one of the self-consistency checks of the curve. The first corner is a height and no area. The steps are wider than one death, so the corners do not simply add. The release that reaches no one adds no area, since its N is 0.")

q(0,
 "The Purple Book's introduction to societal risk speaks of \"more than N\", while its equation 6.6 and section 6.3 say \"N or more\". Which reading does the engine follow?",
 "N or more, following the equation, and this course does the same",
 ["More than N, following the introduction, since it comes first",
  "Either one, chosen by a flag the caller sets on each call",
  "N or more at small N and more than N above the line's range"],
 "The digest says the source contradicts itself and that the engine follows the equation, \"N or more\", as does this course. The engine exposes no flag for the other reading. Switching reading with N has no basis in the source. Reading \"more than N\" drops the scenarios sitting exactly at each corner, which is why the choice matters.")

q(2,
 "What does reading \"more than N\" do to the JISIKE off-site curve at every corner?",
 "It drops the scenarios sitting exactly at that corner, so each corner falls",
 ["It adds the scenarios just below the corner, so each corner rises",
  "It changes nothing, since no two scenarios share one value of N",
  "It removes only the release that reaches no one from the curve"],
 "The digest's comparison shows \"more than N\" below \"N or more\" at every corner: at 3 it reads 0.000009700000 against 0.000049700000, and at 300 it reads 0.000000000000. The corner's own scenarios are dropped, and nothing is added. Two jet fires do share N = 3, and the release that reaches no one is outside the curve under either reading.")

q(1,
 "Since no published worked F-N example exists, how is the engine's curve checked?",
 "Self-consistency only: a brute force count at each corner, a second route on a grid of N, and the area identity",
 ["A worked F-N example printed in the Purple Book, reproduced at every corner to twelve decimals",
  "The CCPS and HSE worked societal examples, which the engine reproduces within their rounding",
  "The R2P2 point, which fixes the curve at N = 50 and so pins every other corner of it"],
 "The digest says no source the engine read prints a worked F-N curve or a worked societal calculation, and the CCPS and HSE worked examples were not available. The curve is therefore checked by self-consistency only, through the three routes named in the key. The R2P2 point is a criterion the curve is compared with, which fixes nothing about the curve itself.")

q(3,
 "An analyst writes up the JISIKE off-site F(12) of 0.000009700000 per year. How may the write-up describe that figure?",
 "As the engine's N or more result, checked by self-consistency, with no published F-N example behind it",
 ["As a published reproduction, since the Purple Book prints the same curve in its own worked example",
  "As verified against the Bevi points, since those three points lie on the curve at N of 10, 100 and 1000",
  "As a figure matched to the CCPS worked societal example, which the engine reproduces to the last printed digit"],
 "The course never presents an F-N figure as a published reproduction, because no published worked F-N example exists. The Bevi points lie on the Purple Book criterion line, which is the published side, and say nothing about this curve. The CCPS and HSE worked examples were not available to the engine, so nothing was matched to them.")

q(0,
 "Quote the basis model the engine writes beside every F-N curve.",
 "F(N) = sum of f_i with N_i >= N, at each distinct N_i > 0 (left-continuous step function)",
 ["F(N) = sum of f_i with N_i > N, at each distinct N_i >= 0 (right-continuous step function)",
  "F(N) = sum of f_i x N_i over every scenario, at each distinct N_i > 0 (a cumulative sum)",
  "F(N) = f_i at N_i alone, at each distinct N_i > 0, joined by straight lines between corners"],
 "The digest quotes the model string in the key word for word: N or more, corners only at N above zero, a left-continuous step. The strict inequality is the \"more than N\" reading, and counting N of zero would put the release that reaches no one on the curve. A sum of f times N is the expected fatalities. A frequency at one N alone is the exactly N reading, and the curve holds steps with no straight lines.")

q(2,
 "One scenario in an F-N call carries no name. What error string comes back from fnCurve?",
 "scenarios[0].name: every scenario needs a name",
 ["tree.branches[0].name: every branch needs a name",
  "scenarios: must be a non-empty list of scenarios",
  "criterion.exponentAlpha: must be above 0 (1 is risk neutral, 2 risk averse)"],
 "The refusal table gives this exact string for fnCurve with a nameless scenario, naming scenarios[0].name. The branch message is the event tree's refusal for a branch with no name, and the empty list message is the one locationIndividualRisk returns when it has no scenarios. The exponentAlpha message belongs to fnCriterionComparison when a line is given no slope.")

emit(Q, '/root/hse-wip-qra/banks/h5i_m03.json', expect_n=15)
finish()
