# Onward to Professional

This tier taught one sand. You fixed the Ekene conditions at 60 degC and 25 MPa with 35,000 ppm brine, 0.6 gravity gas and a 35 API oil at GOR 50 L/L, computed a brine at 1017.8249875 kg/m3 and 2.6978112899395996 GPa, a gas at 172.66679461728904 kg/m3 and 55.71865290286663 MPa and a live oil at 777.0630099023522 kg/m3, mixed a 70/30 quartz and clay frame to a Voigt Reuss Hill bulk modulus of 30.87940062475596 GPa at a density of 2629 kg/m3, and mixed the pore fluid at Sw 0.8 to 257.3340919366766 MPa. Then you learned what those numbers do when the conditions move.

That is a complete skill and it is deliberately narrow in one direction. Everything you computed is an ingredient. Nothing you computed is a rock, and nothing you computed is a seismic response. The two tiers above close exactly that gap, and it is worth knowing what they are before you decide whether to climb.

## Professional: put the fluid inside a rock

The Professional tier stops treating the fluid and the frame as separate objects and puts them together, which is what Gassmann's equation is for.

The input is a real log point rather than a mineral recipe. The Ekene sand logs at a compressional velocity of 3200 m/s, a shear velocity of 1800 m/s and a density of 2250 kg/m3, with a porosity of 0.25 and a mixed mineral bulk modulus of 37 GPa. That rock is brine saturated, which is the state it was logged in.

The tier runs the problem in two directions. First it goes backwards, using inverse Gassmann to strip the brine out and recover the dry frame, which is the rock's own stiffness with nothing in the pores. Then it goes forwards, putting a different fluid back in and predicting what the logs would have read.

| quantity | value |
| --- | --- |
| shear modulus, fluid blind | 7.29 GPa |
| in situ saturated bulk modulus | 13.32 GPa |
| dry frame bulk modulus | 7.350343061720982 GPa |
| gas case compressional velocity | 2905.697 m/s |

Three things in that table are worth noticing now, because they set up everything the tier does.

The shear modulus is described as fluid blind. Fluids have no shear stiffness, so a fluid change cannot move it, and that fact is the hinge the whole substitution turns on.

The dry frame bulk modulus of 7.350343061720982 GPa is far below the 30.87940062475596 GPa you computed for the mineral frame at this tier. That is not a contradiction. The mineral frame is what the solid grains would do if they were welded into a solid block. The dry frame is what the actual rock does, with 25 percent of its volume as empty pore and its grains touching only at contacts. Porosity and grain contacts are what separates those two numbers, and learning to hold them apart is most of the tier.

The substituted velocity falls from the logged 3200 m/s to 2905.697 m/s when the brine is replaced by gas. That is the number the seismic sees, and it is where the Beginner work finally pays off, because the fluid modulus that drives it is the one you computed here.

## Expert: turn the rock into a seismic response

The Expert tier chains the substitution into what a recorded seismic trace would actually do.

It puts the Ekene shale over the sand and screens both cases, the logged brine sand and its gas substituted twin, through amplitude versus offset analysis. The headline is that fluid substitution flips the AVO class. The brine sand is class I and the gas sand is class III, which are two visibly different behaviours on a gather and two different stories about the same rock.

That flip is the point of the whole ladder. A class change is not a small numerical shift you have to argue about. It is a qualitative change in what an interpreter sees, and it can be predicted before a well is drilled from ingredients of the kind you built at this tier.

The tier also takes up resolution. At 25 Hz the wedge model picks a tuning thickness of 16 ms, which is the thickness below which a bed's top and base reflections stop being separable and the amplitude starts to mislead. An anomaly can be perfectly real and still be the wrong thickness for the arithmetic anybody wants to do with it.

## The shape of the ladder

Put the three tiers in one line. The Beginner tier computes the ingredients: fluids at in situ conditions, a mineral frame with bounds, a mixed pore fluid. The Professional tier puts those ingredients into a rock with porosity and predicts what a fluid change does to its velocity and density. The Expert tier puts that rock under a shale and predicts what a seismic survey would record.

Each tier makes the one below it more demanding rather than replacing it. A substitution is only as good as the fluid modulus it is handed, so the conditions discipline of module five becomes more important at the Professional tier, not less. An AVO class prediction is only as good as the substitution under it, so both lower tiers are load bearing by the time you reach the Expert work.

The same widening runs sideways across courses. Well data makes the logs trustworthy, petrophysics turns them into porosity and saturation, this course turns conditions into fluid and frame properties, and Seismolord is where the predicted response meets the seismic actually recorded. A fluid computed at the wrong conditions here becomes an amplitude interpretation that is confidently wrong three courses later.

## Exercise

Write one sentence for each tier saying what it does that the tier below it cannot. Then answer in one sentence: why is the Professional tier's dry frame bulk modulus so much smaller than the mineral frame bulk modulus you computed at this tier?

As a self check: this tier computes fluids and a mineral frame at in situ conditions and mixes the pore fluid; the Professional tier recovers the dry frame with inverse Gassmann from a logged point at 3200 m/s, 1800 m/s and 2250 kg/m3, giving a fluid blind shear modulus of 7.29 GPa, an in situ saturated bulk modulus of 13.32 GPa and a dry frame bulk modulus of 7.350343061720982 GPa, then substitutes the fluid to predict a gas case velocity of 2905.697 m/s; and the Expert tier chains that into AVO, where the sand flips from class I under brine to class III under gas, and picks 16 ms of tuning at 25 Hz. The dry frame of 7.350343061720982 GPa is far below the mineral frame of 30.87940062475596 GPa because the mineral value describes solid grains welded into a block, while the dry frame describes a real rock that is a quarter pore space and whose grains touch only at contacts.
