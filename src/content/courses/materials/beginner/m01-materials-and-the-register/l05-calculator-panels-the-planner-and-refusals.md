# The calculator panels, the planner and the refusals

{{panel:materials-register-calculator}}

The practicals run in the course's own calculator panels, which call the same engine the lessons quote, and the Planner in the Suite is built on the same engine. The Suite app for this course is the Materials & Spares Planner, in the Suite's Midstream & Downstream module; the same inputs typed into it give the same figures. Everything this tier asks of you runs in the register calculator on this page.

## Three calculators, one a tier

| panel | tier | functions it calls |
| --- | --- | --- |
| the register calculator | Associate | criticality, abcClassification, eoq, slowMoving |
| the stock calculator | Professional | quantityDiscount, safetyStock, poissonStock |
| the spares calculator | Expert | insuranceSpares, poissonStock, leadTimeRisk |

## How the register calculator is laid out

A View selector picks the function. A Start from selector loads a stated case: the Ekene register's own cases, small cases that sit on a boundary, or a blank case with every input not stated. For a pasted case file with several calls, a block selector picks the block the view runs. Every input the call needs has a visible control, which shows the input as the box states it, or "not stated", and writes your choice into the box. Below the box the engine's results appear, with the reason beside each figure and the basis applied.

## A refusal is the engine's answer to a bad input

When an input is missing or cannot work, the engine returns no figure. It returns an error and the name of the field it refused, and the message starts with that name and states the condition that failed. Three to meet now.

Weights that add to 99:

> criteria weights must add to 100; they add to 99

A last class minimum that does not fall to 0:

> classes[1].minScore must be 0 so that every item takes a class; got 40

No usage value on any item at all:

> items must carry some annual usage value; every annualUsage x unitCost is 0

Each is a policy that cannot work. Each module of this tier shows the refusals of its own function. When a box carries an unknown key and also lacks a required input, the unknown key is refused first.

## A result with a reason is a result

An item below a class minimum takes the next class down, with a reason; an item with no usage has all its stock reported as excess, with a reason. Neither is a refusal. The course keeps the word refused for an input the engine would not accept.

## What is graded

Every graded number is a value the engine returns on fixed inputs written down in advance, so a graded question has exactly one right answer, quoted to six decimals as the panel prints it.

## Exercise

Produce each of the three refusals above in the register calculator. In "Criticality classes", on the Ekene start, lower the criterion 4 weight control from 10 to 9, read the message, and restore it. Then set the minimum score control of class 3 from 0 to 40: the message is the one above, with the index of the Ekene policy's last class. In "ABC by annual usage value", start from "Two items tied on value" and set every annualUsage in the box to 0. Copy the field each refusal names and check that the message begins with it. Last, choose the blank case from Start from and note which input the engine names first.
