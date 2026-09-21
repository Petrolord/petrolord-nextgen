# The first taxable year

The engine prints one line that summarises when the loss pool stops sheltering the plant:

first year with tax to pay, loss carried forward: year 5, tax 10.9559 MM

This lesson reads that year closely, and sets it beside the first taxable year when the loss is not carried.

{{panel:refinery-variance-explorer}}

## Year 5 with the loss carried forward

| year | calendar year | taxable income before relief (MM) | tax, loss carried forward (MM) | loss carried forward at year end (MM) | tax, option off (MM) |
| --- | --- | --- | --- | --- | --- |
| 4 | 2031 | 38.5879 | 0.0000 | 2.0682 | 11.5764 |
| 5 | 2032 | 38.5879 | 10.9559 | 0.0000 | 11.5764 |
| 6 | 2033 | 38.5879 | 11.5764 | 0.0000 | 11.5764 |

Year 5, calendar 2032, opens with 2.0682 million left in the pool. The year's taxable income before relief is 38.5879 million. The pool is set against it first and is emptied. The tax rate of 30 percent then applies to the income the pool could not cover, and the tax is 10.9559 million.

That is why year 5 is a partial year. Its tax, 10.9559 million, sits below the 11.5764 million that every year from year 6 pays. The remainder of the pool sheltered part of the year's income, and the rest was taxed.

## The same year with the option off

With the option off, calculateEconomics taxes each year on its own taxable income. The construction losses are not carried. So the first operating year, year 2, calendar 2029, pays tax straight away:

| year | calendar year | tax, loss carried forward (MM) | tax, option off (MM) |
| --- | --- | --- | --- |
| 2 | 2029 | 0.0000 | 11.5764 |
| 3 | 2030 | 0.0000 | 11.5764 |
| 4 | 2031 | 0.0000 | 11.5764 |
| 5 | 2032 | 10.9559 | 11.5764 |

With the option off, every operating year from year 2 pays 11.5764 million. With the loss carried forward, years 2, 3 and 4 pay 0.0000 and year 5 pays 10.9559 million. From year 6 the two columns read the same, 11.5764 million.

## What the first taxable year tells a planner

A lender or a sponsor planning the early years of a plant wants to know when tax starts. The date sets how much cash the plant keeps in its first years, and those are often the years when debt is repaid. The ODIOMA screen answers: with the loss carried forward, the first tax falls in 2032, year 5, and the plant's first operating year is 2029, year 2.

The cash flow shows the effect directly. The net cash flow reads 38.5879 million in 2029, 2030 and 2031, then 27.6320 million in 2032, then 27.0116 million from 2033. With the option off, those early years would carry the full tax from 2029.

The first taxable year is set by two things only: the size of the pool the construction years leave, and the taxable income each operating year sets against it. More capital deducted in the construction years makes a larger pool and pushes the first taxable year later. A larger taxable income each year empties the pool sooner.

## Two things the first taxable year is not

It is not the first profitable year. ODIOMA's taxable income before relief is positive from year 2. The plant is profitable before it pays tax, because the pool shelters the profit.

It is not a figure to rebuild from the four-decimal pool, where each figure is rounded on its own. The course prints year 5 to nine decimals: the loss carried in 2.068157348 million, taxable income 38.587936000 million, and tax 10.955933596 million, by the rule tax = (taxable income - the loss carried in) x the tax rate of 30 percent once that is above zero.

## Exercise

Read the engine's line naming the first year with tax to pay, and the pool at the end of year 4. Say why year 5's tax is lower than the tax in year 6. Then read the tax in years 2 to 5 with the loss carried forward and with the option off, and say in which calendar year the plant first pays tax under each treatment.
