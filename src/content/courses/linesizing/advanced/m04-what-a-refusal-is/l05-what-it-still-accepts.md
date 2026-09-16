# What it still accepts

Two things in this chain return an answer where a refusal would serve a reader better. Neither is a number this course grades, and neither can be fixed by adding a guard.

{{panel:fc-wall-pig-explorer}}

## One question, five catalogues, three answers

Ask each lookup table for an entry it does not carry.

| the lookup | what it returns for an unknown id |
| --- | --- |
| fittingK | NaN |
| roughnessOf | NaN |
| gradeYield | NaN |
| scheduleRow | null |
| erosionalC | {"id":"continuous","label":"RP 14E continuous service","c":100} |

Four of the five say they do not know. They say it in two different spellings, which is untidy, and both spellings are unmistakably an absence.

The fifth answers. Asked for a service the table does not carry, erosionalC returns the first row, which is continuous service at a c factor of 100.000000.

## What that return does and does not do

Be exact about the failure. The object is internally consistent and it is correctly labelled: it says continuous service, under that name, at that c factor. It is not a corrupted row and it is not a wrong number.

What it is not is the service that was asked for. A caller who passes an unrecognised service and reads only the c factor has silently been given a different service's figure, and the only thing that reveals the substitution is the label riding alongside. A caller who reads the label sees immediately that the answer does not match the question.

## Why it was left alone

This one is left as it stands, and the reason is ownership rather than difficulty. The RP 14E table belongs to the wellhead engine that two other studios read, so changing what an unknown service returns is a decision for that table rather than for this line-sizing chain. Changing it here would fix one caller and change the behaviour of two applications that never asked.

## The second one is not a guard problem at all

The rating over-rates a line whenever the caller drops the corrosion allowance, because the allowance is an argument of the rating call rather than a property of the pipe. The same wall reads 1019.607843 psig with the allowance and 1529.411765 psig without it, 1.500000 times the rating with the allowance, and that factor is the gross wall over the net rather than anything about this pipe.

What moved is a magnitude. No verdict flipped and nothing was miscounted. Both calls are legal, both are correct for what they were asked, and neither warns.

A guard cannot fix a question that was fully formed and simply wrong. Only a caller who knows which of the two questions they meant to ask can fix that.

## The mistake

The mistake is reading a catalogue return without checking the id that came back against the id that went in. Four of the five lookups make that unnecessary. The fifth makes it essential.

The second mistake is expecting guards to be a complete defence. Guards catch malformed input, and the two cases here are a well-formed question answered under the wrong label and a well-formed question that was the wrong question.

## Exercise

Give what each of the five catalogues returns for an id it does not carry, and say which one differs and how a caller could detect it. Then explain why that one is left as it stands, and state exactly what changes when a rating is called without its corrosion allowance.
