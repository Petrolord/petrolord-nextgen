# What the Professional tier adds

The Associate tier asked whether the seismic can see the fluid, and answered from logs and one modelled interface: the cap rock over the oil leg at the top of the Ekene Sand. This tier takes the same question onto the seismic itself. Each well is tied to the trace recorded at it, one wavelet is chosen for the field, the gathers are checked, every offset is given an angle from the velocity, the angle stacks are fitted for intercept and gradient, and the modelled and seismic AVO are compared at every well.

## The engine files the tier calls

| engine file | functions the tier calls | what for |
| --- | --- | --- |
| engines/seismolord/synthetics.js | `computeImpedance`, `resampleToDt`, `reflectivity`, `convolveSame`, `extractStatisticalWavelet`, `suggestBulkShift` | the synthetic, the statistical wavelet and the bulk shift |
| engines/seismolord/tieWarp.js | `estimatePhaseRotation`, `rotateConstantPhase`, `makeTieWarp` | phase and anchors |
| engines/qi/wavelets.js | `compareWavelets`, `resampleWavelet`, `normaliseWavelet` | one wavelet for the field |
| engines/qi/prestack.js | `binOffsets`, `dixInterval`, `velocityOnGrid`, `waldenAngle`, `rayTraceAngle`, `angleGather`, `partialStack`, `usableAngle` | gathers, angles and angle stacks |
| engines/qi/prestackQc.js | `nmoStretch`, `stretchMuteOffset`, `residualMoveout`, `foldSummary` | gather QC |
| engines/qi/avo.js | `fitShuey`, `contrastsFromAB`, `backgroundTrend`, `offTrend`, `chiProjection`, `avoClass` | AVO on the seismic |
| engines/seismolord/wellWavelet.js | `extractWellWavelet` | the wavelet from the well |
| engines/qi/avoWells.js | `compareAtWells` | AVO at the wells and the one scale |

## Three pieces of bookkeeping, and nothing else

Around the engines the course does exactly three things of its own. It turns checkshots into a time-depth line, with two-way time equal to 2 x the one-way time and linear between checkshot levels. It keeps a trace clock, with sample i at the first sample's time plus i times the sample interval. And it times an event on a trace as the sample of the largest amplitude within 8 ms of a stated time. Every other figure in this tier is the return value of a named function.

## Units

Depth is in feet, as at Associate. Offsets are in metres, as the kit's gathers record them. Times are two-way, in milliseconds, and velocities are in m/s. Seismic amplitudes stay in the kit's own trace units, which carry no physical scale, so a reflection coefficient and a seismic amplitude are compared only through a scale, which the last module measures over every well.

## What carries over

The kit's seismic is SEG normal polarity, and the Ekene Sand is harder than the Ogbia Shale above it at Ekene-1, so its top is a peak. The selections stay stated: net sand at Vsh at or below 0.350000, the oil leg above the contact at 5118.110236 ft, and the cap rock as the 65 ft of log above the top. They return in the last module as the modelled side.

## The data this tier reads

| part | size |
| --- | --- |
| full, near, mid and far stack traces at Ekene-1 to Ekene-4 | 900 to 1700 ms |
| NMO-corrected CDP gathers next to Ekene-1 | 12 CDPs, 13 offsets |
| checkshots and the RMS velocity table | 4 wells |

## The two questions, at this tier

Is the data good enough becomes a set of measured figures: how well each synthetic correlates with its trace, how alike the four wavelets are, how flat the gathers lie and how much fold each angle has. Can the seismic see the fluid becomes intercept and gradient read off the seismic and set against the model at every well.

Every exercise runs in the prestack explorer, on the engine files QI Studio calls.

{{panel:qi-prestack-explorer}}

## Exercise

Open the prestack explorer with Data set to "Ekene teaching pack". Step through the eight entries of View, from "Wavelets and phase" to "AVO at the wells". For each view, write down which engine file from the table above it calls, which part of the pack it reads, and which stated choices it shows as controls. Then set Data to "Paste a case file" and note which views a case can feed.
