# Caps and refusals

{{panel:joa-agreement-calculator}}

A refusal is part of the engine's answer. It says which input failed and why, in words a learner can act on, and it arrives before any figure is computed. This lesson reads how the refusals are built, the size caps, and the refusals this tier owns.

## How a refusal reads

A refusal is an object with `error` and `field`. The message starts with the field it refuses and states the exact condition that failed, then what it got: a string in quotes, an absent value as nothing. The course tables 78 refusals across 9 functions. Four rules run through them:

- a contract term with no default is refused when it is missing, and the message says so;
- an input key a function does not read is refused wherever it sits, with its path and the full list of accepted keys;
- a term the Act fixes is refused when a call breaks it under basis "pia-s85-4";
- every figure inside a message is the shortest round-trip decimal of the value given.

## The refusals of this tier

Four refusals guard sole risk and entry:

> consenting must be leaving at least one non-consenting party (every party consents: a joint operation); got ["EKO","PA","PB","NOC"]

> premiumMultiplePct must be a number at or above 100 (a stated contract figure; 100 recovers the cost alone); got 50

> mode must be one of "recover-from-production", "buy-in"; got "penalty"

> operation.date is not an accepted key; the accepted keys of operation are name, cost

A buy-in that states production years is refused too, with the years it was given printed back.

## The size caps

The engine caps the size of one call. Each cap is exported in `DEFAULTS`, and a call over it is refused:

| cap | value | the engine's message |
| --- | --- | --- |
| `MAX_PARTIES` | 20 | parties must have at most 20 entries; got 21 |
| `MAX_MONTHS` | 600 | months must have at most 600 entries; got 601 |
| `MAX_YEARS` | 100 | years must have at most 100 entries; got 101 |
| `MAX_ITEMS` | 200 | items must have at most 200 entries; got 201 |
| `MAX_BANDS` | 20 | scale.operating.bands must have at most 20 entries; got 21 |

A panel stays well inside these caps. The validation record's timing table, run on 2026-09-26 on one machine, prints a 600-month cash call ledger of 20 parties at 152.28 milliseconds.

## A result with a reason is no refusal

A month with no cash call, a carry not recovered by the last year and a consequence not triggered are results, each with its reason. A carry that ends outstanding still returns its whole ledger; the reason says how much is left.

## Exercise

Open the agreement calculator on the view "Sole risk: the premium recovered from production". Produce each of the four refusals above by editing the box or a control, and after each one read the field it names and restore the box. Then misspell `premiumMultiplePct` as `premiumMultiple` in the box, read the refusal, and note how it lists the accepted keys at the top level. Last, add a year after 2036 that skips a year, and read which field the refusal names and which year it expects.
