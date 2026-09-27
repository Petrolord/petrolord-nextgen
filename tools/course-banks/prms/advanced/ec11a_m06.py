import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Expert m06, What the Engine Does Not Compute. Keys are the course seams,
# the engine's caps and refusals at scale (stated calls handed to the engine),
# the order of refusals on the econ-ekene probe, and the source quirks and
# conventions as the digest states them. scratch/bank-advanced/witness.mjs
# recomputes every refusal key. No capstone figure appears.

K = [1, 0, 2, 3, 0, 3, 1, 2, 0, 1, 2, 3, 1, 3, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A learner wants the engine to build the Ekene low, best and high production forecasts from well rates. Where does that work belong?",
 "In the dca course; the engine takes three stated technical forecasts, year by year",
 ["In the engine's economicLimit, which fits a decline to the stated rates before it runs the cash flow",
  "In the cashflow course, which builds forecasts before discounting them",
  "Nowhere: forecasts are always a stated input"],
 "The engine builds no production forecast; a forecast from rates by decline or type curves belongs to the dca course (Decline Curve Analysis), and the engine takes three stated technical forecasts. economicLimit fits nothing; the cashflow course owns the ledger and discounting; and the dca course does own forecasting from rates.")

# 2
x("A reserves report needs recoverable volumes from maps and rock properties. What does the engine take in their place?",
 "Stated estimates or distributions; the volumetrics belong to the reservoircalc course",
 ["A material balance run inside aggregate, fitted to the stated opening of the reconciliation",
  "The fitted triangular of lib/stats, which it builds from the maps",
  "The mbal course's figures, imported at run time"],
 "Volumetrics from maps and rock properties belong to reservoircalc (Reservoir Volumetrics) and material balance to mbal (Material Balance); the engine takes stated estimates or distributions. It runs no material balance; lib/stats fits a triangular through stated estimates and reads no map; and it imports nothing from another course.")

# 3
x("Which Nigerian fiscal figures does the engine compute for its economic limit?",
 "None: it takes a stated royalty rate and form and a stated tax rate, and the pia course teaches the fiscal terms",
 ["The PIA 2021 royalty by terrain and price, read from the gazette",
  "The hydrocarbon tax and companies income tax of the PIA 2021, applied through cashflow.ts",
  "The Ekene royalty of 15.000000 percent, which is the onshore rate of the Act"],
 "The engine computes no fiscal regime beyond a stated royalty and tax; royalty rates by terrain and price, hydrocarbon tax and companies income tax belong to the pia course. The Ekene 15.000000 percent royalty is a synthetic teaching figure, and the fixture says it is not a rate of the Petroleum Industry Act 2021.")

# 4
x("Which course of the academy owns the price deck behind a reserves estimate?",
 "None: prices are always a stated input, year by year",
 ["The pia course, since the Commission publishes the prices for royalty",
  "The cashflow course, which sets the academy's price forecast for every economics course",
  "The uncertainty course, which samples prices on a seed"],
 "The engine sets no price deck, and no course owns one: prices are a stated input. The pia course teaches fiscal terms, the cashflow course the ledger and discounting, and the uncertainty course distributions and Monte Carlo as a subject; none of them supplies a price forecast to this engine.")

# 5
x("What Nigerian booking or reporting rule does the engine apply to a reserves figure?",
 "None: no gazetted NUPRC reserves reporting regulation or booking guideline was found on the list read 2026-09-27",
 ["The NUPRC booking guideline of 2026",
  "The Commercial Regulations 2025, reg. 6, which sets how reserves are booked",
  "The PIA 2021 s.7(i), which fixes the categories a licensee reports"],
 "No gazetted Nigerian booking or reporting rule was found, so the course teaches the PRMS classes and states none. Regulation 6 of the Commercial Regulations 2025 asks for a status report that includes the reserves situation, taught by concept; s.7(i) gives the Commission the evaluation of national reserves and fixes no categories.")

# 6
x("Fifty-one projects go into one aggregate call. Which message comes back?",
 "projects must have at most 50 entries; got 51",
 ["a result on the first 50 projects, with the 51st named as dropped",
  "iterations must be at most 45454 for 11 projects (iterations x projects at most 500000); got 51",
  "a result, since the project cap applies only above the field level"],
 "DEFAULTS.MAX_PROJECTS is 50, and a call over it is refused in the engine's own words. Nothing is truncated; the draw-work message is a separate cap on draws times projects; and every cap applies at every level.")

# 7
x("An aggregation of 11 projects asks for 200000 draws. What does the engine return?",
 "a refusal: iterations must be at most 45454 for 11 projects (iterations x projects at most 500000)",
 ["a result on 200000 draws, since 200000 is the MAX_ITERATIONS cap and a call exactly at the cap is always allowed",
  "a result on 45454 draws, the most the stated projects allow, with a warning line in the reasons saying so",
  "iterations must be an integer from 100 to 200000; got 200000"],
 "Draws times projects may not exceed 500000, because the correlated draw grows with the square of the project count; the refusal names the most draws 11 projects allow, 45454. 200000 is within MAX_ITERATIONS alone but not with 11 projects; the engine reduces nothing silently; and the range message fires only outside 100 to 200000.")

