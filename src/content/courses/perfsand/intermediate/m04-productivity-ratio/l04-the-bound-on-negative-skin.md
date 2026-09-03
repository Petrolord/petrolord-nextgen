# The bound on negative skin

Where the expression breaks, why, and what the break is telling you.

{{panel:ps-skin-explorer}}

## The bound

The productivity ratio has the logarithm plus the skin in its denominator. If the skin is exactly minus that logarithm, the denominator is zero and the ratio is infinite.

The engine refuses at or below that point rather than returning a number.

## What it means physically

That the near-wellbore stimulation has grown until it is as large as the entire reservoir resistance. In the steady radial picture, an infinite rate at finite drawdown.

That is not physics; it is the model reaching its own limit. A skin that negative means the effective wellbore radius has grown to the drainage radius, and at that point the well is not a well with a skin, it is a different geometry entirely.

## When you might actually hit it

Not with perforations. The most negative perforation skin in this course's catalog is about minus two, and the logarithm on the published well is nearly eight, so there is a factor of four in hand.

You hit it with hydraulic fractures. A long fracture has an equivalent skin of minus five or minus six, and in a well with a small drainage radius the logarithm can be six or seven. Fracture models handle that with a different formulation for exactly this reason.

## Why the engine refuses rather than clamping

Because a clamped answer is a number, and a number gets used. Returning a large finite ratio at a skin near the bound would tell a reader the completion is spectacular rather than that the model has stopped applying.

The refusal names the condition, which sends the reader to a formulation that handles it.

## The general shape

A model whose output goes to infinity at a reachable input needs to say so at the input rather than at the output. That is the same argument as refusing a zero shot density, one step further out: not an impossible input, but an input outside the model's range of validity.

## Exercise

State the bound and say what happens to the ratio at it.

Explain what a skin at the bound means about the effective wellbore radius.

Then say why perforations do not reach it, what does, and why the engine refuses rather than returning a large number.
