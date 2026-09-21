# Effects before frequencies

{{panel:cq-release}}

A consequence model starts from one assumption: the release has happened. A flange has parted, a line has been holed, a tank has spilled into its bund. From there the model asks physical questions and answers them in physical units. How many kilograms per second leave the hole, and how much gas reaches a point downwind? This course follows that chain through one engine, and this tier owns its first question: how much gets out, and where does it go.

## What the engine turns into numbers

The engine has five sections: source terms, dispersion, fires, explosions and probits. In its own words it turns a loss of containment into physical effects: how much gets out, where it goes, what a fire radiates, what a blast does and what fraction of the people exposed a probit says would be harmed. The Associate tier works in the first two sections, through these functions:

| function | engine section | what it returns |
| --- | --- | --- |
| `liquidOrificeDischarge` | source terms | the liquid mass rate through a hole |
| `gasOrificeDischarge` | source terms | the gas mass rate through a hole, choked or subsonic |
| `poolFromSpill` | source terms | the pool area, depth and equivalent diameter of a spill |
| `poolEvaporationMackayMatsugu` | source terms | the evaporation rate of a pool below its boiling point |
| `briggsRuralSigmas` | dispersion | the Briggs rural sigma_y and sigma_z for a Pasquill-Gifford class |
| `gaussianPlume` | dispersion | the concentration of a continuous plume at a receptor |
| `plumeDistanceToConcentration` | dispersion | the distances at which the centreline concentration meets a target |
| `ppmToMgM3` | dispersion | a concentration in ppm converted to mg/m3 |
| `mgM3ToPpm` | dispersion | a concentration in mg/m3 converted to ppm |

The fire, blast and probit functions belong to the later tiers, and they build on the mass rates and concentrations you learn to compute here.

## Effects, and never frequencies

This is the first declared choice, and the engine keeps it everywhere. Nothing it returns is a frequency, and nothing it returns is a risk. A mass rate of 19.354651 kg/s out of a crude line says what happens if that hole opens. It says nothing about how often such a hole opens, and the engine makes no claim to know.

An engine could instead multiply each effect by a frequency and hand back one ranked figure. Keeping the two apart means every figure this tier produces traces back to a model, a source and a set of inputs that a reviewer can read.

## Where the neighbouring subjects live

Some tools sit close to consequence modelling and belong to other courses of the academy. This engine carries none of them.

- **Point source heat radiation and setbacks.** The facilities engines carry a point source model and the setbacks it implies. The Facilities courses on relief and flare systems and on layout teach and grade them.
- **Frequencies and risk.** How often a release occurs, and the individual risk, the potential loss of life and the F-N curve that follow from it, belong to the later quantitative risk course.
- **Risk matrices.** The academy's risk matrices belong to the risk and change course.
- **Routine releases.** Emissions, produced water and tank vapour losses are other courses' subjects. This course models an accidental release and nothing routine.

## Exercise

Open the release explorer on the view for liquid and gas through a hole, and run the AMENAM crude line as it loads. Write down every quantity the engine returns for the liquid. Then write two sentences. In the first, say which of those quantities a dispersion calculation downstream would take as its input. In the second, say what further piece of information, which this engine never asks for, a quantitative risk study would need before it could use the same result.
