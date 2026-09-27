import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Expert m03, Risked Quantities and Classes. Every numeric or refusal key is
# a return of the vendored engine on a golden input (agg-ekene-contingent,
# agg-prospective, agg-nuprc-2026-gas-2p and the aggregate refusals) or a stated
# probe the digest prints (the normal of mean 4 and standard deviation 3.1).
# scratch/bank-advanced/witness.mjs recomputes each key. The risked mean is a
# closed-form figure; no key is a Monte Carlo draw. No capstone figure appears.

K = [3, 1, 2, 0, 2, 3, 1, 0, 0, 2, 1, 3, 0, 2, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The Ekene Contingent Resources (synthetic) hold EKN-3, EKN-4 and EKN-5 with chances of commerciality of 50.000000, 65.000000 and 20.000000 percent and means of 13.000000, 4.637674 and 3.000000 MMboe. What risked mean does the engine return?",
 "10.114488 MMboe",
 ["20.637674 MMboe, the sum of the three means with no chance applied",
  "13.000000 MMboe, the mean of EKN-3, the project with the largest mean",
  "4.637674 MMboe"],
 "The risked mean is the sum of each project's chance of commerciality times its mean: 50.000000 percent of 13.000000, 65.000000 percent of 4.637674 and 20.000000 percent of 3.000000 add to 10.114488 MMboe (engine). 20.637674 is the unrisked sum of the means; 13.000000 is EKN-3 alone; 4.637674 is EKN-4's unrisked mean.")

# 2
x("How does the engine build a risked mean for a risked class?",
 "It adds, project by project, the stated chance of commerciality times the project's mean (the 2011 Guidelines 6.4)",
 ["It multiplies the arithmetic 2C by the average chance of the projects",
  "It multiplies the sampled P50 of the total by the product of every project's chance of commerciality, taken together",
  "It samples each project as a success or a failure on the seed and reports the mean of the risked totals"],
 "The engine's line reads: the sum of chance of commerciality x mean, citing PRMS 4.2.6, FAQ 6.9 and the 2011 Guidelines 6.4. It uses each project's own chance on its own mean; a best estimate or a sampled P50 is no mean, a product of chances belongs to no project, and the risked mean is closed-form with no draw behind it.")

# 3
x("The Ekene Prospective Resources (EKN-6 and EKN-7) are aggregated with their chances of commerciality. What risked mean does the engine return?",
 "8.980000 MMbbl, against an unrisked sum of means of 49.333333",
 ["49.333333 MMbbl, since Prospective Resources carry a chance of discovery only",
  "8.980000 MMbbl, the same figure as the sum of means once rounded",
  "20.000000 MMbbl"],
 "The engine returns a risked mean of 8.980000 against a sum of means of 49.333333 (engine): each prospect's chance of commerciality, Pg x Pd, times its mean. 49.333333 is the unrisked sum; the two figures differ by far more than rounding; and 20.000000 is EKN-6's chance of commerciality in percent, which is no quantity.")

# 4
x("A caller wants one total for the Ekene Reserves, Contingent Resources and Prospective Resources together. What does the engine allow?",
 "One class a call: each class is aggregated on its own, and each figure says whether it is risked",
 ["One call with every project, each class weighted by its chance before the categories are summed into one",
  "One call with every project, the Reserves entered at a chance of commerciality of 100",
  "One call with every project once the level is set above the field, where the classes merge"],
 "The engine aggregates the projects of one class at a time; the classes are not added into one figure (PRMS 4.2.6; FAQ 6.9; the 2011 Guidelines 6.4). No weighting merges them; a chance stated on Reserves is refused; and the level decides only what may be reported.")

