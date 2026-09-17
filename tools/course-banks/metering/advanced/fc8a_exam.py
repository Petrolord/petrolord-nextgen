import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Expert final exam, Metering, Control Valves & Storage.
# The tank: SECTIONS 25 to 32. 42 questions, and more than six of them need
# two modules at once. No verbatim engine string is used as a key here,
# because the module banks already examine those; nothing asks for the
# withheld vent capacity, and nothing compares the fire duty with the
# normal venting totals.

q(1, "A tank of this design is rebuilt one third larger in diameter and everything else about the service is held. Which of the tier's answers can be left alone?",
 "None of them, because the capacity, the breathing and the wetted shell all move with the geometry.",
 ["The venting, because the thermal rate in this package is stated per barrel of capacity and a rate per barrel is unchanged by a change of capacity.",
  "The losses, because the working loss is driven by the annual throughput of 484000.0000 bbl and a throughput is a commercial decision rather than a geometry.",
  "The shell, because the one-foot method works on the head of liquid and the head is set by the design liquid level rather than by the diameter."],
 "The capacity of 19608.4845 bbl carries the thermal terms, the shell carries the courses, and the wetted shell carries the fire duty.")

q(0, "Two heights are in play on this tank when a working capacity and a fire wetted area are computed. Which pair is it?",
 "The design liquid level of 34.600000 ft for the capacity, and an effective wetted height of 30.000000 ft for the area.",
 ["The shell height of 36.000000 ft for the capacity, and the design liquid level of 34.600000 ft for the area.",
  "The design liquid level for both, because both quantities are taken over the liquid the tank is designed to hold.",
  "The shell height for both, because a tank is built to its shell and a fire reaches whatever shell is there."],
 "The working capacity is the volume to the design liquid level, and the fire area is formed on a height the standard's own limit has already capped.")

q(2, "Both tank crossovers in this tier were found the same way. What do a gravity of 0.931727 and a draw rate of 1083.0319 bbl/hr have in common?",
 "Each was found by bisecting a word the engine returns, and each is a property of this tank at these conditions.",
 ["Each is a threshold the standard publishes, which the engine reproduces so a designer can see where the governing case changes.",
  "Each is the input at which two returned figures are exactly equal.",
  "Each is a limit above which the engine stops answering, in the way it stops claiming proportionality above a stated capacity."],
 "Nothing in the package publishes either figure. The shell returns a governing candidate and the venting returns a governing case, and a word that changes has a boundary in it.")

q(3, "On the course table, which course is the first whose required thickness stands above both of its own computed thicknesses?",
 "Course 2, at 0.187500 in against computed thicknesses of 0.163341 in and 0.166801 in.",
 ["Course 1, at 0.218926 in, which is the thickest course on the tank and the one the hydrostatic test decides.",
  "Course 3, at 0.187500 in, because course 2 still has a test thickness above the floor at the head it carries.",
  "Course 5, at 0.187500 in, because the floor only binds where both computed thicknesses have fallen near zero."],
 "From course 2 upward the stated minimum plate governs, and the engine returns that word on all four of those rows.")

q(1, "A reviewer asks for the fire duty on this tank set against its normal venting totals. What is the correct response?",
 "The engine refuses the comparison, because the two cannot be compared as vent capacities while the vent capacity is withheld.",
 ["Give the ratio of the fire duty to the total outbreathing, since one engine returns both.",
  "Convert the duty of 25892440.2513 Btu/hr into scfh of air and compare it with 25689.2574 scfh.",
  "Compare the two after applying the environment factor of 1.000000 to the duty, which puts both figures on the same uncredited basis."],
 "The duty is a heat input in Btu an hour and the venting totals are rates in scfh, and this package carries no relation between the two.")

q(0, "The losses module works on a vapour space volume of 12844.2382 ft3. How does that figure relate to the rest of the tier?",
 "It is the same cylinder as the capacity and the wetted shell, taken over the vapour space height rather than over the shell.",
 ["It is the difference between the nominal and the working capacity in cubic feet.",
  "It is the volume above the design liquid level at the moment the tank is full, which is what the standing loss relation breathes on.",
  "It is a volume the loss relations form from the throughput rather than the geometry."],
 "One geometry has now produced a capacity, a wetted area and a vapour space, which is why the three questions sit in one module.")

