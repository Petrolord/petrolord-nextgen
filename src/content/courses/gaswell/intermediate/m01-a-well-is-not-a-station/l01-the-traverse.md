# The traverse

A gas well drowns from the bottom, and every number that says otherwise was read at the top. A traverse is the list of places you are allowed to read.

{{panel:pd-profile-explorer}}

## Six stations, and every one of them is an input

Teaching well EBOCHA-5 is a 7500.0 ft gas well on 3.548 in tubing, flow area 0.0686585475 ft2, gas gravity 0.620, making 3100.0 Mscf/d against a produced brine at 62.0 dyne/cm and 66.2 lbm/ft3. It is a teaching well, not a published case and not a real one.

| Depth, ft | Pressure, psia | Temperature, degF | z | Gas density, lbm/ft3 |
| --- | --- | --- | --- | --- |
| 0.0 | 880.0 | 112.00 | 0.9023320453 | 2.8547437868 |
| 1500.0 | 978.0 | 128.40 | 0.9038126330 | 3.0791274829 |
| 3000.0 | 1090.0 | 144.80 | 0.9054332182 | 3.3326643060 |
| 4500.0 | 1218.0 | 161.20 | 0.9073899041 | 3.6178363439 |
| 6000.0 | 1350.0 | 177.60 | 0.9105334387 | 3.8932352069 |
| 7500.0 | 1500.0 | 194.00 | 0.9142643742 | 4.2000760651 |

Each row is a station: a pressure, a temperature, a compressibility factor from Sutton and DAK, and a diameter. `loadingProfile` consumes that list. It does not build it.

## The engine solves no gradient

The traverse is passed in. `loadingProfile` does not solve multiphase flow and does not invent a gradient between two stations. Hand it a survey that is wrong at the shoe and it returns six confident ratios computed from the wrong number, because a station is an input and the module has no way to disagree with one.

## The gauge and the shoe are not the same well

The operator reads 880.0 psia at surface. The liquid at the bottom of the string sits at 1500.0 psia, a pressure ratio of 1.70454545. Gas density follows: 2.8547437868 lbm/ft3 at the gauge against 4.2000760651 lbm/ft3 at the shoe.

A denser gas carries a droplet less well, because the velocity needed to lift one falls with one over the square root of the gas density. The station that reads best is the station furthest from the liquid.

## The mistake

Treating the six stations as six views of one condition, so any one of them can stand for the well. They are six different conditions, and the wellhead is simply the one an operator can reach with a gauge.

## What it refuses

An empty traverse is refused rather than treated as a passing well: `ok = false`, message "The loading profile needs at least one station from the flowing traverse." An unknown correlation is refused rather than silently treated as Turner: "Unknown loading correlation \"guess\". Use turner or coleman."

Six stations at 1500.0 ft spacing is a refusal of sorts too. Nothing between 6000.0 ft and 7500.0 ft exists as far as this profile is concerned.

## Exercise

Read EBOCHA-5 in the panel and write down the gas density at 0.0 ft and at 7500.0 ft.

Then say in one sentence why the deeper of the two is the harder place to lift a droplet.