# 5
x("Chance of commerciality 100 is typed on the first project of a Reserves aggregation. How does the engine treat it?",
 "projects[0].chanceOfCommercialityPct must be left out for Reserves (their chance of commerciality is not a stated figure, PRMS 2.1.3.3); got 100",
 ["a result in which the chance of 100 multiplies every mean by one, so the risked mean equals the sum of the means",
  "projects[0].chanceOfCommercialityPct must be a number from 0 to 100; got 100",
  "a result that ignores the chance and prints a warning line saying Reserves carry none"],
 "Reserves carry no stated chance of commerciality (PRMS 2.1.3.3), and the engine refuses one by name even at 100. It computes no risked mean for Reserves and drops no key silently; the range message is the one for a Contingent project whose chance is missing or out of range.")

# 6
x("A Contingent Resources aggregation leaves out the chance of commerciality on its first project. What does the engine return?",
 "projects[0].chanceOfCommercialityPct must be a number from 0 to 100; got nothing",
 ["a result that uses a chance of 100 for that project and says so in the reasons",
  "a result that leaves the project out of the risked mean alone and keeps it in the arithmetic sums",
  "projects[0].chanceOfCommercialityPct must be left out for Reserves; got nothing"],
 "A risked class carries a stated chance on every project, and a missing one is refused with the engine's own message. No chance is supplied for it, no project is quietly dropped from the risked mean, and the \"left out for Reserves\" refusal belongs to the opposite case.")

# 7
x("A project states a distribution of type \"beta\". What does the engine return?",
 "a refusal naming the four types it takes: \"triangular-fit\", \"triangular\", \"lognormal\", \"normal\"",
 ["a result that reads the beta as a triangular with the same minimum, mode and maximum as it was stated",
  "a refusal saying the distribution must be a normal whose low estimate stays at or above 0",
  "a result that fits a triangular through the beta's percentiles and states the fit it made in the reasons"],
 "The engine's message is projects[0].distribution.type must be one of \"triangular-fit\", \"triangular\", \"lognormal\", \"normal\"; got \"beta\". It converts no type into another and fits nothing it was not told to fit; the normal message belongs to a normal whose low estimate falls below 0.")

# 8
x("A \"triangular-fit\" project states low 10, best 15 and high 24. What does the engine return?",
 "a refusal: the best estimate sits too near the low estimate for any triangular to pass through the three exactly",
 ["a triangular whose minimum would fall below 0, refused with its fitted minimum printed",
  "a triangular fitted as closely as it can manage, with the miss printed as a warning line",
  "a result with a lognormal fitted in its place, because no triangular passes"],
 "The engine refuses a fit it cannot make exactly: projects[0].estimates must be low, best and high that a triangular distribution passes through exactly (lib/stats fitTriangularToPercentiles), the best sitting too near the low. The below-0 refusal is a different message for a fit that passes and reaches below 0; no near-fit or substitute is returned.")

# 9
x("Low 1, best 5 and high 9 are stated for a fitted triangular. What comes back from the engine?",
 "a refusal: the fitted triangular passes through them exactly but its minimum would be -2.236068",
 ["a refusal: the best estimate sits too near the low estimate for any triangular to pass through all three",
  "a result whose fitted minimum is set to 0, with the mode moved along to keep the three estimates on the fit",
  "a result, since the low, best and high are in order and evenly spaced about the best estimate of 5"],
 "A fit that does pass through the three exactly and still reaches below 0 is refused with its own message, printing the minimum it would have: -2.236068 (engine). The exactness message is for a fit that cannot pass at all; the engine moves no parameter to rescue a fit; and order alone is not enough.")

# 10
x("A project states a normal with mean 1 and standard deviation 1. What does the engine return?",
 "a refusal, because its low estimate would be -0.281552",
 ["a result whose negative draws are set to 0 before the total is read",
  "a refusal, because a normal is accepted only for Contingent Resources",
  "a result with a warning that the normal draws below 0 at a chance of 0.098469"],
 "The engine refuses a normal whose low estimate, the mean less the standard normal 90th percentile times the standard deviation, is below 0: here -0.281552. It truncates no draw; a normal is taken for any class; and the warning line is for a normal whose low estimate stays at or above 0 but which can still draw below 0.")

