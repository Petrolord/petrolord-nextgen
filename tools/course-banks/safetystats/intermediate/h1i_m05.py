import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Professional m05, the p-value and its convention.
# Figures from digest Section 19 (UTOROGU, the 399 comparison sweep) and
# Section 18 (ERHA and the two one-empty-group goldens). The minlike figure is
# DERIVED and labelled so. ROUNDING TRAP: no key is the result of doubling a
# printed six-decimal figure (ERHA's 0.128104, or UTOROGU's 0.025879 against
# 0.051759). No capstone workplace, input or answer appears.

q(3, "What is the rule behind the engine's central two-sided p-value?",
 "Twice the smaller tail, capped at 1.",
 ["The sum of the probabilities of every count no more likely than the one observed.",
  "The smaller tail on its own, since only the observed side of the distribution matters.",
  "Twice the larger tail, divided by the total count of events recorded by both groups."],
 "The engine's method line reads: central two-sided p-value (twice the smaller tail, capped at 1). The sum over counts no more likely than the observed one is the minlike convention, and the smaller tail alone is a one-tailed figure that has not been doubled.")

q(0, "Why does the central p-value need a cap at 1?",
 "The two tails overlap at the observed count, so twice the smaller can occasionally pass 1.",
 ["A p-value above 1 would signal that the rates are certainly equal, and the cap hides that from the reader.",
  "The engine rounds the tails upwards, which can push the sum past 1 on small counts.",
  "The cap only applies when one group has no events."],
 "Each tail includes the observed count, so each can be larger than one half, and doubling the smaller can pass 1. The cap keeps the result a probability. No p-value says the rates are equal, and nothing is rounded upwards.")

q(1, "UTOROGU north recorded 7 events in 355200 hours and south 6 in 1048900. The engine's central p-value is 0.051759 and the minlike p-value, derived, is 0.025879. Which agrees with the engine's rate-ratio interval of 0.991404 to 12.408545?",
 "The central one: it is above 0.05, and the interval includes 1.",
 ["The minlike one: it is below 0.05, and the ratio of 3.445148 is well above 1.",
  "Both agree, since they differ only by a factor of two and 0.05 sits in between them.",
  "Neither, since the interval is exact and neither p-value is."],
 "An interval that includes 1 does not rule out equal rates, and neither does a p-value above 0.05, so the central one agrees. The minlike figure is below 0.05 and would declare a difference the interval does not support. A point estimate above 1 is no test at all.")

q(2, "How is the minlike p-value defined?",
 "The probability of every count no more likely than the one observed, summed over both sides.",
 ["Twice the smaller tail, left uncapped, which is why it runs below the central figure.",
  "The smaller of the two tails, reported on its own without doubling, which is why it runs lower.",
  "The lowest p-value the engine finds when it sweeps the comparison across every confidence level."],
 "Minlike walks the whole binomial, on both sides, and sums every count whose probability is at or below that of the observed count. It is the convention of R's poisson.test and of scipy's binomtest. Doubling the smaller tail is the engine's central rule, and removing the cap would never lower a p-value.")

q(0, "Why can the central and minlike p-values land on opposite sides of 0.05?",
 "On a skewed binomial the central rule mirrors the near tail, while minlike counts what is actually there on the far side.",
 ["Minlike uses the normal approximation, and the central rule uses the exact binomial distribution.",
  "The two are computed at different confidence levels by default.",
  "The central rule uses the hours and minlike uses the headcount."],
 "When one group has a small share of the hours the binomial is lopsided and the far side holds less probability than the near side. Doubling the near tail counts a mirror image of it; minlike counts the far side as it is. Both are exact, and neither is an error.")

q(3, "Why did the engine choose the central convention?",
 "It is the test the Clopper-Pearson interval inverts (Fay 2010), so the p-value and interval always tell the same story.",
 ["It is the convention of R's poisson.test, which most readers use to check a figure.",
  "It always gives the smaller p-value, which makes differences easier to find.",
  "It needs no binomial, only the two tails of a normal curve."],
 "The p-value and the interval come from one construction, so they agree by design. The minlike convention is the one R and scipy use, and on UTOROGU the central figure is the larger of the two, 0.051759 against 0.025879.")

q(1, "The digest sweeps every pair of counts from 0 to 15 north and 0 to 24 south on the UTOROGU hours, except both zero. How often does each p-value disagree with the engine's interval at 0.05?",
 "Central on 0 of the 399 comparisons, minlike on 14.",
 ["Central on 14 of the 399, minlike on 0, since minlike is the convention in R and scipy.",
  "Both on 14, since the disagreements come from rounding to six decimals.",
  "Neither ever disagrees, since both are exact tests built on the same binomial distribution."],
 "The central p-value falls below 0.05 exactly when the interval excludes 1 on all 399 comparisons. The minlike p-value, derived, disagrees on 14. Being exact does not make a p-value agree with a particular interval; sharing its construction does.")

