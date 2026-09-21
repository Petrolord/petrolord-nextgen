# What escapes is counted as methane

{{panel:carbon-inventory-explorer}}

## The engine's assumption

When a destruction efficiency is below 1, some of the carbon that went into the flame did not burn. The atom balance has to say what that carbon left as, and the engine states its answer in a note, quoted here verbatim:

"Carbon that escaped combustion is counted as methane, which is the usual and conservative assumption, and not as CO2. Use the fossil methane potential for it. Override it if you have measured otherwise."

The note names the assumption and calls it the usual and conservative one. It names the potential to convert the methane with, the fossil methane potential. And it says that a measurement overrides it.

## The Igbogene flare's methane

At the operator's stated destruction efficiency of 0.98, an invented figure, the Igbogene flare returns 16.306 t of methane. That is tonnes of methane, weighed at MW_CH4. In the inventory it becomes its own line:

| line | scope | gas | activity | unit | GWP | tonnes of gas | tCO2e | source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Flaring (unburned CH4) | 1 | CH4 | 16.306 | t CH4 | 29.8 | 16.306 | 485.922 | Atom balance (conservation of mass) |

The 16.306 t of methane is converted at 29.8, the CH4 value of the course's set, "IPCC AR6 GWP100, fossil methane", and the line reports 485.922 tCO2e. The two numbers are different quantities: 16.306 is tonnes of methane and 485.922 is tonnes of CO2 equivalent.

## How much of the flare it is

At 0.98 the methane line is 485.922 tCO2e of the flare's 2677.729 tCO2e, a share of 0.181468. That share is the course's arithmetic on the engine's figures. The rest of the flare is its CO2 line, 2191.807 tCO2e.

## Why the fossil value

The GWP set carries a methane note of its own, and it explains the choice of potential. Part of it reads: "The atom balance here counts carbon that escapes a burner or a flare as methane and NOT as CO2, so the oxidation CO2 is counted nowhere else and the fossil value is the consistent one for vented, fugitive and unburned fossil methane alike." That is why the course computes every inventory on the fossil methane set.

## A held item

This assumption is held by the course. Every carbon atom that escapes is counted as methane, and the course states it as the engine's stated and conservative assumption. A method that uses the gas's own methane content is a different method, and choosing it is the owner's decision. The course teaches the assumption as the assumption it is and grades nothing that depends on changing it.

In practice, a flare's unburned gas contains other hydrocarbons besides methane, and a measured composition is what an override would be built on.

Open the panel and set the flare's efficiency. The methane line in tonnes of methane and the same line in tCO2e are shown side by side.

## Exercise

Read the flare's methane line at 0.98: 16.306 t of methane, a GWP of 29.8 and 485.922 tCO2e, and the share of 0.181468. Say what the relationship between the tonnes of methane and the tCO2e shows, and what the share shows about the flare line.

Self check: 16.306 t is methane and 485.922 tCO2e is the same methane converted at 29.8 on "IPCC AR6 GWP100, fossil methane", so the two figures are different units of one line. At 0.98 that line is 485.922 tCO2e of the flare's 2677.729 tCO2e, a share of 0.181468, and the rest is the CO2 line of 2191.807 tCO2e.
