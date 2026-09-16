import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Expert m01, The Wall a Code Demands. Digest section 13.

q(2, "B31.4 and B31.8 Class 1 both hand the SOKU pipe a design factor of 0.720000 and both land on a pressure wall of 0.204327 in. Why is that agreement no reason to size a B31.8 route to B31.4?",
 "The two factors happen to be the same number while the two statements are different: one code has looked at the route and found it empty, and the other has not looked at the route at all.",
 ["B31.4 applies its flat 0.720000 only where a route survey has already returned an empty classification, so the agreement holds on this pipe and the two codes part company the moment the survey is missing from the package.",
  "The agreement is an artefact of the 12.750000 in outside diameter this pipe happens to carry, and the two codes return different pressure walls on the published 8.625000 in and 6.625000 in cases where the diameter is smaller.",
  "B31.4 carries no location classes at all, so a B31.8 line may be sized to B31.4 wherever the route is Class 1 and the resulting wall is legal under either code."],
 "The design factor depends on the code and the class and not on the pipe, which is why the B31.4 row of the SOKU table reproduces the Class 1 row exactly. A class is a property of each stretch of route, so one line can hold several.")

q(0, "On the SOKU pipe at 1200.000000 psig the Class 4 pressure wall of 0.367788 in is 1.800000 times the Class 1 pressure wall of 0.204327 in. What moved between those two rows?",
 "Only the design factor, which fell from 0.720000 to 0.400000 because the surroundings filled up, and every other input to Barlow stood still.",
 ["The design pressure, which a Class 4 route raises above the 1200.000000 psig a Class 1 route is sized at, so the thicker wall is the same factor applied to a larger demand.",
  "The specified minimum yield the code is willing to credit, which falls from 52000.000000 psi at Class 1 to a derated figure at Class 4 in the same way the temperature derate lowers it.",
  "The corrosion allowance, which rises with the class because a populated route is assumed to corrode faster, and it is the 0.125000 in that separates the two figures."],
 "The fluid, the diameter of 12.750000 in, the yield of 52000.000000 psi and the design pressure are identical on both rows. The route is what moved, and because the factor divides, a falling factor is a thickening wall.")

q(3, "The MAOP column of the SOKU table reads 1200.000000 psig on all five rows, from Class 1 through Class 4 and on the B31.4 row. What does that column establish?",
 "That each required wall was derived from 1200.000000 psig and reading the rating back off it returns the pressure it came from, so a thicker wall here is the same rating bought under a stricter factor.",
 ["That every one of the five walls is adequate for 1200.000000 psig with margin to spare, and the column is the engine reporting the lowest of the five ratings so a reader can see the governing case.",
  "That the location class raises the rating along with the required wall, so a line rolled to Class 4 may be operated above the 1200.000000 psig a Class 1 line is held to.",
  "That the four design factors cancel out of the rating, which is why the MAOP is a property of the pipe while the required wall is a property of the code."],
 "Sizing and rating are one relation read in opposite directions. The round trip closes on each of the four published cases too, returning 1440.000000, 1000.000000, 1000.000000 and 720.000000 psig.")

q(1, "At Class 3 the SOKU call returns a pressure wall of 0.294231 in and a required wall of 0.419231 in. What is the difference between those two numbers doing?",
 "It is the 0.125000 in corrosion allowance, which holds no pressure on the day the line is commissioned and is what lets the pipe still hold pressure years later.",
 ["It is the margin the code places between the wall that is calculated and the wall that may be ordered, and it grows with the class in the same way the pressure wall does.",
  "It is the part of the wall the temperature derate of 1.000000 has released, so on a line running hot the two figures would be closer together.",
  "It is the difference between the wall Barlow gives and the nearest wall a mill will roll, which on this pipe is 0.375000 in."],
 "The pressure wall is the steel doing structural work and the required wall is the steel somebody orders. Quoting 0.419231 in as the pressure-carrying wall overstates the pipe by the whole allowance from the first day.")

q(0, "At Class 1 the SOKU pressure wall is 0.340545 in at a joint factor of 0.600000 and 0.204327 in at a joint factor of 1.000000. Why does the lower factor give the thicker wall?",
 "The joint factor sits in the denominator beside the design factor, so a factor the code credits less leaves more wall to be added to cover what the seam is not being credited with holding.",
 ["The lower factor is applied to the yield rather than to the wall, so it lowers the 52000.000000 psi the steel is credited with and the wall grows to carry the same pressure at a lower stress.",
  "A welded seam carries a corrosion allowance of its own that a seamless pipe does not, and at a factor of 0.600000 that extra allowance is what separates the two figures.",
  "The joint factor multiplies the design pressure, so a factor of 0.600000 asks the wall to hold a proportionally higher pressure than the 1200.000000 psig the design stated."],
 "The temperature derate column runs the same way for the same reason: 0.235671 in at a derate of 0.867000 against 0.211300 in at 0.967000. Both divide, so both thicken the wall as they fall.")

