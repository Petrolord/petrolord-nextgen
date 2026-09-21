# The component midpoints do not average

Each crude arrives with its own T50. The tempting move is to average them. The engine prints what that gives, beside what it does.

{{panel:crude-valuation-explorer}}

## The shortcut

Kwale Light reaches 50 percent at 530 F. Ughelli Medium reaches 50 percent at 650 F. Both are measured points on the assays. With the blend at 55 and 45 by volume, the shortcut writes the blend's T50 as the volume-weighted mean of 530 and 650. A second version weights them by mass instead, on the grounds that mass is the conserved quantity.

Both are the same kind of operation: an average along the temperature axis. The engine never averages temperatures. It builds the blend's curve by weighting volume percents at fixed temperatures.

## The four readings

The digest prints the engine's T50 with the grid reading from lesson 2 and both averages.

| blend | T50 interpolated (the engine) F | first curve point at or past 50 percent F | volume-weighted mean of the crudes' T50 F | mass-weighted mean of the crudes' T50 F |
| --- | --- | --- | --- | --- |
| Kwale Light and Ughelli Medium, 55 and 45 | 587.3184 | 650 | 584.0000 | 586.0503 |
| the studio's default pair, 60 and 40 (what the app opens on) | 617.1429 | 690 | 612.0000 | 614.2222 |

Each shortcut against the engine, the difference printed:

| blend | grid reading minus the engine F | volume-weighted mean minus the engine F | mass-weighted mean minus the engine F |
| --- | --- | --- | --- |
| Kwale Light and Ughelli Medium, 55 and 45 | 62.6816 | -3.3184 | -1.2681 |
| the studio's default pair, 60 and 40 | 72.8571 | -5.1429 | -2.9207 |

For the Kwale blend the volume-weighted mean minus the engine is -3.3184 F and the mass-weighted mean minus the engine is -1.2681 F. For the default pair the same two columns read -5.1429 F and -2.9207 F.

Four readings are printed. Only one of them is read off the blend's own curve.

## What each average is formed from

Each average takes one figure from each crude, its own 50 percent temperature, and weights the two: by volume share in one column and by mass share in the other. For the Kwale blend those figures are 530 F for Kwale Light and 650 F for Ughelli Medium. The engine's route is the one module 1 built. It forms the blend's curve at every temperature either crude measured, weights the volume percents, then reads 50 percent off that curve with temperatureAtVolumePercent.

## The mass average beside the engine

The Associate tier read a case where the digest prints a mass-weighted mean minus the engine of 0.0000: the mass-weighted mean of the API numbers is the blend API, and the digest gives the reason, that 1 / SG blends linearly on mass. For T50 the digest prints the same column as -1.2681 F for the Kwale blend and -2.9207 F for the default pair. The Kwale row prints the mass-weighted mean of the crudes' T50 as 586.0503 F beside the engine's 587.3184 F, and only the second is read off a curve.

## The trap in one sentence

This tier's header lists the grid reading of T50 among its traps: figures that look finished. An averaged midpoint belongs beside it. It is a clean temperature, it prints to four decimals, and it is still an average of two crudes' midpoints. The blend's T50 is read off the blend's curve.

## Exercise

Read the three averaged and grid readings for the default pair, and the engine's 617.1429 F. Say which of the four is read off the blend's own curve, and what each of the other three is formed from. Then say why printing 614.2222 F to four decimals does not make the mass-weighted mean a reading of the blend.
