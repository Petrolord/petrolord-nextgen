# One cause, one consequence

{{panel:lp-worksheet}}

A LOPA row is one initiating cause paired with one consequence. That pairing is the whole unit of analysis. If a scenario has two plausible causes it becomes two rows, each with its own frequency, and if one cause can reach two different consequences it becomes two rows again, each carried against its own tolerable frequency. The arithmetic only holds together because the row is narrow.

## The ORONI row, stated in words before any number

The worked scenario for this tier is a separator overfill. The initiating event is that the level control valve fails open, at 0.45 per year. The consequence is a loss of containment from the separator with people in reach of it. The engine never takes a category, a score or a band for that consequence. It takes the frequency the organisation will tolerate for it, the tolerable mitigated event likelihood, and that single input carries the consequence into the arithmetic.

This is why the consequence is written out in words on the worksheet and then represented by one frequency per year. A row whose consequence is a fatality and a row whose consequence is a small release are separated by their tolerable frequencies, and by nothing else the engine can see.

## One frequency multiplied by probabilities

A LOPA row multiplies ONE frequency by probabilities. That is the shape of the whole method and it is worth fixing early.

| what appears once | what may appear many times |
| --- | --- |
| the initiating event frequency, per year | enabling conditions, probabilities |
| the tolerable frequency, per year | conditional modifiers, probabilities |
|  | IPL PFDs, probabilities |

The engine's method string says it in one line, verbatim: "CCPS (2001) Layer of Protection Analysis: f = IEF x prod(enabling) x prod(conditional modifiers) x prod(PFD of credited IPLs); RRF = f / TMEL; required PFDavg = TMEL / f; SIL band low demand per IEC 61511-1".

Read from left to right, that is the tier in one sentence. One frequency, then the enabling conditions that must hold, then the conditional modifiers that decide whether the consequence follows, then the layers already credited. What comes out is compared with the tolerable frequency, and the ratio is how much reduction is still missing.

## Why the row stays this narrow

ORONI's chain runs from 0.45 per year to an unmitigated frequency of 0.013500000000 per year and then to 0.000013500000 per year once its credited layers are applied. Each of those figures belongs to one cause and one consequence. Merge two causes into a single row and no enabling condition on it is true for both, no modifier applies to both, and the mitigated frequency it prints is a number about nothing in particular. The narrowness is what makes every factor defensible in writing, which is the test each of them has to pass.

## Exercise

ORONI's unmitigated frequency is 0.013500000000 per year and its initiating event frequency is 0.45 per year. Divide the first by the second, then say in one sentence which parts of the method string that ratio accounts for and which part it does not. Then describe, without using any score or band, how you would state this row's consequence so a reader knows why its tolerable frequency was set where it was.
