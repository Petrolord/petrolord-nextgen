# Choked and subsonic

{{panel:cq-release}}

Gas leaving a hole behaves differently from a liquid, because a gas expands as its pressure falls. At modest upstream pressures the flow through the hole speeds up as the pressure rises, and the ambient air outside still influences how much leaves. Past a certain pressure the gas in the hole reaches the speed of sound. From then on the air outside cannot reach back into the hole, and the flow is called choked. The engine decides which regime applies before it computes anything else.

## The model, in the engine's words

The basis of `gasOrificeDischarge` reads, verbatim: "ideal gas outflow through a hole, choked when Pa/P0 <= (2/(gamma+1))^(gamma/(gamma-1)) (exactly at the ratio counts as choked), subsonic psi from YB 2.25".

Pa over P0 is ambient over upstream, both absolute. The right hand side is the critical pressure ratio, set by the heat capacity ratio gamma alone. When the ratio of ambient to upstream is at or below the critical value the flow is choked. Above it the flow is subsonic, and a subsonic outflow coefficient called psi scales the rate down.

## The AMENAM gas line

AMENAM GAS is a methane line, a stated teaching input: discharge coefficient 0.62, hole 0.025 m, 300 K, molar mass 0.01604 kg/mol, heat capacity ratio 1.31. Sweeping the upstream pressure:

| upstream Pa, stated | Pa over P0 | regime | outflow coefficient psi | upstream density kg/m3 | mass rate kg/s |
| --- | --- | --- | --- | --- | --- |
| 120000 | 0.844375 | SUBSONIC | 0.756455 | 0.771667 | 0.046872 |
| 150000 | 0.675500 | SUBSONIC | 0.958958 | 0.964584 | 0.074275 |
| 180000 | 0.562917 | SUBSONIC | 0.999177 | 1.157501 | 0.092868 |
| 250000 | 0.405300 | CHOKED | 1.000000 | 1.607640 | 0.129090 |
| 500000 | 0.202650 | CHOKED | 1.000000 | 3.215281 | 0.258180 |
| 2000000 | 0.050662 | CHOKED | 1.000000 | 12.861124 | 1.032722 |
| 10000000 | 0.010132 | CHOKED | 1.000000 | 64.305619 | 5.163609 |

The critical pressure ratio for this gas is 0.543927. The first three rows sit above it and are subsonic. From 250000 Pa upward the ratio is below it and every row is choked, with psi held at one.

## What the two regimes mean for a study

Most high pressure releases on a process plant are choked. A line at a few bar absolute already puts ambient below the critical fraction of its pressure, as the table shows from 250000 Pa. Subsonic flow belongs to low pressure systems: a vent header, a tank blanket, a line near atmospheric. The regime matters because it tells you which inputs the answer is sensitive to. In the choked rows the ambient pressure has dropped out of the calculation entirely. Read the density column too. It climbs in step with the upstream pressure, because the gas is ideal and held at one temperature, and a later lesson in this module shows the choked mass rate climbing with it.

## When nothing flows out

As with the liquid, the gas function refuses a case with no driving pressure:

> upstreamPressurePa: must exceed the ambient pressure, or nothing flows out

It also refuses a gas that cannot expand in the way the model assumes:

> heatCapacityRatio: gamma = Cp/Cv must be above 1

## Exercise

Open the outflow view with the AMENAM gas defaults. Set the upstream pressure to 180000 Pa and read the regime, the ratio and psi; then set it to 250000 Pa and read them again. Compare both readings with the ladder above, and write one sentence naming the pressure band in which the regime changes and the panel figure that tells you where inside that band it falls.
