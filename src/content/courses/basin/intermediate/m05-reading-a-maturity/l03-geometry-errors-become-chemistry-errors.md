# Geometry errors become chemistry errors

The Associate tier closed by warning that skipping decompaction places old layers too shallow, and promised the cost would come due here. This lesson pays the bill: it traces how an error in burial geometry propagates through temperature into the kinetics, and shows why the exponential machinery amplifies rather than forgives it.

## The propagation chain

A maturity computation chains three stages. Burial geometry places a layer at a depth for each moment of history. The thermal model turns depth into temperature, through a gradient or a full column. The kinetics integrate that temperature track. Each stage's output is the next stage's input, so an error at the top rides the whole chain, and the chain's last stage is exponential in its input.

Take the canonical mistake: reconstructing a burial history from present-day thicknesses without decompaction. The Associate tier's table says 100 m of shale now at 1000 m was 159.79553483785466 m thick when at the surface; skipping restoration understates every older thickness, so every layer beneath sits too shallow throughout the early history, by hundreds of metres in a real stack.

## Pricing the error

Put numbers through the chain with this tier's tools. Suppose the geometry error leaves a source layer 300 m too shallow through its history, under a gradient of 30 degC per km: 9 degrees too cool, persistently.

Nine degrees at kitchen temperatures is not nine degrees' worth of answer. From module 1, rates at the reacting front multiply by about 5 per 10 degrees, so the layer's bins react at less than half their true rates through the entire history; the 20 degree walk of module 4 priced 20 degrees at a factor of 4.9 in conversion, so 9 degrees is roughly a factor of 2. Expect a TR understated by half, and a reflectance landing a band lower: a rock truly at mid-window Ro 0.99 reported near 0.85. On the crossing table, 9 degrees is more than half the spread that separates a 3 degC per Ma basin from a 10 degC per Ma one; a geometry slip masquerades as a wrong heating-rate diagnosis.

The direction is systematic, not random. Compaction always thins with depth, so skipping decompaction always under-buries the past, always cools it, always understates maturity. Errors that share a sign across a whole basin do not average out; they bias every source interval the same way.

## Where calibration catches it, and where it cannot

Measured reflectances are the safety net: a model that under-buries history will sit below its calibration wells, and the modeller will notice. The trap is what happens next. The tempting fix is to raise heat flow until the model matches, and it will match, because more heat can imitate more burial over most of a profile. Now two errors cancel at the calibration well and disagree everywhere else: away from the well, in the flanks where burial differs, the compensating heat is wrong. The honest fix is upstream, in the geometry, which is why this course put decompaction two tiers below and made it graded.

The Expert tier sharpens this once more: its erosion signature is read from reflectance that a correct geometry, including a vanished section, explains and a wrong one cannot.

## Worked example

A model under-buries a source by 300 m as above, and the modeller compensates with heat flow until Ro matches at the calibration well. State two places the compensation fails. First, timing: the compensated model reaches every maturity state at wrong dates, since its temperature history has a different shape, so generation-versus-trap timing is corrupted even where present Ro fits. Second, elsewhere: at a flank location where the missing decompaction error is 150 m rather than 300, the boosted heat overshoots, predicting maturity too high by roughly the square root of the well's original deficit in conversion terms. A calibrated-but-wrong model is wrong with confidence.

## Exercise

State the chain from thickness error to reflectance error in four arrows, with the amplifying step named. Then answer in one sentence: why does the sign of the decompaction error matter as much as its size?

As a self check: understated thickness, then under-buried depths, then a too-cool temperature track, then exponentially under-run kinetics, the amplification living in the Arrhenius step where 10 degrees is a factor of about five in rate. The sign matters because skipping decompaction biases every layer the same direction, too shallow and too cool, so the errors reinforce across the section instead of cancelling, and the whole basin's maturity is shifted rather than blurred.
