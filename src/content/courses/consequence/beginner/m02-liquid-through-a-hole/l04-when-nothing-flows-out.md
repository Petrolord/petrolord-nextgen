# When nothing flows out

{{panel:cq-release}}

Bernoulli through a hole needs a driving pressure: the pressure at the hole must exceed the air outside. When it does not, there is no outflow to compute, and the engine says so in words. This lesson reads the refusals that mark the edges of the liquid model, then looks at a published value that fails to reproduce, which teaches the same habit from the other side.

## The pressure at the hole does not exceed ambient

The pressure at the hole is the static head plus the pressure above the liquid. With no head and an ullage below ambient, that sum cannot push liquid out:

> pressureAboveLiquidPa: the pressure at the hole does not exceed ambient, so nothing flows out

The engine names `pressureAboveLiquidPa`, and that is the input to check first. A gauge reading typed into an absolute field lands one atmosphere low and can put a real, flowing tank on the wrong side of this line.

Returning a mass rate of zero here would be arithmetically defensible and dangerous. A zero sits comfortably in a table of results and reads as a small release. The refusal cannot be mistaken for one.

## A head below the hole, and a hole of no size

Two more refusals guard the geometry:

> liquidHeadM: must be a liquid height of 0 m or more above the hole

> holeDiameterM: a hole diameter above 0 m (or holeAreaM2) is required

A negative head would place the liquid surface below the hole, where the static term would pull instead of push. A zero diameter has no area. In both cases the engine names the field and stops.

## A published value that does not reproduce

The Yellow Book's acrylonitrile example reproduces at 500 s, as the previous lesson showed. The same example's table also prints 60.915 kg/s at time zero, for a level of 11.2 m. Bernoulli at that level gives 58.639369 kg/s. The printed figure does not follow from the book's own inputs, so it is an erratum in the published table.

The golden test that stands behind the engine uses the value at 500 s, the one that reproduces, and records the value at time zero as an erratum. That is the rule this course follows everywhere: a published number earns its place as a check when the printed inputs return it. When they do not, the source is in error, and the course says so and names the source.

## Reading a refusal as information

A refusal on a liquid line says the stated conditions drive no liquid out of the hole. Check the inputs against the plant: is the pressure absolute, is the head measured above the hole, is the hole the one intended? If all three hold, the case releases nothing there, and the note records it.

## Exercise

On the outflow view, set the head to 0 m and the pressure above the liquid to 101325 Pa, and read the refusal. Now raise only the head to 1 m and read the result. Write one sentence explaining why a single metre of liquid turns a refusal into a flow, using the definition of the pressure at the hole.
