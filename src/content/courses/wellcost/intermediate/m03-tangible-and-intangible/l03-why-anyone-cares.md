# Why anyone cares

The split changes no number on the AFE, which raises an obvious question: why is it on the form at all?

{{panel:wc-afe-explorer}}

## Because the tax treatment differs

The two categories are recovered differently. Tangible spend buys an asset, so it is capitalised and written off over a period of years through depreciation. Intangible spend is consumed, so under most fiscal regimes a much larger share of it can be relieved in the year it is incurred.

The engine does not model any of that and holds no tax rates. It only sorts the lines into the two buckets that the fiscal calculation downstream will ask for.

## Why timing is worth money

Two wells with the same 5,380,000 USD base can have different after-tax costs purely because of how the base splits. Relief taken this year is worth more than the same relief spread across several years, so the intangible share reaches the company's cash position sooner.

Nothing about that makes intangible spend better. It makes the split a real input to an economic evaluation, which is why the form insists on it even though the authority you are requesting is unaffected.

## Who reads which figure

The drilling engineer reads the base and the total, because those are the operational and the approval numbers.

The finance and tax functions read the two subtotals, because their calculation cannot start until the base is partitioned. On the golden they are being handed 1,050,000 USD to capitalise and 4,330,000 USD to treat as consumed.

The joint venture partners read all four, because a cash call is against the total while their books need the split.

## Why you cannot leave it blank

The engine rejects a line whose category it does not recognise, naming the line in the error. There is no default value.

That is deliberate. A defaulted category would silently push spend into whichever bucket the default chose, the base would still balance, and the error would surface months later inside a tax computation where nobody is looking at drilling activities.

## The regime caveat

Exactly which costs qualify for immediate relief, and how quickly the rest is written down, is set by the fiscal regime the well sits in and it varies between countries and between contract types. The engineering test in the previous lesson gives you the classification. The consequences of that classification are not yours to assume.

## Exercise

Take the golden's two subtotals and say, in one sentence each, what a tax accountant would do with them.

Then recategorise the wellhead and confirm that the approval figure is untouched while the two subtotals shift.
