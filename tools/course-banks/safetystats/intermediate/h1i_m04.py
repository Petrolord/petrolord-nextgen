import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Professional m04, comparing two rates.
# Figures from digest Section 18 (ERHA and the two one-empty-group goldens)
# and the compareRates refusals of Section 4, with the Section 3 crews as an
# Associate recap. ROUNDING TRAP: the digest prints pValue 0.256209 while
# twice the printed upperTail 0.128104 is one unit lower in the sixth decimal,
# so no key here is the result of doubling a printed tail. No capstone
# workplace, input or answer appears.

q(1, "ERHA east recorded 6 events in 240500 hours and west 11 in 902700. How does the engine test for a difference without estimating the common rate?",
 "It conditions on the total of 17: under equal rates east's count is binomial with east's share of the hours as its probability.",
 ["It estimates the common rate from all 17 events and then tests each side's count against it separately.",
  "It compares the two rates on the 200,000 base with a normal z test.",
  "It asks the caller for the common rate."],
 "Given 17 events in total and equal rates, each event is equally likely to land in any hour worked, so east's count out of 17 is binomial with east's share of the hours. The unknown rate drops out, which is the point of conditioning; a normal z test on the rates is a different method that needs the rate estimated.")

q(3, "What is the ERHA comparison's expectedProportion, and where does it come from?",
 "0.210374, east's hours over all the hours.",
 ["0.352941, east's 6 events over the 17 events recorded by the two sides together.",
  "0.128104, the probability of east recording 6 or more of the 17 under equal rates.",
  "0.951727, the probability of east recording 6 or fewer of the 17 under equal rates."],
 "Under equal rates the share of events a side should expect is its share of the hours, fixed before a single event is counted: 240500 over the ERHA total hours is 0.210374. East's actual share of the events, 0.352941, is what the test compares against it, and the other two figures are the tails.")

q(0, "ERHA's lowerTail is 0.951727 and its upperTail 0.128104, which add to more than one. Why?",
 "Both tails include the observed count of 6.",
 ["The engine adds a continuity correction to each tail before it returns them.",
  "The two tails are computed on different probabilities of success.",
  "Rounding each tail to six decimals inflates both of them."],
 "The lower tail is the probability of 6 or fewer and the upper tail of 6 or more, so the probability of exactly 6 is counted in both. The tails share one binomial, on 17 trials at 0.210374, and rounding moves nothing by the amounts involved.")

q(2, "A learner doubles ERHA's printed upperTail of 0.128104 and gets a figure one unit below the engine's pValue of 0.256209 in the sixth decimal. What explains the difference?",
 "The engine doubles the unrounded tail; doubling a figure already rounded to six decimals can move the last digit.",
 ["The engine doubles the larger tail, which is why its pValue sits slightly above the doubled upper tail.",
  "The engine adds the probability of the observed count once more before doubling.",
  "The central p-value is capped at 1, which shifts it upward."],
 "The central p-value is twice the smaller tail, and the smaller tail here is the upper one, but the engine doubles its full-precision value and then prints six decimals. The printed 0.128104 is already rounded, so twice it can differ in the last place. Doubling the larger tail, 0.951727, would pass 1 and be capped, and no cap applies at 0.256209.")

q(1, "`compareRates` takes counts and hours but no base. Why?",
 "A ratio of two rates on the same base cancels the base.",
 ["It always works on the 200,000 base internally and converts the result back afterwards.",
  "The base is read from the first group's hours, which set the scale.",
  "A comparison between two groups has no meaning on the 1,000,000 base."],
 "The comparison reads identically whether both sides reported on 200,000 hours or 1,000,000, because the base appears in the numerator and denominator of the ratio. Leaving it out removes one way to make a mistake. No base is assumed internally at all.")

q(3, "ERHA's rate ratio is 2.047326 with a 95 percent interval of 0.621694 to 6.039396. Which reading is sound?",
 "The data are consistent with east's rate somewhat below west's, equal to it, or six times it.",
 ["East's rate is about twice west's, and the interval confirms it because the ratio sits inside the interval.",
  "East's rate is lower, since the lower limit of 0.621694 sits below 1.",
  "East and west have equal rates."],
 "The interval includes 1 and runs to 6.039396, so at 95 percent it cannot pick out any one of those readings; the point estimate of 2.047326 sits inside it without being singled out. An interval that includes 1 leaves equal rates possible, which is a weaker statement than showing them equal.")

q(0, "A learner swaps the ERHA groups so that west is the first group. What happens to the output?",
 "The ratio becomes one over 2.047326, and the new upper limit is one over the old lower limit, 0.621694.",
 ["Nothing changes, since the rate ratio of two groups is symmetric in the order in which they are passed to the engine.",
  "The ratio becomes one over 2.047326, and the new lower limit is one over the old lower limit.",
  "The p-value becomes one minus 0.256209, since the other tail is now the one the engine doubles."],
 "West over east inverts every figure, and inverting flips the ends: one over the old lower 0.621694 becomes the new upper limit, and one over the old upper 6.039396 the new lower. The central p-value is the same either way, since swapping only exchanges the two tails and the smaller one keeps its value.")

