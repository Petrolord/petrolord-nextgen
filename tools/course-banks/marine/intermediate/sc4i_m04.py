import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Professional m04, Deck Cargo and Footprints.
# Every figure is quoted from digest.txt or returned by the vendored engine on
# the stated input (single-field edits verified by the writer's probe). The
# Ekene cluster is synthetic. No capstone name, input or value appears.

q(1, "The Ekene 20 ft offshore container is stated as 6.060000 m long, 2.440000 m wide and 12.000000 t. What footprint does the deck plan give one unit?",
 "14.786400 m2, its length of 6.060000 m times its width",
 ["12.000000 m2, its weight in tonnes read as an area",
  "6.060000 m2, the length alone, as the unit is loaded lengthwise",
  "7.295600 m2, the footprint of the 10 ft container on the same list"],
 "The footprint of a unit is its length times its width, 6.060000 by 2.440000, which is 14.786400 m2. The weight is checked against the deck load; it is no area. Length alone is no area, and 7.295600 m2 belongs to the smaller container.")

q(3, "The Ekene deck cargo books the casing joints as one item line, pipe-bundle, with a quantity of 2. How does the deck plan name its units?",
 "pipe-bundle#1 and pipe-bundle#2, the id, a # sign and the unit number",
 ["pipe-bundle for both, since the units of one line are identical cargo",
  "pipe-bundle-a and pipe-bundle-b, lettered in the order they were booked",
  "unit 60 and unit 61, numbered through the whole list of the 61 units"],
 "A line of one unit is named by its id; a line of several names each unit by the id, a # sign and its number, so each casing bundle can be traced in the packing order and in an overflow reason. Two units under one name could not be told apart.")

q(0, "The Ekene voyage of deck cargo is 61 units on the PSV Ekene Star's clear deck, 800 m2 at a usable fraction of 0.75 and a deck load of 2000 t. Which statement matches what the engine returns?",
 "Footprints total 615.729600 m2 against 600.000000 m2 usable, and the 515.600000 t sit far under the load",
 ["Footprints total 615.729600 m2 against 800 m2 of deck, so one voyage carries the whole list with room left",
  "Footprints total 600.000000 m2 exactly, a full deck, and the weight of 515.600000 t binds first",
  "Footprints total 515.600000 m2 against 600.000000 m2 usable, and the 615.729600 t are the limit"],
 "The engine returns 615.729600 m2 of footprint and 515.600000 t of weight. The usable area is 800 m2 times 0.75, 600.000000 m2, so the cargo is a little larger than one voyage by area and far lighter than the 2000 t deck load. The full 800 m2 is never usable at 0.75, and the two totals are area and weight in that order.")

q(2, "A planner adds \"heightM\": 1 to the first item line of a deck plan. What does the engine return?",
 "items[0].heightM is not an accepted key; the accepted keys of items[0] are id, name, lengthM, widthM, weightT, quantity",
 ["A plan that stacks the units two high where the height allows, and reports the stacked area on each voyage",
  "A plan computed as before, the height kept for the record and ignored by the area bound of the deck plan",
  "items[0].heightM must be a finite number above 0; got 1, because stacking is refused on an open deck"],
 "The deck plan reads an id, a name, a length, a width, a weight and a quantity, and refuses any other key by name with the list of accepted ones. The plan stacks nothing, so height has no use in it. A key is never kept and ignored, and 1 would be a valid number: the refusal is about the key.")

q(1, "When does a unit fit a voyage in the engine's deck plan?",
 "When the footprints and the weights on it, its own added, stay at or below the usable area and the deck load",
 ["When its own footprint is below the usable area, whatever is already on the voyage or however heavy the unit is",
  "When the footprints stay strictly below the usable area, with the deck load checked at the end of packing",
  "When it fits the deck's length and width as a shape, with a clear lane kept round it for the crane hook"],
 "A unit fits when two checks hold at once for that voyage, the area and the deck load, each counting what is already on it, both inclusive and both at twelve significant digits. The engine checks no shape and keeps no lane beyond the usable fraction, and the load is checked unit by unit as the packing proceeds.")

