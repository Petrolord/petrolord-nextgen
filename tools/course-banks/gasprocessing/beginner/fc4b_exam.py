import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Associate tier exam, 42 questions across the whole tier. Written from
# digest.txt Sections 1 to 8 and 18, which are the sections this tier owns.
# The exam reads across modules rather than re-asking any module bank: most
# items turn on WHICH number answers WHICH question, which is the tier thesis.

# --- what this engine conditions, and the three kinds of number -------------

q(2, "Which of these is a question this engine has no answer for at all?",
 "Whether the dried gas sits inside a hydrate margin at line conditions.",
 ["How wide the contactor the gas has to rise through against a falling liquid has to be.",
  "How far a let-down cools the gas that passes through it.",
  "What the regenerator costs to run on the gas it is given."],
 "A hydrate margin belongs to the Flow Assurance engine in the Production module. The other three are among the five questions this engine answers on one stream."),

q(2, "A figure in this module is a chart value that no first principle reaches. How does the doctrine in the module header say it must arrive?",
 "As an input with a default and its customary range named, where a reader can see it.",
 ["As a constant exported under a name and computed from the standard base this module fixes.",
  "As a value the published cases pin, so that changing it breaks a golden and the change is reviewed.",
  "As a figure the studio asks for on every call, with no default at all."],
 "Everything that is a design choice or a chart value is an input. Everything computable from first principles is computed. A number you can see is a number you can argue with."),

q(3, "The gallons in a cubic foot, 7.480519480519, is exact as 1728 cubic inches to the cubic foot over 231 to the gallon. Which kind of constant is it?",
 "Derived, so there is nothing separate to check.",
 ["Measured, so a ratio of the measurement over the export says the two agree.",
  "Declared, so pinning it is the whole of what a gate can offer.",
  "Published, so a golden built on a second source can check it."],
 "A derived constant is computed from something the module already exports or from an exact definition, and it cannot be wrong unless its parent is."),

q(1, "The amine gallons chain divides by a water density of 8.340000 lb a gallon. What standing does that figure have here?",
 "Declared, so it can be pinned under a name and nothing in this package can check it.",
 ["Derived, from the glycol density and the gallons in a cubic foot.",
  "Measured, out of an answer where the vaporization term stands alone.",
  "Published, and checked by the oracle through a second route in SI units."],
 "A declared constant is customary or read off a chart. Exporting it under a name makes a change to it a reviewed act, and that is the whole of what any gate in this repository can offer."),

q(3, "A dehydration call cannot answer. What reaches the studio, and what does the studio do to notice?",
 "An object with a named string on an error key, noticed by asking it for one property.",
 ["A thrown error, noticed by catching around the call.",
  "A null, noticed by comparing the return against it.",
  "A NaN, noticed by testing whether the number that came back is a finite one at all, rather than a hole."],
 "Nothing in this module throws, so the tab can print the refusal rather than falling over, and the refusal says what was wrong and what would fix it."),

q(3, "The Rankine offset of 459.670000 degR and the gas constant of 10.731600 are used throughout this module. Where are they exported from?",
 "The gas properties door of the package, rather than from this module.",
 ["The separator sizing module, which the contactor shares its K value with.",
  "This module's own declared constants, beside the Magnus three.",
  "The standard base, which both of them are derived from."],
 "They belong to the package rather than to this module, which reads them. The standard cubic feet a pound mole is what this module derives from the gas constant and its own base."),

q(1, "Why does this module export every constant it uses under a name?",
 "So a reader can point at the number rather than infer it from an answer.",
 ["So the published cases can vary each one of them in turn and record exactly what moved.",
  "So the studio can offer every one of them as a box on the page.",
  "So a gate can re-derive each one from the publication it came from."],
 "Naming a constant is what makes the difference between the three kinds visible at all, and it is what lets the digest measure four of them back out of return values."),

# --- how much water a gas carries -------------------------------------------

