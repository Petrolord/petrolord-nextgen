# The denominator convention

The four drive indices share one denominator, and which withdrawal goes in it is a convention rather than a derivation. On Ekene the choice makes no difference at all, which is precisely why this is the right moment to learn it. Meet a convention on a case where it cannot hurt you and you will recognise it later on a case where it can.

## The rule

Drive indices apportion the NET underground withdrawal:

$$A = F - W_p B_w$$

$F$ is the gross underground withdrawal, everything taken out of the reservoir measured in reservoir barrels. $W_p B_w$ is the produced water among it, stock tank barrels of water converted to reservoir barrels by the water formation volume factor. $A$ is what is left after the produced water has been taken off the top.

So the full set reads:

$$\text{DDI} = \frac{N E_o}{A}, \quad \text{SDI} = \frac{N E_{fw}}{A}, \quad \text{GDI} = \frac{N m E_g}{A}, \quad \text{WDI} = \frac{W_e - W_p B_w}{A}$$

## Why net and not gross

The reason is an identity, and once you have seen it you will not misremember the rule.

Start from the general balance for a tank that can import water:

$$F = N E_o + N E_{fw} + N m E_g + W_e$$

Subtract the produced water from both sides:

$$\underbrace{F - W_p B_w}_{A} = N E_o + N E_{fw} + N m E_g + (W_e - W_p B_w)$$

Now divide every term by $A$. The left side becomes one. The right side becomes exactly DDI plus SDI plus GDI plus WDI. The indices sum to one because the equation they came from was divided through by its own left hand side. That is the whole justification, and it is airtight.

There is a physical reading too. Water that came in from the aquifer and then went back out through the producing wells did not stay to fill any void. Both the arrival and the departure appear in the water term, on the same side. Asking the oil expansion to account for a volume that was water in and water out again would charge the oil for work it never did.

## What the wrong denominator does

Suppose you divide the same four numerators by $F$ instead of $A$. The numerators have not changed, so from the identity above the sum becomes

$$\frac{A}{F} = \frac{F - W_p B_w}{F} = 1 - \frac{W_p B_w}{F}$$

The indices no longer sum to one, and the shortfall is exactly the produced water's share of gross withdrawal. It is not scatter, not a data problem, and not a closure failure. It is a fixed, computable amount of the wrong denominator.

That gives you a diagnostic that is better than a rule of thumb. If your indices sum to $1 - x$, compute $W_p B_w / F$ for the same survey. If it comes out at $x$, you have found your problem and it is arithmetic.

## Work Ekene, then work the version that bites

Ekene first, where the convention is invisible. At every one of the six surveys the fixture records $W_p = 0$ stb, with $B_w = 1.02$ rb/stb throughout. So at the last survey:

$$W_p B_w = 0 \times 1.02 = 0 \ \text{rb}$$

$$A = F - W_p B_w = 317926.842484584 - 0 = 317926.842484584 \ \text{rb}$$

The net and the gross withdrawal are the same number, the choice of denominator has nothing to act on, and the indices come out 0.607003891050583 and 0.392996108949419 either way, summing to 1.00000000000000.

Now change one thing and nothing else. Hold that same last survey's oil history fixed and suppose the tank had also produced 20000 stb of water alongside its oil. The water converts to reservoir barrels at $B_w = 1.02$:

$$W_p B_w = 20000 \times 1.02 = 20400 \ \text{rb}$$

The gross withdrawal grows by that amount, because produced water is part of what came out of the reservoir:

$$F = 317926.842484584 + 20400 = 338326.842484584 \ \text{rb}$$

The net withdrawal does not move:

$$A = 338326.842484584 - 20400 = 317926.842484584 \ \text{rb}$$

Divide by $A$ and the books still close to one. Divide by $F$ and they close to

$$1 - \frac{20400}{338326.842484584} = 1 - 0.0602967232815101$$

a shortfall of 6.02967232815101 percent. An engineer who does not know the convention now spends a day looking for a 6 percent error in the pressure surveys, the PVT or the production allocation, and there is no error in any of them.

Notice how easily 6 percent passes for something real. It is too big to be rounding and too small to be obviously absurd. That is the dangerous size for a bookkeeping mistake.

## Practical notes

State the convention whenever you publish indices. A drive split without a stated denominator is not a reproducible number, and different packages and different textbooks do differ here.

Check the sum before you interpret the split. A set that sums to one has passed a real test. A set that does not has told you to stop and find out why, and the denominator is the first suspect, ahead of the data.

Know what your tool does. This engine's oil path forms its per timestep indices on the gross withdrawal, with the produced water subtracted inside the water term's numerator rather than off the denominator. On any tank with no produced water, including Ekene and everything the panel shows you, that is identical to the net convention and the sum comes back at one. On a tank that has produced water, form $A$ yourself, divide the numerators by it, and confirm the sum before you quote a split.

Do not adjust anything to force closure. The closure check is only worth having because it is allowed to fail.

## Exercise

Repeat the worked calculation with 50000 stb of produced water instead of 20000, at the same $B_w = 1.02$ rb/stb and the same last survey oil history.

Compute $W_p B_w$, the gross withdrawal $F$, the net withdrawal $A$, and the shortfall $W_p B_w / F$ that the wrong denominator would produce. You should find a shortfall of 13.8238789177101 percent.

Then answer in one sentence: as a tank ages and its water cut climbs while its oil rate falls, does the penalty for using the wrong denominator get larger or smaller, and why?
