import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H1 Expert m02, Signals.
# Figures from digest Section 22 (strictly outside, three sigma against two, the
# low point, small exposure) and Section 21 (the EGBEMA chart). Every figure is
# printed in the digest.

q(1, "In the golden case uchart-points-on-the-limits, point 1 recorded 18 events, its u is 2.000000 and its upper limit is 2.000000. What does the engine return as its signal?",
 "null, because a point sitting exactly on its limit is inside the band under the strict rule",
 ["above, because a u equal to the upper limit is treated as reaching it, and reaching the limit is a signal",
  "above, because the engine rounds a tie on a limit toward the investigation so that no real change is missed",
  "below, because a point on its upper limit is read against the lower limit of 0.000000 when the two are tied"],
 "The golden's note: under the strict rule (Montgomery: a point OUTSIDE the limits) neither signals. Only a u strictly greater than the upper limit, or strictly less than the lower, earns above or below. The engine has no tie-breaking toward a flag, and the lower limit plays no part for a point on its upper limit.")

q(3, "Point 2 of the same golden case recorded 0 events: its u is 0.000000 and its lower limit is 0.000000. Why does it not signal below?",
 "Because zero is not strictly below a lower limit of zero, and the engine's rule needs a point strictly outside",
 ["Because the engine never tests the low side of any chart, whatever the exposure behind each of the points",
  "Because a count of 0 is refused by `uChart`, so the point is left off the chart and carries no signal at all",
  "Because the lower limit is floored, and a floored limit switches the low-side test off for that one point on the chart only"],
 "u equals the lower limit, so the point is on the line and inside the band. The engine does test the low side, and the golden low-point case signals below on a positive limit. A zero count in one period is charted normally; only a chart whose counts are all zero is refused. The rule is the same strict comparison on every point; on this golden case ubar is 1 and n is 9, so the limits are exactly 0 and 2.")

q(0, "EGBEMA's chart returns `outOfControl` as [7]. Which month does the monitoring note name as the signal?",
 "Month 8, because the list holds zero-based indices and the note numbers months starting from 1",
 ["Month 7, because the list holds the month number exactly as it would be printed in the note",
  "Months 1 to 7, because the list gives the count of months that sit outside their control limits",
  "Month 7 and month 8, because an index in the list marks the boundary between two adjacent months"],
 "The engine's list is zero-based, so index 7 is the eighth month, and month 8 is the one whose u of 7.599326 sits above its limit of 6.410039. Month 7's u of 2.509599 is well inside its limit. The list names indices, one per signalling point, and a list of one entry is one signal.")

q(2, "On EGBEMA, how many months sit above their upper limit when the limits are drawn at 2 sigma in place of the engine's 3 sigma, and which are they?",
 "2 months, month 3 against 7.772371 and month 8 against 5.237783",
 ["1 month, month 8, since narrowing the band does not change which months sit outside it",
  "2 months, month 8 and month 1, since month 1 has the second largest count on the chart",
  "3 months, months 3, 4 and 8, the three months whose u lies above the centre of 2.893273"],
 "At 2 sigma, derived, month 3's u of 8.227913 clears 7.772371 and month 8's 7.599326 clears 5.237783. Every other month stays inside: month 1 reads 2.982478 against 5.291761 and month 4 reads 3.373705 against 5.687703. A narrower band flags more months, and a u above the centre line is ordinary; a count carries no signal of its own until it is set against the month's units.")

q(1, "The Expert tier weighs 3 sigma against a narrower band. What is the main cost of drawing EGBEMA's limits at 2 sigma?",
 "More flags, each one an investigation, and on a stable process most of the extra flags are months that were only unlucky",
 ["None to speak of, since a narrower band finds every real change sooner and each extra flag is a real change on site",
  "A higher centre line, because the 2 sigma chart pools the year differently and lifts the reference that months meet",
  "Fewer flags on the thin months, since a 2 sigma band is wider than a 3 sigma one wherever the exposure is small"],
 "Every flag sends someone to pull records and interview supervisors, and a team that chases flags and finds nothing learns to stop reading the chart. A narrower band does see more, as month 3 shows, but most extra flags on a stable process are chance. The centre is the pooled 2.893273 whatever band is drawn. A 2 sigma band is narrower than a 3 sigma one at every exposure.")

