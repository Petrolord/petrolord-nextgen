# Coverage of an interval

{{panel:dq-checks-explorer}}

Completeness counts samples. Often the question you actually have is about depth or time: how much of this interval do I have data for? `coverage` answers it. It takes an index, the values on it, the start and end of an interval, and a `maxStep`, and returns the fraction of the interval spanned by steps no longer than `maxStep`, with the holes listed by their ends. Here it is on EKENE-7 over the interval 8400 to 8515 ft, a stated interval, with the gamma ray's sentinel converted to null.

| channel | maxStep, ft | coverage | covered ft | holes (from, to) |
| --- | --- | --- | --- | --- |
| RHOB | 0.500000 | 0.934783 | 107.500000 | 8439.500000 to 8446.000000; 8474.500000 to 8475.500000 |
| NPHI | 0.500000 | 0.965217 | 111.000000 | 8412.000000 to 8413.000000; 8458.500000 to 8459.500000; 8474.500000 to 8475.500000; 8502.500000 to 8503.500000 |
| NPHI | 1.000000 | 1.000000 | 115.000000 |  |

## The rule, in one sentence

A step between two consecutive present samples covers the index between them when it is at most `maxStep`, inclusive; a longer step is a hole. The stretch before the first present sample and after the last is uncovered. Missing values matter only because they lengthen the step between the present samples on either side of them.

## Reading the density

The density's long hole runs from 8439.500000 to 8446.000000 ft. Those two depths are the last present sample before the pad lift and the first present sample after it. The twelve missing samples sit between them, and the step across them is far longer than half a foot, so the whole stretch is a hole. The density's second hole, 8474.500000 to 8475.500000 ft, has nothing to do with missing values; the next lesson explains it.

## Reading the neutron

At a half-foot `maxStep` the neutron has four holes. Three of them surround its three single missing samples, each running from one present neighbour to the next. The fourth is the same 8474.500000 to 8475.500000 ft hole the density has. Raise `maxStep` to 1.000000 ft and every one of those steps now covers: coverage reads 1.000000 and there are no holes.

## maxStep is your statement

That jump from 0.965217 to 1.000000 did not change a single sample. `maxStep` is the caller's statement of the longest step that still counts as data. A step equal to `maxStep` covers: an index 0, 1, 2 with every value present and `maxStep` 1 reads coverage 1.000000. The engine fires strictly beyond a limit, so a step on the limit is inside; module three meets the declared exception, a minimum marked exclusive.

Choose `maxStep` from the question: the logging step if you need every sample, something longer if a single dropout does no harm. A coverage quoted without its `maxStep` cannot be checked or compared.

## Coverage and completeness side by side

Completeness is a count of samples and knows nothing of depth. Coverage is a length over a length and knows nothing of how many samples filled it. A channel can lose samples without losing coverage, as the neutron did at a one-foot `maxStep`.

## Exercise

Open the checks explorer on the view for completeness and coverage. The default values are a stretch of EKENE-7 density across its gap, with its depths, an interval from the first depth to the last, and a `maxStep` of 0.500000. Read the coverage tile and the hole table, and find the hole from 8439.500000 to 8446.000000 ft. Now set `maxStep` to 1.000000 and read the table again. Explain why this hole survives the change when the neutron's single-sample holes did not.
