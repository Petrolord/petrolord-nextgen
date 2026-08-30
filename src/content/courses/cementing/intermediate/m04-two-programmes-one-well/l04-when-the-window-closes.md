# When the window closes

No rate satisfies both constraints, and the answer is not a rate.

{{panel:cm-placement-explorer}}

## The result

On the HORIZONTAL well with the NEAT single-slurry programme, at a previous-shoe fracture limit of 1700 kg/m3:

    smallest rate with no free fall   0.02059793163869393
    largest rate under the limit      0.017832442077937685
    window                            -0.0027654895607562464

The constraints CROSS. Every rate slow enough to protect the shoe free falls, and every rate fast enough to prevent free fall fractures the shoe.

## The same well, with a lead slurry

    smallest rate with no free fall   0.019340962816243038
    largest rate under the limit      0.024740241221207958
    window                             0.00539927840496492

Open, and comfortably. The design rate of 0.02 sits inside it.

## What changed

The lead slurry moved BOTH edges in the helpful direction.

The free-fall edge came down from 0.020597931638693924 to 0.019340962816243038, because the heavier annular column needs less friction to hold it.

The ECD edge went up from 0.017832442077937685 to 0.024740241221207958, because the lighter lead lowers the head at the previous shoe, leaving more of the budget for friction.

One change to the programme, two edges, both improved. That is why the answer to a closed window is a programme change rather than a rate change.

## The four combinations at 1700

| well | programme | window |
|---|---|---|
| slant | lead and tail | 0.0072457909999926184 |
| slant | neat | 0.0001944956449708296 |
| horizontal | lead and tail | 0.00539927840496492 |
| horizontal | neat | -0.0027654895607562464 |

Three open and one closed, and the closed one is the combination of the harder well with the cruder programme.

## And the limit is a choice

Raise the assumed fracture limit to 1750 and the horizontal neat window opens to 0.00331468341249528. Lower it to 1650 and it is minus 0.009535816465640959.

So the closure is a statement about a well, a programme AND an assumed leak-off value together. Quote it without all three and it is not reproducible.

## Which is the honest finding

**Transferable:** the two constraints act on the same knob in opposite senses, so a window exists or it does not, and whether it exists is a property of the programme rather than of the driller.

**Not transferable:** that this particular combination closes at this particular limit. That is these numbers.

## What to do about a closed window

Change the programme, in one of four ways.

**A lighter lead, or a longer lead section.** Lowers the ECD and raises the annular head at once, which is what the comparison above shows.

**A lower top of cement.** Less annular column, less head at the shoe. Costs isolation.

**A staged job.** Cement the lower section, let it set, then cement above it through a stage collar. Not modelled here.

**Accept the free fall and manage it.** With a downhole restrictor, or by accepting that the rate is not yours for part of the job. Common on large casing, and the Expert tier of the Casing and Tubing course meets the same acceptance in a different form.

## Exercise

Take the horizontal well's neat programme and work out, from the table of limits in the panel, the fracture limit at which its window would just close to zero.

Then say whether that limit is one you could establish before the job.
