# Tangency

Between a well with two crossings and a well with none is one configuration where the dip just touches zero.

{{panel:pd-node-explorer}}

## The configuration

Whether a well whose column outweighs its reservoir has two crossings or none depends on whether its residual dip gets below zero. FORCADOS-3's minimum is -509.628610 psi at 985.078572 stb/d, so it crosses twice. The golden deadWell reads 988.172727 psi at 30.0000 stb/d and 1940.762069 psi at 570.0000 stb/d, never below zero, and reports status dead with 0 crossings.

At tangency the dip reaches zero and stops. The crossings coincide and the window has zero width.

## The instrument

| Rate, stb/d | Wide, psi | Pinched, psi |
| --- | --- | --- |
| 100.0000 | 770.000000 | 809.900000 |
| 500.0000 | 210.000000 | 249.900000 |
| 1000.0000 | -40.000000 | -0.100000 |
| 1500.0000 | 210.000000 | 249.900000 |
| 1900.0000 | 770.000000 | 809.900000 |

The golden analyticResidualWide crosses at 800.000000 and 1200.000000 stb/d, 400 stb/d apart. Its pinched companion crosses at 990.000000 and 1010.000000 stb/d, 20.000000 stb/d apart.

## Approaching it on a real well

Choking FORCADOS-3 closes its window: 2064.445505 stb/d at a wellhead pressure of 860 psia, then 1890.521117, 1695.613297 and 1473.513228 stb/d at 960, 1060 and 1160 psia.

Take it to 1469.15 psia and it has a true operating rate of 1014.239511 stb/d, a true unstable crossing at 956.387791 stb/d, a true stable window width of 57.851719 stb/d, and a minimum residual of -0.478610 psi.

## The asymmetry

Improve the residual slightly and the window opens fast: -0.100000 psi to -40.000000 psi took the instrument's window from 20.000000 stb/d to 400 stb/d. Worsen it slightly and there is no window, no crossing, status dead. The well does not produce a bit less. It stops.

The gap between two nearly coincident roots goes as the square root of the depth of the dip, so small changes near zero move them a great deal. That is true of any two nearly tangent curves.

## What tangency will not do

It will not announce itself. FORCADOS-3 choked to 1469.15 psia reports an ordinary looking 1014.239511 stb/d on an open flow of 4135.949669 stb/d, and the status word is flowing for a window of 1890.521117 stb/d and flowing for one of 57.851719 stb/d.

It does not make the answer wrong. The pinched operating point at 1010.000000 stb/d is correct. Tangency threatens the fragility of the verdict, not the accuracy of the number.

## Exercise

Raise FORCADOS-3's wellhead pressure step by step, recording the operating rate and the window width.

Then say which you would put first in a report, without using the word stability.
