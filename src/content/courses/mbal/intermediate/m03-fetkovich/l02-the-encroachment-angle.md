# The encroachment angle

Aquifers rarely surround a reservoir completely. A fault seals one flank, a facies change pinches out another, and the water arrives through a wedge rather than through a full ring. Fetkovich handles this with one number: the encroachment angle $\theta$, the arc in degrees over which the aquifer is actually in contact with the reservoir, expressed as the fraction

$$f = \frac{\theta}{360}$$

For Ahmed Example 10-10, $\theta$ is 140 degrees: the aquifer touches the reservoir over 140 degrees of arc and is absent over the other 220. This lesson works the arithmetic on the teaching aquifer of lesson 1, where $\theta$ is 180 degrees and $f = 0.5$, and leaves the published case to you.

That is the easy part. The hard part is knowing where in the calculation the fraction gets applied, because it belongs in two places and in neither of them does it belong twice. Get that wrong and your aquifer is $360/\theta$ times too small, with no error message and no obvious symptom.

## Two volumes with the same name

The published solution quotes an initial aquifer volume of twenty eight billion barrels. That is the number a reader lifts into a spreadsheet. It is also the FULL CIRCLE volume: the volume of the complete ring of aquifer between the reservoir radius and the aquifer radius, all 360 degrees of it, most of which is not there.

Compute the same thing for the teaching aquifer and see. The ring's bulk volume is $\pi (r_a^2 - r_e^2) h$, and the pore volume multiplies by porosity:

$$W_i = \frac{\pi \left( r_a^2 - r_e^2 \right) h \, \phi}{5.615}$$

With $r_a$ 36800 ft, $r_e$ 9200 ft, $h$ 80 ft and $\phi$ 0.22:

$$r_a^2 - r_e^2 = 1269600000 \ \text{ft}^2$$

$$\pi \times 1269600000 \times 80 \times 0.22 = 70198762180.75778 \ \text{ft}^3$$

$$W_i = \frac{70198762180.75778}{5.615} = 12502005731.212427 \ \text{bbl}$$

Run the published geometry through the same line and you reproduce the book's twenty eight billion to its four printed figures. The full circle it is.

The wedge share, the water that physically exists on the teaching aquifer's 180 degree flank, is a separate quantity:

$$W_{i,\text{wedge}} = 12502005731.212427 \times 0.5 = 6251002865.606214 \ \text{bbl}$$

Both numbers are correct. They answer different questions, and in the published example only one of them is quoted in the book.

## Where the fraction is spent

The volume that matters to the material balance is not $W_i$ at all. It is $W_{ei}$, the maximum water the aquifer can ever deliver by expansion, which is the wedge pore volume multiplied by total compressibility and by the initial pressure:

$$W_{ei} = c_t \, W_{i,\text{wedge}} \, p_i$$

For the teaching aquifer, with $c_t$ 0.000006 per psi and $p_i$ 2740 psia:

$$W_{ei} = 0.000006 \times 6251002865.606214 \times 2740 = 102766487.11056614 \ \text{bbl}$$

The Professional capstone asks for $W_{ei}$ on the published geometry, the same chain with its own inputs.

Notice the shape of what just happened. The angle fraction was applied once, on the way from the full circle to the wedge, and $W_{ei}$ inherited it. The productivity index also carries $f$, once, in its numerator. So $f$ appears exactly twice in the whole method, once in the storage term and once in the flow term, and both times it is applied to a full-circle quantity to produce a wedge quantity.

## The trap

Now imagine a reader who takes the full circle $W_i$ to be the aquifer, as quoted, and then remembers that a 180 degree wedge is only part of a circle and multiplies by $f$ before forming $W_{ei}$ from the already-wedged volume. The fraction has now been applied twice:

$$W_{ei,\text{wrong}} = 0.000006 \times 12502005731.212427 \times 0.5^2 \times 2740 = 51383243.55528307 \ \text{bbl}$$

The correct value divided by that is 2, which is $360/180$ exactly; on the published 140 degree wedge the same slip costs a factor of $360/140$. The aquifer has lost half its capacity to a bookkeeping slip.

What does that cost in the answer? March the influx through the four steps of the published pressure history with the shrunken $W_{ei}$ and the cumulative water influx comes out at $12.996048975219418$ MMbbl against the correct $23.729965552293255$ MMbbl, an error of $-45.233595276064435$ percent.

Half the water, and nothing in the run complains. The influx table still looks like an influx table, the numbers still rise step by step, and if you had no published column to compare against you would have no reason to suspect anything. A material balance built on that aquifer would then hand the missing drive energy to the oil, and your original oil in place would absorb the error.

The defence is a habit rather than a check: whenever a source quotes an aquifer volume, ask out loud whether it is a full circle or a wedge, and do not proceed until you can say which. If the source gives you $\theta$ and a volume in the same breath, assume the volume is the full circle until the arithmetic proves otherwise, because that is the convention this literature uses.

## At the panel

{{panel:mb-aquifer-explorer}}

Three tiles carry this lesson. On the teaching aquifer **Wi, full circle** reads $12,502,005,731$, **Angle fraction** reads $0.5$, and **Wi, wedge share** reads $6,251,002,866$. Confirm for yourself that the third is the first multiplied by the second, then check that the **Wei** tile is the wedge share multiplied by $c_t$ and by the initial pressure.

Now set the **Encroachment angle (deg)** field to 360. The angle fraction goes to 1, the wedge share becomes the full circle, $W_{ei}$ rises to the volume a fully surrounded reservoir would have, and $J$ rises in the same proportion because it carries $f$ too. Watch the engine's influx column climb. Then set the angle to 90 and watch both halves fall together.

## Exercise

With the panel back at the teaching 180 degrees, work out by hand what $W_{ei}$ would be for an encroachment angle of 210 degrees, using the full circle volume above. Then enter 210 in the panel and check your arithmetic against the tile.

Then answer this. A colleague reports an aquifer with a $W_{ei}$ of about two hundred million barrels and tells you the encroachment angle is 140 degrees, and asks whether he should now scale his number down for the partial contact. What do you tell him, and what single question would you ask before answering?
