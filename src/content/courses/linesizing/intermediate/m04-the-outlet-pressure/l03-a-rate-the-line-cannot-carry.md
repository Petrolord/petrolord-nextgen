# A rate the line cannot carry

Ask the trunk for more than it can deliver and the engine returns { error: "the line cannot carry the target rate even to atmospheric outlet" }. It does not return the floor of its own bracket.

{{panel:fc-gasline-explorer}}

## Large and impossible are different

| asked for | what comes back |
| --- | --- |
| 60000000.0000 scfd | 666.307057 psia, a drop of 183.692943 psi |
| a rate beyond the line | { error: "the line cannot carry the target rate even to atmospheric outlet" } |

The first row is a demanding duty. Sixty million standard cubic feet a day costs the trunk 183.692943 psi, which is a large fraction of what it has, and the answer is an ordinary pressure. The second row is not a harder version of the first. It is a question with no answer inside the range the method covers.

## The floor is what makes it decidable

The bracket runs from atmospheric up to the ceiling. The solver can therefore ask a question the forward direction cannot: what is the most this line will pass. That is the rate at the floor, with the outlet dumped to atmosphere, and on this trunk it can be measured rather than described. Push the rate up and the largest the trunk accepts is 96619638.0494 scfd, where the solve converges on an outlet of 14.700000 psia. One scfd beyond that is refused. Any target above that rate needs an outlet below atmospheric, which is not a pressure this method will produce.

So the refusal is a real finding rather than a failure of the search. The solver went to the bottom of its range, found the line still short, and said so.

## Why the floor is not returned as the answer

Returning 14.700000 psia would be the most dangerous possible response. It is a valid pressure, it would pass any check that tests whether a number came back, and it would flow into a sizing sweep as though the line delivered the contracted rate at atmospheric outlet. The distance between that and the truth is the entire finding.

The same reasoning rules out returning the closest achievable rate. A caller who asked what pressure a contracted rate arrives at has not asked what rate is achievable, and quietly answering the second question is how a report comes to contain a figure nobody requested.

## What the message actually claims

It claims something narrow, and the wording carries the condition: this line, at this inlet, with these conditions, cannot reach the target even with the outlet at atmosphere. It does not name a cause and it does not recommend a fix. A larger bore, a higher inlet pressure or a lower target are all different questions, and each has to be asked of the engine separately. Reading a cause into the message is how a refusal about a duty quietly becomes a decision about a pipe.

## The mistake

The mistake is catching the refusal and substituting the maximum the line will carry, which turns a question about a contract into a question about a capacity without telling the reader.

The second mistake is reading the refusal as a statement that the bore is wrong. The inlet and the duty are in the message's conditions just as much as the pipe is.

## Exercise

Give the outlet and the drop when the trunk is asked for 60000000.0000 scfd, and the refusal it returns for a rate beyond its reach. State the floor of the bracket and explain what the floor makes it possible to decide. Then say why returning that floor as the outlet would be worse than refusing.
