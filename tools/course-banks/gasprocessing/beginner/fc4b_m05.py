import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Associate m05, A Dehydration Answer End to End. Written from digest.txt
# Sections 5 to 8 and 18 read as one chain: what enters where, what each lever
# can and cannot reach, and what a published case does and does not establish.

q(1, "In the OBIAFU chain, what stands between the mole fraction of 0.001125908 and the load of 46.450380 lb per MMscf?",
 "The pound mole and the molecular weight of water, which give the content of 53.450380, and then the contract spec of 7.000000.",
 ["The rate of 62.000000 MMscfd, which turns a fraction into a quantity, and then the contract spec.",
  "The circulation ratio of 3.200000 gal per lb, which is where a fraction becomes a load the loop can carry.",
  "Nothing but the spec, since the mole fraction is already a figure in lb per MMscf."],
 "A mole fraction becomes a content through two constants, and the content becomes a load through one subtraction. The rate arrives after the load and the ratio after that."),

q(0, "No step in this chain revises a step above it. What does that property buy a learner?",
 "A wrong figure can be traced in one reading, because every figure has one parent and one operation above it.",
 ["A guarantee that the answer is right, since a calculation with no feedback in it has nowhere for an error to enter.",
  "The ability to run the chain backwards from the duty at every step.",
  "A shorter calculation, since nothing has to be evaluated twice and no step waits on a step below it."],
 "If the duty is wrong then the gallons a day are wrong or one of the heat terms is wrong. An absorber with stages or a compressor with an efficiency curve gives no such single place to look."),

q(3, "Two conditions enter at the top of the chain and are never mentioned again. Which two, and where is the last place they act?",
 "The pressure and the temperature, and the last place they act is the water content.",
 ["The pressure and the temperature, and the last place they act is the vessel the gas rises through.",
  "The spec and the rate, and the last place they act is the water removed a day.",
  "The gas temperature and the still temperature, and the last place the two of them act is the sensible heat term."],
 "Once the content is fixed the line conditions have no further say in this chain. The still temperature is a design choice entering much lower down, inside one of the two heat terms."),

q(2, "A circulation of 6.399830 gpm is quoted on its own, with nothing beside it. What can be said about how it was arrived at?",
 "Nothing. Two of the load a day, the ratio and the circulation always give the third, and one of the three on its own gives none of them.",
 ["That the ratio was inside the customary band, since a circulation the engine reported without a warning is one it accepted.",
  "That the rate was 62.000000 MMscfd, since a gpm carries the rate inside it and can be read back to it.",
  "That the spec was met, since the circulation is what the load demands and the load is what the spec set."],
 "Given a gpm and the load a day the ratio follows. Given a gpm and the ratio the load a day follows. A single quoted circulation is almost useless on its own."),

q(0, "Which of these could NOT have moved a circulation figure, with nothing else on the data sheet changed?",
 "The reflux ratio.",
 ["The circulation ratio.",
  "The gas rate in MMscfd.",
  "The gas temperature."],
 "The circulation follows from the load a day, the circulation ratio and the minutes in a day. The reflux ratio and the still temperature act on the heat terms alone, and the gas temperature reaches the circulation through the inlet water content."),

q(1, "What does the lean glycol strength act on, and what does it leave alone?",
 "It acts on the loop water balance, which is what a gallon is carrying, and leaves the number of gallons alone.",
 ["It acts on the outlet spec the unit can deliver, and leaves the water removed a day alone.",
  "It acts on the sensible heat term and leaves the overhead alone.",
  "It acts on the customary band, since a weaker lean narrows the ratios the engine will accept, and leaves the duty alone."],
 "At 99.200000 weight percent a lean gallon already carries 0.074400000 lb of water and the rich glycol comes back at 95.975032510. The engine says on every answer that the dew point a lean strength delivers is a chart it does not carry."),

q(3, "A rate change and a ratio change both raise the circulation. What does each one drag along with it?",
 "A rate change moves the water removed a day and everything below it, and a ratio change leaves the water removed where it was.",
 ["A rate change moves the duty a gallon, and a ratio change moves the water removed a day.",
  "Both move the water removed a day, and only the ratio change moves the duty a gallon.",
  "A rate change moves the water content, and a ratio change moves the load per MMscf."],
 "The same pounds are still coming out of the same gas when the ratio moves. What moves is how much glycol carries them and what a gallon costs to regenerate."),

