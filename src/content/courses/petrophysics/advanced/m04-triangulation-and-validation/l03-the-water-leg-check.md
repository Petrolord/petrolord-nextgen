# The water-leg check

Triangulation delivered an Rw. Before that value is allowed anywhere near a booking, it faces one final validation: run the saturation equation over the interval you know is water and confirm it says so. This lesson performs that check on the typewell and, just as importantly, shows what the check looks like when the parameter set is wrong.

## The logic of the check

A water leg is, by interpretation, at $S_w = 1$. Archie with the correct parameters must therefore return saturations of 1 across it, within the noise of the measurements. Run Archie over the leg with your adopted Rw: values clustered tightly at 1 confirm the whole parameter set; values systematically away from 1 indict it. The check is circular for the Pickett route alone, since the fit was made on these very samples, but the adopted Rw now also carries the lab and SP routes, so unity in the leg confirms the triangulated value against the interval the triangle must explain.

## The typewell result

Run Archie over the water leg from 2075 to 2078 m using the Arps-corrected Rw of 0.049910 $\Omega\cdot m$ on neutron-density porosity, with $a = 1$, $m = 2$, $n = 2$. The engine returns, at each of the 6 valid samples from 2075.5 to 2078 m:

$$S_w = 0.99910$$

Every sample. The mean over the leg is 0.9991, and this is one of the six numbers the Expert capstone grades, with a tolerance of 0.005.

Two features of this result deserve attention. First, the values sit just below 1, not on it. The deficit is exactly the arithmetic of the small difference between the adopted 0.049910 and the 0.0500 the leg itself implies: Archie gives $S_w \propto \sqrt{R_w}$, and $\sqrt{0.049910/0.0500} = 0.99910$. The check is so clean that its tiny imperfection is itself fully explained. Second, the constancy matters as much as the level. All six samples return the same value because porosity and resistivity move together down the leg exactly as Archie at $S_w = 1$ demands. A leg where the computed saturations drift or scatter is telling you something (shale, invasion, a transition zone) even when the mean looks acceptable.

## The failure signature

Now run the same check with the raw, uncorrected sample value of 0.114 $\Omega\cdot m$. At the 2076 m sample the engine returns:

$$S_w = 1.5100$$

A water saturation of 151 percent is physically impossible, and that is precisely the point. The factor is $\sqrt{0.114/0.049910} = 1.5113$: the whole error in Rw, made visible in one number, in an interval where you know the truth.

Note carefully what the engine does with this value: nothing. It does not clamp it to 1. The clamp-free behaviour is a deliberate engine convention, because $S_w > 1$ is information. A library that silently caps saturations at 1 would have shown you a well-behaved water leg with the wrong Rw, and the error would have sailed through the check and into the booking. When you see saturations above 1, the reading is not "very wet rock"; the reading is "wrong parameters or bad data here", and the water leg is where that reading is unambiguous.

So the uncorrected Rw announces itself in the water leg before it ever corrupts a booking. This is the practical payoff of always carrying a known-water interval through your saturation work: it is a built-in alarm that costs nothing to check.

## Worked example

Verify the two headline numbers by hand:

1. Corrected check: $\sqrt{0.049910 / 0.0500} = \sqrt{0.99820} = 0.99910$. Matches the engine at every leg sample.
2. Failure check: $\sqrt{0.114 / 0.049910} = \sqrt{2.2841} = 1.5113$. A sample that reads 0.99910 with Rw = 0.049910 must therefore read $0.99910 \times 1.5113 = 1.5100$ with Rw = 0.114, which is the engine's value at 2076 m exactly.

The scaling rule $S_{w,2} = S_{w,1}\sqrt{R_{w,2}/R_{w,1}}$ is worth memorising: it converts any Archie saturation between candidate Rw values without recomputing from the logs.

## Exercise

A water leg evaluated with a candidate Rw of 0.080 $\Omega\cdot m$ returns saturations clustered at 1.26. Use the scaling rule to estimate the Rw the leg actually implies, and state what you would do next. As a self-check: the leg wants $S_w = 1$, so $R_w = 0.080 / 1.26^2 = 0.080/1.5876 = 0.0504\ \Omega\cdot m$; the candidate is roughly 1.6 times too resistive, the same failure signature as the typewell's raw sample, and the next step is to hunt the temperature or contamination error in whichever route produced 0.080.
