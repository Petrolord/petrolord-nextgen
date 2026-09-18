# The pressure drop ratio and its terminal value

On liquid the choking boundary is a pressure. On gas it is a ratio. That change of variable is the thing to carry out of this module, because it means the boundary moves with the inlet pressure and a valve that is comfortably below it at one inlet condition can be past it at another.

## What the ratio is

The pressure drop ratio, written x, is the pressure drop divided by the inlet pressure. The engine returns it on every gas sizing along with the terminal value it is being compared against.

Marching the gas valve down its outlet pressure gives the ratio at each step. It reads 0.068449 at an outlet pressure of 230.000000 psia, 0.189955 at 200.000000 psia, 0.306197 at 171.300000 psia, 0.432969 at 140.000000 psia, 0.554475 at 110.000000 psia, 0.635480 at 90.000000 psia, 0.716484 at 70.000000 psia, 0.797489 at 50.000000 psia and 0.878493 at 30.000000 psia.

## The terminal value

The terminal pressure drop ratio on this valve is 0.680357, and it holds that value on every row of the march. It is the ratio at which the flow becomes sonic in the vena contracta, and past it the engine reports choked flow.

Two things follow from the terminal ratio being a ratio. The first is that it is dimensionless, so the valve's part of it, xT, can be quoted for a valve style without knowing anything about the service. The terminal ratio on this valve is that xT scaled by the gas's own specific heat ratio factor, which is the subject of lesson three. The second is that the pressure it corresponds to depends entirely on the inlet pressure, which is why a gas valve has to be checked at every inlet condition the plant can reach rather than at the design case alone.

It is worth noticing what the ratio does to a familiar rule of thumb. Engineers often carry a pressure drop in their heads as an absolute figure for a given service. On gas that habit does not survive contact with the boundary, because the same absolute drop is a small ratio at a high inlet pressure and a large one at a low inlet pressure.

## Where this valve crosses

The crossing was found by bisecting the engine's choked flag, exactly as it was on the liquid side. The gas valve begins to choke at an outlet pressure of 78.919821 psia. The terminal pressure drop ratio there is 0.680357, the specific heat ratio factor there is 0.907143 and the coefficient there is 151.964887.

Compare the way that reads with the liquid march. On liquid, a fluid property set the boundary through the critical pressure ratio factor. On gas, the boundary is a property of the valve style and the gas, expressed as a ratio the valve carries with it. The arithmetic differs and the discipline is the same: find the crossing, then ask which side of it the plant actually operates on.

## Exercise

Write down the pressure drop ratio at outlet pressures of 90.000000 psia and 70.000000 psia, and the terminal pressure drop ratio this valve carries. Say which of those two rows the engine reports choked flow on, and give the outlet pressure of the crossing that decides it.
