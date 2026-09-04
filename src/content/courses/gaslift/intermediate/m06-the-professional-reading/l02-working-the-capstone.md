# Working the capstone

The order of work, and the checks that catch what careful people get wrong.

{{panel:pd-valve-explorer}}

## The method

A graded design runs on its own conditions. What carries across is the order, because each step needs the one before it and no step can be repaired later.

**One. Sort the inputs into two lists.** The spacing list is the kickoff pressure, the operating pressure, the unloading wellhead pressure, the kill fluid gradient, the unloading gradient, the transfer differential, the decrement and the method. The valve list is the bellows area, the port catalogue, the gas gravity, the temperature profile and the design gas rate. Sorting first is how you notice a pressure quoted on the wrong datum, and every pressure here is psia.

**Two. Space the whole string before setting anything.** Write down the stop reason and the last spacing increment. A targetDepth stop can leave a mandrel closer than the minimum the design declared, as on the published westTexasOil case at 131.375432376 ft against a stated 250.0 ft, with no warning raised.

**Three. Take the temperature at each depth before you touch a dome.** Every dome number is a temperature reading in disguise.

**Four. Set each valve in one direction.** Depth, then temperature, then the injection and production pressures at that depth, then R from the port and the bellows, then the dome at valve temperature, then the dome at 60 degF, then the rack opening. Never work backwards from a rack setting.

**Five. Report the spread beside the rack opening, with its sign.** Positive on an injection operated valve. Negative means the two sides were handed over swapped, as on every valve of the published constantPressurePPO case.

**Six. Select the port, and record the regime and the catalogue with it.** A rate with no regime cannot be checked, and a catalogue you did not write down is a verdict you cannot reproduce.

## The checks

**Spread against the subtraction.** The spread and the gap from the opening pressure to the dome are the same number by construction: 1068.362497529 psia against 1021.076842603 psia gives 47.285654927 psi on westTexasOil valve 1. A mismatch is your arithmetic, not the engine's.

**Spread against the drop at that depth.** 47.285654927 psi against 26.481994875 psi of drop is a valve still open when the next one takes over. The drop at depth is larger than the decrement at surface, so never use the decrement for this.

**The top valve against the decrement.** It must not move. If it does, something upstream of the recursion changed.

## The failures to expect

Quoting R for a port with no bellows named. Comparing a spread with a surface decrement. Quoting a throughput with no regime. Editing one valve in a finished sheet instead of re running the string. Reporting a gas rate sensitivity as a slope when it moves in catalogue steps. And reading production operated numbers as though the acting fluid were the casing.

## Exercise

Take a published design in the panel and work it in that order: depths and stop reason, temperatures, the four pressures per valve, dome, rack opening, spread with its sign, port with its regime.

Write beside each number the input that produced it, and say which single input, moved slightly, would change the most rows.
