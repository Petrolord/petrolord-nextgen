# Underground withdrawal

The left side of the balance is the underground withdrawal, written $F$. It answers one question: how much reservoir volume did we take out of the tank? Not how many barrels arrived in the stock tank, but how much space they vacated while they were still down there, hot and holding their dissolved gas.

That distinction is the whole content of the term, and it is why $F$ is measured in reservoir barrels while production reports are written in stock tank barrels.

## The general form

$$F = N_p \left[ B_t + B_g (R_p - R_{si}) \right] + W_p B_w$$

Three ideas, in order.

$N_p B_t$ is the reservoir volume occupied by the produced oil together with the gas that was dissolved in it at the start. $B_t$ is the two-phase formation volume factor, which accounts for oil and its original gas as one package.

$N_p B_g (R_p - R_{si})$ is the correction for gas produced beyond the original dissolved amount. $R_p = G_p / N_p$ is the cumulative produced gas oil ratio. If the tank has been producing free gas, from a gas cap or from gas that came out of solution, then $R_p$ exceeds $R_{si}$ and this term adds the reservoir volume that free gas occupied. Free gas is bulky, so this term dominates $F$ in a saturated reservoir.

$W_p B_w$ is the reservoir volume of the produced water.

Every term is a surface volume multiplied by a formation volume factor. That is the pattern to remember: material balance lives in reservoir barrels, and the factors are the exchange rate.

## What Ekene does to it

Two of the three terms are zero for this tank, and both for reasons established in module 1.

The tank never crosses the bubble point, so $R_p = 400.000000000000$ scf/stb at every survey, exactly equal to $R_{si}$. The bracket $(R_p - R_{si})$ is zero, so the free gas term vanishes no matter what $B_g$ is.

No water has been produced, so $W_p = 0$ at every survey and the water term vanishes too.

And since the tank stays undersaturated, $R_s = R_{si}$ and therefore $B_t = B_o$. The general form collapses to a single product:

$$F = N_p B_o$$

Two numbers, one multiplication, straight off the survey row. Enjoy it while it lasts; the Professional tier restores the terms this tank happens not to need.

## Work two rows by hand

Survey 2, the record of 2021-01-01:

$$F = 99594.7403971816 \times 1.20600602311013 = 120111.856789091 \text{ rb}$$

Survey 6, the last one, 2023-01-01:

$$F = 261475.039999678 \times 1.21589748101760 = 317926.842484584 \text{ rb}$$

Stop and do both on a calculator now. They are single multiplications and they should match to every figure your calculator carries. If they do, you can compute an underground withdrawal for any undersaturated tank you will ever meet.

Notice what the second one says. The field produced 261475.039999678 stb of oil, and that oil vacated 317926.842484584 reservoir barrels of space. The vacated space is larger than the produced volume by exactly the factor $B_o = 1.21589748101760$, which is simply the formation volume factor doing its job.

## The error that grows on you

Here is the trap that catches people who half remember the formula: using the INITIAL formation volume factor instead of the one at survey pressure. It looks harmless, since $B_{ti} = 1.20000000000000$ and $B_o$ at the last survey is 1.21589748101760, barely more than one percent apart.

Work it through. At the last survey the wrong version gives

$$N_p B_{ti} = 261475.039999678 \times 1.20000000000000 = 313770.047999614 \text{ rb}$$

against the true 317926.842484584 rb, an error of -1.30746886688920 percent. At survey 2 the same mistake gives 119513.688476618 rb against 120111.856789091 rb, an error of -0.498009379309742 percent.

The error is small, but look at its shape: it is not the same size at every survey. It grows as the pressure falls, because $B_o$ walks steadily away from $B_{ti}$. That is far worse than a constant error. A constant error would tilt the whole answer by a fixed fraction and could be spotted; an error that grows with depletion bends the relationship between withdrawal and expansion, and a bend is the same signature that genuine reservoir physics leaves. You would be diagnosing the reservoir when you should be diagnosing your spreadsheet.

The rule: $F$ always uses the fluid properties at the pressure of the survey being computed. Only the expansion terms look back at initial conditions.

## See it in the panel

{{panel:mb-tank-explorer}}

Read the F column down the six surveys and confirm two things. First, that each entry equals that row's cumulative oil times that row's $B_o$. Second, that F rises every step even though the period production is falling, because F is cumulative by construction. Then compare the F column against the Np column: the ratio between them is not constant, and the reason is that $B_o$ is climbing.

## The units habit

$N_p$ is in stb. $B_o$ is in rb/stb. The stb cancel and $F$ comes out in rb. $B_g$ is in rb/scf, $R_p$ and $R_{si}$ are in scf/stb, so $N_p B_g (R_p - R_{si})$ is stb times rb/scf times scf/stb, which is rb again. $W_p B_w$ is stb times rb/stb, also rb.

Every term of $F$ is in reservoir barrels or the formula is wrong. Checking that takes five seconds and catches most of the errors people make when they extend the equation to a fluid system they have not worked before.

## Exercise

Compute $F$ for survey 4, dated 2022-01-01, from its cumulative oil of 195407.593210859 stb and its $B_o$ of 1.21184099489560 rb/stb. Check yourself against 236802.932166801 rb.

Then answer this without computing anything: a neighbouring tank has produced the same 195407.593210859 stb, has produced no water, but has crossed its bubble point so that its $R_p$ has climbed to 620 scf/stb against an $R_{si}$ of 400. Which term of the general formula reappears, and will that tank's $F$ be larger or smaller than Ekene's at the same cumulative oil? Say why in one sentence.
