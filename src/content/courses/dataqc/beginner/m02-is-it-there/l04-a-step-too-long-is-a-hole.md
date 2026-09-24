# A step too long is a hole

{{panel:dq-checks-explorer}}

Once its sentinel is converted to null, EKENE-7's gamma ray has no missing value anywhere inside the interval 8400 to 8515 ft. Every sample on the index is present. Yet at a half-foot `maxStep` its coverage is not 1.000000.

| channel | maxStep, ft | coverage | covered ft | holes (from, to) |
| --- | --- | --- | --- | --- |
| GR | 0.500000 | 0.991304 | 114.000000 | 8474.500000 to 8475.500000 |
| GR | 1.000000 | 1.000000 | 115.000000 |  |

The hole's reason, verbatim: "no data from 8474.5 to 8475.5".

## Where the hole comes from

Nothing is missing, so the hole must come from the index itself. The EKENE-7 log is stepped at 0.500000 ft, and one sample is missing from the index after entry 149: the depth column jumps from 8474.500000 to 8475.500000 ft with no row between them. There is no null to find because there is no row to hold one. Completeness, which counts the entries it is given, cannot see this. Coverage can, because it measures the steps between present samples, and this step is longer than half a foot.

This is why the density and the neutron in the previous lesson had the same hole at the same depths. The index is shared by every channel, so a sample missing from the index is missing from all five channels at once.

## One step, two readings

At a one-foot `maxStep` the same step covers, and the gamma ray reads 1.000000 with 115.000000 ft covered. Which reading is right depends on what you meant by `maxStep`. If you stated half a foot because that is the logging step, the half-foot reading tells you the truth about this file: one sample the tool should have recorded is not there. The one-foot reading tells you the gap is short enough to bridge if your question can tolerate it. The caller states which one the report uses.

## Coverage needs a clean index

Coverage walks the index from one present sample to the next, so it needs the index to increase strictly. Hand it the EKENE-7 splice index, where two logging runs meet and the depth steps back onto a depth already logged, and it refuses:

> index[5] must be strictly increasing: sort and de-duplicate the index first (indexCheck finds the offenders)

The field is `index[5]`, the first entry that breaks the rule, counted from 0. The message also names the function that will find every offender, which is the subject of module four. Coverage will not sort it for you: sorting would quietly decide which of two readings at the same depth to keep, and that is the caller's decision.

## The order of work

Put together, module two gives an order to work in. Count what is missing with `completeness` and read its gap runs. Check the index before trusting any measure of depth. Then measure `coverage` over the interval you care about, at a `maxStep` you state and can defend.

## Exercise

Open the checks explorer on the view for completeness and coverage. Replace the values box with any two present values and the index box with the depths 8474.500000 and 8475.500000. Set the interval to run from the first depth to the second, and `maxStep` to 0.500000. Read the coverage tile and the hole table, and copy the hole's ends. Then set `maxStep` to 1.000000 and explain the change in one sentence. Finally, switch to the index view, which opens on the EKENE-7 splice index, and note which entry the index check flags first.
