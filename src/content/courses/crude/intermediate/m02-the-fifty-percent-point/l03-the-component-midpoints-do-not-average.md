# The component midpoints do not average

Each crude arrives with its own T50. The tempting move is to average them. The engine prints what that gives, beside what it does.

{{panel:crude-valuation-explorer}}

## The shortcut

Kwale Light reaches 50 percent at 530 F. Ughelli Medium reaches 50 percent at 650 F. Both are measured points on the assays. With the blend at 55 and 45 by volume, the shortcut writes the blend's T50 as the volume-weighted mean of 530 and 650. A second version weights them by mass instead, on the grounds that mass is the conserved quantity.

Both are the same kind of operation: an average along the temperature axis. Module 1 already said why that axis does not average. A temperature is not an amount, and the blend's curve is built by weighting amounts at fixed temperatures.

## The four readings

The digest prints the engine's T50 with the grid reading from lesson 2 and both averages.

| blend | T50 interpolated (the engine) F | first curve point at or past 50 percent F | volume-weighted mean of the crudes' T50 F | mass-weighted mean of the crudes' T50 F |
| --- | --- | --- | --- | --- |
| Kwale Light and Ughelli Medium, 55 and 45 | 587.3184 | 650 | 584.0000 | 586.0503 |
| the studio's default pair, 60 and 40 (what the app opens on) | 617.1429 | 690 | 612.0000 | 614.2222 |

The engine's figure is 587.3184 F for the Kwale blend. The volume-weighted mean of the crudes' T50 is 584.0000 F and the mass-weighted mean is 586.0503 F. For the default pair the engine gives 617.1429 F against 612.0000 F and 614.2222 F.

Four readings are printed. Only one of them is read off the blend's own curve.

## Why neither average is the answer

An average of the midpoints looks only at one point on each crude's curve. It ignores the shape of the curves around those points. Two crudes can have the same T50 and very different curves, one boiling off steadily and one bunched. Blend each with a third crude and the blends' curves differ, so their T50s differ, while the averaged midpoints are identical. The average cannot see what it would need to see.

The engine's route sees everything the assays carry. It builds the blend's curve at every temperature either crude measured, weights the amounts, then reads 50 percent off that curve. Every point of both curves near the middle has a say.

## Why the mass average is also not the fix

The Associate tier showed a case where the mass-weighted mean does come out right: the mass-weighted mean of the API numbers is the blend API, and the digest prints the difference as 0.0000. It is tempting to think mass weighting rescues the midpoints too. It does not, and the reason is specific. API works on mass because 1 / SG blends linearly on mass, which is a property of how density combines. There is no comparable identity for a boiling temperature. The Kwale row prints the mass-weighted mean of the crudes' T50 as 586.0503 F beside the engine's 587.3184 F, and only the second is read off a curve.

## The trap in one sentence

This tier's header lists the grid reading of T50 among its traps: figures that look finished. An averaged midpoint belongs beside it. It is a clean temperature, it prints to four decimals, and it is still an average of two crudes' midpoints. The blend's T50 is read off the blend's curve.

## Exercise

Read the three averaged and grid readings for the default pair, and the engine's 617.1429 F. Say which of the four is read off the blend's own curve, and what each of the other three is formed from. Then say why printing 614.2222 F to four decimals does not make the mass-weighted mean a reading of the blend.
