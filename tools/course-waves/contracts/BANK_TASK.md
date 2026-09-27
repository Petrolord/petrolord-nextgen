# SC5 Contract & Supplier Management: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. `PACK.md` is the only teaching
truth for this course; every keyed answer rests on at least one of its
passages.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong and cites the source the key rests on (the Act and its section, the
guidance and its paragraph). Banks live in `banks/` as
`sc5<b|i|a>_<m01..m06|exam>.py` and `.json`. **Every bank `.py` writes its JSON
to a LITERAL path** in this directory (`/root/cat-wip-contracts/banks/
sc5b_m01.json` and so on), because the repository's check-bank-sources reads
literal paths only. `banks/` holds one stub per bank already; fill its
question list and keep its header, its `q()` and its emit line.

## THE TRACE

Each question is written as `q(k, prompt, correct, [d1, d2, d3],
explanation, ['P0xx', ...])`. The last argument names the pack passages the
KEY rests on: at least one, every one a real passage. `gate_source_trace.py`
executes every bank and refuses a question with no trace or a trace to a
passage that does not exist. The ids never appear in a prompt, an option or an
explanation.

## SCENARIO QUESTIONS

A practice course examines judgement on facts, so most questions are short
scenarios on the synthetic Ekene contracts (EKC-01 to EKC-07): the facts, the
clause or the record, and what has happened, then a question on what the
sources support. Say the contract is synthetic in the prompt. The scenario's
own facts are the scenario's; a legal figure in a question is always one a
passage prints, with its citation.

## THE EXPERT EXAM IS THE WRITTEN-CASE BANK

`sc5a_exam.py` replaces the capstone of an app or engine course and issues the
Expert certificate. 42 questions, seven drawn from the material of each Expert
module. Each is a WRITTEN CASE: a paragraph or two of facts set in one Ekene
contract (a claim with its notices, a dispute on its ladder, a supplier in
distress, a close-out with open items, a conflict of interest), then one
question on the decision the sources support. Several questions may share one
case, each still readable on its own. No numeric field, no arithmetic key: a
case that turns on a figure keys the rule the figure belongs to.

## THE ANSWER-LENGTH DEFECT

**Balance the option lengths.** The correct option must not be the longest,
and must not be the second longest more often than chance. `lengthtails.py`
measures it, and bankkit's length-rank gate refuses a bank that leans.
Lengthen distractors; do not trim the key to pass the gate.

## THE OPENING DEFECT

**Vary the openings** of every option, the key's included: three distractors
opening the same way while the key does not is a tell.

## GOOD DISTRACTORS ARE REAL WRONG PRACTICE

A good distractor is a rule from the wrong regime (a UK rule offered as
binding an Ekene contract), the right rule at the wrong stage (a tender-stage
rule offered at execution), a figure from a neighbouring provision, or a
common misreading the pack itself corrects (a KPI the contract does not state
treated as carrying a remedy; a claim with no notice; termination as the
first remedy). A distractor must be wrong on the sources, and a reader of the
pack must be able to say why.

## WHAT MAKES A GOOD SC5 QUESTION (a sample, with their sources)

1. **Who holds the plan.** The contract manager produces the contract
   management plan and the senior business owner approves it (GovS 008,
   5.4.2).
2. **The annual content report.** Within sixty days of the beginning of each
   year (the content Act, s.60).
3. **The offence.** A fine of five per cent of the project sum or cancellation
   of the project (the content Act, s.68).
4. **A mobilisation fee in a Nigerian public contract.** Not more than 15%,
   with no further payment until an interim performance certificate (the
   Public Procurement Act 2007, s.35(1) and (2)).
5. **KPIs under the UK Act.** At least three above £5 million, assessed at
   least once in every twelve months and on termination (the Procurement Act
   2023, s.52(1) and s.71(2)).
6. **Mediation stops the limitation clock.** The Arbitration and Mediation
   Act 2023, s.71(1).
7. **Setting aside an award.** Not after three months from receipt of the
   award (the Arbitration and Mediation Act 2023, s.55(4)).

## NO FORWARD REACH

An Associate question never needs a segmentation, a change assessment, a
claim, a dispute or a termination; a Professional question never needs a
contract strategy, a claim assessment, a dispute process, a termination or a
close-out.

## A READING IS NEVER KEYED AS THE LAW

Where a source can be read two ways, or a Nigerian rule binds a public
procuring entity and is used only as practice for an operator, the question
states the basis it is asked on, and the key follows that basis.

## THE VOCABULARY AND THE COPY RULE

The pack's section 3 is binding on every prompt, option and explanation. No
em dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of", no "and not", no "and never". Never cite a passage
id or a pack section in a question or an explanation.
