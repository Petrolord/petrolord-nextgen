# Three dew points, one phrase

The phrase "dew point" is used for three different quantities across this platform, and a learner arriving from the reservoir side has usually met the third one first. Separate them before using any of them, because the units, the method and the owning course are different in each case.

{{panel:fc-coldend-explorer}}

## The water dew point

The temperature at which liquid water begins to come out of a gas at a stated pressure. It is the quantity the dehydration half of this module is about and the one the cold separator delivers. The saturation answer is its inverse reading: rather than asking at what temperature water appears, the engine asks how much water a gas can hold at a stated pressure and temperature.

On AGBADA at 640.000000 psia the gas at 59.683516566 degF holds 18.762820770 lb per MMscf, against 33.801656743 lb per MMscf at its inlet. Express that as a temperature and you have a water dew point. Express it as a mass and you have the number this engine prints.

## The hydrocarbon dew point

The temperature at which liquid hydrocarbon begins to condense out of a gas. This is what a dew point skid is usually sold on commercially, and it is the one this engine does not compute. Finding it needs a compositional flash, and there is no compositional flash anywhere in this module. The phase envelope of a fluid belongs to the Fluid engine.

So a skid sized here is sized on its cooling and on the water it drops. Whether the same cold spot puts the hydrocarbon dew point where a sales contract wants it is a question this module hands on.

## The PVT dew point

The saturation pressure of a reservoir fluid, which is the sense the Fluid course uses in its own advanced tier. It is a pressure rather than a temperature, it belongs to a reservoir fluid rather than to a treated sales gas, and it has nothing to do with water. Carry that sense into a gas plant and every number in this module reads as the wrong quantity.

## The seam the glycol side leaves open

There is a fourth place the phrase appears, and the engine is careful about it. The outlet water content a dehydration unit is designed to is a typed design input. The dew point a given lean glycol strength can actually deliver is read off a chart, and no chart is in this module. The engine reports the loop balance and states that basis on every answer rather than pretending to derive one from the other.

Three senses of one phrase, and one honest gap. Say which you mean every time.

## Exercise

Write one sentence defining each of the three dew points, naming the quantity each is measured in and the engine or course that owns it. Then record the two AGBADA water contents above and say which of the three senses they belong to. Finally, say what the engine does when asked for the dew point a lean glycol strength can deliver.
