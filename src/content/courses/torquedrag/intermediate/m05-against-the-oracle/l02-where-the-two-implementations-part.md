# Where the two implementations part

The worst disagreements, and what they have in common.

{{panel:td-friction-explorer}}

## The two worsts

**Worst relative:** 6.70e-2, on the horizontal well's trip-in hookload. Engine -16676.68507494847 N, oracle -17873.370733709 N, an absolute gap of 1196.6856587605325 N.

**Worst absolute:** 1632.220696788194 N, on the horizontal well's slide-drill hookload. Engine -156755.75915568782 N, oracle -158387.979852476 N, a relative gap of 1.03e-2.

## What they have in common

Both are on the horizontal well. Both are operations that put the string into compression. Both have a hookload whose magnitude is small compared with the forces inside the string.

Everywhere else the agreement is at or below the claimed 1e-4.

## Why the relative measure misleads here

The trip-in hookload is about -17 kN on a string whose internal tension reaches -282 kN and whose weight is 945 kN. A 1.2 kN absolute gap on a 17 kN number is seven percent; the same gap on the 633 kN pick-up hookload is two parts in a thousand.

So the seven percent is a property of the denominator rather than of the calculation, and quoting it without the absolute value overstates the disagreement badly.

## Why the absolute measure also misleads

1632 N sounds large until you notice it is on a case where the model has already flagged the entire string as buckled.

The engine and the oracle are both computing friction from a compression that a real drill string could not carry. They disagree about a number that does not describe anything.

## The honest statement

Over more than a hundred published values, the two implementations agree to better than 1e-4 relative everywhere except on two operations of one well, both of which put the string in compression along a lateral, and on those the absolute gap is under 1700 N on hookloads of tens to hundreds of kilonewtons.

That statement has both measures in it and it says where. Neither number alone would.

## What it is not

It is not a difference in the physics. Both implementations use the same equations.

It is not a difference in the goldens' inputs. Both read the same survey, string and geometry from the same file.

The next lesson separates the two candidates that remain.

## Exercise

Compute the absolute gap as a fraction of the string's buoyed weight rather than of the hookload, for both of the two worst cases.

Then say which of the three normalisations, hookload, buoyed weight, or absolute newtons, you would put in a report, and why.
