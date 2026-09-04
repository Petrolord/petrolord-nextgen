# The no touch time

The answer an operations room wants is a number of hours, and it is a time constant multiplied by a logarithm of two temperatures somebody else chose.

{{panel:pd-line-explorer}}

## The answer and where each piece comes from

The published cooldown falls from 150.0 degF towards a 40.0 degF ambient and is asked for the time to reach 70.0 degF. The time constant is 3.588690771912 hr, the log term is ln((150.0 - 40.0)/(70.0 - 40.0)) = 1.299282984130, and the product is 4.662724855250 hr. The oracle, working in SI seconds, gets 4.662725032604 hr.

The time constant is the pipe. The log term is the two temperatures. Only one of those is an engine quantity.

## The station table runs past the answer

`cooldownTime` returns 25 stations covering 1.5 times the answer, so the target is not the last row.

| Station | t, hr | Temperature, degF |
| --- | --- | --- |
| 08 | 2.33136243 | 97.4456264654 |
| 12 | 3.49704364 | 81.5134772569 |
| 16 | 4.66272486 | 70.0000000000 |
| 20 | 5.82840607 | 61.6797064344 |
| 24 | 6.99408728 | 55.6669890360 |

Station 16 lands on 70.0000000000 degF exactly, which is the answer. Station 24 reads 55.6669890360 degF at 6.99408728 hr, and it is not a failure or a limit: it is the same exponential continued past the question. Reading the last station as the end of the cooldown invents every hour between 4.66272486 and 6.99408728.

## The target is not the engine's opinion

Nothing in either module computes where the hydrate boundary is, so the target is a laboratory input every time. Which laboratory number to use is a separate decision, and on a gas line it is usually not the flowing one. TEACHING LINE AKASO SPUR has a flowing hydrate boundary of 71.00 degF and a boundary of 78.00 degF once the line packs up after a shutdown, both teaching inputs chosen for it. Cooling it from 120.00 degF towards the 45.00 degF seabed to reach 71.00 degF gives a log term of 1.0593915755 and a no-touch time of 9.1117122206 hr.

Ask for the wrong one of those two boundaries and the whole answer moves, without any engine number changing.

## What the hours do not include

The time is to a temperature, not to a blockage. Hydrate formation needs subcooling, water and time, and `cooldownTime` models none of the three. It assumes one temperature for the whole line, a constant ambient, no phase change, no depressurisation and no restart. What it returns is when the lumped contents cross a number, which is the earliest fact in the sequence rather than the operationally interesting one.

## The careful mistake

Quoting a no-touch time without quoting the target it was measured to. The pipe half of the answer is reproducible to eight figures across two independent implementations. The temperature half is a laboratory reading, and it is the half that decides whether a crew has nine hours or none.

## Exercise

Run the published cooldown to a 70.0 degF target and record the hours and the station at which the table crosses it.

Then say what changes in the answer if the target moves and the pipe does not.
