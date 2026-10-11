# Anomaly conformance and the implied contact

A hydrocarbon anomaly ends downdip at a contact, so its downdip edge should follow one depth contour. `anomalyConformance` in prospectAssessment.js measures how closely an anomaly's edge follows the structure and what contact that edge implies. It carries a golden and an independent oracle in the engines repository.

## What the engine reads

The engine takes an anomaly as a set of grid nodes on the stated depth grid. Its downdip edge is every anomaly node beside a lower node outside the anomaly, read at their midpoint. From those edge points it returns:

- the edge scatter, how far the edge depths spread about one contour;
- conformance = 1 - scatter / relief, clipped to 0 to 1, where the relief is the closure's relief from crest to spill;
- the share of the anomaly inside the closure;
- the implied contact, the depth the edge points to.

Conformance near 1 says the edge sits on one contour; 0 says its scatter reaches the closure's relief.

## Two designed teaching anomalies

On the Ekene grid the course runs two anomalies DESIGNED for teaching, labelled as such. Anomaly A is every mapped node shallower than the spill. Anomaly B is every node shallower than a level 20 ft below the spill, kept only west of the grid's middle column, so one of its edges is a straight line with nothing to do with depth.

| anomaly | nodes | edge nodes | conformance | share inside the closure | implied contact ft | edge scatter ft |
| --- | --- | --- | --- | --- | --- | --- |
| A, a contour | 11 | 9 | 0.729467 | 1.000000 | -5053.959008 | 0.643935 |
| B, cut across | 72 | 22 | 0.000000 | 0.152778 | -5068.442175 | 6.992237 |

## Reading A

A has the 11 nodes of the closure at the spill and lies wholly inside it. Its implied contact, -5053.959008 ft, sits just below the spill at -5053.948819 ft, because each edge point is the midpoint between an anomaly node and the lower node outside it. Its scatter, 0.643935 ft, is measured against a relief of only 2.380249 ft, the column of a grid that spills at its own edge, so even a clean contour costs conformance on this map. A scores 0.729467, above the 0.7 the assessment counts as fitting.

## Reading B

B's edge scatter, 6.992237 ft, is larger than the closure's whole relief, so conformance clips to 0.000000, under the 0.3 the assessment counts as cutting across. Only 0.152778 of its nodes lie inside the closure. Its implied contact, -5068.442175 ft, comes from edge points that follow no contour. The engine still returns it, beside a conformance of 0.000000.

## What conformance depends on

On the Ekene grid the relief is the map's limit, set by the mapped edge. A report quotes conformance with the relief it was measured against and the edge flag of the closure.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, set View to "Anomaly conformance, evidence and the assessment" and Data to "Ekene teaching pack". For anomaly A, set "Anomaly: nodes shallower than the spill plus, ft (stated)" to 0 and "Cut the anomaly at the middle column (stated)" to no, and check the six tiles against the table. For anomaly B, set the first control to -20 and the second to yes. Compare A's implied contact with the spill the closure view returns, and write one sentence for each anomaly on what its implied contact may be used for, naming the conformance threshold that decides it.
