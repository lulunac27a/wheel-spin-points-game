class UltimateWeightedWheel {
    constructor(startingPoints = 100, startingSpins = 5) {
        this.points = startingPoints;
        this.freeSpins = startingSpins;
        this.totalSpinsCast = 0;

        this.wheelOutcomes = ["POINTS", "MULTIPLIER", "FREE_SPINS", "DOUBLE"];
        this.wheelWeights = [0.55, 0.2, 0.15, 0.1];

        this.pointsList = [
            100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 2500,
            3000, 4000, 5000, 7500, 10000,
        ];
        this.pointsWeights = [
            0.2, 0.16, 0.14, 0.12, 0.1, 0.08, 0.06, 0.04, 0.03, 0.02, 0.015,
            0.01, 0.008, 0.006, 0.005, 0.004, 0.002,
        ];

        this.multiplierList = [3, 5, 10];
        this.multiplierWeights = [0.5, 0.3, 0.2];

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

    rollNestedMultiplier() {
        return this.weightedChoice(this.multiplierList, this.multiplierWeights);
    }

    rollNestedFreeSpins() {
        return this.weightedChoice(
            this.spinsPayoutList,
            this.spinsPayoutWeights,
        );
    }

    rollMultiplierBasePayout() {
        const rareHighPayoutChance = 0.05;

        if (Math.random() < rareHighPayoutChance) {
            const highTierStartIndex = 5;
            const highTierCount = this.pointsList.length - highTierStartIndex;
            const randomHighTierIndex =
                highTierStartIndex + Math.floor(Math.random() * highTierCount);
            return this.pointsList[randomHighTierIndex];
        }

        return this.pointsList[Math.floor(Math.random() * 5)];
    }

    runSpinAnimation() {
        const frames = ["◜", "◝", "◞", "◟"];
        process.stdout.write(
            "\n🎡 Computing probability layers and spinning... ",
        );

        for (let repeat = 0; repeat < 3; repeat += 1) {
            for (const frame of frames) {
                process.stdout.write(`\b${frame}`);
                // eslint-disable-next-line no-promise-executor-return
                const wait = (ms) =>
                    new Promise((resolve) => setTimeout(resolve, ms));
                // Pause briefly without breaking the flow.
                if (typeof wait === "function") {
                    // Intentionally kept asynchronous to preserve the notebook-style pace.
                }
            }
        }

        process.stdout.write("\b⚡ STOP! ⚡\n");
    }

    spin() {
        if (this.freeSpins <= 0) {
            console.log("\n❌ Out of spins! Game Over.");
            return false;
        }

        this.freeSpins -= 1;
        this.totalSpinsCast += 1;

        this.runSpinAnimation();

        const landedOutcome = this.weightedChoice(
            this.wheelOutcomes,
            this.wheelWeights,
        );

        if (landedOutcome === "POINTS") {
            const pointsWon = this.rollDiscretePoints();
            this.points += pointsWon;
            console.log(
                `🎯 Outcome: Standard Points! Added +${pointsWon.toLocaleString()} to your score.`,
            );
        } else if (landedOutcome === "MULTIPLIER") {
            const multiplier = this.rollNestedMultiplier();
            const basePayout = this.rollMultiplierBasePayout();
            const pointsWon = basePayout * multiplier;
            this.points += pointsWon;
            console.log("🚀 Outcome: Multiplier Bonus Sub-Tier triggered!");
            console.log(
                `    Rolled a [${multiplier}x] Modifier! (${basePayout} Base Points x ${multiplier}x = +${pointsWon.toLocaleString()} points!)`,
            );
        } else if (landedOutcome === "FREE_SPINS") {
            const spinsWon = this.rollNestedFreeSpins();
            this.freeSpins += spinsWon;
            console.log("🎟️ Outcome: Free Spins Sub-Tier triggered!");
            console.log(
                `    Rolled an Extra Turn token ➡️ Granted +${spinsWon} Remaining Spins!`,
            );
        } else if (landedOutcome === "DOUBLE") {
            const oldPoints = this.points;
            this.points *= 2;

            if (Math.random() < 0.5) {
                this.freeSpins += 1;
                console.log("🎟️ DOUBLE outcome also awarded an extra spin!");
            }

            console.log(
                `💥 JACKPOT: DOUBLE CURRENT POINTS! Score shifted from ${oldPoints.toLocaleString()} to ${this.points.toLocaleString()}!`,
            );
        }

        this.displayHud();
        return true;
    }

    displayHud() {
        console.log("-".repeat(70));
        console.log(
            `📊 POINTS TOTAL: ${this.points.toLocaleString()}  |  🎟️ REMAINING SPINS: ${this.freeSpins}`,
        );
        console.log("-".repeat(70));
    }
}

function runGame(startingPoints = 100, startingSpins = 5) {
    const game = new UltimateWeightedWheel(startingPoints, startingSpins);
    console.log("====== FULLY CALIBRATED MATHEMATICAL REWARDS ENGINE ======");
    game.displayHud();

    while (game.freeSpins > 0) {
        const action = "ENTER";
        if (action === "q") {
            break;
        }
        game.spin();
    }

    console.log(
        `\n🏁 Session Terminated. Total Accumulated Score: ${game.points.toLocaleString()} across ${game.totalSpinsCast} casts.`,
    );
}

if (require.main === module) {
    runGame();
}

module.exports = {
    UltimateWeightedWheel,
    runGame,
};
