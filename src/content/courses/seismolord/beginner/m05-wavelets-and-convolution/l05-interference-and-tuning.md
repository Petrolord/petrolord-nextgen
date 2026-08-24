# Interference and tuning

This lesson closes the module by naming the effect that has been building through it, and by explaining the pair of numbers from the teaching well that the capstone asks about.

## Constructive and destructive interference

Two reflections interfere when their wavelet copies land on shared samples. As a working threshold, that happens once they are closer together in time than about **half a wavelet length**. In this course the wavelet spans 120 ms, so reflections within roughly 60 ms of each other are interfering, and since the teaching well's logged interval runs from 1500 ms to 1650 ms, almost everything in it is interfering with something.

What the interference does depends on the signs that meet.

**Constructive interference** occurs when contributions of the same sign coincide: two positive peaks, or a positive peak landing on the positive side lobe of a flipped copy nearby. They add, and the trace shows an amplitude larger than either reflection produces alone. A modest interface can look impressive this way.

**Destructive interference** occurs when contributions of opposite sign coincide. They cancel, partly or almost completely, and the trace shows an amplitude smaller than either alone. A strong interface can go nearly invisible this way, which is the more dangerous of the two because nothing on the display draws your attention to it.

Both are ordinary consequences of the summing recipe in lesson 3, not errors in the data or the processing.

## The teaching well's sixty milliseconds

Now the specific case. Run the teaching well at a dominant frequency of 25 Hz and compare two facts the engine reports.

The strongest **reflection coefficient** in the well is 0.017688 in absolute value, negative, sitting at **1582 ms**. That is the single largest impedance contrast in the logged interval, an interface where impedance drops sharply downward.

The strongest **amplitude** in the synthetic is 0.073005, it is positive, and it sits at **1642 ms**.

Those two times are $1642 - 1582 = 60$ ms apart, and the two facts do not even share a sign. The strongest reflection in the earth and the strongest event on the trace are not the same feature.

Nothing is wrong. Convolution explains it completely. The coefficient at 1582 ms is the biggest single one, but it stands relatively alone, so its wavelet copy gets little support: an isolated copy peaks at roughly the coefficient itself, which is under 0.02. Around 1642 ms the well contains a **cluster of moderate coefficients**, spaced so that their copies reinforce rather than cancel. Their sum reaches 0.073005, about four times the largest single coefficient in the well. A group of moderate reflections beats one strong reflection, because the group is arranged to add.

The 15 Hz case behaves differently again. Its strongest amplitude of 0.157315 falls at 1580 ms, within one 2 ms sample of the strongest coefficient at 1582 ms, because the longer wavelet gathers a different set of neighbours into its sum. Same earth, same reflectivity, different wavelet, different answer about where the trace is brightest.

Both 1642 ms and 1582 ms are capstone numbers, and the capstone accepts times to within 2 ms, one sample. Stating them is half the requirement. Explaining why they differ is the other half, and the sentence is: amplitude on a synthetic is the sum of overlapping wavelet copies, so a constructive cluster can outproduce a single larger reflection.

## Tuning, and where it becomes quantitative

One case of interference has its own name. **Tuning** is the constructive case at a particular layer thickness: as a bed thins, the reflections from its top and base move together, their wavelet copies begin to reinforce, and the composite amplitude rises to a maximum at what is called the tuning thickness before collapsing as the bed thins further.

The consequence matters. Over a range of thicknesses, a thinner bed produces a **brighter** event, so amplitude read straight off a map can rank prospects in the wrong order, and thickness inferred from brightness can be exactly backwards.

The Expert tier builds a wedge model, a bed that thins steadily across the section, and measures amplitude and apparent thickness at every step. That is where tuning becomes quantitative and where the classic tuning curve is derived. At this tier it is enough to recognise the mechanism and know the name.

## The professional habit

Carry one rule out of this module and let it govern how you look at amplitude:

> A bright amplitude is not automatically a strong interface.

A bright event may be one large contrast, or several moderate contrasts adding constructively, or a bed at tuning thickness, or a low frequency wavelet smearing a package together. A dim event may be a weak contrast, or a strong contrast cancelled by a neighbour. The only way to tell the cases apart is to go back to the reflectivity series, and the well tie is the instrument that lets you do that.

Module 6 turns to reading the finished synthetic, quality controlling it, and the capstone.

Try it yourself: the panel below builds the synthetic from the teaching well at a frequency you choose.

{{panel:sl-synthetic-explorer}}

## Exercise

State the time of the strongest amplitude in the 25 Hz synthetic and the time of the strongest reflection coefficient, then explain the gap between them in two sentences. Second, decide which of constructive or destructive interference is more likely to cause a missed pay zone, and say why.

As a self-check: the strongest 25 Hz amplitude is 0.073005 at 1642 ms and the strongest reflection coefficient is 0.017688 in absolute value, negative, at 1582 ms, a separation of 60 ms. The explanation is that each amplitude sample is a sum of overlapping scaled wavelet copies, and the cluster of moderate coefficients near 1642 ms reinforces to about four times the size of the isolated larger coefficient at 1582 ms. Destructive interference is the greater risk to a pay zone, because it removes an event from the display entirely rather than adding a bright one you would at least go and investigate.
