# The diameter the gas demands

In a vertical vessel the gas rises and the drop falls, so the gas velocity has to stay below the settling velocity everywhere in the cross-section. That single requirement fixes a minimum diameter.

{{panel:fc-separator-explorer}}

## One division

ABANA-1 puts 4.825708 ft3/s of gas through a vessel whose drops settle at 1.458422 ft/s. The area that makes those two agree is 3.308855 ft2, and a circle of that area has a diameter of 2.052551 ft.

That is the whole calculation. The rate came from the conditions, the velocity came from K and the two densities, and the geometry is a circle.

## Why it is a minimum and not an answer

At 2.052551 ft the gas velocity equals the settling velocity exactly, so the velocity margin is exactly 1.000000. A drop is in perfect balance there: it neither rises nor falls. Every vessel built on this method is therefore larger than the gas-required diameter, and the gas-required diameter is the floor rather than the design.

The published vertical cases are sized the same way, which is why both report a margin of exactly 1.000000.

| case | gas ft3/s | diameter ft | margin |
| --- | --- | --- | --- |
| vertical12ft3sGasSized | 12.000000 | 4.239711 | 1.000000 |
| vertical30ft3sGasSized | 30.000000 | 5.641896 | 1.000000 |

A margin of exactly 1.000000 on a result is a signature: it says the diameter was computed from the gas rather than chosen by anyone.

## Area moves as the square

Diameter enters through area, so the relationship between duty and diameter is a square root. The two published cases put 12.000000 and 30.000000 ft3/s through 4.239711 and 5.641896 ft, where the rate rose by two and a half times and the diameter by about a third.

That is the reason gas duty alone rarely drives a vertical vessel to an unreasonable size, and also the reason a small increase in diameter buys a surprisingly large increase in capacity.

## What this diameter ignores

It knows nothing about the liquid. No retention time, no liquid rate and no allowance has entered it, so the vessel it describes has a floor area and no height at all. The liquid supplies the height, and where the liquid is heavy the height can become the awkward dimension long before the diameter does.

It also assumes the gas uses the whole cross-section evenly. A real inlet arrangement puts the gas in at one side, and the allowance above the liquid exists partly to give that maldistribution room to even out.

## The mistake

Ordering the gas-required diameter. At 2.052551 ft the vessel has no margin against a rate that rises, a pressure that falls, a mist extractor that fouls or a water cut that moves. Every one of those pushes the gas velocity up or the settling velocity down, and the vessel at the floor has nowhere to go.

## Exercise

Build the ABANA-1 gas area and diameter from 4.825708 ft3/s and 1.458422 ft/s. Then say what a velocity margin of exactly 1.000000 tells you about where a diameter came from, and why the two published cases need 4.239711 and 5.641896 ft for rates that differ by two and a half times.
