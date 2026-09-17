import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Expert m02, Limits That Discriminate. Digest sections 16 and 20, with the
# thin-wall ratios of section 11 as the worked case. 15 questions.

q(1, "A capacity ratio of 0.000000 describes which stream?",
 "One that absorbs heat without changing temperature, such as a boiling liquid or a condensing vapour.",
 ["One whose capacity rate matches the capacity rate of the other stream exactly, so that neither of the two can pull ahead of the other.",
  "One with no flow at all, which this engine refuses rather than rates.",
  "One passing over a surface of zero area, so that the NTU is zero with it."],
 "Its capacity rate is effectively unbounded, so the ratio of the smaller to the larger goes to nothing. A capacity ratio of 1.000000 is the case where the two rates match.")

q(3, "At a capacity ratio of 0.000000 and an NTU of 1.400000 the engine returns 0.753403. What happens to that figure if the arrangement is changed?",
 "Nothing, because all three arrangements return 0.753403 there.",
 ["It falls to 0.628836 for parallel flow and to 0.659770 for a 1-2 shell unit.",
  "It falls to 0.545902 for parallel flow and to 0.588924 for a 1-2 shell unit.",
  "It is refused for parallel flow, since a ratio of zero puts the request above the parallel ceiling."],
 "The figures 0.628836 and 0.659770 belong to a capacity ratio of 0.350000, and 0.545902 and 0.588924 to 0.650000. At a ratio of zero every row of the sweep carries one figure three times.")

q(0, "Why does the arrangement stop mattering at a capacity ratio of zero?",
 "A stream that does not change temperature has no ends to pair, so it presents the same temperature everywhere along the bundle.",
 ["The driving force collapses to nothing, so every arrangement delivers the same effectiveness of zero.",
  "The engine routes all three arrangements through the counter-current branch once the ratio reaches zero.",
  "A capacity ratio of zero puts every arrangement at its ceiling, and every ceiling there is 1.000000."],
 "An arrangement is bookkeeping about which fluid has already been warmed by the time it meets a given piece of metal. Remove the warming and the bookkeeping has nothing to record.")

q(2, "The collapse table carries a column reporting whether the three arrangements are equal on each row. Why report that rather than print the three figures and stop?",
 "A table a reader has to scan for a mismatch by eye is scanned carefully once, and a table carrying its own verdict is re-checked on every rebuild.",
 ["Because the three figures are rounded for display at six decimals, and the underlying values differ from one another in digits the table does not print at all.",
  "Because the engine cannot return three arrangements on one call, so the equality is asserted in place of the third figure.",
  "Because the equality holds only at some of the six NTU values in the sweep, and the column says which."],
 "The equality is asked of the engine rather than asserted by whoever wrote the table down, and it reads yes on every row of the sweep.")

q(1, "What makes a check discriminating?",
 "A plausible error changes its outcome.",
 ["It passes on every published case in the file.",
  "It is run on every rebuild rather than once at review.",
  "It compares the engine against a second implementation."],
 "Passing is a weaker requirement than discriminating. A second implementation that shares a constant with the first cannot fail for the reason that matters, which is what the wall factor of two showed.")

q(3, "Imagine a mistyped coefficient in the 1-2 shell closed form alone. How does the collapse row expose it when an ordinary case at a capacity ratio of 0.650000 does not?",
 "At the collapse the row must carry one figure three times, so a single wrong branch turns the equality report from yes to no. At 0.650000 the three legitimately differ, so nothing says which figure the odd one should have been.",
 ["At the collapse all three branches share one piece of code, so a mistyped coefficient there breaks every arrangement at once and is impossible to miss.",
  "At the collapse the engine compares its answer against the published file, and at 0.650000 there is no published row to compare against.",
  "At the collapse the effectiveness is 1.000000 by definition, so any departure from one is the error itself."],
 "A wrong constant in any one of the three breaks the row it sits on and leaves the other two untouched. That is exactly the kind of error a single case cannot find.")

q(2, "The ceilings pin the closed forms at the other end of the range. What does a wrong constant in the parallel form show up as?",
 "A column heading for a ceiling it never arrives at.",
 ["A refusal on every request above the ceiling rather than below it.",
  "An effectiveness above 1.000000 at a high enough NTU.",
  "A ceiling reported for counter-current flow as well as for the other two."],
 "Parallel flow at a capacity ratio of 0.650000 runs 0.597755 at an NTU of 2.600000 and 0.606059 at 8.000000, against a ceiling of 0.606061. Neither check needs a figure from outside this repository.")

