import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Associate m03, The Water a Unit Takes Out. Written from digest.txt
# Sections 5 and 6, which are the five lessons of this module: the spec that
# sets the load, the one multiplication where the rate arrives, the circulation
# ratio as a design choice, the gallons a minute that come out of it, and the
# two bands with their edges read from both sides.

q(1, "OBIAFU arrives at 53.450380 lb of water per MMscf and the contract allows 7.000000 lb per MMscf to leave. What does the unit have to remove, per MMscf?",
 "46.450380 lb, which is the inlet content less the outlet spec.",
 ["53.450380 lb, the whole of the water the gas arrived with at line conditions.",
  "7.000000 lb, which is the figure the contract names.",
  "2879.9235 lb, which is the removal this stream is actually sized on."],
 "The load is one subtraction and the answer stays per MMscf. Reporting the whole inlet content overstates the duty, and 2879.9235 is the same load a day later in the chain, at 62.000000 MMscfd."),

q(0, "At a fixed 62.000000 MMscfd and a fixed 3.200000 gal per lb, tightening the spec from 7.000000 to 0.500000 lb per MMscf takes the water out from 2879.9235 to 3282.9235 lb a day. Why can that column not go on rising without end?",
 "The inlet content is a ceiling, since a unit cannot remove more water than arrived in the gas.",
 ["The customary circulation band closes the column off, because a load above it would put the ratio outside 2.000000 to 5.000000 gal per lb.",
  "The still temperature of 375.000000 degF caps what the reboiler can boil off.",
  "The rich glycol drops below the 90 the module accepts as a lean strength."],
 "A tighter spec raises the load, the circulation and the duty together, and the load approaches 53.450380 lb per MMscf rather than growing without limit."),

q(3, "A data sheet reports 53.450380 lb per MMscf as the water this dehydration unit removes. What is wrong with that?",
 "It is the inlet content rather than the load, so it overstates the duty by whatever the spec allows to leave.",
 ["It is the load at a spec of 7.000000 rather than at this contract's spec.",
  "It is a per MMscf figure where a removal has to be quoted a day.",
  "It is the water a gallon of glycol picks up rather than the water the gas gives up in the contactor."],
 "The inlet content and the load live one subtraction apart and are easy to confuse on a busy sheet. 46.450380 is the load and 53.450380 is what arrived, and both are already quoted per MMscf."),

q(2, "The water content, the spec and the load are all per MMscf. Where does the gas rate enter the chain?",
 "At one multiplication, which turns the load per MMscf into a load a day.",
 ["At the saturation step, where the rate sets how much gas the vapour pressure of 1.069612 psia is being shared across.",
  "At the circulation ratio, where the gallons a pound of water needs are scaled to the size of the plant.",
  "At the reboiler, where the duty a gallon is fired up."],
 "46.450380 lb per MMscf at 62.000000 MMscfd is 2879.9235 lb a day. The answer stops being a property of the gas and starts being a property of the plant."),

q(0, "Down the rate table the water out, the circulation and the reboiler all move, and the Btu a gallon reads 1815.8525 at every rate. Which two figures in a dehydration answer are intensive?",
 "The water content in lb per MMscf and the duty per gallon in Btu.",
 ["The water removed in lb a day and the duty per gallon in Btu, since neither of them mentions a pressure or a temperature anywhere.",
  "The circulation in gpm and the duty in MMBtu an hour, since both are rates and a rate is a property rather than a quantity.",
  "The content in lb per MMscf and the removal in lb a day."],
 "An intensive figure does not know how much material there is. The lb a day, the gallons a day, the gpm and the MMBtu an hour are the same load with the rate already inside them."),

q(3, "The rate runs from 10.000000 to 250.000000 MMscfd and the Btu a gallon stays at 1815.8525. What is that column a property of?",
 "The glycol loop, and what one gallon of it costs.",
 ["The gas, since the pressure and the temperature settled it before any rate was named.",
  "The contract, since the spec decides what each gallon has to give up in the still.",
  "The plant, since it is the firing rate divided by the gallons the pump moved."],
 "The rate only decides how many gallons there are. At 250.000000 MMscfd the removal is 11612.5949 lb a day and 25.805766 gpm, on a gallon that still costs 1815.8525 Btu to heat and strip."),

q(1, "Who supplies the circulation ratio, and what does the engine do about it?",
 "A person supplies it, and the engine reports what it costs without having an opinion on what it should be.",
 ["The engine derives it from the outlet spec, since the dew point a lean glycol delivers decides the gallons.",
  "The customary band supplies it, since the engine takes the middle of 2.000000 to 5.000000 gal per lb.",
  "The published cases supply it, since a ratio no golden covers is one nothing here can check."],
 "The content came from the conditions, the load from the contract and the rate from the reservoir. The circulation ratio came from a person, and a module with no dew point chart in it is in no position to choose one."),

