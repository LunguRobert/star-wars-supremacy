import React, { useState, useEffect, useRef } from "react";
import "./Game.css";
import Mytable from "../Mytable/Mytable";
import Enemytable from "../Enemytable/Enemytable";
import Announcer from "../Announcer/Announcer";
import Conclusion from "../Conclusion/Conclusion";
import { useParams } from "react-router-dom";

export default function Game({ client }) {
  const whoIsJedi = useRef(false);
  const isMyFirstTurn = useRef(false);
  const allDataRequired = useRef(true);
  const prevMana = useRef(5);

  const [myUserName, setMyUserName] = useState("");
  const [enemyUserName, setEnemyUserName] = useState("");
  const [gameFinished, setGameFinished] = useState(false);
  const [myTurn, setMyTurn] = useState({
    turn: false,
    round: 0,
    isMyFirstTurn : false,
  });
  const [enemyTurn, setEnemyTurn] = useState({
    turn: false,
    round: 0,
  });
  const myRef = useRef(null);
  const [reborn, setReborn] = useState({
    active: false,
    reborn: false,
  });
  const [locked, setLocked] = useState({
    active: false,
  });

  const [trashCopy, setTrashCopy] = useState([]);

  const [bleed, setBleed] = useState({
    active: false,
  });
  const [img, setImg] = useState({ img: "", description: "" });
  const [data, setData] = useState("");
  console.log(data, "room data");
  const [mySide, setMySide] = useState("");
  const [whoIAm, setWhoIAm] = useState("");
  const [whoIsEnemy, setWhoIsEnemy] = useState("");
  const [enemyId, setEnemyId] = useState("");

  const [attackPrepare, setAttackPrepare] = useState(false);

  const [baseDefender, setBaseDefender] = useState(false);
  const [defender, setDefender] = useState("");
  const [mindTrick, setMindTrick] = useState({
    attackerActive: false,
    attackerPosition: "",
    defenderActive: false,
  });
  const [stealStats, setStealStats] = useState({
    active: false,
    stolen: false,
    attack: 300,
    defence: 300,
  });
  const [cardTaken, setCardTaken] = useState({
    active: false,
    card: "",
    position: "",
    newPosition: "",
  });
  const [cancelAttack, setCancelAttack] = useState({
    active: "",
    turn: "",
    position: "",
  });
  const [reyAttacker, setReyAttacker] = useState(false);

  const [myMana, setMyMana] = useState(5);
  const [enemyMana, setEnemyMana] = useState(5);

  const myHpClone = useRef();
  const enemyHpClone = useRef();

  const [myHp, setMyHp] = useState(20000);
  const [enemyHp, setEnemyHp] = useState(20000);

  const params = useParams();

  function enemyDisconnected() {
    if (myHp > 0) {
      setEnemyHp(-99999);
    }
  }

  useEffect(()=>{
    myHpClone.current = myHp;
    enemyHpClone.current = enemyHp;
  },[myHp,enemyHp])

  useEffect(() => {
    if (myHp <= 0 || enemyHp <= 0) {
      setGameFinished(true);
    }
  });

  useEffect(() => {
    client.send(
      JSON.stringify({ type: "my_mana", adress: enemyId, myMana: myMana })
    );
  }, [myMana]);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, []);

  useEffect(() => {
    if(params.gameMode === "duel_of_fates"){
      setMyMana(5);
      prevMana.current =  5;
    }else {
      setMyMana(9);
      prevMana.current = 9;
    }

    client.send(JSON.stringify({ type: "get_data" }));
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.type === "data") {
        setData(dataFromServer.updatedState);
        if (!whoIAm && !whoIsEnemy && allDataRequired.current) {
          allDataRequired.current = false;
          const data = dataFromServer.updatedState;
          const guest =
            data[data.findIndex((obj) => obj.room === params.roomNumber)]
              .players.guest.id == params.uniqueId;
          if (guest) {
            setWhoIAm("guest");
            setWhoIsEnemy("host");
            const myUser =
              data[data.findIndex((obj) => obj.room === params.roomNumber)]
                .players["guest"].username;
            const enemyUser =
              data[data.findIndex((obj) => obj.room === params.roomNumber)]
                .players["host"].username;
            setMyUserName(myUser);
            setEnemyUserName(enemyUser);
            const enemyUniqueId =
              data[data.findIndex((obj) => obj.room === params.roomNumber)]
                .players["host"].id;
            setEnemyId(enemyUniqueId);
          } else {
            setWhoIAm("host");
            setWhoIsEnemy("guest");
            setMySide("light");
            const myUser =
              data[data.findIndex((obj) => obj.room === params.roomNumber)]
                .players["host"].username;
            const enemyUser =
              data[data.findIndex((obj) => obj.room === params.roomNumber)]
                .players["guest"].username;
            setMyUserName(myUser);
            setEnemyUserName(enemyUser);
            const enemyUniqueId =
              data[data.findIndex((obj) => obj.room === params.roomNumber)]
                .players["guest"].id;
            setEnemyId(enemyUniqueId);
          }
        }
      }
      if (dataFromServer.type === "your_turn") {
        setMyTurn(dataFromServer.turn);
      }
      if (dataFromServer.type === "my_turn") {
        setEnemyTurn(dataFromServer.turn);
      }
      if (dataFromServer.type === "my_mana") {
        setEnemyMana(dataFromServer.myMana);
      }
      if (dataFromServer.type === "enemy_disconnected") {
        enemyDisconnected();
      }
      if (dataFromServer.type === "your_first_turn") {
        isMyFirstTurn.current = dataFromServer.isMyFirstTurn;
      }
    };
  }, []);

  useEffect(() => {
    if (whoIAm === "host") {
      const whoIsFirst = Math.floor(Math.random() * 2);
      if (whoIsFirst == 1) {
        setMyTurn({
          turn: true,
          round: 1,
        });
        whoIsJedi.current = true;
        isMyFirstTurn.current = true;
        client.send(
          JSON.stringify({
            type: "my_turn",
            adress: enemyId,
            turn: { turn: true, round: 1},
          })
        );
      } else {
        whoIsJedi.current = false;
        client.send(
          JSON.stringify({
            type: "your_turn",
            adress: enemyId,
            turn: { turn: true, round: 1},
          })
        );
        client.send(
          JSON.stringify({
            type: "your_first_turn",
            adress: enemyId,
            isMyFirstTurn: true,
          })
        );
        setEnemyTurn({
          turn: true,
          round: 1,
        });
      }
    }
  }, [whoIAm]);

  useEffect(() => {
    var Space = {
      init: function () {
        var self = this;
        this.config = {
          perspective: 3,
          star_color: "255, 255, 255",
          speed: 1,
          stars_count: 2,
        };
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.start();
        window.onresize = function () {
          self.start();
        };
      },

      start: function () {
        var self = this;

        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.canvas_center_x = this.canvas.width / 2;
        this.canvas_center_y = this.canvas.height / 2;

        this.stars_count = this.canvas.width / this.config.stars_count;
        this.focal_length = this.canvas.width / this.config.perspective;
        this.speed = (this.config.speed * this.canvas.width) / 2000;

        this.stars = [];

        for (let i = 0; i < this.stars_count; i++) {
          this.stars.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            z: Math.random() * this.canvas.width,
          });
        }

        window.cancelAnimationFrame(this.animation_frame);
        this.canvas.style.opacity = 1;

        this.cow = new Image();
        this.cow.src =
          "https://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Fast-Food-PNG-Clipart/Hamburger_PNG_Vector_Picture.png?m=1507172108";
        this.cow.onload = function () {
          self.render();
        };
      },

      render: function () {
        var self = this;
        this.animation_frame = window.requestAnimationFrame(function () {
          self.render();
        });
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0, length = this.stars.length; i < length; i += 1) {
          var star = this.stars[i];
          star.z -= this.speed;
          if (star.z <= 0) {
            this.stars[i] = {
              x: Math.random() * this.canvas.width,
              y: Math.random() * this.canvas.height,
              z: this.canvas.width,
            };
          }

          var star_x =
            (star.x - this.canvas_center_x) * (this.focal_length / star.z) +
            this.canvas_center_x;
          var star_y =
            (star.y - this.canvas_center_y) * (this.focal_length / star.z) +
            this.canvas_center_y;
          var star_radius = Math.max(
            0,
            (1.4 * (this.focal_length / star.z)) / 2
          );
          var star_opacity = 1.2 - star.z / this.canvas.width;
          var cow_width = Math.max(
            0.1,
            (100 * (this.focal_length / star.z)) / 2
          );

          if (star.cow) {
            this.context.save();
            this.context.translate(
              star_x - cow_width + cow_width / 2,
              star_y - cow_width + cow_width / 2
            );
            this.context.rotate(star.z / star.rotation_speed);
            this.context.translate(
              -(star_x - cow_width + cow_width / 2),
              -(star_y - cow_width + cow_width / 2)
            );
            this.context.globalAlpha = star_opacity;
            this.context.drawImage(
              this.cow,
              0,
              0,
              this.cow.width,
              this.cow.width,
              star_x - cow_width,
              star_y - cow_width,
              cow_width,
              cow_width
            );
            this.context.restore();
          } else {
            this.context.fillStyle =
              "rgba(" + this.config.star_color + "," + star_opacity + ")";
            this.context.beginPath();
            this.context.arc(star_x, star_y, star_radius, 0, Math.PI * 2);
            this.context.fill();
          }
        }
      },
    };

    Space.init();
  }, []);

  function increaseMana() {
    if (myMana < 9) {
      if (prevMana.current < 9) {
        prevMana.current += 1;
      }
      setMyMana(prevMana.current);
    }
  }

  useEffect(() => {
    if (myTurn.turn === true && myTurn.round !== 1) {
      increaseMana();
    }
  }, [myTurn]);

  return (
    <div className="game-container">
      <Announcer myTurn={myTurn} />
      <Conclusion
        style={{ display: `${gameFinished ? "inline-flex" : "none"}` }}
        myHp={myHp}
        enemyHp={enemyHp}
      />

      <canvas id="canvas"></canvas>
      <div className="card-info">
        <div id="card">
          <img src={`${img.img}`} alt="" />
        </div>
        <p>{img.description}</p>
      </div>
      <div
        ref={myRef}
        className="trash-container"
        style={{ display: `${reborn.active ? "block" : "none"}` }}
      >
        <button
          onClick={() => {
            myRef.current.style.display = "none";
          }}
        >
          Exit
        </button>
        {trashCopy.map((itm, index) => {
          return (
            <img
              onClick={() => {
                if (reborn.active) {
                  setReborn({ active: false, reborn: itm.name });
                }
              }}
              key={index}
              src={`${itm.image}`}
            />
          );
        })}
      </div>
      <div className="board-container">
        <div className="my-stats">
          <div className="user">
            <h3>{whoIAm ? myUserName : null}</h3>
          </div>
          <div className="health">
            <h3>{myHp}</h3>
            <span style={{ width: `${myHp / 200}%` }}></span>
          </div>
          <div className="mana">
            <h3>{myMana}</h3>
            <span style={{ width: `${myMana / 0.09}%` }}></span>
          </div>
        </div>

        <div
          className="enemy-stats"
          style={
            reyAttacker
              ? { animation: "pulse 2s infinite" }
              : { animation: "none" }
          }
          onClick={() => {
            if (reyAttacker) {
              setBaseDefender(true);
            }
          }}
        >
          <div className="user">
            <h3>{whoIsEnemy ? enemyUserName : null}</h3>
          </div>
          <div className="health">
            <h3>{enemyHp}</h3>
            <span style={{ width: `${enemyHp / 200}%` }}></span>
          </div>
          <div className="mana">
            <h3>{enemyMana}</h3>
            <span style={{ width: `${enemyMana / 0.09}%` }}></span>
          </div>
        </div>

        <div className="board">
          <div className="enemy-container">
            <Enemytable
              whoIsJedi={whoIsJedi}
              locked={locked}
              setLocked={setLocked}
              bleed={bleed}
              setBleed={setBleed}
              setMindTrick={setMindTrick}
              mindTrick={mindTrick}
              setStealStats={setStealStats}
              stealStats={stealStats}
              myTurn={myTurn}
              enemyTurn={enemyTurn}
              cancelAttack={cancelAttack}
              setCancelAttack={setCancelAttack}
              enemyId={enemyId}
              cardTaken={cardTaken}
              setCardTaken={setCardTaken}
              setEnemyMana={setEnemyMana}
              enemyMana={enemyMana}
              setEnemyHp={setEnemyHp}
              enemyHp={enemyHp}
              setDefender={setDefender}
              attackPrepare={attackPrepare}
              setAttackPrepare={setAttackPrepare}
              client={client}
              setImg={setImg}
              side={`${mySide == "light" ? "dark" : "light"}`}
            />
          </div>
          <div className="my-container">
            <Mytable
              myRef={myRef}
              myHpClone={myHpClone}
              enemyHpClone={enemyHpClone}
              whoIsJedi={whoIsJedi}
              isMyFirstTurn={isMyFirstTurn}
              setLocked={setLocked}
              setTrashCopy={setTrashCopy}
              reborn={reborn}
              setReborn={setReborn}
              bleed={bleed}
              setBleed={setBleed}
              setMindTrick={setMindTrick}
              mindTrick={mindTrick}
              setStealStats={setStealStats}
              stealStats={stealStats}
              cancelAttack={cancelAttack}
              setCancelAttack={setCancelAttack}
              cardTaken={cardTaken}
              setCardTaken={setCardTaken}
              myTurn={myTurn}
              enemyTurn={enemyTurn}
              setMyTurn={setMyTurn}
              setEnemyTurn={setEnemyTurn}
              setBaseDefender={setBaseDefender}
              baseDefender={baseDefender}
              setReyAttacker={setReyAttacker}
              setEnemyHp={setEnemyHp}
              enemyHp={enemyHp}
              setMyMana={setMyMana}
              myMana={myMana}
              setMyHp={setMyHp}
              myHp={myHp}
              setDefender={setDefender}
              defender={defender}
              attackPrepare={attackPrepare}
              setAttackPrepare={setAttackPrepare}
              client={client}
              enemyId={enemyId}
              setImg={setImg}
              side={mySide}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
