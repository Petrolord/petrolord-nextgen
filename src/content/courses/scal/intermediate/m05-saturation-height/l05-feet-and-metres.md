# Feet and metres

The engine speaks field units: psi, dyn/cm, md, and heights in feet. The Ekene field speaks metres, and always has: the contact at 1560 m, the crest column of 20.2818603515625 m, every well top in the geoscience ladder. This module has been converting quietly at every step. This lesson makes the conversion loud, because the border between the two unit systems is where saturation-height work most often goes wrong, and the errors it produces are the worst kind: plausible-looking numbers a factor of three from the truth.

## One exact constant

The entire bridge is a single definition:

$$1 \ \text{ft} = 0.3048 \ \text{m, exactly}$$

Not approximately. The international foot is defined as 0.3048 m, so dividing by 0.3048 to go from metres to feet, or multiplying to come back, introduces no rounding at all. Both worked conversions this module relies on are exact round trips:

The entry height: $10.31162356877775 \ \text{ft} \times 0.3048 = 3.142982863763458 \ \text{m}$, and back again by division.

The crest height above the FWL: $76.85316015526888 \ \text{ft} \times 0.3048 = 23.424843215325957 \ \text{m}$, which is exactly the mapped column of $20.2818603515625$ m plus the entry height.

When a chain of yours disagrees with the engine's, check the unit border first; a conversion done twice, or not at all, survives a surprising number of readings because the digits themselves look reasonable.

## The classic error, priced

The gradient $0.07133527522935783$ is in psi per FOOT. Feed it metres and nothing warns you. Take the crest height in metres, $23.424843215325957$, and multiply by the psi-per-foot gradient as if the units matched:

$$23.424843215325957 \times 0.07133527522935783 = 1.6710176379698325 \ \text{psi} \quad \text{(wrong)}$$

The correct capillary pressure at the crest, from lesson 4, is $5.482341331922022$ psi. The mistake understates it by exactly the conversion factor, $1/0.3048 = 3.2808...$, and the damage flows downstream: the too-low $P_c$ gives a too-low $J$, which lands high on the drainage curve and reports the crest far wetter than it is. A modeler who makes this slip concludes the structure barely drains at all. The reverse slip, feeding feet into a per-metre gradient, paints the whole transition zone three times thinner than it is and reports crest-dry rock a metre above the contact.

If you prefer to work in metres end to end, convert the GRADIENT once instead of every height:

$$\frac{0.07133527522935783}{0.3048} = 0.2340396168942186 \ \text{psi/m}$$

Either discipline works. Converting each height and converting the gradient are the same arithmetic in different orders. What fails is mixing them, and the tell is always the factor 3.2808 or its inverse sitting quietly inside a result.

## A habit worth forming

Write the unit on every height the moment you write the number, even in scratch work, even when it is obvious. The capstone asks for the entry height and the free water level in METRES, at tolerances of a hundredth and two hundredths of a metre; an answer delivered in feet is not near the tolerance, it is off by a factor of three, and the grader cannot give partial credit for a unit. The engine will not convert for you: `swVsHeight` returns `h_ft` and the name of the field is the only warning it gives.

## The misconception to avoid

"Metric versus field units is a display preference." It is not; it is part of the number. The constants in this module are unit-laden: 0.4335 exists only as psi per foot per unit specific gravity, and the Leverett scaling factor carries psi because sigma came in dyn/cm and k in md. Changing a unit changes which constants are valid. The safe mental model is that every equation in this course is a field-unit equation, and metres exist only at the boundary, converted on the way in and on the way out through 0.3048.

## Exercise

First, an engineer reports the Ekene entry height as "10.31 m" after reading the engine output. State the two distinct errors compounded in that single reported value, and give the correct figure in metres to full precision. Second, redo lesson 3's halfway rung in pure metric: convert the gradient to psi/m as above, then compute the capillary pressure at the height where $S_w$ first reaches 0.50, which is $6.285965727526915$ m above the contact, remembering to measure from the free water level. Confirm you land on the same psi as the field-unit chain.
