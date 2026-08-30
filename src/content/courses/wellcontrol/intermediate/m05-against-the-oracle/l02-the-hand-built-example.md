# The hand-built example

Round numbers, chosen so the answers can be checked.

{{panel:wc-volume-explorer}}

## The inputs

| quantity | value |
|---|---|
| TVD at the bit | 3000 m |
| TVD at the shoe | 2000 m |
| mud density | 1200 kg/m3 |
| string volume | 40 m3 |
| annulus volume | 120 m3 |
| pump output | 0.01 m3/stroke |
| slow circulating rate pressure | 5000000 Pa |
| SIDPP | 3000000 Pa |
| SICP | 3600000 Pa |
| pit gain | 4 m3 |
| annulus capacity at the bit | 0.02 m2 |
| annulus capacity at the shoe | 0.025 m2 |
| fracture EMW | 1700 kg/m3 |
| influx density for tolerance | 240 kg/m3 |
| kick intensity | 60 kg/m3 |

Fifteen inputs, and thirteen of them are round.

## What round buys

Every derived quantity comes out clean enough to check on paper.

    strokes to the bit  = 40 / 0.01   = 4000
    bottoms up          = 120 / 0.01  = 12000
    influx height       = 4 / 0.02    = 200 m
    ICP                 = 5 + 3       = 8 MPa

None of those needs a computer.

## The two that are not round

The influx density and the kill mud weight, because both come out of divisions that do not land on integers.

    influx density = 1200 - 600000 / (9.80665 x 200) = 894.0851361066216 kg/m3
    kill mud       = 1200 + 3000000 / (9.80665 x 3000) = 1301.9716212977928 kg/m3

Both are exact given the inputs, and both carry the awkwardness of standard gravity.

## The classification

894.0851361066216 kg/m3 sits between the gas threshold of 480 and the liquid threshold of 960, so the influx is classified as MIXED.

That was deliberate: the example exercises the middle branch of the classification, which neither of the two well scenarios does.

## MAASP

    (1700 - 1200) x 9.80665 x 2000 = 9806650 Pa

A round input times a round input times standard gravity. Checkable in one line.

## Why this example is worth more than the two wells

Because it can be verified without either implementation.

Two implementations agreeing tells you they agree. A case whose answers are one line of arithmetic each tells you what the answer IS, and that is a different and stronger claim.

## Exercise

Verify all five of the round derived quantities above with a calculator.

Then verify the influx density and the kill mud weight, and note how many digits you need to carry to reproduce the published values.
