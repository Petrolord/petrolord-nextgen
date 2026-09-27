import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Associate m04, Deck and Bulk Capacity.
# Sources: deck area by square metres, the usable fraction, deck load and
# deadweight with stated densities, one tank per product, and the tank and
# fraction refusals. Every keyed figure and message was re-run through the
# vendored engine (marine_engine.mjs) on the Ekene PSV and AHTS milk runs,
# the heavy-liquid golden and stated probes (the fraction set to 1).

q(0, "PSV Ekene Star states a deck area of 800 m2 and a usable deck fraction of 0.75. What deck area capacity does the engine return?",
 "600.000000 m2, the stated deck area of 800 m2 times the usable fraction of 0.75.",
 ["800.000000 m2, the whole stated deck, as the fraction trims only the deck load.",
  "412.5 m2, the capacity the engine gives the AHTS Ekene Tide's smaller deck at the same fraction.",
  "540.000000 m2, the deck cargo the Ekene milk run carries, which sets the deck it needs."],
 "The deck area capacity is the stated deck area times the stated usable fraction: 800 times 0.75 is 600.000000 m2. The fraction applies to the deck area only. 412.5 m2 is the AHTS's capacity from its 550 m2 deck, and 540.000000 m2 is the load on the PSV's deck.")

q(2, "A planner types 1.1 into the usable deck fraction control. What does the engine return?",
 "Refused by name, and the message reads: vessel.deckUsableFraction must be a number above 0 and at most 1; got 1.1",
 ["A plan with the fraction held at 1, the whole deck, and a note of the change printed in the reasons.",
  "A refusal naming vessel.deckAreaM2, since the fraction would claim more deck than the deck area states.",
  "A plan that reads the extra tenth as cargo stacked on the deck, so the capacity grows by a tenth."],
 "The usable fraction must be above 0 and at most 1, and 1.1 would claim more deck than the vessel has, so it is refused on vessel.deckUsableFraction with the value it got. The engine changes no stated input, the deck area is not at fault, and it stacks no cargo.")

q(1, "On the Ekene PSV milk run in the rainy season, the usable deck fraction is changed from 0.75 to 1 and nothing else. Which constraint does the engine name as binding?",
 "Deadweight, at 0.682857, now above the deck area's 540 of 800 m2 and the highest of all.",
 ["Deck area, still at 0.900000, since the fraction changes the capacity of no constraint the engine checks.",
  "Deck area, at 1.000000, since a usable fraction of 1 means the cargo fills the whole of the deck.",
  "None: the engine refuses the call, since the usable fraction must stay strictly below 1."],
 "A fraction of 1 is accepted and makes the deck area capacity the full 800 m2. Reading the utilisations, deck area's 540 of 800 m2 now sits just below the deadweight's 0.682857, so the deadweight is the highest, and the engine names it. 0.900000 was deck area's utilisation at 0.75, a fraction of 1 does not fill the deck, and 1 is inside the accepted range.")

q(3, "Which capacity constraints does the usable deck fraction reduce?",
 "The deck area alone; the deck load, the deadweight and the tanks are each a capacity stated in its own right.",
 ["Every constraint on the vessel, so the deck load, the deadweight and each tank are all cut to three quarters.",
  "The deck area and the deck load together, since both belong to the vessel's open after deck and neither to its tanks.",
  "The deadweight alone, as an allowance for the fuel, water and stores the vessel carries for itself."],
 "The engine's basis states the rule: deck area capacity is the deck area times the usable fraction. The deck load is stated in tonnes, the deadweight in tonnes and each tank in m3, each as a capacity the call states directly, so the fraction touches none of them.")

q(1, "On the Ekene milk run the deck cargo weighs 635.000000 t, and the PSV's deck load is stated at 2000 t. What utilisation does the engine return for the deck load?",
 "0.317500, the deck cargo's 635 t over the deck load of 2000 t, its own constraint.",
 ["0.900000, the deck area's utilisation, which the engine reports for the deck as a whole.",
  "0.682857, the deadweight's utilisation, since deck weight counts against the deadweight.",
  "0.620833, the utilisation of the water tank, the fullest of the six tanks on the voyage."],
 "Utilisation is load over capacity: 635 over 2000 is 0.317500. The deck fills by area long before it fills by weight here. 0.900000 is the deck area, 0.682857 the deadweight with the bulk added, and 0.620833 the water tank: each is its own constraint with its own utilisation.")

