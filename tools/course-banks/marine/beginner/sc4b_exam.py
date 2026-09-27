import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Associate final exam, forty-two questions across the six modules, seven
# a module, each asked from an angle the module banks do not take.
# Every keyed figure and message was re-run through the vendored engine
# (marine_engine.mjs) on the Ekene fixture, the golden inputs and stated
# probes (the water tank cut to 745 m3, the brine tank at 0 with the jack-up's
# brine cleared, a speed and a key removed).

# ---- m01 Offshore supply as a system
q(2, "What is the largest weather factor the engine accepts, and where does that limit live?",
 "10, held as MAX_WEATHER_FACTOR in the engine's DEFAULTS; the smallest factor accepted is 1.",
 ["1.2, the rainy-season allowance of the Ekene fixture, which the engine treats as the worst weather it plans.",
  "50, the same cap as MAX_INSTALLATIONS, since both limits guard the size of one call to the engine.",
  "There is none: any finite factor above 1 is accepted, since the weather is always the planner's input."],
 "DEFAULTS holds the engine's caps and its tie rule, and MAX_WEATHER_FACTOR is 10; a factor of 10.5 is refused and so is 0.9. The Ekene 1.2 is one stated planning factor, and 50 is the cap on installations, a different limit.")

q(0, "A vessel box names its deck area with the key deckArea. What does the engine return?",
 "A refusal, in its own words: vessel.deckArea is not an accepted key; the accepted keys of vessel are name, speedKnots, deckAreaM2, deckUsableFraction, deckLoadT, deadweightT, tanks, fuelTPerHour",
 ["A plan that reads deckArea as the deck area in m2, since the engine matches a key it does not know to the nearest accepted key it has and plans on.",
  "A refusal, in its own words: vessel.deckAreaM2 must be a finite number above 0; got nothing",
  "A plan that sets deckArea aside and carries on, planning the deck with no area limit on the deck cargo at all."],
 "Every call checks its accepted keys first and refuses a key it does not read, at whatever level it sits, with the path and the full list of accepted keys. Because the unknown key is checked before any missing input, the refusal names deckArea. The engine guesses no key and drops none silently.")

q(3, "The Wikipedia article on first-fit decreasing, revision 1317275412, is licensed CC BY-SA 4.0. How does the course use it?",
 "It cites the rule and the examples by section and example, and pastes none of the article's wording.",
 ["It reproduces the article's paragraphs under the share-alike terms, crediting the article beside each lesson.",
  "It teaches the article by concept only, as it does a publisher's paper, without naming a revision at all.",
  "It leaves the article out, since a page that anyone can edit cannot be cited in a course."],
 "A CC BY-SA text is cited without pasting its wording, and the course names the revision because a living page changes over time. Concept-only use is for the publisher's paper. The article is cited, with its revision of 17 October 2025.")

q(1, "Why does the course name each source's edition and the date it was read?",
 "Notes are revised, a handbook stays in draft and a web page is edited, so a check can only be repeated against the same text.",
 ["The licence of each text runs out a set time after it is read, so the date shows the licence was still valid.",
  "The engine reads each source again whenever it runs, and the date tells it which copy of the text to load.",
  "Suite rules require the dates, and the Marine Logistics Planner prints them on its opening screen beside each figure it quotes from a source."],
 "A figure checked against one edition may not match the next, so naming the edition and the date read, 2026-09-27 for every text, lets anyone repeat the check. The engine carries its citations in its own words and reads no source at run time, and the dates are the course's own record.")

q(0, "Which three names does the engine's exported ACTIVITIES list hold?",
 "sailing, port and field, each with its own stated fuel burn and each open to the weather factor.",
 ["sailing, loading and standby, the three states a supply vessel's log records on a voyage.",
  "transit, alongside and waiting on weather, with the weather held apart as an activity of its own.",
  "sailing, port, field and standby, with standby burning fuel at the port rate unless stated."],
 "ACTIVITIES is sailing, port and field: the three kinds of time a voyage spends, each with its own burn, and the names weather.appliesTo may list. Standby is refused as an activity, and the engine models no waiting on weather; a planner states such time inside the port or field hours.")

