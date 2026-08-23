# Frequency and resolution

The Ricker has one adjustable number, its dominant frequency. This lesson works out what that number controls, and then checks the expectation against what the engine actually produces on the teaching well. The check does not go the way most people guess.

## Frequency sets the length of the pulse

Higher dominant frequency means a **shorter** wavelet. Lower dominant frequency means a **longer** one. The formula from lesson 2 makes this exact: frequency and time enter it only as the product $f t$, so doubling the frequency squeezes the same shape into half the time.

Put numbers on it with the dominant period, $1/f$. At 40 Hz that is $1/40 = 0.025$ s, or 25 ms. At 25 Hz it is 40 ms, and at 15 Hz about 67 ms. The 40 Hz wavelet therefore packs its peak and both side lobes into a fraction of the window, while the 15 Hz wavelet spreads across most of it, even though both arrays are the same 61 samples long.

Shorter pulse means finer **resolution**. Two reflections must be separated by roughly the length of the wavelet before their copies stop overlapping, so a shorter wavelet lets you distinguish reflections that a longer one blends into a single event. That is why the high frequency end of the spectrum is defended so carefully in processing.

Lower frequency does the opposite. The longer wavelet **smears**: each copy reaches further in time, more copies overlap, and fine layering that the reflectivity series contains cannot be separated on the trace. Low frequency data looks smoother, and interpreters sometimes read that smoothness as reliability. It is detail that has been averaged away.

## What the engine gives on the teaching well

Now run the same well through the same pipeline three times, changing only the dominant frequency. The reflectivity series is identical in all three runs, since nothing about the earth has changed. Only the wavelet differs. The engine reports the strongest amplitude in the synthetic as:

| Dominant frequency | Strongest amplitude | Time |
| --- | --- | --- |
| 15 Hz | 0.157315 | 1580 ms |
| 25 Hz | 0.073005 | 1642 ms |
| 40 Hz | 0.036223 | 1646 ms |

Read the amplitude column before reading anything else into it. The **lowest** frequency gives the **largest** peak. From 15 Hz to 25 Hz the strongest amplitude falls by a factor of $0.157315 / 0.073005 = 2.15$. From 25 Hz to 40 Hz it falls again, by $0.073005 / 0.036223 = 2.02$. Across the full range the drop is a factor of $0.157315 / 0.036223 = 4.34$.

## Why the naive expectation fails

The naive expectation is that higher frequency gives bigger, sharper events, because higher frequency sounds like better data. The table says otherwise, and the reason is the summing from lesson 3.

The largest single reflection coefficient in this well is 0.017688 in absolute value. Every one of the three peak amplitudes above exceeds it: 0.036223 is about twice it, 0.073005 about four times it, and 0.157315 nearly nine times it. No single reflection produces any of these numbers. In every case the trace is adding many wavelet copies together.

How much they add depends on how much they overlap, and overlap depends on wavelet length. The 15 Hz wavelet is long, so at any given sample it collects contributions from reflections spread over a wide span of time. Where those contributions share a sign they reinforce, and the sum is large. The 40 Hz wavelet is short, so each sample collects from a narrow neighbourhood only, fewer copies participate, and the sum stays closer to the individual coefficients that made it.

So the low frequency synthetic is brighter, and it is brighter for a reason that should make you cautious rather than pleased: it is brighter because it has blurred more reflections together.

## Resolution and amplitude are different things

That is the general lesson, and it survives beyond this well.

**Resolution** is about separating events, and higher frequency always helps. On the 40 Hz synthetic you can see structure in the logged interval that the 15 Hz synthetic merges into broad humps.

**Amplitude** is about how much energy piles up at a sample, and higher frequency does not always help. It often hurts, because narrowing the wavelet reduces the constructive summing that produced the large numbers in the first place.

Notice the times as well as the amplitudes. The 25 Hz and 40 Hz peaks land at 1642 ms and 1646 ms, within 4 ms of each other, while the 15 Hz peak lands 62 ms earlier at 1580 ms. Changing nothing but the wavelet moved the brightest part of the trace to a different part of the well. It marks wherever this particular wavelet happened to sum most effectively, not the most significant interface.

The next lesson takes the 25 Hz case apart, because the gap between where its peak sits and where the strongest reflection coefficient sits is what the capstone asks you to explain.

Try it yourself: the panel below builds the synthetic from the teaching well at a frequency you choose.

{{panel:sl-synthetic-explorer}}

## Exercise

Predict, before checking, whether a 60 Hz synthetic on this well would give a strongest amplitude above or below 0.036223, and give your reason in one sentence. Then state which of the three synthetics in the table you would choose to separate two interfaces 20 ms apart.

As a self-check: 60 Hz should give a smaller strongest amplitude than the 40 Hz value of 0.036223, because a still shorter wavelet lets fewer neighbouring reflections contribute to any one sample and so reduces constructive summing, continuing the trend from 0.157315 to 0.073005 to 0.036223. For separating interfaces 20 ms apart you choose 40 Hz, whose dominant period of 25 ms gives the shortest wavelet of the three and therefore the best chance of showing two events rather than one blended one.
