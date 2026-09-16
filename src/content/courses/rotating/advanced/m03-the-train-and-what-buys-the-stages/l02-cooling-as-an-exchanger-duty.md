# Interstage cooling as an exchanger duty

The cooler between two stages is not a convenience in the calculation. It is a piece of equipment with a duty in Btu per hour, and the train reports that duty stage by stage.

{{panel:fc-compressor-explorer}}

## What the train reports

On the SOKU train each stage carries a cooling duty and the temperature it was cooled to:

| stage | out degF | cooling Btu per hr | cooled to degF |
| --- | --- | --- | --- |
| 1 | 251.2956 | 4163623.9019 | 110.0000 |
| 2 | 258.8635 | 4386630.5362 | 110.0000 |
| 3 | 258.8635 | 0.0000 | null |

The total is 8550254.4381 Btu per hr, which is 8.5503 MMBtu per hr.

## The last stage is not cooled

The third stage shows a cooling duty of 0.0000 Btu per hr and a cooled-to temperature of null. That is correct and it is worth being explicit about. Interstage cooling exists to bring a gas back down before the next stage picks it up, and after the last stage there is no next stage. Whatever happens to the gas after that belongs to the aftercooler, the pipeline or the process downstream, and it is somebody else's duty sheet.

A null is doing real work there. A zero in the cooled-to column would have claimed the gas was chilled to zero degrees Fahrenheit. The engine declines to name a temperature that does not exist.

## Two coolers, two duties

The first cooler takes 4163623.9019 Btu per hr and the second takes 4386630.5362 Btu per hr. The two are close and they are not equal, because the second stage leaves at 258.8635 degF while the first leaves at 251.2956 degF, and both are being brought back to the same 110.0000 degF.

That is what makes the train useful as an equipment list rather than as a number. Each of those figures sizes an air cooler or a shell-and-tube exchanger, and each one carries a plot area, a fan or a cooling water demand, and a pressure drop that the next stage will be paying for at its suction.

## Cooling is a cost that competes with power

It is easy to read interstage cooling as free because it reduces the compression work. It is not free. Somewhere it is fan power, water, plot space and fouling, and the total of 8.5503 MMBtu per hr on this train is a real piece of equipment.

The useful habit is to read the cooling total and the brake horsepower total as one pair. Moving the approach moves both, and moving it in the direction that helps one is moving it in the direction that hurts the other.

## The mistake

The mistake is treating a train result as a compressor result. It is a compressor result and an exchanger result together, and a report that hands over 4481.0626 brake horsepower without the 8.5503 MMBtu per hr beside it has described half the machine.

The second mistake is adding a cooler after the last stage because the table looked as if one belonged there.

## Exercise

Give the cooling duty on each stage of the SOKU train and the total. Explain why the last stage shows 0.0000 Btu per hr and a null cooled-to temperature, and why the two interstage duties differ despite both cooling to 110.0000 degF.
