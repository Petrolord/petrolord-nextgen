# The tie panel map

The tier's panel draws one well at a time through the framework, and every module from here on will send you back to it. This lesson is a guided tour, so that later lessons can say "switch the trajectory control" without explaining the furniture again.

{{panel:em-tie-explorer}}

## The two controls

The first control picks the well. W2 is the interesting one and the default; the other three are the vertical references that make W2 legible.

The second control is the panel's exposed assumption, and it is worth being explicit about why it exists. Every panel in this course family exposes the inputs that are assumptions rather than measurements. Here the assumption is the trajectory itself: "from the survey" builds the minimum curvature path from the well's stations, and "assume a straight vertical hole" throws the survey away and treats the well as a plumb line, which is what every tie computation silently does until someone builds a trajectory. The gap between the two settings is the subject of module five.

## The section

The drawing is an east-west cross-section at the chosen well's y coordinate. The three coloured curves are the clamped framework surfaces, TopA, TopB and BaseB, sampled along the section; the white line is the well path; each orange dot is a pick landed in 3D, with a dashed bar dropping from the pick to the surface it ties against. The bar IS the residual, drawn at true scale, and its label carries the signed value.

Two things to notice on first opening, with W2 selected. The white path is vertical at the top, curves through the build, and runs at a constant slope thereafter: the three parts of the survey, drawn to scale. And on the east side of the section the TopB and BaseB curves merge into one line: that is the clamp's pinch-out of zone B, reaching this tier from module three of the Associate course, and it will matter enormously in module four.

## The tiles

The first row of tiles gives, per pick: the pick's TVDSS against the surface's depth at the landing point, then the three residuals with their signs. Below them: the lateral reach at the deepest pick, which is how far from the wellhead the trajectory has carried the bottom of the hole; the zone A control point with its x, y and weight; and the worst residual across the whole well set, which stays fixed at W2 BaseB 45.028 whichever well you are viewing, because it is a property of the set, not of the selected well.

## Worked example

Select W1 and read the panel against last lesson's arithmetic. The path is a vertical white line at x 1100. The three residual tiles read minus 2, plus 2 and plus 5, top to bottom of the stack, and each dashed bar is a few metres long, barely visible at section scale. Now select W2 and watch three things change at once: the path bends east, the residual bars grow an order of magnitude, and the TopA bar points the opposite way from the other two. All three observations get their own lessons in modules two through four.

## Exercise

With W2 selected and the trajectory on "from the survey", write down the three residuals with their signs from the tiles. Then switch to "assume a straight vertical hole" and write the three residuals again. Which pick's residual changed sign? Keep the two lists; module five derives every entry in them.
