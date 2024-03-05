import React, { useContext } from 'react'
import { HomeContext } from '../Home'
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import WcIcon from '@mui/icons-material/Wc';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ComputerIcon from '@mui/icons-material/Computer';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import styles from './SideNav.module.css'
import { TouchContext } from '../TV_TouchScreen/TVTouch';

function SideNav({ phoneSize }) {
    const { searchQuery, handleSearch, logo, floorUp, floorDown,
            isSelect, floor, classify } = useContext(HomeContext);
    const { Touch } = useContext(TouchContext);
    return (
        <>
            {Touch ? (
                <>
                    <div className={styles.touch}>
                        <h3 className={styles.topic}>Search</h3>
                        <input className={styles.searchBox} type="text"value={searchQuery} onChange={handleSearch}/>
                        <h3 className={styles.topic}>Room Category</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Small_Lecture_Room") ? styles.selected : styles.unselected}`} id='sm-lr' onClick={()=>classify("Small_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small'/>&emsp; ห้องบรรยายเล็ก</h3>
                        {/* <h3 className={`${styles.category} ${(isSelect === "Medium_Lecture_Room") ? styles.selected : styles.unselected}`} id='lg-lr' onClick={()=>classify("Medium_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small' />&emsp; ห้องบรรยายกลาง</h3> */}
                        <h3 className={`${styles.category} ${(isSelect === "Large_Lecture_Room") ? styles.selected : styles.unselected}`} id='lg-lr' onClick={()=>classify("Large_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small' />&emsp; ห้องบรรยายใหญ่</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Small_Laboratory_Room") ? styles.selected : styles.unselected}`} id='es-r' onClick={()=>classify("Small_Laboratory_Room")}>&emsp;<ComputerIcon fontSize='small'/>&emsp; ห้องทดลองเล็ก</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Large_Laboratory_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Large_Laboratory_Room")}>&emsp;<ComputerIcon fontSize='small'/>&emsp; ห้องทดลองใหญ่</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Education_Service_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Education_Service_Room")}>&emsp;<SupportAgentIcon fontSize='small'/>&emsp; ห้องบริการนักศึกษา</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Entertainment_Room") ? styles.selected : styles.unselected}`} id='cm-r' onClick={()=>classify("Entertainment_Room")}>&emsp;<i className="bi bi-palette-fill"></i>&emsp; ห้องสันทนาการ</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Large_Conference_Room") ? styles.selected : styles.unselected}`} id='mt-lr' onClick={()=>classify("Large_Conference_Room")}>&emsp;<i className="bi bi-easel3-fill"></i>&emsp; ห้องประชุมใหญ่</h3>
                        <h3 className={`${styles.category} ${(isSelect === "toilet") ? styles.selected : styles.unselected}`} id='tl-lr' onClick={()=>classify("toilet")}>&emsp;<WcIcon fontSize='small'/>&emsp; ห้องน้ำ</h3>
                        <h3 className={styles.topic}>Announcement</h3>
                        <Link to="/Touch/Advertising" className={styles.category}>&emsp;<AnnouncementIcon /> กิจกรรม / ประชาสัมพันธ์</Link>
                    </div>
                </>
            ) : (
                <>
                <div className={`${styles.nav} ${phoneSize ? styles.navPhone : ''}`}>
                    <img src={logo} alt="" width={'95%'} style={{marginBottom: '10px', marginLeft: '5px'}}/>
                        <Grid container spacing={1} className={styles.selectFloorZone}>
                        <Grid item xs={12} sm={8} my={'1vw'}>
                        <Link to="/" style={{color:"white", textDecoration: "none"}}>
                            <p className={styles.floorPlanText}>แผนผังห้องเรียน</p>
                        </Link>
                        </Grid>
                        {window.innerWidth >= 600 ? 
                        <Grid item xs={0} sm={4} my={'1vw'} className={styles.floor}>
                        <Grid container spacing={0} style={{paddingRight: '10%'}}>
                            <Grid item xs={4}>
                            <p onClick={floorUp} className={styles.selectFloor} id='floorUpBtn' style={{opacity: floor == 4 ? 0.5 : 1}}>
                                <KeyboardArrowUpIcon />
                            </p>
                            </Grid>
                            <Grid item xs={4}>
                            <p style={{paddingLeft:'10%',paddingRight: '10%'}}>{floor}</p>
                            </Grid>
                            <Grid item xs={4}>
                            <p onClick={floorDown} className={styles.selectFloor} id='floorDownBtn' style={{opacity: floor == 1 ? 0.5 : 1}}>
                                <KeyboardArrowDownIcon />
                            </p>
                            </Grid>
                        </Grid>
                        </Grid> : null}
                        </Grid>
                    <div className={styles.normal}>
                        <h3 className={styles.topic}>Search</h3>
                        <input className={styles.searchBox} type="text"value={searchQuery} onChange={handleSearch}/>
                        <h3 className={styles.topic}>Room Category</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Small_Lecture_Room") ? styles.selected : styles.unselected}`} id='sm-lr' onClick={()=>classify("Small_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small'style={{ color: 'white' }}/>&emsp; ห้องบรรยายเล็ก</h3>
                        {/* <h3 className={`${styles.category} ${(isSelect === "Medium_Lecture_Room") ? styles.selected : styles.unselected}`} id='lg-lr' onClick={()=>classify("Medium_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small' style={{ color: 'white' }}/>&emsp; ห้องบรรยายกลาง</h3> */}
                        <h3 className={`${styles.category} ${(isSelect === "Large_Lecture_Room") ? styles.selected : styles.unselected}`} id='lg-lr' onClick={()=>classify("Large_Lecture_Room")}>&emsp;<ImportContactsIcon fontSize='small' style={{ color: 'white' }}/>&emsp; ห้องบรรยายใหญ่</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Small_Laboratory_Room") ? styles.selected : styles.unselected}`} id='es-r' onClick={()=>classify("Small_Laboratory_Room")}>&emsp;<ComputerIcon fontSize='small'/>&emsp; ห้องทดลองเล็ก</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Large_Laboratory_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Large_Laboratory_Room")}>&emsp;<ComputerIcon fontSize='small'/>&emsp; ห้องทดลองใหญ่</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Education_Service_Room") ? styles.selected : styles.unselected}`} id='ex-r' onClick={()=>classify("Education_Service_Room")}>&emsp;<SupportAgentIcon fontSize='small'/>&emsp; ห้องบริการนักศึกษา</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Entertainment_Room") ? styles.selected : styles.unselected}`} id='cm-r' onClick={()=>classify("Entertainment_Room")}>&emsp;<i className="bi bi-palette-fill"></i>&emsp; ห้องสันทนาการ</h3>
                        <h3 className={`${styles.category} ${(isSelect === "Large_Conference_Room") ? styles.selected : styles.unselected}`} id='mt-lr' onClick={()=>classify("Large_Conference_Room")}>&emsp;<i className="bi bi-easel3-fill"></i>&emsp; ห้องประชุมใหญ่</h3>
                        <h3 className={`${styles.category} ${(isSelect === "toilet") ? styles.selected : styles.unselected}`} id='tl-lr' onClick={()=>classify("toilet")}>&emsp;<WcIcon fontSize='small'/>&emsp; ห้องน้ำ</h3>
                        <h3 className={styles.topic}>Announcement</h3>
                        <Link to="/Advertising" className={styles.category}>&emsp;<AnnouncementIcon /> กิจกรรม / ประชาสัมพันธ์</Link>
                        <h3 className={styles.topic}>Admin zone</h3>
                        <Link to="/Login" className={styles.category} >&emsp;<BarChartIcon /> ADMIN LOGIN</Link>
                    </div>
                </div>
                </>
            )}
        </>
    )
}

export default SideNav