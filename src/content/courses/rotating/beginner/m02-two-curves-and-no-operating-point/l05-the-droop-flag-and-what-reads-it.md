# The droop flag, and what reads it

A centrifugal head curve falls as the flow rises. The engine has a word for that behaviour and a field for it. The field is called droops, it is a boolean, and it is the part of the fit that the rest of the module actually reads.

{{panel:fc-pump-explorer}}

## A curve that goes the wrong way

Take three readings that climb with flow: 0.000000 gpm at 120.000000 ft, 450.000000 gpm at 176.000000 ft, and 950.000000 gpm at 288.000000 ft. Fit them and the engine returns c2 = 94.577778, an R squared of 1.000000000, and a droops flag of false.

It also returns a warning in prose: "the fitted curve does not fall with flow: check the points, because a centrifugal head curve must droop".

The coefficient is the giveaway. A drooping curve has a negative c2, and OKONO's is -291.101770. This one is positive at 94.577778, so the parabola opens upward and the head climbs away with flow. Nothing about that describes a centrifugal machine.

## The same statement, twice

Look at what the engine did there. It said the same thing in two forms: a sentence for a person, and a boolean for a caller.

Both are necessary and neither replaces the other. A warning string can be shown on a screen and it can carry the advice to check the points, and it cannot be tested. A boolean can be tested by the next function in the chain, and it cannot explain itself. Writing one without the other leaves either a machine that cannot act on the finding or a human who cannot understand it.

## Where the flag is read

The flag is read by the duty solve. Asking for the crossing of a rising curve with a system curve returns a refusal rather than a flow, and the refusal exists because droops came back false. That is the next module, and it is worth arriving there knowing that the check was made here.

This is what a flag is for. The fit does not refuse the rising points, because fitting them is a perfectly well defined arithmetic operation and it succeeded. It records what it found and hands the decision to the function whose question the finding actually invalidates.

## Zero does not count

The three-identical-heads set of the last lesson comes back with c2 = 0.000000 and droops false. A flat curve does not fall, so the flag is false. The test is strict about that, and it should be: a pump whose head does not change with flow crosses a system curve in a way that is no more meaningful than a rising one.

## The mistake

Reading only the prose warning and ignoring the flag, or reading only the flag and losing the advice in the prose. They are two halves of one statement and both halves are in the return.

## Exercise

Give c2 for the rising set and for OKONO, and say which sign a drooping curve has. Then say what the droops flag comes back as for three identical heads, and name the function further down the module that reads the flag.
