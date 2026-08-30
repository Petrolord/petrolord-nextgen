# The seven canonical cases

What each one stands for, and which check it exists to load.

{{panel:ct-loadcase-explorer}}

## The list

| case | inside | outside | loads |
|---|---|---|---|
| gasKickBurst | gas column from a shoe control pressure | seawater | burst |
| pressureTestBurst | test pressure plus mud | seawater | burst |
| fullEvacuationCollapse | nothing | mud | collapse |
| partialEvacuationCollapse | gas above a level, fluid below | mud | collapse |
| cementingCollapse | displacement water | wet cement | collapse |
| runningAxial | mud | mud | tension |
| customGradient | any two densities plus a surface pressure | as given | whatever it makes |

## Gas kick

The well has taken an influx and it is shut in. The gas is at the shoe at the control pressure, and because gas weighs almost nothing the pressure barely falls on the way to surface. Outside the pipe there is water.

The published run puts 44269723.294470266 Pa at the shoe, derived from a fracture equivalent mud weight of 1800 kg/m3 there.

## Pressure test

The string is full of mud and the surface is pumped to the test pressure, 35000000 Pa here. Outside is water. This is the highest internal pressure the string will ever legitimately see, and it happens deliberately.

## Full evacuation

The inside of the pipe is empty and the outside is full of mud. This is the pessimistic collapse case and it is the one most strings are sized on.

## Partial evacuation

More realistic: the fluid level inside has dropped to some depth and there is fluid below it. The published run uses an evacuation fraction of 0.4, which puts the level at 1504.7518195805999 m.

## Cementing

During the job the pipe is full of displacement water and surrounded by wet cement, which is much denser. It is a collapse case and it is the one people forget, because it only exists for a few hours.

## Running

The string is being lowered, full of mud, surrounded by mud, so there is no pressure differential at all anywhere. What there is instead is the full buoyed weight plus any overpull applied at surface, 445000 N in the published run.

## Custom gradient

An escape hatch. Two densities and a surface pressure, so any case not in the list above can be built by hand. The published run uses 500 kg/m3 inside with 5000000 Pa at surface against 1600 kg/m3 outside, which is roughly a gas-lifted well against a heavy annulus.

## Exercise

For each of the seven, say without running anything whether the burst differential at the SHOE is positive, negative or zero.

Then check all seven in the panel and see how many you got.
