import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Professional m02, the margin and the rule it is judged against.
# Digest Section 7 only. The rule itself is HELD, so nothing here is graded on
# a required margin, a pass flag or a severity, and the questions say so.

q(1, "Across the whole padding sweep judged against a vendor's required NPSH of 16.000000 ft, the required margin column reads 5.600000 ft on every row. Why does it never move?",
 "The required margin is a function of the required NPSH alone, and the required NPSH stayed at 16.000000 ft while only the drum pressure moved.",
 ["The required margin is recomputed from the available head on each row and settles at 5.600000 ft because every row on this sweep came back adequate.",
  "The rule holds the required margin fixed once the first row of a sweep has been judged, so later rows are compared against the figure the sweep opened with.",
  "The required margin tracks the margin itself at a fixed fraction, so a sweep whose margins rise in proportion returns one figure throughout."],
 "The margin of 15.040865 ft at 14.700000 psia and 115.659135 ft at 60.000000 psia both stand against the same 5.600000 ft. Only the required NPSH could move that column.")

q(3, "How is the floor of the required-margin rule measured out of the engine rather than read out of the source?",
 "Ask for a required margin at a required NPSH small enough that the percentage half cannot reach it, and the figure that comes back is the floor of 3.000000000 ft.",
 ["Ask at a required NPSH of 16.000000 ft and subtract the fraction's contribution from the 5.600000 ft returned, which leaves the floor behind.",
  "Ask with the required NPSH omitted, since the engine falls back on the floor whenever it has no required figure to take a percentage of.",
  "Ask at the crossover of 8.571428571 ft, where the returned figure is the floor and the fraction at once."],
 "At a required NPSH of 4.000000 ft the engine applies 3.000000 ft and the half that bound is the floor. Isolating a maximum means asking where only one of its halves can possibly win.")

q(0, "And the fraction?",
 "Ask at a required NPSH large enough that the floor cannot reach it and divide the required margin returned by that required NPSH, which gives 0.350000000.",
 ["Divide the floor of 3.000000000 ft by the crossover of 8.571428571 ft, which is the only route to it that does not need a second call.",
  "Take the boundary ratio of 1.350000000 and subtract one, since the fraction is what the ratio carries above unity on a governed row.",
  "Read the required margin of 10.500000 ft at a required NPSH of 30.000000 ft and treat it as the fraction directly."],
 "At 30.000000 ft the engine applies 10.500000 ft, and 10.500000 over 30.000000 is the fraction. The floor cannot reach that figure, so only the fraction can have set it.")

q(2, "Two independent routes reach the required NPSH at which the floor and the fraction change places. What are they, and what do they give?",
 "Halving the required NPSH until the engine's answer stops being the floor, and dividing the floor by the fraction. Both give 8.571428571 ft.",
 ["Halving the available head until the severity changes, and dividing the floor by the fraction. Both give 8.571428571 ft.",
  "Reading the boundary ratios of 1.750000000 and 1.350000000 and taking their difference of 0.3999999999999999, which locates the crossover on the sweep.",
  "Halving the required margin until the pass flag turns over, and multiplying the floor by the fraction."],
 "The first route is a property of the running engine and the second is a property of the rule. The figure is 8.571428571 ft by bisection and 3.000000000 over 0.350000000 by arithmetic.")

q(3, "Why is it worth having both routes rather than either one?",
 "Their agreement says the engine implements the rule it appears to implement, which neither route can say on its own.",
 ["The bisection alone would be untrustworthy, since halving a required NPSH cannot land on 8.571428571 ft exactly and has to be rounded to it.",
  "The arithmetic route alone would be untrustworthy, since the floor and the fraction are themselves read out of the source code.",
  "Two routes are needed because the crossover moves with the available head, so a single measurement would belong to one row of the sweep."],
 "One route measures behaviour and the other measures the stated rule. A gap between them would say the engine is applying something else.")

q(1, "Three of the four rows in the crossover table are governed by the fraction, and the boundary ratio on every one of them is 1.350000000. What does that invite a reader to conclude, wrongly?",
 "That this package applies a rule on the ratio of available head to required head, since a reader working only at required NPSHs of that size sees one number every time.",
 ["That the boundary ratio is a constant of the engine, since three independent required NPSHs return it and the fourth returns a rounding of it.",
  "That the fraction of 0.350000000 and the ratio of 1.350000000 are the same quantity written two ways, so either may be quoted as the rule.",
  "That the floor of 3.000000000 ft has been superseded, since no row in the table above the crossover reaches it."],
 "The floor row gives a boundary ratio of 1.750000000. The three fraction rows are exactly the evidence that hides the difference.")

q(2, "At a required NPSH of 16.000000 ft the boundary ratio is 1.350000000 and at 4.000000 ft it is 1.750000000, a difference of 0.3999999999999999. What is that subtraction for?",
 "It measures how far a remembered ratio is from the rule the engine applies once the floor takes over.",
 ["It measures the width of the band the severity reports as marginal.",
  "It measures the error the engine carries when it converts a margin rule into the ratio it returns beside the pass flag.",
  "It measures the gap between the required margins of 5.600000 ft and 3.000000 ft, expressed as a ratio so the two can be compared."],
 "A margin rule and a ratio rule agree over the range where the fraction happens to bind, and they part company as soon as the floor takes over.")

