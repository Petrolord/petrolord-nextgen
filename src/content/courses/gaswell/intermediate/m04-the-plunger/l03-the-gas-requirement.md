# The gas requirement

A cycle spends gas to lift a barrel. The screen prices that in scf/bbl and holds it against what the well makes.

{{panel:pd-profile-explorer}}

## What one cycle costs and carries

The published case returns 5452.924357073 scf of gas per cycle against 1.1576450988 bbl of liquid, so the requirement is 4710.35929989 scf/bbl. The independent oracle returns 5453.635111991 scf, the same 1.1576450988 bbl to the last digit, and 4710.97326605 scf/bbl, differences of -0.710754919 scf and -0.61396616 scf/bbl.

The liquid half agrees exactly because it is geometry. The gas half does not, because it is a thermodynamic path.

## The gas number is not a property of the slug

`gasPerCycleScf` treats the gas as an expansion from the casing pressure down to the pressure still needed at the top of the rise, and takes the two ends together. The published case expands from a casing of 600.0 psia against a requirement of 225.8581556122 psia.

That matters more than it looks. The casing pressure is an input to a number most readers describe as "the gas this plunger needs", so the requirement moves when the well's surface conditions move, with the slug untouched. The lift pressure does not move with it: on OGUTA-2 the balance asks 248.1897322873 psia whatever the casing reads, because none of its five terms is a casing pressure.

On OGUTA-2 the same route gives 8854.756635640 scf per cycle against 0.9261160790 bbl, a requirement of 9561.17363265 scf/bbl, and the well makes 5900.0 scf/bbl.

## The rule of thumb is a comparison, not a requirement

The screening heuristic is 400.0 scf per bbl per 1000 ft of depth. On the published 6000.0 ft that is 2400.00000000 scf/bbl against a computed 4710.35929989 scf/bbl, so the balance is 1.96264971 times as demanding as the rule. On OGUTA-2 the rule gives 3280.00000000 scf/bbl against 9561.17363265 scf/bbl, and the balance is 2.91499196 times as demanding.

`ruleOfThumbAgrees` comes back false on OGUTA-2. It is a report of which side of the two figures the well sits on, and nothing else consumes it.

## The mistake

Screening a plunger candidate on the heuristic and stopping there. On both of these cases the physics asks between 1.96264971 and 2.91499196 times what the rule asks, and the error runs in the flattering direction every time: a well that clears 2400.00000000 scf/bbl comfortably can be short of 4710.35929989 scf/bbl.

The reverse error is quieter. A well that fails the rule may still be worth computing, because the rule knows only depth, while the balance knows the slug, the liquid gravity, the plunger, the line pressure and the casing pressure.

## What it refuses

The 400.0 scf per bbl per 1000 ft rule is carried for comparison only and never decides feasibility. The engine will not tell you which of the two figures is right for your field, and it will not adjust the rule to your depth beyond multiplying by it.

## Exercise

Compute the OGUTA-2 requirement from its gas per cycle and liquid per cycle and confirm 9561.17363265 scf/bbl.

Then state, in one sentence, why lowering the casing pressure changes that requirement while leaving the lift pressure alone.
