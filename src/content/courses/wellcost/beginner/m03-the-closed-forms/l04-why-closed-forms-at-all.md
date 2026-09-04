# Why closed forms at all

A closed form buys you reproducibility and speed, and charges you in blindness.

{{panel:wc-time-explorer}}

## What a closed form is

A closed form is a formula you evaluate once. No iteration, no convergence, no time stepping, no initial guess. Put the arguments in, get the answer out, and get the same answer every time. All three duration formulas here are of that kind, and so is the rollup built on them.

## What it buys

**Reproducibility.** The engine is checked against an independent oracle written in another language, and the maximum absolute error across every activity duration, every stretched duration, every end hour and every total is zero. Not small. Zero. The cost curve and the cost per metre agree to zero as well.

**Speed.** A whole programme is a few dozen divisions, so it evaluates instantly. That is what makes the sweeps in this module possible, and what lets the risked run call the same evaluator thousands of times.

**Auditability.** Every hour in the schedule can be traced to one division with named arguments. When a partner asks why the intermediate section is 100 hours, the answer is 1,500 divided by 15, and the conversation is over.

**Invertibility.** Because the forms are simple you can run them backwards. Ask what rate of penetration the section would need to fit in four days and the answer is arithmetic, not a search.

## What it costs

A closed form can only see its own arguments.

The drilling form cannot know the formation hardened partway down the section, because depth dependent hardness is not one of its arguments. The trip form cannot know the hole was tight on the way out. The casing form cannot know the shoe would not go down.

It also cannot represent anything that varies within an activity. A rate of penetration is one number for the whole section, so a section that drills fast in sand and slow in shale has to be entered as two activities or as one blended rate.

And there is no memory. The engine has no learning curve, so the third identical section takes exactly as long as the first.

## The bargain

You accept a model that is blind to physics in exchange for a model nobody can argue with about arithmetic. Then you supply the physics yourself, in the rates you choose and in the allowance you apply on top.

## Exercise

Split the golden production hole into two drill activities with different rates that give the same 100 productive hours, and confirm the total is unchanged.

Then write down two things about your last well that no argument of these three formulas could have captured.
