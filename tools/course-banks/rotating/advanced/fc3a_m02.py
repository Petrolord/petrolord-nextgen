import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Expert m02, The Stage Count and the Limit That Governs. Digest section 12.

q(2, "SOKU as a whole duty moves 26.000000 MMscfd from 92.000000 psia to 985.000000 psia at 104.0000 degF. What is the overall ratio, and what is the ratio each stage ends up taking?",
 "An overall ratio of 10.706521739, split into a ratio per stage of 2.204023061.",
 ["An overall ratio of 10.706521739, split into a ratio per stage of 3.200000.",
  "An overall ratio of 2.204023061, which the three stages each take in full.",
  "An overall ratio of 10.706521739, which the per-stage limit of 4.000000 then caps."],
 "The count comes first and the ratio per stage follows from it. Equal ratios are the split the engine applies, so the per-stage figure is one number on the return rather than a list.")

q(0, "On SOKU the ratio rule demands 2 stages and the temperature limit demands 3. What does the engine return?",
 "3, and it names discharge temperature as what governed.",
 ["3, with the governing rule left unreported because the two demands disagree.",
  "2, because a ratio limit of 4.000000 was stated by the caller and the temperature limit was a default.",
  "The mean of the two demands rounded upward, which on this duty is also 3."],
 "The returned count is the larger of the two demands on every row of the sweep, and the governed-by field names which demand it came from.")

q(3, "A trial stage count has to be tested from some inlet temperature. What inlet does the engine use?",
 "The suction for one stage, and the hotter of the suction and the cooled temperature for more than one.",
 ["The suction for every trial, since the suction is the only temperature the duty states.",
  "The cooled temperature for every trial, because the count is about the stages after the first.",
  "The mean of the suction and the cooled temperature, weighted by how many stages the trial has."],
 "A single stage starts from the suction and is never cooled, because there is nothing after it to cool for. Every stage after the first starts from the interstage cooler.")

q(1, "SOKU cools back to 110.0000 degF against a suction of 104.0000 degF. Which figure was the three-stage trial tested from, and why?",
 "110.0000 degF, because it is the hotter of the two and it is what the second and third stages actually see.",
 ["104.0000 degF, because the count is a property of the duty and the duty states its suction.",
  "110.0000 degF, because the engine always prefers the cooled temperature once a trial has more than one stage.",
  "104.0000 degF, since the first stage is the hottest on this train and a count is tested against the hottest stage."],
 "Test a three-stage trial from the suction when the stages will run warmer and you have evaluated a machine that is not the one being built.")

q(2, "Across the nine rows of the discharge-pressure sweep, how often does the engine answer \"both equally\", and what does that row mean?",
 "On 3 of the 9 rows, and it means the count sits on the edge of both rules at once.",
 ["On 3 of the 9 rows, and it means neither rule could be evaluated because the inlet was ambiguous.",
  "On 5 of the 9 rows, and it means the engine declined to choose between two counts that differ by one.",
  "On 1 of the 9 rows, and it means both demands gave the same ratio per stage."],
 "Where the two demands are equal the engine says so rather than picking one. A small move in either input changes the answer there, so it is the least comfortable row on the table.")

q(0, "At a discharge of 300.000000 psia the sweep shows an overall ratio of 3.260869565, a demand of 1 by ratio and 2 by temperature. What is returned?",
 "2 stages, governed by discharge temperature.",
 ["1 stage, because the ratio rule is evaluated first and a single stage is inside the stated limit.",
  "2 stages, governed by both equally, since one demand is the other less one.",
  "1 stage, with a warning that the temperature limit would have asked for a second."],
 "The larger demand wins on every row. The ratio rule set a floor of one machine and the temperature limit set the answer at two.")

q(1, "The ratio-per-stage column climbs from 2.056367445 to 2.204023061 to 2.353953103 and then drops to 2.131775386. What is happening at the drop?",
 "A machine has been added, so each stage is taking a smaller bite of the same job.",
 ["The ratio limit of 4.000000 has been reached, so the engine has begun trimming the per-stage ratio.",
  "The intercooler approach has risen above the suction, which lowers the ratio each stage can take.",
  "The overall ratio has fallen, because the discharge pressure step from 1500.000000 to 1900.000000 psia is smaller than the previous one."],
 "The count climbs in steps and the ratio per stage records the same steps from the other side. Each stage takes less because there is one more of them.")

q(3, "Brake horsepower climbs smoothly down the sweep while the stage count climbs in steps. Why is that worth saying out loud?",
 "Because every step is a machine, a cooler and a foundation, and the power column gives no hint that one is about to happen.",
 ["Because the power column is the only one on the table that is derived rather than returned by the engine.",
  "Because a smooth power curve means the stage count is not affecting the work, so the extra machines are free.",
  "Because the steps in the count are what make the brake horsepower column non-monotonic between 1500.000000 and 1900.000000 psia."],
 "Those are two different kinds of quantity and they cost money in two different ways. Moving from 1500.000000 psia to 1900.000000 psia adds the fourth machine.")

