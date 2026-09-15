import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC1 Professional m04, slug catchers. Digest Section 10 only: the ABANA slug,
# the two forms, the four published cases and every refusal on the tab.

q(2, "Where does the 350.000000 bbl slug on ABANA come from, and what happens when it is missing?",
 "It is typed in from the pigging tab of the line sizing studio, and without it the engine returns { error: \"a slug volume is needed (the line sizing studio computes it)\" }.",
 ["It is computed from the normal rate of 12000.000000 bpd across the hold of 5.000000 minutes, and a missing figure is replaced by that product so that the sizing can go on.",
  "It is recovered from the working volume of 391.666667 bbl by taking the normal inflow back off it, and a missing figure throws a SeparatorInputError naming the input.",
  "It is an output of the catcher sizing, and a missing figure is reported as a slug of nothing."],
 "The message names the studio that owns the number. A reader is told where to go rather than left to invent a figure that will then be sized to six decimals.")

q(0, "ABANA takes a 350.000000 bbl slug with 12000.000000 bpd still arriving over a 5.000000 minute hold. What is the vessel sized on?",
 "391.666667 bbl of working volume, the slug plus the 41.666667 bbl that arrives while the catcher is draining.",
 ["350.000000 bbl, with the 41.666667 bbl of normal inflow held back as the margin that the fill fraction of 0.600000 provides.",
  "391.666667 bbl of vessel volume, which the fill fraction has already been applied to.",
  "The 3665.075231 ft3 the slug occupies at 12000.000000 bpd."],
 "The plant keeps producing while the catcher drains, so both volumes have to fit. The fill fraction of 0.600000 then turns 391.666667 bbl into 3665.075231 ft3.")

q(1, "Why is ABANA's vessel volume 3665.075231 ft3 rather than the working volume carried straight into cubic feet?",
 "A vessel cannot be filled to the top with liquid, so the fill fraction of 0.600000 stands between 391.666667 bbl of working volume and the drum that has to contain it.",
 ["The conversion also has to carry the normal inflow of 41.666667 bbl, which is quoted in barrels and has to be added in cubic feet.",
  "A slug catcher is sized at its slenderness of 4.000000 first, and the volume follows from the two dimensions.",
  "The engine rounds the working volume up to the nearest vendor drum."],
 "Treating 391.666667 bbl as the vessel volume specifies a drum with no vapour space at all. The fill fraction is an input in the same way the hold time is.")

q(3, "Why can 3665.075231 ft3 on its own not describe a drum?",
 "A volume fixes only the product of the bore and the length, so a second statement is needed.",
 ["Because a cylinder's volume depends on the fill fraction of 0.600000 as well, and the fill has to be applied before either dimension can be recovered from it.",
  "Because the engine sizes a catcher from the slug of 350.000000 bbl and uses the volume only to check the answer afterwards.",
  "Because a volume in cubic feet has to be taken back into barrels before a diameter can be found."],
 "The slenderness of 4.000000 splits it into 10.527155 ft of diameter and 42.108619 ft of length. That ratio is an input the project chose.")

q(0, "A sweep prints several catchers one under another and one row reads 13.984106 ft beside 69.920531 ft. How does a reader check that the pair belongs together?",
 "The length is the diameter times the ratio, and 13.984106 ft at a slenderness of 5.000000 gives 69.920531 ft.",
 ["The slug of 1200.000000 bbl over the fill of 0.700000 gives the length directly, so a row whose length disagrees has been mixed with another run.",
  "The normal inflow of 138.888889 bbl moves with the diameter, so the two are reconciled through the hold time of 10.000000 minutes.",
  "The pair cannot be checked, since the ratio is an output of the sizing."],
 "The relationship between the two dimensions is the input that was typed. A diameter of 8.650995 ft at a ratio of 4.000000 gives 34.603982 ft the same way.")

q(2, "The published 1200.000000 bbl case holds its slug for 10.000000 minutes at 20000.000000 bpd and adds 138.888889 bbl, while ABANA adds 41.666667 bbl. What drives that difference?",
 "A longer hold on a higher rate, since the normal inflow is the rate carried across the hold time and both inputs push it up.",
 ["The fill fraction of 0.700000 against 0.600000, which decides how much of the drum is left for liquid arriving after the slug.",
  "The slug of 1200.000000 bbl, since the normal inflow is taken as a share of the slug.",
  "The slenderness of 5.000000 against 4.000000."],
 "41.666667 bbl is 12000.000000 bpd across 5.000000 minutes. A long hold on a high-rate line makes the normal inflow a serious part of the vessel.")

q(3, "ABANA's harp needs 2456.380208 ft3 against the drum's 3665.075231 ft3. What accounts for that gap?",
 "The fill fraction of 0.800000 against 0.600000, and the finger form sizing on the 350.000000 bbl slug alone while the vessel form carries the 41.666667 bbl of normal inflow too.",
 ["Fingers of 20.000000 inch bore hold liquid more densely than a drum does, so the same working volume of 391.666667 bbl occupies less space in pipe.",
  "The harp was sized at a shorter hold, which takes the normal inflow out of its working volume.",
  "The drum figure includes its heads and the harp figure does not."],
 "The two forms answer slightly different questions from the same inputs. A reader comparing them on volume is comparing an answer with the hold in it against one without.")

