import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Expert m06, What the Engine Does Not Compute. Keys are the engine's
# stated scope (its exports, its two imports, what it takes in place of what it
# leaves out and the course that owns each), its caps and their messages, and
# the order of its refusals; scratch/bank-advanced/witness.mjs re-runs every
# keyed message and export on the vendored engine. No key is a Monte Carlo
# figure and no capstone figure appears.

K = [1, 3, 0, 2, 0, 1, 3, 2, 1, 0, 2, 3, 0, 1, 3]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A planner wants the voyage plan to allow for waiting on weather and a sea state above a limit. What does the engine take in their place?",
 "One stated weather factor applied to the activities the call names",
 ["A wave-height series it reads from a forecast and turns into windows",
  "Weather windows it computes from the season and the vessel type",
  "A standard allowance it holds for each month of the rainy season"],
 "The engine computes no weather windows, wave heights or waiting on weather: it takes one stated factor on the stated activities, and fuel follows the time. It reads no forecast and holds no seasonal figure; the factor and the activities it slows are required inputs.")

# 2
x("A plan needs the hire rate of the PSV and the port fees at the supply base. Where does the engine leave those, and which course owns them?",
 "Outside the engine, which prices fuel alone; hire and contracts belong to the procurement course",
 ["Inside the fleet call, which multiplies the vessel-days by a stated day rate for each vessel",
  "Inside the shore base call, which prices each berth-hour of service at a stated port tariff",
  "Outside the engine, and the materials course prices them along with the spares on the deck"],
 "The engine takes a stated fuel price and nothing else in money: vessel hire, port fees and a contract for the vessel are the subject of Procurement, Tendering & Contracting. The fleet and base calls price nothing, and the materials course owns stock and spares.")

# 3
x("In the variability calculator, a planner suspects that stormy weeks are also the heavy-cargo weeks. What does the engine do about that?",
 "Nothing: it draws the weather and the demand independently, each from its stated triangular",
 ["Links them by a stated correlation input, drawn through the canonical sampler",
  "It fits a joint distribution to past Ekene weeks and draws both factors from it",
  "It draws the demand factor from the weather draw, so a storm raises the cargo"],
 "Each factor has its own uniform draw from the one mulberry32 stream, weather first, and no correlation is drawn between them. The engine fits no distribution to data. Correlation, fitting and distributions as a subject belong to the uncertainty course, which the course names once.")

# 4
x("A planner wants the fleet plan discounted to a present value over three years. What does the engine return?",
 "No discounting at all: it computes no NPV, which belongs to the cash flow course",
 ["A discounted fuel bill at a stated rate, the one money figure the engine carries",
  "An NPV computed by the engine's own discounting routine on the fuel cost alone",
  "A present value built from the vessel-days, discounted at the canonical rate"],
 "The engine discounts nothing and computes no NPV; its one money figure is the fuel bill at the stated price. Discounting, NPV and a cash flow belong to Petroleum Economics and Cash Flow, and no rate is held anywhere in the engine.")

# 5
x("Which course owns the stock levels, spares and reorder points of the cargo a supply vessel carries?",
 "The materials course, Materials, Spares & Inventory Management; this engine takes the cargo as stated",
 ["This course, whose fleet call keeps a reorder point for each bulk product on the vessel's tanks",
  "The contracts course, Contract & Supplier Management, which sets the reorder point of each item",
  "The procurement course, Procurement, Tendering & Contracting, through the vessel's charter terms"],
 "The engine takes stated cargo and demand; stock levels, spares and reorder points are the subject of Materials, Spares & Inventory Management. The contracts course owns supplier performance and contract management, and the procurement course owns hiring the vessel.")

# 6
x("The Ekene base is stated with 101 berths. What does the engine return, in its own words?",
 "berths must be a whole number from 1 to 100; got 101",
 ["A result on 100 berths, the cap applied and noted in the basis",
  "items has 101 entries; the cap is 100, the berth list overflowing",
  "A result on 101 berths with a note that the cap was passed"],
 "MAX_BERTHS is 100, and the target search stops there too. The engine refuses 101 by name, verbatim as the key shows; it trims nothing to the cap, and an \"entries\" message belongs to a list such as the installations or the item lines.")

# 7
x("A shore base call carries an unknown key queue and has no model stated. Which refusal does the engine return first?",
 "The unknown key queue, refused by name with the six keys the base reads; the missing model is refused after it",
 ["model must be one of \"M/M/c\", \"M/D/c\"; got nothing, the missing input taken first",
  "Both refusals in one message, the missing model and the unknown key, in the order typed",
  "A result on M/M/c with the queue key dropped, since the key names a queue model the engine can already run for the base"],
 "Every function checks its accepted keys before it reads an input, so the unknown key is refused first, naming queue and listing the six top-level keys a base call reads. Fix it, and the missing model is refused next. The engine returns one refusal at a time and runs nothing on a box it refuses.")

