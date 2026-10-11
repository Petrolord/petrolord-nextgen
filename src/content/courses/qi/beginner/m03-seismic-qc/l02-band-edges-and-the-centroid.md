# Band edges and the centroid

A spectrum is a curve; a verdict needs a few numbers from it. The engine's spectrumStats reads four: the peak, the -6 dB edges, the -20 dB edges and the centroid. On the Ekene full stack, 120 spread traces in the window 800 to 1600 ms with taper 0.100000, the -6 dB band runs from 14.425434 to 34.787627 Hz, a bandwidth of 20.362193 Hz, and the centroid is 26.656573 Hz.

## The definitions

The -6 dB edges are where the amplitude falls to 10^(-6/20) of the peak amplitude, either side of the peak, interpolated linearly between frequency steps. The -20 dB edges are the same at 10^(-20/20). The -6 dB bandwidth is the high edge less the low edge. The centroid is the power-weighted mean frequency: the sum of f A(f)^2 over the sum of A(f)^2.

The -6 dB band holds the frequencies within 6 dB of the peak; the -20 dB band is the wider span read at the lower level. The centroid is the balance point of the power, so it moves when energy shifts from one side of the spectrum to the other, even when the peak stays put.

## Three windows

| window ms | peak Hz | centroid Hz | -6 dB low Hz | -6 dB high Hz | -6 dB bandwidth Hz | -20 dB low Hz | -20 dB high Hz |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 800 to 1600 | 31.374887 | 26.656573 | 14.425434 | 34.787627 | 20.362193 | 8.801471 | 47.968080 |
| 1600 to 2400 | 21.761176 | 23.361149 | 14.429678 | 32.581187 | 18.151509 | 7.272835 | 45.334861 |
| 800 to 2400 | 21.777034 | 26.095344 | 15.790410 | 34.601268 | 18.810858 | 8.340108 | 46.984080 |

The peak falls with depth, from the shallow window to the deep one, as the earth absorbs the higher frequencies. The centroid falls too. The -6 dB edges move less: the low edge barely shifts and the high edge comes down. The window that holds the Ekene Sand is the shallow one, and that is the window the verdict quotes.

Notice that the peak alone would mislead. In the full window the peak sits at 21.777034 Hz while the centroid is 26.095344 Hz: a spectrum with a broad top can put its single highest point well away from where its power is centred.

## The taper is a stated choice

The same traces and window at four taper fractions:

| taper | peak Hz | centroid Hz | -6 dB low Hz | -6 dB high Hz |
| --- | --- | --- | --- | --- |
| 0.000000 | 31.382353 | 26.750783 | 14.447432 | 34.727319 |
| 0.100000 | 31.374887 | 26.656573 | 14.425434 | 34.787627 |
| 0.250000 | 31.323187 | 26.618496 | 14.351787 | 35.006494 |
| 0.500000 | 22.305063 | 26.175193 | 14.308629 | 34.975851 |

The edges and the centroid move in the decimals. The peak jumps at the heaviest taper, from 31.323187 Hz to 22.305063 Hz. The top of the mean spectrum is broad, its tabled amplitudes within a few dB of the peak from 15.136719 to 29.785156 Hz, so a small change of shape can move the single highest point a long way. That is why the verdict quotes the band and the centroid and names the taper beside them.

## One trace is not a spectrum of the volume

The single trace at Ekene-1, same window and taper, reads peak 31.418177 Hz, centroid 26.664566 Hz, and -6 dB edges at 30.556053 and 32.127840 Hz. Its peak and centroid sit close to the mean's. Its -6 dB band is a sliver around the peak: a few reflectors make a single trace's spectrum spiky. Averaging many traces over the survey smooths it.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set Data to "Ekene pack: Ekene-1" and View to Seismic QC. Set the window to 800 to 1600 ms and read the Peak, Centroid and four edge tiles at "Taper fraction (stated)" 0.000000, 0.100000, 0.250000 and 0.500000. Then set the window to 1600 to 2400 ms at taper 0.100000. Write which figure is steadiest under the taper, which moves most with the window, and which three you would put in a verdict.