q(2, "On the Ekene milk run, 635.000000 t of deck cargo sails with diesel 460, water 745, mud 200, brine 85, cement 60 and barite 70 m3, at stated densities of 0.85, 1, 1.4, 1.2, 1.5 and 2.1 t a m3. What deadweight load does the engine return?",
 "2390.000000 t, the deck weight plus each bulk volume times its density.",
 ["635.000000 t, the deck cargo alone.",
  "3500.000000 t, the PSV's deadweight.",
  "2200 t, the cargo deadweight that the AHTS Ekene Tide states for the same cargo and route."],
 "The deadweight load is the deck weight plus every bulk m3 times its stated density, which the engine returns as 2390.000000 t, a utilisation of 0.682857 against 3500 t. Bulk counts against both its tank and the deadweight. 3500 and 2200 are the two vessels' capacities.")

q(0, "A small case states deck cargo of 5 m2 and 60 t on a deck of 50 m2 usable rated for 80 t, and 50 m3 of a product d at 2.9 t a m3 filling its 50 m3 tank, against a cargo deadweight of 200 t. What does the engine return?",
 "A deadweight load of 205.000000 t, overloaded at 1.025000, and returned with its reasons.",
 ["A refusal, since a density above 2.1 t a m3 lies outside the range of the products the engine accepts.",
  "A deadweight load of 60 t, since bulk carried in the tanks is left out of the cargo deadweight.",
  "A feasible plan at a deadweight utilisation of 1.000000, since 205 t is read as close enough to 200 t."],
 "The engine's reasons, verbatim: the binding constraint is deadweight: 205 t of 200 t (102.5%), and overloaded: deadweight needs 205 t against a capacity of 200 t. Any density above 0 is accepted, bulk counts in the deadweight, and a load five tonnes above its capacity is overloaded, with no rounding toward a fit.")

q(3, "What does the engine add to the cargo deadweight for stowage or for the vessel's own stores?",
 "Nothing: the cargo deadweight is the planner's net figure, with no stowage factor and no allowance added.",
 ["A stowage factor of 0.85, the usable share of carrying capacity that Skoko et al. apply to every vessel.",
  "A fixed allowance for the vessel's own fuel, water and stores, taken off the stated deadweight before any cargo is counted.",
  "The unused part of the deck, turned into tonnes at the density of the heaviest product on board."],
 "The engine applies no stowage factor and adds no allowance: every figure it needs is a stated density or a stated capacity. Skoko et al. use a usable share of 85% of carrying capacity, and the course names it as their choice, which enters a call only as a stated input. The engine converts no deck area into tonnes.")

q(2, "On the Ekene PSV milk run, which of the six tanks does the engine report as the fullest?",
 "The water tank, at 0.620833, still well below the deck area's 0.900000.",
 ["The diesel tank, at 0.575000, since diesel is the product the installations ask for most.",
  "The barite tank, at 0.280000, since barite is the densest of the six products carried.",
  "The mud tank, at 0.333333, the heaviest liquid."],
 "Each tank's utilisation is its load over its capacity: water is 745 of 1200 m3, 0.620833, the highest of the six. Diesel is 460 of 800, 0.575000. A tank's utilisation is a volume over a volume, so density plays no part in it; density enters the deadweight.")

q(0, "A vessel copied from another job states tanks for five of the six Ekene products and leaves mud out. What does the engine return?",
 "A refusal, in its own words: vessel.tanks.mud must be stated for every product (0 when the vessel has no tank for it); got nothing",
 ["The missing mud tank is read as unlimited, so the mud always fits without ever binding.",
  "A refusal, in its own words: vessel.tanks.mud must be above 0 to carry mud; got nothing",
  "Mud moved to the deck in portable tanks, using up deck area and deck load for the voyage."],
 "Every product needs a stated tank, stated as 0 when the vessel has none, and a missing tank is refused by name as unstated, whether or not any mud is loaded; the message about carrying mud belongs to a tank stated as 0. A missing tank read as no limit would let a plan carry mud the vessel has nowhere to put, and the engine moves no cargo from tanks to deck.")

