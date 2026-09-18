# Produced water, and what it carries

Water arrives with the oil, and by late field life there is a great deal more of it than there is oil. The Produced Water Treatment Studio builds a train of up to three stages over one water stream, and reports what each stage removes, what the droplets left look like, and what comes out of the end.

## One question, asked in several ways

This engine answers a single question and dresses it several ways: given this water, this oil and this equipment, what fraction of the dispersed oil comes out, and what is left in the water afterwards. Every table in this course is that question with one input moved.

## Oil in water is a distribution

The doctrine of the module is that oil in water is a droplet size distribution rather than a concentration. A concentration says how much oil there is. The distribution says how hard that oil is to remove, and every device here is characterised by the droplet size it removes half of, which is its cut size d50c.

## A cut size is computed, never looked up

Every device cut size in this module is computed from the equipment geometry and the fluid properties. Nothing here is a fixed removal efficiency, and that is the whole difference between this engine and a lookup table. The same device on finer water performs worse, which is what actually happens on a plant.

## The stream this tier follows

UZERE is the stream this tier reads end to end. It is 28000 bwpd at 41 C and 62000 ppm TDS with 24 API oil. From those four inputs the engine gets a water viscosity of 0.000710553998 Pa.s and a brine density of 1035.261174 kg/m3, and an oil density of 892.869375 kg/m3. Put that water through a basin of 10 by 2.6 by 1.4 m and the cut size is 165.003927 micron. Put it through a pack of 30 plates of 3 m2 each and the cut size is 86.549597 micron. The water did not change between those two answers. The equipment did.

## What this engine does not carry

The module is honest about its edges. There is no dissolved or soluble oil removal in it, no chemical demulsifier, no coalescer media, no re-entrainment, no reject stream or oil recovery balance, no fouling over time and no backwash cycle. It states no discharge limit of its own either. Everything in that list is real produced water engineering this method does not reach.

{{panel:pw-water-explorer}}

## Exercise

Write down the one question this engine answers. Then say what changed between the 165.003927 micron cut size and the 86.549597 micron one, and name two things on the list above this module cannot be asked about.
