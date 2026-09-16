# Onward

The duty is staged, the train is built and the driver is fuelled, which leaves a set of figures waiting on a literature check and a set of questions these engines do not answer at all.

## Eight things held for literature

| held item | what is unchecked |
| --- | --- |
| the Hydraulic Institute viscosity correction | empirical and unsourced here, and its head factor is taken equal to its flow factor at best efficiency |
| the impeller trim shortfall model | the engine calls it a published shortfall and names no publication |
| the operating region bands at 50, 70, 120 and 140 percent | customary |
| the NPSH margin rule, the larger of 3 ft and 35 percent | both halves are measurable, the rule itself is not sourced |
| the machine screening thresholds | customary |
| the 300 degF default discharge limit | customary, and it is what the engine uses when a caller states none |
| the implied water density against real water | the packagings are measurable, the handbook figure is not here |
| every published golden case | each was written by an oracle |

The trim is the load-bearing one. Because that model has no publication behind it, the trim's power leg is left as the ideal cube and the efficiency the return implies is computed and reported rather than invented as a second unsourced model. The affinity speed band sits on the same footing, as a sanity bound.

Each of those is used, each is printed, and none decides a graded answer anywhere in this course. Held does not mean wrong and it does not mean ignore. It means the figure is recorded, the gap in its provenance is stated with it, and no conclusion is allowed to rest on it until somebody reads a source against it.

## What a golden is worth

Two published stage fields come back bit for bit and three do not, and the worst gap is 1.522776943887805e-11, because the file was written by an oracle carrying fifty digits and the engine is double precision.

So a gate against a golden has to carry a tolerance chosen from the size of the disagreement the two routes really have. Demanding equality would fail on arithmetic. A tolerance loose enough to swallow a mis-transcribed constant catches nothing, so the useful question about any tolerance is what error it is still small enough to see.

## Four things that are not here

There is no compressor surge line, no surge margin, no recycle valve and no anti-surge control anywhere in the package. There is no seal and no bearing calculation. There is no machine curve, no wheel selection, no valve dynamics and no rod loading. And there is no required-NPSH-against-flow curve, which is why the vendor curve has to be read at the duty flow before a suction margin means anything.

Those are seams. Naming one is more useful than producing a number from a correlation the package does not have. A surge margin quoted from memory in a report reads exactly like a computed one, and nothing downstream will ever ask which it was.

## What this course does answer

The duty a vendor should be quoting against, the power and the stage count to expect, the suction margin a selection has to survive, and the reasons behind all four.

## Exercise

List the eight held items and say what makes each one held. Name the four things absent from these engines, and explain why a gate against a golden needs a tolerance and how that tolerance should be chosen.
