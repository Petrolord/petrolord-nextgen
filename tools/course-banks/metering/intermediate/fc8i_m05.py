import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Professional m05, noise as a screening indication.
# Every figure is from digest SECTION 23 at the rendering that section prints.
# No band word is a keyed answer anywhere in this bank and neither exported set
# of thresholds is keyed, because the engine states both as its own screen and
# this course grades no band. The third probe's band is reported as the engine
# reports it and no question here asks why it stayed where the ratio put it,
# because the digest prints no reason.

q(1, "The engine's note comes back with every noise indication. What does it say the result is?",
 "A screening indication only.",
 ["A prediction at a stated distance.",
  "A guaranteed sound pressure level.",
  "A band read from a published table."],
 "Four claims are packed into that note. The result is an indication, a prediction needs a named method and geometry this package does not have, the band is there to tell you whether to ask the question, and the thresholds behind it belong to the engine.")

q(0, "Which published method does the note name?",
 "The IEC 60534-8-3 method.",
 ["The ISO pipe lagging method.",
  "The API machinery noise method.",
  "The ISA control valve sizing method."],
 "The note names it rather than leaving the gap unstated, which is what makes the gap something a reader can act on.")

q(3, "Beyond the named method, what two things does the engine say a real prediction needs?",
 "Valve geometry and pipe geometry.",
 ["A fluid property set and an ambient temperature.",
  "A measured background level and a receiver distance.",
  "A trim style and a certified pressure recovery factor."],
 "Neither one is a fluid property. They are missing because the indication takes the service alone, its pressures, flow, gas gravity and temperature, and never a drawing.")

q(2, "Why does the geometry matter so much to a real prediction?",
 "Noise generated inside the trim gets out through the pipe wall downstream, so the diameter, the wall thickness, the material and any lagging all decide what reaches somebody standing on the plant.",
 ["Noise generated inside the trim is carried by the fluid rather than by the wall, so the line length and the number of bends decide what reaches somebody standing on the plant.",
  "Noise generated inside the trim is proportional to the internal volume of the body, so the face to face dimension and the port area fix the acoustic power at source.",
  "Noise generated inside the trim reflects off the downstream reducer, so the expansion ratio at the outlet sets how much of it returns into the valve and is absorbed there."],
 "The trim geometry matters for the same kind of reason. A cage with many small passages and a single plug in a large port can dissipate identical power and radiate very different acoustic spectra.")

q(1, "What does a screening band leave you unable to do?",
 "Defend a number, support a guarantee, or settle a dispute with a vendor about a decibel figure at a stated distance.",
 ["Rank a population of valves against one another, which is what a concept stage cost estimate is actually asking the screen for.",
  "Decide which valves to raise with a noise specialist, which needs the named method instead.",
  "Tell whether a service is above or below the thresholds the engine exports for the screen."],
 "A screen is a triage tool. On a plant with several hundred control valves the useful question at concept stage is which ten of them need a specialist, an acoustic lagging allowance or a low noise trim in the cost estimate.")

q(0, "What is the pressure ratio of the one scfh bleed probe?",
 "12.000000",
 ["1.898734",
  "6.000000",
  "2.000000"],
 "The engine also runs a hundred million scfh probe at a ratio of 1.898734 and a moderate station flow at a ratio of 6.000000.")

q(2, "A transmission volume is throttled across a valve and the screen is run on it. Which of these is its pressure ratio?",
 "1.898734",
 ["12.000000",
  "6.000000",
  "4.000000"],
 "The probe is described as a hundred million scfh at a pressure ratio near two, and on the ratio alone it would have read low.")

q(3, "Why is the noise screen built on the ratio of the pressures rather than on their difference?",
 "The ratio decides how far the gas expands through the trim, which is what turns pressure energy into acoustic power.",
 ["The difference is not available to the engine at all, because a gas sizing call carries the outlet pressure alone and nothing else.",
  "The difference carries units of pressure, and a screen that carries units cannot be applied across a population of valves at all.",
  "The difference is already inside the stream power term, so using it twice would count the same energy twice."],
 "A valve dropping a large absolute pressure from a very high inlet may sit at a modest ratio, and a valve dropping a small absolute pressure from a low inlet may sit at a large one.")

q(1, "What is the stream power of a service?",
 "The energy the gas gives up expanding through the valve, formed from the mass flow, the absolute temperature and the log of the pressure ratio.",
 ["The acoustic power radiated by the valve body, which is the fraction of the mechanical power dissipated in it that leaves as sound.",
  "The kinetic energy of the stream leaving the valve, taken at the velocity in the outlet connection.",
  "The thermal power the stream carries, taken as the mass flow times the specific heat times the drop."],
 "It is the size of the energy stream the noise has to come out of. A trickle cannot be loud however hard it is throttled.")