q(0, "Rank the three grades of check this module uses, from weakest to strongest where the method itself is what is in doubt.",
 "A restatement, then an independent route, then an analytic limit.",
 ["An analytic limit first, then a restatement, and an independent route last of the three.",
  "An independent route, then an analytic limit, and a restatement last.",
  "A restatement, then an analytic limit, then an independent route."],
 "A restatement puts the form under test on both sides. An independent route can fail for a reason that matters. An analytic limit is true independently of both implementations.")

q(1, "The wall term in this module's coefficient carries a factor of two. Move that factor the same way in the engine and in the oracle. What happens to the published cases?",
 "Every one of them stays green, and the agreement is the finding rather than the reassurance.",
 ["The bundle cases fail while the coefficient cases pass.",
  "The engine and the oracle part company in the last digits.",
  "Every one of them fails, because the oracle derives the wall term from the flat plate rather than from the cylinder."],
 "Both files now say the same wrong thing. The thin-wall limit is what catches it, because a thin cylindrical wall has to collapse onto a flat plate and a flat plate has no factor of two to argue about.")

q(3, "The wall resistance over the flat plate is 1.127984 at one wall thickness and 1.002005 at another. Which figure belongs to the thinner wall?",
 "1.002005, because the two expressions converge as the wall thins.",
 ["1.127984, because a thin wall carries proportionally more curvature than a thick one.",
  "1.127984, because the flat plate is the limit a thick wall approaches rather than a thin one.",
  "Neither, since that pair is measured at two conductivities."],
 "The ratio runs 1.127984, 1.036724, 1.010135 and 1.002005 as the wall thins, at one conductivity throughout. That is the limit fixing the factor of two.")

q(2, "The published case file for this module carries how many sections and rows, and what does it declare about itself?",
 "19 sections and 75 rows, declared synthetic because this repository carries no published heat exchanger case.",
 ["19 sections and 75 rows, declared as taken from the literature for every section in the file except the air cooler, whose rows it builds itself.",
  "12 sections and 45 rows, declared synthetic because the oracle and the engine share a source.",
  "19 sections and 75 rows, declared provisional until the held register is emptied."],
 "Inventing a citation would have been worse than saying so, because a fabricated source is quoted onward by readers who cannot check it and the invention travels further than the number.")

q(0, "What is a golden figure in this module?",
 "The oracle's answer, reached by a different route from the engine's, so that a golden column beside an engine column is two methods meeting.",
 ["The engine's own answer, recorded once so that a later change to the engine shows up as a difference.",
  "A figure taken from a publication, which is why the file can be used to validate the engine.",
  "The average of the engine and the oracle, recorded to the digits the two agree to."],
 "For the log mean the oracle integrates the driving force and never evaluates a logarithm. For the bundle it bisects on the diameter. For the hot day it bisects the surface equation and never touches the effectiveness relation.")

q(1, "Three things stand in for publication here. Which of them catches a wrong form that both files hold?",
 "An analytic limit.",
 ["An independent route.",
  "A constant pinned by literal.",
  "A published row in the golden file."],
 "An independent route catches a wrong implementation of a form both files agree about. A pin catches a change nobody meant to make. There is no published row in this file at all, since it is declared synthetic.")

q(2, "The published file carries a row in each of the three arrangements at a capacity ratio of 0.000000. At an NTU of 1.500000 what effectiveness do those rows carry?",
 "0.776870, the same figure in all three.",
 ["0.753403 for counter-current and lower figures for the other two.",
  "0.999665, which is the value the collapse reaches by that NTU.",
  "0.527633, the same figure in all three."],
 "The collapse is in the committed data rather than only in a table, and 0.753403 is the collapse figure at an NTU of 1.400000 while 0.527633 is the one at 0.750000.")

q(3, "Nothing in this course grades a held item, a fitted constant or a film coefficient. What is that a consequence of?",
 "The same honesty that declared the file synthetic, since a number nothing can validate is a number nobody should be marked against.",
 ["A policy that grades only figures the engine returns on more than one door.",
  "The capstone carrying its own units, which read none of the module's constants.",
  "The held register carrying more entries than the module's own header sentence states."],
 "It is a consequence rather than a separate rule. The register entries are taught as stated limits and never as answers.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/advanced/fc6a_m02.json', expect_n=15)
finish()
