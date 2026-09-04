# What a pick hides

Every row records the correlation. No row records the station. That asymmetry is why one of these two mistakes is loud and the other is silent.

{{panel:pd-remedy-explorer}}

## One well, one list, four answers

The teaching well EBOCHA-5 is not a published case. The same nine candidates at 3100.0 Mscf/d, sized at two stations under two correlations.

| Station | Correlation | Pick, in | Ratio of the pick |
| --- | --- | --- | --- |
| 7500.0 ft shoe | coleman | 3.476 | 1.0022156322 |
| 7500.0 ft shoe | turner | 3.068 | 1.0720838440 |
| Wellhead | coleman | 3.740 | 1.0444599177 |
| Wellhead | turner | 3.476 | 1.0076140183 |

Sizing at the wellhead rather than at the controlling station is worth 0.264 in of tubing under Coleman and 0.408 in under Turner. Two of those four runs pick 3.476 in, from opposite errors.

## Why the station is the quiet one

`sizeTubingForRate` takes bare pPsia, tempR and z. Every row carries idIn, correlation, adjustment, the density, both velocities, the area, the critical rate, the ratio and the loaded flag. Change the correlation and the field named correlation changes with it, so that assumption sits in the return value where a reviewer sees it. Change the station and nothing acquires a label: the pressure and temperature survive only inside the density they produced, and the object names no depth at all. Two sizings run at two stations on one well therefore come back looking like two ordinary sizings, and the wrong one is not optimistic in any visible way. It is unmarked.

## What the unmarked answer says

Sized at the wellhead under Coleman, the list returns 3.740 in. The current string is 3.548 in, so the answer is that the existing tubing is smaller than it needs to be and no workover is required. At the same moment the current string reads 1.1605604334 at the wellhead and 0.9619521855 at the controlling station, and the well is loading over the bottom 40.0000 percent of its tubing.

## The mistake

Handing the sizing whatever conditions were nearest. The controlling point of the profile already carries pPsia 1500.0, tempR 653.67, z 0.9142643742, idIn 3.548 and depthFt 7500.0, so it can be passed straight in. Nothing makes a caller do it, and nothing complains afterwards.

## What it refuses

The function refuses to guess a station and refuses to warn about one, having no opinion about where its inputs came from. It also will not compare its pick to the string already in the well: 3.548 in appears only as another candidate, and that it is the current tubing is knowledge the caller has and the function does not.

## Exercise

Run all four combinations in the panel and record the four picks and their ratios.

Then say which single field you would add to a row to make the wellhead run distinguishable from the controlling run.