# 8
x("A deck plan call lists item lines whose quantities add to 2001 units. What does the engine return?",
 "items hold 2001 units in all; the cap is 2000",
 ["A plan of the first 2000 units, the last one listed as overflow",
  "items has 2001 entries; the cap is 500, the item-line cap",
  "items[0].quantity must be a whole number from 1 to 1000"],
 "MAX_UNITS is 2000: the item lines times their quantities may not pass it, and the engine refuses the call in its own words as the key shows. The 500 cap is on item lines and the 1000 cap on one line's quantity; neither is the limit this call breaks, and nothing is planned on a refused call.")

# 9
x("Why does the engine refuse 181819 draws on a Monte Carlo with 11 voyage sets, when 200000 draws are allowed on a milk run?",
 "Draws times voyage sets are capped at 2000000, since every draw sizes every set",
 ["200000 draws are allowed only on a milk run, and a dedicated route is capped at 181818",
  "Each voyage set needs its own seed, and the seeds run out after 181818 draws on 11 sets",
  "The cap of 200000 is shared out among the sets, leaving 181818 draws for the largest"],
 "Two caps work together: iterations up to 200000, and iterations times voyage sets up to 2000000. With 11 sets the most draws is 181818, and the engine says so, verbatim: \"iterations must be at most 181818 with 11 voyage sets (iterations x voyage sets is capped at 2000000); got 181819\". A milk run is one set, so the first cap binds there.")

# 10
x("Which two modules does the marine logistics engine import, and what else does it reach?",
 "lib/stats/stats.js and lib/conventions/percentile.js, and nothing else: no network call",
 ["lib/stats/stats.js alone, with its own percentile code written for the fleet summaries",
  "The cash flow engine for its npv and lib/stats for its sampler, and a weather service online",
  "lib/conventions/percentile.js and a vendored copy of the inventory engine for the spares"],
 "Its closure is two canonical files: lib/stats/stats.js, which gives it the seeded stream, the triangular inverse and the summaries, and lib/conventions/percentile.js, which gives it the exceedance sentence. Nothing else is imported, nothing goes over a network, and neither percentile code nor NPV lives in the engine.")

# 11
x("What shape does the engine return when it refuses a call?",
 "An object with error and field, the message starting with the name of the field it refuses",
 ["A thrown exception carrying a stack trace, which the calculator panel catches and prints",
  "A result object whose figures are all zero, with a reasons list naming the bad input",
  "Code numbers from a table of refusals, which the panel then looks up and translates"],
 "Every function returns either a result object or an object with error and field, where field names the input it refused and the message starts with that name and states the condition that failed. A refusal carries no figures; a result with a reason, such as a berth target no count meets, is a result.")

# 12
x("A base has a berth with a bigger crane, hoses that reach one quay only and a rig vessel that jumps the queue. How does the engine model those?",
 "It does not: the base is one queue of identical berths on the working-hour clock",
 ["Through berth-specific service rates, one stated for each berth in a list under service",
  "As a priority class for the rig vessel, served ahead of the others by a stated rule",
  "As a separate queue for each quay, the vessels routed by the stated hose reach"],
 "The engine knows no berth-specific cranes, shifts or priorities: it runs one queue with identical berths on the working-hour clock, under M/M/c or M/D/c. Each of those details makes a real base differ from both models, which is why a plan states the model and compares the two the engine offers.")

# 13
x("What is the Marine Logistics Planner, and does a learner need it to finish this course?",
 "The Suite app that runs this same engine file; the course is complete without it",
 ["A separate engine in the Suite whose figures differ, so the course checks both against each other",
  "The Suite app that grades the capstone, so each learner must open it to finish the course",
  "A panel inside the course that replaces the four calculators for Suite users"],
 "The Marine Logistics Planner, in the Suite's Midstream & Downstream module, runs the same engine file in six tabs on the same Ekene fixture. The course's own four calculator panels call the vendored engine, so every exercise and the capstone run without a Suite seat.")

# 14
x("A logistics plan quotes the Monte Carlo of the Ekene week. What must it state beside each sampled figure?",
 "Its seed and its draws, 20260927 and 20000 here, and that it is an estimate",
 ["Its tolerance, the band within which the capstone would accept it as a graded answer",
  "Its confidence interval, which the engine returns beside every percentile it prints",
  "The number of vessels only, since vessel-days are too noisy to quote from the draws"],
 "A Monte Carlo figure moves with its seed, so the plan quotes every one with its seed and draws and calls it an estimate; no sampled figure is graded, so none has a tolerance. The engine returns the mean, P90, P50, P10, min and max, and no confidence interval.")

# 15
x("A voyage plan needs fuel at a slower, cheaper speed. What does the engine take in place of a speed and fuel curve?",
 "A stated burn for each activity at the one stated speed, times the hours in it",
 ["A cubic law of speed built into the engine, scaling the burn at any speed typed",
  "The Skoko et al. burns held as the engine's standing figures for every vessel",
  "A curve fitted to past voyages of the stated vessel, read at the speed typed"],
 "The engine computes fuel as the hours in each activity times the stated tonnes an hour, at the one stated speed: no speed and fuel curve is in it. The Skoko et al. burns are a published check the engine reproduces, and every burn is a required input.")

emit(Q, '/root/cat-wip-marine/banks/sc4a_m06.json', expect_n=15)
finish()
