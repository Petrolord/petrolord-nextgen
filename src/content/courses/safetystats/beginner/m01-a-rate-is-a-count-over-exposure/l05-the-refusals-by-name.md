# The refusals, each naming its field

{{panel:ss-rates-explorer}}

The engine refuses 22 kinds of bad call across 9 functions, and every refusal names the input it could not accept. A refusal carries no number. This lesson reads the ones that guard the simplest rate of all, `incidenceRate`, which needs a `count`, an `exposureHours` and a `base`.

| what was passed | field named |
| --- | --- |
| a fractional count | `count` |
| a negative count | `count` |
| zero hours | `exposureHours` |
| no base | `base` |
| a negative base | `base` |

Each row above is a real call, and the message the engine returns for each is quoted below exactly as it prints it.

## The count

A fractional count and a negative count get the same answer:

> count must be a whole number, zero or more: an event count is not a fraction

An event either happened or it did not. Half an injury is not a thing a safety record can hold, and neither is minus one. Zero is allowed, because a period with no events is a real observation and the rate it gives, 0.000000, is a real answer. UGHELLI's fatal accident rate is exactly that.

## The hours

Zero hours is refused, and the message says why:

> exposureHours must be a finite number of hours above zero: a rate over no exposure is undefined

A rate divides by the hours. With no hours there is nothing to divide by, and any number the engine returned would be invented. The refusal is the honest answer. The same message guards `fatalAccidentRate`, and module four meets a close relative of it when a period inside a series has no hours.

## The base

Two refusals guard the base, and they say different things. A missing base gets:

> base is required: name the base (200,000 for OSHA/BLS, 1,000,000 for IOGP, 100,000,000 for FAR); there is no default

A negative base gets:

> base must be a finite number of hours above zero

The first is about a choice nobody made. The count and the hours of UGHELLI give 0.776317 on the OSHA base and 3.881586 on the IOGP base, a factor of 5.000000 apart, and the engine will not guess which one the caller meant. The second is about a value that makes no sense: a base is a number of hours and cannot be below zero.

## Why a named field matters

Every refusal comes back as an object with an `error` and a `field`. The field is the name of the input, spelled exactly as the function spells it, so a screen can put the message beside the box the learner typed into. A field tells you where the problem is.

Notice what the refusals do not check. The engine checks that a count is a whole number and that hours and base are above zero. It cannot check whether the count was classified correctly. A wrongly classified recordable is still a whole number, and the engine will rate it without complaint.

## Exercise

Open the rates explorer and type UGHELLI's 9 recordables and 2318640 hours with the base set to "no base". Copy the refusal and check it word for word against the blockquote above. Then type a fractional count, with half a case added to the 9, and record which field the engine names. Finally, set the count back to 9, pick the OSHA base, and confirm the answer reads 0.776317.
