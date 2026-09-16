import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(3, "A 12000 ft well is planned vertical, deviated and horizontal in turn. What day counts does the engine return?",
 "40 days vertical, 46 deviated and 53 horizontal, on the one hole depth.",
 ["40 days for all three, because measured depth settles the days while trajectory is carried in the cost of each day rather than in the time.",
  "40, 46 and 53 days, with all three costing the same 31000000 USD because the extra days are drilled inside one contracted price.",
  "53 days vertical falling to 40 horizontal, because the horizontal section is drilled faster than the vertical hole above it once the well turns."],
 "The cost follows the days at a single price for every day: 31000000, 35650000 and 41075000 USD across those three trajectories.")

q(1, "At 12000 ft horizontal the engine returns 39 days at low complexity, 53 at medium and 79 at high. The plain 12000 ft horizontal row reads 53 days. What does that tell you?",
 "Medium is the complexity the engine assumes when nothing else has been said.",
 ["The three complexities are averaged when none is stated, and 53 days is where that average happens to fall for a horizontal well.",
  "Complexity is applied after the trajectory and leaves the 53 days unchanged.",
  "That row was run at low complexity and its 39 days belongs to a shallower well, because a default is never applied to a figure the plan did not carry."],
 "39 days against 79 days is the same hole on one word in one field, and 53 days is the word nobody typed.")

q(2, "EG-01 takes 61 days and EG-02 takes 45. What accounts for the difference?",
 "EG-01 is deeper at 14200 ft against 11600 and horizontal against deviated, so two inputs are pushing it up at once.",
 ["EG-01 is the only well drilled at high complexity, which at 12000 ft is 79 days.",
  "EG-01 carries its services at 1.5 times the rig while EG-02 is priced on the rig alone, and the extra days are those services being drilled.",
  "EG-01 is 14200 ft against 11600 ft, and depth alone sets the days."],
 "The day count reads depth, trajectory and complexity and nothing else, and EG-01 is the only horizontal well in the campaign.")

q(0, "EG-03 is a Water Injector and takes 42 days. What does the type column contribute to that figure?",
 "Nothing at all: the 42 days comes from 10800 ft on a deviated trajectory, and the type is a label for the reader.",
 ["An injector is drilled to a lower specification than a producer.",
  "The type sets the complexity, and a Water Injector is taken as low, which at 12000 ft horizontal is the difference between 39 days and 53.",
  "The type sets the service multiple a producer carries at 1.5 times the rig."],
 "EG-02 at 11600 ft deviated takes 45 days and EG-03 at 10800 ft deviated takes 42, and both are priced at the same 775000 USD a day.")

q(3, "Why can a drilling campaign not be ranked on measured depth alone?",
 "A 12000 ft horizontal well takes 53 days against EG-02's 45 days at 11600 ft, on less hole.",
 ["Measured depth is in feet while the days are computed on true vertical depth.",
  "Depth is the only input the day count reads, so a ranking on depth is sound while a ranking on cost is not, because the rate can move between wells.",
  "The four wells were drilled under different rig rates, so their day counts cannot be compared until each has been restated at 310000 USD a day."],
 "A high complexity horizontal well at 12000 ft takes 79 days, longer than EG-01's 61 days at 14200 ft.")

q(1, "182 rig days at 310000 USD a day is not EGINA's campaign cost of 141050000 USD. What is missing from it?",
 "Services, billed at 1.5 times the rig, which put every day of the campaign at 775000 USD all in.",
 ["The mobilisation and standby between wells, charged once for each rig, which is why a campaign on three rigs costs more than one on a single rig.",
  "The days lost while a rig moves between locations.",
  "The completion of each well, priced separately from the drilling, which is what the plan's own cost item of 520.0000 million USD is there to cover."],
 "Every one of the four rows divides to the same 775000 USD a day, and a campaign priced on the rig alone understates every well in the same proportion.")

q(0, "EG-01 at 61 days costs 47275000 USD and EG-04 at 34 days costs 26350000 USD. What do the four wells have in common?",
 "An all in day of 775000 USD: a producer and an injector, a vertical well and a horizontal one, are priced the same for each day they take.",
 ["A rate of 310000 USD a day, with the spread between the rows carried by the service multiple, which rises as the trajectory gets harder.",
  "A cost for each foot drilled, so 14200 ft and 9400 ft price in the same proportion, and the day counts follow from the footage.",
  "The plan's development drilling item of 520.0000 million USD, shared across the four wells in the ratio of their measured depths."],
 "Trajectory and depth move the days and the day itself costs the same, so 61 days at 775000 USD is 47275000 USD.")

