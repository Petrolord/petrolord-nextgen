import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Associate m01, What a Line Sizing Engine Does. Digest section 1, and the
# four lessons of that module: one line and one answer, sizing against
# networking, what the engine refuses to guess, and the units it works in.

q(0, "A gathering system has four flowlines arriving at one header, and how the flow divides between them is unknown. What does this engine do with that problem?",
 "Nothing, because it sizes one line and nothing in it knows another line exists. A system of lines sharing a header is a network solve and lives in engines/production/networkSolve.js.",
 ["It sizes the four in turn and then balances them, iterating over the four rates until the pressures the four lines report at the shared header agree with each other to a stated tolerance.",
  "It refuses, returning an object carrying an error string, because a shared header is one of the eighteen states listed as having no answer in this method.",
  "It sizes the four separately and adds the four pressure drops together, and that sum is the header pressure a network solve would have returned for the same system."],
 "The engine takes a rate per line and returns what that one pipe spends. On OGBIA that is 25.660631 psi at 2.244621 ft/s, and every input on the call describes the one pipe."),

q(2, "Where does two-phase pressure drop live, and what does this engine do wherever a holdup is needed?",
 "It lives in the Suite Beggs and Brill correlation, which is app code, and the engine takes the holdup as an INPUT wherever it needs one.",
 ["It lives in this engine's own flow-regime routine, which settles the regime first and then computes the holdup from it before any pressure drop is formed.",
  "It lives in engines/production/networkSolve.js beside the header balance, and the holdup reaches this engine as a returned value from that solve rather than as an argument.",
  "It lives in the Suite correlation, and this engine calls out to it and keeps the holdup it gets back, so a caller never has to supply one of its own."],
 "The multiphase half is not in this engine at all. A holdup arriving as an argument is a measurement or an assumption somebody else made, and the answer inherits it whole."),

q(1, "A caller needs to know whether a liquid line call succeeded. What does this engine oblige it to do, and why?",
 "Check a property on the object that came back, because every refusal is a returned object carrying an error string and the engine throws nothing at all.",
 ["Wrap the call in a try and a catch, because a state the method has no answer for is raised as an exception while an input that is simply absent comes back as data.",
  "Compare the returned total against zero psi, because a refusal comes back with all three of its pressure terms at 0.000000 and is told apart by the arithmetic rather than by a property.",
  "Read the regime the call reports, because a refused liquid line returns its regime as an empty string while the rest of its fields are missing from the object entirely."],
 "The engine returns { error: \"liquid line drop needs positive rate, bore, length, density and viscosity\" } rather than raising anything, so one code path carries both a result and a refusal."),

q(3, "A liquid line call comes back with the message that it needs positive rate, bore, length, density and viscosity. How much has the caller been told about which input was at fault?",
 "Nothing about which one. Five of the eighteen states the course lists produce that identical string, and it states the contract the five inputs share rather than pointing at the offender.",
 ["That the rate was at fault, since the message lists the five inputs in the order the guard tests them and the offending one is always named first.",
  "That exactly one of the five was missing, since a value that arrived negative produces a separate message naming the sign rather than this one.",
  "That the bore, the length and the density were all usable, since the message names only the inputs the guard could not accept and leaves out the ones it could."],
 "A missing rate, a negative rate, a missing bore, a missing length and a missing viscosity all return that one string. The message describes the contract and the caller still has to read the row."),

q(0, "Why does a liquid line with no viscosity produce a refusal rather than a default?",
 "Because a defaulted centipoise would give a Reynolds number, a friction factor and a pressure drop that all print perfectly normally and all rest on a number nobody supplied.",
 ["Because the viscosity is the one input of the five with no physically meaningful default, while a rate of zero and a length of zero are both taken as legal degenerate lines.",
  "Because the guard runs after the Reynolds number has been formed, so by the time the engine can refuse it has already discovered that the value it was handed was unusable.",
  "Because a substituted viscosity would be caught further down at the erosional check, which measures the line velocity against a ceiling that the density and the viscosity together settle."],
 "A missing rate, bore, length, density or viscosity all return the same refusal. Refusing removes a whole class of quiet wrongness by declining to produce the first link in the chain."),

