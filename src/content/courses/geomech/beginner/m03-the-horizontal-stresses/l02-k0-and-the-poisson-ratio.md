# k0, and the Poisson ratio

One number that carries the whole burial part of the estimate.

{{panel:gm-stress-explorer}}

## The relationship

    k0 = nu / (1 - nu)

with nu the Poisson ratio. That is the ratio of horizontal to vertical effective stress in a linearly elastic rock under uniaxial strain.

## Where it comes from

Elasticity. Compress a block vertically and it wants to expand sideways by nu times the vertical strain. Prevent that expansion and the stress required to prevent it is exactly k0 times the vertical effective stress.

Two lines of algebra from Hooke's law, and no rock physics beyond it.

## What the numbers look like

| Poisson ratio | k0 |
|---|---|
| 0.15 | 0.17647058823529413 |
| 0.20 | 0.25 |
| 0.25 | 0.3333333333333333 |
| 0.28 | 0.38888888888888895 |
| 0.35 | 0.5384615384615384 |
| 0.45 | 0.8181818181818182 |

The published runs use 0.28, giving 0.38888888888888895.

## What it means physically

k0 below 1 always. A rock loaded from above by burial alone carries less horizontal effective stress than vertical, which is what the normal faulting regime means.

k0 approaches 1 as the Poisson ratio approaches 0.5, which is an incompressible material. Salt is the extreme case: it flows, so it cannot sustain a stress difference at all, and its horizontal stress equals its vertical one.

## The sensitivity

k0 is not linear in nu, and it is increasingly sensitive as nu rises. Going from 0.20 to 0.25 adds 0.083 to k0. Going from 0.40 to 0.45 adds 0.152.

So a Poisson ratio uncertainty matters more in shale, where nu is high, than in sandstone, where it is low.

## Where the Poisson ratio comes from

From sonic logs, if a shear log was run: nu follows from the ratio of compressional to shear velocity. From the lithology seeds, if it was not.

This course's seeds are 0.20 for sandstone, 0.35 for shale, 0.30 for limestone, 0.28 for dolomite and 0.25 for salt. Those are starting values for a screening run, and module 4 says exactly how much weight to put on them.

## An override that exists for a reason

The engine accepts a k0 directly, bypassing the Poisson ratio. That is there because k0 is sometimes calibrated from field data as a single number, and forcing it through a Poisson ratio would be inventing a rock property that was never measured.

## Exercise

Compute k0 for each of the five lithology seeds.

Then say which two of the five would give horizontal stresses closest together, and explain why that follows from what the rocks are.
