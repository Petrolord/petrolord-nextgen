import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Expert m01, Insurance Spares. Every numeric or refusal key is a return of
# the vendored engine on a golden input (ins-ekene-esp-motor,
# ins-cheap-downtime-holds-none, ins-refuse-negative-downtime,
# ins-refuse-lead-time-zero, ins-refuse-days-missing, ins-refuse-failures-zero);
# scratch/bank-advanced/witness.mjs recomputes each keyed figure and message.
# The Ekene register is synthetic. No key is a Monte Carlo figure and no
# capstone figure appears.

K = [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 0, 2, 1, 3, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The ESP motor on the Ekene register states 2 failures a year, a lead time of 150 days and 365 days a year. What mean number of orders outstanding does the engine's insurance spares call return?",
 "0.821918, the failures a year times the lead time in days over the days a year",
 ["300, the failures a year times the lead time in days with no conversion to years",
  "0.439588, the probability that no replacement order is on its way at all",
  "0.261506, the expected units down once a single spare sits on the shelf"],
 "The one-for-one model makes the orders outstanding Poisson with a mean of failuresPerYear x leadTimeDays / daysPerYear: 2 times 150 over 365 is 0.821918 (engine). 300 forgets to turn days into a fraction of a year; 0.439588 is the probability of no shortage with no spares, the chance that nothing is outstanding; 0.261506 is the expected units down with one spare.")

# 2
x("Which picture does the engine's one-for-one insurance model draw of a failure?",
 "The failed unit takes a spare and one replacement order goes out, arriving one lead time later",
 ["The failed unit goes to a workshop, is repaired and returns to the shelf after a repair time",
  "Failures are pooled and replaced in one batch sized by the economic order quantity each year",
  "A spare is drawn only at the next stock review, and the order covers the whole review period"],
 "Each failure takes a spare and places exactly one order, which arrives after the stated lead time; that is what one for one means, and it makes the orders outstanding Poisson. A repair loop is a different model the course names and leaves out; batching by EOQ and ordering at a review belong to the ordered and stocked items of the lower tiers.")

# 3
x("Each ESP motor costs 185000 and the stated holding rate is 0.2. What holding cost does one more spare add each year in the engine's table?",
 "37000.000000 a year, the unit cost times the holding rate",
 ["185000.000000 a year, the whole unit cost charged again every year",
  "74000.000000 a year, which is the holding charge of the first two spares",
  "18000 a year, the one downtime cost a day that the register states"],
 "The holding charge is unitCost x holdingRate for each spare bought: 185000 times 0.2 is 37000.000000 a year, and the holding column rises by that step each row. 185000.000000 is the holding cost of five spares; 74000.000000 is that of two; 18000 is the downtime cost a day, a different input.")

# 4
x("With no spares on the shelf, what downtime cost a year does the engine return for the ESP motor at 18000 a day?",
 "5400000.000000, the mean units down times 365 days times 18000 a day",
 ["1718091.849237, the downtime the table prints once one spare is held back",
  "1755091.849237, the total cost a year at one spare, its holding included",
  "160003.732064, the lowest total cost a year anywhere in the whole search"],
 "With no spares every order outstanding is a unit down, so the expected units down are the mean 0.821918, and the engine prices them at daysPerYear x downtimeCostPerDay: 5400000.000000 a year. 1718091.849237 is the downtime with one spare; 1755091.849237 is the one-spare total; 160003.732064 is the cheapest total, at four spares.")

# 5
x("Searching 0 to 6 spares, which stock of ESP motors does the engine return as the cheapest, and at what total cost a year?",
 "4 spares, at a total cost of 160003.732064 a year",
 ["3 spares, at a total cost of 188347.405085 a year each",
  "6 spares, the most searched, at 222179.621332 a year",
  "5 spares, at a total cost of 186577.882952 a year, all in"],
 "The engine prices every number from 0 to 6 and takes the lowest total: 4 spares at 160003.732064 a year (engine), inside the search, so no limit flag is raised. Three spares cost 188347.405085 and five cost 186577.882952, both above it; six is the dearest of the upper rows at 222179.621332 and is not chosen for being the largest.")

# 6
x("Why is a fifth ESP motor spare not worth holding at the stated costs?",
 "It adds 37000.000000 of holding a year and saves only 10425.849112 of downtime",
 ["Its no-shortage probability of 0.999787 is above the 0.99 the engine aims for",
  "The engine stops at the first row whose fill rate reaches 0.99, which is the fourth",
  "Five spares would exceed the 2 failures a year more than twice over, and the model caps it"],
 "The marginal comparison is holding against the downtime saved: from four spares to five the downtime falls by 10425.849112 a year while the holding rises by 37000.000000, so the total rises. The engine aims at no probability and stops at no fill rate; it prices every row. No cap ties the spares to the failures a year.")

# 7
x("The same ESP motor case is run with a downtime cost of 100 a day. What does the engine's reason say?",
 "0 spares: holding 0 a year against expected downtime 30000, total 30000, the lowest for 0 to 6; one more spare adds 37000 of holding and saves 20455.05 of downtime",
 ["4 spares: holding 148000 a year against expected downtime 12003.73, total 160003.73, the lowest for 0 to 6; one more spare adds 37000 of holding and saves 10425.85 of downtime",
  "downtimeCostPerDay must be a finite number at or above 0; got 100, since a figure below the unit cost cannot be priced",
  "1 spare: holding 37000 a year against expected downtime 1718091.85, total 1755091.85, the lowest for 0 to 1; the search stopped at maxSpares 1"],
 "At 100 a day the first spare costs 37000 of holding and saves only 20455.05 of downtime, so the engine keeps none; its reason, verbatim, is the keyed one. The four-spare reason belongs to 18000 a day; 100 is a valid cost and draws no refusal; the one-spare reason belongs to a search limit of 1.")

