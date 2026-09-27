# The World Bank two-barrel example

{{panel:joa-recovery-calculator}}

A cost recovery calculation deserves trust when it reproduces worked examples that someone else published. PSC cost recovery has such examples, and this module runs three of them through the same engine call as the Ekene variant. They are how the engine's PSC arithmetic was checked. The first is the World Bank's.

## The source

World Bank Petroleum Sector Briefing Note No. 8, Contracts for Petroleum Development, Part 2 (November 2007, Public Disclosure Authorized, read on 2026-09-26), works a production sharing contract on revenue of 100 in its two-barrel illustration. The royalty comes first:

> "the royalty is paid first. At 10 percent, this amounts to $10 going to the government." (World Bank Petroleum Sector Briefing Note No. 8 (November 2007))

The limit is stated on gross:

> "the contractor recovers costs to the limit permitted, in this case 60 percent of the gross revenue or US$60." (World Bank Petroleum Sector Briefing Note No. 8 (November 2007))

and profit oil is split between the two sides:

> "The government takes 60 percent of US$65, or US$39, and the remaining US$26 goes to the contractor." (World Bank Petroleum Sector Briefing Note No. 8 (November 2007))

## The engine beside the note

The golden input states the note's own terms: gross 100.000000, costs 25.000000, royalty 10.000000 percent, a limit of 60.000000 percent of gross, a contractor profit share of 40.000000 percent and tax 30.000000 percent.

| line | printed in the note | engine |
| --- | --- | --- |
| royalty | 10 | 10.000000 |
| cost oil limit | 60 | 60.000000 |
| cost recovered | 25 | 25.000000 |
| profit oil | 65 | 65.000000 |
| contractor profit oil | 26 | 26.000000 |
| government profit oil | 39 | 39.000000 |
| income tax | 7.8 | 7.800000 |
| contractor retains | 43 | 43.200000 |
| government takes | 57 | 56.800000 |

Every line agrees. The last two differ only in how they are printed:

> "The end result is that the contractor retains US$43 and the government takes $57." (World Bank Petroleum Sector Briefing Note No. 8 (November 2007))

The note prints whole dollars, and the engine returns 43.200000 and 56.800000, which round to 43 and 57. The contractor keeps its 25 of cost oil and 26 of profit oil less 7.8 of tax. The course quotes the note's figure as the note's, and reasons with the engine's.

## The tax in the example

The note taxes the contractor on its profit oil of 26. Its taxable income is the contractor's profit oil here because the costs are recovered in full. The note also says:

> "For paying income tax, there are no limits on deductible expenses in the way there are limits on cost oil." (World Bank Petroleum Sector Briefing Note No. 8 (November 2007))

In this example nothing is held back by the limit, so the deduction and the cost recovered are the same 25, and the tax the engine charges on profit oil matches the note's. The engine's tax reading is stated in its basis, as the previous module showed.

## Exercise

Work in the course's own recovery calculator, view "PSC cost recovery", starting from "World Bank Briefing Note 8, the two-barrel example".

1. Check every line of the year row against the engine column above, and read the tile "Government take, total".
2. Check that the contractor entitlement and the government take add up to the gross revenue of 100.000000.
3. With the control "Cost oil limit base (stated)", switch to revenue after royalty. Say which lines change and which do not, and why the costs of 25.000000 are still recovered in full.
4. Switch back to gross. In the box, raise the year's `capex` above the limit, and say which line of the table now binds.
