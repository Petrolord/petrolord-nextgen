import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Expert m02, The Customary Depressuring Time. Digest section 22.

q(1, "A depressuring study is run to ask whether a vessel is down inside the customary fifteen minutes. What does this engine hold about that figure?",
 "Nothing at all. There is no constant for it, no returned flag and no verdict of any kind.",
 ["It holds it as the limit the march refuses at, which the course bisects out at 7199.999985603571 s.",
  "It holds it as a warning edge, so a run past 900.000000 s returns a note.",
  "It holds it as the default stopping point of a march, so a call with no end pressure stated runs to fifteen minutes."],
 "The march returns 268.419002 s on AFIESERE, which is 4.473650 min, and stops there. Comparing that against a limit is your act, on a limit you stated, for a case you chose.")

q(3, "One time limit does live inside this route, bisected out of the engine's own behaviour at 7199.999985603571 s. What kind of statement does it make?",
 "A refusal about the computation, carrying `error` and naming the input most likely to be at fault.",
 ["A verdict about the design, since a vessel that cannot empty inside it has failed its depressuring case.",
  "A warning on a successful answer, so the time still comes back and carries a note beside it.",
  "A ceiling on the trajectory, past which the march returns the stations it has and adds no more."],
 "The message is `did not reach the end pressure inside the time limit: check the orifice size`. That limit and the customary target are easy to confuse: one is an engineering criterion you supply and the other an internal budget past which this implementation will not go.")

q(0, "Doubling the orifice from 1.000000 in to 2.000000 in takes the time from 419.404662 s to 104.851242 s, a ratio of 0.250000182473. What does that say the time runs with?",
 "The area of the hole, since the mass rate through a choked throat goes with the throat area.",
 ["The diameter of the hole, which the two rows quoted show halving the time as the diameter doubles.",
  "The cube of the diameter, which is what the printed ratio works out to across a doubling.",
  "The pressure ratio, which the orifice moves by the same factor that it moves the clock."],
 "That is the only ratio the course computes anywhere on this sweep, which is why it is the only one you may quote from it. Every ratio you form yourself down a printed table is a figure nothing stands behind.")

q(2, "The substep column reads 0 on every row of the orifice sweep, from 0.500000 in through to 3.000000 in. What is that column a statement about?",
 "The step size against these geometries, since no step here would have removed more than a twentieth of the inventory.",
 ["The orifice, since an orifice inside the swept range never needs a step subdivided.",
  "The choked assumption, since subdividing is what the march does as it crosses its own floor.",
  "Convergence, since a march that has converged subdivides nothing by definition."],
 "At the same step size the small-vessel and large-orifice cases in the next module subdivide every step they take. The column is about what a fixed step has to work with rather than about the orifice on its own.")

q(3, "The design question runs backwards: which orifice meets a stated time. The engine has no route for it. How does the course fill that gap, and why that way?",
 "By bisecting on the engine's own returned time, because that answers the question about the engine rather than about a formula beside it.",
 ["By rearranging the closed form of the march for the diameter, since that closed form and the marched time agree to about a part in a million anyway.",
  "By interpolating between the sweep rows at 0.500000 in and at 0.750000 in, since the time falls monotonically right across that whole interval.",
  "By selecting from the published ladder, since a blowdown restriction comes off the same 14 standard areas."],
 "The answer is defined as a diameter at which the engine returned the target, so anything a rearrangement could have got wrong is now impossible to get wrong. A solve against the engine and algebra beside it are different kinds of claim.")

q(1, "The bisected answer is 0.682646 in, where the march returns 900.000000 s. Which two rows of the sweep show the answer had to lie where it did?",
 "0.500000 in at 1677.618587 s and 0.750000 in at 745.608268 s, which straddle the target.",
 ["0.750000 in at 745.608268 s and 1.000000 in at 419.404662 s, the two rows nearest the target in time.",
  "1.250000 in at 268.419002 s and 1.500000 in at 186.402100 s, the rows the stated AFIESERE case sits between.",
  "0.500000 in at 1677.618587 s and 0.682646 in at 900.000000 s, the bracket the bisection finally closed on."],
 "A bisection needs its answer inside its bracket and cannot tell you when it is not. Reading the result back against the sweep is the cheap confirmation that it was.")

q(2, "Across eight orifices the final temperature column reads 340.807983 degR on every row, and the course counts the distinct values at 1. Why is the count worth more than the column?",
 "It turns a plausible claim about the model into a measurement made on the engine.",
 ["It proves the temperature right, since eight runs agreed on it.",
  "It shows the march converged, since one end state comes back whatever the step.",
  "It shows the step was fine enough, since a coarse step would spread the column."],
 "Somebody could assert that the end state is independent of the orifice and it would sound like a fair claim about a model. The sweep is what makes it a reading instead.")