q(2, "A venting calculation and a loss calculation are run on this tank. Which stated input do the two share?",
 "Neither shares one: the venting takes rates in barrels an hour and the loss takes an annual throughput.",
 ["The fill rate of 2480.0000 bbl/hr, which the working loss takes as the rate the vapour space is displaced at.",
  "The nominal capacity of 19608.4845 bbl, which the standing loss breathes over.",
  "The draw rate of 640.0000 bbl/hr, which both the movement inbreathing and the working loss are formed from."],
 "The venting is driven by 2480.0000 bbl/hr and 640.0000 bbl/hr, and the loss by an annual throughput of 484000.0000 bbl.")

q(3, "The minimum shell plate thickness in force on this tank is 0.187500 in and four courses are decided by it. What does the register say about that figure?",
 "That the API 650 band table is not carried, so the minimum is a stated input and the result names the value in force.",
 ["That the band table is carried and read against the tank diameter, which is how a caller is spared supplying a minimum at all.",
  "That the figure is withheld by name, so a caller who needs a minimum has to take it from the standard directly.",
  "That the figure is the engine's own stated choice, as the thermal rate is."],
 "A stated input is a shared responsibility: the engine applies it faithfully and names it, and somebody still has to check the band for this diameter.")

q(0, "Which quantity on this tank is not read off the shell geometry at all?",
 "The true vapour pressure of 2.370000 psia, which is a property of the product rather than of the tank.",
 ["The vapour space volume of 12844.2382 ft3, formed out of the annual throughput.",
  "The wetted area of 5881.0614 ft2, which the fire case takes from the heat input band the tank lands in.",
  "The cross section of 3058.1520 ft2, which the engine forms from the design liquid level rather than the diameter."],
 "One geometry gives a capacity, a wetted area and a vapour space, and the vapour pressure is a product property the loss relations are handed.")

q(2, "A vapour recovery unit is quoted at 95.000000 percent on this tank. What does the engine report for it?",
 "73285.6759 lb/yr saved and 3857.1408 lb/yr remaining.",
 ["75599.9604 lb/yr saved and 1542.8563 lb/yr remaining, which is the row at the top of the customary band for such a unit.",
  "69428.5350 lb/yr saved and 7714.2817 lb/yr remaining, because a quoted efficiency is applied to the working half alone.",
  "57857.1125 lb/yr saved and 19285.7042 lb/yr remaining, because a recovery unit is credited against the standing half."],
 "A recovery unit is customarily credited with 90 to 98 percent, and the engine says those figures are equipment and operating questions rather than results.")

q(1, "The sweep returns 3980000.0000 Btu/hr at 199.0000 ft2 and 3998437.1717 Btu/hr at 200.0000 ft2. What has changed between the two rows?",
 "The band, from below 200 ft2 to 200 to 1000 ft2, so the two duties come out of two relations.",
 ["Nothing but the area, since the duty inside a band is a straight line through the origin and the band name is a label on it.",
  "The environment factor, which the engine lowers as the area rises so that a larger tank is not penalised twice over.",
  "The wetted height, which is recomputed at each area and is what moves the duty between two rows this close together."],
 "A banded relation is a place where a small change in an input moves which relation is being used, which is why the band name is returned.")

q(3, "One figure in the tank results is exact by definition and another is held at a limit the standard sets. Which pair is it?",
 "The cubic feet in a barrel at 5.614583333333333, and the effective wetted height at 30.000000 ft.",
 ["The barrels per foot of shell at 544.6801, and the stated minimum plate thickness at 0.187500 in.",
  "The cross section at 3058.1520 ft2, and the thermal rate of 1.000000 scfh of air per barrel of capacity.",
  "The nominal capacity at 19608.4845 bbl, and the environment factor at 1.000000 on a tank with no credit."],
 "The conversion is returned as ft3PerBbl so it can be checked, and the wetted height is capped because a flame does not reach higher in the standard's basis.")

q(0, "A product with a specific gravity of 0.850000 is proposed for this tank. Which condition decides the bottom course, and what thickness comes back?",
 "The hydrostatic test, at 0.218926 in.",
 ["The product design case, at 0.199723 in, because the design thickness at that gravity stands above the stated minimum plate thickness.",
  "The stated minimum plate thickness, at 0.187500 in, because a gravity below the crossover leaves both computed thicknesses under the floor.",
  "The hydrostatic test, at 0.199723 in, because the test thickness follows the product gravity up to the crossover at 0.931727."],
 "A gravity of 0.850000 is below the crossover of 0.931727, and the design thickness of 0.199723 in is below the test thickness of 0.218926 in.")

