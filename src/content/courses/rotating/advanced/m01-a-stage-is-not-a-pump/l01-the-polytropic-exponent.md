# The polytropic exponent against the isentropic one

A pump stage is described by a curve somebody measured. A compressor stage is described by a thermodynamic path, and the exponent of that path is the first number the whole calculation hangs off.

{{panel:fc-compressor-explorer}}

## The stage this tier works on

The SOKU K-2101 stage takes 26.000000 MMscfd of a 0.648000 gravity gas at 92.000000 psia and 104.0000 degF through a ratio of 3.200000, with k = 1.285000 at a polytropic efficiency of 0.755000. Everything in this module is that one stage asked different questions.

The exponent the engine returns for it is a ratio, 0.293761435, and it is the group that appears in every temperature and every head expression the module has. Hand the same function an efficiency of one and it returns 0.221789883, which is the isentropic exponent ratio for the same gas.

## The efficiency is the whole difference between them

Their quotient is 1.324503311, and that figure is one over the polytropic efficiency. A real compression is irreversible, the irreversibility shows up as heat in the gas, and the exponent of the real path is steeper than the reversible one by exactly the factor the efficiency sets.

That is worth stating precisely because it is the source of the most common error in compressor work. An exponent written from k alone describes a machine with no losses at all. Nothing on a skid is that machine, and the exponent the calculation needs is the one that already carries the efficiency.

## The identity, printed rather than asserted

The exponent ratio times the polytropic efficiency is the isentropic exponent ratio, exactly, for every pair the engine was asked:

| k | polytropic efficiency | exponent ratio | times the efficiency | the isentropic exponent ratio | difference |
| --- | --- | --- | --- | --- | --- |
| 1.280000 | 0.750000 | 0.291666667 | 0.21875 | 0.21875000000000003 | -2.7755575615628914e-17 |
| 1.260000 | 0.780000 | 0.264550265 | 0.20634920634920634 | 0.20634920634920637 | -2.7755575615628914e-17 |
| 1.300000 | 0.720000 | 0.320512821 | 0.2307692307692308 | 0.23076923076923078 | 2.7755575615628914e-17 |
| 1.400000 | 0.820000 | 0.348432056 | 0.2857142857142857 | 0.28571428571428564 | 5.551115123125783e-17 |

The last column is a subtraction done on each row, and it is the size of double-precision rounding rather than the size of a disagreement.

## What a richer gas does to it

Held at the SOKU conditions and walked across k, the exponent ratio runs 0.220750552 at k = 1.200000, 0.256355480 at 1.240000, 0.289735099 at 1.280000, 0.321091712 at 1.320000 and 0.378429518 at 1.400000. A higher k gives a steeper path. k is a property of the gas and it is a stated input here, so which of those rows a machine sits on is decided by what the user types for it.

## The mistake

The mistake is taking k from a handbook for a gas the stream is not, and then treating the resulting exponent as a property of the machine. It is a property of the fluid and of the efficiency together. The machine contributes the efficiency, the stream contributes k, and a stage report that quotes an exponent without saying which efficiency produced it cannot be checked by anybody.

## Exercise

State the SOKU stage inputs, give the exponent ratio the engine returns and the ratio the same function returns at an efficiency of one, and say what their quotient is. Then explain what the fourth and fifth columns of the identity table show, and why an exponent written from k alone is the wrong number to size a driver with.
