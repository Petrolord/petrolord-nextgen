# Working the capstone

A graded question is won or lost before any arithmetic happens, in the minute spent deciding which number the question is asking for and what that number is measured in.

{{panel:ec-plan-explorer}}

## Read the conditions, and write them down

Every value in this course is conditional on something. An NPV of 2047.5653 million USD is conditional on a price of 70.0000 USD a barrel, a capex of 2250.0000, an operating cost of 95.0000 a year, a royalty of 12.5000 percent, a tax of 30.0000 percent, a discount rate of 10.0000 percent and a 20 year shape. Before working anything, list what the question fixes and what it leaves you to read out of the plan. Half the wrong answers in this subject are right answers to a slightly different question.

## Run the method, do not recall the result

A remembered number is a liability. Take a concept's capex: it is drilling plus facilities plus subsea, read from the three fields the concept carries, which is how 520.0000, 1350.0000 and 380.0000 become 2250.0000. Read it from anywhere else, or from a single field a form never wrote, and the answer will be confidently wrong. The same goes for a total per fluid, a phase roll-up and a cash flow row: find the rule, apply it to the numbers in front of you, and let the result be whatever it is.

## Check the unit before you check the answer

| quantity | unit | how it prints |
| --- | --- | --- |
| oil reserves | MMbbl | 130.0000 |
| gas reserves | Bcf | 70.0000 |
| plan money | million USD | 2250.0000 |
| a rate of return | percent | 29.5998 |
| a ratio | a plain number | 1.436477 |

Oil and gas never add. Money in a development plan is million USD to four decimals, while a task or a well cost is a whole currency unit. A percent and a ratio are different animals, and 0.330657 of gross revenue is not 0.330657 percent of it. Write the unit beside every figure as you work, and a unit error becomes visible instead of arriving in the final line.

## Never guess a number

If the plan does not carry a figure, the honest answer says so. The engines are built the same way: a missing price is refused with FdpInputError: "the scenario oil price is missing", a payback that never happens reports never rather than the project life, and a rate of return that does not exist reports its status instead of a value. A guessed input produces an output with no owner, and it will disagree with every other number in the plan. Where a question asks what something is worth and the plan cannot say, the answer is what is missing.

## The mistake

Rounding as you go. Carry the figures at the precision they were printed at, do the arithmetic once, and quote the result at the precision the question asks for. The second mistake is answering a question about one plan with a number from another. Three models in this course share nothing with each other, and a figure borrowed across them is wrong even when it looks plausible.

## Exercise

Take the FPSO concept and write down, with units, its three capex fields, its total, its annual operating cost and its life. Then state the price the Base scenario runs at and the three headline figures it reports, and mark beside each one whether it is money, a percent or a duration.