q(3, "What does the basis block that comes back with every result give a learner?",
 "The rules the call applied and the source of each, in the engine's own words, to print beside the figures.",
 ["A list of the Suite screens where the same figures appear, so a learner can find them in the planner.",
  "The figures the engine filled in for any input the call left out, with the source of each one.",
  "A margin of error for each figure, taken from the rounding of the published tables."],
 "Every result carries a basis naming its rules and their sources, for example that sailing hours are the distance over the speed, citing Skoko et al. The engine fills in no missing input, since a call without one is refused, it prints no error margins, and the basis describes the call and no Suite screen.")

q(2, "Where does the Ekene cluster come from, as its own file declares?",
 "A stated script wrote it for this platform as SYNTHETIC data for the fictional Ekene field, block EK-11.",
 ["It is a sample of a real operator's supply records, released for teaching with the names removed.",
  "It is the worked example of Aas, Halskau and Wallace (2009), restated on four installations.",
  "A public dataset from an offshore regulator, licensed for reuse with credit to the regulator that published it for training."],
 "The file's own statement calls the data SYNTHETIC, for Petrolord's fictional teaching field, block EK-11, set in a fictional offshore cluster. It is nobody's operating record, it restates no paper's example, and no regulator published it.")

# ---- m02 Routes and voyage time
q(1, "On the rainy-season dedicated route, the EKA voyage takes 32.727273 hours. Which part of those hours does the weather allowance of 1.2 on sailing and field time leave as stated?",
 "The 12.000000 port hours at the base.",
 ["The 13.527273 sailing hours out and back.",
  "The 7.200000 field hours alongside EKA, since a dedicated voyage works one installation only.",
  "None of them: on a dedicated voyage the factor applies to every hour of the voyage."],
 "Only the named activities are multiplied, and the plan names sailing and field time, so port time stays at the stated 12.000000 hours. The sailing hours, 13.527273, and the field hours, 7.200000 from a stated 6, both carry the factor; a dedicated route reads the weather input exactly as a milk run does.")

q(3, "Of the four Ekene dedicated voyages in the rainy season, which takes the most days, and why?",
 "EKF, because it lies farthest from the base, at 95.000000 NM.",
 ["EKJ, because the jack-up's 8 field hours are the longest call in the cluster.",
  "EKA, because it is the first installation the milk run calls at.",
  "EKB, because the wellhead platform has the fewest field hours to fill."],
 "Every dedicated voyage pays the same 12 port hours, so distance decides most of the gap: EKF's 190.000000 NM out and back take 20.727273 sailing hours, for 1.613636 days. EKJ takes 1.518182 days, its longer field time not making up for its shorter distance, and EKA at 1.363636 and EKB at 1.372727 are the two shortest voyages.")

q(0, "A planner reverses the order of the Ekene milk run's stops, to EKF, EKB, EKJ, EKA. What must happen to the legs?",
 "They must be restated to match, since each leg is the distance from the point before it to the point after it.",
 ["Nothing: the engine re-sorts the stated legs to follow the new order of stops on its own.",
  "The engine reads the stated legs backwards whenever the stops are reversed, so they still fit.",
  "The engine refuses the reversed order, since it accepts only the order the fixture was written in."],
 "The engine reads the stops in the order stated and the legs in the same order, so it cannot know the distance from EKB to EKJ unless the call gives it. It re-sorts nothing and reverses nothing, and any order that names each stop once is accepted with its own legs.")

q(2, "The third leg of the Ekene milk run is typed as -12 NM. Which field does the engine's refusal name, and what does the leg have to be?",
 "route.legsNm[2], the third leg counted from 0, where any distance from 0 NM up is accepted.",
 ["The leg is read as 12 NM and the voyage planned, since a distance has no direction on a milk run.",
  "route.stops[2], the stop that the negative leg sails toward, which must then be restated.",
  "The leg is treated as 0 NM, the smallest distance the engine accepts, as if two stops shared one place."],
 "The engine's own words: route.legsNm[2] must be a finite number at or above 0; got -12. The list is counted from 0, so the third leg is route.legsNm[2]. The engine changes no stated figure to make it fit, and the stops are not at fault.")

