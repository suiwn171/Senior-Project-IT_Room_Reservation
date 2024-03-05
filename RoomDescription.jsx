import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
// import Grid from '@mui/material/Grid';
import { Box, Grid, Button, CircularProgress, Paper, ToggleButtonGroup, ToggleButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse } from '@mui/material';
import axios from 'axios';
import RoomCalendar from '../../Calendar/RoomCalendar';
// import Button from '@mui/material/Button';
// import CircularProgress from '@mui/material/CircularProgress';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import DesktopAccessDisabledOutlinedIcon from '@mui/icons-material/DesktopAccessDisabledOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeveloperBoardOutlinedIcon from '@mui/icons-material/DeveloperBoardOutlined';
import ChairIcon from '@mui/icons-material/Chair';
import SurroundSoundOutlinedIcon from '@mui/icons-material/SurroundSoundOutlined';
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import MonitorIcon from '@mui/icons-material/Monitor';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import BookingForm from '../../Booking/BookingForm';
import styles from './RoomDescription.module.css'
import { HomeContext } from '../../Home';
import { TouchContext } from '../../TV_TouchScreen/TVTouch';
import API_DATA from '../../link';
import EventIcon from '@mui/icons-material/Event';
import { CenterFocusStrong, Desk } from '@mui/icons-material';

