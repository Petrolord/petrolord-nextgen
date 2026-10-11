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

The scaled seismic intercept sits above the modelled one at every well. The gradients split: at Ekene-1 and Ekene-3, the oil-leg wells, the seismic gradient is slightly more negative than the modelled one; at Ekene-2 and Ekene-4, the net sand wells, it is less negative. Ekene-2 carries the largest residual and Ekene-3 the smallest.

At Ekene-1, the seismic 486.838592 and -1072.562182 divided by 1882.216944 give 0.258652 and -0.569840; the modelled point is 0.170742 and -0.563558, and the distance between the two points is the residual, 0.088133. One scale divides A and B alike, and the residuals are what is left after that single least-squares factor.

## The classes

The class of each point comes from `avoClass` in engines/qi/avo.js at the stated band of 0.02, after Rutherford and Williams (1989) with class IV. Every intercept in both tables, modelled and scaled seismic, lies above that band.

| well | modelled class | seismic class | agree |
| --- | --- | --- | --- |
| Ekene-1 | I | I | yes |
| Ekene-2 | I | I | yes |
| Ekene-3 | I | I | yes |
| Ekene-4 | I | I | yes |

4 of 4 wells agree in class. QI Studio raises an issue for a class that differs.

## What agreement says

Every point at Ekene is class I, on intercepts from 0.170742 to 0.280469, while the gradients are where the wells differ. The Associate model at Ekene-1 put the top in class I with oil and with brine too, so here the class alone does not separate oil from brine.

QI Studio raises an issue where the two classes differ, and a high one for a negative scale; at Ekene neither is raised, so the residual table is the part of the comparison a study reads well by well. The residual carries more: it measures the whole misfit in A and B, a number a study can track as choices change.

## What a study states

The band of 0.02, the scale and the wells it was fitted over, and every choice under the modelled and seismic points. A residual is read against its neighbours.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "AVO at the wells", with Mean angle of near, mid and far at 10, 20, 30 and Pick half window at 8 ms. Read the scale, each well's scaled seismic A and B, its residual and its two classes from the explorer's table, and check them against the tables. Then narrow Pick half window to 4 ms, one sample, and widen it to 20 ms, and record whether Ekene-2's seismic A and B move; where they do, read its new residual and class.
