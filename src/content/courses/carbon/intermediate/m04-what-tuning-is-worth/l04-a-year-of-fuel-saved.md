# A year of fuel saved

A saving fraction is a ratio. A plant budget is written in energy a year. This lesson reads how the engine turns the one into the other for the invented Isiokpo heater, and what the caller has to match for the answer to mean anything.

{{panel:carbon-efficiency-explorer}}

## The annual figure

SECTION 14 prints the Isiokpo tuning, current 5.5 percent oxygen to target 2.8 percent, with a declared floor of 2 percent and 410000 GJ of fuel a year on LHV:

| output | value |
| --- | --- |
| basis | LHV |
| currentEfficiencyPercent | 86.4029 |
| targetEfficiencyPercent | 87.8476 |
| fuelSavingFraction | 0.0164448058 |
| fuelSavingPercent | 1.6445 |
| annualEnergySavedGJ | 6742.370 |

The digest states how the last row is made: the engine multiplies a saving fraction by the annual fuel it is given. The fraction is 0.0164448058, the annual fuel is the invented 410000 GJ, and the engine reports annualEnergySavedGJ 6742.370. The saving prints to three decimals of a GJ, as the digest's precision line says gigajoules do.

## The fuel figure is the caller's

The engine does not measure the heater's fuel. It is given a number. At Isiokpo the number is stated on LHV, and it has to be: the saving fraction came from two LHV efficiencies, so the annual fuel it multiplies must be LHV fuel for the product to be LHV energy saved.

The digest says this plainly in one sentence about the HHV case: the engine multiplies a saving fraction by the annual fuel it is given, and the basis of that fuel figure is the caller's to match. SECTION 14 prints the HHV saving fraction, computed from the two HHV efficiencies of SECTION 13, as 0.0164763814, a fuelSavingPercent of 1.6476. SECTION 14 prints no annual fuel on HHV and no annual HHV saving in gigajoules. The HHV fraction waits for an HHV fuel figure, and the caller supplies it.

In practice, a fuel figure can arrive from a meter, a plan or an invoice on either heating value, so its basis is read before it is multiplied.

## The sweep in gigajoules

SECTION 14 prints the annual saving at four targets, all from the same current state and the same 410000 GJ a year on LHV:

| target O2 percent | target efficiency percent LHV | fuelSavingPercent | annualEnergySavedGJ |
| --- | --- | --- | --- |
| 2.0 | 88.1965 | 2.0336 | 8337.934 |
| 2.8 | 87.8476 | 1.6445 | 6742.370 |
| 3.5 | 87.5160 | 1.2718 | 5214.422 |
| 4.5 | 86.9933 | 0.6786 | 2782.362 |

Each annual figure is its own row's saving fraction applied to the same fuel. The table is the whole of what the digest prints about the saving: a figure in gigajoules on LHV. It prints no money and no carbon for this tuning. Pricing a saving in money and carbon is a later tier's work.

## What the figure is and is not

annualEnergySavedGJ 6742.370 is energy: LHV gigajoules of fuel the Isiokpo heater would not burn in a year at the 2.8 percent target. It is no tonne of CO2e and no dollar. Every input behind it, the fuel analysis, the stack and air temperatures, the radiation loss, the floor and the 410000 GJ, is invented for this course.

## Exercise

Read the SECTION 14 output table and the sweep. Say what the engine multiplies to reach annualEnergySavedGJ 6742.370, on which basis that figure is stated and why, and what the digest's sentence about the basis of the fuel figure says a caller must supply before the HHV saving fraction of 0.0164763814 can become gigajoules a year.
