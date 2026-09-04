# Trouble time and the allowance

The allowance is a stretch on productive time, not a share of elapsed time, and reading it the second way leaves you short of days.

{{panel:wc-time-explorer}}

## What the engine actually does

The allowance enters as one fraction, `nptFrac`. The engine forms a stretch factor of one plus that fraction and multiplies every productive duration by it.

A fraction of 0.125 therefore means every activity runs 12.5 percent longer than its closed form says, and the non-productive hours come out at 12.5 percent of the productive hours.

That is the trap. Twelve and a half percent of the productive hours is not twelve and a half percent of the elapsed hours, because the elapsed hours contain the added time as well.

## The arithmetic

With productive hours P and fraction f, the non-productive hours are f times P and the elapsed hours are P times one plus f. The non-productive share of elapsed time is f divided by one plus f, always smaller than f.

On the golden case 0.125 divided by 1.125 is exactly one ninth, so the allowance called 12.5 percent is 11.11 percent of elapsed time. The gap widens as the allowance grows.

| Allowance f | Productive hr | NPT hr | Elapsed hr | Days | NPT share of elapsed |
| --- | --- | --- | --- | --- | --- |
| 0 | 384 | 0 | 384 | 16 | 0 |
| 0.05 | 384 | 19.2 | 403.2 | 16.8 | 4.76% |
| 0.10 | 384 | 38.4 | 422.4 | 17.6 | 9.09% |
| 0.125 | 384 | 48 | 432 | 18 | 11.11% |
| 0.20 | 384 | 76.8 | 460.8 | 19.2 | 16.67% |
| 0.25 | 384 | 96 | 480 | 20 | 20.00% |
| 0.30 | 384 | 115.2 | 499.2 | 20.8 | 23.08% |
| 0.40 | 384 | 153.6 | 537.6 | 22.4 | 28.57% |
| 0.50 | 384 | 192 | 576 | 24 | 33.33% |

At an allowance of 0.5 the trouble time is half the working time, and still only a third of elapsed time.

## What it costs you to misread it

Suppose you intend non-productive time to be 12.5 percent of the time the rig is on location, and you type 0.125 into the field. The schedule that delivers that intention is 18.285714285714285 days. You get 18, so you are 0.2857142857142847 days short.

At 0.25 the intended schedule is 21.333333333333332 days against the engine's 20, a shortfall of 1.3333333333333321 days. At 0.5 it is 32 days against 24, and you are 8 days light.

To express a genuine share of elapsed time, invert it: enter the intended share divided by one minus that share.

## Two things the stretch does not change

Look down the productive column. It reads 384 at every allowance. The stretch never touches the closed forms, so it cannot change how long the work itself takes.

The proportions do not move either. Every activity is stretched by the same factor, so each keeps its share of the total, and the maximum drift in those shares across the whole sweep is exactly zero.

## Exercise

Set the allowance to 0.30. Predict the elapsed hours from 384 before reading them, then predict the share of elapsed and check it against 23.08 percent.

Sweep from 0 to 0.5 and record the productive hours at each step. Say in one line what an unchanging productive column proves.

Work out the fraction that makes non-productive time a true quarter of elapsed time, and confirm it in the panel.