q(3, "An analyst looks at EGBEMA, sees month 3 sitting inside its 3 sigma limit, and redraws at 2 sigma so that it flags. What is wrong with that?",
 "The band was chosen after looking, to produce the flag; a band decision belongs in the note with its reason, made in advance",
 ["Nothing, because a 2 sigma band is always the better choice on a chart with fewer than twenty monthly points to read",
  "Nothing, because the engine accepts a sigma input and the analyst has simply used the setting that the data suggested",
  "Only the arithmetic, because month 3's u of 8.227913 is actually below its 2 sigma limit of 7.772371 on EGBEMA"],
 "Narrowing a band can be defended for a stated reason decided in advance: a high-hazard operation, a known recent change, a regulator's request. Narrowing it after seeing the chart chooses the band to make the flag. The engine has no sigma input and always draws 3 sigma. Month 3's 8.227913 is above 7.772371, so the arithmetic is right and the reasoning is what fails.")

q(2, "Which sigma setting does the engine let a caller pass to `uChart`?",
 "None: the engine has no sigma input, and every chart it draws is a 3 sigma chart as its method line states",
 ["Any whole number of sigma through the chart's confidence field, which takes 2 or 3 as its usual values",
  "3 by default and 2 on request, through a `sigma` field that the chart's result echoes in its basis block",
  "The number of sigma implied by the base, which is 3 on the 200,000 hour base and 2 on the million base"],
 "The method line fixes it: limits ubar +/- 3 sqrt(ubar / n_i). uChart takes counts, exposureHours and base and nothing else. The 2 sigma column the course prints is derived for teaching, outside the engine. Changing the base rescales everything by one factor and leaves the chart's shape alone.")

q(0, "In the golden case uchart-positive-lcl-with-a-low-point, point 4 recorded 0 events in 4800000 hours against a lower limit of 0.920345. What does the golden's note say the signal is worth investigating as?",
 "Under-reporting, because a month with 0 events in 4.8 million hours falls below its lower limit",
 ["A real improvement on site, since a month with no events is the result every safety programme is aiming at",
  "A data entry error in the hours, since the other points carry 4700000 to 6100000 hours and point 4 is in range",
  "Nothing, since a low point on a u-chart is noted for the record but only a high point counts as a real signal"],
 "The golden's note reads: a month with 0 events in 4.8 million hours falls below its lower limit (a signal worth investigating as under-reporting). A fall in the rate with no change in the work is the signature of a change in counting, so the counting is the first place to look. Celebrating the zero skips that question. Point 4's hours sit inside the range of the others, so the hours are not what stands out. The rule is symmetric: strictly below the lower limit is a signal.")

q(3, "Why can the golden low-point chart signal below when EGBEMA never can?",
 "Its points carry millions of hours, so the square root term is small and every lower limit stays above zero",
 ["Its centre line is the mean of the u values, which lifts the lower limits clear of zero on every one of its points",
  "Its lower limits are left unfloored, so they may run negative and a point at zero can fall beneath them",
  "It is drawn at 2 sigma, which gives a positive lower limit wherever the 3 sigma limit would have been floored"],
 "On 4700000 to 6100000 hours the units are large, 3 sqrt(ubar / n) is small, and the centre minus it stays positive, 0.911835 to 1.011164. EGBEMA's months of about 2 units push the raw lower limit below zero. Both charts use the pooled centre, the same floor and the same 3 sigma rule; the difference is the exposure in each point.")

q(1, "On the golden low-point chart, point 3 has 6100000 hours and point 4 has 4800000 hours. Which one carries the higher lower limit?",
 "Point 3, at 1.011164, since more hours in a point give a narrower band around the same centre",
 ["Point 4, at 0.920345, since a point with no events is given a higher floor to make its signal visible",
  "Neither, since both are measured from one pooled centre and share a lower limit of 0.936592",
  "Point 4, since fewer hours mean fewer expected events and so a lower limit lying closer to the centre"],
 "More units shrink the distance from the centre, lifting the lower limit and lowering the upper: point 3 reads 1.011164 and 2.437872. Point 4's 0.920345 is lower because its hours are fewer. The engine does nothing special for a point with no events. 0.936592 is the limit of points 1 and 7, which carry 5000000 hours each; a shared centre does not give a shared limit.")

