# The QI report and the handover files

Every figure in this tier depends on settings, selections and data that a reader cannot recover from the figure, and a result without its settings cannot be checked. The handover files are the products themselves and that record, together.

## What the report states, for every product

- the method, with its references by author and year;
- the stated settings: the window, the wavelet and its scale, the low-frequency cut of the LFM (the low-frequency model), the weights, the iterations and the seeds;
- the blind-well figures, per parameter;
- the calibration of each property transform and its left-out check;
- the prospect figures, each with its limits;
- every issue raised along the way.

## The settings record on the Ekene pack

| setting | value |
| --- | --- |
| inversion window on the well traces, ms | 1100 to 1500 |
| wavelet | zero-phase Ricker, 25 Hz, half length 40 ms |
| low-frequency cut of the LFM, Hz | 8 |
| high cut of the log a result is scored against, Hz | 50 |
| regularisation weight eps | 0.050000 |
| iterations | 60 |
| angle of each stack, degrees | near 10, mid 20, far 30 |
| noise seeds of the realisations | 101 to 120 |
| net sand cut-off | 0.350000 |
| oil-water contact, ft | 5118.110236 |

Each row is a stated input. Change the window, the wavelet or the weight and every inversion figure moves; change the cut-off or the contact and the calibration and the facies labels move.

## The figures that travel with each product

An AI (acoustic impedance, Vp x density) volume carries its blind-well table: at Ekene the model-based blind correlations ran from 0.759365 to 0.889320. A simultaneous inversion carries its blind figures per parameter.

A porosity map carries its transform and both of its errors: s 0.007175 log against log, and the pooled left-out RMS 0.024072 that widened its band, with the samples behind each well's coverage. A facies map carries its labels, its priors, its confusion matrix and the fact that the matrix was measured on its own samples. Classes named for a fluid travel as fluid hypotheses.

A prospect carries its closure with the edge flag: on the Ekene Sand top grid the spill is limited by the map edge, so the column of 2.380249 ft is the map's limit. Conformance travels with the relief it was measured against, the evidence count with each item's source, and the assessment with every input that produced it. The engines behind anomaly conformance, the evidence count and the assessment await their independent oracle, and the report says so.

## The issue register

Every issue raised goes into the report. QI Studio raises one for a well whose seismic AVO class differs from its modelled class, and a high one for a negative scale between them, a polarity or wavelet problem. The limits this tier has met belong beside them: a NaN, a prediction outside the calibration range, a closure limited by the edge. An issue left out is a check the next reader cannot make.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, with Data "Ekene teaching pack", run the views "A linear transform and its interval", "Bayesian facies and the confusion matrix" and "Crest, spill and closure". For each product, write the line of a report that carries it: the figure, the settings it depends on, its check and its limit. Then change "Net sand Vsh cut-off (stated)" in the first two views and mark every line whose figure moved.
