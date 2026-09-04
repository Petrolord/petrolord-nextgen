# What an AFE is for

An authority for expenditure is a request for permission with a number attached, which is not the same document as a forecast.

{{panel:wc-afe-explorer}}

## Permission, not prediction

A forecast says what you believe will happen. An AFE says what you are asking to be allowed to spend. Both end in a currency figure, so they are easy to confuse, but they answer to different people and they fail in different ways.

A forecast is wrong when the outcome differs from it. An AFE is wrong when the money it authorises does not cover the work it authorises. You can hold an AFE that described the well perfectly and still be in breach, because the amount approved sat below the amount the lines actually bill.

## The number that goes forward

The golden programme in the panel is an 18 day well that drills 3,000 m. Its cost lines add to a base of 5,380,000 USD. A contingency at a fraction of 0.1 of that base adds 538,000 USD, and the figure carried forward for approval is 5,918,000 USD.

That total is the authority. Nobody signs the 5,380,000 and then finds the remainder later. The approval covers the total, and the total is what the engine returns as `totalUsd`.

## Why it is built out of lines

An approved single number tells you nothing when the well moves. If the schedule slips, some of that 5,380,000 keeps billing and some of it does not, and only the lines behind the total can tell you which.

This is the whole reason the AFE has a structure rather than a value. Each line carries how it bills and what kind of spend it is, and those two properties are what let you re-price the well without rebuilding it. A total alone is a dead number the moment reality departs from the plan.

## What it does not promise

The AFE does not promise the well will cost 5,918,000 USD. It promises that the work described has been costed line by line at stated rates, that a provision has been set aside, and that somebody with authority has agreed to fund the result.

If the well comes in under, nobody is embarrassed. If it comes in over the authority, the document has to be revisited before the money is spent. That asymmetry is the point of the instrument.

## Exercise

Open the panel on the golden case and write down the base, the contingency and the total as three separate figures.

Then state, in one sentence each, who would be told about a move in the base and who would be told about a move in the total.
