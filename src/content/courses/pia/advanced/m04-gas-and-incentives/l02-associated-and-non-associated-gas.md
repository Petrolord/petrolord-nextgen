# Associated and non-associated gas

{{panel:pia-ledger-calculator}}

The texts draw a line between gas produced with crude oil and gas produced on its own, and several provisions turn on it. The engine cannot see the line. This lesson reads the texts and names the approximation the engine makes in its place.

## What the texts say

The hydrocarbon tax charges crude oil and the liquids that come with associated gas. PIA s.260(1)(a): "(a) hydrocarbon tax shall apply to crude oil as well as field condensates and liquid natural gas liquids derived from associated gas and produced in the field upstream of the measurement points ;". NTA s.65(2)(a) repeats it.

Liquids from non-associated gas are outside it. S.260(1)(b)(ii) excludes "(ii) condensates and natural gas liquids produced from non-associated gas in fields or gas processing plants, provided the related volumes are determined at the measurement points or at the exit of the gas processing plant,".

The costs of associated gas are pushed onto crude oil. S.260(2): "(2) The costs of production of associated gas, upstream of the measurement point shall be allocated to crude oil for the purposes of calculating hydrocarbon tax, provided that capital and operating costs for wells solely" producing gas-cap gas are treated differently.

And the royalty deduction follows the same line. S.263(1)(b) allows "all royalties the liability for which was incurred and were paid by the company during that period in respect of crude oil and associated gas".

## What the engine does instead

A production row in the engine carries oil, condensate and gas, with no tag saying whether the gas is associated. So the engine cannot split costs or condensate the way s.260 does. It uses one stated rule and says so in a note on any ledger with gas:

> Opex, HCDT, NDDC, capital allowances and any decommissioning contribution enter the hydrocarbon tax at the crude-plus-condensate share of gross revenue. The Act allocates associated-gas costs to crude oil (s.260(2)) and excludes non-associated gas condensate from the tax (s.260(1)(b)(ii)); the engine cannot tell the two gases apart.

On Ekene Alpha, which sells associated gas, the crude-plus-condensate share of gross revenue is 0.970075 in every year from 2026 to 2032. So about 3 percent of every shared cost is kept out of the hydrocarbon tax base, where s.260(2) would put all of an associated gas cost on crude oil. The gap grows with the gas share of revenue, and a reader should say so.

## Why it stays concept-only

The split is taught from the text and never graded on a number: here the engine returns a stated approximation of a rule it cannot apply, so the course keeps it visible and out of every capstone.

## Exercise

Open the ledger calculator on "The whole ledger, year by year" and load ekene_alpha_shallow_converted_nta. Find the note on shared costs under the ledger. In the case, set every gas volume in the production rows to 0 and run it again: check whether the note is still there, and explain from the note's own condition why. Then load ekene_nag_gas_in_country_half, a field with gas and no crude oil, and explain from s.260(1) why its hydrocarbon tax column reads 0.000000.
