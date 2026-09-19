# The gross margin per barrel

This is the screen's headline figure: what a barrel of crude earns once it has been bought and put through the plant. It is one subtraction, and every term in it is per barrel of crude.

{{panel:refinery-screen-explorer}}

## The rule

The engine states it:

gross margin per barrel = gross value - crude cost - variable operating cost

For OKORDIA, hydroskimming under firm supply:

| term | US dollars a barrel of crude |
| --- | --- |
| gross value per barrel of crude | 83.7900 |
| crude cost | 76.0000 |
| variable operating cost | 3.2000 |
| gross margin per barrel | 4.5900 |

## Each term in its place

The gross value comes from the slate: yields times prices, summed per barrel of crude, with the loss carried as a yield of no value. It is 83.7900 for hydroskimming at OKORDIA's prices.

The crude cost is what the plant pays for a barrel of crude delivered. OKORDIA's is 76.0000 under firm supply, where the premium is 0.0000. The fifth module adds a premium to it.

The variable operating cost is the cost that scales with the barrels run: chemicals, catalysts, utilities bought per barrel. OKORDIA's is 3.2000 a barrel.

What is left, 4.5900, is what each barrel of crude contributes toward everything the plant pays regardless of how much it runs, and toward the return on the capital.

## What the gross margin leaves out

The gross margin per barrel leaves the fixed operating cost out. The fixed cost is a yearly figure in the streams: 7500000.00 a year for OKORDIA, printed in each producing year the streams table shows. It does not belong in a per barrel figure, because how much it costs per barrel depends on how many barrels there are. Put it in the per barrel margin and the margin changes every time the throughput does, which hides the fixed cost's real character.

Capital is also outside the gross margin. It appears in the construction years of the streams as capex, and the screening engine values the whole stream later.

So a positive gross margin is necessary for a project and is not enough. The barrels have to earn their margin in enough volume to cover the fixed cost each year and repay the capital. Those comparisons are the valuation's job, and the Economics courses teach it.

## Why the margin is the screen's figure

The gross margin per barrel is the quantity the rest of the course keeps coming back to. The plan in the next tier finds the margin with every barrel run through the crude unit. The actuals in the last tier are read against it. A feasibility screen prices it first, before any capital is spent, and it does so with three terms a reader can check one at a time.

It is also the figure that moves most visibly when an input moves. Under tight supply the crude cost with premium reads 79.0000 and the gross margin per barrel reads 1.5900. Under disrupted supply they read 82.0000 and -1.4100, a margin below zero. The fifth module reads those rows.

## The mistake

Subtracting the fixed operating cost per barrel as a fourth term. The engine keeps it as a yearly line, and a margin that includes it describes one particular throughput.

## Exercise

Read OKORDIA's gross value, crude cost, variable operating cost and gross margin per barrel. Quote all four. Then quote the fixed operating cost and say why it appears as a yearly figure in the streams and is not one of the terms in the margin.
