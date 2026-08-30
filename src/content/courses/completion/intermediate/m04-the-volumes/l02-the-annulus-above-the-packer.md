# The annulus above the packer

The largest of the four volumes, and the only one that reads both the string and the casing at once.

{{panel:cd-clearance-explorer}}

## The integral

At every depth from the hanger to the packer, the annular area is the casing inside area less the string outside area. Integrate that over depth and you have the volume.

Both terms change with depth. The casing changes at section boundaries and at the liner top. The string changes at every component. So the integrand is piecewise constant with breakpoints from two independent sources.

## Two sets of breakpoints

That is the interesting structural fact about this calculation. The casing profile has its breakpoints and the string has its own, and the integration has to respect both.

Merge the two sets, sort them, and between consecutive breakpoints both areas are constant. Then the integral over each interval is a product, and the total is a sum.

## Why not integrate numerically

Because you would not need to. The integrand is piecewise constant, so the exact answer is a finite sum, and any quadrature is at best equal to it and at worst wrong near the breakpoints.

A hundred point Simpson rule over this integrand would land points inside intervals and miss the discontinuities, and would report a smooth looking answer with an error that depends on where the points happened to fall.

## The size of it

Sixty seven point nine cubic metres in this well. At a typical packer fluid cost, that is a real line item, and it is the number the fluid is ordered against.

It is also the volume that has to be displaced when the annulus is displaced to packer fluid, which is a pumping operation with a defined endpoint, and the volume is how the endpoint is known.

## What is excluded

The volume of the equipment bodies is included correctly, because the string outside area at each depth is the local component's outside area, not the tubing's. A five and three quarter inch safety valve displaces more annulus than the tubing around it, and over two point two metres.

What is not included is anything outside the casing. Cement, the annulus between casing strings, and any losses to the formation are all somebody else's calculation.

## Exercise

Explain in two sentences why this integral needs breakpoints from two sources.

Then, from the panel, estimate how much of the annulus volume lies above the liner top and how much below.

Finally, say what would happen to the total if the safety valve were replaced by plain tubing, and whether the change would be large enough to matter.
