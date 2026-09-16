import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Associate m04, What the Reboiler Pays For. Written from digest.txt
# Section 7, which is the four lessons of this module: the sensible term the
# solvent is charged for, the overhead term the water is charged for, the
# reflux that adds its fraction again, and the two of them becoming a rate.

q(2, "The sensible term on OBIAFU is built from three things and a temperature rise. Which three, and what do they give?",
 "9.300000 lb a gallon, 0.550000 Btu per lb per degF, and the rise from 104.000000 degF to 375.000000 degF, giving 1386.1650 Btu a gallon.",
 ["0.312500000 lb of water a gallon, 1100.000000 Btu a lb and the reflux ratio of 0.250000, giving 429.6875 Btu a gallon.",
  "9.300000 lb a gallon, 1100.000000 Btu a lb and the rise from the absorber to the still, giving 1815.8525 Btu a gallon.",
  "69.568831168831 lb a ft3, 0.550000 Btu per lb per degF and the still at 375.000000 degF, giving 1386.1650 Btu a cubic foot."],
 "Mass times specific heat times rise. The overhead term, built from the water a gallon carries and 1100.000000 Btu a lb, is charged on the water rather than on the solvent, and the density this term reads is the one per gallon."),

q(0, "A gallon of glycol goes round the loop having picked up no water at all. What happens to the sensible term?",
 "Nothing. It is the cost of moving the solvent rather than of doing anything to it.",
 ["It falls to zero, since a gallon carrying no water has nothing for the still to take back out of it.",
  "It falls in proportion, since the term is charged on the mass of the gallon and a dry gallon weighs less than a wet one.",
  "It rises, since a gallon carrying no water needs no heat for the overhead and the still spends all of its firing on the solvent."],
 "The sensible half heats the glycol from the absorber to the still whether the gallon is carrying much water or little. Nothing about water enters until the overhead term."),

q(3, "Across still temperatures of 340.000000, 375.000000 and 400.000000 degF the sensible term reads 1207.1400, 1386.1650 and 1514.0400 Btu a gallon while the overhead reads 429.6875 at all three. Why does the overhead not move?",
 "Boiling a pound of water out of the gallon costs what it costs however hot the vessel is.",
 ["The overhead is charged on the reflux, and the reflux ratio was not what moved.",
  "The overhead is quoted a day rather than a gallon, so a per gallon table cannot show it moving.",
  "The still temperature only reaches the overhead once it is above 400.000000 degF, which is where the glycol itself begins to degrade."],
 "The still temperature has exactly one place to act in this balance, which is the rise the sensible term is built on. The total moves down that table only because the sensible half moved."),

q(1, "At 3.200000 gal per lb a gallon carries 0.312500000 lb of water, and the overhead the module charges is 1100.000000 Btu a lb. What do those two give, and what does the figure leave out?",
 "343.7500 Btu a gallon, which is the overhead with no reflux at all.",
 ["429.6875 Btu a gallon, which is the overhead with the reflux already inside it.",
  "1386.1650 Btu a gallon, which is the overhead before the sensible half is added to it.",
  "343.7500 Btu a gallon, which is the whole overhead, since the reflux is charged on the sensible term instead."],
 "0.312500000 times 1100.000000 is 343.7500, and it is the first row of the reflux table. The reflux ratio of 0.250000 then takes it to 429.6875."),

q(2, "The 1100.000000 Btu a lb the still overhead is charged at stands for what, exactly?",
 "Boiling absorbed water back out of a glycol solution at still conditions, which is a slightly different thing from the latent heat of pure water.",
 ["The latent heat of pure water at the still temperature of 375.000000 degF, read off a steam table and carried inside the module under its own exported name.",
  "The heat a gallon of glycol needs to reach the still, charged on the water in it.",
  "The heat the reflux returns to the still, charged once on every pound."],
 "A latent heat is a physical property and this module does not compute one. It takes a figure that stands for the vaporization the still actually performs and declares it, with no publication in this repository behind it."),

q(0, "What does a reflux ratio of 0.250000 do to the overhead term?",
 "It adds a quarter of the water vaporization on top of itself, taking 343.7500 Btu a gallon to 429.6875.",
 ["It sends a quarter of the overhead back down the column unheated, so the term falls to 343.7500 Btu a gallon.",
  "It splits the overhead into a boiled quarter and a condensed remainder, which is why 429.6875 is quoted rather than 550.0000.",
  "It charges a quarter of the sensible term again."],
 "Some of what is boiled overhead condenses at the top of the column and runs back down to be boiled again, and the reboiler pays for that returning water twice."),

q(3, "The reflux table carries the overhead, the total and the reboiler duty and does not carry the sensible term. Why is the sensible term absent?",
 "It never moves when the reflux ratio moves, because reflux is a water question and the sensible term is a solvent question.",
 ["It is inside the total column already, so printing it beside the total would be printing one number twice.",
  "It is charged on the gallons a day rather than on a gallon, so it belongs beside the duty an hour.",
  "It moves with the reflux but by so little across 0.000000 to 0.600000 that the column would read the same figure six times."],
 "The overhead runs from 343.7500 to 550.0000 Btu a gallon across that table while the sensible half sits where the still temperature and the absorber temperature put it."),

