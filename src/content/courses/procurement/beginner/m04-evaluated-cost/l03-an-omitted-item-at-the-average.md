# An omitted item priced at the average

{{panel:pr-envelope-calculator}}

A bid that leaves an item unpriced looks lower only because part of the work has no price. The texts price the missing item and add it. This lesson reads the rule the engine applies, works it for WS3's missing nitrogen, and names the choice the engine makes where the texts leave room.

## The rule and its source

The engine's basis reads:

> an omitted item is priced at the average of the corrected amounts quoted for it by the other responsive bids, else the Employer's best estimate (World Bank SPD Request for Bids, Works, two-envelope (Sep 2025) ITB 34.1)

The Standard Procurement Document, Request for Bids, Works, two-envelope (September 2025) sets the average at ITB 34.1, and the Nigeria Public Procurement Act 2007 (Act No. 14, Official Gazette No. 65, Vol. 94, 19 June 2007) requires omissions to be quantified at s.32(3).

## WS3's nitrogen

WS3 prices every line except nitrogen. The other responsive bids price it at these corrected amounts:

| bid | nitrogen, corrected amount |
| --- | --- |
| WS5 | 33600.000000 |
| WS2 | 35400.000000 |
| WS1 | 37200.000000 |
| average, added to WS3 | 35400.000000 |

The engine returns:

> WS3: item nitrogen omitted; the average of the 3 prices quoted by the other responsive bids, 35400, is added

WS3's evaluated cost of 957990.000000, with omissions at the average and the fixture's schedule, carries that 35400.000000.

## Who counts in the average

Only responsive bids. WS4 also prices nitrogen, but its price envelope was never opened, so its figure is not in the average, and a bid never prices its own omission. Who prices an omission is an engine reading of ITB 34.1, stated in its basis: the other bids still responsive. The alternative, every bid that quoted the item, would let a bid that failed the technical envelope reach into another bid's evaluated cost, which the two-envelope rule forbids.

## When nobody else prices it

With no other responsive bid pricing the item, the engine needs the Employer's best estimate, and without one it refuses:

> bestEstimates.nitrogen is required: bid WS3 omits item nitrogen and no other responsive bid prices it

## Refusals on the omitted list

An item cannot be both omitted and priced:

> bids[0].omitted lists 'mob', which the bid also prices

Nor listed twice:

> bids[2].omitted repeats an item id

And the rule itself must be one the engine offers. Asked for a rule it calls lowest, it refuses:

> omissionRule must be 'average' (the default, World Bank SPD ITB 34.1: the average price quoted by the substantially responsive bidders) or 'highest' (the highest price quoted by them, an option the cited texts do not use)

The engine offers the second option named there without a citation; the Expert tier reads it, and every graded figure uses the average.

## Exercise

In the envelope calculator choose "Evaluated cost of the passing bids". Check WS3's omissions column against the table above. Now change WS5's nitrogen line so its quoted amount and unit rate price it at 37200 in total, and predict WS3's new omission before reading it. You will need to change both the unit rate and the quoted amount of that line. Restore it. Then add "omitted": ["mob"] to WS1 and read the refusal. Finally, remove the nitrogen line from WS1, WS2 and WS5 and read what the engine asks for.
