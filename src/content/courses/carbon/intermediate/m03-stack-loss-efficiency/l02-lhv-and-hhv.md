# LHV and HHV

SECTION 13 prints the Isiokpo heater with two efficiencies at the same stack oxygen, one on each heating value basis. energyEfficiency names the two bases, and SECTION 1 prints them as the constant HEATING_VALUE_BASIS: LHV, HHV. This lesson reads both for the invented Isiokpo fuel gas and reads what the engine holds about its own typical pair.

{{panel:carbon-efficiency-explorer}}

## Two heating values for every fuel

SECTION 1 prints a typical LHV and a typical HHV for every burning row of FUEL_REFERENCE, in MJ per kmol:

| code | typical LHV MJ/kmol | typical HHV MJ/kmol |
| --- | --- | --- |
| CH4 | 802.6 | 890.8 |
| C2H6 | 1428.6 | 1560.7 |
| C3H8 | 2043.1 | 2219.2 |
| C4H10 | 2657.3 | 2877.5 |
| H2 | 241.8 | 285.8 |

The two inert rows, CO2 and N2, carry 0 on both bases. On every burning row the HHV column prints the higher figure. The engine's moisture notes, which lesson three reads in full, name the reason: HHV counts the latent heat of the water made from hydrogen as available and LHV never counted it.

The note attached to the whole table governs how these figures are used, verbatim: "Atom counts are definitional and drive the stoichiometry. Heating values are typical: the fuel analysis governs, and a measured value should replace these."

## The Isiokpo fuel on both bases

Weighted over the analysis of module one, SECTION 11 prints the Isiokpo fuel's heating values:

| output | value | unit |
| --- | --- | --- |
| lhvMJPerKmolFuel | 840.9925 | MJ per kmol fuel |
| hhvMJPerKmolFuel | 930.6273 | MJ per kmol fuel |

Both are per kmol of the fuel as analysed, inerts included, which is why lesson three of module one found the LHV at 862.5564 once the CO2 was taken out.

## The same heater, two efficiencies

SECTION 13 prints the heater at its current reading of 5.5 percent oxygen on each basis. On LHV the efficiency is 86.4029 percent. On HHV it is 77.9288 percent. The digest computes the gap from the engine's figures: a difference of 8.4741 percentage points. The fuel, the stack, the air and the oxygen reading are the same in both rows, and so is the excess air, 32.1223 percent. The losses are printed on each basis too: the dry flue gas loss is 9.9883 percent on LHV and 9.0262 percent on HHV, the total loss 13.5971 percent on LHV and 22.0712 percent on HHV. Lesson three reads the moisture loss on each basis.

## A pair the engine holds as typical

The methane row carries a held item. SECTION 25 lists it as H2: the engine's typical methane heating values are 802.6 LHV and 890.8 HHV MJ per kmol, a difference of 88.2 (computed here), while two moles of water condensed at the engine's own latent heat is 87.985 MJ (computed here, from 2 x 18.015 kg at 2442 kJ/kg). SECTION 25 leaves the pair as the engine prints it. It states that the pair is labelled typical, that it stays as printed until ISO 6976 is in hand, and that the fuel analysis governs.

This course teaches H2 as a stated limit and grades nothing on it. The practical reading is the note's own sentence: a typical heating value is a placeholder for a measured one. In practice, a plant's fuel gas analysis report carries measured heating values, and those replace the typical column.

## Exercise

Read the methane row of FUEL_REFERENCE, 802.6 and 890.8 MJ per kmol, and the two figures SECTION 25 computes beside it, 88.2 and 87.985. Then read the Isiokpo fuel's lhvMJPerKmolFuel and hhvMJPerKmolFuel in SECTION 11. Say what the held item H2 records about the methane pair, and what FUEL_REFERENCE_NOTE says should happen to every typical value when a measured one is in hand.