q(0, "What is the AFIESERE final temperature of 340.807983 degR fixed by?",
 "The pressure ratio across the blowdown and the isentropic exponent.",
 ["The orifice and the discharge coefficient, which together set how fast the expansion happens.",
  "The start temperature of 545.000000 degR and the 268.419002 s the march took to get down.",
  "The choked floor of 26.758009 psia, which is the coldest state this march can reach."],
 "The orifice decides only how long the vessel takes to get there, which is harder to hold than it looks because the orifice is the one thing a designer can change. What does move the end state is the end pressure, and the course walks seven of them.")

q(3, "Taken to 600.000000 psia the vessel finishes at 464.976597 degR with 0.432854 of the inventory gone; taken to 25.000000 psia it finishes at 232.011700 degR with 0.952641 gone. What may be said about that table?",
 "The directions only. A deeper blowdown runs longer, ends colder and removes more, and no ratio between any pair is printed.",
 ["That the final temperature falls in proportion to the end pressure the march was given, which those two rows are enough on their own to establish.",
  "That the fraction removed and the final temperature move together, so either may be quoted in place of the other.",
  "That the time runs with the inventory removed, since the two columns rise together all the way down."],
 "Both figures in any quotient you form are real engine output, and that does not make the quotient anything. Ask first whether two quantities are entitled to be compared, and only then compare them.")

q(2, "The bottom row of the end-pressure table, at 25.000000 psia, crosses the choked floor of 26.758009 psia and carries the engine's warning. Which figure on that row does the warning bear on?",
 "The time of 540.397236 s, which it names, while 232.011700 degR is still the end state for that pressure ratio.",
 ["Both of them, since a run taken past the floor is no longer the model that either of the two figures on the row came from.",
  "The final temperature, since the choked assumption is what carries the expansion going on inside the vessel all the way down.",
  "The fraction removed of 0.952641, since the mass leaving is what the choked assumption governs."],
 "Read a warning for its scope as much as for its direction. This one says the time below the floor is optimistic and says nothing else, so the reading to discount is the clock.")

q(0, "Down the orifice sweep the step count falls from 16777 at 0.500000 in to 467 at 3.000000 in. What explains that?",
 "The step size is held fixed across the sweep, so a shorter march needs fewer steps.",
 ["A larger orifice lets the march take longer steps.",
  "The march thins a short run harder, and the count follows the stations.",
  "The inventory budget bites at small orifices, so the extra steps are subdivided."],
 "The step is 0.100000 s on every row, so the count is the clock divided by it. The substep column stays at 0 throughout, so not one of those steps is a subdivided one.")

q(1, "What is 0.682646 in a property of?",
 "This march on this vessel, at these gas properties, this discharge coefficient and this step size, reaching 145.000000 psia in 900.000000 s.",
 ["The vessel, since the orifice that empties it in a stated time is fixed once the volume and the two pressures are.",
  "The standard ladder, since it is the area below which a blowdown restriction has to be doubled up.",
  "The closed form, since the course solved that integral for the diameter that lands on 900.000000 s."],
 "It is not an orifice anybody can buy, and turning it into hardware is a separate step. The API 526 ladder the Associate tier worked through is a table for pressure relief valves rather than for blowdown restrictions.")

q(3, "This module treats a time, an orifice and a final temperature as three different kinds of object. Which grouping is the module's?",
 "A time is a reading, an orifice is a solve and a temperature is a consequence.",
 ["A time is a solve, an orifice is a reading and a temperature is an input to both.",
  "All three are outputs of one call, which is why the sweep prints all three on one row.",
  "A time and a temperature are readings, and the orifice is the input."],
 "Treating all three as outputs of one call is how a reader ends up quoting the one the engine was least asked about. The temperature is the clearest case, since the orifice sweep never tested it at all.")

q(0, "A colleague quotes 268.419002 s as the depressuring time for this vessel. What has that figure silently brought with it?",
 "Every input that run was given, down to the step size the march happened to be called with.",
 ["An acceptance criterion of some kind, since a time comes back only for a run that the engine has judged to have passed.",
  "A trimmed clock, since the time that comes back covers only the part of the march over which the flow was actually choked.",
  "A tolerance of its own, since the march reports a time only to the precision that its own step size is able to support."],
 "Move any one of them and the whole curve moves, so the curve is a property of the vessel and the assumptions together. That is why a study quotes both, and why a time on its own looks exactly like a fact about the vessel.")

q(2, "What does this module ask you to write down beside a depressuring time, and why?",
 "The limit you are judging against and where it came from, because the engine records no criterion of its own.",
 ["The step count and the station count, because the customary fifteen-minute judgement is the one that gets made on those two.",
  "The orifice that would have bought exactly fifteen minutes, because the comparison is made against that.",
  "The final temperature, because the customary time is stated for the end state rather than for the clock."],
 "A bare time in a report looks exactly like a passing time. The engine holds no fifteen minutes, so the criterion and its source are yours to carry.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/advanced/fc5a_m02.json', label='fc5a_m02', expect_n=15)
finish()
