# The unit normal loss

{{panel:materials-stock-calculator}}

The fill rate needs the expected units short a cycle. For normal demand the engine computes it from one function of the safety factor, the unit normal loss G(k).

## What G measures

Picture demand over the protection period as a normal curve, with the reorder point k standard deviations above its mean. Every outcome beyond the reorder point leaves units short. G(k) is the expected amount by which a standard normal variable exceeds k, counting zero whenever it does not. Scale it by sigma and it is the expected units short a cycle.

The engine's basis states the pieces, verbatim, as part of its rule:

    expected units short per cycle = sigma G(k), G(k) = phi(k) - k (1 - Phi(k)); P2 = 1 - sigma G(k) / Q.

Here phi is the normal density, Phi the normal cumulative probability, and P2 the fill rate.

## G falls as k rises

Raise the reorder point and fewer outcomes cross it, by smaller amounts. G falls toward zero as k grows, so every target on G has exactly one k.

## A fill rate becomes a target on G

A fill rate p allows expected units short of at most Q times one less p. Divide by sigma and the target is on G. On the choke bean set, with an order quantity of 12, sigma 3.029476 and a fill rate of 0.98, the engine prints the step in its reason, verbatim:

> a fill rate of 0.98 needs G(k) at or below 12 x (1 - 0.98) / 3.029476 = 0.079222, so k = 1.026327; safety stock 3.109233 over a demand of 8.33325 with sigma 3.029476 gives the reorder point s 11.442483, held as 12 (up to a multiple of 1)

The target on G, 0.079222, sets k at 1.026327: the smallest safety factor whose loss is at or below it.

## Three inputs in one target

The target moves with all three inputs: a larger order quantity raises it and k falls; a higher fill rate or a larger sigma lowers it and k rises.

Two different policies can reach the same target on G. Halving Q at a fill rate of 0.98 gives the same target as keeping Q and moving to 0.99, because one less 0.99 is half of one less 0.98. The engine then returns the same k for both.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, fill rate". Work the target on G by hand from the order quantity, the fill rate and sigma, and check it against 0.079222 in the reason.

Then set the control "Order quantity (stated; needed for a fill rate)" to 6 and note the target on G and k. Restore it to 12 and set the control "Service level (stated)" to a fill rate of 0.99. Predict the target and k before you read them, and confirm that they match the figures you noted.
