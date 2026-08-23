# The synthetic workflow map

You now know what a tie is for, what seismic actually measures, and which two curves in `basic_20.las` do the work. This lesson lays out the whole pipeline in one place, so that every later module has a slot to drop into. Read it once now and once again when you finish module 5; it will read differently the second time.

## The pipeline, stage by stage

**Stage 1. Curves to impedance.** DT is inverted into velocity and RHOB is taken as density, then the two are multiplied into acoustic impedance sample by sample. At 1500 m, DT of 399.737 us/m gives a velocity of 2501.65 m/s, and with RHOB of 2.1893 g/cc the impedance is 5476.85. At 1650 m the same arithmetic on DT 277.473 and RHOB 2.2724 gives 3603.96 m/s and an impedance of 8189.64. The units here are metres per second times grams per cubic centimetre, which is the convention this course keeps throughout, so impedance values land in the thousands. Built in **module 2**.

**Stage 2. Depth to time.** The impedance log is still indexed in depth and the trace must be indexed in two-way time, so a time to depth function is applied. Real ties use a checkshot survey or integrate the sonic itself. This course uses a deliberately simple teaching function instead: a vertical well with a uniform 2000 m/s overburden, so that

$$TWT(z) = \frac{2z}{2000}\ \text{s}$$

which makes two-way time in milliseconds numerically equal to depth in metres. The top of the log at 1500 m sits at 1500 ms and the base at 1650 m sits at 1650 ms. This is not what a real overburden does, and module 3 says so plainly. It is chosen so that you can check every later number in your head instead of chasing a conversion error. Built in **module 3**.

**Stage 3. Impedance to reflectivity.** Differencing impedance between adjacent samples turns the impedance log into the reflection coefficient series, one coefficient per interface. Because reflections come from contrasts, this is the stage where a smooth impedance trend becomes a sparse series of spikes with signs. 301 impedance samples give 300 coefficients. Built in **module 4**.

**Stage 4. Convolution with a wavelet.** The reflectivity series is convolved with a Ricker wavelet to produce the synthetic trace. Frequency is the interpreter's choice, and the capstone fixes it at 25 Hz. This is the stage where the earth's sharp spikes become the smooth, oscillating, band-limited events that look like seismic, and where nearby reflections start interfering with each other. Built in **module 5**.

**Stage 5. Reading the panel.** The app reports the synthetic and a summary panel of derived numbers. Knowing what each field means, and which of them would reveal a bad input, is the final skill. Built in **module 6**.

## The six graded numbers

The Associate capstone grades six values computed from this well at a 25 Hz Ricker wavelet. They are listed here at the start rather than the end, so that you can see which stage each one falls out of and recognise it when it appears.

| # | Quantity | Value | Stage |
| --- | --- | --- | --- |
| 1 | Mean sonic velocity | 3145.29 m/s | 1 |
| 2 | TWT at the top of the log | 1500 ms | 2 |
| 3 | Maximum acoustic impedance | 10624.96 | 1 |
| 4 | Strongest reflection coefficient, absolute value | 0.017688 | 3 |
| 5 | TWT of that strongest reflection | 1582 ms | 3 |
| 6 | TWT of the strongest synthetic amplitude at 25 Hz | 1642 ms | 4 |

A few observations that will save you confusion later.

Number 3, the maximum impedance of 10624.96, is not the impedance at the base of the log. The base value is 8189.64, computed above. Impedance rises overall through the section but not monotonically, and the peak sits somewhere inside the interval rather than at its end. Trends and extremes are different questions.

Number 4 is small. A reflection coefficient of 0.017688 means that under two percent of the incident energy amplitude comes back at the strongest interface in this well. That is normal. Reflection coefficients in clastic sections are typically a few percent, and a value above about 0.3 in real data is usually a sign of a processing artefact or a bad curve rather than a spectacular rock.

That strongest coefficient is also **negative**, meaning impedance drops downward across that interface. Sign carries geology, and module 4 is largely about not losing it.

Numbers 5 and 6 are the most instructive pair in the table. The strongest reflection coefficient is at 1582 ms. The strongest amplitude on the synthetic is at 1642 ms, sixty milliseconds away. The largest event on a trace is therefore not sitting on the largest interface. That gap is convolution doing its work: at 1642 ms several moderate coefficients of the same sign fall close enough together that their wavelet copies reinforce, and the constructive interference beats the single isolated spike at 1582 ms. If you take one idea away from this module, make it this one. Bright does not mean big contrast. The brightest event on a section may be interference between several ordinary interfaces, and the only way to know is to build the synthetic and look.

Try it yourself: the panel below builds the synthetic from the teaching well at a frequency you choose.

{{panel:sl-synthetic-explorer}}

## Exercise

Write the five stages in order from memory, and beside each one name the input it consumes and the output it produces. As a self-check, your chain should read: curves to impedance, impedance to two-way time, impedance to reflection coefficients, reflection coefficients to synthetic trace, synthetic trace to summary panel. Then answer in one sentence why the strongest synthetic amplitude at 1642 ms does not coincide with the strongest reflection coefficient at 1582 ms, and state which stage of the pipeline is responsible for the difference.
