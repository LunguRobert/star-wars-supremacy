import React, { useState, useEffect, useRef } from "react";
import "./Mytable.css";
import { allCards } from "../../scripts/allCards";
import { someCards } from "../../scripts/someCards";
import { forceCards } from "../../scripts/forceCards";
import HandCards from "../HandCards/HandCards";
import explosion from "../../images/explosion.gif";
import darthmaul from "../../images/darthmaul.png";
import fire from "../../images/fire.gif";
import pulse from "../../images/pulse.gif";
import boost from "../../images/boost.gif";
import special from "../../images/special3.gif";
import { useParams } from "react-router-dom";

export default function Mytable(props) {
  const params = useParams();

  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [m3, setM3] = useState("");
  const [m4, setM4] = useState("");
  const [m5, setM5] = useState("");
  const [m6, setM6] = useState("");

  const cardWithForceCopy = useRef();
  const [mindTricks, setMindTricks] = useState({
    attacker: "",
    defender: "",
  });
  const [attacker, setAttacker] = useState("");
  const [enemyForceCard, setEnemyForceCard] = useState([""]);
  const [cardWithForce, setCardWithForce] = useState([m1, m2, m3, m4, m5]);
  const [willAttack, setWillAttack] = useState("");
  const [trash, setTrash] = useState([]);
  const [destroyAllLights, setDestroyAllLights] = useState(false);
  const [sithBetrayal, setSithBetrayal] = useState({
    destroying: false,
    boosting: false,
  });
  const [addToTrash, setAddToTrash] = useState("");
  const [enemyHasVader, setEnemyHasVader] = useState(false);
  const [noForceCards, setNoForceCards] = useState(false);
  const [noSummon, setNoSummon] = useState(false);
  const [forcePush, setForcePush] = useState({
    boosting: false,
  });
  const [kyberCrystal, setKyberCrystal] = useState({
    boosting: false,
  });
  const [forcePull, setForcePull] = useState({
    boosting: false,
    decreasing: false,
  });

  const oldNumberOfDark = useRef(0);
  const didMount = useRef({
    m1: false,
    m2: false,
    m3: false,
    m4: false,
    m5: false,
    trash: false,
  });
  const maxAttackInEnemy = useRef(-1);
  const changeCards = [
    function (data) {
      setM1(data);
    },
    function (data) {
      setM2(data);
    },
    function (data) {
      setM3(data);
    },
    function (data) {
      setM4(data);
    },
    function (data) {
      setM5(data);
    },
    function (data) {
      setM6(data);
    },
  ];

  const getCards = [
    function () {
      return m1;
    },
    function () {
      return m2;
    },
    function () {
      return m3;
    },
    function () {
      return m4;
    },
    function () {
      return m5;
    },
    function () {
      return m6;
    },
  ];

  const [deathStarActive, setDeathStarActive] = useState({
    active: false,
    position: null,
  });
  const [forceShield, setForceShield] = useState({
    active: false,
  });
  const [existKylo, setExistKylo] = useState(false);
  const [existLuke, setExistLuke] = useState(false);
  const {
    myRef,
    myHpClone,
    enemyHpClone,
    whoIsJedi,
    isMyFirstTurn,
    setMyMana,
    myMana,
    setLocked,
    setTrashCopy,
    reborn,
    setReborn,
    bleed,
    setBleed,
    setMindTrick,
    mindTrick,
    stealStats,
    setStealStats,
    cardTaken,
    setCardTaken,
    defender,
    setDefender,
    myHp,
    setMyHp,
    enemyHp,
    setEnemyHp,
    setReyAttacker,
    baseDefender,
    setBaseDefender,
    myTurn,
    enemyTurn,
    setEnemyTurn,
    setMyTurn,
    cancelAttack,
    setCancelAttack,
  } = props;

  const [deck, setDeck] = useState("");
  const [handCards, setHandCards] = useState("");

  const [cardToDeploy, setCardToDeploy] = useState("");
  const [specialToDeploy, setSpecialToDeploy] = useState("");

  function findCard(name) {
    const iFoundIt = allCards.heros.find((element) => element.name === name);
    return iFoundIt;
  }

  const client = props.client;
  var single;

  useEffect(() => {
    if (addToTrash) {
      setTrash((t) => [...t, addToTrash]);
      setAddToTrash("");
    }
  }, [addToTrash]);

  useEffect(() => {
    if (deck.length > 0 && myTurn.turn === true) {
      if (handCards.length < 10) {
        const lastCard = deck[deck.length - 1];
        setDeck(deck.filter((element, index) => index !== deck.length - 1));
        setHandCards(handCards.concat(lastCard));
      }
    }
  }, [myTurn]);

  useEffect(() => {
    if (!didMount.current.trash) {
      setTrashCopy(trash);
    } else {
      didMount.current.trash = false;
    }

    if (trash.length > 0) {
      client.send(
        JSON.stringify({
          type: "lastTrashCard",
          adress: props.enemyId,
          lastTrashCard: trash[trash.length - 1],
        })
      );
    } else {
      client.send(
        JSON.stringify({
          type: "lastTrashCard",
          adress: props.enemyId,
          lastTrashCard: "",
        })
      );
    }
  }, [trash]);

  useEffect(() => {
    client.send(
      JSON.stringify({
        type: "enemy_force_cards",
        adress: props.enemyId,
        forceCards: cardWithForce,
      })
    );
    cardWithForceCopy.current = cardWithForce;
    console.log(cardWithForceCopy);
  }, [cardWithForce]);

  // DARTH VADER POWER

  useEffect(() => {
    cardWithForce.forEach((card, index) => {
      switch (card.name) {
        case "darthvader":
          if (!card.summoned) {
            client.send(
              JSON.stringify({
                type: "talk_to_attacker",
                adress: props.enemyId,
                card: "",
                position: "all",
              })
            );
            // setCardWithForce(cardWithForce.filter(el=>el.name !== 'darthvader'));
            const copyArray = JSON.parse(JSON.stringify(cardWithForce));
            const objIndex = copyArray.findIndex(
              (obj) => obj.name == "darthvader"
            );
            copyArray[objIndex].summoned = true;
            setCardWithForce(copyArray);
          }
          break;
      }
    });
  });

  // FORCE FREEZE

  useEffect(() => {
    changeCards.forEach((card, index) => {
      let copyCard = getCards[index]();
      if (copyCard && index !== 5) {
        if (copyCard.locked.active && copyCard.locked.round === myTurn.round) {
          card((old) => ({
            ...old,
            locked: { active: false, round: -1 },
          }));
        }
      }
    });
  });

  // OBI-WAN POWER

  useEffect(() => {
    if (cardWithForce.find((x) => x.name === "obiwan")) {
      const index = cardWithForce
        .map((object) => object.name)
        .indexOf("obiwan");
      const maxAttack = Math.max(
        ...enemyForceCard.map((att) => {
          if (att) {
            return att.attack;
          } else return 0;
        })
      );
      if (maxAttack !== maxAttackInEnemy.current) {
        maxAttackInEnemy.current = maxAttack;
        changeCards[index]((old) => ({
          ...old,
          defence: maxAttack,
        }));
      }
    }
  });

  // REBORN

  useEffect(() => {
    if (reborn.reborn) {
      const cardReborn = findCard(reborn.reborn);
      const indexOfEmptySpace = cardWithForce.findIndex((x) => x === "");
      changeCards[indexOfEmptySpace](cardReborn);

      const copyTrash = JSON.parse(JSON.stringify(trash));
      const trashFiltered = copyTrash.filter((el) => el.name !== reborn.reborn);

      setTrash(trashFiltered);
      setReborn({ ...reborn, reborn: false });
    }
  }, [reborn]);

  // KYLO REN (SHOW CARDS TO ENEMY)

  useEffect(() => {
    if (existKylo) {
      client.send(
        JSON.stringify({
          type: "hand_cards",
          adress: props.enemyId,
          card: handCards,
          existKylo: existKylo,
          numberOfCards: handCards.length,
        })
      );
    } else {
      client.send(
        JSON.stringify({
          type: "hand_cards",
          adress: props.enemyId,
          card: "",
          existKylo: existKylo,
          numberOfCards: handCards.length,
        })
      );
    }
  }, [handCards, existKylo]);

  // SEARCHING ON FIELD

  useEffect(() => {
    if (cardWithForce.find((x) => x.name === "luke")) {
      const allCardOnField = [...cardWithForce, ...enemyForceCard];

      let numberOfDark = 0;
      allCardOnField.map((el) => {
        if (el) {
          if (el.side === "dark") {
            numberOfDark += 1;
          }
        }
      });

      const index = cardWithForce.map((object) => object.name).indexOf("luke");
      if (!(oldNumberOfDark.current == numberOfDark)) {
        changeCards[index]({
          ...getCards[index](),
          attack:
            getCards[index]().attack +
            (numberOfDark - oldNumberOfDark.current) * 100,
        });
        oldNumberOfDark.current = numberOfDark;
      }
    } else if (existLuke) {
      setExistLuke(false);
    }

    const isKyloOnField = cardWithForce.some((e) => e.name === "kyloren");
    if (!isKyloOnField) {
      client.send(
        JSON.stringify({
          type: "kylo_ren",
          adress: props.enemyId,
          existKylo: false,
        })
      );
    }
  }, [cardWithForce, enemyForceCard]);

  // REMOVE BOOST

  useEffect(() => {
    changeCards.forEach((card, index) => {
      let copyCard = getCards[index]();
      if (copyCard.sithBetrayal !== -1) {
        if (copyCard.sithBetrayal === myTurn.round) {
          card((old) => ({
            ...old,
            attack: old.attack - 500,
            defence: old.defence - 500,
            sithBetrayal: -1,
          }));
        }
      }
      if (copyCard.forcePush !== -1) {
        if (copyCard.forcePush === myTurn.round) {
          card((old) => ({
            ...old,
            attack: old.attack - 300,
            defence: old.defence - 300,
            forcePush: -1,
          }));
        }
      }
      if (copyCard.kyberCrystal !== -1) {
        if (copyCard.kyberCrystal === myTurn.round) {
          card((old) => ({
            ...old,
            attack: old.attack - 200,
            kyberCrystal: -1,
          }));
        }
      }
    });
  });

  // FINDING IF ENEMY HAS VADER

  useEffect(() => {
    if (enemyHasVader) {
      const copyArray = JSON.parse(JSON.stringify(cardWithForce));
      const indexOfYoda = cardWithForce
        .map((object) => object.name)
        .indexOf("yoda");
      let copyTrash = JSON.parse(JSON.stringify(trash));
      changeCards.forEach((card, index) => {
        if (indexOfYoda !== index) {
          copyArray[index] = "";
        }
      });
      if (getCards[0]() && getCards[0]().name !== "yoda") {
        copyTrash = [...copyTrash, cardWithForce[0]];
        setM1("");
        didMount.current.m1 = true;
      }
      if (getCards[1]() && getCards[1]().name !== "yoda") {
        copyTrash = [...copyTrash, cardWithForce[1]];
        setM2("");
        didMount.current.m2 = true;
      }
      if (getCards[2]() && getCards[2]().name !== "yoda") {
        copyTrash = [...copyTrash, cardWithForce[2]];
        setM3("");
        didMount.current.m3 = true;
      }
      if (getCards[3]() && getCards[3]().name !== "yoda") {
        copyTrash = [...copyTrash, cardWithForce[3]];
        setM4("");
        didMount.current.m4 = true;
      }
      if (getCards[4]() && getCards[4]().name !== "yoda") {
        copyTrash = [...copyTrash, cardWithForce[4]];
        setM5("");
        didMount.current.m5 = true;
      }
      setCardWithForce(copyArray);
      setTrashCopy(copyTrash);
      setTrash(copyTrash);
      didMount.current.trash = true;
    }
  }, [enemyHasVader]);

  // DESTROY ALL LIGHTS

  useEffect(() => {
    if (destroyAllLights) {
      const copyArray = JSON.parse(JSON.stringify(cardWithForce));
      const indexOfYoda = cardWithForce
        .map((object) => object.name)
        .indexOf("yoda");
      let copyTrash = JSON.parse(JSON.stringify(trash));
      changeCards.forEach((card, index) => {
        if (indexOfYoda !== index && getCards[index]().side === "light") {
          copyArray[index] = "";
        }
      });
      if (
        getCards[0]() &&
        getCards[0]().name !== "yoda" &&
        getCards[0]().side === "light"
      ) {
        copyTrash = [...copyTrash, cardWithForce[0]];
        setM1("");
        didMount.current.m1 = true;
      }
      if (
        getCards[1]() &&
        getCards[1]().name !== "yoda" &&
        getCards[1]().side === "light"
      ) {
        copyTrash = [...copyTrash, cardWithForce[1]];
        setM2("");
        didMount.current.m2 = true;
      }
      if (
        getCards[2]() &&
        getCards[2]().name !== "yoda" &&
        getCards[2]().side === "light"
      ) {
        copyTrash = [...copyTrash, cardWithForce[2]];
        setM3("");
        didMount.current.m3 = true;
      }
      if (
        getCards[3]() &&
        getCards[3]().name !== "yoda" &&
        getCards[3]().side === "light"
      ) {
        copyTrash = [...copyTrash, cardWithForce[3]];
        setM4("");
        didMount.current.m4 = true;
      }
      if (
        getCards[4]() &&
        getCards[4]().name !== "yoda" &&
        getCards[4]().side === "light"
      ) {
        copyTrash = [...copyTrash, cardWithForce[4]];
        setM5("");
        didMount.current.m5 = true;
      }
      setCardWithForce(copyArray);
      setTrashCopy(copyTrash);
      setTrash(copyTrash);
      didMount.current.trash = true;
    }
  }, [destroyAllLights]);

  // TAKING ENEMY CARD 1 TURNSeduce

  useEffect(() => {
    if (cardTaken.card && cardTaken.position) {
      const indexOfEmpty = cardWithForce.indexOf("");
      changeCards[indexOfEmpty](cardTaken.card);
      setCardTaken({
        ...cardTaken,
        card: "",
        newPosition: indexOfEmpty,
      });
    }
  }, [cardTaken]);

  // REMOVE SEDUCE EFFECT

  function undoSeduceAndRedeemEffect() {
    if (cardTaken.newPosition !== "") {
      changeCards[cardTaken.newPosition]("");
      var newArray = JSON.parse(JSON.stringify(cardWithForce));
      newArray[cardTaken.newPosition] = "";
      setCardWithForce(newArray);
      switch (cardTaken.newPosition) {
        case 0:
          didMount.current.m1 = true;
          break;
        case 1:
          didMount.current.m2 = true;
          break;
        case 2:
          didMount.current.m3 = true;
          break;
        case 3:
          didMount.current.m4 = true;
          break;
        case 4:
          didMount.current.m5 = true;
          break;
      }
      client.send(
        JSON.stringify({
          type: "talk_to_attacker",
          adress: props.enemyId,
          card: {
            ...getCards[cardTaken.newPosition](),
            seducedOrRedeemed: false,
            timesAttacked: 0,
          },
          position: cardTaken.position.toString(),
        })
      );
      setCardTaken({
        ...cardTaken,
        position: "",
        newPosition: "",
      });
      changeCards[5]("");
    }
  }

  // REMOVE CANCEL ATTACK
  useEffect(() => {
    if (cancelAttack.turn === enemyTurn.round) {
      setCancelAttack({
        active: "",
        turn: "",
        position: "",
      });
    }
  }, [cancelAttack, myTurn]);

  // DARTH MAUL CURSE

  useEffect(() => {
    getCards.forEach((card, index) => {
      let cursed = card();
      if (cursed && index !== 5) {
        if (
          cursed.maulCurse.active &&
          cursed.maulCurse.round == enemyTurn.round
        ) {
          changeCards[index]("");
        }
      }
    });
  });

  // FORCE CHOKE

  useEffect(() => {
    if (enemyTurn.turn) {
      getCards.forEach((itm, index) => {
        if (itm()) {
          if (itm().forceChoke < 3 && itm().forceChoke !== 0) {
            changeCards[index]({
              ...itm(),
              attack: itm().attack - 200,
              defence: itm().defence - 200,
              forceChoke: itm().forceChoke + 1,
            });
          }
        }
      });
    }
  }, [enemyTurn]);

  // MESSAGES FROM SERVER

  useEffect(() => {
    console.log(params);

    if (params.gameMode === "duel_of_fates") {
      function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
      }

      const myDeck = JSON.parse(JSON.stringify(allCards));
      let extendedDeck = [];
      let index = 0;
      myDeck.heros.forEach((el) => {
        if (el.type === "epic_card") {
          extendedDeck = [...extendedDeck, { ...el, id: index }];
          index++;
        }
        if (el.type === "basic_card") {
          for (let i = 0; i < 3; i++) {
            extendedDeck = [...extendedDeck, { ...el, id: index }];
            index++;
          }
        }
        if (el.type === "special") {
          for (let i = 0; i < 2; i++) {
            extendedDeck = [...extendedDeck, { ...el, id: index }];
            index++;
          }
        }
      });
      let shuffledArray = shuffle(extendedDeck);

      function extractCards(cards) {
        let newCards = [...cards];
        const extractedCards = [];
        const epicCounts = {};
        const basicCounts = {};
        const specialCounts = {};

        while (extractedCards.length < 50) {
          const indexOfRandom = Math.floor(Math.random() * newCards.length);
          const card = newCards[indexOfRandom];
          if (card.type === "epic_card") {
            if (epicCounts[card.id] >= 1) {
              continue;
            }
            epicCounts[card.id] = (epicCounts[card.id] || 0) + 1;
          } else if (card.type === "basic_card") {
            if (basicCounts[card.id] >= 2) {
              continue;
            }
            basicCounts[card.id] = (basicCounts[card.id] || 0) + 1;
          } else if (card.type === "special") {
            if (specialCounts[card.id] >= 1) {
              continue;
            }
            specialCounts[card.id] = (specialCounts[card.id] || 0) + 1;
          }
          let indexOfRemoved = newCards.findIndex((obj) => obj.id === card.id);
          if (indexOfRemoved !== -1) newCards.splice(indexOfRemoved, 1);
          extractedCards.push({ ...card, id: extractedCards.length });
        }

        return extractedCards;
      }

      // const extractedCards = extractCards(shuffledArray);

      const testCards = JSON.parse(JSON.stringify(someCards.heros));

      var myFirstCards = [];
      for (var i = 0; i < 5; i++) {
        myFirstCards.push(testCards.pop());
      }
      setDeck(testCards);
      setHandCards(myFirstCards);
    } else {
      function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
      }

      const myDeck = JSON.parse(JSON.stringify(forceCards));
      let shuffledArray = shuffle(myDeck.heros);

      var myFirstCards = [];
      for (var i = 0; i < 5; i++) {
        myFirstCards.push(shuffledArray.pop());
      }
      setDeck(shuffledArray);
      setHandCards(myFirstCards);
    }

    client.addEventListener("message", function (message) {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.type === "talk_to_attacker") {
        switch (dataFromServer.position) {
          case "1":
            setM1(dataFromServer.card);
            if (dataFromServer.diference) {
              setMyHp(dataFromServer.diference);
            }
            break;
          case "2":
            setM2(dataFromServer.card);
            if (dataFromServer.diference) {
              setMyHp(dataFromServer.diference);
            }
            break;
          case "3":
            setM3(dataFromServer.card);
            if (dataFromServer.diference) {
              setMyHp(dataFromServer.diference);
            }
            break;
          case "4":
            setM4(dataFromServer.card);
            if (dataFromServer.diference) {
              setMyHp(dataFromServer.diference);
            }
            break;
          case "5":
            setM5(dataFromServer.card);
            if (dataFromServer.diference) {
              setMyHp(dataFromServer.diference);
            }
            break;
          case "6":
            setM6(dataFromServer.card);
            break;
          case "rey":
            setMyHp(dataFromServer.diference);
            break;
          case "all":
            setEnemyHasVader(true);
            break;
          case "all_light":
            setDestroyAllLights(true);
            break;
        }
      }
      if (dataFromServer.type === "talk_to_anakin") {
        changeCards[dataFromServer.position - 1]((old) => ({
          ...old,
          attack: old.attack + 100,
        }));
      }
      if (dataFromServer.type === "kylo_ren") {
        setExistKylo(dataFromServer.existKylo);
      }
      if (dataFromServer.type === "card_taken") {
        changeCards[dataFromServer.position - 1]("");
        var newArray = JSON.parse(JSON.stringify(cardWithForceCopy.current));
        newArray[dataFromServer.position - 1] = "";
        setCardWithForce(newArray);
        switch (dataFromServer.position - 1) {
          case 0:
            didMount.current.m1 = true;
            break;
          case 1:
            didMount.current.m2 = true;
            break;
          case 2:
            didMount.current.m3 = true;
            break;
          case 3:
            didMount.current.m4 = true;
            break;
          case 4:
            didMount.current.m5 = true;
            break;
        }
      }
      if (dataFromServer.type === "enemyHp") {
        setEnemyHp(dataFromServer.diference);
      }
      if (dataFromServer.type === "enemy_force_cards") {
        setEnemyForceCard(dataFromServer.forceCards);
      }
      if (dataFromServer.type === "cancel_attack") {
        setCancelAttack(dataFromServer.cancelAttack);
      }
      if (dataFromServer.type === "no_force_cards") {
        setNoForceCards(true);
      }
      if (dataFromServer.type === "no_summon") {
        setNoSummon(true);
      }
      if (dataFromServer.type === "will_attack_2") {
        setWillAttack(dataFromServer.position);
      }
      if (dataFromServer.type === "addToTrash") {
        setAddToTrash(dataFromServer.addToTrash);
      }
      if (dataFromServer.type === "mindTricks") {
        if (dataFromServer.who === "attacker") {
          setMindTricks((old) => ({
            ...old,
            attacker: dataFromServer.mindTricks,
          }));
        }
        if (dataFromServer.who === "defender") {
          setMindTricks((old) => ({
            ...old,
            defender: dataFromServer.mindTricks,
          }));
        }
        if (dataFromServer.who === "both") {
          setMindTricks({
            attacker: "",
            defender: "",
          });
        }
      }
      if (dataFromServer.type === "myHp") {
        if (dataFromServer.sign === "minus") {
          setMyHp(myHpClone.current - dataFromServer.diference);
        } else {
          setEnemyHp(enemyHpClone.current + dataFromServer.diference);
        }
      }
    });
  }, []);

  // FIGHTING

  function letsFight(defender, attacker) {
    if (!defender.fightCard.immune) {
      const defence = defender.fightCard.isDef
        ? defender.fightCard.defence
        : defender.fightCard.attack;
      if (defence > attacker.fightCard.attack) {
        if (!defender.fightCard.isDef) {
          changeCards[attacker.position - 1]("");

          if (
            attacker.fightCard.seducedOrRedeemed &&
            attacker.fightCard.name !== "darthsidious"
          ) {
            client.send(
              JSON.stringify({
                type: "addToTrash",
                adress: props.enemyId,
                addToTrash: attacker.fightCard,
              })
            );
          }

          switch (attacker.fightCard.name) {
            case "darthsidious":
              if (attacker.fightCard.revived === 0) {
                setTimeout(() => {
                  changeCards[attacker.position - 1]({
                    ...attacker.fightCard,
                    revived: attacker.fightCard.revived + 1,
                    timesAttacked: attacker.fightCard.timesAttacked + 1,
                  });
                }, 2000);
              } else {
                if (attacker.fightCard.seducedOrRedeemed) {
                  client.send(
                    JSON.stringify({
                      type: "addToTrash",
                      adress: props.enemyId,
                      addToTrash: attacker.fightCard,
                    })
                  );
                }
              }
              break;

            case "grievous":
              cardWithForce.forEach((card, index) => {
                if (card.name === "droid") {
                  changeCards[index]("");
                }
              });
              break;
          }
        }

        const diference = defence - attacker.fightCard.attack;
        const newEnemyHp = myHp - diference;

        client.send(
          JSON.stringify({
            type: "enemyHp",
            adress: props.enemyId,
            diference: newEnemyHp,
          })
        );
        setMyHp(myHp - diference);

        switch (attacker.fightCard.name) {
          case "ahsoka":
            if (defender.fightCard.side === "dark") {
              client.send(
                JSON.stringify({
                  type: "talk_to_attacker",
                  adress: props.enemyId,
                  card: {
                    ...defender.fightCard,
                    attack: defender.fightCard.attack + 500,
                    defence: defender.fightCard.defence + 500,
                  },
                  position: defender.position,
                })
              );
            }
            break;

          case "rey":
            setReyAttacker(false);
            setBaseDefender(false);
            break;

          case "maul":
            client.send(
              JSON.stringify({
                type: "talk_to_attacker",
                adress: props.enemyId,
                card: {
                  ...defender.fightCard,
                  maulCurse: { active: true, round: myTurn.round + 1 },
                },
                position: defender.position,
              })
            );
            break;
        }

        switch (defender.fightCard.name) {
          case "anakin":
            client.send(
              JSON.stringify({
                type: "talk_to_anakin",
                adress: props.enemyId,
                position: defender.position,
              })
            );
            break;

          case "ahsoka":
            if (attacker.fightCard.side === "light") {
              client.send(
                JSON.stringify({
                  type: "talk_to_attacker",
                  adress: props.enemyId,
                  card: {
                    ...defender.fightCard,
                    attack: defender.fightCard.attack - 400,
                  },
                  position: defender.position,
                })
              );
            }
            break;
        }
      }
      if (defence == attacker.fightCard.attack) {
        if (!defender.fightCard.isDef) {
          client.send(
            JSON.stringify({
              type: "talk_to_attacker",
              adress: props.enemyId,
              card: "",
              position: defender.position,
            })
          );
          changeCards[attacker.position - 1]("");

          if (
            attacker.fightCard.seducedOrRedeemed &&
            attacker.fightCard.name !== "darthsidious"
          ) {
            client.send(
              JSON.stringify({
                type: "addToTrash",
                adress: props.enemyId,
                addToTrash: attacker.fightCard,
              })
            );
          }

          switch (defender.fightCard.name) {
            case "darthsidious":
              if (defender.fightCard.revived === 0) {
                setTimeout(() => {
                  client.send(
                    JSON.stringify({
                      type: "talk_to_attacker",
                      adress: props.enemyId,
                      card: {
                        ...defender.fightCard,
                        revived: defender.fightCard.revived + 1,
                      },
                      position: defender.position,
                    })
                  );
                }, 2000);
              }
              break;

            case "grievous":
              enemyForceCard.forEach((card, index) => {
                if (card.name === "droid") {
                  client.send(
                    JSON.stringify({
                      type: "talk_to_attacker",
                      adress: props.enemyId,
                      card: "",
                      position: (index + 1).toString(),
                    })
                  );
                }
              });
              break;
          }

          switch (attacker.fightCard.name) {
            case "rey":
              setReyAttacker(false);
              setBaseDefender(false);
              break;

            case "darthsidious":
              if (attacker.fightCard.revived === 0) {
                setTimeout(() => {
                  changeCards[attacker.position - 1]({
                    ...attacker.fightCard,
                    revived: attacker.fightCard.revived + 1,
                    timesAttacked: attacker.fightCard.timesAttacked + 1,
                  });
                }, 2000);
              } else {
                if (attacker.fightCard.seducedOrRedeemed) {
                  client.send(
                    JSON.stringify({
                      type: "addToTrash",
                      adress: props.enemyId,
                      addToTrash: attacker.fightCard,
                    })
                  );
                }
              }
              break;

            case "grievous":
              cardWithForce.forEach((card, index) => {
                if (card.name === "droid") {
                  changeCards[index]("");
                }
              });
              break;
          }
        } else {
          changeCards[attacker.position - 1]({
            ...attacker.fightCard,
            timesAttacked: attacker.fightCard.timesAttacked + 1,
          });
        }
      }
      if (defence < attacker.fightCard.attack) {
        if (defender.fightCard.isDef) {
          client.send(
            JSON.stringify({
              type: "talk_to_attacker",
              adress: props.enemyId,
              card: "",
              position: defender.position,
            })
          );
        } else {
          const diference = attacker.fightCard.attack - defence;
          const newEnemyHp = enemyHp - diference;
          client.send(
            JSON.stringify({
              type: "talk_to_attacker",
              adress: props.enemyId,
              card: "",
              position: defender.position,
              diference: newEnemyHp,
            })
          );
          setEnemyHp(enemyHp - diference);
        }

        changeCards[attacker.position - 1]({
          ...attacker.fightCard,
          timesAttacked: attacker.fightCard.timesAttacked + 1,
        });

        switch (attacker.fightCard.name) {
          case "anakin":
            changeCards[attacker.position - 1]((old) => ({
              ...old,
              attack: old.attack + 100,
            }));
            break;

          case "rey":
            changeCards[attacker.position - 1]((old) => ({
              ...old,
              isDef: true,
            }));
            setReyAttacker(false);
            setBaseDefender(false);
            break;

          case "ahsoka":
            if (defender.fightCard.side === "light") {
              changeCards[attacker.position - 1]((old) => ({
                ...old,
                attack: old.attack - 400,
              }));
            }
            break;
        }

        switch (defender.fightCard.name) {
          case "darthsidious":
            if (defender.fightCard.revived === 0) {
              let variable = 0;
              if (attacker.fightCard.name === "ahsoka") {
                variable = 500;
              }
              setTimeout(() => {
                client.send(
                  JSON.stringify({
                    type: "talk_to_attacker",
                    adress: props.enemyId,
                    card: {
                      ...defender.fightCard,
                      revived: defender.fightCard.revived + 1,
                      attack: defender.fightCard.attack + variable,
                      defence: defender.fightCard.defence + variable,
                    },
                    position: defender.position,
                  })
                );
              }, 2000);
            }
            break;

          case "ahsoka":
            changeCards[attacker.position - 1]((old) => ({
              ...old,
              attack: old.attack + 500,
              defence: old.defence + 500,
            }));
            break;

          case "maul":
            changeCards[attacker.position - 1]({
              ...attacker.fightCard,
              maulCurse: { active: true, round: myTurn.round + 1 },
            });
            break;

          case "grievous":
            enemyForceCard.forEach((card, index) => {
              if (card.name === "droid") {
                client.send(
                  JSON.stringify({
                    type: "talk_to_attacker",
                    adress: props.enemyId,
                    card: "",
                    position: (index + 1).toString(),
                  })
                );
              }
            });
            break;
        }
      }
    } else {
      client.send(
        JSON.stringify({
          type: "talk_to_attacker",
          adress: props.enemyId,
          card: { ...defender.fightCard, immune: false },
          position: defender.position,
        })
      );
      changeCards[attacker.position - 1]({
        ...attacker.fightCard,
        timesAttacked: attacker.fightCard.timesAttacked + 1,
      });
    }
  }

  // PREFIGHTING

  useEffect(() => {
    const filteredArray = enemyForceCard.filter((value) => value !== "");
    if (attacker && filteredArray.length === 0) {
      if (attacker.name !== "dooku") {
        const diference = attacker.fightCard.attack;
        const newEnemyHp = enemyHp - diference;
        changeCards[attacker.position - 1]({
          ...attacker.fightCard,
          timesAttacked: attacker.fightCard.timesAttacked + 1,
        });
        setTimeout(() => {
          client.send(
            JSON.stringify({
              type: "talk_to_attacker",
              adress: props.enemyId,
              card: "",
              position: "rey",
              diference: newEnemyHp,
            })
          );
          client.send(
            JSON.stringify({
              type: "will_attack",
              adress: props.enemyId,
              position: "",
            })
          );
          setEnemyHp(enemyHp - diference);
          setAttacker("");
          props.setAttackPrepare(false);
        }, 2000);
      }
    }
    if (attacker && filteredArray.length !== 0) {
      if (attacker.fightCard.name === "rey") {
        setReyAttacker(true);
      }
    }
    if (baseDefender && attacker) {
      const diference = attacker.fightCard.attack;
      const newEnemyHp = enemyHp - diference;
      client.send(
        JSON.stringify({
          type: "talk_to_attacker",
          adress: props.enemyId,
          card: "",
          position: "rey",
          diference: newEnemyHp,
        })
      );
      setEnemyHp(enemyHp - diference);
      setAttacker("");
      client.send(
        JSON.stringify({
          type: "will_attack",
          adress: props.enemyId,
          position: "",
        })
      );
      setReyAttacker(false);
      setBaseDefender(false);
      props.setAttackPrepare(false);

      changeCards[attacker.position - 1]((old) => ({
        ...old,
        isDef: true,
      }));
    } else if (defender && attacker) {
      switch (attacker.fightCard.name) {
        case "quigon":
          const chanceCube = Math.floor(Math.random() * 2);
          changeCards[attacker.position - 1]((old) => ({
            ...old,
            attack: chanceCube === 1 ? old.attack + 700 : old.attack - 700,
            defence: chanceCube === 1 ? old.defence + 700 : old.defence - 700,
          }));
          const newAttacker = {
            ...attacker,
            fightCard: {
              ...attacker.fightCard,
              attack:
                chanceCube === 1
                  ? attacker.fightCard.attack + 700
                  : attacker.fightCard.attack - 700,
              defence:
                chanceCube === 1
                  ? attacker.fightCard.defence + 700
                  : attacker.fightCard.defence - 700,
            },
          };
          setTimeout(function () {
            letsFight(defender, newAttacker);
          }, 2000);
          break;

        case "ahsoka":
          if (defender.fightCard.side === "light") {
            changeCards[attacker.position - 1]((old) => ({
              ...old,
              attack: old.attack + 400,
            }));
            const newAttacker = {
              ...attacker,
              fightCard: {
                ...attacker.fightCard,
                attack: attacker.fightCard.attack + 400,
              },
            };
            setTimeout(function () {
              letsFight(defender, newAttacker);
            }, 2000);
          }
          if (defender.fightCard.side === "dark") {
            const newDefender = {
              ...defender,
              fightCard: {
                ...defender.fightCard,
                attack: defender.fightCard.attack - 500,
                defence: defender.fightCard.defence - 500,
              },
            };
            client.send(
              JSON.stringify({
                type: "talk_to_attacker",
                adress: props.enemyId,
                card: {
                  ...defender.fightCard,
                  attack: defender.fightCard.attack - 500,
                  defence: defender.fightCard.defence - 500,
                },
                position: defender.position,
              })
            );
            setTimeout(function () {
              letsFight(newDefender, attacker);
            }, 2000);
          }
          if (defender.fightCard.side === "no_side") {
            letsFight(defender, attacker);
          }
          break;

        default:
          if (defender.fightCard.name === "ahsoka") {
            switch (attacker.fightCard.side) {
              case "dark":
                const newAttacker = {
                  ...attacker,
                  fightCard: {
                    ...attacker.fightCard,
                    attack: attacker.fightCard.attack - 500,
                    defence: attacker.fightCard.defence - 500,
                  },
                };
                changeCards[attacker.position - 1]((old) => ({
                  ...old,
                  attack: old.attack - 500,
                  defence: old.defence - 500,
                }));
                setTimeout(function () {
                  letsFight(defender, newAttacker);
                }, 2000);
                break;

              case "light":
                const newDefender = {
                  ...defender,
                  fightCard: {
                    ...defender.fightCard,
                    attack: defender.fightCard.attack + 400,
                  },
                };
                client.send(
                  JSON.stringify({
                    type: "talk_to_attacker",
                    adress: props.enemyId,
                    card: {
                      ...defender.fightCard,
                      attack: defender.fightCard.attack + 400,
                    },
                    position: defender.position,
                  })
                );
                setTimeout(function () {
                  letsFight(newDefender, attacker);
                }, 2000);
                break;

              case "no_side":
                letsFight(defender, attacker);
                break;
            }
          } else {
            letsFight(defender, attacker);
          }
          break;
      }
      client.send(
        JSON.stringify({
          type: "will_attack",
          adress: props.enemyId,
          position: "",
        })
      );
      setAttacker("");
      setDefender("");
    }
  }, [defender, attacker, baseDefender]);

  // ADD ALL MY CARDS IN ONE ARRAY

  function forceAdd(m, position) {
    switch (m.name) {
      case "luke":
        if (!existLuke) {
          setExistLuke(true);
        }
        break;

      case "kyloren":
        client.send(
          JSON.stringify({
            type: "kylo_ren",
            adress: props.enemyId,
            existKylo: true,
          })
        );

        break;
    }
    var newArray = JSON.parse(JSON.stringify(cardWithForce));
    newArray[position] = m;
    if (
      m.name === "grievous" &&
      !cardWithForce.find((el) => el.name == "grievous")
    ) {
      let freeSpace = 0;
      let indexOfDroids = [];
      newArray.forEach((itm, index) => {
        if (itm === "" && freeSpace < 2) {
          freeSpace += 1;
          newArray[index] = {
            name: "droid",
            attack: 1000,
            defence: 1000,
            image: "https://i.imgur.com/Nv4TZ3u.png",
            type: "utility",
            side: "dark",
            isDef: false,
            maulCurse: { active: false, round: -1 },
            locked: { active: false, round: -1 },
            timesAttacked: 0,
          };
          indexOfDroids.push(index);
        }
      });
      indexOfDroids.forEach((itm, index) => {
        changeCards[itm]({
          name: "droid",
          attack: 1000,
          defence: 1000,
          image: "https://i.imgur.com/Nv4TZ3u.png",
          type: "utility",
          side: "dark",
          isDef: false,
          maulCurse: { active: false, round: -1 },
          locked: { active: false, round: -1 },
          timesAttacked: 0,
        });
      });
    }
    setCardWithForce(newArray);
  }

  // DEATH STAR POWER

  useEffect(() => {
    if (deathStarActive.active) {
      if (defender.fightCard.name !== "yoda") {
        client.send(
          JSON.stringify({
            type: "talk_to_attacker",
            adress: props.enemyId,
            card: "",
            position: defender.position,
          })
        );
      }
      if (defender.fightCard.name === "grievous") {
        enemyForceCard.forEach((itm, index) => {
          if (itm.name === "droid") {
            client.send(
              JSON.stringify({
                type: "talk_to_attacker",
                adress: props.enemyId,
                card: "",
                position: (index + 1).toString(),
              })
            );
          }
        });
      }
      changeCards[deathStarActive.position]("");
      setDeathStarActive({
        active: false,
        position: null,
      });
      setDefender("");
    }
  }, [defender]);

  //USE SPECIAL CARDS

  function applySpecial(name, position) {
    let isOnTable = cardWithForce.find((el) => el !== "");
    let isSpaceOnTable = cardWithForce.includes("");
    let isEnemyOnTable = enemyForceCard.find((el) => el !== "");
    let isDarkInMyTeam = cardWithForce.find((el) => el.side == "dark");
    let isLightInMyTeam = cardWithForce.find((el) => el.side == "light");
    let isWinduOnTable = cardWithForce.find((el) => el.name == "windu");
    switch (name) {
      case "special_deathstar":
        if (isEnemyOnTable) {
          props.setAttackPrepare(true);
          setDeathStarActive({
            active: true,
            position: position,
          });
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_order66":
        if (isDarkInMyTeam || isWinduOnTable) {
          let cardsDestroyed = [];
          enemyForceCard.map((itm, index) => {
            if (itm.side == "light") {
              cardsDestroyed.push(index);
            }
          });
          setTimeout(() => {
            if (cardsDestroyed) {
              client.send(
                JSON.stringify({
                  type: "talk_to_attacker",
                  adress: props.enemyId,
                  position: "all_light",
                })
              );
              changeCards[position]("");
            }
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_galacticrepublic":
        if (isLightInMyTeam || isWinduOnTable) {
          setTimeout(() => {
            const copyArray = JSON.parse(JSON.stringify(cardWithForce));
            changeCards.forEach((card, index) => {
              if (card && card.side === "light") {
                copyArray[index] = {
                  ...getCards[0](),
                  attack: getCards[0]().attack + 200,
                  defence: getCards[0]().defence + 200,
                };
              }
            });
            if (getCards[0]() && getCards[0]().side === "light") {
              setM1({
                ...getCards[0](),
                attack: getCards[0]().attack + 200,
                defence: getCards[0]().defence + 200,
              });
              didMount.current.m1 = true;
            }
            if (getCards[1]() && getCards[1]().side === "light") {
              setM2({
                ...getCards[1](),
                attack: getCards[1]().attack + 200,
                defence: getCards[1]().defence + 200,
              });
              didMount.current.m2 = true;
            }
            if (getCards[2]() && getCards[2]().side === "light") {
              setM3({
                ...getCards[2](),
                attack: getCards[2]().attack + 200,
                defence: getCards[2]().defence + 200,
              });
              didMount.current.m3 = true;
            }
            if (getCards[3]() && getCards[3]().side === "light") {
              setM4({
                ...getCards[3](),
                attack: getCards[3]().attack + 200,
                defence: getCards[3]().defence + 200,
              });
              didMount.current.m4 = true;
            }
            if (getCards[4]() && getCards[4]().side === "light") {
              setM5({
                ...getCards[4](),
                attack: getCards[4]().attack + 200,
                defence: getCards[4]().defence + 200,
              });
              didMount.current.m5 = true;
            }
            setCardWithForce(copyArray);
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_galacticempire":
        if (isDarkInMyTeam || isWinduOnTable) {
          setTimeout(() => {
            const copyArray = JSON.parse(JSON.stringify(cardWithForce));
            changeCards.forEach((card, index) => {
              if (card && card.side === "dark") {
                copyArray[index] = {
                  ...getCards[0](),
                  attack: getCards[0]().attack + 200,
                  defence: getCards[0]().defence + 200,
                };
              }
            });
            if (getCards[0]() && getCards[0]().side === "dark") {
              setM1({
                ...getCards[0](),
                attack: getCards[0]().attack + 200,
                defence: getCards[0]().defence + 200,
              });
              didMount.current.m1 = true;
            }
            if (getCards[1]() && getCards[1]().side === "dark") {
              setM2({
                ...getCards[1](),
                attack: getCards[1]().attack + 200,
                defence: getCards[1]().defence + 200,
              });
              didMount.current.m2 = true;
            }
            if (getCards[2]() && getCards[2]().side === "dark") {
              setM3({
                ...getCards[2](),
                attack: getCards[2]().attack + 200,
                defence: getCards[2]().defence + 200,
              });
              didMount.current.m3 = true;
            }
            if (getCards[3]() && getCards[3]().side === "dark") {
              setM4({
                ...getCards[3](),
                attack: getCards[3]().attack + 200,
                defence: getCards[3]().defence + 200,
              });
              didMount.current.m4 = true;
            }
            if (getCards[4]() && getCards[4]().side === "dark") {
              setM5({
                ...getCards[4](),
                attack: getCards[4]().attack + 200,
                defence: getCards[4]().defence + 200,
              });
              didMount.current.m5 = true;
            }
            setCardWithForce(copyArray);
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_sithbetrayal":
        if (isDarkInMyTeam || isWinduOnTable) {
          setTimeout(() => {
            setSithBetrayal({
              ...sithBetrayal,
              destroying: true,
            });
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_seduce":
        if (
          (isDarkInMyTeam && isEnemyOnTable) ||
          (isWinduOnTable && isEnemyOnTable)
        ) {
          setTimeout(() => {
            setCardTaken({
              ...cardTaken,
              side: "dark",
              active: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_redeem":
        if (
          (isLightInMyTeam && isEnemyOnTable) ||
          (isWinduOnTable && isEnemyOnTable)
        ) {
          setTimeout(() => {
            setCardTaken({
              ...cardTaken,
              side: "light",
              active: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_walloflight":
        if (
          (isLightInMyTeam && isEnemyOnTable) ||
          (isWinduOnTable && isEnemyOnTable)
        ) {
          setTimeout(() => {
            setCancelAttack({
              ...cancelAttack,
              active: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_forcedrain":
        if (
          (isDarkInMyTeam && isEnemyOnTable) ||
          (isWinduOnTable && isEnemyOnTable)
        ) {
          setTimeout(() => {
            setStealStats({
              ...stealStats,
              active: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_forceshield":
        if (isLightInMyTeam || isWinduOnTable) {
          setTimeout(() => {
            setForceShield({
              active: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_jedimindtrick":
        if (isLightInMyTeam || isWinduOnTable) {
          setTimeout(() => {
            setMindTrick({
              attackerActive: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_forcechoke":
        if (isDarkInMyTeam || isWinduOnTable) {
          setTimeout(() => {
            setBleed({
              active: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_traiders":
        setTimeout(() => {
          client.send(
            JSON.stringify({ type: "no_force_cards", adress: props.enemyId })
          );
          changeCards[position]("");
        }, 1500);
        break;

      case "special_saberthrow":
        setTimeout(() => {
          client.send(
            JSON.stringify({ type: "no_summon", adress: props.enemyId })
          );
          changeCards[position]("");
        }, 1500);
        break;

      case "special_fulcrum":
        if (handCards.length < 10) {
          setTimeout(() => {
            setHandCards(handCards.concat(findCard("ahsoka")));
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_forcelightning":
        setTimeout(() => {
          setEnemyHp(enemyHp - 1000);
          client.send(
            JSON.stringify({
              type: "myHp",
              adress: props.enemyId,
              diference: 1000,
              sign: "minus",
            })
          );
          changeCards[position]("");
        }, 1500);
        break;

      case "special_forcehealing":
        setTimeout(() => {
          setMyHp(myHp + 1000);
          client.send(
            JSON.stringify({
              type: "myHp",
              adress: props.enemyId,
              diference: 1000,
              sign: "plus",
            })
          );
          changeCards[position]("");
        }, 1500);
        break;

      case "special_binarysunset":
        if (handCards.length <= 8 && deck.length >= 2) {
          setTimeout(() => {
            const lastCard1 = deck[deck.length - 1];
            const newDeck = deck.filter(
              (element, index) => index !== deck.length - 1
            );
            const newHandCards = handCards.concat(lastCard1);

            const lastCard2 = deck[deck.length - 2];

            setDeck(
              newDeck.filter((element, index) => index !== deck.length - 1)
            );
            setHandCards(newHandCards.concat(lastCard2));
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_forcepush":
        if (isOnTable) {
          setTimeout(() => {
            setForcePush({
              ...forcePush,
              boosting: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_kybercrystal":
        if (isOnTable) {
          setTimeout(() => {
            setKyberCrystal({
              ...kyberCrystal,
              boosting: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_forcepull":
        if (isOnTable) {
          setTimeout(() => {
            setForcePull({
              ...forcePull,
              boosting: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_forceghost":
        if (isSpaceOnTable) {
          setTimeout(() => {
            setReborn({
              ...reborn,
              active: true,
            });
            changeCards[position]("");
          }, 1500);
        } else {
          setTimeout(() => {
            changeCards[position]("");
          }, 1500);
        }
        break;

      case "special_forcefreeze":
        setTimeout(() => {
          setLocked({
            active: true,
          });
          changeCards[position]("");
        }, 1500);
        break;

      case "special_bactatank":
        setTimeout(() => {
          setMyMana(9);
          changeCards[position]("");
        }, 1500);
        break;

      case "special_meditation":
        setTimeout(() => {
          setMyMana(myMana + 1);
          changeCards[position]("");
        }, 1500);
        break;
    }
  }

  useEffect(() => {
    if (!didMount.current.m1) {
      if (
        !m1 &&
        cardWithForce[0] &&
        cardWithForce[0].revived !== 0 &&
        cardWithForce[0].name !== "droid"
      ) {
        if (!cardWithForce[0].seducedOrRedeemed) {
          setTrash((t) => [...t, cardWithForce[0]]);
        }
      }
      forceAdd(m1, 0);
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m1,
          position: "1",
        })
      );
    } else {
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m1,
          position: "1",
        })
      );
      didMount.current.m1 = false;
    }
  }, [m1]);

  useEffect(() => {
    if (!didMount.current.m2) {
      if (
        !m2 &&
        cardWithForce[1] &&
        cardWithForce[1].revived !== 0 &&
        cardWithForce[1].name !== "droid"
      ) {
        if (!cardWithForce[1].seducedOrRedeemed) {
          setTrash((t) => [...t, cardWithForce[1]]);
        }
      }
      forceAdd(m2, 1);
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m2,
          position: "2",
        })
      );
    } else {
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m2,
          position: "2",
        })
      );
      didMount.current.m2 = false;
    }
  }, [m2]);

  useEffect(() => {
    if (!didMount.current.m3) {
      if (
        !m3 &&
        cardWithForce[2] &&
        cardWithForce[2].revived !== 0 &&
        cardWithForce[2].name !== "droid"
      ) {
        if (!cardWithForce[2].seducedOrRedeemed) {
          setTrash((t) => [...t, cardWithForce[2]]);
        }
      }
      forceAdd(m3, 2);
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m3,
          position: "3",
        })
      );
    } else {
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m3,
          position: "3",
        })
      );
      didMount.current.m3 = false;
    }
  }, [m3]);

  useEffect(() => {
    if (!didMount.current.m4) {
      if (
        !m4 &&
        cardWithForce[3] &&
        cardWithForce[3].revived !== 0 &&
        cardWithForce[3].name !== "droid"
      ) {
        if (!cardWithForce[3].seducedOrRedeemed) {
          setTrash((t) => [...t, cardWithForce[3]]);
        }
      }
      forceAdd(m4, 3);
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m4,
          position: "4",
        })
      );
    } else {
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m4,
          position: "4",
        })
      );
      didMount.current.m4 = false;
    }
  }, [m4]);

  useEffect(() => {
    if (!didMount.current.m5) {
      if (
        !m5 &&
        cardWithForce[4] &&
        cardWithForce[4].revived !== 0 &&
        cardWithForce[4].name !== "droid"
      ) {
        if (!cardWithForce[4].seducedOrRedeemed) {
          setTrash((t) => [...t, cardWithForce[4]]);
        }
      }
      forceAdd(m5, 4);
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m5,
          position: "5",
        })
      );
    } else {
      client.send(
        JSON.stringify({
          type: "talk_to",
          adress: props.enemyId,
          card: m5,
          position: "5",
        })
      );
      didMount.current.m5 = false;
    }
  }, [m5]);

  useEffect(() => {
    client.send(
      JSON.stringify({
        type: "talk_to",
        adress: props.enemyId,
        card: m6,
        position: "6",
      })
    );
    applySpecial(m6.name, 5);
  }, [m6]);

  return (
    <div
      className="my-card-container"
      style={
        !myTurn.turn ? { pointerEvents: "none" } : { pointerEvents: "all" }
      }
    >
      <div className="my-hand-container">
        <HandCards
          myMana={myMana}
          setMyMana={setMyMana}
          noSummon={noSummon}
          noForceCards={noForceCards}
          cardToDeploy={cardToDeploy}
          specialToDeploy={specialToDeploy}
          myFirstCards={handCards}
          setImg={props.setImg}
          setSpecialToDeploy={setSpecialToDeploy}
          setCardToDeploy={setCardToDeploy}
        />
      </div>

      <div className="my-card-table">
        <div
          onClick={() => {
            if (specialToDeploy) {
              setM6(findCard(specialToDeploy.name));
              setHandCards(
                handCards.filter((element) => element.id !== specialToDeploy.id)
              );
              const updatedMana = myMana - specialToDeploy.mana;
              setMyMana(updatedMana);
              setSpecialToDeploy("");
            }
            single = 1;
          }}
          name="m6"
          id={`${!m6 && specialToDeploy ? "hovered" : "unhovered"}`}
          className={`card ${m6 ? "full" : "empty"}`}
        >
          <img
            className="special-card"
            onMouseOver={(e) => {
              props.setImg({ img: e.target.src, description: e.target.alt });
            }}
            onMouseOut={() => {
              props.setImg({ img: "", description: "" });
            }}
            name={`${m6 ? m6.name : "special"}`}
            src={`${m6 ? m6.image : special}`}
            alt={`${m6 ? m6.description : ""}`}
          />
        </div>

        <div
          onClick={() => {
            if (cardToDeploy && !m1) {
              setM1(findCard(cardToDeploy.name));
              setHandCards(
                handCards.filter((element) => element.id !== cardToDeploy.id)
              );
              const updatedMana = myMana - cardToDeploy.mana;
              setMyMana(updatedMana);
              setCardToDeploy("");
            }
            single = 1;
            setTimeout(function () {
              if (single) {
                if (forcePull.boosting) {
                  setM1({
                    ...m1,
                    attack: m1.attack + 400,
                    defence: m1.defence + 400,
                    forcePull: true,
                  });
                  setForcePull({
                    ...forcePull,
                    boosting: false,
                  });
                } else if (kyberCrystal.boosting) {
                  setM1({
                    ...m1,
                    attack: m1.attack + 200,
                    kyberCrystal: myTurn.round + 1,
                  });
                  setKyberCrystal({
                    ...kyberCrystal,
                    boosting: false,
                  });
                } else if (forcePush.boosting) {
                  setM1({
                    ...m1,
                    attack: m1.attack + 300,
                    defence: m1.defence + 300,
                    forcePush: myTurn.round + 1,
                  });
                  setForcePush({
                    ...forcePush,
                    boosting: false,
                  });
                } else if (forceShield.active && m1.side == "light") {
                  setM1({
                    ...m1,
                    immune: true,
                  });
                  setForceShield({
                    active: false,
                  });
                } else if (stealStats.stolen && m1) {
                  setM1({
                    ...m1,
                    attack: m1.attack + stealStats.attack,
                    defence: m1.defence + stealStats.defence,
                  });
                  setStealStats({
                    ...stealStats,
                    stolen: false,
                  });
                } else if (sithBetrayal.boosting && m1) {
                  setM1({
                    ...m1,
                    attack: m1.attack + 500,
                    defence: m1.defence + 500,
                    sithBetrayal: myTurn.round + 1,
                  });
                  setSithBetrayal({
                    ...sithBetrayal,
                    boosting: false,
                  });
                  setM6("");
                } else if (sithBetrayal.destroying && m1) {
                  setM1("");
                  setSithBetrayal({
                    destroying: false,
                    boosting: true,
                  });
                } else if (
                  (m1 && !m1.isDef && m1.timesAttacked == 0) ||
                  (m1 &&
                    !m1.isDef &&
                    m1.timesAttacked == 1 &&
                    m1.name === "dooku")
                ) {
                  if (!isMyFirstTurn.current) {
                    if (cancelAttack.position != 1 && !m1.wasDef) {
                      props.setAttackPrepare(true);
                      setAttacker({ position: "1", fightCard: m1 });
                      client.send(
                        JSON.stringify({
                          type: "will_attack",
                          adress: props.enemyId,
                          position: "1",
                        })
                      );
                    }
                  }
                }
              }
            }, 300);
          }}
          onDoubleClick={() => {
            single = 0;
            if (m1 && !m1.locked.active && !m1.wasDef) {
              if (m1.isDef) {
                setM1((old) => ({
                  ...old,
                  wasDef: true,
                  isDef: !old.isDef,
                }));
              } else {
                setM1((old) => ({
                  ...old,
                  isDef: !old.isDef,
                }));
              }
            }
          }}
          name="m1"
          id={`${!m1 && cardToDeploy ? "hovered" : "unhovered"}`}
          className={`card ${m1 ? "full" : "empty"}`}
        >
          <img
            className="fight-card"
            style={Object.assign(
              {},
              m1.isDef
                ? { transform: "rotate(90deg)" }
                : { transform: "rotate(0deg)" },
              attacker.position === "1" ||
                willAttack === "1" ||
                mindTricks.attacker === "1" ||
                mindTricks.defender === "1"
                ? {
                    animation: "shake 0.5s",
                    animationIterationCount: "infinite",
                  }
                : { animation: "none", animationIterationCount: "unset" }
            )}
            onMouseOver={(e) => {
              props.setImg({ img: e.target.src, description: e.target.alt });
            }}
            onMouseOut={() => {
              props.setImg({ img: "", description: "" });
            }}
            name={`${m1 ? m1.name : ""}`}
            src={`${m1 ? m1.image : explosion}`}
            alt={`${m1 ? m1.description : ""}`}
          />
          <span>
            <b style={!m1.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m1 ? m1.attack + "/" : ""
            }`}</b>
            <b style={m1.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m1 ? m1.defence : ""
            }`}</b>
          </span>
          {m1 ? (
            m1.maulCurse.active ? (
              <img src={darthmaul} className="sword" />
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {sithBetrayal.destroying && m1 ? (
            <img src={fire} className="sword" />
          ) : (
            ""
          )}
          {sithBetrayal.boosting && m1 ? (
            <img src={boost} className="sword" />
          ) : (
            ""
          )}
          {m1 && stealStats.stolen ? <img src={pulse} className="sword" /> : ""}
          {m1 &&
          (forcePush.boosting ||
            kyberCrystal.boosting ||
            forcePull.boosting) ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          {m1.side == "light" && forceShield.active ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          <div
            id="a"
            style={
              attacker.position === "1" ||
              willAttack === "1" ||
              mindTricks.attacker === "1" ||
              mindTricks.defender === "1"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="b"
            style={
              attacker.position === "1" ||
              willAttack === "1" ||
              mindTricks.attacker === "1" ||
              mindTricks.defender === "1"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="c"
            style={
              attacker.position === "1" ||
              willAttack === "1" ||
              mindTricks.attacker === "1" ||
              mindTricks.defender === "1"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="d"
            style={
              attacker.position === "1" ||
              willAttack === "1" ||
              mindTricks.attacker === "1" ||
              mindTricks.defender === "1"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
        </div>

        <div
          onClick={() => {
            if (cardToDeploy && !m2) {
              setM2(findCard(cardToDeploy.name));
              setHandCards(
                handCards.filter((element) => element.id !== cardToDeploy.id)
              );
              const updatedMana = myMana - cardToDeploy.mana;
              setMyMana(updatedMana);
              setCardToDeploy("");
            }
            single = 1;
            setTimeout(function () {
              if (single) {
                if (forcePull.boosting) {
                  setM2({
                    ...m2,
                    attack: m2.attack + 400,
                    defence: m2.defence + 400,
                    forcePull: true,
                  });
                  setForcePull({
                    ...forcePull,
                    boosting: false,
                  });
                } else if (kyberCrystal.boosting) {
                  setM2({
                    ...m2,
                    attack: m2.attack + 200,
                    kyberCrystal: myTurn.round + 1,
                  });
                  setKyberCrystal({
                    ...kyberCrystal,
                    boosting: false,
                  });
                } else if (forcePush.boosting) {
                  setM2({
                    ...m2,
                    attack: m2.attack + 300,
                    defence: m2.defence + 300,
                    forcePush: myTurn.round + 1,
                  });
                  setForcePush({
                    ...forcePush,
                    boosting: false,
                  });
                } else if (forceShield.active && m2.side == "light") {
                  setM2({
                    ...m2,
                    immune: true,
                  });
                  setForceShield({
                    active: false,
                  });
                } else if (stealStats.stolen && m2) {
                  setM2({
                    ...m2,
                    attack: m2.attack + stealStats.attack,
                    defence: m2.defence + stealStats.defence,
                  });
                  setStealStats({
                    ...stealStats,
                    stolen: false,
                  });
                } else if (sithBetrayal.boosting && m2) {
                  setM2({
                    ...m2,
                    attack: m2.attack + 500,
                    defence: m2.defence + 500,
                    sithBetrayal: myTurn.round + 1,
                  });
                  setSithBetrayal({
                    ...sithBetrayal,
                    boosting: false,
                  });
                  setM6("");
                } else if (sithBetrayal.destroying && m2) {
                  setM2("");
                  setSithBetrayal({
                    destroying: false,
                    boosting: true,
                  });
                } else if (
                  (m2 && !m2.isDef && m2.timesAttacked == 0) ||
                  (m2 &&
                    !m2.isDef &&
                    m2.timesAttacked == 1 &&
                    m2.name === "dooku")
                ) {
                  if (!isMyFirstTurn.current) {
                    if (cancelAttack.position != 2 && !m2.wasDef) {
                      props.setAttackPrepare(true);
                      setAttacker({ position: "2", fightCard: m2 });
                      client.send(
                        JSON.stringify({
                          type: "will_attack",
                          adress: props.enemyId,
                          position: "2",
                        })
                      );
                    }
                  }
                }
              }
            }, 300);
          }}
          onDoubleClick={() => {
            single = 0;
            if (m2 && !m2.locked.active && !m2.wasDef) {
              if (m2.isDef) {
                setM2((old) => ({
                  ...old,
                  wasDef: true,
                  isDef: !old.isDef,
                }));
              } else {
                setM2((old) => ({
                  ...old,
                  isDef: !old.isDef,
                }));
              }
            }
          }}
          name="m2"
          id={`${!m2 && cardToDeploy ? "hovered" : "unhovered"}`}
          className={`card ${m2 ? "full" : "empty"}`}
        >
          <img
            className="fight-card"
            style={Object.assign(
              {},
              m2.isDef
                ? { transform: "rotate(90deg)" }
                : { transform: "rotate(0deg)" },
              attacker.position === "2" ||
                willAttack === "2" ||
                mindTricks.attacker === "2" ||
                mindTricks.defender === "2"
                ? {
                    animation: "shake 0.5s",
                    animationIterationCount: "infinite",
                  }
                : { animation: "none", animationIterationCount: "unset" }
            )}
            onMouseOver={(e) => {
              props.setImg({ img: e.target.src, description: e.target.alt });
            }}
            onMouseOut={() => {
              props.setImg({ img: "", description: "" });
            }}
            name={`${m2 ? m2.name : ""}`}
            src={`${m2 ? m2.image : explosion}`}
            alt={`${m2 ? m2.description : ""}`}
          />
          <span>
            <b style={!m2.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m2 ? m2.attack + "/" : ""
            }`}</b>
            <b style={m2.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m2 ? m2.defence : ""
            }`}</b>
          </span>
          {m2 ? (
            m2.maulCurse.active ? (
              <img src={darthmaul} className="sword" />
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {sithBetrayal.destroying && m2 ? (
            <img src={fire} className="sword" />
          ) : (
            ""
          )}
          {sithBetrayal.boosting && m2 ? (
            <img src={boost} className="sword" />
          ) : (
            ""
          )}
          {m2 && stealStats.stolen ? <img src={pulse} className="sword" /> : ""}
          {m2 &&
          (forcePush.boosting ||
            kyberCrystal.boosting ||
            forcePull.boosting) ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          {m2.side == "light" && forceShield.active ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          <div
            id="a"
            style={
              attacker.position === "2" ||
              willAttack === "2" ||
              mindTricks.attacker === "2" ||
              mindTricks.defender === "2"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="b"
            style={
              attacker.position === "2" ||
              willAttack === "2" ||
              mindTricks.attacker === "2" ||
              mindTricks.defender === "2"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="c"
            style={
              attacker.position === "2" ||
              willAttack === "2" ||
              mindTricks.attacker === "2" ||
              mindTricks.defender === "2"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="d"
            style={
              attacker.position === "2" ||
              willAttack === "2" ||
              mindTricks.attacker === "2" ||
              mindTricks.defender === "2"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
        </div>

        <div
          onClick={() => {
            if (cardToDeploy && !m3) {
              setM3(findCard(cardToDeploy.name));
              setHandCards(
                handCards.filter((element) => element.id !== cardToDeploy.id)
              );
              const updatedMana = myMana - cardToDeploy.mana;
              setMyMana(updatedMana);
              setCardToDeploy("");
            }
            single = 1;
            setTimeout(function () {
              if (single) {
                if (forcePull.boosting) {
                  setM3({
                    ...m3,
                    attack: m3.attack + 400,
                    defence: m3.defence + 400,
                    forcePull: true,
                  });
                  setForcePull({
                    ...forcePull,
                    boosting: false,
                  });
                } else if (kyberCrystal.boosting) {
                  setM3({
                    ...m3,
                    attack: m3.attack + 200,
                    kyberCrystal: myTurn.round + 1,
                  });
                  setKyberCrystal({
                    ...kyberCrystal,
                    boosting: false,
                  });
                } else if (forcePush.boosting) {
                  setM3({
                    ...m3,
                    attack: m3.attack + 300,
                    defence: m3.defence + 300,
                    forcePush: myTurn.round + 1,
                  });
                  setForcePush({
                    ...forcePush,
                    boosting: false,
                  });
                } else if (forceShield.active && m3.side == "light") {
                  setM3({
                    ...m3,
                    immune: true,
                  });
                  setForceShield({
                    active: false,
                  });
                } else if (stealStats.stolen && m3) {
                  setM3({
                    ...m3,
                    attack: m3.attack + stealStats.attack,
                    defence: m3.defence + stealStats.defence,
                  });
                  setStealStats({
                    ...stealStats,
                    stolen: false,
                  });
                } else if (sithBetrayal.boosting && m3) {
                  setM3({
                    ...m3,
                    attack: m3.attack + 500,
                    defence: m3.defence + 500,
                    sithBetrayal: myTurn.round + 1,
                  });
                  setSithBetrayal({
                    ...sithBetrayal,
                    boosting: false,
                  });
                  setM6("");
                } else if (sithBetrayal.destroying && m3) {
                  setM3("");
                  setSithBetrayal({
                    destroying: false,
                    boosting: true,
                  });
                } else if (
                  (m3 && !m3.isDef && m3.timesAttacked == 0) ||
                  (m3 &&
                    !m3.isDef &&
                    m3.timesAttacked == 1 &&
                    m3.name === "dooku")
                ) {
                  if (!isMyFirstTurn.current) {
                    if (cancelAttack.position != 3 && !m3.wasDef) {
                      props.setAttackPrepare(true);
                      setAttacker({ position: "3", fightCard: m3 });
                      client.send(
                        JSON.stringify({
                          type: "will_attack",
                          adress: props.enemyId,
                          position: "3",
                        })
                      );
                    }
                  }
                }
              }
            }, 300);
          }}
          onDoubleClick={() => {
            single = 0;
            if (m3 && !m3.locked.active && !m3.wasDef) {
              if (m3.isDef) {
                setM3((old) => ({
                  ...old,
                  wasDef: true,
                  isDef: !old.isDef,
                }));
              } else {
                setM3((old) => ({
                  ...old,
                  isDef: !old.isDef,
                }));
              }
            }
          }}
          name="m3"
          id={`${!m3 && cardToDeploy ? "hovered" : "unhovered"}`}
          className={`card ${m3 ? "full" : "empty"}`}
        >
          <img
            className="fight-card"
            style={Object.assign(
              {},
              m3.isDef
                ? { transform: "rotate(90deg)" }
                : { transform: "rotate(0deg)" },
              attacker.position === "3" ||
                willAttack === "3" ||
                mindTricks.attacker === "3" ||
                mindTricks.defender === "3"
                ? {
                    animation: "shake 0.5s",
                    animationIterationCount: "infinite",
                  }
                : { animation: "none", animationIterationCount: "unset" }
            )}
            onMouseOver={(e) => {
              props.setImg({ img: e.target.src, description: e.target.alt });
            }}
            onMouseOut={() => {
              props.setImg({ img: "", description: "" });
            }}
            name={`${m3 ? m3.name : ""}`}
            src={`${m3 ? m3.image : explosion}`}
            alt={`${m3 ? m3.description : ""}`}
          />
          <span>
            <b style={!m3.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m3 ? m3.attack + "/" : ""
            }`}</b>
            <b style={m3.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m3 ? m3.defence : ""
            }`}</b>
          </span>
          {m3 ? (
            m3.maulCurse.active ? (
              <img src={darthmaul} className="sword" />
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {sithBetrayal.destroying && m3 ? (
            <img src={fire} className="sword" />
          ) : (
            ""
          )}
          {sithBetrayal.boosting && m3 ? (
            <img src={boost} className="sword" />
          ) : (
            ""
          )}
          {m3 && stealStats.stolen ? <img src={pulse} className="sword" /> : ""}
          {m3 &&
          (forcePush.boosting ||
            kyberCrystal.boosting ||
            forcePull.boosting) ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          {m3.side == "light" && forceShield.active ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          <div
            id="a"
            style={
              attacker.position === "3" ||
              willAttack === "3" ||
              mindTricks.attacker === "3" ||
              mindTricks.defender === "3"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="b"
            style={
              attacker.position === "3" ||
              willAttack === "3" ||
              mindTricks.attacker === "3" ||
              mindTricks.defender === "3"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="c"
            style={
              attacker.position === "3" ||
              willAttack === "3" ||
              mindTricks.attacker === "3" ||
              mindTricks.defender === "3"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="d"
            style={
              attacker.position === "3" ||
              willAttack === "3" ||
              mindTricks.attacker === "3" ||
              mindTricks.defender === "3"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
        </div>

        <div
          onClick={() => {
            if (cardToDeploy && !m4) {
              setM4(findCard(cardToDeploy.name));
              setHandCards(
                handCards.filter((element) => element.id !== cardToDeploy.id)
              );
              const updatedMana = myMana - cardToDeploy.mana;
              setMyMana(updatedMana);
              setCardToDeploy("");
            }
            single = 1;
            setTimeout(function () {
              if (single) {
                if (forcePull.boosting) {
                  setM4({
                    ...m4,
                    attack: m4.attack + 400,
                    defence: m4.defence + 400,
                    forcePull: true,
                  });
                  setForcePull({
                    ...forcePull,
                    boosting: false,
                  });
                } else if (kyberCrystal.boosting) {
                  setM4({
                    ...m4,
                    attack: m4.attack + 200,
                    kyberCrystal: myTurn.round + 1,
                  });
                  setKyberCrystal({
                    ...kyberCrystal,
                    boosting: false,
                  });
                } else if (forcePush.boosting) {
                  setM4({
                    ...m4,
                    attack: m4.attack + 300,
                    defence: m4.defence + 300,
                    forcePush: myTurn.round + 1,
                  });
                  setForcePush({
                    ...forcePush,
                    boosting: false,
                  });
                } else if (forceShield.active && m4.side == "light") {
                  setM4({
                    ...m4,
                    immune: true,
                  });
                  setForceShield({
                    active: false,
                  });
                } else if (stealStats.stolen && m4) {
                  setM4({
                    ...m4,
                    attack: m4.attack + stealStats.attack,
                    defence: m4.defence + stealStats.defence,
                  });
                  setStealStats({
                    ...stealStats,
                    stolen: false,
                  });
                } else if (sithBetrayal.boosting && m4) {
                  setM4({
                    ...m4,
                    attack: m4.attack + 500,
                    defence: m4.defence + 500,
                    sithBetrayal: myTurn.round + 1,
                  });
                  setSithBetrayal({
                    ...sithBetrayal,
                    boosting: false,
                  });
                  setM6("");
                } else if (sithBetrayal.destroying && m4) {
                  setM4("");
                  setSithBetrayal({
                    destroying: false,
                    boosting: true,
                  });
                } else if (
                  (m4 && !m4.isDef && m4.timesAttacked == 0) ||
                  (m4 &&
                    !m4.isDef &&
                    m4.timesAttacked == 1 &&
                    m4.name === "dooku")
                ) {
                  if (!isMyFirstTurn.current) {
                    if (cancelAttack.position != 4 && !m4.wasDef) {
                      props.setAttackPrepare(true);
                      setAttacker({ position: "4", fightCard: m4 });
                      client.send(
                        JSON.stringify({
                          type: "will_attack",
                          adress: props.enemyId,
                          position: "4",
                        })
                      );
                    }
                  }
                }
              }
            }, 300);
          }}
          onDoubleClick={() => {
            single = 0;
            if (m4 && !m4.locked.active && !m4.wasDef) {
              if (m4.isDef) {
                setM4((old) => ({
                  ...old,
                  wasDef: true,
                  isDef: !old.isDef,
                }));
              } else {
                setM4((old) => ({
                  ...old,
                  isDef: !old.isDef,
                }));
              }
            }
          }}
          name="m4"
          id={`${!m4 && cardToDeploy ? "hovered" : "unhovered"}`}
          className={`card ${m4 ? "full" : "empty"}`}
        >
          <img
            className="fight-card"
            style={Object.assign(
              {},
              m4.isDef
                ? { transform: "rotate(90deg)" }
                : { transform: "rotate(0deg)" },
              attacker.position === "4" ||
                willAttack === "4" ||
                mindTricks.attacker === "4" ||
                mindTricks.defender === "4"
                ? {
                    animation: "shake 0.5s",
                    animationIterationCount: "infinite",
                  }
                : { animation: "none", animationIterationCount: "unset" }
            )}
            onMouseOver={(e) => {
              props.setImg({ img: e.target.src, description: e.target.alt });
            }}
            onMouseOut={() => {
              props.setImg({ img: "", description: "" });
            }}
            name={`${m4 ? m4.name : ""}`}
            src={`${m4 ? m4.image : explosion}`}
            alt={`${m4 ? m4.description : ""}`}
          />
          <span>
            <b style={!m4.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m4 ? m4.attack + "/" : ""
            }`}</b>
            <b style={m4.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m4 ? m4.defence : ""
            }`}</b>
          </span>
          {m4 ? (
            m4.maulCurse.active ? (
              <img src={darthmaul} className="sword" />
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {sithBetrayal.destroying && m4 ? (
            <img src={fire} className="sword" />
          ) : (
            ""
          )}
          {sithBetrayal.boosting && m4 ? (
            <img src={boost} className="sword" />
          ) : (
            ""
          )}
          {m4 && stealStats.stolen ? <img src={pulse} className="sword" /> : ""}
          {m4 &&
          (forcePush.boosting ||
            kyberCrystal.boosting ||
            forcePull.boosting) ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          {m4.side == "light" && forceShield.active ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          <div
            id="a"
            style={
              attacker.position === "4" ||
              willAttack === "4" ||
              mindTricks.attacker === "4" ||
              mindTricks.defender === "4"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="b"
            style={
              attacker.position === "4" ||
              willAttack === "4" ||
              mindTricks.attacker === "4" ||
              mindTricks.defender === "4"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="c"
            style={
              attacker.position === "4" ||
              willAttack === "4" ||
              mindTricks.attacker === "4" ||
              mindTricks.defender === "4"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="d"
            style={
              attacker.position === "4" ||
              willAttack === "4" ||
              mindTricks.attacker === "4" ||
              mindTricks.defender === "4"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
        </div>

        <div
          onClick={() => {
            if (cardToDeploy && !m5) {
              setM5(findCard(cardToDeploy.name));
              setHandCards(
                handCards.filter((element) => element.id !== cardToDeploy.id)
              );
              const updatedMana = myMana - cardToDeploy.mana;
              setMyMana(updatedMana);
              setCardToDeploy("");
            }
            single = 1;
            setTimeout(function () {
              if (single) {
                if (forcePull.boosting) {
                  setM5({
                    ...m5,
                    attack: m5.attack + 400,
                    defence: m5.defence + 400,
                    forcePull: true,
                  });
                  setForcePull({
                    ...forcePull,
                    boosting: false,
                  });
                } else if (kyberCrystal.boosting) {
                  setM5({
                    ...m5,
                    attack: m5.attack + 200,
                    kyberCrystal: myTurn.round + 1,
                  });
                  setKyberCrystal({
                    ...kyberCrystal,
                    boosting: false,
                  });
                } else if (forcePush.boosting) {
                  setM5({
                    ...m5,
                    attack: m5.attack + 300,
                    defence: m5.defence + 300,
                    forcePush: myTurn.round + 1,
                  });
                  setForcePush({
                    ...forcePush,
                    boosting: false,
                  });
                } else if (forceShield.active && m5.side == "light") {
                  setM5({
                    ...m5,
                    immune: true,
                  });
                  setForceShield({
                    active: false,
                  });
                } else if (stealStats.stolen && m5) {
                  setM5({
                    ...m5,
                    attack: m5.attack + stealStats.attack,
                    defence: m5.defence + stealStats.defence,
                  });
                  setStealStats({
                    ...stealStats,
                    stolen: false,
                  });
                } else if (sithBetrayal.boosting && m5) {
                  setM5({
                    ...m5,
                    attack: m5.attack + 500,
                    defence: m5.defence + 500,
                    sithBetrayal: myTurn.round + 1,
                  });
                  setSithBetrayal({
                    ...sithBetrayal,
                    boosting: false,
                  });
                  setM6("");
                } else if (sithBetrayal.destroying && m5) {
                  setM5("");
                  setSithBetrayal({
                    destroying: false,
                    boosting: true,
                  });
                } else if (
                  (m5 && !m5.isDef && m5.timesAttacked == 0) ||
                  (m5 &&
                    !m5.isDef &&
                    m5.timesAttacked == 1 &&
                    m5.name === "dooku")
                ) {
                  if (!isMyFirstTurn.current) {
                    if (cancelAttack.position != 5 && !m5.wasDef) {
                      props.setAttackPrepare(true);
                      setAttacker({ position: "5", fightCard: m5 });
                      client.send(
                        JSON.stringify({
                          type: "will_attack",
                          adress: props.enemyId,
                          position: "5",
                        })
                      );
                    }
                  }
                }
              }
            }, 300);
          }}
          onDoubleClick={() => {
            single = 0;
            if (m5 && !m5.locked.active && !m5.wasDef) {
              if (m5.isDef) {
                setM5((old) => ({
                  ...old,
                  wasDef: true,
                  isDef: !old.isDef,
                }));
              } else {
                setM5((old) => ({
                  ...old,
                  isDef: !old.isDef,
                }));
              }
            }
          }}
          name="m5"
          id={`${!m5 && cardToDeploy ? "hovered" : "unhovered"}`}
          className={`card ${m5 ? "full" : "empty"}`}
        >
          <img
            className="fight-card"
            style={Object.assign(
              {},
              m5.isDef
                ? { transform: "rotate(90deg)" }
                : { transform: "rotate(0deg)" },
              attacker.position === "5" ||
                willAttack === "5" ||
                mindTricks.attacker === "5" ||
                mindTricks.defender === "5"
                ? {
                    animation: "shake 0.5s",
                    animationIterationCount: "infinite",
                  }
                : { animation: "none", animationIterationCount: "unset" }
            )}
            onMouseOver={(e) => {
              props.setImg({ img: e.target.src, description: e.target.alt });
            }}
            onMouseOut={() => {
              props.setImg({ img: "", description: "" });
            }}
            name={`${m5 ? m5.name : ""}`}
            src={`${m5 ? m5.image : explosion}`}
            alt={`${m5 ? m5.description : ""}`}
          />
          <span>
            <b style={!m5.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m5 ? m5.attack + "/" : ""
            }`}</b>
            <b style={m5.isDef ? { color: "white" } : { color: "grey" }}>{`${
              m5 ? m5.defence : ""
            }`}</b>
          </span>
          {m5 ? (
            m5.maulCurse.active ? (
              <img src={darthmaul} className="sword" />
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {sithBetrayal.destroying && m5 ? (
            <img src={fire} className="sword" />
          ) : (
            ""
          )}
          {sithBetrayal.boosting && m5 ? (
            <img src={boost} className="sword" />
          ) : (
            ""
          )}
          {m5 && stealStats.stolen ? <img src={pulse} className="sword" /> : ""}
          {m5 &&
          (forcePush.boosting ||
            kyberCrystal.boosting ||
            forcePull.boosting) ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          {m5.side == "light" && forceShield.active ? (
            <img src={pulse} className="sword" />
          ) : (
            ""
          )}
          <div
            id="a"
            style={
              attacker.position === "5" ||
              willAttack === "5" ||
              mindTricks.attacker === "5" ||
              mindTricks.defender === "5"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="b"
            style={
              attacker.position === "5" ||
              willAttack === "5" ||
              mindTricks.attacker === "5" ||
              mindTricks.defender === "5"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="c"
            style={
              attacker.position === "5" ||
              willAttack === "5" ||
              mindTricks.attacker === "5" ||
              mindTricks.defender === "5"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
          <div
            id="d"
            style={
              attacker.position === "5" ||
              willAttack === "5" ||
              mindTricks.attacker === "5" ||
              mindTricks.defender === "5"
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
            className="pulse"
          ></div>
        </div>
      </div>

      <div className="extra-space">
        <div className="deck">
          <span className="cards-counter">{deck.length}</span>
          <img
            id="deck"
            draggable="false"
            src={`${
              whoIsJedi.current
                ? "https://i.imgur.com/91Szz36.jpg"
                : "https://i.imgur.com/J8aBfLG.png"
            }`}
            alt=""
          />
        </div>
        <div
          onClick={(event) => {
            myRef.current.style.display = "block";
          }}
          className="trash"
        >
          <img
            src={`${trash.length > 0 ? trash[trash.length - 1].image : ""}`}
          />
        </div>
      </div>

      {myTurn.turn ? (
        props.attackPrepare ? (
          <div
            onClick={() => {
              props.setAttackPrepare(false);
              setReyAttacker(false);
              client.send(
                JSON.stringify({
                  type: "will_attack",
                  adress: props.enemyId,
                  position: "",
                })
              );
              setAttacker("");
              if (deathStarActive.active) {
                setDeathStarActive({
                  active: false,
                  position: null,
                });
              }
            }}
            className="btn"
          >
            <a
              style={
                whoIsJedi.current
                  ? { background: "#5082f0" }
                  : { background: "#f44336" }
              }
              href="#"
            >
              Cancel <br />
              attack
            </a>
          </div>
        ) : cardToDeploy || specialToDeploy ? (
          <div
            onClick={() => {
              setCardToDeploy("");
              setSpecialToDeploy("");
            }}
            className="btn"
          >
            <a
              style={
                whoIsJedi.current
                  ? { background: "#5082f0" }
                  : { background: "#f44336" }
              }
              href="#"
            >
              Cancel <br />
              selection
            </a>
          </div>
        ) : (
          <div
            onClick={() => {
              if (myTurn.turn) {
                if (isMyFirstTurn.current === true) {
                  isMyFirstTurn.current = false;
                }
                setMyTurn({
                  ...myTurn,
                  turn: false,
                });
                client.send(
                  JSON.stringify({
                    type: "your_turn",
                    adress: props.enemyId,
                    turn: { turn: true, round: enemyTurn.round + 1 },
                  })
                );
                client.send(
                  JSON.stringify({
                    type: "my_turn",
                    adress: props.enemyId,
                    turn: { turn: false, round: myTurn.round },
                  })
                );
                setEnemyTurn({ turn: true, round: enemyTurn.round + 1 });

                changeCards.forEach((card, index) => {
                  let copyCard = getCards[index]();
                  if (copyCard.wasDef) {
                    card((old) => ({
                      ...old,
                      wasDef: false,
                    }));
                  }
                  if (copyCard.timesAttacked) {
                    card((old) => ({
                      ...old,
                      timesAttacked: 0,
                    }));
                  }
                  if (copyCard.forcePull) {
                    if (copyCard.attack < 200 || copyCard.defence < 200) {
                      card("");
                    } else {
                      card((old) => ({
                        ...old,
                        attack: old.attack - 100,
                        defence: old.defence - 100,
                      }));
                    }
                  }
                });
                undoSeduceAndRedeemEffect();
                if (noForceCards) {
                  setNoForceCards(false);
                }
                if (noSummon) {
                  setNoSummon(false);
                }
              }
            }}
            className="btn"
          >
            <a
              style={
                whoIsJedi.current
                  ? { background: "#5082f0" }
                  : { background: "#f44336" }
              }
              href="#"
            >
              End turn
            </a>
          </div>
        )
      ) : (
        ""
      )}
    </div>
  );
}
