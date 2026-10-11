# What Rock Physics hands to QI

Rock physics turns logs into elastic properties at the wells, and QI takes those properties to the seismic. Four things cross that hand-off: the elastic logs (Vp, Vs and density), the fluids at reservoir conditions, the substitution of one pore fluid for another, and the reflection coefficients they imply. This module handles the first at the Ekene wells; the next module handles the fluids and the substitution; the last module turns them into reflection coefficients at the top of the Ekene Sand.

## The logs that arrive

The pack's Vp, Vs and density come from the DT, DTS and RHOB logs: Vp = 304800 / DT, Vs = 304800 / DTS and density = RHOB x 1000. Velocities arrive in metres per second and density in kilograms per cubic metre, and every engine works in SI from here on. Beside them sit GR and the kit's PHIT, VSH and SW, the interpretation the kit was built from, sampled at the log depths. A study that brings its own petrophysics states it.

## The hand-offs and their engines

| hand-off | engine file | functions | method |
| --- | --- | --- | --- |
| elastic logs | elasticSet.js, vsEstimate.js | `elasticPoint`, `fitVsRegression`, `predictVs`, `gcSandShaleVs` | Greenberg and Castagna (1992); Goodway, Chen and Downton (1997) |
| fluids | fluids.js | `brine`, `liveOil`, `apiToRho0`, `woodMix` | Batzle and Wang (1992); Wood (1955) |
| substitution | minerals.js, gassmann.js | `mixMinerals`, `substituteVels` | Voigt, Reuss and Hill (Hill 1952); Gassmann (1951) |
| reflection coefficients | avoTrend.js, avo.js | `interfacePoints`, `fitFluidLine`, `zoeppritzRpp`, `shuey`, `avoClass` | Castagna, Swan and Foster (1998); Shuey (1985); Rutherford and Williams (1989) |

The Rock Physics course teaches Batzle-Wang, Gassmann, Greenberg-Castagna, Shuey and the classes in full. This course recaps each once, in the lesson that uses it, then states the inputs and reads the outputs against the two questions.

## What the engines leave to the study

The engines hold no Ekene figure. Temperature, pressure, salinity, oil gravity, gas-oil ratio, gas gravity, porosity, shale volume, saturation, mineral, block length and cut-off are all inputs the caller states, and the panel marks each control "(stated)". Nor do the engines pick the samples: which samples are net sand, oil leg, water leg and cap rock is a selection a study names before any function is called.

| selection | rule the course states | samples at Ekene-1 |
| --- | --- | --- |
| oil leg | net sand (Vsh at or below 0.350000) inside the Ekene Sand, above the oil-water contact at 5118.110236 ft | 65 |
| water leg | net sand inside the Ekene Sand, at or below the contact | 103 |
| cap rock | the 65 ft of log above the top of the Ekene Sand | 130 |

The conditions at the Ekene Sand are stated with the kit: 180 degF, 3200 psia, brine salinity 0.035000, oil 32 API, gas-oil ratio 400 scf/stb and gas gravity 0.750000. Change the cut-off and the oil and water legs change size; the cap rock is a thickness, so it moves only with its own control.

## A result, and a refusal

`elasticPoint` given a Vs above its Vp does not throw. It returns every field as NaN, AI (acoustic impedance) and Vp/Vs included, and the panel shows the gap. That is a result with empty fields, and a study reads it as a data problem at that sample. A fit with too few measured pairs is different: the engine refuses, and the panel prints its message unchanged.

> Need at least 5 samples with measured Vp and Vs (got 3).

The first case flags bad data and carries on; the second stops because no answer exists. A feasibility study needs to tell the two apart before it trusts a layer mean or a trend.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "Data inventory" and Data to "Ekene pack: Ekene-1". Read the top, base and oil-water contact tiles and the three sample counts at the Ekene settings. Then set View to "The elastic set" and change "Net sand Vsh cut-off (stated)" up and down from 0.350000. Watch the samples column, and say which layer's count stays fixed and why. Repeat on Ekene-3, then restore 0.350000.
