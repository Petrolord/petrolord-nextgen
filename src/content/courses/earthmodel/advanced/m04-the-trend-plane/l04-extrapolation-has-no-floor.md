# Extrapolation has no floor

A plane is a law, and a law does not know where the data stopped. This lesson takes the fitted trend where no data supports it and watches it fail in the specific, instructive way linear models fail: smoothly, confidently, and without bound.

## The plane far from home

Evaluate $0.38 - 0.00004x - 0.00001y$ at increasing distance from the control cluster. On the frame it stays reasonable: 0.32 down to 0.2625, all plausible porosities. At (5000, 2500), 3 km east of the last well: 0.155, half the field's porosity, presented with the same confidence. At (9000, 2500): minus 0.005. NEGATIVE porosity, a physical impossibility, delivered by the same three multiplications that earned full marks at the graded probe. Solve for the zero contour: at y 2500 the plane crosses zero at exactly x 8875.

Nothing malfunctioned. A linear trend HAS no floor: its gradient is constant forever, so any nonzero gradient eventually drives any bounded physical quantity through zero and beyond. The absurdity at 9 km is manufactured by the same coefficient doing honest work at 1.25 km; distance is the only variable that changed.

## Kriging's opposite temperament

Run the comparison that the engine makes easy. Simple kriging at (9999, 9999), absurdly far from every control point: 0.2905162808206047, the data's arithmetic mean, a perfectly sensible porosity. Kriging's far-field behaviour is BUILT IN: beyond the variogram's reach, weights collapse and the estimate relaxes to the mean. The estimator gets LESS confident with distance in exactly the sense that it retreats to the safest summary it has, while the trend gets MORE extreme with distance because extremity is what a gradient does.

Neither behaviour is "right". The kriged far field pretends the far rock resembles the average of four nearby wells, which is its own unsupported claim, delivered gently. The trend's far field at least LOOKS broken, which is a kind of honesty; the kriged far field looks fine, which is more dangerous when nobody checks the data footprint. The Expert reading: both maps carry a data-distance beyond which they are decoration, and the difference is only in how loudly they admit it.

## Bounding the trustworthy domain

A workable rule for a trend's domain: the convex hull of the control points, padded by no more than the typical well spacing. Here the hull of the four points spans x 1100 to 2050, y 2100 to 2700, and the spacing runs 300 to 600 m: the trend has standing on most of the frame's south and east, and NO standing in block 1's northern arm, y above 2700, where the nearest control is over 500 m away and the fault forbids using three of the four points anyway. The graded probe at (1250, 2250) sits comfortably inside the hull's padding, which is why it is a fair question; the same three multiplications at (1250, 2900) would be numerology with the same syntax.

The mapping ladder's Expert tier built this rule mechanically, with hulls and cross-validation; here it is judgement supported by the panel: on the profile row the green curve is data-adjacent everywhere, which is precisely why the profile was drawn at y 2200 and not y 2900.

## Worked example

Find where the plane's prediction stops being distinguishable from ignorance, using the data's own scatter as the yardstick. The four control values span 0.2765 to 0.315, a range of 0.0385. Ask: at what distance does the trend's PREDICTED CHANGE exceed that entire observed range? Along the steepest direction the gradient is $4.123 \times 10^{-5}$ per metre, so the plane predicts a full observed-range's worth of change every $0.0385 / 4.123 \times 10^{-5} = 934$ m. Beyond roughly one kilometre from the data, the trend is asserting variation LARGER than everything it was shown. That is a defensible, one-line way to justify the hull-plus-spacing rule to a reviewer: past 900-odd metres, the model is all gradient and no data.

## Exercise

Compute the coordinates at which the plane predicts porosity 0.40, higher than its own intercept, and explain in one sentence why the answer ("nowhere reachable" is not the answer) is a second, distinct demonstration of the same no-floor pathology, this time with no physical impossibility involved.
