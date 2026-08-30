# The only square law in the system

Why the bit behaves differently from everything else.

{{panel:hy-rheology-explorer}}

## The expression

    dp = rho Q^2 / (2 Cd^2 A^2)

with Cd the discharge coefficient, 0.95 here, and A the total flow area.

No viscosity. No length. No friction factor. No Reynolds number.

## Why there is no viscosity

Because the loss across a nozzle is not friction. It is the energy spent accelerating the mud from the slow flow inside the collars to a jet, and then throwing that jet away.

The mud leaves the nozzle at high speed and its kinetic energy is dissipated in the hole. That is an inertial loss, and inertia does not care how viscous the fluid is.

## The consequence: an exact square

| flow rate | bit pressure drop | jet velocity |
|---|---|---|
| 0.015 m3/s | 841654.0448757352 Pa | 32.4806090763814 m/s |
| 0.025 m3/s | 2337927.902432598 Pa | 54.13434846063567 m/s |
| 0.035 m3/s | 4582338.688767893 Pa | 75.78808784488994 m/s |

The exponent relating the first and last rows is 2.0000000000000004, which is exactly two to floating-point precision.

Compare against the pipe, whose exponent is 1.7229931970141557, and the annulus, whose exponent is 0.7464092669494129.

## Why that matters

Because the bit's SHARE of the pump pressure rises with flow rate and everything else's falls.

| flow rate | bit share |
|---|---|
| 0.015 m3/s | 16.0968 percent |
| 0.025 m3/s | 19.8616 percent |
| 0.035 m3/s | 21.9509 percent |

The steepest law wins as the rate rises. That is the whole basis of bit hydraulics optimisation.

## The discharge coefficient

0.95, and it is an efficiency: a real nozzle does not convert all the pressure into jet velocity, because the flow contracts slightly as it enters.

It appears squared in the denominator, so a five percent inefficiency costs about ten percent more pressure than an ideal nozzle would.

## What the exact square buys you

Predictability. Given a measured pump pressure and a known nozzle area, the bit's share can be computed exactly, and the rest is the system loss.

That is how a driller estimates the system pressure loss on a rig without running a full hydraulics model: pump at two rates, take the difference, and the bit's contribution is known analytically.

## Exercise

Verify the square law yourself: take the bit pressure drop at 0.015 m3/s and multiply by the square of the rate ratio to 0.035.

Compare against the tabulated value. Then explain why the same procedure applied to the pipe loss would be wrong.
