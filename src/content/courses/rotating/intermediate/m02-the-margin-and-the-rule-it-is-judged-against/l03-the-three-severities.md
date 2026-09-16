# The three severities

The check returns a label as well as a boolean, and the label carries information the boolean cannot. Two of the three labels come back with the same pass flag.

{{panel:fc-suction-explorer}}

## The three, each with the message the engine attaches

An available head below required, a margin of -4.000000 ft against a required margin of 4.200000 ft. The severity is "cavitating", pass is false, and the note reads:

"NPSH available is below required: this pump will cavitate at this duty"

An available head that clears required but sits inside the customary margin, a margin of 2.000000 ft against a required margin of 4.200000 ft. The severity is "marginal", pass is false, and the note reads:

"margin of 2.0 ft is below the customary 4.2 ft: acceptable only with vendor agreement and a stable suction"

An available head clear of it, a margin of 13.000000 ft against a required margin of 4.200000 ft. The severity is "adequate", pass is true, and the note is null.

## Why the label is not the flag

Two severities share a pass of false, and they describe different conditions. A cavitating suction has less available head than the pump requires, which is a statement about the machine's own published requirement. A marginal suction has more available head than the pump requires and less than the customary rule asks for on top, which is a statement about the rule.

A caller that reads only the boolean sees one failure where the engine reported two situations. One is a pump that will cavitate. The other is a pump whose suction clears its vendor requirement with thinner cover than convention wants, and the engine's note says what that case needs: vendor agreement and a stable suction.

## Being exact about what each one establishes

"Cavitating" establishes that the available head is below the required head that was handed in. If that required head was read at the wrong flow, the label is a correct label on a comparison that was set up wrong.

"Marginal" establishes that the margin fell short of the required margin. The required margin comes from the customary rule, so this label rests on a rule with no publication behind it.

"Adequate" establishes that the margin cleared the required margin. It does not establish that the pump will not cavitate, because clearing a customary cover is not a physical guarantee. Every severity here is an output of a held rule, and the course teaches all three and grades none.

## The mistake

The mistake is reporting a suction as failed and stopping. The two false cases need different work: one needs more available head or a different pump, the other needs a conversation with the vendor and a look at how steady the suction is.

The second mistake is reading the null note on an adequate case as a missing field. Null is the answer there.

## Exercise

Write the three severities with their margins, their pass flags and their notes. Then explain what a caller learns from a pass of false alone, and say which of the three labels is an answer about the pump's own requirement and which is an answer about the customary rule.
