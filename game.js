import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
    constructor() {
        this.hp = 100;
        this.atkPower = 20;
    }

    attack() {
        // 플레이어의 공격
        const attackdamage = Math.round(Math.random() * this.atkPower) + 5;
        return attackdamage
    }
}

class Monster {
    constructor() {
        this.hp = 100;
    }

    attack() {
        // 몬스터의 공격
    }
}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(
            `| 플레이어 HP: ${player.hp} /100  플레이어 공격력: ${player.atkPower}`,
        ) +
        chalk.redBright(
            `| 몬스터 HP: ${monster.hp} / 100 |`,
        ),
    );
    console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
    let logs = [];


    while (player.hp > 0) {
        console.clear();
        displayStatus(stage, player, monster);

        logs.forEach((log) => console.log(log));

        console.log(
            chalk.green(
                `\n1. 공격한다 2. 도망친다 `,
            ),
        );
        const choice = readlineSync.question('당신의 선택은? ');
        if (choice === '1') {
            const playerAtk = player.attack();
            monster.hp -= playerAtk;
            logs.push(chalk.yellow(`몬스터에게 ${playerAtk}만큼의 피해를 입혔습니다!`));

            if (monster.hp <= 0) {
                logs.push(chalk.red(`몬스터가 쓰러졌습니다!`));
                break;
            }
        }


        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    }

};

export async function startGame() {
    console.clear();
    const player = new Player();
    let stage = 1;

    while (stage <= 10) {
        const monster = new Monster(stage);
        await battle(stage, player, monster);

        // 스테이지 클리어 및 게임 종료 조건

        stage++;
    }
}