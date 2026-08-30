# Ballooning

Pressure inside a pipe makes it fatter, and a fatter pipe is a shorter one.

{{panel:ct-tubing-explorer}}

## The idea

Put pressure inside a pipe and the wall swells outward. Steel conserves volume as it deforms elastically, near enough, so the pipe pays for its extra circumference with a little of its length.

That is Poisson's effect: a strain in one direction produces an opposite strain at right angles to it, scaled by Poisson's ratio.

## The planning form

    ballooning = 0.6 x (dPi x Ai - dPo x Ao)

The 0.6 is twice Poisson's ratio for steel at 0.3. The engine names it BALLOONING_FACTOR and says so in a comment.

## The two terms

Bore pressure acting on the bore area, pulling. Annulus pressure acting on the outside area, pushing back.

The bore area is smaller than the outside area, so on a per-pascal basis the annulus is more effective at cancelling ballooning than at cancelling piston. On this string the ratio is 0.7307807346938777 for ballooning against 0.5320706657949223 for piston.

## Worked

**Production heating,** 10 MPa on the bore:

    0.6 x 10000000 x 0.0045360777821594625 = 27216.466692956772 N

**Stimulation,** 45 MPa on the bore and 5 on the annulus:

    0.6 x (45000000 x 0.0045360777821594625 - 5000000 x 0.006207166618944346)
    = 0.6 x (204123.5001971758 - 31035.833094721733)
    = 103852.60026147243 N

## Why it is a planning form

Because the real ballooning effect depends on the pressure profile along the string, not on the change at one point, and the change at the packer is not the change at surface.

The planning form applies the packer-depth change over the whole length. That is what makes it a planning number, and Lubinski's original treatment is more careful about it.

## Ballooning and piston always agree in sign here

Both are positive when the bore pressure rises and both are reduced by annulus pressure. So on a bore-pressure event they add, and their sum is a tension.

Which means, on this string, that pressure alone always PULLS on the packer, and the only thing that can push is temperature.

## Exercise

Compute the ballooning force for 20 MPa on the bore and 20 MPa on the annulus, which is a balanced pressure test on both sides.

The answer is not zero. Say why, and say which way it acts.
