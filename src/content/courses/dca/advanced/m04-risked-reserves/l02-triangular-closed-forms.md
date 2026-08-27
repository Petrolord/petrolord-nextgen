# Triangular closed forms

A reserves range needs a distribution, and the choice of distribution should be driven by what you can honestly elicit. From a subsurface team you can get three numbers: a low that is hard to fall below, a most likely case, and a high that is hard to exceed. The triangular distribution takes exactly those three, adds nothing, and has closed forms for everything you need. That combination is why it survives in reserves work despite being crude.

This lesson is the mathematics. The next two apply it.

## The three parameters and the density

Write $a$ for the minimum, $m$ for the mode and $b$ for the maximum, with $a \le m \le b$. Note the collision of notation: this $b$ is a maximum volume, not the Arps decline exponent. The course keeps them apart by always writing the Arps one as $b$ inside a decline equation and this one as the maximum in stb.

The density rises linearly from zero at $a$ to a peak at $m$ and falls linearly to zero at $b$:

$$f(x) = \begin{cases} \dfrac{2(x-a)}{(b-a)(m-a)} & a \le x \le m \\[2ex] \dfrac{2(b-x)}{(b-a)(b-m)} & m < x \le b \end{cases}$$

The peak height is $2/(b-a)$, which for the Ekene triangle is 0.0000100000000000000 per stb. The total area is 1 by construction, which is the whole reason for the factor of 2.

Three properties matter for reserves work. The support is bounded, so the distribution asserts that nothing outside the bracket can happen, which is a strong and sometimes wrong claim. The density is not smooth at the mode, which no committee has ever objected to. And every quantity below has a closed form, so a graded answer is reproducible to the last digit.

## The cumulative distribution

Integrate each branch:

$$F(x) = \begin{cases} \dfrac{(x-a)^2}{(b-a)(m-a)} & a \le x \le m \\[2ex] 1 - \dfrac{(b-x)^2}{(b-a)(b-m)} & m < x \le b \end{cases}$$

$F(x)$ is the probability of coming in **at or below** $x$. In petroleum language, $1 - F(x)$ is the probability of achieving at least $x$, which is the number a P-label refers to.

The branch boundary is the single most useful quantity in the whole scheme. Put $x = m$ into the lower branch and the $(m-a)$ terms cancel:

$$F(m) = \frac{m - a}{b - a}$$

The mode sits at the fraction of the range it occupies. That fraction decides which branch every quantile calculation uses, and it immediately tells you whether the mode is above or below the median.

## Worked example: the Ekene triangle

The field triangle from lesson 1 is $a = 380000$ stb, $m = 461709.132532792$ stb, $b = 580000$ stb. Compute the three spans once and reuse them everywhere:

$$b - a = 200000.000000000, \qquad m - a = 81709.1325327920, \qquad b - m = 118290.867467208$$

The two products that appear in every formula are $(b-a)(m-a) = 16341826506.5584$ and $(b-a)(b-m) = 23658173493.4416$.

Now the threshold:

$$F(m) = \frac{81709.1325327920}{200000} = 0.408545662663958$$

The mode sits at the 40.85th percentile. Since that is below 0.5, the median lies **above** the mode, and only quantiles below the 40.85th percentile use the lower branch. Lesson 3 turns that observation into the branch rule.

Check one more value by hand so that the formula stops being abstract. At $x = 500000$ stb, which is above the mode, use the upper branch: $b - x = 80000$, so

$$F(500000) = 1 - \frac{80000^2}{23658173493.4416} = 0.729480384368042$$

Read that as: on this triangle the probability of achieving at least 500000 stb from the field is $1 - F = 0.270519615631958$. Two more, for the shape: $F(450000) = 0.299844084015548$ and $F(550000) = 0.961958179051756$.

## Mean and variance

The mean is the arithmetic average of the three inputs, which is one of the reasons the triangular is popular:

$$\mu = \frac{a + m + b}{3} = \frac{380000 + 461709.132532792 + 580000}{3} = 473903.044177597 \text{ stb}$$

The variance has an equally compact form:

$$\sigma^2 = \frac{a^2 + m^2 + b^2 - am - ab - mb}{18}$$

For the Ekene triangle that is 1685253101.81684 stb squared, so $\sigma = 41051.8343295015$ stb.

Now look at what the mean is telling you. The deterministic booking is the mode, 461709.132532792 stb. The mean is 12193.9116448053 stb higher. That gap is not an error, it is the definition of skew: this triangle has a longer right arm, $b - m$ of 118290.867467208 against $m - a$ of 81709.1325327920, so the average outcome exceeds the most likely one. If your economics run on an expected value, they should run on 473903.044177597 stb, not on the deterministic booking, and the two differ by 2.64103756794088 percent of the booking.

## The misconception to retire: the mode is the middle

Three separate quantities get confused whenever a triangle is skewed: the mode is the peak of the density, the median splits the probability in half, and the mean is the balance point. They coincide only when $m$ sits exactly halfway between $a$ and $b$. Here $F(m) = 0.408545662663958$, so 59.1454337336040 percent of the distribution lies above the deterministic booking. A committee told that 461709.132532792 stb is "the estimate" would reasonably assume a coin flip either side of it, and would be wrong by 9.14543373360400 percentage points.

{{panel:dca-uncertainty-explorer}}

## Stop and check it yourself

Open the panel's triangular block. It loads with $a = 380000$, $m = 461709.132532792$ and $b = 580000$ and shows a tile for $F$ at the mode. Confirm it reads 0.408545662663958. Now set $m$ to 480000, which is exactly halfway between the min and the max, and watch $F$ at the mode go to 0.5 while the mean, the median and the mode collapse onto the same value. Then set $m$ back and note how quickly the tiles move for a modest change in one input: the sensitivity of a reserves range to the elicited mode is not small.

## Exercise

Using only the three spans computed above, do the following by hand and check each against the panel.

First, evaluate $F(420000)$ and confirm from the branch rule that you used the lower branch. Second, compute the mean and the standard deviation and confirm they match 473903.044177597 stb and 41051.8343295015 stb. Third, build a symmetric triangle with the same minimum and maximum by setting $m = 480000$, compute its standard deviation from the same variance formula, and state in one sentence why it is smaller than the skewed case even though the range is identical.
