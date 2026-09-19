# A unit with no feed

Every unit in a configuration names the stream it consumes, except one. ABUA's Crude distillation unit has a blank in its feed column. This lesson reads what the plan does with that blank, and why it is the most important cell in the unit table.

{{panel:refinery-plan-explorer}}

## The feedless unit is the crude unit

The digest states the rule in its configuration notes: a unit with no feed is the crude unit. It consumes no stream because it takes crude, and its yields are the crude yields. A reformer turns naphtha into reformate. A crude unit turns crude into every stream at once.

The planner does not tick a box saying "this is the crude unit". The plan identifies the crude unit from the configuration itself, by finding the unit with no feed. The unit table in the plan carries a column that says so:

| unit | crude unit |
| --- | --- |
| Crude distillation | true |
| Naphtha reformer | false |
| Diesel hydrotreater | false |

## The equality row

Having found the crude unit, the plan writes one constraint that ties crude to it. The digest gives it in words: every barrel of crude runs through the feedless unit, by an equality row, crude run = crude unit throughput.

Read that as the physical fact it is. Whatever volume of crude the plan decides to buy, the crude unit must run exactly that volume. No more, because it has nothing else to run. No less, because crude that is bought is crude that is distilled.

That single row does two jobs. It makes the crude unit's capacity a limit on how much crude the month can run. And it makes the crude unit's operating cost a charge on every barrel of crude. Lessons 3 and 4 read each job in turn.

## When no unit is feedless

The digest is exact about when the row exists: it is written only when some unit has no feed. If every unit in a configuration names a feed stream, the plan finds no crude unit and writes no equality row.

The digest shows what that means by giving ABUA's crude unit a feed stream that no crude makes, so that no unit is feedless. Then:

crude unit throughput 0.00 bbl beside a crude run of 2029032.26 bbl; crude unit operating cost 0.00; margin 9614225.81 against 7077935.48 for the configuration as typed.

The crude is still bought and its streams still appear. The unit that was meant to distil it runs nothing. The digest's own reading: a configuration whose crude unit is not feedless has no crude unit in the plan, and its capacity and operating cost bind nothing.

This is what the engine does with that configuration, and it is the reason the feed column matters. Typing a feed against the crude unit is a configuration error. The plan in the digest still solves, and it still prints a margin.

## What to check first

Before you read any plan, read the unit table's crude unit column. Exactly one row should read true, and it should be the unit you think distils crude. If none reads true, every figure downstream of it is the plan of a refinery with no crude unit.

## Exercise

Read the configuration where the crude unit is given a feed: crude unit throughput 0.00 bbl, crude run 2029032.26 bbl, crude unit operating cost 0.00, margin 9614225.81. Set it beside the configuration as typed, margin 7077935.48. Say which figures in the pair show that the equality row was not written, and why a planner should not believe the margin of the first configuration.
