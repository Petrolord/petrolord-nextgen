# A valve is an orifice

For the purpose of throughput a gas lift valve is a hole of known area with a pressure on each side. The dome, the bellows and the stem play no part in the number at all.

{{panel:pd-valve-explorer}}

## Four published rows

| Port, in | Upstream, psia | Downstream, psia | Gas gravity | Temperature, degF | Throughput, Mscf/d |
| --- | --- | --- | --- | --- | --- |
| 0.25 | 1000.0 | 300.0 | 0.65 | 140.0 | 1255.291661609 |
| 0.25 | 1000.0 | 900.0 | 0.65 | 140.0 | 796.940795075 |
| 0.1875 | 1400.0 | 700.0 | 0.7 | 200.0 | 908.229615247 |
| 0.5 | 900.0 | 850.0 | 0.6 | 120.0 | 2329.535423114 |

The engine reproduces those four goldens to 0.000e+0, 1.933e-12, -1.137e-13 and 4.547e-13 Mscf/d. Nothing in this part of the module is in doubt arithmetically. What is in doubt is what the number is about.

## Area, not diameter

The port enters through its flow area. A 0.25 in port is 0.049087385 in2, a 0.1875 in port is 0.027611654 in2 and a 0.5 in port is 0.196349541 in2. The bottom row of the table passes 2329.535423114 Mscf/d at a pressure ratio of 0.944444444, which is nearly balanced, on nothing but area. The top row passes 1255.291661609 Mscf/d at a ratio of 0.300000000, which is wide open, on the smaller area.

Read that pair the wrong way round and you conclude that a large differential is worth less than it is, or that a port change is worth more.

## What moves it

Throughput rises with the port area and with the upstream pressure, falls with the square root of the gas gravity and the absolute temperature, and depends on the two pressures only through their ratio. Two of the published rows differ in three inputs at once: 0.1875 in at 1400.0 psia, 0.7 gravity and 200.0 degF against 0.5 in at 900.0 psia, 0.6 gravity and 120.0 degF. Nothing useful can be concluded by comparing them.

## The mistake

Comparing two throughput numbers taken from different valves in a real string and calling the difference a port effect. Down a design the depth changes the temperature, both pressures and often the port at once. On midDecrementKnifeEdge every charged valve carries the same 0.25 in port and the throughputs still run 1529.098759722, 1534.198233515, 1529.067116144, 1505.775891086, 1440.849796778 and 1347.108582683 Mscf/d.

## What it refuses

This is an orifice equation. It does not know that a real gas lift valve throttles on its stem before it is fully open, so what it returns is an upper bound on what the valve passes rather than a prediction of it. It also has no idea whether the well can take the gas: there is no inflow relation and no multiphase outflow anywhere in the module.

## Exercise

Reproduce the four published rows in the panel and record the flow area beside each.

Then take the two rows that share a port and an upstream pressure, and say what taking the downstream pressure from 900.0 to 300.0 psia bought.
