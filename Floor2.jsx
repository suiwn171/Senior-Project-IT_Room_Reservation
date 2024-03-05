import React, { useState, useEffect, useContext, useCallback } from 'react';
import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom';
import RoomComponent from '../Component/RoomComponent'
import axios from 'axios'
import moment from 'moment';
import Man2Icon from '@mui/icons-material/Man2';
import Woman2Icon from '@mui/icons-material/Woman2';
import ElevatorIcon from '@mui/icons-material/Elevator';
import StairsIcon from '@mui/icons-material/Stairs';
import Tooltip from '@mui/material/Tooltip';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { HomeContext } from '../../Home';

const Floor2 = () => {
  useEffect(() => {
    setTimeout(()=>{
      if(roomUpdateArray.length != 0){
        updateRoomStatus(roomUpdateArray)
      }
    }, 1000)
  });
  const { roomDB, linkBookDB, searchQuery, isSelect, currentTime, GeneralRoom, updateRoomStatus } = useContext(HomeContext);
  const RoomSVG = [
    { id: 'L203', x: 1, y: 745, width: 146, height: 171, room_type:'room'},
    { id: 'L205', x: 1, y: 576, width: 146, height: 169, room_type:'room'},{ id: 'L207', x: 1, y: 407, width: 146, height: 170, room_type:'room'},
    { id: 'L215', x: 1, y: 1, width: 146, height: 107, room_type:'room'},
    { id: 'Project Base1', x: 364, y: 670, width: 145, height: 244, room_type:'room'},
    // { id: 'L223', x: 364, y: 770, width: 145, height: 144, room_type:'room'},{ id: 'L224', x: 364, y: 670, width: 145, height: 100, room_type:'room'},
    { id: 'Project Base2', x: 364, y: 426, width: 145, height: 244, room_type:'room'},
    // { id: 'L225', x: 364, y: 570, width: 145, height: 100, room_type:'room'},{ id: 'L226', x: 364, y: 426, width: 145, height: 144, room_type:'room'},
    // <rect x="147" y="108" width="146" height="107" transform="rotate(-180 147 108)" fill="white" stroke="black"/>

    { id: 'L218', x: 178, y: 737, width: 79, height: 100, room_type:'sroom'},{ id: 'L219', x: 178, y: 637, width: 79, height: 100, room_type:'sroom'},
    { id: 'L220', x: 257, y: 756, width: 79, height: 81, room_type:'sroom'},{ id: 'L221', x: 257, y: 675, width: 79, height: 81, room_type:'sroom'},

  ]
  const roomUpdateArray = [];
  const StatusCheck = (id) => {
    const BookingData = linkBookDB.filter(item => item.room_id === id);
    if(linkBookDB.filter(item => item.room_id === id)[0] != null){
        let status = 'Available'
        for(const data of BookingData){
          // console.log(data,":",status)
          const startTime = moment(data.check_in_datetime);
          const endTime = moment(data.check_out_datetime);
          if (currentTime.isBetween(startTime, endTime) && data.approvement.is_approved === true) {
            status = 'Active';
          }
          if( status == data.room.room_status){
            updateArrayValue(roomUpdateArray, id, status);
          }
        }
        return status;
      }
  }
  //fill data to RoomComponent
  const RoomCheck = (id) => {
    return roomDB.filter(item => item.id === id);
  };
  const BookingCheck = (id) => {
    return linkBookDB.filter(item => item.room_id === id);
  };
  const createRoomRect = useCallback((room) => <RoomRect key={room.id} room={room} />, [roomDB]);
  
  const RoomRect = React.memo(({ room }) => {
    const [rectFillColor, setRectFillColor] = useState('white');
    // สี
    useEffect(() => {
      const updateRoomColor = () =>{
        if (document.getElementById(room.id) != null) {
          const element = document.getElementById(room.id);
          if (element) {
            const hasNoUseClass = element.classList.contains('use');
            let newColor = hasNoUseClass ? '#E74C3C' : '#DAF7A6';
            if(GeneralRoom.includes(room.id)){newColor = 'white'; }
            if(element.classList.contains('selectedRoom')){newColor = 'lightblue';}
            console.log(newColor)
            setRectFillColor(newColor);
          }
        }
      }
      setTimeout(updateRoomColor, 0);
    }, [room]);

    if (false) {
      return (
        <g>
          <rect
            x={room.x}
            y={room.y}
            width={room.width}
            height={room.height}
            fill={rectFillColor}
            stroke="black"
          />
          <foreignObject x={room.x} y={room.y} width={room.width} height={room.height}>
            <RoomComponent id={room.id} allclass={`${room.room_type}`} data={RoomCheck(room.id)} />
          </foreignObject>
        </g>
      );
    } else {
      return (
        <g>
          <rect x={room.x} y={room.y} width={room.width} height={room.height} className="color-transition" fill={rectFillColor} stroke="black"/>
          <foreignObject x={room.x} y={room.y} width={room.width} height={room.height}>
            <Link to={`/RoomDescription/${room.id}`} style={{ textDecoration: 'none', color: 'black' }}>
              <RoomComponent id={room.id} allclass={`${room.room_type}`} status={StatusCheck(room.id)} roomData={RoomCheck(room.id)} bookingData={BookingCheck(room.id)} />
            </Link>
          </foreignObject>
        </g>
      );
    }

  });
  
  const updateArrayValue = (arr, key, newValue) => {
    const index = roomUpdateArray.findIndex(item => item[0] === key);
    if (index !== -1) {
      // If the key exists, update the value
      roomUpdateArray[index][1] = newValue;
    } else {
      // If the key doesn't exist, add a new key-value pair
      roomUpdateArray.push([key, newValue]);
    }
    // console.log(roomUpdateArray)
    return roomUpdateArray;
    
  };
    return (
        <>
          {/* <div className='floorNumber'>
            <h1>FLOOR 2</h1>
            <h4>{currentTime.format('LLLL')}</h4>
          </div> */}
          <div className='map'>
            <svg className='svg_map2' width="510" height="955" viewBox="0 0 510 955" fill="none" xmlns="http://www.w3.org/2000/svg">
              {RoomSVG.map(createRoomRect)}

              {/* Toilet  */}
              <rect x="1" y="270" width="38" height="37" fill="white" stroke="black"/>
              <foreignObject x="1" y="270" width="38" height="37">
              <div id='womanToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}> 
                <Woman2Icon fontSize='large'/>
              </div>
              </foreignObject>
              <rect x="1" y="202" width="38" height="37" fill="white" stroke="black"/>
              <foreignObject x="1" y="202" width="38" height="37">
              <div id='menToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}>
                <Man2Icon fontSize='large'/>
              </div>
              </foreignObject>

              <rect x="217.801" y="876.363" width="37.2991" height="37.2991" fill="white" stroke="black"/>
              <foreignObject x="217.801" y="876.363" width="37.2991" height="37.2991">
              <div id='womanToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}> 
                <Woman2Icon fontSize='large'/>
              </div>
              </foreignObject>
              <rect x="255.1" y="876.363" width="38.4647" height="37.2991" fill="white" stroke="black"/>
              <foreignObject x="255.1" y="876.363" width="38.4647" height="37.2991">
              <div id='menToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}>
                <Man2Icon fontSize='large'/>
              </div>
              </foreignObject>
              
              {/* Lift */}
              <rect x="187" y="361" width="31.4711" height="34.9679" fill="white" stroke="black"/>
              <foreignObject x="187" y="361" width="31.4711" height="34.9679">
              <div id="elevator1" className ="cube bgcolor-transition">
                <ElevatorIcon fontSize='large'/>
              </div>
              </foreignObject>
              <rect x="217.306" y="361" width="32.6367" height="34.9679" fill="white" stroke="black"/>
              <foreignObject x="217.306" y="361" width="32.6367" height="34.9679">
              <div id="elevator2" className ="cube bgcolor-transition">
                <ElevatorIcon fontSize='large'/>
              </div>
              </foreignObject>

              {/* Stair */}
              <rect x="217.452" y="547.419" width="74.757" height="37.0237" fill="white" stroke="black"/>            
              <foreignObject  x="217.452" y="547.419" width="74.757" height="37.0237">
              <div id="stair" className='cube bgcolor-transition center'>
                <StairsIcon fontSize='large'/>
              </div>
              </foreignObject>
              {/* Fire Exit */}
              <rect x="147" y="3" width="40" height="40" fill="white" stroke="black"/>
              <foreignObject x="147" y="3" width="40" height="40">
                <div id="exit" className='cube bgcolor-transition center'>
                  <DirectionsRunIcon fontSize='large' />
                </div>
              </foreignObject>
              <rect x="104.5" y="916.113" width="40" height="38.3004" fill="white" stroke="black"/>
              <foreignObject x="104.5" y="916.113" width="40" height="38.3004">
                <div id="exit" className='cube bgcolor-transition center'>
                  <DirectionsRunIcon fontSize='large' />
                </div>
              </foreignObject>
              <rect x="174.674" y="913.662" width="2.33119" height="39.6303" fill="white" stroke="black"/>
              <path d="M177.123 954.414H146.713V951.861H177.123V954.414Z" fill="white"/>
              <path d="M177.123 954.414V954.914H177.623V954.414H177.123ZM146.713 954.414H146.213V954.914H146.713V954.414ZM177.123 953.914H146.713V954.914H177.123V953.914ZM147.213 954.414V951.861H146.213V954.414H147.213ZM176.623 951.861V954.414H177.623V951.861H176.623Z" fill="black"/>
              <mask id="path-4-inside-1_54_29" fill="white">
              <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z"/>
              </mask>
              <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z" fill="white"/>
              <path d="M146.079 952.222H175.222V950.222H146.079V952.222Z" fill="black" mask="url(#path-4-inside-1_54_29)"/>
              <path d="M177.123 954.414H146.713V951.861H177.123V954.414Z" fill="white"/>
              <path d="M177.123 954.414V954.914H177.623V954.414H177.123ZM146.713 954.414H146.213V954.914H146.713V954.414ZM177.123 953.914H146.713V954.914H177.123V953.914ZM147.213 954.414V951.861H146.213V954.414H147.213ZM176.623 951.861V954.414H177.623V951.861H176.623Z" fill="black"/>
              <mask id="path-9-inside-2_54_29" fill="white">
              <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z"/>
              </mask>
              <path d="M175.222 952.499H146.079V951.222H175.222V952.499Z" fill="white"/>
              <path d="M146.079 952.222H175.222V950.222H146.079V952.222Z" fill="black" mask="url(#path-9-inside-2_54_29)"/>
              <path d="M363.5 913.162H175.839V914.162H363.5V913.162Z" fill="black"/>
              <path d="M363.5 913.162H175.839V914.162H363.5V913.162Z" fill="black"/>
              <path d="M1 239H25V270H1V239Z" fill="white"/>
              <path d="M1.5 270V239H0.5V270H1.5Z" fill="black"/>
              <rect x="1" y="307" width="146" height="100" fill="white" stroke="black"/>
              <path d="M236 396H509V394H236V396Z" fill="white"/>
              <path d="M236 395.5H509V396.5H236V395.5Z" fill="black"/>
              <rect x="257" y="637" width="38.4647" height="37.2991" fill="white" stroke="black"/>
              <rect x="296" y="637" width="39.6303" height="37.2991" fill="white" stroke="black"/>
              <rect x="147" y="202" width="146" height="94" transform="rotate(-180 147 202)" fill="white" stroke="black"/>
              <rect x="449" y="396" width="60" height="30" fill="white" stroke="black"/>
              <rect x="39" y="270" width="108" height="37" fill="white" stroke="black"/>
              <rect x="39" y="202" width="108" height="37" fill="white" stroke="black"/>
              <rect x="187" y="321" width="63" height="40" fill="white" stroke="black"/>
              <rect x="187" y="241" width="63" height="80" fill="white" stroke="black"/>
              <rect x="292.209" y="493.798" width="3.8012" height="90.6443" fill="white" stroke="black"/>
              <rect x="252.93" y="492.522" width="3.8012" height="54.8972" fill="white" stroke="black"/>
              <rect x="217.452" y="541.036" width="35.4779" height="6.3834" fill="white" stroke="black"/>
              <rect x="217.452" y="535.929" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="217.452" y="529.546" width="35.4779" height="6.3834" fill="white" stroke="black"/>
              <rect x="217.452" y="525.715" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="217.452" y="520.609" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="217.452" y="515.502" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="217.452" y="510.395" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="217.452" y="505.289" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="217.452" y="500.182" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="217.452" y="495.075" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="256.731" y="541.036" width="35.4779" height="6.3834" fill="white" stroke="black"/>
              <rect x="256.731" y="535.929" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="256.731" y="529.546" width="35.4779" height="6.3834" fill="white" stroke="black"/>
              <rect x="256.731" y="524.439" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="256.731" y="518.055" width="35.4779" height="6.3834" fill="white" stroke="black"/>
              <rect x="256.731" y="512.949" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="256.731" y="506.565" width="35.4779" height="6.3834" fill="white" stroke="black"/>
              <rect x="256.731" y="501.459" width="35.4779" height="5.10672" fill="white" stroke="black"/>
              <rect x="256.731" y="495.075" width="35.4779" height="6.3834" fill="white" stroke="black"/>
              <rect x="213.651" y="492.522" width="3.8012" height="91.921" fill="white" stroke="black"/>
              <path d="M252.93 492.522H296.01V495.075H252.93V492.522Z" fill="white"/>
              <path d="M252.93 492.522V492.022H252.43V492.522H252.93ZM296.01 492.522H296.51V492.022H296.01V492.522ZM252.93 493.022H296.01V492.022H252.93V493.022ZM295.51 492.522V495.075H296.51V492.522H295.51ZM253.43 495.075V492.522H252.43V495.075H253.43Z" fill="black"/>
              <path d="M252.93 492.522H296.01V495.075H252.93V492.522Z" fill="white"/>
              <path d="M252.93 492.522V492.022H252.43V492.522H252.93ZM296.01 492.522H296.51V492.022H296.01V492.522ZM252.93 493.022H296.01V492.022H252.93V493.022ZM295.51 492.522V495.075H296.51V492.522H295.51ZM253.43 495.075V492.522H252.43V495.075H253.43Z" fill="black"/>
              <path d="M296.01 584.443H213.651V581.889H296.01V584.443Z" fill="white"/>
              <path d="M296.01 584.443V584.943H296.51V584.443H296.01ZM213.651 584.443H213.151V584.943H213.651V584.443ZM296.01 583.943H213.651V584.943H296.01V583.943ZM214.151 584.443V581.889H213.151V584.443H214.151ZM295.51 581.889V584.443H296.51V581.889H295.51Z" fill="black"/>
              <mask id="path-77-inside-3_54_29" fill="white">
              <path d="M292.209 583.166H217.452V580.613H292.209V583.166Z"/>
              </mask>
              <path d="M292.209 583.166H217.452V580.613H292.209V583.166Z" fill="white"/>
              <path d="M217.452 581.613H292.209V579.613H217.452V581.613Z" fill="black" mask="url(#path-77-inside-3_54_29)"/>
              <mask id="path-79-inside-4_54_29" fill="white">
              <path d="M256.731 493.798H292.209V496.352H256.731V493.798Z"/>
              </mask>
              <path d="M256.731 493.798H292.209V496.352H256.731V493.798Z" fill="white"/>
              <path d="M292.209 495.352H256.731V497.352H292.209V495.352Z" fill="black" mask="url(#path-79-inside-4_54_29)"/>
              <rect x="187" y="1" width="2" height="240" fill="white" stroke="black"/>
              <path d="M147 1L189 1V3L147 3V1Z" fill="white"/>
              <path d="M147 1V0.5L146.5 0.5V1L147 1ZM189 1H189.5V0.5L189 0.5V1ZM147 1.5L189 1.5V0.5L147 0.5V1.5ZM188.5 1V3L189.5 3V1H188.5ZM147.5 3V1L146.5 1V3H147.5Z" fill="black"/>
            </svg>
          </div>
        </>
        
    )
}

export default Floor2