# Stability classes and the Briggs sigmas

{{panel:cq-release}}

How fast a plume spreads depends on the turbulence of the air, and the turbulence depends on the weather. Pasquill and Gifford sorted weather into six stability classes, A to F, and Briggs fitted formulas for the spreads in each. The engine uses the Briggs rural open country set, as ALOHA prints it. The class is often the input that moves a plume result the most.

## Six classes

Class A is the most unstable: a sunny afternoon with light wind, when heated ground drives strong vertical mixing. Class F is the most stable: a clear night with light wind, when the air near the ground is still and layered. Class D is neutral, typical of overcast skies or stronger wind. The engine carries exactly these six, and refuses any other letter:

> stabilityClass: must be a Pasquill-Gifford class, one of A, B, C, D, E, F

## The Briggs formulas

The basis reads, verbatim: "Briggs (1973) rural open country: sigma_y = sy1 x / sqrt(1 + sy2 x); sigma_z = sz1 x (1 + sz2 x)^sz3". x is the downwind distance. sigma_y is the crosswind spread and sigma_z the vertical spread, both in m. The crosswind form is the same shape in every class, and only sy1 changes from class to class. The vertical form changes shape: in classes A and B its exponent is zero, so sigma_z grows in straight proportion to distance, while in the stable classes it bends over and grows ever more slowly. The coefficients, as the engine exports them:

| class | sy1 | sy2 | sz1 | sz2 | sz3 |
| --- | --- | --- | --- | --- | --- |
| A | 0.22 | 0.0001 | 0.2 | 0 | 0 |
| B | 0.16 | 0.0001 | 0.12 | 0 | 0 |
| C | 0.11 | 0.0001 | 0.08 | 0.0002 | -0.5 |
| D | 0.08 | 0.0001 | 0.06 | 0.0015 | -0.5 |
| E | 0.06 | 0.0001 | 0.03 | 0.0003 | -1 |
| F | 0.04 | 0.0001 | 0.016 | 0.0003 | -1 |

At 1000 m the vertical spread in class A is 200.000000 m and in class F 12.307692 m. The stable plume stays thin.

## A warning and a misprint

Outside 100 m to 10 km the engine still returns the sigmas, with a warning attached:

"the downwind distance is outside 100 m to 10 km, the range these curves are usually quoted for; treat the result as an extrapolation"

The engine's validation record says that range comes from memory of the usual textbooks, with no source it read behind it. So the engine answers, and says plainly how far to trust the answer.

ALOHA prints the class D sz2 as 0.0015, and notes that a value of 0.00015 printed since Briggs 1973 is incorrect. The engine carries 0.0015. The difference is large:

| sz2 | sigma_z at 1000 m, class D |
| --- | --- |
| 0.0015, the engine | 37.947332 |
| 0.00015, the misprint, derived | 55.950288 |

The misprint is an erratum in the published literature. A study that copies coefficients from an older textbook should check this one.

## The class at 500 m

The UBIT release at 500 m, ground level, by class:

| class | concentration mg/m3 | concentration ppm |
| --- | --- | --- |
| A | 19.767914 | 17.266333 |
| B | 45.301469 | 39.568680 |
| C | 103.663813 | 90.545414 |
| D | 239.712839 | 209.377772 |
| E | 555.698014 | 485.375803 |
| F | 1562.900663 | 1365.119445 |

The stable night-time class F gives the highest ground level concentration, derived 6.519887 times class D, because the plume stays thin and near the ground.

## Exercise

On the plume view, run UBIT at 500 m in class D and then in class F, and read the sigmas and the concentration each time. Divide the two concentrations and compare the quotient with the figure above. Then set the distance to 60 m and read the warning. Write one sentence on which class a study of a night-time release should report, and why.
