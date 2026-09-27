import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Professional final exam, forty-two questions across the six modules,
# seven a module. Every figure is quoted from digest.txt or returned by the
# vendored engine on the stated input (single-field edits verified by the
# writer's probe). The Ekene cluster is synthetic. Nothing here is taught above
# the Professional tier: no queue and no Monte Carlo. No capstone name, input or
# value appears.

# ---- m01 Demand over a Period ----

q(1, "Across the Ekene week, EKA draws 610.000000 t of deck cargo, EKJ 1100.000000 t, EKB 150.000000 t and EKF 240.000000 t. What deck weight demand does fleetSize give the milk run's one voyage set?",
 "2100.000000 t, all four stops summed into the set",
 ["1100.000000 t, the jack-up's share, the largest single customer",
  "2000.000000 t, the PSV's deck load, the most one voyage lifts",
  "635.000000 t, the deck weight of one planned voyage's cargo"],
 "A milk run is one voyage set serving every stop, so its period demand adds the stops: 610 plus 1100 plus 150 plus 240 tonnes. The jack-up is one stop. 2000.000000 t is the capacity the demand is divided by, and 635.000000 t belongs to a voyage plan's cargo.")

q(0, "After deck area's 3.100000, which demand ratio of the Ekene PSV milk run week comes next, and what does the gap tell a planner?",
 "Deadweight at 2.084143, a voyage below: deck demand moves the count first, and bulk has room",
 ["Deck load at 1.050000: the deck tonnes would take over the count at the first extra lift",
  "Tank water at 1.833333: any added water would push the week to a fifth voyage at once",
  "Tank mud at 1.000000: the mud tank is full, so it binds jointly with the deck area"],
 "The constraint table ranks deadweight second at 2.084143, a whole voyage below deck area. So a small rise in deck demand changes the voyages, and bulk has a wide margin before it matters. Deck load and tank water sit lower still. A ratio of 1.000000 is one full voyage of mud, far from driving a count of 4.")

q(2, "A planner restates barite's density on the Ekene PSV milk run week from 2.1 to 1 t a m3 and changes nothing else. Which demand ratio moves, and does the driver change?",
 "Only deadweight's ratio moves; deck area still drives the count",
 ["Deadweight's and tank barite's ratios move; tank barite now drives",
  "Every ratio moves, since density enters each capacity; the driver changes",
  "No ratio moves, since density is read only by a voyage plan's cargo"],
 "Density turns bulk cubic metres into tonnes, which only the deadweight demand uses. The barite tank ratio is cubic metres over cubic metres and stays at 0.800000. Deadweight falls further below deck area's 3.100000, so deck area still drives. fleetSize reads every stated density.")

q(3, "A lone installation states no demand and 0 visits, and the engine returns 0 voyages with the driver \"no demand\". A planner sets its minimum visits to 1. What comes back?",
 "1 voyage, with minimum visits named as what sets it",
 ["0 voyages, since a visit with no cargo is never sailed",
  "1 voyage, with \"no demand\" still printed as its driver",
  "A refusal, since visits need some demand to go with them"],
 "The voyages needed are the larger of the demand ratio and the visits, so one stated visit gives 1 voyage, and the engine names minimum visits because the visits are larger than a demand of nothing. \"no demand\" is kept for neither demand nor a visit. A visit with no cargo is a valid need.")

q(3, "Enlarge tank d from 100 m3 to 500 m3 for an installation whose 410 m3 of that product outweighed its 10.000000 m2 on a 100 m2 deck area capacity (0 visits, voyages up). What returns?",
 "1 voyage, still driven by tank d, whose ratio stays above the deck's tenth",
 ["1 voyage, now driven by deck area, since the tank stops limiting anything",
  "5 voyages, still driven by tank d, since the demand of 410 m3 is unchanged",
  "0 voyages, since one tank now holds all of the product the period needs"],
 "410 over 500 is under one voyage, and it is still the largest ratio against the deck's 10 over 100, so tank d is named and the count rounds up to 1. A driver is the largest ratio even when it is small. Any demand at all needs at least one voyage once rounded up.")