q(2, "At 1000.000000 psia the water content reads 12.144308 lb per MMscf at 60.000000 degF. What does it read at 140.000000 degF?",
 "137.866352 lb per MMscf.",
 ["8.096205 lb per MMscf.",
  "91.910902 lb a MMscf.",
  "229.777254 lb a MMscf."],
 "Down a column of that surface the content rises with the vapour pressure. The other three figures are the 1500 psia column at 60 and at 140 degF, and the 600 psia reading at 140 degF."),

q(0, "Three limits sit on the water answer. Which of them refuses rather than warning?",
 "The temperature band the vapour-pressure fit holds over.",
 ["The narrower band the Magnus coefficients were published over.",
  "The pressure above which ideal mixing understates the water.",
  "The customary circulation band the glycol loop is designed in."],
 "Outside the fit band the formula has no claim on the curve, so refusing is the only defensible thing to do. The other two answer and attach a note, and the circulation band is not on the water answer at all."),

q(0, "The module guards from -45 to 60 degC and the coefficients behind the fit were published from -40 to 50 degC. What is a reader holding inside the gap between the two upper figures?",
 "A flagged reading, which the engine returns with a note saying the fit is being extrapolated there.",
 ["A refusal, since the published band is the one the guard is written on.",
  "A clean reading, since the guard band is the one that decides whether a note is attached.",
  "A chart reading, since the note in that gap sends the reader to the McKetta-Wehe correction."],
 "Two bands with two different jobs. Outside the wider one the formula has no claim on the curve at all, which is why one of them refuses and the other only flags."),

q(0, "Which of these is refused by the water answer rather than warned about?",
 "A gas temperature of -600 degF.",
 ["A total pressure of 1500.000000 psia.",
  "A gas temperature of 122.000001 degF.",
  "A circulation ratio of 6.000000 gal per lb."],
 "A temperature below absolute zero is refused by name, and so is a pressure of zero. The other two answer with a note attached, and one of them is not on the water answer at all."),

q(3, "A reader divides the 253.889303 cell of the water surface by the 84.629768 cell and calls the result how the surface behaves with pressure. What is wrong with that?",
 "The course prints both cells and prints no ratio between them, so the comparison is one nothing in this engine computes.",
 ["The two cells sit at different temperatures, so the ratio describes the temperature direction instead.",
  "The ratio is right but incomplete, since it holds only at the two pressures those cells were read at.",
  "The cells are in lb per MMscf, so their ratio carries a unit that has to be divided out first."],
 "A number nobody computed reads exactly like one somebody did. What the table supports is the direction, which is that a tighter gas carries less water at every temperature in it."),

q(3, "At a fixed temperature the total pressure is raised. What happens to the water the gas can carry, and why?",
 "It falls, since pressure enters this method only underneath, as a divisor.",
 ["It falls, because the vapour pressure itself is pushed down by the compression.",
  "It rises, because a denser gas carries more water past the same point.",
  "It holds level, because the pressure cancels out again in the pound mole."],
 "Two independent handles, one on top and one underneath. Squeezing the gas spreads the same amount of water vapour through more molecules of gas, so the fraction falls."),

q(1, "Of the four published water cases, which condition carries the largest departure from the golden?",
 "65.000000 psia and 40.000000 degF, at 1.006379500.",
 ["500.000000 psia and 100.000000 degF, at 1.001865077.",
  "1000.000000 psia and 120.000000 degF, at 1.004159870.",
  "200.000000 psia and 60.000000 degF, at 1.002457408."],
 "All four sit near one rather than at one, because the golden uses a different published vapour-pressure equation. Two independent fits of one curve meeting inside their shared band is the result the check is after."),

# --- the water a unit takes out ---------------------------------------------

