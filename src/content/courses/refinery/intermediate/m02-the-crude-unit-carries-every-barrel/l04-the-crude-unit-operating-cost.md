# The crude unit operating cost

The equality row has a second job. It makes the crude unit's capacity a limit on crude, and it makes the crude unit's operating cost a charge on every barrel of crude. This lesson reads that charge, and the second half of this tier's trap.

{{panel:refinery-plan-explorer}}

## The charge on every barrel

ABUA's Crude distillation unit costs 1.2500 dollars a barrel to run. The plan prints:

crude unit operating cost for the month: 2536290.32 (1.2500 a barrel on every barrel of crude)

That is 1.2500 on each of the 2029032.26 barrels the month runs, printed by the plan. There is no crude barrel that escapes it, because there is no crude barrel that does not run through the crude unit.

All three units' operating costs, as the plan prints them:

| unit | throughput (bbl) | operating cost ($/bbl) | operating cost |
| --- | --- | --- | --- |
| Crude distillation | 2029032.26 | 1.2500 | 2536290.32 |
| Naphtha reformer | 407677.42 | 2.9000 | 1182264.52 |
| Diesel hydrotreater | 650000.00 | 1.8000 | 1170000.00 |

The plan's unit operating cost for the month is 4888554.84. It is the total of this column, and the plan prints it, so the lesson quotes it rather than adding.

## Why the plan cares

Operating cost enters the margin. The engine's formula is margin = product revenue - crude cost - unit operating cost. So the plan weighs every barrel of crude it might buy against three things: the crude's own price, the value of the streams it yields, and the 1.2500 dollars a barrel the crude unit charges to separate it. A crude barrel that would just pay for itself at its purchase price does not pay once the crude unit's charge is added. The plan knows that because the equality row puts the charge on the barrel.

The same is true of the downstream units. A barrel of naphtha sent through the reformer is charged 2.9000, and a barrel of gasoil through the hydrotreater 1.8000. Those charges are part of why a stream's value through a unit is what Module 4 prints.

## The trap, second half

Lesson 1 showed the configuration where the crude unit is given a feed stream that no crude makes. Read its operating cost:

crude unit throughput 0.00 bbl beside a crude run of 2029032.26 bbl; crude unit operating cost 0.00; margin 9614225.81 against 7077935.48 for the configuration as typed.

The crude run is 2029032.26 bbl in both. The crude is bought, and its streams are made and sold. But the crude unit runs 0.00 bbl, so its operating cost is 0.00, and nothing charges the crude barrels for distillation. The margin reads 9614225.81.

That figure is not a better refinery. It is a refinery whose distillation is free because the configuration forgot to say which unit distils. The margin as typed, 7077935.48, is the one that charges every barrel of crude, and it is the one a planner can defend.

So the trap has two halves, and this tier teaches both. A cargo typed as 0 and a cargo left blank are two different plans. And the crude unit's operating cost is charged on every barrel of crude only when the crude unit is feedless.

## Exercise

Read the crude unit operating cost for the plan as typed, 2536290.32, and the crude run, 2029032.26 bbl. Then read the configuration with a fed crude unit: crude run 2029032.26 bbl, crude unit operating cost 0.00, margin 9614225.81 against 7077935.48. Say what the two readings show about where the plan charges distillation, and which of the two margins describes a refinery that could actually run.
