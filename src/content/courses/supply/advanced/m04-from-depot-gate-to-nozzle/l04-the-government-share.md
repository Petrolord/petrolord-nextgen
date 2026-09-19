# The government share

One recipient in the BADAGRY grouping collects two elements of different kinds. The statutory levies are a fixed amount a litre. The value added tax is a percent of everything above it. The government share is their sum, and reading it properly needs both of the previous two lessons.

{{panel:supply-price-explorer}}

## The row

Both government elements are invented for this course. Neither is a published levy or tax rate, and neither describes any market as it is.

| recipient | naira per litre | share of price | elements |
| --- | --- | --- | --- |
| Government | 75.1996 | 0.069965 | Statutory levies at the pump; Value added tax |

In the waterfall the two elements print separately:

| element | recipient | basis | rate (invented) | amount naira/L | running naira/L | share of price |
| --- | --- | --- | --- | --- | --- | --- |
| Statutory levies at the pump | Government | per litre | 9.6 | 9.6000 | 1009.2253 | 0.008932 |
| Value added tax | Government | percent_of_running | 6.5 | 65.5996 | 1074.8249 | 0.061033 |

The invented levies add 9.6000 naira a litre. The invented value added tax adds 65.5996 naira a litre. The grouping reports 75.1996 naira a litre for Government, with a share of the 1074.8249 naira a litre price of 0.069965.

## What the tax row's base holds

The tax row's amount is set by its base. It is 6.5 percent of 1009.2253 naira a litre, the running total above it. That running total holds the landed cost, every invented margin and the invented levies. So the government's tax element is levied partly on the government's own levy, and partly on every margin the chain takes.

That is a property of the basis, and the previous lesson priced its alternative. With the same 6.5 percent typed on the landed cost, the pump price is 1066.7292 naira a litre. Which of those two is the government's intended base is a question for the regulation, and the engine applies whichever base it is given.

## Reading shares with care

The share column is a fraction of the final price, so it depends on everything in the build-up. The government's share of 0.069965 is a share of 1074.8249 naira a litre. It is not a tax rate, and it is not the invented 6.5 percent restated. The 6.5 percent is the rate the tax row applies to its base. The 0.069965 is the fraction of the price that reaches the government from both of its elements together.

Mixing those two up misreads the waterfall. A rate belongs to a base. A share belongs to a price. The engine prints both, in separate columns, and the course asks you to name which one you are quoting.

## Invented, and said so

The government row is easily quoted out of context, because it reads like a statement about policy. It describes this course's invented record and nothing else. Both government rates are invented, the landed cost beneath them rests on an invented exchange rate and invented import charges, and the engine ships none of those rates. The module's `RATE_DISCLAIMER` says every rate is a required input, set by regulation, differing by market and changing. A government share printed from the BADAGRY record describes the BADAGRY record. Quote it with that attached.

## Exercise

Record the levies amount, the value added tax amount, the government row in naira a litre and its share of price. Then record the invented tax rate and the running total it is applied to. Say what the share of 0.069965, read against the rate of 6.5 percent, shows about the difference between a rate and a share.
