# Gamma ray basics

The gamma ray (GR) log is usually the first curve a petrophysicist looks at, and for the whole of this module it is the only input we need. The tool is simple in concept: it counts natural gamma radiation coming from the formation. It does not emit anything into the rock. Everything it records was already there, produced by the slow radioactive decay of three element families that occur naturally in sedimentary rocks: potassium (K-40), thorium and uranium.

## Why shale is radioactive and clean sand is not

Clay minerals are the reason the GR log works as a lithology indicator. Illite and other clays hold potassium in their crystal structure, and the large surface area of clay particles adsorbs thorium and uranium ions from pore water as the sediment is deposited and buried. A shale is mostly clay minerals, so it is rich in all three radioactive families and produces a strong gamma signal.

A clean quartz sandstone is the opposite case. Quartz (SiO2) contains essentially no potassium, thorium or uranium. Whatever radioactivity a clean sand shows comes from trace heavy minerals and from any clay dispersed in the pore system. The cleaner the sand, the lower the count rate.

This contrast gives us the basic reading rule:

* High GR: shale, or a shaly interval.
* Low GR: clean sand (or clean carbonate, as we will see below).
* Intermediate GR: a mixture, a silty or shaly sand.

## API units

Gamma ray logs are reported in API units, a calibration standard defined by the American Petroleum Institute. A special test pit at the University of Houston contains an artificial "shale" whose signal is defined as 200 API, and every logging tool is calibrated so its response is consistent with that standard. API units are therefore comparable between tools and between wells, which is what makes the quantitative work in the next lesson possible.

Typical values you will meet in clastic wells:

| Rock | Typical GR (API) |
| --- | --- |
| Very clean sandstone | 15 to 30 |
| Silty or shaly sandstone | 40 to 80 |
| Shale | 90 to 150 |
| Organic-rich or uranium-bearing shale | 150 and higher |

The exact numbers shift from basin to basin, which is why each well is normalised against its own clean and shale readings rather than against a textbook table.

## Worked example: reading the typewell

The teaching dataset used throughout this course, the typewell, logs a 100 m interval from 2000 to 2100 m. Read its GR curve at two depths:

* At 2000 m, in the shale at the top of the interval, GR reads 120 API. That is squarely in the shale band of the table above.
* At 2020 m, inside the SAND_A reservoir (2010 to 2030 m), GR reads 20 API. That is a very clean sandstone value.

So on this well the full dynamic range of the curve runs from about 20 API in the cleanest sand to about 120 API in the purest shale. Hold on to those two numbers. In the next lesson they become the clean line and the clay line that turn raw API readings into a clay fraction.

## Exceptions worth knowing

The GR log measures radioactivity, and radioactivity is only a proxy for clay. A beginner should know the common cases where the proxy misleads:

* Hot sands. Arkosic sands are rich in potassium feldspar, and micaceous sands carry potassium in mica. Both can read 60 to 100 API while containing very little clay. Treating that signal as clay would wrongly condemn a good reservoir.
* Uranium effects. Uranium is soluble and travels with fluids, so it can concentrate along fractures, in organic-rich layers, or at old water contacts. A thin uranium spike is a geochemical feature and says nothing about clay content. Spectral GR tools, which split the signal into K, Th and U components, are the standard fix; the thorium curve is then the better clay indicator.
* Clean carbonates. Limestones and dolomites usually read very low GR, often below a clean sand. A low GR by itself therefore says "not shale" rather than "sandstone". Lithology still needs the porosity logs from Module 3.

None of these complications appear in the typewell, which is a clean, well-behaved clastic sequence built for teaching. But you should carry the exceptions with you, because real wells are less polite.

## What we do with GR next

Everything downstream of this module treats the GR curve as the raw material for one number per depth sample: the shale volume, written $V_{sh}$. Getting there takes two steps, normalising GR into an index between 0 and 1 (next lesson), then converting that index into a volume fraction with a transform (lesson 3). By the end of the module you will compute both by hand and check them against the typewell.

## Exercise

Using the table of typical values above, classify these three readings from an imaginary clastic well: 25 API, 65 API and 140 API. Then write one sentence for each describing what other information you would want before finalising the call. As a self-check: the first is a clean sand candidate, the second is ambiguous (silty sand, shaly sand or a hot clean sand), and the third is shale, possibly organic-rich if it stands far above the local shale baseline.
