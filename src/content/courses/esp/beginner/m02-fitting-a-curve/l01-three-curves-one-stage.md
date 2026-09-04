# Three curves, one stage

Two kinds of stage curve ship in this package and they behave differently. One is a fit to measurements. The other is a fit of a shape to itself.

{{panel:pd-stage-explorer}}

## The vendor fit

`fitStageCurve` puts a least squares cubic through points read off a manufacturer published curve. On the published golden vendor curve that is five points and a head fit of degree 3, so four coefficients are asked to pass through five points and cannot. The residual that leaves behind is the only residual in this course worth quoting.

The efficiency fit is a cubic too, degree 3 on the same five rates. Brake power fit present is false, so a stage has two fitted curves and one derived one.

## The reference model

`referenceStageCurve` does something else entirely. It generates nine points from four named parameters and fits them with a quadratic, degree 2. The generating shape is itself quadratic in rate, so the fit recovers it exactly: the head fit rmse on ref-400-1000 is 0.00000000000018 ft and its efficiency fit rmse is 0.00000000000001 fraction. On ref-540-2500 the head fit rmse is 0.00000000000026 ft.

Those are not good fits. They are a shape fitted to itself, and the residual is machine noise rather than evidence. A reference stage is a shape with no manufacturer part number behind it, and quoting one as a real pump is a provenance error, not a rounding one.

## The two sets of coefficients

The vendor head fit, in the normalised variable z equal to rate divided by a scale of 3500 bbl/d, carries 28.9857142857 ft on z to the zero, 19.7499999999 on z, -29.7499999999 on z squared and -0.0000000001 on z cubed. That last one is worth staring at. The head fit is called a cubic and the least squares put essentially nothing on its cubic term, so the published head points describe a parabola.

The efficiency fit does not behave that way: -0.420571428583, 3.403333333388, -2.905000000079 and 0.571666666703 fraction on the same four powers. The cubic term is real, which is why the efficiency curve is not symmetric about its peak.

## The mistake

Reading a reference stage residual as a quality score. A lesson or a report that says a fit is good because its rmse is 0.00000000000026 ft has quoted a number that could never have been anything else. The number that means something is the vendor curve's, because its points came from outside the arithmetic that fitted them.

## What it refuses

Neither route fits brake power on this curve, because no vendor power points exist to fit. Neither route knows the pump: ref-540-2500 is labelled a reference stage, 540 series, 2500 bbl/d BEP, and carries a housing outside diameter of 5.13 in and nothing else that a purchase order could use.

## Exercise

Read the head fit rmse of the vendor curve and of ref-540-2500 in the panel.

Then write one sentence saying which of the two numbers tells you something about a pump, and why the other one cannot.
