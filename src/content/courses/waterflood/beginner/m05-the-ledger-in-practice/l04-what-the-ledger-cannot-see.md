# What the ledger cannot see

This tier has built a complete field-level flood ledger and tested it against pressure. Everything in it is correct. This lesson is about what it structurally cannot tell you, because knowing the edge of a tool is the last thing you learn about it and the first thing you need.

## It cannot see where the water went

The field ledger sums every injector and every producer into one number per month. That sum is blind to geometry by construction. Two floods with identical field ledgers, one distributing water evenly and one sending every barrel down a single fracture to one producer, are indistinguishable at this level.

That is not a hypothetical. Split the Ekene record by which producers each injector actually supports, and the field's comfortable cumulative 1.034899536109 becomes two very different elements, one substantially over-injected and one substantially starved. The field number was never wrong. It was an average of two numbers that should not have been averaged.

Building that split is the first thing the Professional tier does.

## It cannot see injectivity

The ledger knows how much water went in. It does not know how hard it was to put it there. Ekene-4's injectivity degrades by thirty percent partway through the record, and the ledger shows nothing at all, because the field kept hitting its volume target by pushing harder.

Injectivity lives in the injection PRESSURE, which the ledger schema does not carry. The daily surveillance schema does carry it, and the Professional tier's Hall plot analysis is entirely about extracting a degradation signal from it. There is a further twist there worth waiting for: the same data gives two different answers depending on a pressure convention, and only one of them finds the problem.

## It cannot see the water arrival mechanism

Producers start making water. The ledger records the volume, and the volume enters the produced voidage, and that is the end of its interest. But water arriving because the flood front has swept the rock between injector and producer is a success, and water arriving because it channelled down a high permeability streak without displacing anything is a failure, and they look the same in a volume column.

Telling them apart requires the SHAPE of the water oil ratio over time, which is the Chan diagnostic, and again that is the Professional tier.

## It cannot see sweep

The deepest limit. The ledger is a volume balance, and volume balances have no concept of efficiency. A flood can be at a perfect VRR forever while contacting a small fraction of the reservoir. Nothing in this tier can tell you what fraction of the rock the water actually swept, because that question requires a model of the displacement and the geometry, not a count of barrels.

The Expert tier builds that model, and then does something better than build it: it checks the model against the field. The result on Ekene is arresting. The forecast says the observed injection rate could not flood the pattern element in thirty years, and yet one producer saw water in fourteen months. Reconciling those two facts gives a quantitative measure of how little of the reservoir the water actually contacted, and it is a small number.

## What the ledger CAN do, and why it is still the foundation

None of this makes the field ledger a weak tool. It is the tool that:

- is computable every month from data you already collect
- has a direct, testable relationship with reservoir pressure
- has no free parameters, so two engineers computing it get the same answer
- fails loudly when its inputs are incomplete

Everything the higher tiers build is built on top of it, and every one of them introduces judgement that the field ledger does not require. Allocation factors are somebody's opinion. Chan classifications are indicative. Sweep forecasts carry warnings about their own assumptions. The field ledger is the last completely objective number in the whole subject, and that is why it comes first.

## The habit to take forward

When someone hands you a flood surveillance conclusion, ask which level it came from. A statement about pressure can be settled at the field level. A statement about which injector to turn down cannot: it needs allocation, and allocation is an assumption. A statement about ultimate recovery needs sweep, and sweep is a model. The confidence you can attach to a conclusion is set by the weakest input it depends on, and the levels get weaker as they get more useful.

## The misconception to avoid

"The higher tiers supersede this one." They extend it. The Professional tier's pattern VRR is computed with the same voidage equation from this tier, applied to allocated subsets. The Expert tier's forecast is checked against this tier's ledger. If the field ledger is wrong, everything above it is wrong and nothing above it will reveal that. Get this level right first, every time.

## Exercise

First, list the four limits named above and, for each, name the specific diagnostic in a later tier that addresses it and the specific extra data it requires.

Second, a colleague proposes cutting Ekene-4's injection because the field VRR is above target. Write three sentences explaining what you would need to know before agreeing, and which of those things the field ledger can supply.
