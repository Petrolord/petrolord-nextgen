# Shmin and SHmax from one formula

Two stresses, one relationship, and a difference that comes from one place.

{{panel:gm-stress-explorer}}

## The pair

    Shmin = k0 x sigma_v_eff + alpha x Pp + E/(1-nu^2) x (epsX + nu x epsY)
    SHmax = k0 x sigma_v_eff + alpha x Pp + E/(1-nu^2) x (epsY + nu x epsX)

Identical except for the order of the two strains.

## What that means

**The burial part is the same for both.** k0 times the effective vertical stress, plus the pore pressure. Burial alone cannot distinguish one horizontal direction from another, because burial has no horizontal direction to it.

**The entire difference between the two horizontal stresses is tectonic.**

## The difference in this profile

    SHmax - Shmin = E/(1-nu^2) x (epsY - epsX) x (1 - nu)

which with the published numbers is 3906250 Pa, at every single depth.

Check it: at 2000 m the two stresses are 39894755.652777776 and 35988505.652777776, and the difference is 3906250. At 2600 m they are 50191738.15277777 and 46285488.152777776, and the difference is 3906250 again.

## Reading that constancy

It is a direct consequence of the model rather than a property of the earth. A constant strain difference gives a constant stress difference.

In reality the stress difference varies with lithology, because a stiff bed carries more of a regional strain than a soft one. This model has one E and one nu for the whole profile, so it cannot show that.

## The equivalent mud weight view hides it

As equivalent mud weights the gap looks like it is closing with depth:

| depth | SHmax EMW | Shmin EMW | gap |
|---|---|---|---|
| 1000 m | 2431.1884707485906 | 2032.8618250540876 | 398.3266456945029 kg/m3 |
| 2000 m | 2034.0664575965175 | 1834.903134749266 | 199.1633228472516 kg/m3 |
| 2600 m | 1968.5126596896287 | 1815.3101036532817 | 153.20255603634712 kg/m3 |

It is not closing. The PRESSURE difference is fixed and the depth it is divided by is growing.

That is a good reminder that a gradient plot compresses differences at depth and exaggerates them at the top, and it is why the pressure view is worth keeping alongside.

## Which direction is which

The SHmax azimuth is a separate input, 60 degrees in the published runs. The formula gives magnitudes; the azimuth says which compass direction the larger one points along.

The Professional tier is where that azimuth starts to matter, because it decides how a deviated hole is loaded.

## Exercise

Derive the SHmax minus Shmin expression above from the two formulas and confirm it gives 3906250 Pa.

Then say what would have to change about the model for the difference to vary with depth, and name two field observations that would show it does.
