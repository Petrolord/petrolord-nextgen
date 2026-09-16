# One molecular weight for four compounds

BTEX is benzene, toluene, ethylbenzene and the xylenes. The mole balance needs a molecular weight to turn moles into a mass, and the engine carries one number for all four.

{{panel:fc-water-explorer}}

## The default and what it is

The molecular weight the balance uses is an input with a default of 92.000000, which is toluene. A real BTEX cut is four compounds with four different molecular weights and four different solubilities in glycol, and this module represents the whole cut with a single figure.

The engine is explicit about it. The value sits in the module's declared constants, exported in one place under a name, rather than appearing as a bare number inside the arithmetic. A reader can find it, quote it and change it.

## Declared, and what that word carries

This module sorts its constants into three kinds. Some are derived, which means they are computed from something else the module exports and there is nothing independent to check. Some are measured, which means the digest can ask the engine a question whose answer is the constant and nothing else. The rest are declared.

A declared constant is a customary or chart value with no publication anywhere in this repository to check it against. The BTEX molecular weight is one, and so is the absorbed fraction it is multiplied by. The module exports them under their own names and its own comment says that pinning them is all any gate can do.

Pinning is worth having. It records that changing the number would be a reviewed act rather than an edit nobody noticed. Pinning is not validation, and a course that presented a pinned constant as a verified one would be making exactly the claim the declared export exists to refuse.

## What the single weight costs you

Benzene is usually the compound a permit cares about most. Representing the whole cut by toluene therefore trades accuracy on the species of most interest for a single tractable number, and the engine offers no way to split the cut because it carries no speciation at all.

So the honest reading of a BTEX answer from this module is a total mass of aromatics at a stated molecular weight and a stated absorbed fraction, both of which the user supplied. It is a screening figure for sizing a still overhead route or a vapour recovery decision. It is not a speciated emissions inventory and it will not survive being presented as one.

## Exercise

Name the four compounds BTEX stands for and the default molecular weight the balance uses. Say which of the three kinds of constant that default is, and what the module's own comment says a gate can do about it. Then say what a BTEX answer from this module is a screening figure for, and one thing it cannot be used as.
