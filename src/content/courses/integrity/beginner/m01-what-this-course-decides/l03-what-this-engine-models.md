# What this engine models

Six calculations, two engine files, one subject. This is the map you will be working inside for the rest of the course.

## The status half

**Envelope rollup.** You hand it a list of barrier elements, each with a status. It returns one status for the envelope. The rule is that the worst element wins, and an element nobody has tested counts as degradation rather than as nothing.

**Well categorisation.** You hand it the two envelope statuses and whether the well can flow. It returns a traffic light, green, yellow, orange or red, with the reason in words. The full verification routine does both steps for you, splits your elements into the two envelopes, flags any element serving both, and runs four named rule checks over the roster.

## The pressure half

**Annulus pressure limits.** Every candidate limiting element, a casing that could burst, a string that could collapse, a wellhead rating, a shoe that could break down, allows some pressure at surface. The engine works each one in the differential form, taking the element's own limit at its own depth and subtracting the head of the annulus fluid net of whatever fluid backs the element from the other side. The lowest row wins and is named as the governing element.

The same arithmetic runs under the API RP 90 convention with default factors by role: 0.5 on the burst rating of the outer casing, 0.8 on the burst rating of the inner casing and 0.75 on the collapse rating of inner tubing. Factors are overridable, and the standard document governs.

## The abandonment half

**Balanced plug arithmetic.** Given the hole, the stinger and the plug you want, closed forms give the slurry volume, the balanced column height, the spacer behind, the displacement to pump and where the top of the plug will actually finish once the stinger is pulled.

**Rule checks.** The permanent barrier conventions become numbers the engine can test: a cement plug of 100 m measured depth, or 50 m when it is set on a verified mechanical foundation, extending at least 50 m above the source of inflow, a surface plug of 50 m, and annular cement of 30 m where a log verifies it or 100 m where nothing does.

**Phased programme.** Zones with flow potential each need two permanent barriers. The builder tests every zone, orders the work into three phases from reservoir to intermediate to surface, and returns a step list with a material takeoff.

## Exercise

For the published abandonment case, two zones have flow potential and four plugs are designed. Predict which zone fails its check before you look, using only the rule that a zone needs two qualifying barriers.

Then name, for your own well, which of the six calculations above you would run first and what you would need to have measured to run it.
