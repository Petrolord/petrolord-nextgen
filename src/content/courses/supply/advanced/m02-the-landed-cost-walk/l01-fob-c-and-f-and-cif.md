# FOB, C&F and CIF

A cargo's cost is built in stages, and each stage is a value the trade names. FOB is the cargo's value loaded on the ship at the port of origin. C&F adds the ocean freight. CIF adds the marine insurance. After CIF come the landed charges levied where the cargo arrives. `landedCost` walks those stages in that order, and the order is part of the answer.

{{panel:supply-price-explorer}}

## The BADAGRY cargo at the start of the walk

BADAGRY is 34000 tonnes of PMS at 742.8 kg/m3. Its FOB price, 688.00 USD a tonne, is part of the course's invented record, and every rate on its build-up is invented for this course. Money in this module is in US dollars.

The walk opens with the cargo value:

| stage | line | basis | amount USD | USD per outturn litre |
| --- | --- | --- | --- | --- |
| fob | FOB cargo value | per tonne | 23392000.00 | 0.513357 |
| freight | Ocean freight | per tonne | 901000.00 | 0.019773 |
| insurance | Marine insurance | % of CIF | 38931.09 | 0.000854 |

and the engine reports the three stage values it has formed: FOB 23392000.00 USD, C&F 24293000.00 USD and CIF 24331931.09 USD.

## Reading the stages

FOB comes from the price and the tonnes. The freight line is the course's invented ocean freight of 26.5 USD a tonne on the same 34000 tonnes, and it prints 901000.00 USD. C&F is FOB with the freight on it, 24293000.00 USD.

Insurance is the stage the next two lessons slow down on. In BADAGRY it is quoted as 0.16 percent of CIF, an invented rate, and it prints 38931.09 USD. CIF is 24331931.09 USD. Because the insurance is quoted on CIF, it is part of the very value it is charged on, and the engine solves that in closed form rather than by guessing and repeating.

## A base is frozen when the walk reaches it

The rule that makes this a walk is short. Each charge names the base it bites on, and a base is frozen when the walk reaches it. FOB is fixed before freight exists. C&F is fixed once freight is added. CIF is fixed once insurance is solved. A landed charge quoted as a percent of CIF then bites on that frozen CIF and on nothing that comes after it.

This matters because two of the landed charges are percentages. The course's invented import duty and financing rate are both quoted on CIF. The walk freezes each base when it reaches it, so both lines bite on the one CIF figure and on nothing charged after it.

## The fourth column

Every line also prints a figure in USD per outturn litre. FOB is 0.513357 USD per outturn litre, freight 0.019773 and insurance 0.000854. Those are each line spread over the litres the importer actually sells after the ocean loss. The module on ocean loss reads that column properly. For now, notice that the engine spreads money over the outturn, and that every line is spread over the same litres.

## Exercise

Record FOB, C&F and CIF in US dollars for the BADAGRY cargo, and the freight and insurance lines. Say which invented rate and which base produces each of the two lines. Then say what the three stage values, read in order, show about why a charge quoted on CIF cannot be computed until the insurance line is known.
