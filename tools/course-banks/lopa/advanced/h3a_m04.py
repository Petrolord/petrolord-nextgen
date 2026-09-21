import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H3 lopa, Expert tier, module 04 "The Published Example and Its Inferences".
# Digest sections drawn on: 29 (the inferred inputs and the printing slip),
# with section 23 present only as the reproduction those inferences were
# needed for.

q(0,
 "How many inputs had to be inferred before the published table reproduced, and which were they?",
 "Three: the restoration time after a proof test taken equal to the detected restoration time, a lifetime of ten years in the coverage table, and a beta factor of 15 percent where 10 percent is printed.",
 ["Two: the lifetime in the coverage table and the beta factor of the transmitters.",
  "One: the lifetime, which the paper's coverage table does not print anywhere.",
  "None: every input the reproduction used is printed in the source table."],
 "The course states that three inputs had to be INFERRED. Stopping at the lifetime and the beta factor leaves out the restoration time after a proof test, which the valve row needs. Stopping at the lifetime alone leaves out two. The reproduction is the reason the inferences were needed at all, so none is not an option."),

q(1,
 "The published valve subsystem is computed with the restoration time after a proof test set equal to its detected restoration time of 120 hours. Does the row reproduce, and what does that settle?",
 "It reproduces the printed 1.05E-03 to three figures, and setting that time to zero does not, so the table used MRT equal to the MTTR.",
 ["It misses the printed 1.05E-03 at the third figure, and only the row with that time set to zero reproduces, so the table used an MRT of zero throughout.",
  "It reproduces, and so does the row with that time set to zero, so the restoration time after a test is too short to matter on this subsystem.",
  "It misses until the beta factor is raised to 0.15."],
 "With the two restoration times equal the engine returns 0.001048767640, which rounds to the printed 1.05E-03. With the restoration time after a test set to zero it returns 0.001017167254, which rounds to 1.02E-03 and misses at the third figure. That is the first of the three inferences: the published table reproduces only with MRT equal to the MTTR. The beta factor slip belongs to the transmitter coverage row and does not touch the valve."),

q(3,
 "Suppose the published valve row meant no restoration time after a test at all. What does the engine return for it then?",
 "0.001017167254",
 ["0.001048767640, which is what the same row gives with that time at 120 hours",
  "0.000676060358, which is what the transmitter coverage row gives at a beta factor of 0.15",
  "0.000344085754, which is what the transmitter row gives at a beta factor of 0.15"],
 "The row at zero returns 0.001017167254, which is 1.02E-03 against a printed 1.05E-03. 0.001048767640 is the same row at 120 hours, and the other two figures belong to the pressure transmitters, one of them in the coverage table and one of them without coverage."),

q(2,
 "Where are the three inferences recorded, and what does that do to the count?",
 "The golden's source lines record two of them and the engine's validation record holds the restoration time inference, and the count of inferred inputs is still three.",
 ["The golden's source lines record all three of them, so the count is three and the engine's validation record adds nothing at all to what the golden already carries in its own lines.",
  "The golden records two of them and the engine's validation record holds a third item which is no inference at all, so the count of genuinely inferred inputs comes to two.",
  "The engine's source comments record all three, which is why the course re-measures them."],
 "The course says the golden's source lines record the lifetime and the beta factor slip, while the restoration time inference sits in the engine's validation record and is shown by running the row both ways. Where a record lives does not change what was inferred, so the count is three. The engine's own comments are provenance and record none of this."),

q(1,
 "Why does the restoration time inference show on the valve subsystem in particular?",
 "Its restoration time is long, at 120 hours, so setting the time after a proof test to zero moves the row far enough to change the printed third figure.",
 ["Its architecture is a 1oo2, and a redundant subsystem charges the restoration time after a proof test twice over, once in each of the two channels of the pair.",
  "It is the only subsystem in the published table that carries any detected failures at all, so it is the only row where a restoration time enters the arithmetic.",
  "It is the only subsystem whose proof test interval differs from the one year used elsewhere."],
 "The valve row carries an MTTR and an MRT of 120 hours, which is long, and the course computes the row both ways to show the effect. The published table uses a proof test interval of one year throughout, and several of its subsystems carry detected failures, so neither of those makes the valve special. A redundant architecture does not double charge a restoration time."),

