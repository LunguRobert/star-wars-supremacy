import React, { useEffect, useState } from 'react'

export default function Announcer({myTurn}) {

    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(()=>{
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 2000);

    },[myTurn])

    return (
    <p className='announcer' style={{
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'visibility 0s linear 1s, opacity 1s linear',
        opacity: isVisible ? 1 : 0,
        color : myTurn.turn ? 'blue' : 'red'
    }}>
        {
            myTurn.turn ? 'MY TURN' : "ENEMY'S TURN"
        }
    </p>
    )
}
