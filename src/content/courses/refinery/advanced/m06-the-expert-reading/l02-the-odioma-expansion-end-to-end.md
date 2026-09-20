# The Odioma expansion end to end

The ODIOMA month read a plan against what happened. The ODIOMA expansion reads a plant that does not exist yet. This lesson walks the expansion from its inputs to the screen's answer in one pass, naming at each step the setting that makes it a refinery case.

{{panel:refinery-variance-explorer}}

## Step 1: the plant

A conversion plant of 12000 bpd, 340 on-stream days and firm supply. Crude at 74.0000 a barrel. Capital by the modular law from 100000000.00 at 10000 bpd. Fixed operating cost 14000000.00 a year, variable 4.2000 a barrel. 2 construction years, 20 operating years. A discount rate of 12 percent, a tax rate of 30 percent, start year 2027. All illustrative, in US dollars.

## Step 2: the screen

| figure | value |
| --- | --- |
| capital | 117831965.35 |
| gross value per barrel of crude | 92.2100 |
| annual throughput (bbl) | 3753600.00 |
| gross margin per barrel | 14.0100 |

The capital rests on the modular exponent of 0.9, a default for a vendor's figures to replace (held item H1).

## Step 3: the handover

feasibilityEconomics hands the screening engine a fiscalType of TaxRoyalty, a royaltyRate of 0, a taxRate of 30, a discountRate of 12, lossCarryForward true, a projectLife of 22 years and a startYear of 2027. Money crosses in millions.

Three settings make this a refinery. Revenue goes in as revenue: 3753600.00 bbl at 92.2100 in each operating year, with the crude bill inside opexFixed of 291.7664 million. The royalty rate is 0 because a refinery buys its crude and pays no royalty. The loss carry-forward is on.

## Step 4: the cash flow

| year | calendar year | gross revenue (MM) | opex (MM) | capex (MM) | tax (MM) | tax loss carried forward (MM) | net cash flow (MM) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 2027 | 0.0000 | 0.0000 | 58.9160 | 0.0000 | 58.9160 | -58.9160 |
| 1 | 2028 | 0.0000 | 0.0000 | 58.9160 | 0.0000 | 117.8320 | -58.9160 |
| 2 | 2029 | 346.1195 | 307.5315 | 0.0000 | 0.0000 | 79.2440 | 38.5879 |
| 4 | 2031 | 346.1195 | 307.5315 | 0.0000 | 0.0000 | 2.0682 | 38.5879 |
| 5 | 2032 | 346.1195 | 307.5315 | 0.0000 | 10.9559 | 0.0000 | 27.6320 |
| 6 | 2033 | 346.1195 | 307.5315 | 0.0000 | 11.5764 | 0.0000 | 27.0116 |

The capital is deducted in the years it is spent (held item H2), so 2027 and 2028 make a tax loss. The pool shelters 2029 to 2031 in full and 2032 in part.

## Step 5: the tax over the life

Total tax over the life is 196.1780 million with the loss carried forward and 231.5276 million with the option off. The difference is 35.3496 million. The whole of it arises in years 2 to 5, the years the pool shelters, since from year 6 both treatments pay 11.5764 million a year and in the construction years both pay 0.0000. Throwing the loss away would tax the first operating years.

## Step 6: the screen's answer

NPV at 12 percent, mid-year discounting: 88.6345 million with the loss carried forward. The start year labels the years and moves no figure: with start year 2031 the NPV reads 88.6345 and the total tax 196.1780. The Economics courses teach and grade the NPV, and the Studio shows an IRR that those courses teach.

## What a reviewer should ask

A reviewer reading this screen has a short list. Is the capital estimate from a vendor, or from the default exponent? Is firm supply the right scenario, given that the Associate tier showed tight and disrupted supply cutting throughput and raising crude cost? Does the host country's tax regime deduct capital as it is spent, or through allowances from commissioning? Each question points at an input or a held item, and each can be answered by changing one setting and reading the screen again.

## Exercise

Read the three settings that make this a refinery case and say what each does to the cash flow. Then read the loss carried forward at the end of 2028 and 2031, and the tax in 2032 and 2033, and say what the pool did between those years. Finally, read the total tax under both treatments and the difference the engine prints.
