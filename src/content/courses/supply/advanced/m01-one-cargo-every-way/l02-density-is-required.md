# Density is required

A tonne of petrol and a tonne of diesel occupy different volumes, and a terminal is paid, taxed and reconciled in volume. So the density that turns a cargo's tonnes into its cubic metres is a figure somebody measured on that cargo. The engine treats it that way.

{{panel:supply-price-explorer}}

## What the engine says without one

Call `cargoQuantities` with the density left out and it refuses:

> REFUSED: Density is required to convert between mass and volume; it is not assumed.

There is no fallback figure behind that sentence. The engine forms no m3, no litres and no barrels, because each of them needs the density and the density is missing. The same holds for the quantity itself: a zero quantity answers "Cargo quantity is required."

## The densities it carries and does not read

The module does carry densities. `PRODUCT_REFERENCE` lists a typical density and a range for five products, and the module labels them a starting point:

| code | label | typical density kg/m3 | range kg/m3 |
| --- | --- | --- | --- |
| PMS | Petrol / gasoline | 745 | 720-775 |
| AGO | Automotive gas oil / diesel | 840 | 820-860 |
| DPK | Kerosene / jet | 800 | 775-840 |
| LPG | Liquefied petroleum gas | 545 | 500-580 |
| HFO | Heavy fuel oil | 960 | 920-1010 |

Nothing in the module reads them unless a caller passes one in, and the certificate of quality is the authority. That is a design choice worth understanding. A table of typical densities is useful for checking that a typed figure is plausible. It is dangerous as a default, because a default fills the gap silently and the learner never sees that the cargo's own figure was missing.

## What a wrong density moves

The course puts the same 34000 tonnes through each typical density to show what the choice moves:

| product | density kg/m3 | m3 | litres |
| --- | --- | --- | --- |
| PMS | 745 | 45637.584 | 45637583.89 |
| AGO | 840 | 40476.190 | 40476190.48 |
| DPK | 800 | 42500.000 | 42500000.00 |
| LPG | 545 | 62385.321 | 62385321.10 |
| HFO | 960 | 35416.667 | 35416666.67 |

The BADAGRY cargo is petrol and its certificate figure is 742.8 kg/m3, which the engine turns into 45772.752 m3. The petrol reference density of 745 kg/m3 turns the same tonnes into 45637.584 m3. Both figures are petrol, both sit inside the petrol range the module lists, and they are different cargoes on paper. Every per-litre and per-m3 charge in the next module is levied on the volume, so the density picked here reaches the jetty line, the storage line and the regulatory line before anyone looks at a price.

## Where the density comes from

This course measures and moves a cargo. It does not say how a cargo's quality is formed. Where a density or any other property of a crude or a blend comes from is the business of the sibling course `crude`, and a learner who needs that should go there. For this tier, the density is an input read off the cargo's certificate and typed in.

## Exercise

Record the m3 the engine returns for 34000 tonnes at 742.8 kg/m3 and at the petrol reference density of 745 kg/m3, and quote the sentence the engine returns when the density is missing. Then say what the two volumes, read side by side, show about the engine's refusal to assume a density even when a typical one sits in its own module.