q(2, "A cold rainstorm arrives while this tank is being drawn down. Which way do the two mechanisms push?",
 "Both inward, the thermal term on the weather and the movement term on the falling level.",
 ["The thermal term inward and the movement term outward, which is what keeps the two directions close on a cold day.",
  "Both outward, because a cooling vapour space contracts and a falling level draws the roof space out behind it.",
  "The thermal term outward and the movement term inward, so the totals move together and the governing word does not change."],
 "That is the case the vacuum warning is written for, and on this tank the vacuum direction takes the case above a draw rate of 1083.0319 bbl/hr.")

q(1, "A product whose true vapour pressure is at or above atmospheric is submitted to the loss relations. What is useful about the engine's answer?",
 "It redirects as well as declining, by naming a pressure vessel or a refrigerated tank as the equipment the question needs.",
 ["It returns the working half and withholds the standing half, so a study can proceed on the part of the loss that is still defined.",
  "It reports the vapour pressure at which the expansion factor would recover.",
  "It converts the refusal into a warning above a stated throughput."],
 "A fixed-roof tank sits at very close to atmospheric pressure, and a product boiling at ambient will not sit quietly in one.")

q(3, "What would it take for this digest to print a row labelled a refusal under numbers from a call that actually succeeded?",
 "Nothing would print at all, because the file is not written if any label disagrees with its call.",
 ["A rebuild in another timezone, which is the drift the reproducibility check over five timezones and four locales exists to catch.",
  "A count whose tree and rule disagreed, which is the check that stands between a label and the evidence printed under it.",
  "An engine whose message had been reworded, since the pinned strings are what tie a labelled row to the call that produced it."],
 "A numeric sweep cannot see that defect, because every figure under the false sentence would be real engine output.")

q(0, "Which two things does the register call withheld by name, and what do they have in common?",
 "The straight run for two elbows in different planes and the fire vent capacity, and neither is graded anywhere in this course.",
 ["The minimum plate band table and the fire vent capacity, both noted on every call.",
  "The fire vent capacity and the turnover factor, and both are relations the package once carried and has since removed.",
  "The straight run for two elbows and the noise prediction, and both are answers the engine calls an indication rather than a figure."],
 "A withheld item is a question the engine will not answer at all, which is a different thing from a held item it works around.")

q(2, "This tank has a design liquid level of 34.600000 ft and a vapour space height of 4.200000 ft. What is each used for?",
 "The level sets the working capacity and the shell heads, and the vapour space height sets the volume the standing loss breathes on.",
 ["The level sets the working capacity and the vapour space height sets the effective wetted height the fire duty is formed on.",
  "The level sets the fire wetted area and the vapour space height sets the movement terms.",
  "The level sets the thermal terms through the capacity, and the vapour space height sets the working loss through the throughput."],
 "Two heights on one cylinder produce a capacity of 18845.9323 bbl and a vapour space of 12844.2382 ft3.")

q(1, "A lighter product is proposed for this tank and the required thickness of the bottom course does not move. What does that tell you?",
 "The water test is deciding the course, so the design thickness can fall without the required thickness following it.",
 ["The stated minimum plate thickness of 0.187500 in is deciding the course, which is why a change of product cannot move it.",
  "The product is above the crossover gravity of 0.931727, where the design case decides.",
  "The head has been held at 34.600000 ft, which fixes both computed thicknesses and leaves the required thickness where it was."],
 "A required thickness only starts to follow the product once the design case becomes the largest of the three candidates on that row.")

q(3, "Which row of the register covers the latitude factor and the insulation credit used in the venting?",
 "The row for the thermal venting table above the proportional limit, which is not carried or is stated.",
 ["The row for the API 650 minimum shell plate thickness band table, which covers every stated tank input the engine applies.",
  "The row for the turnover factor Kn, which covers every stated factor.",
  "The row for the relation that turns a fire duty into a required vent capacity, which is where the tank credits are registered."],
 "A tank above the stated limit is warned rather than silently extrapolated, and the credits beside it are the engine's own stated choices.")

