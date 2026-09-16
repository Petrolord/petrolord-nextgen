# Reading the rating back

Sizing a wall and rating a wall are one relation read in opposite directions. One way a design pressure gives a thickness. The other way a thickness gives a maximum allowable operating pressure, and the second direction is where a real pipe gets judged.

{{panel:fc-wall-pig-explorer}}

## The round trip closes

Every wall this module sizes reads back to the pressure it was sized for. All five SOKU rows return 1200.000000 psig, and each of the four published cases returns its own design pressure: 1440.000000, 1000.000000, 1000.000000 and 720.000000 psig.

That check is worth running and it is not evidence about the code. It says the two directions are consistent with each other, which is a statement about arithmetic. Whether 0.720000 is the right factor for the route is a separate question, and no round trip can reach it.

## The wall the mill actually rolled

A design asks for 0.419231 in at Class 3. Pipe is not sold in arbitrary thicknesses, so the mill rolls something standard and the line is built from what was rolled. Rating the pipe as built is therefore the honest question, and on 0.375000 in of wall at Class 3 it has two answers.

| the call | MAOP psig |
| --- | --- |
| with the allowance respected | 1019.607843 |
| with the allowance left out | 1529.411765 |

The second figure is 1.500000 times the first, and that factor is the gross wall over the net rather than anything about this pipe.

Note also that 1019.607843 psig sits below the 1200.000000 psig the design asked for. The rating is reporting, in the only way it can, that 0.375000 in is thinner than the 0.419231 in Class 3 demanded.

## Both calls are legal and neither warns

The allowance is an argument of the rating call rather than a property of the pipe, so the caller chooses whether to respect it. Both calls are correct for what they were asked, and neither raises anything at all.

That is the difference between a guard and a design question. A guard catches an input with no meaning. Here both inputs are meaningful and fully formed, and the wrong one was simply chosen.

## The mistake

The mistake is rating a line on the wall it was designed to have. The design wall is a requirement and the rolled wall is a fact, and the two separate the moment the mill rounds.

The second mistake is dropping the allowance to make a rating look better. 1529.411765 psig is a real answer to a question about gross steel, and quoting it as the MAOP of a line that will corrode describes the pipe as it will never be again after its first year in service.

## Exercise

Say what the round trip proves and what it leaves open. Then give the MAOP of 0.375000 in of wall at Class 3 with the allowance respected and with it left out, give the multiple between them, and explain why neither call warns.
