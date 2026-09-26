# Pro rata cover by the non-defaulting parties

{{panel:joa-recovery-calculator}}

The operation cannot wait for a defaulter to pay. The other parties advance the unpaid amount between them, and are repaid, with default interest, when the defaulter cures. This lesson works out who advances what on PB's March default.

## What the text says, and what the engine states

The Norwegian Joint Operating Agreement (Attachment A, unofficial English translation, PDF dated 27 February 2007, cited from its Wayback Machine capture of 26 May 2024, read on 2026-09-26) shares the unpaid amount by participating interest:

> "the amounts which are not paid shall be advanced by the non-defaulting Parties in accordance with their Participating interest." (Norway JOA Art. 9.1)

A carried party pays no cost, so a rule for cover has to say what happens to its share. The engine states its reading of this clause in its basis, verbatim:

> the non-defaulting parties advance the unpaid amounts in proportion to their paying interests among themselves (the parties that pay cost; a carried party pays none)

This is the engine's stated choice, printed beside the text it reads. The Expert tier sets it beside the engine's other stated readings and the alternatives each one names.

## PB's unpaid 2000000.000000

On the Ekene joint venture the non-defaulting parties are EKO, PA and NOC. NOC is carried, with a paying interest of 0.000000, so it covers nothing and the cover table leaves it out. EKO's paying interest of 50.000000 and PA's of 31.250000 are shared between the two of them:

| party | paying interest | cover percent | cover | default interest received |
| --- | --- | --- | --- | --- |
| EKO | 50.000000 | 61.538462 | 1230769.230769 | 12692.307692 |
| PA | 31.250000 | 38.461538 | 769230.769231 | 7932.692308 |

> the unpaid 2000000 is advanced by EKO 1230769.23, PA 769230.77, in proportion to their paying interests among the non-defaulting parties

The reason rounds to the cent; the fields are 1230769.230769 and 769230.769231. When PB cures, its default interest of 20625.000000 on the simple terms is paid to the parties that financed the default, in proportion to their cover, which is the last column.

## Two defaulters at once

On the golden input with two defaulters, PB pays nothing of its 2250000.000000 and PA pays 750000.000000 of its 3750000.000000. The unpaid 5250000.000000 falls on the only paying party left:

> the unpaid 5250000 is advanced by EKO 5250000, in proportion to their paying interests among the non-defaulting parties

EKO's cover is 5250000.000000, 100.000000 percent, and it receives the default interest of both defaulters, 56718.750000.

Cover needs someone to give it. A default in which no paying party is left standing is refused:

> defaulters must be leaving at least one non-defaulting party with a paying interest above 0; got ["EKO","PA","PB"]

## Exercise

Work in the course's own recovery calculator, view "A default: cover, interest and consequences", starting from "The Ekene March default, simple interest".

1. Read the cover table and check each party's cover percent, cover and default interest received against the table above.
2. Check that EKO's cover percent is its paying interest divided by the paying interests of EKO and PA together.
3. In the box, remove the `carries` array. Read the defaulter and cover tables again: say why PB's share of the call changed, and which party now covers part of the default.
4. Restore the carry. Replace `defaulters` with three entries in this order, EKO, PA and PB, each written like `{ "id": "EKO", "paid": 0, "curedOn": "2027-04-15" }`, and read the refusal.
