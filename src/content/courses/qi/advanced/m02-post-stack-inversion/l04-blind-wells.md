# Blind wells

An inversion scored at a well that built its own low-frequency model is partly scoring itself. The blind well removes that: each well is inverted with an LFM built from the other wells and scored against its own log. On the Ekene pack the model-based inversion follows the shape of AI (acoustic impedance) at every well, and the LFM alone still has the lower RMS error at every well.

## The check

Each well is inverted with the LFM from the other three, then scored against its own log after the 50 Hz high cut. `blindWellScore` returns two figures over the samples where both exist: the correlation of AI with the log's AI, and the RMS of the relative AI error in percent. Beside it the course sets the same well kept in its LFM, and the LFM alone, so the share of the match that comes from the LFM is visible. The rule is the one QI Studio's blind-well table uses.

`blindWellScore` and the LFM between wells both come from lfm.js, which awaits its independent oracle in the engines repository. The course teaches every figure below and grades none of them until that oracle lands.

## Model-based

With eps 0.050000 and 60 iterations:

| well | blind correlation | blind AI error percent | samples | kept-in correlation | kept-in AI error percent | LFM-only correlation | LFM-only AI error percent |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ekene-1 | 0.852881 | 10.557858 | 27 | 0.858647 | 10.805677 | -0.190352 | 8.638086 |
| Ekene-2 | 0.889320 | 13.513999 | 27 | 0.889063 | 15.516228 | -0.248169 | 10.450743 |
| Ekene-3 | 0.847503 | 11.484291 | 27 | 0.847813 | 10.340948 | -0.230889 | 8.512597 |
| Ekene-4 | 0.759365 | 13.511984 | 26 | 0.758561 | 13.760737 | -0.345505 | 10.307658 |

## Sparse-spike, blind

| well | blind correlation | blind AI error percent |
| --- | --- | --- |
| Ekene-1 | 0.873414 | 8.356661 |
| Ekene-2 | 0.881157 | 11.090545 |
| Ekene-3 | 0.821455 | 9.718054 |
| Ekene-4 | 0.778867 | 10.144841 |

## Reading the columns together

The LFM alone carries the level. Its correlation is negative at every well: it has none of the shape. Its RMS error is lower than the model-based inversion's at every well, blind or kept in.

The inversions carry the shape, with blind correlations from about 0.76 to 0.89. They pay for it with a larger RMS error. Sparse-spike sits between: its error is below the LFM-alone figure at Ekene-1 and Ekene-4, and above it at Ekene-2 and Ekene-3.

Keeping the well in its own LFM changes little. The kept-in correlations sit beside the blind ones at every well, and the kept-in error is larger than the blind error at three of the four wells. A well's own log inside its LFM is no guarantee of a closer match, as the LFM lesson found at Ekene-2.

## What a study quotes

Both figures, for every well, with the LFM-alone row beside them. A correlation alone hides the error in level; an RMS error alone rewards the flat LFM. A study that quotes only the correlation oversells its inversion, and one that quotes only the error undersells it. The blind figure is the nearest guide to how the inversion behaves between the wells.

Four wells is a small sample. The blind scores say how the inversion behaved at four places on 27 samples or fewer each, and nothing stronger.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Blind wells", Data to "Ekene teaching pack", Method to model-based, "Regularisation weight eps" to 0.050000, "Iterations" to 60 and the high cut of the log at 50 Hz. Read the blind, kept-in and LFM-only columns for all four wells. Switch Method to sparse-spike and read the blind columns again. Write one sentence for a report that states, for one well of your choice, what the inversion adds to the LFM and what it costs.
