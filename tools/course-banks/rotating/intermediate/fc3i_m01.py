import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Professional m01, NPSH available from the real suction side.
# Digest Section 6 only. Every literal here is a Section 6 figure.

q(0, "The OKONO suction is a drum at 24.500000 psia holding a liquid whose vapour pressure is 0.950000 psia at a gravity of 1.040000, and the engine returns a pressure head of 52.308173 ft. What has that first term measured?",
 "How far the suction pressure stands above the pressure at which this liquid boils, converted to feet at the gravity of the liquid being pumped.",
 ["The absolute suction pressure converted to feet at the gravity of the liquid, with the vapour pressure applied further down the return as a separate deduction from the available head.",
  "The suction pressure converted to feet of water and then scaled by the gravity, which is why a heavier liquid at the same drum pressure reads as a taller column of head.",
  "The vapour pressure converted to feet, which is the head the liquid has to be held above before any of the drum pressure counts towards the suction."],
 "The vapour pressure sits inside the first term rather than beside it. An absolute suction pressure on its own says nothing about what keeps a liquid from flashing.")

q(2, "Hand the engine a suction of 6.200000 psia on a liquid whose vapour pressure is 6.200000 psia and the pressure head comes back as 0.000000 ft. What does that row establish about the term?",
 "That it is a difference, since a suction pressure of 6.200000 psia is not small and the term still has nothing to report.",
 ["That the conversion out of pressure has a floor at zero, so a term that would otherwise go negative is clamped there before the static column is added to it.",
  "That the gravity of the liquid has dropped out of the conversion, because the pressure and the vapour pressure are equal and cancel before the gravity is applied.",
  "That the engine refuses to convert a suction pressure it cannot distinguish from the vapour pressure, and returns zero in place of a figure it declines to give."],
 "The suction pressure there is entirely spent holding the liquid as a liquid, so the term that measures the surplus has no surplus to measure. The return is a real 0.000000 ft rather than a placeholder.")

q(1, "The OKONO survey states a source standing 6.000000 ft above the pump and 5.500000 ft of suction friction. How do those two terms reach the available head of 52.808173 ft?",
 "52.308173 plus 6.000000 less 5.500000, since a source above the pump arrives with its height in hand and the friction is spent before the liquid reaches the flange.",
 ["52.308173 plus 6.000000 plus 5.500000, since both terms describe head the liquid still carries when it arrives and neither of them has been spent yet.",
  "52.308173 less 6.000000 plus 5.500000, since the liquid has to be lifted to the pump and the friction figure is a recovery credited back at the flange.",
  "52.308173 less 6.000000 less 5.500000, since both a height and a line loss are demands on the suction and both work against the available head."],
 "The three parts sum on the row to the engine's own 52.808173 ft. The static column's sign is a fact about the layout and the friction subtracts on every suction.")

q(3, "Padding the OKONO drum from 14.700000 psia to 60.000000 psia takes the available head from 31.040865 ft to 131.659135 ft while the pressure head goes from 30.540865 ft to 131.159135 ft. Why do the two columns walk together across the sweep?",
 "The static column and the suction friction are held on every row, so padding reaches one of the three parts and leaves the other two where the survey put them.",
 ["The available head is defined as the pressure head scaled by a factor the drum pressure sets, so the two columns are two readings of one quantity.",
  "The friction term is recomputed at each drum pressure and happens to move by the same amount as the pressure head, which keeps the difference between the columns fixed.",
  "The static column rises with the drum pressure because a padded drum carries a taller liquid level, and the friction rises with it by the same feet."],
 "Every row is the same liquid at the same vapour pressure, gravity, static height and friction. Only the drum pressure moved.")

q(1, "Read the 4.400000 psia row twice. Its pressure head is -5.856338 ft and the figure beside it is 19.143662 ft. What would somebody looking only at that second number conclude?",
 "An ordinary suction with a respectable head on it, because the static column still leaves the figure positive and nothing in the number is marked.",
 ["A figure it cannot use, since the engine returns the available head as a negative number whenever the pressure head goes below zero.",
  "An error key in place of the available head, since a suction below the vapour pressure is one of the states this call refuses rather than answers.",
  "A pass flag set to false beside the available head, which is the field that carries the state of the liquid through to the caller."],
 "The arithmetic is still correct arithmetic and 19.143662 ft is what it gives. The warning is the only thing on the return that says the liquid is already flashing.")

q(0, "Read the flashing message closely: \"the suction pressure is at or below the vapour pressure: the liquid is already flashing before it reaches the pump\". What has it established, precisely?",
 "That the suction pressure is at or below the vapour pressure of the liquid, which is a statement about the state the liquid arrives in.",
 ["That this pump will cavitate, which is the verdict the message exists to deliver.",
  "That the head printed beside it is unsafe to quote.",
  "That the pressure head has gone below zero, which is the condition the message checks."],
 "It is not a cavitation verdict, because this call has never been told the pump's required NPSH. The 6.200000 psia row carries the warning at a pressure head of 0.000000 ft.")

q(3, "Why is the warned call a warning rather than a refusal?",
 "The arithmetic is still correct, so the engine returns the full answer and flags the state of the liquid beside it.",
 ["The engine refuses only on inputs it cannot read, and a suction of 4.400000 psia against a vapour pressure of 6.200000 psia is readable, so the pressure head of -5.856338 ft is returned as a diagnostic rather than as an answer a caller may quote.",
  "A refusal would discard the static column, which is still doing useful work here.",
  "Refusals are reserved for the margin check further down the chain."],
 "A static column really does add feet of head, and it adds them to a negative pressure head as readily as to a positive one. The available head of 19.143662 ft is the arithmetic, and the warning is the state.")

