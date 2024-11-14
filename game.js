import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { startLobbyCallback } from './server.js';


class Player {
    constructor() {
        this.hp = 100;
        this.maxHp = 100;
        this.atkPower = 20;
    }

    attack() {
        // 플레이어의 공격
        const attackdamage = Math.round(Math.random() * this.atkPower) + 5;
        return attackdamage
    }
}

class Monster {
    constructor(stage) {
        this.hp = 100;
        this.maxHp = 100;
        this.MonsterAtkPower = 8;
        this.incStates(stage);  // 스테이지에 상승에 따른 몬스터 강화
    }

    incStates(stage) {
        this.hp += (stage - 1) * 15;  // 스테이지마다 HP 증가
        this.maxHp += (stage - 1) * 15;  // 최대 HP 증가
        this.MonsterAtkPower += (stage - 1) * 5;  // 공격력 증가
    }


    attack() {
        // 몬스터의 공격
        const MosterAttackdamage = Math.round(Math.random() * this.MonsterAtkPower) + 5;
        return MosterAttackdamage
    }
}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(
            `| 플레이어 HP: ${player.hp} /${player.maxHp} 플레이어 공격력: ${player.atkPower}`,
        ) +
        chalk.redBright(
            `| 몬스터 HP: ${monster.hp} / ${monster.maxHp} |  몬스터 공격력: ${monster.MonsterAtkPower}`,
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
        const choose = function (a) {
            if (a === '1') {
                return '공격하기';
            } else if (a === '2') {
                return '도망치기';
            }
        }

        logs = [];

        logs.push(chalk.green(`\n당신은 ${choose(choice)}(을)를 선택하셨습니다.`));

        if (choice === '1') {

            const playerAtk = player.attack();
            if (player.hp > 0) {
                monster.hp -= playerAtk;
                logs.push(chalk.yellow(`몬스터에게 ${playerAtk}만큼의 피해를 입혔습니다!`));
            }
            const MonsterAtk = monster.attack();
            if (monster.hp > 0) {
                player.hp -= MonsterAtk
                logs.push(chalk.blueBright(`당신은 ${MonsterAtk}만큼의 피해를 받았습니다!!!`));
            }

            if (monster.hp <= 0) {
                logs.push(chalk.red(`몬스터가 쓰러졌습니다!`));
                return true; // 몬스터가 죽으면 true 반환
            }


            if (player.hp <= 0) {
                logs.push(chalk.red(`플레이어가 쓰러졌습니다! 패배했습니다.`))
                return false; // 플레이어가 죽으면 false 반환
            }

        } else if (choice === '2') {
            let chooserun = readlineSync.keyInYNStrict('정말 도망치시겠습니까?');
            if (chooserun) {
                readlineSync.keyInPause(chalk.red('당신은 비겁하게 도망쳤습니다. 로비로 이동합니다.'));
                return 'escape'; // 도망친 경우 'escape' 반환
            } else {
                readlineSync.keyInPause(chalk.yellow('당신은 도망가지 않았습니다!! 다시 전투를 계속합니다...'));
                return battle(stage, player, monster);
            }
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

        if (result === 'escape') {
            startLobbyCallback(); // 도망쳤으면 로비 화면으로 돌아가게 함
            return;
        }

        if (result === false) {
            console.clear();
            console.log(chalk.red('당신은 패배했습니다! 다시 도전해보세요.'));
            readlineSync.keyInPause();
            startLobbyCallback(); // 도망쳤으면 로비 화면으로 돌아가게 함
            // 플레이어가 죽으면 게임 종료
            return;

        }

        player.hp += 30;  // 플레이어 HP 증가 
        player.maxHp += 30;
        player.atkPower += 5;  // 플레이어 공격력 증가     
        // 스테이지 클리어 및 게임 종료 조건

        monster.hp += 15;  // 몬스터 HP 증가 
        monster.maxHp += 15;
        monster.atkPower += 5; // 몬스터 공격력 증가 

        stage++;
    }

    console.log(chalk.green('게임이 종료되었습니다.'));
    startLobbyCallback(); // 게임이 종료되면 로비 화면으로 돌아가기


}

