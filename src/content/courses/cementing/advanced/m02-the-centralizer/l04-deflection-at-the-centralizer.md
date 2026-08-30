# Deflection at the centralizer

The first of the two standoff numbers, and the one that is usually fine.

{{panel:cm-standoff-explorer}}

## The chain

    lateral load  W = buoyed weight x spacing x sin(inclination)
    spring rate   k = restoring force / ((1 - 0.67) x clearance)
    deflection    d = min(clearance, W / k)
    standoff      = (clearance - d) / clearance

Four lines, in order, and each takes exactly one thing from the line before.

## Worked twice

**Slant well, 12 m, 40 degrees, open hole.**

    W = 345.6133299031847 x 12 x sin(40) = 2665.871594451281 N
    k = 8900 / (0.33 x 0.019049999999999997) = 1415732.124393542 N/m
    d = 0.0018830339076986488 m
    standoff = 0.901153075711357

**Horizontal well, 12 m, 90 degrees, open hole.**

    W = 345.6133299031847 x 12 x 1 = 4147.359958838217 N
    d = 0.0029294807169928587 m
    standoff = 0.8462214846722909

## Both pass the API target comfortably

Ninety percent and eighty five percent, against a target of sixty seven.

If the centralizer deflection were the whole story, both wells would be fine at 12 m spacing and there would be nothing to design.

## And the reported standoff is lower than both

The slant well reports 0.742357202445576 and the horizontal one 0.599178961025609.

Both are the MID SPAN value, and both are well below the value at the centralizer. The horizontal well's reported number fails the target that its centralizer deflection passes by eighteen points.

## Which is the module 3 result, stated early

The centralizer is not what binds. The sag of the pipe between two of them is.

That is worth knowing before spending any time on centralizer selection, because it reorders the whole design conversation: the question is not which centralizer, it is how many.

## The clamp

    d = min(clearance, W / k)

If the load exceeds the spring's capacity to resist it over the whole clearance, the pipe is on the wall and the standoff at the centralizer is zero.

On this well that needs a load of

    1415732.124393542 x 0.019049999999999997 = 26969.69696969697 N

which at 90 degrees is a spacing of 78.03430781229383 m. So the centralizer itself is never bottomed out at any spacing anybody would run.

## Exercise

Compute the standoff at the centralizer for a 20 m spacing at 90 degrees with the 8900 N spring.

Then look up the reported minimum standoff at 20 m from the spacing sweep in the panel, and say which of the two terms produced it.
