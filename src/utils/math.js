export const mod = (m, n) => {
	return ((m % n) + n) % n
}

// snaps number to angle
// current - current angle
// snap - snap angle
// example: snap(34, 45) will snap to 45degrees
export const closestAngle = (current, snap) => {
	return Math.floor((current % (360 + snap / 2)) / snap) * snap
}

export const map = (num, min1, max1, min2, max2, round = false, constrainMin = true, constrainMax = true) => {
	if (constrainMin && num < min1) {
		return min2
	}
	if (constrainMax && num > max1) {
		return max2
	}

	const num1 = (num - min1) / (max1 - min1)
	const num2 = num1 * (max2 - min2) + min2
	if (round) {
		return Math.floor(num2)
	}
	return num2
}

export const getMiddlePoint = (p1, p2, t = 0.5) => {
	const x = (p1.x + p2.x) / 2 - t * (p2.y - p1.y)
	const y = (p1.y + p2.y) / 2 + t * (p2.x - p1.x)
	return {
		x,
		y
	}
}

export const getDistance = (p1, p2) => {
	const a = p1.x - p2.x
	const b = p1.y - p2.y

	return Math.sqrt(a * a + b * b)
}

export const getSingleDistance = (p1, p2) => {
	const a = p1 - p2

	return Math.sqrt(a * a)
}

export const getRandomInt = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

export const getRandomFloat = (min, max) => {
	return Math.random() * (max - min) + min
}

export const min = input => {
	if (toString.call(input) !== '[object Array]') return false
	return Math.min.apply(null, input)
}

export const easeInQuad = (t, b, c, d) => {
	return c * (t /= d) * t + b
}

export const easeInOutQuad = (x, t, b, c, d) => {
	if ((t /= d / 2) < 1) {
		return (c / 2) * t * t + b
	} else {
		return (-c / 2) * (--t * (t - 2) - 1) + b
	}
}
