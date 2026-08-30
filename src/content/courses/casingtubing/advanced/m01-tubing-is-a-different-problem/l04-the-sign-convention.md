# The sign convention

Positive is tension. Get that wrong and every conclusion inverts.

{{panel:ct-tubing-explorer}}

## The convention

    positive total force = TENSION added at the packer
    negative total force = COMPRESSION added at the packer

The engine's own comment says so in one line, and everything downstream depends on it.

## What each of the three does

**Piston.** Positive when the bore pressure rises, on this geometry, because Ap is bigger than Ai and the bore pressure pushes the tubing up out of the packer.

**Ballooning.** Positive when the bore pressure rises. Internal pressure swells the pipe radially, and a swollen pipe is a shorter pipe, so it pulls.

**Thermal.** NEGATIVE when the temperature rises. A hot string wants to be longer, the packer will not let it, so the string is put into compression.

    thermal = -E x A x alpha x dT

The minus sign is in the formula, and it is the only one of the three that carries a sign explicitly.

## The result that catches people

Heating a string PUSHES on the packer. Cooling it PULLS.

That is backwards from the instinct that hot things are more energetic and therefore push harder on everything. What is happening is simpler: the string wants to grow, the packer stops it, and the reaction is compression.

## Checked on the three cases

| case | piston (N) | ballooning (N) | thermal (N) | total (N) |
|---|---|---|---|---|
| production heating | 35712.418834005 | 27216.466692956772 | -186613.83258144156 | -123684.94705447978 |
| injection cooling | 71424.83766801 | 54432.933385913544 | 124409.22172096104 | 250266.9927748846 |
| stimulation | 151205.11951994442 | 103852.60026147243 | 207348.7028682684 | 462406.42264968524 |

Production heating is the only one of the three that ends up in compression, and it is the only one with a positive temperature change.

## Length changes carry the opposite sign

A compressive force at the packer goes with an ELONGATION that was prevented, so the length change of the heating case is positive, 0.8947604591459051 m, while its force is negative.

Reading force and length in the same column and expecting them to agree in sign is the single most common error here. They are two views of the same event and they are opposite by construction.

## Exercise

Predict the sign of the total force for a case with no pressure change and a temperature change of minus 20 degrees.

Then predict the sign of its length change, and check both in the panel.
