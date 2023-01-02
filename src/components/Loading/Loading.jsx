import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import './Loading.css';

function Loading({client}) {

  const navigate = useNavigate();
  const params = useParams();

  
  useEffect(()=>{
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
          if(dataFromServer.type==='data'){
            const data = dataFromServer.updatedState;
            const isGuest = data[data.findIndex(obj=>obj.room === params.roomNumber)].players.guest.id == '';
            const isHost = data[data.findIndex(obj=>obj.room === params.roomNumber)].players.host.id == '';
            const room = data.find(el => el.room == params.roomNumber);
            const gameMode = room.roomSettings;
            if(!isGuest && !isHost){
              navigate(`/game/${params.roomNumber}/${params.uniqueId}/${gameMode}`, { replace: true })
            }  
    }   
  }
  }, [])

  return (
    <div className='loading'>
      <div id="load">
        <div>.</div>
        <div>.</div>
        <div>.</div>
        <div>G</div>
        <div>N</div>
        <div>I</div>
        <div>T</div>
        <div>I</div>
        <div>A</div>
        <div>W</div>
      </div>

      <div className="force_field">
        <div className="sword">
          <div className="grip">
            <div className="beam">

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading