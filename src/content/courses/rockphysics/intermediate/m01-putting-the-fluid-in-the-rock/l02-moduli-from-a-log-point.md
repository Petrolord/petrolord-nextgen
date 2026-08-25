# Moduli from a log point

Gassmann's relation is written in moduli. Logs are recorded in velocities and density. This lesson is the conversion between them, in both directions, because every substitution starts and ends with it.

## The two elastic moduli

An isotropic elastic solid needs exactly two moduli to describe it, and rock physics uses the bulk modulus and the shear modulus.

The bulk modulus $K$ is resistance to a change in volume. Squeeze the rock from all sides and $K$ says how hard it pushes back.

The shear modulus $\mu$ is resistance to a change in shape at constant volume. Twist the rock and $\mu$ says how hard it resists.

Everything a substitution does happens in those two quantities, and the whole reason the method works is that the fluid changes one of them and cannot touch the other.

## From velocities to moduli

The two wave velocities follow from the moduli and the density:

$$v_p = \sqrt{\frac{K + \tfrac{4}{3}\mu}{\rho}}, \qquad v_s = \sqrt{\frac{\mu}{\rho}}$$

Inverting them is direct. The shear velocity gives the shear modulus on its own, because nothing else appears in it:

$$\mu = \rho v_s^2$$

Then the compressional velocity gives the bulk modulus, once the shear part is subtracted:

$$K = \rho v_p^2 - \tfrac{4}{3}\mu$$

Both need the density, which is why a shear log without a density log is not enough.

## The Ekene sand

Put the logged numbers in. Density 2250 kg/m3, shear velocity 1800 m/s, compressional velocity 3200 m/s.

$$\mu = 2250 \times 1800^2 = 7.29 \times 10^9 \ \mathrm{Pa} = 7.29 \ \mathrm{GPa}$$

$$K_{sat} = 2250 \times 3200^2 - \tfrac{4}{3} \times 7.29 \times 10^9 = 23.04 \times 10^9 - 9.72 \times 10^9 = 13.32 \ \mathrm{GPa}$$

Two of the six capstone values, obtained in two lines.

The subscript on $K_{sat}$ matters. That is the bulk modulus of the rock **with its brine in it**, which is what a log measures and is not a property of the frame alone. Separating those is module two.

## Why these two come out exact

The values 7.29 and 13.32 have no rounding in them at all, and it is worth seeing why, because it makes them a good check on your own arithmetic.

$1800^2 = 3{,}240{,}000$ and $2250 \times 3{,}240{,}000 = 7{,}290{,}000{,}000$ exactly. $3200^2 = 10{,}240{,}000$ and $2250 \times 10{,}240{,}000 = 23{,}040{,}000{,}000$ exactly. Four thirds of 7.29e9 is 9.72e9 exactly, since $7.29 \times 4 = 29.16$ and $29.16 / 3 = 9.72$.

Every one of those is an exact binary floating point operation. The fixture was built that way on purpose, so that the first two graded values can be reached with a calculator and any disagreement is a mistake rather than a rounding difference.

## The reverse direction

At the end of a substitution you have new moduli and a new density, and you need velocities back:

$$v_p = \sqrt{\frac{K_{sat}' + \tfrac{4}{3}\mu}{\rho'}}, \qquad v_s = \sqrt{\frac{\mu}{\rho'}}$$

Note which symbols carry a prime. The bulk modulus and the density change; the shear modulus does not.

That asymmetry is the whole substitution in one line, and everything in the next three modules is a consequence of it.

## Worked example

Confirm that the conversion round trips, which is worth doing once by hand.

From $\mu = 7.29$ GPa, $K_{sat} = 13.32$ GPa and $\rho = 2250$ kg/m3, recompute the velocities:

$$v_p = \sqrt{\frac{13.32 \times 10^9 + \tfrac{4}{3}(7.29 \times 10^9)}{2250}} = \sqrt{\frac{23.04 \times 10^9}{2250}} = \sqrt{10{,}240{,}000} = 3200 \ \mathrm{m/s}$$

$$v_s = \sqrt{\frac{7.29 \times 10^9}{2250}} = \sqrt{3{,}240{,}000} = 1800 \ \mathrm{m/s}$$

Both return exactly. The conversion is lossless in both directions, so any error in a substitution comes from the substitution itself and never from getting into or out of moduli.

## Exercise

A sand logs 2900 m/s, 1500 m/s and 2200 kg/m3. Compute its shear modulus and its saturated bulk modulus, and state which of the two a fluid change could move.

Self check: $\mu = 2200 \times 1500^2 = 4.95$ GPa and $K_{sat} = 2200 \times 2900^2 - \tfrac{4}{3}(4.95 \times 10^9) = 18.502 \times 10^9 - 6.6 \times 10^9 = 11.902$ GPa. Only the bulk modulus can move, because fluids have no shear stiffness and therefore cannot contribute to $\mu$.
