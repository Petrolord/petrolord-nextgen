import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Expert m03, Constant Service and M/D/c. Every numeric, reason or refusal
# key is a return of the vendored engine on the Ekene supply base, a stated
# probe of it, or a golden case (the one-berth Pollaczek-Khinchin check, the
# three-berth M/D/c case, the berth targets); scratch/bank-advanced/witness.mjs
# recomputes each. The M/D/c wait at several berths is taught as the
# Cosmetatos approximation. No key rests on the at-or-below reading presented
# as the law, no key is a Monte Carlo figure and no capstone figure appears.

K = [3, 1, 2, 0, 2, 3, 0, 1, 3, 2, 1, 0, 3, 1, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Run under M/D/c, how long does a vessel wait on average at the two-berth Ekene quay, with its 3.2 daily arrivals over 24 working hours and 8-hour concurrent calls?",
 "1.665786 hours, the Cosmetatos approximation for a constant service",
 ["3.180124 hours, the wait the same base returns when its model is M/M/c",
  "0.440347 hours, the M/M/c wait once a third berth is stated",
  "0.259397 hours, the M/D/c wait once a third berth has been stated"],
 "As M/D/c the engine applies the Cosmetatos (1975) approximation as Liu, Pantelidis, Tam and Chow print it (arXiv 2102.05851v2, eq. (2), CC BY 4.0) and returns 1.665786 hours. 3.180124 is the M/M/c wait; 0.440347 is the three-berth M/M/c wait; 0.259397 is the three-berth M/D/c wait the target search reports.")

# 2
x("On the Ekene base run as M/D/c, what does the engine return for the probability of waiting?",
 "No figure: the engine gives no delay probability for M/D/c and its basis says so",
 ["0.371014, carried over unchanged from the M/M/c run of the same base",
  "0.106417, the figure the three-berth M/M/c run returns for the base",
  "1.000000, since with a constant service every arriving vessel is made to wait"],
 "The engine's basis for M/D/c ends \"probabilityWait is not given for M/D/c\", and the calculator's tile reads \"not given for M/D/c\". 0.371014 belongs to M/M/c alone; 0.106417 is the three-berth M/M/c figure; vessels that find a free berth wait nothing under either model.")

# 3
x("Switching the Ekene base from M/M/c to M/D/c with every input held, which figure stays at the same value in the engine's return?",
 "The berth utilisation, 0.533333, which depends only on the mean service time",
 ["The mean wait, 3.180124 hours, as the arrivals are unchanged",
  "The mean time at the base, 11.180124 hours",
  "The probability of waiting, 0.371014, since both models share Erlang's C formula"],
 "The berth utilisation is the arrivals an hour times the mean service over the berths, and neither term depends on how the service times spread, so it is 0.533333 under both models. What the model changes is the wait (1.665786 hours as M/D/c against 3.180124 as M/M/c), and so the time at the base; M/D/c returns no probability of waiting.")

# 4
x("As Liu et al. print it in eq. (2), how is the M/D/c mean wait built from the M/M/c wait at the same berths and load?",
 "Halved, then raised by a correction in (1 - rho)(c - 1)(sqrt(4 + 5c) - 2) / (16 rho c)",
 ["Doubled, then reduced by a correction that grows as the berths get busier toward saturation",
  "Taken as it stands, since the two models share a delay probability and so share a wait",
  "Halved at every berth count, which is exact for any number of berths at any berth utilisation"],
 "Wq(M/D/c) = Wq(M/M/c) / 2 x (1 + (1 - rho)(c - 1)(sqrt(4 + 5c) - 2) / (16 rho c)). The correction grows with the idle share and the berths beyond the first and shrinks as rho rises, since rho is in its denominator. The halving alone is exact only at one berth.")