q(1, "On a dedicated route, the first installation in the call states no distanceFromBaseNm. Which input does the refusal point the planner to?",
 "installations[0].distanceFromBaseNm, the distance the dedicated voyage sails out and back.",
 ["route.legsNm, since a dedicated route with a missing distance takes it from the legs as a milk run does.",
  "route.mode, since a dedicated route with a missing distance must have been meant as a milk run.",
  "No input: the engine sails the installation at 0 NM, as if it stood right beside the base."],
 "The engine's own words: installations[0].distanceFromBaseNm must be a finite number at or above 0; got nothing. A dedicated voyage sails each installation's stated distance out and back, and that distance is required with no assumed value. Legs are read only on a milk run, and the route mode is a stated input the engine does not second-guess.")

q(3, "A dedicated route box still carries the stops list from an earlier milk run. What happens?",
 "The stops list is refused by name, since only a milk run reads stops; a dedicated voyage sails to one installation and back.",
 ["The plan runs on the dedicated route and sets the unused stops aside without mentioning them anywhere in the result.",
  "The plan sails the stops as a milk run, since a stops list is taken to override the stated route mode.",
  "The refusal names route.legsNm, since a stops list without legs is incomplete on any route mode the engine plans."],
 "Each route mode reads its own inputs, and an input given to the mode that does not read it is refused by name, so nothing is set aside silently and nothing switches the mode. The engine's words begin: route.stops is read only when route.mode is \"milk-run\".")

q(2, "On the rainy-season Ekene milk run, which activity takes the most hours?",
 "Field time, at 27.600000 hours, more than the 22.472727 hours of sailing.",
 ["Sailing, at 22.472727 hours, since the vessel covers 206.000000 NM between the base and the stops.",
  "Port time, at 12.000000 hours, since loading at the base is the longest single task of a voyage.",
  "Sailing and field time equally, since the factor of 1.2 applies to both of them at once."],
 "With the factor on sailing and field time, field time is 27.600000 hours and sailing 22.472727, so the vessel spends more hours alongside the installations than sailing between them, as in a compact cluster. Port time is 12.000000 hours, and the same factor on two activities leaves their hours in the same proportion as their calm times.")

# ---- m03 Weather and fuel
q(0, "Why does the engine keep sailing, port and field time apart, where it could add them into one figure?",
 "Each activity has its own stated fuel burn, and each can be named on its own in the weather list.",
 ["Each activity is charged a different price a tonne, so the fuel bill needs them kept apart.",
  "Each is rounded to whole hours separately before the three are added into the total.",
  "Each is checked against its own capacity in hours, like the deck area and the tanks of a vessel are checked against theirs."],
 "Fuel is hours by activity times that activity's burn, and weather.appliesTo names which of the three the factor slows, so the engine needs the hours of each. The fuel price is one stated price, the engine rounds no hours, and an activity is a time with no capacity of its own.")

q(3, "The calm Ekene milk run (factor 1) burns 9.363636 t sailing, 0.360000 t in port and 6.900000 t at the field. At 870 a tonne, what does the engine return in all?",
 "16.623636 t of fuel, costing 14462.563636.",
 ["19.876364 t of fuel, costing 17292.436364, the plan with 1.2 on sailing and field time.",
  "19.948364 t, costing 17355.076364.",
  "16.623636 t, costing 17292.436364."],
 "The three fuels add to 16.623636 t, and at 870 a tonne that is 14462.563636. The rainy-season plans burn more because the factor adds hours, and a cost is always the tonnes of its own plan times the stated price.")

q(1, "Of sailing, port and field, where does the rainy-season PSV voyage round the Ekene stops burn the most tonnes?",
 "Sailing, 11.236364 t of the 19.876364 t, though field time takes more hours.",
 ["Field time, 8.280000 t, since the vessel spends more hours alongside than at sea.",
  "Port time, 0.360000 t, since the base's 12 hours come before any sailing.",
  "Sailing and field time equally, since the factor of 1.2 applies to both of them."],
 "Field time is the longest activity, 27.600000 hours against 22.472727 sailing, but it burns 0.3 t an hour against sailing's 0.5, so it burns 8.280000 t against 11.236364 t. Port burns 0.03 t an hour. Fuel is hours times each activity's own burn, so equal factors do not make equal fuel.")

