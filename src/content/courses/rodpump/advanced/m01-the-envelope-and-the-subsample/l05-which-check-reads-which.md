# Which check reads which

Three checks in one design read the peak load, and they do not all read the same one. Two of the three are fed the subsample.

{{panel:pd-balance-explorer}}

## A rating chosen to straddle the two loads

C-320D-198-100 is a teaching designation, not a manufacturer product: the package ships no named unit dimensions, and `parseUnitDesignation` reads any well formed string. Its structural capacity is 19800 lb, its stroke rating 100 in, its gearbox rating 320000 in-lb, and the capacity was chosen to sit between the subsampled peak and the marched peak.

| Route into the check | structuralPct |
| --- | --- |
| From `prlPeakLb`, as the design reports it | 98.716554461 |
| From the marched peak instead | 100.624498834 |

`structuralOverload` fires above 100 percent. On the subsampled route it does not fire on this design. On the marched peak it would.

## The verdicts the design actually returns

The warnings raised are `strokeOverload` alone, from a `strokePct` of 106.687716837 percent. `torquePct` is null. The worst section loading, which comes from the envelope, is 82.873308396 percent, and it did not move when the rating changed, because the modified Goodman line never reads a rating at all.

On the standard looking C-320D-200-100 the split is still there: 97.729388917 percent from `prlPeakLb` and 99.618253845 percent from the marched peak, with `strokeOverload` again the only warning. Both sit under 100, so it changes no verdict. The split is always present and only sometimes visible.

## The third reader

`balanceUnit` needs a surface card, and the only one `predictCard` hands out is the decimated one, so the gearbox check reads the subsample too. Balancing ODUMA-4 off the default 186 point card gives a peak torque of 450016.096192 in-lb; off the full 6110 point card it gives 461403.140996 in-lb, 2.467917 percent higher, and the default card reads it low. Against a 320000 in-lb gearbox that is a `torquePct` of 140.630030060 percent from the default card and 144.188481561 percent from the full march.

## The tally

The Goodman check reads the full march through the envelope. The structural rating reads the subsample. The gearbox rating reads a torque balanced against the subsample. One design, three checks, two samplings, and only one of the three is fed everything the march computed.

## What it refuses

None of the three checks names its sampling, and the design exposes no parameter that would change it. A caller who suspects the split cannot test it through `runRodPumpDesign`: the card has to be solved separately through `predictCard`.

## Exercise

Compute `structuralPct` for ODUMA-4 against a 19800 lb capacity from both the reported peak and the marched peak.

Then say which warnings the design raises, and which one a designer would have seen if the check had read the march.
