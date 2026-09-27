# The limit base is a stated input

{{panel:joa-recovery-calculator}}

{{panel:joa-agreement-calculator}}

The base of a PSC's cost oil limit is no reading: the engine makes no choice there. A contract states whether its limit is a percentage of gross revenue or of revenue after royalty, and the engine takes that as a required input with no default, `costOilLimitBase`.

## Three texts, three bases

The canonical applyPSC of engines/economics/cashflow.ts takes the limit on revenue after royalty. The World Bank's Petroleum Sector Briefing Note No. 8 (November 2007) states its limit on gross revenue:

> "the contractor recovers costs to the limit permitted, in this case 60 percent of the gross revenue or US$60." (World Bank Petroleum Sector Briefing Note No. 8 (November 2007))

The Petroleum Industry Act 2021 (Act No. 6, Official Gazette No. 142, Vol. 108, 27 August 2021, read on 2026-09-26) words the ceiling for a renegotiated production sharing contract on total oil production:

> "shall feature a cost oil limit of not more than 60% of the total oil production, a minimum of 55% haircut on disputed amount" (PIA s.311(2)(a)(iii))

The engine reports that 60 percent ceiling in its basis only and applies the contract's stated figure.

## How the engine passes a gross limit

For a limit stated on gross, the engine passes the same amount to applyPSC as a fraction of revenue after royalty. On the Ekene PSC variant, with its royalty of 12.500000 percent, its basis reads:

> the limit is stated on gross revenue and passed to applyPSC as the fraction 60 / (100 - 12.5) of revenue after royalty

## The base moves the limit

With the same 60.000000 percent, the Ekene 2030 limit is 131400000.000000 on gross and 114975000.000000 on revenue after royalty (engine). Every later year differs too: on gross the pool is recovered in 2036, and on revenue after royalty 33686775.000000 is still carried after 2038. The percentage alone does not fix the limit; the base does the rest.

## What the engine refuses

A base the engine does not know is refused by name:

> costOilLimitBase must be one of "after-royalty", "gross"; got "net"

A limit on gross cannot exceed the revenue left after royalty, because applyPSC could never recover more than that:

> costOilLimitPct must be at or below the revenue left after royalty, 87.5% of gross, when costOilLimitBase is "gross"; got 90

A report quotes every PSC figure with its limit and base.

## Exercise

Open the recovery calculator on the view "PSC cost recovery" and start from "The Ekene PSC variant". Read the 2030 cost oil limit and the basis note on the limit base. Use the control "Cost oil limit base (stated)" to choose revenue after royalty and read the 2030 limit again, then the year the pool is recovered and the unrecovered tile. Choose gross again and state a cost oil limit of 90 with the control "Cost oil limit, percent (stated)"; read the refusal. Then open the agreement calculator on the view "The three stated readings" and read the limit base note at its foot.
