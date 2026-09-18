import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Associate m04, The Log Mean Driving Force. Written from digest.txt
# Section 3: the two pairings and which ends they form, the arithmetic mean the
# log mean sits strictly below, equal ends and the flag that reports them, the
# shell reading and its note, and the two refusals this door gives.

q(2, "In counter-current flow, which two temperature differences is the log mean built from?",
 "Each inlet paired with the other stream's outlet, because the hot stream enters where the cold stream leaves.",
 ["The two inlets paired together and the two outlets paired together, which is the pairing at each end of the unit.",
  "The hot inlet paired with the hot outlet, and the cold inlet with the cold outlet, which are the two spans the streams travel.",
  "The largest and the smallest of the four differences that can be formed among the terminals of the exchanger."],
 "On the studio terminals that gives a hot inlet of 300 F facing a cold outlet of 134.375000 degF, which is 165.625000 degF, and a hot outlet of 200.000000 degF facing a cold inlet of 100.000000 degF, which is 100.000000 degF."),

q(0, "The studio case in parallel flow has end differences of 200.000000 and 65.625000 degF. What is its log mean, and how does it compare with the counter-current figure on the same four temperatures?",
 "120.584840 degF, below the counter-current 130.064846 degF.",
 ["132.812500 degF, above the counter-current 130.064846 degF.",
  "130.064846 degF, the same as the counter-current figure, since both pairings use all four terminals.",
  "120.584840 degF, above the counter-current 130.064846 degF, because the parallel ends are further apart."],
 "One end got wider and the other got much narrower, and the mean came out below the counter-current one. The log mean is pulled down hard by the narrow end."),

q(1, "What is the relationship between a log mean and the arithmetic mean of the same two ends?",
 "The log mean is strictly below it whenever the ends differ, and equal to it when they do not.",
 ["The log mean is strictly below it in counter-current flow and strictly above it in parallel flow.",
  "The log mean is below it whenever the ends are more than about ten degF apart and equal within that.",
  "The log mean is below it on every case the module carries, which is a measurement rather than a limit."],
 "That is an analytic limit rather than a result of the code. It needs no publication, so a reader can check it on any row of any table in this course."),

q(3, "The studio case has an arithmetic mean of 132.812500 degF in counter-current flow and 132.812500 degF in parallel flow. Why are those two the same figure?",
 "Because half the sum of the two ends is the same in both pairings, since both use all four terminals with the same signs.",
 ["Because the arithmetic mean is taken across the two inlet temperatures, and those two do not move at all when the arrangement changes.",
  "Because an arithmetic mean is reported only once for a case, on the arrangement the engine worked from.",
  "Because the two pairings are the same pairing written in the other order, so nothing about them differs."],
 "Only the log mean tells the two arrangements apart, at 130.064846 degF counter and 120.584840 degF parallel, which alone should stop anybody using an arithmetic mean as a driving force."),

q(0, "Published case 6 has ends of 300.000000 and 10.000000 degF. Its log mean is 85.264090 degF and its arithmetic mean 155.000000 degF. What does that row show?",
 "That two ends as far apart as these put the log mean far below the arithmetic mean, while equal ends put the two together.",
 ["That the log mean approaches the smaller of the two ends as they separate, which is the reason it lands near 10.000000 degF on this row.",
  "That an arithmetic mean may be used where the ends are close and must be avoided beyond about a hundred degF.",
  "That the published cases were chosen to bracket the studio case, which sits between them on both means."],
 "Read it against published case 3, where both ends are 280.000000 degF and the two means are the same number. The direction is what the table shows, and this course goes no further with it."),

q(2, "Both ends of published case 3 are 280.000000 degF. What does the closed form do there, and what does the engine return?",
 "The closed form would divide zero by zero, so the module handles the case directly and returns a log mean of 280.000000 degF.",
 ["The closed form returns the arithmetic mean instead, which at equal ends is also 280.000000 degF.",
  "The closed form is evaluated one digit either side of the equality and the two results are averaged.",
  "The closed form refuses, because a ratio of one has a logarithm of zero and nothing can be divided by it."],
 "As the two ends approach each other the log mean approaches their common value, so at equal ends it is that value. The equal-ends flag on that answer reads yes."),

q(3, "The log mean answer carries an equal-ends flag. On which answers does it appear?",
 "On every one. It reads no on the studio case and on ORON in both pairings, and yes on published case 3.",
 ["Only where the two ends are equal, which is its purpose, so its absence is what tells a caller the general branch ran.",
  "Only on the counter-current readings, because equal ends can arise there and cannot arise in parallel flow.",
  "On every answer except a refusal, where the two end differences are handed back in its place instead."],
 "A caller never has to decide whether two ends were close enough to worry about. The engine has already decided and publishes the decision."),

