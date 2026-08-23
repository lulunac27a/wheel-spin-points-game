class PercentageWeightedWheel {
    constructor(startingPoints = 100, startingSpins = 5) {
        this.points = startingPoints;
        this.highestPoints = startingPoints;
        this.freeSpins = startingSpins;
        this.totalSpinsCast = 0;

        this.wheelOutcomes = ["POINTS", "PERCENTAGE", "FREE_SPINS", "DOUBLE"];
        this.wheelWeights = [0.55, 0.20, 0.15, 0.10];

        this.pointsList = [
            100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 2500,
            3000, 4000, 5000, 7500, 10000,
        ];
        this.pointsWeights = [
            0.20, 0.16, 0.14, 0.12, 0.10, 0.08, 0.06, 0.04, 0.03, 0.02, 0.015,
            0.01, 0.008, 0.006, 0.005, 0.004, 0.002,
        ];

        this.percentageList = [0.10, 0.20, 0.25, 0.50, 0.75, 1.00];
        this.percentageWeights = [0.34, 0.26, 0.18, 0.12, 0.07, 0.03];
        this.percentageSigns = [1, -1];
        this.percentageSignWeights = [0.5, 0.5];

        this.spinsPayoutList = [2, 3, 5];
        this.spinsPayoutWeights = [0.5, 0.3, 0.2];
    }

    weightedChoice(values, weights) {
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

    rollDiscretePoints() {
        return this.weightedChoice(this.pointsList, this.pointsWeights);
    }

    rollPercentageChange() {
        const magnitude = this.weightedChoice(
            this.percentageList,
            this.percentageWeights,
        );
        const sign = this.weightedChoice(
            this.percentageSigns,
            this.percentageSignWeights,
        );
        return magnitude * sign;
    }

    rollNestedFreeSpins() {
        return this.weightedChoice(
            this.spinsPayoutList,
            this.spinsPayoutWeights,
        );
    }

    spin() {
        if (this.freeSpins <= 0) {
            console.log("\nOut of spins! Game Over.");
            return false;
        }

        this.freeSpins -= 1;
        this.totalSpinsCast += 1;
        const landedOutcome = this.weightedChoice(
            this.wheelOutcomes,
            this.wheelWeights,
        );

        if (landedOutcome === "POINTS") {
            const pointsWon = this.rollDiscretePoints();
            this.points += pointsWon;
            console.log(`Standard Points: +${pointsWon.toLocaleString()}`);
        } else if (landedOutcome === "PERCENTAGE") {
            const percentageChange = this.rollPercentageChange();
            const oldPoints = this.points;
            this.points = Math.max(0, Math.round(this.points * (1 + percentageChange)));
            const label = `${percentageChange >= 0 ? "+" : ""}${percentageChange * 100}%`;
            console.log(
                `Percentage Change: ${label} (${oldPoints.toLocaleString()} -> ${this.points.toLocaleString()})`,
            );
        } else if (landedOutcome === "FREE_SPINS") {
            const spinsWon = this.rollNestedFreeSpins();
            this.freeSpins += spinsWon;
            console.log(`Free Spins: +${spinsWon}`);
        } else {
            const oldPoints = this.points;
            this.points *= 2;
            console.log(
                `Double Points: ${oldPoints.toLocaleString()} -> ${this.points.toLocaleString()}`,
            );
        }

        this.highestPoints = Math.max(this.highestPoints, this.points);
        this.displayHud();
        return true;
    }

    displayHud() {
        console.log("-".repeat(70));
        console.log(
            `POINTS TOTAL: ${this.points.toLocaleString()}  |  HIGHEST: ${this.highestPoints.toLocaleString()}  |  REMAINING SPINS: ${this.freeSpins}`,
        );
        console.log("-".repeat(70));
    }
}

function runGame(startingPoints = 100, startingSpins = 5) {
    const game = new PercentageWeightedWheel(startingPoints, startingSpins);
    console.log("====== PERCENTAGE CHANGE REWARDS ENGINE ======");
    game.displayHud();

    while (game.freeSpins > 0) {
        game.spin();
    }

    console.log(
        `Session Terminated. Total Accumulated Score: ${game.points.toLocaleString()} | Highest Points: ${game.highestPoints.toLocaleString()} across ${game.totalSpinsCast} casts.`,
    );
}

if (require.main === module) {
    runGame();
}

module.exports = {
    PercentageWeightedWheel,
    runGame,
};
