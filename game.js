import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { startLobbyCallback } from './server.js';

class Player {
  constructor() {
    this.hp = 100;
    this.maxHp = 100;
    this.atkPower = 20;
    this.potion = 20;
  }
  usePotion() {
    // 포션을 사용할 때 랜덤으로 회복량을 결정
    const uspt = Math.round(Math.random() * this.potion) + 15;

    // 포션을 사용하면 공격력이 감소
    this.atkPower -= 0.2;

    // 체력을 회복하되, 최대 체력을 넘지 않도록 처리
    if (this.hp < this.maxHp) {
      this.hp += uspt;
      return uspt; // 회복된 체력을 반환
    }
  }

  attack() {
    // 플레이어의 공격
    const attackdamage = Math.round(Math.random() * this.atkPower) + 5;
    return attackdamage;
  }

  ComboAttack() {
    // 70% 확률로 두 번 공격, 30% 확률로 실패
    const rand = Math.random(); // 0~1 사이의 랜덤 숫자 생성

    if (rand <= 0.7) {
      // 70% 확률
      const combodamage1 = this.attack(); // 첫 번째 공격
      const combodamage2 = this.attack(); // 두 번째 공격
      const totalDamage = combodamage1 + combodamage2; // 두 번의 공격을 합산
      return totalDamage;
    } else {
      // 30% 확률로 실패
      return 0;
    }
  }
}
let a = b;
class Monster {
  constructor(stage) {
    this.hp = 100;
    this.maxHp = 100;
    this.MonsterAtkPower = 8;
    this.incStates(stage); // 스테이지에 상승에 따른 몬스터 강화
  }

  incStates(stage) {
    this.hp += (stage - 1) * 15; // 스테이지마다 HP 증가
    this.maxHp += (stage - 1) * 15; // 최대 HP 증가
    this.MonsterAtkPower += (stage - 1) * 10; // 공격력 증가
  }

