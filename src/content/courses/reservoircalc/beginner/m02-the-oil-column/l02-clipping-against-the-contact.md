# Clipping against the contact

The previous lesson left one formula with a caveat attached. The oil column is the contact minus the top when the contact is inside the sand, and something else when it is not. This lesson gives the rule that handles both cases, applies it node by node, and deals with the case that trips people up, which is a node where the arithmetic wants to return a negative number.

## One rule for both cases

At every node the oil column is

$$\text{column} = \min(\text{base},\ \text{contact}) - \text{top}$$

Read the $\min$ first. Two things can stop the oil going deeper at a given location: it runs out of rock, or it runs into water. The oil occupies the interval from the top of the sand down to whichever of those comes first, and whichever comes first is whichever is shallower. That is what the minimum picks out.

Two cases follow.

When the contact is shallower than the base, the water stops the column. The minimum returns the contact, and the column is the contact minus the top. The rock continues below, full of water, and none of it is counted.

When the base is shallower than the contact, the rock stops the column. The minimum returns the base, and the column is the base minus the top, which is the full sand thickness at that node. The sand is oil filled from top to bottom and there is no water leg inside it at all.

The first case is called contact limited. The second is called base limited, or sand limited. A real field often has both, with the contact limiting the flanks and the sand limiting the crest where the reservoir is thin. Which case applies at each node on Ekene is a question with a definite answer, and the next lesson settles it.

## Node by node, not well by well

The rule is applied at each of the 201 live nodes independently. There is no field average anywhere in the calculation, and there is no interpolation of columns between wells.

The order matters. You grid the top, you grid the base, and only then do you subtract. Gridding a thickness directly, or averaging columns between wells, would give a different answer, because the spline does not commute with a minimum. Both surfaces are mapped first, at their own control, and every comparison against the contact happens afterwards on the grid.

Work the rule at two well locations, using the picks as the mapped values there.

Ekene-1 tops at 1548 m and bases at 1580 m against a contact at 1560 m. The base at 1580 m is deeper than the contact, so the minimum returns 1560, and the column is 1560 minus 1548, which is 12 m. Contact limited. The sand that continues below the contact is water bearing rock and is discarded.

Ekene-3 tops at 1541 m and bases at 1570 m. Again the base is deeper than the contact, the minimum returns 1560, and the column is 19 m. Contact limited as well.

## The node that wants to go negative

Now the case that has to be handled deliberately.

Ekene-2 tops at 1565 m, which is below the contact at 1560 m. The base at 1601 m is deeper than the contact, so the minimum still returns 1560, and the subtraction is 1560 minus a top that is deeper than 1560. The result is negative.

There is a plain physical statement behind that. The whole sand section at Ekene-2 lies beneath the oil water contact. The location holds no oil.

The rule is therefore that a node whose column comes out zero or less is skipped entirely and contributes nothing. It does not contribute a negative volume. This is the single most important line in the whole clipping step, and it is worth being clear about why letting the negative through would be a serious error rather than a small one.

A negative column would be subtracted from the running total. In effect the deep parts of the field, where the top surface has fallen well below the contact, would cancel out rock that genuinely exists in the crestal area. On Ekene, where the top surface reaches 1590 m at Ekene-4 and the contact is at 1560 m, the deepest ground sits a long way below the contact, and a signed sum would let it eat a substantial part of the real accumulation. The gross rock volume would come out too small, it would keep shrinking as you extended the map further downdip into ground with no oil in it, and nothing about the number would look wrong.

Zero is the correct contribution because zero is the truth. There is no oil there, and there is also no negative oil anywhere.

## How the engine expresses it

The teaching pipeline builds a thickness grid and fills it with the same null sentinel the mapping course used, 1.0e30, so that every node starts out as no data rather than as zero. A node is only written into if it passes three tests in order: the top must be live, the base must be live, and the clipped column must be greater than zero. Nodes that fail any of the three keep the sentinel and never reach the volume summation.

That is why the count of oil bearing cells is a smaller number than the count of live nodes, and why the two counts are reported separately. One is how much ground the map covers. The other is how much of that ground holds oil at the contact you assumed.

Move the contact in the panel below and watch which nodes drop out of the calculation.

{{panel:rc-volume-explorer}}

## Exercise

Write the clipping rule from memory. Then work it at three hypothetical nodes against a contact at 1560 m and state the column and which case applies: a node with top 1550 m and base 1600 m, a node with top 1550 m and base 1556 m, and a node with top 1572 m and base 1605 m. Finally, say in one sentence what the third node contributes to gross rock volume and why it is not a negative contribution.

Self check: the rule is column equals the minimum of base and contact, minus top, and any result of zero or less is discarded. The first node is contact limited, since the base at 1600 m is deeper than the contact, so the column is 1560 minus 1550, which is 10 m. The second node is base limited, since the base at 1556 m is shallower than the contact, so the column is 1556 minus 1550, which is 6 m, and the sand is oil filled to its floor. The third node has its top below the contact, so the subtraction returns a negative number and the node is skipped. It contributes zero, because there is no oil there and a signed contribution would cancel real rock elsewhere in the field, understating the gross rock volume by an amount that grows the further downdip the map extends.
