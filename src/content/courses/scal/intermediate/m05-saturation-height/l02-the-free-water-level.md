# The free water level

Ask three people where the water starts in the Ekene field and you will get the same answer: 1560 metres, the contact the geoscience ladder mapped, the one the volumetric booking stood on. Ask the capillary model the same question and it gives a different number, three metres deeper. Both are right. They are answers to different questions, and this lesson is about keeping the two questions apart.

## Two definitions that are not the same

The **free water level** (FWL) is a pressure datum: the depth at which the oil and water phase pressures are equal, so $P_c = 0$. It is where lesson 1's height axis has its zero. No log measures it directly; it is where the two phase pressure lines cross.

The **contact** is a saturation observation: the shallowest depth at which the rock is fully water saturated, $S_w = 1$. It is what a resistivity log sees, what a well test flows, what a map shows.

If rock could hold oil at any pressure above zero, the two would coincide. It cannot. A drainage curve has an entry pressure: below some finite $P_c$, the largest pore throats have not yet let oil in, and the rock stays at $S_w = 1$ even though $P_c > 0$. Between the FWL and the contact there is a band of rock that is above the pressure datum yet still fully wet, exactly as thick as the entry pressure is tall.

## Sizing the band for Ekene

Module 1 ended on the Ekene entry pressure. The designed J curve evaluates to $J = a = 0.25$ at $S_w = 1$, and scaling to the reservoir rock gives

$$P_c^{entry} = 0.25 \times 2.942330021361175 = 0.7355825053402938 \ \text{psi}$$

Convert with lesson 1's gradient:

$$h_{entry} = \frac{0.7355825053402938}{0.07133527522935783} = 10.31162356877775 \ \text{ft} = 3.142982863763458 \ \text{m}$$

The fixture's design convention then places the column so that the model and the map agree where they must: $S_w$ reaches 1.0 exactly at the mapped 1560 m contact. That pins the free water level at

$$FWL = 1560 + 3.142982863763458 = 1563.1429828637636 \ \text{m TVD}$$

Read the ordering carefully, because it trips people in both directions. The FWL is DEEPER than the contact. The contact is the TOP of the fully water saturated rock, and the entry band hangs between them. A well drilled through 1561 m finds water on the logs, yet the pressure datum it would need for a gradient intersection sits at 1563.14 m, not at what the log shows.

## Why the distinction earns its keep

Three places the difference between 1560 and 1563.1429828637636 stops being pedantry:

First, pressure work. Formation tester gradients intersect at the FWL, not the contact. Force the intersection through the mapped contact and every height in the field is wrong by 3.14 m before you start.

Second, volumetrics across fault blocks. The FWL is the datum a connected pressure system shares. Two blocks with the same FWL can show different apparent contacts if their entry pressures differ, and reading those as different fluid systems invents compartments that are not there.

Third, this course's own capstone: it grades the entry height, the FWL depth, and the crest saturation as three separate numbers precisely because they are three separate ideas, and the tolerance on the FWL is two hundredths of a metre. The mapped contact, offered as the FWL, fails by 150 tolerances.

## At the panel

{{panel:sc-jfunction-explorer}}

Bring up the saturation height view. The tiles across the top show the chain this lesson just walked: the psi-per-J scaling factor, the entry pressure, the entry height in metres, and the FWL depth of $1563.1429828637636$ m. Read the profile plot from the bottom up: below the FWL nothing is defined; from the FWL up to the contact the curve pins at $S_w = 1$ while capillary pressure builds from zero to the entry value; only above 1560 m does saturation begin to fall. Now change the Swirr override slightly and watch what does NOT move: the entry pressure, the entry height, and the FWL stay put, because $J$ at $S_w = 1$ is the coefficient $a$ regardless of where the asymptote sits.

## The misconception to avoid

The one this lesson exists to kill: **the free water level is not the mapped contact.** The contact is where water STOPS being the only phase on the way up, and it sits one entry height ABOVE the FWL. Whenever a document says "OWC" check which of the two it means; the Ekene fixture keeps the distinction explicit so that the habit forms here, on a field where the gap is a friendly three metres, rather than on a low-contrast field where it can be tens.

## Exercise

A colleague reports the Ekene free water level as 1560 m because "that is where the water starts on the map."

First, compute the error in their implied entry pressure: what capillary pressure does their claim assign to the rock at 1560 m, and what is the designed value? Second, state in two sentences what their mistake would do to a formation-tester gradient intersection drawn to find the datum, and which direction the resulting height errors would run for every cell in the field.
