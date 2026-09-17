import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Professional m01, P, R and the correction factor.
# Every figure is from digest Section 7 at the rendering that section prints.
# No question asks for a ratio between two rows of the R 0.900000 sweep,
# because the engine computes none and the digest prints none.

q(1, "The letter P appears throughout this module. What does it stand for here?",
 "The dimensionless temperature group formed from the four terminal temperatures.",
 ["A percentile of a distribution over the four terminal temperatures.",
  "The pressure the shell side is rated at, in psia.",
  "The fraction of the design duty this exchanger delivers."],
 "Nothing in this course is a percentile, so no percentile label belongs anywhere in it. The letter carries other meanings elsewhere on this platform, which is why the first lesson that uses it says which one applies.")

q(0, "R is the second of the two groups the correction factor is written in. What is it formed from?",
 "The hot stream drop over the cold stream rise.",
 ["The cold stream rise over the span between the two inlets.",
  "The corrected driving force over the counter-current log mean.",
  "The fraction of the largest heat transfer this machine could move."],
 "P is the cold rise over the inlet span and R is the hot drop over the cold rise. Both are pure numbers, which is what lets one correction be written for exchangers of any size.")

q(2, "The studio case and ORON both have their groups out of a balance. What are they?",
 "P 0.171875 and R 2.909091 on the studio case, P 0.204107 and R 2.416739 on ORON.",
 ["P 0.171875 and R 2.416739 on the studio case, P 0.204107 and R 2.909091 on ORON.",
  "P 2.909091 and R 0.171875 on the studio case, P 2.416739 and R 0.204107 on ORON.",
  "P 0.204107 and R 2.909091 on the studio case, P 0.171875 and R 2.416739 on ORON."],
 "The studio case is the shipped default of the live app and ORON is a four-pass exchanger with its own loop. They share nothing, so a figure from one never belongs to the other.")

q(3, "The correction answer comes back on four keys. Which four?",
 "The factor, the shell pass count, the equivalent single-shell P and a warning slot.",
 ["The factor, the two groups it was formed from, and a warning slot that is empty on a plain answer.",
  "The factor, the log mean it corrects, the corrected driving force and a warning slot.",
  "The factor, the shell pass count, the area it implies and a warning slot."],
 "The same P and R give a different factor at every shell count, so a factor without its count cannot be identified. The equivalent single-shell P is the value the closed form was actually read at.")

q(0, "What is the correction factor on the studio case at one shell pass?",
 "0.964693, which is what a low P buys.",
 ["0.957197, which is the figure ORON returns at the same door.",
  "0.171875, which is the group the factor was computed from.",
  "1.000000, because a low P leaves nothing at all to correct."],
 "ORON sits at 0.957197 on the same door, from its own groups. Neither case reaches one, because neither has a vanishing cold rise.")

q(2, "The area on this engine is the duty divided by the coefficient, the factor and the log mean. What follows for the factor?",
 "An error of one percent in it is an error of one percent in the surface.",
 ["An error in it is absorbed by the tube count rounding before it reaches the surface.",
  "An error in it moves the surface only where the factor sits below one.",
  "An error in it moves the log mean by the same amount in the other direction."],
 "Nothing stands between those three inputs and the area. That is why the factor is worth a module of its own at this tier, and why a factor read off a chart at the wrong R is expensive.")

q(1, "One sweep holds R at 0.900000 and walks P upward. Where does the steep-curve warning first appear?",
 "At a P of 0.550000, where the factor is 0.751428.",
 ["At a P of 0.520000, which is the first row where the factor falls below 0.900000.",
  "At a P of 0.600000, where the warning appears for the first and the only time.",
  "At a P of 0.450000, which is the last row the engine answers with no warning."],
 "The warning arrives on the fifth of the seven rows and stays on for the two rows above it. The four rows below it are answered with no warning at all.")

