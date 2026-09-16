# What a mist extractor changes

A mist extractor catches the drops that gravity alone would let through, and the table pays for it with a higher allowable velocity. Fitting a vane pack in place of nothing takes a vertical K from 0.180000 to 0.420000.

{{panel:fc-separator-explorer}}

## Three arrangements

An empty drum separates by gravity alone, and its K is the lowest of the three: 0.180000 vertical and 0.250000 horizontal. A wire mesh pad is a knitted bed the gas passes through, where fine drops strike the wire, coalesce into larger drops and drain back. A vane pack turns the gas through a set of baffles so that drops fail to follow the turn and hit a plate.

| arrangement | vertical K ft/s | horizontal K ft/s |
| --- | --- | --- |
| no mist extractor | 0.180000 | 0.250000 |
| wire mesh pad | 0.350000 | 0.450000 |
| vane pack | 0.420000 | 0.550000 |

The vane pack takes the highest K in both orientations. It also tolerates dirtier service than a mesh pad, which is a reason to choose it that this table cannot express.

## What it does to the vessel

K multiplies the settling velocity, and the settling velocity divides into the gas rate to give the area. So K and the required area move in exact opposition: raising K by half cuts the area by a third.

The teaching streams show the range across real selections.

| stream | mist extractor | K ft/s | settling ft/s |
| --- | --- | --- | --- |
| ABANA-1 | vertical mesh | 0.300000 | 1.458422 |
| ABANA-2 | horizontal mesh | 0.400000 | 1.958255 |
| AGBAMI | horizontal vane | 0.525000 | 3.549130 |

These three are not a clean comparison of internals, because the liquid and gas densities differ between the streams and the K values on this table have been derated for pressure. The comparison inside one stream is the clean one: on ABANA-1, at fixed fluids, the velocity is proportional to K alone.

## The engine will not choose one for you

There is no default mist extractor. Asking for K without naming one and without giving an override is refused: "internalsId is required: name a mist extractor from K_BASE or give kOverride". Naming something the table does not carry is refused with the name quoted back: "internalsId 'verticalFoam' is not a mist extractor in K_BASE".

That is the right behaviour for a number this influential. A silent default would put a mesh pad in every vessel on paper, including the ones nobody intends to fit one to.

## The held part of these numbers

The K values the three streams carry above are derated for pressure before they are used, and that derating rule is recorded by the module as a customary rule of thumb whose published form has not been checked against its source. The base table rows stand on their own. The step from a base row to the K a vessel is actually sized with is the part to treat as provisional.

## The mistake

Assuming the mist extractor is free. A higher K buys a smaller vessel and brings a pressure drop, a fouling surface and a part that can be damaged or installed badly. A vessel sized at 0.420000 with a vane pack that is later removed for cleaning is a vessel operating at more than twice its bare-drum allowance.

## Exercise

Give the three vertical K values and the three horizontal ones and say what each arrangement does physically. Then say what happens to the required gas area when K rises by half, and write the two messages the engine gives when the mist extractor is missing and when it is not in the table.
