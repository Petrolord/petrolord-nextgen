# Which base each instrument reads

{{panel:pia-royalty-calculator}}

A rate is half of an instrument. The other half is its base: the value, volume, cost or profit the rate multiplies. Two instruments with the same rate can raise very different sums because they read different bases. This lesson reads the base of every line on the stack and the provision that sets it, and leaves the working of the hydrocarbon tax base to the Professional tier.

## The bases, line by line

| instrument | base it reads | citation |
| --- | --- | --- |
| production royalty, liquids | value of crude oil plus condensate, at the tranche rate | PIA Seventh Schedule para 10 |
| production royalty, gas | value of gas and NGL, at 5 or 2.5 percent | PIA Seventh Schedule para 10(6) |
| royalty by price | value of crude oil and of condensate, each at its own price | PIA Seventh Schedule para 11 |
| HCDT contribution | 3 percent of the preceding year's opex | PIA s.240(2) |
| NDDC levy | 3 percent of the total annual budget (opex plus capex) | NDDC Act 2000 s.14(2)(b) (secondary source) |
| hydrocarbon tax | crude and condensate profit after royalties, capped costs, HCDT, NDDC and allowances | PIA ss.260, 263, 267; NTA ss.65, 68, 72 |
| companies income tax | oil and gas profit after royalties, opex, HCDT, NDDC and its own capital allowance | PIA s.302; NTA s.56(b), s.78, s.82 |
| tertiary education tax | companies income tax assessable profit, in years under the Act alone | Finance Act 2023 s.26 |
| development levy | companies income tax assessable profit, in years under the Nigeria Tax Act 2025 | NTA s.59(1) |

## Royalty reads value

All three royalty lines read the value of production. None reads profit or cost. That is why royalty is paid in a year that makes a loss, and why the royalty lines were enough for the first four modules.

## The hydrocarbon tax reads a liquids profit

The hydrocarbon tax reads crude oil and condensate only. Gas sits outside it. The Act lets royalties come off its base, PIA s.263(1)(b):

> "(b) all royalties the liability for which was incurred and were paid by the company during that period in respect of crude oil and associated gas"

and the contributions, PIA s.263(1)(h), which names host communities development trusts and the Niger Delta Development Commission among the approved funds. The same base is limited by a cost price ratio and reduced by allowances; the Professional tier works both. The Act also says what may never come off, PIA s.264(l):

> "(l) amounts incurred in respect of tertiary education tax, companies income tax, any income tax, profits tax or other similar taxes, whether charged within Nigeria or elsewhere ;"

## Companies income tax reads the whole profit

Companies income tax reads oil and gas together, deducts opex in full, and never deducts the hydrocarbon tax, PIA s.302(5):

> "(5) In determining the companies income tax, the hydrocarbon tax under this Act shall not be deductible."

## Costs shared with gas

When a field sells gas as well as liquids, some costs serve both. The engine enters shared costs in the hydrocarbon tax at the crude-plus-condensate share of gross revenue, and states it in a note, because the texts allocate associated gas costs to crude oil and the engine cannot tell the two gases apart. On Ekene Alpha that share is 0.970075 in every year.

## The education charge reads the income tax base

The tertiary education tax and the development levy both read the companies income tax assessable profit. The development levy is kept off the hydrocarbon tax profit by NTA s.59(4).

## Exercise

Open the royalty calculator and choose "The instruments stacked on a ledger". Run worked_example_inputs_default. In the case box change pia_prior_year_opex_usd from 170000000 to 0 and run it again. Say which lines moved and why, from the table of bases. Restore it, then change pia_nddc_levy_fixed_usd to null so the engine charges the NDDC levy on the total annual budget, run it, and list every line that moved with the NDDC line. Finally run ekene_alpha_shallow_converted_nta and find the note about shared costs among the notes below the table.
