# A stream worth nothing

One of ABUA's streams is worth 0.0000 dollars a barrel to the plan. This lesson reads why, and what a zero marginal value does and does not tell a planner.

{{panel:refinery-plan-explorer}}

## The offgas row

| stream | marginal value ($/bbl) | surplus (bbl) | products it goes into, at their prices | unit it feeds |
| --- | --- | --- | --- | --- |
| offgas | 0.0000 | 103638.71 | (no product) | (no unit) |

Every crude yields offgas: Bonny Light 0.0300, Forcados 0.0200, Brass River 0.0300. The reformer makes offgas 0.1000 on each barrel it runs, and the hydrotreater 0.0200. So the plan makes offgas whatever it does. Module 3's balance showed where it goes: made 103638.71 bbl, consumed 0.00, placed 0.00, surplus 103638.71.

## Why zero

The value is the plan's value of one more barrel arriving from outside. Ask where one more barrel of offgas would go. No product's recipe names it. No unit takes it as feed. It would join the surplus, and a barrel added to surplus changes nothing in the month's margin. So the plan values it at 0.0000.

The surplus column and the value column say the same thing twice. A stream left over at the end of the month is a stream whose next barrel has nowhere to go, and a stream whose next barrel has nowhere to go is worth nothing to that month.

It holds across every change. The lab prints offgas at 0.0000 in all six rows: the plan as typed, the hydrotreater shut and left blank, the crude unit at 1900000 barrels, the Forcados cargo cancelled, and the two floors. Nothing in those changes gives offgas a home, so nothing moves its value.

## What zero does not mean

A zero marginal value is a statement about this configuration. It does not say offgas has no value in the world. In a real refinery, light gases are usually burned as fuel in the plant's own heaters, or recovered and sold. ABUA's configuration gives offgas no product and no unit, so the plan cannot see either use.

That makes the zero a prompt. If a planner knows offgas is worth something to the refinery, the configuration should say so: a product for it with a price, or a use that saves a cost. Until it does, the plan will value it at nothing and make it anyway, because making it is the price of making everything else.

## The other direction

The zero also works as a check. A stream that should have a home and prints 0.0000 has lost it somewhere: a product ceiling reached, a recipe mistyped, a unit shut. Read every zero in the value table and ask whether the configuration meant it. In ABUA only offgas prints zero, and the configuration means it.

## Exercise

Read offgas's marginal value, 0.0000, its surplus, 103638.71 bbl, and its product and unit columns, both empty. Say how the empty columns lead to the surplus, and how the surplus leads to the value. Then say what a planner would have to add to the configuration before the plan could print a value for offgas other than 0.0000.
