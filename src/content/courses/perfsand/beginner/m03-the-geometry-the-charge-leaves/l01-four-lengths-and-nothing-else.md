# Four lengths and nothing else

The complete input geometry of a perforation skin, and a check that nothing else is hiding in it.

{{panel:ps-shot-explorer}}

## The list

The tunnel length. The tunnel radius. The perforation spacing. The wellbore radius.

Add a phasing angle, which is a lookup rather than a length, and two permeability ratios, which describe the rock rather than the hole, and you have every input the skin calculation takes.

## What is not on the list

The casing size, except through the wellbore radius. The casing weight. The cement thickness. The gun outside diameter. The gun standoff from the casing wall. The charge weight. The number of perforations in total. The length of the perforated interval. The formation thickness. The porosity. The absolute permeability.

Some of those genuinely do not matter to a steady-state flow geometry. Some of them matter a great deal and are simply outside this model.

## The two that matter most and are absent

Gun standoff. A charge fired from a decentralised gun is closer to the casing on one side and further on the other, and penetration falls with standoff. A through-tubing gun in a large casing has a lot of standoff on the high side. That is real, it is significant, and this model has no input for it.

Perforated interval length. The skin here is a property of the geometry per unit length, and applying it to a well means assuming the whole interval is perforated the same way. A partially perforated interval has a partial penetration skin on top, which is a different calculation.

## Why the list is still worth trusting

Because the four lengths and the phasing capture the local flow convergence, which is what a perforation skin IS. The absent items either scale the inputs, like standoff scaling penetration, or add a separate skin term, like partial penetration.

A model whose inputs are a short honest list, with the omissions named, is easier to use correctly than one that takes forty inputs and hides its assumptions among them.

## Exercise

Write down the seven inputs to the skin calculation and classify each as a length, an angle or a ratio.

Name two significant physical effects that are absent, and say for each whether it scales an existing input or adds a new term.

Then say what you would do about standoff on a through-tubing job in large casing.
