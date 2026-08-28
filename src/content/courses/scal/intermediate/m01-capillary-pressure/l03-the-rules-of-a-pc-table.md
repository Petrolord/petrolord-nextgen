# The rules of a Pc table

Before the engine will scale, fit, or average anything, it insists that a capillary pressure table deserve the name. The gatekeeper is a validation routine, and its rules are short enough to memorise. Each one exists because a specific, common data accident would otherwise slip through and corrupt everything downstream. This lesson walks the rules and the accidents.

## The five rules

A drainage capillary pressure table arrives as rows of $(S_w, P_c)$. The engine checks:

1. **At least three rows.** Its message reads exactly: "A capillary pressure table needs at least 3 rows." Two points define a line and one defines nothing; a curve with curvature to speak of needs three points as an absolute floor, and the later fitting machinery needs more still.
2. **Saturations within (0, 1].** $S_w$ is a fraction of pore volume. A value of 0 is excluded as well as anything negative or above 1, because a rock with literally zero water cannot sit on a drainage curve that was measured by removing water from a wet plug.
3. **No negative pressures.** On a drainage curve in a water-wet rock the non-wetting phase pressure is at or above the water pressure everywhere, so $P_c \geq 0$. A negative entry is almost always a subtraction done in the wrong order somewhere upstream.
4. **No duplicate saturations.** Two rows at the same $S_w$ with different pressures make the curve a relation, not a function. Duplicates usually mean a copy-paste doubling or two measurement passes pasted into one column.
5. **Pressure non-increasing in saturation.** As $S_w$ rises, $P_c$ must fall or hold. This is the drainage shape from lesson 1: more water means the non-wetting phase occupies only the larger throats, which cost less. The engine's message names the physics: "Pc must be non-increasing in Sw (drainage curve)."

## What the engine fixes silently, and what it will not

Two clean-ups happen without complaint. Rows arrive in any order and are sorted by saturation internally, because labs report drainage runs from wet to dry and plotting software wants dry to wet, and neither convention is wrong. And rows containing non-numeric entries are dropped, because a stray text remark in a spreadsheet column should not kill an otherwise sound table.

Everything else is a refusal, not a repair. This is a deliberate design choice worth internalising: a rising pressure point is not a formatting problem the software should smooth over, it is evidence that something happened, an imbibition excursion, a leak in the cell, a transcription error, and only a human looking at the lab sheet can say which. Software that quietly deletes or reorders the offending point would be manufacturing data. The engine's job is to stop the pipeline and say why.

## Reading a refusal

The messages are written to be actionable. "Duplicate Sw values." sends you to look for a doubled row. "Pc values must not be negative." sends you to the subtraction that produced the column. "Pc must be non-increasing in Sw (drainage curve)." sends you to the specific rows where the curve turns the wrong way, and the first question to ask there is whether the run really was drainage all the way, because a plug that was accidentally allowed to re-imbibe mid-run produces exactly this signature.

Notice what is absent from the rules: no minimum permeability, no expected pressure range, no assumption about which fluid system was used. The validator knows nothing about air-brine versus mercury. A mercury table riding six times above an air-brine table, as EK3-P rides above EK1-P, passes untouched, because height is a fluid-system property and the rules are shape properties. Validation and scaling are different jobs, done by different code, in that order.

## The misconception to avoid

The misconception is that validation is bureaucracy standing between you and the answer, to be switched off when it complains. Run the accidents through your head instead. A duplicated row biases a fit toward one saturation. A negative pressure detonates the logarithms the fitting machinery uses. A rising point drags the fitted curve into a shape no drainage physics can produce, and the error then propagates through scaling into the height model of module 5, where it silently moves fluid contacts by metres. The rules are not pedantry. They are the cheapest place in the entire workflow to catch an error, because past this gate every number is a blend of every row.

## Worked example

A technician emails you this table, transcribed from a centrifuge run:

| $S_w$ | $P_c$ (psi) |
|---|---|
| 1.00 | 0.50 |
| 0.80 | 0.60 |
| 0.60 | 0.55 |
| 0.40 | 1.05 |

Walk the rules. Row count: four, passes. Saturations: all in (0, 1], passes. Pressures: none negative, passes. Duplicates: none, passes. Monotonicity: sort by rising $S_w$ and read the pressures: 1.05, 0.55, 0.60, 0.50. Between $S_w = 0.60$ and $S_w = 0.80$ the pressure rises from 0.55 to 0.60, so the table fails rule five, and the engine refuses it with the drainage-curve message. The suspect row is the 0.55 at $S_w = 0.60$: compared against its neighbours it is low, consistent with a mis-keyed 0.75, and that is a question for the lab sheet, not for an editor with a delete key.

## Exercise

First, take the worked example's table and state the two different single-row corrections that would each make it pass all five rules. For each correction, say what physical or clerical story it implies, and which story you would investigate first.

Second, a colleague proposes making the validator auto-sort and also auto-delete any row that breaks monotonicity, arguing it would save everyone time. In three sentences, explain why the sort is safe to automate but the deletion is not.
