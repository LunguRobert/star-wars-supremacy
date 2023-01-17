import React, { useState, useEffect } from "react";

function HandCards(props) {
  const {
    myMana,
    setMyMana,
    noSummon,
    noForceCards,
    setImg,
    myFirstCards,
    setCardToDeploy,
    setSpecialToDeploy,
    cardToDeploy,
    specialToDeploy,
  } = props;

  return (
    <div className="my-cards">
      {myFirstCards
        ? myFirstCards.map((itm, index) => {
            if (itm) {
              return (
                <div key={index} id={`h${index}`} className="hand">
                  <img
                    name={`${itm.name}`}
                    className="fill"
                    src={itm.image}
                    alt=""
                  />
                  <span
                    onMouseOver={() => {
                      setImg({ img: itm.image, description: itm.description });
                    }}
                    onClick={(e) => {
                      if (itm.mana <= myMana) {
                        if (
                          e.target.getAttribute("name").split("_")[0] ===
                          "special"
                        ) {
                          if (!noForceCards) {
                            setSpecialToDeploy(itm);
                          }
                          if (cardToDeploy) {
                            setCardToDeploy("");
                          }
                        } else {
                          if (!noSummon) {
                            setCardToDeploy(itm);
                          }
                          if (specialToDeploy) {
                            setSpecialToDeploy("");
                          }
                        }
                      }
                    }}
                    onMouseMove={(e) => {
                      var l = e.nativeEvent.offsetX;
                      var t = e.nativeEvent.offsetY;
                      var h = e.target.offsetHeight;
                      var w = e.target.offsetWidth;
                      var lp = Math.abs(Math.floor((100 / w) * l) - 100);
                      var tp = Math.abs(Math.floor((100 / h) * t) - 100);
                      e.target.classList.remove("active");
                      e.target.classList.add("active");
                      e.target.style.backgroundPosition = `${lp}% ${tp}%`;
                    }}
                    onMouseOut={(e) => {
                      e.target.classList.remove("active");
                      e.target.style.backgroundPosition = "0% 0%";
                      setImg({ img: "", description: "" });
                    }}
                    name={`${itm.name}`}
                  ></span>
                </div>
              );
            }
          })
        : null}
    </div>
  );
}

export default HandCards;
