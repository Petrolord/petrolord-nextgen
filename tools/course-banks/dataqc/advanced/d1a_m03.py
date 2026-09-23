import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Expert m03, The tabular CUSUM.
# Figures from digest Section 27 (the method, the k and h refusals, the NIST
# 6.3.2.3 table and design line, the EKENE-3 phase two table, the unit
# comparison), Section 4 (the units refusal) and Section 28 (which chart sees
# what).

q(3, "On the NIST/SEMATECH 6.3.2.3 table, with target 325 and k 0.317500 in the data's units, S_hi is 0.000000 at group 12 and group 13 has x - 325 = 3.325000. What is S_hi at group 13?",
 "3.007500, which is 0.000000 + 3.325000 - 0.317500",
 ["3.325000, since the allowance k is taken off a sum only once that sum has passed h",
  "0.825000, since at group 13 the tabular sum and the plain cumulative sum of x - 325 are the same figure",
  "0.000000, as S_hi waits for a reading beyond h"],
 "S_hi(i) = max(0, S_hi(i-1) + x_i - target - k): zero plus 3.325000 less 0.317500 is the printed 3.007500. k is taken off every reading. 0.825000 is the plain cumulative sum, which carries every earlier deviation and no allowance. h is the decision interval a sum must pass to signal, and it plays no part in building the sum.")

q(1, "On the same NIST table, with h 4.195900 in the data's units, which group gives the first upper signal?",
 "Group 14, where S_hi of 4.940000 is above 4.195900",
 ["Group 13, where S_hi rises from zero to 3.007500, the largest single step in the table",
  "Group 15, where S_hi reaches 7.447500, the first group at which the upper sum is more than h plus k",
  "Group 13, where the plain sum turns positive"],
 "A signal is S_hi or S_lo strictly above h. At group 13 S_hi is 3.007500, below 4.195900; at group 14 it is 4.940000, above it, and the golden prints group 14 as the first upper signal. Group 15 signals too, after group 14 has. The plain cumulative sum is returned beside the tabular sums and is not what signals.")

q(0, "A `cusumChart` call on EKENE-3 passes target, sigma, k 0.5 and h 4, and says nothing about their units. What does the engine return?",
 "A refusal naming `units`: units is required: 'sigma' (k and h in multiples of sigma, rule of thumb k = 0.5, h = 4 or 5) or 'data' (k and h in the data's own units)",
 ["A chart in sigma units, since k 0.5 and h 4 match the rule of thumb the engine quotes",
  "A chart in the data's own units, psi here, since the engine never converts a number it is given",
  "A refusal naming `k`, since a reference value with no stated unit cannot be read"],
 "Section 27: `units` is required, and the engine refuses and names the two choices in its own words. The rule of thumb in the message is advice, and the engine does not read the numbers to guess which unit was meant. The refusal names `units`, the field that is missing; k and h are present and valid numbers.")

q(2, "EKENE-3's CUSUM runs at k 0.5 and h 4 in sigma units, with sigma 3.774063 psi from phase one. What are k and h in psi?",
 "k 1.887031 psi and h 15.096251 psi",
 ["k 0.5 psi and h 15.096251 psi, since only the decision interval is scaled by sigma",
  "k 1.887031 psi and h 13.908086 psi, the moving range upper limit, which the CUSUM borrows from the individuals chart",
  "k 0.5 psi and h 4 psi, since sigma units are a label that the engine prints and does not apply"],
 "In sigma units k and h are multiples of sigma: 0.5 and 4 times 3.774063 are the printed 1.887031 and 15.096251 psi. Both are scaled. 13.908086 psi is D4 times MRbar on the individuals chart and plays no part in the CUSUM. Reading 0.5 and 4 as psi is the data-units chart, which gives different signals.")

