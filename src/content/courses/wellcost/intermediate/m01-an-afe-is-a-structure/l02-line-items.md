# Line items

A cost line is a very short object, and most of what people assume is on it is not on it.

{{panel:wc-afe-explorer}}

## What a line carries

Every line on the golden AFE carries four things and one amount. It has an identifier, a label a human can read, a **basis** saying how it bills, and a **category** saying what kind of spend it is. Then it carries the money, as a `rate` for a per-day or a per-metre line and as a `value` for a lump line.

A lump line may also carry `atActivityId`, naming the activity it lands on. That link does not change the amount. It only tells the cost-time curve when the step appears.

| Line | Basis | Carries |
| --- | --- | --- |
| Rig dayrate | per-day | rate 100,000 |
| Mud and consumables | per-meter | rate 150 |
| Wellhead | lump | value 250,000, at a3 |

## What a line does not carry

A line has no duration of its own. The rig dayrate line does not know the well takes 18 days. It knows 100,000 per day, and the day count arrives from outside.

A line has no depth of its own either. The mud line does not know the well drills 3,000 m. It knows 150 per metre.

A line has no vendor, no contract reference, no date and no currency field. It has no uncertainty attached to it, and it carries no contingency of its own. Contingency is applied once to the whole base, not line by line.

## Why the emptiness is deliberate

Because a line holds only a rate, one line can be priced against any schedule you hand it. That is what makes the AFE re-pricable. Change the days and every per-day line re-prices at once, with nothing edited.

If each line stored its own day count you would have eighteen places to update and eighteen chances to miss one. The engine refuses that design. It takes `totalDays` and `drilledM` once, as arguments to `afeCosts`, and applies them across the whole item list.

The result of that discipline is that the golden's 1,800,000 USD rig line is not a number somebody typed. It is 100,000 multiplied by 18, computed at the moment you asked.

## Exercise

In the panel, find a line that carries a rate and a line that carries a value, and say which of the two would change if the well took one day longer.

Then list three facts about a real contract that the line does not store, and say where each of them would have to live instead.
