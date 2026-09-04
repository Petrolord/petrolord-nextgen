# Hammerschmidt

One constant, one molecular weight and a weight percent. It is the relation every hand calculation uses, and the engine carries the constant per fluid so a different source can be matched.

{{panel:pd-hydrate-explorer}}

## The relation and the variable it is written in

The depression is K W over M times (100 minus W), with W the inhibitor weight percent in the AQUEOUS phase and M the inhibitor molecular weight. W is not the concentration in the produced stream, not in the total liquid and not in the gas. It is the strength of the water.

K is carried per inhibitor rather than as one global, and all four ship 2335.0, so molecular weight alone tells the fluids apart. These are engine values on a published concentration.

| Inhibitor | Molecular weight | Density, lb/gal | Depression at 20.0 weight percent, degF |
| --- | --- | --- | --- |
| Methanol | 32.04 | 6.6000 | 18.2194132335 |
| MEG | 62.07 | 9.3000 | 9.4047043660 |
| DEG | 106.12 | 9.3000 | 5.5008480965 |
| TEG | 150.17 | 9.4000 | 3.8872611041 |

The depression goes inversely with M at a fixed weight percent, so that column alone fixes the ordering. TEG is a dehydration fluid, listed for completeness rather than for this job. Every one of the 24 published rows agrees with its golden to a relative 1.713062e-4, the same figure on every row, one constant against another.

## Where the relation stops

`HAMMERSCHMIDT_RELIABLE_WT_PCT` is 25.0 weight percent. Past it the relation over-predicts, being a dilute-solution result pushed past its own assumption. The engine neither clamps nor refuses. It sets a `reliable` flag, computes the number anyway, and attaches a note.

The second relation exists for that reason. Nielsen-Bucklin is a constant times the log of the water mole fraction, the right variable for a freezing-point depression. `NIELSEN_BUCKLIN_CONSTANT_F` is 129.600000 degF and the conversion uses `WATER_MOLECULAR_WEIGHT`, 18.015000. It was developed for methanol, and the catalogue flags it available for methanol alone.

## The two do not agree anywhere

For methanol the engine reports both. On the published 5.0 weight percent row they are 3.8356659439 degF and 3.7795926053 degF, a spread of 0.0560733386 degF. At the reliability line itself, 25.0 weight percent, the spread is 2.0292736312 degF, which is 9.114892 percent of the Nielsen-Bucklin value, and the engine still reports `reliable` true.

That line is where the engine changes which relation it prints, not where the physics changes.

## What it refuses

`hammerschmidtDepression` returns a bare NaN, not a refusal object, for a weight percent below 0, at or above 100, or a molecular weight that is not positive.

## The mistake

Reading W as the inhibitor fraction of everything flowing. A line making little water and injecting a modest rate is a strong aqueous phase and a weak stream at once, and only one belongs in this relation.

## Exercise

Take the four depressions at 20.0 weight percent and say what sets their order.

Then compare the methanol spread at 5.0 and at 50.0 weight percent, and say what the `reliable` flag is actually reporting.
