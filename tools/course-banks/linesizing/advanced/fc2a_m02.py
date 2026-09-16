import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Expert m02, The Pig and What It Pushes. Digest section 14.

q(2, "The OGBIA line holds 1633.5349 bbl at a bore of 7.981000 in over 26400.000000 ft. Which properties of the fluid in it entered that figure?",
 "None of them, because a line volume is geometry, so a line full of crude and a line full of gas hold the same 1633.5349 bbl.",
 ["The density, which is what converts the swept cubic feet into barrels through the 5.6145833333333 cubic feet per barrel the package measures out of the engine.",
  "The density and the viscosity together, which set the Reynolds number of 48431.2523 that the volume call reads its flow area from.",
  "The holdup of 0.060000, which is the input that turns a bore and a length into the barrels a line is reported to hold."],
 "Bore and length are the only inputs. The holdup enters one step later and turns 1633.5349 bbl into the 98.0121 bbl a sphere pushes ahead of it.")

q(0, "The package no longer types a barrel into either module. How is the figure of 5.6145833333333 cubic feet per barrel obtained from lineHydraulics, and what kind of figure is it?",
 "By asking that module for the flow area times the length over its own line volume, and what comes back is exact by definition rather than by measurement.",
 ["By dividing the line volume of 1633.5349 bbl by the volume the golden oracle reports in SI units, which makes it a measured agreement between two implementations rather than a definition.",
  "By reading it from the catalogue the roughnesses and the grade yields come from, which is why an unknown entry is NaN.",
  "By the erosional velocity times the flow area over the seconds in a day, which is the form lineHydraulics is asked."],
 "Forty-two gallons of two hundred and thirty-one cubic inches each, over the seventeen hundred and twenty-eight cubic inches in a cubic foot. chokePerformance returns 5.6145833333333 to a question about itself and the ratio of the two is 1.0000000000000.")

q(3, "The swept volume is 98.0121 bbl at a holdup of 0.060000 on a line holding 1633.5349 bbl. Where did that holdup of 0.060000 come from?",
 "From somebody outside this engine, because there is no flow regime, no slip and no holdup correlation anywhere in it and a holdup is taken as an input wherever one is needed.",
 ["From the Beggs and Brill correlation inside this engine, which works the holdup out from the rate and the inclination before the sweep is taken against it.",
  "From the line volume and the swept volume, since the engine solves for the holdup that reconciles the two and then reports it back beside the sweep it produced.",
  "From the erosional check, which returns the fraction of its ceiling a line is using and hands that same fraction on as the liquid standing in the bore."],
 "The engine says so in its own header. Two-phase pressure drop, flow regime and holdup are the Suite Beggs and Brill correlation, which is app code, and this engine takes the holdup as an input.")

q(1, "In the holdup sweep the column reading the swept volume as a fraction of the line volume reproduces the holdup column exactly, 0.020000 against 0.020000 and 0.500000 against 0.500000. What does that establish?",
 "That the swept volume is the line volume scaled by the holdup with nothing else in the relation at all.",
 ["That the sweep has been normalised against the line volume before it was reported, so the two columns would reproduce each other even if the underlying relation were not a multiplication.",
  "That the holdup was solved for rather than supplied, because a holdup that had been handed in would not reproduce itself when it is read back out of the sweep it produced.",
  "That the line volume of 1633.5349 bbl cancels out of the sweep entirely, so the swept volume at a stated holdup is the same on a line of any bore and any length."],
 "At a holdup of 1.000000 the sweep is the whole 1633.5349 bbl and at 0.000000 it is 0.0000 bbl. Nothing else enters between those two ends.")

q(0, "The holdup guard is read on both of its sides. Which pair of values does the engine answer and refuse, and what real condition sits at the limit?",
 "It answers 1.000000 and refuses 1.000001, and the value at the limit is a line running liquid full.",
 ["It answers every value below 1.000000 and refuses 1.000000 itself, because a line completely full of liquid has no gas behind the sphere to drive it and the engine excludes that case.",
  "It answers 1.000001 and refuses 1.000000, because this guard is written to exclude its own limit and to admit the first representable step past it instead.",
  "It answers any holdup it is handed and refuses none, because the range is enforced one stage later by the interval call, which is also where the catcher limit is read."],
 "A holdup above one is refused with the message that holdup must be between 0 and 1. A guard that refuses its own limit is as wrong as one that accepts nonsense, which is why both sides are read.")

