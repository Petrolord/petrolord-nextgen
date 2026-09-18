import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Professional m03, the coefficient from its parts.
# Every figure is from digest Sections 9 and 10 at the rendering they print.
# The declared reporting threshold and the fouling identity are taught as
# this module's own choices, never as published results.

q(1, "The overall coefficient here is assembled rather than looked up. Which five resistances go into it?",
 "The outside film, the outside fouling, the wall, the inside film and the inside fouling.",
 ["The outside film, the outside fouling, the wall, the inside film and the tube metal itself.",
  "The shell film, the shell fouling, the wall, the tube film and the bundle clearance.",
  "The outside film, the wall, the inside film, the driving force and the reference area."],
 "The five are named on the answer and so is each one's share of the total. A coefficient that arrives as one figure tells you what the surface carries, and one that arrives as five tells you where to spend money.")

q(3, "On the studio case the five resistances add to 0.010856543 hr.ft2.F per Btu. What is U dirty?",
 "92.110348, which is one over that total.",
 ["134.459410, which is one over that total.",
  "0.010856543, which is the total restated.",
  "31.495796, which is the total read as a percentage."],
 "The five rows added come to 0.010856543 against the engine's own total of 0.010856543. That addition is stated in the answer rather than left to a reader.")

q(0, "U clean on the same case is 134.459410. Which terms produce it?",
 "The three terms that are not fouling allowances.",
 ["The two films, taken without the wall between them.",
  "The three largest terms in the resistance stack.",
  "The five terms with the inside pair left unconverted."],
 "Clean means the two allowances have been left out, so the clean figure is the coefficient of a surface on the day it is commissioned. The surface a plant buys is sized on the dirty one.")

q(2, "Which of the five carries the largest share of the studio stack, and how large is it?",
 "The outside film, at 46.055174 percent.",
 ["The inside film, at 20.341632 percent.",
  "The inside fouling allowance, at 22.284762 percent.",
  "The outside fouling allowance, at 9.211035 percent."],
 "Resistances in series add, so the largest term dominates and improving a small one buys almost nothing. That is why the share column is worth as much as the resistance column.")

q(0, "This coefficient is referred to one surface, and the engine says which on every answer. What does it report?",
 "The outside tube surface, written out in words beside the number.",
 ["The bore of the tube, written out in words beside the number it belongs to.",
  "The mean of the two tube surfaces, written on a key of its own beside the number.",
  "Whichever surface the larger of the two films sits on."],
 "A second export in this engines package is also an overall coefficient and it is referred to a stated bore instead. Two different quantities on the same tube, each reporting its own reference so a value in hand can be identified.")

q(1, "Why is a coefficient quoted with no reference area a number to send back rather than to use?",
 "The same exchanger has two of them, and they differ by the ratio of the two areas.",
 ["The same exchanger has two of them, and only one of the two can ever be measured.",
  "The reference decides whether the fouling allowances are inside the figure.",
  "The reference decides which of the two films the figure was assembled from."],
 "The failure mode is not an obviously wrong answer. It is an answer that looks entirely reasonable and is wrong by the ratio of two areas, and the surface is what gets bought.")

q(2, "The studio inside film coefficient is 547.762384, so one over it is 0.001825609. Why does the stack carry 0.002208398 instead?",
 "The inside terms are multiplied by the diameter ratio of 1.209677 to put them on the outside surface.",
 ["The inside film has been taken at the converged tube count on this case rather than at the count the loop seeded from.",
  "The fouling allowance on the inside of the tube has already been folded into that same term before it is added.",
  "The wall resistance is carried inside the inside film term on this engine."],
 "The stack adds terms that have to be comparable, and a stack that mixes surfaces adds numbers that are not. The conversion is visible in the numbers rather than asserted in a comment.")

q(3, "The inside fouling allowance is typed as 0.002000000 and the outside one as 0.001000000. What does the stack carry?",
 "0.002419355 on the inside and 0.001000000 on the outside.",
 ["0.001000000 on the inside and 0.002419355 on the outside.",
  "0.002419355 on the inside and 0.002000000 on the outside.",
  "0.002000000 and 0.001000000, both carried unchanged."],
 "The inside allowance moves by the same ratio as the inside film. The outside one is already on the reference surface, so there is nothing to convert and it is carried unchanged.")

q(0, "What follows for an engineer who types the same allowance on both sides of the tube?",
 "The inside one carries more weight in the stack than the outside one does.",
 ["The two carry equal weight, which is what typing them equal is for.",
  "The outside one carries more weight, since it needs no conversion.",
  "Neither carries weight until the diameter ratio has been typed as well."],
 "That asymmetry is the most useful thing in the lesson. Two allowances typed as equals have quietly made the inside one the larger of the two.")

q(1, "The engine reports a fouling penalty of 31.495796 percent on the studio case. Where else does that figure appear?",
 "In the share column, as the two fouling terms added, at 9.211035 and 22.284762 percent.",
 ["In the resistance column, as the two fouling terms added, at 0.001000000 and 0.002419355.",
  "In the difference between U clean and U dirty, at 134.459410 against 92.110348.",
  "In the controlling margin, which is reported for the same stack at 31.495796 percent."],
 "It is an identity rather than a coincidence. One minus clean over total is the fouling terms over the total, written differently, so the penalty is never separate physics.")

q(3, "What does that identity buy a reader?",
 "Two routes to one figure, so each checks the other.",
 ["A second published case, which this repository otherwise lacks.",
  "A way to recover U clean from the share column alone.",
  "A tolerance on the penalty, which the two routes bracket."],
 "Anybody who can read the share column already knows what fouling costs this exchanger, without going near either coefficient.")

q(2, "An outside fouling allowance of -0.010000000 is handed to this engine. What does it do now?",
 "It refuses, saying the allowance must be zero or positive.",
 ["It answers, and reports a fouling penalty that is negative.",
  "It answers, and raises the dirty coefficient above the clean one.",
  "It answers, and treats the allowance as zero without saying so."],
 "The engine message also describes the behaviour the FC6-0 repair replaced, and that half is history rather than what the engine does now. Both allowances on this door are bounded at zero, and the bound is stated in the refusal.")

q(0, "What is the general lesson behind bounding that input rather than watching its output?",
 "An unbounded input that produces a plausible number is the dangerous case, because nobody notices it.",
 ["An unbounded input can only ever be caught by the published cases, and they do cover this one.",
  "An output nobody believes is the dangerous case, because it gets quoted downstream.",
  "An input bounded in the code rather than in the message is the easiest one to argue with."],
 "An obviously absurd output is the lucky case, because somebody notices it. The defence against the other one is at the input.")

q(1, "The verdict on the studio stack names the outside film. What else comes with it?",
 "The runner up, which is the inside fouling allowance, and the margin between them at 51.612903 percent.",
 ["The runner up, which on this case is the inside film, and the margin between the two of them at 46.055174 percent.",
  "The share the leading term carries in this stack, and the coefficient the same stack would reach without that term in it.",
  "The runner up, and the tube count at which those two terms would change places with each other in the stack."],
 "A verdict is a comparison and a comparison without its second place is not reportable. The engine reports three things where a simpler tool reports one.")

q(2, "Across the six cases in that table, what is the runner up?",
 "A fouling allowance on four of them and the other film on two.",
 ["A fouling allowance on all six of them.",
  "The wall on two of them and a film on four.",
  "The other film on all six of them."],
 "Those are different situations under the same one word verdict. Reading the leading term without its runner up throws away the part that says whether to act on it.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/intermediate/fc6i_m03.json', label='fc6i_m03', expect_n=15)
finish()
