# Blocked and unsourced lines

{{panel:carbon-inventory-explorer}}

## Two ways a line can fall short

buildInventory counts two kinds of shortfall, and it keeps them apart. A blocked line is a line that could not be computed: the engine cannot produce its tonnes. An unsourced line computes, but its factor has no source or version. The inventory reports both, and either one stops the inventory being reportable.

## Blocked lines in the first pass

The Igbogene first pass is built with no GWP set declared, the electricity factor box blank, the vented methane survey not yet referenced and the flare's destruction efficiency blank. Every figure in it is invented for this course. The first pass has 3 blocked line(s) and 0 unsourced line(s), and the engine names each blocked line:

| line | blocked by, or missing |
| --- | --- |
| Flaring | blocked: A destruction efficiency is required. It is not read as 100 percent: for a flare it is the answer, and it is contested. |
| Vented and fugitive methane | blocked: no global warming potential for CH4 in the declared set |
| Purchased electricity | blocked: no factor value |

The flare is refused, and atomBalanceLines turns the refusal into one blocked line named Flaring. The vented methane line is blocked because no set is declared, so there is no GWP for CH4 to convert it with. The electricity line is blocked because its factor has no value.

The survey is not referenced in the first pass either, yet the first pass counts 0 unsourced lines. The course gives the rule: a blocked line is not also counted as unsourced. The vented line is already blocked, so it is counted once, as blocked.

## Unsourced lines

Declare the GWP set and the vented methane line computes. Its survey is still not referenced, so it now shows up as unsourced. The reasons the inventory gives at that step are "1 factor(s) have no source or version; 2 line(s) could not be computed". The first reason is the unsourced survey. The second is the flare and the electricity line, both still blocked.

An unsourced line is in the totals. A blocked line is not.

## Lines added to a complete inventory

The lab takes the complete Igbogene inventory and adds two more lines, one with no registered factor and one on scope 3:

| line | reason |
| --- | --- |
| Diesel generators | A registered emission factor is required. |
| Business travel | scope 3 is not Scope 1 or Scope 2, which is all this inventory totals |

Both are blocked and named. The diesel line has no registered factor. The business travel line is on a scope the inventory does not total. The totals stay the Scope 1 and Scope 2 figures of the complete inventory, total tCO2e 42945.777, and the inventory stops being reportable: reportable false, because "2 line(s) could not be computed".

The engine returns two more blocked lines, a vented methane activity typed as -142 t and an electricity factor of -0.41, each blocked because an emission line cannot remove tonnes.

In practice, an inventory is often assembled from many contributors, and a line that vanished without a trace would be indistinguishable from a source that does not exist.

Step the panel from the first pass to the GWP set declared and watch the vented line move from blocked to unsourced.

## Exercise

Read the first pass counts, 3 blocked line(s) and 0 unsourced line(s), and the reasons at the next step. Say what the relationship between the blocked count and the unsourced count shows about how the engine counts a line that is short of two things at once.

Self check: in the first pass the vented methane line is blocked for want of a GWP for CH4 and also has no survey referenced, yet the unsourced count is 0, because a blocked line is not also counted as unsourced. Once the set is declared the line computes, and the missing survey appears as "1 factor(s) have no source or version". While it is blocked, the line is counted once, as blocked.
