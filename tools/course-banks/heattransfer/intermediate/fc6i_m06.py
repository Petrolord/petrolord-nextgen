import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Professional m06, the Professional reading.
# Every figure is from digest Section 6, which this module shares with the
# Associate recap, at the rendering that section prints. No question reaches
# into an Expert section, and the forward look carries no Expert figure.

q(1, "The chain on this engine is a loop rather than a line. What needs what?",
 "The film needs the count, the count needs the area, the area needs the coefficient, the coefficient needs the film.",
 ["The film needs the area, the area needs the count, the count needs the duty, and the duty needs the film.",
  "The coefficient needs the count, the count needs the film, the film needs the duty, the duty needs the area.",
  "The area needs the film, the film needs the coefficient, the coefficient needs the duty, the duty needs the count."],
 "A map like that is a contraction, so plain iteration settles it. A coefficient computed at a tube count the same screen contradicts is not a coefficient of anything.")

q(3, "What is the tube count trail on the studio case, and how many passes of the loop does it take?",
 "2, 60, 72 and 74 tubes, converged in 4 passes.",
 ["2, 12, 60 and 300 tubes, converged in 4 passes.",
  "4, 56 and 64 tubes, converged in 3 passes.",
  "2, 60, 72 and 74 tubes, converged in 2 passes."],
 "The ladder of seeds the studio walks is 2, 12, 60 and 300 tubes, and the first seed that evaluates starts the loop. The trail is what the loop left behind on the way to the answer.")

q(0, "ORON runs the same chain on a four-pass bundle. What ladder of seeds does it walk?",
 "4, 24, 120 and 600 tubes.",
 ["2, 12, 60 and 300 tubes.",
  "4, 56 and 64 tubes, which are also the counts it settles through.",
  "2, 60, 72 and 74 tubes, one seed for each pass of the loop."],
 "A ladder is where the iteration may start and a trail is where it went. ORON settles through 4, 56 and 64 tubes in three passes, and the studio case shares none of those figures.")

q(2, "At the converged count, the coefficient times the area times the correction times the log mean comes to 2750000.0000 Btu an hour. What is that?",
 "A self-consistency check, against a duty of 2750000.0000 Btu an hour.",
 ["A second method, because the product uses the area and the duty did not.",
  "A published check, because the golden file carries that product.",
  "A restatement of the duty, since the area was formed from it and nothing else."],
 "It is the check that catches a loop that has not closed. Four figures at the end of the chain either satisfy the equation they were built from or they do not.")

q(1, "The studio case takes no correction on its arrangement. What is the driving force the surface is sized on?",
 "The counter-current log mean itself, at 130.064846 degF.",
 ["The arithmetic mean of the two ends, at 130.064846 degF.",
  "The counter-current log mean corrected by 0.964693.",
  "The parallel log mean, at 130.064846 degF."],
 "The two groups on this case are low, at a P of 0.171875 and an R of 2.909091. The area then follows from the duty, the coefficient and that driving force.")

q(3, "The area required on the studio case is 229.543151 ft2 and the actual surface is 232.477856 ft2. What is the overshoot and why is it there?",
 "1.278498 percent, because a whole number of tubes cannot land exactly on a required area.",
 ["1.278498 percent, because the count is rounded up to the nearest ten tubes.",
  "2.107398 percent, because a whole number of tubes cannot land exactly on a required area.",
  "1.278498 percent, because the area carries the ten percent margin this module declares."],
 "The count is 74 tubes in 2 passes, which is 37 a pass. The overshoot is reported rather than left for a reader to notice.")

q(0, "Two coefficients come out of the stack on this case. Which one sizes the surface a plant buys?",
 "U dirty, at 92.110348.",
 ["U clean, at 134.459410.",
  "U dirty, at 134.459410.",
  "Whichever of the two the fouling penalty is nearer."],
 "The exchanger has to do its duty when it is dirty. U clean, at 134.459410, is what the surface will carry on the day it is commissioned.")