q(1, "An installation in a fleet call has no demand object at all. What does the engine return, in its own words?",
 "installations[0].demand must be an object { deckAreaM2, deckWeightT, bulk }; got nothing",
 ["installations[0].demand is not an accepted key; the accepted keys of installations[0] are id, name, cargo",
  "A fleet sized with that installation's demand read as zero, with a reason naming the missing object",
  "installations[0].minVisits must be a whole number from 0 to 1000; got nothing"],
 "Demand has no default, so a missing demand is refused by name. The engine never reads a missing input as zero. demand is an accepted key of an installation, and cargo is not; the visits message is the refusal for a missing minVisits.")

q(0, "A planner wants no minimum visits for one installation and leaves the input out. What does the engine do, and what should the planner write?",
 "It refuses the call as got nothing; the planner writes 0 to state no minimum",
 ["It reads the missing input as 0 and sizes the set on its demand ratio alone",
  "It reads the missing input as 1, one call a period, and names it as the driver",
  "It refuses the call; the planner writes a fraction such as 0.5 visits instead"],
 "Every input is required, so the engine refuses: installations[0].minVisits must be a whole number from 0 to 1000; got nothing. Writing 0 carries the decision in plain sight. The engine assumes no figure, and a fraction is refused as well, since visits are whole calls.")

# ---- m02 Voyages and Vessel-Days ----

q(1, "On the Ekene PSV milk run week, voyages rounded up, the weather factor of 1.2 is restated to act on port time as well as sailing and field. One voyage then takes 2.686364 days. What happens to the week?",
 "The count stays at 4 voyages and the week's vessel-days rise, each voyage being longer",
 ["The count rises to 5 voyages, because the added port time takes cargo space away from the deck",
  "The count and the vessel-days stay put, since port time lies outside fleet sizing",
  "The count falls to 3 voyages, since longer voyages carry more of the week's demand"],
 "Weather changes time and leaves the cargo alone, so the voyages stay at 4 by deck area. Each voyage is now 2.686364 days where it was 2.586364, so the vessel-days rise. Port time is part of every voyage's hours, and a longer voyage carries no more cargo.")

q(1, "For the same Ekene PSV milk run, \"up\" asks for 10.345455 vessel-days in the week and \"none\" for 8.017727. What does the difference between those two figures stand for?",
 "The price in time of sailing whole voyages inside one week",
 ["A rainy-season allowance that \"none\" leaves out of the voyage days",
  "Spare vessel-days that the fleet holds once its vessels are whole",
  "An error in the fractional rule, which drops a tenth of the cargo"],
 "Both rules use the same 2.586364-day voyage; only the voyage count differs, 4 against 3.100000. The gap is the fourth voyage's worth of time a single week must sail to carry the last tenth of demand. Weather is in both. Spare vessel-days come from the vessel rule, and the fractional rule carries all the demand on average.")

q(3, "Deck cargo of 0.3 m2 over a 0.1 m2 deck area capacity comes back from the binary arithmetic a hair below 3 voyages of demand. With \"up\", what count does the engine give?",
 "3, since the figure agrees with 3 to twelve significant digits",
 ["2, since the ratio falls a hair short of 3 in binary",
  "A hair under 3, since the ratio is kept exact",
  "4, since a ratio below 3 is rounded up past it"],
 "The engine compares counts at twelve significant digits, and the ratio agrees with 3 there, so three voyages of demand are 3. Dropping to 2 would leave a third of the cargo ashore. Rounding up returns a whole count, and the ceiling of a figure equal to 3 is 3.")

q(3, "Which of these changes leaves the vessel-days of a fleet result exactly where they were?",
 "A new fuel price a tonne, which moves the fuel cost only",
 ["A new port time a voyage, which lengthens every voyage",
  "A new route mode, which changes the voyage sets and their days",
  "A new voyage rule, which changes the voyages sailed"],
 "Vessel-days move with the voyage count, the voyage days and the route. Port hours lengthen each voyage, the route changes both the sets and their days, and the voyage rule changes the voyages. The fuel price multiplies tonnes into money and touches no time.")

