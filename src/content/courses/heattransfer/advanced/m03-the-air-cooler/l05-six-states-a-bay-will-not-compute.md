# Six states a bay will not compute

Every one of the six states below is a box in the studio that a saved study can carry. The bay refuses each of them with a named string rather than returning a number, and the string names the box rather than the physics, so a reader knows which field to go and fix.

{{panel:fc-rating-explorer}}

## Three that stop the machine

- REFUSED, a motor efficiency of 3.000000: the motor efficiency must be greater than 0 and at most 1; it was 3. A value above 1 is a motor drawing less than the shaft it turns.
- REFUSED, an empty design ambient temperature: the design ambient temperature is empty or not a number; it was NaN F
- REFUSED, a process outlet above the process inlet: a cooler takes the process DOWN: the inlet is 250 F and the outlet 251 F

The first message says what the impossible value would mean, which is more useful than a range. The second is the state an empty input box produces. The third reads the two temperatures back so the caller can see which pair it rejected.

## Three messages that carry repair history

The three refusals below are current behaviour. The second half of each message is history: it states in the engine's own words what this engine used to return before the repair, and that is not what it does now. Only the first half of each describes the module you are using.

- REFUSED, a fan efficiency of zero: the fan efficiency must be greater than 0 and at most 1; it was 0. Zero used to return Infinity bhp and a negative value a negative one, neither with an error key.
- REFUSED, a fan efficiency of 5.000000: the fan efficiency must be greater than 0 and at most 1; it was 5. Zero used to return Infinity bhp and a negative value a negative one, neither with an error key.
- REFUSED, a fan static pressure of -0.600000 inches of water: the fan static pressure must be positive inches of water; it was -0.6. A negative one used to return a negative horsepower.

## Why the messages are quoted whole

Truncating an engine message changes what the engine said. A shortened refusal reads as the module's current contract and drops the part that explains why the bound exists, so this course quotes the whole string and frames it where the string carries history of its own.

## What a refusal is worth

An engine that answers a fan efficiency of zero with an infinity has told a caller nothing and has done it confidently. An engine that refuses has told the caller which box to look at. So record the message rather than a blank, and record the fields beside it where a refusal carries them.

Three of this module's twelve doors hand back evidence as well as a message. The bay is not one of them, so on these six the message is the whole of the answer.

## Exercise

Record the six refusals with the input each one rejected. Mark which three carry a sentence about former behaviour and say how you can tell. Then write what a caller should store when a bay refuses, and why a blank is the wrong thing to store.
