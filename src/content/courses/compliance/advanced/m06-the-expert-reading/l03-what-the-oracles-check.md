# What the oracles check

Every figure in this course came from the engine at 9d5d3b4, read at one as-of date. This lesson asks the question a careful reader asks next: who checks the engine? SECTION 24 of the digest answers it, and it also says exactly what the check does not cover.

## The oracles

For each module, an independent oracle written in stdlib Python produces a golden file from the rules as the modules and the status document state them. The engine's answer and the oracle's answer are then compared. A golden figure beside an engine figure is two methods agreeing.

| module | golden cases | distinct exports with a case | sort cases |
| --- | --- | --- | --- |
| calendar | 77 | 5 | 0 |
| complianceStatus | 159 | 10 | 3 |
| documentControl | 130 | 13 | 2 |
| qualityAssurance | 422 | 27 | 2 |
| isoCompliance | 216 | 32 | 1 |
| auditManagement | 181 | 31 | 2 |

The oracles live under tools/validation/assurance/, one file for each module: oracle_calendar.py, oracle_compliance.py, oracle_documents.py, oracle_quality.py, oracle_iso.py and oracle_audit.py.

## Reading the table

Read each row as three counts. Golden cases is how many cases the oracle wrote. Distinct exports with a case is how many of the module's exports at least one case reaches. Sort cases is how many cases check an ordering.

SECTION 1 printed how many functions each module exports. isoCompliance exports 33 functions, and its row here prints 32 distinct exports with a case. The digest does not say which exports have no case, and it does not say whether the count of exports with a case includes the frozen lists. Quote both figures and draw no conclusion about coverage from them.

Read the sort cases column beside lesson 5 of module 4. isoCompliance carries 1 sort case. The digest does not say which ordering it checks, and it does not state the rule that places orders 2 and 3 of findingByUrgency. A sort case agreeing with the engine would confirm an order. It would not tell a learner the rule behind it.

## What the oracles do not check

The digest is exact about this. The oracles check the verdict of a gate, allowed or refused, and never the wording of its reason. Every refusal sentence in this course is the engine's own, and it is quoted rather than checked.

This is why the course quotes each refusal verbatim or describes it, and never rewords one inside quotation marks. The verdict is vouched for by two methods. The words are vouched for by nothing except the engine that printed them. A reworded refusal would carry the look of a checked sentence with no check behind it.

## Why this belongs in the Expert tier

An expert reader of a compliance record asks how each figure is known. For the ORASHI register the answer comes in three layers: the engine derived it, at a stated as-of date, and an independent oracle agrees with the engine's verdicts and figures on its golden cases. Where the digest stops, as on the sort rule and the exports without a case, the expert says so rather than filling the gap.

## Exercise

Read the six rows of the oracle table. For isoCompliance and auditManagement, quote the golden cases, the distinct exports with a case and the sort cases. Beside them, quote the exported functions each module has in SECTION 1. Say what the two figures for each module do and do not tell you, without forming a ratio. Then say what the oracles check about a refusal and what they leave unchecked.
