# Revision numbers keep their width

A controlled document is cited by its number and its revision: a procedure at revision 09 is a different document from the same procedure at revision 10, and a permit condition, a contract or an audit finding may cite either. Document Control derives the next revision number from the current one, and it keeps the width the revision is cited at.

## nextRevisionNumber

| current revision | next revision |
| --- | --- |
| '01' | '02' |
| '09' | '10' |
| '099' | '100' |
| '7' | '08' |
| '10' | '11' |
| 'A' | '01' |
| '' (empty) | '01' |
| null | '01' |
| ' 04 ' | '05' |

{{panel:compliance-register-explorer}}

Read the rows in groups.

The first two keep two digits: '01' goes to '02' and '09' goes to '10'. A three digit revision stays three digits, so '099' goes to '100'. A revision written with one digit, '7', comes back as '08', padded to two. '10' goes to '11'.

A revision that is not a number at all, the letter 'A', an empty string or null, gives '01'. The engine starts a numbered sequence at '01' when it has nothing it can count from. The padded value ' 04 ', with spaces around it, gives '05': the spaces are ignored and the number inside is read.

## Why the width matters

Revision numbers are sorted and compared as text in a great many places: file names, document registers exported to spreadsheets, transmittals, drawing lists. As text, '10' sorts ahead of '9', and a register sorted by revision would put revision 9 after revision 10. Keeping the width, '09' then '10', keeps the text order and the number order the same. It also keeps a document cited as revision '01' recognisably the same series as revision '02'.

## Document numbers

The same module derives the prefix of a document number from its department and category. documentPrefix takes the first three letters of each:

- 'Health, Safety & Environment', 'Procedure' gives HEA-PRO
- 'Operations', 'Plan' gives OPE-PLA
- 'QA', 'ITP' gives QA-ITP
- '', '' gives GEN-DOC

Two letters of 'QA' stay two letters. An empty department and category give the general prefix GEN-DOC. The IKORO numbers you have been reading, HSE-PRO-0007 and OPS-PLA-0002, are numbers as they stand in the library, and the digest does not say how they were issued. Read documentPrefix as the rule for the prefix, and read a number on the record as what it says.

## Classification

documentControl also checks a document's classification against a floor. atLeastConfidential, against the default floor Confidential, reads Public false, Internal false, Confidential true and Restricted true. atLeastConfidential answers true for a classification at the floor or above it, and false below it.

## Exercise

Read the rows for '09', '099' and '7'. Say what each next revision is and what the engine did to the width in each case. Then read the rows for 'A' and ' 04 ' and say what the engine does with a revision that is not a number and with one wrapped in spaces.
