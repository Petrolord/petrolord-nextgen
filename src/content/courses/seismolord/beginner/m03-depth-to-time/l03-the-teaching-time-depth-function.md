# The teaching time-depth function

Every synthetic needs a rule that converts a depth into a two-way time. This course fixes one and uses it everywhere: a single constant overburden velocity of 2000 m/s applied from the surface down, with the well vertical and its reference at mean sea level.

## The rule, and why it is this number

Start from the two-way time relation and substitute the fixed velocity:

$$TWT(z) = \frac{2z}{2000} \text{ s} = \frac{z}{1000} \text{ s}$$

Convert to milliseconds by multiplying by 1000, and the thousands cancel:

$$TWT(z) = z \text{ ms}$$

The number of metres equals the number of milliseconds. A depth of 1500 m is a two-way time of 1500 ms. A two-way time of 1582 ms is a depth of 1582 m. There is no arithmetic left to get wrong.

That is the entire point. The velocity was not chosen because it describes any real basin. It was chosen so that every time on the summary panel can be checked in your head against the depth it came from. When you see 1642 ms on the panel later, you can say immediately that it corresponds to 1642 m in the well, and go and look at what rock is there.

## Worked across the teaching well

The logged interval of the teaching well runs from 1500 m to 1650 m, sampled every 0.5 m, which is 301 samples.

* Top of the logged interval, 1500 m. $TWT = 2 \times 1500 / 2000 = 1.5$ s, or 1500 ms. This is one of the six numbers the capstone grades, to a tolerance of 0.5 ms.
* Base of the logged interval, 1650 m. $TWT = 2 \times 1650 / 2000 = 1.65$ s, or 1650 ms.
* The logged interval is 150 m thick, so it occupies 150 ms of two-way time.
* A reflection observed at 1582 ms comes from 1582 m, which is 82 m below the top of the log.
* The 0.5 m log sample spacing becomes 0.5 ms of two-way time per sample.

Notice how little work any of those lines required. That is the simplification earning its keep: you can audit the panel instead of trusting it.

## Two velocities, and they are not the same velocity

A second velocity in this course is regularly confused with the 2000 m/s.

The teaching well's sonic log, converted from slowness to velocity, has a mean of 3145.29 m/s across the logged interval. That is a rock velocity. It describes how fast sound travels through the formations the borehole penetrated, sample by sample, between 1500 m and 1650 m. It is measured data, it varies from bed to bed, and it is what builds the impedance log and therefore the reflection coefficients.

The 2000 m/s is not measured and is not a rock velocity. It stands in for the average velocity of everything above the logged interval, the 1500 m of overburden the energy crosses before it reaches any rock in the well. Its only job is to place the log correctly on the time axis. It never enters the impedance calculation and never touches a reflection coefficient.

The two numbers being so different is itself a clue that the overburden figure is a teaching device. If the true average overburden velocity were 3145.29 m/s, the top of the log would sit at $3000 / 3145.29$ s, roughly 954 ms rather than 1500 ms. The synthetic would look identical in shape, simply placed elsewhere on the time axis, and the arithmetic would no longer be checkable at a glance.

## How this is really done

Nobody ties a well with an invented constant. The real workflow measures the time-depth relationship directly.

A **checkshot survey** lowers a geophone into the borehole, fires a surface source, and records the one-way travel time to each of a set of depths. The result is a table of depth against time at a few dozen stations, measured rather than assumed. A **vertical seismic profile**, or VSP, does the same at much finer spacing and records the full waveform, so it also gives a wavelet and an image around the borehole. Either produces a time-depth curve for that well.

The sonic log then gets calibrated against it. Integrating the sonic gives its own time-depth relationship, but sonic tools measure at high frequency over a short span of rock close to the borehole, and the value they report drifts away from seismic-scale travel time because of dispersion, invasion and borehole damage. The correction that forces the integrated sonic to agree with the checkshot at the checkshot depths is called a **drift correction**, and it is a standard step in every real tie.

None of that is switched off because it is unimportant. It is switched off because a checkshot table would add a lookup step between every depth and every time, and you would lose the ability to verify the panel by hand. The simplification is chosen for the learner, not because reality is this kind. Higher up the ladder a measured curve replaces the constant.

## Exercise

Using the teaching time-depth function, convert the depths 1520 m, 1600 m and 1642 m to two-way time, then convert the times 1500 ms and 1650 ms back to depth. As a self-check, every conversion is the identity: 1520 m is 1520 ms, 1600 m is 1600 ms, 1642 m is 1642 ms, and the two times return 1500 m and 1650 m. Then state which of the two velocities in this lesson, 2000 m/s or 3145.29 m/s, would change the reflection coefficients if you altered it, and which would only slide the whole synthetic along the time axis.
