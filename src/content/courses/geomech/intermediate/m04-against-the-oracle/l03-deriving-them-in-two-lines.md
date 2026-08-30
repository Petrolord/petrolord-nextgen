# Deriving them in two lines

The algebra, done here so you never have to take the number on trust.

{{panel:gm-stability-explorer}}

## Setting up

For a vertical hole with the axis along Sv and the high side along SHmax, the borehole-frame effective stresses are just the principal ones, with no shear at all:

    s11 = effective SHmax = 40000000 Pa
    s22 = effective Shmin  = 25000000 Pa
    s33 = effective Sv     = 35000000 Pa

## The hoop stress

    sigma_hoop = s11 + s22 - 2(s11 - s22)cos(2theta) - dP

At theta of 0, cos(2theta) is 1:

    65000000 - 30000000 - dP = 35000000 - dP

At theta of 90 degrees, cos(2theta) is -1:

    65000000 + 30000000 - dP = 95000000 - dP

So the hoop stress runs between three times the smaller effective horizontal stress less the larger, and three times the larger less the smaller. Check: 3 x 25 - 40 is 35, and 3 x 40 - 25 is 95, both in megapascals.

## The axial stress

    sigma_axial = s33 - nu x 2(s11 - s22)cos(2theta)

At theta of 90: 35000000 + 0.25 x 30000000 = 42500000 Pa.

At theta of 0: 35000000 - 7500000 = 27500000 Pa.

## The collapse line

The breakout forms where the hoop stress peaks, at theta of 90 degrees. There the three principal wall stresses are:

    hoop   = 95000000 - dP
    axial  = 42500000
    radial = dP

For small dP the hoop is the largest and the radial the smallest. Mohr-Coulomb with q of 3 requires:

    (95000000 - dP) - 3 dP <= 40000000

which gives

    95000000 - 4 dP <= 40000000
    dP >= 13750000 Pa

and the well pressure is the pore pressure plus that: 20000000 + 13750000 = **33750000 Pa**.

## The general form

    collapse Pw = Pp + (3 x SH_eff - Sh_eff - UCS) / (1 + q)

One plus q in the denominator is the amplification from lesson four of module 1: raising the well pressure lowers the largest wall stress by one and raises the smallest by one.

## The fracture line

Fracture initiation watches the SMALLEST wall stress in the hoop and axial pair, at the angle where the hoop stress dips, which is theta of 0.

    hoop  = 35000000 - dP
    axial = 27500000

Once dP exceeds 7500000 the hoop is the smaller, and it reaches zero at dP of 35000000. The tensile strength is zero, so that is the criterion:

    Pw = 20000000 + 35000000 = **55000000 Pa**

## The general form

    fracture Pw = Pp + (3 x Sh_eff - SH_eff) + T0

No amplification here: the least wall stress falls one for one with the well pressure.

## Why the two forms are worth memorising

Because they are the sanity check on any stability output. Compute them for a vertical hole at the depth in question and the engine's numbers should be close, and identical if the hole really is vertical.

## Exercise

Apply both closed forms to the profile at 2500 m for a vertical hole with the published parameters and a tensile strength of 1000000 Pa.

Then compare against the panel's answers and account for any difference.
