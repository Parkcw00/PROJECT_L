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
        this.MonsterAtkPower = 10;
    }

    attack() {
        // 몬스터의 공격
        const MosterAttackdamage = Math.round(Math.random() * this.MonsterAtkPower) + 7;
        return MosterAttackdamage
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
            `| 몬스터 HP: ${monster.hp} / 100 |  몬스터 공격력: ${monster.MonsterAtkPower}`,
        ),
    );
    console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
    let logs = [];


    while (player.hp > 0 && monster.hp > 0) {
        console.clear();
        displayStatus(stage, player, monster);

        logs.forEach((log) => console.log(log));

        console.log(
            chalk.green(
                `\n1. 공격한다 2. 도망친다 `,
            ),
        );
        const choice = readlineSync.question('당신의 선택은? ');

        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

        if (choice === '1') {
            const playerAtk = player.attack();
            monster.hp -= playerAtk;
            logs.push(chalk.yellow(`몬스터에게 ${playerAtk}만큼의 피해를 입혔습니다!`));

            const MonsterAtk = monster.attack();
            player.hp -= MonsterAtk
            logs.push(chalk.blueBright(`당신은 ${MonsterAtk}만큼의 피해를 받았습니다!!!`));

            if (monster.hp <= 0) {
                logs.push(chalk.red(`몬스터가 쓰러졌습니다!`));
                return true; // 몬스터가 죽으면 true 반환
            }
        }

        if (player.hp <= 0) {
            logs.push(chalk.red(`플레이어가 쓰러졌습니다! 패배했습니다.`))
            return false; // 플레이어가 죽으면 false 반환
        }
    }

};

export async function startGame() {
    console.clear();
    const player = new Player();
    let stage = 1;

    while (stage <= 10) {

        const monster = new Monster(stage);
        const result = await battle(stage, player, monster);

        if (result === false) {
            console.clear();
            console.log(chalk.red('게임 오버! 다시 도전해보세요.'));
            // 플레이어가 죽으면 게임 종료
        }

        // 스테이지 클리어 및 게임 종료 조건

        stage++;
    }
    console.log(chalk.green('게임이 종료되었습니다.'));
}