q(1, "The same k 0.5 and h 4 are read as psi on EKENE-3, in place of multiples of sigma. What changes?",
 "The first upper signal moves to day 4 and the first lower to day 11, with 45 flags against 28",
 ["Nothing, since k and h are the same two numbers and the data have not changed",
  "The first signals stay on days 8 and 21, and the flags rise from 28 to 45",
  "The chart signals less often, since psi is a smaller unit than sigma and the sums grow more slowly"],
 "Section 27, THE UNIT MATTERS: the same k 0.5 and h 4 read as psi give a first upper signal on day 4, a first lower signal on day 11, and 45 flags against 28. A psi allowance of 0.5 and a decision interval of 4 are far smaller than 1.887031 and 15.096251, so the sums pass h sooner and more often. The unit is what gives the numbers their size.")

q(0, "EKENE-3's S_hi passes h on day 8 at 26.197812. What does the engine do with the upper sum on day 9?",
 "It carries on from 26.197812 with day 9's reading: S_hi reads 20.930780, still above h, and day 9 signals high",
 ["It resets S_hi to 0.000000 after the signal, so the upper sum on day 9 starts again from nothing",
  "It restarts the sum from day 9's reading alone, and day 9 does not signal because 608.000000 is below target",
  "It stops updating the upper sum until the lower sum has signalled, since one side signals at a time"],
 "Section 27: no reset after a signal; the sum carries on from where it stood. S_hi on day 9 is day 8's 26.197812 plus day 9's 608.000000 less the target and less k, and the table prints 20.930780, above 15.096251, marked high. Both sums update on every day, and S_lo is 1.492969 on day 9 alongside it.")

q(3, "Between day 8 and day 16, S_hi stays above h on 8 days. Which day in that stretch has no signal?",
 "Day 11, where S_hi dips to 13.396717, below 15.096251",
 ["Day 9, because its reading of 608.000000 lies below the target and a reading below target clears the upper sum",
  "Day 16, where the planted shift begins at 604.500000",
  "None: S_hi signals on every day to day 16"],
 "The table marks day 11 none, with S_hi 13.396717; S_hi is above h on days 8, 9, 10 and 12 to 16, which is the 8 days. Day 9 reads 20.930780 and day 16 reads 17.761560, both above h. A signal is judged day by day on the sum as it stands, so a dip below h ends the run for that day, and nothing resets the sum.")

q(2, "With k 0.5 and h 4 in sigma units, on which day does EKENE-3's S_lo first pass h?",
 "Day 21, where S_lo reaches 19.657812",
 ["Day 16, the first day of the planted shift, where S_lo reads 4.992969",
  "Day 20, where S_lo reads 14.164843",
  "Day 22, the day the EWMA and the individuals chart first signal low, where S_lo reads 30.550780"],
 "The digest prints the first lower signal as day 21, S_lo 19.657812 against h 15.096251. On day 16 S_lo is 4.992969 and on day 20 it is 14.164843, both below h. Day 22 is the first low signal of the EWMA and of the individuals chart; the CUSUM had already signalled low the day before.")

q(0, "On EKENE-3's day 7 the plain cumulative sum of x - target reads 16.740000, above h of 15.096251, and the day's signal is none. Why?",
 "A signal comes from S_hi or S_lo passing h, and S_hi on day 7 is 5.664843; the plain sum is returned beside them and carries no allowance",
 ["Because day 7 comes before the planted glitch, and the engine starts judging sums on the day of the first event",
  "Because the plain cumulative sum is compared with 2h, and 16.740000 is below twice the decision interval",
  "Because h applies only to S_lo, and the upper side is judged against the individuals upper limit"],
 "Section 27: a signal is S_hi or S_lo strictly above h, and the plain cumulative sum of x - target is returned too. On day 7 S_hi is 5.664843, below 15.096251. The plain sum has no allowance k and no floor at zero, so it is not the quantity the rule tests. The engine judges every day, compares the tabular sums with h itself, and applies h to both sides.")

q(3, "A tabular sum on some day equals h exactly. What does the CUSUM return for that day?",
 "No signal, because a sum must be strictly above h",
 ["A signal, because the engine counts a sum at h together with the sums beyond it",
  "A signal and a reset of the sum to zero",
  "A refusal naming `h`, because a sum equal to the decision interval sits on neither side of it"],
 "Section 27: a signal is S_hi or S_lo strictly above h, the same boundary rule as every flag in the engine. A sum at h is inside. The engine never resets a sum after a signal, and nothing about a sum's value is refused; refusals are about inputs, such as a missing k, h or unit.")

