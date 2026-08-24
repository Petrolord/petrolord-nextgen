# Sanity checks

A broken pressure frame does not announce itself. It comes out of the same code as a sound one, it plots as smooth curves, and it carries as many decimal places. The only defence is a fixed set of checks, run in the same order every time, before anyone is allowed to build on the frame.

Six checks catch nearly everything that goes wrong at this tier. Run them on the golden well now, so that the pattern is familiar when you run them on a well whose answer you do not already know.

## Check 1: hydrostatic and overburden are equal at the mudline

The two pressure curves must start at the same value at depth 0.

On this well both read 1.005182 MPa at the mudline. That is the 100 m seawater column and nothing else, because above the seabed the fluid column and the total weight overhead are the same column of 1025 kg/m3 water.

This check fails in two directions and both are common. If the overburden starts at zero and the hydrostatic starts at 1.005182 MPa, the overburden integration forgot the water. If the hydrostatic starts at zero, it forgot the water too. A frame whose two curves do not meet at the mudline is broken before it starts.

## Check 2: overburden sits above hydrostatic everywhere below the mudline

Below the seabed, rock is denser than the fluid in it, so the total weight overhead must exceed the weight of a fluid column of the same height. At every depth below 0 the overburden must be the larger number.

At 1000 m the pair is 21.100398 MPa against 11.106031 MPa. At 4000 m it is 91.123067 MPa against 41.408580 MPa, more than twice the hydrostatic. The separation widens with depth because the density contrast between rock and pore fluid keeps accumulating.

A crossing anywhere is fatal. It says the sediment column is lighter than the water in it, which is not a rock. In practice a crossing means a units error or a density curve read in g/cc while the engine expected kg/m3.

## Check 3: both curves increase monotonically with depth

Read each pressure column top to bottom and confirm every value is larger than the one above it. Hydrostatic goes 1.005182, 6.055606, 11.106031, 21.206881, 26.257305, 31.307730, 36.358155, 41.408580 MPa. Overburden goes 1.005182, 10.716908, 21.100398, 43.321164, 54.952589, 66.831143, 78.902159, 91.123067 MPa. Both climb without exception.

A dip in either curve is not a geological feature. It is a depth array out of order, a duplicated sample, or a null in the density log that entered the integration as a zero. Find it before you plot anything else.

## Check 4: the fitted trend passes through the picks

A least-squares trend is only trustworthy if it actually honours the points it was fitted to. Compare the fitted trend against the shale picks at the depths they share.

| z (m) | pick dt (us/m) | fitted trend (us/m) |
|---|---|---|
|  500 | 523.0158785790468 | 523.015879 |
| 2000 | 326.0366944948908 | 326.036694 |
| 3500 | 257.1062421947293 | 257.106242 |

The fit reproduces the picks to every digit they carry. That is what a well conditioned exponential fit looks like.

If the trend misses the picks by tens of us/m, the fit did not converge, or the matrix transit time handed to it was not the 220 us/m the picks were drawn against, or the depths and the transit times went in paired the wrong way round.

## Check 5: the fitted parameters are physically sensible

A fit will return numbers whatever you feed it, so read the numbers before you trust them.

The fit on this well returns a mudline transit time of 650.0000000000014 us/m and a compaction constant of 0.7000000000000015 per km. Both are sensible. The mudline transit time sits well above the matrix value of 220 us/m, which is what an uncompacted near seabed mud should do, and it is nowhere near the matrix, which would mean the fit thinks the seabed is solid quartz. The compaction constant is positive, so the trend decays with depth rather than growing, and it is of order one per km, which is the band real clastic sections fall in.

A negative compaction constant, a mudline transit time below the matrix value, or a constant of order a hundred per km are all fit failures wearing the costume of a result.

A second sensibility test comes free from the frame. Convert the two bounding pressures at TD to equivalent mud weight referenced to sea level and the hydrostatic gives 1029.878049 kg/m3 while the overburden gives 2266.333384 kg/m3. The hydrostatic figure sits just under the pore fluid density of 1030 kg/m3, which is right, because the seawater part of the column is slightly lighter than the pore fluid part. Those two values bracket every pressure this well can physically hold.

## Check 6: every pressure is quoted with its depth

This is the check that costs nothing and catches the errors the other five cannot see.

A pressure without a depth is not a result. Saying the well has 41.408580 MPa is meaningless. Saying the hydrostatic pressure at 4000 m below mudline is 41.408580 MPa is a statement someone can check, repeat, or disprove. The same applies to transit times, which need their depth and their trend named, and to the compaction constant, which needs its unit named because per m and per km differ by a factor of a thousand.

Write the depth beside the number at the moment you read it, not later. Numbers separated from their depth are the single most common way a correct calculation becomes a wrong report.

## Exercise

Run all six checks against the frame table for the golden well and write one line for each saying what passed. Then answer in one sentence: which check would catch a density log that had been read in g/cc instead of kg/m3?

As a self check: the two curves meet at 1.005182 MPa at the mudline; the overburden leads everywhere below, 91.123067 against 41.408580 MPa at 4000 m; both columns increase at every step; the fitted trend reproduces the picks, giving 326.036694 against a pick of 326.0366944948908 us/m at 2000 m; the fitted parameters of 650.0000000000014 us/m and 0.7000000000000015 per km are both physically sensible, and the equivalent mud weights of 1029.878049 and 2266.333384 kg/m3 bracket the well correctly; and every value above is quoted with its depth. Check 2 catches a density in g/cc, because a column a thousand times too light would put the overburden below the hydrostatic.
