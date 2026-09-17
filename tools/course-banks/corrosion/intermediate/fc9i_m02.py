import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC9 Professional m02, efficiency against availability.
# Every figure is from digest Section 9 at the rendering that section prints,
# with the shipped studio case from Section 19. This is the one part of the
# engine with no correlation constant in the chain, so the arithmetic here is
# fair game where a correlation rate never is.

q(1, "A corrosion inhibitor runs at 95.000000 percent efficiency and 80.000000 percent availability. What is the effective protection?",
 "76.000000 percent.",
 ["95.000000 percent, because the efficiency is the property of the chemical.",
  "80.000000 percent, because availability is the limit and it caps the answer.",
  "The average of the efficiency and the availability, as a percentage."],
 "The uninhibited rate applies for the fraction of the time the chemical is off the wall, so the two percentages combine rather than one of them winning. The engine takes them as separate inputs for exactly this reason.")

q(2, "By how many percentage points does that same row fall short of the datasheet figure?",
 "19.000000 percentage points.",
 ["0.100000 percentage points, which is where the engine's warning first fires at any efficiency.",
  "4.800000 percentage points.",
  "15.250000 points."],
 "The datasheet figure is the efficiency, so the shortfall is the efficiency less the effective protection. The metal loss ratio on that same row is a separate field and it is 4.800000 times the datasheet number.")

q(0, "One row shows an effective protection of 76.000000 percent. By what factor does its metal loss exceed the datasheet number?",
 "4.800000 times it.",
 ["1.950000 times it, which is what the 95 percent availability row carries.",
  "1.380000 times it, which is what the engine reports two percentage points higher up.",
  "19.000000 times it, the same figure the shortfall column carries on that row."],
 "What survives the corrosion inhibitor is the small remainder, and it is the remainder that sets the loss. That is why the loss column grows faster than the protection column falls.")

q(3, "Which input limits the result on the 80.000000 percent availability row, in the engine's own words?",
 "Availability limits it and efficiency does not, once the chemical is good.",
 ["Efficiency limits it, because the datasheet figure sets the ceiling on protection.",
  "The two limit it equally, since the protection is their product.",
  "Neither limits it, because the corrosion inhibitor credit is removed at that shortfall."],
 "The engine's own warning on that case reads that a 95 percent inhibitor at 80 percent availability gives 76.0 percent effective protection, which is 4.80 times the metal loss of the datasheet number, and it names availability as what limits it. Those are the engine's words and they are quoted verbatim in the digest.")

q(2, "Against what does the metal loss ratio compare?",
 "Against the datasheet row, which is the same chemical at one hundred percent availability.",
 ["Against an uninhibited line carrying no corrosion inhibitor programme at all.",
  "Against the corrosion allowance the reader typed into the screen.",
  "Against the rate the same line would show one band label lower."],
 "A ratio of 1.000000 means the programme delivered what the container promised. It says nothing about how fast the wall is going away, because a line can sit at 1.000000 and still lose metal quickly.")

q(1, "At 95.000000 percent efficiency, which availability row carries a metal loss of 15.250000 times the datasheet number?",
 "25.000000 percent.",
 ["50.000000 percent, where the shortfall equals the protection.",
  "70.000000 percent, which is the lowest row the engine will accept.",
  "90.000000 percent, which is the shipped availability on the studio case."],
 "At 50.000000 percent availability the effective protection is 47.500000 percent and the loss is 10.500000 times the datasheet number. Keep going down the column and the effect compounds, reaching 15.250000 times at 25.000000 percent.")

q(3, "On which availability row is the datasheet figure the number the wall actually sees?",
 "At 100.000000 percent, where the shortfall is 0.000000 percentage points.",
 ["At 95.000000 percent, which is the availability the studio ships with.",
  "At 98.000000 percent, where the shortfall rounds to nothing worth reporting.",
  "On every row, since the datasheet figure is the efficiency and the efficiency never moved."],
 "That row also requires the chemical to be present every hour of the year, with no shutdown and no empty tank, so treating the datasheet figure as the protection treats an unreachable case as the base case.")

q(0, "The studio ships with a corrosion inhibitor at 90 percent efficiency and 95 percent availability. What does it deliver?",
 "85.500000 percent effective protection, a shortfall of 4.500000 percentage points.",
 ["90.000000 percent effective protection, with no shortfall reported anywhere on the screen.",
  "95.000000 percent effective protection, taken from the availability figure.",
  "76.000000 percent effective protection, with a shortfall of 19.000000 points."],
 "A reader who takes 90 percent off the datasheet and stops has overstated the protection by those 4.500000 percentage points on the first case the app ever shows them, and the warning is present on that screen.")

