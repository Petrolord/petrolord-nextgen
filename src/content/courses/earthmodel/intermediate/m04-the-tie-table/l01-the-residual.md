# The residual

One subtraction turns a landed pick and a sampled surface into the tier's unit of information. This lesson fixes its definition, its sign, and its reading, because a residual whose sign you cannot interpret is a number, not information.

{{panel:em-tie-explorer}}

## Definition and sign

$$r = \mathrm{TVDSS}_{\mathrm{pick}} - z_{\mathrm{surface}}$$

Both terms in metres below sea level, positive down. So a POSITIVE residual means the pick's depth number is larger, the well found the formation DEEPER than the surface claims; a negative residual means the well found it shallower. The convention is arbitrary, its consistency is not: the engine documents it, the capstone grades signed values against it, and half the classic tie-table blunders are sign conventions silently flipped between tools.

A physical mnemonic that survives pressure: the residual is how far you would have to push the surface DOWN, at that point, to touch the pick.

## One residual, read three ways

Take W1 TopA: r equals minus 2 m. Three readings are always simultaneously on the table.

The surface is wrong there. The TopA surface near W1 sits 2 m too deep; the fix is to adjust the surface toward the well, and 2 m is the adjustment.

The pick is wrong there. The geologist placed TopA 2 m too shallow in W1's logs; the surface is fine.

Both are fine and the model's resolution is the gap. A 50 m grid cannot honour every well exactly; small residuals are the texture of a gridded model, not defects.

The residual cannot arbitrate among these. Choosing requires outside information: confidence in the picks, the surface's data density there, the size of residuals at neighbouring wells. What the residual DOES settle is the size and direction of the disagreement, and that is already enough to rank problems and allocate attention, which is what a QC table is for.

## Magnitude calibration

Calibrate against the model's own scales before calling any residual large. The frame's cells are 50 m; zone A averages 36 m thick; zone B, where it exists, is 16 m and its whole existence is a 180 node question. Against those scales: residuals of a metre or two, like W1's and W3's TopA and W4's half metre, are noise-level, comfortably below anything the model resolves. Residuals of 5 to 8 m, like the TopB entries, are worth a look and probably tolerable. Residuals of 36, 37 and 45 m are as large as an entire zone thickness, and something specific must be causing them. The next three lessons hunt that cause.

The panel draws each residual as a dashed bar at true section scale, which is deliberately honest: the small ones vanish at this scale, and the three monsters are unmissable.

## Worked example

Compute W2's TopB residual from its parts, both already derived in this course. Landed TVDSS: 1581.5162510844414 (module two). Sampled clamped TopB at the landing: 1573.1978994886435 (module three's blend machinery, at fractional column 13.066 on row 4). Residual: $1581.5162510844414 - 1573.1978994886435 = 8.318351595797822$ m, positive, pick deeper than surface. This is one of the capstone's graded values, and every digit of it decomposes into trajectory times sampling, which is the point of having built both carefully.

## Exercise

Using the sign convention, state the direction of disagreement for each: W1 TopA at minus 2, W4 TopA at plus 0.5, W3 BaseB at plus 37. For the last one, say which of the three readings above you would bet on BEFORE seeing the next lessons, and what additional fact about the model you would want to check first.