# 5
x("Why does the Cosmetatos correction vanish at one berth?",
 "The factor (c - 1) is zero at c = 1, leaving half the M/M/1 wait, the exact Pollaczek-Khinchin figure",
 ["At one berth the berth utilisation must equal 1, so the factor (1 - rho) is zero and drops the term",
  "With one berth the term 16 rho c in the denominator grows without limit and the fraction goes to zero",
  "The engine skips the correction at one berth by a stated rule, since the approximation is untested there"],
 "Put c = 1 into eq. (2) and (c - 1) is zero, so the wait is half the M/M/1 wait, which is the Pollaczek-Khinchin mean value formula for M/D/1 (Adan and Resing, s. 7.6, eqs 7.14 to 7.16). A berth utilisation of 1 is refused, the denominator stays finite, and no rule skips anything: the arithmetic does it.")

# 6
x("One berth, a constant service of 1 hour and a berth utilisation of 0.900000. What M/D/c mean wait does the engine return, and how does it compare with M/M/c at the same load?",
 "4.500000 hours, half the 9.000000 hours M/M/c returns, as the Pollaczek-Khinchin formula gives",
 ["9.000000 hours, the same as M/M/c, since one berth leaves no room for the service spread to act",
  "4.263158 hours, the wait Adan and Resing's Table 5.1 prints for the same load at two servers",
  "0.900000 hours, the berth utilisation times the service, the time a call is under way on average"],
 "The Pollaczek-Khinchin formula for M/D/1 gives rho S / (2 (1 - rho)): 0.9 times 1 over 2 times 0.1, which is 4.500000 hours, and the engine returns 4.500000. M/M/1 at the same load waits 9.000000, the first row of Table 5.1. With exponential service the spread of service times doubles the wait; 4.263158 is the two-server row.")

# 7
x("A stated case puts 3 berths at a berth utilisation of 0.800000 with 1-hour calls. Comparing the two queue models on it, which pair of waits comes back?",
 "0.552578 hours as M/D/c against 1.078652 hours as M/M/c",
 ["0.259397 hours as M/D/c, the Ekene three-berth figure, against 1.078652",
  "1.078652 hours as M/D/c, since the two models agree above one berth",
  "0.552578 hours under both models, the service time being fixed at 1"],
 "The engine returns 0.552578 hours as M/D/c and 1.078652 as M/M/c on the same inputs: a little over half, because the correction of eq. (2) adds to the halved wait at three berths. 0.259397 belongs to the Ekene base at three berths, a different load. The two models part at every berth count, and the M/M/c call knows nothing of the service being constant.")

# 8
x("On the Ekene base the engine returns 1.665786 hours as M/D/c and 3.180124 as M/M/c. What ratio of the two does the course derive, and what does it show?",
 "0.523812: a half, plus a correction of a few hundredths from eq. (2)",
 ["0.500000: an exact half, the correction vanishing",
  "0.371014: the probability of waiting, which scales the M/D/c wait down",
  "0.533333: the berth utilisation of the base"],
 "1.665786 over 3.180124 is 0.523812: the halving plus a correction, since the Ekene base has 2 berths and the (c - 1) factor is 1. The correction vanishes only at one berth. The ratio is set by c and rho through eq. (2); it is no copy of the berth utilisation.")

# 9
x("Where does the course take the M/D/c formula from, and how does the engine label its figures?",
 "From Liu, Pantelidis, Tam and Chow (arXiv 2102.05851v2, CC BY 4.0) eq. (2), labelled an approximation",
 ["From Cosmetatos's 1975 paper, read in full by the course, with every figure labelled exact",
  "From Adan and Resing's Table 5.1, where the M/D/c rows sit beside the M/M/c rows, labelled exact",
  "From Iversen's handbook, s. 12.2, whose Erlang's C formula covers constant service, labelled exact"],
 "Cosmetatos (1975) was not read directly: the formula is taken as Liu et al. print it in eq. (2) of arXiv 2102.05851v2 (11 February 2021, CC BY 4.0), which also states that M/D/c has no closed form for its mean wait. The engine labels every M/D/c figure an approximation. Table 5.1 and Erlang's C formula are M/M/c.")

