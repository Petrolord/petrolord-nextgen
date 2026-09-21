# A ratio limit becomes a row

Module one promised that a specification can be written as a linear row. This lesson makes the step, because it turns blending into linear programming, and every price in module four is read off the row it builds.

## The ratio

Every blended property the optimizer handles has the same form. Over the components i, with volumes v_i, the blend's value is a sum of numerator weights over a sum of denominator weights:

property of the blend = sum(w_i v_i) / sum(d_i v_i)

For a property blended on volume, w_i is the component's property and d_i is 1, so the denominator is the batch volume and the ratio is the plain volume average. For a property blended on mass, both weights carry the specific gravity. Lesson two sets out all four bases. Either way, the blend's value is a ratio of two linear sums, and a ratio is not linear.

## Multiplying through

A maximum limit L on that property reads:

sum(w_i v_i) / sum(d_i v_i) <= L

The denominator is a sum of positive weights times volumes that are zero or more, so it is positive whenever anything is blended. Multiplying both sides by it keeps the direction of the inequality:

sum(w_i v_i) <= L x sum(d_i v_i)

Gathering everything on one side gives the row the digest states:

sum((w_i - L d_i) v_i) <= 0

That row is linear in the volumes. Each component's coefficient is a fixed number, its own w_i minus the limit times its own d_i, and the right-hand side is zero. A minimum limit gives the same row with the sense turned: sum((w_i - L d_i) v_i) >= 0. A range, such as a density between a minimum and a maximum, gives two rows, one for each end. The optimizer's price table at Apapa lists them as a Density maximum row and a Density minimum row.

## Reading a coefficient

The coefficient w_i - L d_i says how a barrel of component i pushes on the limit. A component whose property sits above a maximum carries a positive coefficient: every barrel of it uses up room. A component whose property sits below the maximum carries a negative coefficient: every barrel of it makes room for the others. The row holds when the pushing and the room-making balance at zero or better. That is why a cheap component with a poor property can still enter a recipe, carried by a costlier one with room to give.

## The batch row

One more row makes the batch: sum(v_i) = target. At Apapa the target is 8000 bbl. It is an equation, which is why phase one is needed to find a starting point, and its price, read in module four, is the cost of one more barrel.

{{panel:crude-recipe-explorer}}

In the panel, pick a specification and read each component's coefficient in its row. Move the limit and watch every coefficient change together, because L sits inside each one.

## Exercise

Read the Apapa component table: sulfur of 4 ppm on Reformate, 110 ppm on FCC gasoline, 1 ppm on Isomerate and 1 ppm on Butane, against the template's Sulfur maximum of 50 ppm. Without evaluating the coefficients, say which components carry a positive coefficient in the sulfur row and which a negative one, and say what that sign shows about the part each component plays in meeting the limit.
