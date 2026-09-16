# The friction Weymouth assumes

Weymouth takes no friction factor and no roughness. That does not make it friction-free. It makes its friction assumption invisible, and the only way to see the assumption is to ask another form what it would take to agree.

{{panel:fc-gasline-explorer}}

## The measurement

General Flow computes and returns a friction factor. Weymouth returns a rate. Because a General Flow rate goes as one over the square root of the friction factor, the rate Weymouth reports can be turned back into the friction factor General Flow would have needed to produce it.

| bore in | the friction factor general settled on | the friction factor that would make general match weymouth |
| --- | --- | --- |
| 6.065000 | 0.0129147931 | 0.0175440472 |
| 7.981000 | 0.0121761733 | 0.0160098631 |
| 11.938000 | 0.0112132010 | 0.0139989737 |
| 15.000000 | 0.0107219615 | 0.0129730762 |

## What the last column says

The implied figure is above the computed one on every row of the table, which is why Weymouth reads lower than General Flow on all four bores. Weymouth is assuming a rougher pipe than Colebrook computes for this line.

More telling is the direction. The implied friction factor falls as the bore grows, and it depends on the diameter rather than on the Reynolds number. That is the signature of a fully rough friction law, the region of the Moody chart where a rough pipe stops caring about the Reynolds number altogether.

So Weymouth carries a built-in roughness assumption expressed as a function of diameter. It is not a pipe property anybody entered, and it does not move when the line's actual roughness does.

The practical consequence is narrow and worth stating. Weymouth has no roughness input at all, so an internally coated line and a line of used steel hand it the same inputs and receive the same rate. General Flow is the only one of the four forms that can be told the difference, because it is the only one that takes a roughness and reports the friction factor it reached.

## Held, and what that means in practice

The fully rough friction law Weymouth assumes is held for the literature. This measurement extracts it from the engine and nothing in the package sources it, so it is taught as a limit and never graded.

What survives the hold is the qualitative statement, which the four rows establish on their own: Weymouth's friction is a function of diameter, and it is stiffer than a computed Colebrook friction factor on this line.

## The mistake

The mistake is treating Weymouth as a form with no assumptions because it has no friction argument. Every form has a friction assumption. Weymouth's is baked in, Panhandle A and Panhandle B each carry their own, and General Flow's is the only one a reader can see and change.

The second mistake is tuning the efficiency to close the gap between two forms. The efficiency multiplies every form linearly and it is itself held, so moving it to make Weymouth agree with General Flow buries a structural disagreement inside a number that nothing stands behind.

## Exercise

Explain how the friction factor Weymouth assumes is measured out of the engine, and give the settled and implied figures at bores of 6.065000 in and 15.000000 in. Then say what the direction of the implied column indicates about the friction law, and why tuning the efficiency is the wrong way to reconcile two forms.
