# Amplitude and thickness together

An amplitude map over a prospect mixes two things: how strong the interface contrast is and how thick the bed is. This lesson is about separating them, and about what happens when nobody does.

## The two contributions

A recorded amplitude at the top of a bed is approximately

$$\text{amplitude} \approx R_{top} \times g(T)$$

where $R_{top}$ is the interface reflection coefficient and $g$ is the tuning function, which is 1 for a thick bed, rises to 1.4449 at tuning, and falls to zero as the bed vanishes.

The rock physics of the previous four modules computes $R_{top}$. The wedge model computes $g$. A survey measures their product.

## Why that is a problem for mapping

Consider a prospect whose reservoir thins from 40 m at its centre to 5 m at its edge, with identical rock and fluid throughout.

At 25 Hz in a 2900 m/s sand, 40 m is 27.6 ms and 5 m is 3.4 ms. The first is just above tuning and the second is well below it.

So the amplitude at the centre is close to the interface value and at the edge is a fraction of it, and an amplitude map would show a strong centre fading to nothing at the rim.

Read as a fluid map, that says the hydrocarbon is concentrated in the middle and dies at the edges. Read correctly, it says the reservoir is thinning and the rock is identical throughout.

The two readings imply completely different volumes and completely different well locations.

## The other direction

Now consider a reservoir that thickens from 10 m to 23 m across a prospect.

Ten metres is 6.9 ms, well below tuning, and 23 m is 15.9 ms, right at it. So the amplitude would rise across the prospect and peak where the reservoir happens to hit tuning thickness.

An amplitude map would show a bright rim or a bright arc that has nothing to do with the fluid at all. Those are common and they are called tuning artefacts, and they are the reason amplitude maps are usually accompanied by isochron maps.

## The correction

The standard approach is to model the tuning function for the survey's wavelet, map the bed thickness from the seismic isochron, and divide the observed amplitude by $g(T)$ at each location.

Two cautions attach to that.

The isochron is itself measured from the same data, and below tuning the apparent thickness stops tracking the true thickness, so the correction becomes least reliable exactly where it is most needed.

And the correction assumes the tuning function computed for an equal and opposite pair applies, which requires the base reflection to be roughly the negative of the top. Where the rock below the reservoir is different from the rock above, that is not true and the wedge model needs rebuilding with the actual pair.

## What to report

An amplitude study of a prospect should state the tuning thickness for the survey, the range of reservoir thicknesses expected, and whether any part of the prospect is below tuning.

At Ekene, with tuning at 16 ms and a gas sand at 2905.7 m/s, that threshold is 23.2 m. A prospect expected to hold 15 to 30 m of net sand straddles it, and the amplitude variation across it would be substantially thickness driven.

## Worked example

Work out the amplitude ratio between two parts of a prospect that differ only in thickness.

Take a thick part at 30 ms, where the tuning curve reads 0.10392113029956818, and a thin part at 8 ms, where it reads 0.10745733231306076.

Those are almost the same, which is the first surprise: an 8 ms bed and a 30 ms bed record nearly the same amplitude, because the thin one is on the rising limb near tuning and the thick one has settled to the isolated value.

Now take a part at 2 ms, where the curve reads 0.030337944626808167. That is 29 percent of the 30 ms value.

So across the same prospect, with identical rock, the amplitude ranges from 29 percent to 139 percent of the isolated value depending on thickness alone. Any fluid interpretation of that variation is unfounded.

## Exercise

A prospect shows a bright amplitude ring around a dimmer centre. State two explanations and how you would distinguish them.

Self check: the ring could be a fluid effect, with hydrocarbon trapped in a rim, or a tuning artefact where the reservoir passes through tuning thickness at that radius while being thicker in the centre. Distinguish them by mapping the isochron: if the bright ring coincides with the contour where the reservoir thickness equals the tuning thickness for the survey, it is a tuning artefact, and if the thickness varies smoothly through the ring without a coincidence, the fluid explanation survives.
