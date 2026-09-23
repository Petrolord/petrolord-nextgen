# Asymptotic and exact limits

{{panel:dq-monitor-explorer}}

The EWMA chart has two sets of limits. The asymptotic limits are target +/- L sigma sqrt(lambda / (2 - lambda)), the same every day. The exact limits multiply the variance by 1 - (1 - lambda)^(2t), so they start narrow and widen towards the asymptotic pair. On EKENE-3 with lambda 0.2, L 3, a target of 611.380000 psig and sigma 3.774063 psi from phase one, the asymptotic limits are 607.605937 and 615.154063. The exact limits on day 1 are 609.115562 and 613.644438, and by day 35 they read 607.605937 and 615.154063.

| day | exact lower | exact upper | asymptotic lower | asymptotic upper |
| --- | --- | --- | --- | --- |
| 1 | 609.115562 | 613.644438 | 607.605937 | 615.154063 |
| 2 | 608.480105 | 614.279895 | 607.605937 | 615.154063 |
| 3 | 608.138135 | 614.621865 | 607.605937 | 615.154063 |
| 5 | 607.814308 | 614.945692 | 607.605937 | 615.154063 |
| 10 | 607.627756 | 615.132244 | 607.605937 | 615.154063 |
| 20 | 607.606188 | 615.153812 | 607.605937 | 615.154063 |
| 35 | 607.605937 | 615.154063 | 607.605937 | 615.154063 |

## Why the early days are narrower

The EWMA starts at the target. On day 1 it holds lambda of one reading and 1 - lambda of the target, which has no scatter of its own, so the EWMA on day 1 varies less than it will once several readings have entered. The exact variance says this in its factor 1 - (1 - lambda)^(2t): small at t = 1, and closer to 1 every day. The asymptotic limits use the factor's final value from the start. On EKENE-3 the two pairs agree to six decimals by day 35.

## The engine's default

The engine's default is asymptotic, with L 3, and it cites NIST/SEMATECH 6.3.2.4 for both. The NIST example uses lambda 0.3, a target of 50 and s 2.0539, and the engine's asymptotic limits on it are 52.588432 and 47.411568. The exact limits are a stated option, `limits: 'exact'`, and the result's basis block names which pair was drawn.

## What the choice changes

Only the early days differ, and only near a limit can the choice change a signal. An early reading that moves the EWMA sharply can cross an exact limit that sits inside the asymptotic one. A chart started just after a process change, or restarted on a new phase one, spends its first days in that narrow stretch, and that is where the exact limits earn their place. A chart that has run for weeks reads the same either way, because the two pairs have met.

On EKENE-3 the asymptotic chart signals on days 8, 9, 13, 14, 22, 27 to 34, 36 and 38. Whether the exact chart signals on the same days is something to read from the panel, and the exercise asks you to.

## A limit that moves is still a control limit

Both pairs are computed from the target and sigma taken from phase one. Neither is a specification or a plausibility range. The exact pair moves with t because the variance of the EWMA moves with t, and the note that reports a signal against it says which pair was used and on which day.

## Exercise

In the panel's EWMA view, run EKENE-3's forty days with the asymptotic limits and then with the exact ones. List every day whose signal differs between the two runs, or write that none does. Then, in the panel's exact run, find the first day on which the exact upper limit is within 0.01 psi of 615.154063, and say in one sentence what that tells you about when the choice matters.
