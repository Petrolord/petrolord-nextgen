import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Expert m06, Judgement End to End.
# Figures from digest Section 27 (what the engine does not classify, the
# monitoring note), Sections 21 to 26 read together on EGBEMA and AMUKPE,
# Section 9 (the tier as an input), Section 4 (refusals), Section 19 (UTOROGU)
# and Section 20 (the house form). Every figure is printed in the digest.

q(3, "The Expert tier reads a year on one chart in a fixed order. Which order is it?",
 "The base and the grain, then the centre, then the limits, then the signals, and only then what was done about them",
 ["The signals first, since they are what the chart is for, then the limits that produced them, and the centre last",
  "The before-and-after comparison first, since it answers the question the programme asked, and then the chart itself",
  "The highest reading first, since the month that looks worst is the one a reader will ask about before any other"],
 "The order exists so that nothing gets skipped because something else looked more interesting: base and grain, the pooled centre, the limits and their floor, the signals, then causes, revision and any intervention. Starting from the comparison hides whether a month was set aside to produce it. Starting from the highest reading would have started EGBEMA at month 3, which does not signal.")

q(1, "The Expert tier's monitoring note has five parts. Which list gives them in the order the tier grades?",
 "The chart and its centre; the signals and what was found; any revision and its months; any before-and-after claim and its months; every rate with its base and interval",
 ["Every rate with its base and interval; the before-and-after claim; the signals; any revision; and the chart and its centre last as a summary",
  "The before-and-after claim and its p-value; the chart and its centre; the signals and what was found; the revision; and the rates with their intervals",
  "The chart and its centre; any revision and its months; the signals and what was found; every rate with its interval; the before-and-after claim"],
 "The course lists the parts: the chart and its centre, the months that signal and what was found, whether the limits were revised and on which months, any before-and-after claim with the months it used, and every rate with its base and its interval. A reader who meets the ratio first cannot tell whether a month was set aside to produce it, and a revision only makes sense after the signal and its finding.")

q(2, "For AMUKPE's site rate, which of these decisions rests entirely with the caller, with nothing in the engine able to check it?",
 "Whose hours are in the denominator, since the engine cannot tell whether they match the workforce behind the count",
 ["Whether the hours are finite and above zero, since a rate over no exposure is left for the caller to catch",
  "Whether the count is a whole number, since the engine rates a fractional number of recordables as readily as a count",
  "Whether a base has been named, since the engine applies the 200,000 hour base by default when a caller leaves it out"],
 "The engine checks the shape of an input: a zero-hours call is refused, a fractional count is refused, and a missing base is refused by name because there is no default. Whether an injury was recordable, whether a release was Tier 1, and whose hours sit under whose events are the caller's decisions. A mismatched denominator passes every check the engine makes and returns a clean number.")

q(0, "A caller passes a process safety event count to `pseRate` with a tier of 3. What does the engine return?",
 "A refusal naming `tier`, in the engine's own words: tier must be 1 or 2: classify the events against API RP 754 before rating them",
 ["A Tier 2 rate, since the engine treats any tier above 2 as the lowest tier it rates and says so in the basis block",
  "A rate with a warning attached, since the engine rates any whole-number tier and flags a tier it does not recognise",
  "A refusal naming `pseCount`, since the engine classifies the events itself and finds that none of them fit tier 3"],
 "The tier is an input, and the engine accepts 1 or 2 only; a tier of 3 or a missing tier is refused with that message. It never maps one tier onto another and returns no warnings: a call either returns a result with its basis or an error with its field. The engine does not classify events at all, because the threshold quantity tables it would need are licensed and absent.")

q(0, "AMUKPE's site rate is 1.161259 before two recordables are reclassified to first aid and 0.982603 after. How does the engine's output mark the difference?",
 "It does not: both results carry the same six decimals and the same clean basis block, and only the note can say what changed",
 ["The second result carries a reclassified flag in its basis block, since the engine compares each count with its last call",
  "The second result is refused, since a recordable count that falls while days lost stay put fails the engine's consistency check",
  "The second result is returned with a wider interval, since the engine adds uncertainty for any count it cannot fully verify"],
 "The engine can make a correctly classified count into a correctly computed rate, and it will return a wrong count's rate the same way. It keeps no memory between calls, sets no count against days lost, and `incidenceRate` returns no interval at all. That is why the note reports every reclassification in the period, how many cases moved and in which direction.")

