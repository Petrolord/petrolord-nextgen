# Converting the feet well

One of the six teaching files, feet_20, exists to make you do a full depth conversion once, by hand, before you ever trust software to do it. The file is a clean LAS 2.0 export in every respect except its units, so the conversion is the whole exercise.

## The file as it arrives

The header declares STRT 4900 F, STOP 5200 F, STEP 2 F, and the depth curve is `DEPT.F`. Before converting anything, confirm the sample count is consistent with the header. A regular grid from 4900 to 5200 ft at 2 ft spacing holds

$$\frac{5200 - 4900}{2} + 1 = \frac{300}{2} + 1 = 151$$

samples, the plus one because both ends are included. The parser reports 151 depth samples, so header and data agree. That check costs seconds and catches truncated files immediately.

## The conversion, step by step

Multiply each depth quantity by the exact factor 0.3048:

1. Start: 4900 x 0.3048 = 1493.52 m.
2. Stop: 5200 x 0.3048 = 1584.96 m.
3. Step: 2 x 0.3048 = 0.6096 m.

So the well spans 1493.52 to 1584.96 m at a 0.6096 m step. The converted step is one of the six numbers the Associate capstone grades, with a tolerance of 0.001 m, and now you can produce it with nothing but the header and a calculator. As a closure check, the converted range should still hold 151 samples: (1584.96 - 1493.52) / 0.6096 + 1 = 91.44 / 0.6096 + 1 = 150 + 1 = 151. It does.

Remember from the previous lesson that depth is not the only converted curve in this file. The sonic arrives as US/F and becomes US/M by dividing by 0.3048, which is why the import summary for feet_20 reports two curves converted, not one.

## Do not round the step

The converted step 0.6096 m is not a round number, and the honest thing to do is leave it alone. The temptation is to call it 0.6 m because the difference looks negligible. It is not negligible, because step errors accumulate. Rounding to 0.6 m shortens every increment by 0.0096 m, and over the 150 increments of this well the bottom of the grid lands

$$0.0096 \times 150 = 1.44\ \text{m}$$

shallow of where the data actually is. A 1.44 m depth error is larger than the logging step itself, enough to smear a thin bed across the wrong samples, misplace a formation top, and quietly corrupt any thickness computed from sample counts. All of it bought by a cosmetic rounding.

The rule generalises: converted grids are ugly and correct, and downstream tools must cope with ugly steps rather than beautify them. When a workflow genuinely needs a round step, that is a resampling decision, made explicitly and recorded, never a rounding slipped in at import.

## What the pipeline records

When the professional import pipeline runs this file, it reports start 1493.52 m, stop 1584.96 m, step 0.6096 m, and two converted curves, exactly the numbers you just produced by hand. It also stores, on each converted curve, the source unit and the factor used, so the conversion is auditable forever. Nothing about the conversion is clever; what matters is that it is exact, complete across all curves, and visible.

One numerical footnote worth knowing: log samples are stored as 32-bit floats, and a converted depth like 4902 x 0.3048 cannot always be represented exactly at that precision. The stored increments can therefore jitter by a hair around 0.6096. The step checker you will meet in the next lesson tolerates that float-level jitter deliberately, while still rejecting genuinely irregular files. Exactness lives in the conversion rule; storage adds a whisper of noise that good tooling accounts for.

Try it yourself: the panel below runs the real parser over the teaching files.

{{panel:wd-las-inspector}}

## Exercise

A LAS file declares STRT 8200 F, STOP 8500 F, STEP 1 F. Work through the full conversion. Sample count first: (8500 - 8200)/1 + 1 = 301. Converted start: 8200 x 0.3048 = 2499.36 m. Converted stop: 8500 x 0.3048 = 2590.8 m. Converted step: 1 x 0.3048 = 0.3048 m. Then compute the depth error at the bottom of the well if someone rounded the step to 0.3 m: 0.0048 x 300 = 1.44 m shallow. State in one sentence why the error is the same 1.44 m as the worked example despite the different step.
