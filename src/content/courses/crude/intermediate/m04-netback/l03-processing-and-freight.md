# Processing and freight

After the losses come two costs. They are simple subtractions, and the care is all in what they are per.

{{panel:crude-valuation-explorer}}

## The last two terms

The netback formula ends with - processing cost - freight, all per barrel of crude. For the Kwale blend the lab prints the whole chain:

| term | $/bbl of crude |
| --- | --- |
| gross product value | 74.2412 |
| value lost to losses at 0.8 percent | 0.5939 |
| processing cost | 6.8000 |
| freight | 1.9000 |
| netback | 64.9473 |

Complete: true. Costs taken as zero because they were blank: nothing.

The netback, 64.9473 $/bbl of crude, is what a barrel of the Kwale blend is worth to the Kwale refinery once its products are sold, its losses allowed for, its processing paid and the crude brought to the gate.

## Processing cost

Processing cost is an input per barrel of crude, 6.8000 $/bbl of crude for the Kwale blend. In the formula it is subtracted after the loss factor, so the loss does not scale it.

This course takes processing cost as one number the refinery supplies. How a refinery builds that number is taught in the `refinery` course. Here it is an input, invented like every price in this course, and the lesson is only where it sits in the chain.

## Freight

Freight is the other cost input, and it is also per barrel of crude. This course's definition for this module names what a netback is: what a barrel of crude is worth at the refinery. Freight comes off in the formula as a figure per barrel, after the losses.

What freight is made of, and the terminal side of moving a cargo, belongs to the `supply` course. Here, as with processing, freight is one figure per barrel of crude.

## Why every term is reported

The engine's rule is that every term is reported beside the total. Laid out as gross 74.2412, loss 0.5939, processing 6.8000 and freight 1.9000, each term of the 64.9473 can be read on its own row. The order of the chain is visible too. Lesson 2 printed what the same terms give when the losses are taken after the costs, 65.0169, and the engine's column beside it.

## Complete and nothing assumed

Two lines under the table matter as much as the figures. Complete: true says the valuation left no cut unpriced. "Costs taken as zero because they were blank: nothing" says no cost was left empty. The next two lessons are what happens when either line reads otherwise.

## In the panel

The waterfall in the valuation explorer steps down from gross through the loss, processing and freight to the netback. Change the processing cost or the freight and only that step and the netback move. Gross and the loss value stay where they are, because neither depends on a cost.

## Exercise

Read the five terms for the Kwale blend and the two lines beneath them. Say which terms are per barrel of product before they become per barrel of crude, and which are per barrel of crude from the start. Then say what the two lines beneath the table tell you that the netback figure alone does not.
