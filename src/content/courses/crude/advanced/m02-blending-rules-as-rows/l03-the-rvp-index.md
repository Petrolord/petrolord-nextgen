# The RVP index

Both gasoline templates cap RVP, at 9 psi in the 50 ppm template and 8.5 psi in the 10 ppm one, and both declare its basis as index, on volume. The optimizer handles it the way the assay studio handles viscosity. It transforms the property into an index, blends the index, and turns the answer back.

## The index

The rule is RVPI = RVP^n. The index is blended on volume and inverted. The exponent is RVP_INDEX_EXPONENT, and the engine states it as 1.25: an exported constant that is the default exponent of rvpIndex and rvpFromIndex. Each of those two functions takes an exponent argument that replaces the default, and the gasoline templates call them with the default. Because the constant is exported, a learner can read it rather than trust a recollection of it.

rvpIndex takes a pressure to its index and rvpFromIndex takes an index back. The table prints both for five pressures:

| RVP psi | rvpIndex | rvpFromIndex of that index |
| --- | --- | --- |
| 3.2 | 4.2799 | 3.2000 |
| 6.2 | 9.7834 | 6.2000 |
| 9 | 15.5885 | 9.0000 |
| 12.9 | 24.4477 | 12.9000 |
| 52.8 | 142.3287 | 52.8000 |

Every round trip comes back to the pressure it started from. Four of those pressures are the Apapa components: Reformate at 3.2 psi, FCC gasoline at 6.2, Isomerate at 12.9 and Butane at 52.8. The fifth is the template's limit of 9 psi.

## The RVP row

On the index basis, w_i is the component's index and d_i is 1. The limit enters the row as its own index, so the row reads sum((RVPI_i - RVPI of the limit) v_i) <= 0, where the index of the 9 psi limit is the 15.5885 the table prints. Every coefficient is fixed, and the row is linear in the volumes exactly as the sulfur row is.

This is also why the RVP row's dual is in index units, and why module four has to convert it before it can be read as dollars per psi. The conversion uses the slope of the index at the limit, which module four reads in the lesson on the index slope.

## When a specification binds

At Apapa the recipe's achieved RVP is 9.0000 against the maximum of 9, with a giveaway of 0.0000, and the engine marks it binding. The test the engine applies is stated by a constant: a specification counts as binding when the achieved value is within BINDING_TOLERANCE, 1e-7, times the limit (or 1, if larger) of it.

## Why the index matters for the recipe

Butane costs 54.1 $/bbl at Apapa, and its RVP of 52.8 psi carries an index of 142.3287. On the index basis, every barrel of butane uses RVP room by its coefficient, its own index less the index of the limit. The recipe takes butane up to its 400 bbl availability, and RVP binds. The two facts sit side by side in the Apapa result, and module three reads them together.

{{panel:crude-recipe-explorer}}

In the panel, set the exponent to another value and watch the RVP row's coefficients move, and with them the recipe.

## Exercise

Read the rvpIndex table: the 9 psi limit carries an index of 15.5885, and the four Apapa components carry 4.2799, 9.7834, 24.4477 and 142.3287. Say which components carry a positive coefficient in the RVP row and which a negative one, and say what that shows about which components make room under the RVP limit for the others.
