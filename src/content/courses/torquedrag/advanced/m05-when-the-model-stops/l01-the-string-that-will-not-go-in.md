# The string that will not go in

The negative hookload, revisited with the buckling limits in hand.

{{panel:td-string-explorer}}

## The case

The horizontal well, tripping in. Hookload -16676.68507494847 N, minimum tension -281944.752574833 N, buckling flagged from 0 m.

The Associate tier read that as "the string will not go in". Now there is enough machinery to say what actually happens.

## Against the limits

At 90 degrees in the 0.2159 m open hole, this drill pipe's sinusoidal limit is a little over 170 kN and its helical limit a little over 310 kN.

The minimum tension is -281944.752574833 N, which is 282 kN of compression: past the sinusoidal limit by a wide margin and approaching the helical one.

So the pipe in the worst part of that string is snaking along the low side, and parts of it are close to wrapping.

## What the model got wrong

Once the pipe is snaking, its contact with the wall is longer and its contact force is higher than a straight pipe's. The friction is therefore higher than the model computed.

So the real hookload is MORE negative than -16676.68507494847 N. The model's answer is the optimistic end of a range whose other end it cannot see.

## The slide-drilling case

Minimum tension -422023.82665557245 N, which is well past the helical limit.

There the string is wrapped, the contact force includes a large outward component, and the friction is far above what the model used. The reported hookload of -156755.75915568782 N is not an estimate of anything; it is what the arithmetic returns after the physics has been left behind.

## Why the model does not just refuse

Because a model that refuses to return a number when it detects buckling is much less useful than one that returns a number and a flag.

Buckling is common. Sinusoidal buckling near the bit happens on most wells with weight on bit and it is not a problem. Refusing to compute would make the tool unusable for the ordinary case in order to protect against the extreme one.

The flag plus the depth is the right output, and the reading of it is a skill rather than a rule.

## The reading

**Compression below the sinusoidal limit:** the answer is good.

**Between the limits:** the answer is optimistic by a modest amount, and the further past, the worse.

**Above the helical limit:** the answer is not usable, and the question has changed from "what is the hookload" to "will this string go in at all".

## Exercise

For the horizontal well tripping in, find the depth interval over which the compression exceeds the sinusoidal limit.

Then say what fraction of the lateral that is, and whether you would run the string on the strength of the model's hookload.
