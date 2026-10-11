# The QI assessment

The closure, the conformance, the evidence count and the feasibility verdict meet in one decision. `assessProspect` in prospectAssessment.js reads them through a stated decision table and returns two things: a recommendation (mature, investigate, retain or downgrade) and a seismic support (supports, neutral or against). It returns no probability of success. The engine awaits its independent oracle; the course teaches it, and grades it only once that check lands.

{{video:qi-f18}}

## The thresholds

Conformance at 0.7 and above fits the structure; conformance under 0.3 cuts across it. Maturing a prospect needs two independent supporting sources. Between 0.3 and 0.7 the edge is neither. A report quotes the thresholds with the decision.

## The decision table

| case | recommendation | seismic support |
| --- | --- | --- |
| anomaly present, conformance 0.83, inside 0.9, two independent sources, feasible, nothing open | mature | supports |
| the same with one independent source | investigate | supports |
| no anomaly, feasible | downgrade | against |
| no anomaly, feasibility not stated | retain | neutral |
| anomaly present, a competing explanation judged likely | investigate | neutral |

## Reading the rows

The first row is the case every input favours: an anomaly that follows a contour, sits almost wholly inside the closure, rests on two independent sources, on data the feasibility study says can see the fluid, with no open issue. It matures, and the seismic supports it.

Take one independent source away and the seismic still supports the prospect, but the recommendation drops to investigate. Support and recommendation are separate outputs: one says which way the seismic leans, the other says what the study should do next.

The two rows without an anomaly show the feasibility verdict at work. Where the study says the fluid would be visible, its absence is evidence against, and the prospect is downgraded. Where feasibility is not stated, absence says nothing, and the prospect is retained with neutral support. An Associate-tier input decides between them.

The last row shows a competing explanation judged likely. The anomaly is present and the recommendation is investigate, but the support is neutral, because the anomaly points to its rival as readily as to fluid.

## On the Ekene grid

The course prints no assessment of the Ekene teaching anomalies; the panel runs one on inputs a learner states. Anomaly A conforms above the fitting threshold and lies wholly inside a closure that is the map's limit; anomaly B falls under the cutting threshold. The feasibility verdict, the evidence count and any competing explanation are stated by the learner. Change one and the recommendation can change.

## What the assessment is

The output is a decision aid built from stated inputs, and its words are QI's words about the seismic. The geological chance of success belongs to the risk team; the engine returns a recommendation and a seismic support for that team to weigh.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, set View to "Anomaly conformance, evidence and the assessment" and Data to "Ekene teaching pack". The assessment opens on the first row of the decision table: check its Recommendation and Seismic support. Set "Independent supporting sources (stated)" to 1 and read them again. Restore 2, set "Anomaly present (stated)" to no, and read the result with "Feasibility verdict (stated)" at feasible and then at not stated. Finally set the anomaly back to yes, enter anomaly A's Conformance and Share inside the closure from the tiles above, state a feasibility verdict and a number of sources of your own, and write the recommendation with every input that produced it.