q(2, "In the Skoko et al. Table 1 check, a PSV at 10 knots sails a dedicated voyage of 120 NM each way at a weather factor of 1. What sailing hours does the engine return, and which printed figure do they confirm?",
 "24.000000 hours for 240.000000 NM, the 240 NM a day Skoko et al. print for a PSV at its economic speed.",
 ["12.000000 hours for the voyage, since each 120 NM leg at 10 knots is sailed in half a day and the legs overlap in the table.",
  "24.000000 hours for 264.000000 NM, the distance Skoko et al. print for a PSV's day at sea.",
  "22.472727 hours, since a rainy-season factor of 1.2 is applied to the day's sailing before it is compared."],
 "240 NM at 10 knots is 24.000000 hours, a day of sailing, and Skoko et al. print 240 NM a day for a PSV (their Table 4). Each leg takes 12 hours, so the voyage takes 24, and the check states a factor of 1, so no allowance applies. 264 NM is the AHTS figure, which the engine confirms at 11 knots over 132 NM each way.")

q(0, "A planner raises the weather factor on sailing. Through what does the engine's fuel figure move?",
 "Only through the hours it adds: each extra hour burns at the stated rate of its activity.",
 ["It multiplies the burn rates as well as the hours, so fuel grows with the square of the factor.",
  "A fixed tonnage of fuel is added to each voyage for rough water, whatever the voyage's hours.",
  "It raises the fuel price a tonne in the rainy season, in proportion to the stated factor."],
 "The factor multiplies the time of the named activities; fuel is hours times the stated burn, so fuel rises only with those hours. The engine has no speed-cube law and no curve of fuel against weather, adds no fixed tonnage, and it leaves the stated price as it is.")

q(3, "Which features of the weather does the engine itself model?",
 "Only one stated factor on the stated activities; no weather window, wave height or waiting rule.",
 ["A weather window, opening and closing the voyage by the forecast for the stated season.",
  "Wave height, turned into a speed loss through a curve of speed against the sea state.",
  "Waiting on weather at an installation, added as standby hours whenever the factor exceeds 1."],
 "Aas, Halskau and Wallace describe weather limits on sailing and on loading at the installation, and the course takes that idea by concept in the simplest stated form: one factor on named time. A plan that needs windows, wave heights or waiting rules states them outside the engine and reflects them in the factor it chooses.")

q(1, "Skoko et al. print a daily distance of 264 NM for an AHTS. Which stated inputs, at a weather factor of 1, make the engine reproduce that figure?",
 "A speed of 11 knots over a dedicated voyage of 132 NM each way: 264.000000 NM in 24.000000 hours.",
 ["The AHTS Ekene Tide's stated 12 knots over a dedicated voyage of 120 NM each way, which is a day at sea.",
  "The PSV's 10 knots over a dedicated voyage of 132 NM each way, the economic speed the table names.",
  "A speed of 11 knots over 264 NM each way, one day out to the field and one day back again."],
 "The check states 11 knots and 132 NM out and 132 back: 264.000000 NM take 24.000000 hours, one day, the distance Table 4 prints for an AHTS. The Ekene AHTS's 12 knots is the fixture's own input, 10 knots is the PSV check, and 264 NM each way would be two days.")

# ---- m04 Deck and bulk capacity
q(0, "What deck area does the engine load for the Ekene PSV milk run, with 175, 215, 60 and 90 m2 of deck cargo at EKA, EKJ, EKB and EKF?",
 "540.000000 m2, the four installations' deck cargo added up.",
 ["600.000000 m2, the deck area capacity the cargo is checked against.",
  "215.000000 m2, the jack-up's cargo, the largest of the four on the route.",
  "175.000000 m2, the first stop's cargo, since the deck is unloaded stop by stop."],
 "A milk run carries every installation's cargo on one deck at once, so the load is 175 + 215 + 60 + 90 = 540.000000 m2 against the 600.000000 m2 capacity. The engine checks the whole voyage's load, so neither the largest nor the first installation alone is the load.")

q(2, "Completion brine goes only to the jack-up, which asks for 85 m3 a voyage. Loaded into the PSV's 400 m3 brine tank, what utilisation does it give?",
 "0.212500, the emptiest constraint on the voyage.",
 ["0.240000, the cement tank.",
  "0.280000, the barite tank.",
  "0.333333, the mud tank, 200 m3 against its 600 m3."],
 "85 over 400 is 0.212500, the lowest of the six tank utilisations and of every constraint on the voyage. The other three figures are the cement, barite and mud tanks, each its own constraint with its own utilisation.")

