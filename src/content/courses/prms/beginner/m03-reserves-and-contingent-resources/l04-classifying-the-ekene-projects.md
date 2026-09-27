# Classifying the Ekene projects

{{panel:prms-classification-calculator}}

This lesson puts the module together. It walks through all eight Ekene projects in the order of the engine's decision list and reads the class and sub-class the engine gives each, with the section it cites. By the end you should be able to predict the class of any project from its stated facts before you run it.

## The eight decisions

| id | class (engine) | class section | sub-class (engine) | sub-class section | Pc, percent (engine) |
| --- | --- | --- | --- | --- | --- |
| EKN-1 | Reserves | PRMS 2.1.2.1, Table 1 | on-production | PRMS 2.1.3.5, Table 1 | none |
| EKN-2 | Reserves | PRMS 2.1.2.1, Table 1 | approved-for-development | PRMS 2.1.3.5.5, Table 1 | none |
| EKN-3 | Contingent Resources | PRMS 2.1.2.1, Table 1 | development-on-hold | PRMS 2.1.3.5.6, Table 1 | 50.000000 |
| EKN-4 | Contingent Resources | PRMS 2.1.2.1, Table 1 | development-pending | PRMS 2.1.3.5.6, Table 1 | 65.000000 |
| EKN-5 | Contingent Resources | PRMS Table 1 (Contingent Resources guidelines) | development-unclarified | PRMS 2.1.3.5.6, Table 1 | 20.000000 |
| EKN-6 | Prospective Resources | PRMS 2.1.0.1, Table 1 | prospect | PRMS 2.1.3.5.9, Table 1 | 20.000000 |
| EKN-7 | Prospective Resources | PRMS 2.1.0.1, Table 1 | lead | PRMS 2.1.3.5.9, Table 1 | 10.500000 |
| EKN-8 | Discovered Unrecoverable | PRMS 2.1.0.1, 2.1.1.2 | none | none | none |

## Walking the decision list

**Step one, discovery.** Six projects are discovered and two, EKN-6 and EKN-7, are not.

**Step two, a recovery project.** EKN-8 has none, so it stops here as Discovered Unrecoverable. EKN-5 has a project, with technology under development.

**Step three, undiscovered with a project.** EKN-6 and EKN-7 become Prospective Resources, with the sub-class you state and a chance that is the product of two.

**Step four, the commerciality test.** EKN-1 and EKN-2 meet every criterion with established technology and become Reserves. EKN-3, EKN-4 and EKN-5 each fail at least one and become Contingent Resources. EKN-5 cites the Contingent Resources guidelines of Table 1, and it lists technology under development first among its blockers.

## Where the sub-class comes from

The sub-class works differently in each class. For Reserves the engine derives it from two stated facts, the investment decision and production, and checks the stated sub-class against them. For Contingent and Prospective Resources it takes the stated sub-class and checks only that it belongs to the class. The decision table marks the second kind with the word "stated", as in "development-on-hold (stated)".

## The chance column

Reserves carry no chance figure. The Contingent projects carry their chance of development, and the Prospective ones the product of two chances. Ekene Deep and Ekene West both show 20.000000 percent, for different reasons: one is 25 percent times 80 percent, the other a single chance of development.

## What the table leaves out

The table holds the class, the sub-class and the chance, and nothing else. Three more things sit beside them in a full classification. The Reserves projects carry a stated reserves status: EKN-1 developed-producing, EKN-2 undeveloped. The Contingent projects carry their list of blockers, which the previous lesson read. And two projects carry a Nigerian note: EKN-1 as a commercial discovery and EKN-3 as a significant gas discovery. None of these changes the class, but a report that leaves them out hides why each project sits where it does. The categories of each project, its low, best and high, come in the next module.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality". Before you run each project, read its box and write down the class you expect and the step of the decision list that decides it. Then step the start selector from "EKN-1 Ekene Main waterflood" to "EKN-8 Ekene Main residual oil" and check each prediction against the Class tile and the decision table. For any you got wrong, find the stated fact you missed.