q(0,
 "The coverage table's lifetime is not printed. What did the sweep of lifetimes show, and what is the honest label for the result?",
 "Only a lifetime of ten years reproduces all four printed coverage rows in the sweep, which is strong evidence short of proof, so the golden records the value as INFERRED.",
 ["Every lifetime in the sweep reproduces at least one row, so no lifetime can be preferred.",
  "A lifetime of eight years reproduces all four rows and is recorded as a measured input.",
  "The sweep was inconclusive, so the coverage rows were abandoned as unreproducible."],
 "Four rows match at ten years and at least one row misses at every other lifetime in the sweep, so the inference is strong. It is not proof, because some other combination could in principle land on the same four figures and only five lifetimes were tried, and the golden carries the word INFERRED with the value. Eight years misses on the valve and on the transmitters."),

q(3,
 "The pressure transmitter coverage row prints 6.76E-04. What does the engine give for it at a lifetime of eight years?",
 "6.00E-04",
 ["4.89E-04, which is what the same row gives at a lifetime of five years",
  "7.53E-04, which is what the same row gives at a lifetime of twelve years",
  "8.70E-04, which is what the same row gives at a lifetime of fifteen years"],
 "At eight years the transmitter coverage row gives 6.00E-04 against a printed 6.76E-04, so it misses at the second figure. 4.89E-04, 7.53E-04 and 8.70E-04 are the five, twelve and fifteen year columns of the same row, each one of the lifetimes the sweep tried and none of them reproducing."),

q(2,
 "Why is agreement on four rows a stronger argument than agreement on one?",
 "The four are different subsystems with different coverages and rates, and at least one of them misses the printed value in every other lifetime column.",
 ["The four rows are recomputed from one another, so agreement in one of them propagates through the remaining three and multiplies the strength of the evidence.",
  "A single figure can be hit by accident, and four figures give four chances to hit one by accident, which is what makes the argument strong.",
  "Four rows exhaust the published table, so nothing is left that could disagree."],
 "A single figure can be hit by accident, which is why one row would prove little; four independent subsystems agreeing at one lifetime and failing elsewhere is what carries the argument. Each row is computed from its own inputs, more chances to hit by accident would weaken the case, and the published table carries five subsystems in its main results."),

q(3,
 "Reading the valve row of the coverage sweep across its lifetime columns, at which lifetime does it read 3.78E-03?",
 "Fifteen years",
 ["Five years, the column in which that valve row reads 1.75E-03",
  "Eight years, the column in which that valve row reads 2.31E-03",
  "Twelve years, the column in which that valve row reads 3.13E-03"],
 "3.78E-03 stands in the fifteen year column. The five, eight and twelve year columns of that row read 1.75E-03, 2.31E-03 and 3.13E-03, and the printed 2.71E-03 is reproduced only in the ten year column."),

q(1,
 "The transmitter coverage row prints a beta factor of 10 percent. Computed with the beta factor and betaD at that printed value, what does the engine return?",
 "0.000473588152, which is 4.74E-04 at three significant figures against a printed 6.76E-04.",
 ["0.000676060358, which is 6.76E-04 at three significant figures and reproduces the printed value exactly.",
  "0.000344085754, which is 3.44E-04 and reproduces a different printed row of the same paper.",
  "0.001017167254, which is 1.02E-03 and misses its printed value at the third figure."],
 "At the printed beta factor the engine returns 0.000473588152, which rounds to 4.74E-04 and misses the printed 6.76E-04 by far more than rounding can explain. 0.000676060358 is the same row at a beta factor of 0.15. 0.000344085754 in the raised beta factor table belongs to the transmitters without coverage, and 0.001017167254 to the valve with its restoration time after a test set to zero."),

