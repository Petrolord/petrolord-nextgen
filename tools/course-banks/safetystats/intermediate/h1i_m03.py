import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Professional m03, zero events.
# Figures from digest Section 17 (the ABO crew, the rule of three against the
# central interval, the hours a zero needs), Section 14's zero row, and the
# UGHELLI hours of Section 2 for scale. No capstone workplace, input or answer.

q(2, "At a count of zero, why is the engine's lower limit 0.000000 at every confidence?",
 "Zero or more events has probability one at every mean, so no positive mean leaves alpha/2 there.",
 ["The raw lower limit comes out negative, and the engine floors it at zero and flags it.",
  "A zero count is refused on the lower side, and the engine fills the gap with a zero.",
  "The lower limit is always the observed rate, and the observed rate here is 0."],
 "The lower limit asks for the mean at which the observed count or more has probability alpha/2, and zero or more always happens. The chi-square form agrees: with 2N degrees of freedom and N of zero the lower quantile is zero. Nothing is floored or filled in, and for a count of 7 the lower limit sits well away from the observed rate.")

q(0, "At 0.950000, the engine's count upper limit at zero events is which figure?",
 "3.688879454114, minus the natural log of 2.5 percent.",
 ["2.995732273554, minus the natural log of 5 percent.",
  "3, which is the rule of three applied to the count.",
  "5.298317366548, minus the natural log of half of one percent."],
 "The probability of zero events at a mean mu is e to the minus mu, and setting it equal to half the miss gives minus ln of 2.5 percent, 3.688879454114. The figure 2.995732273554 puts the whole 5 percent in the upper tail, the alpha-not-halved mistake, and 5.298317366548 is the 0.990000 limit.")

q(3, "The ABO crew worked 41300 hours with 0 recordables. What is the engine's central 95 percent upper limit per 200,000 hours?",
 "17.863823",
 ["14.527845, which is the rule of three on these hours",
  "14.507178, which is the central 90 percent limit",
  "25.657711, which is the central 0.990000 limit"],
 "The count upper limit 3.688879454114 times 200,000 over 41300 is 17.863823. The rule of three gives 14.527845 and the central 90 percent limit 14.507178; both answer the one-sided question, which is a different one from the engine's central 95 percent.")

q(1, "The rule of three approximates a one-sided 95 percent upper limit at zero events. Which central interval from the engine gives that one-sided limit exactly?",
 "The central 90 percent interval, which leaves 5 percent in its upper tail.",
 ["The central 95 percent interval, which the engine returns by default whenever no level is asked for.",
  "The central 0.800000 interval, which leaves 20 percent in the upper tail.",
  "None, since the engine has no route to a one-sided limit."],
 "A one-sided 95 percent limit leaves the whole 5 percent above it, and a central 90 percent interval leaves exactly 5 percent in each tail. The engine returns its upper limit as 2.995732273554. The central 95 percent interval leaves only 2.5 percent above, and the engine has no default confidence at all.")

q(2, "Three over 2.995732273554 is 1.001425. What does that figure measure?",
 "How close the rule of three comes to the exact one-sided 95 percent limit at zero events.",
 ["How far the rule of three falls below the engine's central 95 percent limit at zero.",
  "The coverage excess of the Garwood interval at a mean of 3.",
  "The ratio of the 90 and 95 percent rate limits on the ABO hours."],
 "2.995732273554 is the count upper limit of the central 90 percent interval, which is the one-sided 95 percent limit. Three over it is 1.001425, so the rule of three is almost exact for the question it answers. Against the central 95 percent limit, 3.688879454114, the gap is far larger.")

q(0, "A safety report quotes 17.863823 per 200,000 hours for the ABO crew and labels it a rule of three figure. What is wrong?",
 "17.863823 is the engine's central 95 percent limit; the rule of three gives 14.527845 on those hours.",
 ["Nothing, since the rule of three and the engine's central 95 percent limit are the same thing.",
  "The rule of three cannot be used on fewer than 200,000 hours of exposure.",
  "The figure should be 25.657711, as the rule of three is a limit set at 0.990000."],
 "The rule of three puts 3 events over the exposure, 14.527845 on the ABO hours, and answers a one-sided question. The central 95 percent limit of 17.863823 is a different claim, and quoting it as a rule of three figure overstates the limit by more than a fifth.")

q(3, "At zero events the central 95 percent interval's upper limit sits above the one-sided 95 percent limit. Why?",
 "It spends half its miss guarding a lower side that cannot be breached.",
 ["It uses 2N + 2 degrees of freedom, which the one-sided limit leaves out entirely.",
  "It rounds the count upper limit up to the next whole event before scaling.",
  "It adds a continuity correction that a one-sided limit never carries."],
 "At zero events the lower limit is 0 anyway, so the 2.5 percent reserved below it buys nothing, and only 2.5 percent is left in the upper tail. The one-sided limit puts the whole 5 percent there and so sits lower. Both use the same shape of quantile; nothing is rounded or corrected.")

