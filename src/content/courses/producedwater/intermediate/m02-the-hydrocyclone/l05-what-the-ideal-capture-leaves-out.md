# What the ideal capture leaves out

The cut size the last lesson produced is an IDEAL capture, and the module says so on every single return. This lesson is about what that word carries, because it is the difference between a number a reader can use and a number a reader can be misled by.

{{panel:pw-device-explorer}}

## The module's own statement

Every hydrocyclone return in this engine carries a `cutBasis` string. Here it is in the engine's words:

an ideal capture: the median droplet crossing from the half-area radius to the oil core in the residence time. Re-entrainment, the reject split and the shear the liner itself applies are not in it, and field de-oilers are customarily credited with a coarser cut than this

That sentence travels with the answer. A reader who takes the cut size and leaves the basis behind has taken half of what the engine returned.

## The three things named in it

RE-ENTRAINMENT is oil that reached the core and was picked back up by the flow before it left. The march assumes a droplet that arrives stays arrived.

THE REJECT SPLIT is the fraction of the feed taken off with the oil. A real liner sends a small overflow stream out of the top, and how much water goes with it decides both the oil recovery and how much water there is to deal with downstream. This module carries no reject stream and no oil recovery balance at all.

THE SHEAR THE LINER APPLIES is the one of the three this course comes back to. A liner accelerates water hard, and that acceleration breaks droplets. A device that makes the oil finer while removing it is changing the distribution it was handed in a way the ideal march does not model at the inlet.

## What the sentence means for a design

The engine states that field de-oilers are customarily credited with a coarser cut than this model gives, and no vendor performance curve exists in this repository to calibrate against. So the honest reading of a liner cut size here is that it is the best the stated geometry could do, with the losses named and left out.

That is a statement about what the model leaves out rather than a correction factor, and it is the reason this course prints the basis beside every cyclone cut size it quotes.

## Why an ideal is still worth computing

An ideal with its omissions listed is a usable engineering result. It responds to the inputs that physically matter, in directions a reader can follow, and it can be checked by an independent march. A quoted efficiency with no basis at all can do none of those, and it cannot tell you what it left out because it never knew.

## Exercise

Name the three effects the `cutBasis` string says are outside this model, and say for each one whether it would make the true cut finer or coarser than the reported one.

Then state what a reader should write down beside any liner cut size taken from this module into a design note.
