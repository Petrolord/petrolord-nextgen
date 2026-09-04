# Max width and average width

A fracture has two widths, and the one you quote is not the one the material balance spends.

{{panel:st-frac-explorer}}

## Two numbers for one opening

Both models compute a maximum width first. That is the width at the wellbore, at the centre of the fracture face, the widest the crack ever gets.

The maximum is what the proppant has to pass through, so it decides whether a slurry will bridge near the wellbore. It is not the number that decides how much fluid the fracture holds. For that you need the average width over the whole face, and each model reaches it by a different shape factor.

## The shape factors

PKN uses w_avg = (pi/5) w_max. KGD uses w_avg = (pi/4) w_max.

The PKN geometry is a vertical crack of fixed height whose cross-section at any station along the length is an ellipse. An ellipse averages pi/4 of its maximum. The PKN profile also tapers along the length, from full width at the well to zero at the tip, and that taper contributes a further four fifths. Multiply the two and you get pi/5.

KGD turns the picture on its side. Its width profile is elliptical in plan view, from the well to the tip, and it treats the vertical section as effectively constant over the height. There is one ellipse instead of two effects, so the factor stays at pi/4. PKN is the leaner shape: for the same maximum width it holds less fluid.

## The published case

| model | max width, m | average width, m |
|---|---|---|
| PKN | 0.006391633661942177 | 0.004015981871358954 |
| KGD | 0.013322884663463546 | 0.0104637691458403 |

Both were computed at a half-length of 150 m, a fracture height of 30 m, a rate of 0.053 m3/s and a viscosity of 0.2 Pa.s. Notice the size of them. A hydraulic fracture is a very large, very thin object, millimetres across and hundreds of metres long.

## Which width the balance spends

The fracture volume is two wings of length, height and average width: 2 xf hf w_avg. On the published PKN case that gives 36.143836842230584 m3 of fracture.

Every downstream number, the pump time, the efficiency, the pad and the proppant mass, is built on that volume, and so on the shape factor that produced it.

## Exercise

Run the panel on the published case and record both widths for both models. Confirm that the average is 0.6283185307179585 of the maximum for PKN and 0.7853981633974483 of it for KGD.

Then compute the fracture volume from the KGD average width and say how much more fluid the KGD shape asks you to place at the same length and height.
