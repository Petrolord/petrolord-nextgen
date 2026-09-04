# Propped width

The fracture you pumped and the fracture you own are not the same width, and the gap is most of it.

{{panel:st-pack-explorer}}

## The arithmetic

Propped width is the areal concentration divided by the bulk density of the settled pack:

    w_p = C_A / (rho_p (1 - phi_pack))

On this case the areal concentration is 3.212785497087163 kg/m2, the proppant is 20/40 ISP ceramic at a grain density of 3270 kg/m3, the pack porosity is 0.35, and the propped width is 0.0015115434001821517 m.

That is a real physical statement. If you spread that mass of grains over that area and let them settle into a pack of that porosity, the pack stands that thick.

## Against the created width

The fracture that was pumped had a PKN average width of 0.004015981871358954 m and a maximum at the wellbore of 0.006391633661942177 m.

| width | value, m |
|---|---|
| created, maximum | 0.006391633661942177 |
| created, average | 0.004015981871358954 |
| propped | 0.0015115434001821517 |

The propped width is well under half the average created width. That is normal, and any design that shows a propped width close to the created width should be checked for an arithmetic error before it is believed.

## Where the difference went

The created width was never a permanent thing. It was held open by a net pressure of 2889735.9944400033 Pa acting against a closure stress of 38131950.890444934 Pa, and that net pressure existed only while the pumps were running.

When pumping stops, the net pressure bleeds off into the formation and the fracture closes. The walls travel until they meet the pack. Everything between the created width and the propped width was carrier fluid, and it either leaked away, was produced back, or stayed as an unbroken gel in the pores of the pack.

So the created width is not lost, it is spent. Its job was to be wide enough to admit the grains during pumping. Once the grains are in place, the width you keep is the one the pack can hold against the closure stress.

## The design consequence

Because the mass is fixed by the schedule, propped width is inversely proportional to fracture length at constant mass. In this course's sweep, a half-length of 30 m gives a propped width of 0.007557717000910759 m, while 440 m gives 0.0005152988864257336 m from the same job.

Length and width are bought with the same currency. That is the trade the unified design optimum later resolves.

## Exercise

Compute the ratio of the propped width to the created average width on paper, and say in one sentence what that ratio is a measure of.

Then use the panel to find a half-length at which the propped width falls below a millimetre, and say whether you would trust a design there.
