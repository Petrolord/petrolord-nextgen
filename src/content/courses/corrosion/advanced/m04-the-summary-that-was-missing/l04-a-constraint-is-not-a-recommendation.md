# A constraint is not a recommendation

{{panel:fc-inhibitor-integrity-explorer}}

A summary that names the governing limit is a useful thing and a dangerous one, because it reads like advice. It is not advice. The binding constraint names the limit that governs the number the module computed, and it is silent about what to buy, when to inspect and what thickness to retire at, because the module has none of those.

## The line between the two

Naming a limit is a statement about the calculation. Recommending an action is a statement about the world, and it needs things this module does not carry: a standard, a cost, an operating context and a consequence. The engine stops at the first kind. When it says that slowing the line changes this answer before anything else does, it is describing the sensitivity of its own output rather than telling anyone to slow the line.

Keep that boundary visible while reading, because the sentences are written in plain English and plain English sounds like guidance.

## The clearest case in the module

The sour-service door is where this line is drawn hardest. It compares one H2S partial pressure against one threshold, reports the comparison in bar and in psia with the decades above it, and stops. It does not classify a severity region and it does not recommend a material. Both of those are withdrawn, and the engine declares the absence in two fields: `regionProvided` false and `materialGuidanceProvided` false.

A material recommendation is a statement about the world. What steel to buy, when to control hardness and when to qualify weldments all need a standard, and this repository has none. So the module names a limit and declines to name an action, and the declining arrives as a field rather than a silence. The binding constraint follows the same pattern. It tells you which limit governs. It does not tell you what to do about it.

## What the constraint still does not know

Read the four constraint types against the not-provided list and the gap is obvious. A stream binding on the corrosion allowance against the design life has no retirement thickness attached to it and no inspection interval, and the module cannot supply either. A stream binding on wall shear has no erosional velocity criterion beside it, because this engine has no erosional-velocity criterion and computes a wall shear for the different purpose of deciding whether a corrosion inhibitor film survives. A stream binding on the model not applying has no sulphide stress cracking criterion and no hydrogen induced cracking criterion, because both need the standard and the standard is not in this repository.

## How to use one properly

Take the constraint as the first line of an argument you then have to make. It tells you where to look and what the module thinks is governing. The decision is made by somebody with the standard, the operating history and the cost, and the constraint is a well-ordered input to that conversation rather than a substitute for it.

## Exercise

Take a stream that binds on wall shear and write down the constraint sentence the engine returns. Underline the part that is a statement about the calculation. Then list what you would need to bring from outside this module to turn the remaining part into a decision.
