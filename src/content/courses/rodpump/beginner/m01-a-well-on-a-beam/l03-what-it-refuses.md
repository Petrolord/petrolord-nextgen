# What it refuses

Eight conditions come back with ok false and a message. Eight more come back with an answer and a warning code. Which list a condition lands on is a decision, not an oversight.

## The eight refusals

| Condition | Why there is no answer |
| --- | --- |
| a rod size that is not a diameter | no area to compute with |
| a linkage that does not close | the pitman cannot reach the beam |
| a plunger with no differential | discharge does not exceed intake |
| a march with no damping | no stroke ever repeats |
| a speed at or above the fundamental | nothing predicted is trustworthy |
| a card with fewer than sixteen samples | nothing to propagate |
| a pumping speed of zero | there is no cycle |
| a string with no sections | there is no string |

Each carries the engine's own text, and the text names a remedy. The damping refusal ends "Field strings sit between about 0.05 and 0.15 of critical", which is the range the caller was probably reaching for.

## Why a refusal beats a default

Ask for a rod size of `seven eighths` and the answer is ok false with one error, and the error quotes the string back: Rod size "seven eighths" could not be read as a diameter. The predecessor read sizes with a bare numeric parse, and `7/8` with the slash swapped for a dot becomes 7.8 in: an area of 47.783624 in2 against the true 0.601320469 in2, a factor of 79.464490. A string with eighty times its true area barely stretches, so every load and stroke downstream would have been confidently wrong with nothing to flag it.

## The other list

`taperStepsUp`, `timestep`, `notPeriodic`, `rodOverstressed`, `structuralOverload`, `torqueOverload`, `strokeOverload` and `incompleteFillage`. These return numbers. Put a 3/4 section above a 7/8 section over the same 5000 ft and the answer is ok true with `taperStepsUp` and a spring rate of 251.236634246 lb/in, against 267.091373300 lb/in for those two sections in the sensible order. A reversed taper is a design error rather than a parse error, so the engine computes it and says so.

## What it does not model at all

Rod buckling and the compression a sinker bar would be sized for. Tubing movement and an unanchored tubing string. Fluid friction on the plunger, and valve slippage as anything other than the pump efficiency the caller types. Gas interference. Deviated hole side loading and rod on tubing wear. Gearbox, belt and motor losses. The fatigue history that turns a Goodman percentage into a service life.

Reading silence as approval is the mistake. A design with no warnings was asked eight questions and passed them. It was never asked about buckling, gas or wear.

## Exercise

Sort the eight refusals into ones caused by an input that cannot be parsed and ones caused by a physical condition that has no answer.

Then say why the reversed taper returns 251.236634246 lb/in instead of an error, and what a caller who ignores the code has in hand.
