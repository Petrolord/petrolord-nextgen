# The workflow end to end

Five modules have each taken one piece of the Beginner rock physics problem apart. This lesson puts them back in working order, because the pieces are not independent. Every step consumes what the step before it produced, and a fluid computed at the wrong conditions in step two is still wrong at the end without ever announcing itself.

The order is: conditions, brine, gas, oil, frame, mix, hand on.

## Step 1: state the conditions

Nothing can be computed until the conditions are on the page. For the Ekene sand they are 60 degC, 25 MPa pore pressure, brine salinity 35,000 ppm which the engine takes as a weight fraction of 0.035, gas gravity 0.6, and a 35 API oil with a stock tank density of 0.85 g/cc carrying a gas oil ratio of 50 L/L.

This step produces no number of its own and it controls every number that follows. Module five was entirely about that fact.

## Step 2: the brine

The engine returns a density of 1017.8249875 kg/m3, a bulk modulus of 2.6978112899395996 GPa and a velocity of 1628.0555893189182 m/s.

Brine is the reference fluid for everything downstream, because it is the fluid the rock is assumed to hold before anybody suggests hydrocarbons. It is also the stiffest of the three by a wide margin.

## Step 3: the gas

Density 172.66679461728904 kg/m3 and bulk modulus 55.71865290286663 MPa. Note the unit. This one is graded in MPa and the brine in GPa.

At these conditions the brine is 48.42 times stiffer than the gas. That single ratio is the reason a small gas saturation changes everything further down the chain.

## Step 4: the live oil

Density 777.0630099023522 kg/m3, bulk modulus 1.1427945726905131 GPa, velocity 1212.7072294996883 m/s. The oil sits between the other two on both counts, which is why oil is a harder seismic target than gas and an easier one than nothing at all.

## Step 5: the mineral frame

The sand is 70 percent quartz and 30 percent clay. Voigt gives an upper bound of 31.890000 GPa on the bulk modulus and Reuss a lower bound of 29.868801 GPa, and their average is the Voigt Reuss Hill value of 30.87940062475596 GPa. The same treatment on shear gives bounds of 33.570000 and 16.939444 GPa and a VRH value of 25.25472176759411 GPa.

Density needs no bounds because it mixes exactly linearly: $0.7 \times 2650 + 0.3 \times 2580 = 2629$ kg/m3.

The bound spread is the part worth carrying. The two bulk modulus bounds sit about 6.8 percent apart, so the VRH bulk modulus is a well constrained claim about the rock whatever its geometry turns out to be. The two shear bounds sit nearly a factor of two apart, because quartz is about 6.5 times stiffer in shear than clay, so the VRH shear modulus is a much weaker claim about the very same rock.

## Step 6: mix the pore fluid

At the capstone saturation of 80 percent brine and 20 percent gas, Wood's equation gives a mixed fluid bulk modulus of 257.3340919366766 MPa and a mixed density of 848.7933489234579 kg/m3.

The modulus mixes as a harmonic average of the phases, so the soft phase dominates. The brine term contributes 7.6 percent of the total compliance and the gas term contributes 92.4 percent, which is to say that 20 percent gas does 92 percent of the softening. The density mixes linearly, so it lands exactly at $0.8 \times 1017.8249875 + 0.2 \times 172.66679461728904$.

Those two behaviours are the reason gas is visible on seismic at all. It moves the stiffness violently and the density hardly at all, and the two move in the same direction for velocity.

## Step 7: hand it on

The Beginner tier stops here, with three fluids, a frame and a mixed pore fluid, all at in situ conditions. Those are the ingredients Gassmann's equation needs, and the Professional tier is where they are placed inside a real rock and turned into a predicted velocity.

## Where each course fits

Laid out this way, the geoscience path stops looking like separate applications.

The Well Data course made the logs trustworthy and is the formal prerequisite for this one. The Petrophysics course produced the porosity and the water saturation this course mixes at, and the lithology split that becomes the 70/30 quartz and clay frame in step 5. The Well Correlation course put the sand in a zone so you know which interval you are describing. The Pore Pressure course, further along the same path, is where the 25 MPa of step 1 comes from when no direct measurement exists. The Seismolord course is downstream: it is where the response this chain predicts gets compared against the seismic actually recorded.

Each course also inherits the previous one's weaknesses. A shale volume estimated badly in the petrophysics work becomes a mineral split that is wrong here, and the frame moduli it produces are wrong with it, quietly and without complaint.

That is the whole Beginner path. Five conditions in, three fluids, one frame, one mix, and a set of ingredients a substitution can rest on.

## Exercise

Write the seven steps from memory in order and put beside each the single Ekene number it produces. Then answer in one sentence: which step produces no number of its own and yet controls every number in the list?

As a self check: the conditions are 60 degC and 25 MPa with salinity 0.035, gas gravity 0.6 and GOR 50 L/L; brine gives 1017.8249875 kg/m3 and 2.6978112899395996 GPa; gas gives 172.66679461728904 kg/m3 and 55.71865290286663 MPa; live oil gives 777.0630099023522 kg/m3 and 1.1427945726905131 GPa; the frame gives 30.87940062475596 GPa and 2629 kg/m3; the Wood mix at Sw 0.8 gives 257.3340919366766 MPa and 848.7933489234579 kg/m3; and step seven hands all of that to Gassmann. The step that produces nothing and controls everything is step 1, because each fluid is evaluated at those conditions and no later step can detect that they were stated wrongly.
