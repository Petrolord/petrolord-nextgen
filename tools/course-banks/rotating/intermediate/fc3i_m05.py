import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Professional m05, two pumps and a catalogue curve that is a water curve.
# Digest Section 10 only. The Hydraulic Institute correction is HELD, so no
# corrected flow, head or efficiency is a graded answer and the questions on it
# turn on what the branches and the warnings say rather than on the figures.

q(1, "How does the engine build the duty for machines in parallel?",
 "It adds flows at equal head to make a new machine curve, then solves the crossing of that curve with the system that was already there.",
 ["It adds heads at equal flow to make a new machine curve, then solves the crossing of that curve with the system that was already there.",
  "It solves one machine's duty and multiplies the flow by the machine count, which is exact because the machines are identical.",
  "It re-rates the system curve for the extra machines and reads the original curve against it at the new friction head."],
 "Machines in parallel share a suction and a discharge, so they all work against the same head. The duty is then solved the way any duty is solved.")

q(2, "On a system of 60.000000 ft static plus 380.000000 ft of friction at 1100.000000 gpm, one machine gives 1103.518695 gpm and two give 1198.970966 gpm. What is the flow over one machine on that second row?",
 "1.086498100, and the second machine is carrying far less than the first.",
 ["Two exactly, since the machines are identical and parallel operation adds their flows.",
  "1.661125814, which is what the second machine buys on this system.",
  "1.105087375, which is the figure for two machines on a friction-dominated system."],
 "1.661125814 is the head over one machine for two in series, and 1.105087375 is the flow over one machine for three in parallel.")

q(0, "Why does the second machine buy so little?",
 "Each machine runs further left on its own curve and the system demands more head for the extra flow.",
 ["The two machines interfere on a shared suction, so each of them makes less head than it would alone.",
  "The combined curve is flatter than one machine's curve, so it crosses the same system at a lower head.",
  "The second machine is running outside the range either side of best efficiency flow, where it makes less flow per unit of head."],
 "One machine carries 1103.518695 gpm alone, and with a second on the manifold each carries 599.485483 gpm. The duty head rises from 442.434987 ft to 511.456135 ft.")

q(3, "The four-machine row reads 1226.902650 gpm at 532.735738 ft, with 306.725662 gpm per machine. What has a reader been shown?",
 "A station whose flow is still climbing and whose machines are each carrying less than a third of what one carried alone.",
 ["A station that has reached the limit of what parallel operation can deliver on any system, whatever the shape of that system's own curve.",
  "A station whose per-machine flow has fallen below the figure at which the engine warns.",
  "A station whose duty head has stopped rising, which is the signal that a fifth machine would buy nothing."],
 "The station flow on that row is 1226.902650 gpm against 1103.518695 gpm for one machine. Everything about whether the fourth is worth buying sits outside this calculation.")

q(2, "Is the shortfall from doubling a property of the pumps?",
 "No. A system whose head is mostly friction rises steeply with flow, so extra flow is expensive in head.",
 ["Yes. Identical machines on one manifold share a discharge and each loses head to the other.",
  "Yes. The combined curve is fitted from the single curve, so it carries the fit's own error twice over.",
  "No. The shortfall comes from the engine re-solving rather than doubling, which is a difference in method rather than in the machines."],
 "A system whose head is mostly static behaves differently. The way to find out is to state the system and re-solve.")

q(0, "Three machines in series on the same system give 1676.470978 gpm at 942.653617 ft, with a head over one machine of 2.130603693. Why is that figure below three?",
 "The duty flow moved from 1103.518695 gpm to 1676.470978 gpm, and a taller curve crosses the same system further to the right.",
 ["The heads of machines in series add with a loss at each stage, which is what the figure below three records.",
  "The third machine is running further left on its own curve, so it contributes less head than the first two.",
  "The engine re-solves a series stack at the flow of a single machine, so the figure is a ratio of two different duties."],
 "At the duty the heads do not appear to add, and the reason is that the duty flow is not fixed. The crossing moved.")

q(3, "At a flow of 1000.000000 gpm one machine makes 459.953894 ft and three in series make 1379.861681 ft, a quotient of 3.000000000. What does that test separate?",
 "Adding heads at a fixed flow, which is exact, from the duty head of a stack, where the crossing has moved.",
 ["A stack built from a drooping curve, which reads back exactly, from one built from a curve that does not droop.",
  "The engine's series combination from its parallel one, since only the series route is exact at a stated flow.",
  "The published curve fit from the system curve, since only one of the two is evaluated at a flow the caller names."],
 "The combination is not an approximation. Three times 442.434987 ft is not the duty head of 942.653617 ft, and the difference is the duty flow moving.")

