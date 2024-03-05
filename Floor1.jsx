import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
import { TouchContext } from '../../TV_TouchScreen/TVTouch';
const Floor1 = () => {
  useEffect(() => {
    setTimeout(()=>{
      if(roomUpdateArray.length != 0){
        updateRoomStatus(roomUpdateArray)
        console.log('yippi')
      }
    }, 1000)
  });
  const { roomDB, linkBookDB, searchQuery, isSelect, currentTime, updateRoomStatus, GeneralRoom} = useContext(HomeContext);
  const { Touch } = useContext(TouchContext);
  const RoomSVG = [
    { id: 'HALL', x: 1, y: 172, width: 727, height: 255, room_type: 'room' }, { id: 'R111', x: 221, y: 306, width: 146, height: 121, room_type: 'room' },
    { id: 'M03', x: 221, y: 750, width: 146, height: 164, room_type: 'room' }, { id: 'M04', x: 221, y: 588, width: 146, height: 162, room_type: 'room' }, 
    { id: 'M05', x: 221, y: 427, width: 146, height: 161, room_type: 'room' },{ id: 'M21', x: 582, y: 750, width: 146, height: 164, room_type: 'room' }, 
    { id: 'M22', x: 582, y: 588, width: 146, height: 162, room_type: 'room' }, { id: 'M23', x: 582, y: 427, width: 146, height: 162, room_type: 'room' },
    { id: 'COMMON', x: 221.5, y: 2, width: 190, height: 170, room_type: 'room' }, { id: 'AUDITORIUM', x: 1, y: 427, width: 200, height: 162, room_type: 'room' },
    { id: 'M15', x: 397, y: 761, width: 78, height: 77, room_type: 'sroom' }, { id: 'M14', x: 397, y: 684, width: 78, height: 77, room_type: 'sroom' },
    { id: 'M13', x: 397, y: 608, width: 78, height: 77, room_type: 'sroom' }, { id: 'M12', x: 397, y: 531, width: 78, height: 77, room_type: 'sroom' },
    { id: 'M16', x: 475, y: 761, width: 78, height: 77, room_type: 'sroom' }, { id: 'M17', x: 475, y: 684, width: 78, height: 77, room_type: 'sroom' },
    { id: 'M18', x: 475, y: 608, width: 78, height: 77, room_type: 'sroom' }, { id: 'M19', x: 475, y: 570, width: 78, height: 38, room_type: 'sroom' },
    { id: 'M20', x: 475, y: 531, width: 33, height: 39, room_type: 'sroom' }, { id: 'M24', x: 508, y: 531, width: 45, height: 39, room_type: 'sroom' },
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
          if( status != data.room.room_status){
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
            if(GeneralRoom.includes(room.id) || room.id == 'HALL' ){
              newColor = hasNoUseClass ? '#E74C3C' : 'white'; 
              setRectFillColor(newColor);
            }
            // if(element.classList.contains('selectedRoom')){newColor = 'lightblue';}
            // console.log(newColor)
            setRectFillColor(newColor);
          }
        }
      }
      setTimeout(updateRoomColor, 0);
    }, [room]);

    if (GeneralRoom.includes(room.id) || room.id == 'HALL') {
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
            <RoomComponent id={room.id} allclass={`${room.room_type}`} status={StatusCheck(room.id)} roomData={RoomCheck(room.id)} bookingData={BookingCheck(room.id)} />
          </foreignObject>
        </g>
      );
    } else {
      return (
        <g>
          <rect x={room.x} y={room.y} width={room.width} height={room.height} className="color-transition" fill={rectFillColor} stroke="black"/>
          <foreignObject x={room.x} y={room.y} width={room.width} height={room.height}>
            {Touch ? (
              <Link to={`/Touch/RoomDescription/${room.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <RoomComponent id={room.id} allclass={`${room.room_type}`} status={StatusCheck(room.id)} roomData={RoomCheck(room.id)} bookingData={BookingCheck(room.id)} />
              </Link>
            ):(
              <Link to={`/RoomDescription/${room.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <RoomComponent id={room.id} allclass={`${room.room_type}`} status={StatusCheck(room.id)} roomData={RoomCheck(room.id)} bookingData={BookingCheck(room.id)} />
              </Link>
            )}
            
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
  
  // Update the value associated with the key 'a'
  // console.log(roomUpdateArray)

  // const notifyLogout = () => {
  //   toast.success("Logged out...");
  // }
  // useEffect(() => {
  //   if (!localStorage.getItem('token') && localStorage.getItem('notify')) {
  //     console.error("++++++++++++++++++")
  //     notifyLogout();
  //     localStorage.removeItem('notify');
  //   }
  // }, []);
  return (
    <>
      {/* <div className='floorNumber'>
        <h1>FLOOR 1</h1>
        <h4>{currentTime.format('LLLL')}</h4>
      </div> */}
      <div className='map'>
        {/* map line */}
        <svg className='svg_map' width="729" height="953" viewBox="0 0 729 953" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M395.058 911.146H582.584V913.7H395.058V911.146Z" fill="white" />
          <path d="M582.584 913.2H395.058V914.2H582.584V913.2Z" fill="black" />
          <path d="M395.058 909.87H582.584V913.7H395.058V909.87Z" fill="white" />
          <path d="M582.584 913.2H395.058V914.2H582.584V913.2Z" fill="black" />
          <path d="M395.058 909.87H582.584V913.7H395.058V909.87Z" fill="white" />
          <path d="M582.584 913.2H395.058V914.2H582.584V913.2Z" fill="black" />
          <path d="M395.058 909.87H582.584V913.7H395.058V909.87Z" fill="white" />
          {RoomSVG.map(createRoomRect)}
          {/* Toilet Common */}
          <rect x="221.5" y="172" width="38.012" height="37.0237" fill="white" stroke="black" />
          <foreignObject x="221.5" y="172" width="38.012" height="37.0237">
            <div id='womanToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}>
              <Woman2Icon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="260" y="172" width="38.012" height="37.0237" fill="white" stroke="black" />
          <foreignObject x="260" y="172" width="38.012" height="37.0237">
            <div id='menToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}>
              <Man2Icon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="221.47" y="172" width="0.1" height="256" fill="white" stroke="black" strokeWidth="0.5" />
          {/* Toilet M21 */}
          <rect x="438" y="877.5" width="38.012" height="37.0237" fill="white" stroke="black" />
          <foreignObject x="438" y="877.5" width="38.012" height="37.0237">
            <div id='womanToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}>
              <Woman2Icon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="476" y="877.5" width="38.012" height="37.0237" fill="white" stroke="black" />
          <foreignObject x="476" y="877.5" width="38.012" height="37.0237">
            <div id='menToilet1' className={`cube bgcolor-transition ${isSelect === "toilet" ? "categorized" : ""}`}>
              <Man2Icon fontSize='large' />
            </div>
          </foreignObject>
          {/* Lift */}
          <rect x="398" y="299" width="31.6767" height="38.3004" fill="white" stroke="black" />
          <foreignObject x="398" y="299" width="31.6767" height="38.3004">
            <div id="elevator1" className="cube bgcolor-transition">
              <ElevatorIcon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="429.677" y="299" width="31.6767" height="38.3004" fill="white" stroke="black" />
          <foreignObject x="429.677" y="299" width="31.6767" height="38.3004">
            <div id="elevator2" className="cube bgcolor-transition">
              <ElevatorIcon fontSize='large' />
            </div>
          </foreignObject>

          {/* Stair */}
          <rect x="402" y="357" width="74" height="35" fill="white" stroke="black" />
          <foreignObject x="402" y="357" width="74" height="35">
            <div id="stair" className='cube bgcolor-transition center'>
              <StairsIcon fontSize='large' />
            </div>
          </foreignObject>
          {/* Fire Exit */}
          <rect x="411.159" y="2" height="40" width="38.3004" fill="white" stroke="black" />
          <foreignObject x="411.159" y="2" height="40" width="38.3004">
            <div id="exit" className='cube bgcolor-transition center'>
              <DirectionsRunIcon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="327" y="913.7" width="40" height="38.3004" fill="white" stroke="black" />
          <foreignObject x="327" y="913.7" width="40" height="38.3004">
            <div id="exit" className='cube bgcolor-transition center'>
              <DirectionsRunIcon fontSize='large' />
            </div>
          </foreignObject>
          <rect x="395.058" y="913.7" width="2.53414" height="37.0237" fill="white" stroke="black" />
          <path d="M397.592 952H367.183V949.447H397.592V952Z" fill="white" />
          <path d="M397.592 952V952.5H398.092V952H397.592ZM367.183 952H366.683V952.5H367.183V952ZM397.592 951.5H367.183V952.5H397.592V951.5ZM367.683 952V949.447H366.683V952H367.683ZM397.092 949.447V952H398.092V949.447H397.092Z" fill="black" />
          <mask id="path-11-inside-1_33_373" fill="white">
            <path d="M395.692 950.085H366.549V948.808H395.692V950.085Z" />
          </mask>
          <path d="M395.692 950.085H366.549V948.808H395.692V950.085Z" fill="white" />
          <path d="M366.549 949.808H395.692V947.808H366.549V949.808Z" fill="black" mask="url(#path-11-inside-1_33_373)" />
          <path d="M397.592 952H367.183V949.447H397.592V952Z" fill="white" />
          <path d="M397.592 952V952.5H398.092V952H397.592ZM367.183 952H366.683V952.5H367.183V952ZM397.592 951.5H367.183V952.5H397.592V951.5ZM367.683 952V949.447H366.683V952H367.683ZM397.092 949.447V952H398.092V949.447H397.092Z" fill="black" />
          <mask id="path-21-inside-2_33_373" fill="white">
            <path d="M395.692 950.085H366.549V948.808H395.692V950.085Z" />
          </mask>
          <path d="M395.692 950.085H366.549V948.808H395.692V950.085Z" fill="white" />
          <path d="M366.549 949.808H395.692V947.808H366.549V949.808Z" fill="black" mask="url(#path-21-inside-2_33_373)" />
          <rect x="511.766" y="417.856" width="67.4418" height="4.61511" fill="white" stroke="black" />
          <rect x="513.171" y="413.241" width="64.6317" height="4.61511" fill="white" stroke="black" />
          <rect x="229.799" y="281.896" width="56.3121" height="4.39954" transform="rotate(-90 229.799 281.896)" fill="white" stroke="black" />
          <rect x="225.4" y="284.515" width="60.8957" height="4.39954" transform="rotate(-90 225.4 284.515)" fill="white" stroke="black" />
          <rect x="221" y="287.134" width="66.134" height="4.39954" transform="rotate(-90 221 287.134)" fill="white" stroke="black" />
          <path d="M582.584 913.2H395.058V914.2H582.584V913.2Z" fill="black" />
          <rect x="510.361" y="422.471" width="70.2519" height="4.61511" fill="white" stroke="black" />
          <rect x="401.393" y="445.158" width="3.8012" height="90.6443" transform="rotate(-180 401.393 445.158)" fill="white" stroke="black" />
          <rect x="440.673" y="446.435" width="3.8012" height="54.8972" transform="rotate(-180 440.673 446.435)" fill="white" stroke="black" />
          <rect x="476.15" y="397.921" width="35.4779" height="6.3834" transform="rotate(-180 476.15 397.921)" fill="white" stroke="black" />
          <rect x="476.15" y="403.028" width="35.4779" height="5.10672" transform="rotate(-180 476.15 403.028)" fill="white" stroke="black" />
          <rect x="476.15" y="409.411" width="35.4779" height="6.3834" transform="rotate(-180 476.15 409.411)" fill="white" stroke="black" />
          <rect x="476.15" y="413.241" width="35.4779" height="5.10672" transform="rotate(-180 476.15 413.241)" fill="white" stroke="black" />
          <rect x="476.15" y="418.348" width="35.4779" height="5.10672" transform="rotate(-180 476.15 418.348)" fill="white" stroke="black" />
          <rect x="476.15" y="423.455" width="35.4779" height="5.10672" transform="rotate(-180 476.15 423.455)" fill="white" stroke="black" />
          <rect x="476.15" y="428.561" width="35.4779" height="5.10672" transform="rotate(-180 476.15 428.561)" fill="white" stroke="black" />
          <rect x="476.15" y="433.668" width="35.4779" height="5.10672" transform="rotate(-180 476.15 433.668)" fill="white" stroke="black" />
          <rect x="476.15" y="438.775" width="35.4779" height="5.10672" transform="rotate(-180 476.15 438.775)" fill="white" stroke="black" />
          <rect x="476.15" y="443.881" width="35.4779" height="5.10672" transform="rotate(-180 476.15 443.881)" fill="white" stroke="black" />
          <rect x="436.871" y="397.921" width="35.4779" height="6.3834" transform="rotate(-180 436.871 397.921)" fill="white" stroke="black" />
          <rect x="436.871" y="403.028" width="35.4779" height="5.10672" transform="rotate(-180 436.871 403.028)" fill="white" stroke="black" />
          <rect x="436.871" y="409.411" width="35.4779" height="6.3834" transform="rotate(-180 436.871 409.411)" fill="white" stroke="black" />
          <rect x="436.871" y="414.518" width="35.4779" height="5.10672" transform="rotate(-180 436.871 414.518)" fill="white" stroke="black" />
          <rect x="436.871" y="420.901" width="35.4779" height="6.3834" transform="rotate(-180 436.871 420.901)" fill="white" stroke="black" />
          <rect x="436.871" y="426.008" width="35.4779" height="5.10672" transform="rotate(-180 436.871 426.008)" fill="white" stroke="black" />
          <rect x="436.871" y="432.391" width="35.4779" height="6.3834" transform="rotate(-180 436.871 432.391)" fill="white" stroke="black" />
          <rect x="436.871" y="437.498" width="35.4779" height="5.10672" transform="rotate(-180 436.871 437.498)" fill="white" stroke="black" />
          <rect x="436.871" y="443.881" width="35.4779" height="6.3834" transform="rotate(-180 436.871 443.881)" fill="white" stroke="black" />
          <rect x="479.952" y="446.435" width="3.8012" height="91.921" transform="rotate(-180 479.952 446.435)" fill="white" stroke="black" />
          <path d="M440.673 446.435H397.592V443.881H440.673V446.435Z" fill="white" />
          <path d="M440.673 446.435V446.935H441.173V446.435H440.673ZM397.592 446.435H397.092V446.935H397.592V446.435ZM440.673 445.935H397.592V446.935H440.673V445.935ZM398.092 446.435V443.881H397.092V446.435H398.092ZM440.173 443.881V446.435H441.173V443.881H440.173Z" fill="black" />
          <path d="M440.673 446.435H397.592V443.881H440.673V446.435Z" fill="white" />
          <path d="M440.673 446.435V446.935H441.173V446.435H440.673ZM397.592 446.435H397.092V446.935H397.592V446.435ZM440.673 445.935H397.592V446.935H440.673V445.935ZM398.092 446.435V443.881H397.092V446.435H398.092ZM440.173 443.881V446.435H441.173V443.881H440.173Z" fill="black" />
          <path d="M397.592 354.514H479.952V357.067H397.592V354.514Z" fill="white" />
          <path d="M397.592 354.514V354.014H397.092V354.514H397.592ZM479.952 354.514H480.452V354.014H479.952V354.514ZM397.592 355.014H479.952V354.014H397.592V355.014ZM479.452 354.514V357.067H480.452V354.514H479.452ZM398.092 357.067V354.514H397.092V357.067H398.092Z" fill="black" />
          <mask id="path-81-inside-3_33_373" fill="white">
            <path d="M401.393 355.79H476.15V358.344H401.393V355.79Z" />
          </mask>
          <path d="M401.393 355.79H476.15V358.344H401.393V355.79Z" fill="white" />
          <path d="M476.15 357.344H401.393V359.344H476.15V357.344Z" fill="black" mask="url(#path-81-inside-3_33_373)" />
          <mask id="path-83-inside-4_33_373" fill="white">
            <path d="M436.871 445.158H401.393V442.605H436.871V445.158Z" />
          </mask>
          <path d="M436.871 445.158H401.393V442.605H436.871V445.158Z" fill="white" />
          <path d="M401.393 443.605H436.871V441.605H401.393V443.605Z" fill="black" mask="url(#path-83-inside-4_33_373)" />
        </svg>

        {/* map line */}
        {/* <div>
          <h1 className='floorNumber'>FLOOR 1</h1>
          <h4>{currentTime.format('LLLL')}</h4>
        </div> */}
        {/* <div id="emergency1">
            <DirectionsRunIcon fontSize='large'/>
          </div>
          <div id="emergency2">
            <DirectionsRunIcon fontSize='large'/>
          </div> */}
      </div>
    </>
  )
}

export default Floor1