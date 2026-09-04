# The story so far

Five modules, and one object underneath all of them.

## The claim

The tubing does not deliver a pressure, it demands one. Ask what the bottom of the string needs to move a given rate up to a given wellhead pressure, sweep that across rate, and the answer is the outflow curve. It is one half of a producing well.

## What each module established

**Module 1.** Required bottomhole pressure is the wellhead pressure plus the weight of the column plus the friction against the wall, and it is a function of rate, not a number. BONNY-7 is four constants: 420 psia at the wellhead, a gravity constant of 2150 psi, a lightening constant of 375 stb/d, a friction constant of 0.00064 psi per stb/d squared. Its dead column stands at 2570 psia under a reservoir at 2740 psia, where FORCADOS-3's stands at 4310 psia, 590 psi above 3720 psia.

**Module 2.** Weight falls with rate, friction grows as its square, so the curve has a bottom. BONNY-7's gravity share runs from 0.99999437 at 4.32 stb/d to 0.01413193 at 4324.44 stb/d, friction overtaking gravity at 968.379388 stb/d. The reported minimum is a reduction over sampled rows: at 37 points it reads 604.341111 stb/d and 1477.003621 psia against a true 627.069742 stb/d and 1476.243252 psia. Sampling cannot land below the bottom of a bowl, so it always reads high.

**Module 3.** Three levers, three motions. Wellhead pressures of 280, 350, 420 and 490 psia give minima of 1336.243252, 1406.243252, 1476.243252 and 1546.243252 psia, all at 627.069742 stb/d: the curve lifts and keeps its shape. The lightening constant moves both and turns, at 561.403918, 627.069742, 646.294276 and 581.492476 stb/d. More friction moves the minimum left and up.

**Module 4.** One outflow model is built in, a dry gas column by Cullender and Smith, and it has no J in it: 952.986300 psia at 13.289296 Mscf/d rising to 1842.190804 psia at 13289.2963 Mscf/d. Its step count is part of its answer. The two station default costs 0.01833744 psi on a gravity only column and 7.54108245 psi on a friction loaded one.

**Module 5.** The same column read as an injection pressure. Its closed form cousin disagrees by 0.336981 psi on BONNY-7 and 18.010269 psi on FORCADOS-3, a method gap, not an error in either. FORCADOS-3's gradient of 0.15674503 psi/ft is mostly friction, so a psi/ft means nothing until the rate is stated.

## The one sentence

The tubing demands a pressure that falls, bottoms and rises with rate, and every reading off that curve carries the sampling, the method and the resolution that produced it.

This tier does not solve a node. A node solved on a curve you cannot vouch for is not an answer, it is an intersection.

## Exercise

Write the five module claims in one sentence each, and beside each the number you would use to defend it.

Then say what makes one teaching well the controlled case and the other the awkward one.
