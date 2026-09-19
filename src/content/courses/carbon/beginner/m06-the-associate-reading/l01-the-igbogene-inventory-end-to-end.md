# The Igbogene inventory end to end

{{panel:carbon-inventory-explorer}}

## One record, read in order

This lesson reads the Igbogene inventory from its first input to its last flag. Igbogene is an invented record, a Niger Delta flow station and gas plant, and every flow, factor and destruction efficiency in it is invented for this course. The electricity factor is synthetic.

## The heaters

The fired heaters burn 482000 kmol of fuel a year at 1.09 kmol of carbon per kmol, with a destruction efficiency of 1 typed. The atom balance counts 525380.000 kmol of carbon and returns 23121.448 t of CO2 and 0.000 t of methane. The engine's method needs no factor: "Atom balance: carbon in equals CO2 out. This is conservation of mass, not an empirical factor, so it needs no source document."

## The flare

The flare sends 38500 kmol of gas a year at 1.32 kmol of carbon per kmol. Its destruction efficiency is an input nobody may leave blank, and the operator's flare study states 0.98. At 0.98 the flare returns 2191.807 t of CO2 and 16.306 t of methane. The escaped carbon is counted as methane, the engine's stated and conservative assumption, which the course holds as H3. The methane is converted on "IPCC AR6 GWP100, fossil methane", CH4 29.8, typed in from GHG Protocol's tabulation of the IPCC values. The flare's methane becomes 485.922 tCO2e.

## The lines and the totals

| line | scope | tCO2e | source | version |
| --- | --- | --- | --- | --- |
| Fired heaters (CO2) | 1 | 23121.448 | Atom balance (conservation of mass) | not applicable |
| Flaring (CO2) | 1 | 2191.807 | Atom balance (conservation of mass) | not applicable |
| Flaring (unburned CH4) | 1 | 485.922 | Atom balance (conservation of mass) | not applicable |
| Vented and fugitive methane | 1 | 4231.600 | Epie Creek leak detection survey (invented) | 2026 Q2 |
| Purchased electricity | 2 | 12915.000 | Supplier statement (invented) | 2025 |

| total | tCO2e |
| --- | --- |
| Scope 1 (direct) | 30030.777 |
| Scope 2 (purchased energy) | 12915.000 |
| Total, Scope 1 and Scope 2 | 42945.777 |

The vented line is 142.000 t of methane at 29.8. The electricity line is 31500.000 MWh at Igbogene's invented factor of 0.41 tCO2/MWh. Every line's provenance is complete.

## The flags

The engine returns gwpSetLabel: IPCC AR6 GWP100, fossil methane. computed: true. reportable: true. blocked lines: 0. unsourced lines: 0. The inventory reached that state through five steps, from a first pass of 23121.448 tCO2e, reportable false, to the complete 42945.777 tCO2e, reportable true.

## The inventory's own limit

The engine states the limit of its own record, verbatim: "This is a quantitative inventory, not a regulatory compliance register. Obligations, evidence and deadlines belong in the compliance register, and keeping a second copy of them here would create two records that could disagree."

## The intensity

Over the boundary "Igbogene flow station and gas plant, inlet to export", with an invented denominator of 3650000, the total intensity is 0.01176597 tCO2e per barrel of oil equivalent produced, reportable true, and comparable only on the same boundary and the same GWP set.

Every figure above rests on a typed input and a record of where it came from.

In practice, this is the chain an auditor walks backwards, from the total to each line, each factor and each source.

Walk the panel through the same order: heaters, flare, set, lines, totals, flags, intensity.

## Exercise

Read the flare's two lines and the total. Say what the relationship between the flare's lines and the total shows about how much of the Igbogene inventory rests on the one typed destruction efficiency.

Self check: at the stated 0.98 the flare's lines are 2191.807 tCO2e of CO2 and 485.922 tCO2e of methane, inside a total of 42945.777 tCO2e. The digest prints their shares of the total as 0.051037 and 0.011315. Both lines move with the destruction efficiency, and the engine refuses a blank one because, in its words, for a flare it is the answer, and it is contested.
