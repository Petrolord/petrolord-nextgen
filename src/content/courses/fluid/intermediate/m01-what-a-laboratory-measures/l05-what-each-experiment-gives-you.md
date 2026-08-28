# What each experiment gives you

Four experiments, and a table of who owns which number.

## The map

| quantity | from | notes |
|---|---|---|
| composition | compositional analysis | to a C7+ or heavier fraction |
| bubble point | constant composition expansion | the least ambiguous number in the report |
| undersaturated compressibility | constant composition expansion | from the slope of relative volume |
| liquid dropout | constant composition expansion | condensates only |
| Bod, Rsd through depletion | differential liberation | referenced to residual oil, NOT usable directly |
| liberated gas z and gravity | differential liberation | per increment |
| total gas-oil ratio | separator test | depends on separator conditions |
| stock tank gravity | separator test | the number the oil is sold on |
| Bofb | separator test | the level the differential curve is anchored to |
| Bo, Rs for reservoir engineering | differential PLUS separator, combined | a modelling choice, not a measurement |

The last row is the one to hold onto. The two properties a reservoir engineer uses most are not measured by any single experiment. They are constructed from two of them by a stated rule.

## The division of labour

**Shape comes from the differential liberation.** How Bo and Rs vary with pressure through depletion.

**Level comes from the separator test.** What the values are at the bubble point, per stock tank barrel.

**The anchor is the bubble point.** Both experiments report a value there and the correction makes them agree there exactly.

That structure is worth being able to state, because it explains why a report with a differential liberation and no separator test is incomplete, and why a report with several separator tests at different pressures gives several different Bo curves from the same differential data.

## What no experiment gives

**Relative permeability, capillary pressure, wettability.** A different laboratory. The SCAL course.

**Sample representativeness.** A study describes the sample it was given.

**Areal or vertical variation.** One sample, one point.

**Reservoir temperature.** Measured downhole, and the study is run at whatever temperature it is told.

## Reading a report you did not commission

Three questions, in order.

**How was the sample taken, and was the well flowing above its bubble point?** A sample from a well producing below its bubble point has already lost gas and its bubble point reads low.

**Which separator conditions does the reported Bo correspond to?** If the report has three separator tests and the summary table quotes one Bo, find out which.

**Has the differential data been corrected, and by which rule?** A table labelled Bo that came straight from the differential column is several percent high.

Those three take a few minutes and they catch most of what goes wrong when a study is read by somebody who was not there.

## Where the engine sits

The engine carries an equation of state that can simulate all of these experiments: a constant composition expansion, a differential liberation, a separator train, and the Amyx composite that combines them into a black-oil table.

That is the Expert tier's material. What matters here is that simulating an experiment and measuring it are different acts, and a model that reproduces a measured experiment has earned something a model that has only been run has not.

## The misconception to avoid

"A PVT report contains the fluid properties." It contains measurements of specified experiments. The properties a reservoir model wants are constructed from those measurements by rules that involve choices, and two competent engineers can produce slightly different Bo tables from the same report. Knowing which choices were made is the difference between using a report and quoting it.

## Exercise

First, reproduce the map above from memory, at least for the bubble point, Rsd, total gas-oil ratio and Bo.

Second, a report gives you a differential liberation table and three separator tests at different pressures. Say how many different Bo curves you could legitimately construct and what would have to accompany each one.
