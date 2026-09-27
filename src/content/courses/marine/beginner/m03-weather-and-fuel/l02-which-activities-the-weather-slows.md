# Which activities the weather slows

{{panel:marine-voyage-calculator}}

A weather factor on its own does not say enough. Bad weather slows sailing, and it can hold up cargo work alongside an installation, but loading at a sheltered shore base may carry on regardless. So the engine asks the plan to name the activities its factor applies to. This lesson shows how much that choice moves a voyage.

## The list is required

The input weather.appliesTo lists the activities the factor slows: any of "sailing", "port" and "field", at least one, none repeated. An activity the list does not name keeps its calm time. There is no assumed list. A plan that states a factor and names no activity is refused:

> weather.appliesTo must be an array naming at least one of "sailing", "port", "field"; got nothing

## The same milk run three ways

| weather factor | applies to | sailing hours | port hours | field hours | total hours | days |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | sailing, port, field | 18.727273 | 12.000000 | 23.000000 | 53.727273 | 2.238636 |
| 1.2 | sailing, field | 22.472727 | 12.000000 | 27.600000 | 62.072727 | 2.586364 |
| 1.2 | field, port, sailing | 22.472727 | 14.400000 | 27.600000 | 64.472727 | 2.686364 |

With the factor on sailing and field time, port time stays at 12.000000 hours. Named on port time as well, it becomes 14.400000 hours, and the voyage grows by those extra hours. The three rows differ only in what the weather input states. That is why a plan names both the factor and the activities: quoting "a weather factor of 1.2" alone leaves a reader unable to tell which of the last two rows was meant.

## Choosing the activities

The Ekene planner applied the allowance at sea and at the installations, where wind and swell act, and left the base alone. Sailing slows because the vessel meets head seas; field time slows because cargo work alongside an installation stops when the swell makes lifting unsafe. A sheltered base keeps loading in most weather. A planner whose base suffers the same weather, or whose crane stops in high wind, might name port time too. Neither choice is the rule; each is a stated input, and the course asks only that it is written down.

## Names the engine does not know

The engine knows three activities. A fourth name is refused, and the message lists the three it accepts:

> weather.appliesTo[1] must be one of "sailing", "port", "field"; got "standby"

A name given twice is refused as well:

> weather.appliesTo[1] repeats "sailing"

Standby time is real on a supply voyage. The engine has no activity for it, so a planner who wants it counted states it inside the port or field hours and names it in the plan.

## Exercise

In the voyage and fleet calculator, set View to "The voyage plan" and Start from to "Ekene PSV milk run, rainy season". Set "Weather applies to (stated)" to "sailing, port and field" and check the port hours and Total hours against the third row above. Set it to "sailing" alone and predict, before reading, which hour column returns to its calm figure. Then choose "not stated" and read the refusal. Finally, in the JSON box, add "standby" to the list and read the message the engine gives.
