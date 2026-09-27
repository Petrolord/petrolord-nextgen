# Criticality and ABC side by side

{{panel:materials-register-calculator}}

The register now carries two classes for every item, and they answer two different questions. The criticality class weighs the consequence of a stockout. The ABC class weighs the money that flows through the item. This lesson puts them side by side on the Ekene register and shows why a policy keeps both, and keeps them apart.

## Two classes, two questions

| id | criticality class | ABC class, at-or-below |
| --- | --- | --- |
| ESP-MTR | V | A |
| MECH-SEAL | V | B |
| PSV-KIT | V | C |
| CHK-BEAN | E | B |
| BARYTE | D | A |
| CSG-958 | D | A |
| HEAT-TRC | D | C |

The corners of this table are where the lesson lives. The ESP motor is V and A: it would hurt to run out, and it is expensive to hold. Almost any policy watches it closely.

PSV-KIT is V and C. Its safety score forces it into the top criticality class, but six kits a year at 3800 each carry little money. An ABC review alone would put it at the bottom of the pile; a criticality review puts it at the top.

BARYTE is D and A. The Ekene policy scores it low on every criterion, so a stockout is judged a nuisance. But 300 tonnes a year at 260 each is a lot of money, and it ranks fifth by value. A criticality review alone would overlook it; an ABC review makes it a candidate for careful ordering, which is exactly what the economic order quantity module takes up next.

## Keep the words apart

The course keeps the two terms distinct. A criticality class is the class the stated criteria, weights and minimums give: V, E and D in the Ekene policy. An ABC class is a stated cut-off applied to stated usage. "PSV-KIT is class V" and "PSV-KIT is class C" are both true, and each sentence is incomplete without the scheme it refers to. Say "criticality class V" and "ABC class C", and a reader never has to guess.

## What each class drives

A criticality class suits decisions about consequence: which items to hold as spares at all, how much protection to give, how fast to expedite. An ABC class suits decisions about effort and money: how often to count and review, which order sizes deserve a careful calculation, where to negotiate prices. The later tiers of this course set stock targets and size spares; this tier's job is to compute both classes cleanly and quote each with the policy it came from.

## Nine combinations

Three criticality classes and three ABC classes make nine combinations, and a real register usually fills most of them. Counting items in each cell is a quick way to see what a policy is really doing, and whether its cut-offs and weights put effort where the operator means it to go.

## Exercise

Open the register calculator. In "Criticality classes", on the Ekene start, copy every item's criticality class. In "ABC by annual usage value", on "The Ekene register, at-or-below", copy every item's ABC class. Build a three by three grid, criticality classes down the side and ABC classes across the top, and write each item's id in its cell. Name the items in the V and C cell and in the D and A cell, and write one sentence for each on what a policy should do about them. Then switch to include-crossing and see which ids move between cells.
