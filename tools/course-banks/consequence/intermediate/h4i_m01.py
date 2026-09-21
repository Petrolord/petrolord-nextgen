import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 Professional m01: how fast a pool burns.
# Digest section 14 (the solid flame model, Babrauskas and its Table 6.5
# fuels, the asymptote, Burgess and its refusal) with section 3 for the
# fire half refusals and section 32 for the single route quantities.

q(2,
 "In the solid flame model the engine uses for a pool fire, the heat flux at a target is a product of three factors. Which three?",
 "The surface emissive power, the view factor and the transmissivity",
 ["The burning flux, the flame length and the flame tilt from the vertical",
  "The heat of combustion, the pool area and a radiative fraction of one half",
  "The surface emissive power, the target distance squared and the wind speed"],
 "The course describes the flame as a cylinder of uniform surface emissive power, and the heat flux as that power times the fraction of the target's view the cylinder fills (the view factor) times the fraction the air lets through (the transmissivity). The burning flux, flame length and tilt are upstream steps that shape the cylinder and never multiply into the heat flux directly. Pool area with a fixed fraction is no part of the model, and dividing by a distance squared with a wind term describes no expression the fire section carries.")

q(0,
 "Using the Babrauskas form with the Table 6.5 heptane row, what burning flux in kg/(m2 s) does the engine return for a heptane pool of 1 m diameter?",
 "0.067380",
 ["0.074587","0.052036","0.089809"],
 "The burning flux table prints 0.067380 for heptane at 1 m, from m\"inf 0.101 times one minus exp(-1.1 D). 0.074587 is the lpg column at the same diameter, whose k beta of 1.4 brings it closer to its asymptote. 0.052036 is lng at 1 m. 0.089809 is heptane again at 2 m, where the larger diameter has pushed it further up its curve.")

q(3,
 "For an lpg pool only half a metre across, which burning flux in kg/(m2 s) does the swept table print?",
 "0.049838",
 ["0.042728","0.074587","0.035753"],
 "The lpg column prints 0.049838 at 0.5 m. 0.042728 is heptane at the same diameter and 0.035753 is gasoline there, both on lower curves at this size. 0.074587 is lpg at 1 m, twice the diameter asked about.")

q(1,
 "Kerosene carries a k beta of 3.5 per m in Table 6.5. What burning flux in kg/(m2 s) does the table print for a kerosene pool of 2 m?",
 "0.038964",
 ["0.039000","0.037822","0.054175"],
 "At 2 m the kerosene column reads 0.038964, already very close to its asymptote because a large k beta makes the exponential die away quickly. 0.039000 is the asymptote itself, which the column reaches from 5 m upward. 0.037822 is kerosene at 1 m. 0.054175 is gasoline at 2 m, a different fuel row with a larger m\"inf of 0.055.")

q(3,
 "Once a heptane pool reaches 50 m across, where does its Babrauskas value sit?",
 "0.101000",
 ["0.100998","0.100587","0.089809"],
 "At 50 m every fuel with a k beta product sits at its asymptote to six decimals, so heptane prints its m\"inf of 0.101 as 0.101000. 0.100998 is the 10 m value and 0.100587 the 5 m value, both still a little under the asymptote. 0.089809 is heptane at 2 m.")

q(1,
 "Table 6.5 lists methanol with no k beta product. Which value comes back for a half metre methanol pool?",
 "0.015000",
 ["0.032998","0.032223","0.035753"],
 "A k beta of none means Table 6.5 says the burning rate is independent of the diameter in the turbulent regime, so methanol prints 0.015000 at every diameter in the sweep, 0.5 m included. 0.032998 is lng at 0.5 m, 0.032223 is kerosene there and 0.035753 is gasoline, all fuels whose half metre pools burn below their asymptotes.")

q(0,
 "Heptane at a diameter of 0.5 m burns well below its large pool value. What share of the asymptote does the course derive for it?",
 "42.31 percent of the 0.101 kg/(m2 s) asymptote",
 ["The whole asymptote, since heptane has k beta 1.1",
  "0.042728 percent, a burning flux read as a share",
  "Half of it, as the pool is half a metre wide"],
 "The course derives heptane at 0.5 m as 42.31 percent of its asymptote: the table prints 0.042728 against an m\"inf of 0.101. A k beta of 1.1 does not put a half metre pool at the asymptote; only the large pools reach it. Reading 0.042728 as a percentage confuses a burning flux with a share, and a half metre diameter sets no share by itself: the share comes from the exponential in k beta D.")

q(2,
 "Which fuel key in the exported POOL_FIRE_FUELS table carries the largest m\"inf?",
 "liquid-hydrogen, at 0.169 kg/(m2 s)",
 ["heptane, whose asymptote reads 0.101",
  "lpg, whose asymptote in the table is 0.099",
  "xylene, at 0.09"],
 "Table 6.5 as the engine exports it gives liquid-hydrogen an m\"inf of 0.169 kg/(m2 s), the largest in the table, with a k beta of 6.1 per m. Heptane at 0.101, lpg at 0.099 and xylene at 0.09 are all real rows of the same table and all smaller.")