q(2, "A sphere crosses 26400.000000 ft of the OGBIA line at 3.000000 ft/s and the engine returns a run of 2.444444 hours. What does it report beside that figure, and why does that matter?",
 "The speed it was given, 3.000000 ft/s, because a run time is a length over a speed somebody stated rather than one the engine worked out.",
 ["The line velocity of 2.244621 ft/s, so that a reader can see the margin between the fluid and the sphere and judge whether the sphere will be driven along at all.",
  "The seconds per hour of 3600.000000, because the engine works internally in seconds and prints hours, and it reports the conversion so the round trip can be checked.",
  "The Reynolds number of 48431.2523, so a reader can see whether the line ran turbulent while the sphere was in it."],
 "Nothing about the fluid enters a run time. The density, the viscosity and the holdup are all absent from it, and the speed is a choice.")

q(1, "On the OGBIA line the fluid moves at 2.244621 ft/s and the sphere in the pigging duty is driven at 3.000000 ft/s. What follows from the engine taking the second of those as an input?",
 "The run time is exactly as good as the speed somebody stated, and passing the line velocity in its place returns a wrong run with nothing beside it to mark the substitution.",
 ["The engine scales the stated speed towards the line velocity before it reports the run, which is why 2.444444 hours falls between the two crossings that the pair of speeds on their own would give.",
  "The sphere is driven by the fluid behind it, so the engine derives 3.000000 ft/s from the rate of 12000.000000 bpd and the bore rather than taking any speed as an input.",
  "The two figures have to agree before a run is quotable, and the engine refuses a pig run whose speed differs from the line velocity by more than the erosional fraction of 0.165707."],
 "A pig is pushed by the fluid behind it and does not travel at the fluid's average velocity by default. This engine does not attempt the relationship at all.")

q(3, "At a holdup of 0.060000 the OGBIA sweep of 98.0121 bbl goes into a 250.000000 bbl catcher and the engine returns 3.7997 days. What are the two things filling that vessel, and in which order does the arithmetic take them?",
 "The sweep claims its room first, leaving 151.9879 bbl, and the dropout of 40.000000 bpd then fills whatever is left over.",
 ["The dropout fills the vessel first, over 6.2500 days, and the sweep is what arrives once it is already full, which is why the catcher has to be emptied ahead of every run.",
  "The two are added together and compared against the vessel, so the interval is the catcher size over the sum of the swept volume and the daily dropout.",
  "The sweep sets the interval on its own, and the dropout of 40.000000 bpd decides only whether the vessel is large enough to receive what the sphere pushes in."],
 "Liquid arrives two ways, continuously as dropout and all at once as the sweep. The room left after the sweep is 151.9879 bbl and at 40.000000 bpd that room lasts 3.7997 days.")

q(2, "The interval column is longest at 6.2500 days and has shortened to 2.1662 days by a holdup of 0.100000. Why is the top row the longest interval this line can have?",
 "At a holdup of 0.000000 the sweep is 0.0000 bbl, so the whole 250.000000 bbl is available to the dropout and nothing has been taken away first.",
 ["A dry line has no liquid to drop out of it either, so the figure on that row is the time the catcher takes to fill from the line volume of 1633.5349 bbl instead.",
  "The engine imposes a ceiling of 6.2500 days on any interval it will report, so the top row is where that ceiling is reached rather than where the sweep is smallest.",
  "The dropout of 40.000000 bpd is itself a function of the holdup, so a holdup of 0.000000 also drips slowest."],
 "An interval is the room left after the sweep over the dropout. At a sweep of 0.0000 bbl no room has been taken, so the pure dropout case sits at the top of the column.")

q(1, "At a holdup of 0.200000 the interval column stops reporting days and returns a message instead. What does that message say, and what is unusual about it in this engine?",
 "It says the sweep alone already exceeds the slug limit and names the two fixes, pig more often or resize the catcher, so it prescribes where the other refusals only describe.",
 ["It says that holdup must be between 0 and 1, and it is unusual because the value being refused sits inside the range the very same guard accepts everywhere else in the module.",
  "It says that an interval needs a positive slug limit and dropout rate, and it is unusual because both of those were supplied on this row and the engine declined anyway.",
  "It returns a negative interval with the swept volume printed beside it, and it is unusual because it is the one place this engine reports a result it already knows to be impossible."],
 "At a holdup of 0.200000 the sweep is 326.7070 bbl and there is no room in a 250.000000 bbl catcher for anything at all. The third fix a reader reaches for, accepting a smaller margin, is not available here.")

