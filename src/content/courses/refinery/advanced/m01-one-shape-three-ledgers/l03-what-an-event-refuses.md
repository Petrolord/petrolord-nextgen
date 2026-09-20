# What an event refuses

A ledger is only as trustworthy as the events it will accept. makeEvent refuses three kinds of input, each with its own message. This lesson reads each refusal and what it protects.

{{panel:refinery-variance-explorer}}

## Three refusals

| event | what the engine returns |
| --- | --- |
| a quantity of -500 | REFUSED: "Event quantity is unsigned; direction comes from the event type" |
| a ledger called forecast | REFUSED: "Unknown ledger "forecast"" |
| an event type called sale | REFUSED: "Unknown event type "sale"" |

## A negative quantity

The first refusal follows from the rule of the previous lesson. The quantity is unsigned and the type carries the direction. A quantity of -500 would make the sign say something twice, once through the number and once through the type, and the two could disagree. A delivery of -500 might mean a delivery reversed, a receipt typed in the wrong box, or a keying slip. The engine does not guess which. It refuses and says where direction comes from, so the user types the size and chooses the type that carries the direction they meant.

## A ledger the model does not know

The stream model knows three ledgers: plan, schedule and actual. A ledger called forecast is refused by name. A forecast may be a useful document, but an event marked with a ledger the variance cannot place would sit outside every comparison the engine makes. The refusal names the ledger it did not recognise, so the user can see the word that caused it.

## An event type the model does not know

The same holds for the nine event types. A sale is a real commercial act, and in this model it is a delivery with a value that is what it sold for. An event type called sale is refused by name. Accepting it would create a movement whose direction the engine cannot set, since direction comes from the type, and whose value it cannot place on the cost side or the revenue side.

## What a refusal is worth to a variance

Every refusal here stops a bad event at the door, before it reaches a ledger. The alternative is an event that is accepted and then read wrongly: a negative quantity signed twice, a forecast event matched against nothing, a sale counted on neither side of the margin. Each of those would change a variance line without any message at all. A refusal is loud at the moment the input is typed, and a wrong line is silent at the moment it is read.

The engine also treats a missing cost carefully without refusing it. An event with no cost is accepted with cost null, and the line it feeds reads costed false. Missing money is allowed into the ledger and flagged. An impossible event is kept out.

## Exercise

Read the three refusals. For each one, say which rule of the stream model the input broke, and which part of the refusal tells the user what to change. Then compare the refusal of a quantity of -500 with the treatment of an event recorded with no cost, and say why the engine refuses one and flags the other.
