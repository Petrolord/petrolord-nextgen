# When the gas is not solution gas

Ekene never drops below its bubble point, so its free gas term is identically zero and the whole gas half of the voidage equation sleeps through the course. That makes Ekene a clean teaching field and an incomplete one. This lesson works the case Ekene does not contain, because you will meet it, and because the failure it produces is not subtle.

## What happens below the bubble point

Above the bubble point the oil holds all its gas in solution, $R_s$ is constant at its initial value, and $B_o$ falls slowly and linearly as pressure drops, because the oil is simply expanding.

Cross the bubble point and both of those reverse. Gas starts coming out of solution in the pores. $R_s$ falls, because the oil now carries less gas. $B_o$ falls steeply, because the oil is shrinking as it loses that gas, not expanding. And a new phase appears in the pore space, with its own saturation, its own relative permeability, and its own formation volume factor $B_g$ which is both small and violently pressure-dependent.

The production consequence is a rising gas oil ratio. Free gas is far more mobile than oil, so once there is enough of it to flow, it flows preferentially, and the well produces an increasing volume of gas for each barrel of oil. That is the signature.

## The voidage consequence

Free gas occupies pore space, so producing it creates voidage that the oil term does not account for. Now the subtraction in

$$G_{\text{free}} = \max\left(0,\ G_p - \frac{R_s N_p}{1000}\right)$$

starts returning a large positive number, and $G_{\text{free}} B_g$ starts to matter.

Work an example. A field produces 5000 stb of oil and 4000 Mscf of gas in a month, with $R_s = 500$ scf/stb, $B_o = 1.3$ and $B_g = 0.8$ rb/Mscf. Solution gas is $500 \times 5000 / 1000 = 2500$ Mscf, so

$$G_{\text{free}} = 4000 - 2500 = 1500 \text{ Mscf}, \qquad G_{\text{free}} B_g = 1200 \text{ rb}$$

against an oil term of $5000 \times 1.3 = 6500$ rb. The free gas is already 18.46 percent of the oil voidage.

Now let the gas oil ratio climb, which is what actually happens, and hold everything else fixed. At 6000 Mscf produced:

$$G_{\text{free}} = 3500 \text{ Mscf}, \qquad G_{\text{free}} B_g = 2800 \text{ rb}$$

which is 43.08 percent of the oil term. The oil rate has not moved. The voidage the field is creating has grown by 25 percent of the oil term, purely in gas.

An operator whose ledger has $B_g$ blank sees none of this. Their VRR looks unchanged while their real voidage replacement is collapsing, and the pressure keeps falling for reasons their surveillance number cannot express.

## Why $B_g$ makes it worse

$B_g$ is roughly inversely proportional to pressure. As the reservoir depletes further, each thousand standard cubic feet of gas occupies MORE reservoir space, so the free gas term grows for a second, independent reason on top of the rising gas oil ratio. The two effects compound, and they compound fastest exactly when the pressure is falling fastest.

This is why gas voidage is the term that ends floods. A field that goes below its bubble point and keeps producing can reach a state where most of its voidage is gas, and no achievable water injection rate can replace it.

## What the injected side looks like

If the answer is to inject gas rather than water, the injected term $G_i B_g$ enters with no subtraction, because injected gas is free gas by definition. It is efficient at replacing gas voidage, since it is the same phase at the same conditions. Whether it is a good idea depends on compression cost, on whether the gas is worth more sold, and on whether it will cusp into the producers, none of which the ledger can see.

## Reading Ekene honestly in this light

Everything above is why the Ekene fixture's design note says what it says: gas is all solution gas, $B_g$ is zero, and liquid voidage is the whole story. That is a true statement about that reservoir at that time, not a simplification for teaching. The right lesson to take is not "gas does not matter" but "check whether it matters, on this field, in this period, and be able to say why the answer is what it is".

## The misconception to avoid

"If the gas oil ratio is rising, the reservoir is producing more gas." It is producing more gas per barrel of oil, which is usually a different thing. Free gas takes flow capacity away from oil, so the oil rate falls at the same time. A rising gas oil ratio at a constant total gas rate is a falling oil rate wearing a disguise, and a voidage calculation that only tracks liquids will not tell you which one you are looking at.

## Exercise

First, take the 5000 stb, 4000 Mscf case above and find the produced gas volume at which the free gas voidage term equals the oil voidage term. Express your answer both as Mscf and as a producing gas oil ratio in scf/stb.

Second, explain in three sentences why a field that has gone below its bubble point can be at a VRR of 1.0 on liquids alone and still be losing pressure. Name the observable you would ask for to confirm your explanation.
