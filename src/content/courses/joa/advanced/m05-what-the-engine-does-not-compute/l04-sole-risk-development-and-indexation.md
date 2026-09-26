# Sole risk development and indexation

{{panel:joa-agreement-calculator}}

Three more provisions fall outside the engine: a sole risk development with its bar on later entry, the indexation of an overhead scale, and the cash call debts of the Nigerian joint ventures. Each is taught as a concept, with the text it comes from.

## Sole risk development

The Norwegian Joint Operating Agreement (unofficial English translation, PDF dated 27 February 2007, cited from the Wayback Machine capture of 26 May 2024, read on 2026-09-26) treats a sole risk development in its Article 19, with its own rules on whether and when the other parties may later come in. The engine computes sole risk operations only: one operation, one cost and the years of its net value. The `operation` block accepts a name and a cost and nothing else, and a key such as a date is refused:

> operation.date is not an accepted key; the accepted keys of operation are name, cost

A development carried by some parties would need a development plan, a schedule of entry rights and the terms of any bar, which the field development planning course and the contract supply. The course names the provision and leaves it there.

## Indexation of an overhead scale

The Norwegian Accounting Agreement charges the operator's general research and development cost on bands of annual cost, and moves the bands every year:

> "The intervals above will be adjusted at the beginning of each Year on the basis of the consumer price index as published by Statistics Norway per 15 July of the current year." (Norway Accounting Agreement Art. 2.2.2)

The engine's overhead function computes any marginal scale of that shape, with every band and rate a stated input, and does no indexing. A contract that indexes its bands states each year's bands after the adjustment. The Associate tier computes the scale itself.

## Cash call debts of the Nigerian joint ventures

The Petroleum Industry Act 2021 deals with the cash call arrangements of NNPC joint ventures and incorporated joint venture companies in s.54(8) and s.65. The course reads those sections as concepts only, and the engine computes nothing for them. The Nigerian fiscal system belongs to the Petroleum Industry Act course.

## The pattern

Each provision needs something the engine does not have and should not guess: a development plan, an index series, a national joint venture's debt history.

## Exercise

Open the agreement calculator on the view "Sole risk: the premium recovered from production", which starts on the Ekene-4 sidetrack. Add `"date": "2031-01-01"` to the `operation` block and read the refusal. Remove it. Then read the Source block and the notes under the tables, and write two sentences for a partner: what the engine computes for a sole risk operation, and which Norwegian article it does not compute.
