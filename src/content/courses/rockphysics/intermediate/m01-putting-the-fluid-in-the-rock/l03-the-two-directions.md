# The two directions

A substitution is two passes of the same equation. Backwards to strip the logged fluid out, forwards to put a new one in. This lesson lays out the shape before the next two modules take each half in turn.

## Backwards: recover the frame

The log gives $K_{sat}$ with brine in the pores. What is wanted is $K_{dry}$, the bulk modulus of the same rock with nothing in the pores at all.

Inverse Gassmann does that, given the saturated modulus, the mineral modulus, the fluid modulus and the porosity:

$$K_{dry} = \frac{K_{sat}\left(\dfrac{\phi K_{min}}{K_{fl}} + 1 - \phi\right) - K_{min}}{\dfrac{\phi K_{min}}{K_{fl}} + \dfrac{K_{sat}}{K_{min}} - 1 - \phi}$$

For the Ekene sand that returns 7.350343061720982 GPa, which is the third capstone value.

The dry frame is the object the rock brings to the problem. It is what the grains and their contacts do, and it is the only part of the answer that does not depend on what is in the pores.

## Forwards: put a new fluid in

With the frame in hand, the forward relation predicts the saturated modulus for any fluid:

$$K_{sat}' = K_{dry} + \frac{\left(1 - \dfrac{K_{dry}}{K_{min}}\right)^2}{\dfrac{\phi}{K_{fl}'} + \dfrac{1 - \phi}{K_{min}} - \dfrac{K_{dry}}{K_{min}^2}}$$

Feed it the gas modulus of 55.71865290286663 MPa from the tier below and it returns 7.492988063073051 GPa, against the 13.32 GPa the brine gave. The rock has become much softer in compression.

## The two things that ride alongside

The bulk modulus is not the only thing that changes, and it is not the only thing that does not.

The shear modulus is carried through untouched. Gassmann's relation says nothing about it because there is nothing to say: a fluid has no shear stiffness, so the rock's resistance to a change of shape is the same whatever is in the pores.

The bulk density changes by simple bookkeeping. Take out a pore volume's worth of brine and put in the same volume of gas:

$$\rho' = \rho + \phi(\rho_{fl}' - \rho_{fl})$$

which for Ekene is $2250 + 0.25(172.66679461728904 - 1017.8249875) = 2038.7104517793223$ kg/m3, the fifth capstone value.

## Putting the four together

New bulk modulus, unchanged shear modulus, new density, and the velocity formulas from the last lesson. That gives the substituted log:

$$v_p' = 2905.6972280296195 \ \mathrm{m/s}, \qquad v_s' = 1890.9758806113214 \ \mathrm{m/s}$$

The compressional velocity has fallen by nearly 300 m/s and the shear velocity has risen by about 91 m/s. Two velocities moving in opposite directions from a single fluid change is the signature of the whole method.

## Reading it off the panel

Open the substitution explorer. Leave the porosity at 0.25 and the mineral modulus at 37 GPa, and move the saturation control from 1.00 to 0.00.

{{panel:rp-substitution-explorer}}

Watch three tiles as you do it. The shear modulus tile does not move at all. The dry frame tile does not move either, because it is a property of the rock rather than of the fluid, and the whole point of recovering it is that it stays put while the fluid changes. Everything else moves.

## Worked example

Check the density arithmetic without the engine, because it is the one step in the tier that needs no equation at all.

A cubic metre of the logged rock weighs 2250 kg. A quarter of that cubic metre is pore, so it contains 0.25 cubic metres of brine weighing $0.25 \times 1017.8249875 = 254.456$ kg, and 0.75 cubic metres of mineral weighing the remaining 1995.544 kg.

Replace the brine with gas. The mineral is untouched at 1995.544 kg. The gas weighs $0.25 \times 172.66679461728904 = 43.167$ kg. The total is $1995.544 + 43.167 = 2038.710$ kg.

That reproduces the graded 2038.7104517793223 kg/m3. Nothing in the density step involves Gassmann at all: it is a change of contents in a container of known size.

## Exercise

State which of these four quantities change during a fluid substitution and which do not: the shear modulus, the dry frame bulk modulus, the saturated bulk modulus, the bulk density.

Self check: the shear modulus and the dry frame bulk modulus do not change, since one is fluid blind and the other is a property of the rock frame. The saturated bulk modulus and the bulk density both change, and they are the only two quantities the substitution actually computes.
