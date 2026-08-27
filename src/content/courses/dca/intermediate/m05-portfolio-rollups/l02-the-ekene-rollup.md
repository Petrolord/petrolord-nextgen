# The Ekene roll-up

Now roll the field up properly. Each of the four producers gets one base oil scenario: fit on its primary window, forecast forward with a 10 stb/d economic limit and stop-at-limit on, save. Four scenarios, one group, one stream. This lesson works the total that comes back, and the more interesting number, which is the difference between that total and the one you would get by hand.

## Worked example: the four bookings, two totals

Every scenario carries the EUR its forecast produced, and the engine forecast is a day-by-day sum of rates. Beside each one, here is the closed-form EUR at the same 10 stb/d limit, from module 5 of the Associate tier:

| Well | Engine daily-sum EUR (stb) | Closed-form EUR (stb) | Difference (stb) |
|---|---|---|---|
| Ekene-1 | 91604.1233600709 | 91666.6666666667 | -62.5433065957332 |
| Ekene-3 | 111190.357687804 | 111270.166537926 | -79.8088501215243 |
| Ekene-5 | 153460.685241267 | 153505.672866270 | -44.9876250025700 |
| Ekene-6 | 105220.368975831 | 105266.626461929 | -46.2574860986206 |

Two totals follow:

$$\text{roll-up total} = 461475.535264973 \text{ stb}$$

$$\text{closed-form total} = 461709.132532792 \text{ stb}$$

The gap is 233.597267818404 stb, which is 0.0505940323374074 percent of the closed-form total.

## Where the gap comes from, and why it grows

Module 3 of this tier derived the mechanism on one well. The forecast loop evaluates the rate at day 1, day 2, day 3 and so on, and adds each value as though it held for the whole of that day. For a declining rate, the value at the end of a day is the lowest rate in that day, so every single step credits slightly too little volume. The bias is one-sided by construction.

That is the part people already accept. The part worth taking from this lesson is what one-sided bias does to a portfolio. Random errors partly cancel when you add them up: four independent errors of similar size add to about twice one of them, not four times. One-sided errors do not cancel at all. They add, term for term, forever. Sum the four differences in the table and you get -233.597267818448 stb, which is the roll-up gap to the last barrel, because the roll-up total is nothing but the sum of those four EURs.

You can predict the size of each well's gap before running anything. A right-endpoint sum of a smoothly declining rate misses roughly half of the total drop across the forecast, once, so the error is on the order of $(q_i - q_{limit})/2$:

| Well | $(q_i - q_{limit})/2$ | Actual gap |
|---|---|---|
| Ekene-1 | 55 | -62.5433065957332 |
| Ekene-3 | 70 | -79.8088501215243 |
| Ekene-5 | 45 | -44.9876250025700 |
| Ekene-6 | 40 | -46.2574860986206 |

Close enough to be a real check, and the residue is the truncated last step, where the forecast stops on the first day the rate falls below the limit rather than exactly at the crossing. The point of the estimate is not precision, it is order of magnitude: this discretization costs the Ekene field tens of barrels per well, not thousands. If a roll-up total ever sits thousands of barrels away from the closed-form sum, discretization is not your explanation and you should go looking for a stale scenario or a different economic limit.

## Stop and check it yourself

Add the four closed-form EURs on a calculator: 91666.6666666667 plus 111270.166537926 plus 153505.672866270 plus 105266.626461929. You should land on 461709.132532792 stb. Do it now, because that total is a graded capstone field and it is one of the few in the whole course you can produce with nothing but the Associate closed forms and four keystrokes.

## Which total do you report?

Both. Or rather: one of them, with a sentence saying which.

The closed-form total, 461709.132532792 stb, is the analytic answer to "what does this set of Arps parameters imply at a 10 stb/d limit". The roll-up total, 461475.535264973 stb, is the answer to "what did the software's daily forecast actually accumulate". Neither is wrong. They answer different questions, and the difference between them here is smaller than the width of a pencil line on any chart you will draw.

The named misconception is **"the difference means one of them is broken"**. It does not. It means you are looking at an integral and a Riemann sum of the same function, and you should know which one is in the cell before you defend the cell. On this field the gap is 0.0505940323374074 percent. On a portfolio of two hundred wells with the same bias, it is still about that percentage, because the bias scales with the number of wells exactly the way the total does.

## Exercise

1. Ekene-5's forecast runs 6000 daily points and its gap is the smallest of the four, at -44.9876250025700 stb, even though its EUR is the largest at 153505.672866270 stb. Ekene-3's forecast is less than half as long and its gap is the largest at -79.8088501215243 stb. Explain that in one sentence using the $(q_i - q_{limit})/2$ estimate, and say what property of the forecast the gap actually tracks.

2. Suppose a colleague reports a four-well roll-up total of 458000 stb for this same field and the same limit. The discrepancy against the closed-form total is about 3700 stb. Using the order-of-magnitude argument above, state why discretization cannot account for it, and list the three causes from the previous lesson that could.

3. Compute what fraction of the closed-form field total each well contributes. You will need those four percentages again in lesson 4, where they turn out to say something uncomfortable about which well the field number rests on.
