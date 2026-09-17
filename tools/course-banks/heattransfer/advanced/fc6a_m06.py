import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Expert m06, The Expert Reading. The whole chain on one bay, the worked
# study, and the scope seams. 15 questions.

q(1, "On the teaching bay, which of these figures was chosen rather than computed?",
 "The air rise of 30.000000 degF.",
 ["The air outlet of 125.000000 degF.",
  "The log mean of 85.263896 degF.",
  "The air mass of 2777777.7778 lb an hour."],
 "The rise is a trade rather than a result. The outlet is the ambient plus the rise, the log mean follows from the four terminals, and the air mass follows from the duty and the rise.")

q(2, "Which figure on the same bay is computed rather than given to the module?",
 "The bare surface of 52125.749338 ft2.",
 ["The coefficient of 4.500000 on the bare surface.",
  "The barometric pressure of 14.700000 psia.",
  "The process outlet of 150.000000 degF at the design point."],
 "The surface is the arithmetic of a duty, a coefficient and a driving force. The coefficient is an input because this module never computes an air-side coefficient from fin geometry.")

q(0, "Work the design point in order. Which sequence needs each step for the one after it?",
 "The air outlet, then the log mean, then the bare surface, then the air mass.",
 ["The bare surface, then the log mean, then the air outlet, and the air mass last of all.",
  "The air mass, then the air outlet, then the surface, then the log mean.",
  "The log mean, then the air outlet, then the air mass."],
 "On the teaching bay those four are 125.000000 degF, 85.263896 degF, 52125.749338 ft2 and 2777777.7778 lb an hour.")

q(3, "At a check ambient of 112.000000 degF, what does the teaching bay deliver?",
 "A duty fraction of 0.890323, a duty of 17806451.6129 Btu an hour, a process outlet of 160.967742 degF and an air rise of 26.709677 degF.",
 ["A duty fraction of 0.812903, a duty of 16258064.5161 Btu an hour, a process outlet of 168.709677 degF and an air rise of 24.387097 degF, which is the hottest row of the sweep.",
  "A duty fraction of 0.941935, a duty of 18838709.6774 Btu an hour, a process outlet of 155.806452 degF and an air rise of 28.258065 degF, which is the row below it.",
  "A duty fraction of 0.890323 with the process outlet held at 150.000000 degF and the air rise held at 30.000000 degF."],
 "The first alternative is the row at 124.000000 degF and the second the row at 104.000000 degF. A duty that has fallen with a held outlet and a held rise is the state this rating was repaired to stop reporting.")

q(3, "The hot-day log mean at 112.000000 degF is 75.912371 degF and UA is 234565.8720 Btu an hour per degF. What does their product come to, and what does it check?",
 "17806451.6129 Btu an hour, which is the rated duty reached by the other method.",
 ["17806451.6129 Btu an hour, scaled from the design duty.",
  "16258064.5161 Btu an hour, the duty at 124.000000 degF.",
  "234565.8720 Btu an hour, because a UA times a log mean returns the UA when the two methods agree."],
 "The effectiveness route never evaluated the surface equation and the surface route never evaluated the effectiveness relation, so the agreement is two methods meeting.")

q(1, "The correction factor on this bay comes back empty. What has to travel with the design surface because of it?",
 "The word counter-current, because the surface is a counter-current-basis surface.",
 ["The check ambient, because a surface without one is a design figure rather than a rating.",
  "The declared margin of 10 percent, because the module applies it wherever a factor is missing.",
  "The fan inlet temperature, because the surface and the fan power are reported on the same answer."],
 "A caller that copies the area alone onto a sheet has copied a counter-current-basis figure without the sentence that qualifies it, and the sheet then reads as a sized bay.")

q(2, "Why does a study of this kind state its own fan static pressure, fan efficiency and motor efficiency rather than take the module's 0.600000, 0.650000 and 0.920000?",
 "Those three name no machine at all, and a pin makes moving one a reviewed act rather than a validation of it.",
 ["Those three are fitted correlation coefficients, and a fitted number may not appear in a study.",
  "Those three sit in the held register, and a held item may not be used in a calculation at all.",
  "Those three are measured out of the engine's own answers, so a study has to measure them again."],
 "The default wall conductivity of 26 names no material on the same terms. A study that states its own is reporting a fan it has chosen rather than inheriting a number with nothing behind it.")

