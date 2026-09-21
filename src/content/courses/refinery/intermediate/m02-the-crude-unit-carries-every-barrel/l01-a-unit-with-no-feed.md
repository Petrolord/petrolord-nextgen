# A unit with no feed

Every unit in a configuration names the stream it consumes, except one. ABUA's Crude distillation unit has a blank in its feed column. This lesson reads what the plan does with that blank, and why it is the most important cell in the unit table.

{{panel:refinery-plan-explorer}}

## The feedless unit is the crude unit

The lab states the rule in its configuration table: a unit with no feed is the crude unit. It consumes no stream because it takes crude, and its yields are the crude yields. A reformer turns naphtha into reformate. A crude unit turns crude into every stream at once.

The plan identifies the crude unit from the configuration itself, by finding the unit with no feed. The unit table in the plan carries a column that says so:

| unit | crude unit |
| --- | --- |
| Crude distillation | true |
| Naphtha reformer | false |
| Diesel hydrotreater | false |

## The equality row

Having found the crude unit, the plan writes one constraint that ties crude to it. The course gives it in words: every barrel of crude runs through the feedless unit, by an equality row, crude run = crude unit throughput.

Whatever volume of crude the plan decides to buy, the crude unit must run exactly that volume. Crude that is bought is crude that is distilled.

That single row does two jobs. It makes the crude unit's capacity a limit on how much crude the month can run. And it makes the crude unit's operating cost a charge on every barrel of crude.

## When no unit is feedless

The row is written only when some unit has no feed. If every unit in a configuration names a feed stream, the plan finds no crude unit and writes no equality row.

The lab shows what that means by giving ABUA's crude unit a feed stream that no crude makes, so that no unit is feedless. Then:

crude unit throughput 0.00 bbl beside a crude run of 2029032.26 bbl; crude unit operating cost 0.00; margin 9614225.81 against 7077935.48 for the configuration as typed.

The crude is still bought and its streams still appear. The unit that was meant to distil it runs nothing. The lab's own reading: a configuration whose crude unit is not feedless has no crude unit in the plan, and its capacity and operating cost bind nothing.

The course shows that reading as well as stating it. In that configuration the crude unit utilisation reads 0.00 percent, and the margin difference from the configuration as typed is 2536290.33. The same configuration with that unit's capacity typed as 0 gives margin 9614225.81, and the course prints the same margin: true. Shutting a unit that binds nothing changes nothing.

Typing a feed against the crude unit is a configuration error. The plan still solves, and it still prints a margin.

## What to check first

Before you read any plan, read the unit table's crude unit column. Exactly one row should read true, and it should be the unit you think distils crude. If none reads true, every figure downstream of it is the plan of a refinery with no crude unit.

## Exercise

Read the configuration where the crude unit is given a feed: crude unit throughput 0.00 bbl, crude run 2029032.26 bbl, utilisation 0.00 percent, margin 9614225.81, and the same margin with its capacity typed as 0. Set it beside the configuration as typed, margin 7077935.48. Say which figures in the pair show that the equality row was not written, and why a planner should not believe the margin of the first configuration.