q(1, "Reading only the reflux table, a designer concludes that the cheapest still runs with no reflux at all. What is wrong with the conclusion?",
 "Reflux is a trade between duty and glycol losses, and this module prices only the duty side of it.",
 ["The table holds the circulation ratio fixed, and a still with no reflux needs a higher ratio to reach the same rich loading.",
  "A reflux ratio of 0.000000 is one the engine refuses.",
  "The table prices the reflux against the total rather than against the overhead, so the first row understates what no reflux costs."],
 "A still with no reflux sends glycol overhead with the water, so the loop loses solvent that was paid for. Glycol carryover is not a quantity this engine computes, which is why the table supports the conclusion and the plant does not."),

q(2, "On OBIAFU the two heat terms are 1386.1650 and 429.6875 Btu a gallon. What is the total, and what share of it is sensible?",
 "1815.8525 Btu a gallon, of which 0.763369 is sensible.",
 ["1815.8525 Btu a gallon, of which 0.763369 is the overhead half.",
  "1729.9150 Btu a gallon, of which 0.763369 of it is sensible.",
  "1815.8525 Btu a gallon, and the course prints no share for the two halves."],
 "The sensible over the sum is the one comparison between the two heat terms this course computes, and it says the larger part of this reboiler is warming glycol up."),

q(0, "The loop moves 9215.7553 gallons a day, each needing 1815.8525 Btu. How does that become 0.697269 MMBtu an hour?",
 "The product is divided by the group factor of 24000000, which carries the hours in a day and the Btu in a MMBtu.",
 ["The product is divided by the 1440.000000000 minutes in a day and then again by the million Btu that a MMBtu carries.",
  "The gallons a day are turned into gpm first, and 6.399830 gpm is multiplied by the duty a gallon.",
  "The product is divided by the hours in a day alone, and the answer is then quoted in MMBtu."],
 "A duty a day divided by the hours in a day and by the Btu in a MMBtu. The minutes in a day belong to the circulation, which is a different conversion earlier in the chain."),

q(1, "The sensible term is built on a rise. Which temperature sets the bottom of it, and why that one?",
 "The gas temperature of 104.000000 degF, because a gallon leaves the bottom of the contactor at the temperature of the gas it just met.",
 ["The still temperature of 375.000000 degF, since the rise is measured downwards from the temperature the regenerator itself actually runs at.",
  "The standard temperature of 519.670000 degR, which is the base that every temperature in this module is ultimately referred back to.",
  "The reboiler edge of 340.000000 degF, which is the lowest still the table carries."],
 "Absorber to still. Cooling the gas before the contactor therefore shortens the rise as well as lowering the inlet water content, and the engine takes both temperatures as typed inputs."),

q(3, "What is inside the 0.697269 MMBtu an hour, and what is not?",
 "The reboiler and nothing else, so the pump, the exchanger, the flash vessel and the cooling of the lean glycol are all absent.",
 ["The reboiler and the still overhead condenser, since the reflux the condenser returns is charged inside the overhead term.",
  "The reboiler and the gas and glycol exchanger, since both sit inside the loop the duty is charged on.",
  "The whole glycol package, since every heat term the module names has been added into it by this point in the chain."],
 "It is a firing rate for one vessel. The reflux appears in the duty as heat the reboiler pays again, rather than as a condenser being sized."),

q(2, "A duty looks too high. What does splitting it into a sensible half and an overhead half tell a designer that one figure cannot?",
 "Which remedy applies, since a sensible-heavy duty and an overhead-heavy duty point in opposite directions.",
 ["Whether the duty was computed at the right rate, since only the overhead half carries the gas rate into the figure.",
  "Whether the still temperature was typed or taken from the default, since the sensible half is the only term that carries it.",
  "Whether the answer sits inside the published TEG cases."],
 "A duty dominated by the sensible term is a circulation or a still temperature question. A duty dominated by the overhead is a water question, and more circulation rather than less is the remedy there."),

q(0, "1729.9150 Btu a gallon appears twice in this module: once at a reflux ratio of 0.000000 and once at a circulation ratio of 4.000000 gal per lb. Do the two rows say the same thing?",
 "No. The duties an hour beside them are 0.664270 and 0.830337 MMBtu, because the two rows hold different numbers of gallons.",
 ["No. The first is a total and the second is an overhead, so only one of the two carries the sensible term inside it.",
  "Yes. A duty a gallon is a property of the loop, so two rows carrying the same figure describe the same loop.",
  "Yes, on the duty a gallon, and the two differ only in the warning the second row carries."],
 "A duty a gallon says what one gallon costs and says nothing about how many gallons there are. The same figure is reached by cutting the reflux to nothing and by circulating more glycol per pound."),

q(1, "A reboiler duty is quoted with no other figure beside it. Which decisions have been hidden?",
 "The still temperature, the absorber temperature, the circulation ratio and the reflux ratio, along with the rate that set the gallons.",
 ["The gas pressure and the gas temperature, which fixed the water content the whole duty is charged on.",
  "The outlet spec and the lean glycol strength, which between them decide what each gallon has to give up in the still.",
  "The glycol density and the specific heat, which are the two declared values the sensible term is assembled from."],
 "Two plants at the same duty can have arrived there by different routes, and the route decides what would happen if anything moved. The conditions and the spec reach the duty through the load rather than through the duty a gallon."),

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/beginner/fc4b_m04.json', label='fc4b_m04', expect_n=15)
finish()
