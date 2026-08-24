# The capstone walkthrough

The Associate capstone for this course is called Reservoir fluids and the mineral frame, and it is short. It fixes the Ekene sand at 60 degC and 25 MPa with 35,000 ppm brine, 0.6 gravity gas and a 35 API oil at GOR 50 L/L, sets the mineral frame at 70 percent quartz and 30 percent clay, mixes the pore fluid at Sw 0.8, and grades six numbers. Every one of them is read off the fluid panel. There is no essay, no free interpretation and no hidden dataset. If you have worked the five previous modules, all six are already familiar.

This lesson walks them in the order the capstone asks for them, says where each is read, and points out where marks are lost.

## The six graded fields

| Field | Unit | Value | Tolerance |
| --- | --- | --- | --- |
| Brine density | kg/m3 | 1017.8249875 | 0.5 |
| Brine bulk modulus | GPa | 2.6978112899395996 | 0.005 |
| Gas bulk modulus | MPa | 55.71865290286663 | 0.1 |
| Live-oil density | kg/m3 | 777.0630099023522 | 0.5 |
| Frame K, VRH 70/30 quartz/clay | GPa | 30.87940062475596 | 0.05 |
| Wood mixed-fluid K at Sw 0.8 | MPa | 257.3340919366766 | 0.5 |

**Brine density, 1017.8249875 kg/m3, tolerance 0.5.** The Batzle and Wang brine at the stated conditions. Read it from the density figure on the brine row of the panel's fluid table.

**Brine bulk modulus, 2.6978112899395996 GPa, tolerance 0.005.** The same brine, stiffness column, and the unit here is GPa. Read it from the brine row of the fluid table.

**Gas bulk modulus, 55.71865290286663 MPa, tolerance 0.1.** The 0.6 gravity gas at the same conditions, and the unit here is MPa. Read it from the gas row of the fluid table.

**Live-oil density, 777.0630099023522 kg/m3, tolerance 0.5.** The 35 API oil carrying its dissolved gas at GOR 50 L/L. Read it from the density figure on the oil row.

**Frame K, VRH 70/30 quartz/clay, 30.87940062475596 GPa, tolerance 0.05.** The Voigt Reuss Hill bulk modulus of the mineral mix, in GPa. Read it from the frame block of the panel, from the bulk modulus line and not the shear line.

**Wood mixed-fluid K at Sw 0.8, 257.3340919366766 MPa, tolerance 0.5.** The pore fluid after 80 percent brine and 20 percent gas have been mixed harmonically, in MPa. Set the panel's saturation slider to Sw 0.8 and read it from the mixed fluid line.

## The unit trap

Four of the six are stiffnesses and they are not all in the same unit. Brine bulk modulus and frame bulk modulus are graded in GPa. Gas bulk modulus and the Wood mixed fluid are graded in MPa.

That split is deliberate and it is the single biggest source of lost marks on this capstone. Entering the brine as 2697.8113 because you were thinking in MPa puts it a factor of a thousand away from an answer with a 0.005 window. Entering the gas as a small decimal in GPa does the same thing in the other direction.

Read the unit label on each field before you type into it, every time, including on a retake.

## Where else marks are lost

The brine bulk modulus carries the tightest tolerance on the paper, at 0.005 GPa. It is the field with the least room, so read it from the panel rather than reconstructing it from anything, and give it four decimal places to be comfortable.

The frame block shows a shear modulus of 25.25472176759411 GPa next to the bulk modulus of 30.87940062475596 GPa. Only the bulk modulus is graded. The two sit side by side and the shear value is the most common thing to find in the wrong box.

The panel also shows a mixed density of 848.7933489234579 kg/m3 beside the mixed fluid modulus. That is a real number in the chain and it is not graded here. Take care it does not end up in the Wood field, which wants the modulus in MPa.

You do not need to type every digit that the panel shows. Three decimal places clears every tolerance on this list with room to spare, including the tightest window of 0.005 GPa on the brine bulk modulus. The long values above are what the engine holds, not a demand for how you enter them.

Last, check the saturation before you read the sixth field. The Wood value is graded at Sw 0.8 specifically. At Sw 0.9 the same panel reads 469.8509 MPa and at Sw 0.5 it reads 109.1823 MPa, so a slider left in the wrong place produces a number that looks entirely reasonable and is wrong.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks.

Passing it grants the Associate certification for this course: a statement that you can compute reservoir fluids at in situ conditions, build a mineral frame with defensible bounds, and mix a pore fluid correctly.

Try it yourself: set the panel below to Sw 0.8 and locate each of the six values.

{{panel:rp-fluid-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order and write the unit and tolerance for each. Then answer in one sentence: which field leaves you the least margin, and which number on the panel is most likely to be entered in the wrong box?

As a self check: brine density in kg/m3, tolerance 0.5; brine bulk modulus in GPa, tolerance 0.005; gas bulk modulus in MPa, tolerance 0.1; live oil density in kg/m3, tolerance 0.5; frame VRH bulk modulus in GPa, tolerance 0.05; and the Wood mixed fluid modulus at Sw 0.8 in MPa, tolerance 0.5. The least margin is on the brine bulk modulus at 0.005 GPa. The number most likely to be entered in the wrong box is the frame shear modulus of 25.25472176759411 GPa, which the panel displays next to the graded bulk modulus of 30.87940062475596 GPa and which is not graded at this tier.
