# The calculator panels and the refusals

{{panel:joa-account-calculator}}

This is an engine course, and there is no Suite app for it. The practicals run in the course's own calculator panels, which call the same engine the lessons quote. This tier uses the account calculator; the Professional tier adds the recovery calculator and the Expert tier the agreement calculator. Every figure a panel prints is a return value of the engine, at six decimals, and every refusal appears in the engine's own words.

## Four views

The account calculator has four views, each a thin route to one engine function:

| view | engine function |
| --- | --- |
| Participating, paying and beneficial interests | `participatingInterests` |
| Cash calls | `cashCalls` |
| Budget control | `budgetControl` |
| Operator overhead | `overhead` |

Each view takes its inputs as JSON in a box. It starts from the Ekene joint venture or a worked case, and you can edit any term or paste a whole case file; a view reads its own block of a case file. That is also how the capstone is worked. Where a term is a required contract term, a control above the box shows it as stated or "not stated", and writes your choice into the box.

## What is graded

Every graded number in this course is a return value of the engine on fixed inputs. Nothing in the engine samples or searches, so the same terms give the same number on any machine, and there is exactly one right answer.

## When the engine refuses

A refusal names the input it refused. Its message starts with that name and states the exact condition that failed, with the value it was given. Interests that do not make up the whole are refused:

> parties must have participatingPct summing to 100; got a sum of 90

A misspelt or unknown key is refused wherever it sits, with the full list of keys the function reads, so a term is never silently dropped:

> carry is not an accepted key; the accepted keys at the top level are parties, carries

> parties[0].wi is not an accepted key; the accepted keys of parties[0] are id, name, participatingPct

A contract term with no default is refused when it is missing. The reconciliation lag is one:

> reconciliationLagMonths must be an integer at or above 1; got nothing

The later modules of this tier meet the others: carriers with no stated rule, a month that skips, no budget tolerance, and a cost category with no overhead scale.

## A result with a reason is a result

A month with no cash call, an item beyond its tolerance, a budget over its allowed overrun: each comes back as a result with a reason printed beside it. It is no refusal. Read the reasons as carefully as the figures. A refusal returns no figures at all.

## Exercise

Open the account calculator, the course's own calculator panel. In "Participating, paying and beneficial interests", start from the Ekene joint venture and change PB's `participatingPct` from 15 to 5; run it and read the refusal. Restore it, then rename the key `carries` to `carry`. Restore that, and rename EKO's `participatingPct` to `wi`. Then open "Cash calls" and set the control "Reconciliation lag, months (stated)" to empty, so the lag is not stated. For each of the four, write down the field the refusal names and the condition it states.
