# Which one binds

The horizontal case, and the ratio that summarises it.

{{panel:td-buckling-explorer}}

## The numbers

On the horizontal well rotating on bottom:

    maximum tension utilization  = 0.07364558584156092

Read that against the vertical well's 0.20310094303602616. The horizontal well is
using barely a third as much of its tensile rating as the vertical one, on a
string that is 800 m longer.

The torsion utilization on the same run is the Expert capstone's third field, so
it is not printed here. Compute it, and then compute the ratio of the two.

On the vertical well tension is 7.557 times torsion. On the horizontal well the
ratio has inverted and the swing between the two wells is more than a factor of
twenty, produced entirely by the shape of the hole.

## Why tension is so low

Because the horizontal well is 2800 m long and 1600 m of that is horizontal. The horizontal part contributes NO weight to the axial load at all, because cos(90) is zero.

So the tension at surface is the weight of the vertical and build sections only, which is about a third of the string.

## Why torsion is so high

Because the horizontal part contributes its full weight to the side force, and every metre of side force contributes friction torque at the tool joint radius.

So the lateral is invisible to tension and dominant in torque.

## The general statement

In a well, tension utilization scales with the TVD of the string and torsion utilization scales with the contact length. A vertical well has all TVD and no contact length; a lateral has all contact length and no TVD.

That is the whole of it, and it is why the ratio moves by a factor of 25 across the fixture set.

## What follows for design

**On a long lateral, the constraint is the top drive and the pipe's torsional rating**, not the derrick and not the tensile rating.

**Reducing torque is worth more than reducing hookload**, which reverses the usual priority. That is why torque reduction subs, lubricants and rotary steerable systems earn their cost in laterals.

**Back reaming is a bad trade there**, because it converts the load you have plenty of margin on into the one you do not.

## The 80 percent flag

The engine warns above 0.8 on either. None of the cases in this course reaches it, and the worst is the build-and-hold well at 0.26809334335788837 in torsion.

That leaves a lot of room, which is realistic for a 3500 m well with 5 inch pipe. It is not realistic for a 9000 m extended reach well, and the point of the ratio is that you can see which direction the trouble comes from long before you get there.

## Exercise

Rank all five wells by the ratio of torsion utilization to tension utilization.

Then say which well you would expect to sit between the horizontal and the build-and-hold if a sixth were added at 80 degrees of hold angle, and justify it with the two scaling arguments above.
