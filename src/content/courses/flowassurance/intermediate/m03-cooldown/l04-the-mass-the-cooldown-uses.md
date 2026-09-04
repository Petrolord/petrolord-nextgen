# The mass the cooldown uses

`overallU` accepts an unbounded list of layers. `cooldownTime` has exactly two mass slots. Everything between the steel and the sea carries resistance into the first function and no mass at all into the second.

{{panel:pd-line-explorer}}

## Two slots, and the layers that fit neither

The module has two mass helpers, `pipeMassLbPerFt` for an annulus and `contentsMassLbPerFt` for a bore. `cooldownTime` takes contents in one slot and the shell in the other. There is no slot for a coating, no helper that lumps one, and no warning when the layer list is longer than two.

On the published insulated build, `overallU` accepted 2 layers, `cooldownTime` offers 2 mass slots, and the foam fits into 0 of them. That foam carries 98.882128 percent of the resistance of that build.

## The published case, where it barely shows

The published pipe holds 18.9921056882 lbm/ft of steel at 490.0 lbm/ft3 and 11.0344753586 lbm/ft of contents at 55.0 lbm/ft3. At Cp 0.5 and Cp 0.11 those become 5.5172376793 and 2.0891316257 Btu/(ft degF), a total M Cp of 7.6063693050 with the contents carrying 72.534444 percent of it. Add the foam at teaching values of 44.0 lbm/ft3 and Cp 0.28, invented for this course and published nowhere, and it brings 7.3194745506 lbm/ft and 2.0494528742 Btu/(ft degF), 26.943904 percent of that total, none of it in the published cooldown.

## The teaching line, where it decides the answer

TEACHING LINE AKASO SPUR is a gas line with a foam layer and a concrete weight coat, cooling from 120.00 degF towards a 45.00 degF seabed to a 71.00 degF target. Both readings below are the same line at the same U.

| Reading | M Cp, Btu/(ft degF) | Time constant, hr | No-touch time, hr |
| --- | --- | --- | --- |
| What the API leads to | 9.7528832283 | 8.6008917110 | 9.1117122206 |
| Foam and coat lumped in | 34.6040264905 | 30.5166664712 | 32.3290993724 |

The API reading carries 68.7787096055 lbm/ft and leaves out 112.4591995215 lbm/ft. The layers it leaves out carry 67.414840 percent of the resistance. The two heat capacities stand at 3.54808170, and so do the two no-touch times, 3.5480816986, because the log term of 1.0593915755 is identical in both and only M Cp moved. The difference is 23.2173871518 hr, which the API reading gives away.

## The mass that turns into zero

The mass helpers return NaN for a zero density, a zero bore, or an outside diameter no larger than the inside. `cooldownTime` reads its slots as `(contents?.massLbPerFt || 0)`, and NaN is falsy in JavaScript. With both slots NaN the total is zero and the call is refused. With only the contents slot NaN it returns `ok = true`, a no-touch time of 1.2806433091 hr against the correct 4.6627248553 hr, -72.534444 percent, and no note.

## The careful mistake

Trusting the signature. Two slots reads as two things that matter, and on this teaching gas line the omitted layers hold the greater mass. A no-touch time from the API reading is not conservative: on a coated line it is a factor of 3.5480816986 short.

## Exercise

Run the AKASO SPUR cooldown on both readings and record both no-touch times.

Then say which layers you had to move by hand, and what you must know to move them.
