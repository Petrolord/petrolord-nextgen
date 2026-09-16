# Working the capstone

A graded separation exercise is marked on the figure produced, and most lost marks come from answering a nearby question rather than the one asked. Four habits carry it: read the conditions, run both requirements, check the units, and never guess.

{{panel:fc-slug-explorer}}

## Read the conditions

Almost every quantity here is conditional on something stated in the question. A liquid length of 23.270539 ft belongs to a level of 0.500000, and the same drum on the same duty at 0.300000 asks for 46.113917 ft. Neither is wrong, and only one was asked for.

The same applies to the rate, the bore and the fill. Before working anything, write down the diameter, the level, the rate at conditions, the retention or hold time, the fill fraction and the slenderness the question names. A figure produced from a different set of those is simply a different vessel.

## Run both requirements

A horizontal vessel has two length requirements and a separate verdict, and all three have to be worked. The liquid requirement is a retention volume divided by the liquid area. The gas requirement is the gas height times the ratio of the gas velocity to the settling velocity. The length is the larger of the two, and the capacity check compares the gas velocity against the settling velocity on its own.

Stopping at the larger length gives a number with no verdict behind it. The 6.000000 ft drum returns 41.369847 ft and gasCapacityOk false, and reporting the length alone reports a vessel that does not work.

## Check the units

| quantity | how it is written |
| --- | --- |
| gas rate as delivered | MMscfd |
| gas rate in the vessel | ft3/s |
| liquid rate | bpd |
| pressure | psig for gauge, psia for absolute |
| vessel dimensions and areas | ft and ft2, six decimals |
| slug and working volume | bbl, with vessel volume in ft3 |
| site distances and setbacks | metres, four decimals |
| heat release and radiation | kW and kW/m2 |

A gauge pressure of 600.000000 psig is an absolute pressure of 614.700000 psia and the two never substitute. A standard rate of 1273.148148 standard ft3/s is not the 29.490437 ft3/s the vessel sees. A working volume of 391.666667 bbl is not a vessel volume of 3665.075231 ft3 until a fill fraction has been applied. Site work is in metres while the vessel is in feet, and nothing on a plot plan is quoted in feet.

## Never guess

When the engine declines, the decline is the answer. A liquid level of 0 or 1 is refused by name on liquidLevelFrac. A missing slug volume returns an error naming the studio that computes it. A table pair with no entry returns null, which is not zero. A pool fire answer inside the flame height carries a status saying it is a lower bound.

Writing a plausible figure into any of those gaps turns a correct reading into a wrong answer, and the gap was the finding.

The same discipline applies to precision. Quote a vessel figure the way the engine prints it, to six decimals, and a site figure to four, rather than rounding on the way to the answer. A margin of 0.938751 rounds to one, and one is a pass on a vessel that does not carry its gas.

## Exercise

Take any figure you are about to write and name the level, the rate and the bore it belongs to, then the requirement or check that produced it. Check its unit and its precision against the table, and confirm it is a number the engine returned rather than one you supplied.