q(0, "The same refusal about the slug limit comes back from the OGBIA sweep of 98.0121 bbl when the catcher is 60.000000 bbl rather than 250.000000 bbl. What does that pair of cases show about the message?",
 "That it names a relation between a sweep and a vessel rather than a fault in either, so a sweep that is too large and a vessel that is too small produce one sentence.",
 ["That the message is keyed to the holdup, since a vessel of 60.000000 bbl is refused only once the holdup has risen past the 0.100000 row of the sweep table.",
  "That the engine sizes the catcher, since it refuses any vessel smaller than the swept volume it has just computed and thereby states the minimum that vessel must be.",
  "That the sweep is recomputed against the vessel, because a 60.000000 bbl catcher returns a different swept volume from a 250.000000 bbl one on the same line."],
 "The slug a catcher has to hold is computed in this engine and the vessel that holds it is sized in the separation work. The two halves meet at the swept volume.")

q(3, "Three published runs return sweeps of 128.6394 bbl at a holdup of 0.120000, 257.4834 bbl at 0.050000 and 11.6211 bbl at 0.350000. What sets the size of a slug first?",
 "The line volume, since the largest holdup on the smallest pipe delivers the smallest sweep and the lowest holdup on the biggest pipe delivers the largest.",
 ["The holdup, since the sweep is a straight multiplication by it, so the run at 0.350000 delivers the largest of the three slugs on the strength of its fraction alone.",
  "The length, since 52800.000000 ft is the longest of the three and the bore enters only at a single station.",
  "The pig speed, since all three runs are driven at 5.000000 ft/s and a faster sphere gathers up more liquid."],
 "The three line volumes are 33.2033 bbl, 1071.9949 bbl and 5149.6679 bbl. Slug size is set by the line volume first and by the holdup second.")

q(2, "The swept volume carries two refusals of its own. Which pair are they, and what does each one guard?",
 "A swept volume needs a positive bore and length is the geometry refusing to make a volume out of nothing, and a swept volume cannot be negative is the interval refusing an impossible input from upstream.",
 ["A swept volume needs a positive bore and length is the geometry refusing, and a pig run needs a positive length and speed is the second refusal the same sweep raises when the sphere does not move.",
  "A swept volume cannot be negative is the geometry refusing, and an interval needs a positive slug limit and dropout rate is what a sweep returns when no catcher has been stated for it.",
  "A swept volume needs a positive bore and length covers both cases, since a negative sweep can only come from a negative length and the engine reports it under that same sentence."],
 "The boundary is inclusive where it should be. A swept volume of exactly 0.000000 bbl is accepted, because a dry line really does deliver nothing, and it is -0.000001 that is refused.")

q(0, "Ask for the volume of a line with no bore and the answer is NaN rather than an object carrying an error string. Why is that return shaped the way it is?",
 "The volume is a bare number with nowhere to put a message, so it answers NaN by documented contract and the functions wrapping it are what refuse in words.",
 ["The volume is computed before any guard runs, so the NaN is the arithmetic arriving ahead of them.",
  "A missing bore is a state the method has no answer for rather than a meaningless input, and this engine answers the first of those classes with NaN and the second with an error string.",
  "The volume shares a return with the friction factor, so its refusal rides in the regime field as invalid."],
 "Three returns sit outside the refusal contract on purpose. The Reynolds number and the line volume are bare numbers, and the friction factor carries its refusal in the regime it already returns.")

q(3, "A receiving facility is sized on the OGBIA line volume of 1633.5349 bbl. What has gone wrong, and by how much on the nominal duty?",
 "The slug is the sweep rather than the line, so the facility has been sized on 1633.5349 bbl where the sphere delivers 98.0121 bbl at a holdup of 0.060000.",
 ["Nothing has gone wrong, because the sweep is the line volume less the liquid that stays behind, so 1633.5349 bbl bounds it.",
  "The line volume is the right quantity in the wrong units, since 1633.5349 bbl is a figure in cubic feet until the 5.6145833333333 cubic feet per barrel has been applied to it.",
  "The facility should have been sized on the room left in the catcher, 151.9879 bbl."],
 "The line holds 1633.5349 bbl and a run delivers a fraction of it. Sizing a catcher on the line volume oversizes it by whatever the holdup was never going to be.")

emit(Q, '/root/fc-wip-linesizing/banks/fc2a_m02.json', expect_n=15)
finish()
