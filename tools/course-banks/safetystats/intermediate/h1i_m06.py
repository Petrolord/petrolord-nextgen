import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Professional m06, intervals in a report.
# Figures from digest Section 20 (the BLS case and the IOGP 2024 observed FAR
# with their intervals, and the house form), with Section 7's fatal incident
# figures and Sections 17 to 19 as recaps. The capstone lesson is examined for
# its METHOD only: no capstone workplace, input or graded answer appears.

q(2, "Which line writes the BLS worked example in the house form this course uses?",
 "3.500000 per 200,000 hours (7 cases in 400000 hours; 95 percent exact interval 1.407182 to 7.211338)",
 ["3.500000 per 200,000 hours, with an exact interval of 1.407182 to 7.211338 and no count needed",
  "3.500000 (7 cases in 400000 hours; exact interval 1.407182 to 7.211338)",
  "3.500000 per 200,000 hours (7 cases in 400000 hours; 95 percent exact interval 2.814363051520 to 14.422675361702)"],
 "The house form carries the rate, the base, the count and hours it came from, and the interval with its confidence. One option drops the count and hours, one drops the base and the confidence, and one quotes the count limits where the rate limits belong.")

q(0, "The BLS rate limits are 1.407182 and 7.211338. Where do they come from?",
 "The count limits for 7 at 95 percent, 2.814363051520 and 14.422675361702, times 200,000 over 400000.",
 ["The rate of 3.500000 plus and minus about two standard errors.",
  "The rate divided by and multiplied by a fixed factor of about two.",
  "The count limits for 7 at 90 percent, halved."],
 "Each Garwood count limit is multiplied by the base over the hours, one half here. A symmetric normal interval would sit evenly around 3.500000, which these limits do not, and the 90 percent count limits would give a narrower pair.")

q(3, "What does the BLS interval of 1.407182 to 7.211338 tell a reader about the firm's 3.500000?",
 "The true rate could be under half the printed figure or over twice it, and 7 cases cannot tell which.",
 ["The firm's rate will fall between 1.407182 and 7.211338 in 95 of the next hundred years it reports on the same hours.",
  "The printed figure is wrong, since the exact interval is centred on a value other than 3.500000.",
  "The rate is reliable, since BLS publishes the example."],
 "The upper limit is more than twice the rate and the lower limit less than half, because 7 is a small count. The interval is about the true rate of this firm on these hours; it makes no forecast of future observed rates, and a lopsided interval is what an exact interval on a small count looks like.")

q(1, "A firm with ten times the BLS cases in ten times the hours would print what, compared with the BLS example?",
 "The same 3.500000 with a far narrower interval.",
 ["A rate ten times higher.",
  "The same 3.500000 and the same interval.",
  "The same 3.500000 with an interval ten times as wide, since the hours are ten times greater."],
 "Ten times the cases over ten times the hours is the same rate, and the width relative to the rate is a property of the count: more events, narrower interval, as on the IMO ladder. Nothing widens with more hours.")

q(2, "IOGP's 2024 observed FAR of 0.769438 rests on 32 fatalities in 4158877000 hours. Why does a figure built on billions of hours still carry an interval of 0.526295 to 1.086218?",
 "The events are what the Poisson count model draws, and a fatality is rare even across an industry, so the count stays small.",
 ["The hours are rounded to the nearest million by IOGP, and that rounding is what the interval measures.",
  "The fixed base of 100,000,000 hours introduces uncertainty that a named base would not.",
  "The interval is a percentile range of outcomes across IOGP's member companies."],
 "The interval comes from the count of fatalities exactly as the interval on a recordable rate comes from the count of recordables. 32 is a modest count, and the upper limit of 1.086218 is more than a third above the observed rate. The base only rescales, and the interval is on an estimated rate, with no percentile meaning.")

q(0, "The IOGP 2024 upper limit is about twice its lower one; the BLS upper limit is about five times its lower. What sets that difference?",
 "The count: 32 against 7.",
 ["The hours: billions against hundreds of thousands, which is where the certainty of a rate comes from.",
  "The base: 100,000,000 hours against 200,000 hours, as a larger base narrows the interval.",
  "The confidence, which IOGP sets higher than BLS."],
 "What sets the width relative to the rate is the number of events. The hours and base only rescale the count limits, and both intervals are at 95 percent.")

q(3, "FAR is the one rate with a fixed base. What does the fixed base settle about an observed FAR?",
 "What the number is per, and nothing about how sure it is.",
 ["Both the scale and the uncertainty, since a standard base leaves nothing to estimate.",
  "Nothing at all, since the base is still chosen by the caller of `fatalAccidentRate` on each call.",
  "Its interval, which the engine returns inside `fatalAccidentRate` as part of its basis block."],
 "`fatalAccidentRate` takes no base argument, and its basis.standard reads IOGP safety performance indicators, FAR. The interval on an observed FAR comes from the fatality count through the Garwood construction, like any other rate, and the fixed base only rescales it.")

