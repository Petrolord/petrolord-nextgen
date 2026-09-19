# Fills before recharge

A cascade fills vehicles until it cannot fill the next one, and then the banks need recharging from the compressor. `cascadeFills` counts those fills. This lesson reads the count on IBAFO's cascade and the figures printed beside it.

{{panel:gasvalue-rollout-explorer}}

## IBAFO's count

Low 2 m3 at 230 bar(a), Mid 2 m3 at 250 bar(a), High 2 m3 at 270 bar(a); a bus tank of 0.1 m3 arriving at 25 bar(a), filled to 200 bar(a).

| field | value |
| --- | --- |
| kgPerFill | 16.0133 |
| fillsBeforeRecharge | 38 |
| deliveredKg | 608.505 |
| nextVehicleReachesBar | 197.7590 |
| hitFillLimit | false |
| pressureBasis | absolute (bar(a)) |

fillsBeforeRecharge is 38, a count printed whole. Each fill delivers kgPerFill, 16.0133 kg. deliveredKg is 608.505 kg over the 38 fills.

## Whole fills

The engine counts whole fills until the next vehicle cannot reach its target. The field that shows the stopping point is nextVehicleReachesBar: 197.7590 bar(a). The target is 200 bar(a). The next vehicle would reach 197.7590 bar(a), and it cannot reach its 200 bar(a) target. The count stops at 38.

The count is of whole fills, each a vehicle that reaches the target. The next vehicle's pressure is printed beside the count so the stopping point can be read.

## The flag beside it

hitFillLimit prints false on IBAFO, beside the count. It is a flag, true or false, and on IBAFO's cascade it reads false.

## A ceiling in one respect

Both engine and oracle are isothermal: the heat of a fast fill is not modelled, so a real fill settles lower and the count is a ceiling in that one respect. 38 is the isothermal count. The engine's note says the same: "Isothermal: the heat of a fast fill is not modelled."

## The studio's cascade

The LPG & CNG Rollout Studio opens on its own cascade: three 1.5 m3 banks at 250 bar(a), a 0.08 m3 vehicle from 20 to 200, gas 0.6 at 15 C. It prints fillsBeforeRecharge 33, cascadeEfficiency 0.4577, leftInBanksKg 542.689 and nextVehicleReachesBar 195.5640. Its count stops the same way: the next vehicle reaches 195.5640 bar(a) against a target of 200.

## Why three banks

The same 6.0000 m3 as one bank at 250 bar(a) gives fillsBeforeRecharge 12. The three bank cascade on IBAFO gives 38. Both are the engine's counts on the same total volume and the same vehicle. The next lesson reads the gas each arrangement leaves behind.

## What the cascade refuses

| probe | engine |
| --- | --- |
| a target below the start | REFUSED: A start and a higher target pressure are required. |
| no banks | REFUSED: At least one bank is required. |
| a bank with no pressure | REFUSED: Every bank needs a volume and a pressure. |
| temperature left blank ('') | REFUSED: A temperature is required. |

A target below the start is refused, and the refusal's sentence asks for a start and a higher target pressure. A cascade needs at least one bank, and each bank a volume and a pressure. A temperature left blank is refused.

In practice, a station schedules its compressor to recharge the banks around the traffic it expects.

## In the explorer

Open IBAFO's cascade and read fillsBeforeRecharge, kgPerFill, deliveredKg and nextVehicleReachesBar. Lower the target and read the count again. Then set a target below 25 and read the refusal.

## Exercise

Read IBAFO's cascade: fillsBeforeRecharge 38, kgPerFill 16.0133, deliveredKg 608.505, nextVehicleReachesBar 197.7590 against a target of 200 bar(a), hitFillLimit false. Say what the engine counts and when it stops, what nextVehicleReachesBar shows about the next vehicle, and in which respect the count is a ceiling. Then quote the one bank count, 12, beside the cascade's 38.