q(2, "The OKONO call returns a warning of null. What is a reader entitled to take from that?",
 "That the engine found nothing to flag on this suction, which is an answer worth quoting rather than a missing field.",
 ["That the suction has cleared the pump's required NPSH, since the warning field is where a failed comparison against required would have been reported.",
  "That the call ran without an internal error, which is what the field reports, and says nothing at all about the liquid or the drum.",
  "That the margin rule has been applied to the available head of 52.808173 ft and found it adequate, which is why no comment was attached."],
 "Null there says the engine had nothing to say about the state of the liquid. This call has never seen a required NPSH, so it can report nothing about adequacy.")

q(0, "The 5.500000 ft of suction friction is a stated condition rather than a computed one. What follows from that?",
 "A guessed friction becomes a guessed NPSH available with nothing on the return to mark the join.",
 ["The friction term is the one part of the three that can be changed without moving steel, which is why the sweep in this module holds it fixed.",
  "The available head carries a tolerance that widens with the friction figure, and the engine reports that tolerance alongside the 52.808173 ft.",
  "The engine treats it as an upper bound and reports the worst case."],
 "What a suction line's length, bore, fittings and rate cost in feet of head belongs to the course that owns line losses. This package takes 5.500000 ft as a number.")

q(1, "Which of these does the OKONO available head of 52.808173 ft depend on?",
 "The drum pressure, the vapour pressure, the gravity, the static height and the suction friction, and nothing that belongs to the machine.",
 ["The five suction conditions together with the pump's required NPSH, which is what turns a survey into an available head in the first place.",
  "The drum pressure and the vapour pressure alone, since the gravity only affects the conversion of the answer into a pressure further down the chain.",
  "The five suction conditions and the duty flow, since the friction of 5.500000 ft was quoted at the flow the pump is running at."],
 "Nothing in the figure is a property of the machine. The required NPSH is a vendor figure this package does not compute.")

q(2, "What can a bare available head support without a required NPSH beside it?",
 "A comparison between two suctions on one installation, such as padding from 14.700000 psia to 24.500000 psia buying 31.040865 ft against 52.808173 ft.",
 ["A verdict on whether the pump is safe, since a suction that assembles cleanly from its three parts has already cleared the only test this package applies.",
  "Nothing whatever, since a figure with no vendor number beside it is an intermediate quantity and the engine returns it only so the margin check can read it.",
  "A statement about the flow the pump will run at, since the available head and the duty flow move together on a friction-dominated suction."],
 "Every sentence of the form safe, cavitating or adequate has a required NPSH inside it. A comparison between two rows of one sweep has none.")

q(3, "The Suction and Changes tab builds the available head from the survey rather than from a single number typed into a box. What does that buy?",
 "A figure somebody can argue with, because the drum pressure, the static column and the friction are each visible and each movable.",
 ["A figure the engine can check against its own margin rule, which it cannot do for a head that arrived as one number from a caller.",
  "A figure carrying the warning field, which an available head typed straight in would arrive without.",
  "A figure with the vendor's required NPSH already inside it, since the survey is where the vendor figure is entered."],
 "A suction that reads 52.808173 ft because a drum sits at 24.500000 psia and a source stands 6.000000 ft up can be argued with. One that reads 52.808173 ft because somebody wrote 52.808173 cannot.")

q(1, "A sweep of the drum pressure is run and the gravity is quietly changed between rows. What has been produced?",
 "A set of different liquids, so the shape the sweep draws is not the shape of padding.",
 ["A sweep with a wider spread than it should have, which is visible because the pressure head column and the available head column stop walking together.",
  "A sweep the engine rejects, since it holds the liquid fixed across a padding study and refuses a row whose gravity has moved.",
  "A sweep that is valid for the available head and invalid for the pressure head."],
 "The point of holding the other conditions is that only the drum pressure moved. A row whose liquid changed is a different case rather than a different drum pressure.")

q(0, "Of the three parts of NPSH available, why is padding the drum the one usually reached on an installation that is already built?",
 "Raising the source, lowering the pump or enlarging the suction line are all steel, and padding is a valve and a gas supply.",
 ["The other two parts are fixed by the survey and the engine will not accept a change to either of them once a case has been stated.",
  "Padding is the only one of the three that moves the available head, since the static column and the friction cancel each other on most layouts.",
  "The static column and the friction are computed by this package rather than stated, so a caller has no way to change them."],
 "The parts are not interchangeable as engineering even when they are interchangeable as arithmetic. Padding reaches the pressure head and leaves the other two alone.")

q(2, "A report states that the OKONO suction is fine because it has 52.808173 ft. What is wrong with the sentence?",
 "It has stated a supply and called it a verdict, and nobody can check it because the figure it would be checked against is not in it.",
 ["It has quoted a figure that belongs to a drum pressure of 24.500000 psia without stating the pressure, so a reader cannot reproduce it.",
  "It has quoted the available head where the pressure head of 52.308173 ft is the figure a suction report is written on.",
  "It has omitted the warning field, which is null on this call and is the only part of the return that carries a verdict."],
 "An available head describes one side of the question. A verdict needs the pump's required NPSH, and this report has none.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/intermediate/fc3i_m01.json', expect_n=15)
finish()
