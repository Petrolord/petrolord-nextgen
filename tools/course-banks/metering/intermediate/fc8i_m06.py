import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Professional m06, travel and a verdict over checks that ran.
# Every figure is from digest SECTION 24 at the rendering that section prints.
# The only comparison asserted anywhere in this bank is the RELATION the digest
# computes between the equal percentage travel and the linear travel at the same
# required coefficient.

q(1, "Three flows are given and all three checks run clean. What is the minimum duty travel, in percent open?",
 "47.956430",
 ["37.222222",
  "74.737770",
  "83.997848"],
 "On that case the normal duty sits at 74.737770 percent open and the maximum duty at 83.997848 percent open, with 3 of the 3 checks run, a verdict of true and 0 warnings.")

q(3, "The same valve is asked for a minimum flow that is hard against its seat. What does the engine report?",
 "A minimum travel of 0.000000 percent open, all 3 checks run, a verdict of false and 1 warning.",
 ["A minimum travel of 0.000000 percent open, 2 of the 3 checks run, a verdict of null and 1 warning.",
  "A minimum travel withheld by name, all 3 checks run, a verdict of false and 1 warning.",
  "A minimum travel of 47.956430 percent open, all 3 checks run, a verdict of false and 0 warnings."],
 "A valve at 0.000000 percent open is shut, and the travel is a number the engine computed and is prepared to defend.")

q(0, "What does a loop do when its minimum duty lands on the seat?",
 "It loses proportional control at the low end, so the only thing left is a sequence of openings and closings the process sees as a cycle.",
 ["It loses proportional control at the low end, so the controller saturates at full travel and the process runs above its set point.",
  "It keeps control but with a large offset, because the plug meters against the seat land at a coefficient the trim can still resolve.",
  "It keeps control and loses only its speed of response, because the positioner has to drive the plug off the seat before flow starts."],
 "Seats are damaged by exactly that duty, because the trim is being landed repeatedly under a full pressure drop.")

q(2, "The maximum duty on the healthy case sits at 83.997848 percent open. What is worth noticing about that?",
 "There is travel left in hand above it, which a valve reaching its design flow at the top of its stroke would not have.",
 ["There is no travel left in hand above it at all, which is the reason the engine raises a warning on that case rather than a clean verdict.",
  "It is the highest travel the engine will ever report on any case, because the check is bounded at the top of the stroke and clips there.",
  "It is the travel at which the engine switches from the equal percentage curve to the linear one."],
 "A valve that reaches its design flow only at the very top of its stroke has nothing left for a fouled exchanger, a worn pump or an off design day.")

q(1, "What decides the travel that a required coefficient corresponds to?",
 "The inherent characteristic and the rangeability of the trim.",
 ["The valve authority and the total system drop.",
  "The pressure recovery factor and the allowable drop.",
  "The minimum flow and the maximum flow the check was handed for the duty."],
 "Rangeability is the span between the largest and the smallest coefficient the trim can meter with, and both it and the characteristic are properties the vendor states for the specific trim.")

q(2, "Equal percentage trim at a rangeability of 50 puts the normal duty at 74.737770 percent open. Where does linear trim put it, in percent open?",
 "37.222222",
 ["47.956430",
  "83.997848",
  "0.000000"],
 "The duty has not changed. The flow, the pressure drop, the fluid and the required coefficient are all the same on both, and only the shape of the relationship between travel and coefficient has changed.")

q(3, "The course sets those two travels against each other. What ratio does it print, the first over the second?",
 "2.007880",
 ["1.021201",
  "1.074452",
  "1.763636"],
 "It prints 37.515548 for the difference of the first less the second on the same line. Computed and printed is what allows a comparison to be quoted at all.")

q(2, "Why does the equal percentage figure sit further up the stem than the linear one?",
 "Equal percentage trim passes very little near the seat and a great deal near the top of its travel, so the same coefficient needs more opening.",
 ["Equal percentage trim passes a great deal near the seat and very little near the top of its travel, so the same coefficient needs more opening.",
  "Equal percentage trim is rated at a larger coefficient at full travel, so a given duty is a smaller fraction of what the trim can pass.",
  "Equal percentage trim is fitted with a longer stroke, so the same fraction of the coefficient corresponds to a longer travel in inches."],
 "The stem position is the visible consequence of the curve, which is the whole reason a characteristic is chosen.")

