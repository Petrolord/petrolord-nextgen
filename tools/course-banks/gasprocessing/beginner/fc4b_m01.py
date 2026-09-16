import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Associate m01, What This Engine Conditions. Written from digest.txt
# Sections 1 and 2, which are the four lessons of this module: the three units
# over one stream, the doctrine that decides what is an input, the two kinds of
# refusal, and the three kinds of constant.

q(1, "The Gas Processing Studio runs three unit operations over one gas stream. Which three?",
 "Dehydration, which takes water out with glycol; sweetening, which takes acid gas out with amine; and a dew point unit, which cools the gas by letting it down.",
 ["Dehydration with glycol, sweetening with amine, and an inhibitor injection that keeps the water already present from forming a hydrate in the line below the plant.",
  "A compositional flash that splits the wellstream, then glycol dehydration of the gas it releases, then amine sweetening of what the dehydration tab passes on.",
  "Glycol dehydration, molecular sieve polishing for the last of the water, and a refrigeration loop that drops the heavier ends out as a liquid product."],
 "Three units, three balances, one stream. Inhibitor injection, a flash and a molecular sieve are all outside this engine, and the third unit cools by expansion rather than by refrigeration."),

q(0, "A flowsheet asks this engine for the hydrate formation temperature of the dried gas at line conditions. What comes back?",
 "No answer at all, because no hydrate boundary is in this engine. That margin belongs to the Flow Assurance engine in the Production module.",
 ["An object carrying an error string that names the missing argument, since the routine is present and wants a subcooling correlation supplied to it.",
  "The temperature at which the dehydration tab stops answering, which is the guard edge at 140.000000 degF, because that is where the water answer and the hydrate question meet.",
  "The inlet water content of 53.450380 lb per MMscf, since a gas that dry is already below any hydrate point."],
 "This is an absence rather than a refusal. Nothing prints, because the question never arises anywhere in the chain, and 140.000000 degF is the edge of a water fit rather than a hydrate line."),

q(2, "The module states one rule in its header that decides which numbers a reader can see and which ones they have to accept. What is the rule?",
 "Everything that is a design choice or a chart value is an input with its customary range named, and everything computable from first principles is computed.",
 ["Anything the published cases check is computed, and anything no golden reaches arrives as an input so that changing it cannot break a case.",
  "Anything carrying units is computed and anything dimensionless is typed, which is why the ratios in this module are the figures a person supplies.",
  "Anything that moves with the gas is computed and anything that moves with the plant is typed, so the conditions are derived and the equipment is chosen."],
 "The doctrine is about the ORIGIN of a number rather than about its units, its dimensionality or which gate can reach it. A chart value is an input even though it is very much about the gas."),

q(3, "Which of these figures arrives as an input carrying a default rather than as something the module works out for itself?",
 "The heat a pound of absorbed water takes in the still overhead, 1100.000000 Btu a lb.",
 ["The standard cubic feet in a pound mole, 379.483571856287, which the module builds from the gas constant and its own standard base.",
  "The glycol density of 69.568831168831 lb a ft3, formed from the density a gallon.",
  "The mole fraction of water in the gas at line conditions, which the module forms from a vapour pressure and a total pressure."],
 "The overhead is a declared value and an input with 1100.000000 as its default. The other three are computed or derived, so no reader has to accept them on trust."),

q(1, "For four of its constants the digest asks the engine a question whose answer is that constant and nothing else, then divides the measurement by the export. Every one of the four comes back at 1.000000000000. What does that establish?",
 "That the name on the page and the number actually in use are the same number, and nothing whatever about whether the value is right.",
 ["That the constant has a publication behind it, since a figure can only be measured against something that was measured first.",
  "That the constant is a derived one rather than a declared one, because a declared value has no route out of a return value.",
  "That the golden reaches the same figure by a second road, which is what a ratio of exactly one between two independent answers means."],
 "A ratio of 1.000000000000 rules out an export whose name is attached to a different number from the one in use. The water overhead is measured that way and is still a declared value with nothing to check it against."),

