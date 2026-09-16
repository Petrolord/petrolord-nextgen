# Oil, water and the mixture

The gas sitting above two liquids sees one effective density, and it is the two densities weighted by how much of each arrives. On AGBAMI that is 59.632353 lb/ft3, where the plain average of the two would be 60.613628.

{{panel:fc-separator-explorer}}

## Weighted by rate

| stream | oil lb/ft3 | water lb/ft3 | oil bpd | water bpd | mixture lb/ft3 |
| --- | --- | --- | --- | --- | --- |
| ABANA-1 | 53.675380 | 64.896000 | 2600.000000 | 400.000000 | 55.171463 |
| ABANA-2 | 53.675380 | 64.896000 | 24000.000000 | 6000.000000 | 55.919504 |
| AGBAMI | 55.707256 | 65.520000 | 12000.000000 | 8000.000000 | 59.632353 |

The weighting is by volume rate, so the mixture always lands between the two densities and always nearer the phase that arrives in greater quantity. ABANA-1 is mostly oil and comes out at 55.171463, close to its oil. AGBAMI is much wetter and comes out at 59.632353, well up toward its water.

## Why the average is the wrong answer

An average weights the two liquids equally, which is a claim that they arrive in equal amounts. On AGBAMI they do not: 12000.000000 bpd of oil against 8000.000000 bpd of water. The average of 55.707256 and 65.520000 is 60.613628, and the rate-weighted figure is 59.632353. The average is the answer to a question about a fifty-fifty stream that nobody asked.

The error is modest here because AGBAMI is not far from even. On ABANA-1, at 2600.000000 bpd against 400.000000, the average would sit far above 55.171463, and the gap grows as the stream gets drier.

## The same fluids, a different mixture

ABANA-1 and ABANA-2 hold identical oil and water, 53.675380 and 64.896000 lb/ft3. Their mixtures differ, 55.171463 against 55.919504, purely because the water cut differs: 400.000000 bpd of water against 2600.000000 of oil on the test separator, and 6000.000000 against 24000.000000 on the production separator.

So the mixture is a property of the stream rather than of the fluids, and it moves whenever the water cut moves. A field watering out over its life walks this number upward year by year, and the vessel sized at first oil was sized against the driest mixture it will ever see.

## Which way the vessel moves

A heavier liquid increases the difference against the gas, which raises the settling velocity and shrinks the required area. So rising water cut makes the gas side of the sizing easier while making the liquid side harder, because more total liquid needs more retention volume.

The two effects pull in opposite directions and neither one cancels the other. They land on different dimensions of the same vessel.

## The mistake

Taking the mixture from a design water cut that the field has already passed. The rates in this calculation are the rates arriving now, and a mixture computed from a five year old basis is a number about a stream that no longer exists.

## Exercise

Build the mixture for each of the three streams from its two densities and its two rates, and say which phase each one sits nearer. Then explain why 60.613628 is the wrong figure for AGBAMI, and why ABANA-1 and ABANA-2 differ at 55.171463 and 55.919504 while holding identical fluids.