q(1, "An exchanger with equal ends is not a contrived input. When does it arise in counter-current flow?",
 "When the hot drop equals the cold rise, which is when the two capacity rates are equal.",
 ["When the two streams are the same fluid, so the same heat capacity appears on both sides of the balance.",
  "When the duty is at the largest value the two streams can exchange, which closes both ends at once.",
  "When the arrangement is shell1, because a shell pass and two tube passes make the two ends meet."],
 "That is why it deserves a flag rather than a guard. It is a case an engineer will actually meet."),

q(0, "The shell1 reading is asked for on the studio terminals. What number comes back, and what basis is reported?",
 "130.064846 degF, with the basis reported as counter, because that is the pairing the engine ran.",
 ["120.584840 degF, with the basis reported as shell1, since a shell exchanger pairs its ends the parallel way.",
  "130.064846 degF, with the basis reported as shell1, because the arrangement asked for is the one reported back.",
  "A figure between the two pairings, with the basis reported as shell1, since a 1-2 shell unit is part counter and part parallel."],
 "The engine reports the method it ran rather than the arrangement you asked about. Those are two different facts and it publishes the one that matters for checking."),

q(1, "What does the note on the shell reading tell a caller about the figure beside it?",
 "That a 1-2 shell exchanger is rated on the counter-current log mean multiplied by F, so the figure returned is one multiplication short of a corrected driving force.",
 ["That the counter-current pairing was substituted because the shell pairing is not carried, so the figure should be treated as approximate.",
  "That the figure is the corrected driving force already, with the correction applied silently at this door.",
  "That a shell exchanger needs a second log mean taken across its second tube pass before any surface can be sized."],
 "It is a note rather than a refusal, because the counter-current log mean genuinely is the first half of what a shell exchanger is rated on. A silent answer would be worse, because the figure looks finished."),

q(2, "A caller takes 130.064846 degF from the shell reading and puts it straight into a surface. What has gone wrong?",
 "The surface has been sized on a driving force larger than the one the unit will run at, so it comes out smaller than it should be.",
 ["The surface has been sized on the parallel pairing, so it comes out larger than the counter-current answer would be.",
  "Nothing has gone wrong yet, because the correction factor is applied at the area door rather than at this one.",
  "The surface carries the units of the shell reading rather than of an area, so the figure is not an area at all."],
 "The number is right. The use of it is wrong, and the note is sitting there saying so. A correction factor is at or below one, so the corrected driving force is at or below the figure returned."),

q(3, "A log mean is asked for with only three of the four terminal temperatures. What comes back?",
 "A refusal that names the missing terminal, saying tcOut was not given.",
 ["A refusal saying an input is missing, without naming which one.",
  "An answer built on the three terminals given, with the fourth worked out from the duty and the capacity rates.",
  "A refusal that names the missing terminal and offers the value it would take if the duty were held fixed."],
 "Naming the terminal is the difference between a message you can act on and a message you have to investigate. A log mean is built from four temperatures by subtraction and cannot be worked out from a duty."),

q(1, "A counter-current log mean is asked for on a pair of streams whose two ends have both closed to zero. What comes back, and what rides beside it?",
 "A refusal naming a temperature cross, with the two end differences dt1 and dt2 beside it at 0.000000 and 0.000000 degF.",
 ["An answer of 0.000000 degF, since a driving force of nothing is a legitimate answer to a pair of closed ends.",
  "A refusal naming a temperature cross, with the four terminal temperatures beside it so a caller can see which one closed the ends.",
  "A refusal naming a division by zero, since the logarithm is what fails first and the message reports the arithmetic."],
 "An end difference of zero means the two streams have reached the same temperature at that end, and a negative one means they have passed each other. Neither can be fed to a logarithm."),

q(0, "Why does that cross refusal name the arrangement it was working in?",
 "Because the arrangement decided which two ends were formed, and a pair of terminals that crosses in one pairing need not cross in the other.",
 ["Because every message in this module names an arrangement, so that a saved study can be reconstructed from its messages.",
  "Because the cross is tested only in counter-current flow, and the name tells a reader the test was run.",
  "Because the arrangement is what the caller most often has wrong, so the message names it before the temperatures."],
 "The two ends are formed by the pairing, so which differences went to zero depends on the word the caller gave."),

q(2, "Six rows of the log mean table carry a golden figure. What is a golden figure there?",
 "The oracle's own answer, reached by integrating the driving force rather than by evaluating a closed form.",
 ["The engine's answer recorded a second time, kept in a file so a change to the code shows up as a difference.",
  "A published measurement from a plant test, which is what makes those six rows the evidence in this table.",
  "The figure the closed form gives at the published inputs, rounded to the precision this course prints at."],
 "A golden figure beside an engine figure is two methods meeting. Even so it has a blind spot: a check comparing a formula against a file written from the same formula cannot see an error made in both, and the analytic limit covers exactly that."),
emit(Q, '/root/fc-wip-heattransfer/banks/fc6b_m04.json', expect_n=15)
finish()
