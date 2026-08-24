# What a wavelet is

Module 4 finished the earth's half of the convolutional model. You have a reflection coefficient at every interface, positive where impedance increases downward and negative where it decreases, sitting on the two millisecond time grid. If the recording instrument were perfect, that spiky series would be the trace and this course would be over. It is not, and the reason is the subject of this module.

## A source emits a pulse, not an impulse

A seismic source cannot deliver energy in an instant. An air gun releases a bubble that expands, collapses and oscillates. A vibrator sweeps through a range of frequencies and the processing collapses that sweep into a compact pulse. Dynamite comes closest to an instantaneous event and still produces a pulse of finite length, because the earth immediately begins filtering it: high frequencies are absorbed faster than low ones, so the pulse lengthens as it travels.

What arrives at the receiver from a single interface, therefore, is not a spike. It is a short oscillating pulse, centred on the arrival time of that reflection, scaled by the reflection coefficient. That pulse is called the **wavelet**.

Say it in one line and keep it: every reflection in the recorded trace is a smeared copy of the source pulse rather than a spike. The earth supplies the position and the size. The acquisition supplies the shape.

## The three properties that define it

A wavelet is described by three things, and all three matter later.

It is **short**. A useful wavelet occupies a few tens of milliseconds, not seconds. Its energy is concentrated near its centre and dies away at both ends. This is what allows separate reflections to stay separate at all.

It is **band-limited**. The pulse contains a range of frequencies rather than all of them. Seismic bandwidth is narrow by the standards of well logging, typically running from a handful of hertz at the low end to some tens of hertz at the high end. A spike, by contrast, contains every frequency in equal measure. Removing the high frequencies is exactly what turns a spike into a pulse, and it is the reason a trace can never resolve the detail a log resolves.

It is **oscillating**. Because the low frequencies are missing too, the pulse cannot be a simple hump. It swings: a central lobe with lobes of opposite sign on either side. Those side lobes are not noise and not errors. They are an unavoidable consequence of finite bandwidth, and they are visible on every real seismic event you will ever pick.

Within that band, one frequency carries the most energy. It is called the **dominant frequency**, and for teaching purposes it is the single number that stands in for the whole wavelet. Higher dominant frequency means a shorter, tighter pulse. Lower dominant frequency means a longer, broader one.

## Why the wavelet decides what you can see

The wavelet controls **resolution**, the ability to tell two reflections apart. Consider the 45 m sand from module 1, with a reflection at its top and another at its base. In the reflectivity series those are two clean spikes at two distinct times. In the trace they are two overlapping pulses. If the two arrival times are separated by more than the length of the wavelet, you see two events and can pick each one. If they are separated by less, the pulses land on top of each other and add, and the trace shows a single blended event whose peak time and peak amplitude belong to neither interface alone.

That merging is not a processing defect and no amount of careful picking removes it. It is built into the physics of a band-limited source, and the rest of this module makes it quantitative.

## Real wavelets and the teaching wavelet

In real work the wavelet is not known in advance. It has to be **estimated** from the data, either statistically from the seismic itself or deterministically by comparing the seismic with a well. Estimated wavelets are usually **asymmetric**: energy is not distributed evenly about the centre, the leading and trailing lobes differ in size, and the peak may not sit where you expect. Such a wavelet is described as having a phase other than zero, and matching that phase is a large part of professional well tying.

This course deliberately uses an idealised **symmetric** wavelet instead, one whose shape is fixed by a single number. Two reasons justify that choice. The arithmetic stays checkable, so you can verify by hand what the app computes. And the interpretation rule stays clean, so you can learn where an event should sit relative to a boundary before you learn all the ways real data breaks that rule. The Professional and Expert tiers restore the complications.

## Exercise

State, in your own words, what a seismic trace would look like if the source really did emit a perfect impulse, and name the one property of a real source that prevents it. Then explain why the side lobes on a seismic event are not an artefact to be removed.

As a self-check: with a perfect impulse the trace would equal the reflectivity series exactly, one spike per interface with zeros between, at full log resolution. The property that prevents it is finite bandwidth, since a real source emits a short band-limited pulse rather than an instant of energy. The side lobes follow directly from that missing bandwidth, so they are part of the wavelet itself, present on every event, and removing them would require frequencies the data does not contain.
