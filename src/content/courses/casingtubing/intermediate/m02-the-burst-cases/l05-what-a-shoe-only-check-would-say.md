# What a shoe only check would say

The cost of evaluating the bottom of a section instead of all of it, measured.

{{panel:ct-loadcase-explorer}}

## The comparison

The engine scans every grid point inside a section. A simpler check, and the one a legacy version of this app used, evaluates each section at its bottom only.

On the gas kick, section 1:

| method | safety factor |
|---|---|
| whole-section scan | 1.6904923854809817 |
| bottom of section only | 2.396900745393525 |

The ratio is 1.417871364567877. The simpler check overstates the margin by 41.8 percent.

## What that does to a decision

The burst design factor is 1.1.

The real answer, 1.69, passes comfortably. So does the wrong answer. On this string, at this grade, the error changes nothing.

Now imagine the same string one grade lower. L-80 instead of P-110 on the top section drops the burst rating by a factor of 80 over 110, giving a real safety factor of about 1.23 and a bottom-only answer of about 1.74.

Still both pass. Drop to K-55 and the real answer is about 0.85, a clear failure, while the bottom-only answer is about 1.20, which passes.

At that point the error is the whole decision.

## Where it does not matter at all

On the pressure test, the bottom of the section IS the governing point, so the two methods give the same number exactly. The overstatement is 1.

That is the trap. A tool with this bug gives the right answer on most cases and the wrong answer on the one case where the load is at the wellhead, which is the case that made the wellhead rating what it is.

## Why a bug like this survives

Because it never produces an error, never produces a NaN, and never produces an implausible number. It produces a slightly optimistic safety factor on one of seven cases, and the only way to notice is to know in advance which end should have governed.

## The general form of the lesson

Any check that reduces a profile to a single point has made an assumption about where the extreme is. If that assumption is not written down next to the number, it is not an assumption, it is a defect waiting for the case that violates it.

## Exercise

Open the governing-depth view in the panel and read the four numbers for the gas kick.

Then work out what the section 1 gas kick safety factor would be at a burst rating of 47335640.78545454 Pa, which is the L-80 value for that pipe, by both methods.