q(2, "In the golden compare-first-zero, the first group has 0 events in 180000 hours and the second 6 in 210000. The engine returns a ratio of 0.000000 with an upper limit of 0.990863. What follows at 95 percent?",
 "Equal rates are ruled out: the first group's rate is lower, and the p-value of 0.048748 agrees.",
 ["Nothing, since a ratio of zero is undefined and the interval must be ignored.",
  "Equal rates cannot be ruled out, since the lower limit of 0.000000 touches zero and so the interval spans every ratio.",
  "The second group's rate is lower, since its count is higher."],
 "The upper limit 0.990863 is below 1, so the interval excludes equal rates and places the first group lower. A lower limit of 0.000000 on a ratio says nothing about equality, which sits at 1. A ratio of 0 over something is a legitimate 0.000000.")

q(1, "In the golden compare-second-zero, the first group has 4 events in 90000 hours and the second 0 in 150000. What does the engine return for the rate ratio?",
 "null, with upperUnbounded true, a lower limit of 1.100207 and a reason in the engine's own words.",
 ["Infinity, with a lower limit of 1.100207 and an upper limit of Infinity beside it, as JavaScript prints.",
  "A refusal naming `count2`, since a group with no events has nothing to divide by and cannot be compared.",
  "0.000000, the same as when the empty group comes first."],
 "Something over zero has no number, so the engine returns null for the ratio and its upper limit, sets upperUnbounded, and gives its reason: count2 is zero: the rate ratio and its upper limit are unbounded. The lower limit 1.100207 still exists and is above 1. One empty group is a legitimate comparison; only both empty is refused.")

q(3, "Why does the engine return null with a reason for an unbounded rate ratio, where JavaScript could print Infinity?",
 "Infinity looks like a number and can be sorted or copied into a report as a finding; null cannot.",
 ["Infinity would crash the chi-square quantile functions, which cannot accept it as an argument at any confidence.",
  "Infinity would make the central p-value infinite as well.",
  "The ratio is zero, and null stands for zero."],
 "A null with a reason cannot be mistaken for a measurement, and upperUnbounded tells a program what kind of absence it holds. The engine keeps whatever part of the interval does exist, here the lower limit 1.100207, which carries the whole finding. The p-value comes from the binomial tails and stays finite, 0.039551 here.")

q(0, "A caller passes 0 events in 180000 hours against 0 in 210000 to `compareRates`. What does the engine return?",
 "A refusal naming `count1`: count1 and count2 are both zero: the conditional test has no events to condition on",
 ["A ratio of null with upperUnbounded true, as for one empty group placed second.",
  "A p-value of 1.000000, since two zeros are perfectly consistent with equal rates.",
  "A refusal naming `count2`, since the second zero is the one that makes the test undefined."],
 "With both counts zero the total is zero, so there is nothing to split, every tail would be one and the ratio zero over zero. The engine refuses, names the first count and puts both in its message, verbatim above. One empty group is a comparison; two are none.")

q(2, "Two crews each record zero events. What does the lesson say to do instead of comparing them?",
 "Run each through `rateConfidenceInterval` and report both upper limits.",
 ["Rank them by hours, since the crew with more hours is the safer of the two by construction.",
  "Pass them to `compareRates` with one event added to each, which is how the test handles zeros.",
  "Report both rates as 0 and treat them as equal."],
 "Two groups with no events are two zero events questions, and each upper limit says how high that crew's rate could be. Ranking them only ranks their hours, since the crew with more hours has the lower limit and nothing else separates them. Adding events invents data.")

q(3, "A comparison passes exposureHours2 as zero. What does the engine return?",
 "A refusal naming `exposureHours2`: a rate over no exposure is undefined.",
 ["A ratio of null with upperUnbounded true, as for a group with no events.",
  "The rate of the first group alone.",
  "A refusal naming `count2`, since the second group has no events to condition on."],
 "The engine's own words are: exposureHours2 must be a finite number of hours above zero: a rate over no exposure is undefined. A group with no hours has no rate at all, which is a different condition from a group with hours and no events, which the engine accepts and reports as unbounded.")

q(1, "Why must the expected proportion in the conditional test be built from hours and never from headcount?",
 "Under equal rates each hour carries the same chance of an event, so a side's expected share is its share of the hours.",
 ["Headcount is refused by the engine as a field name, so hours are simply the only input it can read.",
  "Headcount changes during a year, while hours are fixed.",
  "Hours are always the larger number and so give a finer proportion."],
 "The Associate crews show why: with 1 recordable each they read the same per head, while per hour the day crew reads 1.456000 times the rotation crew. Built from headcount, a side on longer rotations would be expected to hold too few events and look worse than it is. `compareRates` takes hours and has no headcount input at all.")

q(2, "Why is the ERHA rate-ratio interval, 0.621694 to 6.039396, so wide?",
 "It rests on 6 and 11 events, and the smaller count dominates the uncertainty.",
 ["The hours on the two sides differ by more than a factor of three, and unequal hours always widen it.",
  "The engine uses a Wald log interval, which is wide on small counts.",
  "The interval is at 0.990000."],
 "A ratio inherits the uncertainty of both counts, and a ratio built on counts in the single figures will almost always carry a wide interval, just as a single small count did on the IMO ladder. The interval is Clopper-Pearson on east's share, at 95 percent.")

emit(Q, '/root/hse-wip-safetystats/banks/h1i_m04.json', expect_n=15)
finish()