q(0, "At a spec of 2.000000 lb per MMscf, OBIAFU takes out 3189.9235 lb a day and circulates 7.088719 gpm. Which of those two figures would be unchanged by a move in the circulation ratio?",
 "The 3189.9235 lb a day.",
 ["The 7.088719 gpm.",
  "Both of them, since the ratio reaches neither.",
  "Neither of them, since the ratio reaches both."],
 "The same pounds still come out of the same gas whatever the ratio is. What the ratio moves is how many gallons carry them and what each gallon costs."),

q(1, "At 30.000000 MMscfd the removal is 1393.5114 lb a day, the circulation 3.096692 gpm and the duty per gallon 1815.8525 Btu. Which of the three carries the rate inside it?",
 "The removal and the circulation, and not the duty per gallon.",
 ["The removal alone, since the other two are loop figures.",
  "All three, since every figure below the load carries the rate.",
  "The circulation alone, since it is the only one quoted a minute."],
 "The rate enters at one multiplication and everything below that point scales with it. The duty per gallon reads 1815.8525 at every rate in the table."),

q(2, "Two rows of the circulation ratio table carry a warning, at 1.500000 and at 6.000000 gal per lb. What does the engine do on those rows?",
 "It answers, and says the ratio sits outside the customary 2.000000 to 5.000000 gal per lb.",
 ["It refuses, because a ratio outside the customary band is one the module will not size.",
  "It answers and clamps the ratio to the nearer edge of the band before using it.",
  "It answers only on the low row and refuses on the high one, where the loop runs dry."],
 "Both flagged rows carry full results beside the flag, 2302.8317 Btu a gallon at the low one and 1615.3317 at the high one. The flag is advisory and the figures are ordinary answers."),

q(0, "At 1.500000 gal per lb the overhead is 916.6667 Btu a gallon against a sensible term of 1386.1650. What does that pair of figures say about the loop?",
 "Each gallon is heavily loaded with water, so the overhead has climbed towards the sensible term.",
 ["The still is running hotter than the default, which is what lifts the overhead.",
  "The reflux ratio has been raised, since the reflux is charged inside the overhead.",
  "The loop is lightly loaded, since a low ratio means fewer gallons and less water in each."],
 "A low ratio means fewer gallons each carrying more water. The sensible term sits at 1386.1650 the length of that table because the temperature rise per gallon never changed."),

q(2, "At 2.000000 gal per lb the rich glycol returns at 94.138775510 weight percent and the engine adds no second sentence to its warning. Why not?",
 "The rich strength is still above the 90 the module accepts as a lean one.",
 ["The ratio is inside the customary band, so no warning of any kind is raised.",
  "The rich strength is not reported at that ratio, so nothing can be said about it.",
  "The second sentence is attached to the lean strength rather than to the ratio."],
 "At 2.000000 gal per lb the ratio is at the customary edge and the loop is intact at the rich end. At 1.000000 gal per lb the rich returns at 89.568932039 and the sentence appears."),

q(0, "A lean gallon carries 0.465000000 lb of water at 95.000000 weight percent and 0.009300000 lb at 99.900000. What is that table saying?",
 "A stronger lean solution arrives at the contactor carrying less water of its own.",
 ["A stronger lean solution picks up less water from the gas on its way down.",
  "A stronger lean solution returns rich at a lower strength, since it has further to fall.",
  "A stronger lean solution sets a tighter outlet spec on the gas leaving the contactor."],
 "A gallon of lean solution is not pure glycol, and at w weight percent it already carries water before it meets the gas. What it does not do is set the outlet spec, and the engine says so on every answer."),

q(1, "A lean strength of 90.000001000 weight percent is accepted and the rich glycol comes back at 87.074123 weight percent. What does that show?",
 "The strength guard is on the lean solution, and the rich end can still fall below the same limit.",
 ["The guard is inclusive at its lower edge, since a value that close to 90 was accepted.",
  "The rich strength is what the guard actually tests, one step after the lean is read.",
  "The loop is refused a step later, since a rich below 90 is not a dehydration loop."],
 "The lean band is exclusive at both edges and it is read on the lean solution as it enters the contactor. What the rich end comes back at is reported rather than guarded, which is why a lean just inside the band can return a rich well below it."),

