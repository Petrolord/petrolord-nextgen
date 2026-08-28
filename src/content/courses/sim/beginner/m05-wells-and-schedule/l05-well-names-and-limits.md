# Well names and limits

Small constraints, easy to forget, and each one has bitten a deck somewhere. This lesson collects the ones that matter in the Ekene deck.

## Eight characters

A well name is at most eight characters. That is an Eclipse-format constraint and the emitter enforces it.

Ekene's six field wells are called Ekene-1 through Ekene-6, which is seven characters. The deviated side-track wanted to be called EKENE-6ST, which is nine, and had to become

$$\textbf{EK6-ST}$$

That is not cosmetic. A study whose well names are truncated silently ends up with two wells called the same thing, and a simulator that sees a second WELSPECS record for an existing name treats it as a redefinition rather than a new well.

The habit that avoids it: choose names that fit before you build the deck, and check them against the field's own naming so the results can be joined back to the production database.

## Names travel into the results

Every per-well SUMMARY vector is keyed by the well name. So the name in the deck is the name in the results file, which is the name in whatever plotting or reporting tool comes next.

A rename mid-study breaks the join between a run and its predecessors. Names are effectively permanent once a study has any history.

## Case and quoting

Names are quoted in the deck and the quoting is not optional. Case is preserved, and whether a simulator treats names case-sensitively varies. Two wells differing only in case is a bad idea in any deck.

## Groups

WELSPECS puts each well in a group. Groups exist so that controls can be applied to a set of wells at once, which is how facility constraints and field-level targets are expressed.

This deck uses a single group for everything, which is the simplest structure that is still valid. A real field with two platforms and separate export capacity would need a group per platform, and the group hierarchy is where those constraints live.

## The reference depth

Each well carries a reference depth for its bottom-hole pressure, and Ekene's wells use their own column mid-depth. Two consequences:

Because the wells sit on different parts of the structure, their reference depths differ, so their reported BHPs are not directly comparable without accounting for the difference.

And because the depth is stated per well rather than derived, changing a well's completion does not change its reference depth. That is usually what you want and it is occasionally a surprise.

## What is not limited

Connection count. A well can have as many connections as it has cells, and the side-track has eleven from a single trajectory.

Number of wells. There is no practical limit that a field-scale study will reach.

Name uniqueness across time. A well can be shut, and a later WELSPECS with the same name refers to the same well rather than a new one.

## The misconception to avoid

"Well names are labels, so they can be tidied up later." They are the join key between the deck, the results, the production database and every plot anybody has made. Renaming a well is a data migration, not a cosmetic edit, and the eight-character limit means the tidying is best done before the first run rather than after.

## Exercise

First, the side-track is called EK6-ST. Write down two other names of eight characters or fewer that would identify it unambiguously alongside Ekene-6, and say which you would choose.

Second, explain in two sentences why two wells whose names truncate to the same eight characters is worse than a parse error.
