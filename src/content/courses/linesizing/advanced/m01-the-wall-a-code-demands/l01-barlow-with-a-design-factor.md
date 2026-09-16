# Barlow with a design factor

Nothing in this module is a pressure drop. A wall is sized by the pressure the line has to hold, and the code decides how much of the steel's yield it is willing to spend holding it.

{{panel:fc-wall-pig-explorer}}

## The form, and where the factors sit

Barlow gives the pressure-carrying wall from the design pressure and the outside diameter, over twice the specified minimum yield. The code then enters three more times in that denominator beside the yield: the design factor, the longitudinal joint factor and the temperature derate.

None of those three is a property of the steel. Each is a statement about how much confidence the code places in the steel, in the seam that joins it, and in both when hot. Because all three divide, every one of them thickens the wall as it falls.

## The SOKU wall

1200.000000 psig of design pressure on 12.750000 in of outside diameter at a specified minimum yield of 52000.000000 psi, with a joint factor of 1.000000, a temperature derate of 1.000000 and a corrosion allowance of 0.125000 in.

| code | class | design factor | pressure wall in | required wall in |
| --- | --- | --- | --- | --- |
| B31.8 | 1 | 0.720000 | 0.204327 | 0.329327 |
| B31.8 | 3 | 0.500000 | 0.294231 | 0.419231 |

Two walls come out of one call and they answer different questions. The pressure wall is the steel that holds the design pressure. The required wall is the steel somebody orders, which is the pressure wall with the corrosion allowance added on top.

## Read the published case

B31.4 Class 1 at 1440.000000 psig on 12.750000 in at 52000.000000 psi, joint 1.000000, derate 1.000000 and an allowance of 0.000000 in, gives a design factor of 0.720000 and a required wall of 0.2451923077 in. The rating read back off that wall returns 1440.000000 psig.

With no allowance the pressure wall and the required wall are the same number, which is why this case round trips so cleanly. Add an allowance and the two separate.

## What the call refuses

A wall call with no design pressure has nothing to size from and says so: "wall thickness needs positive design pressure, OD and SMYS". The engine is naming the three inputs Barlow cannot proceed without, and it names all three rather than only the one that was missing.

## The mistake

The mistake is quoting the required wall as the pressure-carrying wall. On SOKU at Class 3 that reports the steel doing structural work as 0.419231 in when it is 0.294231 in, and it will survive every review that does not ask which of the two numbers was handed over.

The second mistake is reading the specified minimum yield as a stress the pipe will see. It is the floor the mill guarantees, and the design factor is what keeps the working stress well under it.

## Exercise

Give the SOKU pressure wall and required wall at Class 1 and at Class 3, and say what separates the two figures. Then state where the design factor, the joint factor and the temperature derate sit in the form, and give the required wall and the MAOP read back for the published B31.4 case at 1440.000000 psig.
