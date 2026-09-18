import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Professional m01, where the relief load comes from.
# Digest sections 1, 2, 12 and 17, at the rendering those sections print.
# Nothing here reaches the blowdown march or the point source, which belong to
# the tier above this one, and no question carries a figure the digest does not.

q(2, "This module carries several sizing routes and exactly one of them works out its own relief load. Which one, and from what?",
 "The API 521 fire case, from vessel geometry together with a drainage answer and an environment factor the caller states.",
 ["The gas and vapour route, from the vessel inventory and the relieving pressure it is handed.",
  "The knockout drum route, from the vapour rate the flare header carries.",
  "The steam route, because the Napier correction fixes the load as soon as the relieving pressure and the superheat factor are both known."],
 "Every other sizing route in the module takes a relief load as an input and returns the area that load demands. The fire case starts one step earlier, at a wetted area.")

q(0, "A caller hands the gas route a relief load that belongs to the wrong scenario. What does the route do?",
 "It returns the area that load demands at the stated relieving pressure, without hesitating.",
 ["It refuses, because a load outside the range of the stated vessel geometry cannot be sized.",
  "It returns the area with a warning that the load and the pressure disagree.",
  "It substitutes the fire load it computes from the same conditions and sizes on the larger of the two."],
 "Which scenario governs is not the question the route was asked. The engine never chooses the case, and an area is only ever correct for the load it was given.")

q(3, "Read as an object rather than as a set of answers, how does this module's export surface divide?",
 "22 exports in all: 7 returning a bare number, 12 returning an object, 2 published tables and 1 derived constant.",
 ["22 exports in all: 12 of them returning a bare number, 7 returning an object, 2 published tables and 1 derived constant.",
  "22 exports in all: 7 returning a bare number, 12 returning an object, 1 published table and 2 derived constants of its own.",
  "14 exports in all, one for each standard orifice the selection route can return."],
 "The counts come from reading the module rather than from a list in a comment, and the return kinds come from asking what each export actually gives back.")

q(1, "One of the seven bare-number exports is handed an input it cannot work with. How does it say so?",
 "It returns NaN, because a bare number has no field to put an error message in.",
 ["It returns zero, which is the only value outside the range any of them can legitimately produce.",
  "It returns an object carrying an error string, which is the contract every export in the module keeps.",
  "It throws, and the caller is expected to catch it."],
 "The object routes have somewhere to put a message and use it. The bare-number routes have nowhere, so the refusal is the value itself.")

q(1, "What is the contract every object-returning route in this module keeps?",
 "Either a finite result, or an object carrying an error string.",
 ["Either a finite result, or a result with every numeric field set to zero.",
  "Either a finite result carrying its own warning slot, or nothing at all.",
  "Either a finite result, or the nearest result the route could reach with a note saying how far it fell short."],
 "A non-finite number arriving with no error key is exactly what a caller's error check cannot see, so the module is built never to produce one.")

q(3, "Why does a guard written as a check on the error key depend on that contract holding?",
 "Because a route that returned a non-finite number with no error key would slip straight past it.",
 ["Because the error key is the only field a caller may read before the route converges.",
  "Because the error key carries the input that caused the refusal, which the guard retries on.",
  "Because a warning and an error share one field, so the guard has to read both meanings out of it."],
 "The guard can only see what the contract promises to put in front of it. That is why both halves of the contract are checked rather than assumed.")

q(0, "A blocked-in outlet and thermal expansion in a liquid-packed line are two of the commonest relieving cases on a plant. How does this module size them?",
 "Somebody works the load out elsewhere and types it in, and the module returns the area that load demands.",
 ["Both have their own routes, and each computes a load from the process conditions it is given.",
  "Both are sized through the fire case, with the blocked-in duty standing in for a pool fire duty.",
  "Neither can be sized here at all, because the module refuses a load it did not compute itself."],
 "Both cases ask what the process was doing, and no route here is told that. The fire case is the exception because everything it needs is geometry and two stated answers.")

q(2, "A relief load is written down for later use. Which three qualities does it have to carry to still be usable?",
 "A rate, at relieving conditions, for one named scenario.",
 ["A rate, at operating conditions, with the orifice letter it was found to need.",
  "A rate, an area and a margin, so the selection can be reproduced.",
  "A rate, at relieving conditions, with the certified discharge coefficient of the valve it was sized for."],
 "The scenario name is the quality that goes missing. A load without it looks like any other load, and the studio will size against it cheerfully.")