q(2, "Why might a planner still choose dedicated voyages for the Ekene cluster, though they need 11.881818 vessel-days where the milk run needs 10.345455?",
 "Each installation is served on its own timing, and the last stop never waits for the first",
 ["Dedicated voyages burn less fuel in the week, since each sails a shorter distance",
  "Dedicated voyages need fewer vessels, since each voyage is shorter than a milk run",
  "The engine recommends dedicated voyages whenever minimum visits drive every set"],
 "A dedicated plan sends each installation its own vessel, so no stop waits behind others on the route. It is dearer in time and fuel: 85.461818 t against 79.505455. Both weeks round to 2 vessels on the PSV. The engine computes both and chooses neither; the planner states the route.")

q(0, "A planner trims a single-installation call's port hours from 200 to 12, the call whose one voyage had run past its vessel's 6.5-day week. How many vessels, and is a reason printed?",
 "The reason disappears and the fleet is 1 vessel",
 ["The reason stays, since the voyage count is unchanged",
  "The reason disappears and the fleet stays at 2 vessels",
  "A refusal, since the port hours changed by too much"],
 "With 12 port hours the voyage takes well under the 6.5 days a vessel has, so no reason is printed, and its vessel-days now fit one vessel, which rounds up to 1. The reason depends on voyage days alone. Any port time at or above 0 is accepted.")

q(0, "A deck demand of 300 square metres per period meets 100 m2 of deck area capacity, with the voyage rule \"up\". What count results?",
 "3, the exact ratio with nothing to round",
 ["4, since rounding up always adds a voyage",
  "3.000000, kept as the ratio for the planner",
  "2, since the last third is carried as spare"],
 "300 over 100 is exactly 3, and the ceiling of 3 is 3. Rounding up adds a voyage only when the twelve-digit ratio is above a whole number, as 300.001 over 100 is. The rule returns a whole count, and nothing of the demand is left over.")

# ---- m03 Vessels Required ----

q(1, "Which message comes back when a fleetSize box states no vessel rule at all?",
 "A refusal naming vesselRounding, a rule with three accepted values and none assumed",
 ["A fleet whose vessels are rounded up, the rule that never leaves a week short",
  "A fleet whose vessels are left as the fraction, since no rounding was asked for",
  "A refusal naming voyageRounding, since the two rounding rules share one input"],
 "The vessel rule is its own required input, and its refusal names vesselRounding with the values up, nearest and none. The engine chooses nothing for the planner, neither up nor the fraction. The voyage rule is a separate field with a separate message.")

q(3, "Keep the need at 10.345455 vessel-days on vessels available 6.5 days each, and let the vessel count stay fractional under \"none\". What comes back?",
 "1.591608 vessels, whose capacity equals the 10.345455 vessel-days needed",
 ["2 vessels, 2.654545 vessel-days spare and a fleet utilisation of 0.795804",
  "1 vessel, short by the part of the week that one vessel cannot cover",
  "1.591608 vessels, with the fraction's spare reported as 2.654545 vessel-days"],
 "\"none\" keeps the fraction, so the capacity is set equal to the need and the fleet runs at a utilisation of exactly 1.000000 by construction, with nothing spare or short. Two vessels with 2.654545 spare is the \"up\" result. \"none\" never rounds down to a short fleet.")

q(1, "On the Ekene PSV milk run week, vessels rounded up, a planner raises the available days from 6.5 to 7, the whole period. What happens to the vessel count?",
 "It stays at 2; only the fraction before rounding and the spare days move",
 ["It falls to 1, since 7 days a vessel cover the week's 10.345455 vessel-days",
  "It rises to 3, since a vessel that works all week needs a relief vessel",
  "A refusal, since available days must leave room for crew change in the week"],
 "10.345455 over 7 is still above one vessel, so \"up\" still gives 2, now with more spare time. One vessel supplies only 7 vessel-days. Available days equal to the period are accepted, and any allowance for crew change is the planner's to state.")

q(2, "Sized on dedicated voyages, the Ekene AHTS needs 11.433333 vessel-days and the PSV 11.881818. Which reading of the two weeks is right?",
 "The faster AHTS needs less time, yet burns more fuel: 98.880000 t against 85.461818 t",
 ["The AHTS needs less time and less fuel, so it wins on every line",
  "The AHTS sails fewer voyages, since its deck is smaller and the visits drive both plans",
  "The PSV needs less time, since its larger deck carries each week sooner"],
 "Both sail the same eight voyages, set by the visits, so speed separates them: the AHTS at 12 knots needs fewer vessel-days. It burns more tonnes an hour, so its fuel is higher. Deck size does not change a count that the visits set.")