q(3, "A vessel is stated with a usable deck fraction of exactly 1. What does that say, and does the engine accept it?",
 "That every square metre of the stated deck can take cargo; 1 is the top of the accepted range, so it is accepted.",
 ["That no deck is lost to rails and walkways, which the engine refuses, since a usable fraction must stay below 1.",
  "That the deck is exactly full, so any deck cargo on the voyage is reported as overloaded on deck area.",
  "That the fraction is not stated, since 1 is the value the engine reads when no fraction is given."],
 "The usable fraction must be above 0 and at most 1, so 1 is accepted and the deck area capacity is the whole stated deck. The fraction scales a capacity and says nothing about the load, and the engine reads no fraction the call has not stated: a box without one is refused by name.")

q(1, "Why does the engine require a stated density for every product, with no assumed value?",
 "Treating brine or mud as water would understate the deadweight, so a voyage the vessel cannot carry could pass.",
 ["The density sets each tank's capacity in m3, so without it no tank could be checked at all.",
  "Fuel burn in port depends on it, since heavy products take longer to pump ashore.",
  "The density turns deck cargo from square metres into tonnes for the deck load check."],
 "Density turns a bulk volume into a weight in the deadweight. Tanks are stated in m3 and checked by volume, fuel burns are stated per activity, and deck cargo states its weight directly. A product's weight can be far from water's, so no single value can stand in for it.")

q(2, "The first product in the list is stated with a density of 0 t a m3. Which field is refused, and what must it be?",
 "products[0].densityTPerM3, which must be a finite number above 0.",
 ["The product's tank, since a product that weighs nothing cannot be held in a tank.",
  "Nothing is refused: the product simply adds no weight to the voyage's deadweight load.",
  "Nothing is refused: the engine uses the density of water, 1.000000 t a m3, and says so."],
 "The engine's own words: products[0].densityTPerM3 must be a finite number above 0; got 0. A density turns bulk volume into deadweight, so a weightless product would understate the load; the engine plans with none, substitutes no density of its own, and the tank is not at fault.")

q(0, "In the products list, the first product's kind is typed as gas. Which message comes back?",
 "A refusal, in the engine's own words: products[0].kind must be one of \"liquid\", \"dry\"; got \"gas\"",
 ["A plan that treats the gas as a liquid and checks it against its own tank by volume, as for diesel.",
  "A plan that puts the gas on deck in cylinders and adds their weight to the deck load check.",
  "A refusal, in the engine's own words: products[0].kind must be one of \"liquid\", \"dry\", \"deck\"; got \"gas\""],
 "Each product states its kind as liquid or dry, the only two kinds, and any other kind is refused by name, with the value it got in quotation marks. The engine reinterprets no kind and moves no product to the deck.")

q(3, "Which inputs does the engine's deadweight load depend on?",
 "The deck cargo's weight, every bulk volume and each product's stated density.",
 ["The deck area and the usable fraction, which set how much cargo the deck can take.",
  "The tank capacities, since a full tank is taken to be at its stated maximum weight.",
  "The fuel the voyage burns, since the vessel's own fuel is counted in its cargo deadweight."],
 "The deadweight load is the deck weight plus every bulk m3 times its density: 2390.000000 t on the Ekene milk run. It uses loads with no capacity in it, and the cargo deadweight is the planner's net figure, with no fuel or stores allowance.")

# ---- m05 The binding constraint
q(1, "In the reasons of an overloaded voyage, which line comes first?",
 "The binding constraint's line, with its load, capacity and percentage; the overloaded lines follow.",
 ["The first overloaded constraint in the stated order, with the binding line printed last.",
  "A summary line with the number of overloaded constraints on the voyage, then each constraint by name in the stated order.",
  "The refusal message for the fullest constraint, since an overload is reported as a refusal."],
 "On the AHTS milk run the reasons begin: the binding constraint is deck area: 540 m2 of 412.5 m2 (130.909091%), and then list overloaded: deck area, deadweight and tank water in turn. The engine prints no count line, and an overloaded voyage is a result.")

q(0, "The AHTS reason prints 130.909091% where the numeric field reads 1.309091. Why the difference?",
 "Inside a sentence the engine prints the utilisation as a percentage to six decimals, trailing zeros dropped; the field is the ratio itself.",
 ["The reason adds a margin for the weather factor, which the numeric field in the table leaves out, so the reason reads higher.",
  "The reason is rounded to the cent like money in a message, and the field is rounded to six decimals for the table.",
  "Different constraints: the reason's figure is the deadweight's, the field's is the deck area's, on the AHTS voyage."],
 "Both describe deck area: 540 m2 of 412.5 m2. The reason writes the ratio as a percentage, a computed figure with a % sign to six decimals, and the numeric field keeps the ratio at full precision, which the course quotes as 1.309091. No weather margin enters either figure.")

