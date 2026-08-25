# The saturation bucket

Generated hydrocarbon does not leave the source rock immediately. The rock holds what it makes until it cannot, and the model's rule for "cannot" is a saturation bucket. This lesson derives the bucket, tracks it through the basin's life, and establishes the one behaviour that makes the next lesson possible: the bucket shrinks as the rock compacts.

## The retention cap

The source retains hydrocarbons up to a pore-volume cap per square metre of basin:

$$C = H \times \bar{\phi} \times S \times \rho_{HC}$$

with H the layer's current thickness, $\bar\phi$ its average porosity, the mean of its top and bottom Athy values, S the expulsion saturation threshold, 0.1 in the spec, and $\rho_{HC}$ the reference hydrocarbon density, 850 kg/m3. In words: the rock can hold hydrocarbon filling ten percent of its pore space, at 850 kilograms per cubic metre, and everything generated beyond that is expelled.

The physical picture behind S: at low saturations, oil in a water-wet source is disconnected and immobile; around ten percent it forms connected pathways and primary migration begins. One number for a complicated pore-scale story, which is exactly the kind of simplification version-one models should make loudly rather than quietly.

## The cap through time

Every factor of the cap except the constants moves with burial, so the bucket is a function of geometry. At deposition, 140 Ma: the source is 728.8203220981025 m thick at surface porosities averaging about 0.53, and the cap is 32970.394 kg/m2, a bucket bigger than the entire generative potential. Nothing this rock could ever make would leave it at surface conditions.

By 80 Ma, at present geometry, 400 m and $\bar\phi$ 0.13712772956463615: the cap is 4662.34280519763. Compaction shrank the bucket sevenfold. During the phantom decade, deeper and thinner still, 390.577400265013 m at $\bar\phi$ 0.11620882968385332: cap 3858.026119789524. At the 10 Ma rebound, back to 4662.34280519763.

Read the trend as a sentence: burial makes sources leakier. The same process that cooks the kerogen crushes the storage, so deep kitchens both generate more and retain proportionally less, and the two effects compound in charge's favour.

## Expulsion begins

Expelled mass at any step is generated mass minus the cap, when positive. Through the long shallow youth, generation is trivial against a huge bucket: nothing moves. At 80 Ma the Upper Shale lands, and in one step generation jumps to 5054.728 while the cap drops to 4662.343: the excess, 392.38532834076887 kg/m2, is the basin's first expelled hydrocarbon. Deposition of the seal triggered the charge, both by heating the source and by squeezing its bucket in the same step, an elegant compression of what the real basin did across megayears.

From there expulsion tracks generation minus 4662.343 through the quiet middle age: 7735.058 by 60 Ma, 8658.608 by 21 Ma. Then the phantom decade changes the cap, and the next lesson owns what happens.

## Worked example

Verify the present-day cap from its factors, then state today's retained mass. $\bar\phi$: the mean of $0.63 e^{-0.00051 \times 2800} = 0.15071$ and $0.63 e^{-0.00051 \times 3200} = 0.12354$ is 0.13713; cap $= 400 \times 0.13713 \times 0.1 \times 850 = 4662.4$, engine 4662.34280519763. Retained today: generated minus expelled, $13946.54641524398 - 10048.985378825158 = 3897.561036418822$ kg/m2, which sits below the 4662 cap; why the rock is not full to its brim is the next lesson's punchline.

## Exercise

Write the cap formula with the fixture's constants named, and compute the cap for the source at 140 Ma geometry using $\bar\phi = 0.5296$. Then answer in one sentence: why does burial make a source rock leakier even as it makes it more productive?

As a self check: $C = H \bar\phi \times 0.1 \times 850$; at deposition, $728.8203220981025 \times 0.5296 \times 85 = 32810$, within the porosity rounding of the engine's 32970.394. Burial shrinks both thickness and porosity, the two variable factors of the cap, while simultaneously raising temperature and hence generation, so the bucket shrinks exactly as the stream into it swells.
