# What well logs measure

When a well is drilled, the rock it penetrates is mostly invisible. Cores are expensive and recover only short intervals, and cuttings arrive at surface mixed and delayed. Well logs are the answer the industry settled on decades ago: instruments lowered into the borehole on a wireline cable, or built into the drillstring itself (logging while drilling, LWD), that record physical measurements continuously against depth. Almost everything we know about a reservoir between core points comes from these curves.

## Physics proxies, and why we need them

No tool measures "porosity" or "shale content" directly. Each tool measures a physical response of the formation, and petrophysics is the discipline of converting those responses into the rock and fluid properties we actually want. The three measurements this course leans on are:

- **Natural gamma radioactivity.** Clay minerals concentrate potassium, thorium and uranium, so shales emit more natural gamma radiation than clean sands. The gamma ray (GR) tool counts this radiation, reported in API units. High GR suggests shale; low GR suggests clean sand or carbonate.
- **Bulk density.** The density tool presses a radioactive source against the borehole wall and counts gamma rays scattered back from the formation. The count rate depends on electron density, which tracks bulk density $\rho_b$ in g/cc. A rock full of fluid-filled pore space is lighter than solid mineral, so density carries porosity information.
- **Electrical resistivity.** Rock grains and hydrocarbons are electrical insulators. Salty formation water conducts. A resistivity tool induces or injects current and measures how strongly the formation resists it, in ohm.m. High resistivity in a porous rock hints that something other than salt water fills the pores.

Together GR, density and resistivity form the classic **triple combo**, the minimum logging suite for a standard evaluation. Neutron porosity and sonic travel time usually ride along and appear at the higher tiers of this course.

## What a log looks like

A log is a set of curves plotted against depth, with depth increasing downward. Convention puts GR in the left track, resistivity (on a logarithmic scale) in the middle, and porosity-family curves (density, neutron) on the right. Reading a log is pattern recognition against these tracks: a clean sand full of hydrocarbon shows low GR, high resistivity and low bulk density all at the same depth.

A concrete example from the dataset you will use throughout this course: at 2020 m the well reads GR of 20 API, bulk density of 2.3035 g/cc and resistivity of 9.2554 ohm.m. Ten metres higher, at 2000 m in the overlying shale, the same curves read about 120 API, 2.55 g/cc and 2 ohm.m. Even before any calculation, the contrast tells a story: the deeper point is a cleaner, lighter, more resistive rock, exactly the signature of a porous sand that is not full of brine.

## From curves to answers

The deliverables of a basic petrophysical evaluation are a short list:

| Quantity | Symbol | From |
|---|---|---|
| Shale volume | $V_{sh}$ | Gamma ray |
| Porosity | $\phi$ | Density (and neutron, sonic) |
| Water saturation | $S_w$ | Resistivity plus porosity |
| Net pay | $h_{net}$ | Cutoffs applied to all three |

The workflow runs in that order, because each step feeds the next: GR flags the shale, density gives pore volume, resistivity plus porosity give the fraction of that pore volume filled with water, and cutoffs turn sample-by-sample curves into interval sums a reservoir engineer can book. This whole course walks that chain one module at a time on a single teaching well, and the capstone asks you to run it end to end yourself.

Everything you compute in these lessons can also be run interactively in the Petrophysics app in Learning Mode, which drives the same calculation engine over the same dataset. The lessons give you the reasoning; the app lets you turn the knobs.

## Exercise

Without any formulas, use the two depth readings quoted above (2000 m and 2020 m). Write down, for each of the three curves, which of the two depths is more "reservoir like" and why. Then list the three deliverables you would need to compute before you could call the 2020 m rock "pay". Check yourself: the sand should win on all three curves, and the deliverables are shale volume, porosity and water saturation, combined through cutoffs.
