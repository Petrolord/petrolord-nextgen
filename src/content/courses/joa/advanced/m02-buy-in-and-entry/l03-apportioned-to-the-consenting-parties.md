# Apportioned to the consenting parties

{{panel:joa-agreement-calculator}}

An entry payment has a payer and several payees. The Norwegian agreement sends it to the initial participants by their interest in the project, and the engine apportions it by the consenting parties' shares of the project. This lesson reads that apportionment on the Ekene-4 sidetrack and checks that it closes.

## Shares of the project

When PB declines the sidetrack, EKO, PA and NOC carry the whole cost in proportion to their participating interests among themselves. The engine prints those shares in its first reason:

> Ekene-4 sidetrack: cost 18000000 paid by the consenting parties EKO 47.05882352941177%, PA 29.41176470588235%, NOC 23.529411764705884% (in proportion to their participating interests)

The reason prints each share as the shortest decimal that reads back to the number the engine holds. The course quotes the fields at six decimals: EKO 47.058824, PA 29.411765, NOC 23.529412. Under both modes the consenting parties hold the project in these shares.

## Who receives the entry payment

PB pays 27000000.000000 to enter at the stated 1000.000000 percent, and the engine apportions it:

| consenting party | participating interest | share of the project | amount received |
| --- | --- | --- | --- |
| EKO | 40.000000 | 47.058824 | 12705882.352941 |
| PA | 25.000000 | 29.411765 | 7941176.470588 |
| NOC | 20.000000 | 23.529412 | 6352941.176471 |

The three amounts add back to the payment, and each is the payment times that party's share of the project. The engine's reason names the rule:

> PB: to enter it pays 1000% of its share 2700000 = 27000000, apportioned to the consenting parties in their shares

## Why the share of the project

The parties who carried the operation carried it in their shares of the project, so they are repaid in the same shares. EKO paid 8470588.235294 of the sidetrack's cost and receives 12705882.352941 of the entry payment; both figures are its share of the project applied to a different total. Apportioning by participating interest in the licence would leave part of the payment unassigned, because PB's own 15.000000 percent would have nobody to go to.

## A carried party that consents

NOC is carried in the Ekene joint venture's main carry, where its paying interest is 0.000000. On this call no carry is stated, so NOC consents as a party paying its own share of the project and receives its share of the entry payment. A contract that kept a carry live through a sole risk operation would state how, and a report on such an operation names the terms the call states.

## Rounding and the reason line

The reason for the apportionment prints the payment in money to the cent. The amounts in the table are fields, which the course quotes at six decimals. A report that adds the three amounts uses the fields, which close to the payment; adding figures rounded for display can leave a cent over or under.

## Exercise

Open the agreement calculator on the view "Buy-in at a stated multiple", which starts on the Ekene-4 sidetrack. Read the payer to party table and add the three amounts. Divide each amount by the payment and compare the result with that party's share of the project in the consenting table. Then remove "NOC" from the `consenting` list, so that PB and NOC both decline, and read the tables again: note who pays to enter now, what each pays, and how the payment is apportioned between EKO and PA.
