# The loss is carried

Not every barrel of crude that enters a refinery leaves it as a saleable product. Some is burned as fuel in the plant's own heaters, some is flared, some evaporates or is lost in handling. The screen does not pretend that fraction away. It carries it.

{{panel:refinery-screen-explorer}}

## A yield with no value

Every configuration's yield row has a loss column, and on all three it reads 0.0200:

| configuration | loss |
| --- | --- |
| Topping | 0.0200 |
| Hydroskimming | 0.0200 |
| Conversion | 0.0200 |

productSlate carries the loss as a yield with no value. It sits in the yield row alongside the products, so the row accounts for the whole barrel of crude and the engine can print yields total 1.0000 and yields close true. It has no price, and nothing is added to the gross value for it.

That is the honest treatment. The loss is part of the barrel you paid for. It is also no part of anything you sell.

## Where the loss shows in the margin

Because the gross value is per barrel of crude, the loss is already inside it. The crude cost is paid on every barrel of crude, including the fraction that becomes loss, and the gross value only counts the fractions that are sold. So the loss reduces the gross margin without ever appearing as a cost line of its own. There is no loss row in the annual streams; there does not need to be.

This is why the unit of the slate matters. A slate valued per barrel of product would have to find somewhere else to put the loss. Valued per barrel of crude, it falls out of the arithmetic on its own.

## Why the loss is not left out

A slate that dropped the loss column would describe less than the whole barrel of crude. The engine's check lines exist to catch a row like that, and the last lesson of this module shows what they print when a row does not close. Carrying the loss as a named yield keeps the row closed and keeps the loss visible, with a figure a reader can question.

## What 0.0200 is

On this screen it is a fixed input, the same on every configuration, because the screen's yields are fixed vectors. A real plant's loss varies with its units, its fuel system and its operation. For a real project the loss is one of the yields that deserves a source, like any other.

## The mistake

Treating the loss as a cost and subtracting it a second time. It is already in the gross value, because it is a fraction of every barrel of crude that earns nothing. A margin that took the loss out again would count it twice.

## Exercise

Read the hydroskimming yield row and its slate table. Name the yields that appear in the slate table and the one that does not. Then say why the engine can print yields close true while the slate table itself has no loss row.
