# Formation water

The phase everybody forgets, and it is in every pore in the reservoir.

## Why it is in the description

Connate water is present everywhere, at the connate saturation, even in the best oil zone. Below the contact the reservoir is all water. In a waterflood, injected water is the displacing phase.

So a black-oil description needs a water formation volume factor and a water viscosity, and it needs them whether or not the field produces water.

## Water formation volume factor

Bw is the volume one stock tank barrel of water occupies at reservoir conditions, and it is close to one, typically between 1.00 and 1.06.

Two effects, and they oppose each other. Temperature expands it, pressure compresses it. Reservoir temperature usually wins, so Bw is slightly above one.

The engine uses McCain (1990), which takes pressure and temperature and returns Bw. Salinity is handled implicitly, through a pure water baseline, because the salinity correction is small.

## Water viscosity

Around 0.3 to 0.5 cp at reservoir temperature, and it falls with temperature like any liquid.

Salinity RAISES it, appreciably: brine at 100000 ppm is noticeably more viscous than fresh water at the same temperature. The engine's McCain viscosity takes a salinity in parts per million for exactly that reason.

## Why the small numbers still matter

**Mobility ratio.** The waterflood mobility ratio is water mobility over oil mobility, and water viscosity is in the numerator's denominator. It is one of the two viscosities that decide whether a flood is favourable.

**Voidage.** The waterflood ledger multiplies produced water by Bw and injected water by its own factor. Six percent of Bw on a field producing more water than oil is not a rounding difference.

**Compressibility.** Total system compressibility in a material balance includes the connate water and the rock. Water compressibility is small and the water volume is large, and the product is not negligible in an undersaturated reservoir where the oil compressibility is the only other term.

That last one is the one people miss. Above the bubble point, water and rock expansion can be a serious fraction of the drive.

## The comparison worth making

| phase | Bo or Bw | viscosity |
|---|---|---|
| oil, designed | 1.2 rb/stb | 1.8 cp |
| gas at initial pressure | 0.00086 rb/scf | 0.022 cp |
| water | near 1.03 rb/stb | around 0.4 cp |

Three phases, three orders of magnitude in the volume factors and two in the viscosities. Any calculation that mixes them without care about units will produce something that looks plausible and is wrong by a factor of a thousand.

## What the engine does and does not carry

It carries McCain for Bw and water viscosity, and that is the only water option, which the correlation-choice structure makes explicit: the water field can only be `mccain`.

That is honest. There is not the same spread of published water correlations that there is for oil, because water is far more predictable, and offering a choice where there is not one would imply an uncertainty that does not exist.

## The misconception to avoid

"Water properties are near enough constant so they can be hard coded." Bw between 1.00 and 1.06 is a six percent range, and water viscosity roughly halves between 100 F and 250 F. Both are small compared with what the oil does and neither is constant, and in a waterflood the water is the phase you are managing.

## Exercise

First, name the two effects that decide Bw and say which one usually wins in a reservoir.

Second, explain in two sentences why formation water matters to an undersaturated material balance even on a field that has never produced a barrel of water.
