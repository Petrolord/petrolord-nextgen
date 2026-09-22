# The capstone walkthrough

Seven fields, which is one more than every other capstone in this programme. The brief states an interface of its own: a shale, a logged brine sand, that sand's gas twin, and a wavelet frequency. This lesson walks through each field and works it on the Ekene teaching interface.

## The task, in general

Put the stated shale over the stated sand and screen both cases: the logged brine sand and its gas substituted twin. Report the Shuey intercept and gradient for each, the largest gap between the Shuey approximation and the exact Zoeppritz solution on the brine case over 0 to 40 degrees, the exact Zoeppritz reflection at 30 degrees for the gas case, and the wedge tuning thickness at the stated frequency.

## The settings

The AVO panel opens on the Ekene shale over the Ekene sand at 25 Hz with a class threshold of 0.02. For the capstone, switch the interface to "Type an interface", type the three rocks from the brief (vp, vs and density for each), and type the stated frequency.

{{panel:rp-avo-explorer}}

## The seven fields, worked on Ekene

**Brine intercept, 0.03434399848203321.**

**Brine gradient, -0.16766246414664518.**

**Gas intercept, -0.06282494068620303.**

**Gas gradient, -0.2565633444602355.**

**Largest Shuey error on the brine case.** Read it from the tile of that name, printed to six decimals. It is the largest absolute difference between the dashed and solid brine lines at any whole degree from 0 to 40.

**Exact Zoeppritz at 30 degrees, gas case, -0.12239091302671612.**

**Tuning thickness at 25 Hz, 16 ms.** An integer number of grid samples.

The capstone interface moves every one of these. The method does not move.

## What each tests

The four coefficients test the Shuey computation for both cases, and the pairing tests whether the gas twin was carried through correctly: getting the brine pair right and the gas pair wrong means the twin was typed wrongly.

The brine Shuey error tests module 4: whether you know which case the approximation serves worse, and read the brine tile rather than the gas one beside it. The class call is still worth making for your report, but it is a one-in-four label, so the capstone grades the brine error instead.

The exact value at 30 degrees tests whether the exact solution was used where it was asked for. On Ekene the Shuey value there differs from the exact one by 0.0021746462042847164, which is far more than the tolerance, so this field cannot be answered from the approximation.

The tuning thickness tests the wedge model, and it is graded exactly because it is an integer number of grid samples.

## The three common errors

Reporting the Shuey value at 30 degrees instead of the exact one.

Reading the gas case's Shuey error where the brine case's is asked for. The two tiles sit side by side.

Confusing the two cases, or typing the gas twin into the brine rows. A brine sand that is class I has a positive intercept and its gas twin a negative one, so a sign check on the two intercepts catches a transposition immediately.

## Why this capstone has seven fields

Every other tier in this programme grades six. This one grades seven because the response it describes needs two coefficients per fluid case rather than one value per quantity.

Four of the seven are the two coefficients for the two cases, and they only mean anything in pairs: an intercept without its gradient describes a stack, not a gather. The remaining three are the brine case's largest Shuey error, which says how far the two-term approximation can be trusted on this interface, the exact value at one angle, which is the check on the approximation for the gas case, and the tuning thickness, which says whether any of it applies to a real bed.

## Checks before submitting

Confirm the intercepts against the impedance contrasts, which should be close to the reported intercepts without being equal. On Ekene they are 0.034457 and -0.0629911815139045.

Confirm the gradients are both negative and the gas one steeper.

Confirm the class from the rule: a gas intercept below the negative threshold with a negative gradient is class III.

Confirm the tuning against theory, $389.8484/f$ in milliseconds, rounded to the nearest 1 ms sample. On Ekene, $389.8484/25 = 15.594$, which the panel reads as 16.

## Worked example

Derive the gas intercept from the rock properties, so it is confirmed rather than copied. On Ekene the averages across the interface are $\bar{v}_p = 2824.3486140148097$ and $\bar{\rho} = 2244.3552258896612$, and the contrasts are $\Delta v_p = 162.69722802961946$ and $\Delta \rho = -411.2895482206777$.

$$A = \tfrac{1}{2}\left(\frac{162.69722802961946}{2824.3486140148097} + \frac{-411.2895482206777}{2244.3552258896612}\right)$$

$$= \tfrac{1}{2}(0.05760522 - 0.18325510) = -0.06282494$$

which is the gas intercept tile. Note that the velocity term is positive, so the intercept is negative entirely because the density term is three times larger. Run the same two lines on your own interface.

## Exercise

Type an interface of your own into the panel, record the seven values and run all four checks. State what each confirmed.

Self check: the intercepts against the impedance contrasts confirm the linearisation is behaving and the rocks are the right way up. The gradient signs confirm both cases brighten with offset and the gas case does so faster. The class rule confirms the threshold was applied rather than a comparison against zero. The tuning against theory confirms the wedge model on the 1 ms grid.
