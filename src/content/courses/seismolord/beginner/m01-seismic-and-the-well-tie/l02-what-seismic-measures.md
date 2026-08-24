# What seismic measures

A seismic trace looks like a log, so it is tempting to read it like one. That instinct causes more misinterpretation than any other single habit. A log records a property of the rock at each depth. A trace records something else entirely: energy that came back, plotted against the time it took to make the round trip.

## The trace is amplitude against two-way time

A source at the surface releases a pulse of acoustic energy. The pulse travels down through the section, and wherever it meets an interface between rocks with different acoustic properties, some energy reflects back toward the surface and the rest carries on down. Receivers at the surface record the returning energy continuously.

What the receiver writes down is a series of amplitude values, one every couple of milliseconds, against the clock that started when the source fired. That clock measures **two-way travel time**: down to the reflector and back up again. A trace is therefore indexed in milliseconds, not metres, and every event on it carries the sum of everything the wave passed through on the way down and the way back.

Two consequences follow. Deeper events arrive later, but the relationship between arrival time and depth is controlled by velocity, which varies through the section. And a change in the shallow section shifts everything below it in time, even if the deeper rocks have not changed at all.

## Reflections come from contrasts, not from rocks

Energy reflects at an interface where **acoustic impedance** changes. Acoustic impedance is the product of a rock's velocity and its density, and module 2 develops it properly. What matters now is the word *change*. There is no reflection from rock. There is only reflection from a contrast between two rocks.

Work through the consequence with a thick, uniform sand, say 60 m with shale above and below. Inside the sand nothing changes, so nothing reflects: the interior of the body is acoustically silent no matter how thick it is or how good a reservoir it would make. Energy reflects at the shale to sand interface at the top, and again at the sand to shale interface at the base. On the trace you see two events, top and base, with nothing between them.

That is why a seismic section shows a pattern of layer boundaries rather than a picture of the layers themselves. Seismic is an edge detector, sensitive to where properties change and blind to where they do not. A petrophysicist reading a density log sees the sand body; an interpreter reading seismic sees the two surfaces that bound it, and infers the body between them.

The same logic explains a common surprise. Two rocks can be geologically very different, a limestone and a dolomite say, and still produce almost no reflection if their velocity and density multiply out to similar impedance. Conversely, a modest lithological change can reflect strongly if the impedance contrast is large. What reflects is impedance contrast, not geological interest.

## The convolutional model

The organising idea for the rest of this course is a single sentence, worth reading slowly:

> A seismic trace is approximately the earth's reflectivity series convolved with a source wavelet.

Unpack it in two halves.

The **reflectivity series** is the earth's contribution. It is a spike at every interface, with a size and sign set by the impedance contrast there, and zero everywhere else. It is what a perfect instrument with infinite bandwidth would record, and it is a property of the rocks alone.

The **wavelet** is the acquisition's contribution. Real sources do not emit an instantaneous spike; they emit a short oscillating pulse of finite bandwidth, and the earth filters it further as it travels. Every reflection on a real trace arrives not as a spike but as a copy of that pulse, scaled and signed by the reflection coefficient.

**Convolution** combines them: each spike in the reflectivity series is replaced by a scaled copy of the wavelet, and where those copies overlap they add together. That last clause is the source of most of the difficulty in seismic interpretation. When two interfaces are close together in time, their wavelet copies interfere, and the trace shows a single blended event whose amplitude and shape belong to neither interface on its own.

Written compactly, with $s$ the trace, $r$ the reflectivity and $w$ the wavelet:

$$s(t) = r(t) * w(t)$$

The word approximately is honest. The model ignores multiples, transmission losses, absorption, mode conversion and the fact that the wavelet changes with depth. It is still the model every synthetic seismogram in routine use is built on, and it is accurate enough that the tie works.

## The ingredients, and where they are built

Everything in that sentence has to be constructed from well curves before you can make a synthetic. This course builds the pieces in the order they are needed:

1. **Impedance** from sonic and density, in module 2. This is the rock property whose contrasts create reflections.
2. **A time axis**, in module 3. The curves arrive in depth and the trace must be in two-way time, so a time to depth relationship is required before anything else can be plotted against time.
3. **Reflection coefficients**, in module 4. Differencing impedance between adjacent samples turns the impedance log into the reflectivity series, complete with signs.
4. **The wavelet and convolution**, in module 5. A Ricker wavelet of chosen frequency is convolved with the reflectivity series, producing the synthetic trace you will read in module 6.

If you keep the convolutional sentence in your head, each module has an obvious place in it. Nothing in the Beginner tier falls outside it.

## Exercise

A 45 m thick uniform sandstone is encased in shale of different impedance. Sketch, in words, what the reflectivity series looks like through that interval and how many events the seismic trace shows. As a self-check: the reflectivity series has exactly two nonzero spikes, one at the top interface and one at the base, with zeros through the sand interior, and the trace shows two events which will interfere if the wavelet is long relative to the sand's thickness in time. Then state which of the two factors in the convolutional model, the earth or the acquisition, you would change to improve the resolution of the two events, and why.
