# Hydraulic horsepower and impact force

Two ways to say what the jets are doing.

## Hydraulic power at the bit

    power = dp x Q

Pressure times flow rate is power, in watts. It is the rate at which energy is being delivered to the bottom of the hole through the nozzles.

| flow rate | bit power |
|---|---|
| 0.015 m3/s | 12624.810673136028 W |
| 0.025 m3/s | 58448.19756081496 W |
| 0.035 m3/s | 160381.85410687627 W |

It rises as the CUBE of the flow rate, because the pressure rises as the square and the rate is multiplied on top.

## Impact force

    force = rho Q v_jet

The rate of momentum delivered by the jets to the hole bottom, in newtons.

| flow rate | impact force |
|---|---|
| 0.015 m3/s | 701.5811560498381 N |
| 0.025 m3/s | 1948.8365445828842 N |
| 0.035 m3/s | 3819.7196273824534 N |

It rises as the SQUARE of the flow rate, because both the rate and the jet velocity are proportional to it.

## Why two measures

Because they lead to different optimisation answers.

Maximising hydraulic power at the bit and maximising impact force at the bit are two different objectives, and the nozzle size that achieves each is different. The classical results are that power is maximised when the bit takes about 65 percent of the available pump pressure, and impact force when it takes about 48 percent.

Neither of those is a law of nature: they follow from the assumed exponent of the system pressure loss against flow rate, and that exponent is a property of the well.

## Which one to optimise

There is no settled answer.

The argument for power is that it correlates with the rate at which cuttings are lifted off the bottom in soft formations. The argument for impact force is that it correlates with the force available to break a stagnant layer under the bit.

In practice both are proxies for the real objective, which is not making the same rock twice, and neither is measured directly.

## The honest position

These are screening numbers. They rank one nozzle choice against another and they do not predict a rate of penetration.

A bit hydraulics optimisation that produces a nozzle size to two decimal places is over-reading the model, and this course does not grade either quantity for that reason.

## Exercise

Compute the ratio of hydraulic power between 0.015 and 0.035 m3/s and confirm it is the cube of the rate ratio.

Then compute the same ratio for impact force and confirm it is the square.
