# Hydraulic, brake and motor input

Three powers come out of one duty point, and they are three different quantities. Confusing them is the most common way a pump station ends up with the wrong driver on it.

{{panel:fc-pump-explorer}}

## The three, on OKONO

Ask for power at the solved duty of 1234.452969 gpm and 417.801018 ft, on a fluid of specific gravity 1.040000, through a pump of efficiency 0.740000 and a motor of efficiency 0.920000:

- hydraulic power 135.450994 hp
- brake power 183.041884 hp
- motor input 198.958569 hp, which is 148.363379 kW

Hydraulic power is the work actually done on the fluid: this rate, lifted this head, at this density. It is the only one of the three that describes the duty rather than the equipment.

Brake power is what the pump shaft has to be turned with. It is larger, because a pump is not perfect and some of the shaft work goes into heat, recirculation and leakage inside the machine.

Motor input is what the electrical supply has to deliver. It is larger again, for the same reason one step further out.

## Where it goes

The engine's own reading of the losses is that the pump loses 47.590890 hp and the motor a further 15.916686 hp.

Two efficiencies, applied in series, each taking its share. The pump efficiency acts on the hydraulic power to give the shaft power, and the motor efficiency acts on the shaft power to give the supply. Multiplying the two together and applying the product once reaches the same supply figure and produces no shaft figure at all, and the shaft figure is the one the coupling, the shaft and the bearings have to survive.

## Which one you need, and when

The three answer three different questions. Hydraulic power tells you what the duty is worth. Brake power is what the driver is specified against. Motor input is what the electrical load list and the running cost are built on.

## They all hang off the duty

Every figure above was asked at the solved duty flow and head, so none of them is a property of the pump on its own. Move the station and all three powers move with it. That is the through-line of this tier: the duty is solved first, and everything else is asked there.

## The mistake

Building the electrical side on brake power. A motor is rated on what its shaft delivers, so 183.041884 hp is the right figure to select the machine against. It is the wrong figure for the cable, the starter, the load list and the running cost, because every one of those carries what the supply delivers rather than what the shaft receives. On OKONO the supply carries a further 15.916686 hp, and a load list built on the shaft figure is short by exactly that.

## Exercise

Give the three powers at the OKONO duty and say which piece of equipment each one is used to specify. Then give the loss in the pump and the loss in the motor, and say which of the three figures the electrical load list is built on and why the shaft figure will not do.
