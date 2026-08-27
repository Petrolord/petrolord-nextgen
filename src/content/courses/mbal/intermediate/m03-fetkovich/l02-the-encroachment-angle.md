# The encroachment angle

Aquifers rarely surround a reservoir completely. A fault seals one flank, a facies change pinches out another, and the water arrives through a wedge rather than through a full ring. Fetkovich handles this with one number: the encroachment angle $\theta$, the arc in degrees over which the aquifer is actually in contact with the reservoir, expressed as the fraction

$$f = \frac{\theta}{360}$$

For Ahmed Example 10-10, $\theta$ is 140 degrees, so $f = 0.388888888888889$. The aquifer touches the reservoir over 140 degrees of arc and is absent over the other 220.

That is the easy part. The hard part is knowing where in the calculation the fraction gets applied, because it belongs in two places and in neither of them does it belong twice. Get that wrong and your aquifer is two and a half times too small, with no error message and no obvious symptom.

## Two volumes with the same name

The published solution quotes an initial aquifer volume

$$W_i = 28410000000 \ \text{bbl}$$

Twenty eight billion barrels. That is the number the book prints, and it is the number a reader lifts into a spreadsheet. It is also the FULL CIRCLE volume: the volume of the complete ring of aquifer between the reservoir radius and the aquifer radius, all 360 degrees of it, most of which is not there.

Compute it and see. The ring's bulk volume is $\pi (r_a^2 - r_e^2) h$, and the pore volume multiplies by porosity:

$$W_i = \frac{\pi \left( r_a^2 - r_e^2 \right) h \, \phi}{5.615}$$

With $r_a$ 46000 ft, $r_e$ 9200 ft, $h$ 100 ft and $\phi$ 0.25:

$$r_a^2 - r_e^2 = 2031360000 \ \text{ft}^2$$

$$\pi \times 2031360000 \times 100 \times 0.25 = 159542641319.904 \ \text{ft}^3$$

$$W_i = \frac{159542641319.904}{5.615} = 28413649389.1192 \ \text{bbl}$$

That reproduces the printed 28.41e9 to $0.0128454386453786$ percent, which is the book's rounding to four figures. The full circle it is.

The wedge share, the water that physically exists on the 140 degree flank, is a separate quantity:

$$W_{i,\text{wedge}} = 28413649389.1192 \times 0.388888888888889 = 11049752540.2130 \ \text{bbl}$$

Eleven billion barrels, not twenty eight. Both numbers are correct. They answer different questions, and only one of them is quoted in the book.

## Where the fraction is spent

The volume that matters to the material balance is not $W_i$ at all. It is $W_{ei}$, the maximum water the aquifer can ever deliver by expansion, which is the wedge pore volume multiplied by total compressibility and by the initial pressure:

$$W_{ei} = c_t \, W_{i,\text{wedge}} \, p_i$$

$$W_{ei} = 0.000007 \times 11049752540.2130 \times 2740 = 211934253.721285 \ \text{bbl}$$

Against the printed 211900000 that is $0.0161650407198692$ percent, again rounding. This is the second capstone value, so hold the full figure: **Wei = 211934253.721285 bbl**.

Notice the shape of what just happened. The angle fraction was applied once, on the way from the full circle to the wedge, and $W_{ei}$ inherited it. The productivity index also carries $f$, once, in its numerator. So $f$ appears exactly twice in the whole method, once in the storage term and once in the flow term, and both times it is applied to a full-circle quantity to produce a wedge quantity.

## The trap

Now imagine a reader who takes the printed $W_i$ of 28.41e9 to be the aquifer, as printed, and then remembers that a 140 degree wedge is only part of a circle and multiplies by $f$ before forming $W_{ei}$. The fraction has now been applied twice:

$$W_{ei,\text{wrong}} = 0.000007 \times 28413649389.1192 \times 0.388888888888889^2 \times 2740 = 82418876.4471666 \ \text{bbl}$$

The correct value divided by that is $2.57142857142857$, which is $360/140$ exactly. The aquifer has lost nearly two thirds of its capacity to a bookkeeping slip.

What does that cost in the answer? March the influx through the four published steps with the shrunken $W_{ei}$ and the cumulative water influx comes out at $19.6811125122705$ MMbbl against the correct $37.9731544101719$ MMbbl, an error of $-48.1709833750379$ percent.

Half the water, and nothing in the run complains. The influx table still looks like an influx table, the numbers still rise step by step, and if you had no published column to compare against you would have no reason to suspect anything. A material balance built on that aquifer would then hand the missing drive energy to the oil, and your original oil in place would absorb the error.

The defence is a habit rather than a check: whenever a source quotes an aquifer volume, ask out loud whether it is a full circle or a wedge, and do not proceed until you can say which. If the source gives you $\theta$ and a volume in the same breath, assume the volume is the full circle until the arithmetic proves otherwise, because that is the convention this literature uses.

## At the panel

{{panel:mb-aquifer-explorer}}

Three tiles carry this lesson. **Wi, full circle** reads $28413649389$, **Angle fraction** reads $0.388888889$, and **Wi, wedge share** reads $11049752540$. Confirm for yourself that the third is the first multiplied by the second, then check that the **Wei** tile is the wedge share multiplied by $c_t$ and by the initial pressure.

Now set the **Encroachment angle (deg)** field to 360. The angle fraction goes to 1, the wedge share becomes the full circle, $W_{ei}$ rises to the volume a fully surrounded reservoir would have, and $J$ rises in the same proportion because it carries $f$ too. Watch the engine's influx column climb. Then set the angle to 70 and watch both halves fall together.

## Exercise

With the panel back at 140 degrees, work out by hand what $W_{ei}$ would be for an encroachment angle of 210 degrees, using the full circle volume above. Then enter 210 in the panel and check your arithmetic against the tile.

Then answer this. A colleague reports an aquifer with $W_{ei}$ of 211934253.721285 bbl and tells you the encroachment angle is 140 degrees, and asks whether he should now scale his number down for the partial contact. What do you tell him, and what single question would you ask before answering?
