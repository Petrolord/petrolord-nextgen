# NMO stretch and the stretch mute

NMO correction moves each sample of an offset trace up to its zero-offset time, and at far offsets it draws the event out. The stretch measures how much; the stretch mute is the offset beyond which a study stops using the data.

## The stretch

`nmoStretch`, after Yilmaz (2001): an event at offset x and zero-offset time t0 arrives at t = sqrt(t0^2 + x^2 / v^2), with v the NMO velocity, and is stretched by t / t0 - 1. At zero offset the stretch is zero. It grows with offset and shrinks with time and with velocity, because a deeper or faster event has less moveout to correct at the same offset.

## The stretch mute

`stretchMuteOffset` returns the offset at which the stretch reaches a stated limit: v t0 sqrt((1 + limit)^2 - 1). The limit is the study's choice, written as a fraction.

## At the top on gather 5

The time is the top picked on gather 5, t0 1292.000000 ms, and the NMO velocity is the RMS velocity of the pack's table at that time, 2388.940541 m/s.

| offset m | stretch |
| --- | --- |
| 100 | 0.000525 |
| 500 | 0.013036 |
| 900 | 0.041646 |
| 1300 | 0.085080 |
| 1700 | 0.141649 |
| 2100 | 0.209511 |
| 2500 | 0.286880 |

| stretch limit | stretch mute offset, m |
| --- | --- |
| 0.2 | 2047.359898 |
| 0.300000 | 2563.848741 |

## Reading the stretch

At 100 m the stretch is 0.000525, negligible. It climbs faster than the offset: 0.013036 at 500 m, 0.085080 at 1300 m, 0.286880 at 2500 m, so the far half of the gather carries almost all of it.

## Reading the mute

The two limits cut the gather differently. At a limit of 0.300000 the mute offset, 2563.848741 m, lies beyond the farthest offset of 2500 m, whose stretch of 0.286880 is under the limit, so every offset is kept. At a limit of 0.2 the mute offset is 2047.359898 m, and the offsets beyond it, including 2100 m at 0.209511 and 2500 m at 0.286880, are cut.

The choice of limit is a trade. A tighter limit keeps a cleaner waveform and loses the far offsets, and the far offsets carry the largest angles, which are the ones the gradient in AVO depends on. A looser limit keeps them and accepts a drawn-out event on the far traces. A study states the limit and reads the mute offset that follows.

## The time matters

The mute offset scales with v t0, so at a later time, or under a faster velocity, the same limit keeps more offsets. The engine returns the mute offset at a stated time and velocity, and a study reads it at its target.

## What it means for the two questions

For data quality, the stretch says which offsets still carry an undistorted event at the target. For the fluid question, it bounds the offsets, and so the angles, the AVO fit can use.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set View to "Gathers and their QC" and Data to "Ekene pack: gather 5". Set the event time to 1292 ms and the NMO velocity to the table's RMS velocity at that time, and read the stretch at each offset. Set the stretch limit to 0.2, then to 0.300000, and read the stretch mute offset for each. Then move the event time to 1100 ms and to 1500 ms, with the table's velocity at each, and predict before reading whether the mute offset rises or falls.
