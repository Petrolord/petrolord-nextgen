# The gas tank

Everything so far in this course has been oil. The tank had oil in it, the expansion terms were oil expansion terms, and the unknown was a number of stock tank barrels. Gas reservoirs run through the same machinery with different contents, and the differences are instructive enough to be worth a module of their own.

The published case for this module is Pletcher's two-cell gas simulation model from SPE 75354, a 2002 paper on improvements to material balance methods. It is a synthetic reservoir, which is exactly what makes it valuable: because it came from a simulator, the true answers are known. The gas originally in place is 100.8 Bcf. The aquifer holds 74.5 MM reservoir barrels of water. By year ten the simulator says 2494000 reservoir barrels of that water had crossed into the gas cap. Nothing you compute has to be argued about. It is either right or it is not.

The reservoir starts at 6411 psia and 239 degrees F, with a connate water saturation of 0.15, formation compressibility 0.000006 per psi, water compressibility 0.000003 per psi, and a gas gravity of 0.65.

## The same balance, different terms

The gas material balance is the same statement as the oil one: what came out equals what expanded plus what came in.

$$F = G \, E_g + G \, E_{fw} + W_e$$

with the withdrawal measured the same way,

$$F = G_p B_g + W_p B_w$$

and the expansions defined as

$$E_g = B_g - B_{gi}, \qquad E_{fw} = B_{gi} \frac{S_{wi} c_w + c_f}{1 - S_{wi}} \left( p_i - p \right), \qquad E_t = E_g + E_{fw}$$

Everything the Associate tier taught about $F$ and $E_t$ transfers. The unknown is still a slope, the withdrawal is still on one axis and the expansion on the other, and water influx still has to be accounted for or it will be absorbed by the unknown.

Two practical differences bite immediately.

**The expansion terms are per unit of gas, not per unit of reservoir.** $E_g$ and $E_{fw}$ both come out in reservoir barrels per standard cubic foot of gas in place, so multiplying by $G$ in scf gives reservoir barrels. The engine carries them internally in RB per scf, but lab data arrives in RB per Mscf, and the engine's input field is named `bg_rb_mscf` for that reason, with a comment in the source insisting on Mscf and not scf. A factor of a thousand in a formation volume factor is the single most common data-loading error on the gas side, and it does not announce itself: it just moves your gas in place by three orders of magnitude.

**The compressibility grouping is the same trap as on the oil side.** It is $S_{wi} c_w + c_f$ in the numerator, not $S_{wi}(c_w + c_f)$. Connate water expands in proportion to how much of the pore space it occupies, but rock compaction shrinks the whole pore volume regardless of what is sitting in it. For this reservoir the correct group is

$$\frac{0.15 \times 0.000003 + 0.000006}{1 - 0.15} = 0.00000758823529411765$$

while the misreading gives $0.00000158823529411765$, less than a quarter of it.

## Why gas tanks are easier

Here is the reason gas material balance has a reputation for being straightforward, and it is quantitative rather than temperamental.

Gas is enormously compressible. As the Pletcher reservoir falls from 6411 psia to 2638 psia, its formation volume factor rises from $0.6279$ to $1.2829$ RB per Mscf, a factor of $2.04315973881191$. The gas expands to twice its reservoir volume, and that expansion is doing the producing.

Now put the rock and connate water term beside it. At year ten the pressure drop is $3773$ psi, so

$$E_{fw} = 0.6279 \times 0.00000758823529411765 \times 3773 = 0.0179770355470588 \ \text{RB/Mscf}$$

against

$$E_g = 1.2829 - 0.6279 = 0.655 \ \text{RB/Mscf}$$

The rock and water term is $0.0274458557970364$ of the gas expansion, and $2.67127028078238$ percent of the total expansion $E_t$.

Compare that with the undersaturated oil tank the Associate tier worked, where the rock and connate water term carried $39.2996108949418$ percent of total expansion. On the oil side, getting the compressibility grouping wrong wrecks the answer. On the gas side, the same mistake moves a term that is worth under three percent of the total, so the error in the gas in place is correspondingly smaller.

That is the real content of "gas is easier": one term dominates so completely that the answer is robust against errors in the others. It is not that gas obeys simpler physics. It is that the signal to noise ratio in the expansion is far better.

## Worked example: reading the drive split

Run the published case through the engine with its pot aquifer and read the drive indices at year ten. The engine reports them as `gdi`, `cdi` and `wdi`, which on the gas path map directly onto Pletcher's own gas drive index, compressibility drive index and water drive index:

| index | engine | Pletcher |
|---|---|---|
| gas expansion, IGD | 0.941809113312943 | 0.942 |
| rock and water, ICD | 0.0258487571123217 | 0.026 |
| water influx, IWD | 0.0328166271192876 | 0.033 |
| sum | 1.00047449754455 | 1.001 |

Gas expansion is doing 94 percent of the work. Water influx is doing 3.3 percent. Rock and connate water are doing 2.6 percent. All three agree with the published values to the last figure Pletcher printed, and the sum closes to within five parts in ten thousand of unity.

Two things follow. First, this is a weak aquifer by any reasonable reading of the drive split, and the engine classifies it as such. Second, and this is the point the rest of the module turns on, a mechanism that only carries 3.3 percent of the drive can still ruin your gas booking, because its effect on the plot is not proportional to its share of the drive. Hold that thought until lesson 3.

## Exercise

From the Pletcher PVT table, the formation volume factor is $0.7327$ RB per Mscf at 5093 psia and $0.6279$ RB per Mscf at the initial 6411 psia. Compute $E_g$ and $E_{fw}$ at 5093 psia, then work out what fraction of the total expansion the rock and water term carries at that pressure.

Compare that fraction against the $2.67127028078238$ percent computed above for year ten, and answer two questions. First, does the rock and water share rise or fall as the reservoir depletes, and why does it move in that direction given that $E_{fw}$ is linear in the pressure drop? Second, if you had loaded $B_g$ in RB per scf instead of RB per Mscf, which quantities in the balance would be wrong, and would the ratio you just computed be one of them?