q(3, "The same Ekene week on the AHTS milk run needs 5 voyages. What fuel for the period does the engine return, beside the PSV's 79.505455 t?",
 "119.400000 t, costing 103878.000000 at 870 a tonne",
 ["98.880000 t, costing 86025.600000 at the same 870 a tonne",
  "79.505455 t, since the demand is the same on both",
  "23.880000 t, the fuel of one AHTS milk run voyage"],
 "Five AHTS voyages at a heavier burn give 119.400000 t and 103878.000000. 98.880000 t is the AHTS on dedicated voyages. Fuel follows the voyages sailed and the vessel's burns, so equal demand does not mean equal fuel. 23.880000 t is one voyage.")

q(3, "The rainy-season PSV milk run week is resized with 3 available days a vessel and the nearest-vessel rule. What does the engine return?",
 "3 vessels and a reason that 9 vessel-days fall short of the need",
 ["4 vessels, since the nearest rule rounds up whenever a week would be short",
  "A refusal, since 3 days a vessel is shorter than one milk run voyage",
  "3 vessels with spare vessel-days, since the rule rounds to cover the need"],
 "The week's 10.345455 vessel-days over 3 days is closer to 3 vessels than to 4, and 3 vessels supply 9 vessel-days, so the engine returns the fleet with a shortfall reason. \"nearest\" rounds to the closer whole vessel, whatever the shortfall. A 2.586364-day voyage fits inside 3 days, so no reason about length appears.")

q(1, "A fleet result prints fuel and its cost. Where does the cost of hiring the vessels belong?",
 "With the procurement course; this engine prices fuel at the stated rate and holds no hire rate",
 ["Inside the fuel cost, which the engine raises by a stated hire factor for each vessel sailing",
  "In the spare vessel-days, which the engine prices at the fuel rate for an idle vessel",
  "Folded into the fleet utilisation, which the engine turns into a day rate over the period"],
 "The engine states a fuel price and no hire rate, port fee or contract: those belong to the procurement course, and discounting to the cash flow course. An idle vessel burns nothing in this engine, and utilisation is a ratio of vessel-days.")

# ---- m04 Deck Cargo and Footprints ----

q(2, "Aas, Halskau and Wallace (Maritime Economics & Logistics 11(3), 302-325, 2009, read as the accepted manuscript) are taught by concept only. Which idea of theirs does the deck plan build on?",
 "Offshore deck cargo is measured in square metres and set down side by side, unstacked",
 ["Measured in tonnes, with the footprint area checked only after the load is placed on deck",
  "Stacked two high on a supply vessel, so the deck plan halves every footprint",
  "Packed by the tightest fit, which is the optimum packing the paper requires"],
 "The engine takes the paper's idea by concept: deck cargo is square metres on an open deck, lifted off one unit at a time, so nothing is stacked and the plan is an area bound. Load is checked unit by unit with the area. The engine offers first-fit decreasing and first fit, and no optimum packing.")

q(2, "What does the usable fraction on a deck plan stand for, and where does a planner put experience of awkward cargo?",
 "Deck space no cargo can fill, such as the rail and the crane's landing area; a lower stated fraction",
 ["The share of the deck load the cargo may use; a lower deck load stated for awkward units",
  "A stacking allowance for units that can go two high; a higher fraction for such cargo",
  "A margin the engine keeps by itself; the planner leaves the input at its usual value"],
 "The usable area is the deck area times the stated fraction, which stands for the space round the rail, the crane's landing area and the lanes. A deck known to lose space to awkward cargo gets a lower fraction, stated. The fraction is area only, the plan stacks nothing, and the engine keeps no margin of its own.")