q(3, "On how many of the noise probes did the stream power move the band off the pressure ratio alone, and over what tree and rule?",
 "2, counted over the 3 noise probes asked of the indication, with a probe counting when the engine returns a non-null power effect.",
 ["2, counted over the 3 noise probes asked of the indication, with a probe counting when its stream power sits outside the two exported power thresholds.",
  "3, counted over the 3 noise probes asked of the indication, with a probe counting when the engine returns a non-null power effect.",
  "3, counted over the 3 noise probes asked of the indication, with a probe counting when the final band sits below the band the ratio proposed."],
 "A probe is admitted by the power effect and by nothing else, so the figure can be recounted by anybody who can read the three results.")

q(2, "What does the engine say about the one scfh bleed?",
 "`held down to low: the stream power of 0.00134 kW is below 1 kW, and a trickle cannot be loud however hard it is throttled. On the pressure ratio alone this service would have read severe`",
 ["`held down to low: the stream power of 0.00134 kW is below 1 kW, and a bleed of this size is exempt from the screen entirely. On the pressure ratio alone this service would have read severe`",
  "`raised to moderate: the stream power of 0.00134 kW is below 1 kW, so the ratio alone has understated this service and the band has been moved up one rung`",
  "`held down to low: the pressure ratio of 12.000000 is above the severe threshold, so the band has been capped at the lowest rung the screen carries`"],
 "The probe's stream power is 0.00133650 kW against a pressure ratio of 12.000000, and the message is what says which way the band moved and why.")

q(0, "Which message does the indication return on the hundred million scfh probe?",
 "`raised to moderate: the stream power of 34486.0 kW is above 1000 kW, which is not a quiet valve at any pressure ratio. On the pressure ratio alone this service would have read low`",
 ["`raised to severe: the stream power of 34486.0 kW is above 1000 kW, which is not a quiet valve at any pressure ratio at all. On the pressure ratio alone this service would have read low`",
  "`raised to moderate: the stream power of 34486.0 kW is above 1000 kW, so the pressure ratio has been recomputed on the flowing density and the band for this service taken again`",
  "`raised to moderate: the flow of a hundred million scfh is above the screen's own flow threshold, so the band the ratio proposed has been overruled`"],
 "The final band on that probe is moderate and its ratio band is low, which is the whole reason the screen takes two variables rather than one.")

q(1, "The third probe is a moderate station flow at a pressure ratio near six. What does the engine return for it?",
 "A ratio of 6.000000, a stream power of 2312.85 kW, a ratio band of high and a band of high.",
 ["A ratio of 6.000000, a stream power of 2312.85 kW, a ratio band of high and a band of severe.",
  "A ratio of 6.000000, a stream power of 2312.85 kW, a ratio band of moderate and a band of high.",
  "A ratio of 6.000000, a stream power of 34486.0 kW, a ratio band of high and a band of high."],
 "The engine names the two probes where the power moved the band and this is not one of them, so the screen is leaving the ratio's proposal where it found it.")

q(2, "What does a screen built on the pressure ratio alone get wrong, in both directions at once?",
 "It proposes a trickle as severe and a large transmission flow as low, because the ratio knows how hard the gas is throttled and nothing about how much gas there is.",
 ["It proposes a trickle as low and a large transmission flow as severe, because the ratio is dominated by the flow passing through the trim rather than by the expansion across it.",
  "It proposes every service in the middle of the range, because a ratio compresses the spread of a population into a narrow band of values.",
  "It proposes the right band on gas and the wrong band on liquid, because a pressure ratio has no meaning where the fluid does not expand."],
 "Flagging a trickle as severe wastes a specialist's time and fills a register with entries nobody can close. Reporting a large transmission valve as low is the failure that ends with acoustic lagging missing from an estimate.")

q(3, "What is the failure this module is written to prevent?",
 "The quiet promotion of a screening output into a design value, which happens when a band word is copied out of a tool into a table with no note attached.",
 ["The use of a screening output at concept stage, which is where a named method should be applied instead.",
  "The reporting of a screening output to a vendor, which invites a quotation against a band rather than a level.",
  "The recording of a screening output in a register, which leaves an item open that nobody has the evidence to close."],
 "The honest way to report a screening result is to say what the tool did, say what it did not do, and say what happens next.")

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/intermediate/fc8i_m05.json', label='fc8i_m05', expect_n=15)
finish()
