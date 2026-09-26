# The cost oil limit and its base

{{panel:joa-recovery-calculator}}

A cost oil limit caps how much of a year's production can go to cost recovery. It is a percentage of something, and contracts state it on gross revenue or on revenue after royalty. The same percentage gives different limits on the two bases.

## What the texts say

World Bank Petroleum Sector Briefing Note No. 8 (November 2007, Public Disclosure Authorized, read on 2026-09-26) states its limit on gross:

> "the contractor recovers costs to the limit permitted, in this case 60 percent of the gross revenue or US$60." (World Bank Petroleum Sector Briefing Note No. 8 (November 2007))

The IMF working paper WP/24/89 (April 2024, read from its Wayback capture of 14 August 2025 on 2026-09-26) describes the more usual practice:

> "Under a production sharing regime, revenues shared are usually net of royalties." (IMF WP/24/89 (April 2024))

The Tanzania Model Production Sharing Agreement 2013 (read from its Wayback capture of 23 May 2024 on 2026-09-26), taught by concept only, states its limit on production net of royalty. The engine holds no base. `costOilLimitBase` is a required input, "after-royalty" or "gross", and any other value is refused:

> costOilLimitBase must be one of "after-royalty", "gross"; got "net"

## How the engine passes a gross limit

The canonical applyPSC works on revenue after royalty, so the engine converts a gross limit first. Its basis on the Ekene variant, verbatim:

> the limit is stated on gross revenue and passed to applyPSC as the fraction 60 / (100 - 12.5) of revenue after royalty

A gross limit cannot exceed what is left after royalty, because the royalty has already been taken from the gross. With a royalty of 12.500000 percent a gross limit of 90 percent is refused:

> costOilLimitPct must be at or below the revenue left after royalty, 87.5% of gross, when costOilLimitBase is "gross"; got 90

## The same percentage on two bases

The Ekene PSC variant, run once on each base with every other term the same:

| terms | 2030 cost oil limit | pool at the end |
| --- | --- | --- |
| 60.000000 percent of gross | 131400000.000000 | 0.000000 |
| 60.000000 percent of revenue after royalty | 114975000.000000 | 33686775.000000 |

On gross the pool is recovered in 2036. On revenue after royalty every year's limit is lower, and 33686775.000000 is still unrecovered at the end of 2038. Quote a PSC figure with its limit and its base.

## What the Act says about a limit

The Petroleum Industry Act 2021 (Act No. 6, Official Gazette No. 142, Vol. 108, 27 August 2021, read on 2026-09-26) caps the limit of a renegotiated production sharing contract:

> "shall feature a cost oil limit of not more than 60% of the total oil production, a minimum of 55% haircut on disputed amount" (PIA s.311(2)(a)(iii))

The engine reports this provision in its basis and applies no cap of its own: the limit is the contract's stated figure.

## Exercise

Work in the course's own recovery calculator, view "PSC cost recovery", starting from "The Ekene PSC variant".

1. Read the 2030 cost oil limit and the tile "Unrecovered at the end".
2. With the control "Cost oil limit base (stated)", switch to revenue after royalty. Check both figures against the second table row.
3. Switch back to gross. With the control "Cost oil limit, percent (stated)", set 90 and read the refusal. Then set 87.5 and read the 2030 limit.
4. In the box, set `costOilLimitBase` to `"net"` and read the refusal.
