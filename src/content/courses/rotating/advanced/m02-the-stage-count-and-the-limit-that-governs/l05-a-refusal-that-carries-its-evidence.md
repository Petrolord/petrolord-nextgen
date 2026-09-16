# A refusal that carries its evidence

A refusal that says only "it cannot be done" sends a reader back to the inputs with nothing to go on. The stage-count refusal carries the measurements it made, and those measurements are what turn it into a diagnosis.

{{panel:fc-compressor-explorer}}

## What comes back besides the sentence

The return that gives up at the cap is an object, and alongside its error string it carries four numbers. The stage counts tried: 12. The coolest discharge those twelve equal stages could reach: 317.9889 degF. The limit it was measured against: 110.0000 degF. The inlet it was measured from: 100.0000 degF. It also carries the overall ratio it was working on, 1000.000000000.

Those are not decoration. Each one answers a question a reader would otherwise have to re-run the engine to answer.

## The gap is the diagnosis

The coolest reachable discharge is 317.9889 degF and the stated limit is 110.0000 degF, which leaves a gap of 207.9889 degF. That single subtraction is what tells a reader which input is at fault.

A gap of a few degrees would say the design is nearly there and that a colder cooler or a slightly higher limit closes it. A gap of 207.9889 degF says nothing of the sort. No amount of intercooling closes it, because the inlet is already at 100.0000 degF, the limit sits barely above that inlet, and the duty is asking for an overall ratio of 1000.000000000. The fault is the limit or the pressure, and the cooling is not where the answer is.

Without the gap, the honest reading of the refusal is "try more stages", and the reader would spend an afternoon on the one lever that provably does not work.

## Why the inlet is on the return too

The limit and the inlet are both reported because the two together say how much room the duty ever had. Here the limit of 110.0000 degF sits barely above the inlet of 100.0000 degF, and almost no compression fits in the space between them. Reporting the limit on its own would leave a reader wondering whether the inlet was the problem.

The count tried is there for the same reason. It says the search ran to its bound rather than stopping early on some other condition, so a reader knows this refusal came from the cap and not from one of the guards ahead of it.

## One sentence used to answer several questions

That message once stood in for four unrelated faults as well as this one. Each of those four now has its own refusal naming its own input, which is the difference between being told something is wrong and being told what is wrong.

## The mistake

The mistake is catching the error string and discarding the rest of the object. The string is the headline and the numbers are the evidence, and a user interface that shows only the first has thrown away the part that shortens the fix.

## Exercise

List the four measurements the stage-count refusal carries beside its message and give each one for the probe that reaches the cap. Work out the gap between the coolest reachable discharge and the stated limit, and say what a gap that size tells a reader about which input is at fault.
