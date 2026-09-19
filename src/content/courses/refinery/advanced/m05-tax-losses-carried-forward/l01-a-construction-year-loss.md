# A construction year loss

Module 4 ended with capital deducted in the years it is spent. For the ODIOMA expansion those are the two construction years, 2027 and 2028, when the plant has no revenue. This lesson reads the tax loss those years make and what the screening engine can do with it.

{{panel:refinery-variance-explorer}}

## The loss

The capital is expensed in the years it is spent, before the plant earns, so the construction years make a tax loss.

| year | calendar year | taxable income before relief (MM) | tax, loss carried forward (MM) | loss carried forward at year end (MM) |
| --- | --- | --- | --- | --- |
| 0 | 2027 | -58.9160 | 0.0000 | 58.9160 |
| 1 | 2028 | -58.9160 | 0.0000 | 117.8320 |

Taxable income before relief is the year's income less its deductions, before any loss from an earlier year is set against it. In each construction year there is no revenue and the capital deduction is 58.9160 million, so the taxable income reads -58.9160 million.

A negative taxable income pays no tax. The question is what happens to the negative part.

## Two ways to treat it

The screening engine offers a lossCarryForward option. It is off by default for every other caller. The refinery switches it on: feasibilityEconomics passes lossCarryForward true.

With the option on, the loss goes into a pool that is carried to the next year. The pool at the end of year 0 reads 58.9160 million. At the end of year 1 it reads 117.8320 million, holding both construction years' losses. Neither construction year pays tax, and nothing has been used yet. For arithmetic, SECTION 23 prints the same years to nine decimals: capex deducted 58.915982674 million in each, and the pool 117.831965348 million at the end of year 1.

With the option off, the engine taxes each year on its own taxable income, and a negative year simply pays no tax. The loss is not held anywhere. In the option off column the construction years also read 0.0000 in tax.

| year | calendar year | tax, loss carried forward (MM) | tax, option off (MM) |
| --- | --- | --- | --- |
| 0 | 2027 | 0.0000 | 0.0000 |
| 1 | 2028 | 0.0000 | 0.0000 |

In the construction years the two treatments print the same tax. The difference only appears when the plant starts to earn, and the rest of this module reads it.

## Why the refinery switches it on

Throwing the construction loss away taxes the first operating years. That is the second half of the trap this tier is built on. A plant that spent its capital before earning would be taxed from its first profitable year as if the capital had never been deducted at all, because the deduction fell in years with nothing to set it against.

Carrying the loss forward matches the deduction to income. It is also the reason the engine's treatment of capital, deducted when spent, is an acceptable screen for a refinery despite being held as a limit. Carrying the loss forward covers the refinery case.

## What the pool is

The pool is a running figure, in millions, of loss not yet used. It grows in a loss year and shrinks in a year with positive taxable income, until it is empty. The feasibility oracle checks it with a dated tax-loss ledger used oldest first, so the loss from 2027 is used before the loss from 2028.

## Exercise

Read the taxable income before relief and the loss carried forward at year end for 2027 and 2028. Say what the pool holds at the end of 2028 and where each part of it came from. Then read the tax in the construction years with the loss carried forward and with the option off, and say why the two treatments cannot yet be told apart in those years.
