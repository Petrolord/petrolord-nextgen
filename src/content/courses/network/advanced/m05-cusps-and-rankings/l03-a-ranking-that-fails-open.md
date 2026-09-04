# A ranking that fails open

`diagnose` names a bottleneck on every network it is handed. It has no way of saying it is unsure.

{{panel:pd-fight-explorer}}

## What the ranking is built to do

The bottleneck is the branch eating the most pressure per unit of what it carries, not the branch with the biggest drop. On the shipped gate fixture the two answers separate on purpose: the trunk takes 250.000000 psi carrying 40300.000000 lb/d, an intensity of 6.203474e-3 psi per lb/d, and the choked flowline takes 150.000000 psi carrying 300.000000 lb/d, an intensity of 5.000000e-1. The biggest drop is the trunk and the ranking picks the choked leg, because a trunk carrying everything is supposed to have the biggest drop.

## What it says about the teaching network

On AGBADA WEST the biggest drop is e1, the AGBADA-2 flowline, at 476.806786 psi. The bottleneck is e3, the AGBADA-9 flowline, at an intensity of 1.018377e-1 against e1 at 7.940329e-2. The AGBADA-9 flowline buys 406.581740456 psi of drop with only 3992.446687538 lb/d, while e1 spends more pressure moving 6004.874117054 lb/d.

## The guard that is not a floor

The intensity is the pressure drop over the mass, with one guard at a billionth of a pound a day. It stops a division by zero and nothing else. A derived sweep puts a leg carrying almost nothing on a network with one psi across it, and the ranking answers anyway.

| Whisper leg mass, lb/d | Intensity | Bottleneck | Biggest drop |
| --- | --- | --- | --- |
| 1.00e-8 | 1.000000e+8 | whisper | main |
| 1.00e-6 | 1.000000e+6 | whisper | main |
| 1.00e-3 | 1.000000e+3 | whisper | main |
| 1.00e+0 | 1.000000e+0 | whisper | main |
| 1.00e+2 | 1.000000e-2 | whisper | main |

Keep the whole sweep. A leg carrying 1.00e+2 lb/d is a real flow rate and not numerical dust, and it still outranks every working branch. Across ten orders of magnitude the winner never changes.

## Why this is a note and not a defect

Every real case ranks correctly. The failure mode is failing open: a ranking with no floor cannot decline, so it names a branch whether or not the branch means anything. A relative floor, one part in ten thousand of the largest branch mass, would close it and would change no ranking here. The independent bisection referee never ranks a bottleneck, so no published case stands behind one.

## What this solve reports about itself

The answer these intensities come from returns `converged` true after 11 iterations at a reported residual of 1.546141e-11 lb/d. `checkConservation` on that same answer gives 13300.677150912 lb/d produced against 12955.677150912 lb/d delivered, a gap of 345.000000000 lb/d, 2.593852900 percent. The ranking is computed from flows that do not balance, and no part of it knows.

## Exercise

Write the intensity of the bottleneck on the teaching network and the intensity of the branch with the biggest drop, and say which is larger.

Then name the smallest mass in the whisper sweep you would still call a real flow rate, and give the floor that would skip it.
