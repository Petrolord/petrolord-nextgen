# The Hydraulic Institute correction

A catalogue curve is a water curve. The vendor tested the machine on water, and a liquid that is not water will not give those numbers. The correction this package carries is empirical, and knowing that is part of knowing how to use it.

{{panel:fc-suction-explorer}}

## The correction on the OKONO best efficiency point

The best efficiency point is 1150.000000 gpm at 430.000000 ft, running at 1780.000000 rpm.

| viscosity cSt | B | flow factor | head factor | efficiency factor | corrected flow gpm | corrected head ft |
| --- | --- | --- | --- | --- | --- | --- |
| 1.000000 | 0.425703013 | 1.000000000 | 1.000000000 | 1.000000000 | 1150.000000 | 430.000000 |
| 5.000000 | 0.951900876 | 1.000000000 | 1.000000000 | 1.000000000 | 1150.000000 | 430.000000 |
| 20.000000 | 1.903801752 | 0.997024668 | 0.997024668 | 0.946562979 | 1146.578368 | 428.720607 |
| 60.000000 | 3.297481363 | 0.979412912 | 0.979412912 | 0.861851087 | 1126.324848 | 421.147552 |
| 100.000000 | 4.257030134 | 0.962401519 | 0.962401519 | 0.806312723 | 1106.761747 | 413.832653 |
| 320.000000 | 7.615207009 | 0.894963166 | 0.894963166 | 0.637190119 | 1029.207641 | 384.834161 |
| 850.000000 | 12.411268963 | 0.803437333 | 0.803437333 | 0.456934987 | 923.952933 | 345.478053 |
| 2400.000000 | 20.855103295 | 0.673754678 | 0.673754678 | 0.258885372 | 774.817880 | 289.714512 |
| 9000.000000 | 40.385733873 | 0.479919881 | 0.479919881 | 0.074570011 | 551.907863 | 206.365549 |

B is the correlating parameter. The three factors multiply the water figures, and the corrected flow and head are what comes out.

## What B is, and where the correction is applied

B is the correlating parameter of the method. It is what says how far from water the fluid is, and every factor on the row is read against it.

The correction is applied at the best efficiency point. The head factor is taken equal to the flow factor there, which is a simplification of the standard and one of the reasons the whole method is held rather than relied on.

## Three factors, three separate answers

The three factors are read separately because they answer separate questions. At 320.000000 cSt the flow factor is 0.894963166, the head factor is 0.894963166 and the efficiency factor is 0.637190119. At 850.000000 cSt they are 0.803437333, 0.803437333 and 0.456934987.

The efficiency factor is the one that decides a driver, so a viscous service is a power question as well as a capacity question, and the engine says as much at 850.000000 cSt:

"the efficiency correction is 45.7 percent: a centrifugal pump is a poor choice for a fluid this viscous"

## The published cases

Two viscosity cases are published against this correlation. At 100.000000 cSt and 3560.000000 rpm, B is 3.168144586, the flow factor 0.981490716 and the efficiency factor 0.869554532. At 500.000000 cSt and 1780.000000 rpm, B is 10.397220821, the flow factor 0.840335810 and the efficiency factor 0.524972745. The engine matches both.

Matching them establishes that the arithmetic is the arithmetic those cases describe. It does not establish that the correlation describes a real pump, because the cases were written by an oracle rather than measured on one.

## Held for the literature

The whole correction is held. B, the flow factor, the head factor and the efficiency factor are an empirical correlation with no publication in this repository, and the head factor is taken equal to the flow factor at best efficiency, which is a further simplification of the standard. No graded value in this course is a corrected flow, head or efficiency.

## The mistake

The mistake is quoting a catalogue duty for a viscous service. At 320.000000 cSt this machine's corrected best efficiency flow is 1029.207641 gpm and the catalogue figure is 1150.000000 gpm.

The second mistake is correcting the flow and the head and leaving the efficiency at its water value. The corrected capacity then looks survivable and the power behind it is wrong.

## Exercise

Give B, the three factors and the corrected flow and head at 60.000000 cSt and at 850.000000 cSt. Then quote the warning at 850.000000 cSt, and say what the two published viscosity cases do and do not establish about the correlation.