q(0, "The hot-day block reads no declared constant at all. What follows from that?",
 "Nothing held for literature reaches the rated answer.",
 ["The rated answer carries no basis string, since there is no constant to name in one.",
  "The rated answer has to be checked against the design point before it can be quoted.",
  "The rated answer is the only one in this module that the published file does not cover."],
 "It takes the surface and the air mass and holds the effectiveness from its definition at the design point, assuming no arrangement and applying no correction factor.")

q(1, "Which of these does this module not do?",
 "A rigorous cross-flow rating.",
 ["A tube count.",
  "A log mean.",
  "An effectiveness and an NTU in both directions."],
 "The list it declines is a shell-side film from stream analysis, pressure drop, a vibration check, condensation or boiling, fin geometry, and a rigorous cross-flow rating.")

q(3, "Pressure drop in a line and machine work belong to other engines. Which two?",
 "The Pipeline and Line Sizing engine, and Rotating Equipment.",
 ["The Pipeline and Line Sizing engine, and Separation.",
  "Separation, and Rotating Equipment.",
  "Relief and Flare, together with the Pipeline and Line Sizing engine."],
 "The fan on this bay is one line of arithmetic: a volume, a static pressure and two efficiencies. Fans, pumps and compressors as machines are not attempted here.")

q(2, "The shell-side film coefficient stays an input everywhere in this module. What reason does the module give?",
 "A rigorous shell-side coefficient needs stream analysis that belongs in a dedicated rating package.",
 ["The shell-side correlation is in the held register, with its validity band unestablished.",
  "The shell side is refused rather than defaulted, in the way a cooled tube side is.",
  "The published file carries no shell-side row, so nothing could check a computed one."],
 "A boundary named is a boundary a caller can plan around, and this one has been stated from the beginning rather than discovered.")

q(0, "This package exports an overall coefficient twice. What separates the two?",
 "The reference area, which is the outside tube surface here and a stated bore in the other.",
 ["The direction, since one is the clean coefficient and the other the dirty one.",
  "The units, since one is in Btu an hour per ft2 per degF and the other in SI units.",
  "The number of resistances, since one assembles five terms and the other assembles three."],
 "A coefficient without its reference area is not a number anyone can use. This module states its own on every answer.")

q(3, "What should be handed over with a hot-day duty from this bay?",
 "The four fixed quantities, the two that moved, and the basis the rating states.",
 ["The design surface and the coefficient it was formed at, so a reader can recompute UA.",
  "The check ambient and the design ambient, which are the only two inputs that moved.",
  "The published row nearest the check ambient, so the reader has a second method beside it."],
 "A reader who receives the numbers without those qualifications has been handed a sized bay rather than a rated one.")

q(1, "Which of these is one of the three habits this tier ends on?",
 "Ask of any check whether it could have failed for a reason other than a typing error.",
 ["Prefer a published figure to an analytic limit wherever both are available.",
  "Quote a coefficient without its reference area only when the two areas agree.",
  "Treat a green test suite as evidence once every case in it has been read."],
 "The other two are computing one number on a result sheet from the others, and separating what a file pins from what a second route or an analytic limit has established.")

q(2, "At 124.000000 degF the teaching bay gives a duty of 16258064.5161 Btu an hour and a hot-day log mean of 69.311296 degF. What does the second-method check do here?",
 "It multiplies UA by 69.311296 and lands on 16258064.5161 Btu an hour.",
 ["It multiplies the duty fraction of 0.812903 by the design duty and lands on the same figure.",
  "It divides the duty by 69.311296 and compares the result with the bare surface.",
  "It compares 16258064.5161 with the published figure of 18064516.1306."],
 "It is one line and it is the only step in the chain that could have failed for a reason other than a slip of the hand. The published figure of 18064516.1306 belongs to a check ambient of 110.000000 degF.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/advanced/fc6a_m06.json', expect_n=15)
finish()