q(1, "What comes back when an item line of a deck plan is typed with a width of 0 m?",
 "A refusal naming items[0].widthM, since a width of 0 gives no footprint",
 ["A plan in which that line takes no deck area and rides every voyage",
  "A refusal naming items[0], since a line with a zero width is an unknown key",
  "A plan with the line listed as never fitting, since its footprint is zero"],
 "The width must be above 0, and the engine refuses the line by name with the value it got. It never plans a unit that takes no area. widthM is an accepted key of an item line. Never fitting is a result for a unit larger than the usable area or heavier than the deck load.")

q(2, "A deck plan's item lines add up to 2001 units. What does the engine return?",
 "items hold 2001 units in all; the cap is 2000",
 ["A plan of the first 2000 units, the last one as overflow",
  "items has 2001 entries; the cap is 500",
  "A plan of all 2001 units across the stated voyages"],
 "The units cap is 2000, and a plan over it is refused as a whole, naming the count. The engine never truncates a list. The item-line cap is 500 lines, a different limit with its own message.")

q(0, "A deck of 20 m2 at a usable fraction of 0.5 carries big (12.5 m2) and two small units; the engine lists big as never fitting and prints a bound of 1. A planner states the fraction as 1. What does the engine return?",
 "big fits, no unit is listed as never fitting, and the lower bound rises to 2",
 ["big still never fits, since its footprint was compared with the whole deck",
  "big fits, and the lower bound stays at 1, since the small units set it",
  "A refusal, since a usable fraction of 1 leaves no space round the rail"],
 "With 20 m2 usable, big's 12.5 m2 fits an empty voyage, so it counts in the bound: the carriable footprints now add to more than one deck, and the bound becomes 2. A never-fit unit is compared with the usable area. A fraction of 1 is accepted.")

q(2, "A unit named heavy weighs 10.5 t and the deck load is 10 t, so the engine lists it as never fitting. A planner restates the deck load as 10.5 t. What does the engine return?",
 "heavy is carried, since a fit at the deck load exactly is inclusive",
 ["heavy is still overflow, since the load must stay strictly below 10.5 t",
  "heavy is still listed as never fitting, since that list is fixed per unit",
  "A refusal, since a deck load equal to a unit's weight leaves no margin"],
 "The fit is inclusive: a weight at the deck load fits, so heavy goes on voyage 1 at a load utilisation of 1.000000 and the bound becomes 1. Never fitting is worked out afresh against the stated deck. The engine adds no margin to a stated load.")

q(2, "On the Ekene cargo packed onto a 300 t deck over 2 voyages, what does the engine return for voyage 2?",
 "36 units, 211.224400 m2 and a load utilisation of 0.718667",
 ["25 units, 404.505200 m2 and a load utilisation of 1.000000",
  "36 units, 211.224400 m2 and a load utilisation of 1.000000",
  "11 units, 16.500000 m2 and an area utilisation of 0.352041"],
 "Voyage 2 carries the 36 units left after voyage 1 filled its 300 t: 211.224400 m2 and 215.600000 t, an area utilisation of 0.352041 and a load utilisation of 0.718667. 25 units and 404.505200 m2 are voyage 1. 11 units and 16.500000 m2 are voyage 2 of the 2000 t deck.")

# ---- m05 First-Fit Decreasing ----

q(2, "Someone runs the deck calculator with its packing rule control set to \"not stated\". What does the engine do?",
 "It refuses by name, reporting that the rule got nothing",
 ["It packs by first-fit decreasing, the rule it assumes when none is given",
  "First fit in the booked order is used, as nothing asked for a sort",
  "Both rules are run, and the plan with fewer voyages is printed"],
 "A deck plan must state its rule; with none, the engine refuses: rule must be one of \"first-fit-decreasing-area\", \"first-fit\"; got nothing. It assumes neither rule, and it compares no two plans for the planner. A plan quotes its figures with the rule that made them.")

q(0, "When is \"first-fit\" in the booked order the rule a planner should state?",
 "When the booking order carries meaning, such as priority cargo or a loading sequence",
 ["When the cargo is large, since first fit always carries more area than a sort",
  "When the deck load binds, since first fit places the heaviest units first",
  "When the planner wants the fewest voyages, which first fit guarantees"],
 "First fit keeps the order the items were booked in, which is the point when that order means something. It carried less area than first-fit decreasing on the Ekene cargo, 580.629600 against 599.229600 m2. It sorts nothing by weight and guarantees no count.")

