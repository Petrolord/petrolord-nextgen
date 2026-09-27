# Developed and undeveloped reserves

{{panel:prms-classification-calculator}}

Once a project is Reserves, one more label says how much of the work is already done. The reserves status tells a reader whether the wells and plant exist and whether they are producing (PRMS 2.1.3.6, Table 2). Two Reserves projects with the same estimates can differ sharply here: one needs only to keep running, the other still needs its capital spent.

## The three statuses

| reserves status (stated) | in the course's words | Ekene example |
| --- | --- | --- |
| developed-producing | wells completed and open, and producing now | EKN-1 Ekene Main waterflood |
| developed-non-producing | wells completed but shut in or waiting, such as zones behind pipe | none in the Ekene file |
| undeveloped | quantities that still need new wells or major spending | EKN-2 Ekene infill wells |

The status is a stated input with its own control, "Reserves status (stated, Reserves)". It is read only for Reserves.

## Checked against the project status

For Reserves the engine also reads two stated facts about the project: whether the final investment decision is taken and whether it is on production. It uses them to set the sub-class. EKN-1 is on production, and its sub-class decision reads "on-production: on production, selling petroleum to market". EKN-2 has its investment decision but no production yet, and its decision reads "approved-for-development: final investment decision taken; production yet to start".

The reserves status must fit those facts. Developed producing reserves need a project that is producing. Stated on one that is not, the status is refused:

> reservesStatus must be "developed-non-producing" or "undeveloped" for a project that is not on production (developed producing reserves come from completion intervals open and producing, Table 2); got "developed-producing"

The message names the two statuses that would be accepted, and the reason for the rule.

## Why readers care

Developed producing reserves carry little left to spend and little left to decide. Undeveloped reserves depend on a plan being carried out: wells drilled, money spent, dates kept. Securities rules in the United States ask a company to explain undeveloped quantities that stay undeveloped too long. The public text reads:

> "(d) Explain the reasons why material amounts of proved undeveloped reserves in individual fields or countries remain undeveloped for five years or more after disclosure as proved undeveloped reserves." (17 CFR 229.1203(d))

That rule is a disclosure rule for US registrants, quoted here from the eCFR version current at 2026-09-01. The engine applies no such clock; it reads only the status you state.

## A status for Reserves only

Contingent and Prospective Resources carry no reserves status. Their projects have not passed the commerciality test, so there is nothing yet to call developed. The engine reads the reserves status control only when the facts give Reserves.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality", and start from "EKN-2 Ekene infill wells". Read the Reserves status tile and the sub-class decision. Set the control "Reserves status (stated, Reserves)" to "developed-producing" and read the refusal. Try "developed-non-producing" and read what the engine returns. Restore "undeveloped". Then start from "EKN-1 Ekene Main waterflood" and write down which two stated facts let it carry the status it has.
