# Which term binds

On both of this course's wells the answer is the same, and it is not the centralizer.

{{panel:cm-standoff-explorer}}

## The two numbers at the worst point

**Slant well**, worst interval 1400 to 1430 m at 40 degrees:

    standoff at the centralizer  0.901153075711357
    standoff at mid span         0.742357202445576
    reported                     0.742357202445576

**Horizontal well**, worst interval 1350 to 1380 m at 90 degrees:

    standoff at the centralizer  0.8462214846722909
    standoff at mid span         0.599178961025609
    reported                     0.599178961025609

## Both bound by the sag

And on the horizontal well the difference decides the verdict. The centralizer value of 0.8462214846722909 passes the API target with room to spare. The reported 0.599178961025609 fails it.

A design conversation that stopped at the centralizer deflection would have signed this job off.

## Why the worst point is where it is

Two things have to come together: a high inclination and a small clearance.

The clearance falls at the previous casing shoe, from 0.021348699999999998 in the cased section to 0.019049999999999997 in the open hole, because the 8-1/2 inch bit is smaller than the 9-5/8 inch casing bore.

And the inclination on both wells is at or near its maximum by then.

So the worst interval is just below the previous shoe on both wells: 1400 to 1430 m on the slant well and 1350 to 1380 on the horizontal one, both in open hole.

## The mid-span value is always the smaller

By construction. The mid-span standoff is the centralizer value less the sag, and the sag is never negative.

Which means the reported minimum standoff is ALWAYS the mid-span number on every interval of every well this engine will ever run, and `Math.min` in the code can never select the other branch.

That is worth saying, because it makes the reported number easy to reason about: it is one formula, always.

## Is the sag term right

It is a fixed-end uniformly loaded beam, which is the standard treatment and is used in every centralizer spacing calculation in the industry.

What it omits: the pipe's own residual curvature, the tension in the string, and the fact that a long span in a curved hole is not straight to begin with. All three would make the real sag different, and the tension term would make it smaller.

So the engine is conservative on tension and silent on curvature.

## Exercise

For the slant well's worst interval, compute the sag from the reported centralizer standoff of 0.901153075711357 and mid-span standoff of 0.742357202445576, given a clearance of 0.019049999999999997 m.

Check your answer against 0.0030250613857131267.
