# The Indonesia model

The second shaly-sand equation in the professional toolkit comes from Poupon and Leveaux (1971). They were working the fresh-water, laminated shaly sands of Indonesia, where Simandoux's dispersed-clay calibration fitted poorly, and their equation has carried the name Indonesia ever since. It is the standard alternative to Simandoux and the second saturation model the capstone grades.

## The equation

The engine uses the Poupon and Leveaux form, written in terms of $1/\sqrt{R_t}$:

$$\frac{1}{\sqrt{R_t}} = \left(\frac{V_{sh}^{\,1 - V_{sh}/2}}{\sqrt{R_{sh}}} + \frac{\phi^{m/2}}{\sqrt{a R_w}}\right) S_w^{\,n/2}$$

Structurally it is still two conductive paths, but combined as square roots of conductivity rather than conductivities. The first bracketed term is the shale path, the second is the clean Archie path, and their sum multiplies a single saturation factor $S_w^{n/2}$. Because $S_w$ appears only once, the equation inverts without a quadratic:

$$S_w = \left(\frac{1/\sqrt{R_t}}{V_{sh}^{\,1 - V_{sh}/2}/\sqrt{R_{sh}} + \phi^{m/2}/\sqrt{a R_w}}\right)^{2/n}$$

And unlike classic Simandoux, the saturation exponent $n$ survives as a free parameter.

## The curious exponent

Look closely at the shale term: $V_{sh}$ is raised to the power $1 - V_{sh}/2$. The exponent depends on the shale volume itself. At small $V_{sh}$ the exponent is close to 1, so the term behaves almost linearly. As $V_{sh}$ climbs toward 1 the exponent falls toward $1/2$, and the term approaches $\sqrt{V_{sh}}$. Poupon and Leveaux chose this empirical device to make one equation track their field data across the whole shaliness range. The practical consequence is that the Indonesia shale term grows faster at high $V_{sh}$ than Simandoux's linear $V_{sh}/R_{sh}$, which is why Indonesia usually reads the lowest of the three models in very shaly rock.

At $V_{sh} = 0$ the shale term vanishes and the equation collapses to $1/\sqrt{R_t} = (\phi^{m/2}/\sqrt{a R_w}) S_w^{n/2}$. Square both sides and rearrange: that is Archie, exactly. The clean-sand agreement at 2020 m (all models 0.4324) holds for Indonesia too.

## Worked example

Evaluate Indonesia at the 2000 m shale point: $\phi = 0.1803$, $V_{sh} = 1.0$, $R_t = 2$ ohm.m, with $R_w = 0.05$, $a = 1$, $m = 2$, $n = 2$, $R_{sh} = 2.0$. Step by step:

1. The shale exponent: $1 - V_{sh}/2 = 1 - 0.5 = 0.5$, so the shale term uses $V_{sh}^{0.5} = 1$.
2. Shale term: $1 / \sqrt{2.0} = 0.70711$.
3. Clean term: $\phi^{m/2} / \sqrt{a R_w} = 0.1803^{1} / \sqrt{0.05} = 0.1803 / 0.22361 = 0.80633$.
4. Bracket total: $0.70711 + 0.80633 = 1.51343$.
5. Left side: $1 / \sqrt{R_t} = 1 / \sqrt{2} = 0.70711$.
6. Saturation factor: $S_w^{n/2} = 0.70711 / 1.51343 = 0.46722$.
7. With $n = 2$, the exponent $2/n = 1$, so $S_w = 0.4672$.

Indonesia assigns 47 percent water to the sample where Archie assigned 88 and Simandoux 57. The ranking is no accident: at $V_{sh} = 1$ the Indonesia shale term is at full strength, and it removes the most conductivity from the water account.

## Choosing between the two

The textbook guidance follows the calibrations. Simandoux was built on dispersed clay and relatively saline waters; Indonesia was built on laminated shale sequences and fresher formation water, where $R_w$ is high and the contrast between the brine path and the clay path is small. Fresh water is exactly where Archie and Simandoux struggle most, so Indonesia tends to be preferred as formation water freshens.

In practice the honest answer is that both are empirical, and local calibration beats provenance. The professional habit is to run both, as this course does, and to treat their spread as an uncertainty band on the saturation rather than pretending either is exact. On the typewell the two models bracket a narrow range in the clean reservoir (you will quantify this in the next lesson) and diverge in shale, where nothing is booked anyway.

Both models share the same sensitivities: they need a defensible $R_{sh}$ from a thick shale, and a $V_{sh}$ that is conservative rather than flattering. This course's linear transform supplies that conservatism by design.

## Exercise

Evaluate Indonesia at the hypothetical sample from the previous lesson: $\phi = 0.20$, $V_{sh} = 0.4$, $R_t = 5$ ohm.m, $R_w = 0.05$, $a = 1$, $m = 2$, $n = 2$, $R_{sh} = 2.0$. Self-check the stages: the shale exponent is $1 - 0.2 = 0.8$, so $V_{sh}^{0.8} = 0.4^{0.8} = 0.48046$ and the shale term is $0.48046/\sqrt{2} = 0.33974$; the clean term is $0.20/\sqrt{0.05} = 0.89443$; the bracket is $1.23417$; the left side is $1/\sqrt{5} = 0.44721$; and $S_w = 0.44721/1.23417 = 0.3624$. Compare with the Simandoux answer of 0.3904 from the previous exercise and state which model books more hydrocarbon here.
