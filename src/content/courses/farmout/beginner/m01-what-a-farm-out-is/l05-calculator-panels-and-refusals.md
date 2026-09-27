# The calculator panels and the refusals

{{panel:farmout-earning-calculator}}

This is an engine course, and there is no Suite app for it. The practicals run in the course's own calculator panels, which call the same engine the lessons quote. This tier uses the earning calculator; the later tiers add the deal and valuation calculators. Every figure a panel prints is a return value of the engine, at six decimals, and every refusal appears in the engine's own words.

## The earning calculator

The earning calculator has one view, "The earning obligation, the promote and the consideration", a thin route to the engine function `earningObligation`. It takes its inputs as JSON in a box. A start selector loads the Ekene Deep well or one of the small teaching cases. Above the box, a visible control shows every required term as the box states it, or "not stated", and writes your choice into the box. You can also paste a whole case file, which is how the capstone is worked.

## What is graded

Every graded number in this course is a return value of the engine on fixed inputs. The same terms give the same number on any machine, and there is exactly one right answer. Each capstone runs its own synthetic deal, which the lessons never print.

## When the engine refuses

A refusal names the input it refused. Its message starts with that name and states the exact condition that failed, with the value it was given. Participating interests that do not make up the whole are refused:

> parties must have participatingPct summing to 100; got a sum of 90

A deal term with no default is refused when it is missing. Setting the vesting control to "not stated" removes the term, and the engine answers:

> vesting must be one of "per-event", "all-events"; got nothing

A misspelt or unknown key is refused wherever it sits, with the full list of keys the function reads, so a term is never silently dropped:

> carryCap is not an accepted key; the accepted keys at the top level are parties, farmor, farminee, events, vesting, eventsCompleted, cashBonus, pastCosts

A box that carries an unknown key and also lacks a required term is refused on the unknown key first. With the vesting rule removed and a key `vest` added, the message is:

> vest is not an accepted key; the accepted keys at the top level are parties, farmor, farminee, events, vesting, eventsCompleted, cashBonus, pastCosts

## A refusal and a reason

A refusal returns no figures. A result can also carry reasons, lines that explain each figure, and a result with a reason is still a result: an event not yet completed is reported with its split and a reason saying nothing is paid yet.

## Exercise

Open the earning calculator, the course's own calculator panel, in the view "The earning obligation, the promote and the consideration", and start from "The Ekene Deep well, a gross-cost cap". Set the vesting control to "not stated" and read the refusal. Restore "per-event". In the box, change EKO's `participatingPct` to 60, run it and read the refusal and the field it names. Restore 70. Finally add a key `vest` at the top level of the box, set the vesting control to "not stated" again, and check which of the two problems the engine names first.
