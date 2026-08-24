# Brine

Brine is the fluid that is always there. Every pore in the Ekene SAND held water before anything else arrived, water still coats the grains inside the oil leg, and below the contact the sand is full of it. It is also the reference case for every fluid substitution you will ever run, because the question is almost always what happens if this brine is replaced by something else.

## The three numbers

At the Ekene conditions, which are 60 degC, 25 MPa and a salinity of 35,000 ppm, given to the engine as a weight fraction of 0.035, the Batzle and Wang brine relation returns

| Property | Value |
| --- | --- |
| density | 1017.8249875 kg/m3 |
| bulk modulus | 2.6978112899395996 GPa |
| compressional velocity | 1628.0555893189182 m/s |

Take a moment over the density. It is above 1000 kg/m3, which is what the dissolved salt does, and it is below the density of the same brine at cooler conditions, which is what the heat does. The two effects work against each other and the salt wins here.

The bulk modulus of 2.6978112899395996 GPa is the largest fluid modulus in this course. Nothing else in the pore space comes close, and that fact drives the entire rest of the module.

## What salinity does

Salt dissolved in water raises both the density and the bulk modulus, and the effect is not small. Holding the conditions at 60 degC and 25 MPa and moving only the salt content:

| Salinity | Density (kg/m3) | K (GPa) |
| --- | --- | --- |
| 0 weight percent | 994.0097 | 2.534420 |
| 3.5 weight percent | 1017.8250 | 2.697811 |
| 10 weight percent | 1063.6947 | 3.034253 |
| 20 weight percent | 1138.4297 | 3.611999 |

Two things follow from that table.

The first is practical. Formation waters range from nearly fresh to well past 20 weight percent, and the choice of salinity moves the brine modulus from 2.534420 GPa at the fresh end to 3.611999 GPa at the salty end. If a salinity is assumed rather than measured, that assumption is carrying real weight in the answer.

The second is physical. Salt is not a passive passenger. The dissolved ions attract water molecules and organise them more tightly than pure water organises itself, so the fluid becomes both heavier and harder to compress. Both columns rise together, which is why brine density and brine modulus tend to move in the same direction, unlike the temperature case below.

Salinity is usually available. It comes from a water sample, or from the resistivity work the petrophysicist already did to get water saturation, since the two calculations share the same input. Ask for it. Do not adopt a basin average when a field value exists.

## What temperature does

Now hold the salinity at 0.035 and the pressure at 25 MPa and move only the temperature.

| T (degC) | Density (kg/m3) | K (GPa) | vp (m/s) |
| --- | --- | --- | --- |
| 20 | 1032.1697 | 2.511437 | 1559.8600 |
| 40 | 1026.0469 | 2.642625 | 1604.8488 |
| 60 | 1017.8250 | 2.697811 | 1628.0556 |
| 80 | 1007.5722 | 2.689136 | 1633.6850 |
| 100 | 995.3571 | 2.629247 | 1625.2726 |

The density column behaves the way intuition expects. Heat the brine and it expands, so the density falls steadily from 1032.1697 to 995.3571 kg/m3 across the range.

The bulk modulus column does not behave that way at all. It rises from 2.511437 GPa at 20 degC to 2.697811 GPa at 60 degC, and then it turns over. At 80 degC it has already fallen slightly to 2.689136 GPa, and at 100 degC it is down to 2.629247 GPa. Brine bulk modulus peaks between 60 and 80 degC and falls away on both sides of that peak.

This is the non-monotonic behaviour that lesson 1 warned about, and it is a real property of water rather than a quirk of the relation. There is no direction to memorise. There is only the relation, evaluated at the conditions you have.

The velocity column inherits both effects, since $v_p$ for a fluid is the square root of $K$ over rho. It rises to a maximum at 80 degC, at 1633.6850 m/s, slightly deeper into the range than the modulus peak, because the falling density keeps pushing velocity up for a while after the modulus has started to drop.

## The stiffest fluid in the course

Hold on to this. At 2.6978112899395996 GPa, the Ekene brine sits well above the live oil, at 1.1427945726905131 GPa. It is stiffer than the gas, at 55.71865290286663 MPa, by a factor of 48.42.

That ordering never reverses under any conditions this course visits. Brine is the stiff fluid, oil sits in the middle, and gas is soft by an order of magnitude and more. Every seismic fluid effect you will study is, at bottom, a consequence of replacing part of the stiffest fluid with one of the softer ones.

## Exercise

Using the salinity table, state what happens to brine density and brine bulk modulus as salt is added, and give the two values at 10 weight percent. Then answer one question in a sentence. A colleague says that raising the temperature of a brine always softens it. Using the temperature table, say whether that is true and give the values that decide the matter.

Self check: adding salt raises both properties together, and at 10 weight percent the Ekene brine has a density of 1063.6947 kg/m3 and a bulk modulus of 3.034253 GPa. The claim about temperature is false. Between 20 and 60 degC the bulk modulus rises from 2.511437 to 2.697811 GPa, and only above the peak does it fall, reaching 2.689136 GPa at 80 degC and 2.629247 GPa at 100 degC, so brine bulk modulus is not monotonic in temperature and stiffens with heat over the lower part of this range.
