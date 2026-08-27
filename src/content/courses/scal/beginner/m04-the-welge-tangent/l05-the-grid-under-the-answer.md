# The grid under the answer

Every number the last three lessons quoted came out of a computation, and computations have settings. This lesson opens the hood on one of them, because knowing which digits are physics and which are resolution is part of reading any engineering result honestly. The Ekene front saturation is 0.6372. It is worth asking: why exactly four decimals, and why do they end the way they do?

## How the search actually runs

The engine finds the front by the secant search from lesson 2, and it runs that search on a finite grid. It divides the mobile saturation window from $S_{wc} = 0.35$ to $1 - S_{or} = 0.75$ into 1000 equal steps, so the grid spacing is exactly

$$\frac{0.75 - 0.35}{1000} = 0.0004$$

and every candidate front saturation has the form $0.35 + k \times 0.0004$ for a whole number $k$. The reported front is the grid point with the largest secant slope. For Ekene:

$$S_{wf} = 0.6372 = 0.35 + 718 \times 0.0004$$

The front saturation is grid point number 718 of 1000. The trailing digits of 0.6372 are not a message from the rock. They are the fingerprint of a search that can only answer in multiples of 0.0004.

## What is resolution and what is physics

Suppose the engine were rebuilt to scan 10000 points instead of 1000. The grid spacing would drop to 0.00004, and the reported front might shift to a neighboring finer grid point, changing the fourth or fifth decimal. The tangent slope, the breakthrough time and the average behind the front would all move by similarly tiny amounts, because each is evaluated at the reported front point.

None of that movement would mean the reservoir changed. The true tangency sits where the derivative of the fractional flow curve equals the secant slope, a condition with one exact mathematical answer for a given curve. The grid search brackets that answer to within one step. Refining the grid walks the reported value toward the exact one; it never walks the exact one anywhere. So: the first two or three decimals of $S_{wf}$ are physics, set by the curve and its inputs. The last digit is resolution, set by a programmer's choice of 1000.

There is a useful cross-check hidden here. Lesson 2's table showed the secant slope at the front, 3.023246274678918, only fractionally above the slope at the neighboring tabulated saturation 0.65, which scored 3.0113677782580965. A flat peak means the bracketing is comfortable: even a coarse grid lands close to the true tangency because nearby candidates score nearly the same. A sharply peaked search would be more sensitive to its grid, not less trustworthy, but worth resolving finer.

## Why quote all the digits then

If the last digit is a settings artifact, why does this course print values like 0.33077027444818546 in full? Because those long decimals are the exact output of the engine at its shipped settings, and exactness about what the tool actually returns is what lets you verify your own run against it digit for digit. Full precision here is a handshake between you and the software, not a claim that the rock is known to seventeen figures. The claim about the rock lives in the first few digits. The rest is bookkeeping that makes checking possible.

This distinction will follow you through the whole course. Grid counts, tolerance floors and iteration limits appear inside every numerical tool in the Suite. An engineer who can say which reported digits would survive a settings change, and which would not, reads software the way a good geologist reads a map: aware of the contour interval.

## The misconception to avoid

Do not conclude that because the answer is grid quantized it is somehow approximate in a way that should worry you. The quantization is bounded, known and shrinkable, which makes it the best behaved kind of error in the whole workflow. The dangerous uncertainties in a displacement calculation live in the inputs, in exponents and endpoints measured on a handful of core plugs. Distrust the fourth decimal for the right reason, and spend your worry where it earns a return.

## Exercise

First, show that 0.6372 sits exactly on the search grid by computing $(0.6372 - 0.35)/0.0004$ and confirming it is a whole number. Then state which grid point the neighboring candidates 0.6368 and 0.6376 are.

Second, a colleague reruns the Ekene case in another tool and reports a front saturation of 0.6374. In two or three sentences, explain whether this contradicts the engine's 0.6372, and what single question about the other tool you would ask before comparing digits at all.
