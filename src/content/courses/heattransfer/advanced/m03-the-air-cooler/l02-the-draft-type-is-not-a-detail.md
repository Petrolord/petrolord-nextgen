# The draft type is not a detail

A forced-draft fan sits below the bundle and handles ambient air. An induced-draft fan sits above it and handles the heated air leaving. Those are two different densities, so they are two different volumes, so they are two different fan powers, and the choice is an input this module refuses to make for you.

{{panel:fc-rating-explorer}}

## The same bay, twice

| draft type | fan inlet, degF | air density, lb per ft3 | actual ft3 a minute | fan brake horsepower | motor horsepower |
| --- | --- | --- | --- | --- | --- |
| forced | 95.000000 | 0.071524401 | 647279.7513 | 94.003933 | 102.178189 |
| induced | 125.000000 | 0.067854412 | 682288.6620 | 99.088250 | 107.704620 |

Nothing about the bundle changed between those two rows. The duty, the surface, the air mass and the log mean are the same machine. What moved is the temperature the fan draws at, which is the ambient in one case and the air outlet in the other, and a fan moves volume rather than mass.

The gap on this bay is a fan power ratio of 1.054086, taking the induced figure over the forced one. That ratio is computed rather than estimated, and it is the only comparison between the two rows this module stands behind.

## Why the engine reports the inlet temperature

The answer carries the fan inlet temperature back with it, beside the draft type it was given. That is what makes the horsepower attributable. Two sheets showing 94.003933 and 99.088250 for the same bay are not in conflict if each one says which machine it belongs to, and they are impossible to reconcile if neither does.

The density is on the answer as well, at 0.071524401 and 0.067854412 lb per ft3. Between them the inlet temperature and the density make the volume checkable by hand, which is the difference between a horsepower a reviewer can audit and one that has to be taken on trust.

## The state it will not guess

- REFUSED, a draft type of balanced: the draft type must be 'forced' or 'induced'; it was "balanced". The fan inlet density depends on it and the two differ by about 5 percent on fan power, so this module will not pick one for you.

Read the second sentence of that message. The refusal states the size of the thing it is declining to assume, which is what separates a refusal from an obstruction. A default here would have answered a question the caller never asked.

## Where the machine work stops

The fan on this bay is one line of arithmetic: a volume, a static pressure and two efficiencies. Fans, pumps and compressors as machines belong to the Rotating Equipment course, and this module does not attempt them. It reports a brake horsepower and a motor horsepower, states the efficiencies it used, and stops there.

That boundary is worth noticing because the fan chain is the part of an air cooler a reader is most tempted to tune. The efficiencies this module carries by default name no machine at all, which is the subject of the audit module in this tier. A study that cares about its fan power states its own, rather than letting a number with no machine behind it decide a horsepower.

## Exercise

Record both rows of the table with the fan inlet temperature each one draws at. Record the fan power ratio and say which figure was divided by which. Then say what a sheet reporting only a brake horsepower leaves a reviewer unable to check, and which two fields would settle it.