q(1, "What comes back from a request for parallel operation on two and a half machines?",
 "{ error: \"parallel operation needs a pump curve and a whole number of machines, at least one\" }",
 ["{ error: \"series operation needs a pump curve and a whole number of machines, at least one\" }",
  "A combined curve for two machines, since the engine rounds a machine count down to the nearest whole number.",
  "A combined curve interpolated between the two-machine and three-machine cases."],
 "Each message names its own operation and states both halves of what it needs: a pump curve, and a count that is whole and at least one.")

q(3, "Why is a fractional machine count refused rather than rounded?",
 "A curve returned for it would be an answer to a question nobody can ask, and the reader would not know which count it belonged to.",
 ["Rounding would break the parallel combination, which adds flows at equal head and needs an exact count to do so.",
  "The engine has no default machine count to fall back on, and refusing is what it does wherever a default is missing.",
  "A count of two and a half would put the combined curve outside the range the duty solve searches over."],
 "There is no machine that is half a pump and no manifold that holds two and a half of them. Refusing puts the problem back in the input.")

q(1, "A stack of four machines is built from a curve that does not fall with flow. What does the duty solve return?",
 "{ error: \"this curve does not fall with flow, so it is not a centrifugal head curve and its crossing with a system curve is not a duty point: check the catalogue points\" }",
 ["{ error: \"parallel operation needs a pump curve and a whole number of machines, at least one\" }",
  "A duty point, since combining four machines restores the droop the single curve was missing.",
  "A duty point with the droop flag set to false, so a caller can decide whether to use it."],
 "Combinations carry the properties of the curve they were built from. The message names where to look, which is the catalogue points the curve was fitted from.")

q(2, "What is B in the Hydraulic Institute correction, and where is the correction applied?",
 "The correlating parameter, which says how far from water the fluid is, applied at the best efficiency point.",
 ["The exponent inside the efficiency factor, applied to the water curve across the whole of its range rather than at one point on it.",
  "The ratio of the fluid's viscosity to that of water, applied at the duty point the machine is actually running at.",
  "The head factor before it is equated to the flow factor, applied at the shutoff head."],
 "Every factor on a row is read against B. The head factor is taken equal to the flow factor there, which is a simplification of the standard.")

q(0, "At 320.000000 cSt the engine returns a flow factor of 0.894963166, a head factor of 0.894963166 and an efficiency factor of 0.637190119. Which of the three decides a driver?",
 "The efficiency factor, so a viscous service is a power question as well as a capacity question.",
 ["The flow factor, since the corrected flow of 1029.207641 gpm is what the driver is sized against.",
  "The head factor, since power follows head and the head factor is the one applied to the published curve.",
  "All three equally, since the corrected flow and head are the product of the factors and the power follows from both."],
 "Correcting the flow and the head and leaving the efficiency at its water value makes the capacity look survivable while the power behind it is wrong.")

q(1, "At 850.000000 cSt the engine attaches \"the efficiency correction is 45.7 percent: a centrifugal pump is a poor choice for a fluid this viscous\". What does it do with the row?",
 "Returns it in full, with a corrected flow of 923.952933 gpm and a corrected head of 345.478053 ft.",
 ["Withholds the corrected flow and head, leaving the factors and the message in their place.",
  "Returns the catalogue values unchanged, since the warning marks the branch on which no correction applies.",
  "Returns the row and clears the efficiency factor, since 0.456934987 is the figure the message has just disclaimed."],
 "The warning names the efficiency correction and says what a fluid this viscous needs. The figures are still the arithmetic the method gives.")

q(3, "At 9000.000000 cSt, where B is 40.385733873, the engine says \"B above 40 is outside the published correlation, so a corrected centrifugal curve cannot be used here: this service needs a positive-displacement pump or vendor viscous test data\". What is the trap on that row?",
 "A caller reading only the numbers gets a corrected curve for a service the method has just disclaimed.",
 ["A caller reading only the numbers gets a refusal where the other rows carry figures, so the row looks like a bug.",
  "The corrected flow of 551.907863 gpm is returned at the catalogue head, so the pair no longer describes one operating point.",
  "B is reported above its own threshold, which means the efficiency factor of 0.074570011 was extrapolated rather than correlated."],
 "The warning names the parameter, names the threshold and names the two things that would answer the question. It does not withhold the numbers.")

q(0, "At 1.000000 cSt the engine reports B = 0.425703013, and at 1.000001 cSt it reports 0.425703226, a difference of 2.1285145351823687e-7. What does that establish?",
 "That B is a real positive number at water viscosity, on the branch where the engine then applies no correction at all.",
 ["That B is discontinuous at water viscosity, which is why the engine switches branches there.",
  "That B rounds to zero at water viscosity and the engine reports the rounding rather than the value.",
  "That the correction is applied at 1.000001 cSt and withheld at 1.000000 cSt, which the difference in B measures."],
 "B says how far from water the fluid is, and the decision not to correct is a separate statement carried by the note. At 1.000000 cSt that note reads \"at water viscosity there is nothing to correct\".")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/intermediate/fc3i_m05.json', expect_n=15)
finish()
