# A set carries its report

{{panel:carbon-inventory-explorer}}

## The engine ships no GWP

A global warming potential, a GWP, is what converts a methane line into tCO2e, and carbonAbatement ships none. makeGwpSet takes a label and values from the caller and builds a set from them, and the set is what every methane line is converted with.

The course types four sets in. They are IPCC 100-year (GWP100) values as tabulated in GHG Protocol, "IPCC Global Warming Potential Values", version 2.0, 7 August 2024, adapted from IPCC AR6 WG1 chapter 7 (section 7.6.1.1) and IPCC AR5 WG1 chapter 8:

| set | report | horizon | CH4 | N2O | declared by the engine |
| --- | --- | --- | --- | --- | --- |
| IPCC AR6 GWP100, fossil methane | AR6 | 100-year (GWP100) | 29.8 | 273 | true |
| IPCC AR6 GWP100, non-fossil methane | AR6 | 100-year (GWP100) | 27 | 273 | true |
| IPCC AR5 GWP100, fossil methane | AR5 | 100-year (GWP100) | 30 | 265 | true |
| IPCC AR5 GWP100, non-fossil methane | AR5 | 100-year (GWP100) | 28 | 265 | true |

Every set's label names its report, its horizon and which methane value it holds. The engine's note on every set says why the label matters, verbatim:

"Global warming potentials differ between IPCC assessment reports. An inventory on one report is not comparable with one on another, so the set is stated on every result."

## Stated on every result

The inventory carries the set's label as gwpSetLabel. The complete Igbogene inventory reports gwpSetLabel: IPCC AR6 GWP100, fossil methane. An intensity built from it carries the set too, in its comparability note: "Comparable only with an intensity on the same boundary (Igbogene flow station and gas plant, inlet to export) and the same global warming potential set (IPCC AR6 GWP100, fossil methane)."

The digest puts the rule in one line: an inventory on one set is not comparable with one on another.

## A set is declared or it is not

A set counts as declared only with a label and at least one value:

| call | declared |
| --- | --- |
| values given, no label | false |
| label given, no values | false |
| label and values (IPCC AR6 GWP100, fossil methane) | true |

Values with no label are not declared. A label with no values is not declared either. And the empty call, makeGwpSet({}), returns a set labelled none, with 0 gases, declared false.

An undeclared set stops the methane. In the Igbogene first pass, with no set declared, the vented methane line is blocked and named: "blocked: no global warming potential for CH4 in the declared set".

## The course's set

Every inventory in this course is computed on "IPCC AR6 GWP100, fossil methane", CH4 29.8 and N2O 273. Every lesson that converts methane names it. The other three sets are printed beside it, and the digest rebuilds the Igbogene inventory on each.

In practice, GWP values are revised between IPCC assessment reports, so the same tonne of methane has more than one published potential.

Open the panel and look at the set selector. Each of the four sets is shown with its report, its horizon and its source line.

## Exercise

Read the three rows of the declared table. Say what the relationship between a label and its values shows about what the engine needs before it will convert any methane.

Self check: values with no label are declared false, and a label with no values is declared false. Only a label with values, such as "IPCC AR6 GWP100, fossil methane", is declared true. The engine needs both before a set can convert methane, and with no set declared the Igbogene vented methane line is blocked for want of a GWP for CH4.
