# The refusals, each naming its field

{{panel:dq-checks-explorer}}

When the engine is handed something it cannot answer, it returns neither a number nor a guess. It returns an `error` and a `field`, and the field names the exact input it refused. Across the whole engine 23 refusals are tabled, across 20 functions. Each is a real call, and each message is the engine's own words. A refusal carries no number.

| function | what was passed | field named |
| --- | --- | --- |
| `completeness` | an empty series | `values` |
| `completeness` | an infinite value | `values[1]` |
| `rangeCheck` | an unlisted unit | `unit` |

## An empty series

Completeness is present over n, and with n of 0 there is nothing to divide by and nothing to describe. The engine could return 1, on the argument that nothing is missing, or 0, on the argument that nothing is present. Either would be a number a report could quote with confidence it has not earned. So it refuses:

> values must be a non-empty array

The field is `values`, the whole argument, because the whole argument is the problem.

## An infinite value

An infinite value is neither a measurement nor a missing value, so the engine will not count it as either. It names the entry, so you can go straight to it:

> values[1] must be a finite number or missing (null)

The field here is `values[1]`, one entry, counted from 0. The rest of the series was acceptable; one value stopped the call.

## An unlisted unit

The range check keys its definitional limits by unit, and it never converts one unit to another. Asked to check a sonic log in a unit it does not list, it refuses and says which units it does list:

> unit must be one of us/ft, us/m for channel sonic: units are never converted here

The last clause is a statement of policy inside an error message. The engine could have guessed a conversion from a unit name that looks familiar, and a wrong guess would turn a wrong answer into a confident one. Module three returns to this rule.

## Why refuse at all

A refusal is the engine declining to invent the answer to a question that was not properly asked. A default value, a silent skip or a best guess would each produce a number that looks like every other number in the report. The refusal puts the warning where it cannot be missed and names the field, so the fix is quick: supply a series, replace the infinite value, or state a listed unit.

Refusals turn up throughout this tier. The coverage check refuses an index that steps back, the frozen-run check refuses a run length it cannot use, and the index check refuses an index too short to have a step. Each time, read the field first. It tells you which input to look at before you read the message.

## Exercise

Open the checks explorer on the view for range limits and rate rules. Set the channel to sonic, then set the unit to the option for a unit the engine does not list. Copy the refusal exactly, and name the field it reports. Next, switch to the consistency view, set minRun to 1, and copy that refusal and its field. Finally, switch to the index view, leave a single depth in the index box, and copy the third refusal and its field. For each, write the one change that would let the call run.
