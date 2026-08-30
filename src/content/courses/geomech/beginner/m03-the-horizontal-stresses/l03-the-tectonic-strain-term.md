# The tectonic strain term

The addition that does not care how deep you are.

{{panel:gm-stress-explorer}}

## The form

    strain term for Shmin = E / (1 - nu^2) x (epsX + nu x epsY)
    strain term for SHmax = E / (1 - nu^2) x (epsY + nu x epsX)

with E the Young's modulus and the two epsilons the tectonic strains along the two horizontal principal directions.

## What it represents

Regional deformation that is not burial. Plate motion stretching or squeezing the whole section, which adds stress on top of what the overburden alone would produce.

## The published values

E of 25000000000 Pa, a Poisson ratio of 0.28, epsX at 0.0001 and epsY at 0.0003.

Those give:

    Shmin strain term = 4991319.444444444 Pa
    SHmax strain term = 8897569.444444442 Pa

## The critical property

**Neither depends on depth.** The formula has no z in it.

So the same 4991319.444444444 Pa is added to Shmin at 50 m and at 2600 m.

## Why that is a problem

At 2600 m the effective vertical stress is 28390251.749999993 Pa, and k0 times that is about 11 MPa. Adding 5 MPa to it changes the answer by about 45 percent.

At 50 m the effective vertical stress is 622722.275 Pa, and k0 times that is about 242 kPa. Adding the same 5 MPa multiplies the answer by more than 20.

## What that does to the profile

It pushes the shallow horizontal stresses up until they exceed the overburden, which is not a normal faulting stress state at all.

At 50 m this profile's SHmax equivalent mud weight is 5163.327145190827 kg/m3 against an overburden of 2300. Module 5 is entirely about that, because it is the most instructive thing in the fixture.

## Is the term wrong?

No. A constant regional strain really is roughly constant with depth over a sedimentary section, and adding it as a depth-independent stress is defensible.

What is wrong is applying it to depths where the burial term is small compared with it. The model is being used outside the range where its assumptions hold, and it says so loudly if anybody looks at the ordering.

## The fix a real study uses

Calibrate the strains against a leak-off test or a minifrac at DEPTH, then treat the shallow section as unconstrained and drill it conservatively rather than trusting the extrapolation upward.

## Exercise

Compute the two strain terms by hand from the published E, nu, epsX and epsY.

Then compute what fraction of the total Shmin they represent at 50 m, at 1000 m and at 2600 m.