q(2, "The sweep carries a column derived as the stated limit of 300.0000 degF less the hottest stage. How many of its nine rows come out negative?",
 "0 of the 9.",
 ["3 of the 9, on the rows where the engine reports both equally.",
  "2 of the 9, at the highest discharge pressures on the table.",
  "9 of the 9, because the approach of 110.0000 degF sits above the suction."],
 "A negative entry there would be a train running over the limit it was staged against. The column is non-negative on every row, on a duty whose approach sits above its suction.")

q(0, "The temperature-driven search runs over a fixed range of trial counts. What is that range and what happens past it?",
 "One stage to twelve, and past twelve it refuses rather than returning the best trial it had.",
 ["One stage to twelve, and past twelve it returns the twelfth trial with a warning attached to it instead.",
  "Two stages to twelve, since a single stage is settled by the ratio rule alone and needs no trial.",
  "One stage upward with no bound, ending when the discharge falls under the limit."],
 "Without a cap a duty whose limit cannot be met at any count would either run forever or hand back whatever the last trial produced, and the second of those looks like an answer.")

q(3, "The refusal at the cap reads: \"no practical stage count keeps the discharge temperature under the limit: 12 equal stages still reach 318.0 F against a stated limit of 110.0 F, from an inlet of 100.0 F\". What does that sentence contain?",
 "The count it gave up at, the temperature the best trial reached, the limit it was measured against and the inlet it was measured from.",
 ["The count it gave up at and the overall ratio it was working on, with the temperatures held back on the returned object.",
  "A recommendation to raise the stated limit, followed by the three figures that recommendation is based on.",
  "The count it gave up at and the ratio per stage that count implies, which together fix the discharge it reached."],
 "Nothing in that message requires the reader to re-run anything to understand what went wrong, which is the whole standard a refusal is held to here.")

q(1, "The cap is almost never what a user meets, because cheaper explanations are caught at the door first. What does a duty need before it can reach the cap at all?",
 "A discharge limit above the suction temperature, a readable efficiency, a workable ratio limit, and an overall ratio large enough that twelve equal stages are still too hot.",
 ["An overall ratio above 1000.000000000 and a stated discharge limit that the caller has left to the default.",
  "A polytropic efficiency of zero, since that is the only input the stage-count search does not guard.",
  "An intercooler approach below the suction temperature, which is what makes twelve equal stages the coolest arrangement available."],
 "A limit at or below the suction is refused by name as impossible, so it cannot reach the cap. Only the combination of all four gets through.")

q(2, "Beside its message the stage-count refusal carries its measurements. What are they on the probe that reaches the cap?",
 "Stage counts tried 12, coolest discharge 317.9889 degF, limit 110.0000 degF, inlet 100.0000 degF, overall ratio 1000.000000000.",
 ["Stage counts tried 12, coolest discharge 318.0 degF, limit 110.0000 degF and a ratio per stage of 2.204023061.",
  "Stage counts tried 12 and an overall ratio of 10.706521739, with the temperatures carried only inside the message.",
  "Stage counts tried 1000.000000000, coolest discharge 317.9889 degF and an inlet of 104.0000 degF."],
 "Each one answers a question a reader would otherwise have to re-run the engine to answer. The string is the headline and the numbers are the evidence.")

q(1, "The coolest discharge twelve equal stages could reach is 317.9889 degF against a stated limit of 110.0000 degF. What does the subtraction between them tell a reader?",
 "That the gap is 207.9889 degF, which is far too wide for cooling to be the lever.",
 ["That the gap cannot be read from those two figures without the inlet of 100.0000 degF as well.",
  "That the gap is 207.9889 degF, which the approach has to fall by.",
  "That the gap is 317.9889 degF, the figure the limit is taken from."],
 "A gap of a few degrees would say a colder cooler or a slightly higher limit closes it. A gap this wide says the fault is the limit or the pressure.")

q(0, "A stage count of 3 tells an engineer what to buy. What does the governing rule tell them?",
 "What to argue about, because it names which of the two inputs is the lever and which is slack.",
 ["How the count would change if the gas or the rate moved, since the governing rule is what carries them.",
  "Which stage on the train will be the hottest, which is where the discharge limit is judged against.",
  "Whether the count came from the search or from the closed form."],
 "If the temperature limit governed, a colder cooler or a higher stated limit is the lever and the ratio limit is slack. Pulling the slack lever changes nothing and costs a revision.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/advanced/fc3a_m02.json', expect_n=15)
finish()
