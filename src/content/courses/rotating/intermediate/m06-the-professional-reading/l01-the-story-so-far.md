# The story so far

A duty point that works on paper fails in three ways, and this tier is all three: it fails on suction, it fails on change, and it fails on the fluid.

## Five questions, five answers

| question | the answer on the teaching cases |
| --- | --- |
| what does the suction side supply | 52.808173 ft of NPSH available |
| is that enough against a required 16.000000 ft | a margin of 36.808173 ft against a required margin of 5.600000 ft, adequate |
| what does a speed ratio of 0.800000 buy | 987.562375 gpm at 267.392652 ft |
| where will a trimmed machine actually run | at a trim ratio of 0.800000, 695.297235 gpm at 275.923397 ft |
| what does a second machine buy | 1198.970966 gpm against 1103.518695 gpm |

## The suction

NPSH available is assembled from three parts: a pressure head of 52.308173 ft over the vapour pressure, plus 6.000000 ft of static column, less 5.500000 ft of suction friction. Padding the drum reaches the first of those three and leaves the other two alone, taking the available head to 131.659135 ft at 60.000000 psia.

The available figure decides nothing on its own. A required NPSH from the vendor turns it into a margin, a ratio, a pass flag and a severity, and the rule that does so is the larger of a 3.000000000 ft floor and a 0.350000000 fraction of required. Those two halves change places at 8.571428571 ft, and the boundary ratio either side is 1.750000000 and 1.350000000. The rule is customary and nothing in this course is graded on it.

## The changes

A speed change follows the affinity laws exactly, and the engine proves it by subtraction rather than by assertion: the head quotient against the ratio squared comes back at 5.551115123125783e-17 or zero on every row of a sweep.

A trim does not. The engine returns ideal and real side by side, and at a trim ratio of 0.800000 they are 987.562375 gpm and 943.122068 gpm. The shortfall model behind that is held for the literature, and the engine leaves the power leg at the ideal cube rather than invent a second unsourced correction, reporting the efficiency ratio the return implies.

Applying either law to a duty point gives a point on the new curve rather than a new duty point. At a trim ratio of 0.950000, where the shortfall contributes nothing, the two answers are 1131.756344 gpm and 1172.730321 gpm, and the system curve not moving is the whole of the reason.

## The second machine and the fluid

Two identical pumps on a friction-dominated system give 1198.970966 gpm where one gives 1103.518695 gpm, with each machine down to 599.485483 gpm. In series, three give 942.653617 ft of duty head, while at a fixed 1000.000000 gpm the three add exactly, 1379.861681 ft against 459.953894 ft.

And the catalogue curve was a water curve. At 320.000000 cSt the corrected best efficiency flow is 1029.207641 gpm and the efficiency factor is 0.637190119.

## Exercise

Write the three parts of the OKONO NPSH available and their sum. Then give the two halves of the margin rule and where they change places, the re-solved and one-point flows at a trim ratio of 0.950000, and the station flow for one and for two machines in parallel.
