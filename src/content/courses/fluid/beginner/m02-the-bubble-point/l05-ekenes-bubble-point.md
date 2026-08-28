# Ekene's bubble point

The field is defined to bubble at 2000 psia. Three correlations say otherwise, and this lesson is what to do with that.

{{panel:fluid-correlation-explorer}}

## The numbers

At 32 API, 0.75 gas gravity, 180 F and 400 scf/stb:

Standing returns

$$1912.1923059028293 \text{ psia}$$

against the designed 2000. That is 87.8 psia low, or about 4.4 percent.

## Which one is right

Neither, and the question is the wrong one.

The designed 2000 psia is a decision. Somebody building the material balance course chose a self-consistent set of fluid properties for Ekene and this was one of them. It is not a measurement and it never claimed to be.

Standing's 1912.19 psia is what a correlation fitted to Californian oils says an oil of this description should do. It is not a measurement of Ekene either, because nobody has ever measured Ekene.

What the comparison establishes is that the designed fluid is close to, but not exactly on, the surface that Standing's data traced. Four and a half percent is a completely ordinary distance for a correlation to sit from any particular oil.

## Why the deck carries 2000

Because consistency across the study beats agreement with a correlation.

The material balance course computed a pressure history with a bubble point of 2000. The waterflood course's ledger used formation volume factors from that same designed set. The simulation deck carries those tables. Change the bubble point to 1912 in one place and every one of those calculations becomes slightly wrong for reasons nobody downstream can see.

The simulation course put this as a rule: a deck's fluid must be the fluid the rest of the study was matched against. This is the same rule from the fluid side.

## What you would do on a real field

Measure it. A bubble point is the easiest thing in a PVT study to obtain and the most consequential thing to get wrong, and a single constant composition expansion gives it.

Until you have that measurement you are choosing between correlations, and the honest report says so: "bubble point 1912 psia from Standing, with a spread of about X psia across three published correlations, no laboratory measurement available."

That sentence takes ten seconds to write and it tells the next engineer exactly what they are holding.

## The trap in the other direction

A field with a measured bubble point and a correlation that disagrees is a different situation, and there the measurement wins. What people sometimes do instead is adjust the measured value toward the correlation because the correlation "looks more reasonable", which is preferring somebody else's oils to their own.

## Where this goes next

The Professional tier takes a fluid that WAS measured and asks the same question with a real answer available. That is the only way to find out whether a four percent correlation spread actually brackets the truth.

## The misconception to avoid

"A four percent error in the bubble point is small." It is small as a pressure and it is not small in its consequences. The bubble point decides which regime the reservoir is in, and a field forecast to stay 50 psia above its bubble point for ten years is a completely different forecast from one that crosses it in year three. Whether four percent matters depends entirely on how close to the crossing you are.

## Exercise

First, state Standing's bubble point for Ekene, the designed value, and the difference as a percentage. Then write the one-sentence report line you would put in a study that had no measurement.

Second, explain in two sentences why the simulation deck carries 2000 psia rather than the correlated value, even though the correlated value comes from a published method.
