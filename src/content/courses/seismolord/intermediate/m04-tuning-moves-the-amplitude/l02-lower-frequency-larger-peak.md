# Lower frequency larger peak

Here is the experiment lesson 1 set up. One well, one reflectivity series, three wavelets. The only thing that differs between the runs is the dominant frequency of the Ricker.

## The three numbers

The engine reports the strongest amplitude anywhere on the synthetic trace as follows.

| Dominant frequency | Strongest synthetic amplitude |
| --- | --- |
| 15 Hz | 0.1573149710893631 |
| 25 Hz | 0.07300488650798798 |
| 40 Hz | 0.0362229160964489 |

Read the column downward before you interpret it. As the frequency rises from 15 Hz to 25 Hz to 40 Hz, the strongest amplitude falls at every step. The lowest frequency produces the largest peak and the highest frequency produces the smallest.

The size of the effect matters as much as its direction. Divide the ends of the column into each other and the 15 Hz peak is over four times the 40 Hz peak. That is not a subtlety at the edge of the measurement. It is the difference between an event you would flag on a map and an event you would scroll past.

## Why this is a graded pair, and what the middle one is for

Two of these three numbers, the 15 Hz value of 0.1573149710893631 and the 40 Hz value of 0.0362229160964489, are graded in the capstone. They are graded together and deliberately so, because either one on its own is just a number. The pair is the finding.

The 25 Hz value of 0.07300488650798798 is not graded, and it earns its place here anyway. It sits between the other two, which tells you the effect is not a quirk of the two endpoints. Line all three up and you have a monotonic trend: raise the frequency, the peak falls, every time, with no reversal in the middle. A two point result could be a coincidence of where the wavelets happened to land. A three point trend that runs consistently in one direction is a mechanism.

Look at the steps as well as the ends. From 15 Hz to 25 Hz the peak drops by rather more than half. From 25 Hz to 40 Hz it drops by about half again. Neither step is a small correction, so there is no frequency range in the middle of this experiment where the choice of wavelet stops mattering.

## What has not changed

This is the half of the result people skip, so state it plainly.

The reflection coefficients are byte for byte identical across all three runs. They come from the same sonic curve and the same density curve, through the same impedance calculation and the same contrast arithmetic. No coefficient changed size. No coefficient changed sign. No coefficient moved in time. The count is the same.

The time and depth relationship is the same in all three runs, so nothing has been re-timed. The sample rate is the same 2 ms. The trace grid is the same. The well is the same well.

One input changed. One output changed by a factor of over four.

## What you can and cannot conclude from that

You can conclude that the peak amplitude on this trace is not measuring the strength of the strongest interface in the well, because the strength of that interface was constant while the number moved by a factor of over four.

You can conclude that comparing amplitudes between two datasets processed to different bandwidths is not a comparison of rock properties unless something has been done to make the wavelets comparable.

You cannot yet conclude why the effect runs in this direction. Most people, asked in advance, predict the opposite: higher frequency sounds like better data, sharper events, stronger reflections. The table says the reverse. Lesson 3 explains it, and the explanation is a straight consequence of what you learned about interference at the Associate tier.

And you cannot conclude anything about the peak's position from this table, because the table does not show it. It shows amplitudes only. Whether the peak stays in the same place on the trace as the frequency changes is a separate question, and lesson 4 will point you at it.

## A note on the digits

The values are quoted here at full engine precision. That is deliberate, because the capstone checks these two against tolerances of 0.002 at 15 Hz and 0.001 at 40 Hz, and you should get used to seeing where a graded number came from rather than a rounded version of it.

Do not read the long strings as claims of accuracy about the earth. They are exactly what a floating point calculation produced from this well, this time and depth function and this wavelet. The finding lives in the first two digits and in the ratio between the ends of the column, not in the fifteenth decimal place.

The panel below runs the same synthetic and lets you set the wavelet frequency yourself.

{{panel:sl-shift-explorer}}

## Exercise

Using the panel, set the frequency to 15 Hz and note the strongest amplitude, then set it to 40 Hz and note it again. Confirm the ratio between them for yourself. Then predict what a 10 Hz wavelet would do to the peak amplitude relative to the 15 Hz value, and say in one sentence what evidence in the table supports your prediction. Finally, write down what stayed constant across all of these runs.

As a self-check: the strongest amplitude is 0.1573149710893631 at 15 Hz and 0.0362229160964489 at 40 Hz, so the low frequency peak is over four times the high frequency one, with 0.07300488650798798 at 25 Hz sitting between them. A 10 Hz wavelet should give a peak larger than 0.1573149710893631, because the three points in the table fall consistently as frequency rises with no reversal, so extending the trend below 15 Hz predicts a further rise. What stayed constant is everything except the wavelet: the same well, the same sonic and density curves, the same impedance, the same reflection coefficients in the same places with the same signs and sizes, the same time and depth relationship, and the same 2 ms sample rate.
