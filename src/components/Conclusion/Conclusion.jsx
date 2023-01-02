import React from 'react'
import { useRef } from 'react'
import './Conclusion.css'
import { useNavigate } from 'react-router-dom';

export default function Conclusion(props) {

    const oneTimeConclusion = useRef(true);
    const navigate = useNavigate();

    const victoryOrDefeat = useRef('VICTORY');

    const { myHp, enemyHp, style} = props;

    if(myHp<=0){
        victoryOrDefeat.current = 'DEFEAT';
    }
    if(enemyHp<=0 && enemyHp !== -99999){
        victoryOrDefeat.current = 'VICTORY'
    }

    const divs = [];

    for (let i = 0; i < 40; i++) {
        divs.push(<div className='text' key={i}>{victoryOrDefeat.current}</div>);
    }

    function handleClick() {
        navigate('/', { replace: true });
        window.location.reload();
    }


    return (
        <div style={style} id='conclusion-container'>
            <div id='ui'>{divs}</div>
            <button onClick={handleClick} className="noselect">EXIT</button>
        </div>
    )
}
