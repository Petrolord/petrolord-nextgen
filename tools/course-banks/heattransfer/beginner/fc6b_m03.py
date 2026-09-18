import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Associate m03, The Refusals That Protect a Balance. Written from
# digest.txt Section 2: the two wrong-way outlets and the zero duty, the duty
# that crosses the streams with its two evidence keys, the duty parallel flow
# cannot deliver and the counter-current answer beside it, and the arrangement
# read three ways.

q(1, "A study gives the studio streams a hot outlet of 320 F against a hot inlet of 300 F. What happens, and what does the message say?",
 "It is refused. The message quotes both temperatures and says an exchanger takes heat out of this stream.",
 ["It is answered with a negative duty, which the studio renders in red so a reader can see the direction is wrong.",
  "It is refused, and the message names the duty the two temperatures imply so a reader can see how far out the study is.",
  "It is answered, because a hot outlet above a hot inlet is a heating case and the balance carries both directions."],
 "The guard runs before any arithmetic, so the message can quote only the inputs, which is exactly what the person reading it has to change."),

q(2, "What would have reached a surface if that wrong-way outlet had not been guarded?",
 "A negative hot drop, a negative duty with it, and a cold outlet below the cold inlet, every one of which prints perfectly well.",
 ["A duty of zero, because the balance would have clamped the drop at nothing rather than letting it go the wrong way.",
  "A refusal one door further down, at the log mean, which cannot take a negative end difference and would have caught it there.",
  "An infinite surface, because a negative duty divided by a positive driving force cannot produce a usable area."],
 "A negative duty in a report looks like a sign convention rather than a mistake, which is why the check runs before the computation rather than after it."),

q(0, "A cold outlet of 94 F is given against a cold inlet of 100 F. Why does the module carry this guard separately from the hot-side one?",
 "Because the balance can be reached through either outlet, so each stating needs its own check.",
 ["Because the two guards quote different units, and a module that converts nothing silently needs one guard for each.",
  "Because the cold side is checked after the duty has been computed and the hot side before it.",
  "Because only the cold outlet can be stated as a target, so its guard is the one a saved study reaches."],
 "A module guarding only the stating it expected people to use would pass the other one straight through. The message here says an exchanger puts heat into this stream."),

q(3, "A stated duty arrives as 0. What does the balance do, and why is a zero worth a guard of its own?",
 "It refuses and quotes the zero back, because an empty box and a cleared field both look like a zero by the time they reach a number.",
 ["It answers with a surface of zero, which is the arithmetically correct answer to a duty of nothing and does no harm downstream of it.",
  "It refuses, because a zero duty would divide by zero in the area and produce an infinite surface.",
  "It substitutes the duty the stated outlets imply, since a zero can only mean the box was left empty."],
 "A zero or a negative duty is not an exchanger. The difference between a refusal and a zero duty carried quietly onward is the difference between a question and a wrong answer with a surface attached to it."),

q(2, "A duty is asked for that would leave the studio hot stream at -45.45 F and the cold stream at 218.75 F. What is wrong with that state?",
 "The hot stream would be cooled below the 100 F cold inlet and the cold stream heated above the 300 F hot inlet, so the two would have to pass through each other.",
 ["The hot outlet is below zero on the Fahrenheit scale, which is outside the band the balance carries.",
  "The two outlets are on the wrong sides of each other, which parallel flow cannot deliver although a counter-current unit can.",
  "The duty exceeds what the smaller capacity rate can carry across the span between the two inlets at any arrangement."],
 "Between the two inlet temperatures is the only range either stream can end up in while heat flows one way. No exchanger of any size does what this duty asks."),

q(1, "That refusal carries two extra keys beside the message. What are they called and what do they hold?",
 "thOutIfReached and tcOutIfReached, holding -45.454545 and 218.750000 degF, which are the temperatures the duty asked for would imply.",
 ["thOut and tcOut, holding -45.454545 and 218.750000 degF, which are the outlet temperatures this exchanger would run at once it reached the stated duty.",
  "dt1 and dt2, holding the two end differences the duty implies, which is what makes the crossing visible.",
  "thOutIfReached and tcOutIfReached, holding the nearest pair of outlets that would have been accepted."],
 "The names are conditional on purpose. Those are not temperatures anywhere in any exchanger, and they are handed back so a caller can show why a state is impossible rather than only assert it."),

q(0, "The message on that refusal says -45.45 F while the key beside it reads -45.454545. Which do you use, and what is the rule?",
 "The key. A message is rounded for reading, so a figure scraped out of one carries the sentence's rounding into whatever it is used for.",
 ["The message, because it is the figure the engine chose to publish and the keys are internal.",
  "Either, because the two agree to the precision this course prints and a rounding at that depth cannot reach an area.",
  "The key on a refusal and the message on an answer, because only a refusal carries figures at full precision."],
 "The same rule holds on the answers and not only on the refusals. If you need the figure, read the key."),