q(1,
 "A pool is large enough that its burning flux has reached m\"inf. What does a further increase in its diameter still change?",
 "The area on fire, while the burning flux per square metre stays put",
 ["The burning flux, which keeps rising with the diameter without any limit",
  "Nothing at all, because the whole fire has stopped depending on size",
  "The fuel's k beta product, which Table 6.5 lets grow with the pool"],
 "The course states that a large pool burns at m\"inf and that its diameter then changes the area on fire but no longer the burning flux. The Babrauskas form has an asymptote, so the burning flux does not rise without limit. The fire as a whole still grows with the area, and k beta is a fixed property of the fuel in the table.")

q(2,
 "The Burgess form is used for n-hexane with a heat of combustion of 44700000 J/kg, a heat of vaporisation of 335000 J/kg, a liquid heat capacity of 2270 J/(kg K), a boiling point of 341.9 K and an ambient of 293.15 K. What burning flux in kg/(m2 s) does the engine print?",
 "0.100300",
 ["0.074","0.101000","0.099000"],
 "Burgess gives m\" = 0.001 dHc / (dHv + Cp (Tb - Ta)), and the engine prints 0.100300 for these stated hexane properties. The Babrauskas asymptote for hexane is 0.074, a different method for the same fuel, which is why the two must never be swapped silently. 0.101000 is the heptane asymptote and 0.099000 the lpg asymptote.")

q(3,
 "A Burgess call is made for a liquid whose boiling point lies below ambient. Which field does the engine's refusal name?",
 "boilingPointK",
 ["fuel","method","burningFluxKgM2S"],
 "The engine refuses with its own words: \"boilingPointK: is below ambient: the liquid boils, and the printed Burgess form assumes a liquid heated from ambient to its boiling point\". The field fuel is named when a fuel key is missing from the table, method when the method string is unknown, and burningFluxKgM2S belongs to the flame length function when it is handed a burning flux of zero.")

q(0,
 "Why is a boiling point below ambient refused by the Burgess form instead of being computed?",
 "The printed form would then shrink its denominator, since it assumes a liquid heated from ambient up to its boiling point",
 ["The Burgess form has no heat of vaporisation term, so a boiling liquid gives a burning flux of exactly zero here",
  "The engine converts every boiling liquid into the Babrauskas form on its own and reports the switch as a refusal",
  "A boiling point below ambient makes the heat of combustion negative, and the engine refuses every negative input"],
 "The course says the refusal exists because the printed form would shrink its denominator: dHv + Cp (Tb - Ta) assumes Tb above Ta, the liquid heated from ambient to boiling. The form does carry a heat of vaporisation. The engine never silently swaps methods; every call names its method. The heat of combustion is a stated input and a boiling point has no effect on its sign.")

q(2,
 "The course lists the Burgess burning rate as a single route quantity. What follows from that for this course?",
 "It is taught and never carries a graded answer, because only its transcription stands behind it",
 ["It is graded at twelve decimals, because a single route makes it an exact quantity",
  "It is graded only when the fuel is in Table 6.5, where the asymptote gives it a check",
  "It is dropped from the engine, which exports only the Babrauskas route as a result"],
 "The course says nothing independent catches a Burgess mistake copied into both engine and oracle: the transcription alone stands behind it, so it is taught and never graded. Burning fluxes print to six decimals, and twelve belongs to view factors. A Table 6.5 asymptote is a different method and cannot check Burgess. The engine does export Burgess; poolBurningRate takes 'babrauskas' or 'burgess'.")

q(3,
 "What does the engine answer when poolBurningRate is handed a method string it does not know?",
 "It refuses, in its own words: \"method: must be 'babrauskas' or 'burgess'\"",
 ["It falls back to Babrauskas and returns a result with a warning in its basis",
  "It returns the asymptote m\"inf of the named fuel and a basis block naming Table 6.5",
  "It refuses with the field fuel and the list of every fuel key the table carries"],
 "The course lists this refusal: an unknown method names the field method with the message \"method: must be 'babrauskas' or 'burgess'\". The engine returns a result or a refusal, so it never guesses a method with a warning or hands back an asymptote in its place. The refusal that lists the fuel keys belongs to the field fuel and is for a fuel the table does not carry.")

q(1,
 "A caller wants a Babrauskas burning flux for a fuel that Table 6.5 does not carry. What does the engine's refusal tell them to supply?",
 "massBurningFluxInfKgM2S and kBetaPerM, the two constants the table would otherwise provide",
 ["A heat of combustion and a boiling point, so that the call can proceed by Burgess instead",
  "Nothing further: an unknown fuel is always refused and no other route is available for it",
  "A stated pool thickness, so the engine can derive the diameter from the spilled volume"],
 "The engine's refusal for the field fuel reads \"fuel: must be one of liquid-hydrogen, lng, lpg, butane, hexane, heptane, benzene, xylene, gasoline, kerosene, jp-5, methanol, ethanol, or give massBurningFluxInfKgM2S and kBetaPerM\", so the caller can state the two Babrauskas constants directly. Burgess is a different method named by the method field. The refusal does offer a route, and a pool thickness belongs to poolFromSpill in the source terms.")

emit(Q, '/root/hse-wip-consequence/banks/h4i_m01.json', expect_n=15)
finish()
