# The capstone walkthrough

The Associate capstone for this course is called Reservoir fluids and the mineral frame, and it is short. Its brief states a sand of its own: a temperature and pressure, a brine salinity, a gas gravity, a live oil given by its stock-tank density and GOR, a quartz and clay frame, and a water saturation. It grades six numbers. There is no essay and no hidden dataset. Every input is in the brief, and every graded number comes out of the fluid panel once you have typed that case into it.

The panel opens on the Ekene sand, which is this course's teaching case. None of its numbers is a capstone answer. This lesson walks the six fields in the order the capstone asks for them, works each one on Ekene so you can see where it is read, and points out where marks are lost.

## The six graded fields

| Field | Unit | Where it is read |
| --- | --- | --- |
| Brine density | kg/m3 | brine density tile |
| Brine bulk modulus | GPa | brine K tile |
| Gas bulk modulus | MPa | gas K tile |
| Live-oil density | kg/m3 | live-oil density tile |
| Frame K, Voigt-Reuss-Hill | GPa | frame K (VRH) tile |
| Wood mixed-fluid K at the stated Sw | MPa | Wood mixed K tile |

## Setting the case

Type every input before you read anything. The temperature is in degC and the pressure in MPa. The salinity box takes ppm, so 35,000 ppm is typed as 35000. The oil box takes the stock-tank density in g/cc. The frame box takes the quartz fraction and the rest is clay. The saturation box takes Sw as a fraction.

A panel with one input left at its Ekene value produces a set of numbers that look entirely reasonable and are wrong. Read the subtitle after typing: it repeats every condition the panel is using.

## Worked on the Ekene teaching case

At 60 degC, 25 MPa, 35,000 ppm brine, 0.6 gravity gas, a 0.85 g/cc oil at GOR 50 L/L, a 70/30 quartz and clay frame and Sw 0.8:

**Brine density, 1017.8249875 kg/m3.** The Batzle and Wang brine at those conditions, read from the brine density tile.

**Brine bulk modulus, 2.6978112899395996 GPa.** The same brine, stiffness tile, and the unit here is GPa.

**Gas bulk modulus, 55.71865290286663 MPa.** The gas at the same conditions, and the unit here is MPa.

**Live-oil density, 777.0630099023522 kg/m3.** The oil carrying its dissolved gas at GOR 50 L/L.

**Frame K, VRH, 30.87940062475596 GPa.** The Voigt Reuss Hill bulk modulus of the mineral mix, from the bulk modulus tile and not the shear tile.

**Wood mixed-fluid K at Sw 0.8, 257.3340919366766 MPa.** The pore fluid after 80 percent brine and 20 percent gas have been mixed harmonically.

Your capstone case moves every one of these. The method does not move.

## The unit trap

Four of the six are stiffnesses and they are not all in the same unit. Brine bulk modulus and frame bulk modulus are graded in GPa. Gas bulk modulus and the Wood mixed fluid are graded in MPa.

That split is deliberate and it is the single biggest source of lost marks on this capstone. Entering a brine modulus as 2697.8113 because you were thinking in MPa puts it a factor of a thousand away from an answer with a tight window. Entering a gas modulus as a small decimal in GPa does the same thing in the other direction.

Read the unit label on each field before you type into it, every time, including on a retake.

## Where else marks are lost

The tolerances are set to what the panel prints, so copy each tile to the decimals shown. Rounding a tile to one or two decimals can move you outside the window.

The frame block shows a shear modulus next to the bulk modulus. Only the bulk modulus is graded. The two sit side by side and the shear value is the most common thing to find in the wrong box.

The panel also shows a mixed density beside the mixed fluid modulus. That is a real number in the chain and it is not graded here. Take care it does not end up in the Wood field, which wants the modulus in MPa.

Last, check the saturation before you read the sixth field. The Wood value is graded at the saturation the brief states. On Ekene the same panel reads 469.8509 MPa at Sw 0.9 and 109.1823 MPa at Sw 0.5, so a saturation left in the wrong place produces a number that looks entirely reasonable and is wrong.

## Getting to the capstone at all

The platform enforces the order. Read every lesson in a module, then pass that module's quiz at 75 percent. Three consecutive failed attempts trigger a 24 hour cooldown, so a quiz is worth preparing for rather than probing. Clear all six modules that way, pass the final exam at 70 percent, and the capstone unlocks.

Passing it grants the Associate certification for this course: a statement that you can compute reservoir fluids at in situ conditions, build a mineral frame with defensible bounds, and mix a pore fluid correctly.

Try it yourself: reproduce the six Ekene values above on the panel, then change the temperature to 80 degC and watch which of the six move and which stay put.

{{panel:rp-fluid-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order and write the unit for each. Then answer in one sentence: which input, left at its Ekene value, would move all three fluids at once, and which number on the panel is most likely to be entered in the wrong box?

As a self check: brine density in kg/m3, brine bulk modulus in GPa, gas bulk modulus in MPa, live oil density in kg/m3, frame VRH bulk modulus in GPa, and the Wood mixed fluid modulus at the stated saturation in MPa. Temperature and pressure each move every fluid at once; the salinity moves only the brine and the gas gravity only the gas and the live oil. The number most likely to be entered in the wrong box is the frame shear modulus, which the panel displays next to the graded bulk modulus and which is not graded at this tier.
