# Crushed-zone skin

The one component that is about the rock rather than the geometry, and the only one an operation can remove.

{{panel:ps-skin-explorer}}

## The form

The perforation spacing divided by the tunnel length, times the logarithm of the crushed radius over the tunnel radius, times one less than the permeability contrast.

Three factors, each doing something different.

## The first factor

Spacing over tunnel length. The crushed shell is a fixed obstruction attached to each perforation, so the more perforations you have per metre and the further each one reaches, the less each shell costs.

This is why the crushed-zone term is enormous on the small through-tubing gun and almost invisible on the big-hole gun. The former has a short tunnel and a low density; the latter has the opposite.

## The second factor

The logarithm of the radius ratio. The shell is an annular resistance, and annular resistances go as a logarithm of the radius ratio, exactly as the wellbore itself does.

Because it is a logarithm, the THICKNESS of the shell matters far less than people expect. Doubling the crushed radius on a typical case moves the term by a fraction of what doubling the damage does.

## The third factor

The permeability contrast, less one. Strictly linear: a shell five times worse than the rock costs four units of something, and a shell nine times worse costs eight.

And exactly zero when the contrast is one, which is the correct behaviour for an undamaged tunnel and is worth checking in any implementation.

## Why it is the removable one

Every other component is set by the gun and the hole once the shot has been fired. This one is a permeability contrast, and permeability can be restored.

Underbalanced perforating draws the crushed material back out of the tunnel as it forms. An acid wash dissolves it. A surge tool flushes it afterwards.

Reducing the contrast from five to two on the published high-shot-density gun takes about three quarters of the term away, and on the through-tubing gun it takes nearly nine tenths of a skin unit off the total.

## The trap

A severe crushed zone can eat most of the benefit of a good gun. On the published high-shot-density gun, raising the contrast to twenty takes about a third of the total benefit away without reversing its sign.

Which means a well-chosen gun run overbalanced into a dirty hole can look, in a well test, like a badly chosen gun.

## Exercise

Write down the three factors and say what each one measures.

Explain why the thickness of the crushed shell matters less than the severity of the damage.

Then say why this is the only component an operation can address, and name three operations that address it.