# --- what the reboiler pays for ---------------------------------------------

q(1, "At a reflux ratio of 0.600000 the overhead is 550.0000 Btu a gallon and the total is 1936.1650. Which term did the reflux ratio not touch?",
 "The sensible term, which the still and the absorber fix between them.",
 ["The total, which moves only with the still temperature.",
  "The overhead, which is charged on the solvent rather than on the water.",
  "The duty an hour, which is charged on the gallons a day rather than on one."],
 "Everything in that table is charged on the water a gallon carries. Nothing in it is charged on the solvent, so 1386.1650 Btu a gallon reads the same on every row."),

q(3, "The still is moved to 360.000000 degF and the total becomes 1739.1275 Btu a gallon. Which term moved?",
 "The sensible term, to 1309.4400 Btu a gallon.",
 ["The overhead term, to 429.6875 Btu a gallon.",
  "Both terms, in proportion to the temperature rise.",
  "Neither term, since the total is charged separately."],
 "Only the rise moved, from a still at 375.000000 degF down to one at 360.000000. The other half of the duty reads 429.6875 Btu a gallon on every row of that table."),

q(2, "One of the two heat terms is charged on the solvent and the other on the water. Which is which, and what follows?",
 "The sensible term is charged on the solvent and the overhead on the water, so they answer to different inputs.",
 ["The sensible term is charged on the water and the overhead on the solvent, so the still temperature reaches the overhead.",
  "Both are charged on the solvent, and the water enters only through the gallons a day.",
  "Both are charged on the water, and the solvent enters only through the density."],
 "The sensible half follows the still temperature and the absorber temperature. The overhead half follows the circulation ratio and the reflux ratio, and neither cares much about the other."),

q(2, "The reboiler reads 0.664270 MMBtu an hour at a reflux ratio of 0.000000 and 0.697269 at 0.250000. What is the difference between the two?",
 "The heat the reboiler pays again on the water the still condenses and boils a second time.",
 ["The heat the condenser removes at the top of the column, now charged to the reboiler.",
  "The glycol the loop loses overhead when no reflux is run, priced as duty.",
  "The extra sensible heat the returning liquid needs to reach the still again."],
 "The reflux ratio adds its fraction of the water vaporization on top of itself. What it saves in glycol carryover is not a quantity this engine computes."),

q(1, "A reviewer proposes changing the 1100.000000 Btu a lb the still overhead is charged at. What can a gate do about the proposal?",
 "Pin the value, so that moving it is a reviewed act rather than a quiet edit.",
 ["Re-derive it from the standard base and refuse any value that disagrees with the result.",
  "Check it against the published TEG cases, which all three carry it.",
  "Measure it back out of the engine and refuse a ratio away from one."],
 "It is a declared value with no publication in this repository behind it. Measuring it back out of an answer shows the name and the number in use agree, which is a different claim from the value being right."),

q(1, "The sensible share of the OBIAFU duty is 0.763369. What is that figure for?",
 "It says which of the two halves this reboiler is mostly spending its firing on.",
 ["It is the fraction of the duty that moves when the circulation ratio moves.",
  "It is the share of the duty the published cases are able to check.",
  "It is the fraction of each gallon that reaches the still as liquid glycol."],
 "It is printed because a reader meets both halves and would otherwise form the comparison unaided. On OBIAFU most of the firing goes on getting glycol up to the still."),

