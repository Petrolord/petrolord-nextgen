# What arrives at the separator

The separator is handed one mass and the trunk is solved for another, and only one of the two came out of an iteration.

{{panel:pd-network-explorer}}

## What the trunk delivers

On AGBADA WEST the wells are tested at oil 1690, 605, 1042 and 118 stb/d, water 214, 738, 369 and 401 stb/d and gas 1305, 542, 1613 and 76 Mscf/d, each handed in with the mass the solve gave it. Propagated along the solved directions, what arrives is oil = 3455.000000000 stb/d, water = 1722.000000000 stb/d, gas = 3536.000000000 Mscf/d and mass = 13300.677150912 lb/d.

The four tests come to 3455.000000 stb/d oil, 1722.000000 stb/d water and 3536.000000 Mscf/d gas between them. The components tie out exactly, because addition is the whole of what happened to them.

## The water cut is an output

| Stream | Water cut, percent |
| --- | --- |
| AGBADA-2 | 11.239495798 |
| AGBADA-6 | 54.951600894 |
| AGBADA-9 | 26.151665485 |
| AGBADA-12 | 77.263969171 |
| Arriving at the separator | 33.262507244 |

The plain average of the four well water cuts is 42.401682837 percent, which is wrong by 9.139175594 percentage points. The arriving number is rate weighted, and the wettest well is the smallest: AGBADA-12 is handed in at 985.000000000 lb/d against AGBADA-2 at 6004.874117054 lb/d, so its 77.263969171 percent buys little of the answer.

## What the check says about the same answer

The solve behind those directions reported converged = true after 11 iterations with a residual of 1.546141e-11 lb/d. `checkConservation`, run on that same answer, reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345 lb/d, which is 2.593852900 percent of what the engine says was produced.

The mass arriving, 13300.677150912 lb/d, is the sum of the tested well masses. The trunk the solve found passes 12955.677150912 lb/d. Both sit in the result and nothing in it says they differ.

## What the separator refuses to be

A sink accepts whatever arrives at a fixed pressure, here 265 psia, and does nothing else. There is no separation, no carryover, no temperature, no slugging and no holdup, because every equation here is steady state. Well, junction and sink are the whole vocabulary, and anything a real facility does that is not one of those three has to be written as a branch relation or left out.

## The careful mistake

Sizing water handling on 42.401682837 percent when the arriving stream is at 33.262507244 percent, and quoting the arriving stream mass as a delivered rate. The mass is the only quantity in a stream result that can argue with the solve.

## Exercise

Propagate streams on the panel and write down the oil, water and gas arriving, and the arriving water cut.

Then average the four well water cuts, say by how much that misses, and name the well the average over weights.