# 8
x("An aggregation states its correlation with a key named matrix. What does the engine return?",
 "correlation.matrix is not an accepted key; the accepted keys of correlation are type, rho, pairs",
 ["a result that reads the matrix and checks it is positive semidefinite",
  "a result that ignores the unknown key and uses the stated rho",
  "correlation must be an object { type: \"uniform\", rho } or { type: \"pairs\", pairs } (stated; no default); got nothing"],
 "Every function refuses an input key it does not read, at every level, naming the key, its path and the accepted keys. A misspelt or unknown key is refused by name, neither dropped nor guessed at; the object-shape message is for a correlation left out entirely.")

# 9
x("On econ-ekene a stated probe removes the reporting basis and adds a top-level key named basis. Which refusal comes back?",
 "The unknown key basis, listing the accepted top-level keys, because accepted keys are checked before any input is read",
 ["The missing reportingBasis, since a required input outranks an unknown one",
  "Both refusals together, one per line, in the order the keys were typed",
  "Neither: the engine reads basis as a spelling of reportingBasis"],
 "Every function checks its accepted keys before it reads an input, so the engine's message is: basis is not an accepted key; the accepted keys at the top level are effectiveYear, forecasts, prices, costs, royalty, tax, workingInterestPct, licence, reportingBasis, discountRatePct, mscfPerBoe. It returns one refusal, and it matches no spelling.")

# 10
x("The 2011 Guidelines print the arithmetic Proved of blocks A and B as 71.8 in Table 6.2 and as 72 on Fig. 6.5. What does the course make of the pair?",
 "The figure rounds the table; the engine returns 71.800000",
 ["The table is a misprint and the figure of 72 is the Guidelines' value, which the engine reproduces",
  "The two describe different blocks of the Guidelines' example",
  "The figure prints the probabilistic Proved of the two blocks"],
 "Fig. 6.5 rounds Table 6.2's 71.8 to 72, and the engine's arithmetic sum is 71.800000. Neither is a misprint, both describe blocks A and B, and the probabilistic Proved of independent blocks is a separate figure the Guidelines print as 77.")

# 11
x("Which edition of the Guidelines for Application of the PRMS does the course cite, and why?",
 "The 2011 edition: the 2022 revision is sold and was not read",
 ["The 2022 edition, which supersedes 2011 and is free to download from SPE",
  "The 2018 edition published with SPE-PRMS 2018",
  "The 2011 edition, because the 2022 revision withdrew the aggregation chapter altogether"],
 "The Guidelines were revised in 2022; that edition is sold and was not read, so the course names the 2011 edition by its year and uses its numbers and section numbers only. There is no 2018 edition of the Guidelines, and nothing read says the 2022 revision withdrew a chapter.")

# 12
x("The NUPRC release of 1 April 2026, as its page renders, prints the 2P crude oil figure as 09 billion barrels. What does the course do with it?",
 "Uses only the gas figures and the total, and computes nothing from the truncated oil figure",
 ["Reads it as 9 billion barrels",
  "Completes it from the digits of the condensate figure",
  "Derives the crude oil figure as the total 37.01 less the condensate 5.92, reported as the release's own figure"],
 "The crude oil figure is truncated on the page, so the course uses only the gas figures and the total and computes nothing from the truncated one. Reading it as 9, or completing it by any arithmetic, puts a figure in the release's mouth that the page does not print.")

# 13
x("The consolidated PRMS errata (May 2022, item 5) revise the glossary entry for \"economic\". What follows for the engine's economic test?",
 "The test is undiscounted, matching PRMS 3.1.2.1, and the engine applies it undiscounted",
 ["The test is made at the stated discount rate of 10.000000 percent on the Ekene case",
  "The test is made on the NPV at the working interest",
  "The errata leave the test to the caller's choice of discount rate, so the engine takes none"],
 "Item 5 makes the glossary entry read a zero percent discount rate, matching 3.1.2.1: the economic test is undiscounted, which is the test the engine applies. The stated discount rate sets the NPV the engine reports and does not enter the test.")

# 14
x("Which of these does prms.js carry code for of its own?",
 "The classification, category, economic-limit, aggregation and reconciliation logic, with its imports doing the cash flow, sampling and percentile work",
 ["A cash flow and NPV calculation written for reserves work",
  "A seeded sampler and quantile reader alongside lib/stats",
  "A percentile convention that reads P90 as the 0.9 quantile"],
 "The engine imports computeCashFlow and applyJV from cashflow.ts, the canonical seeded Monte Carlo from lib/stats and the P90, P50 and P10 labels from lib/conventions/percentile.js, and carries no cash flow, NPV, discounting, sampler or percentile code of its own. It reads P90 as the 0.1 quantile of the totals.")

# 15
x("The engine's category labels on an economic limit and on an aggregation are outcome labels only. What do they not say?",
 "That a stated deterministic scenario has a 90 percent chance of being met or exceeded",
 ["That the low case carries the P90 label and the high case the P10 label, as the convention sets",
  "That 1P, 2P and 3P name the low, best and high estimates of the Reserves in the stated unit",
  "That P90 marks the low estimate, per lib/conventions/percentile.js"],
 "The engine says its labels are outcome labels only: it does not say a stated deterministic scenario has a 90 percent chance. The other three are what the labels do say: P90 on the low case and P10 on the high, 1P, 2P and 3P for the Reserves categories, and the low estimate as P90 per the canonical convention.")

emit(Q, '/root/cat-wip-prms/banks/ec11a_m06.json', expect_n=15)
finish()
