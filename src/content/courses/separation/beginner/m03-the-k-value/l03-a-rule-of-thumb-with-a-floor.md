# A rule of thumb with a floor

The module derates K by 0.01 for every 100 psi above 100 psig and refuses to let the result fall below 0.120000. Both the rule and the floor are recorded as customary practice whose published form has not been checked against its source, so they are taught here as a stated method with a gap in its provenance.

{{panel:fc-separator-explorer}}

## What the rule does

| mist extractor | psig | base K | derated K | K used | derated | floored |
| --- | --- | --- | --- | --- | --- | --- |
| verticalMesh | 0.000000 | 0.350000 | 0.350000 | 0.350000 | false | false |
| verticalMesh | 100.000000 | 0.350000 | 0.350000 | 0.350000 | false | false |
| verticalMesh | 600.000000 | 0.350000 | 0.300000 | 0.300000 | true | false |
| horizontalMesh | 600.000000 | 0.450000 | 0.400000 | 0.400000 | true | false |
| horizontalVane | 350.000000 | 0.550000 | 0.525000 | 0.525000 | true | false |
| verticalNone | 2000.000000 | 0.180000 | -0.010000 | 0.120000 | true | true |
| horizontalNone | 1500.000000 | 0.250000 | 0.110000 | 0.120000 | true | true |
| verticalNone | 3000.000000 | 0.180000 | -0.110000 | 0.120000 | true | true |

Nothing happens up to 100.000000 psig. Above it the deduction is linear in pressure and identical for every row, which is the first thing to notice: it takes the same 0.050000 off a vertical mesh pad at 600.000000 psig as it takes off a bare drum at the same pressure, though the bare drum started at half the K.

## Where it breaks

A linear deduction applied to a small starting value reaches zero and keeps going. A bare vertical drum at 2000.000000 psig is taken to -0.010000 and at 3000.000000 psig to -0.110000. A negative allowable velocity is not a small error, it is the rule leaving the region where it means anything.

The floor catches it and says so, in these words: "The 0.12 floor bound: the published derating gives K = -0.110 at 3000 psig, below the floor where the rule of thumb stops meaning anything. K is held at 0.12, and a vendor K is the only honest input here."

That warning is the most useful output in this module, because it does not pretend the floor is a result. It says the method has run out and names what would replace it.

## The two flags

Each K carries derated and floored as separate booleans. Derated true says the pressure rule moved the value. Floored true says the rule produced something the floor had to catch, which means the K in use is a bound rather than a calculation.

| case | K | the rule gives | derated | floored |
| --- | --- | --- | --- | --- |
| verticalMeshAt50psig | 0.350000 | 0.350000 | false | false |
| verticalMeshAt1100psig | 0.250000 | 0.250000 | true | false |
| horizontalVaneAt2500psig | 0.310000 | 0.310000 | true | false |
| verticalNoneAt650psig | 0.125000 | 0.125000 | true | false |
| verticalNoneAt3000psig | 0.120000 | -0.110000 | true | true |
| horizontalNoneAt1500psig | 0.120000 | 0.110000 | true | true |

verticalNoneAt650psig is the row worth staring at. Its K of 0.125000 is above the floor and so it is reported as an ordinary derated value, while sitting 0.005000 above the 0.120000 where the method admits it has nothing left. That is half a step of a rule that takes 0.01 off every 100 psi, so 50 psig more of operating pressure puts this vessel on the floor. Nothing in the output marks it as fragile.

## Why it is held

The rule is recorded as it is customarily applied. Its published form has not been checked against a source, so the deduction per 100 psi, the 100 psig threshold and the 0.120000 floor are all being taken on practice rather than on a reference. That is why no conclusion in this course rests on a derated K, and why a vendor figure displaces it wherever the derating bites.

## The mistake

Treating a floored K as a sizing answer. Two very different vessels, a bare drum at 1500.000000 psig and a bare drum at 3000.000000 psig, both come back at 0.120000. The floor made them identical on paper, and they are not.

## Exercise

Say what the rule does below 100.000000 psig and above it, and give the derated K for a vertical mesh pad at 600.000000 psig. Then write the floored warning in the engine's own words and explain why verticalNoneAt650psig at 0.125000 deserves the same suspicion as a floored row.
