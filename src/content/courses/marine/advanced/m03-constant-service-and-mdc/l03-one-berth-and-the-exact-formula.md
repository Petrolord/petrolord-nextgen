# One berth and the exact formula

{{panel:marine-base-calculator}}

At one berth the M/D/c approximation stops being an approximation. Put c = 1 into the Cosmetatos formula and the factor (c - 1) makes the correction zero, leaving exactly half the M/M/1 wait. That figure is the Pollaczek-Khinchin mean value formula for a single server with constant service, which Adan and Resing derive in s. 7.6 of Queueing Systems, eqs 7.14 to 7.16. One berth is where the course can check the M/D/c branch of the engine exactly.

## The formula in words

For one server with Poisson arrivals, the mean wait depends on the mean service time and on how spread the service times are. A vessel arriving at a busy berth waits for the call in progress to finish, and then for every call queued ahead of it. The more the service times vary, the longer the call in progress tends to have left, because long calls are more likely to be the ones under way when a vessel arrives. With constant service there is no spread, and the wait is rho S / (2 (1 - rho)), where S is the service time and rho the berth utilisation. An exponential service time has a spread as large as its mean, which doubles that figure to the M/M/1 wait.

## The check

The golden input base-md1-pollaczek-khinchin states one berth, a service of 1 hour and a berth utilisation of 0.900000.

| model | mean wait, hours (engine) | the formula (derived) |
| --- | --- | --- |
| M/D/c at one berth | 4.500000 | 4.500000 |
| M/M/c at one berth (golden input adan-resing-table-5-1-c1) | 9.000000 | |

The formula gives 0.9 times 1 over 2 times 0.1, which is 4.500000 hours, and the engine returns 4.500000. It is exactly half the M/M/1 wait of 9.000000 at the same load, the first row of Adan and Resing's Table 5.1.

## What the check proves, and its limit

The one berth case proves that the engine's M/D/c branch reduces to the exact formula where an exact formula exists, and that it starts from the M/M/c wait the previous module checked against the published tables. It does not prove the approximation's accuracy at two or more berths, where no exact formula exists to check against. That is why every M/D/c figure at several berths keeps the word approximation.

## The Ekene base at one berth

The Ekene base cannot run at one berth: its 3.2 arrivals a day with 8-hour calls exceed what one berth can serve, and the engine refuses it. A learner who lowers the arrivals below that bound can compare the two models on one berth with the Ekene service terms, and the half ratio returns.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "One berth, constant service". Read the Berth utilisation and Mean wait, hours tiles, and work rho S / (2 (1 - rho)) by hand from them. Set Queue model (stated) to M/M/c and read the wait again. Then start from "Ekene supply base, M/D/c", set Berths (stated) to 1 and Arrivals a day (stated) to 2, run it under both models, and check that the M/D/c wait is half the M/M/c wait.
