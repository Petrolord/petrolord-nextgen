# Refining the step

Every other route in this course evaluates a closed form. This one integrates, which means it has a step size, which means the step size is part of the answer. A reader is entitled to know what it is worth, and the way to find out is to halve it and watch.

{{panel:fc-blowdown-explorer}}

## The study

| time step s (stated) | time s | final temperature degR | steps | substeps | time against the finest, ratio |
| --- | --- | --- | --- | --- | --- |
| 0.800000 | 268.420990 | 340.807983 | 336 | 0 | 1.000007510303 |
| 0.400000 | 268.419373 | 340.807983 | 672 | 0 | 1.000001488532 |
| 0.200000 | 268.419078 | 340.807983 | 1343 | 0 | 1.000000389388 |
| 0.100000 | 268.419002 | 340.807983 | 2685 | 0 | 1.000000103923 |
| 0.050000 | 268.418981 | 340.807983 | 5369 | 0 | 1.000000027016 |
| 0.025000 | 268.418975 | 340.807983 | 10737 | 0 | 1.000000004994 |
| 0.012500 | 268.418974 | 340.807983 | 21474 | 0 | 1.000000000000 |

The step is halved seven times over a contiguous sequence. That contiguity is part of the method: a convergence table with a gap in it invites the reader to assume the behaviour across the gap, and assuming behaviour is the thing a convergence table exists to stop.

## What the last column says

Each row's last entry is that row's time over the time at the finest step. The lab computes one such ratio per row and computes nothing between rows, so any statement about how the column behaves is a reading you take rather than a figure you were handed.

Take the reading deliberately. Across the whole sixty-four-fold refinement the time moves by 0.002015907907 s, which is 0.000007510303 of the time at the finest step. A time prints to six decimals, and that movement is 4031.815814 times half a unit in the sixth decimal, so the step shows in the printed figure. At the stated step of 0.100000 s the time sits 0.000027894862 s above the finest-step time. A time quoted to six decimals carries its step with it, and the step is stated beside the answer.

## What that does and does not establish

It establishes that the march has converged in its own terms: the row at the default step reads 1.000000103923 against the finest.

It establishes nothing about whether the balance being marched is the right balance. A march converging beautifully to a wrong answer is a thing numerical methods do very well, and the check for that is elsewhere: the closed-form comparison in the first module, where the same balance is integrated exactly and the ratio column reads one.

The two checks answer different questions and you need both. Convergence tells you whether you have walked far enough down one road. The closed form tells you whether it is the road you meant to be on.

## Reading the other columns

The step count roughly doubles as the step halves, which is what a fixed step size on a fixed march means. The substep column is zero on every row, so nothing in this study needed subdividing. The final temperature reads 340.807983 degR on all seven rows, because the end state is fixed by the pressure ratio and the exponent and the step has no say in it.

That last column is the one worth pausing on. A quantity that does not move under refinement has not been validated by the refinement. It has simply been left alone by it, and a reader who reports the study as evidence for the temperature has reported the wrong thing.

## Exercise

Record the time and the ratio at step sizes of 0.800000, 0.100000 and 0.012500 s, and the total movement across the refinement. Say why the sequence is contiguous. Then write two sentences distinguishing what this study establishes from what the closed-form comparison establishes, and one sentence on what the constant final temperature column does and does not tell you.