q(3, "On the rainy-season Ekene PSV milk run, the water tank is cut from 1200 to 745 m3 with nothing else changed. What does the engine return?",
 "Tank water binding at 1.000000 on a feasible voyage: 745 m3 fits a 745 m3 tank.",
 ["Deck area binding at 0.900000, since the tanks are checked after the deck in the stated order.",
  "Tank water binding at 1.000000, with the voyage marked as overloaded on the water tank.",
  "A refusal naming vessel.tanks.water, since the tank is cut to exactly the load it carries."],
 "745 m3 of water in a 745 m3 tank is a utilisation of 1.000000, above deck area's 0.900000, so the water tank binds. By the engine's stated reading a load exactly at capacity is feasible. The stated order matters only for a tie, and a tank above 0 is a valid capacity however full.")

q(2, "A planner states the PSV's brine tank as 0 and also clears the jack-up's brine, so no stop asks for any. What does the engine return?",
 "A feasible plan, with deck area binding at 0.900000, since no stop now asks for brine.",
 ["A refusal on vessel.tanks.brine, since a tank of 0 is refused whether or not it is used.",
  "A plan with tank brine binding, since an empty zero tank is the fullest possible constraint.",
  "A refusal naming the jack-up's cargo, since a drilling unit must always ask for brine."],
 "A zero tank is accepted when nothing is loaded into it, and its utilisation is reported as 0.000000. Only a load of that product is refused. Deck area stays the highest utilisation at 0.900000, and the engine sets no rule about what an installation must ask for.")

q(1, "A voyage's binding constraint sits at a utilisation of 0.500000. What does that say about the voyage?",
 "Every limit has room left; the binding one is simply where the room would run out first.",
 ["Half the voyage is overloaded, so half of its cargo must move to a second voyage.",
  "The voyage is short of cargo, which the engine reports among the reasons as grounds to cancel it.",
  "The binding constraint is legally required to stay at or below half of its stated capacity."],
 "Binding means the highest utilisation, and it does not mean full. At 0.500000 the fullest constraint is half used, so every constraint has room. The engine cancels no voyage for a light load, and binding carries no legal meaning in this course.")

q(0, "Of these four outcomes on a voyage plan, which one comes back as a refusal?",
 "A load of a product whose tank the vessel states as 0, with a stop asking for that product.",
 ["The same cargo on a smaller vessel, overloaded on deck area, deadweight and tank water.",
  "A deck area and a deck load that share the top utilisation, tied at twelve digits.",
  "A load of deck cargo exactly equal to the deck area capacity, at a utilisation of 1.000000."],
 "A load of a product with a zero tank is refused, because no voyage of that vessel can carry it. An overloaded voyage is a result with its reasons, a tie is settled by the stated order, and a load exactly at capacity is feasible.")

q(3, "Which figures of a voyage plan does an overload leave just as they would be if the cargo fitted?",
 "The hours, the days and the fuel with its cost, which do not depend on whether the cargo fits.",
 ["The utilisations, which the engine holds at 1.000000 for every overloaded constraint.",
  "Nothing: the engine recomputes the voyage without the cargo that does not fit.",
  "The binding constraint, which the engine keeps at the one it named before the cargo was added and the overload appeared."],
 "Time and fuel come from the route, the speeds, the hours and the burns, so the Ekene deck cargo doubled on the PSV still sails 62.072727 hours and burns 19.876364 t. The utilisations show the true ratios, 1.800000 for deck area there, and the engine removes no cargo.")

# ---- m06 Planning a voyage end to end
q(2, "Of the two Ekene vessels on the rainy-season milk run at 870 a tonne, whose fuel bill is higher, by the engine's figures?",
 "The AHTS's, at 20775.600000 against the PSV's 17292.436364.",
 ["The PSV's, at 17292.436364 against the AHTS's 14462.563636.",
  "The PSV's, since its voyage is the longer, 62.072727 hours against 60.200000.",
  "Neither: both bills are 17292.436364, since the price and the route are shared."],
 "The AHTS burns 23.880000 t, more an hour in every activity, and 23.880000 t at 870 is 20775.600000; the PSV burns 19.876364 t for 17292.436364. The longer voyage is the PSV's, yet the AHTS's higher burns outweigh its shorter hours. 14462.563636 is the PSV's calm bill.")