q(2, "The joint factor and the temperature derate both sit in the Barlow denominator beside the design factor rather than beside the specified minimum yield. What is that placement saying?",
 "That neither of them is a property of the steel: one is confidence in the seam and one is confidence in the steel when it is hot, and both are statements the code makes rather than measurements of the pipe.",
 ["That both of them are measured properties of the delivered pipe, recorded on the mill certificate alongside the yield, which is why a seamless pipe earns 1.000000 and a welded one earns less.",
  "That both of them scale the design pressure rather than the yield, so a derate of 0.967000 is the code asking the wall to hold 0.967000 of the pressure the design stated.",
  "That both of them are corrections the code applies after the wall has been sized, in the same way the corrosion allowance is added to the pressure wall once Barlow has produced it."],
 "A derate of 0.967000 says the code will credit 0.967000 of the specified minimum yield at the temperature the line runs at. The steel did not change and what the code will credit it with did.")

q(3, "Two published cases run on 8.625000 in at 42000.000000 psi and 1000.000000 psig. One is Class 1 with an allowance of 0.062500 in and returns a required wall of 0.2051091270 in; the other is Class 3 with an allowance of 0.000000 in and returns 0.2053571429 in. What should be read into how close those two walls are?",
 "Nothing about the codes agreeing on steel: one wall is a thinner pressure part carrying an added allowance and the other is pure pressure wall under a stricter factor of 0.500000, so two unlike quantities have landed near each other.",
 ["That the design factor and the corrosion allowance are interchangeable levers, so a designer may trade 0.062500 in of allowance against the step from a factor of 0.720000 to one of 0.500000 and order either wall.",
  "That the location class has little effect at this diameter, since the step from Class 1 to Class 3 moved the required wall by less than a thousandth of an inch on an 8.625000 in pipe.",
  "That both cases were sized at the same 1000.000000 psig and both rate back to 1000.000000 psig, so the two walls are the same quantity measured under two conventions."],
 "The Class 1 case spends part of its 0.2051091270 in on metal that holds no pressure, and the Class 3 case spends all of its 0.2053571429 in on pressure. A comparison of required walls across different allowances is not a comparison of strength.")

q(1, "The mill rolled the SOKU line in 0.375000 in and the rating is read back off that wall at Class 3. With the allowance respected it returns 1019.607843 psig and with the allowance left out it returns 1529.411765 psig. What separates the two answers?",
 "The factor of 1.500000 between them is the gross wall over the net rather than anything about this pipe, because the allowance is an argument of the rating call and the caller chooses whether to respect it.",
 ["The second call has been made at Class 1 rather than Class 3, which is the only way a rating on one wall can return two figures, and 1.500000 is the ratio of the two design factors.",
  "The first call rates the wall the design asked for and the second rates the wall the mill rolled, so 1.500000 is the ratio of 0.419231 in to the wall actually delivered.",
  "The engine warns on the second call and returns the higher figure only so that a reviewer can see what the corrosion allowance is worth in pressure terms, which is why both 1019.607843 psig and 1529.411765 psig appear on the same row."],
 "Both calls are legal, both are correct for what they were asked, and neither warns. A guard cannot fix a question that was fully formed and simply wrong.")

q(0, "A reviewer is handed one figure only, 1019.607843 psig, for a line whose design pressure was 1200.000000 psig. What has that single figure told them about the pipe in the ground?",
 "That 0.375000 in is thinner than the 0.419231 in Class 3 demanded, which the rating can only say by returning a pressure below the one the design asked for.",
 ["That the design pressure was never achievable on this pipe, since no wall in the SOKU table rates back above 1019.607843 psig once the allowance is respected in the call.",
  "That the allowance has already been consumed, so the figure is the pressure the line will hold at the end of its design life rather than on the day it is commissioned.",
  "That the rating and the design use different codes, and 1019.607843 psig is the B31.4 reading of a wall that was specified to B31.8."],
 "The design wall is a requirement and the rolled wall is a fact, and the two separate the moment the mill rounds. Rating a line on the wall it was designed to have hides that separation.")

q(3, "The B31.8 Class 4 published case runs 720.000000 psig on 6.625000 in at 35000.000000 psi with a joint factor of 1.000000, a derate of 0.967000 and an allowance of 0.050000 in. It returns a design factor of 0.400000, a required wall of 0.2261707785 in and a rating back of 720.000000 psig. What is unusual about this row?",
 "Three of the code's levers are in play on one case: the location class through a factor of 0.400000, the temperature derate at 0.967000 and an allowance of 0.050000 in.",
 ["It is the only published case whose rating does not close on the pressure it was sized at, because the derate of 0.967000 is applied in the sizing direction and not in the rating direction.",
  "It is the only published case whose design factor is not the 0.720000 that B31.4 and B31.8 Class 1 share, which is what makes it the case that exercises the class table.",
  "It is the only published case carrying a corrosion allowance, so it is the only one where the required wall and the pressure wall are different numbers."],
 "The Class 3 published case also runs a design factor other than 0.720000, at 0.500000, and the Class 1 case at 1000.000000 psig also carries an allowance, of 0.062500 in. What this row does is carry three levers at once.")

