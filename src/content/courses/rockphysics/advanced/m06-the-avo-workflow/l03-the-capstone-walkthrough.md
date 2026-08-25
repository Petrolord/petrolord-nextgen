# The capstone walkthrough

Seven fields, which is one more than every other capstone in this programme. This lesson walks through each.

## The task

Put the Ekene shale over the sand and screen both cases: the logged brine sand and its gas substituted twin from the Professional tier. Report the Shuey intercept and gradient for each, the gas case's Rutherford-Williams class as a number, the exact Zoeppritz reflection at 30 degrees for the gas case, and the wedge tuning thickness at 25 Hz.

## The settings

Set the frequency to 25 Hz and the class threshold to 0.02, which is the panel's default.

{{panel:rp-avo-explorer}}

## The seven values

**Brine intercept 0.03434399848203321**, tolerance 0.001.

**Brine gradient -0.16766246414664518**, tolerance 0.001.

**Gas intercept -0.06282494068620303**, tolerance 0.001.

**Gas gradient -0.2565633444602355**, tolerance 0.001.

**Gas class 3**, tolerance 0. Reported as a number, not a Roman numeral.

**Exact Zoeppritz at 30 degrees, gas case, -0.12239091302671612**, tolerance 0.001.

**Tuning thickness 16 ms**, tolerance 0.

## What each tests

The four coefficients test the Shuey computation for both cases, and the pairing tests whether the substitution was carried through correctly: getting the brine pair right and the gas pair wrong means the rocks from the tier below were not brought over properly.

The class tests whether the classification rule was applied, including that the intercept is compared against a threshold rather than to zero.

The exact value at 30 degrees tests whether the exact solution was used where it was asked for. The Shuey value there is -0.12456555923100084, which fails the 0.001 tolerance by more than a factor of two, so this field cannot be answered from the approximation.

The tuning thickness tests the wedge model, and it is graded exactly because it is an integer number of grid samples.

## The three common errors

Reporting the Shuey value at 30 degrees instead of the exact one. The two differ by 0.0021746462042847164, which is 2.17 times the tolerance.

Reporting the class as a Roman numeral. The field wants 3.

Confusing the two cases. The brine intercept is positive and the gas intercept negative, so a sign check on those two catches a transposition immediately.

## Why this capstone has seven fields

Every other tier in this programme grades six. This one grades seven because the response it describes needs two coefficients per fluid case rather than one value per quantity.

Four of the seven are the two coefficients for the two cases, and they only mean anything in pairs: an intercept without its gradient describes a stack, not a gather. The remaining three are the class, which is what the pair is usually reduced to for reporting, the exact value at one angle, which is the check on the approximation, and the tuning thickness, which says whether any of it applies to a real bed.

That is the shape of the tier written into its assessment: two cases, two coefficients each, one label, one exactness check and one resolution limit.

## Checks before submitting

Confirm the intercepts against the impedance contrasts: 0.034457 and -0.0629911815139045, which should be close to the reported intercepts without being equal.

Confirm the gradients are both negative and the gas one steeper.

Confirm the class from the rule: gas intercept below -0.02 and gradient negative gives class III, which is 3.

Confirm the tuning against $389.8484/25 = 15.594$, rounded up to 16 on the 1 ms grid.

## Worked example

Derive the gas intercept from the rock properties, so it is confirmed rather than copied.

The averages across the interface are $\bar{v}_p = 2824.3486140148097$ and $\bar{\rho} = 2244.3552258896612$. The contrasts are $\Delta v_p = 162.69722802961946$ and $\Delta \rho = -411.2895482206777$.

$$A = \tfrac{1}{2}\left(\frac{162.69722802961946}{2824.3486140148097} + \frac{-411.2895482206777}{2244.3552258896612}\right)$$

$$= \tfrac{1}{2}(0.05760522 - 0.18325510) = \tfrac{1}{2}(-0.12564988) = -0.06282494$$

which is the graded value. Note that the velocity term is positive, so the intercept is negative entirely because the density term is three times larger.

## Exercise

Record the seven capstone values and run all four checks. State what each confirmed.

Self check: the intercepts against the impedance contrasts confirm the linearisation is behaving and the rocks are the right way up. The gradient signs confirm both cases brighten with offset and the gas case does so faster. The class rule confirms the threshold was applied rather than a comparison against zero. The tuning against theory confirms the wedge model, at 15.594 ms rounded up to the 16 ms grid sample.
