# Constants measured out of the engine

Every constant this module uses is exported, so a reader can name it rather than infer it. They fall into three kinds, and the difference between the kinds is the most useful thing here.

{{panel:fc-water-explorer}}

## Derived, measured, declared

A derived constant is computed from something else the module exports. The standard cubic feet in a pound mole, 379.483571856287, is the gas constant times the standard temperature over the standard pressure, and the digest checks it by multiplying three figures it already carries. The US gallons in a cubic foot, 7.480519480519, is exact as 1728 cubic inches to the cubic foot over 231 to the gallon. A derived constant cannot be wrong without the thing it comes from being wrong.

A declared constant is a customary or chart value with no publication in this repository to check it against. Pinning it records that a change would be a reviewed act, which is all any gate can do, and the module's own comment says so.

A measured constant sits between them, and it is the one worth learning to produce.

## Measuring a constant from outside

To measure a constant, ask the engine a question whose answer is that constant and nothing else, then print the ratio of the measurement to the export. A ratio of one says the exported name and the number in use are the same number.

| constant | exported | measured out of a return value | measured over exported |
| --- | --- | --- | --- |
| standard cubic feet a pound mole | 379.483571856287 | 379.483571856287 | 1.000000000000 |
| the water overhead, Btu a lb | 1100.000000000000 | 1100.000000000000 | 1.000000000000 |
| the contactor liquid, lb a ft3 | 69.568831168831 | 69.568831168831 | 1.000000000000 |
| the molecular weight of water | 18.015280000000 | 18.015280000000 | 1.000000000000 |

None of those four numbers was typed into the digest. The standard cubic feet came out of the BTEX mole balance at one MMscfd, a million ppmv, a unit absorbed fraction and a unit molecular weight, where the answer is a million over the constant and nothing else. The water overhead came out of a circulation ratio of one gallon per pound with no reflux, where the vaporization term is the overhead alone. The contactor liquid came out of the gas density and the allowed velocity of one call. The molecular weight of water came out of the saturation answer over the mole fraction of one call, divided by the standard cubic feet already measured.

## Groups, and their honest limit

Three more can only be measured as groups, because the engine never uses their parts separately. The minutes in a day is 1440.000000000, the gallons a day over the gallons a minute of one call. The days in a year over the pounds in a short ton is 0.182500000000. The hours in a day times the Btu in a MMBtu is 24000000.

A group cannot say which of its parts is wrong when the group is. It is still a measurement, and the digest says so.

## Why the distinction earns its place

Because it says what a green gate means. A gate over a derived constant proves an identity. A gate over a measured constant proves the name and the number agree. A gate over a declared constant proves nobody changed it quietly. Three different promises, and reading them as one is how a pinned number gets presented as a verified one.

## Exercise

Name the three kinds of constant and give an example of each. Record the four measured constants with their exported values and the ratio the digest prints for each. Then record the three groups and say why the engine cannot be asked for either half of one.