q(1, "2024 had 32 fatalities in 21 fatal incidents. The fatal incident rate on the same hours is 0.504944 per 100,000,000. How would its interval compare, relative to its rate, with the FAR's?",
 "Wider, since it rests on the smaller count.",
 ["Narrower, since fatal incidents are counted with less doubt than fatalities.",
  "The same, since both rates share the same hours and the same fixed base.",
  "It has none, since incidents fall outside the Poisson count model."],
 "Each count carries its own interval, and the width relative to the rate is set by the count: 21 against 32. Sharing hours and base only rescales. Fatal incidents are events like any other, so the Poisson count model applies to them too.")

q(2, "Why does this course use no P label on a confidence interval?",
 "A P label belongs to a range of outcomes, and a confidence interval here is on an estimated rate at a stated confidence.",
 ["P labels are reserved for one-sided limits such as the rule of three, which this course treats as derived.",
  "The engine returns intervals without names, so any label would have to be invented by the reader.",
  "A P label would imply 90 percent confidence, and the course works at 95 percent."],
 "Borrowing a percentile label would dress the Garwood interval up as a percentile of outcomes, which it is not. The house form writes the confidence as a percentage and calls the result an exact interval.")

q(0, "A report writes the ABO crew as 0 per 200,000 hours (0 recordables in 41300 hours). What does the house form still need?",
 "Its limits at a stated confidence: 0.000000 to 17.863823 at 95 percent.",
 ["The rule of three figure, 14.527845, which is how a zero is conventionally bounded in a report.",
  "Nothing, since a zero rate has no uncertainty to report.",
  "The central 90 percent limit, 14.507178, labelled as the 95 percent limit."],
 "The engine's central 95 percent interval on 0 in 41300 hours is 0.000000 to 17.863823. The rule of three figure answers a one-sided question and 14.507178 is the central 90 percent limit, so labelling either as the 95 percent exact interval misstates it. A zero has an interval like any other count, and the house form puts it beside the rate.")

q(3, "How does the house form write a comparison of two rates?",
 "The rate ratio and what it compares, both counts and hours, the interval with its confidence, then the central p-value.",
 ["The p-value alone, since it summarises the whole comparison in one figure.",
  "Both rates on their bases, leaving the ratio for the reader to work out.",
  "The ratio and the minlike p-value, which readers in R will recognise."],
 "For ERHA: east over west 2.047326 (6 events in 240500 hours against 11 in 902700 hours; 95 percent interval 0.621694 to 6.039396; central p-value 0.256209). Name the convention whenever a p-value appears, because a reader checking it in R will find a different number on some inputs.")

q(1, "Why does the house form state the confidence even when it is 95 percent?",
 "The same count gives different limits at different confidences.",
 ["The engine prints it automatically in every basis block, so leaving it out loses nothing.",
  "Only 95 percent intervals are exact.",
  "Readers assume 90 percent otherwise."],
 "For a count of 7 the count upper limit is 13.148113802432 at 0.900000 and 14.422675361702 at 0.950000: different claims about the same data. The engine has no default confidence, so every interval was asked for at a level someone chose, and the report should say which.")

q(2, "The BLS upper limit of 7.211338 agrees with the golden to 7.39e-16. What does that agreement mean?",
 "Agreement to the limit of double precision.",
 ["A disagreement in the seventh decimal, which the six decimal print hides from the reader.",
  "The golden and the engine share one code path, so agreement is automatic whatever the value.",
  "The limit is exact to 7.39e-16 of the true rate."],
 "A relative difference of 7.39e-16 is at the resolution of a double, so the engine reproduces the independently computed golden. The golden was written by a separate oracle, and agreement with it says nothing about how close the limit is to the firm's unknown true rate.")

q(3, "The capstone for this tier asks for a zero events crew's central 95 percent upper limit. Which method answers it?",
 "`rateConfidenceInterval` with a count of 0, the crew's hours, the 200,000 base and confidence 0.95.",
 ["The rule of three, 3 events over the crew's hours on the 200,000 base, which the engine does not compute.",
  "`rateConfidenceInterval` with confidence 0.900000, whose upper limit is the one-sided 95 percent figure.",
  "`compareRates` against a crew with no events, whose p-value gives the limit."],
 "The field asks for the engine's own central 95 percent upper limit. The rule of three would sit roughly a fifth lower on any hours, and the central 90 percent limit answers the one-sided question. Two groups with no events are refused by `compareRates`.")

q(0, "The capstone asks for a rate-ratio interval between two named groups. Why does the order in which they are passed matter?",
 "The ratio is the first group's rate over the second's, so swapping inverts the ratio and exchanges its limits.",
 ["It does not matter, since the conditional test is symmetric in its two groups and returns one ratio to the caller.",
  "The engine sorts the two groups by their hours, so only the p-value depends on the order in which the caller passes them.",
  "The second group's base is used for both."],
 "Set the two groups in the order the brief gives: the engine's rateRatio is count1 over hours1 against count2 over hours2, and passing them the other way round returns one over each figure with the ends exchanged. The p-value is the same either way, and `compareRates` takes no base.")

emit(Q, '/root/hse-wip-safetystats/banks/h1i_m06.json', expect_n=15)
finish()