q(2, "Type an efficiency of 100 percent with an availability of 95.000000 percent. What comes back?",
 "An effective protection of 95.000000 percent, with no clamp and no hidden ceiling.",
 ["A refusal, because no corrosion inhibitor removes all of the metal loss.",
  "An effective protection of 100.000000 percent, the efficiency being taken as typed.",
  "An effective protection clamped by a hidden ceiling belonging to the engine itself."],
 "When the chemical removes everything while it is on, the time average has to give exactly the availability. The engine computes it and annotates it rather than refusing it.")

q(1, "What does the engine add beside an effective protection computed from a typed 100 percent efficiency?",
 "A note saying the figure is the arithmetic of the number typed in and is not a prediction.",
 ["A clamp message recording that the efficiency was moved down from the figure typed in.",
  "A refusal to issue a remaining life from a rate reached that way.",
  "Nothing, because the arithmetic is correct and needs no annotation."],
 "The engine's own note goes on to say that no inhibitor removes all metal loss while it is on. It draws the line between a calculation, which is correct here, and a claim about a chemical, which it is not.")

q(0, "A corrosion inhibitor efficiency of -5.000000 percent with an availability of 90.000000 percent. What does the engine do?",
 "It clamps the efficiency to zero, returns 0.000000 percent protection and names the clamp.",
 ["It returns a negative effective protection, since the chemical is then being modelled as an accelerant.",
  "It refuses, because a negative percentage cannot be a corrosion inhibitor efficiency.",
  "It clamps the availability instead and returns 90.000000 percent protection."],
 "Nothing in this module models an accelerant, so inventing that behaviour from a typing mistake would be a claim with nothing behind it. Zero is the nearest value the model can stand behind and the move is declared.")

q(3, "An efficiency of 120.000000 at 90.000000 percent availability, and an efficiency of 90.000000 at 130.000000 percent availability, both return 90.000000 percent effective protection. How does a reader tell the two cases apart?",
 "By the clamp message, which names the input that was moved and the value it was moved from.",
 ["By the shortfall, which differs between the two because a different input was clamped.",
  "By the metal loss ratio, which the engine reports only on the second of the two.",
  "They cannot be told apart, because the engine reports no clamps for either case."],
 "Two different mistakes reach one identical protection figure. Without the declaration they would produce one identical screen, which is why the clamps come back on the screening in a field of their own rather than in a paragraph.")

q(1, "The corrosion inhibitor warning fires on the effective shortfall. What is the trigger?",
 "0.100000 percentage points of shortfall, at any efficiency at all.",
 ["An efficiency strictly above 90.000000 percent, whatever the availability.",
  "A shortfall of 4.500000 percentage points, which is the shipped case.",
  "A metal loss ratio above 1.380000 times the datasheet number."],
 "The trigger was measured by bisecting the availability at which the warning first appears. It is low enough that essentially any real programme carries the warning, which is the intended behaviour, because the shortfall is the point of the module.")

q(2, "Why can a capstone in this course grade the corrosion inhibitor arithmetic while it grades no corrosion rate the correlation produced?",
 "The arithmetic is two typed percentages and a division, with no correlation constant anywhere in the chain.",
 ["The corrosion inhibitor constants are published in the open literature and the correlation constants are not sourced.",
  "The arithmetic is validated against the golden and the correlation is not.",
  "The arithmetic is exported by the engine and the correlation is held inside it."],
 "No fugacity coefficient, no held threshold and no band edge reaches the effective protection, the shortfall or the metal loss ratio. You can check every one of them on paper, and so can a grader.")

q(0, "Efficiency and availability are asked for separately. What kind of quantity is each?",
 "Efficiency is a laboratory property of a chemical and availability is a property of an operation.",
 ["Both are properties of the chemical, measured on the same laboratory loop.",
  "Both are operating records, taken from the injection skid over the year.",
  "Efficiency is measured on the line and availability is quoted on the datasheet."],
 "Efficiency is chosen once, at the point of selection, and rarely moves. Availability is pump uptime, tank level, injection point and delivery schedule, and it moves every week. One box would average a laboratory result and an operating record into a number belonging to neither.")

emit(Q, "/root/wt-fc9-nextgen/tools/course-banks/corrosion/intermediate/fc9i_m02.json", label="fc9i_m02", expect_n=15)
finish()