  attack() {
    // 몬스터의 공격
    const MosterAttackdamage = Math.round(Math.random() * this.MonsterAtkPower) + 5;
    return MosterAttackdamage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(
        `| 플레이어 HP: ${player.hp} /${player.maxHp} 플레이어 공격력: ${Math.round(player.atkPower * 10) / 10}`,
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
        `\n1. 공격한다 2. 연속공격(70% 확률로 두 번 공격) 3. 악마의 포션 사용(랜덤 체력회복, 플레이어 공격력 0.2 감소) 4. 반격하기(50% 확률로 적의 공격을 막고 반격) 5. 도망치기 `,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');
    const choose = function (a) {
      if (a === '1') {
        return '공격하기';
      } else if (a === '2') {
        return '연속공격';
      } else if (a === '3') {
        return '악마의 포션 사용';
      } else if (a === '4') {
        return '반격하기';
      } else if (a === '5') {
        return '도망치기';
      }
    };

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
        player.hp -= MonsterAtk;
        logs.push(chalk.blueBright(`당신은 ${MonsterAtk}만큼의 피해를 받았습니다!!!`));
      }

      if (monster.hp <= 0) {
        logs.push(chalk.red(`몬스터가 쓰러졌습니다!`));
        return true; // 몬스터가 죽으면 true 반환
      }

      if (player.hp <= 0) {
        logs.push(chalk.red(`플레이어가 쓰러졌습니다! 패배했습니다.`));
        return false; // 플레이어가 죽으면 false 반환
      }
    } else if (choice === '2') {
      const playercomboAtk = player.ComboAttack();

      if (player.hp > 0) {
        monster.hp -= playercomboAtk;
        if (playercomboAtk === 0) {
          logs.push(chalk.yellow(`연속공격 실패! 몬스터에게 피해를 입히지 못했습니다!`));
        } else {
          logs.push(
            chalk.yellow(`연속공격 성공! 몬스터에게 ${playercomboAtk}만큼의 피해를 입혔습니다!`),
          );
        }
      }
      const MonsterAtk = monster.attack();
      if (monster.hp > 0) {
        player.hp -= MonsterAtk;
        logs.push(chalk.blueBright(`당신은 ${MonsterAtk}만큼의 피해를 받았습니다!!!`));
      }

      if (monster.hp <= 0) {
        logs.push(chalk.red(`몬스터가 쓰러졌습니다!`));
        return true; // 몬스터가 죽으면 true 반환
      }

      if (player.hp <= 0) {
        logs.push(chalk.red(`플레이어가 쓰러졌습니다! 패배했습니다.`));
        return false; // 플레이어가 죽으면 false 반환
      }
    } else if (choice === '3') {
      const playerPotion = player.usePotion();

      if (playerPotion > 0) {
        if (player.hp > player.maxHp) {
          player.hp = player.maxHp;
          logs.push(
            chalk.yellow(
              `체력을 ${playerPotion}만큼 회복했지만, 최대체력 이상으로 회복할 수는 없습니다! - 공격력이 감소되었습니다.`,
            ),
          );
        } else {
          logs.push(
            chalk.yellow(
              `악마의 포션을 사용하여 ${playerPotion}만큼의 체력을 회복했습니다! - 공격력이 감소되었습니다.`,
            ),
          );
        }
      }

      const monsterAtk = monster.attack();
      if (monster.hp > 0) {
        player.hp -= monsterAtk;
        logs.push(chalk.blueBright(`당신은 ${monsterAtk}만큼의 피해를 받았습니다!!!`));
      }

      if (player.hp <= 0) {
        logs.push(chalk.red(`플레이어가 쓰러졌습니다! 패배했습니다.`));
        return false; // 플레이어가 죽으면 false 반환
      }
    } else if (choice === '4') {
      const rand = Math.random();

      let mon1;
      let mon2;

      function counter() {
        if (rand <= 0.5) {
          mon1 = monster.attack(); // 몬스터의 기본 공격 피해를 받음
          return mon1;
        } else {
          mon2 = monster.attack() * 2; // 몬스터의 공격 피해 두 배
          return mon2;
        }
      }

      let conterseed = counter();

      if ((conterseed = mon1)) {
        player.hp -= conterseed;
        logs.push(chalk.yellow(`반격에 실패하여 ${conterseed}만큼의 피해를 받았습니다!`));
      } else if ((conterseed = mon2)) {
        monster.hp -= conterseed;
        logs.push(
          chalk.yellow(`반격에 성공하여 몬스터에게 ${conterseed}만큼의 피해를 주었습니다!!`),
        );
      }

      if (monster.hp <= 0) {
        logs.push(chalk.red(`몬스터가 쓰러졌습니다!`));
        return true; // 몬스터가 죽으면 true 반환
      }

      if (player.hp <= 0) {
        logs.push(chalk.red(`플레이어가 쓰러졌습니다! 패배했습니다.`));
        return false; // 플레이어가 죽으면 false 반환
      }
    } else if (choice === '5') {
      let chooserun = readlineSync.keyInYNStrict('정말 도망치시겠습니까?');
      if (chooserun) {
        readlineSync.keyInPause(chalk.red('당신은 비겁하게 도망쳤습니다. 로비로 이동합니다.'));
        return 'runback'; // 도망친 경우 'runback' ->startGame으로 이동
      } else {
        readlineSync.keyInPause(
          chalk.yellow('당신은 도망가지 않았습니다!! 다시 전투를 진행합니다...'),
        );
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

    if (result === 'runback') {
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

    let playerIncHp = 30;
    let playerIncAtk = 7;
    let playerIncPos = 5;

    player.hp += playerIncHp; // 플레이어 HP 증가
    player.maxHp += playerIncHp;
    player.atkPower += playerIncAtk; // 플레이어 공격력 증가
    player.potion += playerIncPos;
    // 스테이지 클리어 및 게임 종료 조건

    let monsterIncHp = 15;
    let monsterIncAtk = 10;

    console.clear();
    readlineSync.keyInPause(
      `몬스터를 처치했습니다!\n${chalk.yellow(`플레이어의 체력이 ${playerIncHp}, 공격력이 ${playerIncAtk}만큼 증가했습니다!`)}\n${chalk.red(`새로운 몬스터의 체력이 ${monsterIncHp}, 공격력이 ${monsterIncAtk}만큼 강화됩니다!!`)} `,
    );

    stage++;
  }

  console.log(chalk.green('게임이 종료되었습니다.'));
  startLobbyCallback(); // 게임이 종료되면 로비 화면으로 돌아가기
}