q(1, "A loop at 1.500000 gal per lb costs 2302.8317 Btu a gallon and one at 6.000000 costs 1615.3317. Which of the two reboilers is the larger, and by what reading?",
 "The 6.000000 gal per lb loop, at 1.163008 against 0.414499 MMBtu an hour.",
 ["The 1.500000 gal per lb loop, since a gallon there costs more.",
  "Neither, since the duty an hour is the same once all the gallons are counted.",
  "The 1.500000 gal per lb loop, since both its heat terms are larger."],
 "A duty a gallon says what one gallon costs and nothing about how many gallons there are. Reading the cheaper gallon as the cheaper loop is the misreading this tier spends a module on."),

# --- a dehydration answer end to end ----------------------------------------

q(0, "Which lever moves the gallons a minute and the heat a gallon while leaving the water removed a day exactly where it was?",
 "The choice of how many gallons of glycol carry each pound of water.",
 ["The outlet spec on the gas.",
  "The gas rate in MMscfd.",
  "The gas temperature."],
 "The other three reach the load, and everything below the load moves with them. The ratio enters once the load already stands in pounds a day."),

q(1, "A duty an hour has risen while the duty a gallon has fallen, and the gas rate and the spec are unchanged. What moved?",
 "The circulation ratio, upwards.",
 ["The still temperature, raised.",
  "The reflux ratio, raised.",
  "The lean glycol strength, upwards."],
 "Raising the ratio adds gallons and lightens each one, so the two duty columns go in opposite directions down the same table. The still temperature and the reflux ratio raise both."),

q(0, "The third published TEG case reports 5135.0000, 8.914931, 2204.0250, 1.178924 and 457.5376. Which of those is what a gallon costs to regenerate?",
 "2204.0250 Btu a gallon.",
 ["8.914931, which is the gallons that cost is charged on.",
  "1.178924, which is the same cost as a firing rate.",
  "457.5376, which is what leaves through the still overhead."],
 "Five figures from one case and only one of them is charged on a gallon. The 8.914931 is the gallons a minute and the 1.178924 is the firing rate those gallons demand."),

q(3, "A check agrees with the engine whatever the engine does. What has it established?",
 "Nothing, because a check that restates what it is checking cannot fail.",
 ["That the engine reproduces, which is what a golden is for.",
  "That the arithmetic is faithful, though not that the inputs are right.",
  "That the two sides share a route, which is the strongest agreement available."],
 "Ask what the check would do if the answer were wrong. If the honest response is that it would agree anyway, the check is decoration. The mass columns of the TEG cases reach the same pounds through kilograms and cubic metres."),

q(3, "OBIAFU runs a lean glycol strength of 99.200000 weight percent. What does the engine report about the loop at that strength?",
 "A lean gallon carrying 0.074400000 lb of water already, and rich glycol returning at 95.975032510 weight percent.",
 ["A lean gallon carrying 0.312500000 lb of water at that point, and rich glycol returning at 95.975032510 weight percent.",
  "A dew point of 7.000000 lb per MMscf, which is the spec that strength can deliver.",
  "A rich strength of 99.200000 weight percent, since the lean figure is what the loop returns to."],
 "A gallon of lean solution is not pure glycol. The 0.312500000 lb is what the gallon picks up from the gas at this circulation ratio, which is a different quantity from the water it arrived carrying."),

q(3, "Two of the load a day, the circulation ratio and the gallons a minute always give the third. Which pair gives the ratio?",
 "The load a day and the gallons a minute.",
 ["The gallons a minute alone, read against the customary band.",
  "The load a day and the reboiler duty an hour.",
  "The gallons a minute and the duty a gallon."],
 "That is why a single quoted circulation says almost nothing on its own. The duty figures sit below the ratio in the chain and cannot be read back through it."),

q(2, "In what order does this course say a dehydration duty answer should be read?",
 "Read the duty a gallon first, the gallons a day next, and the hourly figure last.",
 ["The MMBtu an hour first, then the Btu a gallon, then the gallons a day.",
  "The gallons a day first, then the MMBtu an hour, and the Btu a gallon at the end.",
  "The MMBtu an hour alone, since the other two are inside it already."],
 "Ask whether the loop looks sensible, then whether the plant looks the right size. The hourly duty is the product of two judgements already made, which is why it is read last."),