q(0, "A reader carrying 1.350000000 in their head applies it to a pump whose required NPSH is 4.000000 ft. What have they done?",
 "Asked for less margin than the engine does, by a shortfall no arithmetic check will find, because the arithmetic is a correct application of the wrong rule.",
 ["Asked for more margin than the engine does, since below the crossover the fraction rises above the floor and the boundary ratio rises with it.",
  "Reproduced the engine exactly, since the ratio is a property of the rule rather than of the required NPSH it was measured at.",
  "Produced a figure the engine would refuse, since a ratio supplied where a required margin belongs fails the check's finiteness test."],
 "On that pump the floor governs and the boundary available head is 7.000000 ft at a ratio of 1.750000000. A remembered 1.350000000 asks for less.")

q(2, "Which of the values this check returns can be a graded answer in this course?",
 "None of them, because the rule behind the required margin, the pass flag and the severity is customary and unsourced here.",
 ["The required margin, since both halves of the rule that produces it were measured out of the engine to nine decimal places.",
  "The pass flag, since a boolean carries no unsourced figure and can be checked from the margin and the required margin alone.",
  "The severity, since its three labels are the engine's own words and the messages attached to them are quoted verbatim."],
 "Measuring the two halves is worth doing and does not make the rule sourced. The available head itself is gradeable, because every term in it is arithmetic the engine defines.")

q(0, "A margin of -4.000000 ft against a required margin of 4.200000 ft returns which severity, and with what note?",
 "\"cavitating\", with the note \"NPSH available is below required: this pump will cavitate at this duty\".",
 ["\"marginal\", with the note \"margin of 2.0 ft is below the customary 4.2 ft: acceptable only with vendor agreement and a stable suction\".",
  "\"cavitating\", with a null note, since the negative margin is the whole of the message and the engine adds nothing to it.",
  "An error object, since a negative margin is not a state this check classifies and there is no verdict to give on it."],
 "The pass flag on that row is false. A negative margin means the available head is below the required head that was handed in.")

q(1, "A margin of 2.000000 ft against a required margin of 4.200000 ft comes back \"marginal\" with a pass of false. What has the engine said about that suction?",
 "That the available head clears the pump's own requirement and falls short of the cover the customary rule asks for on top of it.",
 ["That the available head is below the pump's own requirement, which is what a pass of false reports whichever label travels with it.",
  "That the available head could not be judged against the rule, so the engine has classified it into the middle of the three labels.",
  "That the required margin of 4.200000 ft was met and the ratio fell short."],
 "Its note reads \"margin of 2.0 ft is below the customary 4.2 ft: acceptable only with vendor agreement and a stable suction\". That is a statement about the rule.")

q(3, "The third label arrives with a pass of true and a null note on a suction holding 13.000000 ft. Why is that short of a promise that the machine will stay clear of cavitation?",
 "It reports that one cover was cleared, and clearing a customary cover is no physical guarantee.",
 ["It is a full promise about cavitation, since the label is defined as the state in which a machine is safe at its duty.",
  "It is short of a promise only because the note came back null, which leaves no record of which half of the maximum bound.",
  "It is short of a promise because the ratio was withheld on that row, and the ratio is the field a reviewer would check."],
 "Null is the answer in the note field there. Every severity in this check is an output of a held rule.")

q(0, "Two of the three severities come back with a pass of false. What does a caller reading only the boolean lose?",
 "The difference between a pump that will cavitate and one that clears its vendor requirement with thinner cover than convention wants.",
 ["The ratio and the required margin, which the engine attaches to the label rather than to the flag and drops when the flag is read alone.",
  "The distinction between a failure and a refusal, since an unreadable available head also comes back with the pass flag set to false.",
  "Nothing that matters, since both false cases call for the same work: more available head, or a different pump."],
 "One needs more available head or a different pump. The other needs vendor agreement and a look at how steady the suction is.")

q(2, "An available head that is not a number and an available head of infinity both return the same thing. What is it?",
 "{ error: \"the margin check needs a finite available NPSH: there is no verdict to give on a suction head that cannot be read\" }",
 ["A severity of \"cavitating\" with a pass of false, which is how this check has always reported an input it could not place anywhere on its own scale.",
  "A null severity beside a null pass flag, with the ratio and the required margin still computed from the required NPSH.",
  "Two different messages, one naming the value as unreadable and the other naming it as unbounded."],
 "One message covers both because both fail the same test, which is that the available head be finite. The refusal names the input it could not read.")

q(1, "Why does the check refuse rather than classify when it cannot read the available head?",
 "The available head is the whole of what the function judges, so there is no severity to report and no pass flag to set.",
 ["An unreadable input is the one case where the engine has no default to fall back on, so refusing is what it does in place of applying one.",
  "A label invented over an unreadable input would come back looking exactly like a label computed from a real one, carrying a pass flag, a ratio and a note that are each a statement about nothing.",
  "The required NPSH is still readable, so the check could classify on that alone and declines because a one-sided verdict would be misleading."],
 "Strip the available head out and there is nothing left to compare the rule against. A refusal is a returned object carrying an error key, and it is not a pass of false.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/intermediate/fc3i_m02.json', expect_n=15)
finish()
