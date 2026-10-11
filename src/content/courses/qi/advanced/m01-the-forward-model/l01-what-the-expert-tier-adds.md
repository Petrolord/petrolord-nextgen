# What the Expert tier adds

The Associate tier asked whether the seismic can see the fluid, from logs and one modelled interface. The Professional tier tied the wells, chose a wavelet and read AVO off the angle stacks. This tier goes from the seismic to impedance, from impedance to properties, and from properties to a prospect and a report. The first three modules are the inversion: the forward model every inversion runs, post-stack inversion of the full stack, and simultaneous inversion of the near, mid and far stacks.

## The engines and their gate

Every Expert engine has passed the extraction gate: a golden result plus an independent oracle in the engines repository. That includes the QI Studio maths the tier uses: the wavelet scale, the left-out-well check, the angle wavelets and the prospect trap.

| engine | what it computes | gate |
| --- | --- | --- |
| engines/qi/inversion.js | the forward model, model-based, blocky, sparse-spike and coloured inversion, the low-frequency model of one log | golden and oracle (pylops) |
| engines/qi/inversionSpread.js | quantiles across realisations, the relative spread, seeded noise | golden and oracle |
| engines/qi/prestackInversion.js | Fatti's coefficients, the prestack forward model, simultaneous inversion | golden and oracle (pylops) |
| engines/qi/lfm.js | the low-frequency model between wells, the blind-well score | golden and oracle |
| engines/qi/inversionQc.js | the wavelet scale at the wells, the moving-average high cut, the blind-well table | golden and oracle |
| engines/qi/propertyCalibration.js | the property calibration at seismic scale and its left-out-well check | golden and oracle |
| engines/qi/prospectAssessment.js | anomaly conformance, evidence independence, the assessment | golden and oracle |
| engines/qi/prospectTrap.js | the climb to a local crest, the trap and the anomaly of one prospect | golden and oracle |

lfm.js builds the low-frequency model between wells and scores every blind well in these modules.

## The settings the tier states

Each figure below is an input the course states on the Ekene pack, matching QI Studio's own setting wherever the app has one. None of them is a fact about the field; each is a choice a study must name.

| setting | value |
| --- | --- |
| inversion window on the well traces, ms | 1100 to 1500 (101 samples every 4.000000 ms) |
| wavelet | zero-phase Ricker, 25 Hz, half length 40 ms (21 samples) |
| low-frequency cut of the LFM, Hz | 8 |
| high cut of the log a result is scored against, Hz | 50 |
| regularisation weight eps | 0.050000 |
| iterations | 60 |
| blocky: epsTV, outer loops | 0.020000, 4 |
| sparse-spike lambda | 0.002000 |
| inverse distance power | 2 |
| coloured band, Hz | 8 to 60 |
| angle of each stack, degrees | near 10, mid 20, far 30 |

## The wells in time

Each pack well's logs go to two-way time on its checkshots, linear between levels, and onto the trace clock. The pack's logs cover only the Ekene Sand and the shale above it, so only part of the 101-sample window carries a log:

| well | log samples in the window | first logged ms | last logged ms | top Ekene Sand ms | base Ekene Sand ms |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | 27 | 1248.000000 | 1352.000000 | 1288.796378 | 1311.029994 |
| Ekene-2 | 27 | 1264.000000 | 1368.000000 | 1305.746335 | 1330.405474 |
| Ekene-3 | 27 | 1240.000000 | 1344.000000 | 1282.159191 | 1302.328106 |
| Ekene-4 | 26 | 1284.000000 | 1384.000000 | 1329.290304 | 1346.132878 |

Every score in the inversion modules runs over these logged samples alone: 27 at three wells and 26 at Ekene-4. Read every Expert figure with that count beside it.

## Words this tier uses

AI is acoustic impedance, Vp x density, in kg/(m2 s); SI is shear impedance, Vs x density. The inversions work in ln(AI), and convert back with AI = exp(ln(AI)). The LFM is the low-frequency model. A blind well is a well inverted with an LFM built from the other wells and then scored against its own log.

## Where the work runs

A Suite user runs these steps in QI Studio. Every exercise here runs in the inversion explorer, which calls the same engine files on the Ekene pack or on a pasted case, with one view for each step of the first three modules.

{{panel:qi-inversion-explorer}}

## Exercise

Open the inversion explorer with Data set to "Ekene teaching pack". Step through its eight views, from "The forward model and its adjoint" to "Simultaneous inversion by stacks". For each view, write down which engine file from the table above it calls, which stated settings it shows as controls, and whether it also accepts a pasted case. Mark the views that read the low-frequency model from lfm.js, and the one that calls the wavelet scale from inversionQc.js.
