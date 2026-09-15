# Utilisation against the plan

Utilisation is throughput divided by capacity, and the throughput the studio uses is the plan's own peak rate and the plan's own gas-oil ratio. The plan peaks at 60.0000 kbpd, which is 60000 bopd, and at a gas-oil ratio of 640 scf a barrel that peak carries 38400 Mscf/d of gas.

{{panel:ec-schedule-explorer}}

## One rate against three facilities

| facility | nameplate bopd | gas capacity Mscf/d | oil utilisation | gas utilisation | bottlenecks |
| --- | --- | --- | --- | --- | --- |
| Egina FPSO | 60000 | 90000 | 1.000000 | 0.426667 | none |
| Egina FPSO, debottlenecked | 150000 | 225000 | 0.400000 | 0.170667 | none |
| Deep tie-back | 25000 | 37500 | 2.400000 | 1.024000 | Oil Separation Capacity Exceeded, Gas Compression Limits |

The oil column is 60000 bopd divided by each nameplate. The gas column is 38400 Mscf/d divided by each gas capacity. One numerator, three denominators, and the whole spread of answers comes from the facilities rather than from the production.

## Full, idle and overrun

The Egina FPSO reads 1.000000 on oil: the plan's peak is exactly what it was sized for, and there is no headroom. The debottlenecked case reads 0.400000, which is capacity standing idle at a capex of 2589.2031 and an operating cost of 96.6591 a year. The tie-back reads 2.400000, and a utilisation above one is a real reading rather than an error. Nothing is clamped at full.

## What a bottleneck is

Two bottlenecks fire on the tie-back, Oil Separation Capacity Exceeded and Gas Compression Limits. The gas one is worth reading closely: the gas utilisation is 1.024000, so the gas side is over its limit by a hair, and a flag fires on the same footing as the oil side at 2.400000. A bottleneck says a limit has been crossed. It does not say by how much, so the number beside it is the part that carries the size of the problem, and a register of flags with no ratios beside them hides the difference between a unit that is marginally short and one that is nowhere near.

## The rate nobody typed

The temptation is to measure each facility against the throughput that suits it. Run the tie-back against the tie-back concept's own peak of 25.0000 kbpd and the oil utilisation reads 1.000000 with no bottleneck at all, and the facility looks adequate for a plan it cannot carry. The engine refuses that by construction: the throughput comes from the plan being assessed, and it is the same for every row.

## The mistake

The mistake is reading 0.426667 and 0.170667 on the FPSO rows as slack worth selling. They are ratios against installed capacity at a single point in the profile, the peak. They say nothing about the years after plateau, when the profile has already fallen away from its peak. They say nothing about the water the facility will handle, which is a separate capacity of 48000 bopd on the Egina FPSO and 20000 on the tie-back. And they say nothing about whether the gas has anywhere to go once it has been compressed.

## Exercise

State the plan's peak in bopd and the gas rate that follows from the gas-oil ratio. Then give the oil and gas utilisation of all three facilities, name the two bottlenecks and the facility they fire on, and say which utilisation figure the tie-back would show if it were measured against its own concept's peak instead.