q(2, "As the circulation ratio is raised from 2.000000 to 5.000000 gal per lb, which way do the gallons a minute, the Btu a gallon and the MMBtu an hour move?",
 "The gpm rises, the Btu a gallon falls, and the MMBtu an hour rises.",
 ["All three rise, because more glycol is being moved and everything charged on a gallon is now charged on more gallons.",
  "The gpm rises, the Btu a gallon rises with it, and the MMBtu an hour falls because each pound is spread thinner.",
  "All three fall except the gpm."],
 "From 3.999894 to 9.999734 gpm, from 2073.6650 to 1661.1650 Btu a gallon, and from 0.497666 to 0.996673 MMBtu an hour. Three columns and they do not move together."),

q(0, "Why does the Btu a gallon fall while the MMBtu an hour rises as the ratio goes up?",
 "Each gallon carries less water, so each needs less heat to boil it out, while there are more gallons to heat.",
 ["The sensible term falls because a lightly loaded gallon reaches the still sooner.",
  "The overhead is charged a day rather than a gallon, so more gallons dilute it.",
  "The reflux is applied to the gallons rather than to the water in them."],
 "The sensible half sits at 1386.1650 Btu a gallon the length of that table, because the temperature rise per gallon never changed. The overhead half is what moves, from 687.5000 at 2.000000 gal per lb to 275.0000 at 5.000000."),

q(1, "At a circulation ratio of 3.200000 gal of glycol per lb of water, how much water does one gallon pick up in the contactor?",
 "0.312500000 lb, which is one over the ratio.",
 ["3.200000 lb, which is the ratio read as a load on the gallon.",
  "0.074400000 lb, which a lean gallon already carries.",
  "1.000000000 lb, one pound to every gallon circulated."],
 "Turning the ratio over is the most useful move in the glycol half of this course, because every per gallon quantity downstream is built on it. The 0.074400000 lb is what a lean gallon at 99.200000 weight percent already carries, which is a different figure."),

q(3, "OBIAFU removes 2879.9235 lb of water a day at 3.200000 gal per lb. What is the circulation, and what did the arithmetic pass through?",
 "6.399830 gpm, by way of 9215.7553 gallons a day and the 1440.000000000 minutes in a day.",
 ["6.399830 gpm, by way of 9215.7553 gallons a day and the group factor of 24000000 the duty uses.",
  "9215.7553 gpm, since a ratio in gal per lb already delivers a volume rate.",
  "2.999920 gpm, read at the customary low edge of 2.000000 gal per lb."],
 "A load a day, a ratio, and the minutes in a day, in that order. The 24000000 is the group that turns a duty a gallon into MMBtu an hour, which is a different conversion at a different place in the chain."),

q(2, "This module never uses the hours or the minutes separately. How was the 1440.000000000 minutes in a day established for it?",
 "By asking one call for a gallons a day and a gallons a minute and dividing the first by the second.",
 ["By reading the digits out of the source and pinning them under a name.",
  "By taking the gallons a day and the duty a gallon against the duty in MMBtu an hour.",
  "By checking it against the three published TEG cases."],
 "That is a measurement rather than a reading. It proves that whatever the engine divides by, it divides by 1440.000000000, which is a stronger statement than finding the digits in a file."),

q(0, "The engine is silent at exactly 2.000000 and exactly 5.000000 gal per lb and warns at 1.999999 and at 5.000001. What kind of band is that, and does it still answer?",
 "A customary band with inclusive edges, and it answers either way.",
 ["A physical band with inclusive edges, which refuses anything outside them.",
  "A customary band with exclusive edges, answering throughout.",
  "A publication band, extrapolating beyond its edges."],
 "Customary is a statement about what other people build. A unit outside it is unusual rather than impossible, which is why the engine warns and still answers."),

q(1, "At 0.250000 gal per lb the warning carries a second sentence beyond the customary band. What does that sentence say?",
 "That the rich glycol returns at 69.37 weight percent, below the 90 this module accepts as a lean strength, so the loop is carrying more water than a glycol loop is meant to.",
 ["That the contactor can no longer reach the outlet spec at this loading, so the dew point the unit is sold on is not one the loop delivers.",
  "That the duty has left the range the published TEG cases cover.",
  "That each gallon is picking up 4.000000000 lb of water."],
 "The first half of the warning is advisory and the second half is a statement about the loop. At 1.000000 gal per lb the rich glycol still returns at 89.568932039 weight percent, which is under the same limit."),

q(2, "The lean glycol strength is refused at exactly 90.000000000 and at exactly 100.000000000 weight percent, and answered at 90.000001000 and 99.999999000. Why are both edges excluded?",
 "Below 90 the loop is not a dehydration loop, and 100 is a purity no regenerator reaches.",
 ["Both edges are where the loop water balance divides by zero, so the module refuses them and answers a millionth either side of each.",
  "Both sit outside the band the published cases were written over, and a value no golden covers is refused rather than warned about.",
  "Below 90 the rich would return stronger than the lean."],
 "A customary band includes its edges because an edge value is an ordinary design. A physical band excludes them because the edge is where the description stops being true, and the two reasons here are different from each other."),

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/beginner/fc4b_m03.json', label='fc4b_m03', expect_n=15)
finish()
