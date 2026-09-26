# Onshore and shallow water tranches

{{panel:pia-hct-calculator}}

The Professional tier asks one question: how does the hydrocarbon tax work as a system? It starts with royalty, because the production royalty on crude oil and condensate is the first deduction in the hydrocarbon tax base (PIA s.263(1)(b)). A field's royalty rate therefore reaches its hydrocarbon tax, and the small-field tranches decide that rate for every onshore and shallow water field.

## What the Act says

The Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021, read 2026-09-26) sets the terrain rates in the Seventh Schedule para 10(2): 15 percent onshore and 12.5 percent in shallow water up to 200 metres. Para 10(4) then gives small fields a gentler scale, charged "on tranched basis as follows: (a) for the first 5,000 bopd 5% ; and (b) for the next 5,000 bopd, for the share of production over 5000 bopd 7.5% :". The proviso completes it: "the share of the production over 10,000 bopd per month shall be at the royalty rates specified under subparagraph (2)."

The Petroleum Royalty Regulations 2022 (S.I. No. 73, Official Gazette No. 205, Vol. 109, 22 November 2022, read 2026-09-26) turn that into one weighted average rate on the whole volume. Rule 13(2)(c) says it for onshore fields: "a weighted average rate of 5% of 5,000bopd plus 7.5% of 5,000bopd plus 15% of the incremental daily production above 10,000bopd divided by the total production per day".

## The rate the engine returns

The engine applies exactly that weighting. These are its returns at stated daily rates:

| liquids bopd (stated) | onshore | shallow_water |
| --- | --- | --- |
| 5000 | 0.050000 | 0.050000 |
| 7500 | 0.058333 | 0.058333 |
| 10000 | 0.062500 | 0.062500 |
| 20000 | 0.106250 | 0.093750 |
| 50000 | 0.132500 | 0.112500 |
| 120000 | 0.142708 | 0.119792 |

Read the two columns together. At or below 10,000 bopd the two terrains pay the same rate, because both tranches are common to them. Above 10,000 bopd the terrain rate enters for the barrels past the second edge, and onshore pulls ahead.

## Why this matters for the hydrocarbon tax

A field sitting inside the tranches pays a lower royalty, so more of its crude oil and condensate revenue survives into the hydrocarbon tax assessable profit. Ekene Alpha, a synthetic shallow water converted lease, produces between 5,000 and 10,000 bopd from 2026 to 2029, so its 2026 rate is 0.059976. Put Alpha onshore and nothing moves, since every one of its years sits at or below 10,000 bopd.

The terrain is a stated input, one of four strings; the engine reads no water depth.

## Exercise

The practical runs in the course's own hydrocarbon tax calculator, which calls the same engine the lesson quotes.

1. Open the view "The tax base and the cost price ratio on a ledger" and start from the Ekene case ekene_alpha_shallow_converted_nta. Note the HCT assessable profit in 2026: 182041059.069891.
2. In the JSON, change `pia_terrain` to "onshore". Confirm that every year's HCT assessable profit stays where it was, and say why from the table above.
3. Put `pia_terrain` back to "shallow_water" and double the 2026 `oil_bbl`, which lifts that year above 10,000 bopd. Note the 2026 assessable profit, then switch the terrain to "onshore" again.
4. Which way did the 2026 assessable profit move, and which tranche of the Act produced the difference? Name the barrels the terrain rate now reaches.
