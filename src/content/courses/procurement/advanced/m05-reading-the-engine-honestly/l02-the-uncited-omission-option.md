# The uncited omission option

{{panel:pr-envelope-calculator}}

{{panel:pr-contract-calculator}}

Most of what the engine does is tied to a text. One option is not, and the engine says so in its own words every time it is used. This lesson shows that option so a reader of the engine knows it is there and what it says about itself. The course teaches and grades the cited rule only.

## The cited rule

When a bid omits an item, the World Bank's two-envelope Standard Procurement Documents (Works, September 2025; Goods, February 2025; both read on 2026-09-26), at ITB 34.1, price the omission at the average price quoted for that item by the substantially responsive bidders. That is the engine's default. On the well services tender WS3 omits nitrogen, the other responsive bids quote it at 33600.000000, 35400.000000 and 37200.000000, and the engine adds their average, 35400.000000.

## The option the engine also accepts

The engine also accepts an omission rule named `highest`. No text the course read uses it, and the engine's basis says as much when it is chosen, verbatim:

> an omitted item is priced at the highest corrected amount quoted for it by the other responsive bids, else the Employer's best estimate (the 'highest' option, which the cited texts do not use; the cited rule is the average of World Bank SPD ITB 34.1)

Its reason for WS3 carries the same warning:

> WS3: item nitrogen omitted; the highest of the 3 prices quoted by the other responsive bids, 37200, is added (the 'highest' option, which the cited texts do not use)

The engine does not hide the option or present it as a method. It labels it wherever it appears, and so does the calculator, where the choice reads "highest (not from the cited texts)".

## It can move an award

On the materials tender, with a lowest-cost award and no content rule, the option changes the winner. MS4 omits the inspection line:

| omission rule | added for MS4 | MS4 evaluated cost | MS2 evaluated cost | award |
| --- | --- | --- | --- | --- |
| average (cited, the default) | 12000.000000 | 546244.982386 | 547863.577232 | MS4 |
| highest | 14500.000000 | 548744.982386 | 547863.577232 | MS2 |

A setting that can move an award and has no source behind it is exactly the kind a reader has to be able to see. That is why the engine names it in its own output, and why this course grades nothing on it.

## Anything else is refused

A rule the engine does not hold is refused by name, and the message states both rules and which one the texts use:

> omissionRule must be 'average' (the default, World Bank SPD ITB 34.1: the average price quoted by the substantially responsive bidders) or 'highest' (the highest price quoted by them, an option the cited texts do not use)

## Exercise

Open the envelope calculator on the view "Evaluated cost of the passing bids". With the omission rule on "average (cited)", read WS3's omissions and the omission basis under the table. Switch the rule to "highest (not from the cited texts)" and read the basis and WS3's reason again, and note the words the engine adds. Then open the contract calculator on the view "The whole tender, any award basis", delete the `nigerianContent` entry, set `omissionRule` to "highest" and read the award. Set it to "lowest" and read the refusal.
