# The rules of thumb compared

Several different numbers are quoted as the seismic resolution limit, and they disagree. This lesson puts them side by side against the model, works out why they differ, and gives a rule for which one to use.

## The four numbers at 25 Hz

| Name | Expression in two way time | At 25 Hz | Bed thickness at 2000 m/s |
| --- | --- | --- | --- |
| Modelled tuning thickness | argmax on a 2 ms grid | 16 ms | 16 m |
| Kallweit and Wood, exact | $\sqrt{6}/(2\pi f)$ | 15.5939 ms | 15.6 m |
| Kallweit and Wood, rule of thumb | $1/(2.6f)$ | 15.3846 ms | 15.4 m |
| Quarter wavelength | $1/(2f)$ | 20 ms | 20 m |

The first three agree with each other to within 4 percent. The fourth is 28 percent larger than the exact result, and it is the one most often quoted.

## Where the quarter wavelength rule comes from

The classic statement is that a bed can be resolved down to a quarter of a seismic wavelength. With $\lambda = V/f$, a quarter wavelength of bed at 2000 m/s and 25 Hz is 20 m, and the two way time across 20 m of that rock is 20 ms.

The rule is not wrong. It is a **different quantity**. It is a statement about the wavelength of a monochromatic wave and the point at which a half cycle of delay is accumulated across a bed, and it was formulated as a convenient approximation before the wavelet dependent result was worked out.

The Ricker's actual tuning thickness, expressed in wavelengths, is

$$\frac{V}{2}\cdot\frac{\sqrt{6}}{2\pi f} = \lambda\,\frac{\sqrt{6}}{4\pi} = 0.19492\,\lambda$$

which is $\lambda/5.13$ rather than $\lambda/4$. So for a Ricker wavelet the quarter wavelength rule is optimistic by 28 percent: it says beds down to 20 m can be resolved when the model says the limit is 16 m, and a 17 m bed would be claimed as resolvable when it is not.

## Where the Widess limit fits

A fourth figure, $\lambda/8$ or $1/(4f)$ in two way time, is often quoted as the limit of detectability rather than resolution. At 25 Hz that is 10 ms, or 10 m of bed.

The model can test it. At 10 ms the amplitude is 0.09975, comfortably measurable, and the apparent thickness reads 14 ms against a floor of 13.36 ms. So a 10 ms bed at 25 Hz is easily **detected** and cannot be **measured** by its waveform. That is exactly the distinction the two limits are drawing, and the model supports the pair of them: resolution near 16 ms, detection far below it.

The important part is that detection has no lower limit set by bandwidth at all. It is set by noise. A 2 ms bed at 25 Hz still produces an amplitude of 0.0243, which is 30 percent of the isolated level and would be visible on quiet data. The reason thin beds go unnoticed in practice is that their amplitude drops into the noise, not that the wavelet forbids them.

## Which one to use

**For anything quantitative, use the exact expression** $\sqrt{6}/(2\pi f)$, and say that it assumes a Ricker wavelet. If the wavelet is not a Ricker, the general result still holds and the tuning thickness is the wavelet's own peak to trough time, which can be measured off the extracted wavelet directly.

**For a quick sanity check in a meeting, $1/(2.6f)$ is fine.** It is 1.3 percent low and nobody will be misled.

**Avoid the quarter wavelength rule for resolution claims**, or state that it is being used. It is 28 percent generous, and 28 percent is the difference between committing to a target and not.

**Never use any of them without the velocity**, because all four are times and every decision they inform is about metres of rock.

## Worked example

An interpreter claims a survey with a 20 Hz dominant frequency can resolve a 22 m sand at 3000 m/s. Test the claim against both conventions.

Two way time thickness of the sand: $2 \times 22/3000 = 14.7$ ms.

Quarter wavelength rule: $1/(2 \times 20) = 25$ ms, so the sand at 14.7 ms is below the limit and would be judged unresolvable.

Exact Ricker tuning: $389.8484/20 = 19.5$ ms, so the sand at 14.7 ms is again below the limit.

Both conventions reject the claim, so it fails regardless of which is preferred. Had the sand been 30 m, at 20 ms of two way time, the quarter wavelength rule would still reject it while the exact rule would accept it, and that is the band where the choice of convention decides the answer.

## Exercise

At 35 Hz and an interval velocity of 3600 m/s, compute the tuning thickness in metres by the exact expression and by the quarter wavelength rule. State the range of bed thicknesses for which the two conventions disagree about whether the bed is resolvable.

As a self-check: the exact tuning thickness is $389.8484/35 = 11.14$ ms, which at 3600 m/s is $11.14 \times 10^{-3} \times 3600/2 = 20.05$ m, while the quarter wavelength rule gives $1/(2 \times 35) = 14.29$ ms, or 25.7 m. The two disagree for beds between about 20.1 m and 25.7 m, which the exact rule calls resolvable and the quarter wavelength rule calls too thin.
