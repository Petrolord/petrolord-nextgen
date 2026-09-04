# Peak polished rod load

The largest load anywhere on the returned card. It sizes the beam, the structure and the polished rod itself, and it climbs with speed without ever stepping back.

{{panel:pd-card-explorer}}

## Where it comes from

`prlPeakLb` is the maximum of the surface card that `predictCard` returns. It is not a formula and it is not the fluid load plus the rod weight. It is a maximum taken over a curve, so it inherits everything the curve inherited: the damping ratio, the surface motion of the four-bar, and the phase of the wave returning from the pump.

On ODUMA-4 it comes back as 19545.877783339 lb, at cycle fraction 0.151227, with the polished rod 27.960212851 in into its travel. On the published taper it is 15230.601238973 lb at 5 spm and 16490.601223060 lb at 9 spm.

## What the independent route says

The oracle marched the same two published cases by a different scheme entirely and committed 15231.366293700 lb at 5 spm and 16545.574080121 lb at 9 spm. The engine sits -0.765054726 lb from the first, which is -0.005023 percent, and -54.972857061 lb from the second, which is -0.332251 percent.

Five thousandths of a percent at one speed and a third of a percent at the other. The peak is the best behaved of the three headline numbers this engine returns.

## It rises with speed and it does not wobble

| Speed, spm | Peak load, lb |
| --- | --- |
| 0.5 | 13756.379902 |
| 1.0 | 13972.566658 |
| 1.5 | 14050.168476 |
| 2.0 | 14193.455474 |
| 2.5 | 14334.399726 |
| 3.0 | 14540.702958 |

The climb continues without a single step back through 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 and 15 spm, reaching 15230.601239 lb at 5 spm, 16490.601223 lb at 9 spm and 18752.731892 lb at 15 spm. That is worth noticing, because the plunger stroke on the very same runs is ragged: it steps back six times over those same speeds. One number out of a march can be smooth in an input while another out of the same march is not.

## The datum at the bottom of the ladder

At 0.5 spm the published taper peaks at 13756.379902 lb against a buoyed rod weight plus fluid load of 13673.757962 lb. That sum is what a static rod string would hang on the polished rod on the upstroke, and the marched peak is very nearly it. Everything above that figure at a working speed is dynamics.

## What it will not tell you

It says nothing about torque, nothing about the counterbalance and nothing about the load anywhere except at the surface. It is one point on one curve.

## Exercise

Write the engine peak and the oracle peak for the published taper at 5 and at 9 spm, with both differences in lb and percent.

Then state the peak at 0.5 spm and the buoyed weight plus fluid load it is standing against.
