# Cinco-Ley and Samaniego

The fracture has to be turned into a single number the inflow equation understands, and one correlation does the whole of that job.

{{panel:st-pack-explorer}}

## The problem it solves

An inflow performance equation is written for radial flow into a cylindrical wellbore. A fracture is a plane. There is no term in the radial equation for a plane, so either you replace the whole flow model or you find a way to express the fracture as a correction to the radial one.

The correction is a skin. Damage skin is positive because damage takes deliverability away. A fracture adds deliverability, so its skin is negative. It is called a pseudo-skin because nothing near the wellbore has actually changed permeability. The rock is unaltered. Only the geometry of the flow path is different.

## What it was fitted to

Cinco-Ley and Samaniego solved the coupled problem of flow along a finite-conductivity vertical fracture and flow from the reservoir into it, numerically, and published the result as a chart. The chart plots the pseudo-skin plus the logarithm of the length ratio against dimensionless conductivity, and it collapses onto a single curve because those two groups are the only ones that matter.

That collapse is the reason the correlation is useful. Whatever the permeability, the half-length and the pack, two dimensionless groups fix the answer. The engine carries a rational function fitted to that curve rather than the chart itself.

Two assumptions are built in and neither is negotiable. The fracture is vertical, planar, of uniform width and symmetric about the well, with two wings of equal half-length. The flow being described is the stabilised radial regime, not the early transient.

## The stated range

The fit is valid for dimensionless conductivity from 0.1 to 1000, and the engine holds exactly those limits. Below 0.1 the fracture is so starved that the correlation shape no longer follows the numerical solution. Above 1000 the fracture is effectively infinite in conductivity and the fit has nothing left to resolve.

The engine does not refuse a value outside the band. It computes, then attaches a warning naming the offending dimensionless conductivity and the range. What it does refuse is a non-positive conductivity, a non-positive formation permeability, or a half-length that is not strictly greater than the wellbore radius, all of which throw.

## Exercise

State the two dimensionless groups the correlation depends on and say what each one measures.

Confirm from the panel that the published dimensionless conductivity of 0.6649847808507611 lies inside the stated range.

Say why the pseudo-skin is negative while a damage skin is positive.
