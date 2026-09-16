# A verdict needs an input

A check that cannot read one of its inputs has two options. It can classify anyway and return a label, or it can refuse and say which input defeated it. This one refuses.

{{panel:fc-suction-explorer}}

## Both refusals

An available head that is not a number:

{ error: "the margin check needs a finite available NPSH: there is no verdict to give on a suction head that cannot be read" }

An available head of infinity:

{ error: "the margin check needs a finite available NPSH: there is no verdict to give on a suction head that cannot be read" }

One message covers both because both fail the same test. The requirement is that the available head be finite, and a value that is not a number and a value that is infinite are each outside that in their own way. The check takes two inputs, and the refusal names the one it could not read.

## Why refusing is the right shape here

The available head is the whole of what this function judges. Strip it out and there is nothing left to compare the rule against, so an unreadable one is refused rather than classified. There is no severity to report and no pass flag to set.

The alternative would be worse than it looks. A label invented over an unreadable input would come back looking exactly like a label computed from a real one. It would carry a pass flag, a ratio and a note, and every one of those would be a statement about nothing.

## Reading the refusal correctly

A refusal is a returned object carrying an error key. It is not a severity, and it is not a pass of false.

That distinction is the one a caller gets wrong. Code written as a test on the pass flag alone puts a refusal in the same bucket as "cavitating" and "marginal", and reports a failed suction check where the engine reported that it never ran one. Code written as a test on the error key first, then the severity, then the pass flag, reads all three answers apart.

## What this check still does not check

It judges an available head against a required head by the margin rule. Everything else it takes on trust.

It has no opinion on where the required NPSH came from, and in particular no way to know what flow it was read at, because there is no required-NPSH-against-flow curve anywhere in these engines. A required figure lifted off a vendor curve at the wrong flow passes through this check without a mark on it.

It has no opinion on where the available head came from either. A head assembled part by part from a suction survey and a head somebody typed into a box arrive here as the same number and are judged identically.

And the rule it judges by is customary, so the verdict inherits that. What the check guarantees is that its inputs were readable and that its arithmetic was done.

## Exercise

Quote the refusal and name the two input states that produce it. Then say what a caller testing only the pass flag would conclude, and list the three things this check takes on trust about the numbers it was handed.
