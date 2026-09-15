# What a slug catcher refuses

A harp of two and a half fingers is refused by name: SeparatorInputError on nFingers, "nFingers must be a whole number of at least 1 (got 2.5)".

{{panel:fc-slug-explorer}}

## The refusals on this tab

| what was asked for | the engine's answer |
| --- | --- |
| a slenderness of zero | SeparatorInputError on ldRatio: "ldRatio must be a positive length-to-diameter ratio (got 0)" |
| a negative hold time | SeparatorInputError on holdMin: "holdMin must be a non-negative hold time in minutes (got -5)" |
| a negative normal rate | SeparatorInputError on qLiquidBpd: "qLiquidBpd must be a non-negative liquid rate when it is given (got -100)" |
| two and a half fingers | SeparatorInputError on nFingers: "nFingers must be a whole number of at least 1 (got 2.5)" |
| no slug volume | { error: "a slug volume is needed (the line sizing studio computes it)" } |
| a vessel filled to the brim | { error: "the fill fraction must be between 0 and 1" } |

Each thrown message names the input, states the rule and quotes back what it was handed. Each returned error describes a state the method has no answer for.

## Why a fractional finger is worth refusing

A harp is built from whole pipes. A request for 2.5 fingers is either a typing slip or an arithmetic result that was never meant to reach the form, and rounding it silently would give a real answer to a request that was never made. The engine names the input and stops.

The same reasoning runs through the rest. A negative hold time is not a short hold, and a slenderness of zero is not a squat vessel. None of them has a nearest sensible value that the engine has any business choosing on the reader's behalf.

## Why the message names the input

Each thrown refusal carries an `input` property holding the name of the field that failed, so a studio can put the message beside the box it belongs to rather than at the bottom of the page. The message also quotes the value back, which is what turns a complaint into an instruction: a reader who sees 2.5 quoted at them knows immediately whether they typed it or whether something upstream produced it.

## Non-negative is not the same as positive

The guards are written with care about which end is open. A hold time of zero is accepted, because a vessel that drains as fast as the slug arrives is a real case and its normal inflow is simply nothing. A normal liquid rate of zero is accepted for the same reason. A slenderness of zero is refused, and a finger count below one is refused, because neither describes anything that could be built.

## The mistake

The mistake is catching the error and carrying on. A SeparatorInputError caught and swallowed leaves the studio showing the previous answer beside the new inputs, which is worse than a blank screen, because the numbers on the page no longer belong to the case on the page.

The second mistake is reading a returned error as a zero. A missing slug volume is not a slug of nothing, and a bad fill fraction is not a fill of nothing.

## Exercise

Write the four thrown refusals with the input each one names, and the two returned errors. Then say which inputs accept a value of zero and which refuse it, and explain why a finger count of 2.5 is refused rather than rounded.
