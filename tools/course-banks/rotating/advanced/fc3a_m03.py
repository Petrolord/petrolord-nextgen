import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Expert m03, The Train, Its Cooling and the Limit That Buys the Stages. Digest section 13.

q(1, "Every stage of the SOKU train shows a ratio of 2.204023061. What is that column telling a reader?",
 "The equal-ratio rule showing up as a fact about the machine that was built.",
 ["That the three stages were sized independently and happened to land together.",
  "That the ratio limit of 4.000000 was binding, which forces the stages into equality.",
  "That the cooler brought every stage back to one inlet, which is what equalises the ratios."],
 "The engine is not choosing a split. It applies the equal-ratio rule and reports the one number it produces, and the train then runs on it.")

q(0, "Down the SOKU train the polytropic head falls from 40786.5845 to 40678.7794 to 39563.3251 ft lbf per lbm while every stage takes the same ratio. What accounts for the fall?",
 "The compressibility average falls from 0.987885118 to 0.974896675 to 0.948163998 as the pressure level rises, and the same ratio on a less ideal gas is less work per pound.",
 ["The inlet temperature falls along the train, because each cooler reaches a little further than the one before it.",
  "The mass flow falls along the train as fuel is drawn off for the driver at each stage.",
  "The polytropic efficiency is applied once per stage, so the third stage carries it three times over."],
 "The gas horsepower falls with the head, from 1461.7913 to 1457.9276 to 1417.9497, and the third stage is the cheapest of the three despite doing the same ratio as the other two.")

q(3, "Stages two and three of the SOKU train both go in at 110.0000 degF and both come out at 258.8635 degF. Why are they identical while stage one is not?",
 "They start from the same cooled temperature and take the same ratio, and stage one starts from the 104.0000 degF suction.",
 ["They share one cooler, so the second cooling duty of 4386630.5362 Btu per hr is the figure that covers both of them together.",
  "Their compressibility averages are equal, which fixes the head and the discharge together.",
  "The third stage is not cooled at all, so the engine carries the second stage figures straight forward rather than recomputing them."],
 "Stage one is the odd one out on this table. The other two are the same calculation on a different pressure level, which is why their inlets and their discharges match exactly.")

q(2, "What does the SOKU train total, and what is the final discharge?",
 "Gas 4337.6686 hp, brake 4481.0626 hp, cooling 8550254.4381 Btu per hr, and a final discharge of 258.8635 degF.",
 ["Gas 4481.0626 hp, brake 4337.6686 hp, cooling 8.5503 Btu per hr, and a final discharge of 251.2956 degF on the last stage.",
  "Gas 1461.7913 hp and brake 1510.1150 hp per stage, with a final discharge of 300.0000 degF.",
  "Gas 4337.6686 hp, brake 4481.0626 hp, no cooling total, and a final discharge of 110.0000 degF."],
 "The cooling total is 8.5503 MMBtu per hr, and reading it beside the brake horsepower is what makes a train result an equipment list rather than a single number.")

q(0, "The stated discharge limit on the SOKU train is 300.0000 degF. Which temperature is the limit judged against, and how much room is left?",
 "The hottest stage, which is 258.8635 degF here, leaving 41.1365 degF.",
 ["The final discharge, which on a train with more than one stage is always the hottest.",
  "The mean of the three stage discharges, which is what the return reports as the train temperature.",
  "The inlet the count was tested at, since that is where the limit was applied when the count was chosen."],
 "The hottest stage is derived as the maximum of the out column. On this train the hottest and the last happen to be the same stage, and quoting the final discharge as the train temperature is the habit that goes wrong elsewhere.")

q(3, "The third stage of the SOKU train reports a cooling duty of 0.0000 Btu per hr and a cooled-to temperature of null. Is that a defect?",
 "No. Interstage cooling brings a gas down before the next stage picks it up, and after the last stage there is none.",
 ["No, but only because this train has three stages. On a two-stage train the engine reports a cooling duty on both rows.",
  "Yes. The aftercooler duty belongs on that row and the engine has left it out.",
  "Yes. A null there hides the fact that the gas leaves that stage at 258.8635 degF rather than at the 110.0000 degF the others reach."],
 "A zero in the cooled-to column would have claimed the gas was chilled to zero degrees Fahrenheit. The engine declines to name a temperature that does not exist.")

q(1, "The first SOKU cooler takes 4163623.9019 Btu per hr and the second takes 4386630.5362. Both cool to 110.0000 degF, so why do they differ?",
 "The second stage leaves at 258.8635 degF and the first leaves at 251.2956 degF, so the second cooler has further to bring the gas back.",
 ["The second cooler is working on a denser gas, because it sits at a higher pressure level on the train.",
  "The first cooler takes a share of the aftercooler duty, which the engine subtracts from its row.",
  "The two duties are quoted at different reference temperatures, one at the suction and one at the approach."],
 "Each of those figures sizes an air cooler or a shell-and-tube exchanger, and each carries a plot area, a fan or cooling water demand, and a pressure drop the next stage pays for.")

