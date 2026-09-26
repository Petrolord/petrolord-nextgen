# Sole risk operations

{{panel:joa-agreement-calculator}}

The Expert tier asks what an agreement does when the parties do not all agree, which readings the engine takes where a text can be read two ways, and how far a report can rely on each figure. The first answer is sole risk: an operation that only some parties approve goes ahead at their cost and risk, and the parties who declined stay out on stated terms.

## What the texts say

The Norwegian Joint Operating Agreement (Attachment A, an unofficial English translation whose PDF is dated 27 February 2007, cited from its Wayback Machine capture of 26 May 2024, read on 2026-09-26) sets each participant's share:

> "In sole risk projects each Party participates in proportion to his Participating interest, unless the Parties otherwise agree." (Norway JOA Art. 18.6)

The industry's common model joint operating agreement is sold under licence, and this course teaches its ideas as concepts only: an operation declined, the consenting parties carrying it, and a premium taken back out of the declining party's share of production. The engine's function `nonConsent` computes that with every contract figure stated.

## The Ekene-4 sidetrack

The Ekene joint venture is synthetic, written for this platform. On the Ekene-4 sidetrack, costing 18000000.000000, PB declines and EKO, PA and NOC consent. The engine states its rule in its own basis:

> the consenting parties pay the cost in proportion to their participating interests among themselves; the premium of a non-consenting party = its proportionate share of the cost x premiumMultiplePct / 100

| consenting party | participating interest | share of the project | cost paid |
| --- | --- | --- | --- |
| EKO | 40.000000 | 47.058824 | 8470588.235294 |
| PA | 25.000000 | 29.411765 | 5294117.647059 |
| NOC | 20.000000 | 23.529412 | 4235294.117647 |

Each consenting party's share of the project is its participating interest over the consenting parties' total, so EKO's 40.000000 becomes 47.058824. PB pays none of the cost. This call states no carry, so NOC pays its own share of the project here.

## A joint operation is no sole risk operation

A sole risk call needs at least one party outside it. A call that lists all four Ekene parties as consenting is refused in the engine's own words:

> consenting must be leaving at least one non-consenting party (every party consents: a joint operation); got ["EKO","PA","PB","NOC"]

## The words this tier keeps

A premium is the stated multiple of a non-consenting party's proportionate share of an operation's cost. Recovery is always named: premium recovery, carry recovery or cost recovery under a PSC. Interest is always qualified: participating, paying, beneficial or carried interest, or default interest on a late payment. A figure is quoted with the terms it depends on.

## Exercise

This is an engine course with no Suite app: the practicals at this tier run in the agreement calculator, which calls the same vendored engine the lessons quote. Open it on the view "Sole risk: the premium recovered from production". It starts on the Ekene-4 sidetrack. Read the consenting table and check that the cost paid by the three parties sums to the cost of the operation. Then add "PB" to the `consenting` list in the box and read the refusal, which prints the list in the order you typed it. Take PB out, remove "PA", and read how the shares of the project change when two parties decline. Write one sentence for each run naming who pays and in what proportion.