q(2, "Fourteen disagreements out of 399 is a small share. Why does the lesson call it dangerous?",
 "A reader who checks a handful in R will usually see a match and conclude the conventions are interchangeable, and they part on close calls.",
 ["Fourteen is enough to make the engine's interval unreliable on every comparison it returns, close or not.",
  "The fourteen are all comparisons with both groups empty.",
  "The disagreements fall where the counts are largest."],
 "UTOROGU is the shape where they part: a p-value near 0.05 and a limit near 1, which is exactly the kind of comparison a report is argued over. The engine's own interval and p-value agree on all 399, and the one pair with both groups empty is left out of the sweep.")

q(3, "What does inverting a test mean, in the sense the engine's central p-value and interval share?",
 "The interval is every rate ratio the test would not reject at the stated level.",
 ["The p-value is one minus the confidence of the interval, so a confidence of 0.95 gives a p-value of 0.05.",
  "The interval is recomputed with the two groups swapped, and the p-value read from the new limits.",
  "The p-value is read off the interval's midpoint."],
 "Collecting every ratio the test would not reject gives the interval, so the edge of the interval and the 0.05 line of the p-value are one boundary seen from two sides. Swapping the groups only inverts the ratio and its limits.")

q(0, "What is a p-value from `compareRates`?",
 "The probability, if the rates were equal, of a split at least as lopsided as the one observed.",
 ["The probability that the two rates are equal, given the counts and hours of both groups being compared.",
  "The probability that east's rate is higher than west's.",
  "The share of the rate ratio's interval lying above 1."],
 "A small p-value says equal rates would rarely produce a split like this one; a large one says they often would. It is never the probability that the rates are equal and says nothing about the size of a difference, which is what the rate-ratio interval answers.")

q(2, "On UTOROGU the central p-value is 0.051759 and the interval runs from 0.991404 to 12.408545. Which summary is sound?",
 "The data cannot rule out equal rates, and cannot rule out a north rate 12.408545 times the south one.",
 ["North and south have equal rates, since the p-value is above 0.05 and so no difference was found.",
  "North's rate is 3.445148 times south's.",
  "The comparison is significant, since 0.051759 rounds to 0.05."],
 "A p-value above 0.05 says the data cannot tell; it does not say the rates are equal. The interval includes 1 and also reaches 12.408545, and both statements are true of the same data. The point estimate alone hides that range, and no rounding moves a verdict.")

q(1, "A manager reads ERHA's central p-value of 0.256209 as permission to treat east and west alike. What has been ignored?",
 "The interval's upper end of 6.039396, which says east could be six times worse.",
 ["The lower tail of 0.951727, which shows east is safer than west on the counts.",
  "The expected proportion, which shows the hours were unequal and so the p-value does not apply.",
  "Nothing, since a p-value that large settles the question."],
 "East's rate is 2.047326 times west's with an interval of 0.621694 to 6.039396. The honest summary is that east looks about twice as bad and the data are too few to confirm it or rule it out. Unequal hours are exactly what the conditional test handles.")

q(0, "A comparison finds no difference today on small counts. What would settle it?",
 "More exposure: as the counts grow the interval narrows.",
 ["A switch to the minlike p-value, which is more sensitive to differences on small counts.",
  "A lower confidence, chosen after seeing the result so that the interval excludes 1.",
  "Dropping the group with fewer events, which is the one adding the noise."],
 "A finding of no difference on counts like UTOROGU's 7 and 6 or ERHA's 6 and 11 usually says more about the counts than the rates. Changing convention or confidence after seeing the data changes the claim and not the evidence, and dropping a group leaves nothing to compare.")

q(3, "In the golden compare-second-zero, the central p-value is 0.039551 and the interval's lower limit 1.100207 with no upper limit. Do the two agree?",
 "Yes: the p-value is below 0.05 and the interval, 1.100207 and above, excludes 1.",
 ["No: an interval with no upper limit includes every ratio, so it cannot exclude 1.",
  "No: the p-value is below 0.05, while the lower limit is close to 1.",
  "The question has no answer, since the engine refused the case."],
 "An unbounded interval still has a lower edge, and 1.100207 is above 1, so equal rates are excluded, as the p-value below 0.05 also says. The engine returned the case with a null ratio and a reason; it refuses only when both groups are empty.")

q(1, "A colleague checks one of the engine's p-values in R and finds a different number. What is the first thing to say?",
 "Which convention each figure uses: the engine's is central, R's poisson.test is minlike.",
 ["That R has a rounding bug in its binomial tails, which the engine's exact solver avoids.",
  "That the engine uses the normal approximation, which R does not.",
  "That the two will match once the confidence is passed as 0.95."],
 "The difference is a declared choice: the engine uses the central convention because it is the test its interval inverts, and on some inputs R's minlike figure differs. Both are exact, and neither has a bug. The confidence does not enter either p-value.")

emit(Q, '/root/hse-wip-safetystats/banks/h1i_m05.json', expect_n=15)
finish()