# 10
x("Holding the two-berth Ekene quay to a 1-hour mean wait under M/M/c: what reason does the berth search give?",
 "3 berths are the fewest with a mean wait at or below 1 hour (0.440347 hours)",
 ["2 berths, the base as stated, since its 3.180124-hour wait is inside a working day",
  "4 berths, the first count whose wait of 0.068902 hours falls to a few minutes",
  "No berth count, since the 3.180124-hour wait at 2 berths misses the target"],
 "The engine searches from the fewest berths that keep the berth utilisation below 1 upward, under the stated model, and returns the first whose mean wait is at or below the target, with its reason in its own words as the key shows. Two berths wait 3.180124 hours, above 1; three wait 0.440347; four are more than the fewest.")

# 11
x("Under M/D/c, which berth count and wait does the search report for the Ekene base's 1-hour target?",
 "Three, where the constant-service wait falls to 0.259397 hours",
 ["2 berths, since the M/D/c wait at 2 berths is short enough to meet the 1-hour target",
  "3 berths with a wait of 0.440347 hours, the same figure the M/M/c search returns",
  "No berth count, since M/D/c gives no delay probability for the search to work from"],
 "The search uses the stated model: as M/D/c two berths wait 1.665786 hours, above the target, and three wait 0.259397, so the engine returns 3 berths with that reason. 0.440347 is the three-berth wait as M/M/c. The M/D/c search needs only the wait, which the approximation gives.")

# 12
x("How does the engine's berth-target search choose where to start and where to stop?",
 "From the whole part of the offered load plus one, upward to 100 berths, under the stated model",
 ["From one berth upward to the berths stated in the call, under M/M/c whatever the stated model is",
  "From 100 berths downward, until the wait first rises above the target, under the stated model",
  "From the stated berths upward, one at a time, until the berth utilisation first falls below 0.5"],
 "The search starts at the fewest berths that keep the berth utilisation below 1, the whole part of the offered load plus one, so it never offers a count with no steady state, and it runs to the cap of 100 under the model the call states. It returns the first count whose wait meets the target.")

# 13
x("A call states a base whose M/M/c wait at one berth prints as 9.000000 hours, with a target mean wait of 9 hours. What does the engine return, and what reading does that rest on?",
 "1 berth, because the engine reads a target as met at or below it; met only strictly below would give a second berth",
 ["2 berths, since a wait that merely equals the target has not been brought under it, which the engine requires",
  "No berth count, because a target equal to the wait is read as unreachable and is reported with a reason",
  "A refusal on targetMeanWaitHours, since a target must lie strictly below the wait at the berths stated"],
 "The engine's reason, verbatim: \"1 berth is the fewest with a mean wait at or below 9 hours (9 hours)\". At or below is the engine's stated reading; the alternative it names, met only strictly below, would push the answer to a second berth. The course teaches it as the engine's reading, and no graded figure rests on it.")

# 14
x("Zero hours of waiting is set as the berth target. How does the engine answer?",
 "A result with a reason: no berth count up to 100 gives a mean wait at or below 0 hours",
 ["A refusal on targetMeanWaitHours, since a target of 0 is outside the accepted range",
  "100 berths, the cap of the search, with the smallest wait it could reach up there",
  "The berths as stated, since a target of 0 is read as asking for no target at all"],
 "Every steady-state queue has some wait, so 0 hours is never met; the engine returns its figures with the reason \"no berth count up to 100 gives a mean wait at or below 0 hours\" and no berth count. A target of 0 is accepted; the refusal belongs to a negative target, \"targetMeanWaitHours must be a finite number at or above 0; got -1\".")

# 15
x("Why does a constant service time give a shorter mean wait than an exponential one at the same arrivals and mean service?",
 "No call runs long, so the vessel ahead is less likely to hold a berth far past the mean",
 ["The berth utilisation is lower under constant service, so the berths are idle more often",
  "Constant service lets the base serve two vessels at one berth whenever the calls are short",
  "Under constant service the arrivals are spaced evenly, so vessels never bunch at the base"],
 "With exponential service some calls run far past the mean, and a vessel that arrives during one waits for it; with a constant service none does. The berth utilisation is the same under both models, the berths still serve one vessel each, and the arrivals are Poisson in both, bunching alike.")

emit(Q, '/root/cat-wip-marine/banks/sc4a_m03.json', expect_n=15)
finish()
