# Class agreement and misfit

With one scale over every well, each well's seismic intercept and gradient become reflection coefficients and can be set beside the modelled ones. The comparison returns two things per well: a residual, the size of the misfit, and whether the two points fall in the same AVO class.

## Scaled points and the residual

Each well's seismic A and B are divided by the scale, 1882.216944. The residual is the distance between that scaled point and the modelled one on the (A, B) crossplot, in reflection coefficient units.

| well | modelled A | modelled B | scaled seismic A | scaled seismic B | residual |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | 0.170742 | -0.563558 | 0.258652 | -0.569840 | 0.088133 |
| Ekene-2 | 0.210627 | -0.501240 | 0.265206 | -0.410601 | 0.105803 |
| Ekene-3 | 0.194681 | -0.641524 | 0.249870 | -0.663631 | 0.059452 |
| Ekene-4 | 0.216991 | -0.520090 | 0.280469 | -0.475262 | 0.077711 |

The scaled seismic intercept sits above the modelled one at every well: the seismic top reads harder at normal incidence than the logs predict. The gradients split: at Ekene-1 and Ekene-3, the oil-leg wells, the seismic gradient is close to the modelled one and slightly more negative; at Ekene-2 and Ekene-4, the net sand wells, it is less negative. Ekene-2 carries the largest residual and Ekene-3 the smallest.

One scale multiplies A and B alike, so it cannot match an intercept that reads high at every well and a gradient that reads close at the same time. The residuals are what is left after the single best factor.

## The classes

The class of each point comes from `avoClass` at the stated band of 0.02, after Rutherford and Williams (1989) with class IV: A above 0.02 is class I; A within 0.02 of zero is class II; otherwise class III when B is at or below zero and class IV when B is above it.

| well | modelled class | seismic class | agree |
| --- | --- | --- | --- |
| Ekene-1 | I | I | yes |
| Ekene-2 | I | I | yes |
| Ekene-3 | I | I | yes |
| Ekene-4 | I | I | yes |

4 of 4 wells agree in class. QI Studio raises an issue for a class that differs.

## What agreement says

Every intercept in both tables sits well above 0.02, so every point is class I whatever its gradient. Class agreement at Ekene is the easy kind: the points are far from any boundary, and the gradient, where the wells differ, plays no part in the class. The Associate model at Ekene-1 put the top in class I with oil and with brine too. Agreement in class fits the polarity and the broad character of the top; it says nothing about the fluid.

The residual carries more: it measures the whole misfit in A and B, a number a study can track as choices change.

## What a study states

The band of 0.02, the scale and the wells it was fitted over, and every choice under the modelled and seismic points. A residual is read against its neighbours.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "AVO at the wells", with Mean angle of near, mid and far at 10, 20, 30 and Pick half window at 8 ms. The explorer prints the inputs and no scale, so from its table and the scale of 1882.216944 work out each well's scaled seismic point, residual and class by hand, and check them against the tables. Then narrow Pick half window to 4 ms, one sample, and widen it to 20 ms, and record whether Ekene-2's seismic A and B move; where they do, recompute its residual and class.
