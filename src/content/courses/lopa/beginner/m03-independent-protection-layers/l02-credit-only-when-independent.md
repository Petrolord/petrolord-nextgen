# Credit only when independent

{{panel:lp-worksheet}}

Credit is a flag applied, and it is never assumed. The engine states its rule in one line, verbatim: "an IPL is credited once, and only when flagged independent === true and not flagged auditable === false". A layer on the list is a claim. A layer credited into the frequency is a claim the analyst has asserted in the one form the engine accepts.

## Exactly true

The test is on the value `true` itself. An IPL whose `independent` is the string "yes" is not credited. A missing flag is treated the same way. In each case the engine lists the layer under `notCredited` with its reason, verbatim: "not flagged independent (independent must be true to take credit)".

This strictness is a declared choice. The alternative would have been to read any affirmative looking value as independence, which is friendlier to type and quietly credits a layer nobody ever asserted anything about. The engine does not take that route. A layer enters the frequency only when somebody has written down that it is independent, in the form the engine checks.

## What ORONI's four layers do

| what the engine did | IPL | reason, verbatim |
| --- | --- | --- |
| credited | high level alarm with operator response |  |
| credited | relief valve sized for the blocked outlet case |  |
| not credited | BPCS level trip on the initiating controller | not flagged independent (independent must be true to take credit) |
| not credited | operator round on a procedure never audited | flagged not auditable |

The BPCS level trip is the interesting one. It is a real trip and it would very likely act. It is flagged not independent because it sits on the initiating controller, and the initiating event on this row is that same controller's valve failing open. A layer that shares its hardware with the cause of the scenario is not a second chance. The analyst made that judgement and the flag records it.

## What crediting everything would have done

| quantity | engine key | value |
| --- | --- | --- |
| product of the credited IPL PFDs | `iplProduct` | 0.001000000000 |
| mitigated frequency without a SIF, per year | `mitigatedFrequencyWithoutSifPerYr` | 0.000013500000 |

With all four IPLs credited the mitigated frequency reads 0.000000135000 per year against 0.000013500000, which is 100.000000 times lower. The required risk reduction factor falls from 13.500000 to 0.135000, and the outcome moves from SIL1 to NO_SIF_REQUIRED.

That is the whole weight of two flags. Two entries nobody argued about would take this row from needing a safety instrumented function to needing none at all, and the worksheet would look perfectly orderly either way. The reason to be strict about the flag is on this page, in those two numbers.

## The flag records a judgement the engine cannot make

Nothing in the engine can look at a level trip and decide whether it shares a sensor, a logic solver, a power supply or a maintenance crew with the initiating cause. That work is done in the room. The flag is where its conclusion is written down, and the engine applies it consistently and prints every layer it set aside with the reason attached.

Read the uncredited list first when a worksheet arrives. Two entries there are the difference between a required risk reduction factor of 13.500000 and one of 0.135000.

## Exercise

ORONI's credited product is 0.001000000000 and its mitigated frequency is 0.000013500000 per year. Work out what the credited product becomes when all four IPLs are credited, and check that it carries the frequency to the 0.000000135000 per year quoted above. Then write one sentence saying what evidence would have to appear before the BPCS level trip could be flagged independent on this row.
