# A contactor is not a knockout drum

The equation that sizes a contactor in this module is not new and this course does not re-derive it. Souders-Brown, the K value and the settling velocity belong to the Separation and Slug Catching course, which teaches the six published K rows and the mist extractor that sets them. Go there for the equation.

## What is new here is the duty

A knockout drum is a vessel where a liquid falls out of a gas and is drained away. A contactor is a mass transfer column. The gas has to rise through a liquid that is running down against it, stage by stage, and the vessel has to be wide enough for that to happen at a velocity the liquid can live with.

The arithmetic of the width happens to be the same arithmetic. The reason for it is different, and so is the liquid it is measured against, which is the subject of the last lesson in this module.

{{panel:fc-absorber-explorer}}

## The two teaching columns

| stream | pressure, psia | temperature, degF | diameter, ft |
| --- | --- | --- | --- |
| OBIAFU, a glycol contactor | 950.000000 | 104.000000 | 3.192661 |
| UBIE, an amine contactor | 985.000000 | 112.000000 | 4.208602 |

Those are the vessels the two streams go up, and both rows were sized against the same liquid: the module's DEFAULT, which is glycol. That is right for OBIAFU and wrong in kind for UBIE, an amine column. The density is an input, so nothing is assumed and nothing is detected: a sweetening caller has to pass the amine's own, and these rows show what a caller who does not gets. The last lesson in this module is about which liquid a diameter was measured against.

## Where the width sits in the answer

This is the one part of the whole conditioning chain that cares what pressure the gas is at rather than only how wet or how sour it is. The water content knows the pressure too, but everything between the two, the loads, the circulations and the duties, is indifferent to it.

It is also completely separate from the staged reading of the same column. A stage count and a diameter are answers to different questions and neither constrains the other in this module. A column can be six theoretical stages tall and any width the gas rate demands, and nothing here objects.

That separation is honest rather than convenient. Tray hydraulics really do tie the two together on a plant, and this module carries no tray hydraulics, so it does not pretend to a link it cannot compute. The diameter it returns is the width the gas rate needs at the allowed velocity, and that is the whole claim.

## What it takes as given

The sizing needs a gas rate, a pressure, a temperature, a gas gravity, a K value and a liquid density. The K value is the one design choice among them. The liquid density describes the solvent the column is sized against, and the remaining four describe the gas. The next three lessons take them in the order they matter: the compressibility the engine builds for itself out of the gas description, the K value, and the liquid.

## Exercise

Record the pressure, the temperature and the diameter for both teaching columns. Then name the course that owns the equation behind them, and say in one sentence what a contactor is doing that a knockout drum is not.
