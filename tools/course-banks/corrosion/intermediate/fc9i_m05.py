import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Professional m05, the allowance.
# Every allowance figure here is taken from digest Section 19, the shipped
# studio case, with the lives from Section 11 and the oil-wet case from Section
# 8. This bank quotes no Section 14 figure, which at the time it was written was
# forced: Section 14's owner clause named only Expert m02, so a Professional
# question quoting it would have been a forward reach. THAT CLAUSE WAS WRONG and
# the second repair pass fixed it, and Section 19 now carries a worked case with
# a NON-ZERO consumed depth, so a later pass may key on either. The scope seams
# are Section 23 and the narrow reading of the word integrity is Section 22.

q(0, "What arithmetic is the remaining life in this module?",
 "The corrosion allowance less what has already gone, divided by a rate.",
 ["The corrosion allowance divided by the design life that was typed in.",
  "The wall thickness less a minimum thickness, divided by a rate.",
  "The corrosion allowance multiplied by the effective corrosion inhibition."],
 "Take the allowance, subtract the consumed depth, divide by a rate, and stop. That division is the whole of what the word integrity means in this course.")

q(2, "On the studio's shipped default case, what are the corrosion allowance and the consumed depth?",
 "An allowance of 3.175000 mm and a consumed depth of 0.000000 mm.",
 ["An allowance of 15.090473 mm and a consumed depth of 3.175000 mm.",
  "An allowance of 11.915473 mm and a consumed depth of 0.000000 mm.",
  "An allowance of 0.000000 mm and a consumed depth of 3.175000 mm."],
 "With nothing consumed, the corrosion allowance and the remaining allowance are the same figure, which is why a reader can go a long way on that case without noticing that they are two separate quantities.")

q(1, "What remaining life does the shipped case report?",
 "4.207953 yr.",
 ["0.242737 yr, which the same case reaches at 60 ft per second.",
  "20.000000 yr, which is the design life the case was given.",
  "36.112878 yr, which one of the digest's own streams carries."],
 "That is the remaining allowance divided by the rate, and nothing else. A remaining life of that size does not say when to inspect and it does not say what thickness to retire at.")

q(3, "The shipped case carries a design life of 20.000000 yr. What verdict does the screening return against it?",
 "That it is not met.",
 ["That it is met, the allowance outlasting the stated design life.",
  "It is withheld.",
  "None is offered."],
 "The binding constraint on that case is the corrosion allowance against the design life, and the engine reports the life it actually reaches beside the life it was asked for.")

q(0, "On the shipped case, what allowance would a new line at the shipped rate have needed in order to reach the end of the stated design life?",
 "15.090473 mm.",
 ["3.175000 mm, which is the allowance the line already carries.",
  "11.915473 mm, which is the gap between two of the fields on that screen.",
  "0.000000 mm."],
 "That field asks what a line at this rate would have needed to be built with in order to reach the end of the stated design life. It is a different question from how long this line has.")

q(1, "What shortfall in millimetres does the shipped screen carry?",
 "11.915473 mm.",
 ["15.090473 mm, which is the allowance the design life demands.",
  "3.175000 mm.",
  "4.207953 mm."],
 "The shortfall sits between the two allowance fields. It is the gap a reader has to close, measured from where the wall is now.")

q(2, "On the shipped case the engine's own binding constraint sentence names three figures. Which three?",
 "The rate, the years the allowance reaches, and the millimetres of allowance it is short by.",
 ["The wall shear, the stripping threshold, and the metal loss ratio.",
  "The efficiency, the availability, and the effective protection.",
  "The H2S ratio, the regime word, and the decades above the threshold."],
 "Its words are that at 0.755 mm/yr the allowance runs out in 4.2 years against a 20 year design life, short by 11.92 mm of allowance. Of everything on that screen, this is the limit that governs the answer.")

q(0, "Three studios in this suite take a corrosion allowance. What does each of them do with it?",
 "This one consumes an allowance, while the line sizing and storage tank studios each add one.",
 ["All three consume an allowance, and each returns a remaining life from it.",
  "All three add an allowance, this one adding it to the wall it screens.",
  "This one adds an allowance, and the other two consume one to give a life."],
 "The line sizing studio adds one to a pressure-containing wall and the storage tank studio adds one to a shell course. The wall this studio is eating is not the wall either of those sized, and there is no link between the three.")