q(0, "Why does the engine refuse a required vent capacity while it will extrapolate a thermal rate on a large tank and label it?",
 "Because the two plausible forms of the missing relation differ by a factor of about 24, and an undersized emergency vent looks exactly like a vent size.",
 ["Because the fire case has no published table at all, while the thermal case has one the package could carry if a caller supplied it.",
  "Because a fire duty is returned at four decimals and a vent capacity would have to be returned at six, which the package cannot justify.",
  "Because the extrapolation is inside the range of the relation and the vent conversion is outside it, which is the line the engine draws."],
 "A thermal rate labelled an extrapolation is a figure a designer will check. A vent capacity in a result field is one nobody checks by looking at it.")

q(2, "Which of the tank engine's refusals fires on a valid input that has left the range of the relations rather than on an impossible one?",
 "evaporativeLosses on a product that boils at ambient.",
 ["tankCapacity on a fill height below zero, which is a height a tank could never stand at and a volume that could never be held.",
  "movementVenting on a negative fill rate, which is a rate no pump can deliver and a displacement no vapour space can take.",
  "lossControl above a hundred percent, which is an efficiency no device can reach and a saving larger than the loss it acts on."],
 "Three refusals in this tier are three kinds: an impossible input, a valid input outside the relations, and a question the package cannot source.")

q(1, "What has to be printed beside a wetted area before a reviewer can audit it?",
 "The height it was formed on, because an area computed on the full liquid column would look just as defensible.",
 ["The band it falls in, because the relation the duty comes from is what decides the area the engine will accept.",
  "The environment factor, because a credit changes the area the fire is taken to act on before the duty is formed.",
  "The tank diameter, because no fire figure can be checked without the geometry."],
 "The engine returns an effective wetted height of 30.000000 ft beside an area of 5881.0614 ft2 for exactly that reason.")

q(3, "For a high volatility product the thermal outbreathing on this tank comes back as 19608.4845 scfh, which is also the capacity in barrels. Why are the two figures the same?",
 "The thermal rate is 1.000000 scfh of air per barrel of capacity, and the high volatility case carries the whole of it.",
 ["The high volatility case is capped at the capacity in barrels of the tank.",
  "The outbreathing is formed from the movement side and the fill rate happens to give the same figure on this tank at these rates.",
  "The engine returns the capacity in the outbreathing field whenever the product is high volatility, since no rate is claimed for it."],
 "One scfh of air per barrel at a latitude factor of 1.000000 turns a capacity of 19608.4845 bbl into a rate carrying the same digits.")

q(0, "A fire result is submitted with an environment factor above 1 on the grounds that the tank has no drainage at all. What happens?",
 "It is refused, because the factor is a credit lying between 0 and 1 and a factor above 1 would be a penalty the relation does not carry.",
 ["It is applied, and the duty rises above 25892440.2513 Btu/hr, which is how an exposed tank is handled in this relation.",
  "It is clamped to 1.000000 and the duty is returned with a note naming the value in force.",
  "It is accepted and the wetted area is raised instead, which moves the tank further into the band above 2800 ft2."],
 "The engine's sentence bounds the factor, and the relation printed with a credit of 0.300000 shows the direction a credit moves the duty in.")

q(2, "Three volumes are returned on this tank. Which of them belongs to the loss calculation rather than to the capacity result?",
 "The vapour space volume of 12844.2382 ft3.",
 ["The nominal capacity of 110093.4703 ft3, which is the volume the standing loss breathes over across a year of weather.",
  "The working capacity of 18845.9323 bbl, which is the volume the working loss is formed from through the annual throughput.",
  "The cross section of 3058.1520 ft2, which is a volume per foot of shell and is what the vapour space is measured against."],
 "It is the same cylinder taken over the vapour space height of 4.200000 ft, and the capacity result knows nothing about it.")

q(1, "Which pair of figures does the relation between this tank's two capacities carry, and in which order?",
 "The nominal at 19608.4845 bbl first and the working at 18845.9323 bbl second, with a difference of 762.5522 and a ratio of 1.040462.",
 ["The working first and the nominal second, which is why the difference of 762.5522 bbl is printed without a sign.",
  "The nominal in barrels and the nominal in cubic feet, which is the pair a reader checks the returned conversion against.",
  "The working capacity and the barrels per foot of shell, which is the pair that turns a gauge height into an inventory."],
 "Order matters on a relation line, because the difference and the ratio are both formed as the first value against the second.")

