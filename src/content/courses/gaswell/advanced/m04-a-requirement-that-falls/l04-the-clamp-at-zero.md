# The clamp at zero

`maxSlugLengthFt` solves a balance and then clamps the answer into a range. At both ends of that range it returns a number that is not a solution.

{{panel:pd-remedy-explorer}}

## What a foot of slug costs

On the teaching well OGUTA-2 a foot of slug costs 0.455497324232 psi net: 0.433 times the 1.060 liquid gravity, less a gas column of 0.003482675768 psi/ft from a gas density at line pressure of 0.5015053107 lbm/ft3. The plunger weight term is 1.7522191087 psi. The available pressure is what the casing has left after the fixed terms, and the length is one division.

| Casing, psia | Available, psi | Unclamped, ft | Returned, ft |
| --- | --- | --- | --- |
| 900.0 | 724.68983959 | 1590.98594226 | 1590.98594226 |
| 720.0 | 544.68983959 | 1195.81347818 | 1195.81347818 |
| 600.0 | 424.68983959 | 932.36516879 | 932.36516879 |
| 480.0 | 304.68983959 | 668.91685940 | 668.91685940 |
| 400.0 | 224.68983959 | 493.28465314 | 493.28465314 |
| 320.0 | 144.68983959 | 317.65244688 | 317.65244688 |
| 285.0 | 109.68983959 | 240.81335664 | 240.81335664 |
| 240.0 | 64.68983959 | 142.02024062 | 142.02024062 |
| 180.0 | 4.68983959 | 10.29608593 | 10.29608593 |
| 130.0 | -45.31016041 | -99.47404299 | 0.00000000 |
| 90.0 | -85.31016041 | -187.29014611 | 0.00000000 |

Where the clamp does not bite the solve is exact: at the maximum slug of 1195.81347818 ft the required lift comes back at 720.0000000000 psia against a casing of 720.0 psia, a residual of -1.1369e-13 psi. That slug holds 6.92163806 bbl.

## What zero means

Nothing a designer can use. At 130.0 psia of casing the balance with no slug at all still needs 175.3101604102 psia and falls short by 45.3101604102 psi. At 90.0 psia it falls short by 85.3101604102 psi. Zero is not the longest slug this well can lift, because it cannot lift an empty plunger. It is a refusal wearing a number.

## The upper end has the same shape

At 4000.0 psia of casing the unclamped solution is 8396.73393481 ft and the function returns 8200.00000000 ft, the tubing length exactly. That is a depth, not a computed maximum, and a caller checking the return against the tubing gets equality rather than a signal.

## The function already knows how to refuse

Hand `maxSlugLengthFt` a liquid so light that the net cost of a foot of slug is not positive and it returns NaN. Same class of failure, no solution exists, and there the author chose refusal over a number. One refusal and two clamps sit in one function for one kind of question. The argument is not that a clamp is wrong in principle: this function has already decided what refusal looks like, then did not use it twice.

So read the return against both ends. If it equals the tubing depth, the balance was not binding. If it is zero, quote the shortfall in psi.

## Exercise

Take the rows at 180.0 psia and 130.0 psia and write the available pressure, the unclamped length and the returned length.

Then say what changed physically between them, and why the returned length hides it while the available pressure does not.
