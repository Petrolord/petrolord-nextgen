# A spec more trays cannot reach

Ask the engine for the stage count that meets a removal a starved column can never reach, and it declines. What comes back is worth studying in its own right, because a good refusal is a piece of engineering advice and a bad one is a dead end.

## The refusal

At an absorption factor of 0.800000 a removal of 0.900000 comes back as an object carrying an error string:

| asked for | what comes back |
| --- | --- |
| A = 0.800000, removal 0.900000 | { error: "an absorption factor of 0.8 caps the removal at 0.8 however many stages are added, and the spec asks for 0.9: no stage count reaches it; raise circulation" } |

{{panel:fc-absorber-explorer}}

## Four things in one sentence

Read that message slowly, because it is doing four separate jobs. It names the factor it was handed. It names the ceiling that factor implies. It names the spec that was asked for, so the two can be compared without going back to the input form. And it names the remedy, which is more solvent rather than more trays.

The last of those is the part a stage count could never have carried. An engine that returned some very large number here would be technically defensible and practically useless, because the reader would go and price a great many trays for a spec that height cannot buy.

## Why this is the right place to refuse

The alternative designs are all worse. Returning nothing leaves the caller guessing. Returning a huge stage count invites the wrong purchase. Returning the ceiling instead of the spec silently answers a question nobody asked, and that is the failure mode this programme has seen most often.

Declining, with the evidence attached, leaves the decision where it belongs. The user now knows that the column as specified cannot do the job, knows why, and knows which dial to move. Nothing about the shape of that answer is particular to absorption. A state this method has no answer for comes back as an object carrying an error string, and this module throws nothing at a caller.

## Where the spec comes from

One thing the refusal cannot tell you is whether the spec is negotiable. A removal of 0.900000 might be a pipeline contract, a plant heat balance, or a round number somebody wrote in a specification years ago. The engine treats it as given, and so should any reading of the answer.

That is the honest division of work here. The relation says what is reachable. The contract says what is required. When those two disagree the engine reports the disagreement and hands it straight back, and the next module is about the other dial, where more solvent actually comes from.

## Exercise

Record the absorption factor, the ceiling and the spec in the refusal above. Then name the remedy the message gives, and say what a very large stage count would have cost a reader who took it at face value.