q(1, "ABANA's harp is 5.000000 fingers of 20.000000 inch bore filled to 0.800000. What does the engine return?",
 "2456.380208 ft3 in all, 225.184350 ft in each finger over 2.181662 ft2, and 1125.921751 ft of pipe.",
 ["2456.380208 ft3 in all, 1125.921751 ft in each finger, and 225.184350 ft2 of cross-section once the five bores have been added together.",
  "3665.075231 ft3 in all, since a working volume is the same whichever form the catcher takes, spread over 2.181662 ft2 in each finger.",
  "391.666667 bbl in all, carried at the fill fraction of 0.800000 into 225.184350 ft of pipe altogether."],
 "Each 20.000000 inch finger offers 2.181662 ft2. Five of them share 2456.380208 ft3 at 225.184350 ft each, and the pipe to buy and support comes to 1125.921751 ft.")

q(0, "The published 500.000000 bbl harp has longer fingers than the 1500.000000 bbl one, at 670.191518 ft against 558.492932 ft. How does the smaller slug ask for more length?",
 "Four fingers of 16.000000 inch bore is far less cross-section than six of 24.000000 inch, so a third of the slug still needs more length in each finger.",
 ["The 500.000000 bbl case is filled to 0.750000 against 0.800000, and a lower fill is what stretches its fingers past the larger harp's 558.492932 ft, the fill dividing a volume before any bore is applied.",
  "The larger harp spreads 10527.343750 ft3 over six fingers, and a volume that large is always shorter per finger whatever bore it is given.",
  "The smaller harp counts the normal inflow and the larger one does not."],
 "Bore and count are the two choices in a harp. 3743.055556 ft3 across four 16.000000 inch fingers is 670.191518 ft each.")

q(2, "Squeezing ABANA's slug into 2.000000 fingers of 12.000000 inch bore gives 1563.780209 ft in each. What does the engine do with that?",
 "It returns the dimensions with a warning that fingers longer than about 1500 ft each call for more fingers or a larger bore rather than a very long harp.",
 ["It refuses on nFingers, since a harp of that length cannot be built and the engine declines to return a dimension nobody could fabricate out of pipe on a real plot.",
  "It holds each finger at about 1500 ft and adds a third finger to carry the remainder, which keeps the harp inside the length the warning describes without moving the bore.",
  "It returns the dimensions with no comment, since buildability sits outside its scope."],
 "The warning is advice about buildability rather than a refusal, and the fix it names is more fingers or a wider bore.")

q(1, "A request for 2.5 fingers is refused as \"nFingers must be a whole number of at least 1 (got 2.5)\". Why refuse it rather than round it?",
 "A harp is built from whole pipes, so 2.5 is a typing slip or an arithmetic result that was never meant to reach the form, and rounding would answer a request nobody made.",
 ["Rounding would move the volume in each finger, and the engine rounds only inputs that leave the total volume of the harp where it was.",
  "A count under 3.000000 fingers sits outside the range the harp relation was fitted over.",
  "The engine rounds only fractions above one half."],
 "The message quotes the value back, which turns a complaint into an instruction: a reader who sees 2.5 knows at once whether they typed it or something upstream produced it.")

q(3, "Which inputs on the slug catcher tab accept a value of zero?",
 "The hold time and the normal liquid rate, while a slenderness of zero and a finger count below one are refused.",
 ["The slenderness and the hold time, since a flat vessel and an instant drain are both real requests, while a normal rate of zero would leave the working volume undefined.",
  "The fill fraction and the hold time, since a drum filled to nothing is simply an empty drum and the engine sizes it anyway.",
  "None of them, because every input on this tab is guarded as a positive number and quoted back when it fails."],
 "A hold time of zero says the vessel drains as fast as the slug arrives. A slenderness of zero is not a squat vessel, and neither it nor a fractional finger describes anything buildable.")

q(2, "A negative hold time and a fill fraction outside its range are both rejected on this tab. How do the two rejections differ?",
 "The hold time throws a SeparatorInputError naming holdMin, and the fill fraction comes back as { error: \"the fill fraction must be between 0 and 1\" }.",
 ["The hold time is caught by the studio form before the engine sees it, and the fill fraction is caught by the engine once the working volume has been worked out.",
  "Both of them throw, and the difference is that the hold time message quotes the value back while the fill fraction message names the acceptable range.",
  "The hold time is refused and the fill fraction is held at 0.600000."],
 "A throw says the request was malformed and names the input. A returned error describes a state the method has no answer for. Neither is a number to carry forward.")

q(0, "What is wrong with quoting ABANA's catcher as a 42.108619 ft vessel?",
 "It leaves out the 10.527155 ft of bore that goes with it, so a plot plan drawn from the length alone inherits whatever ratio the next reader assumes.",
 ["It leaves out the working volume of 391.666667 bbl, which is the only figure on which two catchers may be compared at all once their slenderness ratios differ.",
  "It quotes the harp's length rather than the drum's, which is 225.184350 ft in each finger.",
  "It uses a length the engine reports only at a fill fraction of 0.600000."],
 "The two dimensions come as a pair from one volume and one ratio. 13.984106 ft at a ratio of 5.000000 is a different animal from 10.527155 ft at 4.000000.")

q(1, "A study sets the drum's 3665.075231 ft3 against the harp's 2456.380208 ft3 and calls the harp the smaller catcher. What has that comparison missed?",
 "The two volumes answer different questions, since the harp was sized on the slug alone at a fill of 0.800000 while the drum carries the normal inflow at a fill of 0.600000.",
 ["That a harp is quoted in pipe rather than in shell, so the 1125.921751 ft of pipe has to be converted before the two can be set against each other.",
  "That the drum figure is a working volume in barrels and the harp figure is a vessel volume in cubic feet.",
  "Nothing, since both were sized from the same 350.000000 bbl slug."],
 "The gap is part fill fraction and part the 41.666667 bbl of normal inflow that the finger form never counted.")

emit(Q, '/root/fc-wip-separation/banks/fc1i_m04.json')
finish()
