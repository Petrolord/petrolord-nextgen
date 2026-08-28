# One rule at a time

The fixture carries seven deliberately broken specifications. Each is designed to trip exactly one rule, and that design is worth more than it sounds.

## The seven

| case | what the validator says |
|---|---|
| no title | A title is required. |
| no start date | A start date is required. |
| layer count disagrees with nz | One layer entry per NZ layer is required. |
| well outside the grid | Well Ekene-1 is outside the grid. |
| completion below the deepest layer | Well Ekene-1 completion is outside the layers. |
| single-node PVT | A live-oil PVT table (at least 2 Rs nodes) is required. |
| history starting off the deck start date | The first history period (2024-01-01) must start on the deck start date (2023-01-01). |

{{panel:sim-build-explorer}}

Switch to validation mode and read what each one returns.

## Why isolation matters

Because the point of the set is to say something about the VALIDATOR, not about how badly a specification can be mangled.

Seven cases each raising one error tells you the validator has at least seven independent rules and that each fires on its own trigger. Seven cases raising a hundred errors between them tells you only that broken things are broken.

Six of these raise exactly one error. The seventh, the missing start date, raises two, because a deck with no start date also fails the rule that the first history period must match it. That coupling is real rather than an artifact: the two rules genuinely depend on the same field.

## How the isolation was achieved

It was not free, and the first attempt failed.

Breaking a well by replacing the whole wells list with a single modified well left the 36-period history naming five wells the model no longer contained. Every period raised five errors, and the case produced 180 of them.

The fix was to mutate one well IN PLACE and leave the others alone. The same problem hit the layer count case: changing the layer count by changing nz also invalidated every completion, so the fix was to drop a layer entry and leave nz alone.

The generator now asserts that no case raises more than two errors, so a future case that cascades fails the build rather than being described as isolated.

## The lesson beyond this fixture

When you build a set of negative tests, check that each one fails for the reason you think.

A cascading case still fails, so a suite of them still passes, and nobody notices that six of the seven rules are never actually exercised on their own. The test suite looks thorough and tests one thing repeatedly.

That applies far beyond decks. It is the same discipline as checking that a check counted what you expected it to count.

## Reading an error message

Two things to take from these messages.

They name the well. "Well Ekene-1 is outside the grid" is actionable; "a well is outside the grid" is not, on a field with seven of them.

They quote the values. The history message gives both dates, so the reader can see which one is wrong without opening the deck. A message that said "the first history period does not match the start date" would require a hunt.

Those are properties worth demanding of any validator you write.

## The misconception to avoid

"Seven rules means seven ways a deck can be wrong." It means seven ways a deck can fail to be BUILT. The number of ways a well-formed deck can be wrong about the field is unbounded, and the next lesson but one is about that gap.

## Exercise

First, six of the seven cases raise exactly one error and one raises two. Explain why the missing start date is genuinely coupled to a second rule.

Second, describe what went wrong when the well cases were first written, and state the general lesson about negative tests.
