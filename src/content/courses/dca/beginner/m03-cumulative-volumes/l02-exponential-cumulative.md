# The exponential cumulative

This is the one cumulative you should work with a pencil before ever letting software do it. It is short, it is exact, and it carries an interpretation that the other two models lack: a hard ceiling on what the well can ever deliver.

## The formula

For an exponential decline with initial rate $q_i$ and nominal decline $D_i$,

$$N_p(t) = \frac{q_i}{D_i}\left(1 - e^{-D_i t}\right)$$

with $D_i$ per day and $t$ in days. Two pieces deserve names.

The leading factor $q_i / D_i$ is the **ceiling**. As $t$ grows, $e^{-D_i t}$ falls toward zero and $N_p$ climbs toward $q_i / D_i$ and never past it. An exponential well left to decline forever delivers a finite volume, and you can read that volume off the parameters before computing anything else. For Ekene-1, $q_i = 120$ stb/d and $D_i = 0.0012$ per day, so the ceiling is

$$\frac{120}{0.0012} = 100000 \text{ stb}$$

One hundred thousand barrels, ever, no matter how long it flows.

The bracket $1 - e^{-D_i t}$ is the **fraction of the ceiling delivered so far**. It starts at zero, ends at one, and never needs units. So the exponential cumulative is a sentence: volume so far equals the ceiling times the fraction of it already produced.

## Ekene-1 at one year, by hand

Work it now, on paper or a calculator. Ekene-1 started 2020-01-01. At $t = 365$ days:

$$D_i t = 0.0012 \times 365 = 0.438$$

$$e^{-0.438} = 0.645325782857295$$

$$1 - 0.645325782857295 = 0.354674217142705$$

$$N_p = 100000 \times 0.354674217142705 = 35467.4217142705 \text{ stb}$$

Call it 35467 stb in conversation, but notice the full value, because the engine and the committed fixture agree with it to the last digit. After one year the well has delivered 35.47 percent of everything it will ever deliver. That is the kind of statement the ceiling form makes effortless.

Here is the fixture's full table, every entry from the same three-step chain:

| $t$ (days) | $D_i t$ | $N_p$ (stb) |
|---|---|---|
| 182 | 0.2184 | 19619.6144188648 |
| 365 | 0.438 | 35467.4217142705 |
| 730 | 0.876 | 58355.4633979620 |
| 1096 | 1.3152 | 73157.9366256283 |

The last row is 2023-01-01, the day the Ekene waterflood starts and the primary decline ends. By then the bracket reads $0.731579366256283$: the well has delivered 73.16 percent of its ceiling in three years. That cumulative, 73157.9366256283 stb, is one of the numbers the Associate capstone asks you to produce, and it is exactly this arithmetic.

Stop and reproduce the 730 day row yourself before reading on. Three steps: multiply, exponentiate, subtract from one, then scale by 100000. If you get 58355.46 you have the structure right.

## Three ways this goes wrong

**Mixing time units.** $D_i = 0.0012$ per day with $t$ in years gives $D_i t = 0.00044$ instead of 0.438, and a cumulative about 800 times too small. The product $D_i t$ at one year should be 0.438, a comfortable order-one number. If yours is tiny or huge, the units are crossed.

**Dropping the one-minus.** Computing $\frac{q_i}{D_i} e^{-D_i t}$ gives 64532.58 at one year, which is not the volume produced, it is the volume REMAINING below the ceiling. The two add to the ceiling, which is a useful check but a different quantity. If your answer goes DOWN as $t$ grows, you computed the remainder.

**Using the current rate instead of $q_i$.** The formula wants the rate at the start of the decline, always. Substituting the rate at time $t$ silently restarts the well from now and double counts nothing while missing everything already produced.

## The check the ceiling gives you

Because $N_p = \frac{q_i}{D_i}(1 - e^{-D_i t})$ and $q = q_i e^{-D_i t}$, subtracting gives

$$N_p = \frac{q_i - q}{D_i}$$

Cumulative equals the rate drop divided by the decline. At 1096 days Ekene-1 flows at 32.2104760492461 stb/d, and $(120 - 32.2104760492461)/0.0012 = 73157.9366256283$ stb, the same answer by a second route. Two routes, one number: that is what exact means, and it is your best defence against slips.

## Exercise

Compute Ekene-1's cumulative at $t = 182$ days by both routes: the ceiling form with the bracket, and the rate-drop form using $q(182) = 96.4564626973622$ stb/d. Confirm both give 19619.6144188648 stb, then state what fraction of the ceiling the well had delivered by that date.