# --- the associate reading --------------------------------------------------

q(1, "Of the six answers on the OBIAFU reading, which pair would read exactly the same at any gas rate whatever?",
 "The 53.450380 lb per MMscf and the 1815.8525 Btu a gallon.",
 ["The 2879.9235 lb a day and the 6.399830 gpm.",
  "The 9215.7553 gallons a day and the 0.697269 MMBtu an hour.",
  "The 3.192661 ft and the 74.065024 short tons a year."],
 "One is a property of the gas at its conditions and the other a property of the glycol loop. Three of the six are those two with the rate applied, and the last two come from outside the water chain."),

q(3, "The 74.065024 short tons of aromatics a year belongs to which calculation?",
 "A mole balance on what the glycol carries round the loop and out through the still overhead.",
 ["The loop water balance, which reports what a lean gallon carries.",
  "The vessel sizing, which is the other figure from outside the water chain.",
  "The reboiler duty, since the aromatics leave with the water it boils off."],
 "It is taught in a later tier. On the Associate reading it is recorded as a figure that did not come through any step of the water chain."),

q(2, "In the worked reading, which step is the first one that could not have been taken without a number somebody chose?",
 "The step that turns 2879.9235 lb a day into 9215.7553 gallons a day.",
 ["The step that turns a mole fraction of 0.001125908 into 53.450380 lb per MMscf.",
  "The step that turns 53.450380 lb per MMscf into a load of 46.450380 lb.",
  "The step that turns 46.450380 lb per MMscf into 2879.9235 lb a day."],
 "The content came from the conditions, the spec from a contract and the rate from the reservoir. The circulation ratio of 3.200000 gal per lb came from a person."),

q(0, "Which figure in the worked reading is measured back out of the engine rather than declared or derived?",
 "The 1440.000000000 minutes in a day.",
 ["The 9.300000 lb a gallon the glycol weighs.",
  "The 0.550000 Btu per lb per degF.",
  "The 0.250000 reflux ratio."],
 "It is the gallons a day over the gallons a minute of one call. The other three are values the caller supplies or the module declares, and no measurement inside the package reaches them."),

q(0, "What did the Associate tier never ask about the contactor?",
 "How the water actually leaves the gas inside it.",
 ["How wide it has to be at the conditions the gas arrives at.",
  "How much water it has to take out of the gas each day.",
  "What the solvent running down it costs to regenerate."],
 "This tier treated the column as a place where water leaves the gas. The next one asks how, and a device with stages in it turns out to carry a limit that this chain has nothing like."),

q(2, "UBIE reports 10666.2009 lbmol a day and OBIAFU reports 6.399830 gpm. What is the difference between the two questions those figures answer?",
 "One is how much acid gas has to be picked up, and the other how much solvent has to move.",
 ["One is a rate and the other a quantity, so they differ only in the time unit.",
  "One is a mole balance and the other a mass balance on the same solvent loop.",
  "One is an inlet figure and the other an outlet figure on the same column."],
 "The pickup is what the specs demand of the solution, and the circulation is what carries it. They belong to different streams and different solvents in this course."),

q(0, "Three questions are asked of every figure at every tier of this course. What are they?",
 "Did the engine compute it, did you choose it, or did it keep the answer to itself.",
 ["Is it intensive, is it extensive, or does it belong to the vessel calculation instead.",
  "Is it a derived constant, is it a measured one, or is it a declared one with nothing behind it.",
  "Did a golden check it, did a gate pin it, or does nothing reach it."],
 "The other three groupings are real and each one answers a narrower question. The three above are the discipline the whole course is built on, and only the answers change from tier to tier."),

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/beginner/fc4b_exam.json', label='fc4b_exam', expect_n=42)
finish()