q(3, "This module cannot say what the allowance is being taken off. Which calculation would answer that, and who owns it?",
 "The Barlow thin-wall relation with a design factor, owned by the Pipeline Network course at its Associate tier.",
 ["The erosional velocity criterion for the line, which the Casing and Tubing Design course owns at its Expert tier.",
  "The Kremser relation, owned by the Gas Processing course at its Professional tier.",
  "The remaining life division, which this module owns and already computes."],
 "This module has no minimum thickness, so it cannot tell you how much wall sits underneath the allowance once the allowance is gone. Naming the owner and stopping is what this course does with a quantity another course already owns.")

q(1, "Which course owns wall loss taken to a derated burst pressure?",
 "The Torque and Drag Expert tier owns it.",
 ["The Pipeline Network course, at its Associate tier.",
  "The Fluid Properties course, at its Expert tier.",
  "This one, which reports it beside the remaining life."],
 "This module consumes an allowance and never computes a pressure, so the comparison between the two is a pivot from one course to another rather than a derivation you can run here.")

q(2, "Which live Academy course refuses corrosion in its own scope statement, the refusal this course fills?",
 "The Well Integrity and P and A course, which refuses corrosion, wall loss and remaining life in its own scope.",
 ["The Casing and Tubing Design course, which defers its erosional criterion to this one.",
  "The Storage Tank course, which takes its shell allowance from this module's output.",
  "The Fluid Properties course, which hands this one a fugacity for the rate."],
 "FC9 fills exactly that refusal. The vocabulary does not travel in the other direction, because a barrier envelope is not a corrosion allowance and neither word can be substituted for the other.")

q(0, "What does the word integrity mean in this course?",
 "One arithmetic: a corrosion allowance divided by a rate.",
 ["A fitness-for-service assessment against a recognised method.",
  "A minimum thickness compared against the measured wall.",
  "A barrier envelope holding pressure across a defined boundary."],
 "The gap between that narrow reading and the usual one is where a screen gets over-read, which is why saying so wherever the word appears is a rule in this wave rather than a stylistic preference.")

q(1, "An inspection interval, a minimum thickness, a retirement thickness and a fitness-for-service assessment are all absent here. In what sense?",
 "They are not provided, which is a decision rather than a number pending a source.",
 ["They are held for literature, pending a source that would settle them.",
  "They are computed and then withheld, because their inputs are assumed.",
  "They are present but disclosed only behind the studio's held list."],
 "Held means a source might settle it. Not provided means the module has taken a decision, and producing any of those four would mean adopting a standard this module does not carry. The engine exports both lists and the screening returns them.")

q(2, "The one rate this engine returns is described as a general uniform rate. What does that rule out?",
 "Reading it as a wall-loss prediction for a weld, a bend, a top-of-line film or a pit.",
 ["Reading it in mils a year alongside the millimetres a year the engine already returns.",
  "Reading it as the rate that the corrosion inhibitor datasheet efficiency would have given.",
  "Reading it against a design life stated in years."],
 "The module carries no localised model, so it cannot warn a reader who reads it that way. There is no pitting criterion and no localised rate anywhere in it.")

q(3, "Set the shipped case to oil wet, so the wetting factor becomes 0.000000. What happens to the remaining life?",
 "It is withheld.",
 ["It is returned as unbounded, which the screening reports as a pass.",
  "It is unchanged at 4.207953 yr, the allowance not having moved.",
  "The whole screening refuses, naming the wetting regime as the input at fault."],
 "An unbounded life is a number in the sense that a program can print it, and as a screening result it carries nothing, because it is true of every case where the rate is zero whatever put it there. A withheld field cannot be copied into a summary as a result.")

emit(Q, "/root/wt-fc9-nextgen/tools/course-banks/corrosion/intermediate/fc9i_m05.json", label="fc9i_m05", expect_n=15)
finish()
