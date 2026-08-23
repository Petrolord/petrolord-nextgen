# What a well log is

Strip away the file formats and the software, and a well log is a very simple object: a record of some physical measurement sampled at regular intervals of depth. Everything this course does, from parsing to QC to publishing, is bookkeeping around that simple object, so it pays to have it completely clear before touching a file.

## A sampled record against depth

A logging tool travels along the borehole and reads its measurement at fixed depth increments. The result is a table. The first column is depth. Every other column is a curve: one measurement type, one value per depth sample. In our teaching files the depth column carries the mnemonic DEPT and the increment is 0.5 m, so a curve is simply a list of values, one for every half metre of hole.

Each curve carries three pieces of identity alongside its values: a mnemonic, which is its short standard name; a unit; and a description. The mnemonic is how software finds the curve, the unit is how software interprets it, and the description is how humans remember what it was. All three matter, and module 2 shows exactly where each lives in the file.

## The four standard curves

The teaching wells carry the four curves you will meet everywhere in this platform:

* GR, the gamma ray, in GAPI (API gamma units). It measures natural radioactivity, which concentrates in clays, so GR reads high in shale and low in clean sand. In basic_20 the finite samples average 64.9272 GAPI.
* RHOB, bulk density, in g/cc. The density of the rock plus its fluids; the petrophysics course turns it into porosity. The basic_20 average is 2.3393 g/cc.
* NPHI, neutron porosity, in v/v (a volume fraction). An apparent porosity from the formation's hydrogen content. It averages 0.2416 in basic_20.
* DT, sonic transit time, in us/m (microseconds per metre). The time sound takes to cross a metre of formation; slow rock means high DT. The basic_20 average is 327.3901 us/m.

You do not need the interpretation physics yet. What you need is the reflex of reading each curve's unit and asking whether the values are plausible for that unit. A density of 2.34 g/cc is rock; a density of 64.9 is a loaded gun.

## Counting samples: the fence-post rule

The most basic QC number for any log is how many samples it holds, and it is also the first place beginners slip. A well logged from 1500 to 1650 m at a 0.5 m step does not have 300 samples. Work it through for basic_20:

1. Depth range: 1650 - 1500 = 150 m.
2. Intervals: 150 / 0.5 = 300 steps.
3. Samples: 300 + 1 = 301, because both end points carry a sample.

The +1 is the fence-post rule: a fence with 300 gaps has 301 posts. The parser confirms it; basic_20 carries exactly 301 depth samples, and 301 is one of the six numbers the capstone grades.

Run the same arithmetic on wrapped_12, which logs 1500 to 1580 m at the same 0.5 m step: (1580 - 1500) / 0.5 = 160 intervals, so 160 + 1 = 161 samples. That 161 is another capstone number, and when you meet the file in module 2 you will see why counting its samples takes more than eyeballing the data section: its rows wrap across several lines.

Forgetting the +1 gives 300 and 160, which are exactly the kind of almost-right numbers that pass a glance and fail an audit. Count the posts, not the gaps.

## Samples, not depths

One subtlety completes the picture. Every curve in a file has a value slot at every depth sample, but not every slot holds a real measurement. When the tool could not read, the slot holds the null flag instead. So a curve has two counts worth knowing: total samples, fixed by the depth column, and finite samples, which is total minus nulls. In basic_20 the GR curve spans all 301 samples but 8 of them are null, so only 293 carry real values. Which count you use matters as soon as you compute anything; module 4 is devoted to exactly this.

## Exercise

A file logs from 2000 to 2080 m at a 0.5 m step. Compute the number of depth samples. Then compute the sample count for a second file logged from 1500 to 1600 m at the same step. As a self-check: the first is (80 / 0.5) + 1 = 161 samples, the same count as wrapped_12; the second is (100 / 0.5) + 1 = 201, which happens to be the sample count of the nullheavy_20 teaching file you will meet shortly. Finally, state in one sentence why 300 rather than 301 is the classic wrong answer for basic_20.
