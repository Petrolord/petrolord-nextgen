# More than one root

A cash flow that changes sign more than once can be driven to zero at more than one discount rate. When that happens there is no such thing as the rate of return, and the engine reports the status `multiple-roots` with no number.

{{panel:ec-value-explorer}}

## Why a second crossing creates a second root

The NPV of a flow is a curve drawn against the discount rate, and a root is a place where that curve touches zero. One change of sign gives a curve that crosses once. Two give a curve that can bend back and cross again, and both crossings are genuine: at each of them the NPV really is zero, and neither has any claim to be the answer.

## The two cases the digest records

| case | NPV | IRR | status |
| --- | --- | --- | --- |
| EGINA at 30.0000 USD a barrel | -898.3507 | none | multiple-roots |
| price deck shorter than the profile | 126.1636 | none | multiple-roots |

The second shows where a second sign change comes from in practice. The published case runs a price deck that does not cover the whole production profile, and the missing prices are read as 0. The years the deck covers earn money; the years past the end of the deck produce barrels at a price of 0 while still carrying their operating cost, so those years go negative again. The flow goes down, up and down, and the curve crosses zero twice. The golden records that the root the band hides is -52.4425 percent, and even that recorded root is not the return, because another one exists.

## The value is still one number

The NPV is defined whatever the flow does. At 30.0000 USD a barrel the EGINA case is worth -898.3507 million USD and its payback is never. The published deck case is worth 126.1636. Those numbers are unambiguous at the discount rate they were struck at, and they are what a reader should take from a `multiple-roots` case: the ambiguity lives in the rate and nowhere else. Reporting nothing there is less convenient than reporting something, and the gain is that no reader is handed a rate a second, equally valid rate contradicts.

## The input is usually the finding

A case that flips sign twice is normally telling you something about the inputs rather than about the geology. A deck that stops before the profile does, an abandonment cost in the middle of the life, a second capex phase: any of these will do it. In the studio's plan path a price deck that does not cover the profile is refused by name rather than padded, with the message "the price deck has no price for production year 3: enter a price for every year of the profile".

## The mistake

The mistake is picking one root, usually the one nearest a familiar number, and calling it the return. Neither root is more true than the other, and the choice is the reader's preference wearing the engine's authority. The second mistake is reading `multiple-roots` as a synonym for `no-root`. At 30.0000 USD a barrel the status is `multiple-roots` and at 18.0000 it is `no-root`, and the difference is whether any rate zeroes the flow at all.

## Exercise

State the NPV and status of both `multiple-roots` cases. Then explain, from the way the shortened price deck is read, how a flow acquires a second change of sign, and say why -52.4425 percent is still not the rate of return of that case.
