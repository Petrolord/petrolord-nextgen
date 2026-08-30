# Breakpoints, not slices

Why the volume integration cuts where things change and nowhere else.

{{panel:cd-clearance-explorer}}

## The two approaches

Slice the well into fixed intervals, say every metre, evaluate the areas in each and sum. Or find every depth where either area changes, and sum exact products between them.

The first is easier to write. The second is exact.

## Why the second is exact

The integrand is piecewise constant. Between two consecutive breakpoints, the casing area and the string area are both fixed numbers, so the volume of that interval is a product of an area and a length with no approximation in it.

Sum those products and you have the integral exactly, in finitely many terms, with no discretisation error at all.

## Why slicing is not just less accurate

It is less accurate, and that is the smaller problem. The larger one is that the error is invisible.

A one metre slicing of the published well would put the safety valve, which is two point two metres long, in two or three slices depending on where the boundaries fell, and the reported volume would depend on that alignment. Change the slice size from one metre to half a metre and the answer changes, by a small amount, for no physical reason.

An answer that depends on a numerical parameter with no physical meaning is an answer that cannot be checked.

## How many breakpoints there are

The published well has three casing segments and thirteen components, so the merged set is small. The integration is a sum of a couple of dozen products.

That is faster than any slicing, as well as exact, which makes the choice easy.

## When you would have to slice

If either area varied continuously with depth. A tapered string, a real caliper log of an open hole, or a swollen elastomer would all produce an integrand that is not piecewise constant, and then quadrature is the right tool and the slice size is a genuine parameter to choose.

None of those is in this model, so none of that machinery is here.

## The general principle

Match the numerical method to the shape of the integrand. Piecewise constant integrands have exact finite sums, and using quadrature on them adds error and a tuning parameter in exchange for nothing.

## Exercise

Explain in one sentence why the integrand here is piecewise constant.

Count the breakpoints in the published well from the panel: casing boundaries plus component boundaries.

Then describe an input to this model that would break the piecewise constant assumption, and say what you would have to do instead.
