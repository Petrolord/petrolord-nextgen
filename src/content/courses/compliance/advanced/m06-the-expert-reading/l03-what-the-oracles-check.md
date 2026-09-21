# What the oracles check

Every figure in this course came from the engine at ab3ce6a (ASC-1), read at one as-of date. This lesson asks the question a careful reader asks next: who checks the engine? This course answers it, and it also says exactly what the check does not cover.

## The oracles

For each module, an independent oracle written in stdlib Python produces a golden file from the rules as the modules and the status document state them. The engine's answer and the oracle's answer are then compared. A golden figure beside an engine figure is two methods agreeing.

| module | golden cases | distinct exports with a case | sort cases |
| --- | --- | --- | --- |
| calendar | 77 | 5 | 0 |
| complianceStatus | 171 | 10 | 3 |
| documentControl | 130 | 13 | 2 |
| qualityAssurance | 422 | 27 | 2 |
| isoCompliance | 235 | 33 | 1 |
| auditManagement | 181 | 31 | 2 |

The oracles live under tools/validation/assurance/, one file for each module: oracle_calendar.py, oracle_compliance.py, oracle_documents.py, oracle_quality.py, oracle_iso.py and oracle_audit.py.

## Reading the table

Read each row as three counts. Golden cases is how many cases the oracle wrote. Distinct exports with a case is how many of the module's exports at least one case reaches. Sort cases is how many cases check an ordering.

SECTION 1 printed how many functions each module exports, and SECTION 24 goes on to name the exports each golden file has no case for. It counts a sort case as a case for the sort it names. For isoCompliance it prints 34 exported functions, 0 without a case, and 25 exported lists and constants. For auditManagement it prints 33 exported functions, 0 without a case, and 20 exported lists and constants. Every one of the six modules reads 0 without a case.

The lists and constants are data rather than functions, and the course says they carry no case of their own.

Read the sort cases column beside lesson 5 of module 4. isoCompliance carries 1 sort case. SECTION 21 states the rule findingByUrgency sorts by and prints each finding's rank. The course does not say which ordering the isoCompliance sort case checks. A sort case agreeing with the engine confirms an order; the rule behind it is SECTION 21's sentence.

## What the oracles do not check

The course is exact about this. The oracles check the verdict of a gate, allowed or refused, and never the wording of its reason. Every refusal sentence in this course is the engine's own, and it is quoted rather than checked.

This is why the course quotes each refusal verbatim or describes it, and never rewords one inside quotation marks. The verdict is vouched for by two methods. The words are vouched for by nothing except the engine that printed them. A reworded refusal would carry the look of a checked sentence with no check behind it.

## Why this belongs in the Expert tier

An expert reader of a compliance record asks how each figure is known. For the ORASHI register the answer comes in three layers: the engine derived it, at a stated as-of date, and an independent oracle agrees with the engine's verdicts and figures on its golden cases. Where the course stops, as on which ordering a sort case checks, the expert says so and leaves the gap open.

## Exercise

Read the six rows of the oracle table. For isoCompliance and auditManagement, quote the golden cases, the distinct exports with a case and the sort cases. Beside them, quote the exported functions and the count without a case that SECTION 24 prints for each module. Say what those figures tell you about coverage and what they leave unsaid about the lists and constants. Then say what the oracles check about a refusal and what they leave unchecked.
