# A completed action and a working one

A corrective action is marked Complete when the work it describes is done. Whether the cause has actually gone away is a separate question, answered later by a check of effectiveness. For a Major or Critical NCR the engine asks for that check before it lets the NCR close.

{{panel:compliance-plan-explorer}}

## The actions on the ABAM NCRs

At the as-of date 2026-10-15:

| action | NCR | type | status | open | verified effective | found ineffective |
| --- | --- | --- | --- | --- | --- | --- |
| k1 | NCR-2026-031 | Corrective | Complete | false | false | false |
| k2 | NCR-2026-031 | Preventive | In progress | true | false | false |
| k3 | NCR-2026-019 | Corrective | Complete | false | false | true |
| k4 | NCR-2026-019 | Corrective | Complete | false | true | false |
| k5 | NCR-2026-011 | Corrective | Open | true | false | false |
| k6 | NCR-2026-027 | Corrective | Open | true | false | false |

k1, k3 and k4 all read Complete. They are three different states of evidence: k1 has not been checked, k3 was checked and found not to work, and k4 was checked and verified effective.

## Two refusals about the check

On the Major walk, an NCR whose one corrective action was checked and found not to work is refused:

"A corrective action here was checked and found not to have worked. Raise another one rather than closing over it."

An NCR whose one corrective action is complete and has not been checked is refused too:

"No corrective action has been verified effective yet. A completed action is not a working one, and for a non-conformance this serious the check is the point."

With a corrective action verified effective, the answer is ALLOWED.

The two refusals are different instructions. The first says the fix failed, so another action is needed. The second says nobody has looked yet, so the check is needed. A Complete status alone does not tell them apart, and the flags beside it do.

## NCR-2026-019

NCR-2026-019, the wrong flange rating delivered, is Critical and reads Disposition agreed. It carries k3, found ineffective, and k4, verified effective. Asked to close it at the as-of date, the engine answers ALLOWED.

Read against the refusal above, the difference is k4. The walked refusal is for an NCR whose one corrective action was found not to work. NCR-2026-019 has that action and a second one, and the second was verified effective. That is the sentence's own instruction carried out: another action was raised, and it worked.

## NCR-2026-031

NCR-2026-031, the radiography reject on tie-in weld TW-07, is Major. Its corrective action k1 reads Complete and verified effective false. Its preventive action k2 is In progress, due 2026-10-05, overdue true. At the as-of date the engine refuses it on the open action: "1 corrective or preventive action still open."

The digest prints only that first refusal for NCR-2026-031. The Major walk shows the refusal an NCR meets when its one corrective action is complete and unchecked, and k1 is in that state. This lesson does not say what the engine answers for NCR-2026-031 once k2 finishes, because the digest does not print that call.

## The counts that follow

The action summarise at the as-of date prints awaiting an effectiveness check 1, verified effective 1 and found ineffective 1. Each count names one of the three Complete states above. An NCR register that shows only Complete and Open has folded all three into one word.

## Exercise

Read k3 and k4 on NCR-2026-019 and the engine's answer for that NCR, ALLOWED. Then read the walked refusal for a corrective action found not to work. Say what the pair shows about why NCR-2026-019 may close while it carries an action found ineffective, and which action's flag makes the difference.
