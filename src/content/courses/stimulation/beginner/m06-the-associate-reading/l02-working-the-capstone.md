# Working the capstone

The method for a problem of this kind, and the checks that catch you before the grader does.

{{panel:st-acid-explorer}}

## It is not the published case

The capstone states its own conditions. The rock, the interval, the damage and the fluids are its own, and none of the published numbers in this tier carry across. Read the conditions first and write them down as a list of named inputs before you compute anything.

That habit matters more here than anywhere else in the tier, because several of the inputs appear in more than one calculation. A wellbore radius wrong at the top is wrong in the Hawkins skin, in the acid volume, in the wormhole radius and in the rate ceiling.

## The order to work in

**Identify the damage.** You are given a permeability ratio and a damaged radius. Hawkins turns those two into a skin. Nothing else is needed and nothing else is allowed in: this is damage skin, not a measured total skin.

**Plan the sandstone volume for the stated front.** The volume is pore volumes of the annulus between the wellbore and the front, scaled by the pore volume factor the conditions give you. It grows with the square of the front radius, so a small change in the stated front is not a small change in volume.

**Ask whether the front reaches the damage.** Compare the front radius with the damaged radius. If the front falls short, permeability is restored only out to the front, and a residual skin remains over the untreated shell. If the front reaches or passes the damaged radius, the damage is gone.

**Run the carbonate alternative on the stated volume.** This is the other route on the same well, not a continuation of the sandstone job. The wormhole radius comes from a volumetric balance with the pore volumes to breakthrough you are given, and the skin follows from that radius.

**Take the ceiling at the damaged skin.** This is the step most often got wrong. The rate ceiling describes the well as it stands, before treatment, because that is the well you have to pump into. Use the skin from step one, not zero and not the post treatment skin.

## Checking your own work

Three checks, and none of them needs the answer.

The sandstone residual skin should be zero only when the front reaches or exceeds the damaged radius. A residual of zero from a front that stops short means you have restored rock the acid never reached.

The carbonate skin must be negative. A wormhole network is an improvement on the wellbore, and the model expresses it as a negative skin. A positive value means the radius came out smaller than the wellbore, which is arithmetic, not physics.

The ceiling must fall as the skin rises. If you compute a ceiling at two skins and the larger skin gives the larger rate, the skin has gone into the numerator or the sign is wrong.

## Where it goes wrong

Using the clean skin for the ceiling. Squaring the wrong radius, or forgetting that the wellbore radius is subtracted inside the annulus. Carrying a published number across out of habit. And reporting a residual skin without saying whether the front reached the damage.

## Exercise

Write the five steps as a list before you open the capstone, with the input each one needs.

Write the three checks next to them.

Then, after working it, say which of the five you would want a second opinion on and why.
