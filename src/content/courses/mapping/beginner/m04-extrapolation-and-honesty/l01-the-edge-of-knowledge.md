# The edge of knowledge

Every node in the grid gets its value from the same spline, but not every node is the same kind of estimate. Some sit inside the ring of wells, hemmed in on all sides by measurements. Others sit outside that ring, where the nearest data is behind them and there is nothing ahead. The arithmetic does not distinguish the two cases. The interpretation must.

## Two words that are not synonyms

Interpolation is estimating between control points. The node at (1500, 1600) sits inside the Ekene well pattern: Ekene-1 is to the south west, Ekene-6 to the east, Ekene-3 to the north, Ekene-5 to the west. Whatever value the spline puts there is boxed in. If the estimate drifted 20 m too shallow, it would have to bend back down to reach the wells on every side, and the smoothness penalty makes that expensive. The surrounding data pins the answer.

Extrapolation is estimating beyond the control. A node out past Ekene-4 in the north east corner of the frame has wells behind it and open ground in front. Nothing on the far side pulls the surface back. The estimate there is not a compromise between measurements; it is the continuation of a trend that stops being checked the moment you leave the data.

The boundary between the two regions has a name and a shape. Stretch an elastic band around all six wells and let it snap tight. The polygon it forms is the convex hull of the control set, and it is the honest outer edge of interpolation. Inside the hull you are between wells. Outside, you are guessing.

## Why smoothness makes extrapolation worse

You might expect a smooth interpolator to be cautious outside the data, flattening out to something like an average. It does the opposite.

The thin-plate spline is built from a radial term, $r^2 \log r^2$, plus a plane. Both parts grow with distance rather than fading. A trend that the spline established inside the data does not politely stop at the last well; it keeps going, and the further out you look, the harder it runs. The surface stays perfectly smooth the whole way, which is precisely the problem. Smoothness is not the same as being right, and a smooth surface looks exactly as authoritative at 3 km from the nearest well as it does halfway between two of them.

Put Ekene numbers on it. Ekene-3 is picked at 1541 m and Ekene-4 at 1590 m. Their coordinates are (1400, 2300) and (2600, 2500), so they are about 1217 m apart: $\sqrt{1200^2 + 200^2} = \sqrt{1{,}480{,}000}$. The depth difference of 49 m across that distance is a gradient of about 4 m per 100 m. That gradient is real and it is well constrained, because it is measured at both ends. Now let the spline carry it a kilometre past Ekene-4 with nothing to stop it, and the map gains about 40 m of relief that no well ever saw. Nobody chose to invent it. It is the arithmetic behaving exactly as designed, in a place where the design has no data to work with.

The same mechanism runs in the shallow direction. Continue the rise from Ekene-4 toward Ekene-3 and out past Ekene-3, and the surface climbs. Climb far enough and the contours close on themselves. You have a four way closure on the map: a drawn, contoured, measurable structure sitting entirely in ground where the only input was a trend extended into the dark.

## Why this is a professional problem, not an aesthetic one

Closures are what get drilled. A closed contour with a defined area and a defined crest becomes a prospect, an estimated volume, and eventually a number in a report that somebody signs. A closure that exists only outside the well control is one of the classic ways that volume gets booked when the rock is not there, and it is rarely the result of anyone acting dishonestly. It is the result of a map that did not distinguish between what it knew and what it had continued.

So the requirement on the map is not that it should avoid uncertainty. Every mapped node between wells is uncertain, and that is the job. The requirement is that the map must show where it stops knowing. A surface that fades gracefully to the frame edge hides that boundary. A surface that simply stops, leaving blank ground where the control runs out, declares it.

That declaration is what the next lesson is about: the extrapolation limit, which is the engine's mechanism for refusing to draw what it cannot support.

## Exercise

Take the two shallowest wells, Ekene-3 (1400, 2300) at 1541 m and Ekene-6 (1900, 1800) at 1546 m. Work out the distance between them and the depth gradient along that line, then estimate how much shallower the surface would be if that gradient were carried 800 m beyond Ekene-3, and say in one sentence why that estimate deserves no confidence.

Self check: the separation is $\sqrt{500^2 + 500^2} = \sqrt{500{,}000}$, about 707 m. The depth difference is 5 m, so the gradient is about 0.71 m per 100 m, and carrying it 800 m past Ekene-3 shallows the surface by roughly 5.7 m. The reason it deserves no confidence is that not one of the six wells sits on the far side of Ekene-3 to confirm or contradict the trend.
