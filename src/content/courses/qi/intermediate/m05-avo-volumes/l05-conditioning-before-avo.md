# Conditioning before AVO

The Shuey fit reads three amplitudes at one sample and trusts that they are the same reflector, in the same place, with the same wavelet. Conditioning is the work that makes that more nearly true before the fit runs. QI Studio conditions its angle stacks with three steps, in the engines' conditioning file: trim statics between the stacks; matching the stacks to each other in shift, phase and scale; and spectral balancing. The course's explorer runs none of them and grades none of them. Each step changes the amplitudes the fit reads, so a study records which it ran.

## How each step reaches A and B

- **Trim statics** shift one stack against another in time. The fit reads the near, mid and far stacks at one sample, so a shift changes which part of the far wavelet sits under the near stack's peak, and the far amplitude moves.
- **Matching in shift, phase and scale** adjusts each stack towards the others. A scale applied to the far stack alone changes how far the far amplitude falls below the near, and that fall is what B measures. A scale applied to every stack alike moves A and B together and leaves their ratio.
- **Spectral balancing** brings the stacks' spectra towards one another. Changing a stack's spectrum changes its amplitude at a sample as well.

A, the intercept, leans on the near stack and changes least when only the far stack is adjusted. B, the gradient, depends on the difference between near and far, and every step can move it.

## Where the course has already seen the need

| what the course measured | figure |
| --- | --- |
| residual at the far offset, gather 5, about the top (ms) | 2.795940 |
| near partial stack from gather 5 at 1292.000000 ms | 483.072830 |
| far partial stack from gather 5 at 1292.000000 ms | 320.449005 |
| the kit's near stack trace at Ekene-1, same time | 456.803711 |
| the kit's far stack trace at Ekene-1, same time | 220.203720 |

The gathers module found residual moveout on every pack gather, measured by AB semblance, with the far-offset residual on gather 5 at 2.795940 ms: the far traces do not sit exactly level with the near ones about the top. The angles module compared the gather's partial stacks with the kit's stack traces at Ekene-1 and found them closest at near and furthest apart at far. Neither comparison says which version is right. Both say that the far amplitude is the fragile one, and the far amplitude is what conditioning adjusts.

## What a study records

A study records, for every AVO figure it quotes:

- whether trim statics were run between the stacks, and against which stack;
- whether the stacks were matched, and in which of shift, phase and scale;
- whether the spectra were balanced.

Two studies of the same survey can quote different intercept and gradient volumes at the same well because one conditioned its stacks and the other did not. The AVO at the wells module compares the seismic A and B with modelled ones, and a disagreement there sends the study back to this list.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, open the AVO view on the Ekene pack's near, mid and far stack traces at Ekene-1, two terms at 10, 20 and 30 degrees, at 1292 ms. Read A and B. Then type the three amplitudes into the stated-amplitude controls, raise and lower the far one alone, and record how A and B move. Multiply all three by the same factor and say what happens to the ratio of B to A.