q(1, "NIST 6.3.2.3's design line, h = (2 / delta^2) ln((1 - beta) / alpha) k, is fed the page's own alpha 0.0027, beta 0.01, delta 1 and k 0.317500. What does it give, and what does the engine do about it?",
 "3.749328, or 4.189476 with alpha halved, neither of them the table's 4.195900; the engine has no design helper and reproduces the table from the printed k and h",
 ["4.195900, the table's value, which the engine's design helper returns from alpha and beta",
  "3.749328, which the engine uses in place of the printed 4.195900, moving the first signal later",
  "4.189476, which the engine takes as h whenever the caller passes an alpha in place of h"],
 "Section 27 derives 3.749328 and 4.189476 from the page's own inputs; the table uses 4.195900. Section 31 lists a CUSUM design helper from alpha and beta as not built: k and h are inputs with a stated unit. The engine takes the h it is given, reproduces the printed table from it, and takes no alpha.")

q(2, "From day 16 to day 40 on EKENE-3, each chart with its own settings, how many low signals does each chart raise?",
 "Individuals 1, EWMA 11 and CUSUM 20",
 ["Individuals 1, EWMA 15 and CUSUM 28, one low signal for every day on which the chart signals at all",
  "Individuals 5, EWMA 11 and CUSUM 20, the individuals count including its moving range signals",
  "Individuals 0, EWMA 11 and CUSUM 20, since a single chart point cannot see a shift at all"],
 "Section 28 prints 1, 11 and 20 low signals from day 16 to day 40. 5, 15 and 28 are the days with any signal, high or low, over all forty days, which includes the glitch. The individuals chart does signal low once, on day 22, where a single day falls past three sigma.")

q(0, "Which chart first signals low on EKENE-3 at or after day 16, each with the settings of its own module?",
 "The CUSUM, on day 21; the EWMA and the individuals chart first signal low on day 22",
 ["The EWMA, on day 16, since its memory gathers the shift from the very day it begins",
  "The individuals chart, on day 16, since its three sigma limit is the narrowest of the three",
  "All three together on day 22, since the three charts share one target and one sigma from phase one"],
 "Section 28's first column prints 22 for the individuals chart, 22 for the EWMA at lambda 0.2 and 21 for the CUSUM at k 0.5 and h 4 sigma. None signals on day 16. The individuals chart's limits, 600.057812 and 622.702188, lie outside the EWMA's 607.605937 and 615.154063. Sharing a target and sigma does not give the charts the same statistic, so their first signals differ.")

q(2, "Which of the three charts signals on day 8, the planted gauge glitch?",
 "All three: the individuals chart, the EWMA and the CUSUM",
 ["Only the individuals chart, since a single wild day is the one event the charts that remember are built to smooth away",
  "Only the EWMA and the CUSUM, the charts that remember",
  "Only the individuals chart and the CUSUM"],
 "Section 28's column 'signals on day 8' reads true for all three, and the section says all three see the glitch. The EWMA signals high on days 8, 9, 13 and 14 and the CUSUM holds the glitch in S_hi from day 8 to day 16. The individuals chart signals on a single day past three sigma, which is exactly the glitch.")

q(3, "Someone leaves the reference value out of a CUSUM call that names its unit as sigma and gives h 4. How does the engine answer?",
 "A refusal naming `k`: k must be a finite number, zero or more",
 ["A chart at k 0.5, the rule of thumb the engine quotes in its message about units",
  "A chart at k 0, read as no allowance at all",
  "A chart at k 0.317500, the NIST page's value"],
 "Section 27: NO ENGINE DEFAULT FOR K OR H. A call without either is refused and the field is named, in the engine's own words. The rule of thumb in the units refusal is advice, and 0.317500 belongs to the NIST example. A k of zero is a legal choice the caller can make, and the engine does not make it on the caller's behalf.")

emit(Q, '/root/dai-wip-dataqc/banks/d1a_m03.json', expect_n=15)
finish()