q(3, "The knockout drum route is handed a vapour rate in standard cubic feet a day where it wanted actual cubic feet a second. What happens?",
 "It sizes a drum for the number it was given, because the two quantities are indistinguishable once they are in the box.",
 ["It refuses, because a rate that large cannot be a volumetric rate at drum conditions.",
  "It converts the rate itself, using the header pressure it was given alongside the diameter.",
  "It returns a length and a note saying the rate looks like a standard rate rather than an actual one."],
 "The route is never told what pressure the header runs at, so it cannot convert anything, and a positive number in one unit looks exactly like a positive number in the other.")

q(1, "The teaching drum's vapour density of 0.124385 lb/ft3 is not one of the figures stated about it. Where does it come from?",
 "It is derived from the stated gas gravity with the package's own gas constant and air molecular weight.",
 ["It is stated alongside the liquid density of 36.500000 lb/ft3, since the drum route needs both.",
  "It is returned by the drum route from the diameter and the holdup fraction it was given.",
  "It is read from the vapour viscosity of 0.013500 cp at the stated temperature of 160.000000 degF."],
 "The stated facts are a rate, a pressure, a temperature, a gas gravity, a liquid density and a vapour viscosity. The density is worked out from the third and fourth of those.")

q(0, "The stated rate of 44.000000 MMscfd becomes an actual vapour rate of 212.481739 ft3/s. What standard base does that conversion use?",
 "14.696 psia and 519.67 degR, which is the package's own base.",
 ["42.000000 psia and 160.000000 degF.",
  "14.700000000000 psia and 519.67 degR, the atmospheric constant the sizing routes share.",
  "The base is not fixed, since the conversion is performed from whatever pressure and temperature the caller states."],
 "A standard cubic foot is a bookkeeping unit defined at a reference pressure and temperature, and more than one reference is in common use. Naming the base is half the conversion.")

q(2, "A standard rate is typed into the box that wants the actual one, on a header running above the standard base. Which way does the answer move?",
 "The drum is sized for more gas than the header is carrying.",
 ["The drum is sized for less gas than the header is actually carrying.",
  "The drum length is unaffected, because the route works on the ratio of the rate to the vapour area.",
  "The drum length is unaffected, because the holdup fraction rescales the rate before the transit time is formed."],
 "Compress a gas and the same molecules occupy less volume, so the actual volumetric rate is the smaller figure. Asking for the larger one asks for a drum the header does not need.")

q(1, "Which four things does this tier say the engine leaves to the caller?",
 "The wetted height truncation, the choice of governing case, the conversion from a standard rate to an actual one, and the fluid properties at drum conditions.",
 ["The wetted height truncation, the choice of governing case, the orifice letter the required area lands on, and the margin printed beside that letter on the selection row.",
  "The environment factor, the latent heat, the drainage answer and the level, since all four are typed.",
  "The relieving pressure, the critical pressure ratio, the settling velocity and the vapour density."],
 "Each of the four is a place where a perfectly correct engine answer can be the wrong answer to your question. None of them is a defect, and the module states all four.")

q(3, "Why can the wetted-area route not apply the 25 ft height limit itself?",
 "It is never told where grade is, and the limit is measured above grade.",
 ["It is never told the latent heat of the boiling liquid.",
  "It is never told the orientation of the vessel.",
  "It could apply the limit, and it does, which is why a level above 25 ft returns the same area as a level at it."],
 "A vessel on a plinth, one on a platform two decks up and one in a bunded pit can carry the same level and present completely different amounts of shell within reach. The limit arrives as a note on every duty instead.")

q(0, "Of the figures this module handles, which set is typed rather than computed?",
 "The bellows factors Kb and Kw, the superheat factor KSH, and the API 526 orifice table.",
 ["The critical ratio, F2, the viscosity correction and Napier.",
  "The circular segment, the terminal velocity balance and the march.",
  "The environment factor, the drainage answer and the liquid level."],
 "What the module can derive in closed form it derives. What is published as a chart or a table enters as an input with its reference named, and a typed factor is a number somebody read off a curve.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/intermediate/fc5i_m01.json', label='fc5i_m01', expect_n=15)
finish()
