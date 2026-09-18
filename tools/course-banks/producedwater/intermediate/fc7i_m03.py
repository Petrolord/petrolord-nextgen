import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC7 Professional m03, the operating envelope. Digest Section 10 throughout,
# which Professional m03 owns. No question here has a discharge limit as its
# subject or its answer, because this engine states none.

q(2, "Turndown is the single figure saying how hard a bank is being run. What is it a ratio of?",
 "The flow one liner is actually carrying divided by the flow one liner is rated at.",
 ["The bank flow divided by the flow the whole vessel was ordered to pass at its design point.",
  "The reported field over the 1000 g a liner gives at its rated flow.",
  "The ratio of the liner count installed to the liner count the module says the flow wants."],
 "Split 75000 bwpd across 200 liners and each carries 0.000690049023 m3/s against a rated 0.0006, which is 1.150082. It is the single number saying how hard the bank is being run, and the field and the residence both follow from it.")

q(0, "How does the reported field respond to the turndown inside the operating envelope?",
 "It goes as the square of it, because the field goes as the square of the tangential velocity and that goes with the flow.",
 ["It goes linearly with it, because the tangential velocity is what the inlet slot converts the flow into.",
  "It goes as the square root of it, because the swirl decays along the tube as the flow rises.",
  "It does not respond at all inside the envelope, where the module holds the field at its declared 1000 g."],
 "That is a strong dependence and it is exactly why a designer is tempted to buy fewer liners. Halve the bank and each remaining liner sees twice the flow, which looks like four times the field.")

q(1, "Where does the module put the ceiling on the reported field, and why is it there?",
 "At 1690.000000 g, because past 1.3 times design the inlet slot chokes and the extra energy goes into pressure drop rather than rotation.",
 ["At 1000 g, because that is the field one liner is DECLARED to develop and the module will not report more.",
  "At 1690.000000 g, because above that figure the cut droplet would leave the creeping flow band that the radial migration law behind it is stated to.",
  "At 1690.000000 g, because that is the highest field any published row in the golden file carries."],
 "Above the top of the envelope the field column in the sweep sits at exactly that number and stops. A ceiling on its own would only make the cut stop improving.")

q(3, "A bank of 120 liners on the KOKORI flow reports an ideal cut of 5.060355 micron and a reported cut of 6.144662 micron. What sits between them?",
 "A shear penalty of 1.214275, which is the root of the overload applied as a multiplier on the ideal cut.",
 ["A correction for the field having been capped, which restores the cut the uncapped field would have given.",
  "The Reynolds number of the cut droplet, which the module divides the ideal cut by outside the creeping band.",
  "The turndown of 1.916803, which multiplies the ideal cut once the bank passes twice its design flow."],
 "A liner pushed past its slot rating accelerates water harder than the design intends, and shear breaks oil droplets finer than they arrived. Finer droplets are harder for any device to catch, so the same liner on the same water reports a coarser cut when it is overdriven.")

q(0, "Where in the swept table does the finest cut size sit?",
 "At 177 liners, 4.168146 micron at a turndown of 1.299527.",
 ["At 120 liners, 6.144662 micron, which is the smallest bank the sweep printed.",
  "At 230 liners, 4.751385 micron, where the bank runs closest to its design point.",
  "At 600 liners, 7.674178 micron, where the field column reaches its highest value in the sweep."],
 "It is NOT the smallest bank. A designer reading the cut column from the top down sees it improving as liners come out, right up to the row where it stops and reverses.")

q(2, "By how much is the smallest bank in that sweep worse than the best one?",
 "1.474196 times, which is 6.144662 micron against 4.168146 micron.",
 ["1.299527 times, which is the turndown at the row carrying the finest cut in the sweep.",
  "1.214275 times, which is the shear penalty the smallest bank in the sweep carries.",
  "1.916803 times, which is the turndown the smallest bank in the sweep is running at."],
 "The figure is derived, the two cut sizes divided. Taking liners out of the best bank in that table buys a cut half again as coarse, which is the whole engineering content of it.")

q(3, "Two separate mechanisms put the turn in that sweep. Which two?",
 "The ceiling on the field and the inlet shear penalty on the cut.",
 ["The ceiling on the field and the refusal past twice design flow.",
  "The starved warning at the top of the table and the overload warning at the bottom.",
  "The square law on the field and the square root law on the residence time."],
 "A ceiling alone would flatten the curve and leave the cut merely not improving. A ceiling plus a penalty turns it over, so the cut gets WORSE from the envelope onward in direct proportion to the overload.")

