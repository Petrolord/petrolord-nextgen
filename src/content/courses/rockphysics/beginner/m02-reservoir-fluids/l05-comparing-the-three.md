# Comparing the three

Three fluids have been built at one set of conditions. This lesson puts them in a single table and draws the conclusion that the rest of the course depends on.

## The three fluids at 60 degC and 25 MPa

| Fluid | Density (kg/m3) | Bulk modulus | vp (m/s) |
| --- | --- | --- | --- |
| brine | 1017.8249875 | 2.6978112899395996 GPa | 1628.0555893189182 |
| gas | 172.66679461728904 | 55.71865290286663 MPa | not returned by the engine |
| live oil | 777.0630099023522 | 1.1427945726905131 GPa | 1212.7072294996883 |

Every value in that table was produced at the same temperature, the same pressure, the same brine salinity of 0.035, the same gas gravity of 0.6 and the same oil at 0.85 g/cc with a GOR of 50 L/L. That is what makes the rows comparable. A table of fluid properties gathered from three different sources at three different sets of conditions is not comparable, and the comparison below would be meaningless if it were built that way.

## Read the density column first

The densities span from 172.66679461728904 kg/m3 for the gas to 1017.8249875 kg/m3 for the brine, with the live oil at 777.0630099023522 kg/m3 sitting between them and closer to the brine.

The whole column stays within one order of magnitude. That is a real spread, and it matters, because density enters velocity directly and it also sets the buoyancy that stacks the fluids in the reservoir in the order oil above water and gas above both. It is not, however, a dramatic spread. All three are recognisably fluids of comparable weight.

## Now read the modulus column

Here the pattern breaks.

Brine is 2.6978112899395996 GPa. Live oil is 1.1427945726905131 GPa, softer than brine but quoted in the same unit and on the same scale. Gas is 55.71865290286663 MPa, and the unit has changed.

Brine is 48.42 times stiffer than the gas.

Two of the three fluids sit within a factor of a few of each other. The third is more than an order of magnitude away from both. Gas is the outlier, and it is the outlier in the property that seismic responds to most directly.

## Why the outlier is the whole business

Follow the consequence through.

A seismic wave passing through a saturated rock feels the bulk modulus and the density of the whole rock, frame plus fluid. The fluid contributes to both. Swap one fluid for another and both change, and the reflection at the top of the rock changes with them.

If you swap brine for oil, the fluid modulus moves from 2.6978112899395996 GPa to 1.1427945726905131 GPa and the density moves from 1017.8249875 to 777.0630099023522 kg/m3. Both are real changes, both push the rock a little slower, and in a good dataset with a stiff enough contrast the effect can sometimes be seen. It is a subtle result, and an oil versus brine discrimination is difficult work in most basins.

If you swap brine for gas, the fluid modulus moves from 2.6978112899395996 GPa to 55.71865290286663 MPa. The pore contents become nearly fifty times more compressible. The rock becomes markedly slower and lighter at once, the impedance drops sharply, and the reflection at the top of the sand changes enough to be visible on ordinary data. That is a bright spot, and that is why gas is the fluid seismic finds.

Now run the argument backwards, which is the version worth remembering. Suppose the three moduli had all been within a factor of two of each other. Fluid substitution would then change a rock by a fraction of a percent, the amplitude change would sit below the noise on any real survey, and no amount of processing or inversion would recover it. Direct hydrocarbon indication would not exist as a technique. It exists because of that 48.42, and for no other reason.

## A little gas goes a long way

Module 4 mixes brine with gas in the pore space and quantifies this, but the headline belongs here, because it follows directly from the table above.

At the capstone saturation of Sw 0.8, meaning 80 percent brine and 20 percent gas, the mixed pore fluid has a bulk modulus of 257.3340919366766 MPa and a density of 848.7933489234579 kg/m3.

Compare each of those against pure brine. The density fell from 1017.8249875 to 848.7933489234579 kg/m3, which is a linear mix and a modest move. The bulk modulus fell from 2.6978112899395996 GPa to 257.3340919366766 MPa, which is a fall by a factor of ten for a change of 20 percent in saturation.

That is the asymmetry the whole technique lives on, and it also carries a warning that module 4 develops. Because the modulus responds so violently to the first small amount of gas, a seismic amplitude tells you confidently that gas is present and tells you very little about how much. A sand with a few percent gas and a sand full of gas can look similar. Distinguishing them is a different problem, and it is not solved by looking harder at the amplitude.

The panel below lets you set the water saturation and read the three fluids, the mineral frame and the Wood mix as they respond.

{{panel:rp-fluid-explorer}}

## Exercise

Reproduce the three fluid table from memory as far as you can, then check it, and write one sentence for each column saying what the spread across the three fluids is like. Then answer one question in two sentences. If brine, oil and gas all had bulk moduli within a factor of two of each other, what would happen to seismic hydrocarbon detection, and why?

Self check: the density column spans 172.66679461728904 kg/m3 for gas to 1017.8249875 kg/m3 for brine with oil at 777.0630099023522 kg/m3 between them, a real but moderate spread. The modulus column has brine at 2.6978112899395996 GPa and oil at 1.1427945726905131 GPa on the same scale, with gas at 55.71865290286663 MPa more than an order of magnitude away, so brine is 48.42 times stiffer than gas. If the three moduli were all within a factor of two, replacing one fluid with another would barely change the bulk modulus of the saturated rock, so the velocity, the impedance and the reflection amplitude would barely move. The resulting amplitude change would sit below the noise on real data, and seismic direct hydrocarbon detection would not work at all.
