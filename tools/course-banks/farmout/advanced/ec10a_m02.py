import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Expert m02, Risk Sharing. Every key rests on the engine's riskSharing
# return on a golden input (risk-ekene, risk-psu, risk-spread-four,
# risk-correlated, the refusals) or on a line the digest prints. No key is a
# Monte Carlo figure stated as exact: a draw figure is keyed only with its seed
# and draw count and as an estimate, and the closed-form figures (EMV, standard
# deviation) carry the exact keys. scratch/bank-advanced/witness.mjs recomputes
# each figure. The Ekene Deep prospect and every party are synthetic.

K = [1, 3, 0, 2, 3, 0, 1, 3, 2, 0, 2, 1, 3, 0, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Which figures of a riskSharing call are closed form, the same on any machine whatever the seed?",
 "The EMV and the standard deviation of each position",
 ["The chance of a loss and the EMV of each position, read from the stated draws",
  "The low case and the high case, since both are labelled by the canonical percentile module",
  "Every figure the call returns, because the seed is a stated input with no default"],
 "The engine's basis says it: EMV and standard deviation closed form (success/failure mixtures, equal pairwise correlation); the chance of a loss and the low and high cases from its seeded Monte Carlo. The seed makes the draws repeatable on any machine, yet the chance of a loss and the P90 and P10 cases stay estimates; the percentile labels name the cases and compute nothing.")

# 2
x("On risk-ekene, what happens to EKO's standard deviation when it farms out 30.000000 percent of Ekene Deep to FIN?",
 "It falls from 80399735.584206 alone to 46115911.128875 after the deal",
 ["It rises from 46115911.128875 alone to 80399735.584206, the cash adding spread",
  "It stays at 80399735.584206, the prospect's own spread",
  "It falls to 23848.480035, the Penn State farm out spread"],
 "Drilling alone EKO carries 80399735.584206; after the farm-out it holds 40.000000 percent of the prospect and a certain cash holding, and the closed-form standard deviation is 46115911.128875 (engine). The certain cash has a standard deviation of 0 and adds none. 23848.480035 is the Penn State farm out position on risk-psu, a different problem.")

# 3
x("With seed 20271111 and 20000 draws, what chance of a loss does the engine print for EKO drilling Ekene Deep alone, and how does the course read it?",
 "0.752450, an estimate from the stated draws of a loss chance whose exact value is the dry-hole chance 0.750000",
 ["0.750000, computed exactly in closed form by the engine from the chance of success of 25.000000 percent",
  "0.747650, the exact chance of a loss for EKO drilling alone, since both positions share one seed",
  "0.752450, the exact chance of a loss for this position, so any seed prints it the same on any machine"],
 "The engine counts losses in 20000 seeded draws and prints 0.752450 (engine). Both Ekene positions lose on a dry hole and on nothing else, so the chance they estimate is 100 less 25.000000 percent, over 100: 0.750000 (derived); the engine does not return that figure itself. 0.747650 is the estimate for the position after the farm-out. The same seed and draws repeat 0.752450, and another seed prints another estimate.")

# 4
x("The course says the two Ekene estimates, 0.752450 and 0.747650, each sit within 0.015309 of 0.750000. What is 0.015309?",
 "Five standard errors of a proportion at a chance of 0.750000 over 20000 draws",
 ["A course tolerance on every graded field",
  "The gap between the two positions' estimates",
  "One standard deviation of the chance of a loss across seeds the engine has sampled"],
 "The digest derives it: five standard errors of a proportion at that chance, with 20000 draws. It is a band for reading sampling noise. No graded field is a draw, so the course tolerance plays no part; the two estimates differ from each other only by accident of the draws, and the engine samples one seed per call.")

