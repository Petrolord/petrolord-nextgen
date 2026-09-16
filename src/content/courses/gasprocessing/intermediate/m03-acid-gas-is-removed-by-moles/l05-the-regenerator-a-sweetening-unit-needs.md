# The regenerator a sweetening unit needs

The regenerator is priced on the gallons, and once the circulation is known the duty is one multiplication away. That simplicity is worth understanding precisely, because it decides what the duty figure can and cannot be used for.

## Btu on every gallon circulated

The duty this module carries is a stated number of Btu on each gallon of solution that goes round the loop. On UBIE the figure is 800.000000 Btu a gallon, which is MDEA's customary value, and on 525.893013 gpm it gives 25.242865 MMBtu an hour.

The Btu a gallon is an input. Each amine in the property table carries its own customary figure, and that figure is offered as the default rather than hidden inside the arithmetic. A caller with a real still and a real heat balance is expected to type their own.

That is the module's doctrine at work. A number that is a chart value or an operating custom is put on the page as an input with its customary value named, and a number that can be computed is computed. A regenerator duty per gallon is squarely the first kind, so it is visible and editable rather than buried.

{{panel:fc-absorber-explorer}}

## What follows from a duty per gallon

Because the duty is per gallon, everything that moves the circulation moves the duty with it and in the same direction. Read the two loading tables from the previous lesson again with that in mind, and the duty column stops being a second piece of information and becomes a restatement of the first.

| what is being varied | circulation, gpm | regenerator, MMBtu/hr |
| --- | --- | --- |
| rich loading 0.300000 | 904.535983 | 43.417727 |
| rich loading 0.480000 | 525.893013 | 25.242865 |
| rich loading 0.550000 | 452.267991 | 21.708864 |

That is not a criticism of the model. A duty per gallon circulated is exactly how a regenerator is sized at this stage of a design, and the module is open about what the figure is.

## What it therefore cannot tell you

A duty built this way cannot answer a question about the still itself. It does not know the reboiler temperature, the reflux, the stripping steam or how hard the amine is being stripped, so it cannot tell you what it costs to reach one lean loading rather than another. It prices the loop the lean loading allows and stops there.

Compare that with the glycol side of this engine, where the reboiler duty is built up from named parts and the heat of getting the solvent to the still can be read apart from the heat of boiling the water back out. The sweetening duty is deliberately coarser, and knowing which of the two figures you are holding is the point.

So the honest reading of a regenerator duty from this module is that it is a size rather than a cost. It says how large a reboiler the loop implies at a customary duty per gallon. It does not say what that reboiler will burn on a particular day, and it will not move when the still is retuned unless the gallons move with it.

## Exercise

Record the duty per gallon for UBIE, the circulation and the regenerator duty. Then take the rich loading of 0.300000 from the table above, record its circulation and duty, and say what part of a real regenerator this figure does not account for.