q(1, "Suppose the ABO crew had logged double its hours and still recorded nothing. Where would its 90 percent limit, now 14.507178, move?",
 "Half of 14.507178, because the count upper limit 2.995732273554 does not move.",
 ["14.507178 unchanged, since a zero is a zero whatever the hours behind it happen to be.",
  "14.507178 divided by the square root of two, as the width shrinks with the root of the exposure.",
  "0.000000, since doubled hours with no events settle the rate at zero."],
 "The count upper limit at zero depends only on the confidence. The rate limit is that count limit times 200,000 over the hours, so doubling the hours halves it exactly. The square root rule belongs to a normal approximation, and a rate limit at zero never reaches 0.000000 on finite hours.")

q(2, "At 95 percent with zero events, how many hours does a crew need to bring its upper limit down to 1.000000 per 200,000 hours?",
 "737775.890823",
 ["368887.945411, which is the figure for a target of 2.000000",
  "1475551.781646, which is the figure for a target of 0.500000",
  "41300, the ABO crew's own hours, since the limit is already met"],
 "The hours needed are the count upper limit times 200,000 over the target: 3.688879454114 times 200,000 over 1.000000 is 737775.890823, which the engine confirms. The other figures are the table's rows for other targets, and the ABO crew's 41300 hours leave its limit at 17.863823.")

q(3, "With zero events, a crew wants its 95 percent upper limit to rule out 0.250000 per 200,000 hours where it now rules out 1.000000. How do the hours needed change?",
 "They grow fourfold, to 2951103.563291.",
 ["They double, since the target has been cut by a factor of two, then by another factor of two.",
  "They grow sixteenfold, as the hours scale with the square of the target ratio.",
  "They stay at 737775.890823, since a zero needs no more hours to prove more."],
 "The hours needed are the count upper limit times 200,000 over the target, so they scale inversely with the target: a quarter of the target needs four times the hours, 2951103.563291 against 737775.890823. Nothing in the formula squares the ratio.")

q(0, "To bring the ABO crew's 95 percent upper limit down to 2.000000 per 200,000 hours with no recordable, how does the exposure needed compare with the 41300 hours it has?",
 "It needs 368887.945411 hours, roughly nine times what it has.",
 ["It needs 368887.945411 hours, roughly twice what it has.",
  "It already qualifies, as its observed rate of 0 is below 2.000000.",
  "No amount of hours will do it, since a zero can never bring a limit down."],
 "368887.945411 over 41300 is a little under nine. An observed rate of 0 is below every target and proves nothing on its own, which is the whole point of the upper limit. More hours with no event bring the limit down in exact proportion.")

q(2, "UGHELLI logs 2318640 hours a year. Could a year of zero recordables there rule out 0.250000 per 200,000 hours at 95 percent?",
 "No: that needs 2951103.563291 hours, and a year of UGHELLI falls short.",
 ["Yes, because a site of that size has millions of hours and so its zero is conclusive.",
  "Yes, because 0.776317 is its usual rate and a zero year beats it comfortably at any target.",
  "The engine refuses a zero on that many hours."],
 "Zero events carries information in proportion to the hours, and ruling out 0.250000 needs 2951103.563291 hours without a recordable. UGHELLI's year of 2318640 hours is short of it. A usual rate from other years is no part of this calculation, and the engine never refuses a zero count.")

q(1, "The same ABO zero reads an upper limit of 11.150533 at 0.800000 and 25.657711 at 0.990000. What must a report that quotes the zero with its upper limit also quote?",
 "The confidence, since both limits are true statements about the same crew.",
 ["The rule of three figure, since only it is independent of the confidence and can anchor the other two.",
  "The lower limit, since the upper limit alone is ambiguous between the two confidence levels.",
  "The crew's headcount, since the limit depends on how many people shared the hours."],
 "Moving from 0.800000 to 0.990000 raises the limit from 11.150533 to 25.657711 on the same zero, so without the confidence a reader cannot tell which claim was made. The lower limit is 0.000000 at every level and settles nothing, and the engine has no headcount input.")

q(3, "How does the zero events arithmetic apply to UGHELLI's observed FAR of 0.000000 on 0 fatalities in 2318640 hours?",
 "Pass the zero count and those hours to `rateConfidenceInterval` on the 100,000,000 base.",
 ["It does not apply, since `fatalAccidentRate` has a fixed base and so carries no interval of its own.",
  "The rule of three is the only route, since the engine will not take a zero fatality count.",
  "Use the 200,000 base, since the interval is only defined on the OSHA base."],
 "The same Garwood arithmetic, with the count upper limit 3.688879454114 at 95 percent, bounds any zero from above on whatever base is named. A fixed base fixes the scale of a FAR and says nothing about how sure it is, and `rateConfidenceInterval` takes any base above zero.")

q(0, "Several small crews doing comparable work each log a short year with zero recordables. What does pooling them do?",
 "The pooled zero carries the pooled hours, so its upper limit falls in proportion.",
 ["Nothing, since a sum of zeros is still zero and a zero carries no information.",
  "It gives a pooled lower limit above zero.",
  "It is refused, as the engine takes no zero counts."],
 "Sum then divide applies to a count of zero as well: the pooled zero sits over the summed hours, and the upper limit is the count upper limit times the base over those hours. It is legitimate when the crews do comparable work. The lower limit at zero stays 0.000000 however many hours are pooled.")

emit(Q, '/root/hse-wip-safetystats/banks/h1i_m03.json', expect_n=15)
finish()
