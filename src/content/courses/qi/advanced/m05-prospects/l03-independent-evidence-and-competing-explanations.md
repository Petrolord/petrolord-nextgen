# Independent evidence and competing explanations

Several attributes that agree look like strength, and they are strength only where the attributes come from different measurements. `evidenceIndependence` in prospectAssessment.js counts the supporting items and the independent sources behind them: attributes computed from one seismic response are one piece of evidence, however many maps they fill. The engine awaits its independent oracle; the course teaches it, and grades it only once that check lands.

## One response, one source

| supporting items | independent sources | shared source |
| --- | --- | --- |
| 3 | 2 | full_stack |

The worked case has three supporting items: a full-stack RMS amplitude, an impedance from the same full stack, and a far-stack brightening. The first two are computed from the full stack, so they share the source full_stack and count once. The far-stack brightening comes from a different angle range, a second response, and counts as a second source. Three items, two independent sources.

An impedance inverted from the full stack moves with the full stack's reflectivity, so if the brightness has a cause other than fluid, both attributes inherit it and their agreement adds nothing.

## Why the count matters

The assessment matures a prospect only on two independent supporting sources. A study that lists five attributes from one stack has one source, and the assessment treats it as one. Every item in a report therefore names its source: which stack, which volume, which inversion.

## Competing explanations

Fluid is one explanation of an anomaly, and the Ekene figures name others. On AI (acoustic impedance, Vp x density) alone, most oil-sand samples at the wells were called brine sand, so a soft impedance anomaly may be brine sand. Vp/Vs separates the two sands at log scale, and its blind correlations at the wells are weak, so an anomaly on inverted Vp/Vs carries that uncertainty. An anomaly whose edge cuts across the contours, like designed anomaly B, is hard to explain by a contact at all.

The assessment takes a competing explanation as a stated judgement. Where one is judged likely, an anomaly that is present still leads to investigate, and its seismic support is neutral. The engine does not find competing explanations, and it does not weigh them: the interpreter names each one, states whether it is judged likely, and writes the reason into the report.

## Feasibility decides what absence means

Evidence also runs the other way. The absence of an anomaly counts against a prospect only where the feasibility study says the case would be visible. Without a feasibility verdict, absence is neutral, because a fluid the seismic cannot see leaves no anomaly to miss.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, set View to "Anomaly conformance, evidence and the assessment" and Data to "Ekene teaching pack". Read the evidence table, which groups the worked case's three items by source, and check the Supporting items and Independent sources tiles. In the assessment below it, keep the stated inputs as they open, then set "Independent supporting sources (stated)" from 2 to 1 and read how the Recommendation and the Seismic support move. Write one sentence naming a competing explanation for a soft impedance anomaly at Ekene, citing the facies lesson that supports it.
