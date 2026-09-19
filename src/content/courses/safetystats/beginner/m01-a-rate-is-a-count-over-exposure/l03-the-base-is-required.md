# The base is required, and there is no default

{{panel:ss-rates-explorer}}

The same 9 recordables in the same 2318640 hours read 0.776317 per 200,000 hours, 3.881586 per 1,000,000 hours and 388.158576 per 100,000,000 hours. The count did not change and the hours did not change. Only the base moved, and the number on the page moved by a factor of 5 and then by a factor of 500.

| base, hours | recordable rate | the engine baseLabel |
| --- | --- | --- |
| 200000 | 0.776317 | per 200,000 hours (OSHA/BLS: 100 full-time workers, 40 h x 50 weeks) |
| 1000000 | 3.881586 | per 1,000,000 hours (IOGP) |
| 100000000 | 388.158576 | per 100,000,000 hours (FAR, IOGP) |

The million hour figure over the OSHA figure is 5.000000. The hundred million hour figure over the OSHA figure is 500.000000. Both ratios are nothing more than the ratio of the two bases. That is the whole reason the engine takes no default.

## What a default would cost

Suppose the engine quietly assumed a base whenever the caller left it out. Somebody in a company that reports on the OSHA base would type a count and hours, get a number on the IOGP base, and print it as their recordable rate. Their rate would look five times worse than it is. Somebody in the opposite position would print a rate five times better than it is. Neither would see an error, because a number came back.

So the engine refuses. A call with no base returns no rate at all, and the refusal names the field. These are the engine's own words:

> base is required: name the base (200,000 for OSHA/BLS, 1,000,000 for IOGP, 100,000,000 for FAR); there is no default

The message does three things at once. It names the missing input, it lists the three named bases so the caller can pick one, and it says outright that there is no default so nobody goes looking for one.

## The named bases

The engine exports its three named bases as `RATE_BASES`: `OSHA_200K` is 200000, `IOGP_1M` is 1000000 and `FAR_100M` is 100000000. A caller can pass any positive number of hours as a base, but these three are the ones a reader is most likely to meet. The label the engine returns with each result, the `baseLabel`, repeats which one was used, so the answer carries its own base wherever it travels.

## One exception

There is exactly one rate in this engine where the base is fixed, and that is the fatal accident rate. In this engine it is always per 100,000,000 hours, and the FAR function takes no base argument at all. Module three explains why FAR alone gets this treatment. Every other rate, including the severity rate and the process safety event rate, requires the caller to name the base.

## Exercise

Take the 0.776317 per 200,000 hours figure from the table and multiply it by 5. Check that you reach the 3.881586 per 1,000,000 figure. Then multiply 0.776317 by 500 and compare with 388.158576. Now open the rates explorer, choose "no base", and copy the refusal it prints. Write one sentence saying which of the three named bases your own organisation reports on, and what the same rate would read on each of the other two.
