# Each crude on its own netback

Before asking what the blend is worth, ask what each of its crudes is worth alone, at the same refinery, against the same marker.

{{panel:crude-valuation-explorer}}

## Three valuations, one refinery

The digest runs netbackValue three times against Kwale's marker of 72.5 $/bbl: once on Kwale Light alone, once on Ughelli Medium alone, and once on the blend at 55 and 45. Each crude alone is valued on the same Kwale cut set, product prices, processing cost, freight and losses as the blend. Only the crude changes.

| crude or blend | gross $/bbl | netback $/bbl | differential against the marker $/bbl |
| --- | --- | --- | --- |
| Kwale Light alone | 75.2968 | 65.9944 | -6.5056 |
| Ughelli Medium alone | 72.9512 | 63.6676 | -8.8324 |
| the blend, 55 and 45 | 74.2412 | 64.9473 | -7.5527 |

## Where each crude's value comes from

Each crude's gross is its own cut yields times Kwale's product prices. Module 3 printed those yields on Kwale's cuts:

| cut | Kwale Light | Ughelli Medium |
| --- | --- | --- |
| LPG / Light ends | 1.3043 | 0.0000 |
| Naphtha | 24.2512 | 16.0465 |
| Kerosene / DPK | 18.1944 | 13.9535 |
| Diesel / AGO | 18.8816 | 20.0000 |
| Atmospheric residue | 37.3684 | 50.0000 |

Each crude has its own yield in every cut, and each cut meets its own price: 48 for LPG / Light ends, 74 for naphtha, 93 for kerosene, 98 for diesel and 57 for residue. The gross of each crude is the result of that pairing, and the digest prints it: 75.2968 $/bbl for Kwale Light and 72.9512 $/bbl for Ughelli Medium.

From gross to netback, the chain is the one module 4 built: the loss comes off the product value, then processing and freight. The netbacks are 65.9944 and 63.6676 $/bbl. Against the marker, the differentials are -6.5056 and -8.8324 $/bbl.

## What single-crude netbacks are for

The table answers three questions. What is each crude worth alone on the Kwale terms. What is the mixture worth. And how does the mixture's netback stand against the two alone. The first two rows of the table answer the first question directly.

They also set up the third. If each crude has a netback, the obvious guess for the blend is the volume-weighted mean of the two. Whether that guess holds is not obvious. In the Associate tier, API went through specific gravity, sulfur blended on mass and viscosity went through an index. In module 2, T50 had to be read off the blend's own curve, and neither averaged midpoint was the engine's figure. Every one of those properties needed its own basis. For API, sulfur and T50 the digest prints the volume-weighted mean of the crudes' own figures beside the engine's figure, as a reading the engine does not use. The next lesson asks the same question of the netback, and the digest prints the answer.

## Why each crude must be valued on the same terms

The three rows are comparable only because nothing but the crude changed. Each crude alone is valued on the same Kwale cut set, product prices, processing cost, freight and losses as the blend. The marker comparison has the same requirement: every differential here is against the same 72.5, built on the same Kwale terms, so the three differentials can be read side by side.

## Reading the differential column

Each differential is that row's netback minus 72.5. All three are negative, which by the engine's definition says each nets back less than the marker at Kwale. The sign is the reading. The size is the figure the engine prints, and nothing more should be read into it without the terms beneath it.

## Exercise

Read the netback and differential for Kwale Light alone and for Ughelli Medium alone. For each, state what the differential is by the engine's definition and what its sign says. Then name the inputs that were held the same across the three rows, and say why holding them fixed is what makes the rows comparable.
