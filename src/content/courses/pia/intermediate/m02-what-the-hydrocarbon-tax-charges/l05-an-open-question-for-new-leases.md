# An open question for new leases

{{panel:pia-hct-calculator}}

Section 267 names two classes of rate, and each is tied to acreage selected on conversion or held as a prospecting licence. A petroleum mining lease granted after the Act out of new acreage, onshore or in shallow water, is described by neither sentence alone. This lesson teaches that as an open reading of the text, shows how the engine handles it, and shows which figures it moves.

## Why the text leaves it open

Read s.267 again. Paragraph (a) gives 30 percent to "petroleum mining leases selected under section 93 (6) (b) and (7) (b)". Paragraph (b) gives 15 percent "for onshore and shallow water and for petroleum prospecting licences". A new-acreage lease was never selected under s.93, so (a) does not name it. It is onshore or in shallow water, which (b) names, but (b) names them in the same sentence as prospecting licences selected on conversion. Both readings can be argued from the words. The texts do not settle it, and neither does this course.

## How the engine handles it

The engine takes the rate as a stated input with no default, `pia_new_pml_hct_rate_pct`, and refuses a run without it:

> A new-acreage petroleum mining lease onshore or in shallow water needs pia_new_pml_hct_rate_pct set to 15 or 30; got null. PIA s.267 (NTA s.72) gives 30% to leases selected under s.93(6)(b) and (7)(b) and 15% to onshore and shallow water and to petroleum prospecting licences, and does not say which applies to a lease granted after the Act out of new acreage, so the rate is a stated user choice with no default.

Only the two rates the text prints are accepted. A stated 20 gets the same message, with "got 20." where this one reads "got null."

## What the stated reading moves

The Ekene new onshore lease (synthetic, 2026 and 2027, with 49000000 bbl produced before 2026) is run under each stated reading:

| year | HCT chargeable profit (stated 15) | HCT (stated 15) | HCT chargeable profit (stated 30) | HCT (stated 30) | CIT, both |
| --- | --- | --- | --- | --- | --- |
| 2026 | 151411548.913043 | 22711732.336957 | 151411548.913043 | 45423464.673913 | 50223464.673913 |
| 2027 | 123946029.235482 | 18591904.385322 | 123946029.235482 | 37183808.770645 | 40183808.770645 |

The stated rate moves the hydrocarbon tax line and nothing else. The chargeable profit is the same under both readings because the base, the cost price ratio and the allowances do not read the rate. Companies income tax is the same because it does not deduct the hydrocarbon tax.

## How the course treats it

The course never grades a figure the stated rate moves. A graded figure on such a lease is one the rate leaves alone: the chargeable profit, the allowances, the cost price ratio lines, companies income tax. When a lesson quotes the hydrocarbon tax of such a lease, it quotes it with its stated reading.

## Exercise

Work in the course's own hydrocarbon tax calculator, which runs the same engine.

1. Open "The hydrocarbon tax rate". Set onshore, PML, new, and leave the stated new-lease rate blank. Read the refusal, then type 20 and read it again.
2. Type 15, then 30, and read the rate each time.
3. Open "The tax base and the cost price ratio on a ledger" and start from ekene_onshore_new_cap_crossing, which states 15. Change `pia_new_pml_hct_rate_pct` to 30. Check the table above column by column: which lines moved?
4. Write two sentences, one for each reading, stating the textual argument for it. Close with the sentence that says which one the course keys.
