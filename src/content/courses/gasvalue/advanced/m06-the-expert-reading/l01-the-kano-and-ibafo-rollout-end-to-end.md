# The Kano and Ibafo rollout end to end

This tier has sized an LPG plant at Kano and a CNG station at Ibafo, one function at a time. This lesson reads them as one rollout: twelve figures, each on the basis the engine states, from the blend to the bus. The plant, the station, the bus and every figure are invented for the course.

{{panel:gasvalue-rollout-explorer}}

## The rollout in twelve figures

| step | figure |
| --- | --- |
| KANO blend density, kg/m3 | 557.4000 |
| KANO usable LPG at a 0.85 liquid fill, t | 71.0685 |
| KANO cover, days | 8.8840 |
| KANO vaporizer design duty, kW | 98.6948 |
| KANO carousel positions wholly working | 16 |
| KANO carousel average wait, minutes | 0.0912 |
| KANO cylinders required | 98496 |
| IBAFO Mid bank, kg | 425.6293 |
| IBAFO fills before recharge | 38 |
| IBAFO left in the banks, kg | 665.879 |
| IBAFO trailers required | 8 |
| IBAFO bus simple payback, years | 0.3137 |

## Kano, step by step

The blend density, 557.4000 kg/m3, blends on volume. KANO's blend is propane 0.35 and butane 0.65 by liquid volume. The same blend's latent heat, 397.7592 kJ/kg, blends on mass, and it feeds the vaporizer.

The usable LPG, 71.0685 t, is on a 0.85 fill limit read on liquid_volume. The limit is illustrative and its basis is stated. The same vessel on a filling density of 0.42 on water_capacity_mass gave 62.9433 t.

The cover, 8.8840 days, is on that 0.85 liquid volume row. It does not depend on the lead time and is still given when the lead time is blank.

The vaporizer's design duty, 98.6948 kW, carries the 15 percent margin on a duty of 85.8215 kW. That duty is built from three terms with a boiling point of 38 C at the vaporizer's pressure.

The carousel runs on 16 positions wholly working: the floor of 18 positions at 0.92, which is 16.5600. The average wait, 0.0912 minutes, is computed on those 16.

The cylinders, 98496, come from Little's law over a cycle of 28.5000 days, with spares of 0.08.

## Ibafo, step by step

The Mid bank holds 425.6293 kg at 250 bar(a), as real gas with Z 0.8369. Every pressure is absolute, and the result says so: pressureBasis absolute (bar(a)).

The cascade fills 38 buses before recharge, equalising bank by bank. It is an isothermal count, a ceiling in that one respect. 665.879 kg is left in the banks, and the ledger closes: storedKg minus deliveredKg minus leftInBanksKg is 0.000.

The trailers, 8, are the same float rule as the cylinders, over a cycle of 1.8000 days.

The bus pays back in 0.3137 years, simple and undiscounted, on an efficiency ratio of 0.92 stated as an input.

## The basis behind each figure

Every figure on the table carries a basis the engine names: volume for the density, liquid_volume for the fill, the boiling point at pressure for the duty, the positions wholly working for the queue, absolute pressure and real gas for the bank, equalisation for the cascade, and an undiscounted payback for the bus.

## What the oracles check on this rollout

The validation oracle for lpgCng checks, independently of the engine: Z by bisection on reduced density with a second correlation as a plausibility check; the cascade as a mass ledger with conservation asserted; Erlang C in exact rationals on the positions wholly working; ledgers for the blend, storage, vaporizer, floats and the switch. The compressor's thermodynamics are validated in the Facilities engine; here only the unit bridge is checked.

In practice, a rollout study hands a table like this to the people who approve the plant and the station.

## In the explorer

Open the rollout explorer on KANO and IBAFO and find each of the twelve figures on its own panel section, with the basis printed beside it.

## Exercise

Read the twelve figures on the rollout table. For each of these five, name the basis the engine states for it: the blend density 557.4000, the usable LPG 71.0685 t, the carousel's 16 positions, the Mid bank's 425.6293 kg, and the bus's payback of 0.3137 years.