q(2, "Which figure does the gas rate reach, the Btu a gallon or the MMBtu an hour?",
 "The MMBtu an hour only, because the rate decides how many gallons there are rather than what one costs.",
 ["Both, because the duty an hour is the duty a gallon with the gallons applied and the rate is inside both figures.",
  "The Btu a gallon only, because the gallons a day are what the rate multiplies and the hourly duty is a firing rate.",
  "Neither, because both duty figures are charged on the loop."],
 "The Btu a gallon reads 1815.8525 at 10.000000, 62.000000 and 250.000000 MMscfd. The still temperature, the absorber temperature, the circulation ratio and the reflux ratio are what reach it."),

q(0, "An engineer offers the Btu a gallon as a measure of how efficient a glycol loop is. Why is that the wrong reading?",
 "It falls as the circulation ratio rises, so it improves on the very move that raises the duty an hour.",
 ["It is charged on the solvent rather than on the water, so it says nothing about how much water the loop removed.",
  "It is the same on every stream this module answers, so it cannot separate one loop from another at all.",
  "It rises with the still temperature, which a plant can move."],
 "From 2.000000 to 5.000000 gal per lb the Btu a gallon runs from 2073.6650 down to 1661.1650 while the duty runs from 0.497666 up to 0.996673 MMBtu an hour."),

q(1, "The spec, the circulation ratio and the reflux ratio enter the chain at three different heights. What follows from that?",
 "How much of the answer each one disturbs, since the spec moves everything below it and the reflux ratio reaches one heat term.",
 ["Which of them the engine will choose for you, since the higher a lever sits the more likely the module is to carry a default.",
  "How large each one's effect is, since a lever near the top of a chain multiplies through more steps and therefore moves more.",
  "Which of them the published cases can check, since a golden covers the steps below the lever it varies and none above it."],
 "The spec enters at the subtraction that makes the load. The ratio enters once the load stands in pounds a day. The reflux ratio enters inside the overhead term, and its reach is the shortest of the three."),

q(2, "Each lever table holds every other input pinned. What must such a table not be used for?",
 "Predicting the outcome of a real change, in which more than one input usually moves at once.",
 ["Explaining the mechanism of the lever, since a table with everything else pinned cannot show what the lever acts through.",
  "Comparing two levers, since the columns of one table are not the columns of another and the rows are at different inputs.",
  "Checking the engine, since the table repeats one call."],
 "A spec tightening usually arrives with a rate change. The tables give the direction and the mechanism of each lever completely, and the outcome of a decision that pulls two of them not at all."),

q(3, "There is a fourth handle on a dehydration package that appears on none of the lever tables. What is it, and where does it sit?",
 "The gas temperature, and it sits upstream of the package in whatever cools the gas before the contactor.",
 ["The lean glycol strength, and it sits inside the regenerator, where the still temperature is what decides it.",
  "The gas pressure, and it sits at the compression the pipeline contract demands.",
  "The absorber temperature, and it sits at the bottom of the contactor where the rich glycol leaves."],
 "Cooling the gas before it meets the glycol lowers the inlet content, so the load is smaller before any glycol is involved. Every pound taken out that way is one the loop never carries."),

q(0, "On the three published TEG cases the water, gpm, Btu a gallon and MMBtu an hour columns all read 1.000000000000 against the golden while the BTEX column reads 0.999997865073. What separates the last column from the others?",
 "It is the only column in the table that is a mole balance, and the others are mass balances.",
 ["It is the only column the golden computes independently, and the others are re-read out of the engine's own answer.",
  "It is the only column carrying an operating value, so the absorbed fraction the two sides assume is not the same number.",
  "It is the only column quoted a day rather than a gallon."],
 "The check re-expresses the mass columns through kilograms and cubic metres and comes back to the same pounds. What the gap in the mole column is belongs to a later tier."),

q(2, "The second published TEG case runs 120.000000 MMscfd from 90.000000 to 4.000000 lb per MMscf at 4.000000 gal per lb. Which figure is the circulation?",
 "28.666667 gpm.",
 ["10320.0000, which is the circulation expressed the way the loop balance carries it.",
  "1789.7000, which is what a gallon of that circulation costs to regenerate.",
  "3.078284, which is the circulation once the hours in a day have been applied to it."],
 "10320.0000 is the water a day, 1789.7000 is the duty a gallon and 3.078284 is the reboiler in MMBtu an hour. Four figures about one case and each answers a different question."),

q(1, "The engine reports the basis of the outlet water content on every dehydration answer. What does it say?",
 "That the spec was typed, because the dew point lean glycol can deliver is a chart this module does not carry.",
 ["That the spec was derived from the lean strength, which is the input the loop water balance turns into a dew point.",
  "That the spec was taken from the published cases.",
  "That the spec was checked against the customary band."],
 "The module takes the spec and reports the loop balance that follows from it rather than pretending to derive one from the other. A reader who wants the other direction needs the chart."),

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/beginner/fc4b_m05.json', label='fc4b_m05', expect_n=15)
finish()
