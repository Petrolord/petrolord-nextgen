# What this tier adds

The Associate tier ended with a synthetic seismogram on the screen. You took the sonic and density curves from the teaching well, turned slowness into velocity, multiplied velocity by density to get acoustic impedance, differenced the impedance log into a series of reflection coefficients, placed that series on a two-way time axis, and convolved it with a Ricker wavelet. What came out was a trace you could account for at every step, built from rock properties you had inspected yourself.

That is a complete skill and it stops at a particular place. A synthetic on its own is a prediction without an address. It says what a trace through this well ought to look like. It does not say where on the recorded section that trace belongs, and it does not tell you how much of what you are looking at is the rock and how much is the wavelet you happened to choose.

## What the Associate tier established

Five results carry forward, and naming them makes visible what the rest of this tier is standing on.

Impedance is the product of velocity and density, and reflections come from contrasts in it rather than from any single rock property. The reflection coefficient series is a property of the earth alone. Seismic lives in two-way time, so the log has to be carried onto a TWT axis by a time-depth function before anything can be compared. Convolution replaces every reflection coefficient with a scaled copy of the wavelet and sums the copies, which is why a trace sample is almost never a single reflection. And the strongest event on a trace is not the strongest reflection coefficient, because summing wavelet copies can pile up amplitude where no single interface deserves it.

None of that is retaught here. All of it is assumed. If any of the five feels loose, go back before continuing, because everything below treats the synthetic as a finished, trustworthy object and asks only what you do with it.

## Building a synthetic is not placing one

Here is the difference in one sentence. Building a synthetic answers the question "what should a trace through this well look like". Placing a synthetic answers the question "which part of the recorded seismic is that trace".

The second question is not a harder version of the first. It is a different question with a different kind of answer. The first has a single correct output that follows from the logs by arithmetic. The second is a measurement made against data you did not compute, and it comes with two numbers rather than one: how far the synthetic has to move, and how well the two agree once it has moved.

That pairing is the whole point. An alignment without a quality number is an opinion formed at a display. Two interpreters who align by eye produce two answers and have no way to settle between them. Two interpreters who run the same scan on the same pair of traces produce the same shift and the same correlation, and can then argue about whether that correlation is good enough, which is an argument with evidence in it.

## The two things this tier adds

**A measured bulk shift.** Instead of dragging the synthetic until the peaks look right, you slide it across a range of time lags, score the agreement at every lag, and take the best one. Modules 2 and 3 own this. Module 2 builds the measure and runs the scan. Module 3 reads the curve the scan produces, including the part of it that catches people out, which is that a completely unshifted tie can still return a respectable-looking number.

**An understanding of what the wavelet does to what you see.** The Associate tier noticed that changing frequency changes the trace. This tier makes that quantitative on two fronts. Modules 4 and 5 show that lowering the wavelet frequency makes the strongest amplitude larger rather than smaller, which is backwards from most people's intuition, and that the TWT at which the strongest event sits moves as well, while the reflection coefficients underneath it do not move at all.

Module 6 puts both together as a workflow and walks the capstone.

## The one exercise this tier works

You will meet the same construction repeatedly. The observed seismic in this tier is the 25 Hz synthetic from the teaching well, arriving 8 ms late in TWT. The lag was planted deliberately, which means the scan's answer can be checked against a known truth rather than accepted on trust. The next lesson explains why that design is honest and where its honesty ends.

Working one case all the way down is deliberate. The goal is that you can predict every number the shift panel reports for this case, say why each one comes out as it does, and say which of them would survive on real data and which would not.

## Where the Expert tier picks up

The Expert tier takes the frequency thread further and asks what seismic can resolve at all. It thins a layer until the reflections from its top and base merge, finds the tuning thickness where amplitude peaks, and chains that reasoning into AVO screening. Those topics belong there. This tier does not model a wedge and does not vary the angle of incidence. If you find yourself thinning a layer to see what happens, you have crossed into the next tier's work.

The three tiers divide cleanly. The Associate tier builds the synthetic. This tier places it and reads the wavelet's fingerprint on it. The Expert tier quantifies what the data can and cannot see.

## Exercise

Write down the five Associate-tier results listed above, and beside each one write the sentence in this tier that would become unsafe if that result were wrong. Then answer in one sentence: why does a placed synthetic need two numbers rather than one.

Self-check: the second question is the important one. A placed synthetic reports a shift and a quality, because the shift alone tells you what was done and says nothing about whether it was worth doing. A shift of 8 ms in TWT that produces poor agreement and a shift of 8 ms that produces excellent agreement are the same instruction and different pieces of evidence, and only the quality number separates them. On the first part, the dependency that matters most is convolution: if you do not accept that a trace sample is a sum of overlapping wavelet copies, then modules 4 and 5, which explain both the amplitude change and the time change entirely by how far those copies reach, have nothing to stand on.
