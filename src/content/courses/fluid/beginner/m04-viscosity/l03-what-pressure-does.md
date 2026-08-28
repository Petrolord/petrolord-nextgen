# What pressure does

The third link: above the bubble point, squeezing the oil makes it thicker again.

## The effect

Below the bubble point, pressure and viscosity move together for an indirect reason: falling pressure releases gas, and losing gas thickens the oil.

Above the bubble point there is no gas left to release, so the only remaining mechanism is compression. Compressing a liquid raises its viscosity, and the effect is modest and roughly linear in pressure.

So the viscosity curve has a MINIMUM at the bubble point. Below it viscosity rises as pressure falls; above it viscosity rises as pressure rises. That V shape is the signature of a live oil viscosity table.

## The correlation

Vasquez and Beggs (1980) for the undersaturated branch:

$$\mu_o = \mu_{ob}\left(\frac{p}{p_b}\right)^{m}$$

with m itself a function of pressure. It reduces exactly to the bubble point viscosity when p equals pb, which is the continuity the two branches must satisfy.

## Ekene

Live oil at the bubble point is 0.7559673199800581 cp. At 2600 psia, which is 600 psia of undersaturation:

$$\mu_o = 0.8035947954460412 \text{ cp}$$

So 600 psia of compression thickened the oil by about six percent. Small compared with what the dissolved gas did, and in the opposite direction.

## The shape is a check

If you build a viscosity table and it does not have a minimum at the bubble point, something is wrong. The two most likely causes:

**The undersaturated branch was not applied.** The table just holds the bubble point value flat above pb. Common, and it understates viscosity at initial pressure.

**The bubble point row is missing.** The table interpolates straight across the minimum and loses it, the same failure the Bo table has when its peak row is missing.

Both are visible on a plot in a second and invisible in a column of numbers.

## Why the small effect still matters

Because a reservoir spends its early life undersaturated, and that is when the wells are being drilled and the productivity is being measured. Ekene sat 1200 psia above its bubble point at discovery.

Using the bubble point viscosity across that interval understates viscosity where the field actually was, and productivity index scales inversely with viscosity, so it overstates what the wells will do.

## The three links together

Beal gives 2.3437444714709295 cp with no gas in the oil. Beggs and Robinson take that to 0.7559673199800581 cp at 400 scf/stb. Vasquez and Beggs take that to 0.8035947954460412 cp at 2600 psia.

Three correlations, three stages, one number at the end. Nobody measured any of it.

## The misconception to avoid

"Viscosity always falls as pressure falls, because the oil is expanding." That is true above the bubble point and false below it, where the dominant effect is losing dissolved gas rather than expanding. The two mechanisms compete and they change places at the bubble point, which is why the curve turns.

## Exercise

First, sketch oil viscosity against pressure from atmospheric to well above the bubble point, marking the minimum and naming the mechanism that dominates on each side.

Second, Ekene's live oil viscosity is 0.7559673199800581 cp at the bubble point and 0.8035947954460412 cp at 2600 psia. State the percentage change and say what using the bubble point value at initial pressure would do to a predicted productivity index.
