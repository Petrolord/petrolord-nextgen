# Moduli and velocity

A seismic wave does not know what porosity is. It responds to three properties of the material it passes through, and to nothing else: the bulk modulus, the shear modulus and the density. Everything a geologist cares about reaches the wave only by changing one of those three. This lesson is about what each one means and how the three of them set a velocity.

## Bulk modulus, K

Bulk modulus is resistance to being squeezed. Apply pressure equally from all sides and the material loses a little volume. The bulk modulus is the ratio of the pressure applied to the fractional volume lost.

$$K = \frac{\Delta P}{\Delta V / V}$$

A large K means a material that gives up very little volume for a large pressure. Quartz has a bulk modulus of 36.6 GPa, which is stiff. The Ekene brine has a bulk modulus of 2.6978112899395996 GPa at reservoir conditions, which is far softer than the mineral but still a real resistance, since water is hard to compress. The Ekene gas has a bulk modulus of 55.71865290286663 MPa at the same conditions, and the unit change is the point. Gas is soft in a way the other materials in this course are not.

Note that K has units of pressure, because the denominator of that ratio is a fraction and carries no units. That is worth remembering as a sanity check. A modulus quoted in kg/m3 is a mistake somewhere.

## Shear modulus, mu

Shear modulus is resistance to being deformed in shape at constant volume. Push the top of a block sideways while holding the bottom still, and the block leans. The shear modulus is the ratio of the shear stress applied to the resulting angular deformation.

The mineral values show that this is a genuinely separate property from K, not a proxy for it.

| Mineral | K (GPa) | mu (GPa) |
| --- | --- | --- |
| quartz | 36.6 | 45.0 |
| clay | 20.9 | 6.9 |
| calcite | 76.8 | 32.0 |
| dolomite | 94.9 | 45.0 |

Quartz and clay differ modestly in bulk modulus and by about 6.5 times in shear modulus. Calcite is much stiffer than quartz under compression and much softer than quartz under shear. A material cannot be ranked as generally hard or generally soft, because the two moduli rank materials differently.

## Fluids have no shear strength, so mu is zero

This is the single most important sentence in the module. A fluid, by definition, cannot support a static shear stress. Push sideways on the top of a body of water and it does not lean and hold. It flows, and the stress relaxes to nothing.

Therefore, for brine, for gas and for live oil, the shear modulus is zero. Not small, not approximately zero. Zero, in the model this course uses and in every rock physics engine you will meet. Every fluid in this course has mu equal to zero, and that fact does more work in the interpretation of seismic than any other single idea.

## Density

Density is mass per unit volume, in kg/m3. It is the least subtle of the three and the easiest to measure, and it is the only one of the three that mixes linearly when you combine materials. Two hundred kilograms of one thing and eight hundred of another give you a thousand kilograms, whatever the moduli are doing.

## How the three set a velocity

An elastic solid carries two kinds of body wave. The compressional wave, which moves particles along the direction of travel, and the shear wave, which moves them across it. Their velocities are

$$v_p = \sqrt{\frac{K + \tfrac{4}{3}\mu}{\rho}} \qquad v_s = \sqrt{\frac{\mu}{\rho}}$$

Read the structure of those two expressions rather than trying to memorise them.

Stiffness sits on top, so stiffer material means faster wave. Density sits underneath, so heavier material means slower wave. Both moduli enter $v_p$, because a compressional wave squeezes the material and also distorts it, so it feels resistance to both. Only the shear modulus enters $v_s$, because a shear wave changes shape without changing volume, so the bulk modulus never enters the expression at all.

## What this means for fluids in pores

Put the two facts together. Fluids have mu equal to zero, and $v_s$ depends only on mu and density.

For a fluid on its own, the $4\mu/3$ term vanishes and the compressional velocity collapses to

$$v_p = \sqrt{\frac{K}{\rho}}$$

The engine returns 1628.0555893189182 m/s for the Ekene brine, from its bulk modulus of 2.6978112899395996 GPa and its density of 1017.8249875 kg/m3, and 1212.7072294996883 m/s for the live oil, from 1.1427945726905131 GPa and 777.0630099023522 kg/m3. Both follow that expression, with the modulus in Pa and the density in kg/m3 so that the result comes out in m/s. The engine does not return a compressional velocity for the gas, so this course does not quote one.

Now put a fluid into the pores of a rock. Changing the fluid changes the bulk modulus of the saturated rock, because the fluid resists compression alongside the frame. It also changes the density, because the fluid has mass. It does not change the shear modulus of the rock at all, because the fluid contributes no shear strength for the frame to borrow.

So $v_p$ moves when the fluid changes, for two reasons at once. And $v_s$ moves only through the density in the denominator, which is a much smaller effect and often runs the other way. Replace brine with gas and the rock gets lighter, so $v_s$ can rise slightly even as $v_p$ falls sharply.

That asymmetry is what makes fluid detection possible. The exact bookkeeping, how much of the fluid modulus reaches the saturated rock and how much the stiff frame absorbs, is Gassmann's equation, and it belongs to the Professional tier. What you need from this lesson is the mechanism and its direction.

## Exercise

Without looking back at the expressions, write down which moduli appear in $v_p$ and which appear in $v_s$, and state the shear modulus of the Ekene brine, the Ekene gas and the Ekene live oil. Then answer one question in a sentence. Why does changing the pore fluid from brine to gas move the compressional velocity a great deal and the shear velocity only slightly?

Self check: $v_p$ depends on the bulk modulus, the shear modulus and the density, through the square root of $K$ plus four thirds of mu over rho. $v_s$ depends only on the shear modulus and the density. The shear modulus of all three fluids is zero, because no fluid supports a static shear stress. Changing brine for gas moves $v_p$ strongly because the fluid contributes directly to the bulk modulus of the saturated rock and also changes its density, while $v_s$ moves only because the rock became lighter, since the fluid adds no shear stiffness whatever it is.
