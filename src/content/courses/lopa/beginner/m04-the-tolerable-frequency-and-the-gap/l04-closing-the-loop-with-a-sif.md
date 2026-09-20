# Closing the loop with a proposed SIF

{{panel:lp-worksheet}}

The row is open until a function is proposed. Up to that point the engine has said how much reduction is missing and stopped. Typing a proposed function's PFDavg closes the loop: the engine applies it to the mitigated frequency, produces the frequency the row would run at with the function in place, and reports whether that frequency meets the tolerance.

## The proposed PFDavg is a stated number here

At Associate the proposed function arrives as a figure someone has stated. It is a probability, above zero and no more than one, and it enters the row exactly as an IPL PFD does, as one more factor in the product. Where that figure comes from, out of failure rates, an architecture and a proof test interval, is the verification half of the engine and the next tier's work.

## Four proposals against the same row

ORONI at a tolerable frequency of 1e-7 per year requires SIL2 and a required PFDavg of 0.007407407407.

| proposed SIF PFDavg, stated | its own SIL band | mitigated frequency with the SIF, per year | meets the TMEL |
| --- | --- | --- | --- |
| 0.02 | 1 | 0.000000270000 | false |
| 0.009 | 2 | 0.000000121500 | false |
| 0.005 | 2 | 0.000000067500 | true |
| 0.0005 | 3 | 0.000000006750 | true |

Each mitigated frequency is the row's frequency without a function multiplied by the proposed PFDavg. The function at 0.005 brings the row to 0.000000067500 per year, which is inside the tolerance of 1e-7, and `meetsTmel` comes back true. The function at 0.0005 brings it to 0.000000006750 per year, comfortably inside, and a plant may well find that easier to buy than to justify.

## What happens with no function proposed

Without a proposed SIF the engine reports `meetsTmel` as false for ORONI at its own tolerable frequency, because the outcome is not NO_SIF_REQUIRED. The loop is closed only by typing a function's PFDavg. This is worth knowing when reading a worksheet, because a false there means the row is unfinished as often as it means the row fails.

Where the outcome is NO_SIF_REQUIRED the row is already closed by its existing layers, and no proposed function is needed for the engine to say so.

## Reading the result back into the specification

Three things go into the record together: the required PFDavg the row demands, the proposed function's PFDavg, and the resulting frequency with that function in place. A reader can then check the arithmetic without rerunning anything, and can see how much margin the choice holds. The margin matters, because a function's achieved PFDavg moves with its proof test interval and its restoration times, and a proposal that only just meets the target has nothing left to give when the interval slips.

## Exercise

Take the mitigated frequency without a function, 0.000013500000 per year, and multiply it by each of the four proposed PFDavg figures above. Check your four results against the table. Then state the largest PFDavg that would still meet a tolerance of 1e-7 per year on this row, and say how you would know whether a real function could hold it.