q(1, "The vessel's tanks include one keyed methanol, and the call's products are diesel, water, mud, brine, cement and barite. What does the engine return?",
 "A refusal, in its own words: vessel.tanks.methanol is not a product id; the accepted keys of vessel.tanks are the product ids diesel, water, mud, brine, cement, barite",
 ["A plan that carries the methanol tank empty on every voyage and reports its utilisation as 0.000000 in the constraints table.",
  "A plan that adds methanol as a seventh product at the density of water, 1.000000 t a m3, and checks the tank against it.",
  "A refusal, in its own words: products[6].densityTPerM3 must be a finite number above 0; got nothing"],
 "A tank key must be one of the call's product ids, and a key the engine does not read is refused with the full list of accepted keys. The engine creates no product from a tank key and ignores no key silently. Methanol is not a product of this call, and the engine adds no seventh product, so it asks for nothing at products[6].")

q(3, "Cement and barite are stated with the kind dry. How does the engine treat them on a voyage?",
 "Like any product: a volume in m3 against its own tank, and a weight through its stated density into the deadweight.",
 ["As deck cargo in tonnes, since dry bulk travels in bags on the open deck of a supply vessel, checked against the deck load.",
  "Outside the deadweight, since dry bulk is weighed at the installation after it is blown across by air from the tanks.",
  "Against a single shared tank for all dry bulk, since cement and barite are pumped by air."],
 "Each product states its kind, liquid or dry, and the engine checks every tank the same way: a volume against its capacity, and a weight through the density into the deadweight. Bulk travels in segregated tanks, one product to a tank, so cement and barite each have their own, and neither goes on deck.")

q(0, "Why does the engine measure deck cargo as an area in square metres?",
 "Deck cargo sits side by side with nothing stacked, an idea taken by concept from Aas, Halskau and Wallace (2009).",
 ["Deck cargo is stacked two high on a supply vessel, so an area stands in for a volume at half its height.",
  "Skoko et al. print every vessel's deck capacity in square metres, and the engine reads that table.",
  "A unit's weight is unknown until the installation weighs it, so area is the only figure a plan can state."],
 "Containers and baskets are placed side by side and none is stacked, so two units of the same footprint need twice the deck; the engine stacks nothing. The course takes the idea from Aas, Halskau and Wallace by concept. The engine reads no table of vessels, and every deck cargo states its weight in tonnes as well as its area.")

q(2, "Loaded with the milk run's 540 m2 of deck cargo, how does deck area come out on the AHTS Ekene Tide, with its 550 m2 deck and a stated fraction of 0.75?",
 "A capacity of 412.5 m2, so deck area is overloaded at a utilisation of 1.309091.",
 ["A capacity of 550 m2, so the cargo fits.",
  "A capacity of 600.000000 m2, the same as the PSV, since the two vessels state the same fraction.",
  "A refusal for cargo larger than the deck."],
 "550 times 0.75 is 412.5 m2, so 540 m2 of cargo gives 1.309091, and the engine's reason says so: the binding constraint is deck area: 540 m2 of 412.5 m2 (130.909091%). The fraction applies to each vessel's own deck, and an overloaded voyage is a result with its reasons.")

q(1, "The engine checks deck cargo as an area bound. Which of these does it leave unchecked?",
 "Whether a unit's length fits across the deck, a clear lane for the crane, or the balance of the load.",
 ["Whether the deck cargo's weight stays within the deck load the vessel states in tonnes for its open after deck.",
  "Whether the deck cargo's footprint stays within the deck area times the usable fraction the vessel states.",
  "Whether each product's bulk volume stays within that product's own stated tank."],
 "The area bound compares the deck cargo's area with the usable deck and its weight with the deck load, and the tanks are checked product by product. It does not compare a length with the deck's width, keep a crane lane or balance the load: a cargo that fits by area can still fail on the real deck, and the deck crew's plan decides that.")

emit(Q, '/root/cat-wip-marine/banks/sc4b_m04.json', expect_n=15)
finish()