q(0, "How near to its deck load does the first voyage of the two-voyage Ekene first-fit decreasing plan come?",
 "Nowhere close: 499.600000 t on voyage 1 of a 2000 t load, while area fills",
 ["It binds on voyage 1, which is why the second voyage takes the last small units",
  "Tight on voyage 2, which carries the heaviest units after the sort",
  "At the limit on both, since first-fit decreasing loads by weight as well"],
 "Voyage 1 carries 599.229600 m2 of 600.000000 usable and only 499.600000 t of 2000 t, so area moves the later units to voyage 2. Voyage 2 carries the small units. The sort is by area, with weight used only to break ties.")

q(1, "Six-square-metre footprints b (two units at 1 t), a and c again tie, and now a and c both weigh 4 t. In what order does first-fit decreasing take them?",
 "a, c, b#1, b#2: a and c tie on area and weight, and the id puts a first",
 ["c, a, b#1, b#2: c was first before and keeps its place at the head",
  "b#1, b#2, a, c: the order in which the item lines were booked",
  "a, b#1, b#2, c: a leads the list, and c drops to the very end"],
 "a and c now tie on footprint and on weight, so the item id decides, a before c, and b's lighter units follow in number order. The earlier order rested on c's weight alone. The booked order is first fit's, and c still outweighs b.")

q(3, "Why does first-fit decreasing place the largest footprints before the small ones?",
 "A large unit needs a large clear space, which every voyage still offers early on",
 ["Large units are the heaviest, and the deck load is best spent while it is fresh",
  "Small units are loaded last at the base, so they must be packed last on deck",
  "Large units pay the most freight, so the rule gives them the earliest voyages"],
 "Early in the packing every voyage is empty, so a casing bundle or a basket finds room; small units are flexible and fill the gaps the large ones leave. Sorting is by area, and weight only breaks ties. The rule says nothing about loading sequence at the base or about freight.")

q(3, "A 10 m2 deck rated at 10 t, one voyage, first fit: a is 1 m2 and 9 t, b is 1 m2 and 2 t, and b overflows with the ending \"deck load stops it\". The planner states the deck load as 11 t. What does the engine return?",
 "b goes on voyage 1 beside a, bringing the load to the 11 t exactly",
 ["b still overflows, since a load that reaches 11 t leaves nothing spare",
  "b is carried on a second voyage, since the engine adds one for the rest",
  "b is listed as never fitting, since it failed on the first stated deck"],
 "At its turn b needs 2 t and 2 t is left, so the fit holds at the deck load exactly, which is inclusive, and both units ride voyage 1. The engine never adds a voyage and works each call afresh.")

q(2, "One overflow unit's reason names its footprint as larger than the usable deck area; another's names the room left at its turn. What does each call for?",
 "The first needs a different deck; the second needs another voyage",
 ["Both need another voyage, which the planner states in the voyages",
  "The first needs another voyage; the second a stronger deck load",
  "Both need a larger deck, since overflow always means the deck is small"],
 "A unit larger than the usable area, or heavier than the deck load, can never ride any voyage of that deck, so only a larger or stronger deck carries it. A unit stopped by the room left at its turn fits an empty voyage, so another voyage carries it. The engine writes the two reasons differently for that reason.")

# ---- m06 Published Packing Examples ----

q(0, "Packed at 60, every voyage of the Coffman, Garey and Johnson example (Wikipedia revision 1317275412) sums to exactly 60 square metres. What lets a voyage be filled to its last square metre?",
 "A fit is inclusive, so a unit that brings a voyage to exactly 60 still goes on",
 ["Each voyage's area is rounded to the capacity by the engine when the gap is small",
  "The list was chosen so that no unit is placed until its voyage has room to spare",
  "The usable fraction of 1 adds a margin that lets each voyage take one more unit"],
 "Each set adds to 60, and the engine's area check is inclusive at twelve digits, so the unit that fills a voyage exactly fits. The engine rounds no areas. A usable fraction of 1 makes the usable area equal to the deck area, with no margin added.")

