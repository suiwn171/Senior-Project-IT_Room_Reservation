import React from 'react'
import { useState, useContext } from 'react'
import { Container, Box, Paper, Grid } from '@mui/material'
import { AdminContext } from '../AdminPage/AdminPage'
import CardSumary from './ReservationSumary/CardSumary'
import DisplayAllEvent from './OngoingEvent/DisplayAllEvent'
import EventCalendar from './EventCalendar/EventCalendar'
import SuperUser_RoomList from '../SuperUser_RoomList'
import WaitingApprovementDisplay from './WaitingApprovement/WaitingApprovementDisplay'

function DashBoard() {

  const { rejectedList, roomBook, bookerData, approvementList } = useContext(AdminContext);

  return (
    <div style={
      {
        marginLeft: '3vw',
        marginRight: '3vw'
      }
    }>
      <Grid container spacing={2}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} sx={{ marginTop: '1rem' }}>
          <h2><b>Welcome to IT Room Management</b></h2>
        </Grid>
        <Grid item xl={7} lg={7} md={7} sm={12} xs={12}>
          <Grid container spacing={2} >
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
              <CardSumary card_name={'Total Event'} quantity={roomBook.length} icon={'EventIcon'} />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
              <CardSumary card_name={'Total Booker'} quantity={bookerData.length} icon={'GroupsIcon'} />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
              <CardSumary card_name={'Approved'} quantity={approvementList.length} icon={'CheckCircleIcon'} />
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
              <CardSumary card_name={'Rejected'} quantity={rejectedList.length} icon={'CancelIcon'} />
            </Grid>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <DisplayAllEvent />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <WaitingApprovementDisplay />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default DashBoard