q(2, "In the golden case uchart-small-exposure-wide-limits, point 1 recorded 3 events in 2000 hours: a u of 300.000000 against an upper limit of 44.196051. What does the case show?",
 "Wide limits do not stop a thin point signalling: point 1 still clears its limit and signals above",
 ["A point on 2000 hours can never signal, because the engine widens a thin point's limit past any reading",
  "Point 1 is quiet, because on thin exposure the engine compares the raw count, 3, with the upper limit",
  "Point 1 signals only because its hours are below the base, which the engine reads as a fault"],
 "The limit scales with 1/sqrt(n_i), so 2000 hours give a wide band, 44.196051, and a u of 300.000000 still clears it. Several cases in a few days on a small crew is worth a look whatever the exposure. The engine compares u with the limit on every point, and hours below the base are ordinary data that give a unit count below 1.")

q(0, "On the same small-exposure golden case, point 2 recorded 0 events in 2000 hours and does not signal. What is the fair reading of point 2?",
 "The chart cannot tell a thin quiet period from a lucky one, so its silence says little about that crew",
 ["The crew on point 2 has shown a rate of zero, which the chart confirms by leaving the point unflagged",
  "The crew on point 2 is safer than the crew on point 3, which recorded 1 event on 400000 hours of work",
  "Point 2 should have signalled below, and the engine missed it because its lower limit was set far too high"],
 "On 2000 hours the band is wide and the floored lower limit is zero, so no count on that point could signal low and a zero reads as nothing unusual. A zero on thin exposure is a weak measurement; the Professional tier's zero-count interval shows how high a rate it still allows. Point 3's 400000 hours make its 0.500000 a far better measured rate. A u of zero cannot be strictly below a lower limit of zero.")

q(3, "EGBEMA's highest u is month 3's 8.227913, yet the only signal is month 8 at 7.599326. Why does the lower reading signal and the higher one not?",
 "Month 8's 421090 hours give it a limit of 6.410039, while month 3's 97230 hours give it a limit of 10.211920",
 ["Month 8's count of 16 is the largest on the chart, and the engine flags whichever month carries the largest count",
  "Month 3 falls before the intervention in month 7, and the engine only tests the months that come after it",
  "Month 3 was set aside as a thin month before the limits were drawn, so its reading is never tested at all"],
 "Each month is judged against its own limit, set by its units. Month 3's u rests on 0.486150 units and sits under a wide band; month 8's rests on 2.105450 units and clears a tight one. The engine reads u against the limit and never ranks counts. uChart has no intervention input, and nothing is set aside when a chart is drawn.")

q(1, "Month 8 has 2.105450 units and an upper limit of 6.410039. What is the largest whole number of events month 8 could have recorded and not signalled?",
 "13, since 2.105450 times 6.410039 is just under thirteen and a half, and a signal needs a u strictly above the limit",
 ["6, since the expected count at the centre is about 6 and any count above the expected count would signal",
  "16, since the month's own count is the largest a month can record without crossing its upper control limit",
  "14, since a count of 14 on 2.105450 units gives a u that sits exactly on the limit and so does not signal"],
 "The count on the limit is the limit times the units, which is just under thirteen and a half. At 13 events u is below 6.410039; at 14 it is above it and signals. Redrawn in the panel, the changed count also moves the pooled centre and the limit a little, and the answer is still 13. The expected count of 6.091641 is the centre, and ordinary months scatter well above it without a signal. Month 8 signalled with 16, so 16 is past the limit. No whole count sits exactly on this limit.")

q(2, "A month with no recordables in it falls strictly below a positive lower limit. How does the Expert tier say the note should treat it?",
 "As a signal like any other, asking what was different, with the counting as the first place to look",
 ["As good news to be reported without investigation, since a low signal can only mean a safer month",
  "As noise to be safely ignored, since the engine's signal rule is applied to high months and low ones alike",
  "As a reason to set the month aside at once, since a zero count is not a real observation"],
 "The rule is symmetric: strictly below the lower limit is a signal in the same sense as strictly above the upper one, and it asks the same question. For a low point the counting comes first, because a fall with no change in the work is the signature of under-reporting. The same symmetric rule is exactly why the point must be investigated. A zero is a real observation, and a month is set aside only on a found cause.")

emit(Q, '/root/hse-wip-safetystats/banks/h1a_m02.json', expect_n=15)
finish()
