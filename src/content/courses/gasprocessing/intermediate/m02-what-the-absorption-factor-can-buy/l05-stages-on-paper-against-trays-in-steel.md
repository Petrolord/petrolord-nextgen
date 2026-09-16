# Stages on paper against trays in steel

Everything so far has been theoretical stages. This lesson is about the distance between a theoretical stage and a tray, because that distance is where a stage count turns into a purchase order and where most of the error lives.

## What the engine models

A theoretical stage is a place where the gas and the liquid leave in equilibrium with each other. That is the whole of the model. This engine carries no rate-based absorber model and no stage efficiency, which are the two things that would be needed to convert an equilibrium count into real hardware.

So a stage count is an honest answer to a question about separation difficulty and no answer at all to a question about vessel height. Both facts have to be carried forward together. The first makes the number useful. The second stops it being misused.

{{panel:fc-absorber-explorer}}

## Fractional counts

The inverse relation returns figures like 3.140202390 and 7.746472598. A learner meeting those for the first time often wants to round them, and the instinct is right for the wrong reason.

You do round, eventually, because trays come in whole numbers. But the rounding happens after the stage count has been converted into real trays by somebody who knows the tray efficiency of the service, and that conversion is not in this module. Rounding a theoretical count up to the next whole number and calling it a tray count skips the conversion entirely and quietly assumes a tray does the work of a full equilibrium stage.

## What this means for a design

The practical shape of the work is this. The engine gives you a theoretical stage count for the duty and the solvent side you chose. A vendor, or a correlation this package does not carry, turns that into actual trays or a packed height. The result comes back taller than the theoretical count suggests, and how much taller is a property of the service rather than of the arithmetic.

None of that makes the stage count less valuable. It is still the right number for comparing two designs, for asking whether a spec is reachable at all, and for deciding which dial to move when it is not. It is simply not a length.

## The one thing height cannot buy

There is one place where the distinction stops mattering, and it is the previous lesson. When the absorption factor is at or below one, neither theoretical stages nor real trays reach past the ceiling. Tray efficiency, packing, vendor experience and vessel height are all irrelevant at that point, because the constraint is on the solvent side. That is the only question in this module that can be settled without ever leaving the theoretical world.

## Exercise

Record the two fractional stage counts above and the absorption factors they belong to. Then name the two things this engine does not model that would be needed to turn either figure into a vessel height, and say when that missing conversion does not matter.