q(3, "A row of that sweep comes back with the warning attached. What is the engine saying?",
 "It has answered, and the curve is steep here, so a small temperature error swings the area badly.",
 ["It has answered, and the factor it returned has been capped at the steepest value it will report.",
  "It has declined to answer, and the caller is expected to read the factor off a published chart instead.",
  "It has answered, and the four temperatures behind the factor sit outside the domain the closed form is written over."],
 "A warning is an answer and the factor beside it is correct. The remedy the engine names is another shell pass rather than accepting a fragile number.")

q(2, "At a P of 0.620000 and that same R of 0.900000 the engine stops answering. What does it return?",
 "A refusal saying the configuration cannot reach this duty, and telling the caller to add a shell pass.",
 ["A factor lower than the one at 0.600000, with the steep-curve warning still attached.",
  "A factor of zero, which is how it reports a duty at the end of the curve.",
  "A refusal saying the four terminal temperatures disagree with the duty they were given."],
 "It does not walk off the end of the curve quietly and it does not hand back a lower factor. The step from the last warned row to the refused one is from a P of 0.600000 to a P of 0.620000.")

q(0, "As P tends to zero the factor tends to one, at every R. Why is that the right answer?",
 "A vanishing cold rise is a vanishing departure from counter-current flow, so nothing is left to correct.",
 ["A vanishing cold rise makes the two end differences equal, and equal ends need no correction.",
  "A vanishing cold rise puts the unit on the flat part of the curve, where the correction rounds to one.",
  "A vanishing cold rise makes R vanish with it, and the form returns one at a zero R."],
 "The limit is analytic, so it needs no publication behind it. A table that failed to show it would be a table with an error in it.")

q(1, "One column of the limit table is evaluated by a branch written for that case alone. Which one?",
 "The column at an R of 1.000000.",
 ["The column at an R of 0.400000.",
  "The column at an R of 3.000000.",
  "The column at an R of 1.700000."],
 "A ratio of exactly one makes the general closed form indeterminate. That branch climbs to one exactly as the four general columns do, which is a real check on both.")

q(3, "The factor refuses a P of exactly one. What does that state mean physically?",
 "The cold stream would be leaving at the hot inlet temperature.",
 ["The hot stream would be giving up no temperature at all.",
  "The two streams would have crossed somewhere inside the exchanger.",
  "The cold stream would be leaving the exchanger colder than it entered it."],
 "The message quotes the bound and the value it was handed: the factor needs a P at or above zero and below one. That is outside the domain the closed form is written over.")

q(2, "And it refuses an R of zero. What does that state mean physically?",
 "The hot stream would be giving up no temperature at all.",
 ["The hot stream would be leaving hotter than it entered.",
  "The shell pass count would have been given as zero.",
  "The two streams would be entering at the same temperature."],
 "Both bounds quote the value they were given back to the caller. That is the difference between a refusal somebody can act on and an error somebody has to guess at.")

q(0, "P and R are asked for on a cold stream that leaves at the temperature it entered. What does the engine do now?",
 "It refuses, saying R is undefined and that no number of shell passes changes that.",
 ["It returns R as Infinity and lets the correction factor report the shell count as the fault.",
  "It returns R as zero and answers the correction factor at that value.",
  "It returns the groups and attaches the steep-curve warning to them."],
 "The second half of that engine message describes what the module used to return, and it is quoted whole because shortening it would change what the engine says. The behaviour now is the refusal.")

q(1, "The published correction cases print an engine column beside a golden column. What does their agreement buy?",
 "Evidence about the method, because the golden column is written by the oracle on a different route.",
 ["Evidence that the engine reproduces its own answer on a second call.",
  "Evidence that the fitted constants inside the correlation were taken from a publication.",
  "Evidence that the factor was read at the right shell count on each row."],
 "A golden figure is not the engine answering again. Where the two columns agree to every digit printed, two independent routes have landed on the same number.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/intermediate/fc6i_m01.json', label='fc6i_m01', expect_n=15)
finish()
