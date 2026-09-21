# The worked pool fire, step by step

{{panel:cq-fire}}

The Yellow Book, TNO Yellow Book CPR 14E (2005), works a pool fire from start to finish in section 6.6.3, in thirteen printed steps. The engine reproduces every one of them. That published example is the evidence behind most of what this tier grades, and this lesson walks through it from the characteristic wind speed to the heat flux.

## The example's inputs

The worked case is a confined benzene pool in a wind of 5 m/s at 10 m. The target stands 100 m from the pool centre. The transmissivity is 0.71474, read by the authors from Hottel charts. The air viscosity is printed as 0.0000075133 m2/s. The golden uses the example's own inputs exactly as printed, including the viscosity that module three flagged, because the printed answers depend on them.

## The chain, step by step

| step | engine | printed | relative difference |
| --- | --- | --- | --- |
| characteristic wind speed m/s | 3.068751 | 3.06866 | 2.97e-5 |
| scaled wind speed | 1.629327 | 1.62937 | 2.62e-5 |
| L/D | 1.102004 | 1.101938 | 5.99e-5 |
| flame length m | 46.775288 | 46.7725 | 5.96e-5 |
| Reynolds number | 28247014.532194 | 28240000 | 2.48e-4 |
| tilt parameter tan/cos | 1.943154 | 1.94315 | 1.95e-6 |
| tilt degrees | 50.828697 | 50.8286 | 1.92e-6 |
| surface emissive power, Mudan W/m2 | 20736.395957 | 21000 | 1.26e-2 |
| surface emissive power, clear flame W/m2 | 252421.582860 | 252400 | 8.55e-5 |
| surface emissive power, with soot W/m2 | 66484.316572 | 66000 | 7.34e-3 |
| Fv | 0.091923780228 | 0.091915 | 9.55e-5 |
| Fh | 0.029151753404 | 0.029146 | 1.97e-4 |
| Fmax | 0.096435502269 | 0.0964 | 3.68e-4 |
| heat flux at 100 m from the centre W/m2 | 4582.518673 | 4581 | 3.32e-4 |

## Reading the columns

The engine column is what the engine returns at full precision. The printed column is what the Yellow Book prints, usually rounded to a few figures. The relative difference is the gap between them divided by the printed value. The golden states a tolerance for each step, and every step reproduces within it. The largest gaps sit where the book rounded hardest: the Mudan power printed as 21000 and the sooty power printed as 66000.

## How the chain flows

Each step feeds the next, exactly as the earlier modules taught. The characteristic wind speed scales the wind; the scaled wind speed sets the flame length through Thomas with wind; the Froude and Reynolds numbers set the tilt; the flame length and the burning flux set the surface emissive power; the flame length, the tilt and the distance set Fv, Fh and Fmax; and the sooty power, Fmax and the printed transmissivity multiply into the heat flux. A mistake early in the chain would show up in the later rows that read it. None does. The heat flux at the end, 4582.518673 W/m2 against the printed 4581, carries every step before it, yet agreement at the end alone would prove little: small departures in the steps can offset one another. That is why the golden sets every step against its own printed value.

## Why this example carries the grading

A capstone grades a quantity only where something independent could catch a mistake copied into both the engine and its oracle. For Thomas with wind, the tilt, the surface emissive powers, the tilted view factor and the heat flux, this worked example is that independent check. Each row is a published number the engine had to meet.

The example uses the flame base radius D/2 with no stretch in the wind, and the engine does the same. It also carries three errata in its printed text, which the next lesson sets out. They are facts about the published source.

## Exercise

Open the fire panel's Yellow Book pool fire view and read the engine's heat flux at 100 m, 4582.518673 W/m2, against the printed 4581. Multiply the engine's sooty surface emissive power, its Fmax and the printed transmissivity of 0.71474 on your calculator and compare your product with the engine's heat flux. Then name the step whose printed value lies furthest from the engine's, and say why from the way it was printed.
