# The horizontal well

Three regimes in sequence, and a geometry the semilog line cannot express.

{{panel:wt-diagnostic-explorer}}

## The well

2000 ft of lateral in a 45 ft layer, with vertical permeability a tenth of horizontal, the well sitting 60 percent of the way up the layer, skin plus 1.5, no wellbore storage.

That is a well whose length is more than forty times the thickness of the reservoir it sits in, which is what makes its response distinctive.

## The three regimes

**Early vertical radial flow.** At first the disturbance has not reached the top or bottom of the layer, so flow converges on the lateral radially in the VERTICAL plane, like a vertical well lying on its side. The derivative is flat, at a level set by the geometric mean of horizontal and vertical permeability and by the well length rather than by the layer thickness.

**Linear flow.** Once the top and bottom are reached, flow becomes one-dimensional towards the lateral from the sides. The derivative rises on a half slope. On this fixture the classifier reports linear flow from 0.268 to 9.1 hours, a span of over a decade and a half.

**Pseudoradial flow.** Eventually the disturbance is far enough away that the 2000 ft lateral looks like a point, and flow becomes radial in the horizontal plane, as it would be for a vertical well. The derivative flattens again, at a level set by the horizontal permeability and the full layer thickness.

Between the linear flow and the pseudoradial plateau, the classifier reports a transition from 14.56 to 37.28 hours. Its slope sits in the bilinear band, and the ordering rule catches it: bilinear flow is a fracture regime, it precedes radial flow, and there is no fracture here. It is the climb from the linear period to the pseudoradial plateau.

## Two plateaus, two permeabilities

The first plateau and the last plateau are both radial flow and they are not the same measurement.

The early one is vertical radial flow around the lateral, and its level involves the square root of the product of horizontal and vertical permeability, divided by the well length.

The late one is ordinary horizontal radial flow, and its level is 70.6 q B mu / (k h) with the layer thickness.

So a horizontal well test, if it is long enough, gives both the horizontal permeability and the anisotropy. That is more information than a vertical well test can produce, and it is the main reason to run one.

The catch is that "long enough" is a strong condition. Pseudoradial flow on a long lateral in a thin layer can take hundreds of hours to arrive.

## Why the semilog line fails here

Which plateau would a semilog analysis fit?

Fit the early data and you get a permeability that is a combination of horizontal and vertical divided by a well length, interpreted through an equation that assumes a vertical well and a layer thickness. The number means nothing.

Fit the middle and you are on the half slope, which is not radial flow at all.

Fit the late data and you get the right horizontal permeability, if pseudoradial flow has been reached.

So on this well the semilog analysis is valid over one specific window and produces nonsense over the two windows that contain most of the data. Without the derivative there is no way to tell which is which.

## The parameter the data will not orient

There is one more thing worth flagging here, and the Expert tier makes it precise.

The well sits 60 percent of the way up the layer. It could equally sit 40 percent of the way up: the layer has no-flow boundaries at top and bottom, so the response depends on the distances to both, and swapping them is nearly a symmetry.

The Expert tier's regression finds both, and the WRONG one fits marginally better. A parameter can be recovered by a fit, reported with a confidence interval, and still be undetermined by the data.

## The misconception to avoid

"A horizontal well test is a vertical well test with a longer well." The flow geometry is different at every stage: vertical radial, then linear, then pseudoradial, with the layer thickness entering the first and third differently. Applying vertical-well equations gives numbers that are not wrong so much as meaningless, because the quantity they compute is not the quantity the equation defines.

## Exercise

Open the panel on the horizontal fixture and read the derivative level over the first flat stretch and over the last one.

Take the ratio. Then say what would happen to that ratio if the vertical permeability were the same as the horizontal, and what it tells you that the ratio here is what it is.
