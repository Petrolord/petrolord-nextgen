# What a load is measured against

A load in pounds means nothing alone. Every use this engine makes of one compares it with something, and the four somethings are not alike.

{{panel:pd-card-explorer}}

## Against the buoyed weight

The first datum is what the string weighs hanging still in fluid: 8673.757961783 lb on the published taper, and 13673.757962 lb with the fluid load added.

At 0.5 spm the card peaks at 13756.379902 lb and bottoms at 8586.448887 lb, both on their static datum. At 9 spm the peak stands 7816.843261277 lb above the buoyed weight and the minimum 2850.547021552 lb below it. That distance is what the word dynamic means here.

## Against a rating

The second datum is a piece of steel somebody bought. `structuralOverload` fires when the reported peak passes the unit's structural capacity, `strokeOverload` when the design stroke exceeds the unit stroke, `torqueOverload` when the balanced peak torque passes the gearbox rating. All three are warnings, and the design comes back complete either way.

## Against an allowable stress

The third datum is not a load at all. The modified Goodman line turns a maximum and a minimum into an allowable stress. On ODUMA-4 the top section reaches 25210.199822 psi against an allowable of 30420.168218 psi, 82.873308396 percent and the worst of the three. A load against a rating and a stress against an allowable are different comparisons, and one can pass while the other fails.

## Against the sampling that produced it

The fourth datum is the quietest. The reported peak and minimum are the extremes of the surface card, and that card is a decimation. ODUMA-4 marches 6110 steps in a cycle and keeps 186 of them at a stride of 33, which is 3.044190 percent of what was computed.

The tension envelope from the same call is not decimated. It is accumulated over all 6110 steps at all 120 interior nodes, and it is what the section stresses and the Goodman check read. One return object, two samplings of one march, and the design's two safety checks do not read the same one.

A maximum taken over a subsample can only be lower than the true maximum, and a minimum can only be higher. Both errors narrow the reported range, and neither is reported. `runRodPumpDesign` exposes neither `cardSamples` nor `nodes`, so nobody using the studio can ask for the other sampling.

## What that leaves

Every load figure quoted here is a reading off a curve that kept three percent of a march. Whether that is enough is a question with a number attached, and the number is larger at one end of the card than at the other.

## Exercise

Name the four things a rod pump load is compared with, and the unit of each comparison.

Then write the marched steps, the card points and the percentage kept for ODUMA-4, and say which safety check reads the decimated card.
