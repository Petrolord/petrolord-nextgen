# Published rates, banded

{{panel:qr-alarp}}

R2P2 prints a box of real fatality rates for UK industries and for the public, so that readers can see where the limits sit against the individual risk people actually carry. The golden file carries five of those rates, and the engine bands each one against the preset its source names. Nothing in this lesson is a teaching invention: the rates are published, and the bands are what `alarpBand` returns for them.

## The box, through the engine

| golden case | individual risk per year | preset | engine band |
| --- | --- | --- | --- |
| agriculture 1999/00, 1 in 12 984 | 0.000077017868 | r2p2-workers | TOLERABLE |
| construction 1999/00, 1 in 21 438 | 0.000046646142 | r2p2-workers | TOLERABLE |
| mining and quarrying 1999/00, 1 in 14 564 | 0.000068662455 | r2p2-workers | TOLERABLE |
| service sector 1999/00, 1 in 388 565 | 0.000002573572 | r2p2-workers | TOLERABLE |
| public, gas 1994/5-1998/9, 1 in 1 510 000 | 0.000000662252 | r2p2-public | BROADLY_ACCEPTABLE |

R2P2 prints each rate as "1 in" a whole number of people. The engine's value is one over that number, printed to twelve decimals.

## What the source says about them

R2P2 paragraph 128 says worker rates are "normally well below the upper limit" of 1 in 1000. The four worker rates agree: agriculture, the highest of them, is 0.000077017868 per year, well inside the TOLERABLE region. All four are TOLERABLE, so every one of those industries sits in the region where an individual risk must be reduced as low as reasonably practicable.

The service sector is the instructive row. At 0.000002573572 per year it is the lowest worker rate, and the source notes that it is still above 1 in a million. It is therefore TOLERABLE, and an ALARP demonstration is required even there.

The public gas rate, 0.000000662252 per year, is banded against the public preset. The source says it is "below the limit of what is often regarded as broadly acceptable", and the engine agrees: BROADLY_ACCEPTABLE.

## Each rate against its own preset

Each rate is banded against the preset its source names: workers for the four industry rates, the public for gas. The golden does not band a worker rate against the public preset, and an analyst should follow the same discipline. The preset follows the people who carry the individual risk, which is the rule from the second lesson of this module.

## Why this matters for an ALARP note

These rates give a reader a scale. When an assessment returns a worker individual risk, setting it beside the published industry rates shows a reviewer whether it is typical of heavy industry or unusual for it. The comparison is context. It never replaces the band, and it never argues a TOLERABLE individual risk into acceptance: the demonstration is still required. The rates are also dated, 1999/00 for industry and 1994/5-1998/9 for gas, and a note that cites them gives the years.

## Exercise

Take the construction rate, 1 in 21 438, and its engine value, 0.000046646142 per year. Check that one over that number gives the engine value to twelve decimals. Then take the EREMOR operator's individual risk per annum from the Associate tier, 0.000017541379 per year, band it against the worker preset, and write one sentence placing it between the published construction and service sector rates.
