# Why density is easy

Wood's equation has two halves and they behave nothing like each other. The modulus half took a lesson to explain and produced an answer that surprises people. The density half takes a paragraph and produces exactly what you would guess. That contrast is not a curiosity. It is the cleanest way to see what is strange about the modulus.

## The density half

Density mixes as a plain volume-weighted sum:

$$\rho_f = \sum_i S_i \rho_i$$

For the capstone mix of 80 percent brine and 20 percent gas:

$$0.8 \times 1017.8249875 + 0.2 \times 172.66679461728904 = 848.7933489234579 \text{ kg/m3}$$

That is what the engine returns, to the last digit. There is no averaging rule to choose, no bound to bracket, no assumption about how the phases are arranged in the pore.

## Why it has to be that way

Density is mass divided by volume, and both mass and volume are additive. Take a pore of volume $V$. Four fifths of it holds brine and one fifth holds gas. The brine contributes $0.8V \times 1017.8249875$ kilograms and the gas contributes $0.2V \times 172.66679461728904$ kilograms. Add the masses, divide by $V$, and the volume cancels. What is left is the saturation-weighted sum written above.

Nothing in that derivation asked where the gas was. Distribute the same gas as a thousand tiny bubbles or as one blob in the corner of the pore and the mass is unchanged, so the density is unchanged. Density is blind to geometry, which is the same reason the mineral frame density of 2629 kg/m3 in the previous module needed no bounds either.

The result also has the property you expect of an average. It lies between the two end members, and it lies at the position the saturations put it, four fifths of the way from the gas density toward the brine density. Change the saturation by ten percent and the density changes by ten percent of the gap. The relationship is a straight line, with no interesting behaviour anywhere along it.

## Now compare the modulus

Put the four numbers side by side, and mind the units, because the densities are in kg/m3 and the moduli are in MPa.

| quantity | brine | gas | mix at Sw 0.8 |
| --- | --- | --- | --- |
| density (kg/m3) | 1017.8249875 | 172.66679461728904 | 848.7933489234579 |
| bulk modulus (MPa) | 2697.8113 | 55.7187 | 257.3340919366766 |

Read the density row first. The mix sits between its end members and much nearer the brine, which is the phase that occupies most of the pore. That is what a weighted average looks like.

Now read the modulus row. The mix of 257.3340919366766 MPa sits between the end members, since a harmonic average must, but it sits close to the gas value of 55.7187 MPa and nowhere near the brine value of 2697.8113 MPa. The phase occupying one fifth of the pore has pulled the result almost all the way to itself. No weighting of 2697.8113 and 55.7187 by 0.8 and 0.2 in any ordinary sense of the word average gets you to 257.3340919366766.

Two properties of the same two fluids, at the same saturation, in the same equation, and one of them behaves and the other does not.

## Where the difference comes from

Mass adds. Stiffness does not.

When you compress a pore holding both phases, the pressure is shared but the volume change is not. The gas gives way easily and takes most of the volume change, and the total volume change is what sets the mixture modulus. So the mixture is as compressible as its most compressible phase allows, weighted by how much of that phase is present.

The formula encodes this by adding compliances rather than moduli. Compliance is one divided by modulus, so the softest phase brings the largest term into the sum, and a small saturation of a very soft phase can still dominate. The previous lesson counted it out for this mix: the gas term was 92.4 percent of the total compliance and the brine term was 7.6 percent.

There is a rule of thumb in this that is worth carrying. Anything that adds, such as mass, volume or moles, mixes linearly and mixes without controversy. Anything that describes resistance to deformation mixes through its reciprocal, and reciprocal mixing is dominated by the smallest input. When you meet a new mixing problem, sort the quantity into one of those two boxes before you look for a formula.

## Why this matters downstream

The practical consequence is that saturation shows up much more strongly in seismic velocity than in density.

Velocity depends on modulus divided by density. Between full brine and the capstone mix, the fluid modulus falls by a factor of about ten while the fluid density falls from 1017.8249875 to 848.7933489234579 kg/m3, a change of well under a fifth. The modulus term moves an order of magnitude further than the density term, so the velocity change is driven almost entirely by the modulus.

That is why a gas sand is a seismic anomaly at all, and it is also why the density log and the sonic log react so differently to gas. The next lesson follows the modulus down the full saturation range and shows how quickly the collapse happens.

## Exercise

Work out the mixed fluid density at a water saturation of 0.9 from the brine and gas densities in this lesson, then say how far it has moved from the value at Sw 0.8 and whether that matches your expectation for a linear mixing law.

Self check: the arithmetic is $0.9 \times 1017.8249875 + 0.1 \times 172.66679461728904 = 933.309168211729$ kg/m3, which is the value the engine returns. Moving from Sw 0.8 to Sw 0.9 changed the density by one tenth of the gap between the two fluid densities, which is exactly what a linear mixing law requires, and it is worth contrasting with the modulus over the same saturation step in the next lesson.
