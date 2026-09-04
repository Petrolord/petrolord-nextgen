# The payoff near tangency

Where two curves nearly touch, a small move one way buys a great deal and the same move the other ends the well.

{{panel:pd-node-explorer}}

## What tangency is

Raise the tubing curve and the dip in the residual gets shallower, so the crossings run toward each other. Raise it far enough and the dip touches zero: the crossings merge, the window and the minimum residual are zero. Raise it further and the residual is positive everywhere, and the well is not producing a little less, it is producing nothing. Continuous in the geometry, discontinuous in the outcome.

## Walking FORCADOS-3 toward it

| pWh, psia | Rate, stb/d | Window, stb/d |
| --- | --- | --- |
| 860 | 2246.821833 | 2064.445505 |
| 1060 | 1990.931611 | 1695.613297 |
| 1160 | 1842.012114 | 1473.513228 |
| 1469.15 | 1014.239511 | 57.851719 |

The inflow curve never moves; the open flow is 4135.949669 stb/d throughout, and 960 psia reads 2125.009203 stb/d with a window of 1890.521117 stb/d. The upper rows suggest nothing is coming. At 1469.15 psia the heading crossing has climbed from 234.488087 to 956.387791 stb/d, the operating crossing has fallen to 1014.239511 stb/d, and the minimum residual has gone from -509.628610 psi to -0.478610 psi.

## The two directions are not the same operation

Coming down to 1160 psia takes the well from 1014.239511 to 1842.012114 stb/d and the window from 57.851719 to 1473.513228 stb/d. Nowhere earlier did a few hundred psi do that.

Going up has no smaller version of that answer. The margin is -0.478610 psi, and a lift past zero removes both crossings at once: no reduced rate, no degraded point, nothing. The derivative is enormous one way and undefined the other, because on that side the quantity does not exist.

## Why it is general

The closed form instruments share an inflow curve: at 1900.0000 stb/d both read an inflow pressure of 463.525492 psia, while the outflow reads 1233.525492 psia in one and 1273.425492 in the other. The residual rises by the same small amount everywhere: 770.000000 psi becomes 809.900000 at 100.0000 stb/d, and -40.000000 becomes -0.100000 at 1000.0000 stb/d.

For that uniform lift the window went from 400 stb/d to 20 stb/d. Near a minimum a function is flat, so a small vertical shift moves its zeros a long way sideways, and further the closer the minimum sits to zero. Any two nearly tangent curves do this.

## The failures compound

Near tangency the window is small by definition, which is exactly where a sign change scan cannot see it. Choked FORCADOS-3's window of 57.851719 stb/d sits against a default spacing of 105.837892 stb/d, and at 50 grid points the engine reports it dead. Maximum sensitivity and minimum instrument reliability arrive together, and a dead verdict looks most physical where it is least trustworthy.

The mistake is reading the approach as a graceful decline. Extrapolate the upper rows and you predict a gentle fade; at 1469.15 psia the rate is 1014.239511 stb/d, and beyond it there is no rate at all.

## Exercise

Record FORCADOS-3's window at 860, 1060 and 1160 psia, then its window and minimum residual at 1469.15 psia.

Say what coming back to 1160 psia buys, what a further increase costs, and why that second answer is not a number.