q(1, "On the Ekene PSV milk run, a colleague wants port time named in the rainy-season allowance too. What changes in the engine's result?",
 "Port hours rise to 14.400000 and the fuel cost to 17355.076364, while deck area still binds at 0.900000.",
 ["Port hours rise to 14.400000 and deck area's utilisation rises with them, to above 0.900000.",
  "Nothing changes, since the rainy-season allowance is already applied to every activity of the voyage by the plan.",
  "The fuel cost doubles, since port and field time now both carry the factor of 1.2, just as sailing time does."],
 "Naming port time multiplies the 12 port hours by 1.2, so the voyage takes 64.472727 hours and the fuel cost becomes 17355.076364, 62.640000 more. The cargo and capacities do not move, so deck area still binds at 0.900000. The Ekene plan names sailing and field only.")

q(3, "A vessel with no cement tank states its cement tank as 0. Which item of the pre-sailing checklist does that satisfy?",
 "Every product has a stated tank and density, with a tank of 0 where the vessel has none.",
 ["Feasibility of the voyage, since a tank of 0 can never be overloaded on any voyage it sails.",
  "The binding constraint is read off, since a tank of 0 is always the binding one on the voyage.",
  "The fuel and its cost are read with the price they rest on."],
 "The first checklist item asks for a stated tank for every product, 0 where there is none. It says nothing about feasibility: a load of cement into that tank is refused, and a zero tank carrying nothing reports 0.000000, so it never binds a voyage with any other load.")

q(0, "Which subject does this course hand to the materials course?",
 "The stock the cargo replenishes: spares, stock levels and reorder points.",
 ["Vessel hire, port fees and the contract for each vessel taken on charter.",
  "Discounting a stream of voyage costs back to a single present value.",
  "Supplier performance and the management of contracts."],
 "The engine takes stated cargo and demand, and stock levels, spares and reorder points belong to the materials course. Vessel hire and contracts are the procurement course's, discounting is the cash flow course's, and supplier performance is the contracts course's.")

q(2, "The fuel bill is the only cost the engine computes. Where does discounting a stream of such costs to a present value belong?",
 "The cash flow course: the engine discounts nothing and computes no NPV.",
 ["The procurement course, which prices each voyage's hire against its fuel bill.",
  "The uncertainty course, which draws the fuel price from a stated distribution.",
  "This course's Expert tier, which discounts each voyage's fuel at a stated rate."],
 "Discounting, NPV and cash flows belong to the cash flow course, and the engine discounts nothing at any tier. Procurement owns vessel hire and contracting, and the uncertainty course owns Monte Carlo as a subject.")

q(1, "A planner needs departure times, and an installation works cargo only in daylight. What does the engine offer?",
 "No clock times; the planner states longer field hours for daylight-only cargo work and names that in the plan.",
 ["Overnight holding by a daylight rule, at any installation stated as working days only.",
  "A departure time for each voyage, set by the engine from the port hours and the voyage's days.",
  "A refusal, since an installation that works in daylight only cannot be served on a milk run."],
 "A day in this course is a planning measure of 24 hours with no clock behind it, and the engine sets no departure time and no night holding. Where a plan needs them, it adds them to the stated hours: longer field hours for a daylight-only installation, stated and named in the plan.")

q(3, "Why does a rainy-season plan for the Ekene PSV milk run keep the same feasibility verdict as the calm plan?",
 "The factor multiplies time and fuel; loads and capacities, and so every utilisation, stay the same in both seasons.",
 ["The engine plans the capacities once in calm weather and copies the verdict to every season.",
  "The rainy-season factor lowers the usable deck fraction by just enough to cancel the extra hours.",
  "The factor of 1.2 is too small to change a verdict, where a larger factor would overload the deck."],
 "Weather changes the hours, the days and the fuel, and leaves the cargo where it is, so the verdict and the binding deck area at 0.900000 hold in both seasons. No factor, however large, changes a capacity, and the usable fraction is a stated input the weather does not touch.")

emit(Q, '/root/cat-wip-marine/banks/sc4b_exam.json', expect_n=42)
finish()
