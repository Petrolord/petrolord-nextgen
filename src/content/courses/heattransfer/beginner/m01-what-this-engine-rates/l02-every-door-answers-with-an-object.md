# Every door answers with an object

Twelve exports in this module are the doors the studio knocks on. Each one is called with a single named-argument object rather than a list of positional numbers, each one answers with an object, and each one refuses by putting a named string on an `error` key. That is one contract, and it means one guard shape works everywhere.

{{panel:fc-exchanger-explorer}}

## The doors and what comes back

| export | keys on the answer |
| --- | --- |
| airCooler | 13 |
| areaRequired | 1 |
| capacityRate | 1 |
| effectivenessFromNtu | 3 |
| energyBalance | 5 |
| lmtd | 5 |
| lmtdCorrectionF | 4 |
| lmtdGroups | 2 |
| ntuFromEffectiveness | 3 |
| overallUOutside | 13 |
| tubeCount | 10 |
| tubeSideFilm | 10 |

Read that column as a measure of how much a question carries with it. A capacity rate is one number and its answer has one key on it. A balance hands back five, because a duty arrives with the two outlet temperatures it implies, the basis it was worked from and the arrangement it was asked under. A tube count hands back ten, because a count arrives with the tubes a pass, the surface of one tube, the surface you actually get, the margin over the surface you asked for and the bundle it sits in.

## An object is not a nicety

A named-argument object at the door means a caller cannot get two temperatures the wrong way round by counting commas. An object coming back means an answer can grow a key without breaking a caller, which is how a note and an evidence figure ride along beside a number.

The two widest doors return thirteen keys each, and both are assembling something out of parts, so the parts come back beside the total instead of being discarded once the total exists.

It also means a refusal is the same shape as an answer. A caller reads one key, `error`, and if it is there the rest is not to be trusted. Nothing here returns a NaN in place of a number, and nothing returns a negative surface and leaves you to notice.

## Seventeen names, and three of them are tables

The module exports seventeen names in all. Twelve are the doors above. Two more are callable and are the documented exceptions to the object contract. The remaining three are frozen tables rather than functions: the declared constants, the declared bounds, and the register of things the module records that it cannot source.

## The two exceptions, and why they are stated

The air density is a leaf correlation. It answers with a bare number and says it has no answer with a bare NaN, because there is nowhere in a bare number to put an error key. Its one caller turns that NaN into a named refusal, so the contract is kept where a caller can see it. The bundle constants export takes no argument at all and hands back a copy of the held table.

Both are written down as exceptions rather than left to be discovered. A contract with two documented holes in it is usable. A contract with two undocumented holes cannot be relied on anywhere.

## Exercise

Copy the table above and add a third column: for each door, the one quantity you would call its headline answer. Then pick the two doors with thirteen keys and the two with one key, and say what it is about each question that makes its answer that wide or that narrow.
