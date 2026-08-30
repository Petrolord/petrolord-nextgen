# Why thermal usually wins

A comparison of coefficients, and the pressure change it would take to match.

{{panel:ct-tubing-explorer}}

## The three coefficients

Written as force per unit of whatever drives them, on this string:

    piston:      0.0035712418834005005 N per Pa of bore pressure
    ballooning:  0.0027216466692956773 N per Pa of bore pressure
    thermal:     4146.974057365369 N per degree C

Adding the two pressure terms, a pascal on the bore is worth 0.006292888552696178 N.

## The break-even

One degree of temperature change is worth the same as

    4146.974057365369 / 0.006292888552696178 = 658993.7232542605 Pa

of bore pressure change, which is about two thirds of a megapascal.

So the 45 degree warm-up in the production case is worth 29.654717546441724 MPa of bore pressure, and the case only applies 10 MPa. The temperature term is three times the pressure terms put together, and the case is a mild one on both counts.

## Which is the general result

For any realistic tubing, the temperature term dominates unless the temperature change is small.

The reason is dimensional. The pressure terms act on the BORE and SEAL BORE areas, which are large but the pressures are of order tens of megapascals. The thermal term acts on the STEEL area, which is small, but it is multiplied by Young's modulus, which is of order hundreds of gigapascals.

E times alpha is 2481600 Pa per degree of STRESS, and a completion that swings fifty degrees has therefore applied 124 MPa of axial stress to the steel without anybody pumping anything.

## When it does not win

**A short thermal swing.** A well that is produced continuously and never shut in has a small delta.

**A large annulus pressure event.** Bullheading into the annulus at high pressure with nothing on the bore reverses the sign of both pressure terms and makes them the only story.

**A very thick-walled tubing.** The thermal force scales with the steel area and so do the others, but not in the same ratio.

## What to do with it

Two things.

First, get the temperature right. Any effort spent refining the pressure changes while using a guessed temperature change is spent on the wrong term.

Second, remember that the temperature change is the one input in this whole tier that nobody measures directly. It comes out of a thermal model, and the thermal model has its own assumptions.

## Exercise

Work out the break-even pressure change per degree for a case where the annulus pressure changes rather than the bore.

You will need both signs, and the answer is larger. Say why.
