# Computed and reportable

{{panel:carbon-inventory-explorer}}

## Two flags on every inventory

buildInventory returns two flags that are easy to confuse. computed says whether the inventory produced totals. reportable says whether those totals can be reported. An inventory can be computed and still not be reportable, and when it is not, the engine says why.

## Five steps from a first pass

The digest builds the Igbogene inventory as a first pass, with no GWP set declared, the electricity factor box blank, the vented methane survey not yet referenced and the flare's destruction efficiency blank. Then it closes each gap in turn. Every row is a buildInventory call, and every figure is invented for this course:

| step | lines | Scope 1 tCO2e | Scope 2 tCO2e | total tCO2e | computed | reportable | not reportable because |
| --- | --- | --- | --- | --- | --- | --- | --- |
| as a first pass | 3 | 23121.448 | 0.000 | 23121.448 | true | false | the global warming potential set is not declared; 2 line(s) could not be computed |
| the GWP set declared | 3 | 27353.048 | 0.000 | 27353.048 | true | false | 1 factor(s) have no source or version; 1 line(s) could not be computed |
| the flare efficiency entered | 5 | 30030.777 | 0.000 | 30030.777 | true | false | 1 factor(s) have no source or version; 1 line(s) could not be computed |
| the electricity factor entered with its source | 5 | 30030.777 | 12915.000 | 42945.777 | true | false | 1 factor(s) have no source or version |
| the survey referenced | 5 | 30030.777 | 12915.000 | 42945.777 | true | true | none |

## Reading the steps

computed is true in every row. The engine produced a total at every step, from 23121.448 tCO2e in the first pass to 42945.777 tCO2e at the end. reportable is false in the first four rows and true only in the last.

The first pass has two reasons: "the global warming potential set is not declared" and "2 line(s) could not be computed". Those are the vented methane, blocked for want of a GWP for CH4, and the electricity, blocked for want of a factor value. The flare is refused and contributes no line at all.

Declaring the set lets the vented line compute, and Scope 1 becomes 27353.048 tCO2e. The survey is still missing, so a new reason appears: "1 factor(s) have no source or version".

Entering the flare's efficiency adds the flare's two lines. The line count goes from 3 to 5, and Scope 1 becomes 30030.777 tCO2e. The reasons do not change, because the flare's lines are atom-balance lines with complete provenance.

Entering the electricity factor with its source clears the blocked line, and Scope 2 becomes 12915.000 tCO2e. One reason remains.

Referencing the survey closes the last reason. The total is 42945.777 tCO2e, as it was one step before. What changed is the flag: reportable true, with the reason "none".

## The last two rows

Read the last two rows side by side. Every figure is the same. The only difference is a source on one factor, and it is the difference between an inventory that can be reported and one that cannot. In these steps the inventory became reportable only once the set was declared, every line computed and every factor carried a source and a version.

In practice, a verifier asks where each factor came from before looking at the arithmetic, and the reason list is the engine's answer to that question.

Use the panel's stepper to move from the first pass to the survey referenced, and read the reason list at each step.

## Exercise

Read the rows "the electricity factor entered with its source" and "the survey referenced". Say what the relationship between their totals and their reportable flags shows about the difference between computed and reportable.

Self check: both rows total 42945.777 tCO2e and both are computed true. The first is reportable false because "1 factor(s) have no source or version", and the second, with the survey referenced, is reportable true with the reason "none". Computed is true at both steps, and reportable turns true only when the last reason is closed.