q(3, "Where the stated floor decides a course, what is the engine's message doing for the reader?",
 "It explains a thickness that stands above both computed conditions, which would otherwise look like an error in the relation.",
 ["It warns that the floor may be below the value the standard bands for this diameter.",
  "It records that the course was not evaluated at the test condition, since a test thickness below the floor is not computed at all.",
  "It reports the margin between the floor and the larger computed thickness."],
 "On course 4 the computed thicknesses are 0.061253 in and 0.062550 in and the required thickness is 0.187500 in, which needs a sentence beside it.")

q(0, "The heat input band on a tank is reported as above 2800 ft2. What does the band name give a reader that the duty alone does not?",
 "Which relation the duty came from, since the wetted area decides that and two duties either side of an edge sit on two different relations.",
 ["The margin to the next edge, so a reader can see how far the area would have to move before the duty changed.",
  "The environment factor in force, since the credit is applied within a band rather than to the duty as a whole.",
  "The wetted height the area was formed on, which is what a reviewer needs in order to audit the area itself."],
 "Without the band name, two duties either side of an edge look like two points on one curve.")

q(2, "What is the practical difference between the tank capacity refusal and the loss control refusal on a missing efficiency?",
 "One fires on an input that is present and impossible, and the other on an input that is absent and cannot be assumed.",
 ["One is raised by the engine and the other by the screen that calls it, which is why only the first carries a message of its own.",
  "One returns a null with a flag and the other a message with no flag.",
  "One is counted in the register of fifteen items and the other is not, because only an absent input reaches the register."],
 "A fill height below zero is impossible arithmetic, and an omitted control efficiency is unknown rather than zero.")

q(1, "Which two routes does the fire result name for getting a vent capacity, and what do they share?",
 "API 2000 against the heat input, or the vent manufacturer's certified capacity curve, and both start outside this package.",
 ["A rearrangement of the duty into scfh of air, or a vendor curve, and both start from the fire duty the engine returns.",
  "The band table in the standard, or a certified curve, and both start from the wetted area of 5881.0614 ft2.",
  "A calculated environment credit, or a certified curve, and both reduce the duty before a capacity is read against it."],
 "The refusal costs one step rather than the whole calculation, because the duty the standard's own relation needs is returned.")

q(3, "What distinguishes a returned word from a returned number in the tank results of this tier?",
 "A word cannot be interpolated, and it changes somewhere, which is what makes a boundary findable by asking the engine.",
 ["A word is a display value and a number is a result, so the two come off different parts of the calculation.",
  "A word carries no tolerance, so a course can grade a word where it cannot grade a number to the same precision.",
  "A word is stable under a change of input and a number is not, which is why a word is the safer thing to quote in a report."],
 "The shell returns a governing candidate, the venting returns a governing case and the fire calculation returns a heat input band.")

q(0, "Both of the tank engine's venting refusals come from one function. Which is it, and what are they?",
 "thermalVenting, at a latitude factor above what the package will apply and with no capacity supplied.",
 ["movementVenting, on a negative fill rate and on a draw rate above the crossover of 1083.0319 bbl/hr.",
  "thermalVenting, on a capacity above the stated proportional limit and on an insulation credit outside its range.",
  "fireVenting, on an environment factor above one and on a wetted height above the standard's own cap."],
 "movementVenting raises one refusal, on a negative fill rate, and fireVenting raises one, on an environment factor above one.")

q(3, "A screening report quotes the fire duty of 25892440.2513 Btu/hr under a column headed emergency vent capacity. Which rule of this tier does that break?",
 "Do not present the duty as though it were a vent capacity, because a datasheet field is read as the quantity its heading names.",
 ["Do not quote a figure at a precision above the class it belongs to.",
  "Do not quote a figure from one section beside a figure from another.",
  "Do not quote a figure the engine returns with a flag beside it."],
 "A duty is a heat input in Btu an hour and a vent is specified in scfh of air equivalent, and the relation between them is the one that is withheld.")

q(0, "What is the argument for an engine returning its components rather than only its totals, as this module's loss result does?",
 "A total can be reached by very different routes, and a component that is undefined disappears inside a sum.",
 ["A total cannot be checked against a golden case that carries components.",
  "A total is returned in one unit and the components in another, so a reader comparing them has to convert first.",
  "A total is what a tolerance is set around, so the components are what a course grades in its place."],
 "On a product that boils at ambient the working half still produces a number, and a reader seeing only the sum would never know the standing half was undefined.")

