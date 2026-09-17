# The specific heat ratio, swept

The specific heat ratio is the one property of the gas in the expansibility
calculation that most people take from a handbook and never look at again. This
lesson asks what it is doing there.

## What the columns are

The expansibility sweep from the previous lesson carries five columns, at
specific heat ratios of 1.1, 1.2, 1.3, 1.4 and 1.66. Those five are not
arbitrary. A heavy hydrocarbon gas sits low in that range, air and the common
diatomic gases sit near the middle, and a monatomic gas such as argon or helium
sits at the top. The ABOH gas was stated at a specific heat ratio of 1.270000,
which lands on none of the five columns exactly.

Reading across a row of that table is asking one question: if this were a
different gas at the same pressure ratio, what would the expansibility be? The
span the digest computed across the whole table is the only comparison available
on it:

   largest, at dP/P1 0.001000 and k 1.66                      0.999779
   smallest, at dP/P1 0.250000 and k 1.1                      0.915403
   difference (first less second)                      0.084375
   ratio (first over second)                           1.092173

Notice that those two cells differ in both coordinates. It is a span across the
table rather than a statement about the specific heat ratio on its own, and it
may not be quoted as one.

## Why the value you type matters

The specific heat ratio is a stated input here. Nothing in this module derives it
from a composition, a pressure or a temperature, so whatever you type is what
the expansibility is computed with. For a gas whose composition moves, which is
most produced gas, the figure on the datasheet was true of one sample on one day.

That is not an argument for agonising over it on every run. It is an argument
for knowing which side of your calculation it lands on, and for writing the
value you used on the calculation sheet next to the flow. When a meter's readings
are challenged, the reviewer's first question is what fluid properties were
assumed, and the second is where they came from.

## The habit this module is teaching

Every input on the ABOH sheet is either stated or returned. The specific heat
ratio of 1.270000 is stated. The expansibility of 0.999181 is returned. The
distinction survives into every report you write, because a stated figure is
something you are answerable for and a returned figure is something the engine
is answerable for.

## Exercise

Take the ABOH specific heat ratio of 1.270000 and the row of the table at a
pressure ratio of 0.250000. Say between which two printed values the
expansibility for that gas would fall, and say why the table cannot give you the
figure exactly.