q(3, "The ten footprints of that list add to exactly three decks of 60. What lower bound does the engine print at 60 and at 61, and why?",
 "3 at both, since the total footprint is more than two decks of either size",
 ["3 at 60 and 4 at 61, since the bound follows the voyages the stated rule uses",
  "3 at 60 and 2 at 61, since the larger deck lowers the area quotient",
  "4 at both, since first-fit decreasing needs 4 on one of the two decks"],
 "The bound is the total footprint over the usable area, rounded up. Three decks of 60 is more than two decks of 61, so both round up to 3. The bound depends only on the cargo and the deck; the rule's packing plays no part, which is why it can sit below the voyages used.")

q(0, "Coffman, Garey and Johnson's ten footprints, as the Wikipedia article (revision 1317275412) prints them, arrive booked largest first, 44 down to 6, on a deck of 60, and the call names first fit as its rule. What packing results?",
 "The very packing first-fit decreasing gives, three voyages set for set",
 ["The capacity 61 packing of four voyages, as if the deck were larger",
  "The smallest-first packing of four voyages, as if the list ran reversed",
  "A refusal, since first fit needs the items booked in an unsorted order"],
 "First fit takes the units as booked, and here the booking is already largest first, so each unit lands where first-fit decreasing puts it: {44,8,8}, {24,24,6,6}, {22,21,17}. The smallest-first packing needs the list reversed, and the four-set packing belongs to the larger deck.")

q(0, "At capacity 61, first-fit decreasing opens voyage 1 with {44,17}. Why could the 17 not join the 44 at capacity 60?",
 "44 and 17 make 61, which is above a usable area of 60",
 ["The 17 is sorted after the 8s, so it comes too late",
  "At 60 the 44 fills a voyage alone, so nothing can join it",
  "Each voyage is kept below the capacity by a unit"],
 "The pair adds to 61, one square metre over a deck of 60, so the 17 goes on to a later voyage and the 8s top up the 44. At 61 the pair fits exactly. The sort is largest first, so the 17 comes before the 8s, and the engine holds no margin below the capacity.")

q(2, "The Wikipedia article on first-fit decreasing (revision 1317275412) states Dosa's tight example as 11/9 of the optimum plus 6/9. With the text's optimum of 6 bins, what count does that give, and does the engine match it?",
 "8, and the engine packs the list into 8 voyages",
 ["7, and the engine packs the list into 7 voyages",
  "6, and the engine finds the optimum of 6",
  "9, and the engine packs the list into 9 voyages"],
 "Eleven ninths of 6 plus six ninths comes to exactly 8. The engine's first-fit decreasing packing uses 8 voyages, the tight worst case. The engine does not search for the optimum; its lower bound of 6 is the area bound, which here equals the text's optimum.")

q(0, "Which sources behind the packing examples did the course read directly?",
 "The Wikipedia article (revision 1317275412) only; Johnson (1973) and Dosa (2007) are taken as it cites them",
 ["Johnson's 1973 thesis and Dosa's 2007 paper, each read in full and cited by the page number of each figure",
  "Johnson's 1973 thesis alone, since the rule is his and the examples follow from it",
  "Dosa's 2007 paper alone, since the tight example is the only one that bounds the rule"],
 "Only the article was in hand, at one fixed revision, and the course is open about it: the first-fit decreasing rule and the tight example reach it through the article's own citations of Johnson and Dosa. Neither original was consulted, so neither is cited by page.")

q(1, "The Ekene deck cargo packed by first-fit decreasing onto 2 voyages uses 2 voyages, and its lower bound is 2. What can a planner conclude?",
 "The packing cannot be beaten: it already sits at the fewest voyages possible",
 ["A better rule might carry it on 1 voyage, as the bound is only an estimate",
  "The deck foreman should try a hand packing, since a gap to the bound remains",
  "The rule found the optimum, which the engine then prints as the bound"],
 "The lower bound is the fewest voyages any packing could use, so a packing that meets it cannot be beaten. The bound is a firm area and weight quotient. There is no gap here to look into. The bound is computed from the cargo before any rule runs, and the engine searches for no optimum.")

emit(Q, '/root/cat-wip-marine/banks/sc4i_exam.json', expect_n=42)
finish()
