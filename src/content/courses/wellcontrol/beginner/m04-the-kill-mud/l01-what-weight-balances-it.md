# What weight balances it

The kill mud weight, and why it is a division.

{{panel:wc-killsheet-explorer}}

## The expression

    kill mud density = mud density + SIDPP / (g x TVD at the bit)

The current mud plus whatever extra density is needed to provide the pressure the surface gauge is currently providing.

## Why it is that simple

Because the shut-in drill pipe pressure is exactly the deficit. The mud column is short by that much, and a heavier mud makes up the difference over the same height.

There is no iteration, no correlation and no assumption beyond the mud in the string being the density you think it is.

## The numbers

Horizontal well, 1440 kg/m3 mud, 1214.859173174 m of TVD:

| scenario | SIDPP | kill mud weight |
|---|---|---|
| moderate | 2000000 Pa | 1607.873978399 kg/m3 |
| small | 800000 Pa | 1507.149591360 kg/m3 |

On the slant well, with its much deeper bit, the same two readings need a far smaller weight increase.

## Read the two wells

The same shut-in reading needs a much bigger weight increase on the shallow well, because the column is shorter and each kilogram per cubic metre buys less pressure.

That is the general rule: a shut-in pressure on a shallow well is a much worse problem than the same reading on a deep one.

## The increment

Moderate scenario on the horizontal well: from 1440 to 1607.87, which is 167.87 kg/m3, or about 1.4 pounds per gallon.

On the slant well the same reading needs 81.32 kg/m3. Half as much, for twice the depth.

## What it does not include

**A trip margin.** The kill mud weight balances the formation exactly and gives no overbalance at all. Adding a margin is a separate decision and it is the next lesson.

**Anything about whether the mud can be built.** The weight is what it is; whether the rig has the barite is a logistics question.

## Exercise

For the slant well with the moderate scenario, confirm the kill mud weight from the expression.

Then compute what SIDPP would be needed on the horizontal well to require the same kill mud weight, and say what that says about which well would be more alarming to shut in.
