# What power does not include

Polished rod horsepower is the power at the polished rod. What a lease operator pays for is measured at the meter, and everything between the two is outside this engine.

{{panel:pd-card-explorer}}

## Where the number is taken

ODUMA-4 at the shipped defaults returns 18.955924637 hp: the rate at which the polished rod does work on the rod string, computed from the card area and the speed and nothing else.

Walk from there back towards the supply and you pass the beam, the gearbox, the belts, the motor and the motor's power factor. Not one of those is an input to the design or contributes a single in-lb to the card area, and the engine's own statement of what it does not model names gearbox and belt and motor losses in one breath.

## The counterbalance is outside it too

A unit gives energy back on the downstroke through its counterweight, and that is real work nobody has to buy. It is not in this number: the design returns a torqueGroup of 0.000000000 when no balance is passed to it.

So 18.955924637 hp is neither an upper nor a lower bound on the meter. Losses push a meter reading up, counterbalance work pushes it down, and the engine supplies neither correction.

## The asymmetry worth noticing

This engine refuses loudly when it can. It refuses a damping ratio of 0, refuses a design at or above its string's own note with a message that names the number, refuses a plunger with no differential to lift against, and refuses a pumping speed of zero. Its warning codes run taperStepsUp, timestep, notPeriodic, rodOverstressed, structuralOverload, torqueOverload, strokeOverload and incompleteFillage.

Nothing on either list is about power. No motor check, no efficiency warning, no refusal for a horsepower a prime mover could not deliver, because the engine has no opinion beyond the polished rod.

## The mistake

Ordering a motor off 18.955924637 hp, or reading a meter, finding it disagrees, and calling that an error in the engine. Neither number is wrong. They are measured at two points with a gearbox, a set of belts and a motor between them.

The same mistake in another dress is quoting 0.059879964 hp per bbl/d as an energy cost per barrel. It is a polished rod figure, and a power bill is not.

## What it refuses

It refuses to be an electrical quantity at all. No voltage, no current, no power factor. It is a mechanical rate of work at one named point, and it is honest precisely because it claims nothing beyond that point.

## Exercise

Write the ODUMA-4 polished rod horsepower from the panel, then list every component between that point and the meter.

Beside each, write whether the engine models it, warns about it, or is silent.