q(2, "The OGBIA line carries 12000.000000 bpd. At what conditions is that rate taken, and what goes wrong if it is read as a stock tank figure?",
 "At LINE conditions, the dead-liquid case downstream of separation, so it is 12000.000000 bpd of liquid in the pipe. Read as a tank figure waiting to shrink it puts the wrong volume through the area.",
 ["At standard conditions, so the engine takes it to line conditions itself using the density of 54.500000 lb/ft3 before the flow area is divided into it to make a velocity.",
  "At line conditions upstream of separation, where the crude still carries gas in solution, which is why the 2.500000 cp is quoted as a live-oil viscosity at those conditions.",
  "At whatever conditions the caller states, because the engine reads a conditions flag supplied beside the rate and scales the volume from it before anything else runs."],
 "A live-oil flowline upstream of separation carries full PVT and belongs elsewhere. Here 12000.000000 bpd of 54.500000 lb/ft3 crude is what is actually moving through the bore."),

q(3, "Liquid work in this engine is stated in feet and gas work in miles. What does the engine itself say about the boundary between the two units?",
 "Asked for the largest rise it will accept on a gas line 1.000000 mile long, it accepts 5280.000000000 ft and refuses the next representable value above that, 9.095e-13 ft higher.",
 ["Nothing at all, because the mile is a comment written beside the code rather than a live constant, so there is no question a caller can ask the engine that would measure it.",
  "It accepts a rise of 5280.000000000 ft on a line 1.000000 mile long and refuses anything above 26400.000000 ft, which is exactly the five miles the OGBIA liquid line happens to run to.",
  "It converts miles to feet on the liquid side as well, so a liquid line handed 5280.000000000 ft and one handed 1.000000 mile both come back with the same 25.660631 psi."],
 "The mile is a measured boundary in the code rather than a note beside it. The OGBIA liquid line is stated as 26400.000000 ft, and the engine wants feet there."),

q(1, "gc is reported as 32.174000 lbm ft per lbf s2. How was that figure obtained for this course?",
 "By measuring it out of the engine, as the density times the velocity squared over twice 144 times the fittings loss at a resistance sum of one, from 2.244621 ft/s and 0.029634 psi.",
 ["By reading it off the module, which exports gc along with the other constants the chain needs so that a caller can reproduce any step of the arithmetic by hand.",
  "By typing the published value, since gc is a definition of the pound rather than anything an engine computes, so no question that could be put to the engine would ever return the figure itself.",
  "By dividing the friction loss of 25.660631 psi by the velocity head at a resistance sum of one, which cancels the length and the friction factor between them and leaves gc standing on its own."],
 "gc reconciles the pound as a mass with the pound as a force. Isolating it needs a call whose only loss is the fittings term, which is why the resistance sum of one is used."),

q(2, "Why does this course measure gc, the centipoise, the barrel and the day out of the engine rather than printing their published values?",
 "Because the module keeps those constants to itself, so a number typed into a teaching file would not be an engine return.",
 ["Because the engine's own values differ slightly from the published ones, and what the chain actually used is what a reader has to be given to reproduce any figure in it.",
  "Because each of the four is a derived group with no published value behind it anywhere, so measuring it out of the engine is the only route to any figure at all.",
  "Because the module exports them under names this course has no way to import, so asking the engine a question about itself is how a present but unreachable value is recovered."],
 "One centipoise comes back as 6.7197000000e-4 lbm per ft per s and one barrel as 5.6145833333333 cubic feet, each recovered by choosing inputs that isolate it."),

q(0, "Working the OGBIA chain from the bore to the loss, which single step waits on anything, and what does that mean for the rest?",
 "Only the friction factor, which iterates. Everything else substitutes, and the friction factor hands back a settled 0.0218149625 that the rest of the chain then uses as an ordinary input.",
 ["The velocity, because the rate has to pass through the barrel and the day before an area can be divided into it, and that conversion runs to a tolerance of its own.",
  "The Reynolds number, because it needs the velocity and the velocity needs the area, so the two have to be solved against each other before either can be reported.",
  "None of them, because the friction factor is looked up on the Moody chart at the Reynolds number and the relative roughness rather than being solved for."],
 "The area is arithmetic, the velocity is a division and the Reynolds number is a product of four settled figures. Nothing in the tier waits except that one step."),

