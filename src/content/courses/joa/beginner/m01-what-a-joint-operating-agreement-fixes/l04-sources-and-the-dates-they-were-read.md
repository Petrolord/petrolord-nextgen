# Sources and the dates they were read

{{panel:joa-account-calculator}}

A course about contracts has to say which contracts it read. This course follows one rule for every law, model contract, accounting agreement and guide it teaches: each is named with its edition or gazette date and the date it was read, and only publicly available texts are quoted, with their citation. Every text below was read on 2026-09-26.

## The public texts

| text | edition or date |
| --- | --- |
| Norway, Ministry of Petroleum and Energy, Agreement concerning petroleum activities: Attachment A Joint Operating Agreement and Attachment B Accounting Agreement | unofficial English translation; the PDF is dated 27 February 2007; cited from the Wayback Machine capture of 26 May 2024 |
| Petroleum Industry Act 2021 (Act No. 6) | Official Gazette No. 142, Vol. 108, 27 August 2021 |
| World Bank, Petroleum Sector Briefing Note No. 8, Contracts for Petroleum Development, Part 2 | November 2007 |
| IMF, Fiscal Analysis of Resource Industries (FARI) Methodology, TNM/16/01 | February 2016 |
| IMF, Cash Flow Analysis of Fiscal Regimes for Extractive Industries, WP/24/89 | April 2024 |
| Republic of Kenya, Model Production Sharing Contract, Participation Agreement | 2015 model |
| Tanzania, Model Production Sharing Agreement 2013 (TPDC) | 2013 |
| OpenOil, Oil Contracts: How to read and understand them | version 1, November 2012, Creative Commons |

The Norwegian agreement is the backbone of this tier. It is an unofficial English translation, and the course cites it from an archived capture because the live government copy answered a bot check on the date it was read. Attachment A is the joint operating agreement itself; Attachment B is the accounting agreement, which holds the cash call and overhead rules.

## The licensed texts

Much of the industry works from model forms that are sold under licence: the AIPN model joint operating agreement, the COPAS accounting procedures and the AAPL forms. This course teaches their ideas as concepts and never quotes them. Every clause you read quoted in this course comes from the public texts in the table.

## Legal figures and contract figures

Two kinds of figure appear in this course, and they are handled differently.

A **legal figure** is one an Act fixes. The engine applies the Petroleum Industry Act's figures only where the caller states the Act's basis, and each is cited to its section: the right of the Government, through NNPC Limited, to participate up to 60% (PIA s.85(4)(a)), and refundable costs limited to development and production (PIA s.85(4)(c)). Those belong to the Professional tier.

A **contract figure** is one the parties agree: a tolerance, an overhead scale, a reconciliation lag, a threshold. The Norwegian agreement prints some of these, such as 10% for a budget item. The engine holds none of them. Every such figure is an input you state, with no default, and a call that leaves one out is refused by name.

## The engine cites its own sources

Every result the engine returns carries a basis block naming the rule it applied and where the rule comes from. For budget control, the Source block reads:

> Norway, Agreement concerning petroleum activities, Attachment A Joint Operating Agreement (unofficial English translation, 2007 text) Art. 12.5 (a budget item or an AFE by up to 10%; a budget by no more than the lower of 5% or NOK 75 million; NOK 3 million for work outside the budgets); every percentage and amount is a stated input with no default

## No worked schedule to copy

The course's research found no public text that prints a worked schedule for a cash call reconciliation or an overhead scale applied to figures. The figures of this tier are therefore the stated clause arithmetic of the Norwegian agreement, run by the engine on the Ekene terms.

## Exercise

Open the account calculator. In each of the four views, "Participating, paying and beneficial interests", "Cash calls", "Budget control" and "Operator overhead", run the Ekene start and read the Source block under the result. For each view, write down the text, the attachment and the article the engine cites, and find that text's edition in the table above.