q(2, "EGINA's four wells run 61, 45, 42 and 34 days. What are the campaign totals?",
 "182 rig days and 141050000 USD, which is 141.0500 million USD.",
 ["182 rig days and 113750000 USD, the four wells priced at the rate the engine carried before it began reading the plan's own rate.",
  "95 days and 141050000 USD, because a campaign is reported in the elapsed days it occupies rather than in the days each rig is paid for.",
  "182 rig days and 520.0000 million USD, the plan's own development drilling item, which is the figure carried out of the wells section."],
 "47275000 plus 34875000 plus 32550000 plus 26350000 is 141050000 USD, at 310000 USD a day.")

q(1, "Before the repair the engine returned 113750000 USD for EGINA's wells although the plan carried 310000 USD a day. What had it been doing?",
 "Pricing every well at a hardcoded 250000 USD a day, with no sign anywhere that the plan's own rate had been ignored.",
 ["Refusing the plan's rate as outside the band it searches and falling back on a documented default, which it reported beside the campaign total.",
  "Reading the rate from the first well rather than from the plan.",
  "Applying the 1.5 service multiple to the rig alone."],
 "The repaired engine reads the rate the plan carries, which is why the same four wells now return 141050000 USD.")

q(3, "A campaign priced at a stale rig rate still shows EG-01 as the dearest well and EG-04 as the cheapest. Why does that make the error hard to catch?",
 "Every well moves in the same proportion, so only the total is wrong.",
 ["The total is carried out of the wells section and re-derived downstream, so the plan's own figures disagree and the disagreement reads as rounding.",
  "The error lands on the days rather than on the money, so 182 rig days is wrong while 141050000 USD is not, and the cost is what gets reviewed.",
  "A rate error is refused by name in the way a negative capex is, so a reader looks for the message and finds that the campaign computed cleanly."],
 "113750000 USD stands where 141050000 USD is true, and a plan priced at somebody else's rate gets approved rather than fixed.")

q(0, "What campaign length do EGINA's 182 rig days occupy on one rig, on two and on three?",
 "182 days, then 95 days, then 76 days, against 182 rig days of work in every one of the three cases.",
 ["182 days, then 95 days, then 76 days, with the rig days falling to 95 and 76 as the campaign shortens and the rigs share the work out.",
  "182 days, then half of that, then a third of it.",
  "182 days in each case, because the wells are drilled in the order they sit in the plan and a second rig only brings the spending forward."],
 "Rig days are the sum of the well durations, 61 plus 45 plus 42 plus 34, and no number of rigs reduces that total by a day.")

q(2, "On two rigs EGINA's campaign takes 95 days. How is that reached?",
 "EG-01 at 61 and EG-02 at 45 take a rig each, EG-03 at 42 joins the rig free first at 45, and EG-04 at 34 joins the rig carrying 61, which finishes at 95.",
 ["The 182 rig days are divided between the two rigs and the result rounded up to the next whole well, because a well cannot be split between them.",
  "Each rig takes two wells in the order they sit in the plan, EG-01 with EG-03 and EG-02 with EG-04, and the longer of the two rigs sets the campaign.",
  "The second rig finishes at 87 days carrying EG-02 and EG-03, and the campaign is reported from the rig that comes free first."],
 "Each well goes to the rig that comes free first, nobody chooses the split, and the two rigs finish at 95 and 87 days.")

q(1, "Why does no number of rigs bring EGINA's campaign below 61 days?",
 "A well cannot be split between rigs, and EG-01 alone is 61 days.",
 ["The 182 rig days spread across a campaign cannot fall below the average of the four wells, which is what the third rig has already reached at 76 days.",
  "The three activities carrying float in the schedule network hold the drilling at 61 days, which is the shortest window the plan leaves it.",
  "A rig beyond the third stands idle, because the wells are dealt out in the order they sit in the plan and the fourth rig is offered none of them."],
 "One rig to two takes the campaign from 182 days to 95 and two to three takes it from 95 to 76, and the floor under all of it is the longest single well.")

q(0, "EGINA's four wells cost 141050000 USD on one rig. What do they cost on three?",
 "141050000 USD, because the money follows the rig days and adding rigs does not change the 182 days of work at all.",
 ["A third of that, because each rig carries its own share of the 182 rig days and is paid only for the days it actually works.",
  "More than that, because three rigs stand on rate together.",
  "113750000 USD, the campaign at the lower of the two rates, because a rig taken for 76 days rather than 182 is contracted differently."],
 "182 rig days is a property of the wells, and 76 days is only the elapsed time three rigs buy.")

q(2, "The plan's cost item for development drilling reads 520.0000 million USD and the four well campaign comes to 141.0500 million. What should be made of that difference?",
 "It is a question to ask, because the two are estimates of overlapping things arrived at two different ways.",
 ["The campaign figure should replace the cost item, because it is built well by well from depth, trajectory and complexity at the plan's own rate.",
  "The cost item should be cut to 141.0500 million USD.",
  "The two should be added, the programme and the rig time it consumes."],
 "The campaign figure is a day count priced at a rate, with no completion detail, no contingency and no standby anywhere in it.")

emit(Q, '/root/ec-wip-fdp/banks/ec6i_m03.json')
finish()
