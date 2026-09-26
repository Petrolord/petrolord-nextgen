# The PSC tax reading

{{panel:joa-recovery-calculator}}

{{panel:joa-agreement-calculator}}

A reading is a place where a public text can be read two ways and the engine takes one, stating it in its basis. The course quotes each of the three verbatim and grades none. The first concerns income tax under a production sharing contract.

## The reading, in the engine's words

The PSC cost recovery runs through the canonical applyPSC of engines/economics/cashflow.ts, and its tax line states:

> income tax is charged on the contractor's profit oil share, as FARI TNM/16/01 and World Bank Note 8 assume (applyPSC in engines/economics/cashflow.ts)

The two texts it names are the IMF's Fiscal Analysis of Resource Industries (FARI) Methodology, TNM/16/01 (February 2016, read from the Wayback capture of 12 October 2025), and the World Bank's Petroleum Sector Briefing Note No. 8 (November 2007). Both were read on 2026-09-26.

## Where the texts leave room

In their worked examples the costs are recovered in full, so the two possible tax bases coincide. The IMF figure states its assumption:

> "Normal tax deductions in the tax/royalty regime are assumed to be equal to the cost recovery in the PSC." (IMF FARI TNM/16/01 (February 2016), Figure 5)

The World Bank note adds a sentence that points the other way once the cost oil limit binds:

> "For paying income tax, there are no limits on deductible expenses in the way there are limits on cost oil." (World Bank Petroleum Sector Briefing Note No. 8 (November 2007))

No public text this course reads prints a year where the limit binds with its tax. The engine therefore states its reading, and the course grades no tax figure.

## Where the reading acts

The reading acts in a year where the limit binds. On the Ekene PSC variant (synthetic; royalty 12.500000 percent, limit 60.000000 percent of gross, contractor share 60.000000 percent, tax 30.000000 percent):

| year | cost recovered | contractor profit oil | tax |
| --- | --- | --- | --- |
| 2030 | 131400000.000000 | 36135000.000000 | 10840500.000000 |
| 2031 | 118260000.000000 | 32521500.000000 | 9756450.000000 |

In 2031 the engine recovers 118260000.000000 against capex and opex of 31000000.000000 that year, drawing on the pool carried from earlier years. The tax, 9756450.000000, is 30.000000 percent of the contractor's profit oil. A regime deducting that year's costs as incurred would tax a different base.

## Why nothing graded depends on it

Every capstone field is the same number under each reading and under the alternative it names, so no tax line is graded. A partner report that quotes a PSC tax figure names the reading beside it. How a regime chooses its tax base belongs to the fiscal regime course, and the Nigerian taxes on petroleum operations to the Petroleum Industry Act course.

## Exercise

Open the agreement calculator on the view "The three stated readings". Read reading one and the three tiles beside it: they show the first Ekene PSC year in which the limit binds with revenue flowing. Check that the tax tile is 30.000000 percent of the contractor profit oil tile. Then open the recovery calculator on the view "PSC cost recovery", start from "The Ekene PSC variant", and read the 2031 row: pool in, cost oil limit, cost recovered, pool out, contractor profit oil and tax, then the tax line among the notes under the tables. Write two sentences for a partner: what the engine taxes in 2031, and what a regime deducting costs as incurred would tax, in words and without a figure.
