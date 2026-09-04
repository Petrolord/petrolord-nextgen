# Efficiency

Of everything you pump, the fraction that is still in the fracture when you stop. On the published job it is about one part in six.

{{panel:st-frac-explorer}}

## The definition

Efficiency is fracture volume divided by injected volume. The rest went into the rock.

    eta = Vf / Vi,   Vi = Vf + VL

On the published case the three volumes are 36.143836842230584 m3 of fracture, 209.09714590747427 m3 injected and 172.95330906524367 m3 lost, for an efficiency of 0.1728566723633056.

Read that again. To create 36 cubic metres of crack you pumped 209, and 173 of them went into the formation. The ratio of injected to fracture volume is 5.7851397133124625.

That is what a hydraulic fracture treatment actually is. It is not a filling operation with some losses. It is a leakoff operation with a fracture as the residue, and the fracture is the small part of it.

## How it moves with leakoff

| CL, m/sqrt(s) | efficiency | injected, m3 | lost, m3 |
|---|---|---|---|
| 0 | 1 | 36.143836842230584 | 0 |
| 0.000025 | 0.6326359683290029 | 57.1321243995946 | 20.988287557364018 |
| 0.00005 | 0.39582605426929196 | 91.31242487044797 | 55.168588028217385 |
| 0.0001 | 0.1728566723633056 | 209.09714590747427 | 172.95330906524367 |
| 0.0002 | 0.054451800554703535 | 663.7767066291894 | 627.6328697869588 |
| 0.0004 | 0.01460645625334061 | 2474.511011797554 | 2438.3671749553237 |

The fracture volume is the same 36.143836842230584 m3 in every row. Only the fluid needed to get there changes.

Doubling the coefficient from 0.0001 to 0.0002 cuts efficiency to less than a third and more than triples the injected volume. The response is worse than proportional because the extra loss lengthens the job, and a longer job gives the face more time to leak.

## What efficiency decides

The pad. Nolte's pad fraction is (1 - eta) / (1 + eta), which on the published case is 0.7052381992848291. So seven tenths of the job is fluid with no proppant in it, spent buying the width and the length that the proppant will later occupy.

Note the shape of that expression. The intuitive guess, that the pad should be the fraction lost, would be 0.8271433276366944 here, too big by 0.12190512835186529. The gap is largest in the middle of the efficiency range and closes at both ends.

## Exercise

In the panel, find the leakoff coefficient at which efficiency falls below one tenth.

Then explain why the injected volume rises faster than the leakoff coefficient does.
