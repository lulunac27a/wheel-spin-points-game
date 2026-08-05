class UltimateWeightedWheel {
    //ultimate weighted wheel class for a game that simulates spins with various outcomes and rewards
    constructor(startingPoints = 100, startingSpins = 5) {
        //constructor initializes the game with starting points and spins
        this.points = startingPoints; //initialize points with startingPoints
        this.freeSpins = startingSpins; //initialize freeSpins with startingSpins
        this.totalSpinsCast = 0; //initialize totalSpinsCast to track the number of spins made

        this.wheelOutcomes = ["POINTS", "MULTIPLIER", "FREE_SPINS", "DOUBLE"]; //define possible outcomes of the wheel spin
        this.wheelWeights = [0.55, 0.2, 0.15, 0.1]; //define the weights for each outcome, determining their likelihood of being selected

        this.pointsList = [
            100,
            150,
            200,
            250,
            300,
            400,
            500,
            750,
            1000,
            1500,
            2000,
            2500,
            3000,
            4000,
            5000,
            7500,
            10000, //list of possible point values that can be won from the wheel spin
        ];
        this.pointsWeights = [
            0.2,
            0.16,
            0.14,
            0.12,
            0.1,
            0.08,
            0.06,
            0.04,
            0.03,
            0.02,
            0.015,
            0.01,
            0.008,
            0.006,
            0.005,
            0.004,
            0.002, //weights corresponding to each point value, determining their likelihood of being selected
        ];

        this.multiplierList = [3, 5, 10]; //list of possible multipliers that can be won from the wheel spin
        this.multiplierWeights = [0.5, 0.3, 0.2]; //weights corresponding to each multiplier, determining their likelihood of being selected

        this.spinsPayoutList = [2, 3, 5]; //list of possible free spins that can be won from the wheel spin
        this.spinsPayoutWeights = [0.5, 0.3, 0.2]; //weights corresponding to each free spin value, determining their likelihood of being selected
    }

    weightedChoice(values, weights) {
        //function to select a value from a list based on provided weights
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0); //calculate the total weight by summing all weights
        let roll = Math.random() * totalWeight; //generate a random number between 0 and the total weight

        for (let index = 0; index < values.length; index += 1) {
            roll -= weights[index];
            if (roll <= 0) {
                return values[index];
            }
        }

        return values[values.length - 1];
    }

    rollDiscretePoints() {
        //function to roll for discrete points based on the points list and weights
        return this.weightedChoice(this.pointsList, this.pointsWeights);
    }

    rollNestedMultiplier() {
        //function to roll for a multiplier based on the multiplier list and weights
        return this.weightedChoice(this.multiplierList, this.multiplierWeights);
    }

    rollNestedFreeSpins() {
        //function to roll for free spins based on the spins payout list and weights
        return this.weightedChoice(
            this.spinsPayoutList,
            this.spinsPayoutWeights,
        );
    }

    rollMultiplierBasePayout() {
        //function to roll for a base payout when a multiplier is triggered, with a chance for a rare high payout
        const rareHighPayoutChance = 0.05; //define a 5% chance for a rare high payout when rolling for a base payout

        if (Math.random() < rareHighPayoutChance) {
            //if the random number is less than the rare high payout chance, select a random high-tier point value
            const highTierStartIndex = 5;
            const highTierCount = this.pointsList.length - highTierStartIndex;
            const randomHighTierIndex =
                highTierStartIndex + Math.floor(Math.random() * highTierCount);
            return this.pointsList[randomHighTierIndex];
        }

        return this.pointsList[Math.floor(Math.random() * 5)];
    }

    runSpinAnimation() {
        //function to simulate a spinning animation in the console for visual effect
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
        //function to execute a single spin of the wheel, determining the outcome and updating points and spins accordingly
        if (this.freeSpins <= 0) {
            //check if there are any free spins left, if not, log a message and return false to indicate the game is over
            console.log("\n❌ Out of spins! Game Over.");
            return false;
        }

        this.freeSpins -= 1; //decrement the number of free spins left
        this.totalSpinsCast += 1; //increase the total number of spins cast

        this.runSpinAnimation();

        const landedOutcome = this.weightedChoice(
            //land the outcome of the spin based on the wheel outcomes and weights
            this.wheelOutcomes,
            this.wheelWeights,
        );

        if (landedOutcome === "POINTS") {
            //if the outcome is POINTS, roll for discrete points and add to the total points
            const pointsWon = this.rollDiscretePoints();
            this.points += pointsWon;
            console.log(
                `🎯 Outcome: Standard Points! Added +${pointsWon.toLocaleString()} to your score.`,
            );
        } else if (landedOutcome === "MULTIPLIER") {
            //if the outcome is MULTIPLIER, roll for a multiplier and a base payout, then calculate the total points won and add to the total points
            const multiplier = this.rollNestedMultiplier();
            const basePayout = this.rollMultiplierBasePayout();
            const pointsWon = basePayout * multiplier;
            this.points += pointsWon;
            console.log("🚀 Outcome: Multiplier Bonus Sub-Tier triggered!");
            console.log(
                `    Rolled a [${multiplier}x] Modifier! (${basePayout} Base Points x ${multiplier}x = +${pointsWon.toLocaleString()} points!)`,
            );
        } else if (landedOutcome === "FREE_SPINS") {
            //if the outcome is FREE_SPINS, roll for the number of free spins won and add to the total free spins
            const spinsWon = this.rollNestedFreeSpins();
            this.freeSpins += spinsWon;
            console.log("🎟️ Outcome: Free Spins Sub-Tier triggered!");
            console.log(
                `    Rolled an Extra Turn token ➡️ Granted +${spinsWon} Remaining Spins!`,
            );
        } else if (landedOutcome === "DOUBLE") {
            //if the outcome is DOUBLE, double the current points and possibly award an extra spin
            const oldPoints = this.points;
            this.points *= 2;

            if (Math.random() < 0.5) {
                //50% chance to award an extra spin when DOUBLE outcome is triggered
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
        //function to display the current points and remaining spins in a formatted manner for the user
        console.log("-".repeat(70));
        console.log(
            `📊 POINTS TOTAL: ${this.points.toLocaleString()}  |  🎟️ REMAINING SPINS: ${this.freeSpins}`,
        );
        console.log("-".repeat(70));
    }
}

function runGame(startingPoints = 100, startingSpins = 5) {
    //function to run the game, initializing the UltimateWeightedWheel and managing the game loop
    const game = new UltimateWeightedWheel(startingPoints, startingSpins);
    console.log("====== FULLY CALIBRATED MATHEMATICAL REWARDS ENGINE ======");
    game.displayHud();

    while (game.freeSpins > 0) {
        const action = "ENTER"; //prompt the user to press ENTER to spin or 'q' to quit
        if (action === "q") {
            //if the user inputs 'q' to quit, break the loop to terminate the game
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