# 8
x("A planner types a downtime cost of -1 a day into the ESP motor case. What does the engine return, in its own words?",
 "downtimeCostPerDay must be a finite number at or above 0; got -1",
 ["a result of 0 spares: negative waiting makes the empty shelf cheapest",
  "downtimeCostPerDay must be a finite number above 0; got -1",
  "a result of 6 spares, flagged at the search limit"],
 "A negative downtime cost would reward failure, so the engine refuses it by name, and the keyed message is its own words. It returns no result on a refused input. The refusal allows 0 (at or above 0), so a message demanding a figure above 0 is not the engine's.")

# 9
x("A supplier promises instant replacement, so a planner enters a lead time of 0 days for the ESP motor. How does the engine respond?",
 "It refuses the lead time by name, since an order that lands at once leaves nothing to size",
 ["a mean of 0 orders outstanding and 0 spares at no cost",
  "leadTimeDays must be at most 260.714285; got 0",
  "a one-row table: an instant replacement needs no search"],
 "A replacement that arrives the instant it is ordered leaves nothing outstanding, and the engine refuses the input in its own words: leadTimeDays must be a finite number above 0; got 0. It computes no mean and no table on a refused input. The message about 260.714285 is the cap on a lead time that is too long, which 0 is not.")

# 10
x("The ESP motor case is sent with daysPerYear left out. What happens?",
 "It is refused by name, since no input of the insurance call has a default",
 ["A 365 day year is assumed, and the same four spares come back as they did before",
  "The engine assumes a 360 day costing year and returns a slightly higher mean to match",
  "A mean of 300 orders outstanding, with the lead time read in years by the engine"],
 "Every input of the insurance call is stated with no default, and a missing one is refused by name, here in the engine's words daysPerYear must be a finite number above 0; got undefined. The engine assumes no year length of any kind, 365 or 360, and it never reinterprets the lead time.")

# 11
x("Which input of the ESP motor case does the engine convert from one unit into another?",
 "Only the lead time, from days into a fraction of a year, through the stated days a year",
 ["Failures a year, into failures a day, through a fixed calendar that the engine holds itself",
  "The downtime cost a day, into a cost a year, through a 360 day costing year the engine assumes",
  "The unit cost, into a cost a day, so that it can be compared with the downtime cost"],
 "The mean is failuresPerYear x leadTimeDays / daysPerYear: the stated days a year turn the lead time into years, and nothing else is converted. The engine holds no calendar of its own; it prices downtime with the stated daysPerYear; and holding is the unit cost times the holding rate a year.")

# 12
x("The insurance call returns a reading beside its rule. What does that reading state?",
 "each unit waiting for a spare is one unit down, costed at downtimeCostPerDay; the holding charge falls on all n spares bought",
 ["each failure costs downtimeCostPerDay once, however long it waits; the holding charge falls on the spares still on the shelf",
  "a unit waiting for a spare loses part of its production, costed at a stated share of downtimeCostPerDay a day",
  "the holding charge falls on the spares on the shelf only, and a spare in use while its order is outstanding costs nothing"],
 "The engine's reading, verbatim, is the keyed one: each waiting unit is one unit down for as long as it waits, and every spare bought carries the holding charge. A charge per failure event, a partial production loss and holding on shelf stock only are the alternatives a planner would have to state as a different model.")

# 13
x("A plant repairs its failed motors in a workshop. Which of these lies outside the engine's model?",
 "A repair loop, condemnation, multi-echelon stock and partial production loss",
 ["A holding charge that falls on every spare that has been bought for the unit",
  "The Poisson distribution of the orders outstanding at a random moment",
  "The downtime cost of one unit down for one day while it waits for a spare"],
 "The model holds no repair loop, no condemnation, no multi-echelon stock and no partial production loss; each is a different model and a different course. The holding charge, the Poisson orders outstanding and the downtime cost a day are the three pieces the model is built from.")

# 14
x("In this course, what does the phrase \"insurance spare\" mean?",
 "A spare sized by the stated one-for-one model at a stated failure rate, lead time and downtime cost",
 ["Any spare kept on the shelf just in case, whatever the reason it was bought or the model behind it",
  "Every spare of an item that the stated criticality policy places in class V, whatever its cost may be",
  "Any spare of an item ranked in class A by its annual usage value under the stated cut-offs and rule"],
 "The course legislates the term: an insurance spare is always of the stated one-for-one model. Everyday usage, a criticality class and an ABC class each say something about an item, and none of them sizes a spare.")

# 15
x("The engine returns 4 spares as the ESP motor's cheapest stock. Which reading of that answer does the course accept?",
 "It is the cheapest stock for the stated failure rate and costs, and it is quoted with those inputs",
 ["It is a forecast that four ESP motors will fail within the costing year across the pumped wells",
  "It is the stock the engine chose to meet a no-shortage probability of 0.998413 as its stated target",
  "It is an audit finding that the register's 1 motor on hand is short by 3 against the policy"],
 "A number of spares is the cheapest for the stated failure rate and costs, and none is a forecast of what will fail, a target it aimed at, or an audit of the register. The 0.998413 is a consequence of four spares; the 1 on hand is a separate fact the model does not read.")

emit(Q, '/root/cat-wip-materials/banks/sc3a_m01.json', expect_n=15)
finish()
