# Permeability from the slope

One division, and a decision about what to divide.

{{panel:wt-buildup-explorer}}

## The calculation

    k = 162.6 q B mu / (m h)

For the buildup in this course, everything on the right is known except m, and m comes from whichever line you fitted. So the permeability is a direct consequence of the window choice, and nothing else about the analysis can rescue a badly chosen one.

Fit every point and the slope comes out at 79.08878233809047 psi per cycle, which gives a permeability of 23.12907021605519 mD. The rock is actually 85 mD. The analysis has reported a reservoir less than a third as good as the one it was run on, from correct data, with a least-squares fit that a plot would not obviously condemn.

Fit only the late points and the answer converges upward towards 85 without reaching it. The panel will show you the whole progression, and module 5 takes it apart.

## Permeability or flow capacity

What the slope actually determines is the product kh, which has units of millidarcy feet and is called flow capacity or transmissibility.

    kh = 162.6 q B mu / m

Notice that no thickness appears on the right. The test measures kh directly and unambiguously. Splitting it into a permeability and a thickness is a second step, and the thickness comes from a log interpretation with its own uncertainty and its own definition of what counts as net.

This matters more than it sounds. If the net pay is 45 ft and the analysis reports 85 mD, and a later petrophysical review cuts the net pay to 36 ft, the permeability becomes 106 mD and the kh has not changed at all. The reservoir has not changed either. Only the bookkeeping has.

Report the kh. Report the thickness you used. Then report the permeability, so that someone downstream can redo the division with a different thickness if they need to.

## What the number is worth

The permeability from a semilog line is an average over the volume the transient reached, weighted in a way that is not simple. It is not the permeability at the wellbore, which is what a core measures, and it is not the arithmetic mean of a permeability map.

In a layered reservoir with no crossflow, the test returns something close to the thickness-weighted arithmetic mean of the layers, because the layers produce in parallel. In a reservoir with a barrier partway out, it returns something that depends on when in the test you read it. In a fractured reservoir it returns the fracture system's capacity early and the total system's later.

So the number is real, and it is the right number for a flow calculation, and it is not the same thing as any permeability a laboratory would report.

## The comparison worth making

Once you have a kh from a test, the useful comparison is not against a core plug. It is against the kh the log-derived permeability profile would predict when integrated over the same interval.

If the test kh is higher, something is conducting that the logs did not see: a fracture, a thief zone, a bed the cut-off excluded. If it is lower, something is not connected: a barrier, a compartment, damage deep enough to look like reduced permeability rather than skin.

Either way the disagreement is information, and it is more useful than either number alone.

## The misconception to avoid

"The test permeability is the true permeability and the log permeability is an estimate." Both are models. The test averages a large volume through the physics of radial flow; the log estimates a small volume through a correlation. They answer different questions and they disagree for reasons that are usually physical rather than erroneous.

## Exercise

Open the panel, choose the window that fits every point, and read the permeability. Then divide the flow capacity that implies by a net pay of 36 ft instead of 45.

Write down both permeabilities. Then say which of the two numbers you would put in a report, what you would put beside it, and why the flow capacity is the safer thing to quote.
