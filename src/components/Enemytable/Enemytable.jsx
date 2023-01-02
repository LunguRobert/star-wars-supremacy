import React, { useEffect, useState } from 'react'
import './Enemytable.css'
import { allCards} from '../../scripts/allCards'
import sword from '../../images/sword.png'
import explosion from '../../images/explosion.gif'
import darthmaul from '../../images/darthmaul.png'
import pulse from '../../images/pulse.gif'
import special from '../../images/special3.gif'

function Enemytable(props) {

    const [m1, setM1] = useState('')
    const [m2, setM2] = useState('')
    const [m3, setM3] = useState('')
    const [m4, setM4] = useState('')
    const [m5, setM5] = useState('')
    const [m6, setM6] = useState('')

    const [willAttack2,setWillAttack2] = useState('');
    const [willAttack,setWillAttack] = useState('');
    const [mindTrickAttacker,setMindTrickAttacker] = useState('');
    const [mindTrickDefender,setMindTrickDefender] = useState('');


    const [enemyForceCard,setEnemyForceCard] = useState(['']);
    const [cardWithForce,setCardWithForce] = useState([
        m1,m2,m3,m4,m5,m6
    ]);

    const [lastTrashCard,setLastTrashCard] = useState();
    const [cardsToShow,setCardsToShow] = useState('');
    const [numberOfCards,setNumberOfCards] = useState(5);

    const {whoIsJedi,setLocked,locked,bleed,setBleed,setMindTrick,mindTrick,stealStats,setStealStats,enemyTurn, client ,cancelAttack,setCancelAttack,enemyId,cardTaken,setCardTaken,setEnemyMana,enemyMana,setEnemyHp,enemyHp,setDefender,attackPrepare,setAttackPrepare,myTurn,setImg } = props;

    function findCard(name){
        const iFoundIt = allCards.heros.find(element => element.name === name)
        return iFoundIt;
    }

    function forceAdd(m,position){
        var newArray = JSON.parse(JSON.stringify(cardWithForce));
        newArray[position] = m;
        setCardWithForce(newArray);
}

    useEffect(()=>{

        client.addEventListener("message", function(message) {
            const dataFromServer = JSON.parse(message.data);
            if(dataFromServer.type==='talk_to'){
                switch(dataFromServer.position){
                    case '1':
                        setM1(dataFromServer.card);
                        break;
                    case '2':
                        setM2(dataFromServer.card);
                        break;
                    case '3':
                        setM3(dataFromServer.card);
                        break;
                    case '4':
                        setM4(dataFromServer.card);
                        break;
                    case '5':
                        setM5(dataFromServer.card);
                        break;
                    case '6':
                        setM6(dataFromServer.card);
                        break;
                }
            }
            if(dataFromServer.type==='hand_cards'){
                    if(dataFromServer.existKylo){
                        setCardsToShow(dataFromServer.card)
                    }else {
                        setCardsToShow('');
                        setNumberOfCards(dataFromServer.numberOfCards);
                    }
            }
            if(dataFromServer.type==='enemy_force_cards'){
                setEnemyForceCard(dataFromServer.forceCards)
            }
            if(dataFromServer.type === 'will_attack'){
                setWillAttack(dataFromServer.position);
            }
            if(dataFromServer.type === 'lastTrashCard'){
                setLastTrashCard(dataFromServer.lastTrashCard);
            }
        });
    },[])

    useEffect(()=>{
        if(mindTrickAttacker && mindTrickDefender){

            switch(mindTrickAttacker.fightCard.name){
                case 'quigon':
                    const chanceCube = Math.floor(Math.random() * 2);
                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...mindTrickAttacker.fightCard,attack : chanceCube === 1 ? mindTrickAttacker.fightCard.attack + 700 : mindTrickAttacker.fightCard.attack - 700,defence : chanceCube === 1 ? mindTrickAttacker.fightCard.defence + 700 : mindTrickAttacker.fightCard.defence - 700},position:mindTrickDefender.position}))
                    const newAttacker = {
                        ...mindTrickAttacker,
                        fightCard : {
                            ...mindTrickAttacker.fightCard,
                            attack : chanceCube === 1 ? mindTrickAttacker.fightCard.attack + 700 : mindTrickAttacker.fightCard.attack - 700 ,
                        }
                    }
                    setTimeout(function(){mindTrickFight(mindTrickDefender,newAttacker)},2000);
                break;

                case 'ahsoka':
                    if(mindTrickDefender.fightCard.side === 'light'){
                        client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...mindTrickAttacker.fightCard,attack : mindTrickAttacker.fightCard.attack + 400},position:mindTrickDefender.position}))
                        const newAttacker = {
                            ...mindTrickAttacker,
                            fightCard : {
                                ...mindTrickAttacker.fightCard,
                                attack : mindTrickAttacker.fightCard.attack + 400,
                            }
                        }
                        setTimeout(function(){mindTrickFight(mindTrickDefender,newAttacker)},2000);
                    }
                    if(mindTrickDefender.fightCard.side ==='dark'){
                        const newDefender = {
                            ...mindTrickDefender,
                            fightCard : {
                                ...mindTrickDefender.fightCard,
                                attack : mindTrickDefender.fightCard.attack - 500,
                                defence : mindTrickDefender.fightCard.defence - 500,
                            }
                        }
                        client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...mindTrickDefender.fightCard,attack : mindTrickDefender.fightCard.attack - 500,defence : mindTrickDefender.fightCard.defence - 500},position:mindTrickDefender.position}))
                        setTimeout(function(){mindTrickFight(newDefender,mindTrickAttacker)},2000);
                    }
                break;

                default: 
                    if(mindTrickDefender.fightCard.name === 'ahsoka'){
                        switch(mindTrickAttacker.fightCard.side){
                            case 'dark':
                                const newAttacker = {
                                    ...mindTrickAttacker,
                                    fightCard : {
                                        ...mindTrickAttacker.fightCard,
                                        attack : mindTrickAttacker.fightCard.attack - 500,
                                        defence : mindTrickAttacker.fightCard.defence - 500,
                                    }
                                }
                                client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...mindTrickAttacker.fightCard,attack : mindTrickAttacker.fightCard.attack - 500,defence : mindTrickAttacker.fightCard.defence - 500},position:mindTrickAttacker.position}))
                                setTimeout(function(){mindTrickFight(mindTrickDefender,newAttacker)},2000);
                            break;
                        }
                    }else {
                        setTimeout(()=>{
                            mindTrickFight(mindTrickDefender,mindTrickAttacker);
                        },2000)
                    }
                break;
            }
        }
    },[mindTrickAttacker,mindTrickDefender])

    function mindTrickFight(defender,attacker){
        if(!mindTrickDefender.fightCard.immune){
            const defence = defender.fightCard.attack
            if(defence > attacker.fightCard.attack){
                if(!defender.fightCard.isDef){
                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:attacker.position}))
                    switch(attacker.fightCard.name){
                        case 'darthsidious':
                        if(attacker.fightCard.revived===0){
                            setTimeout(()=>{
                                client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...attacker.fightCard,revived:attacker.fightCard.revived+1,timesAttacked:attacker.fightCard.timesAttacked+1},position:attacker.position}))
                            }
                                ,2000
                            )
                        }
                        break;
    
                        case 'grievous':
                            enemyForceCard.forEach((card,index)=>{
                                if(card.name === 'droid'){
                                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:(index+1).toString()}));
                                }
                            });
                        break;
                    }
                }
                
    
                const diference = defence - attacker.fightCard.attack;
                client.send(JSON.stringify({type: 'enemyHp',adress:props.enemyId,diference: diference}));
    
                switch(attacker.fightCard.name){
    
                    case 'ahsoka':
                        if(defender.fightCard.side==='dark'){
                            client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...defender.fightCard,attack : defender.fightCard.attack + 500,defence : defender.fightCard.defence + 500},position:defender.position}))
                        }
                        break;
                    
                    case 'maul':

                        client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...defender.fightCard,maulCurse : {active: true,round: myTurn.round+1}},position:defender.position}));
                        break;
                }
    
                switch(defender.fightCard.name){
    
                    case 'anakin':
                        client.send(JSON.stringify({type: 'talk_to_anakin',adress:props.enemyId,position:defender.position}));
                        break;
                }
    
                
            }
            if(defence == attacker.fightCard.attack){
                if(!defender.fightCard.isDef){
                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:defender.position}));
                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:attacker.position}));
                    
        
                    switch(defender.fightCard.name){
                        case 'darthsidious':
                            if(defender.fightCard.revived===0){
                                setTimeout(()=>{
                                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...defender.fightCard,revived:defender.fightCard.revived+1},position:defender.position}));
                                }
                                    ,2000
                                )
                            }
                            break;
                        
                        case 'grievous':
                            enemyForceCard.forEach((card,index)=>{
                                if(card.name === 'droid'){
                                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:(index+1).toString()}));
                                }
                            });
                            break;
                    }
        
                    switch(attacker.fightCard.name){
    
                        case 'darthsidious':
                            if(attacker.fightCard.revived===0){
                                setTimeout(()=>{
                                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...attacker.fightCard,revived:attacker.fightCard.revived+1},position:attacker.position}));
                                }
                                    ,2000
                                )
                            }
                            break;
                        
                        case 'grievous':
                            cardWithForce.forEach((card,index)=>{
                                if(card.name === 'droid'){
                                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:(index+1).toString()}));
                                }
                            });
                            break;   
                    }
                }
            }
            if(defence < attacker.fightCard.attack){
                if(defender.fightCard.isDef){
                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:defender.position}));
                    
                }else {
                    const diference = attacker.fightCard.attack - defender.fightCard.defence;
                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:defender.position,diference:diference}));
                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:defender.position}));
                    setEnemyHp(enemyHp-diference);
                    
                }
    
                switch(attacker.fightCard.name){
    
                    case 'anakin':
                        client.send(JSON.stringify({type: 'talk_to_anakin',adress:props.enemyId,position:attacker.position}));
                        break;

                    case 'ahsoka':
                        if(defender.fightCard.side === 'light'){
                            client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...attacker.fightCard,attacker:attacker.fightCard.attack + 400},position:attacker.position}));
                        }
                        break;
                }
    
                switch(defender.fightCard.name){
                    case 'darthsidious':
                        if(defender.fightCard.revived===0){
                            setTimeout(()=>{
                                client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...defender.fightCard,revived:defender.fightCard.revived+1},position:defender.position}))
                            }
                                ,2000
                            )
                        }
                        break;
                    
                    case 'ahsoka':
                        client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...attacker.fightCard,attack:attacker.fightCard.attack - 500,defence:attacker.fightCard.defence - 500},position:attacker.position}));
                        break;
    
                    case 'maul':
                        client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...attacker.fightCard,maulCurse:{active:true,round:myTurn.round+1}},position:attacker.position}));
                        break;
                    
                    case 'grievous':
                        enemyForceCard.forEach((card,index)=>{
                            if(card.name === 'droid'){
                                client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:'',position:(index+1).toString()}));
                            }
                        });
                        break;
                    
                }
    
            }
        }else {
            client.send(JSON.stringify({type: 'talk_to_attacker',adress:props.enemyId,card:{...defender.fightCard,immune : false},position:defender.position}))
        }
        client.send(JSON.stringify({type: 'mindTricks',adress:props.enemyId,mindTricks:'',who : 'both'}));
        setMindTrickAttacker('');
        setMindTrickDefender('');
    }


    function takeAction(m,position){
        if(m){
            if(locked.active){
                client.send(JSON.stringify({type: 'talk_to_attacker',adress:enemyId,card:{...m,locked : {active : true,round : enemyTurn.round + 3},isDef : !m.isDef},position:position.toString()}));
                setLocked({
                    active : false,
                })
            }else if(bleed.active){
                if(m.name !== 'yoda'){
                    client.send(JSON.stringify({type: 'talk_to_attacker',adress:enemyId,card:{...m,forceChoke: 1,attack : m.attack - 200 ,defence : m.defence -200},position:position.toString()}));
                    setBleed({
                        active : false,
                    })
                }else{
                    setBleed({
                        active : false,
                    })
                }
            }else if(mindTrick.attackerActive){
                client.send(JSON.stringify({type: 'mindTricks',adress:props.enemyId,mindTricks:position.toString(),who : 'attacker'}));
                setMindTrickAttacker({position:position.toString(),fightCard:m});
                setMindTrick({
                    attackerActive : false,
                    attackerPosition : position,
                    defenderActive : true,
                });
            }else if(mindTrick.defenderActive){
                client.send(JSON.stringify({type: 'mindTricks',adress:props.enemyId,mindTricks:position.toString(),who : 'defender'}))
                setMindTrickDefender({position:position.toString(),fightCard:m});
                setMindTrick({
                    ...mindTrick,
                    defenderActive : false,
                    attackerPosition : '',
                });
            }else if(stealStats.active){
                setStealStats({
                    ...stealStats,
                    active : false,
                    stolen : true,
                });
                client.send(JSON.stringify({type: 'talk_to_attacker',adress:enemyId,card:{...m,attack:m.attack -300,defence : m.defence - 300},position:position.toString()}));
            }else if(m.side == 'dark' && cancelAttack.active){
                setCancelAttack({
                    ...cancelAttack,
                    active : false,
                })
                client.send(JSON.stringify({type: 'cancel_attack',adress:enemyId,cancelAttack:{turn : myTurn.round + 2,active : false,position : position}}));
            }else if(cardTaken.active){
                setCardTaken({
                    active : false,
                    card : {...m,seducedOrRedeemed : true},
                    position : position,
                });
                client.send(JSON.stringify({type: 'card_taken',adress:enemyId,position:position}));
            }else if(attackPrepare){
                client.send(JSON.stringify({type: 'will_attack_2',adress:enemyId,position:position.toString()}));
                setWillAttack2(position.toString());
                setTimeout(()=>{
                    setDefender({position:position.toString(),fightCard:m});
                    client.send(JSON.stringify({type: 'will_attack_2',adress:enemyId,position:''}));
                    setWillAttack2('');
                },2000)
                setAttackPrepare(false);
                }
            }
    }


    useEffect(()=>{
        forceAdd(m1,0)
    },[m1])
    useEffect(()=>{
        forceAdd(m2,1)
    },[m2])
    useEffect(()=>{
        forceAdd(m3,2)
    },[m3])
    useEffect(()=>{
        forceAdd(m4,3)
    },[m4])
    useEffect(()=>{
        forceAdd(m5,4)
    },[m5])

