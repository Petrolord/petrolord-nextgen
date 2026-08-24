# The wedge panel map

The panel below runs the model described in the previous lesson and reports everything this tier measures. This lesson is a map of it: what each control does, what each reading means, and which of them the capstone asks for. Nothing here is graded on its own, but every graded field is read from this panel, so time spent learning where things are is time not spent hunting later.

{{panel:sl-wedge-explorer}}

## The two controls

**Frequency** selects the wavelet. Five values are offered: 15, 20, 25, 40 and 50 Hz. The capstone reads 25 and 40. The other three are there because module 4 needs them to demonstrate a result that two frequencies alone cannot establish.

**Thickness** selects one trace out of the 31 in the panel. It changes the lower half of the display and four of the tiles. It does not change the tuning curve, the tuning thickness or the tuning amplitude, because those are properties of the whole panel rather than of one trace. If you move the thickness slider and expect the tuning thickness to follow, the tier has not landed yet.

## The upper chart: the tuning curve

Amplitude on the vertical axis, bed thickness on the horizontal. Each point is one trace. The curve begins at zero on the left, because at zero thickness the equal and opposite coefficients cancel. It rises to a maximum, falls away, and flattens onto a dashed line at the right hand end.

Two markers sit on it. The **filled marker** is the tuning point, the thickness at which the amplitude is largest. The **dashed horizontal line** is the isolated reflector level, the amplitude the top interface produces once the base is too far away to contribute, which is the top coefficient itself.

The ratio between the marker and the dashed line is the whole tuning effect in one glance. At 25 Hz the peak stands about 1.44 times the isolated level, which means a bed at tuning thickness looks 44 percent brighter than the same interface would look if the bed were thick.

## The lower chart: the selected trace

The composite trace for the thickness you selected, plotted against two way time. The top interface at 60 ms is marked with a vertical line, and the position of the base reflection is marked with a second one.

Watch two things as you move the slider. First, on thick beds the trace shows a clean peak at the top line and a clean trough at the base line, and the two are plainly separate events. As you thin the bed, they slide toward each other, merge, and eventually there is one event with no honest way to say where the base is. Second, on the thinnest beds the peak of the merged event is not on the top line at all. It sits slightly to the left of it.

## The tiles

Twelve readings sit under the charts.

The first six describe the **whole panel** at the selected frequency and do not respond to the thickness slider.

- **Tuning thickness**, the horizontal position of the filled marker. Two of these are capstone fields, at 25 and at 40 Hz, and both are graded exactly.
- **Amplitude at tuning**, the vertical position of the marker. Two more capstone fields.
- **Theoretical tuning thickness**, $\sqrt{6}/(2\pi f)$ in milliseconds, calculated rather than measured. One capstone field, at 25 Hz.
- **Grid overshoot**, the measured tuning thickness minus the theoretical one. Module 5 is about this tile.
- **Frequency times tuning thickness**, in units of Hz times ms. Module 4 is about this tile, and it is the one reading on the panel that most learners walk past.
- **Isolated reflector amplitude**, the dashed line, read at the thick end of the panel. One capstone field, at 25 Hz.

The remaining six respond to the **thickness slider**.

- **Selected thickness** and **amplitude at that thickness**, which are the coordinates of the point you are sitting on.
- **Amplitude relative to isolated**, the same amplitude divided by the dashed line, so 1.00 means the bed is behaving as though the base were not there.
- **Peak time relative to the top interface**, in milliseconds, negative when the peak arrives early. On thick beds it reads 0. On thin beds it does not.
- **Apparent thickness**, the time from the peak of the composite to its trough. On thick beds this equals the true thickness. On thin beds it does not, and module 4 shows that it has a floor it cannot go below.
- **Wavelet frequency**, repeated here so that a screenshot of the tiles carries its own conditions.

## A first pass to run now

Set the frequency to 25 Hz and the thickness to 60 ms. Read the amplitude and confirm it matches the isolated line. Now walk the thickness down in steps and watch the amplitude rise rather than fall, which is the entire counterintuitive core of this tier. Stop at 16 ms and read the four panel level tiles. Then take the thickness to 2 ms and look at the peak time tile, which will not be zero.

That sequence takes about a minute and produces four of the six capstone fields. The rest of the tier explains why each of them is what it is.

## Exercise

With the frequency at 25 Hz, find two different thicknesses whose amplitudes agree to three decimal places, one below the tuning thickness and one above it. Record both, then state in one sentence what that pair means for anyone reading a thickness off an amplitude map.

As a self-check: 10 ms gives 0.09975 and a thickness between 22 and 24 ms gives the same value to three decimals, and the pair means an amplitude alone cannot distinguish a bed thinner than tuning from a bed thicker than tuning, so a brightness map has two possible thickness readings at every point unless something independent breaks the tie.
