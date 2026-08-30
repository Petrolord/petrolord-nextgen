# Four dial readings

What a viscometer measures, and what it does not.

{{panel:hy-rheology-explorer}}

## The instrument

A Fann viscometer is a cup of mud with a cylinder spinning in it. The cylinder turns at a set speed and the torque it takes is read off a dial.

The standard readings are at 600, 300, 200, 100, 6 and 3 rpm. This course uses four of them.

## The conversion

Each rpm is a shear rate:

    shear rate = 1.70233 x rpm  (per second)

Each dial degree is a shear stress:

    shear stress = 1.066 x 0.47880259 x dial  (Pa)

which is 0.51040356094 Pa per degree. The 1.066 is the instrument's geometry constant and the 0.47880259 converts pounds force per hundred square feet to pascals.

So four readings become four points on a curve of shear stress against shear rate.

## The two muds

| reading | shear rate (1/s) | kcl_polymer dial | kcl_polymer (Pa) | light_wbm dial |
|---|---|---|---|---|
| 600 rpm | 1021.398 | 64 | 32.6658 | 45 |
| 300 rpm | 510.699 | 38 | 19.3953 | 28 |
| 6 rpm | 10.214 | 7 | 3.5728 | 5 |
| 3 rpm | 5.107 | 6 | 3.0624 | 4 |

The light mud's stresses are left as an exercise, and they are the same four dial values times the same constant.

Read the last two rows. Between 6 and 3 rpm the stress barely falls, which says the mud has a yield: a stress below which it does not flow at all.

That is what a drilling mud is designed to have. It is what suspends barite when the pumps are off and it is what holds cuttings up in a static annulus.

## What the four points do not tell you

**Anything between them or beyond them.** The annulus in this course runs at shear rates around 10 to 100 per second, and only two of the four readings are in that range.

**Anything about time.** A drilling mud is thixotropic: it gels when it sits and thins when it is sheared. The viscometer reading at a steady 300 rpm says nothing about how strong the gel is after ten minutes.

**Anything about temperature.** The readings are taken at a stated temperature, usually 120 F, and the mud downhole is hotter.

## Why four rather than six

Because a model needs as many points as it has parameters, plus enough to be checked. The power law and the Bingham plastic have two parameters each. Herschel-Bulkley has three.

Four readings will fit all three models and leave something over.

## Exercise

Convert the 600 and 300 rpm readings for both muds into shear stress in pascals yourself.

Then compute the ratio of the 600 to the 300 reading for each mud, and say which mud is more shear-thinning before the next lesson tells you.
