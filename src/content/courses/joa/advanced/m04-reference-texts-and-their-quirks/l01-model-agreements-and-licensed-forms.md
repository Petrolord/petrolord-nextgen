# Model agreements and licensed forms

{{panel:joa-agreement-calculator}}

Every clause this course quotes comes from a public text, and every public text is named with its edition and the date it was read. This module reads those texts critically: what each one is, what it leaves out, and where a printed figure needs checking before it is taught. It begins with the texts the course cannot quote at all.

## Licensed texts, taught by concept

The industry's most common model joint operating agreement is the AIPN model, and the accounting procedures most often attached to such agreements are the COPAS procedures. Both are sold under licence, as are the AAPL forms. This course teaches their ideas as concepts only and quotes none of their words: an operating committee, a non-consent premium taken from production, an overhead scale on a stated base. Where a lesson needs a clause, it takes one from a government publication.

## The public texts

Every text below was read on 2026-09-26.

| text | edition or date | how the course uses it |
| --- | --- | --- |
| Norway, Agreement concerning petroleum activities, Attachments A and B | unofficial English translation; PDF dated 27 February 2007; Wayback Machine capture of 26 May 2024 | quoted: the joint operating agreement and the accounting agreement |
| Petroleum Industry Act 2021 (Act No. 6) | Official Gazette No. 142, Vol. 108, 27 August 2021 | quoted: s.85(2), s.85(4), s.311(2)(a)(iii) |
| Republic of Kenya, Model Production Sharing Contract, Participation Agreement | 2015 model (file name dated 21 January 2015) | quoted: Art. 6 on cash calls and default |
| Tanzania, Model Production Sharing Agreement 2013 (TPDC) | 2013; Wayback capture of 23 May 2024 | concept only |
| World Bank, Petroleum Sector Briefing Note No. 8 | November 2007 | quoted: the two-barrel example |
| IMF FARI Methodology, TNM/16/01 | February 2016; Wayback capture of 12 October 2025 | quoted: Figure 5; Tables 11 to 13 |
| IMF WP/24/89 | April 2024; Wayback capture of 14 August 2025 | quoted for concept only |
| OpenOil, Oil Contracts: How to read and understand them | version 1, November 2012, Creative Commons | its printed arithmetic error |

The Norwegian live copy on regjeringen.no answered a bot check with HTTP 403 on the date read, which is why the Wayback capture is cited.

## A model can leave a figure blank

A model contract is a template, and a template may leave a number for the parties to write in. The Kenya model does so for the margin on late payments:

> "A late payment shall attract interest at LIBOR plus" (Kenya Model PSC 2015, Participation Agreement Art. 6.7)

The sentence stops where the margin would go. The engine takes the rate of default interest as a required input, `interest.annualRatePct`, so a contract that fills in the blank states the whole rate.

## A translation prints what it prints

The Norwegian texts reach the course in an unofficial translation, and the course quotes them exactly as printed. Article 9.2 carries a spelling the course keeps:

> "If a Party's default has not ceased within five (5) working days after he has received a demand for payment from the Operator, he looses his right to vote and his access to data and information" (Norway JOA Art. 9.2)

The course paraphrases it as the loss of the vote and of access to data. It corrects nothing inside a quotation.

## How the engine cites its texts

Every result the engine returns carries a `basis.source` naming the text and article its rule comes from, in the engine's own words. The agreement calculator prints it in a Source block under every view.

## Exercise

Open the agreement calculator and visit each view in turn: "Sole risk: the premium recovered from production", "Buy-in at a stated multiple", "A carry, its recovery and the NPV", "PSC cost recovery" and "A default and forfeiture". In each, read the Source block and list the texts and articles it names. For each text, find its row in the table above and note its edition. Mark which of your entries are quoted in this course and which are taught by concept only.
