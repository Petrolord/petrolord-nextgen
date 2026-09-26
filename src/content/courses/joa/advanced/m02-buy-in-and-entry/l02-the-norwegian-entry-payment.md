# The Norwegian entry payment

{{panel:joa-agreement-calculator}}

Only one public text this course reads prints a multiple for sole risk: the Norwegian Joint Operating Agreement, and it prints it for entry. This lesson reads that clause, the engine's citation of it, and what the engine keeps as an input.

## The text and its edition

The text is Attachment A to the Norwegian Agreement concerning petroleum activities, an unofficial English translation whose PDF is dated 27 February 2007. The live copy on regjeringen.no answered a bot check with HTTP 403 on the date read, so the course cites the Wayback Machine capture of 26 May 2024. It was read on 2026-09-26. Article 18.12 sets the price of a later entry into a sole risk project:

> "must pay one thousand (1000) % of their proportionate share of the costs of the project." (Norway JOA Art. 18.12)

and who receives it:

> "The payment shall be apportioned between the initial participants according to their Participating interest in the project." (Norway JOA Art. 18.12)

Two points in those sentences carry the arithmetic. The base is the entering party's proportionate share of the costs, the same base the engine uses for every premium. The payment goes to the initial participants by their interest in the project, which is their share of the project and differs from their participating interest in the licence.

## How the engine cites it

The engine carries its citation in its own basis. For `nonConsent` the basis source reads, verbatim:

> Norway, Agreement concerning petroleum activities, Attachment A Joint Operating Agreement (unofficial English translation, 2007 text) Art. 18.6 and 18.12 (entry at one thousand (1000) % of the proportionate share of the costs, apportioned to the initial participants); premium recovery from production is a contract term taught by concept and stated here as inputs

The golden case that follows the Norwegian clause states 1000.000000 percent in buy-in mode on the Ekene-4 sidetrack, and PB pays 27000000.000000 to enter (engine), ten times its proportionate share of 2700000.000000.

## The engine holds no Norwegian figure

The Norwegian 1000 percent is the text's figure for its own agreement. The engine holds no copy of it: the call states `premiumMultiplePct`, and a contract that prints another figure states that one. The same applies to every other figure this course reads from the Norwegian texts, from the budget tolerances of Art. 12.5 to the overhead scale of the Accounting Agreement. Each is a stated input, cited where it is quoted, and the engine refuses a call that leaves the multiple out. The translation is unofficial, so the course quotes it exactly as printed.

## Exercise

Open the agreement calculator on the view "Buy-in at a stated multiple", which starts on the Ekene-4 sidetrack at the Norwegian multiple. Read the Source block under the tables and find the two articles it cites. Read the tile for what PB pays to enter and check it against the text: one thousand percent of the proportionate share. Then state 1000 with the control "Premium multiple, percent (stated)" on the sole risk view, and write one sentence on why the premium matches the entry payment while the two modes still differ.
