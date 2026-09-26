# A licence shared by agreement

{{panel:joa-account-calculator}}

Many petroleum licences are held by several companies, which share the rights, costs and production of one licence area and write down how in a joint operating agreement. This course treats that agreement as rules that can be computed: who owns what share, who pays which part of each bill, and what happens when a party does not pay. At the Associate tier you learn the first two: the interests of the parties and the joint account the operator keeps for them.

## What the agreement has to settle

Every joint operating agreement answers the same few questions:

* **Shares.** Each party holds a participating interest, a percentage of the venture. The participating interests of all parties make up the whole.
* **Money in.** The operator asks each party for a monthly advance, the cash call, and later compares it with what was actually spent.
* **Control of spending.** The parties approve a work programme and a budget, and the agreement states how far the operator may overspend a line or the whole budget before it must come back to them.
* **The operator's own charge.** The operator may add an overhead to the joint account on a stated scale.

The later tiers take up what happens when a party is carried, defaults, declines an operation or backs in under the Petroleum Industry Act 2021.

## Money follows the participating interest

The public text this course leans on most is the Norwegian joint operating agreement (Norway, Ministry of Petroleum and Energy, Attachment A, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024). Its funding rule is short:

> "The Parties are obliged to provide sufficient funds to cover all expenses relating to the activities of the joint venture." (Norway JOA Art. 8.1)

And each party's part of those funds is fixed by its share:

> "the amount to be contributed by each Party shall be calculated in accordance with the Participating interest at the time the payment is made." (Norway JOA Art. 8.1)

Everything the account calculator does starts from these two sentences: a joint cost is split between the parties by a stated share, collected in advance.

## What this course computes, and what it leaves to other courses

The engine behind this course, `jointVenture.js`, computes interests, cash calls, budget control, overhead, carries, back-ins, defaults, non-consent and PSC cost recovery on terms you state. It decides nothing a contract or a text does not state.

It does not re-teach neighbouring subjects. The cash flow ledger, discounting and NPV belong to the cash flow course. Fiscal regime design belongs to the fiscal regime course. The Nigerian fiscal system belongs to the Petroleum Industry Act course. Portfolio choice and the field development plan belong to the portfolio course and the field development planning course.

## Exercise

Open the account calculator, the course's own calculator panel, and choose the view "Participating, paying and beneficial interests". Keep the start "The Ekene joint venture, NOC carried pro rata" and run it. For each of the four parties, write down its participating interest from the box and its beneficial and paying interest from the table. Then open the Source block and write down which article of the Norwegian agreement the engine cites for the contribution rule.
