# Capital after the expiry

{{panel:prms-reserves-calculator}}

If no renewal is expected, the years after the licence expiry are cut from the forecast. A capital cost in one of those years would then belong to a period the company has no right to operate in, and it would be spent on barrels the engine has already removed. The engine refuses such a call and names the capital row that falls after the expiry.

## The refusal

The golden input econ-refuse-capex-after-licence states a licence expiring in 2030 with no renewal expected, and a capital row in 2031. The engine's message, verbatim:

> costs.capex[0].year must be at most 2030, the licence expiry, when no renewal is expected; got 2031

The message names the row, the expiry and the condition. The engine does not move the capital, drop it or guess the renewal, since each would change a Reserves figure by a choice the caller did not make.

## What the caller can do

Three honest answers are open, and each is a stated input. If the capital truly falls after the expiry and a renewal is expected, state the renewal, and the engine runs the whole forecast with the capital in it. If the capital belongs inside the licence, state its year there. If the project has no right to spend it, remove it from the costs. The reasons print whichever you choose.

## One capital row a year

A second capital row for the same year is refused as well, because two rows for one year would leave the engine to decide how to add them:

> costs.capex[1].year must be a year no other capex row has; got 2027

## An expiry before the start

A licence must also run at least to the effective year. On EKN-1, effective 2027, an expiry in 2026 is refused, verbatim:

> licence.expiryYear must be an integer from 2027 to 2300; got 2026

## Time in the Nigerian texts

The Petroleum Industry Act 2021 sets its own clocks on a discovery, and the Associate tier read them in words: a significant discovery may be retained for at most 10 years from its declaration (s.78(9)), and a field development plan follows a commercial discovery declaration within 2 years (s.79(1)). The engine prints these as notes beside a classification. None of them sets a licence expiry in the economic limit: the expiry and the renewal expectation are stated facts of the licence you hold.

## Why the engine is strict here

Capital after the expiry is a sign that the forecast, the costs and the licence were built from different assumptions. The refusal puts the mismatch in front of the person who can resolve it.

## Exercise

Work in the reserves calculator, in the view "The economic limit and the entitlement".

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". In the box, find the capital row and its year.
2. Change the capital year to 2041 and read the refusal. Name the field and the expiry it quotes.
3. Put the capital back in 2027, then add a second capital row for 2027 in the box and read the refusal. Remove the second row.
4. Set "Licence expiry year (stated)" to 2026 and read the refusal. Then restore 2040.
