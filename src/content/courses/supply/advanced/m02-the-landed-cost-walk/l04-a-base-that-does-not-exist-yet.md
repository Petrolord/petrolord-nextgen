# A base that does not exist yet

The walk freezes each base as it reaches it. The other side of that rule is that a charge cannot bite on a base the walk has not reached. A freight quoted as a percent of CIF is asking for a value that includes the freight itself and the insurance that comes after it. The engine does not try to untangle that. It refuses the line.

{{panel:supply-price-explorer}}

## What the walk refuses

The course puts four malformed charges to `landedCost`:

| the charge | the engine answers |
| --- | --- |
| freight typed as a percent of CIF | REFUSED: Ocean freight is a percentage of a value that is not formed until after freight. |
| freight typed as a percent of C&F | REFUSED: Ocean freight is a percentage of a value that is not formed until after freight. |
| a charge with the stage "customs" | REFUSED: Customs processing has an unknown stage "customs". |
| insurance on CIF at 100 percent | REFUSED: The insurance rates on CIF add up to 100 percent or more. |

The first two are the same refusal for the same reason. Ocean freight belongs to the freight stage. C&F is formed at the end of that stage and CIF after the next one. A freight line that names either as its base is a forward reference, and the engine names the line and the reason in one sentence.

## Why the engine refuses instead of solving

Insurance on CIF is also circular, and the previous lesson showed the engine solving it in closed form. So why refuse freight on CIF?

The difference is what each quote means. Insurance on CIF is the usual marine quote, and the engine carries the algebra for exactly that case, named and bounded. A freight quoted on a value that contains the freight has no such standing, and its likeliest reading is a slip in the basis: a percentage picked from the list where a per-tonne rate belonged. Solving it would turn a slip into a clean figure. The engine would print a freight line, the C&F above it would include that line, and nothing on the page would show that the base was one the walk had not formed.

A refusal leaves nothing to carry forward. The user sees which line is wrong and why, and fixes the basis.

## An unknown stage

The third row is a different kind of error. Every line in the import template carries one of the stages the walk knows: freight, insurance or landed. A charge typed with the stage "customs" is not a stage the walk knows, so the engine cannot place it in the order, and a line with no place in the order has no frozen base to bite on. The engine refuses it by name. It does not guess that customs probably means landed.

That is the same discipline as the unknown unit "kg" in the first module. A label the engine does not recognise is refused. In both cases it is left unmapped, and the nearest label the engine does recognise is not substituted for it.

## The order is data

Put the three kinds of refusal together and a rule appears. The walk's order is part of the input, carried by each line's stage, and the engine refuses a line whose base the order has not yet formed. A build-up the engine accepts has every percentage biting on a value that exists when the charge is applied.

## Exercise

Quote the engine's answer to freight typed as a percent of CIF and to freight typed as a percent of C&F, and the answer to a charge with the stage "customs". Then say what the first two answers, read side by side, show about which bases a freight-stage charge can name.
