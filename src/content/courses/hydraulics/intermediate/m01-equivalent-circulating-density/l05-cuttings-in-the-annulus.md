# Cuttings in the annulus

The density the model does not carry.

{{panel:hy-cleaning-explorer}}

## What is in the annulus

Mud, and rock. The bit is making cuttings continuously and they are being carried up, so at any moment the annulus contains a mixture.

The engine's pressure calculation uses the MUD density throughout. The cuttings are computed separately, in the hole cleaning module, and their contribution to the density is not fed back.

## How much it is worth

The cuttings concentration this course computes is a volume fraction. At a concentration of c, the bulk density of the mixture is

    rho_bulk = (1 - c) rho_mud + c rho_cuttings

For kcl_polymer at 1440 kg/m3 and cuttings at 2600, one percent by volume raises the bulk density by 11.6 kg/m3.

## The concentrations this course computes

Slant well, kcl_polymer:

| flow rate | worst cuttings concentration |
|---|---|
| 0.015 m3/s | 1.6526398414724626 percent |
| 0.025 m3/s | 0.8837762314894323 percent |
| 0.035 m3/s | 0.6002533054348534 percent |

So at the lowest rate the annulus is carrying enough rock to raise its bulk density by about 19 kg/m3, which is half the uplift the flow rate itself produced.

## Which way the omission goes

The engine UNDERSTATES the equivalent circulating density, because the annulus is denser than it assumes.

And the understatement is largest at LOW flow rate, which is the opposite direction from the friction term. So the two effects partly cancel: raising the flow rate raises the friction uplift and lowers the cuttings uplift.

That partial cancellation is a real and useful result. It means the true equivalent circulating density is flatter against flow rate than the friction calculation alone suggests.

## Why the engine leaves it out

Because doing it properly is a coupled problem. The cuttings raise the density, which changes the pressure, which changes nothing about the transport, but the cuttings concentration depends on the transport ratio, which depends on the apparent viscosity, which depends on the shear rate, which depends on the flow rate.

Doing it approximately is easy and doing it consistently is a different calculation. The engine computes both quantities and leaves the coupling to the reader, and this lesson is where that is stated.

## The practical correction

Take the worst cuttings concentration from the cleaning run and apply the bulk density formula to the mud weight, then re-read the equivalent circulating density with that as the mud weight.

It is an approximation that ignores the depth distribution of the cuttings, and it is much better than ignoring them.

## Exercise

Apply that correction to the slant well at 0.015 and at 0.035 m3/s, using the concentrations above.

Then compare the two corrected equivalent circulating densities against the two uncorrected ones, and say what the correction does to the case for raising the flow rate.
