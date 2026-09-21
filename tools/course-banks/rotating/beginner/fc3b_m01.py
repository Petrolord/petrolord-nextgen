import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Associate m01, What These Engines Size and What They Refuse.
# Digest Section 1 only, plus the module wiring stated in the digest preamble.
# Nothing here grades a held item.

q(2, "compression.js takes its two power packagings from one module, and pumps.js takes its kilowatt conversion from the same one. Which module?",
 "lib/units/fieldUnits.js, which both of them read, so one definition of a horsepower serves the liquid machine and the gas machine alike.",
 ["engines/production/gasProperties.js, which already holds the gas constant and the molecular weight of air and is therefore where the shared packagings live.",
  "engines/facilities/separatorSizing.js, which already supplies the compressibility window and is the nearest shared facilities module.",
  "Neither module reads a shared units file. Each one writes its own kilowatt and Btu factors inline at the point of use."],
 "The course names lib/units/fieldUnits.js as the source of the two power packagings, read by compression.js and by pumps.js."),

q(0, "compression.js takes its compressibility validity window from another module. Which one, and what does that tell you about the window?",
 "engines/facilities/separatorSizing.js, so the same declared range governs a separator and a compressor stage rather than each module carrying a range of its own.",
 ["engines/production/gasProperties.js, which is also where the Rankine offset and the molecular weight of air come from.",
  "lib/units/fieldUnits.js, on the grounds that a validity range is a unit-level statement about the correlation.",
  "It declares its own window internally, which is why the refusal message can quote the limits back at the caller."],
 "The course lists three sources for compression.js: gasProperties.js for the gas constant, the molecular weight of air and the Rankine offset, separatorSizing.js for the compressibility validity window, and fieldUnits.js for the two power packagings."),

q(3, "A caller wraps every call into these two modules in a try block so that no bad input can stop a batch. What has that caller misread about the contract?",
 "Neither module throws. Every refusal is a returned object carrying an error string, so the try block will never fire and the unchecked result will travel on.",
 ["Only pumps.js returns its refusals, so the try block protects half the chain and leaves the compression half silently unguarded.",
  "The modules throw on a missing input and return on an out-of-domain one, so a try block catches the first class and misses the second.",
  "A try block is the documented route, and the mistake is only that the caller must also read the error property afterwards."],
 "Every refusal in both modules is a returned object carrying an error string. A caller checks a property rather than catching."),

q(1, "Why do five of the exports in these modules have nowhere to put an error string at all?",
 "They return a bare number rather than an object, which is the shape a caller of a conversion wants and leaves no room for prose.",
 ["They are internal helpers that the modules do not export, so no caller is ever in a position to read an error from them.",
  "They are pure arithmetic on values another export has already validated, so the guard has been run one level up and the error belongs there.",
  "They were written before the error convention existed and are kept unchanged so that callers depending on the old shape keep working."],
 "pumps.headFtToPsi, pumps.psiToHeadFt, compression.polytropicExponentRatio, compression.dischargeTempR and compression.actualInletCfm all hand back a single number."),

q(2, "State the documented contract those bare-number exports hold instead of an error string.",
 "NaN when the inputs cannot be read, never an Infinity and never a plausible number.",
 ["Zero when the inputs cannot be read, on the argument that a zero conversion is visibly useless and cannot be mistaken for a rate.",
  "The last finite value the export produced, so a caller sweeping a range sees the sequence flatten at the point where the inputs stopped being readable.",
  "An Infinity when the inputs cannot be read, because it compares as larger than every real figure and therefore fails any bound a caller tests."],
 "Three clauses, and each does work. NaN fails every comparison including one with itself, so a caller who ignores it gets a visibly broken result."),

q(0, "What would an Infinity return cost a caller that a NaN return does not?",
 "Infinity compares as larger than everything and survives some arithmetic, so it can travel through a bound check looking like a real limit.",
 ["Infinity cannot be serialised into a result object, so a caller showing the return on screen would see an empty field with no way to tell a refusal from a blank.",
  "Infinity would be rounded to the largest finite double by the print formatting, which turns a refusal into a number that reads as an answer.",
  "Infinity propagates only through multiplication, so a caller adding it into a running total would lose the refusal entirely."],
 "NaN poisons any arithmetic it touches and fails every comparison. A plausible number would be worse still, because nothing downstream could detect it."),

q(3, "A system curve is refused when the friction head is negative and accepted when the static head is negative. What is that pair of guards checking?",
 "That friction always takes energy out of the fluid whichever way it flows, while a pump discharging into a vessel below it is an ordinary station with a negative lift.",
 ["That the static head is read back off the return and the friction head is not, so only the friction figure is in a position to be validated at all.",
  "That a negative static head is clipped to zero further down the chain, so the guard has no reason to refuse a value the solve will never see.",
  "That the two figures enter the coefficient in opposite senses, so a sign error in either one produces the same curve and only one of them needs guarding."],
 "The message says a static head may be negative but cannot be missing. The friction message asks for a friction head at a stated positive flow."),

