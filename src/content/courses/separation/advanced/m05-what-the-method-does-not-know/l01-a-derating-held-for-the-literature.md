# A derating held for the literature

The K value falls by 0.01 for every 100 psi above 100 psig and stops at a floor of 0.120000. Both halves of that rule are recorded here as a customary rule of thumb, and neither has been checked against the source.

{{panel:fc-separator-explorer}}

## What the rule does

| mist extractor | psig | base K | derated K | K used | derated | floored |
| --- | --- | --- | --- | --- | --- | --- |
| verticalMesh | 100.000000 | 0.350000 | 0.350000 | 0.350000 | false | false |
| verticalMesh | 600.000000 | 0.350000 | 0.300000 | 0.300000 | true | false |
| horizontalVane | 350.000000 | 0.550000 | 0.525000 | 0.525000 | true | false |
| horizontalNone | 1500.000000 | 0.250000 | 0.110000 | 0.120000 | true | true |
| verticalNone | 3000.000000 | 0.180000 | -0.110000 | 0.120000 | true | true |

A vertical mesh pad at 600.000000 psig falls from 0.350000 to 0.300000, and every dimension downstream of K moves with it: the settling velocity, the diameter the gas demands, the gas margin and the feasibility of every row in a sweep.

## Where the rule stops meaning anything

At 3000.000000 psig the derating gives -0.110000, a negative settling coefficient. The floor holds K at 0.120000 and the engine says why: "The 0.12 floor bound: the published derating gives K = -0.110 at 3000 psig, below the floor where the rule of thumb stops meaning anything. K is held at 0.12, and a vendor K is the only honest input here."

A linear rule extrapolated far enough produces a negative number, which is the clearest possible signal that it is being used outside the range anybody intended for it. The floor is a guard rail rather than a physical limit, and 0.120000 is a number with no derivation behind it in this module.

## Why it is held

The derating and the floor are taught as limits and they are never graded. What is unchecked is the published form: whether the slope is 0.01 per 100 psi, whether it starts at 100 psig, and whether any source places a floor at all. Until that is read against the literature, a conclusion built on a derated K carries the uncertainty of the rule rather than the precision of the six decimals it prints in.

The practical consequence is stated by the engine itself. Where the derating bites, a vendor K is the only honest input.

## Nothing reconciles a vendor number

An override wins outright and says so, returning `source` as typed with `derated` and `floored` both false. It is never compared against the table value at that pressure and no warning is raised when the two are far apart, so a vendor K of 0.9 would be taken silently.

That is a gap worth knowing about. The override is the recommended input where the derating bites, and the engine will not tell anybody when the recommended input is wrong.

## The mistake

The mistake is repeating the arithmetic. Working out a derated K by hand for a report, or quoting the fall from 0.350000 to 0.300000 as a design basis, treats a rule of thumb as a calculation. The published table values and the fact of derating can be taught. The derated figure cannot be leaned on.

The second mistake is reading the floor as safe. A floored K is the engine declining to extrapolate, which means the number it returned was chosen rather than computed.

## Exercise

State the derating rule and the floor, and give what happens to a vertical mesh pad at 600.000000 psig and to a vessel with no mist extractor at 3000.000000 psig. Then say what is unchecked about the rule, and explain why a vendor override is recommended where the derating bites even though nothing reconciles it against the table.
