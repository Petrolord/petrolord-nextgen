# Average T and z as a check

A second implementation of a different method, disagreeing for a reason that is not a bug in either of them.

{{panel:pd-vlp-explorer}}

## The closed form cousin

`averageTzBhp` fixes temperature at the average of the wellhead and shoe values and the compressibility factor at its value at the average pressure. With both constant the defining integral has a closed form. It still iterates, but on one scalar rather than down a column.

| Column | Marched at 256 | Average T and z |
| --- | --- | --- |
| golden staticVertical | 952.982971 | 952.329013 |
| golden flowingVertical | 1069.628989 | 1070.371737 |
| golden flowingHighRate | 1437.879989 | 1441.415011 |
| golden flowingDeviated | 1399.082259 | 1399.198450 |
| golden prescribedFriction | 1338.852041 | 1341.080836 |
| BONNY-7 | 735.995592 | 735.658610 |
| FORCADOS-3 | 2608.360298 | 2626.370567 |

All in psia. The engine reports the gap directly: 0.336981 psi on BONNY-7, -18.010269 psi on FORCADOS-3.

## Read the signs

On the two columns with no rate the averaged answer reads low. On every column carrying rate it reads high. A random arithmetic discrepancy would not sort itself by whether the column flows.

Holding the compressibility factor at one value asserts it is near linear in pressure across the column, and it is not. On a static column that leaves the answer slightly light. Add a friction group, the integrand bends, and it comes back heavy. The gap scales accordingly: under a psi on the static columns, -18.010269 psi on FORCADOS-3, whose friction group of 0.02721909 is the largest in the course.

## A method gap, not an arithmetic gap

Two numbers from one engine can disagree in two different ways.

The first is one method at two resolutions. FORCADOS-3 reads 2600.819216 psia at two sub-intervals and 2608.360298 psia at 256, marching steadily toward the second. That is truncation, and refinement says which number is the answer.

The second is two methods. Cullender and Smith updates the compressibility factor and temperature at every station; the closed form holds both at one value. Both are published, both correctly implemented, both exact solutions of their own statement of the problem. Refining one does not move it toward the other, because there is nothing to refine toward. **The -18.010269 psi on FORCADOS-3 is not an error in either implementation. Neither is a bug.**

Refinement separates the two cases. If the gap shrinks toward zero it was truncation. If it settles and stops moving, it is two methods being two methods. Treat a method gap as a bug and you lose a day chasing a defect that does not exist; treat a truncation as a method gap and you ship a number a step count would have fixed.

## Using it, and misusing it

Use it as a magnitude check. Under a psi on a light static column and tens of psi on a heavy flowing one are both normal; hundreds means an input differs between the two calls.

Do not average the two answers. That is a third number from no published method. If you need one, take the marched answer and state its step count.

The returned average compressibility factor is a free diagnostic: 0.93241456 on BONNY-7 against 0.91517071 at its wellhead, 0.86007976 on FORCADOS-3 against 0.83499274.

## Exercise

Record the marched answer, the averaged answer and the gap for both wells. Then run FORCADOS-3 at two sub-intervals and at 256, and say which of the two gaps closes under refinement and which does not.
