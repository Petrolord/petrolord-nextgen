# Comparing wavelets across wells

Four wells give four statistical wavelets, and a field wavelet is only defensible when they agree. The comparison measures how alike they are in shape, after removing any time offset and any difference in strength, and returns one figure for every pair.

## The comparison

`compareWavelets` takes the first wavelet as the reference. Every other wavelet is aligned to it by the lag, up to a stated 5 samples, at which their correlation is largest. All are then scaled to unit energy, and the zero-lag correlation of every pair is their similarity. A similarity of 1 means the same shape.

## The four spectra, again

| well | peak Hz | centroid Hz |
| --- | --- | --- |
| Ekene-1 | 24.488746 | 25.084884 |
| Ekene-2 | 23.394907 | 23.431642 |
| Ekene-3 | 24.962688 | 25.605164 |
| Ekene-4 | 26.530951 | 26.581599 |

## The similarity of every pair

| well | lag to the reference, samples | Ekene-1 | Ekene-2 | Ekene-3 | Ekene-4 |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | 0 | 1.000000 | 0.996488 | 0.999524 | 0.996130 |
| Ekene-2 | 0 | 0.996488 | 1.000000 | 0.994059 | 0.986771 |
| Ekene-3 | 0 | 0.999524 | 0.994059 | 1.000000 | 0.998211 |
| Ekene-4 | 0 | 0.996130 | 0.986771 | 0.998211 | 1.000000 |

## Reading the matrix

Every lag is zero. Each statistical wavelet is zero phase by construction and centred on its middle sample, so the alignment has nothing to correct, and here it moved nothing.

The diagonal is 1.000000, each wavelet against itself. The most alike pair is Ekene-1 with Ekene-3, at 0.999524; their spectra were the closest pair too. The least alike is Ekene-2 with Ekene-4, at 0.986771, the two wells whose spectra lay at the two ends of the range, Ekene-2 lowest in frequency and Ekene-4 highest. The matrix and the spectra tell one story: four wavelets of one family, differing a little in frequency from well to well.

## What similarity measures

Unit energy removes strength, so a wavelet twice as strong as another of the same shape scores the same. The alignment removes a time offset of up to the stated lag. What is left is shape: the width of the main lobe, the side lobes and the phase. A difference in frequency changes the width and lowers the figure a little, which is what the table shows. A difference in phase changes the shape more, and the lesson on a disagreeing well rotates one wavelet to show how much.

## What it does not measure

Similarity says nothing about whether any of the wavelets is right. Four wavelets sharing the same phase error compare as well as four correct ones. The phase check of the first module and the tie correlations of this one answer that, well by well; the comparison answers only whether one wavelet can serve all four.

## The choices the comparison states

The reference well, the maximum lag and the wavelets themselves, which carry their own stated window, length and smoothing. A study that changes any of them reports a different matrix, and names what it used.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set View to "Wavelets and the tie" and Data to the Ekene pack with all four wells, statistical wavelets over the window 1100 to 1500 ms, and the comparison's maximum lag set to 5 samples. Read the lags and the similarity of every pair. Put Ekene-4 first as the reference and read the matrix again. Then set the maximum lag to 0 and say whether anything changes, and why from the lags you read.
