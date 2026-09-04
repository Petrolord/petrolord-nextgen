# Height is an assumption

The engine never computes fracture height. You type it in, and everything after it inherits whatever you typed.

{{panel:st-frac-explorer}}

## An input, not a result

Open the geometry routine and look at what it validates. It checks that rate, viscosity, half-length, height and the plane strain modulus are all positive, and then it uses them. Height appears on the right hand side of every expression and never on the left.

That is not a limitation the engine could remove. It is the defining assumption of a two dimensional model. The models are two dimensional precisely because the third dimension was fixed by hand.

The published case uses 30 m, over a perforated interval from 2450 m to 2550 m measured depth. Nothing in the calculation checks that 30 is the right number, or that it is consistent with the interval, or that it stays 30 while the job runs.

## What moves when height moves

Not everything, and the exceptions are instructive.

| quantity | how height enters |
|---|---|
| PKN width | not at all |
| KGD width | inversely, under the quarter power |
| PKN net pressure | inversely, directly |
| KGD net pressure | through its width only |
| fracture volume | linearly |
| leakoff area | linearly |

The PKN width bracket contains rate, viscosity, half-length and modulus, and no height. So a PKN width is indifferent to the height assumption while a PKN net pressure is fully exposed to it. Halve the height and the same width now implies twice the net pressure.

## The inheritance chain

Fracture volume is 2 xf hf w_avg, so it scales with height directly. The leaking area is both faces of both wings, which also scales with height.

That means pump time, fluid efficiency, injected volume, pad fraction and proppant mass all move with the height you assumed. So does the propped width, because the same proppant mass spread over a taller fracture is a thinner pack, and so does the conductivity and the skin that follow from it.

A single unchecked input at the top of the calculation therefore reaches the productivity answer at the bottom. That is worth saying out loud to anyone who reads only the last page of a design.

## Exercise

Run the published case, then run it again at 60 m of height with everything else fixed. Record which of the six quantities in the table above changed and by how much.

Then say which single measurement or log you would want before you trusted a height input on a real well.
