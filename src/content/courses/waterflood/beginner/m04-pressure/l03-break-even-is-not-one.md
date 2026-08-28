# Break-even is not one

Everyone knows that a voidage replacement ratio of one holds pressure. On the Ekene ledger it does not. The break-even ratio, the value at which the pressure stops falling and starts rising, is

$$\text{VRR}_{\text{break-even}} = 0.9869719699960521$$

This lesson derives that number, explains why it is not a defect, and draws the general lesson about conventions.

## The derivation

Take the closed-form inversion from the previous lesson and ask when the pressure stops moving. Pressure is flat when the numerator $N_p + W$ stops changing, that is, when the monthly increment is zero:

$$\Delta N_p + \frac{(\Delta W_p - \Delta W_i) B_w}{B_{oi}} = 0$$

While the field produces no water, $\Delta W_p = 0$, and the injection is set by the VRR target:

$$\Delta W_i B_w = \text{VRR} \times \Delta N_p B_o$$

Substitute:

$$\Delta N_p - \frac{\text{VRR} \times \Delta N_p B_o}{B_{oi}} = 0$$

Divide by $\Delta N_p$ and solve:

$$\boxed{\text{VRR}_{\text{break-even}} = \frac{B_{oi}}{B_o}}$$

For Ekene, $B_{oi} = 1.2$ at the initial 3200 psia and the ledger's frozen $B_o = 1.21584$ at 2100 psia, so

$$\frac{1.2}{1.21584} = 0.9869719699960521$$

Break-even sits 1.3 percent below one.

## Why this happens

The ledger and the tank are referenced to different pressures, and they are measuring different things.

The ledger asks: how much reservoir space did this month's production occupy, at flood-era conditions? It answers with $B_o$ at 2100 psia, because that is where the fluid was when it left.

The tank equation asks: how much has this reservoir's contents expanded relative to their INITIAL state? Its reference is $B_{oi}$ at 3200 psia, because that is the state the expansion is measured from.

Those references differ by 1100 psi of oil expansion, which is 1.3 percent of volume. So a barrel of oil that the ledger books as 1.21584 rb of voidage only represents 1.2 rb of demand on the tank's initial expansion budget, and replacing the full 1.21584 rb over-replaces slightly.

Neither is wrong. They are consistent answers to two different questions, and the 1.3 percent gap is the price of asking them separately.

## Where you can see it

The Ekene target profile crosses 1.0 between the fourth and fifth months: the target is 0.97 in month index 3 and 1.01 in month index 4. If break-even were 1.0, the pressure trough would sit at month index 4.

It does not. The trough is at month index 3, labelled 2023-04, at 2088.9530115439275 psia. The month with a target of 0.97 was already ABOVE the 0.9869719699960521 break-even, so pressure had already started rising by then.

That is a real, observable consequence of a convention choice, visible in the position of a minimum, and it would be very easy to mistake for a small error in the data.

## The general lesson

Whenever you compute a threshold, ask what reference the two sides of the comparison use. Here the two sides were "voidage as booked" and "expansion as modelled", and they carry different reference pressures. The same class of gap appears whenever a surface measurement is compared against a reservoir model, and it is almost always small, and it is almost always in a predictable direction.

Predictable direction, in this case: since $B_o > B_{oi}$ for a depleted undersaturated oil, break-even is always BELOW one on a frozen convention set at a lower pressure than initial. A flood that appears to be slightly under-replacing on the ledger may be exactly holding pressure.

## What removes the gap

Tracking $B_o$ on the actual pressure does not remove it either, because the tank reference is still $B_{oi}$. The gap is structural: it is the difference between measuring voidage at current conditions and measuring expansion from initial conditions. What removes it is asking one question instead of two, which is what a full material balance history match does, and which is the Material Balance course rather than this one.

For flood surveillance, the right response is not to remove the gap but to know its size. On Ekene it is 1.3 percent. If someone is arguing about whether to run at 1.00 or 1.02, that argument is inside the noise of the convention.

## The misconception to avoid

"Break-even below one means the field can safely under-inject." It means the ARITHMETIC break-even is below one on this ledger's conventions, on a field with no aquifer, no gas cap, no free gas and no produced water. Introduce produced water and the $\Delta W_p$ term reappears in the derivation and moves the answer. Ekene's later months do produce water, and the clean $B_{oi}/B_o$ result is a statement about the dry period only.

## Exercise

First, redo the derivation keeping the $\Delta W_p$ term, and write the break-even VRR as a function of the water cut expressed as $\Delta W_p / \Delta N_p$. Evaluate it for Ekene's final month, where $\Delta N_p = 3670.7384235169648$ stb and $\Delta W_p = 962.9824550781937$ bbl.

Second, suppose the ledger had frozen its factors at the initial 3200 psia instead of at 2100 psia. State what the break-even VRR would then be, and explain in one sentence what that choice would have done to the reported cumulative VRR.
