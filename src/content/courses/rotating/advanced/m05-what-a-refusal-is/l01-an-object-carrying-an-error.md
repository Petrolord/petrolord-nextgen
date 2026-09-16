# An object carrying an error

Neither of these modules throws. A bad input comes back as an ordinary returned object with an `error` string on it, and the string names the input that is actually wrong.

{{panel:fc-compressor-explorer}}

## What a caller does

A caller checks a property rather than catching an exception. That is a deliberate shape and it has one consequence worth stating plainly: the property check is the only check most callers ever make, so a non-finite value that slips past it is worse than having no guard at all. A caller that sees no `error` believes it has a number.

That is why both modules were worked through input by input. Every fault below reached a caller with no error key on it before the guard beside it was written, some as a plausible figure and some as a field that was quietly NaN or Infinity.

## The pump module, refusing by name

| input | what comes back |
| --- | --- |
| a motor efficiency above one | { error: "motor efficiency must be greater than 0 and at most 1" } |
| a negative motor efficiency | { error: "motor efficiency must be greater than 0 and at most 1" } |
| a motor efficiency of zero | { error: "motor efficiency must be greater than 0 and at most 1" } |
| a speed change with no duty to change | { error: "a speed change needs a duty to change: give the flow, the head and the brake power at the present speed" } |
| a trim with no duty to trim | { error: "a trim needs a duty to trim: give the flow, the head and the brake power at the full diameter" } |
| a viscosity correction at zero speed | { error: "the viscosity correction needs a positive pump speed in rpm" } |
| two and a half pumps in parallel | { error: "parallel operation needs a pump curve and a whole number of machines, at least one" } |
| a system curve with no static head | { error: "a system curve needs a static head: it may be negative, but it cannot be missing" } |

Three of those eight rows are one guard fired three ways. A motor efficiency above one, below zero and at zero are three different typing mistakes and one rule, and the rule is what the message states.

## The guard that is finiteness rather than positivity

The last row is the sharpest of the set, because a curve object can look healthy and carry a correct coefficient while the function hanging off it is unusable. The guard catches at construction what would otherwise surface only at the call.

Its guard also had to be written carefully. A static head may legitimately be negative, because the destination can sit below the pump, so testing for positivity would refuse a real station. Testing for finiteness refuses only the missing one, and the message says exactly that.

## The compression module, the same way

| input | what comes back |
| --- | --- |
| a per-stage ratio limit of one | { error: "the maximum ratio per stage must be greater than 1: a stage at a ratio of 1 adds no pressure, so no number of them reaches the discharge" } |
| a polytropic efficiency of zero | { error: "polytropic efficiency must be greater than 0 and at most 1 (got 0)" } |
| a suction below absolute zero | { error: "the suction temperature is at or below absolute zero (-600 F)" } |
| a stage at zero mechanical efficiency | { error: "mechanical efficiency must be greater than 0 and at most 1 (got 0)" } |

Each of those names the quantity the caller has to change. None of them says the calculation failed and leaves the reader to guess where. The ratio-limit message goes further and explains itself: a stage at a ratio of one adds no pressure, so no number of them ever reaches the discharge, which is why the rule is greater than one rather than at least one.

A negative per-stage ratio limit reaches that same refusal, and so it should.

## Reading a refusal in JSON

One practical note. A NaN and an Infinity have no spelling in JSON, and both come out as null through an ordinary serialiser. A log showing null where a number belongs has not told you which of the two it was, and the two mean different things. A NaN says an input could not be read. An Infinity says something was divided by zero. Probing these modules needs a serialiser that prints what was really returned.

## The mistake

The mistake is writing a wrapper that turns a refusal back into a number, usually a zero or a default, on the grounds that the caller wants a number. The refusal was the answer. A zero with no error key is exactly the failure mode this design is arranged to avoid.

## Exercise

Explain what shape a refusal takes in these modules and what a caller checks. Quote the static head refusal and say why its guard is finiteness rather than positivity, and say why a null in a JSON log is not enough to identify what came back.
