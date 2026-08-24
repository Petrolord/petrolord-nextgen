# The beginner frame map

This tier has four working modules after this one, and together they build one thing: the frame. Each module produces a curve or a parameter, and every one of them is consumed by something later. This lesson lays the whole path out so no module arrives without a place to sit.

The order is fixed. Hydrostatic column, then overburden, then Gardner density where the density log is missing, then the normal compaction trend and its fit. Depths throughout are metres below mudline.

## Step 1: the hydrostatic column

Module 2 builds the baseline. In a marine well the column has two parts, seawater from sea level to the mudline and pore fluid from the mudline to the depth of interest, and each part is a density multiplied by gravity multiplied by a height.

In the golden well that gives 1005181.625 Pa for the 100 m of seawater at 1025 kg/m3, plus 40403398 Pa for 4000 m of pore fluid at 1030 kg/m3, for a total of 41408579.625 Pa at total depth, which is 41.408579625 MPa.

That single number is the reference every later pressure statement is made against. Module 2 also introduces equivalent mud weight, the form the drilling engineer wants a pressure in.

## Step 2: the overburden

Module 3 builds the upper limit by integrating the bulk density log downward from the top of the section, and adding the seawater column above the mudline.

In the golden well the overburden stress at 4000 m below mudline is 91.12306695073282 MPa, against a hydrostatic value of 41.408579625 MPa at the same depth. The rock plus its fluid weighs more than twice what the fluid alone weighs, which is the reason a pore pressure has anywhere to go.

## Step 3: Gardner where density is missing

A density log almost never runs to the seabed. The shallow section is usually logged only by a sonic, if it is logged at all, and an overburden integration that starts at the top of the density log has already lost the weight of everything above it.

Gardner's relation fills the gap by predicting density from velocity:

$$\rho = 310\,v^{0.25}$$

with velocity in m/s and density in kg/m3. At 1600 m/s the relation returns 1960.612149304395 kg/m3, and the exponent of one quarter makes it a slow function of velocity, which is both its weakness and the reason it is usable when the velocity input is rough.

| v (m/s) | Gardner rho (kg/m3) |
| --- | --- |
| 1600 | 1960.612149304395 |
| 2000 | 2073.094945426908 |
| 2500 | 2192.0310216782973 |
| 3000 | 2294.256693926084 |

## Step 4: the compaction trend and its fit

Module 4 is the longest, because it is where judgement enters. A normally compacted shale loses porosity with depth in a way that is well described by an exponential decline of transit time toward the matrix value:

$$dt(z) = dt_{matrix} + (dt_{mudline} - dt_{matrix})\,e^{-cz}$$

The golden well's header gives a mudline transit time of 656 us/m, a matrix transit time of 220 us/m and a compaction constant of 0.0006 per m. On that trend, the transit time at 2500 m below mudline is 317.2847498247154 us/m.

You then do what an interpreter actually does, which is to pick shale points on the log and fit the trend to them. The capstone fits twelve picks with a matrix transit time of 220 us/m, and the least squares fit returns a mudline transit time of 650.0000000000014 us/m and a compaction constant of 0.7000000000000015 per km.

Compare those with the header values of 656 us/m and 0.6 per km. They disagree, and neither one is a mistake. The fit is an honest report of the twelve points it was given, and those points were drawn on a different trend from the one written in the header. That is the central teaching point of this tier, and module 4 ends on it. A fitted trend describes the data you handed it. If you hand it the wrong points it returns a confident number describing the wrong points, so check that fitted parameters are physically sensible before a pressure prognosis is built on them.

## The six graded numbers

The capstone at the end of this tier asks for six values, and each one comes from a step above.

| Number | Value |
| --- | --- |
| hydrostatic pressure at total depth | 41.408579625 MPa |
| overburden stress at total depth | 91.12306695073282 MPa |
| Gardner density at 1600 m/s | 1960.612149304395 kg/m3 |
| trend transit time at 2500 m | 317.2847498247154 us/m |
| fitted mudline transit time | 650.0000000000014 us/m |
| fitted compaction constant | 0.7000000000000015 per km |

You are not expected to reproduce those digits from memory. You are expected to be able to say, for each one, which step produced it, what it depends on, and roughly which way it would move if one of its inputs moved.

## Where the path leads

Module 5 puts all four curves on one plot and teaches you to read them together, including the place where the log leaves the trend. Module 6 walks the workflow end to end with quality control.

Beyond this tier, the Professional course inverts the departure of the log from the compaction trend into a pore pressure curve, and the Advanced course converts that into the mud weight window and cross-checks it with a second method. Both of them consume the frame you are about to build, unchanged.

The panel below runs the whole path at once. Choose a depth and a sonic velocity and read the frame at that depth.

{{panel:pp-frame-explorer}}

## Exercise

Write the four steps in order and, beside each, note what it needs as an input and what it hands to the next step. Then answer two questions in one sentence each. Which step needs no log data at all? Which of the six graded numbers would change if the density log were replaced by a Gardner estimate over the shallow section?

Self check: the four steps are the hydrostatic column, the overburden integration, Gardner density where the density log is missing, and the compaction trend with its fit. The hydrostatic column needs no log data whatever, since it requires only the water depth, the two fluid densities, gravity and the depth. Replacing the shallow density log with a Gardner estimate would move the overburden stress at total depth, which is 91.12306695073282 MPa in this well, because the overburden is an integral of density over depth, while the hydrostatic value, the trend transit time and the two fitted trend parameters would be untouched.