return (
    <div className="enemy-card-container">

        <div className="enemy-hand-container">
            <div className="enemy-cards">
            {
                cardsToShow 
                ? 
                cardsToShow.map((itm,index)=>{
                    return(
                        <div key={index} className="hand">
                            <img src={`${itm.image}`} alt="" />
                        </div>
                    )
                })
                :
                [...Array(numberOfCards)].map((itm,index)=>{
                    return(
                        <div key={index} className="hand">
                            <img src={`${!whoIsJedi.current ? 'https://i.imgur.com/91Szz36.jpg' : 'https://i.imgur.com/J8aBfLG.png' }`} alt="" />
                        </div>
                    )
                })
            }
            </div>
        </div>

        <div className="enemy-card-table">
        <div
            onClick={()=>{
                takeAction(m1,1);
            }}
            name='m1' className={`card ${m1 ? 'full' : 'empty'}`}>
                <img
                className='fight-card'
                style={Object.assign({},m1.isDef ? {transform:"rotate(90deg)"} : {transform:"rotate(0deg)"},willAttack === '1' || willAttack2 === '1' || mindTrickAttacker.position === '1' || mindTrickDefender.position === '1' ? {animation: "shake 0.5s",animationIterationCount: "infinite"} : {animation: "none",animationIterationCount: "unset"})}
                onMouseOver={(e)=>{setImg({img : e.target.src, description : e.target.alt})}}
                onMouseOut={()=>{setImg({img : '',description : ''})}}
                name={`${m1 ? m1.name : ''}`} src={`${m1 ? m1.image : explosion}`} alt={`${m1 ? m1.description : ''}`} />
                <span><b style={!m1.isDef ? {color:"white"} : {color:"grey"}}>{`${m1 ? m1.attack +'/': ''}`}</b><b style={m1.isDef ? {color:"white"} : {color:"grey"}}>{`${m1 ? m1.defence: ''}`}</b></span>
                {attackPrepare && m1? <img src={sword} className='sword'/> : ''}
                {m1 && m1.maulCurse.active? <img id='darthmaul' src={darthmaul} className='sword'/> : ''}
                {m1 && cardTaken.active ? <img src={pulse} className='sword'/> : ''}
                {m1.side == 'dark' && cancelAttack.active ? <img src={pulse} className='sword'/> : ''}
                {m1 && stealStats.active ? <img src={pulse} className='sword'/> : ''}
                {m1.side == 'dark' && mindTrick.attackerActive ? <img src={pulse} className='sword'/> : ''}
                {m1 && mindTrick.defenderActive && mindTrick.attackerPosition !== 1? <img src={sword} className='sword'/> : ''}
                {m1.side == 'light' && !m1.forceChoke &&  bleed.active ? <img src={sword} className='sword'/> : ''}
                <div id='a' style={willAttack === '1' || willAttack2 === '1' || mindTrickAttacker.position === '1' || mindTrickDefender.position === '1' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='b' style={willAttack === '1' || willAttack2 === '1' || mindTrickAttacker.position === '1' || mindTrickDefender.position === '1' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='c' style={willAttack === '1' || willAttack2 === '1' || mindTrickAttacker.position === '1' || mindTrickDefender.position === '1' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='d' style={willAttack === '1' || willAttack2 === '1' || mindTrickAttacker.position === '1' || mindTrickDefender.position === '1' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
            </div>

            <div 
            onClick={()=>{
                takeAction(m2,2);
            }}
            name='m2' className={`card ${m2 ? 'full' : 'empty'}`}>
                <img
                className='fight-card'
                style={Object.assign({},m2.isDef ? {transform:"rotate(90deg)"} : {transform:"rotate(0deg)"},willAttack === '2' || willAttack2 === '2' || mindTrickAttacker.position === '2' || mindTrickDefender.position === '2' ? {animation: "shake 0.5s",animationIterationCount: "infinite"} : {animation: "none",animationIterationCount: "unset"})}
                onMouseOver={(e)=>{setImg({img : e.target.src, description : e.target.alt})}}
                onMouseOut={()=>{setImg({img : '',description : ''})}}
                name={`${m2 ? m2.name : ''}`} src={`${m2 ? m2.image : explosion}`} alt={`${m2 ? m2.description : ''}`} />
                <span><b style={!m2.isDef ? {color:"white"} : {color:"grey"}}>{`${m2 ? m2.attack +'/': ''}`}</b><b style={m2.isDef ? {color:"white"} : {color:"grey"}}>{`${m2 ? m2.defence: ''}`}</b></span>
                {attackPrepare && m2 ? <img src={sword} className='sword'/> : ''}
                {m2 && m2.maulCurse.active? <img id='darthmaul' src={darthmaul} className='sword'/> : ''}
                {m2 && cardTaken.active ? <img src={pulse} className='sword'/> : ''}
                {m2.side == 'dark' && cancelAttack.active ? <img src={pulse} className='sword'/> : ''}
                {m2 && stealStats.active ? <img src={pulse} className='sword'/> : ''}
                {m2.side == 'dark' && mindTrick.attackerActive ? <img src={pulse} className='sword'/> : ''}
                {m2 && mindTrick.defenderActive && mindTrick.attackerPosition !== 2? <img src={sword} className='sword'/> : ''}
                {m2.side == 'light' && !m2.forceChoke &&  bleed.active ? <img src={sword} className='sword'/> : ''}
                <div id='a' style={willAttack === '2' || willAttack2 === '2' || mindTrickAttacker.position === '2' || mindTrickDefender.position === '2' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='b' style={willAttack === '2' || willAttack2 === '2' || mindTrickAttacker.position === '2' || mindTrickDefender.position === '2' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='c' style={willAttack === '2' || willAttack2 === '2' || mindTrickAttacker.position === '2' || mindTrickDefender.position === '2' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='d' style={willAttack === '2' || willAttack2 === '2' || mindTrickAttacker.position === '2' || mindTrickDefender.position === '2' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
            </div>

            <div
            onClick={()=>{
                takeAction(m3,3);
            }}
            name='m3' className={`card ${m3 ? 'full' : 'empty'}`}>
                <img
                className='fight-card'
                style={Object.assign({},m3.isDef ? {transform:"rotate(90deg)"} : {transform:"rotate(0deg)"},willAttack === '3' || willAttack2 === '3' || mindTrickAttacker.position === '3' || mindTrickDefender.position === '3' ? {animation: "shake 0.5s",animationIterationCount: "infinite"} : {animation: "none",animationIterationCount: "unset"})}
                onMouseOver={(e)=>{setImg({img : e.target.src, description : e.target.alt})}}
                onMouseOut={()=>{setImg({img : '',description : ''})}}
                name={`${m3 ? m3.name : ''}`} src={`${m3 ? m3.image : explosion}`} alt={`${m3 ? m3.description : ''}`} />
                <span><b style={!m3.isDef ? {color:"white"} : {color:"grey"}}>{`${m3 ? m3.attack +'/': ''}`}</b><b style={m3.isDef ? {color:"white"} : {color:"grey"}}>{`${m3 ? m3.defence: ''}`}</b></span>
                {attackPrepare && m3 ? <img src={sword} className='sword'/> : ''}
                {m3 && m3.maulCurse.active? <img id='darthmaul' src={darthmaul} className='sword'/> : ''}
                {m3 && cardTaken.active ? <img src={pulse} className='sword'/> : ''}
                {m3.side == 'dark' && cancelAttack.active ? <img src={pulse} className='sword'/> : ''}
                {m3 && stealStats.active ? <img src={pulse} className='sword'/> : ''}
                {m3.side == 'dark' && mindTrick.attackerActive ? <img src={pulse} className='sword'/> : ''}
                {m3 && mindTrick.defenderActive && mindTrick.attackerPosition !== 3? <img src={sword} className='sword'/> : ''}
                {m3.side =='light' && !m3.forceChoke &&  bleed.active ? <img src={sword} className='sword'/> : ''}
                <div id='a' style={willAttack === '3' || willAttack2 === '3' || mindTrickAttacker.position === '3' || mindTrickDefender.position === '3' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='b' style={willAttack === '3' || willAttack2 === '3' || mindTrickAttacker.position === '3' || mindTrickDefender.position === '3' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='c' style={willAttack === '3' || willAttack2 === '3' || mindTrickAttacker.position === '3' || mindTrickDefender.position === '3' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='d' style={willAttack === '3' || willAttack2 === '3' || mindTrickAttacker.position === '3' || mindTrickDefender.position === '3' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
            </div>

            <div 
            onClick={()=>{
                takeAction(m4,4);
            }}
            name='m4' className={`card ${m4 ? 'full' : 'empty'}`}>
                <img
                className='fight-card'
                style={Object.assign({},m4.isDef ? {transform:"rotate(90deg)"} : {transform:"rotate(0deg)"},willAttack === '4' || willAttack2 === '4' || mindTrickAttacker.position === '4' || mindTrickDefender.position === '4' ? {animation: "shake 0.5s",animationIterationCount: "infinite"} : {animation: "none",animationIterationCount: "unset"})}
                onMouseOver={(e)=>{setImg({img : e.target.src, description : e.target.alt})}}
                onMouseOut={()=>{setImg({img : '',description : ''})}}
                name={`${m4 ? m4.name : ''}`} src={`${m4 ? m4.image : explosion}`} alt={`${m4 ? m4.description : ''}`} />
                <span><b style={!m4.isDef ? {color:"white"} : {color:"grey"}}>{`${m4 ? m4.attack +'/': ''}`}</b><b style={m4.isDef ? {color:"white"} : {color:"grey"}}>{`${m4 ? m4.defence: ''}`}</b></span>
                {attackPrepare && m4 ? <img src={sword} className='sword'/> : ''}
                {m4 && m4.maulCurse.active? <img id='darthmaul' src={darthmaul} className='sword'/> : ''}
                {m4 && cardTaken.active ? <img src={pulse} className='sword'/> : ''}
                {m4.side == 'dark' && cancelAttack.active ? <img src={pulse} className='sword'/> : ''}
                {m4 && stealStats.active ? <img src={pulse} className='sword'/> : ''}
                {m4.side == 'dark' && mindTrick.attackerActive ? <img src={pulse} className='sword'/> : ''}
                {m4 && mindTrick.defenderActive && mindTrick.attackerPosition !== 4? <img src={sword} className='sword'/> : ''}
                {m4.side == 'light' && !m4.forceChoke &&  bleed.active ? <img src={sword} className='sword'/> : ''}
                <div id='a' style={willAttack === '4' || willAttack2 === '4' || mindTrickAttacker.position === '4' || mindTrickDefender.position === '4' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='b' style={willAttack === '4' || willAttack2 === '4' || mindTrickAttacker.position === '4' || mindTrickDefender.position === '4' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='c' style={willAttack === '4' || willAttack2 === '4' || mindTrickAttacker.position === '4' || mindTrickDefender.position === '4' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='d' style={willAttack === '4' || willAttack2 === '4' || mindTrickAttacker.position === '4' || mindTrickDefender.position === '4' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
            </div>

            <div
            onClick={()=>{ 
                takeAction(m5,5);
            }}
            name='m5' className={`card ${m5 ? 'full' : 'empty'}`}>
                <img
                className='fight-card'
                style={Object.assign({},m5.isDef ? {transform:"rotate(90deg)"} : {transform:"rotate(0deg)"},willAttack === '5' || willAttack2 === '5' || mindTrickAttacker.position === '5' || mindTrickDefender.position === '5' ? {animation: "shake 0.5s",animationIterationCount: "infinite"} : {animation: "none",animationIterationCount: "unset"})}
                onMouseOver={(e)=>{setImg({img : e.target.src, description : e.target.alt})}}
                onMouseOut={()=>{setImg({img : '',description : ''})}}
                name={`${m5 ? m5.name : ''}`} src={`${m5 ? m5.image : explosion}`} alt={`${m5 ? m5.description : ''}`} />
                <span><b style={!m5.isDef ? {color:"white"} : {color:"grey"}}>{`${m5 ? m5.attack +'/': ''}`}</b><b style={m5.isDef ? {color:"white"} : {color:"grey"}}>{`${m5 ? m5.defence: ''}`}</b></span>
                {attackPrepare && m5 ? <img src={sword} className='sword'/> : ''}
                {m5 && m5.maulCurse.active? <img id='darthmaul' src={darthmaul} className='sword'/> : ''}
                {m5 && cardTaken.active ? <img src={pulse} className='sword'/> : ''}
                {m5.side == 'dark' && cancelAttack.active ? <img src={pulse} className='sword'/> : ''}
                {m5 && stealStats.active ? <img src={pulse} className='sword'/> : ''}
                {m5.side == 'dark' && mindTrick.attackerActive ? <img src={pulse} className='sword'/> : ''}
                {m5 && mindTrick.defenderActive && mindTrick.attackerPosition !== 5? <img src={sword} className='sword'/> : ''}
                {m5.side == 'light' && !m5.forceChoke &&  bleed.active ? <img src={sword} className='sword'/> : ''}
                <div id='a' style={willAttack === '5' || willAttack2 === '5' || mindTrickAttacker.position === '5' || mindTrickDefender.position === '5' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='b' style={willAttack === '5' || willAttack2 === '5' || mindTrickAttacker.position === '5' || mindTrickDefender.position === '5' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='c' style={willAttack === '5' || willAttack2 === '5' || mindTrickAttacker.position === '5' || mindTrickDefender.position === '5' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
                <div id='d' style={willAttack === '5' || willAttack2 === '5' || mindTrickAttacker.position === '5' || mindTrickDefender.position === '5' ? {visibility: "visible"} : {visibility: "hidden"}} className="pulse"></div>
            </div>

            <div
            name='m6' className={`card ${m6 ? 'full' : 'empty'}`}>
                <img
                className='special-card'
                onMouseOver={(e)=>{setImg({img : e.target.src, description : e.target.alt})}}
                onMouseOut={()=>{setImg({img : '',description : ''})}}
                name={`${m6 ? m6.name : 'special'}`} src={`${m6 ? m6.image : special}`} alt={`${m6 ? m6.description : ''}`} />
            </div>

        </div>
        
        <div className="extra-space">
            <div className="deck">
                <img id='deck' draggable='false' src={`${!whoIsJedi.current ? 'https://i.imgur.com/91Szz36.jpg' : 'https://i.imgur.com/J8aBfLG.png' }`} alt="" />
            </div>
            <div className="trash">
                <img src={lastTrashCard ? lastTrashCard.image : ''} alt="" />
            </div>
        </div>

        {
        enemyTurn.turn 
        ?
        <div className='btn'><a style={!whoIsJedi.current ? {background: '#5082f0'} : {background: '#f44336'}} href="#">End turn</a></div>
        :
        ''
        }
    </div>
  )
}

export default Enemytable