q(1, "What does the module report at the top of the sweep, 600 liners on the KOKORI flow?",
 "A turndown of 0.383361, a field of 146.965325 g, a cut of 7.674178 micron and a starved warning.",
 ["A refusal, because a bank that far below its design flow is outside what the module will describe.",
  "A turndown of 0.383361 with no warning, since the module only warns above its operating envelope.",
  "A cut of 4.168146 micron, because the longest residence in the table sits on that row."],
 "The column is worse at both ends and best in between, and neither end is visible from a single design point. That is the argument for sweeping an input rather than running one case.")

q(2, "A caller puts the KOKORI flow through 115 liners and the module REFUSES. What does the refusal hand back?",
 "The liner count that would run this flow at its design point, 231 liners.",
 ["The cut size the bank would have reported had the module been willing to extrapolate.",
  "The largest flow those 115 liners could take.",
  "The shear penalty the bank would carry, so a caller can apply it to the ideal cut themselves."],
 "The sentence also carries the count it was given, the flow each liner is carrying, the turndown that produces, the design flow it was judged against and the reason the limit exists. A user who typed a number far too small is told what a sensible one would be.")

q(0, "A one liner bank on the same flow refuses and names the same 231 liners. Why the same number?",
 "Because that count is a property of the flow and the rated flow per liner rather than of the bad input.",
 ["Because the module reports the nearest liner count it has a published row for in the golden file.",
  "Because 231 is the count at which the reported field would reach its ceiling on this particular flow.",
  "Because the refusal quotes the bank the caller last asked about rather than recomputing it."],
 "The flow divided by the design flow per liner answers the question whatever the caller typed. That is what makes it a refusal that hands back a design instead of a bare error.")

q(3, "What is the difference between the starved warning and the overloaded warning?",
 "Starved is advice about how to run the bank you have, and overloaded says the number beside it is getting worse and the bank is too small.",
 ["Starved is a warning and overloaded is a refusal, since the module will not report a penalised cut size.",
  "Starved applies below the design flow and overloaded above it, and both leave the reported cut untouched.",
  "Starved means the reported cut is optimistic and overloaded means it is conservative, at the same field."],
 "One fix is operational and the other is capital. A reader who can tell those apart can tell an operating decision from a purchase order, which is the whole point of separating them.")

q(1, "A bank runs at 0.328595 of its design flow. What does the module do?",
 "It ANSWERS, with a cut of 8.289060 micron and a warning telling the operator to shut liners in.",
 ["It refuses, since 0.328595 is under the declared 0.5.",
  "It answers with the cut it would give at the bottom of the envelope, since the field is clamped there.",
  "It answers with no warning, since a starved bank is honest."],
 "In the engine's own words the warning reads that below about 0.5 the centrifugal field collapses with the square of the flow and the cut size degrades fast, so shut liners in rather than running them all starved.")

q(0, "The published liner rows carry an oracle capture fraction of 0.500455 at the reported cut. What makes that figure worth anything?",
 "It comes from a different method, droplets fired from starting radii spread by area and marched, against the one half a cut size is DEFINED as.",
 ["It comes from precisely the same march the engine itself runs, recorded back into the golden file so that any later rerun can be compared against it.",
  "It is the grade efficiency of the declared sharpness of 3 evaluated at a reduced size of exactly one.",
  "It is the fraction of the published rows whose cut size the engine reproduces to every digit printed."],
 "An agreement between two routes that share no arithmetic is evidence. An agreement between two copies of one routine is bookkeeping, and telling those apart is the habit this course is built on.")

q(2, "What is happening at the 230 liner row of the sweep?",
 "The bank is at its design point, a turndown of 1.000071 and a field of 1000.142101 g.",
 ["The bank is at the top of its envelope, which is where the reported field stops rising.",
  "The bank is at the bottom of its envelope, which is where the starved warning first appears.",
  "The bank is at the finest cut in the sweep, since the field has reached its ceiling there."],
 "The declared design flow of 0.0006 m3/s per liner and the declared 1000 g meet on that row, which is why both figures sit a hair above their round values rather than on them.")

q(3, "What is the portable habit this sweep is meant to teach?",
 "Sweep the input a user is most tempted to change and read the DIRECTION of the answer rather than any single value.",
 ["Design at the centre of the declared envelope, since the edges of it carry warnings in either direction.",
  "Prefer the smallest equipment that still answers, because the module refuses anything genuinely unsafe.",
  "Trust a reported optimum when the model prints a warning column, since the warnings police the extremes."],
 "A model whose answer improves without limit as an input is pushed has no limit in it, and a studio telling a designer to buy less equipment for a better answer is worse than no studio. This one has a limit and the table shows where.")

emit(Q, '/root/wt-fc7-nextgen/tools/course-banks/producedwater/intermediate/fc7i_m03.json', label='fc7i_m03', expect_n=15)
finish()