q(2, "How is the standard cubic feet a pound mole, 379.483571856287, measured back out of the engine rather than read from the source?",
 "By running the BTEX mole balance at one MMscfd, a million ppmv, a unit absorbed fraction and a unit molecular weight, where the answer is a million over that number and nothing else.",
 ["By dividing the gallons a day by the gallons a minute that one call returns, which leaves the conversion the balance passed through standing on its own.",
  "By dividing the saturation answer by the mole fraction the same call returns, which strips the pressure ratio out and leaves the pound mole behind.",
  "By multiplying the gallons in a cubic foot of 7.480519480519 by the glycol density of 9.300000 lb a gallon, since the loop balance carries both."],
 "Dividing a gallons a day by a gallons a minute measures the minutes in a day instead. Dividing the saturation answer by the mole fraction is a step towards the molecular weight of water, and the gallons in a cubic foot times the density a gallon gives 69.568831168831 lb a ft3."),

q(0, "A reviewer proposes moving the glycol density away from 9.300000 lb a gallon. What else moves, and what can a gate do about the proposal?",
 "The 69.568831168831 lb a ft3 the vessel sizing reads moves with it, because that figure is the density a gallon times the gallons in a cubic foot, and a gate can only pin a declared value so the change is a reviewed act.",
 ["Nothing else moves, because the sizing carries a separate liquid density for a glycol column, and a gate re-derives the new figure from the publication the module cites.",
  "The standard cubic feet a pound mole moves with it, since both figures hang off the same standard base of 14.696000 psia and 519.670000 degR, and a gate fails the change on that arithmetic.",
  "The Magnus coefficients move with it, because the water the glycol picks up is what sets the loop balance, and a gate checks the new density against the measured value it exports."],
 "One fluid has one density here and both the loop balance and the vessel sizing read it. No publication in this repository stands behind 9.300000, so pinning is the whole of what a gate can offer."),

q(3, "The dehydration balance and the vessel sizing are shown to use one glycol density, at a ratio of 1.000000000000 between the two figures the module exports. What does that rule out?",
 "One fluid carrying two numbers, so that nothing downstream can tell which of them it is holding.",
 ["Any future edit to the density, because a value a gate has pinned is one that cannot be moved again without the gate failing on the arithmetic.",
  "The density being a declared value, since a figure the digest has checked against a second route has stopped being a value with nothing behind it.",
  "An error in 9.300000 lb a gallon itself, which two agreeing routes would catch."],
 "Two numbers for one glycol is a defect whatever its size, and the ratio of 1.000000000000 says this module does not have one. It says nothing at all about whether 9.300000 is correct."),

q(1, "The studio hands one of this module's doors a state it has no answer for. What does the caller get?",
 "An object with an `error` key carrying a named string, because this module throws nothing at all.",
 ["A thrown error for a missing argument and an object for a value that is merely out of its domain, so a caller has to handle both shapes.",
  "The nearest answer inside the band with a note attached rather than a refusal.",
  "A null, so a caller can test the return value in one comparison."],
 "This module throws nothing, so a caller gets a result it can look at and report and the studio can print the refusal rather than falling over. A note attached to a usable answer is what the publication limit and the pressure threshold do, which is a different behaviour."),

q(2, "Why is an absence harder to work with than a refusal?",
 "A refusal prints and cannot be used by accident, and an absence prints nothing at all, so a reader fills the gap in themselves.",
 ["An absence returns a zero, and a zero reads as a small answer rather than as a missing one whenever it lands in a column of small answers.",
  "A refusal stops at the studio while an absence travels down the chain, so the missing quantity turns up inside the duty without ever being named.",
  "A refusal is a design choice and an absence is a defect in the code."],
 "A dehydration answer of 6.399830 gpm and 0.697269 MMBtu an hour says nothing about a hydrate margin, and nothing in it flags that it says nothing. Each absence is a question that belongs to another engine rather than a hole."),

