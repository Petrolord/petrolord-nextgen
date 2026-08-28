# Rows that do not sum to one

Ekene's two allocation rows sum to 0.90 and 0.85. That is not sloppiness and it is not an error the engine tolerates; it is a deliberate statement about where twelve percent of the injected water goes. This lesson is about the asymmetry in how the engine treats too much and too little, and why that asymmetry is correct.

## The validation rules

The engine checks three things and grades them differently.

**A row summing above one is an ERROR.** You have allocated more water than the injector produced. There is no physical reading of that; it is arithmetic that cannot be true. The validation fails and reports the offending sum, for example "Ekene-2: allocation fractions sum to 1.200 (> 1)."

**A negative or non-numeric fraction is an ERROR.** A negative allocation would mean an injector removing water from a producer's support. The message names the specific cell: "Ekene-2 to Ekene-1: fraction -0.1 is not a number >= 0."

**A row summing below one is a WARNING.** It reports the shortfall by name: "Ekene-2: fractions sum to 0.900; the remaining 0.100 counts as out-of-zone." The analysis proceeds. The shortfall is booked, not rejected.

## Why below one is not an error

Because out-of-zone injection is real, common, and often the most important thing on the page.

Water leaves a flood pattern by several routes. It can go out of zone vertically, into a sand above or below the target that nobody is producing. It can cross a fault into a different compartment. It can go down-dip into the aquifer, which is exactly what Ekene's geometry suggests: both injectors are completed below the 1560 m oil water contact, in rock that is continuous with the water leg. It can be lost to a channel behind casing.

Every one of those is a real destination for real barrels, and forcing the rows to sum to one would delete them from the accounting. Worse, it would delete them by redistributing them onto the producers, which asserts that the water DID support production when the whole point is that it did not.

A shortfall is a measurement of your ignorance, and it belongs on the report.

## What the shortfall costs

Ekene injected 224975.42705121645 barrels over the record. The two row shortfalls send

$$0.10 \times W_{i,\text{Ekene-2}} + 0.15 \times W_{i,\text{Ekene-4}}$$

out of zone, which comes to 26997.051246145966 barrels, a fraction of

$$\frac{26997.051246145966}{224975.42705121645} = 0.11999999999999997$$

Twelve percent of the injection, and note the float tail: the answer is exactly 0.12 because the injection split of 0.6 and 0.4 combined with shortfalls of 0.10 and 0.15 gives $0.6 \times 0.10 + 0.4 \times 0.15 = 0.12$. The tail in the sixteenth digit is binary arithmetic, not a real deviation.

Twelve percent of your injection budget going somewhere that produces nothing is a substantial number. It is also, on this field, an assumption rather than a measurement: nobody measured it, the matrix asserts it. That is worth stating loudly next to the number.

## The two ways to be wrong about the shortfall

**Too small a shortfall** distributes water onto producers that never received it, and every pattern looks better injected than it is. Your under-injected element looks adequately supplied and you leave it starved.

**Too large a shortfall** starves every pattern in the accounting and makes the whole field look under-injected, prompting more injection than is needed.

Neither error announces itself, because the field-level total is unchanged in both cases. Conservation holds regardless of how wrong the split is, which is the topic of the next lesson: the audit proves the arithmetic and says nothing about the truth.

## Testing the shortfall

The one real test available is the pressure response of the patterns. If your allocation says the North element is heavily over-injected and its producers' pressures are not rising relative to the South, then either the allocation or the pattern definition is wrong. That is a weaker test than it sounds, because pressure in a well-connected sand equilibrates across pattern boundaries, but it is a genuine one and it is the reason the Associate tier's pressure work comes first.

## The misconception to avoid

"A row that sums to less than one means we have not finished building the matrix." Sometimes true, and a matrix in progress should be marked as such. But a completed, considered matrix with a deliberate shortfall is a stronger statement than one forced to sum to one, because it distinguishes what you believe about the producers from what you believe about the total. A row forced to one hides that distinction and cannot express "I know where 85 percent of this goes and I do not know about the rest".

## Exercise

First, verify the 0.12 out-of-zone fraction from the injection split and the two row shortfalls, and then compute what the fraction would be if the split were reversed, 0.4 to Ekene-2 and 0.6 to Ekene-4.

Second, an injector's row sums to 0.6 and the operator insists all its water stays in the pattern. Describe two independent lines of evidence you would ask for, and state what each would prove if it came back positive.