# 5
x("On risk-ekene, EKO after the farm-out holds a certain holding of 5208000.000000. What does that figure stand for?",
 "The cash bonus 2000000.000000 plus the reimbursement 3600000.000000, less the assignor fees 392000.000000",
 ["The consideration 10000000.000000 less the Ekene carry of 4400000.000000 and the assignor fees",
  "The fee of 392000.000000 plus the value of the transaction of 5600000.000000 stated to consentFee",
  "EKO's expected carry of 4100000.000000 plus the bonus, with the reimbursement left for later years"],
 "The digest derives it: 2000000.000000 + 3600000.000000 - 392000.000000 = 5208000.000000, the cash EKO receives for certain in both outcomes. The carry is already inside EKO's 40.000000 percent holding (its success value 94500134.816723 and fail cost 12000000.000000), the fee is paid by EKO and never added, and the expected carry is a deal-view figure.")

# 6
x("Under the platform's percentile convention, which label does the engine give the low case of a position?",
 "P90, the value the outcome exceeds 90 percent of the time",
 ["P10, the tenth percentile of the outcomes sorted from lowest to highest",
  "P50, the median of the stated draws, reported as the central case of the position",
  "P90, the value the outcome falls below 90 percent of the time"],
 "The engine's label line: p90 is the low case and p10 the high case (probability of exceedance, lib/conventions/percentile.js). P90 is exceeded 90 percent of the time, so it sits low. Calling P10 the low case reverses the convention; a value the outcome falls below 90 percent of the time is a high value; riskSharing reports no P50.")

# 7
x("A learner reruns the Ekene risk call with a different seed and the same 20000 draws. Which figures can move?",
 "The chance of a loss and the low and high cases; the EMVs and standard deviations stay",
 ["Only the EMVs, since the draws feed the average of each position's outcomes",
  "Nothing at all, since the seed is part of the stated terms and every figure is closed form",
  "The standard deviations and EMVs, while the chance of a loss is held by the dry-hole chance"],
 "The seed and the draws move only the estimates: the chance of a loss and the P90 and P10 cases. The EMV and the standard deviation are closed form and depend on neither. A different seed returns different estimates; the same seed and draws return the same ones on any machine.")

# 8
x("risk-spread-four holds an EMV of 20000000.000000 as one prospect at 100 percent or as 4 independent prospects at 25 percent each. What does the engine return for the spread?",
 "106887791.632160 for the one prospect and 53443895.816080 for the four",
 ["53443895.816080 for the one prospect and 106887791.632160 for the four, the four adding spread",
  "106887791.632160 for both, each prospect's spread untouched",
  "82158383.625775 for the four, sharing one latent driver"],
 "With correlation 0.000000 the closed-form standard deviation halves, from 106887791.632160 to 53443895.816080 (engine), at the same EMV. 82158383.625775 is the four prospects with a stated correlation of 0.500000 (risk-correlated), a different call.")

# 9
x("Four prospects at 25 percent each are stated with a correlation of 0.500000 on risk-correlated. What closed-form standard deviation does the engine return?",
 "82158383.625775, above the 53443895.816080 of the same four stated independent",
 ["53443895.816080, since correlation moves only the drawn estimates and leaves the spread",
  "106887791.632160, since a correlation above 0 makes four prospects act as one",
  "92230348.163821, the P10 high case of the four independent prospects drawn at seed 11"],
 "The correlation moves the closed-form standard deviation as well as the estimates: 82158383.625775 at 0.500000 against 53443895.816080 independent (engine). Correlated prospects tend to succeed and fail together, so spreading removes less risk. 92230348.163821 is a drawn high case, no standard deviation.")

# 10
x("A risk call is sent with no seed. In its own words, what does the engine return?",
 "seed must be an integer from 0 to 4294967295 (stated; no default); got nothing",
 ["iterations must be an integer from 1 to 200000 (stated; no default); got 200001",
  "correlation must be a number from 0 to 1 (the correlation of the latent drivers; stated, no default); got -0.1",
  "positions[0].holdings[0].successStdDev must be a finite number at or above 0; got nothing"],
 "The seed is a stated input with no default, and the engine refuses its absence by name: seed must be an integer from 0 to 4294967295 (stated; no default); got nothing. The other three are the engine's messages for too many draws, a correlation below 0 and a holding with no standard deviation.")

