# The story so far

A horizontal vessel and a plot plan are both judged by asking which requirement binds first and whether the answer that came back was a calculation or a figure somebody copied.

## Five questions, five answers

| question | the answer on the teaching cases |
| --- | --- |
| what does the level cut the circle into | liquid 25.132741 ft2 and gas 25.132741 ft2 at a level of 0.500000 |
| which length controls | liquid, 23.270539 ft against a gas requirement of 2.396801 ft |
| does the vessel carry its gas | 1.173387 ft/s against 1.958255 ft/s, a margin of 1.668891 |
| how large is the slug catcher | 391.666667 bbl of working volume, 10.527155 ft by 42.108619 ft |
| how far from the flare | a computed 64.6458 m against a table figure of 90.000000 m |

## The vessel

ABANA-2 is an 8.000000 ft drum with a total cross-section of 50.265482 ft2. The level fraction decides everything else on the row, and at 0.300000 the liquid falls to 12.682775 ft2 and the same duty needs 46.113917 ft of length rather than 23.270539 ft. The chord of 8.000000 ft at half full is a width across the drum and belongs to no length and no interface.

Two requirements compete. The liquid needs 584.852431 ft3 of retention volume divided by the liquid area, and the gas needs its gas height multiplied by the ratio of the gas velocity to the settling velocity. Liquid controls every row of this family, from 59.572579 ft at a bore of 5.000000 ft to 14.893145 ft at 10.000000 ft.

The capacity check is separate and is a verdict. The 5.000000 ft and 6.000000 ft drums report margins of 0.651911 and 0.938751 with gasCapacityOk false, and they still return full dimensions. Under this method the gas length can never exceed the gas height on a vessel that passes, so gas controls only a vessel that is overloaded or shorter than its own diameter.

## The slug catcher

A 350.000000 bbl slug with 12000.000000 bpd arriving over 5.000000 minutes makes 391.666667 bbl of working volume. At a fill of 0.600000 and a slenderness of 4.000000 that is a drum 10.527155 ft by 42.108619 ft. The same slug as a harp of 5.000000 fingers at 20.000000 inch bore is 225.184350 ft each and 1125.921751 ft of pipe, sized on the slug alone.

## The site

Distances are haversine and centre to centre: the flare stands 46.1777 m from the control room and the crude tank 43.1555 m from Transfer pump A. A table figure of 90.000000 m is a table, recorded with no source checked and waiting to be replaced by a site standard. A flare setback of 64.6458 m from 828000.0000 kW and a pool radius of 59.5294 m from an 18.000000 m bund are calculations, and they move when the duty moves. The setback from the pool edge is 50.5294 m, which is 9.0000 m less than the radius from the centre, and putting the edge figure into a centre-to-centre check is what made the retired layout check fail open.

## Exercise

State the two length requirements for ABANA-2 at 8.000000 ft, which controls, and the capacity margin. Then give the slug catcher's working volume and dimensions, and name which of 90.000000 m and 64.6458 m is a table figure and which is computed.
