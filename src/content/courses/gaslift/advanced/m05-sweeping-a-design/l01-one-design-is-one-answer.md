# One design is one answer

A design run returns depths, settings and a warning list. Nothing in it says how close any of those were to being different.

{{panel:pd-unloading-explorer}}

## What a single run hands back

The published `midDecrementKnifeEdge` case: 9000.0 ft, kickoff 1164.7 psia, operating 1064.7 psia, 26.75 psi per valve, transfer differential 60.0 psi, unloading gradient 0.09 psi/ft, kill gradient 0.46 psi/ft, IPO valves on a 0.77 in2 bellows, design gas rate 600.0 Mscf/d.

| Valve | Depth, ft | Surface injection at its stage, psia |
| --- | --- | --- |
| 1 | 2354.019705701 | 1164.7000 |
| 3 | 5665.107234706 | 1111.2000 |
| 4 | 6871.141344247 | 1084.4500 |
| 5 | 7828.279404428 | 1057.7000 |
| 7 | 9000.000000000 | 1004.2000 |

Stop reason `targetDepth`, valve count 7, and four warnings, all multipointing, at stages 2, 3, 4 and 5.

## The verdict is a boolean and the boolean sits on nothing

The stage 5 warning says valve 4 is still open when valve 5 takes over. The engine reaches that by comparing casing against the closing surface pressure of valve 4, and the surface margin it computes is 0.124769727 psi.

The system it belongs to runs at 1164.7 psia at surface and 1279.335785 psia at valve 4. The published closing rule evaluated at valve depth gives 0.149791635 psi for the same knife edge, a second small number for the same edge.

A fraction of a psi on a system of over a thousand psia decides whether the string injects at one depth or two. The output prints the warning and does not print the margin.

## What one run cannot tell you

Whether 0.124769727 psi is a real property of this design or the residue of one input chosen to two decimal places. Whether moving any input a little moves the verdict. Whether the flip, if there is one, sits a hundredth away or a hundred away.

None of that is derivable from a single result, because the engine reports no derivative of any output with respect to any input.

## The method

Hold every input fixed but one, walk that one, and record the verdict and the margin at each point rather than the depths. A design sweep is not a search for a better design. It is a measurement of how far the answer you already have is from a different answer.

## What it refuses

The warning list is not a margin. It is a set of booleans with no distance attached, and two designs that both raise four multipointing warnings can sit on opposite sides of a knife edge with nothing in the output to separate them.

## Exercise

Write the published stage 5 surface margin, the published valve-depth closing margin, and the surface pressure of the system they belong to.

Then say what a report containing only the warning list would leave a reviewer unable to check.