q(2, "Every wall this module sizes reads back to the pressure it was sized for. What does that round trip prove, and what does it leave open?",
 "It proves the two directions are consistent with each other, which is a statement about arithmetic, and it leaves entirely open whether 0.720000 is the right factor for the route.",
 ["It proves the design factors are correctly applied in both directions, which is the only check available on a code factor, and it leaves open only whether the mill rolled the wall the design asked for.",
  "It proves the Barlow form is the right form for a thin-walled line pipe, and it leaves open whether the joint factor and the temperature derate belong in the denominator beside it.",
  "It proves nothing at all, since a relation inverted against itself must close, and the five rows reading 1200.000000 psig are a tautology rather than a check."],
 "A round trip cannot reach a question about whether the code is right. The five SOKU rows and the four published cases all close, and none of them says anything about the route.")

q(1, "Across the four B31.8 classes the SOKU pressure wall runs from 0.204327 in to 0.367788 in while the required wall runs from 0.329327 in to 0.492788 in. Why does the step between the two columns hold while both of them grow?",
 "The three code factors divide and so they scale the pressure wall, while the allowance adds, so the same 0.125000 in is placed on top at every class.",
 ["The allowance is scaled by the design factor in the same proportion as the pressure wall, so both columns grow together and the step between them stays in the same ratio down the table.",
  "The engine holds the required wall to the nearest rolled size at each class, so the step is the rounding rather than the allowance and it happens to be constant across these four classes.",
  "The step holds because all four rows share a design pressure of 1200.000000 psig, and it would move if the classes were compared at different pressures."],
 "That is what an added term looks like standing beside scaled ones. A pressure wall of 0.294231 in and a required wall of 0.419231 in at Class 3 are separated by the same figure as the pair at Class 1.")

q(0, "A wall call arrives with no design pressure. What comes back, and what is notable about the wording?",
 "An object carrying the message that wall thickness needs positive design pressure, OD and SMYS, which names all three of the inputs Barlow cannot proceed without rather than only the one that was missing.",
 ["A thrown error naming designPsig, since a missing required argument is the one case in this engine that leaves the ordinary return path rather than answering with a message.",
  "An object carrying a message naming the design pressure alone, because the engine walks its required arguments in the order Barlow needs them, reports the first one it finds missing and stops looking before the outside diameter is ever examined.",
  "A required wall of 0.000000 in with the design factor still reported, since Barlow with a zero numerator is arithmetically well defined and the caller is left to notice it."],
 "This engine throws nothing. The message names the three inputs together, so it narrows the problem to the call rather than to the argument.")

q(2, "A line leaves a Class 1 stretch and enters a Class 3 stretch, and the wall rolled for the empty end is the SOKU Class 1 wall of 0.329327 in. What is wrong with carrying it through?",
 "The Class 3 stretch demands 0.419231 in, and the class is a property of each stretch of route rather than of the pipeline, so the wall schedule has to change where the surroundings do.",
 ["Nothing, provided the rating of 1200.000000 psig is recorded, since both walls rate back to the same pressure and the rating is what the operator is held to.",
  "The Class 1 wall is legal on the Class 3 stretch under B31.4, which uses a flat factor of 0.720000, so the only requirement is that the line be declared to that code before it is commissioned.",
  "The two stretches need the same wall because the design pressure has not changed, and what has to change instead is the corrosion allowance, which rises with the class."],
 "0.329327 in is thinner than the 0.419231 in that stretch demands. One line can hold several classes, and the wall follows the route.")

q(3, "The published B31.4 case returns a required wall of 0.2451923077 in at an allowance of 0.000000 in. Why can that figure not be set beside the SOKU Class 3 required wall of 0.419231 in as a comparison of two walls?",
 "With no allowance the pressure wall and the required wall are the same number, so 0.2451923077 in is pure pressure-carrying steel while 0.419231 in carries 0.125000 in that holds no pressure.",
 ["The two were sized at different pressures, 1440.000000 psig against 1200.000000 psig, and a required wall may only be compared against another sized at the same design pressure.",
  "One was produced under B31.4 and the other under B31.8, and the two codes define the required wall differently, so the figures are not the same quantity whatever the allowance.",
  "0.2451923077 in is printed to ten decimals and 0.419231 in to six, so the two are reported at different precisions and cannot be differenced."],
 "The SOKU pipe at Class 3 has 0.294231 in doing structural work. That is the figure the published case's 0.2451923077 in stands beside, and the comparison still has two codes and two pressures in it.")

emit(Q, '/root/fc-wip-linesizing/banks/fc2a_m01.json', expect_n=15)
finish()
