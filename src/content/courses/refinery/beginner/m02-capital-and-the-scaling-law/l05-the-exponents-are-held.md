# The exponents are held

The two exponents at the heart of this module are defaults. The course holds them as a stated limit: they are taught as the screen's starting assumption, and they are never used as a figure you are graded on computing with.

{{panel:refinery-screen-explorer}}

## What is held and why

The course records it as held item H1: the scaling exponents 0.6 and 0.9 are defaults for a vendor's own figures to replace. No published source for them is in the engines repository.

That second sentence is the reason for the hold. Every other figure in this tier comes from an input you can see and a rule you can state. The exponents are inputs with no source attached. The screen uses them because it needs some exponent to draw a curve, one for each way of building. A default is where a screen starts. It is not a value to defend in a meeting.

## The engine treats them as parameters

modularRefinery.SCALING_EXPONENT names them, STICK_BUILT 0.6 and MODULAR 0.9, and the course records that they are named, overridable parameters. scaleCapex takes an exponent as an argument and falls back to the modular one only when none is passed: at 20000 bpd with no exponent passed it returns 222860944.20 with exponent 0.9.

The screen explorer carries each exponent as a control, labelled as a default a vendor's figures replace. Changing it is the intended use of the panel.

## What replaces a default

A vendor's figures replace it. That is what H1 says the exponents are for: defaults for a vendor's own figures to replace.

Until those figures arrive, read the capital at more than one exponent. The explorer carries each exponent as a control, so the capital at another exponent is one change away. Away from the reference size the exponent moves the capital: at 10000 bpd the table prints 119428222.92 on the 0.9 law and 97005860.26 on the 0.6 law. At the reference size it moves nothing. OKORDIA is screened at 5000 bpd, where both laws print 64000000.00, so its capital is the quotation whichever exponent is chosen.

## What the hold means for the rest of this tier

It means the capital figures in this module are examples of the method. The 5000 bpd figure is the quotation itself and does not depend on the exponent. Every other size depends on an exponent that has no source.

It also means a capital figure at another size is only as good as its exponent. When you read the screen's capital at 1000 bpd or 30000 bpd, read it with the exponent beside it, and say that the exponent is a default.

## The mistake

Treating 0.6 and 0.9 as industry constants because the engine prints them with confidence. They are the engine's defaults, and the engine itself makes them replaceable. A screen that reports a capital figure scaled on a default exponent without saying so has hidden its weakest input.

## Exercise

Read the scaleComparison figures at 5000 bpd and at 20000 bpd. Say which of the two capital figures on each law depends on the exponent and which does not, and explain why. Then say what a vendor would need to provide for the 20000 bpd figure to stop depending on a default.
