# Formation pressure from SIDPP

One reading, one depth, one answer.

{{panel:wc-killsheet-explorer}}

## The expression

    formation pressure = mud density x g x TVD at the bit + SIDPP

Three inputs. Two of them are known before the kick and only one is measured during it.

## The two published scenarios

On the horizontal well at 1440 kg/m3 and 1214.859173174 m of TVD:

| scenario | SIDPP | formation pressure |
|---|---|---|
| moderate | 2000000 Pa | 19155726.143274635 Pa |
| small | 800000 Pa | 17955726.143274635 Pa |

The slant well's bit sits far deeper, so the same two SIDPP readings there give formation pressures roughly twice as large. Working out how much larger is left to you: the true vertical depth at its bit is one of the numbers module 2 taught you to walk out of the survey.

## Read the two wells against each other

The same shut-in reading on two different wells gives very different formation pressures, because the mud columns are very different.

That is obvious and it is worth saying, because the SIDPP on its own is sometimes quoted as if it were the thing that mattered. It is not: it is the DEFICIT, and the deficit is only meaningful with the column it is a deficit against.

## The equivalent mud weight version

Divide the formation pressure by g and by the TVD and you have the pore pressure expressed as a mud weight.

On the horizontal well the moderate scenario gives 1607.873978399 kg/m3, which is the kill mud weight. That equality is not a coincidence: the kill mud weight IS the pore pressure gradient expressed as a density.

## Why that is the useful form

Because it is directly comparable against the mud weight you have, the fracture gradient, and every other pressure in the well design, all of which are quoted as densities.

A formation pressure in pascals has to be converted before it can be compared with anything.

## What can be wrong

**The TVD**, if the survey is out or if the measured depth was used.

**The mud density**, if the mud in the string is not what the report says. After a long trip or a slug, it may not be.

**The SIDPP reading itself**, if the pressure has not stabilised. That is the next lesson but one.

## Exercise

Convert both of the slant well's formation pressures above into equivalent mud weights.

Check them against the kill mud weights the panel reports for the same scenarios, and confirm that the two are the same number.