q(3, "The Ekene deck cargo is packed by first-fit decreasing onto 2 voyages of a deck rated at 300 t (usable area 600.000000 m2). The first voyage carries 25 units, 404.505200 m2 and 300.000000 t. What stopped it filling its area?",
 "The deck load: its load utilisation is 1.000000 with 0.674175 of the area used",
 ["The usable area: 404.505200 m2 is the most a 300 t deck lets the rule place on it",
  "The rule itself: first-fit decreasing moves on to voyage 2 after 25 units are placed",
  "The overflow of 36 units, which the engine then sends on to the next voyage stated"],
 "Weight reached the 300 t deck load, a load utilisation of 1.000000, while only 0.674175 of the usable area was used. The large units go first and carry most of the weight. The rule places each unit on the first voyage that holds it, with no count limit. The 36 units on voyage 2 are carried, so nothing overflows.")

q(0, "Take that light-deck packing and raise only the deck load from 300 t to 2000 t, 2 voyages, first-fit decreasing. What does the engine return for the two voyages?",
 "599.229600 m2 on voyage 1 and 16.500000 m2 on voyage 2, the plan of the Ekene cargo on two voyages",
 ["404.505200 m2 on voyage 1 and 211.224400 m2 on voyage 2, since area was never the limit on this deck",
  "615.729600 m2 on voyage 1 and nothing on voyage 2, since the stronger deck takes every unit at once",
  "600.000000 m2 on voyage 1, filled to the metre, and the rest of the footprints on voyage 2"],
 "With 2000 t the load cannot stop voyage 1 early, so area decides: 50 units and 599.229600 m2 go on the first voyage and 11 units, 16.500000 m2, on the second. The 300 t split was set by weight. 615.729600 m2 is more than the 600.000000 m2 usable, and the rule does not fill a deck to the metre when the next unit is too large.")

q(2, "Two units of 2.500000 m2 and 1.5 t each are packed onto one voyage whose usable area is 5.000000 m2 and whose deck load is 3 t. What does the engine return?",
 "Both units carried, an area utilisation of 1.000000 and no overflow",
 ["One unit carried and one overflow, since an exact fill is overflow",
  "Both units carried with a reason warning that the deck is overloaded",
  "A refusal, since the units leave no margin on area or on the load"],
 "The engine carries both: a unit that fills the deck exactly fits, a reading it states, with the fit checked inclusively at twelve digits. The alternative, an exact fill read as overflow, would leave one unit behind. Nothing is overloaded at the capacity, and a deck plan refuses bad inputs only; a tight fit is a result.")

q(1, "On that exact-fit case, a planner raises each unit's weight from 1.5 t to 1.6 t, leaving the 3 t deck load. What does the engine return?",
 "One unit carried, and the second is overflow with the ending \"deck load stops it\"",
 ["Both units carried, since the area still fits exactly and area decides a deck plan",
  "One unit carried, and the second is overflow with the ending \"usable area stops it\"",
  "Neither unit carried, and both are listed among the units no voyage can ever carry"],
 "Two units of 1.6 t would weigh more than 3 t, so the second finds enough area and too little deck load at its turn, and its reason ends \"deck load stops it\". Area alone never decides a fit. Each unit on its own fits an empty voyage, so neither is listed as never fitting.")

q(3, "The Ekene deck cargo has 615.729600 m2 of footprints and 515.600000 t of weight, every unit fits an empty voyage, the usable area is 600.000000 m2 and the deck load 2000 t. What lower bound on voyages does the engine print?",
 "2, the larger of the area quotient and the weight quotient, each rounded up",
 ["1, the weight quotient rounded up, since weight is the safer of the two quotients",
  "615.729600 over 600.000000, the area quotient kept as a fraction to be rounded",
  "3, the area quotient rounded up with one voyage added on top as a margin"],
 "The lower bound takes the footprints over the usable area and the weights over the deck load, rounds each up at twelve digits and keeps the larger: area gives 2, weight gives 1, so the bound is 2. The bound is a whole count and adds no margin. The weight quotient alone ignores the area that sets it.")

