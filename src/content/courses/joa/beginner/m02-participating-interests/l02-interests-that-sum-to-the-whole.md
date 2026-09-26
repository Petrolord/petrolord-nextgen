# Interests that sum to the whole

{{panel:joa-account-calculator}}

The participating interests of all the parties make up the whole venture, so they must sum to 100. If they sum to less, some share of every cost has no one to pay it; if they sum to more, the parties have sold the same barrel twice. The engine checks the sum before it computes anything else, and it refuses a set of parties that does not make up the whole.

## How close is close enough

Percentages typed with decimals rarely add exactly in floating point. The engine allows a stated convention, `DEFAULTS.SUM_TOLERANCE`, of 1e-9: participating interests (or carrier shares) may sum that far from 100 and still be accepted. That is a tolerance on arithmetic noise, far below any share a contract would write. A real gap of a whole point is refused:

> parties must have participatingPct summing to 100; got a sum of 90

The message names the field, `parties`, states the condition, and prints the sum it found. It does not guess which party is wrong; that is for you to find in your own terms.

## Three more checks on the parties

Each party must be distinct and must hold a real share. Two parties with the same id are refused:

> parties[1].id must be an id no other party has; got "A"

A party with a share of zero is refused, because a party with no interest is no party to the venture:

> parties[0].participatingPct must be a number above 0 and at most 100; got 0

And a key the function does not read is refused wherever it sits. The participating interest is often called the working interest, and a spreadsheet may label its column `wi`. The engine reads only `id`, `name` and `participatingPct` for a party:

> parties[0].wi is not an accepted key; the accepted keys of parties[0] are id, name, participatingPct

Each message starts with the path to the input: `parties[0]` is the first party in the list, `parties[1]` the second. Counting starts at zero.

## Why the engine refuses and does not repair

An engine could quietly rescale 90 points to 100, or drop a key it did not recognise. Either would hand back a figure computed on terms nobody agreed. A joint operating agreement is precise about shares, so the engine is precise too: it computes on the terms you state or it tells you which term is wrong. The same rule runs through every function in this course.

## The whole, at the other end

The engine also returns totals. On the Ekene joint venture the beneficial interests total 100.000000 and so do the paying interests, with the carry or without it, because a carry moves cost between parties and never adds any. The two totals tiles under the interests table show both.

## Exercise

Open the account calculator and choose "Participating, paying and beneficial interests", starting from the Ekene joint venture. Change PB's `participatingPct` from 15 to 5 and run it; read the sum the refusal prints. Now raise EKO's `participatingPct` by 10 so the parties make up the whole again, run it, and read the new paying interests. Then give PA the same `id` as EKO and run it. Restore the start and write down the field each refusal named.
