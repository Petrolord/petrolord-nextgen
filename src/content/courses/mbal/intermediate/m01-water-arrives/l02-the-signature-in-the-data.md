# The signature in the data

Ignoring water influx inflates the oil in place. What you need next is a way to find out that water is arriving when nobody tells you.

You already own the instrument. The Associate tier established that $F/E_t$ is the same number at every survey of a closed tank, and that the constancy IS the straight line through the origin, written as a column instead of drawn as a picture. This lesson asks a harder question of that column: not "is this a tank", but "what is this column able to detect".

## What the column is actually measuring

Start from the balance with influx and divide through by the total expansion:

$$\frac{F}{E_t} = N + \frac{W_e}{E_t}$$

The apparent oil in place is the true oil in place plus a contamination term, so the column has two independent features worth reading.

**The level.** Where the column sits. It sits above $N$ by $W_e / E_t$ at every survey, and it can never sit below.

**The drift.** Whether the column moves as the surveys go on. It moves if and only if $W_e/E_t$ moves, which is a question about how the influx accumulates relative to how the expansion grows.

Most people collapse those two and assume a flat column means no water. A flat column means the contamination term is not changing. That is a much weaker statement, and this lesson is about how much weaker.

## The control case

{{panel:mb-tank-explorer}}

Leave the selector on "None (the truth)" and read the $F/E_t$ column down the six Ekene surveys. It runs 12139208.1074970, 12139208.1074967, 12139208.1074967, 12139208.1074967, 12139208.1074969 and 12139208.1074968 stb. Fourteen significant figures of agreement, an intercept tile reading $-6.11180439591408 \times 10^{-10}$ rb, and an R-squared of 1.

That is what no influx looks like. The drive index tiles agree: the water drive index reads exactly zero and the aquifer strength tile reads none, because the engine classifies aquifer strength off the water drive index alone.

## The case that catches people

Now give the constructed tank of lesson 1 a smaller aquifer, 5000000 rb, so the effect is realistic rather than dramatic. Its true oil in place is 12000000 stb. Read the six surveys as a closed tank:

| n | days | $F$ rb | $E_t$ rb/stb | $F/E_t$ stb | excess over true $N$ |
|---|---|---|---|---|---|
| 1 | 182 | 51898.4893095940 | 0.00385161215877544 | 13474484.7534427 | 12.2873729453554 % |
| 2 | 366 | 133513.092555843 | 0.00990959330989369 | 13473115.2309292 | 12.2759602577434 % |
| 3 | 547 | 204331.120098548 | 0.0151671766865258 | 13471928.5152174 | 12.2660709601450 % |
| 4 | 731 | 263570.913910665 | 0.0195658931653226 | 13470936.9862962 | 12.2578082191352 % |
| 5 | 912 | 312273.739521746 | 0.0231826946501787 | 13470122.6166277 | 12.2510218052304 % |
| 6 | 1096 | 354189.929971647 | 0.0262958515970827 | 13469422.3027537 | 12.2451858562810 % |

Read the column as a column first. From the first survey to the sixth it moves by $-0.0375706439360688$ percent, which on any real dataset is flat. The fitted line returns an R-squared of 0.999999988185953 and an intercept of 37.8240187615156 rb, indistinguishable from zero against withdrawals of a third of a million reservoir barrels. Fit the early three surveys against the late three, the Associate tier's cheapest uncertainty check, and the slopes differ by 0.0449179133362590 percent.

Every straightness test this course teaches passes, and the answer is 12.24 percent too high, by about one and a half million stock tank barrels.

## Why it is flat, and what that tells you

The influx in that tank is a pot aquifer, which module 2 builds properly. All you need here is its shape: the water delivered is proportional to the drawdown, $W_e \propto \Delta p$. The total expansion is also very nearly proportional to the drawdown, and a quantity proportional to $\Delta p$ divided by another proportional to $\Delta p$ does not depend on $\Delta p$. So the contamination term is close to constant and the column barely moves.

That gives you the rule this lesson exists for. **The ratio column tests whether one model describes the whole history. It does not test whether that model is the right one.** An aquifer whose influx tracks the pressure drop instantly is invisible to it, because such an aquifer imports volume in exactly the proportion the closed tank model is already prepared to explain, and the model absorbs it by inflating $N$.

Two things do catch it. The first is drift, when the influx does not track the pressure drop instantly, which is lesson 3. The second is the reconciliation the Associate tier built. A closed tank reading 12.24 percent above an independent volumetric booking, with a perfect line and no drift, is not a data problem and not a bookkeeping mistake. It is a model missing a term. That is where the reconciliation stops being a closing courtesy and becomes a working diagnostic: it is the only instrument you have that can see the level.

## Worked example

Audit survey 4 of the table above in isolation, the way you would audit a number a colleague sent you. Its withdrawal is 263570.913910665 rb and its total expansion 0.0195658931653226 rb/stb, so the apparent oil in place is 13470936.9862962 stb. The volumetric booking is 12000000 stb, so the gap is

$$13470936.9862962 - 12000000 = 1470936.9862962 \ \text{stb}$$

which is 12.2578082191352 percent of the booking, with material balance on the high side.

Now use the direction. Material balance above volumetrics points at either a map that is too small or support the closed tank model has not been told about. Here the line is straight, the intercept is 37.8 rb, the two half fits agree to four decimal places, and the ratio column is flat. Nothing in the dynamic data is misbehaving, which leaves the model explanation standing.

Then convert the gap into the missing term:

$$W_e = (13470936.9862962 - 12000000) \times 0.0195658931653226 = 28780.195926793 \ \text{rb}$$

That is the influx at that survey, matching the 28780.1959267936 rb the pot model puts there, because multiplying the gap back by the expansion undoes the division that made it. And the subtraction works only because somebody handed you $N$ from an independent route. Take the booking away and the same six surveys support any pairing of $N$ and $W_e$ that adds up, which is the difficulty module 2 has to solve.

At this point it is enough to write "the tank appears to be receiving of order thirty thousand reservoir barrels of influx by 2022-01-01, against a volumetric booking of 12000000 stb" and go and choose a model.

## Exercise

With the selector on "None (the truth)", write down the Ekene $F/E_t$ column and the intercept, then write down the constructed tank's ratio column and its intercept of 37.8240187615156 rb from the table above.

Two questions. Using only those two sets of numbers, could you tell which tank has an aquifer? Say exactly which comparison you would have to be able to make. Then: the constructed tank's column falls very slightly rather than being perfectly flat. Given that its influx is proportional to drawdown while its oil expansion grows very slightly faster than proportionally, work out which way the contamination term must move and confirm it matches the table.
