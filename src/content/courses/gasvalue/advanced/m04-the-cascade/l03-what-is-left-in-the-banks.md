# What is left in the banks

When IBAFO's cascade can fill no more buses, gas is still in the banks. `cascadeFills` reports how much, and prints a ledger that closes. This lesson reads the ledger, the efficiency and the one bank comparison.

{{panel:gasvalue-rollout-explorer}}

## The ledger

| field | value |
| --- | --- |
| storedKg | 1274.384 |
| the Low, Mid and High bank masses summed | 1274.384 |
| deliveredKg | 608.505 |
| leftInBanksKg | 665.879 |
| storedKg minus deliveredKg minus leftInBanksKg | 0.000 |
| cascadeEfficiency (delivered over stored) | 0.4775 |

storedKg is the gas the banks held at the start: 1274.384 kg, and the course prints the three bank masses of the bank module summed beside it, also 1274.384. deliveredKg is what the 38 fills took: 608.505 kg. leftInBanksKg is what stays behind: 665.879 kg. These three print to three decimals, the precision the engine reports them at.

The fourth line is the ledger check: storedKg minus deliveredKg minus leftInBanksKg, 0.000. The gas is conserved: what the banks held is what was delivered plus what is left in them.

## The efficiency

cascadeEfficiency is delivered over stored: 0.4775. The engine prints the ratio and names what it divides. On IBAFO it divides deliveredKg, 608.505, by storedKg, 1274.384. It is a share of the gas the banks held, and it is printed to four decimals like every ratio in this course.

## Where the gas stays

The bank table from the first lesson shows where the 665.879 kg sits:

| bank | startBar | endBar |
| --- | --- | --- |
| Low | 230.0000 | 58.9110 |
| Mid | 250.0000 | 118.3350 |
| High | 270.0000 | 202.6470 |

The Low bank ends at 58.9110 bar(a), the Mid bank at 118.3350 and the High bank at 202.6470. The engine's note carries its rule on delivery beside these figures: "A bank delivers only while its pressure exceeds the vehicle tank." The vehicle tank here arrives at 25 bar(a) and is filled to 200 bar(a).

## Why three banks

The same 6.0000 m3 as one bank at 250 bar(a):

| arrangement | fillsBeforeRecharge | cascadeEfficiency | leftInBanksKg |
| --- | --- | --- | --- |
| IBAFO's three banks | 38 | 0.4775 | 665.879 |
| one bank of 6.0000 m3 at 250 bar(a) | 12 | 0.1505 | 1084.729 |

The one bank arrangement is the engine run a second time on the same total volume, 6.0000 m3, as a single bank at 250 bar(a), with the same vehicle. It gives 12 fills, an efficiency of 0.1505, and 1084.729 kg left in the bank. The cascade gives 38 fills, 0.4775 and 665.879 kg.

## The studio's cascade

The studio's opening cascade (three 1.5 m3 banks at 250 bar(a), a 0.08 m3 vehicle from 20 to 200, gas 0.6 at 15 C) prints leftInBanksKg 542.689 and cascadeEfficiency 0.4577, with fillsBeforeRecharge 33.

## What the oracle checks

The validation oracle runs the cascade as a mass ledger with conservation asserted. The ledger line of 0.000 above reads the same conservation from the engine's three printed figures: stored, delivered and left.

## The ceiling again

The count is isothermal: the heat of a fast fill is not modelled, so a real fill settles lower and the count is a ceiling in that one respect. The ledger is on the same isothermal basis.

In practice, a station's compressor recharges the banks from the pressures they ended at, and the gas left behind stays in the banks for the next cycle of fills.

## In the explorer

Open IBAFO's cascade. Read storedKg, deliveredKg and leftInBanksKg, and confirm the ledger line reads 0.000. Switch to the one bank comparison and read the three figures again.

## Exercise

Read IBAFO's ledger: storedKg 1274.384, deliveredKg 608.505, leftInBanksKg 665.879, the ledger line 0.000 and cascadeEfficiency 0.4775. Then read the one bank row: 12 fills, 0.1505, 1084.729 kg. Say what the ledger line shows, what cascadeEfficiency divides, and quote the three figures for each arrangement side by side.
