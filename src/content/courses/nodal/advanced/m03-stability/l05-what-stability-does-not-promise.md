# What stability does not promise

A stable crossing says one thing: the residual is increasing through zero there, so a small displacement decays. Everything else read into the word is not in it.

{{panel:pd-node-explorer}}

## The claim, at its actual size

Local, because it holds in a neighbourhood of the crossing. Small, because a large displacement leaves that neighbourhood. About a model, because the residual came from two fitted curves under boundary conditions somebody chose. Conditional on arrival, because it names a place the well stays and not one it reaches.

## It does not promise room

ESCRAVOS-9 at a wellhead of 480 psia operates at 1009.759948 stb/d and 1829.772050 psia, residual slope 0.16537053 psi per stb/d, stable. Its window is 552.770229 stb/d, its minimum residual is -23.748626 psi, and it holds on the falling gravity limb, its operating point at -792.375394 stb/d relative to a tubing minimum rate of 1802.135341 stb/d.

BONNY-7 is stable too, with a minimum residual of -989.578610 psi. The word is identical in both reports. Step ESCRAVOS-9's wellhead to 560 psia and the status is dead, at 0.000000 stb/d.

## It does not promise arrival

FORCADOS-3's stable crossing at 2125.009203 stb/d sits above an unstable one at 234.488087 stb/d, and below that rate the residual is positive, the well slowing toward a dead column of 4310 psia, 590 psi above its reservoir pressure of 3720 psia. The stable answer carries an unstated precondition: somebody got the well above 234.488087 stb/d and it has not been below since. BONNY-7 carries none, its dead column of 2570 psia sitting 170 psi below 2740 psia. The two reports look the same.

## It does not promise the curves are right

Nothing in the test looks at where the inflow came from. FORCADOS-3 was calibrated from a test of 2400 stb/d at 2180 psia, below its bubble point of 2450 psia, so a straight line through it backs out 1.55844156 stb/d/psi against the composite's 1.57194033 stb/d/psi, and 5797.402597 stb/d of open flow against 4135.949669 stb/d. Solve on either and both converge, return a crossing, mark it stable.

## It does not promise anything with a clock in it

No time and no price: nothing about slugging, terrain, fallback, period or amplitude, and no mechanical limit. ESCRAVOS-9's velocity ratio of 0.09142385 against an erosional velocity of 13.245324 ft/s at a C of 100 came from a calculation the node solver never consulted.

## What to report instead

Replace the word with the numbers behind it: rate and flowing pressure, window, minimum residual, clearance to the tubing minimum, and the calibration the inflow came from. The last is what stable most thoroughly conceals.

## Exercise

Read ESCRAVOS-9's window and minimum residual at 480 psia, then its status at 560 psia.

Then write every claim you would make by passing only the words flowing and stable to a colleague, and name the number needed to defend each.
