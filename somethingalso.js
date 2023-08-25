//bloat
class Player {
  constructor() {
    this.scySalveRoll = 35044;
    this.scySalveMax = [57, 28, 14];
    this.scyPneckRoll = 29204;
    this.scyPneckMax = [48, 24, 12];
    this.clawRoll = 25568;
    this.clawMax = 51;
    this.challyRoll = 35044;
    this.challyMax = 75;
    this.bgsRoll = 38978 * 2;
    this.bgsMax = 89;
    this.humid = false;
    this.playerTick = 0;
    this.specBar = 100;
  }
}

const player1 = new Player();
player1.name = 'player1'
const player2 = new Player();
player2.name = "player2";
const player3 = new Player();
player3.name = "player3";
const player4 = new Player();
player4.name = "player4";
const player5 = new Player();
player5.name = "player5";

//accuracy formula
const accuracy = (attackRoll, DefenseRoll) => {
  let hitChance;
  if (attackRoll > DefenseRoll) {
    hitChance = 1 - (DefenseRoll + 2) / (2 * (attackRoll + 1));
  } else {
    hitChance = attackRoll / (2 * (DefenseRoll + 1));
  }
  return hitChance;
};

//damage formulas
const scySwing = (acc, max, size = 3) => {
  let damage = 0;
  if (Math.random() <= acc) {
    damage += Math.floor(Math.random() * (max[0] + 1));
  }
  if (Math.random() <= acc) {
    damage += Math.floor(Math.random() * (max[1] + 1));
  }
  if (Math.random() <= acc && size > 2) {
    damage += Math.floor(Math.random() * (max[2] + 1));
  }
  return damage;
};

const challySpec = (acc, max) => {
  let damage = 0;
  const secondAcc = acc * 0.75;
  if (Math.random() <= acc) {
    damage += Math.floor(Math.random() * (max + 1));
  }
  if (Math.random() <= secondAcc) {
    damage += Math.floor(Math.random() * (max + 1));
  }
  return damage;
};

const clawSpec = (acc, max) => {
  let damage = 0;
  //first roll
  if (Math.random() <= acc) {
    let newMax = max - 1;
    const hit = Math.floor(
      Math.random() * (newMax - Math.floor(max / 2) + 1) + Math.floor(max / 2)
    );
    damage += hit; //first
    damage += Math.floor(hit / 2); //second
    damage += 2 * Math.floor(Math.floor(hit / 2) / 2); //third & 4th
    damage += Math.random() < 0.5 ? 1 : 0; //extra
  }
  //second roll
  else if (damage === 0 && Math.random() <= acc) {
    const hit = Math.floor(
      Math.random() *
        (Math.floor((max * 7) / 8) - Math.floor((max * 3) / 8 + 1)) +
        Math.floor((3 / 8) * max)
    );
    damage += hit; //first
    damage += 2 * Math.floor(hit / 2); //second & third
    damage += Math.random() < 0.5 ? 1 : 0; //extra
  }
  //third roll
  else if (damage === 0 && Math.random() <= acc) {
    const hit = Math.floor(
      Math.random() *
        (Math.floor((max * 3) / 4) - Math.floor((max * 1) / 4) + 1) +
        Math.floor((1 / 4) * max)
    );
    damage += 2 * hit; //first & second
    damage += Math.random() < 0.5 ? 1 : 0; //extra
  }
  //fourth roll
  else if (damage === 0 && Math.random() <= acc) {
    const hit = Math.floor(
      Math.random() *
        (Math.floor((max * 5) / 4) - Math.floor((max * 1) / 4) + 1) +
        Math.floor((max * 1) / 4)
    );
    damage = hit;
  }
  //fifth roll
  else if (damage === 0 && Math.random() <= 0.5) {
    damage += 2;
  }
  return damage;
};

const bgsSpec = (acc, max) => {
  let damage = 0;
  if (Math.random() <= acc) {
    damage += Math.floor(Math.random() * (max + 1));
  }
  return damage;
};

//half damage formula
const halfDamage = (damage) => Math.floor(damage / 2);

const halfScy = (acc, max, size = 3) => {
  let first = 0;
  let second = 0;
  let third = 0;
  if (Math.random() <= acc) {
    first += Math.floor(Math.random() * (max[0] + 1));
  }
  if (Math.random() <= acc) {
    second += Math.floor(Math.random() * (max[1] + 1));
  }
  if (Math.random() <= acc && size > 2) {
    third += Math.floor(Math.random() * (max[2] + 1));
  }
  return Math.floor(first / 2) + Math.floor(second / 2) + Math.floor(third / 2);
};

let salveHumid = !true; //true = salve flicking , !true = not salve flicking
let log = true //true = turn on console logs for debugging)