q(3, "A report quotes 25.660631 psi for OGBIA crude. What is wrong with carrying that figure across to another line carrying the same crude?",
 "It belongs to a whole row rather than to the fluid: that rate, that bore, that length and that wall. The same duty through 6.065000 in spends 97.306913 psi and the crude did nothing.",
 ["Nothing is wrong with it, provided the second line carries the same 12000.000000 bpd, because the loss is settled once the rate and the fluid properties are settled.",
  "It needs rescaling by the ratio of the two lengths and by nothing else, since the length is the only term in the friction loss that a second line is free to change.",
  "It needs rescaling by the ratio of the two bores and by nothing else, since the bore reaches the friction loss exactly once, through the length over bore factor that stands in front of the velocity head."],
 "12000.000000 bpd through 7.981000 in spends 25.660631 psi and through 6.065000 in spends 97.306913 psi. The method travels between lines and the numbers do not."),

q(1, "On the liquid side, one of the states the course lists is about the shape of the input rather than about a physical impossibility. Which is it, and how does it arrive?",
 "A traverse handed no profile segment, and it arrives exactly as the others do, as an object carrying { error: \"a traverse needs at least one profile segment\" }.",
 ["A liquid line handed a negative rate, and it arrives as a thrown exception, because a sign error is a fault in the calling code rather than a state the method has no answer for.",
  "A wall specified to a design code that does not exist, and it arrives as a null return so that a caller can test for it without having to read and compare a message string.",
  "A pig that does not move, and it arrives as a returned run time of zero hours, which a caller reads as the line having no length for the sphere to cross."],
 "Whether the method was handed nonsense or handed a state it cannot size, the return is an object, the property is error, and the string says what was wanted."),

q(2, "A liquid line's length is handed over in miles where the engine asked for feet. What in the returned numbers reveals it?",
 "Nothing. Both are lengths and both are ordinary numbers, the loss scales directly with the length, and the answer comes back wrong by whatever the confusion was worth.",
 ["The gradient, which is the total loss divided by the length and would come back stated in psi per mile, so the unit printed beside it gives the swap away immediately.",
  "The regime, which flips to laminar because a length thousands of times too small drags the Reynolds number down below the 2100 the engine leaves the laminar branch at.",
  "The refusal, since a line whose length is implausibly short against its own bore trips the guard that compares an elevation change against the length of the line."],
 "The friction loss is the friction factor times the length over the bore times the velocity head, so the length scales it directly and nothing downstream is placed to object."),

q(0, "What does a line-sizing answer from this engine cover, and what does it leave out?",
 "It says what one pipe costs in pressure and what bore it needs. It does not say how a header full of pipes divides a flow, and it does not say what happens when gas and liquid travel together.",
 ["It covers the pipe and the header at once, since the rate the caller hands over has already accounted for the split, so a single-line answer is a network answer stated one line at a time.",
  "It covers a two-phase line as well, provided a holdup is supplied, because the holdup is the one quantity a multiphase pressure drop needs beyond the single-phase chain.",
  "It covers a live-oil flowline as readily as a dead-liquid one, because the density and the viscosity are both supplied at line conditions in either case."],
 "Those are different methods. The network solve is another engine and the two-phase work is the Suite correlation, which this engine never calls."),

q(3, "What does a rate in bpd need before it is a velocity in ft/s?",
 "The barrel of 5.6145833333333 cubic feet, the 86400.000000 seconds in a day, and a flow area, which wants the bore in feet and so brings in the 144 square inches in a square foot.",
 ["The barrel and the day alone, since the engine holds its flow area in square feet already and the bore is never taken out of the inches it arrived in.",
  "The barrel, the day and the density of 54.500000 lb/ft3 as well, since a volumetric rate only becomes a velocity once the mass the stream is carrying has been settled and then divided back out of it.",
  "The barrel, the day and gc at 32.174000 lbm ft per lbf s2, since gc reconciles the pound as a mass with the pound as a force in every field-unit conversion this engine makes anywhere at all."],
 "12000.000000 bpd through a flow area of 0.347410 ft2 gives 2.244621 ft/s. Miss any one of the three and the figure still prints in ft/s and still feeds a Reynolds number."),

emit(Q, '/root/fc-wip-linesizing/banks/fc2b_m01.json', expect_n=15)
finish()
