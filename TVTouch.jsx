import React, { useState, createContext } from 'react'
import moment from 'moment'
import { Route, Routes } from 'react-router-dom'
import Floor from '../Floor/Floor'
import SideNav from '../NavBar/SideNav'
import RoomDescription from '../Floor/Description/RoomDescription'
import Advertising from '../Advertise/Advertising'
import AdvertiseDetail from '../Advertise/AdvertiseDetail'
import styles from './TVTouch.module.css'

import { Grid, IconButton } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
export const TouchContext = createContext('');
function TVTouch() {
    const time = moment().format('LT');
    const [tvFloor, setTVFloor] = useState(1);
    const tvFloorUp = () => {
        if(tvFloor < 4){
            setTVFloor(tvFloor + 1);
        }
    }
    const tvFloorDown = () => {
        if(tvFloor > 1){
            setTVFloor(tvFloor - 1);
        }
    }
    return (
        <TouchContext.Provider value={{Touch: true}}>  
            <div className={styles.nav}>
                <img src="/src/assets/img/it_logo.svg" width='40%' style={{marginLeft: '2vw'}} alt="" />
                <div className={styles.navTime}>
                    <QueryBuilderIcon fontSize='5vw'/>&ensp;{time}
                </div>
            </div>
            <Routes>
                <Route path='*' element={
                    <div className={styles.floor}>
                        <div className={styles.changeFloorBtn}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <IconButton size='small' onClick={tvFloorUp}>
                                        <ArrowDropUpIcon sx={{ fontSize: '5vw' }} />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12}>
                                    <IconButton size='small' onClick={tvFloorDown}>
                                        <ArrowDropDownIcon sx={{ fontSize: '5vw' }} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </div>
                        <div className={styles.finding}>
                            <SideNav />
                        </div>
                        <Floor tvFloor={tvFloor}/>
                    </div>
                } />
                <Route path='Touch/RoomDescription/:roomId' element={<RoomDescription />}/>
                <Route path='Touch/Advertising' element={<Advertising />}/>
                <Route path='Touch/AdvertiseDetail/:adsId' element={<AdvertiseDetail />}/>
            </Routes>
            

        </TouchContext.Provider>
    )
}

export default TVTouch