# What a safe grid costs

Arithmetic is cheap, so the natural move is to scan finely and stop worrying. Right about the price, wrong about the problem.

{{panel:pd-node-explorer}}

## The price

One residual evaluation per grid point, each one inflow read plus one outflow read. Linear in the count. Where the outflow is a stepped column the inner count multiplies the outer: BONNY-7's is carried at 16 sub-intervals, FORCADOS-3's at 24. Never the binding constraint.

## What refinement buys on a well with no problem

| nGrid | BONNY-7 rate, stb/d | FORCADOS-3 rate, stb/d |
| --- | --- | --- |
| 40 | 1355.714057 | 2125.009203 |
| 200 | 1355.714059 | 2125.009207 |
| 900 | 1355.714055 | 2125.009206 |
| 4000 | 1355.714058 | 2125.009206 |

Spacing fell from 110.661425 stb/d to 1.079219 stb/d on BONNY-7 and the answer moved in the ninth figure, in no particular direction: root find tolerance, not grid error. The pinched instrument returns 1010.000000 stb/d at 110, 200, 400, 900 and 4000 alike.

## No count is safe for every well

Detection is guaranteed when the spacing is below the window, and the window is not bounded below. FORCADOS-3 walks from 2064.445505 stb/d at 860 psia to 1473.513228 stb/d at 1160 psia to 57.851719 stb/d at 1469.15 psia, reservoir untouched. At nGrid 4000 the choked spacing is 1.032177 stb/d, a ratio of 0.017842. Choke further and the window keeps closing while the spacing does not move, because spacing depends only on the open flow of 4135.949669 stb/d and the count.

So the choice is not a cheap unreliable answer against an expensive reliable one, but against an expensive unreliable one. The price gap is the least interesting thing about the pair.

## A count that really is a precision setting

Column integration converges: FORCADOS-3 reads 2600.819216 psia at 2 steps, 2608.220600 at 20 and 2608.360298 at 256, with truncations of -7.54108245, -0.13969836 and 0.00000000 psi. BONNY-7 reads 735.977254, 735.995382 and 735.995592 psia on the same counts.

Monotone, extrapolable, every step helping. Two integers on a settings panel, one rewarding the refinement instinct and one punishing it. Refining helps when the output is continuous in the discretisation, not when it is a discrete alignment test.

## The mistake is a policy

Somebody finds that 200 always worked and writes 200 into the workflow. On the pinched instrument the threshold sits between 100 grid points at 20.161616 stb/d and 110 at 18.311927 stb/d, against a window of 20.000000 stb/d; 200 clears it. A window a quarter as wide would not, and nothing would say so. The standard is defined against no property of any well, and the cases that justified it were the ones the old setting could already see.

## Exercise

Run BONNY-7 at 40 grid points and at 4000, write both operating rates in full, and say what produces the figures that differ.

Then take the choked window of 57.851719 stb/d against the spacing of 1.032177 stb/d at nGrid 4000 and say why that ratio is not a policy you can carry to the next well.
