# A negative rate is an answer

A rate below zero is a verified root like any other, and it carries information a null does not. It says the money came back, and came back short.

{{panel:ec-value-explorer}}

## The case that never pays back

A published suite case spends 100000 in capex and reports an NPV of -92616.5020, an IRR of -36.6747 percent and the status `ok`. That status is the point. The flow changes sign, the search found a root inside the band, and the root happens to be negative. The engine did not fail and it did not clamp. It solved, and the solution is -36.6747 percent.

Read plainly, -36.6747 percent says that the cash returned to the project over its life is equivalent to putting money into an account that loses more than a third of its balance a year. That is a strong statement about the project, and it is exactly the statement the arithmetic supports.

## Negative is not the same as absent

| case | NPV | IRR | status |
| --- | --- | --- | --- |
| never pays back, 100000 capex | -92616.5020 | -36.6747 | ok |
| EGINA at 18.0000 USD a barrel | -1797.2732 | none | no-root |
| a case that only spends | -524.1537 | none | no-sign-change |

All three lose money. Only the first has a rate. The second changes sign and still has no rate the band contains, and the third never changes sign at all, so there is nothing to solve. A reader who files all three under "bad IRR" has lost the distinction between a project that returned money badly and a project that returned none.

## A root can sit below the band's floor

A published deck case carries an NPV of 126.1636 and a status of `multiple-roots`, and the golden records that the root the band hides is -52.4425 percent. The floor of the search is -99 percent, so that root is inside the band by value. It is not reported because the flow crosses zero more than once, which is a separate refusal. A negative root is unremarkable arithmetic. What gets a rate withheld is always the shape of the flow, never the sign of the answer.

## Positive does not mean profitable

The mirror of this mistake is just as common. At 40.0000 USD a barrel the EGINA concept reports 8.2444 percent, a positive rate and a valid one, on an NPV of -161.0098 million USD. The rate is positive and the project destroys value, because the screening discount rate is 10.0000 percent and the flow only earns 8.2444. The sign of the rate is not the test. The test is the rate against the rate money costs, and the NPV already did that comparison.

## The mistake

The mistake is treating a minus sign as an error message and suppressing it. An engine that prints a rate only when the rate is flattering has stopped being an engine. The repaired behaviour prints -36.6747 percent with the status `ok` and prints nothing at all where there is no root, and those two outputs mean different things.

## Exercise

For the 100000 capex case, state the NPV, the IRR and the status, and say why the status is `ok` on a project with an NPV of -92616.5020. Then contrast it with EGINA at 18.0000 USD a barrel and say what each of the two answers tells a reader that the other does not.
