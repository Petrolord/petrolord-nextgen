# A study is a set of experiments

A reservoir fluid study is not one measurement. It is four or five distinct experiments, each answering a different question, and reading a report means knowing which experiment produced which number.

## What arrives

A PVT report is typically twenty to forty pages containing:

**A compositional analysis.** What the fluid is made of, component by component, to a heavy fraction.

**A constant composition expansion.** The fluid expanded at reservoir temperature with nothing removed.

**A differential liberation.** The fluid depleted stepwise with the liberated gas removed at each step.

**Separator tests.** The fluid taken from reservoir conditions to a stock tank through one or more separator stages, usually at several separator pressures.

**Viscosity measurements**, sometimes, and often on a coarser pressure grid than the volumetric work.

Each is a different physical process and they do not measure the same thing.

## Why more than one

Because the reservoir does one thing and the surface does another, and a single experiment cannot represent both.

In the reservoir, gas that comes out of solution moves away from the oil it left. The oil at any moment is in contact with less gas than it started with, and the composition of the remaining liquid changes. That is a differential process, and the differential liberation is built to imitate it.

At the surface, the whole stream goes through a separator together, and the gas and liquid leave in equilibrium at the separator's conditions. That is a flash process, and the separator test measures it.

Neither one on its own describes the journey from reservoir to tank, which is why the report has both and why combining them correctly is a real step rather than a formality.

## The one that people quote

The differential liberation, usually, because it is the biggest table in the report and it is labelled with things that look like the properties a simulator wants: Bod, Rsd, gas z, gas gravity.

The trap is that those are DIFFERENTIAL properties, referenced to a residual oil at 60 F rather than to a stock tank barrel produced through a separator train. They are not the Bo and Rs a reservoir engineer wants, and using them directly overstates the formation volume factor and the solution gas ratio.

Converting them requires the separator test, and that conversion is the subject of a later lesson in this module.

## What a study cannot tell you

**Whether the sample is representative.** A sample taken from a well producing below its bubble point has lost gas before it was collected, and its bubble point will read low. The report describes the sample it was given.

**How the fluid varies across the field.** One sample is one point. Compositional grading with depth is real and common, and a single study cannot see it.

**Anything about the rock.** PVT is fluid only. Relative permeability, capillary pressure and wettability are a different laboratory and a different report, which the SCAL course covered.

## Reading order

Start at the composition, because everything else is behaviour of that mixture. Then the constant composition expansion for the bubble point. Then the separator tests, because they define what a stock tank barrel is for this fluid. Then the differential liberation, which only means anything once you know what it will be referenced to.

That is the reverse of the order most reports print them in.

## The misconception to avoid

"The laboratory measured Bo, so the number in the report is Bo." The laboratory measured volumes in a cell under a stated procedure. Turning those into the Bo a reservoir engineer uses takes the separator test and an explicit combination, and a report's differential column is not that number. Whoever converts it is making a modelling choice.

## Exercise

First, list the four experiments a reservoir fluid study normally contains and say in one sentence what each one is for.

Second, explain in two sentences why a differential liberation and a separator test are both needed rather than either one alone.
