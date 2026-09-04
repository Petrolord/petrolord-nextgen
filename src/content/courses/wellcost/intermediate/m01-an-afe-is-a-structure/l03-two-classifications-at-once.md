# Two classifications at once

Every line answers two separate questions, and confusing them is the most common way an AFE goes quietly wrong.

{{panel:wc-afe-explorer}}

## The two questions

The first question is **how does this line bill**. That is the basis, and the engine allows exactly three: `per-day`, `per-meter` and `lump`. The basis decides what the amount is multiplied by.

The second question is **what kind of spend is this**. That is the category, and the engine allows exactly two: `tangible` and `intangible`. The category decides nothing about the arithmetic. It only decides which subtotal the amount lands in.

Ask them in the wrong order and you get sentences like "casing is a lump cost so it must be tangible", which happens to be true on this AFE and is not a rule.

## They are independent

Look at the golden's own eight lines and the independence is visible inside a single basis.

| Basis | Tangible lines | Intangible lines |
| --- | --- | --- |
| per-day | none | Rig dayrate, Integrated services spread |
| per-meter | none | Mud and consumables |
| lump | Casing and accessories, Wellhead | Cementing, Wireline logging, Completion services |

Five lump lines, and two of them are tangible while three are intangible. The basis did not decide it. Something else did, and that something is the subject of the third module.

## What each classification drives

The basis drives the money. Per-day lines total 2,880,000 USD on this well, per-metre lines 450,000 USD, and lump lines 2,050,000 USD, adding to the 5,380,000 USD base.

The category drives the split. Tangible comes to 1,050,000 USD and intangible to 4,330,000 USD, and the same 5,380,000 USD base falls out. Two different partitions of one set of lines, cut along different seams.

## Where the engine holds you to it

Both fields are validated. A category the engine does not recognise raises an error naming the line, and so does a basis it does not recognise. There is no default and no silent fallback, because a mis-typed basis would produce a plausible-looking number rather than a visible failure.

That strictness is worth having. A line with an unrecognised category would fall into neither subtotal while still sitting in the item list, so the base would under-count by exactly that line and nothing on the page would say so.

## Exercise

Take any three lines in the panel and write their basis and their category as two independent labels, without letting one suggest the other.

Then invent a line that would be per-day and tangible, and say why real AFEs carry very few of them.
