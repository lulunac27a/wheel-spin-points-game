const WHEEL_POOL = {
    100: 15.0,
    150: 12.0,
    200: 10.0,
    250: 9.0,
    300: 8.0,
    400: 7.0,
    500: 6.0,
    750: 5.0,
    1000: 4.0,
    1500: 3.0,
    2000: 2.0,
    2500: 1.5,
    3000: 1.0,
    4000: 0.8,
    5000: 0.5,
    7500: 0.2,
    10000: 0.1,
    DOUBLE_POINTS: 4.0,
    MULTIPLIER_BONUS: 2.0,
    FREE_SPINS: 4.0,
    NO_POINTS: 4.9,
};

const SEGMENTS = Object.keys(WHEEL_POOL);
const WEIGHTS = Object.values(WHEEL_POOL);

function weightedChoice(values, weights) {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let roll = Math.random() * totalWeight;

    for (let index = 0; index < values.length; index += 1) {
        roll -= weights[index];
        if (roll <= 0) {
            return values[index];
        }
    }

    return values[values.length - 1];
}

function spin21Wheel() {
    return weightedChoice(SEGMENTS, WEIGHTS);
}

function runSession(startingSpins = 1) {
    let totalPoints = 0;
    let spinsLeft = startingSpins;
    let currentMultiplier = 1;
    let doubleFlag = false;

    while (spinsLeft > 0) {
        spinsLeft -= 1;
        const landing = spin21Wheel();

        if (String(landing).match(/^\d+$/)) {
            let gained = Number(landing) * currentMultiplier;
            if (doubleFlag) {
                gained *= 2;
            }
            totalPoints += gained;
            currentMultiplier = 1;
            doubleFlag = false;
        } else if (landing === "DOUBLE_POINTS") {
            spinsLeft += 1;
            doubleFlag = true;
        } else if (landing === "MULTIPLIER_BONUS") {
            currentMultiplier = 5;
        } else if (landing === "FREE_SPINS") {
            spinsLeft += 2;
        } else if (landing === "NO_POINTS") {
            currentMultiplier = 1;
            doubleFlag = false;
        }
    }

    return totalPoints;
}

function runSimulation(simulations = 100000) {
    const payoutAccumulator = Array.from({ length: simulations }, () =>
        runSession(),
    ).reduce((sum, value) => sum + value, 0);

    console.log(
        `Validated across ${simulations.toLocaleString()} standard games...`,
    );
    console.log(
        `📊 Balanced Expected Return: ${(payoutAccumulator / simulations).toFixed(2)} points per session.`,
    );
}

if (require.main === module) {
    runSimulation();
}

module.exports = {
    spin21Wheel,
    runSession,
    runSimulation,
};
