# A laminar film does not move with flow

Below a Reynolds number of 2300 the engine stops using the turbulent fit and uses the laminar constant wall temperature limit instead. That limit has a property worth meeting head on, because it surprises people: the film coefficient it gives does not depend on the flow rate at all.

## The same film at two flows

At 900.0000 lb an hour on the studio bundle the Reynolds number is 495.583267, the regime is laminar and the film coefficient is 5.667097. Double the flow and the Reynolds number becomes 991.166535, which is a different flow in a different condition, and the film coefficient is 5.667097. The same number.

That is the limit behaving as it should. A constant wall temperature laminar limit is a statement about the shape of the temperature profile in a fully developed flow, and the flow rate has dropped out of it. Nothing is broken and nothing has been rounded.

{{panel:fc-coefficient-explorer}}

## The warning that says so in advance

The engine does not leave a reader to discover this. Every laminar answer carries a warning, and the warning reads: laminar tube side: the constant-wall-temperature limit is used, so this film coefficient does NOT move with the flow rate and does NOT take the Sieder-Tate correction. Entrance effects are ignored.

Three statements in one sentence, and all three are limitations rather than results. The film will not move with flow. The viscosity correction that a turbulent answer can take is not applied. And entrance effects, which are real and which can matter a great deal in a short tube, are outside what this limit describes.

## Why a warning rather than a refusal

The engine refuses in the transition band and answers with a warning here, and the difference is whether anything defensible can be said. In the laminar range there is a limit with a clean derivation behind it, so a number exists that is worth returning. In the transition band there is nothing.

What the warning does is prevent the number from being read as more than it is. A reader who sees the same film coefficient at two flows and has not read the warning will suspect the tool. A reader who has read it knows the tool is telling them that this film is set by the limit rather than by their flow, and that the way to move it is to change the regime.

There is a design consequence too. A laminar film will not improve by pushing more fluid through the same bundle until the flow crosses into turbulence. So a laminar answer is usually a signal to change the geometry rather than the pump, and the inputs to move are the ones the transition refusal names: the tube count, the passes or the bore.

## Exercise

Record the two flows in this lesson with the Reynolds number and the film coefficient at each. Say what is the same and what is different between them. Then write down the three things the laminar warning tells you, and say why the engine warns here and refuses in the transition band.