q(2, "EGBEMA's year in one sentence has four clauses. Which clause does the chart NOT support?",
 "The intervention lowered the rate, as the set-aside row's ratio of 0.677882 shows",
 ["One month, month 8, signalled high against its own upper limit on the chart as drawn",
  "The other eleven months are consistent with a stable process at the exposure recorded",
  "The chart could not have detected a fall, since every lower limit was floored at zero"],
 "The summary the tier writes is: one month signalled high, the rest are consistent with a stable process at the exposure recorded, the chart could not have detected a fall, and the intervention cannot be shown to have changed the rate. The 0.677882 row is admissible only on a found cause for month 8, and even then its interval, 0.357764 to 1.257771, includes 1. The other three clauses each rest on a figure the chart printed.")

q(3, "The investigation into EGBEMA's month 8 closes without finding a cause. What does the monitoring note then report?",
 "Month 8 stays in: the drawn chart with its 2.893273 centre stands, and the all-months comparison, 1.028627 with a p-value of 1.000000, is the one",
 ["Month 8 comes out anyway, since a month that signals and resists explanation is the clearest outlier the chart has, which gives a centre of 2.389523",
  "Month 8 is replaced by the centre's expected count of 6.091641 events, so that the chart keeps twelve months while the outlier's effect is removed",
  "The comparison with month 8 set aside, 0.677882 with a p-value of 0.241552, since a month with no known cause cannot be trusted as data"],
 "Where nothing is found the note says so and the month stays, as part of the process. Setting a month aside because it is high is removing the data that disagree, and replacing it with an expected count is the same move in disguise. The set-aside row is admissible only on a found cause, so without one the all-months row is the comparison, and it shows no change.")

q(1, "Which rate is written in the house form the course uses for a rate with its uncertainty?",
 "3.500000 per 200,000 hours (7 cases in 400000 hours; 95 percent exact interval 1.407182 to 7.211338)",
 ["3.500000 (7 cases; interval 1.407182 to 7.211338), since the base is understood once a report states it",
  "3.500000 per 200,000 hours, with 7.211338 quoted alone as the highest value the rate could take at 95 percent",
  "3.500000 per 200,000 hours plus or minus half the width of its 95 percent exact interval"],
 "The house form carries the rate, the base, the count and hours it came from, and the interval with its confidence. A base left implicit is how a factor of five creeps in. No P label is used for a confidence interval anywhere in this course, because the interval is on an estimated rate. The exact interval is not symmetric about the rate, so a plus or minus figure misdescribes it, and an upper limit quoted alone drops the lower one and the count.")

q(3, "A learner checks the engine's p-value for a comparison in another tool and gets a smaller number. On UTOROGU the engine reads 0.051759. What is the most likely explanation?",
 "The other tool uses the minlike convention, which gives 0.025879 on UTOROGU; the engine's central p-value is twice the smaller tail",
 ["The other tool is correct and the engine has a rounding defect, since two tools computing one exact test must agree to six places",
  "The other tool computed the p-value on the 1,000,000 hour base, and a larger base always shrinks the p-value of a comparison",
  "The other tool assumed equal hours in the two groups, which is the default of every exact test and shrinks the p-value on UTOROGU"],
 "The engine's choice is declared: a central p-value, twice the smaller tail capped at 1, the test the Clopper-Pearson interval inverts. R's poisson.test and scipy's binomtest use the minlike convention and read 0.025879 on UTOROGU. On UTOROGU the minlike figure happens to equal the smaller tail, because no count on the other side is as unlikely as the one observed; on other counts it need not be, and no fixed factor converts one convention into the other. No base enters a comparison, since it cancels in a ratio, and the engine conditions on the actual hours.")

q(2, "Rehearsing the Expert capstone's six kinds of figure on EGBEMA, which two depend on a decision about which months to keep?",
 "The revised centre, 2.389523, and the before-and-after p-value with month 8 set aside, 0.241552",
 ["The centre, 2.893273, and month 3's upper limit, 10.211920, since both change when any month is kept",
  "Month 1's lower limit and its flag, since the floor is applied only to the months the analyst chose to keep",
  "The all-months p-value, 1.000000, and the centre, since both need the analyst to choose a set of months"],
 "Four of the six figures are read off the chart and the comparison as given: the centre, an upper limit, a lower limit with its lclFloored flag, and the all-months p-value. The revised centre and the p-value with a month set aside exist only because someone decided to set a month aside, which is why each needs a stated basis. The floor follows from the exposure, and the all-months comparison uses every month by definition.")

