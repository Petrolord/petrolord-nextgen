# A guard that refuses the wrong thing

A calculation's guards are as much a part of it as its arithmetic. This module runs 42 refusals across 12 of its routes, and most come from a few rules applied consistently.

{{panel:fc-sizing-explorer}}

## The contract, both halves

Every route returns either a finite result or an object carrying an `error` string. A non-finite number with no `error` is what a caller's `if (r.error)` guard cannot see, and that is the failure the contract prevents.

The module has 22 exports and they split along this line. 12 return an object and keep the contract above. 7 return a bare number and signal a refusal with NaN. 2 are published tables and 1 is a derived constant.

Those 7 need care, because a bare NaN passes an error check looking for a property. Test the number you got back rather than a key that will never be there.

## One rule, nine places

A certified coefficient is a fraction of an ideal, so it must be above zero and no more than one. That single rule runs on Kd, Kb, Kc, Kw, KSH, the environment factor, the radiated fraction, the transmissivity and the blowdown discharge coefficient, and the refusal names the offender every time.

A rule that general beats memorising nine messages. It also says what the engine believes: a coefficient cannot add capacity, so a value above one is a typing error.

## The one that catches a screen

A drainage answer must be a real boolean. The string "false" is truthy in JavaScript, so a select element sending a string would buy the drainage credit silently and the duty would come back on the drained constant instead. The engine refuses it by name, and this is the engine's own wording: `adequate drainage must be the boolean true or false`.

That refusal is not about physics. It is about the gap between a screen and a function, where a surprising share of real defects live.

## Three kinds of message

A refusal returns no answer. Its object carries the `error` key, and on one of them a second field comes too: `selectOrifice` past the largest returns `multipleOfT`, a whole number of valves. A guard reading only `error` throws that figure away.

A warning comes with a usable answer and flags a condition. Six are run and printed, including the two you have met on the blowdown march and the subcritical branch. Read that as the number exercised rather than as a total: a count of the conditions a module can reach is a claim somebody has to check.

A note comes with a successful answer and names a decision left to you. The duty note about the 25 ft height limit is the clearest: the engine cannot know the plot elevation, so it states the rule and hands the truncation back to you.

Read them in that order of severity.

## Exercise

State the return contract in one sentence and say what a non-finite number with no error key defeats. Record how many exports return an object, how many return a bare number, how many are tables and how many are constants. Write out the certified-coefficient rule and name the nine places it runs. Then quote the drainage refusal as the engine's wording, and distinguish a refusal, a warning and a note.
