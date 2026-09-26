# Stated readings and engine approximations

{{panel:pia-ledger-calculator}}

A fiscal outcome is only as sound as the choices under it. Some of those choices are the reader's, because the texts leave a question open. Others are the engine's, because a project model cannot see what the texts need. This lesson lists both kinds and shows where each is written down.

## The three open readings

The texts leave three questions open, and the engine takes each as a stated setting. The course teaches each as an open question and grades none.

| open reading | the setting | the engine's default |
| --- | --- | --- |
| the royalty by price base year | pia_price_royalty_base: "regulations_2021" or "act_2020" | the Regulations, stated in a note |
| the hydrocarbon tax rate of a new lease onshore or in shallow water | pia_new_pml_hct_rate_pct: 15 or 30 | none; a run without it is refused |
| the deep offshore hydrocarbon tax under the Nigeria Tax Act 2025 | pia_deep_offshore_hct_interpretation | none; a run without it is refused |

A figure that depends on one of them is quoted with its setting, and a stated reading is never presented as the law.

## The engine's declared choices

Five choices are the engine's own. Each is stated wherever it applies.

**The daily rate.** The tranches read a year's crude oil plus condensate over its calendar days. The engine's note says how that differs from the Regulations:

> Royalty tranches read the year's crude oil plus condensate divided by the calendar days of the year; the Regulations (r.12(2)) divide each month's production by the days oil was produced in that month.

**Shared costs** enter the hydrocarbon tax at the crude-plus-condensate share of gross revenue, because the engine cannot tell associated from non-associated gas.

**The realised price stands in for the fiscal price:**

> The realised oil and condensate prices stand in for the Commission's fiscal prices (PIA Seventh Schedule para 8), so the additional tax at the fiscal price (PIA s.268; NTA s.73) is not computed.

**The framework is read year by year**, 2026 onward under the Nigeria Tax Act 2025.

**Every figure is at field level first**, then every money line is scaled to the working interest.

## Values that rest on secondary sources

Two values could not be read from a primary text and are said to rest on secondary ones: the tertiary education tax of 2.5 percent before 2023, and the NDDC levy base of the total annual budget, which the engine takes as the year's opex plus capex. The engine also applies the two thirds restriction to years before 1 May 2023, whose wording was not read, and says so in its note on the restriction.

## Approximations that are switched on by the user

The minimum effective tax rate top-up is off by default and labelled as a project-level approximation of NTA s.57 when it is on. A stated tertiary education tax rate that differs from the statute is used and named in its own note.

## A checklist

Before quoting a figure from a PIA ledger, walk this list: the open readings the run states, the declared choices that touch the line, and any secondary source under it.

## Exercise

Open the ledger calculator on "The engine notes" and match each note to a heading of this lesson. Then open "One case under every stated reading", load ekene_alpha_shallow_converted_nta and read the rows: say which rows change Alpha's figures, which refuse or leave them where they were, and why. Finally open "The whole ledger, year by year" with the same case and list every note printed under it.