q(0, "Working a chart and a before-and-after comparison end to end, which of these is one of the mistakes the Expert tier says recur?",
 "Counting a point that sits exactly on its limit as a signal, when the engine's rule is a point strictly outside",
 ["Reading each lower limit off the engine together with its `lclFloored` flag, since a limit may be floored or positive",
  "Naming a flagged month in the reader's numbering from 1, while the engine's `outOfControl` list is zero-based",
  "Running the comparison twice, once with every month in and once with the named month set aside on its stated basis"],
 "Four mistakes recur: the mean of the monthly rates taken as the centre, a point on its limit counted as a signal, a month set aside because it is high, and a p-value typed from a tool that uses the minlike convention. The other three options are the method itself: a lower limit read with its flag, a note that numbers months from 1 against a zero-based list, and both comparisons run with the basis for the set-aside month stated.")

q(3, "Which three questions does the Expert tier say to ask of every rate you are handed, since the engine never asks them?",
 "Who classified the count and against which definition; whether the classification changed in the period; whether a review would ever move a case up",
 ["Whether the count is a whole number; whether the hours are above zero; whether the base has been named by the caller",
  "Whether the rate has six decimals; whether it carries a basis block; whether the basis block names the standard it followed",
  "Whether the rate is below the IOGP figure; whether it fell from last year; whether the site met its target for the year"],
 "Those are the classification questions, and the engine cannot see any of them. A whole count, positive hours and a named base are exactly what the engine already checks, and a clean basis block comes with a wrongly classified count as readily as a right one. A benchmark, a trend and a target are comparisons, and they inherit whatever the classification got wrong.")

q(1, "UGHELLI recorded 1 Tier 1 process safety event in 2318640 hours. What can the course say about it?",
 "Given the tier, its Tier 1 PSE rate is 0.086257 per 200,000 hours; the tier itself was decided outside the engine",
 ["Its Tier 1 PSE rate is 0.086257 per 200,000 hours, and the engine confirmed it as Tier 1 against API RP 754",
  "Its Tier 1 PSE rate is 0.431287 per 1,000,000 hours, since that is the one base the engine will accept for a PSE rate",
  "Its Tier 1 PSE rate cannot be computed, since the engine refuses a single event as too few to rate at all"],
 "A learner who is given a tier can rate it; a learner who is given a release has to classify it outside this engine, because the threshold quantity tables are licensed and not in it. The PSE rate takes the 200,000 or the 1,000,000 base, 0.086257 on the first and 0.431287 on the second, and the FAR base is refused. A count of 1 is a whole number, zero or more, and is rated normally.")

q(0, "Why does the monitoring note put the chart before any before-and-after claim?",
 "So that the reader knows which months were unusual, and whether any was set aside, before a claim about them is made",
 ["So that the note is shorter, since a chart summarises the whole year and a comparison only repeats what it already shows",
  "So that the p-value can be computed from the chart's centre line, which the comparison then needs as one of its own inputs",
  "So that the reader sees the favourable comparison last, which leaves the strongest possible impression of the programme"],
 "A reader who meets the before-and-after ratio first has no way to know whether a month was set aside to produce it. The chart and the comparison answer different questions and neither repeats the other. The comparison takes counts and hours for two periods and never uses the centre line. Arranging a note for impression is the opposite of what its order is for.")

q(2, "EGBEMA's note must describe the chart's low side. What does it say, and why?",
 "That every lower limit was floored at zero, so the chart could only ever find high months and a fall would have gone unseen",
 ["That no month fell below its lower limit, which shows that reporting on the site stayed complete and honest through the whole year",
  "Nothing, since a floored lower limit is an engine detail that the reader of a monitoring note has no real need to be told about",
  "That the low side was tested at 2 sigma in place of 3, since the 3 sigma lower limits could not be drawn at all"],
 "The chart part of the note names the base, the grain and the centre and says that every lower limit was floored. A u cannot be strictly below zero, so no low signal was possible, and a quiet low side is no evidence about reporting. The floor matters to the reader because it limits what the chart can claim. The engine draws only 3 sigma limits.")

emit(Q, '/root/hse-wip-safetystats/banks/h1a_m06.json', expect_n=15)
finish()
