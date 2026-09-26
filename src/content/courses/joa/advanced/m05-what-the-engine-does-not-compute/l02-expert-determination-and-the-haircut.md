# Expert determination and the haircut

{{panel:joa-agreement-calculator}}

Two provisions of the Petroleum Industry Act 2021 (Act No. 6, Official Gazette No. 142, Vol. 108, 27 August 2021, read on 2026-09-26) decide how large a cost figure is before any arithmetic starts. The engine computes neither. It takes the cost figures as stated inputs, and a report says where each came from.

## Expert determination of the unrecovered costs

The back-in the Professional tier taught refunds the Government's proportionate share of unrecovered proven costs. Which costs, and how much, is settled outside any formula:

> "(e) the nature, the validity and quantum of the unrecovered costs to be refunded shall be determined or verified by an agreed expert determination procedure ;" (PIA s.85(4)(e))

The engine states in its back-in basis what it leaves out:

> the expert determination of the unrecovered costs (s.85(4)(e)); the unrecovered cost figures are stated inputs

What the engine does compute is the rule the Act fixes in words: the refundable kinds are development and production, with no bonuses, penalties, interest, premium or markups (s.85(4)(c)). On the Ekene back-in the refundable costs are 490000000.000000, 156000000.000000 is excluded and the refund is 98000000.000000 (engine). Every one of those figures rests on cost lines someone determined first. A report quotes the refund with the cost lines it was computed on and says that their quantum is the expert determination's, taken as stated.

## The haircut on disputed amounts

For a renegotiated production sharing contract the Act sets two figures in one sentence:

> "shall feature a cost oil limit of not more than 60% of the total oil production, a minimum of 55% haircut on disputed amount" (PIA s.311(2)(a)(iii))

The engine reports the 60 percent ceiling in its basis, as `PIA_JV.renegotiatedPscCostOilLimitPct`, and applies the limit the contract states. It computes no haircut. Which amounts are disputed and what the haircut leaves are settled before the cost pool is stated, and the pool the call states is the pool after any haircut.

| provision | what it settles | what the engine takes |
| --- | --- | --- |
| PIA s.85(4)(e) | the nature, validity and quantum of the unrecovered costs | the cost lines, stated |
| PIA s.311(2)(a)(iii), the haircut | the disputed amounts that survive | the opening cost pool, stated |
| PIA s.311(2)(a)(iii), the limit | a ceiling of 60% on a renegotiated PSC | the contract's stated limit; the ceiling is reported |

## The seam with the Petroleum Industry Act course

The Nigerian fiscal system as a whole, with royalty by terrain, hydrocarbon tax and companies income tax, belongs to the Petroleum Industry Act course. This course reads the Act's carried interest provision in s.85(4) and quotes s.311 only.

## Why this is safe to leave outside

Both provisions produce a number by agreement or by procedure, and neither by arithmetic on stated terms. An engine that guessed them would put a hidden figure into every result. Taking them as stated inputs keeps each figure checkable: a partner who disputes the pool can see exactly which number to change.

## Exercise

Open the agreement calculator on the view "PSC cost recovery" and start from "The Ekene PSC variant". Read the Source block and find the section of the Act it cites. Read the unrecovered tile and the year the pool runs out. Now suppose a determination or a haircut changed the opening pool: type a smaller figure of your own into the control "Opening cost pool (stated)" and read the cost recovered in each year and the year the pool runs out. Write one sentence naming the figure you changed, why the engine could not have found it, and which later figures moved.
