# Two numbers into seven

A molecular weight and a specific gravity go in. A full set of pseudo-component properties comes out.

{{panel:fluid-study-explorer}}

## What is needed

An equation of state needs, for every component:

**Critical temperature.** **Critical pressure.** **Acentric factor.** **Volume shift.** And for the transport and interfacial models, a critical volume and a parachor. Plus a binary interaction parameter against every other component.

For methane those are looked up. For C7+ they have to be manufactured, because C7+ is not a substance and has no critical point.

## What the engine does

From MW 218 and SG 0.8515 for Good Oil's plus fraction:

| property | value | correlation |
|---|---|---|
| normal boiling point | 998.2811638461088 degR | Soreide |
| critical temperature | 1324.2385574932478 degR | Kesler-Lee |
| critical pressure | 262.591601775175 psia | Kesler-Lee |
| acentric factor | 0.6690835265426222 | Lee-Kesler |
| volume shift | 0.15389683656773767 | Jhaveri-Youngren |
| critical volume | 14.428562605000002 ft3/lbmol | Lee-Bar-Cline |
| parachor | 588.1872 | Firoozabadi |
| Watson K | 11.73724869095868 | from Tb and SG |

Eight numbers from two, through six published correlations in sequence.

## The chain, again

Boiling point comes first, from MW and SG. Then the criticals come from the boiling point and SG. Then the acentric factor comes from the criticals and the boiling point.

So an error in the boiling point correlation propagates into everything after it, and the boiling point is the least directly constrained quantity in the chain: it is being predicted from a molecular weight and a density for a mixture that has no single boiling point.

If the report gives a measured boiling point, use it. The engine accepts one and skips the Soreide step when it is supplied, which is the right precedence: a measurement beats a correlation of it.

## Watson K as a sanity check

The Watson characterization factor is a dimensionless combination of boiling point and specific gravity, and it is roughly constant within a hydrocarbon family.

Around 12.5 means paraffinic, around 11.5 naphthenic, around 10 aromatic.

Good Oil's C7+ comes out at 11.74, which is a normal, slightly naphthenic crude heavy end. A value of 9 or 14 would say the MW and SG are inconsistent with any ordinary crude, and the arithmetic should be checked before the model is run.

That is a free check on two measured numbers and it costs one line.

## The uncertainty this introduces

The correlations are fitted to pure hydrocarbons and to petroleum fractions, and they are being applied to a lump that is neither.

That is not a criticism of the correlations, it is the nature of the problem. There is no measurement of the critical temperature of a C7+ fraction because the fraction does not have one, so the number is a modelling construct throughout.

This is why the Expert tier's tuning knobs act on exactly these properties and nothing else. The library components are measured substances with published constants; the pseudo-component is a construct, and a construct is the honest thing to adjust.

## The precision, and what it is worth

1324.2385574932478 degR is sixteen digits describing a critical temperature that does not exist for a substance that is not one substance.

The digits are reproducible arithmetic on two measured inputs. Report the critical temperature of a plus fraction to four figures at most, and carry the rest only for checking that two implementations agree.

## The misconception to avoid

"Characterization is a preliminary step before the real modelling." It IS the modelling, for a third of this fluid. Everything the equation of state does at the heavy end follows from these eight numbers, and they came from two measurements and six correlations. The flash calculation downstream is exact arithmetic on assumptions made here.

## Exercise

First, list the eight properties the engine characterizes for a plus fraction and name the correlation behind each.

Second, compute the Watson K from the reported boiling point and specific gravity, and say what a value of 11.74 tells you about the heavy end of this crude.