q(3, "Why does the crossing refusal name no area, no coefficient and no arrangement?",
 "Because none of them would help. A bigger exchanger drives the outlets further apart in the same direction and makes the crossing worse.",
 ["Because the guard runs before the area door has been called, so those figures do not exist yet.",
  "Because the message is deliberately kept short, and every number a caller needs is carried on the two evidence keys that sit beside it.",
  "Because an arrangement is only ever named where a test for that arrangement was applied, and this refusal comes before any such test has been reached."],
 "This refusal is about the two streams and nothing else. It differs from the parallel refusal exactly there, because that one ends by naming the arrangement that can deliver the duty."),

q(2, "A duty of 5200000 Btu an hour is asked of the studio streams in parallel flow. What comes back?",
 "A refusal, with the two outlet temperatures it would take, 110.909091 and 165.000000 degF, handed back as evidence.",
 ["An answer, at 5200000.0000 Btu an hour, carrying a note that says the parallel arrangement is close to the limit of what it can deliver.",
  "A refusal that names no figures, because parallel flow is infeasible here whatever the temperatures work out at.",
  "A refusal, with the two inlet temperatures quoted, since those are what bound a parallel-flow duty."],
 "The message says the two streams would leave at 110.91 F hot and 165.00 F cold, so they must have crossed inside, and that a counter-current unit can take this duty."),

q(0, "The same duty of 5200000 Btu an hour is put to a counter-current unit. What comes back, and how does it compare with the evidence on the parallel refusal?",
 "An answer of 5200000.0000 Btu an hour with outlets of 110.909091 and 165.000000 degF, which is the parallel evidence figure for figure.",
 ["An answer at a lower duty, because a counter-current unit reaches these terminals only by moving less heat than was asked for in the first place.",
  "An answer carrying the same two outlet temperatures in the other order, since counter-current flow pairs each inlet with the other stream's outlet.",
  "A refusal of its own, because a duty that puts the hot outlet below the cold outlet would do that in either of the two arrangements."],
 "The balance had worked out both outlet temperatures before it decided to refuse. The computation is the same computation, and only the test applied to its result changed."),

q(1, "Why can parallel flow not take the hot outlet below the cold outlet at any area?",
 "Because both streams leave at the same end, so the two are still in contact there and the hot one cannot have got below the cold one.",
 ["Because the parallel log mean is fixed by the two inlet temperatures alone, so the outlets of a parallel unit cannot move once its inlets are set.",
  "Because the parallel pairing puts the two inlets together at one end, and a pairing built that way leaves no room at all for a crossing.",
  "Because a parallel unit is a single pass, and the outlets of one pass are fixed entirely by the two inlets that the pass started from."],
 "In counter-current flow the streams enter at opposite ends, so the leaving hot stream meets the entering cold stream at 100 F and is free to go below the cold outlet, which it never meets."),

q(2, "The arrangement is given as Parallel, with a capital letter, on the studio terminals. What is the log mean?",
 "120.584840 degF, which is the parallel figure, because case and the spaces around the word do not decide which method runs.",
 ["130.064846 degF, because an unrecognised string falls back to the default arrangement, which is counter.",
  "120.584840 degF, and the answer carries a note naming the arrangement it matched the string to.",
  "A refusal, because the module matches its arrangements exactly and Parallel is not one of the three it carries."],
 "An arrangement arriving from a dropdown, a saved file or somebody's typing all reach the same place. The counter-current figure on those same four temperatures is 130.064846 degF."),

q(3, "An arrangement of crossflow is given. What does the module do?",
 "It refuses, names counter, parallel and shell1 as what it carries, and states that it will not fall back to one of them.",
 ["It refuses and names the door and the check that rejected the string, so a caller can go and read the rule for themselves.",
  "It answers on the counter-current pairing and reports its basis as counter, so the substitution is visible on the answer.",
  "It answers and attaches a note saying a cross-flow correction has not been applied to the figure."],
 "Two things are done at once. The list saves a trip to the source, and the stated policy of not substituting tells a reader something about every other answer this module gives."),

q(1, "Suppose the module fell back to counter-current flow instead of refusing an arrangement it does not carry. What would that cost on the studio terminals?",
 "You would have asked for cross flow and received 130.064846 degF, in range and plausible and the counter-current figure under another name.",
 ["You would have received 120.584840 degF, which is the parallel figure, since a fallback takes the lower of the two driving forces available on those four terminals.",
  "Nothing on these terminals, because the two pairings agree to within the precision this course prints.",
  "You would have received a refusal one door later, at the area, where a driving force from an unknown arrangement is caught."],
 "Compare it with the parallel figure of 120.584840 degF on the same four temperatures and the size of the gap a silent fallback would hide is visible. A refusal costs a minute."),

q(0, "What makes the arrangement part of the question rather than a label on the answer?",
 "The test the balance applies is the test for the arrangement it was given, so changing the word changes which states are reachable.",
 ["The arrangement decides which of the two capacity rates governs the balance, so it changes the duty itself before any test is applied to it.",
  "The arrangement is carried on the answer as the basis key, and that key is what each later door reads when it picks the method to run.",
  "The arrangement fixes the correction factor, which multiplies the driving force and so moves every duty a unit can reach."],
 "There is no single feasibility check here that both arrangements share. Ask under parallel flow and the parallel test runs, and a study whose arrangement was set once and never looked at again can refuse duties the machine on the plot would deliver."),
emit(Q, '/root/fc-wip-heattransfer/banks/fc6b_m03.json', expect_n=15)
finish()
