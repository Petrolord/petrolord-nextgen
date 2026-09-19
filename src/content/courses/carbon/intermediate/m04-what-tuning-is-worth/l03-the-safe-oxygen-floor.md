# The safe oxygen floor

A lower stack oxygen gives a higher efficiency and a bigger saving, and the SECTION 14 sweep prints that for the invented Isiokpo heater. So the question every tuning faces is how low the target may go. The engine does not answer it. It asks for the answer, and this lesson reads how.

{{panel:carbon-efficiency-explorer}}

## A floor that is declared

SECTION 14 prints the Isiokpo tuning with a minimum safe stack oxygen of 2 percent, declared after a combustion test. The test and the figure are both invented for this course. Leave the box empty and the engine refuses, verbatim:

REFUSED: A minimum safe stack oxygen is required and is not defaulted. Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control.

The refusal gives its own reason. The point where a burner begins to make carbon monoxide depends on three things the refusal names: the burner, the fuel and the draught control. Module two's assumption said the same from the other side: "An oxygen reading alone cannot see carbon monoxide". The stack reading cannot find the floor, and the engine does not guess it, so the caller declares it.

In practice, a combustion test steps a burner down in excess air while measuring carbon monoxide, and the floor is the lowest oxygen at which the burner still burns cleanly.

## A target that is checked

The target is required too, and its refusal says why:

REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.

And the check is real. SECTION 14 prints the answer for a target of 1.5 percent against the 2 percent floor:

REFUSED: A target of 1.5 percent oxygen is below the 2 percent declared safe for this burner. Raise the target or re-declare the floor after a combustion test.

The refusal names both figures and offers two ways forward. Neither of them is to accept the target. SECTION 25 lists the rule among those in force: a target oxygen is required and checked against the declared floor.

## The sweep, every row at or above the floor

SECTION 14 prints the saving at four targets, every one at or above the declared floor:

| target O2 percent | target efficiency percent LHV | fuelSavingPercent | annualEnergySavedGJ |
| --- | --- | --- | --- |
| 2.0 | 88.1965 | 2.0336 | 8337.934 |
| 2.8 | 87.8476 | 1.6445 | 6742.370 |
| 3.5 | 87.5160 | 1.2718 | 5214.422 |
| 4.5 | 86.9933 | 0.6786 | 2782.362 |

Every row starts from the same current state, 5.5 percent oxygen and 86.4029 percent on LHV, with 410000 GJ of fuel a year. The row at 2.0 percent sits on the floor itself and prints the largest saving in the table, 8337.934 GJ a year. The course's case, 2.8 percent, prints 6742.370 GJ a year.

The table stops at the floor. The engine prints no saving for a target below 2 percent at this burner, because it refuses to compute one. Whatever such a target might appear to be worth, it is a figure the engine will not produce until the floor is re-declared after a combustion test.

## Exercise

Read the sweep table and the refusal for a target of 1.5 percent in SECTION 14. Say which target in the sweep sits on the declared floor and what it saves, what the engine answers when a target is set below that floor, and which two actions the refusal offers the caller.
