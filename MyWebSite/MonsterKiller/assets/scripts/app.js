const ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 22;
const MONSTER_ATTACK_VALUE = 19;
const HEAL_VALUE = 19;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

function getMaxLifeValue(){
const enteredValue = prompt('Maximální počet životů pro tebe a pro monstrum' , '100')

const parsedValue = parseInt(enteredValue);
    if(isNaN(parsedValue) || parsedValue <= 0){
        throw {
            message: 'Uživatel to posral a nenapsal tam číslo'
        };
    }
    return parsedValue;
}

let chosenMaxLife;

try{
    chosenMaxLife = getMaxLifeValue();
}catch(error){
    console.log(error);
    chosenMaxLife = 100;
    alert('Debile, máš tam napsat číslo, teď to budeš mít nastavené a 100.');
}
let actuallMonsterHealth = chosenMaxLife;
let actuallPlayerHealth = chosenMaxLife;
let bonusLife = true;
let battleLog = [];
let lastLoggedEntry;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth){
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    switch (ev){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MOSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
                event: ev,
                value: val,
                target: 'MONSTER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
                event: ev,
                value: val,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
                event: ev,
                value: val,
                target: 'PLAYER',
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event: ev,
                value: val,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        default: 
            logEntry= {};
    }
   /* if(ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry.target = 'MONSTER';
    }else if(ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
        logEntry.target = 'MONSTER';
    }else if(ev === LOG_EVENT_MONSTER_ATTACK){
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }else if(ev === LOG_EVENT_PLAYER_HEAL){
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }else if(ev === LOG_EVENT_GAME_OVER){
        logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }*/
    battleLog.push(logEntry);
}

function reset(){
    actuallMonsterHealth = chosenMaxLife;
    actuallPlayerHealth = chosenMaxLife;  
    resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = actuallPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    actuallPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        actuallMonsterHealth,
        actuallPlayerHealth
        );

    if (actuallPlayerHealth <= 0 && bonusLife){
        bonusLife = false;
        removeBonusLife();
        actuallPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('Máš druhou šanci díky bonusovému životu');
    }

    if (actuallMonsterHealth <= 0 && actuallPlayerHealth > 0){
        alert('Porazil jsi monstrum');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'VYHRÁL JSI',
            actuallMonsterHealth,
            actuallPlayerHealth
            );
       }else if (actuallPlayerHealth <= 0 &&actuallMonsterHealth > 0){
        alert('Monstrum tě porazilo');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PROHRÁL JSI',
            actuallMonsterHealth,
            actuallPlayerHealth
            );
       }else if(actuallPlayerHealth <=0 && actuallMonsterHealth <= 0){
        alert('Porazili jste se vzájemně, takže remíza');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'REMÍZA',
            actuallMonsterHealth,
            actuallPlayerHealth
            );
       }
    if (actuallMonsterHealth <= 0 ||actuallPlayerHealth <= 0){
        reset();
    }
}

function attacks(mode){
    let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE; //ternární operator(místo používání if(?) a else (:), to lze napsat pomocí otazníku a dvojtečky)
    let logEvent = mode === MODE_ATTACK ? 
        LOG_EVENT_PLAYER_ATTACK :
        LOG_EVENT_PLAYER_STRONG_ATTACK;
   /* if (mode === MODE_ATTACK){
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    }else if(mode === MODE_STRONG_ATTACK){
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;

    }*/
    const damage = dealMonsterDamage(maxDamage);
    actuallMonsterHealth -= damage;
    writeToLog(
        logEvent,
        damage,
        actuallMonsterHealth,
        actuallPlayerHealth
        );
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    actuallPlayerHealth -= playerDamage;
    endRound();
 
}

function attackMonster(){
    attacks(MODE_ATTACK);
}
function strongAttackMonster(){
    attacks(MODE_STRONG_ATTACK);
}
function healPlayer(){
    let healValue;
    if (actuallPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        healValue = chosenMaxLife - actuallPlayerHealth;
        alert('Nepotřebuješ se vyléčit.');
    }else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    actuallPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        actuallMonsterHealth,
        actuallPlayerHealth
        );
    endRound();
}
function printBattleLog(){
    for (let i = 0; i < 3; i++){
        console.log('-----');
    }
    let i = 0;
    for (const logEntry of battleLog){   //for of loop
        if (!lastLoggedEntry && lastLoggedEntry !== 0 || lastLoggedEntry < i){
            console.log(`#${i}`);
            for (const key in logEntry){     //for in loop
                console.log(`${key} => ${logEntry[key]}`);    
            }
            lastLoggedEntry = i;
            break;
        }  
        i++;
    }
}

attackBtn.addEventListener('click',attackMonster);
strongAttackBtn.addEventListener('click',strongAttackMonster);
healBtn.addEventListener('click',healPlayer);
logBtn.addEventListener('click', printBattleLog);
