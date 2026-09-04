# Trading length against width

Once the proppant is bought, length and width are the same purchase spent two ways.

{{panel:st-pack-explorer}}

## The constraint that makes this a design problem

Fix the proppant volume. Now the pack has a fixed amount of material to fill a fracture whose area you get to choose. Make the fracture longer and the same material has to cover more face, so the propped width falls. Make it shorter and the width rises.

The sweep in the panel does exactly this. It holds the placed proppant constant and walks the half-length across nine values.

| half-length, m | propped width, m | conductivity | pseudo-skin | effective radius, m |
|---|---|---|---|---|
| 30 | 0.007557717000910759 | 16.62461952126903 | -4.852065115237415 | 13.824481793012746 |
| 60 | 0.0037788585004553794 | 4.156154880317257 | -5.307558147157588 | 21.800525942345157 |
| 90 | 0.002519239000303586 | 1.8471799468076697 | -5.411369722473095 | 24.185315963132414 |
| 120 | 0.0018894292502276897 | 1.0390387200793143 | -5.386870011212449 | 23.59998223682871 |
| 150 | 0.0015115434001821517 | 0.6649847808507611 | -5.3116380662677045 | 21.889652014700083 |
| 200 | 0.0011336575501366137 | 0.3740539392285532 | -5.155298215903494 | 18.721529355355532 |
| 260 | 0.0008720442693358568 | 0.2213336918512149 | -4.975795238259742 | 15.645309919270554 |
| 340 | 0.0006668573824333022 | 0.12943042879880734 | -4.7800300267725575 | 12.863656053115536 |
| 440 | 0.0005152988864257336 | 0.07728387174143661 | -4.59691654548207 | 10.711227534493757 |

Multiply any row's half-length by its propped width and you get the same number as every other row. That is the fixed proppant volume, showing itself as a straight trade. Double the length, halve the width.

## The short fat end

At 30 m the pack is 0.007557717000910759 m wide and the dimensionless conductivity is 16.62461952126903, far above the optimum of 1.6.

Nothing is wrong with that fracture as a pipe. It carries far more than it is asked to carry. What it lacks is reach. It only drains 30 m out into a 1 mD formation, so most of the drainage area still has to push oil through rock to get to it, and the pseudo-skin sits at -4.852065115237415, the worst but one in the table.

Conductivity you cannot fill is money left in the hole.

## The long thin end

At 440 m the pack is 0.0005152988864257336 m wide and the conductivity has fallen to 0.07728387174143661.

This fracture reaches a long way and cannot carry what it collects. Oil enters along its whole length and then has to travel to the well down a channel too thin to pass it, so the far end is largely decorative. The pseudo-skin is -4.59691654548207, the worst in the table, and the effective radius has fallen to 10.711227534493757 m from a peak of 24.185315963132414 m.

Note also where that last row sits. The engine states the range over which its skin correlation applies as 0.1 to 1000, and 0.07728387174143661 is below the bottom of it. The number is still printed, but you are outside the correlation's stated ground and should say so rather than quote it.

## The middle

Between the two failures the pseudo-skin passes through a minimum, near 90 m in this grid and at 95.62290278496067 m when searched continuously. Both ends of the sweep are worse than the middle, which is the signature of a genuine trade rather than a preference that runs one way. The long thin end is the worse of the two failures here, because a fracture that cannot carry its own inflow wastes every metre beyond the point where it chokes.

## Exercise

First, pick any two rows of the sweep and confirm that half-length times propped width is the same in both. Say in one sentence what physical quantity that product stands for.

Second, for the 30 m and 440 m rows, write down which of the two things a fracture does, collect fluid and carry it, is the one that has been starved.
