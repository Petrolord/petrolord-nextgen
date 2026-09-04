# What each one costs

Every one of these levers is priced in something the engine does not carry, and three of the four are priced in gas.

{{panel:pd-profile-explorer}}

## A smaller string is a rig and a bet on the rate

`sizeTubingForRate` scores every candidate at one set of conditions, on EBOCHA-5 at 7500.0 ft, 1500.0 psia, 653.67 degR and z 0.9142643742. The traverse is held still while the diameter changes, so the friction a narrower string adds and the pressures it would shift are outside the answer.

The pick is also a bet on today's rate. On the current 3.548 in string at 3100.0 Mscf/d the margin is -3.804781 percent with loading from 6000.0 ft down. At 3000.0 Mscf/d it is -6.907853 percent. At 2700.0 Mscf/d the shallowest loading station has climbed to 1500.0 ft, and at 2400.0 Mscf/d every station is loading and the margin is -25.526282 percent. A string sized to the rate you have is sized to a rate that falls.

And the margin bought is thin. The Coleman pick of 3.476 in reads 1.0022156322, clearing one in the third decimal. Score the same diameter under Turner and it reads 0.8351796935.

## More gas costs gas you do not have

On EBOCHA-5 nothing clears every station below 3450.0 Mscf/d, where the margin first turns positive at 7.055969 percent, against a well making 3100.0 Mscf/d. That is the whole of the engine's contribution to the question. There is no inflow performance anywhere in these modules, so the rate is an input: nothing here says what the well would give at a lower wellhead pressure, what compression would buy, or whether the reservoir has it.

## Lower pressure costs the same unknown

Lowering station pressure lowers the bar, from 2496.154595078 Mscf/d at 2500.0 psia to 892.895047041 Mscf/d at 300.0 psia through 2.441 in at 540.0 degR. Whether the well still makes its rate at the lower pressure is the other half of that trade, and it is the half nothing here models.

## A plunger costs production time and gas

The OGUTA-2 cycle runs 89.90356589 min, of which 40.0 min is shut in and 30.0 min is afterflow, giving 16.01716223 trips a day. The well is not flowing normally for most of that. The cycle also spends gas: 141.82807355 Mscf/d, and a requirement of 9561.17363265 scf/bbl against the 5900.0 scf/bbl the well makes, which is why `glrOk` reads false. That gas is spent on every trip whether or not the trip was worth making.

## The mistake

Pricing a remedy in ratio points. A ratio of 1.0022156322 and a ratio of 1.2865006128 both read `unloads = true`, and one of them is a workover to a bore two sizes down that the well has to keep flowing through for years. The engine reports both to ten digits and neither to a currency.

## Exercise

Take the current string at 3100.0, 3000.0, 2700.0 and 2400.0 Mscf/d and write the shallowest loading station at each.

Then say what the sizing assumed about the traverse when it scored a 2.441 in candidate at 1500.0 psia.