q(2,
 "At what beta factor does that transmitter coverage row reproduce, and with what figure?",
 "At a beta factor and betaD of 0.15, where the engine returns 0.000676060358, which is 6.76E-04 at three significant figures.",
 ["At 0.1, the printed value, where the engine returns 0.000473588152 and the printed figure follows once the third figure is rounded the other way.",
  "At 0.02, the beta factor of the other two coverage rows, where the row returns its printed value without any adjustment at all.",
  "At 0.1, with the lifetime lengthened to fifteen years to make up the difference."],
 "The row reproduces at a beta factor of 0.15, returning 0.000676060358 and so 6.76E-04. At the printed 0.1 the engine gives 0.000473588152, which is too far off for rounding. The other coverage rows carry their own beta factors and do not fix this one, and a longer lifetime is a separate inference that the four row sweep already settled at ten years."),

q(0,
 "What is the evidence that 15 percent is the value the published coverage table actually used?",
 "The table is headed as one that applies the MooN multiplication to the beta factor, which raises 10 percent by half to 15 percent, so the heading names the operation that turns the printed figure into the reproducing one.",
 ["The paper prints 15 percent in a second table, so the coverage table was read across.",
  "A beta factor of 0.15 is the usual value for voted transmitters in the process sector.",
  "The oracle's time dependent route reproduces the row only at a beta factor of 0.15."],
 "The heading of the table describes the MooN multiplication, which takes 10 percent to 15 percent, and that is the independent explanation from the document itself. The paper prints 10 percent on the row in question, the course recommends no beta factor as usual practice, and the time dependent route is provenance about the forms and settles nothing about an input."),

q(1,
 "A second published row confirms the beta factor reading. Which row, and what does it return?",
 "The pressure transmitter row of the raised beta factor table, which reproduces its printed 3.44E-04 with the beta factor and betaD both at 0.15.",
 ["The valve subsystem at a beta factor of 0.15, which returns 0.001048767640 and so reproduces the printed 1.05E-03 that the restoration time inference had already accounted for.",
  "The analogue input card in the raised table, which reproduces at 0.15 and is recorded in the golden.",
  "The summed function, whose total moves to the printed value once the beta factor is raised."],
 "The transmitter row of the raised beta factor table returns 0.000344085754 at 0.15 and reproduces its printed 3.44E-04, so two independent rows reproduce at 15 percent, and neither printed figure reproduces at 10 percent. The valve carries its own beta factor and its own inference. The analogue input card is the row the golden leaves out, and no total is offered as evidence here."),

q(2,
 "One further row of the raised beta factor table was left out of the golden. Which, and why?",
 "The analogue input card, which reproduces only with a betaD that looks like a rounded print, so it is too ambiguous to stand as evidence.",
 ["The valve row, whose restoration time after a proof test is inferred rather than printed, so it could not serve as evidence about a beta factor at the same time.",
  "The logic solver row, which carries no common cause term at all and therefore cannot test a beta factor reading of any kind.",
  "The summed total, which rounds to its printed value at either beta factor."],
 "The golden leaves out the analogue input card in the raised table, because it reproduces only with a detected common cause figure that looks like a rounded print. A reproduction argument is built from the rows that are clean, and the ambiguous row is named and set aside in the open. The other three are not what the course records as left out."),

q(0,
 "What is a published table evidence for, once a reproduction has needed an inferred input?",
 "It is evidence about the equations for the rows it reproduces, and the note has to say which input was inferred and what the alternative value produced.",
 ["It is evidence about the failure rates it prints, which a reader may carry to another plant.",
  "It is evidence about nothing at all once any input has had to be inferred.",
  "It is evidence that the inferred input is the correct one for any similar subsystem."],
 "The course's lesson for a verification note is that a reproduction which needs an inferred input says which input and why, and that a published table is evidence about the equations only for the rows it reproduces. The rates are the source's own example values, the inference is about the source and travels no further, and an inference that is declared still supports the rows that reproduce."),

emit(Q, '/root/hse-wip-lopa/banks/h3a_m04.json', expect_n=15)
finish()