q(0, "A deck with 10 m2 of usable area holds items big (footprint 12.5 m2) and two small units that fit. The engine prints a lower bound of 1 voyage. What explains that count?",
 "The bound counts only units that fit an empty voyage, and big is listed apart as never fitting",
 ["The bound counts the units by number, and one unit in three is too large to be carried",
  "The bound rounds the total area down, so the part of big above the deck drops away",
  "The bound is set by the deck load, which the three units together never reach"],
 "The engine leaves any unit larger than the usable area out of the bound and lists it in neverFit: the two small units need 1 voyage, and the bound says 1. The bound is an area and weight quotient, rounded up, over the carriable units. Counting big would inflate the bound for units that could all ride on one voyage.")

q(2, "A deck plan holds one unit, heavy, of 10.5 t on a deck rated at 10 t. What does the engine print?",
 "The reason heavy is overflow: its weight 10.5 t is above the deck load 10 t, and a lower bound of 0",
 ["A refusal naming items[0].weightT, since no unit may be heavier than the stated deck load",
  "The reason heavy is overflow: at its turn the most left on any voyage was 10 t (short)",
  "A lower bound of 2, since 10.5 t over 10 t rounded up needs two voyages of the deck"],
 "A unit heavier than the deck load can never be carried, so the engine names it with that reason, lists it as never fitting and leaves it out of the bound. With no unit able to fit an empty voyage the bound is 0. It is overflow in a result. A weight cannot be split across voyages, so two voyages would not help.")

q(1, "On the Ekene deck cargo with 1 voyage stated, first-fit decreasing, 11 units overflow and the lower bound is 2. What does the planner learn from reading the two figures together?",
 "The stated voyage is too few for this cargo: no packing could carry it on fewer than 2",
 ["The rule packed badly, since a better rule would carry every unit on the one voyage stated",
  "The engine added a second voyage for the 11 units, and the lower bound then reports it",
  "The 11 units are too large for the deck and need a larger vessel to be carried"],
 "Overflow against the voyages stated says whether they are enough, and the bound says no packing can do it on fewer than 2. The engine never adds a voyage of its own accord. The 11 units each fit an empty voyage, so they need another voyage, and with 2 stated first-fit decreasing carries all 61 units.")

q(0, "Restate the Ekene deck at a usable fraction of 1, so 800 m2 is usable, and pack its cargo onto 1 voyage by first-fit decreasing. What comes back?",
 "All 61 units carried on the one voyage, no overflow, and a lower bound of 1",
 ["50 units carried and 11 overflow, since the rule packs the same units first",
  "All 61 units carried, and a lower bound of 2, since the bound counts the cargo",
  "A refusal, since a usable fraction of 1 leaves no room round the cargo rail"],
 "With 800 m2 usable, the 615.729600 m2 of footprints fit one voyage by area and the 515.600000 t fit the load, so every unit goes on and the bound, recomputed on the new usable area, is 1. A fraction of 1 is accepted; the planner states whatever the deck allows.")

q(3, "What does the engine return when a deck block carries the key \"stowageFactor\" set to 1, and what does that show about the area bound?",
 "A refusal naming deck.stowageFactor: no hidden allowance sits behind the stated usable fraction",
 ["A plan with every footprint scaled by the factor, since 1 leaves each footprint exactly as it was",
  "A plan that ignores the key, since a factor of 1 changes no footprint and needs no check",
  "A refusal naming deck.usableFraction, since the two inputs cannot be stated together"],
 "The engine refuses the key in its own words: deck.stowageFactor is not an accepted key; the accepted keys of deck are name, areaM2, usableFraction, loadT. The bound is area and weight only, with the usable fraction as the one stated allowance. Its value is never read, so a factor of 1 is refused all the same.")

emit(Q, '/root/cat-wip-marine/banks/sc4i_m04.json', expect_n=15)
finish()