q(2, "Walk the SOKU intercooler approach upward with everything else held. What happens to the stage count?",
 "It holds at 3 through 130.0000 degF, rises to 4 at 150.0000 degF and to 5 at 180.0000 degF.",
 ["It holds at 3 through 150.0000 degF and rises to 4 at 180.0000 degF.",
  "It stays at 3 the whole way, and what rises instead is the hottest stage temperature.",
  "It falls from 5 to 3 as the approach rises, because a warmer inlet needs less pressure ratio per stage."],
 "Nothing about the gas, the rate or the two pressures changed across that walk. What changed is the temperature every stage after the first starts from.")

q(0, "On the approach walk the second column reads 104.0000 degF on the first three rows and then follows the approach. What is that column?",
 "The inlet the count was tested at, and it is the only thing on the table that says which machine the count was bought for.",
 ["The temperature the first stage leaves at, which is fixed while the approach sits below the suction.",
  "The approach itself, reported again so the two halves of the comparison can be read on one line.",
  "The coldest inlet any stage on the train receives, which is the suction until the approach passes it."],
 "The rule is the suction for one stage and the hotter of the suction and the cooled temperature for more. On every row it is the inlet the stages after the first actually run from.")

q(3, "While the approach sits at or below 104.0000 degF the count and the train read the same inlet whichever rule is used. What does that force about how the walk is done?",
 "It has to cross the suction, because only the warmer rows could ever have come apart.",
 ["It has to stop at the suction, since above it the two halves are asking different questions.",
  "It has to be repeated at a second stated limit, since one limit cannot discriminate the two rules.",
  "It has to be done at a single approach, since the rule is identical either side of the suction."],
 "A comparison only ever run where it cannot fail proves nothing. Across the whole walk 0 stages sit over the stated limit and 0 carry a warning, and the last four rows are the ones where the answer was in doubt.")

q(1, "On the three coldest rows of the approach walk the hottest stage is 251.2956 degF and it does not move. Why not?",
 "Stage one runs from the suction whatever the cooler does, and on those rows it is the hottest stage on the train.",
 ["The engine caps the reported hottest stage at the first stage value until the approach passes the suction.",
  "All three of those rows share a stage count of 3, and the hottest stage is fixed by the count rather than by the inlets.",
  "The ratio per stage is unchanged on those rows, and the hottest stage depends only on the ratio."],
 "What moves on those rows is every stage after the first, running 233.6372, then 246.2503, then 251.2956 degF as the approach climbs to meet the suction.")

q(2, "Take the same gas from 92.000000 psia to 420.000000 psia at 104.0000 degF with a stated discharge limit of 230.0000 degF and an approach of 165.0000 degF. What does the engine return?",
 "5 stages governed by discharge temperature, a hottest stage of 223.2904 degF and 6.7096 degF of room.",
 ["5 stages governed by the ratio limit, with the hottest stage at 230.0000 degF and no room left.",
  "4 stages governed by discharge temperature, with one stage over the stated limit and carrying a warning.",
  "A refusal, because an approach of 165.0000 degF sits above the stated limit the stages are measured against."],
 "The approach is 61.0000 degF above the suction, and the count is the price of that. The return says discharge temperature governed and the discharge is under the limit it was governed by.")

q(0, "On that 420.000000 psia case the stage discharges are 156.5982, 223.2904, 223.2904, 223.2904 and 223.2904 degF. What is the gap between the first and the rest, and what causes it?",
 "66.6921 degF, because the first stage runs from the suction and every later stage runs from the 165.0000 degF approach at the same ratio.",
 ["66.6921 degF, because the first stage takes a smaller ratio than the four that follow it.",
  "6.7096 degF, which is the room the hottest stage leaves under the stated limit of 230.0000 degF.",
  "66.6921 degF, because the first stage is the only one whose compressibility is evaluated at both ends."],
 "That gap between stage one and the rest is the approach being paid for, and what it bought was the count. 0 of the 5 stages sit over the limit or carry a warning.")

q(1, "Across the five rows of the cooling table that share a stage count of 3, what happens as the approach warms?",
 "The cooling falls from 8.9856 to 8.1149 MMBtu per hr and the gas power rises from 4220.8083 to 4453.3383 hp.",
 ["The cooling rises from 8.1149 to 8.9856 MMBtu per hr while the gas power falls the other way from 4453.3383 to 4220.8083 hp.",
  "Both the cooling and the gas power fall together, since a warmer inlet at the same ratio is a lighter duty on each of them.",
  "The cooling holds at 8.5503 MMBtu per hr while only the gas power moves."],
 "A colder gas entering each stage is denser, the same pressure ratio costs less work on it, and the heat taken out to make it colder is the exchanger's problem instead of the driver's.")

q(2, "Where the fourth machine appears the cooling goes from 8.1149 to 8.6374 MMBtu per hr while the gas power goes from 4453.3383 to 4447.6481 hp. Why do both move against the trade?",
 "The extra machine changed the ratio each stage takes, so the comparison is between two different trains.",
 ["The fourth cooler is added without a fourth stage, so its duty appears with no work against it.",
  "The approach at that row passes the stated discharge limit, which forces the engine to cool harder than it was asked to.",
  "The gas power is reported per stage from that row on, so it falls while the total still rises."],
 "The trade is a statement about a fixed stage count. Written with the count attached it survives the whole table, and written without it the sixth row contradicts it.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/advanced/fc3a_m03.json', expect_n=15)
finish()
