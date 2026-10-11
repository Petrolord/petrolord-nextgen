# What the engines do not compute

Each engine this tier calls takes plain numbers and arrays and returns numbers. Everything else a study needs is an input the interpreter supplies and states, and a report that names an engine as the source of an input has misread it. The list below is checked against the functions this tier calls.

## The inputs the engines never make

| what the engines do not compute | where it comes from |
| --- | --- |
| a wavelet inside an inversion | a stated input: the Ekene setting is a zero-phase Ricker of 25 Hz, half length 40 ms |
| a low-frequency model inside modelBased or simultaneousInversion | a stated input, m0, built beforehand, with an 8 Hz cut on Ekene |
| a picked horizon | the interpreter's picks |
| a gridded surface | a stated grid: closure reads 25 by 20 nodes every 328.083990 ft on Ekene |
| a fluid from a class name | the interpreter's hypothesis |
| the geological chance | the risk team |
| a volume in barrels | outside QI: closure returns gross rock volume only |

The engines also hold no Ekene figure: every condition, cut-off, window, angle and contact is a stated input. They do not pick the samples, so net sand, the legs and the cap rock are stated selections. They do not decide whether a study goes ahead or which prospect matures; the interpreter writes the verdict from the numbers.

## Why each one matters

An inversion that estimated its own wavelet would hide a choice inside the result; here the wavelet and its scale are in the report. A low-frequency model built inside the inversion would hide where the level comes from; the blind wells showed the LFM alone carries the level and the inversion the shape, and that reading needs the two kept apart. A grid that closure built itself would hide the gridding; the Ekene grid spills at its own mapped edge, and that limit is visible because the grid is a stated input. The low-frequency model between wells reads its horizons as given, with a stated inverse distance power, 2 on Ekene, so a mispicked horizon shows up as an input a reviewer can check. A fluid read from a class name would turn a fluid hypothesis into a fact.

## The references behind this tier

The methods are named with their authors and years, and the course teaches each by concept and equation in its own words. Bayesian facies follow Avseth and others (2005), chapter 4; the quantiles across realisations follow Hyndman and Fan, type 7; the simultaneous inversion uses the linearisation of Fatti and others (1994). The Rock Physics course teaches Gassmann, Shuey and the classes in full.

## The gate behind each engine

Most engines this tier calls carry a golden and an independent oracle in the engines repository. Two await theirs: lfm.js, the low-frequency model between wells and the blind-well score, and prospectAssessment.js, anomaly conformance, the evidence count and the assessment. Both are taught, and graded only once their oracle lands. Two Expert steps the course describes are QI Studio app code, the left-out porosity calibration, which calls the gated propertyPrediction.js, and the per-angle wavelet extraction, and a report names them as app code.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, list every input the properties view and the prospect view ask for on the Ekene pack. For each, write where the figure came from: a stated setting, a stated selection, a stated grid or an earlier engine's output. Then choose one input, change it, and record which returned figures move.
