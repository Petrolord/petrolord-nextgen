# A carbon number is never assumed

The carbon count in this module is read from each component's carbon per molecule. This lesson reads where that number comes from when it is not typed, and what characteriseGas refuses when an analysis cannot be read at all.

{{panel:gasvalue-flare-explorer}}

## A blank carbon number is filled from the reference

A hydrocarbon typed without a carbon number takes it from the reference by its code. The engine was probed with a gas of methane 0.9 and propane 0.1, once with propane's carbon number typed as 3 and once with it left blank:

| probe | carbonPerMol | hydrocarbonCarbonPerMol |
| --- | --- | --- |
| propane carbon number typed | 1.2000 | 1.2000 |
| propane carbon number left blank | 1.2000 | 1.2000 |

The two rows read the same, 1.2000 and 1.2000. The code C3 finds propane's row in the reference table, and that row carries 3 carbon per molecule. The blank is filled from a known code.

Both counts read 1.2000 in each row because the probe gas carries no CO2, so there is no gap between them.

## An unknown code is refused

A code the reference does not carry has no row to fill from. Asked about an unknown code, XX, with no carbon number, characteriseGas refuses:

REFUSED: No carbon number for XX. The flare's CO2 is counted atom by atom, so it is not assumed.

The refusal gives its own reason. The flare's CO2 is counted atom by atom, from the carbon per mole, and a carbon number the engine cannot read from the reference or from the analysis is not assumed.

## Three more refusals

characteriseGas refuses three other analyses, each in its own words:

| probe | engine |
| --- | --- |
| a negative mole fraction (methane 1.1, ethane -0.1) | REFUSED: A mole fraction cannot be negative. |
| a blank mole fraction (methane typed as '') | REFUSED: Every component needs a mole fraction. |
| every mole fraction zero | REFUSED: The gas composition sums to nothing. |

Read the first probe closely. It types methane 1.1 and ethane -0.1, and the engine refuses the sheet on the ethane: a mole fraction cannot be negative.

The second probe types methane as a blank. The engine refuses it with its own sentence, every component needs a mole fraction, and that sentence differs from the one for a sheet of zeros.

The third probe types every fraction as zero, and the engine says the gas composition sums to nothing.

## Refused and scaled are different answers

Set these beside module one. A sheet that sums to 0.9850 is scaled to one and carries a note. A sheet with a negative, a blank or nothing at all is refused. The engine reports each answer in its own words. A refused analysis goes no further: given a gas the analysis refused, the flare's abatement call answers "REFUSED: A characterised gas is required."

## Trying the refusals in the explorer

In the flare explorer, clear propane's carbon number and read the carbon per mole. Then type a negative fraction, and then clear a fraction, and read the refusal the explorer shows for each.

## Exercise

Read the two probe rows, typed and blank, each at carbonPerMol 1.2000, and the refusal for XX. Say where a blank carbon number is filled from, why the probe rows read the same, and what reason the refusal for XX gives for not assuming a carbon number.

Self check: a hydrocarbon typed without a carbon number takes it from the reference by its code, so the blank propane takes 3 from C3's row and the two rows both read 1.2000. XX has no row in the reference, and the engine refuses: "No carbon number for XX. The flare's CO2 is counted atom by atom, so it is not assumed."
