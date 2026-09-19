# The severity rate has no single standard

{{panel:ss-rates-explorer}}

UGHELLI lost 96 days to injury in 2318640 hours. On the 200,000 hour base the engine's severity rate is 8.280716. On the 1,000,000 hour base it is 41.403581. Beside both, the engine prints the same note: "no ANSI Z16.1 time charges are added; days are as counted by the caller".

| base | days lost | severity rate | the engine note |
| --- | --- | --- | --- |
| 200000 | 96 | 8.280716 | no ANSI Z16.1 time charges are added; days are as counted by the caller |
| 1000000 | 96 | 41.403581 | no ANSI Z16.1 time charges are added; days are as counted by the caller |

A severity rate is days lost times a base over the hours worked. The engine's formula reads daysLost x base / exposureHours. It has the same shape as an incidence rate, with days in the place of cases.

## Two conventions

There is no single standard for this number. The OSHA style convention puts days lost over the hours on the 200,000 hour base. The ANSI Z16.1 convention used the 1,000,000 hour base and added scheduled time charges: fixed numbers of days charged for a fatality or a permanent disability, whatever time was actually lost. The two conventions give different numbers from the same record, and neither is a correction of the other.

The engine takes days lost and a base, and adds no time charges. That is why the note sits beside every result. A reader comparing an engine severity rate with one computed under ANSI Z16.1 would see a gap and could not tell where it came from without the note. The note says where.

## Why the base is required here too

The severity rate needs a base for the same reason the recordable rate does. The two common bases differ by a factor of five, so UGHELLI's 8.280716 and 41.403581 describe the same 96 days. The engine will not guess. A call with no base is refused with the same message an incidence rate gets:

> base is required: name the base (200,000 for OSHA/BLS, 1,000,000 for IOGP, 100,000,000 for FAR); there is no default

And a negative number of days is refused too:

> daysLost must be a finite number of days, zero or more

## Fractional days are allowed

The count in an incidence rate must be a whole number. Days lost need not be. The golden case on the million hour base passes 45.5 days in 1830000 hours and the engine returns 24.863388, matching the golden with a relative difference of 0. A half day away is a real thing that can be recorded, so the engine accepts it. The other golden case puts 312 days over 400000 hours on the OSHA base and returns 156.000000.

| golden case | days | hours | base | severity rate |
| --- | --- | --- | --- | --- |
| OSHA base | 312 | 400000 | 200000 | 156.000000 |
| million base | 45.5 | 1830000 | 1000000 | 24.863388 |

## Reading a severity rate

A severity rate says how many days of work were lost for each block of hours worked. It rises when injuries are more serious or more frequent, and it cannot say which. UGHELLI's 8.280716 per 200,000 hours could come from a few long absences or many short ones. Whoever reports it should say which convention was used, which base, and whether any time charges were added, because each of those changes the number.

## Exercise

Multiply UGHELLI's 96 days by 200,000 and divide by 2318640 hours, and check you reach 8.280716. Then multiply that result by 5 and compare with 41.403581. Finally, open the rates explorer and compute the second golden case, 45.5 days in 1830000 hours on the million hour base, and confirm the engine accepts the half day and returns 24.863388.