function RoomDescription() {
    const [view, setView] = useState('calendar')
    const [loading, setLoading] = useState(true);
    const { currentTime, linkBookDB } = useContext(HomeContext);
    const { Touch } = useContext(TouchContext);
    const date = currentTime.format('LLLL');
    const { roomId } = useParams()
    const [imagePath, setImagePath] = useState(null);
    const [seatQuantity, setSeatQuantity] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [openCollapes, setOpenCollapes] = useState(false);
    const toggleBooking = () => {
        setIsOpen(!isOpen);
    }
    //Get API
    const [roomDB, setRoomDB] = useState("");
    useEffect(() => {
        // setTimeout(() => {
        try {
            axios.get(API_DATA.room).then((response) => {
                const events = response.data;
                setRoomDB(events);

                const room = events.find(room => room.room_name.toUpperCase() === roomId.toUpperCase()); //check room and set image to room
                if (room) {
                    setImagePath(room.room_image);
                    setSeatQuantity(room.seat)
                }
            }).catch((error) => {
                console.log(error);
            })
        } catch (error) {
            console.error(error);
        }
        // }, 2500)
    }, [roomId]);
    useEffect(() => {
        setTimeout(() => {
            if (imagePath != null) {
                setLoading(false);
            }
        }, 1000)
    }, [imagePath]);
    // const [linkBookDB, setLinkBookDB] = useState("");
    // let timerId; // Store the timer ID to clear it later
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(API_DATA.linkBook);
    //             const events = response.data;
    //             setLinkBookDB(events);
    //             // setLoading(false); // Assuming you have a loading state
    //         } catch (error) {
    //             console.error(error);
    //         } finally {
    //             timerId = setTimeout(fetchData, 2500);
    //         }
    //     };

    //     // Fetch data initially
    //     fetchData();

    //     // Cleanup function to clear the timer on component unmount
    //     return () => clearTimeout(timerId);
    // }, []);

    let roomDesc = '';
    let activity = 'ไม่มีกิจกรรม';
    let lecturer = 'ไม่มีผู้ใช้งาน';
    let currently_use_time = 'ไม่มีการใช้งาน';
    let laboratory = null;
    Array.from(roomDB).forEach(room_data => {
        const dbroomId = room_data.room_name.toUpperCase();
        if (dbroomId == roomId) {
            roomDesc = room_data.description;
            laboratory = room_data.laboratory;
            // console.log(laboratory)
        }
    });

    Array.from(linkBookDB).forEach(linkBook => {
        if (currentTime.isBetween(linkBook.check_in_datetime, linkBook.check_out_datetime) && linkBook.room_id === roomId && linkBook.approvement.is_approved === true) {
            activity = linkBook.title;
            lecturer = linkBook.booker.name;
            // console.log(linkBook)
            currently_use_time = `${moment(linkBook.check_in_datetime).format('HH:mm')} - ${moment(linkBook.check_out_datetime).format('HH:mm')}`
        }
    });

    const handleChangeView = (event, viewMode) => {
        setView(viewMode)
    }

    return (
        <>
            {loading ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </div>
                </>
            ) : (
                <>
                    {Touch ? (
                        <>
                            {/* <div className={styles.touchContain}>
                                <div className={styles.roomName}>
                                    <Link to="/Touch/">
                                        <p><ArrowBackIosNewIcon fontSize='large' /></p>
                                    </Link>
                                    <p style={{ fontWeight: 'bold', fontSize: '5vw' }}>{roomId}</p>
                                </div>
                                <p style={{ fontSize: '2vw', marginLeft: '3vw' }}>{date}</p>
                                <Grid container spacing={2} sx={{ mb: '5vw' }}>
                                    <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }} >
                                        <img style={{ boxShadow: '0px 5px 10px rgb(0, 0, 0, 0.3)' }} src={imagePath != null ? imagePath : "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="" id='roomIMG' width={'90%'} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <h2>Room Feature</h2>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}><p><AirlineSeatReclineNormalIcon />&emsp;{seatQuantity}</p></Grid>
                                            <Grid item xs={6}><p><DesktopWindowsIcon />&emsp;ติดตั้งอุปกรณ์โปรเจกเตอร์</p></Grid>
                                        </Grid>
                                        <h2>Room Description</h2>
                                        <p id="roomDesc">{roomDesc}</p>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <h2>Activity</h2>
                                                <p id='activity' className={styles.touchActivity} >{activity}</p>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <h2>Lecturer</h2>
                                                <p id='lecturer'>{lecturer}</p>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Button variant="contained" startIcon={<BookmarkAddIcon />} onClick={toggleBooking}>BOOKING</Button>
                                    </Grid>
                                </Grid>
                                <h1>Calendar</h1>
                                <hr />
                                <RoomCalendar prop_roomID={roomId} />

                                {isOpen && <BookingForm isOpen={isOpen} toggleBooking={toggleBooking} booking_roomID={roomId} />}
                            </div> */}
                            <Grid container
                                sx={{
                                    backgroundImage: `url(${imagePath})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    height: '475px',
                                }}
                            >
                                <Grid container
                                    sx={{
                                        backdropFilter: 'brightness(0.3)',
                                        color: '#FFFFFF',
                                        // boxShadow: '0px 5px 10px rgb(0, 0, 0, 0.3)',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}
                                        sx={{
                                            paddingTop: '50px',
                                        }}
                                    >
                                        <Box>
                                            <h1><b>{roomId}</b></h1>
                                            <h1><b>{roomDesc}</b></h1>
                                            <p>{date}</p>
                                            <br />
                                            <br />
                                        </Box>
                                        <Grid container spacing={2} justifyContent={'center'}>
                                            <Grid item xl={2} lg={1} md={3} sm={12} xs={12}>
                                                <Link to='/Touch'>
                                                    <Button fullWidth sx={{ borderColor: '#FFFFFF', color: '#FFFFFF', fontFamily: 'Prompt' }} variant="outlined" size='large' startIcon={<ArrowBackIosNewIcon />}>กลับไปยังแผนผัง</Button>
                                                </Link>
                                            </Grid>
                                            <Grid item xl={2} lg={1} md={3} sm={12} xs={12}>
                                                <Button fullWidth variant="contained" size='large' startIcon={<BookmarkAddIcon />} onClick={toggleBooking}>BOOKING</Button>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <br />

                                        <Grid container display={'flex'} justifyContent={'center'}>

                                            <Grid item lg={6} md={6} sm={6} xs={10}>
                                                <Paper elevation={2}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                                            <h5><b>กิจกรรม</b></h5>
                                                            <p>{activity}</p>
                                                        </Grid>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                                            <h5><b>ผู้ใช้งาน</b></h5>
                                                            <p>{lecturer}</p>
                                                        </Grid>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                                            <h5><b>เวลาใช้งาน</b></h5>
                                                            <p>{currently_use_time}</p>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <section
                                style={{
                                    paddingTop: '3rem',
                                    marginLeft: '3vw',
                                    marginRight: '3vw'
                                }}
                            >
                                <Grid container>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <ToggleButtonGroup fullWidth exclusive value={view} onChange={handleChangeView}>
                                            <ToggleButton value="calendar">Calendar</ToggleButton>
                                            <ToggleButton value="detail"><b>รายละเอียด</b></ToggleButton>
                                        </ToggleButtonGroup>
                                    </Grid>
                                </Grid>
                                {(view === 'detail') && (
                                    <>
                                        <Grid container textAlign={'center'}>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Box>
                                                    <br />
                                                    <br />
                                                    <h3><b>รายละเอียดต่างภายในห้อง</b></h3>
                                                    <br />
                                                </Box>
                                            </Grid>
                                            <Grid item lg={3} borderRight={'2px solid #DDDDDD'}>
                                                <ChairOutlinedIcon sx={{ color: '#4B679F', fontSize: '5rem' }} />
                                                <br />
                                                <br />
                                                <h5>รองรับผู้ใช้งาน {seatQuantity} ที่นั่ง</h5>
                                            </Grid>
                                            <Grid item lg={3} borderRight={'2px solid #DDDDDD'}>

                                                <DevicesOutlinedIcon sx={{ color: '#4B679F', fontSize: '5rem' }} />
                                                <br />
                                                <br />
                                                <h5>อุปกรณ์สำหรับการบรรยาย</h5>
                                            </Grid>
                                            <Grid item lg={3} borderRight={'2px solid #DDDDDD'}>
                                                <Box>
                                                    <DesktopWindowsOutlinedIcon sx={{ color: '#4B679F', fontSize: '5rem' }} />
                                                    <br />
                                                    <br />
                                                    <h5>คอมพิวเตอร์ - เครื่อง </h5>
                                                </Box>
                                            </Grid>
                                            <Grid item lg={3}>
                                                <Box>
                                                    <SurroundSoundOutlinedIcon sx={{ color: '#4B679F', fontSize: '5rem' }} />
                                                    <br />
                                                    <br />
                                                    <h5>เครื่องขยายเสียง 1 เครื่อง</h5>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                                {(view === 'calendar') && (
                                    <RoomCalendar prop_roomID={roomId} />
                                )}
                            </section>
                            {isOpen && <BookingForm isOpen={isOpen} toggleBooking={toggleBooking} booking_roomID={roomId} />}
                        </>
                    ) : (
                        <>
                            {/* Displayed On Laptop */}
                            {/* <div className={styles.contain}>
                                <div className={styles.roomName}>
                                    <Link to="/">
                                        <p><ArrowBackIosNewIcon fontSize='large'/></p>
                                    </Link>
                                    <p style={{fontWeight:'bold'}}>{roomId}</p>
                                </div>
                                <p>{date}</p>
                                <Grid container spacing={2}>
                                    <Grid item lg={6} xs={12}>
                                        <img style={{boxShadow: '0px 5px 10px rgb(0, 0, 0, 0.3)'}} src={imagePath!=null ? imagePath : "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="" id='roomIMG' width={'80%'} />
                                    </Grid>
                                    <Grid item lg={6} xs={12}>
                                        <h2>Room Feature</h2>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}><p><AirlineSeatReclineNormalIcon />&emsp;50 ที่นั่ง</p></Grid>
                                            <Grid item xs={6}><p><DesktopWindowsIcon />&emsp;ติดตั้งอุปกรณ์โปรเจกเตอร์</p></Grid>
                                        </Grid>
                                        <h2>Room Description</h2>
                                        <p id="roomDesc">{roomDesc}</p>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <h2>Activity</h2>
                                                <p id='activity' className={styles.activity} >{activity}</p>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <h2>Lecturer</h2>
                                                <p id='lecturer'>{lecturer}</p>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Button variant="contained" startIcon={<BookmarkAddIcon />} onClick={toggleBooking}>BOOKING</Button>
                                    </Grid>
                                </Grid>
                                <h1 style={{ marginTop: '2vw' }}>Calendar</h1>
                                <hr />
                                <RoomCalendar prop_roomID={roomId} />
                                
                                {isOpen && <BookingForm isOpen={isOpen} toggleBooking={toggleBooking} booking_roomID={roomId} />}
                            </div> */}
                            <Grid container sx={
                                {
                                    backgroundImage: `url(${imagePath})`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    height: '475px',
                                }
                            }>
                                <Grid container sx={
                                    {
                                        backdropFilter: 'brightness(0.3)',
                                        color: '#FFFFFF',
                                        // boxShadow: '0px 5px 10px rgb(0, 0, 0, 0.3)',
                                        textAlign: 'center',
                                    }
                                }>
                                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12} sx={
                                        {
                                            paddingTop: '50px',
                                        }
                                    }>
                                        <Box>
                                            <h1><b>{roomId}</b></h1>
                                            <h1><b>{roomDesc}</b></h1>
                                            <p>{date}</p>
                                            <br />
                                            <br />
                                        </Box>
                                        <Grid container spacing={2} justifyContent={'center'}>
                                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12}>
                                                <Link to='/'>
                                                    <Button fullWidth sx={{ borderColor: '#FFFFFF', color: '#FFFFFF', fontFamily: 'Prompt' }} variant="outlined" size='large' startIcon={<ArrowBackIosNewIcon />} >กลับไปยังแผนผัง</Button>
                                                </Link>
                                            </Grid>
                                            <Grid item xl={2} lg={2} md={3} sm={12} xs={12}>
                                                <Button fullWidth variant="contained" size='large' startIcon={<BookmarkAddIcon />} onClick={toggleBooking}>BOOKING</Button>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <br />

                                        <Grid container display={'flex'} justifyContent={'center'}>

                                            <Grid item lg={6} md={6} sm={6} xs={10}>
                                                <Paper elevation={2}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                                            <h5><b>กิจกรรม</b></h5>
                                                            <p>{activity}</p>
                                                        </Grid>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                                            <h5><b>ผู้ใช้งาน</b></h5>
                                                            <p>{lecturer}</p>
                                                        </Grid>
                                                        <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                                                            <h5><b>เวลาใช้งาน</b></h5>
                                                            <p>{currently_use_time}</p>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <section style={
                                {
                                    paddingTop: '3rem',
                                    marginLeft: '3vw',
                                    marginRight: '3vw'
                                }
                            }>
                                <Grid container>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <ToggleButtonGroup fullWidth exclusive value={view} onChange={handleChangeView}>
                                            <ToggleButton value="calendar">Calendar</ToggleButton>
                                            <ToggleButton value="detail"><b>รายละเอียด</b></ToggleButton>
                                        </ToggleButtonGroup>
                                    </Grid>
                                </Grid>
                                {(view === 'detail') && (
                                    <>
                                        <Grid container spacing={2} textAlign={'center'}>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Box>
                                                    <br />
                                                    <br />
                                                    <h3><b>รายละเอียดต่างภายในห้อง</b></h3>
                                                    <br />
                                                </Box>
                                            </Grid>
                                            <Grid item lg={3}>
                                                <Paper elevation={5}>
                                                    <br />
                                                    <ChairOutlinedIcon sx={{ color: '#4B679F', fontSize: '5rem' }} />
                                                    <br />
                                                    <br />
                                                    <h5>รองรับผู้ใช้งาน {seatQuantity} ที่นั่ง</h5>
                                                    <br />
                                                </Paper>
                                            </Grid>
                                            <Grid item lg={3}>
                                                <Paper elevation={5}>
                                                    <br />
                                                    <DevicesOutlinedIcon sx={{ color: '#4B679F', fontSize: '5rem' }} />
                                                    <br />
                                                    <br />
                                                    <h5>อุปกรณ์สำหรับการบรรยาย</h5>
                                                    <br />
                                                </Paper>
                                            </Grid>
                                            <Grid item lg={3}>
                                                <Paper elevation={5}>
                                                    <br />
                                                    <DesktopWindowsOutlinedIcon sx={{ color: '#4B679F', fontSize: '5rem' }} />
                                                    <br />
                                                    <br />
                                                    <h5>คอมพิวเตอร์ {(roomDesc === 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์') ? laboratory.computer_quantity : 1} เครื่อง </h5>
                                                    <br />
                                                </Paper>
                                            </Grid>
                                            <Grid item lg={3}>
                                                <Paper elevation={5}>
                                                    <br />
                                                    <SurroundSoundOutlinedIcon sx={{ color: '#4B679F', fontSize: '5rem' }} />
                                                    <br />
                                                    <br />
                                                    <h5>เครื่องขยายเสียง 1 เครื่อง</h5>
                                                    <br />
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                        <Grid container >

                                        </Grid>
                                        {(roomDesc === 'ห้องสำหรับปฏิบัติการคอมพิวเตอร์') && (
                                            <section>
                                                <br />
                                                <br />
                                                <Grid container>
                                                    <Grid item xl={12} lg={12}>
                                                        <h3><b>Hardware</b></h3>
                                                        <br />
                                                        <TableContainer>
                                                            <Table>
                                                                <TableHead>
                                                                    {/* <TableHead>
                                                                    <TableRow>
                                                                        <TableCell><b>รายละเอียด Hardware</b></TableCell>
                                                                    </TableRow>
                                                                </TableHead> */}
                                                                    {[
                                                                        { 'ยี่ห้อ': laboratory.computer_brand },
                                                                        { 'จอแสดงผล': laboratory.display },
                                                                        { 'CPU': laboratory.cpu },
                                                                        { 'RAM': laboratory.ram },
                                                                        { 'GPU': laboratory.gpu },
                                                                        { 'หน่วยความจำหลัก': laboratory.main_memory },
                                                                        { 'ระบบปฏิบัติการ': laboratory.operation_system },
                                                                        { 'ระบบป้องกัน': laboratory.protection_system }
                                                                    ].map((row) => (
                                                                        <TableRow
                                                                            key={Object.keys(row)}
                                                                            sx={
                                                                                {
                                                                                    '&:last-child td, &:last-child th': { border: 0 }
                                                                                }
                                                                            }>
                                                                            <TableCell><b>{Object.keys(row)}</b></TableCell>
                                                                            <TableCell sx={{ fontFamily: 'prompt' }}>{Object.values(row)}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                    <TableRow sx={
                                                                        {
                                                                            '&:last-child td, &:last-child th': { border: 0 }
                                                                        }
                                                                    }>
                                                                        <TableCell>
                                                                            <b>Software ที่ถูกติดตั้ง</b>
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontFamily: 'prompt' }}>
                                                                            
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Grid>
                                            </section>
                                        )}
                                    </>
                                )}
                                {(view === 'calendar') && (
                                    <RoomCalendar prop_roomID={roomId} />
                                )}
                            </section>
                            {isOpen && <BookingForm isOpen={isOpen} toggleBooking={toggleBooking} booking_roomID={roomId} />}
                        </>
                    )}

                </>
            )}
        </>
    )
}

export default RoomDescription
