# Limits from the moving range

{{panel:dq-monitor-explorer}}

The individuals chart draws a centre line and two limits at the centre plus and minus 3 sigma, with sigma = MRbar / 1.128. On NIST/SEMATECH's 6.3.2.2 flow rate example the engine reads a centre of 50.810000, an upper limit of 55.804090 and a lower limit of 45.815910, and NIST prints 50.81, 55.8041 and 45.8159. On EKENE-3's 50 in-control days the same arithmetic gives a centre of 611.380000 psig and limits of 600.057812 and 622.702188 psig, and phase one itself raises 0 flags.

| figure | NIST 6.3.2.2, engine | NIST printed | EKENE-3 phase one |
| --- | --- | --- | --- |
| centre | 50.810000 | 50.81 | 611.380000 |
| mrBar | 1.877778 | 1.8778 | 4.257143 |
| upper limit | 55.804090 | 55.8041 | 622.702188 |
| lower limit | 45.815910 | 45.8159 | 600.057812 |
| flags | 0 | | 0 |

## Three sigma, and which sigma

The multiplier is 3, and the engine applies it to one named sigma: MRbar / 1.128 from the data the limits are drawn on, 3.774063 psi on EKENE-3's phase one. The distance from the centre to either limit is three of those. A reader who recomputes the limits with the sample standard deviation of the same fifty days, 3.862060 psi, will draw a different pair of lines, and the difference is a difference of source rather than an error in either. The course rule is that a sigma names its source, so a note on this chart writes MRbar / 1.128 beside the figure.

## A limit is a statement about the past

The limits describe how EKENE-3's pressure behaved on 50 days chosen as in control. They say nothing about what the pressure should be for the well's operation, and nothing about what a wellhead gauge can plausibly read. A control limit is never a specification and never a plausibility range. A reading above 622.702188 psig says the process is behaving differently from phase one; whether that harms the operation is a question the chart cannot answer.

## Strictly outside

A point signals when it lies strictly outside its limits. A reading exactly on 622.702188 would sit inside the band and raise nothing. This is the same boundary rule the engine uses for every flag in the course: strictly beyond. NIST's data and EKENE-3's phase one each raise 0 flags.

## Why the flags on phase one matter

A phase one that raised a flag would be telling you that the days chosen as history were not all in control. The limits drawn from them would then carry the disturbance inside them. Reading 0 flags on phase one is the first check a monitoring plan makes before it trusts a centre and a sigma, and a plan that finds a flag there investigates it before it charts phase two.

## Two rules the engine reports separately

Each signal carries its rule. A point above the upper limit is `individuals-above-ucl` and one below the lower limit is `individuals-below-lcl`. The moving range chart, the next lesson, adds a third rule of its own. The rule names are what a monitoring note quotes, together with the day and the value.

## Exercise

In the panel's individuals view, read the phase one tiles and confirm the upper limit of 622.702188. Then work it by hand: multiply 3 by the sigma tile, 3.774063, add the product to the centre, 611.380000, and compare. Do the same for the lower limit. Finally, lower one phase one day far enough that phase one raises a flag, and write one sentence on what that flag would oblige you to do before charting phase two.