q(1, "A pump curve built from three readings at one flow is refused although three points were supplied. What does that refusal demonstrate?",
 "Presence is not sufficiency. The count was met and the fit still had nothing to work with, so the module states the second condition separately.",
 ["The count was never the real guard. Two points and three points at one flow reach the same check and share the same message about distinct flows.",
  "A quadratic needs four points rather than three, and the degenerate message is how the module says so without changing the stated minimum.",
  "Three readings at one flow are refused as a negative-head case, since a repeated flow makes the residual at that flow ambiguous in sign."],
 "The engine returns \"the pump curve points are degenerate: give three distinct flows\", which is a different message from \"a pump curve needs at least three flow and head points\"."),

q(2, "Two different requests both come back as { error: \"both a pump curve and a system curve are needed\" }. Which pair?",
 "A duty asked with no system to work into, and a duty asked with no pump.",
 ["A duty asked on a curve that rises with flow, and a duty asked with a search limit below the crossing.",
  "A system curve given no static head, and a system curve given no flow to state its friction at.",
  "A power call made at no flow, and a power call made at no specific gravity."],
 "The duty solve needs both objects and names both in one message, because either one missing leaves it with the same half of the question."),

q(3, "What does the pump chain ask AT the solved crossing rather than anywhere else?",
 "The power, the suction margin and the operating region, which is why every one of them moves when the system moves.",
 ["The shutoff head, the droop flag and the conditioning of the fit, which are the three fields that describe the machine at its duty.",
  "The friction coefficient the system implies, which cannot be worked out until the flow the station will actually run at is known.",
  "The best efficiency flow, which the module recovers from the catalogue points once the duty has fixed which part of the curve is in use."],
 "Catalogue points give a curve, a friction head at a stated flow gives a system curve, the two cross at exactly one flow, and the three follow-on questions are asked there."),

q(0, "Which engine module owns what the piping upstream and downstream costs in pressure?",
 "engines/facilities/lineHydraulics.js. These two modules size machines and the line loss is a separate question.",
 ["engines/facilities/separatorSizing.js, which already carries the pressure-drop work for the facilities side of the package.",
  "pumps.js itself, inside the system curve, which is where the friction head at a stated flow is turned into a coefficient.",
  "engines/production/gasProperties.js, since a line loss on the gas side and a line loss on the liquid side share one correlation."],
 "The system curve takes a friction head as an input. Working out what that friction head is belongs to the line-sizing module."),

q(1, "A report says a compressor selection is complete because every returned value was finite and no error string came back. Which failure mode is that report silent about?",
 "Surge. There is no surge line, no surge margin, no recycle valve and no anti-surge calculation anywhere in the engines package.",
 ["The discharge temperature, which the package computes but never compares against any limit, so a finite return says nothing about whether it is survivable.",
  "The gas composition, which the package refuses to accept at all, so a finite return can only ever describe air.",
  "The stage count, which is reported without the limit that governed it and therefore cannot be checked."],
 "Reading an absence as a pass. A result that says nothing about a failure mode is not a result that clears it."),

q(2, "Where do seals and bearings appear anywhere in these two modules?",
 "Only inside returned prose, in a note saying that bearing and seal life shorten at low flow.",
 ["In the brake power, which carries a fixed allowance for seal and bearing drag on top of the hydraulic power.",
  "In the operating region return, as a separate seal-life field that falls away either side of best efficiency flow.",
  "Nowhere at all. The package never mentions a seal or a bearing in any return or any message."],
 "There is no mechanical seal calculation and no bearing calculation. One sentence of returned prose is the whole of what the package knows about them."),

q(0, "Which of these does the package NOT calculate?",
 "Wheel selection and rod loading, along with the machine curve and the valve dynamics that sit beside them.",
 ["The head a fitted catalogue curve gives at any stated flow, which requires the vendor curve rather than the four readings.",
  "The brake power at a solved duty, which needs a motor efficiency the module does not carry.",
  "The compression ratio a stage works at, which is a frame property and comes off a vendor performance run."],
 "There is no machine curve, no wheel selection, no valve dynamics and no rod loading. A vendor performance run on a specific frame answers those."),

q(3, "An engineer fills in a refused input with a reasonable figure and reruns, and every downstream number comes back clean. What is wrong with that result?",
 "It is internally consistent and built on a number nobody supplied, so the duty, the power and the region are all correct calculations on an invented input.",
 ["It will carry a warning string rather than an error string, which the caller is likely to suppress in a report that already shows an answer.",
  "It will differ from the correct answer only in the last two decimals, which is too small a difference for any check in the chain to detect.",
  "It will be refused again at the next guard, because the modules revalidate every input at every step of the chain."],
 "The message named the input because the input is the fix. The engine has no way to distinguish a supplied figure from a guessed one."),

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/beginner/fc3b_m01.json', expect_n=15)
finish()