q(0, "Two questions this engine has no answer for are a hydrate margin and the phase envelope of a reservoir fluid. Where does each belong?",
 "The hydrate margin is the Flow Assurance engine in the Production module, and the phase envelope is the Fluid engine.",
 ["The phase envelope is the Flow Assurance engine in the Production module, and the hydrate margin is the Fluid engine, which carries the water that forms one.",
  "Both belong to the Flow Assurance engine, which draws the envelope a hydrate line sits on.",
  "Both belong to this module's dew point unit, which reaches the cold end where both would appear."],
 "They are two engines and two questions. This module carries neither, and the dew point unit cools a gas rather than drawing an envelope or a hydrate line."),

q(3, "The Associate tier follows the water chain from the line conditions to the duty and leaves the other two units to later tiers. Which of these is true of that chain?",
 "Nothing in it feeds back, so no step revises a step above it and a wrong duty can be traced in a single reading.",
 ["The water chain is the only one of the three carrying published cases, so it is the only unit whose answers a learner can check against something outside the engine.",
  "A glycol loop is the only one of the three units the Studio gives a tab of its own, so it is the only unit a learner can work end to end on the page.",
  "The water duty is the largest of the three on both teaching streams, which makes it the unit where an error costs the most and the one to meet first."],
 "The chain runs one way, from the line conditions to the duty, so a wrong figure can be settled by reading it once. The other two units carry published cases as well, and the regenerator on the sour stream is much the larger duty of the two."),

q(2, "UBIE arrives at 5.200000 mol percent CO2 and 1.400000 mol percent H2S and has to leave at 2.000000 and 0.000400. What does the engine report as going into the solution, and in what unit?",
 "10666.2009 lbmol of acid gas a day.",
 ["525.893013 gpm of solution, which is that same quantity expressed in the unit a circulation pump is bought in.",
  "25.242865 MMBtu an hour, which is the acid gas load expressed as the heat the regenerator needs to strip it back out.",
  "10666.2009 lb a day, since a mole balance ends in a mass once the molecular weight of the acid gas has been applied."],
 "Sweetening is a mole balance and the pickup is 10666.2009 lbmol a day. The gpm and the MMBtu an hour are real figures on this stream that answer later questions in the chain."),

q(1, "The module fixes one standard base, at 14.696000 psia and 519.670000 degR. Which exported figure follows directly from it?",
 "The standard cubic feet in a pound mole, 379.483571856287, which is the gas constant of 10.731600 times that temperature over that pressure.",
 ["The Rankine offset of 459.670000 degR, which is how every temperature in the module reaches the absolute scale the correlations want.",
  "The gallons in a cubic foot, 7.480519480519, which the module needs before any volume at the standard base can be quoted in gallons.",
  "The glycol density of 69.568831168831 lb a ft3, which is a mass in the volume unit the standard base is written in."],
 "379.483571856287 is the standard base and the gas constant in one expression. The Rankine offset and the gallons in a cubic foot are fixed conversions that owe the base nothing."),

q(0, "The minutes in a day and the factor of 24000000 are established as groups rather than one part at a time. Why?",
 "The engine never uses their parts separately, so nothing outside it can pull them apart.",
 ["Both are exact conversions between units, and measuring one part of an exact conversion would add nothing that its definition does not already give.",
  "Both are declared values, and a declared value can only be pinned in one place under one name rather than checked piece by piece.",
  "Neither has a published case behind it, so the only route left is to take whatever the engine returns and record it under the name it was asked for."],
 "The gallons a day over the gallons a minute of one call gives 1440.000000000, and the gallons a day times the duty a gallon over the duty in MMBtu an hour gives 24000000. Each is a measurement of a product rather than of its factors."),

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/beginner/fc4b_m01.json', label='fc4b_m01', expect_n=15)
finish()