q(1, "A travel percentage arrives on a datasheet with nothing else beside it. Why can it not be read?",
 "Nothing says which curve it was taken off or over what span of coefficient the trim meters.",
 ["Nothing says which of the three duties it belongs to, and the check reports the normal duty alone in any case.",
  "Nothing says whether it was measured on the stem itself, and no coefficient can be turned into a travel here.",
  "Nothing says what pressure drop it was taken at, and travel moves with the drop."],
 "A rangeability assumed rather than confirmed moves every travel figure a check produces, and the low end is precisely where the verdict turns.")

q(0, "A plug that operates around three quarters open is often assumed to be undersized. Why is that assumption unsafe?",
 "On equal percentage trim that is a normal working position, and the assumption comes from being accustomed to linear trim.",
 ["On equal percentage trim that position is the rangeability limit, so the valve is already at the end of what the trim can meter.",
  "On equal percentage trim the travel is reported against the maximum duty rather than against full stroke, so the figure is not comparable.",
  "On equal percentage trim the engine reports travel in the coefficient's own units, so a percentage read off it means something else entirely."],
 "The figures in this module are on equal percentage trim at a rangeability of 50, and a travel percentage without its characteristic and its rangeability cannot be read.")

q(3, "The engine separates two ways of having no maximum flow travel. What states does it report?",
 "`beyond the valve` where the duty is past what the trim can pass, and `not given` where the flow never arrived.",
 ["`beyond the valve` where the flow never arrived, and `not given` where the duty is past what the trim can pass.",
  "`out of range` where the duty is past what the trim can pass, and `withheld` where the flow never arrived.",
  "`null` in both cases, with the distinction carried in the warning list rather than in the state."],
 "A blank in a results table reads as absence, and absence reads as nothing to do, which is why collapsing both into one empty result is such an expensive simplification.")

q(2, "What coverage and what verdict come back on the case where the maximum flow is beyond the valve?",
 "Every check ran, so the coverage is 3 of 3, and the verdict is false with 1 warning raised.",
 ["Two checks ran, so the coverage is 2 of 3, and the verdict is null with 1 warning raised.",
  "Every check ran, so the coverage is 3 of 3, and the verdict is null with no warning raised.",
  "Two checks ran, so the coverage is 2 of 3, and the verdict is false with no warning raised."],
 "That case is an answer. The check ran, it found that the duty asked of the valve is past what the trim can pass, and the action on it is to select a larger valve or a different trim.")

q(1, "On how many of the travel cases did the engine withhold its pass verdict, and over what tree and rule?",
 "2 cases. The tree is the 5 the check was run on and the rule admits a case whose pass comes back null.",
 ["4, counted over the 5 travel cases asked of the check, with a case counting when the engine returns a pass of false and at least one warning.",
  "3, counted over the 5 travel cases asked of the check, with a case counting when fewer than 3 of the checks ran on it.",
  "1, counted over the 5 travel cases asked of the check, with a case counting when no flow at all was given for one of the three duties."],
 "The engine returns a pass of null whenever a check could not run, which is what the rule is stated over.")

q(0, "How does the engine's message read where no minimum flow was given?",
 "`no verdict: 2 of the 3 checks ran. Not run: the near-seat rangeability check: no minimum flow was given, so whether the valve can control at turndown is not known`",
 ["`no verdict: 2 of the 3 checks ran. Not run: the maximum flow case: no maximum flow was given, so whether the valve can pass its design case is not known`",
  "`no verdict: 2 of the 3 checks ran. The near-seat rangeability check has been assumed to pass, because the two checks that ran were both clean`",
  "`no verdict: the near-seat rangeability check could not run, so the travel at the minimum duty has been taken as 0.000000 percent open instead`"],
 "The message gives the coverage as a count of checks that ran, names the check that did not run, and says what is therefore unknown in terms of the engineering question.")

q(3, "The two withheld cases both carry 0 warnings. Why does that matter?",
 "A warning is a finding and there is no finding on those cases, so what is carried in the verdict is an accounting statement about coverage.",
 ["A warning is suppressed while a verdict is withheld, so the count says nothing about whether the two checks that ran were clean.",
  "A warning is raised only on a failing verdict, so a withheld verdict can never carry one and the count is a formality.",
  "A warning is raised for each check that did not run, so a count of 0 says the checks all ran and the verdict is withheld for another reason."],
 "A tool that reported a verdict over the checks it happened to run would have returned a pass on both, and a pass on a valve whose turndown behaviour has not been examined closes the item.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/intermediate/fc8i_m06.json', label='fc8i_m06', expect_n=15)
finish()
