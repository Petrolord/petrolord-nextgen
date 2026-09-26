# The calculator panels and the refusals

{{panel:gsa-quantity-calculator}}

This is an engine course, and there is no Suite app for it. The practicals run in the course's own calculator panels, which call the same engine the lessons quote. This tier uses the quantity calculator; the Professional tier adds the ledger calculator and the Expert tier the contract calculator. Every figure a panel prints is a return value of the engine, at six decimals, and every refusal appears in the engine's own words.

## Four views

The quantity calculator has four views, each a thin route to one engine function:

| view | engine function |
| --- | --- |
| Volume to energy | `toEnergy` |
| Contract quantities and swing | `contractQuantities` |
| The daily balance | `dailyBalance` |
| One take-or-pay year | `takeOrPay` |

Each view takes its inputs as JSON in a box. It starts from an Ekene agreement or a worked case, and you can edit any term or paste a whole case file. That is also how the capstone is worked.

## What is graded

Every graded number in this course is a return value of the engine on fixed inputs. Nothing in the engine samples or searches, so the same terms give the same number on any machine, and there is exactly one right answer.

## When the engine refuses

A refusal names the input it refused, and its message starts with that name and states the exact condition that failed. Six refusals belong to this tier. A misspelt key is refused, so a term is never silently dropped:

> heatingvalue is not an accepted key; the accepted keys at the top level are quantity, quantityUnit, heatingValue, heatingValueUnit, heatingValueBasis, referenceConditions

A unit the engine does not accept:

> quantityUnit must be one of "scf", "Mscf", "MMscf", "Sm3", "MSm3", "MMSm3"; got "bcf"

Two day counts at once:

> days must be the only day count stated; got days and year

Gas taken above the gas made available:

> days[0].taken must be at or below the quantity made available 50; got 60

Force majeure and maintenance above the DCQ:

> days[0].forceMajeure must be a quantity that with maintenance 30 is at or below the DCQ 100; got 80

And a take-or-pay year with no make-up terms, because the engine holds no default for them:

> makeUp must be an object { periodYears, order, endOfTerm } (no default); got nothing

## A result with a reason is a result

A deficiency that carries no make-up right, a day on which force majeure covers the whole DCQ, a nomination trimmed to MaxDCQ: each comes back as a result with a reason printed beside it. Read the reasons as carefully as the figures. A refusal returns no figures at all.

## Exercise

Open the quantity calculator, the course's own calculator panel. In "Volume to energy", change the key `heatingValue` to `heatingvalue` and run it; read the refusal. Restore it, set `quantityUnit` to "bcf" and run again. In "Contract quantities and swing", add `"days": 365` beside the `year` already in the box. In "The daily balance", raise one day's `taken` above its `available`. In "One take-or-pay year", delete the `makeUp` object. For each, write down the field the refusal names and the condition it states.
