# From sensor error to position error

The second derivative, and why an error at 500 m moves everything below it.

## The chain

A sensor error becomes an inclination, azimuth and depth error at a station. That becomes a POSITION error at that station and at every deeper one, because position is an accumulation.

The bridge is a matrix the standard calls dr/dp: the derivative of the north, east and vertical position at each station with respect to the depth, inclination and azimuth at each station.

## Why it is not diagonal

If inclination at station 20 changes, the position at station 20 changes, and so does the position at stations 21, 22 and every one below.

That is the whole reason survey errors accumulate. The position at total depth depends on the attitude at every station above it, and the dependence does not decay.

The matrix therefore has entries below the diagonal, and building it is a walk down the survey accumulating the sensitivity of each interval's contribution to each station's attitude.

## The two accumulators

For each source the engine builds two things.

**The per-station sensitivity**, the position error caused if this source took its value at this station alone. That is what random propagation needs, because each station's contribution is independent and they add in variance.

**The running sum of sensitivities**, the position error caused if this source took the SAME value at every station down to here. That is what systematic and global propagation need, because a single value applies throughout and the contributions add before squaring.

Those two are computed alongside each other and the propagation mode selects which one becomes the covariance.

## The covariance

For one source at one station, the covariance contribution is the outer product of the appropriate sensitivity vector with itself, scaled by the source magnitude squared.

Outer product because the error is a single scalar amplitude times a direction: it produces a rank-one, perfectly correlated contribution, not three independent errors.

That is why the total covariance is not diagonal either: north and east errors are correlated, because the same declination error moves both.

## Adding them up

The total covariance at a station is the sum over all twenty-seven sources of their individual covariances.

Summing covariances is valid because the sources are assumed independent of each other. That assumption is in the standard and it is reasonable: an accelerometer bias and a declination error have no common cause.

Within a source, the correlations are handled by the propagation mode. Between sources, independence.

## The result

One three by three symmetric matrix per station, in the north-east-vertical frame:

    [ var(N)      cov(N,E)   cov(N,V) ]
    [ cov(N,E)    var(E)     cov(E,V) ]
    [ cov(N,V)    cov(E,V)   var(V)   ]

Six independent numbers describing an ellipsoid of possible true positions. On the validation well at total depth, the north variance is by far the largest and the north-east covariance is strongly negative, which is what makes the ellipse point where it does.

The next module is about reading that matrix.

## The misconception to avoid

"The uncertainty at a station is the uncertainty of that station's measurement." It is the accumulated effect of every station above it. A perfect measurement at total depth on a well with a bad survey at 500 m still has a large position uncertainty, because the well got to total depth by going through 500 m.

## Exercise

A well has an azimuth error of 0.5 degrees introduced at 1000 m and no error anywhere else.

Compute the lateral position error this causes at 2000 m, at 3000 m and at 5000 m of horizontal displacement beyond that point. State whether the error at the shallower stations is affected at all.