# 11
x("A stated probe gives a normal of mean 4.000000 and standard deviation 3.100000, whose low estimate is 0.027190. What does the engine do with its draws below 0?",
 "It keeps them in the total and prints a line with their chance, 0.098469, from lib/stats normalCDF",
 ["It refuses the normal, since any chance below 0 is a refusal",
  "It discards them and draws again until each draw is at or above 0, so the total can never fall below 0",
  "It keeps them but prints nothing, since the low estimate is above 0"],
 "The low estimate is at or above 0, so the normal is accepted; it can still draw below 0, and the engine says so in its own words: W: a normal distribution draws below 0 with chance 0.098469 (lib/stats normalCDF); those draws stay in the total. No redraw or refusal follows, and the line is printed.")

# 12
x("Why does the Ekene Upper sand normal (EKN-U, mean 4, standard deviation 0.8) carry no below-zero line in the engine's reasons?",
 "Its chance below 0 is 2.871050e-7, which prints as 0 at six decimals, so no line is added",
 ["Its chance below 0 is exactly 0, since a normal of that mean cannot reach below 0",
  "The line is printed for Contingent Resources alone, and EKN-U is one of the three Reserves projects",
  "The line is printed only when a correlation is stated, and EKN-U's stated pairs keep it apart from the others"],
 "The engine returns a chance below 0 of 2.871050e-7 for EKN-U, which prints as 0 at six decimals, so it adds no line. A normal always has some chance below 0; the line depends on neither the class nor the correlation.")

# 13
x("An aggregation input carries a lognormal with its mean and standard deviation and, beside it, three estimates. How does the engine answer?",
 "a refusal: the estimates must be left out when the distribution is stated, since the engine reads them off it",
 ["a result that uses the stated estimates and ignores the distribution",
  "a result that checks the two agree and prints the larger difference",
  "a refusal: the lognormal must be stated as a triangular-fit when estimates come with it"],
 "The engine refuses both forms at once: projects[1].estimates must be left out when the distribution is stated (the engine reads the estimates off it). It chooses neither form for the caller and reconciles nothing; a triangular-fit takes estimates, and a lognormal takes a mean and a standard deviation.")

# 14
x("The NUPRC release of 1 April 2026 prints the 2P associated gas at 100.21 and the 2P non-associated gas at 114.98 trillion cubic feet as at 1 January 2026. Each is stated to the engine as a constant at the above-field level. What does it return?",
 "215.190000, reported as \"arithmetic\"",
 ["215.190000, reported as \"arithmetic-or-statistical\"",
  "a sampled P90 below 215.190000 on seed 1 and 100 draws, reported as the national 1P",
  "a refusal, because published national figures have no low or high estimate"],
 "The two constants add to 215.190000 (engine), matching the total the release prints, and above the field level the engine reports \"arithmetic\". Constants sample to the same figure on every draw; the release publishes only a 2P, which the call states as a constant; nothing is refused.")

# 15
x("On that national gas call the engine's labels read 1P, 2P and 3P, all at 215.190000. How are they read?",
 "Only the 2P was published; each figure is stated as one value, so the three labels print it alike",
 ["All three were published by the Commission and happen to be equal as at 1 January 2026, the date of the figures",
  "The 1P and the 3P are the engine's own estimates of the national range around the one published figure",
  "The labels show the figure is risked at a chance of commerciality of 100, as a published total always is"],
 "Each published 2P figure is stated as a constant, low, best and high the same, so the category labels read 1P, 2P and 3P for one stated figure, and only the 2P is what was published. The engine estimates no national range, and Reserves carry no chance of commerciality. A national figure is reported reserves with its date and who reported it.")

emit(Q, '/root/cat-wip-prms/banks/ec11a_m03.json', expect_n=15)
finish()