function bloat() {
  const team = [player1, player2, player3, player4, player5];
  player1.tick = 19; //back on bloat tick
  player2.tick = 100; //bandaid fix
  player3.tick = 100; //bandaid fix
  player4.tick = 100; //bandaid fix
  player5.tick = 100; //bandaid fix
  player2.humid = true;
  player3.humid = true;
  team.forEach((player) => (player.specBar = 100));
  let bloatHP = 2000;
  let bloatDef = 100;
  let bloatRoll = (bloatDef + 9) * (20 + 64);
  let roomTimer = 0;
  let walkTimer = 0;
  let downTimer = 32;
  let defRegen = 5;
  let down = false;
  let downCooldown = 0;
  let turnCooldown = 0;
  let continueOuterLoop = true;
  //WALKING
  while (!down) {
    roomTimer++;
    walkTimer++;
    downCooldown--;
    turnCooldown--;
    //Turn Logic
    if (walkTimer >= 32 && Math.random() <= 0.0625) {
      if (turnCooldown <= 0) {
        if (log) {console.log(`bloat turned on ${roomTimer}`) }
        
        turnCooldown = 32; //CAN ONLY TURN EVERY 32+ TICKS
        downCooldown = 5; //CANT DOWN WITHIN 5TICKS OF DOWN
      }
    }
    //Down Logic
    if (walkTimer >= 39 && downCooldown <= 0) {
      if (walkTimer >= 47) {
        down = true;
        if (log) { console.log(`bloat went down on ${roomTimer}`) }
      } else if (Math.random() <= 0.25) {
        down = true;
        if (log) { console.log(`bloat went down on ${roomTimer}`) }
      }
    }
    //Def Regen
    if (bloatDef < 100) {
      defRegen--;
      if (defRegen === 0) {
        bloatDef++;
        defRegen = 5;
      }
    }

    //player1
    if (roomTimer === 2) {
      //first bgs
      let bgs = bgsSpec(accuracy(player1.bgsRoll, bloatRoll), player1.bgsMax);
      bloatHP -= halfDamage(bgs);
      bloatDef -= bgs;
      player1.specBar -= 50;
      // player1.tick += 6;
      if (log) { console.log(`p1 bgs - HP ${bloatHP} - DEF ${bloatDef}  on tick ${roomTimer}`) }
    }
    if (roomTimer === 8) {
      //hit from backside
      if (bloatDef >= 30) {
        let bgs = bgsSpec(accuracy(player1.bgsRoll, bloatRoll), player1.bgsMax);
        bloatHP -= halfDamage(bgs);
        bloatDef -= bgs;
        player1.specBar -= 50;
        if (bloatDef < 0) {
          bloatDef = 0;
        }
        if (log) { console.log(`p1 bgs - HP ${bloatHP} - DEF ${bloatDef}  on tick ${roomTimer}`) }
      } else {
        bloatHP -= halfScy(
          accuracy(player1.scySalveRoll, bloatRoll),
          player1.scySalveMax
        );
        if (log) { console.log(`p1 salve scy - HP ${bloatHP} - DEF ${bloatDef}  on tick ${roomTimer}`) }
      }
    }

    //player2 humid
    if (roomTimer === 7) {
      let bgs = bgsSpec(accuracy(player2.bgsRoll, bloatRoll), player2.bgsMax);
      bloatHP -= halfDamage(bgs);
      bloatDef -= bgs;
      player2.specBar -= 50;
      if (bloatDef < 0) {
        bloatDef = 0;
      }
      player2.tick = 13;
      if (log) { console.log(`p2 bgs - HP ${bloatHP} - DEF ${bloatDef} on tick ${roomTimer}`) }
    }

    //player3 humid
    if (roomTimer === 7) {
      let bgs = bgsSpec(accuracy(player3.bgsRoll, bloatRoll), player3.bgsMax);
      bloatHP -= halfDamage(bgs);
      bloatDef -= bgs;
      player3.specBar -= 50;
      if (bloatDef < 0) {
        bloatDef = 0;
      }
      player3.tick = 13;
      if (log) { console.log(`p3 bgs - HP ${bloatHP} - DEF ${bloatDef} on tick ${roomTimer}`) }
    }

    team.forEach((player) => {
      if (player.tick === roomTimer) {
        if (player.humid) {
          //is humidify player
          if (salveHumid) {
            //is humid salve flicking
            bloatHP -= halfScy(
              accuracy(player.scySalveRoll, bloatRoll),
              player.scySalveMax
            );
            player.tick += 5;
            if (log) { console.log(`humid salve scy - HP ${bloatHP} on tick ${roomTimer}`) }
          } else {
            //is not humid salve flicking
            bloatHP -= halfScy(
              accuracy(player.scyPneckRoll, bloatRoll),
              player.scyPneckMax
            );
            player.tick += 5;
            if (log) { console.log(`humid pneck scy - HP ${bloatHP} on tick ${roomTimer}`) }
          }
        } else {
          //is not humidify player
          if (Math.random() < 0.2) {
            //salve flick 20% of scy swings
            bloatHP -= halfScy(
              accuracy(player.scySalveRoll, bloatRoll),
              player.scySalveMax
            );
            player.tick += 5;
            if (log) { console.log(`non-humid salve scy - HP ${bloatHP} on tick ${roomTimer}`) }
          } else {
            //did not salve flick
            bloatHP -= halfScy(
              accuracy(player.scyPneckRoll, bloatRoll),
              player.scyPneckMax
            );
            player.tick += 5;
            if (log) { console.log(`non-humid pneck scy - HP ${bloatHP} on tick ${roomTimer}`) }
          }
        }
      }
    });

    if (!down) {
      if (log) { console.log(`bloat is walking on ${roomTimer} - DEF ${bloatDef}`) }
    }
  }

  //DOWN
  while (down) {
    player4.tick = roomTimer + 3; //first hit tick 29 of down
    player5.tick = roomTimer + 3; //first hit tick 29 of down
    while (downTimer > 0 && continueOuterLoop) {
      team.forEach((player) => {
        if (player.tick === roomTimer) {
          if (downTimer <= 15 && player.specBar >= 50) {
            //claws
            bloatHP -= clawSpec(
              accuracy(player.clawRoll, bloatRoll),
              player.clawMax
            );
            player.tick += 4;
            player.specBar -= 50;
            if (log) { console.log(`${player.name} claw spec on ${downTimer} - HP ${bloatHP} - DEF ${bloatDef}`) }
          } else {
            bloatHP -= scySwing(
              accuracy(player.scySalveRoll, bloatRoll),
              player.scySalveMax
            );
            player.tick += 5;
            if (log) { console.log(`${player.name} scy swing on ${downTimer} - HP ${bloatHP} - DEF ${bloatDef}`) }
          }
        }
      });
      if ((downTimer + 2) % 4 === 0) {
        //thralls
        bloatHP -= Math.floor(Math.random() * 4);
        bloatHP -= Math.floor(Math.random() * 4);
        bloatHP -= Math.floor(Math.random() * 4);
      }
      if (log) { console.log(`roomTime : ${roomTimer} - downTime ${downTimer}`) }
      if (bloatHP <= 0) {
        if (downTimer === 2) {
          if (log) { console.log(`bloat was killed same tick as stomp on ${roomTimer}`) }
          continueOuterLoop = false;
        } else if (downTimer > 2) {
          if (log) { console.log(`bloat was killed before the stomp on ${roomTimer}`) }
          continueOuterLoop = false;
        } else if (downTimer < 2) {
          if (log) { console.log(`bloat was killed after the stomp, before the walk, on ${roomTimer}`) }
          continueOuterLoop = false;
        }
      }
      roomTimer++;
      downTimer--;
      if (downTimer <= 3) {
        bloatDef = 100;
      } else if (bloatDef < 100) {
        defRegen--;
        if (defRegen === 0) {
          bloatDef++;
          defRegen = 5;
        }
      }
      //Stands up
      if (downTimer === 0 && bloatHP > 0) {
        if (log) { console.log(`bloat stands up at ${roomTimer} \n player ticks : ${player1.tick}, ${player2.tick}, ${player3.tick}, ${player4.tick}, ${player5.tick}`) }
        down = false;
      }
    }
    if (bloatHP <= 0) {
      roomTimer += 2;
      if (log) { console.log(`Room Ends on ${roomTimer}`) }
      break;
    }
  }

  //swing last tick of the down full damage + tick after half damage | requires sbs on neckers or guthix rest
  const standUpTick = roomTimer;
  if (bloatHP > 0) {
    while (roomTimer < (standUpTick + 1) && bloatHP > 0) {
      team.forEach(player => {
        if (player.tick === standUpTick) {
          bloatHP -= scySwing(accuracy(player.scySalveRoll, bloatRoll), player.scySalveMax)
          player.tick += 5;
          if (log) { console.log(`${player.name} scy swing on last tick of full damage - ${bloatHP} - ${bloatDef}`) }
          if (bloatHP <= 0) {
            if (log) { console.log(`bloat was killed last tick of the down on ${roomTimer}, room ends on ${roomTimer + 3}`) }
            roomTimer += 2;
          }
        }
        else if (player.tick === standUpTick + 1) {
          bloatHP -= halfScy(accuracy(player.scySalveRoll, bloatRoll), player.scySalveMax);
          player.tick += 5;
          if (log) { console.log(`${player.name} scy swing after down on half damage - ${bloatHP} - ${bloatDef}`) }
          if (bloatHP <= 0) {
            if (log) { console.log(`bloat was killed the tick after the down on ${roomTimer}, room ends on ${roomTimer + 3}`) }
            roomTimer += 2;
          }
        }
        roomTimer++;
      })
    }
  }

  return [bloatHP <= 0, roomTimer];
}
bloat()

// let downs = 0;
// let killtimes = 0;
// let killarray = [];
// let sims = 1000000;

// for (i = 0; i < sims; i++) {
//   let bloated = bloat();
//   if (bloated[0]) {
//     downs++;
//     killarray.push(bloated[1]);
//   }
// }

// function countOccurrences(array) {
//   const countObject = {};

//   array.forEach((value) => {
//     if (countObject[value]) {
//       countObject[value]++;
//     } else {
//       countObject[value] = 1;
//     }
//   });

//   return countObject;
// }

// let resultArray = countOccurrences(killarray);

// console.log(downs / sims);
// console.log(resultArray);
