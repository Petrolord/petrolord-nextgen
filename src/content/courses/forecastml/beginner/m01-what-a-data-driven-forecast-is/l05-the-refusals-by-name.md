# The refusals, each naming its field

{{panel:pf-smoothing-explorer}}

When an input is wrong the engine returns no result at all. It returns an object with `error` and `field`, where `field` names the input it refused and the message starts with that name. This course quotes those words verbatim.

## A missing month

The engine fills nothing. A null or a value that is not a finite number stops the call at the first index it meets, counting from 0. EKENE-P1 with month 5 set to null is refused with:

> y[5] must be a finite number: fill or drop missing values first

The field is `y[5]`, the series at index 5. The message leaves the choice to you: filling month 5 and dropping it change the fit in different ways, and the data quality course teaches how to decide. With several gaps, the refusal names the first.

A well name where the series belongs is refused on the whole field:

> y must be an array of numbers

## A series too short for its method

Each method needs a minimum number of months, and the refusal explains why in the same sentence. Simple smoothing needs two:

> y has 1 value: 'ses' needs at least 2 (the first sets the level, the second is the first scored forecast)

Holt needs three, because it spends its first two months on the start:

> y has 2 values: 'holt' needs at least 3 (the first two set the initial level and trend, the third is the first scored forecast)

The damped trend follows the same rule as Holt. EKENE-P6, the new well, has three months, which is enough for Holt to fit with one scored error. One scored error is a thin basis for any parameter. The refusal rules state the least the arithmetic needs, and passing them says nothing about whether a fit is worth trusting.

A series can also be too long. The engine accepts at most 100000 values:

> y has 100001 values, above the 100000 this engine accepts

## A method the engine does not offer

The engine offers three methods and names them all when refused:

> method must be 'ses', 'holt' or 'damped'

## What a refusal is, and what it is not

A refusal carries no number of its own. Any figure in the message is part of the sentence, and a lesson that needs the figure reads it from the rule the message states. The other modules of this tier meet the refusals on parameters: an alpha outside 0 to 1, a trend setting on a method with no trend, a phi out of range, an h out of range.

A refusal is also different from a warning, which a fit would carry only if its search ran out of effort. No fit in this course does.

| what went wrong | field named |
| --- | --- |
| a missing month at index 5 | `y[5]` |
| a series that is not an array | `y` |
| too few months for the method | `y` |
| too many values | `y` |
| a method not offered | `method` |

## Exercise

In the smoothing explorer choose "Fit a method". Load EKENE-P1 and replace the value at month 5 with a dash; run and read the refusal. Replace a later month with a dash as well and confirm the refusal still names index 5. Then type a series of one value and fit ses, and a series of two values and fit holt, and read each message. Finally load EKENE-P6 and fit holt, and read how many errors it scored.
