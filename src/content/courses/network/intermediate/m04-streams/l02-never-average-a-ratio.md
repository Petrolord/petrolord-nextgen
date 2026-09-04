# Never average a ratio

Two water cuts do not average into a third. They combine through the rates that carry them.

{{panel:pd-network-explorer}}

## The published pair

A big dry well and a small wet one on one trunk. The trunk water cut = 27.500000 percent. The two well water cuts are 10.000000 and 80.000000 percent, and their plain average is 45.000000 percent.

Averaging the ratios is wrong by 17.500000 percentage points, a factor of 1.636364 on the sizing number. The average gave a well arriving on 10000 lb/d the same vote as one arriving on 30000 lb/d.

## Four wells, four cuts, one trunk

| AGBADA well | Oil, stb/d | Water, stb/d | Own water cut, percent | Rate on the system, lb/d |
| --- | --- | --- | --- | --- |
| AGBADA-2 | 1690 | 214 | 11.239495798 | 6004.874117054 |
| AGBADA-6 | 605 | 738 | 54.951600894 | 2318.356346320 |
| AGBADA-9 | 1042 | 369 | 26.151665485 | 3992.446687538 |
| AGBADA-12 | 118 | 401 | 77.263969171 | 985 |

The trunk water cut = 33.262507244 percent. The plain average of the four is 42.401682837 percent, wrong by 9.139175594 percentage points.

The wettest well is the smallest one on the system. An average hands it a quarter of the answer. The arithmetic hands it its share of 3455.000000000 stb/d of oil and 1722.000000000 stb/d of water, and that is where the nine points went.

## What a ratio survives

A cut is oil against water, and neither moves when the mass is wrong. Hand the same network well stream masses at twice their honest value and the separator oil comes back at 3455.000000000 stb/d against 3455.000000000 stb/d at the honest mass, a difference of 0.0000e+0 stb/d.

A component ratio is robust to a mass error, so it can never be used to detect one.

## What the check says about the same answer

The mass shares that built the trunk cut came out of a solve reporting converged = true at a residual of 1.546141e-11 lb/d. `checkConservation` on that same answer reports a gap of 345 lb/d, 2.593852900 percent of what the engine says was produced, and the trunk stream carries 13300.677150912 lb/d where the solve says 12955.677150912 lb/d passes.

So 33.262507244 percent is the right cut for the rates handed in, and not evidence that those rates are what the network delivers.

## The careful mistake

Reconciling a well test cut, a header cut and a plant cut by averaging them. Ratios combine only through their rates, and the error is set by how unequal those rates are: 17.500000 percentage points on two wells, 9.139175594 on four whose wettest is also their smallest.

## What it refuses

`propagateStreams` never returns a cut, a gas-oil ratio or any other ratio. It returns oil, water, gas and mass on every branch and leaves every ratio to the reader, because a ratio it computed is a ratio somebody quotes later without the rate that made it.

## Exercise

Record the four well cuts and the trunk cut on the panel, then compute the plain average of the four.

Say which well the difference belongs to, and what happens to both numbers if that well's stream mass is doubled.
