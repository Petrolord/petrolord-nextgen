# What carrying the loss is worth

The previous lessons read the loss pool year by year. This lesson reads the whole life at once: how much tax the ODIOMA expansion pays with the loss carried forward and with the option off, and what the screening engine reports for each.

{{panel:refinery-variance-explorer}}

## Total tax over the life

The engine prints the total tax over the plant's life under both treatments, and the difference between them:

| treatment | total tax over the life (MM) |
| --- | --- |
| loss carried forward | 196.1780 |
| option off | 231.5276 |

the difference 35.3496 MM

Carrying the construction loss forward saves the plant 35.3496 million of tax over its life, on the same revenue, the same opex and the same capital. That is the value of one setting, measured as tax.

## Where the difference comes from

The difference sits entirely in the early operating years. With the option off, years 2, 3, 4 and 5 each pay 11.5764 million. With the loss carried forward, years 2, 3 and 4 pay 0.0000 and year 5 pays 10.9559 million. From year 6 the two treatments pay the same, 11.5764 million a year, to year 21. The construction years pay 0.0000 under both.

So the saving is the tax sheltered by the pool, and nothing else. The capital is deducted once under both treatments. The only question is whether the deduction is used.

## The screen's answer under each

The screening engine also returns the feasibility NPV under each treatment:

NPV at 12 percent: 88.6345 MM with the loss carried forward; 64.8440 MM with the option off

These are the screen's answers under two tax treatments, and they are read here for one purpose: to set the two beside each other, 88.6345 with the loss carried forward and 64.8440 with the option off, on the same revenue, opex and capital. The Economics courses teach and grade the NPV, and this course does not ask for either figure as an answer.

## The trap, stated plainly

Switching the option off taxes the first operating years. With it off the engine taxes years 2, 3 and 4 in full, and part of year 5, on income the construction loss sheltered with it on. The total tax reads 231.5276 million against 196.1780, and the difference the engine prints is 35.3496.

That is why the choice is an owner decision in force: loss carry-forward is an option of the screening engine, off by default for every other caller; the refinery switches it on. Other callers of the screening engine keep their own behaviour. The refinery, whose capital falls before its revenue, has the loss carried.

## What it does not settle

Carrying the loss covers the refinery case under held item H2, where capital is deducted in the year it is spent. It does not make the engine a full capital allowance model. A regime that allows capital only from commissioning, over a set number of years, would give different figures, and that model belongs to the Economics & Commercial module. The 35.3496 million is the value of carrying the loss under this engine's rule.

## Exercise

Read the total tax over the life with the loss carried forward and with the option off, and the difference the engine prints. Say in which years the whole difference arises, reading the tax column for years 2 to 6 under each treatment. Then say why the capital deduction is the same under both treatments while the tax is not.
