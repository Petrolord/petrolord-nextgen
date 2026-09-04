# The identity at zero excess

One line in the digest is worth more than any of the others, because it is the line that tells you the rest can be trusted.

{{panel:wi-pa-explorer}}

## The identity

Run the published geometry at zero excess. The design plug top is 1850 m MD. The settled top the engine computes, after the slurry redistributes across the full bore, is 1850 m MD. The absolute error between them is 0.

Not close to zero. Zero. The engine header states the identity as a property of the model, and the digest confirms it holds.

## Why it has to hold

Follow the two definitions. The design volume is the hole capacity times the plug length times one plus the excess. The settled top is the plug base minus that volume divided by the hole capacity.

Put one into the other and the hole capacity cancels completely. The settled top is the base minus the plug length times one plus the excess. At zero excess that is the base minus the plug length, which is the design top, by definition of the length.

So the settled top calculation is the design calculation run backwards. It is not a second, independent estimate that happens to agree. It is the same relation, and any excess you add to the front comes straight out of the back as extra length above the design top.

## What it buys you

Three things.

It fixes the meaning of every other number in the module. The as-pumped top, the balanced height and the drop all get their scale from a plug whose base and design top are exactly where you said they were.

It tells you the drop is pure geometry. If the settled top at zero excess had landed 15.365 m shallow, you would have a volume error somewhere and the drop would be an artefact of it. It lands exactly on the design top, so the 15.365 m the as-pumped top sits shallow of it is entirely the capacity ratio at work.

And it gives you a self test. Any spreadsheet or vendor sheet that claims to place a balanced plug should reproduce it. Set the excess to zero and see whether its settled top lands on the design top. If it does not, the fault is in its volume arithmetic, and you have found it in a minute.

## Exercise

Reproduce the identity in the panel on the published geometry, then on a geometry of your own with a different hole size and stinger.

Then show on paper why the hole capacity cancels, and state what the settled top becomes at 20 per cent excess without computing a volume.
