# Conditioning before AVO

The Shuey fit reads three amplitudes at one sample and trusts that they are the same reflector, in the same place, with the same wavelet. Conditioning is the work that makes that more nearly true before the fit runs. QI Studio conditions its angle stacks in three steps: trim statics between the stacks; matching the stacks to each other in shift, phase and scale; and spectral balancing. The explorer runs none of them and the course grades none. Each step changes the amplitudes the fit reads, so a study records which it ran.

## How each step reaches A and B

- **Trim statics** shift one stack against another in time, which changes which part of the far wavelet sits under the near stack's peak, so the far amplitude moves.
- **Matching in shift, phase and scale** adjusts each stack towards the others. A scale applied to the far stack alone changes how far the far amplitude falls below the near, and that fall is what B measures. A scale applied to every stack alike moves A and B together and leaves their ratio.
- **Spectral balancing** brings the stacks' spectra towards one another, which changes each stack's amplitude at a sample as well.

A, the intercept, leans on the near stack and changes least when only the far stack is adjusted. B, the gradient, depends on the difference between near and far, and every step can move it.

## Where the course has already seen the need

| what the course measured | figure |
| --- | --- |
| residual at the far offset, gather 5, about the top (ms) | 2.795940 |
| near partial stack from gather 5 at 1292.000000 ms | 483.072830 |
| far partial stack from gather 5 at 1292.000000 ms | 320.449005 |
| the kit's near stack trace at Ekene-1, same time | 456.803711 |
| the kit's far stack trace at Ekene-1, same time | 220.203720 |

The gathers module measured a far-offset residual of 2.795940 ms on gather 5: the far traces do not sit exactly level with the near ones about the top. The angles module compared the gather's partial stacks with the kit's stack traces at Ekene-1 and found them closest at near and furthest apart at far. Neither says which version is right; both say the far amplitude is the fragile one, and conditioning adjusts it.

## What a study records

For every AVO figure it quotes, a study records whether trim statics were run and against which stack, whether the stacks were matched and in which of shift, phase and scale, and whether the spectra were balanced.

Two studies of one survey can quote different volumes at the same well because one conditioned its stacks. A disagreement at the wells sends the study back to this list.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Shuey fit and the background trend", on gather 5 with bin edges 5, 15, 25, 35, mean angles 10, 20, 30 and two terms. Read A and B at Sample time 1292 ms, then one sample earlier and one sample later, and record how far each moves in proportion. Then set View to "Angle gathers and partial stacks" at 1292 ms, set the far bin's partial stack beside the kit's far trace in the table, and say which of A and B a difference that size would move more.
