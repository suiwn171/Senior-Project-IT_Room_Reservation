import React, { createContext, useState, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { Grid, Box, Drawer, Hidden } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import styles from './Home.module.css'
import Floor from './Floor/Floor';
import API_DATA from './link';
import Advertising from './Advertise/Advertising';
import RoomDescription from './Floor/Description/RoomDescription';
import ClientCancelReservation from './Booking/ClientCancelReservation';
import AdvertiseDetail from './Advertise/AdvertiseDetail';
import SideNav from './NavBar/SideNav';
import TVVersion from './TV/TVVersion';
import TVTouch from './TV_TouchScreen/TVTouch';

export const HomeContext = createContext('');

function Home() {
  //clock
  const [currentTime, setCurrentTime] = useState(moment());
  useEffect(() => {
    const intervalId = setInterval(() => {setCurrentTime(moment());}, 1000);
    return () => {clearInterval(intervalId);};
  }, []);
  const [openDrawer, setOpenDrawer] = useState(false);
  const location = useLocation();
  const isTVPath = location.pathname.includes('/TV');
  const isTVTouchPath = location.pathname.includes('/Touch');

  //get API
  const [linkBookDB, setLinkBookDB] = useState([]);
  let timerBookId; // Store the timer ID to clear it later
  useEffect(() => {
      const fetchData = async () => {
        if (!location.pathname.includes('/Advertising')){
          try {
              const response = await axios.get(API_DATA.linkBook);
              const events = response.data;
              setLinkBookDB(events);
          } catch (error) {
              console.error(error);
          } finally {
            // Calculate the milliseconds remaining until the next minute
            const delay = 60000 - (currentTime.seconds() * 1000 + currentTime.milliseconds());
            // Schedule the next fetch
            timerBookId = setTimeout(fetchData, delay);
          }
        }
      };
      
      // Fetch data initially
      fetchData();
      
      // Cleanup function to clear the timer on component unmount
      return () => clearTimeout(timerBookId);
  }, [location]);

  // const [roomDB, setRoomDB] = useState([]);
  // useEffect(() => {
  //   setTimeout(() => {
  //     axios.get(API_DATA.room)
  //     .then(response => setRoomDB(response.data))
  //     .catch(error => console.log(error));
  //   }, 1000)
  // }, []);
  const [roomDB, setRoomDB] = useState([]);
  let timerRoomId; // Store the timer ID to clear it later
  useEffect(() => {
      const fetchData = async () => {
        if (!location.pathname.includes('/Advertising')){
          try {
              const response = await axios.get(API_DATA.room);
              const events = response.data;
              setRoomDB(events);
          } catch (error) {
              console.error(error);
          } finally {
            // Calculate the milliseconds remaining until the next minute
            const delay = 60000 - (currentTime.seconds() * 1000 + currentTime.milliseconds());
            // Schedule the next fetch
            timerRoomId = setTimeout(fetchData, delay);
          }
        }
      };
      
      // Fetch data initially
      fetchData();
      
      // Cleanup function to clear the timer on component unmount
      return () => clearTimeout(timerRoomId);
  }, []);

  const [haveAdsData, setHaveAdsData] = useState(false);
  const [linkAdsDB, setLinkAdsDB] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      axios.get(API_DATA.linkAds)
      .then(response => {
        setLinkAdsDB(response.data)
        setHaveAdsData(true)
      })
      .catch(error => console.log(error));
    }, 1000)
  }, []);

  const notifyLogout = () => {
    toast.success("Logged out...");
  }
  useEffect(() => {
    if (!localStorage.getItem('token') && localStorage.getItem('notify')) {
      notifyLogout();
      localStorage.removeItem('notify');
    }
  }, []);

  useEffect(() => {
    // Function to group rooms by advertiseId
    const groupRoomsByAdvertiseId = () => {
      const roomGroups = {};
      linkAdsDB.forEach(item => {
        const { advertiseId, roomId } = item;
        if (!roomGroups[advertiseId]) {
          roomGroups[advertiseId] = [roomId];
        } else {
          roomGroups[advertiseId].push(roomId);
        }
      });
      return roomGroups;
    };
  
    // Function to format room IDs
    const formatRoomIds = (roomIds) => {
      return roomIds.map((roomId) => roomId).join(', ');
    };
  
    // Call the function to group rooms
    const groupedRooms = groupRoomsByAdvertiseId();
  
    // Variable to store the last displayed advertiseId
    let lastDisplayedAdvertiseId = null;
  
    // Iterate through each item in linkAdsDB
    linkAdsDB.forEach(item => {
      const isToday = (moment().isSame(moment(item.advertise.active_date), 'day') && moment().isBefore(moment(item.advertise.end_date))); // Check if data pulled from the database is the same day as today
      if (isToday) {
        // Check if the current advertiseId is different from the last displayed one
        if (item.advertiseId !== lastDisplayedAdvertiseId) {
          const adsItem = () => (
            <Link to='/Advertising' style={{ textDecoration: 'none', color: 'gray' }}>
              <div style={{ cursor: 'pointer' }}>
                <p className={styles.toastAds}>กิจกรรมวันนี้: {item.advertise.title}</p>
                {/* Display all rooms related to this advertiseId */}
                <React.Fragment>
                  <p className={styles.toastRoom}>สถานที่: {formatRoomIds(groupedRooms[item.advertiseId])}</p>
                </React.Fragment>
                เวลา: {moment(item.advertise.active_date).locale('th').format('LT')} - {moment(item.advertise.end_date).locale('th').format('LT')}
              </div>
            </Link>
          );
          // Display the toast
          toast(adsItem, {
            position: 'top-right',
            hideProgressBar: true,
            autoClose: 60000,
            draggable: true,
          });
          
          // Update the lastDisplayedAdvertiseId
          lastDisplayedAdvertiseId = item.advertiseId;
        }
      }
    });
  }, [haveAdsData]);
  

  const updateRoomStatus = (roomArray) => {
    axios.put(API_DATA.updateRoom, {
      roomArray:roomArray,
    })
    // .then(response => console.log(response.data))
    .catch(error => console.log(error));
  };

  //set floor level
  const [floor, setFloor] = useState(1);
  const floorUp = () => {
    if (floor < 4) {
      setFloor(floor + 1);
    }
  }
  const floorDown = () => {
    if (floor > 1) {
      setFloor(floor - 1);
    }
  }
  const [logo, setLogo] = useState('')
  useEffect(() => {
    setLogo('/src/assets/img/it_logo.svg')
  })

  //category
  const [isSelect, setSelect] = useState("unselected");
  const classify = (category)=>{
    if(isSelect != category){
      setSelect(category);
    }
    else{
      setSelect('unselected')
    }
  }
  //end category

  //search
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };
  //end search

  //classify
    useEffect(() => {
      let allRoom = document.getElementsByClassName('room');
      let allSRoom = document.getElementsByClassName('sroom')
      let roomList = Array.from(allRoom).concat(Array.from(allSRoom));

      Array.from(roomList).forEach(element => {
        const roomNameElement = element.getElementsByTagName('h5')[0];
        const roomActivityElement = element.getElementsByTagName('p')[0];

        if (roomNameElement && roomActivityElement) {
          const roomName = roomNameElement.innerText.toLowerCase();
          const roomActivity = roomActivityElement.innerText.toLowerCase();

          let roomBooker = false;
          
          Array.from(linkBookDB).forEach(data => {
            if (data.room_id && roomName === data.room_id.toLowerCase()) {
              const startTime = moment(data.check_in_datetime);
              const endTime = moment(data.check_out_datetime);
              if(currentTime.isBetween(startTime, endTime)){
                roomBooker = (data.booker && data.booker.name && String(data.booker.name).toLowerCase().includes(String(searchQuery).toLowerCase()) 
                && currentTime.isBetween(startTime, endTime)) && searchQuery !== '';
              }
            }
          });
          const roomSearch = (roomName.includes(String(searchQuery).toLowerCase()) || roomActivity.includes(String(searchQuery).toLowerCase()) || roomBooker) && searchQuery !== '';
          let roomFilter = false;
          if(roomSearch){
            if(isSelect != "unselected"){
              roomFilter = element.classList.contains(isSelect);
            }else{ roomFilter = true}
          }else{
            if(isSelect != "unselected"){
              roomFilter = element.classList.contains(isSelect);
            }
          }

          // isSelect != "unselected"
          if(roomFilter){
          }
          element.classList.toggle('selectedRoom', roomFilter);
        }
      });
    });
  //end classify

  const shouldShowToast = location.pathname === `/Floor/${floor}`;
  const GeneralRoom = ['COMMON','R111','M05','M12','M13','M14','M15','L215','L310','L322','L323','L324','L325','L410','L416','L418','L424','L426','L427','L428','L437','L438'];
  return (
    <HomeContext.Provider value={{ roomDB, linkBookDB, searchQuery, isSelect, currentTime, GeneralRoom, updateRoomStatus, setFloor, setSearchQuery, handleSearch
    , floorUp, floorDown, logo, floor, classify }}>
      <Box sx={{ flexGrow: 1 }}>
        {shouldShowToast && (
          <ToastContainer />
        )}
        {isTVPath &&(
          <TVVersion />
        )}
        {isTVTouchPath && (
          <TVTouch />
        )}
        {(!isTVPath && !isTVTouchPath) && (
          <>
          <Grid container spacing={0}>   
            <Grid item xs={openDrawer && 0} lg={2} md={3}>
              <Hidden mdDown implementation="css">
                <SideNav />
              </Hidden>
            </Grid>
            <Grid item lg={10} md={9} xs={12}>
              <Grid container spacing={{xs:12,md:0}}>
                <Grid item xs={12} >
                  <Hidden mdUp implementation="css">
                    <div className={styles.NavContainer}>
                      <IconButton onClick={() => setOpenDrawer(!openDrawer)} sx={{}}>
                        <MenuIcon sx={{color:'white'}} fontSize='large'/>
                      </IconButton>
                      <Drawer anchor='left' open={openDrawer} onClose={() => setOpenDrawer(false)} sx={{zIndex: '1300'}}>
                        <div style={{width: '50vw', height: '100vh'}}>
                          <SideNav phoneSize={true}/>
                        </div>
                      </Drawer>
                    </div>
                  </Hidden>
                </Grid>
                <Grid item xs={12}>
                    <Routes>
                      <Route path='*' element={<Floor  floor={floor} />}/>
                      <Route path='/RoomDescription/:roomId' element={<RoomDescription />}/>
                      <Route path='/Advertising' element={<Advertising adminRight={false} setFloor={setFloor} setSearchQuery={setSearchQuery}/>}/>
                      <Route path='/Cancellation' element={<ClientCancelReservation />} />
                      <Route path='/AdvertiseDetail/:adsId' element={<AdvertiseDetail />}/>
                    </Routes>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
        )}
      </Box>
      {/* {shouldShowToast ? 
      <Grid container spacing={0} className={styles.FloorBtnContainer}>
          <Grid container spacing={0}>
            <Grid item xs={5} className={styles.FloorName}>
              <h1>FLOOR 3</h1>
            </Grid>
            {window.innerWidth >= 600 ? null :
            <Grid item xs={7}>
              <Grid container spacing={0} className={styles.FloorBtn}>
              <Grid item xs={6}>
                <p onClick={floorUp} className={styles.selectFloor} id='floorUpBtn' style={{opacity: floor == 4 ? 0.5 : 1}}>
                    <KeyboardArrowUpIcon />
                </p>
              </Grid>
              <Grid item xs={6}>
                <p onClick={floorDown} className={styles.selectFloor} id='floorDownBtn' style={{opacity: floor == 1 ? 0.5 : 1}}>
                    <KeyboardArrowDownIcon />
                </p>
              </Grid>
              </Grid>
            </Grid>}
          </Grid>
          <Grid item xs={12} className={styles.FloorName}>
            <h4>{currentTime.format('LLLL')}</h4>
          </Grid>
      </Grid>
      : null} */}
    </HomeContext.Provider>
  );
}
export default Home