q(2, "Of the figures in the studio chain, which one did a fitted correlation produce?",
 "The inside film coefficient.",
 ["The overall coefficient.",
  "The log mean driving force.",
  "The correction factor."],
 "The outside film and the wall conductivity on this case are stated inputs. The inside film is the only fitted number in the module, and it is the reason the graded work in this course states both films.")

q(1, "Why does this course state both film coefficients wherever a coefficient is worked?",
 "So that no figure a reader produces rests on a fit whose validity band nobody here can state.",
 ["So that the inside film coefficient need not be recomputed at every tube count along the trail the loop leaves.",
  "So that the two film coefficients can be typed as equals and the allowances beside them compared directly.",
  "So that the coefficient can be referred to either surface without converting."],
 "Nothing in this course grades a film coefficient. A figure a reader is asked to produce should rest on conditions of the case rather than on a fitted correlation.")

q(3, "What has to be quoted beside a film coefficient, and what beside an overall coefficient?",
 "The tube count and the passes beside the film, and the reference area beside the coefficient.",
 ["The Reynolds number beside the film coefficient, and the fouling penalty beside the overall coefficient.",
  "The regime beside the film, and the controlling term beside the coefficient.",
  "The passes beside the film, and the tube count beside the coefficient."],
 "A film coefficient without its count belongs to no bundle, and a U without its reference area belongs to no surface. Both are quoted at the precision the engine prints them at.")

q(0, "A capstone question asks for a figure the engine declines to give. What is the right answer?",
 "The decline itself, because writing a plausible figure into that gap is a wrong answer.",
 ["The nearest figure the engine does give at another configuration, with the decline noted beside it.",
  "A figure worked by hand out of the conditions the question states, since they are all given.",
  "The figure at the nearest configuration the engine will answer at, with the change written down."],
 "A configuration that cannot reach its duty at one shell is refused by name, and so are a count past the declared bound, a fractional count, a film in the transition band and a cooled tube side. The gap was the point of the question.")

q(2, "A multi-shell question carries two numbers called P. How are they told apart?",
 "One comes off the four temperatures and the other is what the conversion produces at the stated shell count.",
 ["One is the whole unit value and the other is that same value once the correction factor has been applied to it.",
  "One is the cold rise over the span between the two inlets and the other is the hot drop over that same cold rise.",
  "One is reported by the engine and the other is worked out by the caller."],
 "The equivalent single-shell P is the value the closed form is read at. Confusing the two is the commonest way to lose a mark on a multi-shell question.")

q(1, "Which of the six capstone quantities can be read straight off the share column, with no coefficient in hand?",
 "The fouling penalty, as the two fouling terms taken as a share of the total.",
 ["U clean, as the three terms that are not fouling allowances taken as a share of the total.",
  "The equivalent single-shell P at two shells, as the leading share of the whole unit P.",
  "The correction factor, as the share the corrected driving force keeps of the log mean."],
 "If the two routes disagree, something upstream of both is wrong, and it is usually an inside term put into the stack without the diameter ratio on it.")

q(3, "At what precision does this course quote a resistance, and at what precision a duty?",
 "Nine decimals for a resistance, and four for a duty in Btu an hour.",
 ["Six decimals for a resistance, and four for a duty in Btu an hour.",
  "Nine decimals for a resistance, and six for a duty in Btu an hour.",
  "Four decimals for a resistance, and nine for a duty in Btu an hour."],
 "Quote a figure at the precision the engine prints it rather than rounding on the way. A rounded restatement of an engine answer cannot be told apart from a number somebody invented.")

q(2, "This tier asked what decides the driving force and what decides the coefficient. What does the Expert tier ask instead?",
 "What a machine that already exists delivers.",
 ["What surface a stated duty asks for on a longer train.",
  "What the shell side film coefficient works out at.",
  "What a bundle costs once its shell diameter is known."],
 "Both questions here are sizing questions, and they start from a duty and end with a surface. A rating starts from a machine, and it is answered in a different currency.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/intermediate/fc6i_m06.json', label='fc6i_m06', expect_n=15)
finish()
