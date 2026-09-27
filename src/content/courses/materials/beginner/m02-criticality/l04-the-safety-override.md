# The safety override

{{panel:materials-register-calculator}}

A weighted score averages. That is its strength, and for safety it can be a weakness: a part whose failure would put people at risk can still score modestly if it is cheap to replace and has a backup. The override is the policy's way of saying that some consequences are never averaged away.

## A maximum score forces the top class

The Ekene policy names one override criterion, safety. An item that scores the maximum on safety takes class V whatever its weighted score. The pressure safety valve repair kit for separator V-101 is the case the register plants. Its contributions are 40.000000 for safety, 12.000000 for production, 12.000000 for lead time and 4.000000 for redundancy, a weighted score of 68.000000. By score alone that is class E, two short of the V minimum. With the override it is V, and the engine's reason says both, verbatim:

> PSV-KIT: scores the maximum 5 on safety, which places an item in class V whatever its weighted score (68, class E by score alone)

The reason keeps the score in view. Whoever reads the class can see it came from the override, and what the score alone would have given.

## One below the maximum does nothing

The override fires on the maximum score only. On two stated cases with a scale of 10, one scoring 10 on the override criterion and one scoring 9, the first is forced to the top class and the second keeps the class its score gives:

> X: scores the maximum 10 on s, which places an item in class V whatever its weighted score (50, class E by score alone)

> X: weighted score 45 is at or above 40, the minimum for class E, and below 70 for class V

A policy may name more than one override criterion. On a stated case naming two, an item at the maximum on either is forced to the top class, and each reason names the criterion that forced it.

## Stating none is a statement

The override list must always be stated. A policy with no override states an empty list; leaving the list out is refused:

> topClassOnMaxScore must be an array of criterion ids (empty for none)

Each id in the list must be one of the policy's criteria. On a stated case whose criteria are s and p, naming safety is refused:

> topClassOnMaxScore[0] must be a criterion id (s, p); got safety

That is the engine asking you to decide. An override list quietly assumed empty would drop a safety part to a lower class without anyone having chosen it.

The override changes the class only; the weighted score stays as it was, available for ranking inside a class.

## Exercise

Open the register calculator in "Criticality classes" on the Ekene start. Find PSV-KIT and copy its class and reason. Type none in the override criteria control, and note PSV-KIT's new class and the new count in each class. Then empty the control so it reads not stated, and copy the refusal. Last, start from "A maximum score on the override criterion" and then "One below the maximum on the override criterion", and write one sentence on why the two classes differ.