q(2, "A vent on this tank is being sized at the stated rates, and a colleague proposes the inward figure because inward failure is worse. What is wrong with the proposal?",
 "The engine returns pressure as the governing case at these rates, and the governing case is what the sizing step reads.",
 ["Nothing is wrong, since the inward total of 23201.8178 scfh is conservative.",
  "The inward total is not a sizing quantity at all, because a vacuum vent is sized on the draw rate rather than on a total in scfh.",
  "The two totals should be added, because a vent has to pass both directions and 25689.2574 scfh alone covers only one of them."],
 "The judgement about which failure is worse belongs to the draw rate the facility can reach, and the crossover of 1083.0319 bbl/hr is where that judgement is made.")

q(3, "Why does this course grade nothing that rests on the fifteen items in its register?",
 "Because each is something the package says it does not carry, does not cite or will not answer, so an answer would rest on a value with no clause beside it.",
 ["Because the register was written after the graded fields were chosen, so nothing in it could have reached them.",
  "Because every item in it belongs to the metering or the valve engine, and the tank engine carries everything the tank capstone needs.",
  "Because the items are all stated inputs, and a stated input cannot be graded when the caller is the one who supplied it."],
 "Two of the fifteen are outright refusals, and a capstone field resting on either of those could not be answered at all.")

q(0, "A vent supplier asks which figure on this tank their certified curve should be read against. What do you send them?",
 "The fire duty, and you say that the conversion into a capacity is the step this package does not carry.",
 ["The total outbreathing of 25689.2574 scfh, since a curve is published in scfh of air.",
  "The wetted area of 5881.0614 ft2, because a curve for an emergency vent is indexed on the area it is protecting.",
  "The nominal capacity of 19608.4845 bbl, because a vent is selected on tank size and the capacity is what the thermal side is keyed to."],
 "Everything up to the refusal is returned, and the duty is the input the standard's own relation needs.")

q(2, "Two tanks report the same annual loss and opposite splits between the standing and working halves. What follows?",
 "They are two different problems, because one family of equipment works on the vapour space and another on the displaced vapour.",
 ["They are the same problem at two throughputs, because the split follows the throughput and the total is what a control device acts on.",
  "One of the two results is wrong, because the split on a fixed-roof tank is a property of the relations rather than of the tank.",
  "The difference is a reporting question rather than an engineering one."],
 "On this tank the standing half is 3537.6108 lb/yr against a working half of 73605.2059 lb/yr, and the split is the first thing to read.")

q(1, "The engine says its thermal rate per barrel and its latitude factor are its own stated choices. What does a reader do with that?",
 "Write down which factors were applied and where each came from, because the relation is the easy half and the factors are what a reviewer challenges.",
 ["Replace them with values from the standard before quoting the result, since a stated factor cannot be used in a design calculation.",
  "Treat the inbreathing figure as an extrapolation, in the way a tank above the stated capacity limit is treated.",
  "Ask for the figures to be recomputed at a latitude factor the package will accept, since 1.000000 is the value it refuses above."],
 "The engine returns the rate at 1.000000 and the latitude factor at 1.000000 beside the answer so the basis travels with the figure.")

q(0, "fireVenting raises one refusal of its own in this course. On what input?",
 "An environment factor above one.",
 ["A wetted area above the top band edge of 2800.0000 ft2, where the relation the duty comes from stops being carried.",
  "A request for the vent capacity, which is the withheld figure and is therefore the refusal this function is counted for.",
  "A liquid column above the standard's own height cap, which the engine declines rather than silently limiting to 30.000000 ft."],
 "The withheld vent capacity is a null with a flag rather than an error key, and the refusal counted against this function is the factor bound.")

q(3, "Which of these figures would a learner be inventing rather than reading, on this tank?",
 "A required emergency vent capacity in scfh of air.",
 ["The effective wetted height of 30.000000 ft, since the cap is a limit in the standard rather than a returned quantity.",
  "The crossover draw rate of 1083.0319 bbl/hr, since it is found by search rather than returned by any single call.",
  "The barrels per foot of shell at 544.6801, since it is formed from the cross section rather than returned in its own right."],
 "The vent column comes back null at every wetted area, and the engine exports its refusal as a named constant so a screen cannot print a blank.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/advanced/fc8a_exam.json', expect_n=42)
finish()
