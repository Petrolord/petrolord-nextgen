# Fill-up

"Fill-up" is one of the more overloaded words in waterflooding. It means at least two different things, both of them real, and the ledger can only see one of them. This lesson separates them and then shows the three answers the ledger gives when you ask when fill-up happened.

## Two meanings

**Gas fill-up** is physical. A reservoir that has fallen below its bubble point has free gas in the pore space. Water injected into that reservoir first has to refill the space the gas occupied before the producers see any response at all. Until that space is full, injected water displaces gas rather than oil, and the producers carry on declining as though nothing had changed. That is a real, dated event with a volume attached to it, and the Expert tier's forecast models it explicitly.

**Voidage fill-up** is a bookkeeping milestone. It is the moment when cumulative injected voidage first equals cumulative produced voidage, that is, when the cumulative VRR first reaches 1.0. It marks the point where the flood has, on the whole record, replaced everything it has taken.

Ekene has no free gas, so it has no gas fill-up. It does have a voidage fill-up, and that is the one the ledger reports.

## When Ekene fills up

The cumulative VRR series climbs monotonically from 0.85 and crosses 1.0 at the twelfth period:

$$\text{index } 11, \quad \text{label } 2023\text{-}12, \quad \text{value } 1.0040017280735174$$

Twelve months after the flood started. That is the deficit built up during the commissioning ramp being paid back by the 1.05 hold. Five months of under-injection took seven months of five percent over-injection to clear.

The engine returns this as a small record: the index, the label, and a flag called `startedAbove` which is false here.

## The three answers

`findFillUp` can return three different things, and each one means something specific.

**A crossing with `startedAbove: false`**, as Ekene's field record gives. The record contains the crossing. You can point at the month.

**A crossing with `startedAbove: true`.** The very first defined cumulative VRR in the record is already at or above 1.0. The function reports the first period, but the flag says the crossing itself is not in the data: the flood was already in surplus when the record starts. The Professional tier meets exactly this on the North element, which reports index 0, label 2023-01, `startedAbove: true`.

**Null.** The cumulative VRR never reaches 1.0 anywhere in the record. The South element returns this, because it never gets close.

Those three are genuinely different states of knowledge, and collapsing them into a date would be a lie in two of the three cases. A tool that returned "2023-01" for the North element without the flag would be asserting that a crossing happened in that month, which the data cannot support.

{{panel:wf-ledger-explorer}}

The pink dashed vertical line marks fill-up on the field record. Note where it sits relative to the point where the instantaneous VRR first reached 1.0, which was seven months earlier. Instantaneous crossing and cumulative crossing are different events and the gap between them is the size of the debt.

## Why the milestone matters operationally

Before voidage fill-up, the flood is still paying off a pressure deficit and you should not expect the pressure to be back at its pre-flood level. After it, further injection at above replacement is building genuine new margin. It is a useful line to draw in a report because it separates recovery from gain.

It is also the point at which the argument about injection rate changes character. Before fill-up, "should we inject more" has an easy answer. After it, the honest question is whether the extra water is buying pressure you need or simply cycling through the reservoir, and that question needs the pattern-level view the Professional tier builds.

## What fill-up does not tell you

It says nothing about where the water went. A field can reach voidage fill-up on schedule with every barrel of it channeling through a single high permeability streak between one injector and one producer, arriving at the producer without displacing anything. The cumulative VRR would look identical. Fill-up is a volume statement, and volume statements are blind to geometry.

## The misconception to avoid

"Fill-up means the producers will now respond." That is the gas fill-up meaning, and it only applies to a reservoir that had free gas to displace. On an undersaturated field like Ekene, response timing has nothing to do with the voidage fill-up date. Ekene-6 saw water in March 2024, three months after voidage fill-up, and Ekene-1 not until much later, and neither date is explained by the fill-up milestone.

## Exercise

First, Ekene ran five months of ramp below target and then 1.05 thereafter. Given that fill-up landed at period index 11, count how many months of 1.05 were needed to clear the ramp deficit, and compare that with the number of ramp months. Explain the ratio in one sentence.

Second, describe a field record in which `findFillUp` would return `startedAbove: true`, and state what additional information you would need to request in order to date the actual crossing.
