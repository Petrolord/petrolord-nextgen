# The Ricker wavelet

The previous lesson described a wavelet in general terms. This one fixes a specific wavelet, the one the app uses for every synthetic in this course and the one every seismic textbook reaches for first.

## One parameter, one shape

The **Ricker wavelet** is the standard teaching wavelet. It is defined by a single formula:

$$r(t) = \left(1 - 2\pi^2 f^2 t^2\right)\exp\left(-\pi^2 f^2 t^2\right)$$

where $t$ is time from the centre of the wavelet in seconds and $f$ is the dominant frequency in hertz. That is the whole definition: choose $f$ and the shape is decided.

Read the formula in two pieces. The exponential is a bell that falls away from the centre and never turns negative, which is what makes the wavelet short. The bracket in front starts at 1 when $t = 0$, falls through zero and goes negative, which is what makes the wavelet oscillate. Multiply them and you get the familiar shape: **a single central peak with two negative side lobes**, one on each side, symmetric about the centre.

Substitute $t = 0$ and the arithmetic is immediate. The bracket is $1 - 0 = 1$, the exponential is $\exp(0) = 1$, so $r(0) = 1$. This holds for every frequency, which is worth noticing: the Ricker as the engine builds it is **peak-normalised**, so its amplitude is a pure shape and carries no units of its own. Any physical scale in the synthetic comes from the reflection coefficients, not from the wavelet.

## Zero phase

Because $t$ appears only as $t^2$, the wavelet is exactly **symmetric about time zero**: $r(-t) = r(t)$. A symmetric wavelet with its maximum at the centre is called **zero phase**.

This is not a cosmetic property. It settles where an event appears relative to the geology. When a zero-phase wavelet is placed at a reflection coefficient, its peak lands at the same time as that coefficient. The consequence for interpretation is the rule you will use for the rest of the course:

> On a zero-phase synthetic the event sits **on** the boundary, not beside it. You pick the peak of a positive event, or the trough of a negative one, and that pick is the interface.

Compare that with a wavelet whose energy is offset from its centre. There the peak arrives late or early, so picking the peak systematically misplaces the horizon in time, which becomes a depth error after conversion. Getting real data to behave like a zero-phase wavelet is what phase matching in a professional well tie is for.

## How the engine samples it

A formula is continuous; a trace is a list of samples. The engine evaluates the Ricker on the same two millisecond grid the seismic uses, out to a **half-length of 60 ms** on each side. That gives

$$2 \times \frac{60}{2} + 1 = 61 \text{ samples}$$

running from **-60 ms to +60 ms**, a total wavelet length of 120 ms. The count is odd on purpose. An odd-length wavelet has a true centre sample, sample 31 of 61, and that centre is zero lag: the sample aligned with each reflection coefficient in the next lesson.

The half-length is fixed at 60 ms regardless of frequency, so the array is always 61 samples long. What changes with frequency is how much of that window carries meaningful energy. At a high dominant frequency the pulse is compressed into the middle and the outer samples are essentially zero. At a low dominant frequency it spreads out and uses more of the window.

## Engine-verified numbers

Two properties are worth committing to memory because you can check them against the app.

The **peak is 1.0 at 0 ms for every frequency**. Build a Ricker at 15 Hz, 25 Hz or 40 Hz and the centre sample reads 1.0 in all three cases.

The **side lobe minimum is about -0.4449 at 25 Hz and at 40 Hz**, and about **-0.4463 at 15 Hz**. The two negative lobes are equal to each other by symmetry, so one number describes both.

Those two values look inconsistent until you see where they come from. Differentiating the formula puts the true minimum of the continuous Ricker at a fixed number of cycles from the centre, where its value is $-2\exp(-3/2)$. Work that out: $\exp(-1.5) = 0.22313$, and twice that is $0.44626$, so the continuous minimum is $-0.4463$ for **any** frequency. The engine, though, only sees samples every 2 ms. At 15 Hz the true minimum falls almost exactly on a sample, so the sampled value reaches $-0.4463$. At 25 Hz and 40 Hz it falls between two samples, so the nearest sample sits slightly above the trough and reads $-0.4449$.

The lesson underneath that arithmetic is general. A sampled wavelet approximates a continuous one, and differences of this size are sampling effects rather than physics. The number is also a sanity check: a side lobe far from about -0.45 means something other than a peak-normalised Ricker is in use.

## Exercise

Without running the app, state the length in samples and in milliseconds of the Ricker the engine builds at 40 Hz, and its value at 0 ms. Then say what would change if the sample rate were 1 ms instead of 2 ms with the half-length unchanged.

As a self-check: the wavelet is 61 samples long spanning -60 ms to +60 ms, which is 120 ms in total, and its value at 0 ms is 1.0. Both answers are identical at 15 Hz and 25 Hz, since neither length nor peak depends on frequency. At a 1 ms sample rate the same 60 ms half-length gives $2 \times 60 + 1 = 121$ samples, the shape and the peak of 1.0 are unchanged, and the sampled side lobe lands closer to the true $-0.4463$ because the finer grid comes nearer the trough.
