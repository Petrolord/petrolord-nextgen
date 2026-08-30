# Reading a stroke verdict

A boolean, a null, and what each of them is saying.

{{panel:ct-tubing-explorer}}

## The three possible values

    strokeOk = null   when no stroke was specified
    strokeOk = true   when the absolute total length change is at most the stroke
    strokeOk = false  when it is not

## The null is not a pass

    strokeM <= 0 ? null : Math.abs(totalDL) <= strokeM

A completion run without a stroke figure gets null, and null is the honest answer: nobody told the engine what the seal assembly allows, so it will not guess.

Any code downstream that treats null as truthy has converted a missing input into a pass. That is the classic shape of a silent design error, and it is why the engine uses three values rather than two.

## The absolute value

Both directions count. A string that shortens past the bottom of the seal bore has pulled out of the packer, and a string that lengthens past the top has done the same at the other end.

Both are a lost seal, and the consequence is annulus communication rather than a broken string.

## The three verdicts

| case | length (m) | stroke (m) | verdict |
|---|---|---|---|
| production heating | 0.8947604591459051 | 1.5 | true |
| injection cooling | -1.81047908170819 | 1.5 | false |
| stimulation | -3.3451361131262445 | 1.5 | false |

Two of the three published operating cases stroke this completion out.

## What that means in practice

It does not mean the well cannot be injected into or stimulated. It means this seal assembly is too short for those operations, and the answer is a longer one or a different packer, not a heavier tubing.

Which is worth saying plainly, because the instinct on seeing a completion fail two of three cases is to change the tubing, and the tubing is not the problem.

## The two limits are independent

Production heating passes stroke and buckles. Injection cooling fails stroke and does not buckle.

There is no ordering between the two. A completion can fail either, both or neither, and knowing one tells you nothing about the other.

## What is missing from the verdict

Where in the stroke the string was SITTING when the packer was set. A seal assembly with 1.5 m of travel that was landed at the very bottom of its bore has 1.5 m of up travel and none down.

The engine compares against the total travel as though the string were landed in the middle. A real space-out is an explicit decision and it should be one of the inputs.

## Exercise

Suppose the string were landed with 0.4 m of down travel and 1.1 m of up travel available.

Re-read the three verdicts against those two asymmetric limits and say which of the three changes.