# 11
x("A risk call states 200000 draws over positions holding 3 holdings in all. Which refusal comes back?",
 "iterations must be at most 166666 for 3 holdings in all (iterations x holdings at most 500000); got 200000",
 ["iterations must be an integer from 1 to 200000 (stated; no default); got 200000",
  "positions must have at most 10 entries; got 3",
  "positions[0].holdings must have at most 50 entries; got 200000"],
 "200000 draws is inside the draw cap, so the first rule passes; the draw work rule then applies, draws times holdings over all positions at most 500000, and the engine names the most draws three holdings allow: 166666. Three positions or holdings are far inside the caps of 10 positions and 50 holdings.")

# 12
x("Which correlation does riskSharing refuse?",
 "-0.1, below the stated range from 0 to 1",
 ["1, since a correlation of 1 makes every holding the same bet",
  "0, since independent latent drivers need no correlation stated",
  "0.500000, since only 0 and 1 are accepted for the latent drivers"],
 "The engine's words: correlation must be a number from 0 to 1 (the correlation of the latent drivers; stated, no default); got -0.1. 0 is accepted and is what risk-ekene states; 0.500000 is accepted on risk-correlated; 1 lies at the top of the stated range.")

# 13
x("On risk-psu, the drill yourself or farm out problem of Penn State EME 801, Lesson 6 (numbers only, CC BY-NC-SA 4.0), why does the farm out position show a chance of a loss of 0.000000 with seed 7 and 50000 draws?",
 "Its dry-hole payoff is 0.000000, so no outcome of the position is a loss",
 ["Its EMV of 17500.000000 is above the drill yourself EMV of 12500.000000",
  "The seed of 7 happens to draw no dry hole in 50000 draws of that position",
  "Its standard deviation of 23848.480035 is too small to reach any loss"],
 "The farm out pays 0.000000 on a dry hole and 50000.000000 on a producer, so it can never lose; the estimate of 0.000000 reflects the payoffs. A higher EMV or a small spread says nothing about losses, and the drill yourself position in the same draws is estimated to lose 0.651800 of the time, so dry holes are drawn.")

# 14
x("Which risk-view figures does any capstone of this course grade?",
 "None of them, since the course grades no Monte Carlo draw of any kind",
 ["The chance of a loss, since a stated seed makes the draw the same on any machine",
  "The low case alone, since P90 prints the same as the dry-hole payoff on risk-ekene",
  "Every figure of risk-ekene, each printed to six decimals"],
 "The course is explicit: no graded figure is a Monte Carlo draw, and the chance of a loss and the low and high cases are taught and never graded. A stated seed repeats a draw; it does not make a sample a return value on fixed terms. A P90 that prints like a payoff is still a percentile of draws.")

# 15
x("With seed 20271111 and 20000 draws, how does the farm-out move EKO's low case (P90) on risk-ekene?",
 "From -28000000.000000 alone to -6792000.000000 after, estimates from the stated draws",
 ["From -6792000.000000 alone to -28000000.000000 after, the deal deepening EKO's worst case",
  "From -28000000.000000 alone to -12000000.000000 after, the fail cost of the 40 percent holding",
  "It stays at -28000000.000000, since both positions lose on the same dry hole"],
 "The draws put EKO's low case at -28000000.000000 alone and -6792000.000000 after the farm-out (engine, seed 20271111, 20000 draws). After the deal EKO's dry-hole outcome is the fail cost 12000000.000000 offset by the certain cash 5208000.000000, so the low case sits at -6792000.000000 and the fail cost alone is too low. The same dry hole costs EKO less after the deal.")

emit(Q, '/root/cat-wip-farmout/banks/ec10a_m02.json', expect_n=15)
finish()
