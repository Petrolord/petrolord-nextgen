import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Expert m02, The Poisson Anchor. Every numeric or refusal key is a return
# of the vendored engine on a golden input (mil-hdbk-338b-lamps,
# ins-mil-hdbk-mean, ins-ekene-esp-motor, ins-search-limit, ins-max-zero,
# ins-refuse-max-fraction, ins-refuse-max-cap);
# scratch/bank-advanced/witness.mjs recomputes each keyed figure and message.
# MIL-HDBK-338B is public domain and quoted only as the course quotes it. No key
# is a Monte Carlo figure and no capstone figure appears.

K = [1, 3, 0, 2, 0, 1, 3, 2, 0, 3, 1, 2, 0, 3, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("MIL-HDBK-338B (1 October 1998) example 5.3.8.1 runs a slide projector for 500 hours with a lamp failure rate of 0.001 failures per hour. What Poisson mean does that give?",
 "0.500000 failures, the rate an hour times the 500 hours of the mission",
 ["2 failures, the number of spare bulbs the example holds on hand",
  "0.365 failures, the figure a year that the orders outstanding case states",
  "500 failures, the hours of operation read directly as the expected count"],
 "A rate of 0.001 an hour over 500 hours is a mean of 0.500000 failures (engine). The 2 is the stock of spare bulbs, the level the probability is asked at; 0.365 is the failures a year of the restated insurance case, one input of its mean; 500 is the length of the mission.")

# 2
x("For the handbook lamps, what probability of two failures or fewer does the engine return, and how does it stand against the handbook's figure?",
 "0.985612 from the engine, which the handbook prints at three decimals as 0.986",
 ["0.949374, which the handbook prints as 0.986 after a slip in its table",
  "0.986 exactly, because the engine is set up to reproduce the printed handbook figure",
  "0.990054, the three-spare figure, which the handbook rounds to 0.99"],
 "The Poisson cumulative probability at 2 with a mean of 0.500000 is 0.985612 (engine), and the handbook's 0.986 is that figure at three decimals: a rounding, no slip. 0.949374 and 0.990054 are rows of the ESP motor table at another mean; the engine never changes a rule to match a print.")

# 3
x("The course restates the handbook lamps as orders outstanding in an insurance call. Which stated inputs give the lamp mean there?",
 "0.365 failures a year and a lead time of 500 days over 365 days a year",
 ["0.001 failures a year and a lead time of 500 days over 365 days a year",
  "2 failures a year and a lead time of 150 days over 365 days a year, as stated",
  "0.5 failures a year and a lead time of 365 days over 500 days a year"],
 "0.365 times 500 over 365 is a mean of 0.500000 orders outstanding, the lamp mean, and with two spares the probability of no shortage is 0.985612. 0.001 is the lamp rate an hour and gives no such mean here; 2 failures over 150 days is the ESP motor's 0.821918; swapping the lead time and the days a year misstates the year.")

# 4
x("Why does the course anchor the insurance spares model to MIL-HDBK-338B?",
 "No public text read for the course prints a worked insurance-spares cost example, so the course ties the model's Poisson figure to the handbook",
 ["Caplice lecture 13 prints a worked insurance-spares cost table, and the handbook is used only to confirm its prices",
  "Silver, Pyke and Thomas print the one-for-one cost example, and the handbook stands in for it because it is shorter",
  "The handbook prints holding and downtime costs for its spare lamps, which the engine reproduces to the cent in every row of its table"],
 "The course states the one-for-one model as the engine's model and anchors its Poisson probability to the handbook's lamp example, because no public text it read prints a worked cost example. Lecture 13 is cited for the Poisson loss function; Silver, Pyke and Thomas were not read; the handbook prints a probability and no costs.")

# 5
x("Which description of MIL-HDBK-338B matches the way the course names and uses it?",
 "Dated 1 October 1998, a US Department of Defense handbook in the public domain, quoted with its citation",
 ["Dated Fall 2006, licensed CC BY-NC-SA 4.0, and so cited by its section and slide numbers only",
  "Dated June 2018, licensed CC BY-NC-ND 4.0, and named only for the P-label sentence it carries",
  "Dated February 1913, read in a 1990 reprint whose typesetting is copyright, so it is not reproduced"],
 "MIL-HDBK-338B is dated 1 October 1998, is public domain (distribution A), and is quoted with its citation; it was read on 2026-09-27. Fall 2006 with CC BY-NC-SA 4.0 describes the MIT lectures; June 2018 with CC BY-NC-ND 4.0 is SPE-PRMS 2018; February 1913 and the 1990 reprint are Harris.")

# 6
x("With 4 ESP motor spares, which pair of probabilities does the engine's table print?",
 "No shortage 0.998413 and a fill rate of 0.990054",
 ["No shortage 0.990054 and a fill rate of 0.998413",
  "No shortage 0.990054 and a fill rate of 0.949374",
  "No shortage 0.998413 and a fill rate of 0.998413"],
 "With n spares the probability of no shortage is P(X <= n) and the fill rate is P(X <= n - 1): at four spares 0.998413 and 0.990054 (engine). Swapping them reverses the definitions; 0.990054 and 0.949374 are the row for three spares; the two measures differ by one row, so they do not agree.")

# 7
x("How does the engine define the fill rate of an insurance spare?",
 "P(X <= n - 1): the chance that a failure, when it comes, finds a spare",
 ["P(X <= n): the chance that n or fewer orders are outstanding at a random moment",
  "the fraction of cycles in which no unit is ever left waiting for a spare",
  "one less the expected units down divided by the failures a year that are stated"],
 "The rule reads fill rate P(X <= n - 1), the chance a failure finds a spare: a spare is waiting only if fewer than n orders are outstanding when the failure comes. P(X <= n) is the probability of no shortage; a share of cycles is a cycle service measure; no ratio of units down to failures enters the rule.")

# 8
x("In the ESP motor table the fill rate with 3 spares and the no-shortage probability with 2 spares both print as 0.949374. How are the two figures related?",
 "They are equal: the fill rate with n spares is the no-shortage probability with one spare fewer, row by row",
 ["They print alike at six decimals only, and the course keeps them apart as two different figures",
  "They agree by chance on this motor's inputs, and on another stated mean they would part company",
  "They differ further out, because one is measured per failure and the other per moment of time"],
 "The engine returns the fill rate with n spares as the no-shortage probability with n less one, so the two are the same figure, row by row. Printed alike is not equal in general, and here the rule itself makes them equal; no choice of inputs separates them, whatever each one is said to measure.")

# 9
x("With no ESP motor spares held, what fill rate does the engine print?",
 "0.000000: every failure waits, since there is no spare to find",
 ["0.439588: the chance that no order is outstanding when a failure comes",
  "0.821918: the mean orders outstanding read in the place of a probability",
  "1.000000: with nothing on the shelf there is no stock left to run short"],
 "With no spares the fill rate P(X <= -1) is 0.000000 (engine): no failure can find a spare. 0.439588 is the probability of no shortage with no spares, the chance nothing is outstanding; 0.821918 is the mean, and no probability; an empty shelf short on every failure has a fill rate of none at all.")

# 10
x("On the empty shelf, how many ESP motors does the engine expect to be down on average?",
 "0.821918, the mean orders outstanding, every one of them a unit down",
 ["0.439588, the probability that no order is outstanding at a random moment",
  "0.261506, the figure the table prints on the row for one spare held",
  "1 unit, since a single failure leaves exactly one unit down at a time"],
 "Expected units down are E[(X - n)+], the orders outstanding beyond n; with n = 0 that is the mean, 0.821918 (engine). 0.439588 is a probability; 0.261506 belongs to one spare; the count of units down is Poisson, so its average is the mean and no fixed single unit.")

# 11
x("At the ESP motor's cheapest stock of 4 spares, what are the expected units down and the downtime cost a year they carry?",
 "0.001827 units down on average, priced at 12003.732064 a year",
 ["0.011773 units down on average, priced at 77347.405085 a year",
  "0.001827 units down on average, priced at 148000.000000 a year",
  "0.000240 units down on average, priced at 1577.882952 a year"],
 "The four-spare row prints 0.001827 expected units down and a downtime cost of 12003.732064 a year (engine). 0.011773 and 77347.405085 are the three-spare row; 148000.000000 is the four-spare holding cost; 0.000240 and 1577.882952 are the five-spare row.")

# 12
x("Working only from the printed columns of the ESP motor table, which step reproduces the expected units down with one spare, 0.261506?",
 "0.821918 less one less 0.439588, the loss at 0 less the chance of more than 0 outstanding",
 ["0.821918 times 0.439588, the mean scaled down by the probability of no shortage at 0 spares",
  "0.821918 less 0.439588, the probability taken straight from the mean at 0",
  "0.821918 less one less 0.800893, using the no-shortage figure of the same row"],
 "The loss recursion subtracts one less the cumulative probability at the level before: 0.821918 less (1 less 0.439588) gives 0.261506, within a unit of the sixth decimal of the engine's column. A product, a bare difference and the cumulative of the same row are not the recursion.")

# 13
x("A planner caps the ESP motor search at one spare. Which result comes back from the engine?",
 "1 spare, with a reason that says the search stopped at maxSpares 1, so a larger stock may cost less",
 ["A refusal naming maxSpares, since a limit below the mean's cheapest stock cannot be searched",
  "4 spares, since the engine widens its own search until the cheapest stock lies inside it",
  "1 spare, reported as the proven cheapest stock with the flag for the search limit left false"],
 "The search prices 0 and 1 only; the cheapest found sits on the limit, so the engine flags it and says a larger stock may cost less. That is a result with a reason, and no refusal. The engine never widens its own search, and the flag is raised because the answer sits on the limit.")

# 14
x("What does the engine say when the search limit for the ESP motor is stated as 1.5?",
 "maxSpares must be a whole number from 0 to 1000; got 1.5",
 ["maxSpares must be a whole number from 1 to 1000; got 1.5",
  "a result at 1 spare, the fraction 1.5 rounded down and flagged",
  "a result at 2 spares, the fraction rounded up"],
 "The search limit is a whole number from 0 to 1000, and a fraction is refused by name; the keyed message is the engine's own words. The lower end is 0, so a message starting the range at 1 is not the engine's, and the engine rounds no stated limit.")

# 15
x("Is a search limit of 0 accepted on the ESP motor case, and what is returned?",
 "A result that prices the empty shelf alone: 0 spares, total 5400000, the lowest for 0 to 0",
 ["A refusal, since a search limit of 0 leaves the engine nothing to search at all",
  "A result of 0 spares with the reason saying a larger stock may cost less, flagged at the limit",
  "A result of 4 spares, the limit of 0 read as no limit on how far the engine searches"],
 "A limit of 0 is accepted, and the engine's reason, verbatim, is 0 spares: holding 0 a year against expected downtime 5400000, total 5400000, the lowest for 0 to 0. Zero is inside the range 0 to 1000, so there is no refusal, and a limit of 0 is read as stated; it opens no wider search.")

emit(Q, '/root/cat-wip-materials/banks/sc3a_m02.json', expect_n=15)
finish()
