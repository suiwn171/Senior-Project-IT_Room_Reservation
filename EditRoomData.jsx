import React, { useContext, useEffect, useState } from 'react';
import { Grid, TextField, Button, Slide, Autocomplete, Grow } from '@mui/material';
import { useParams } from 'react-router-dom';
import { AdminContext } from './AdminPage/AdminPage';
import axios from 'axios';
import API_DATA from '../link';
import Swal from 'sweetalert2';

function EditRoomData() {
  const { roomID } = useParams();
  const { allRoom } = useContext(AdminContext);
  const [showComputerForm, setShowComputerForm] = useState(false);
  const thisRoom = allRoom.find(room => room.id === roomID) || {};
  const [roomData, setRoomData] = useState({
    id: 'COMMON',
    room_name: '',
    floor: 0,
    description: '',
    seat: 0,
    total_uses: 0,
    room_status: 'Active',
    room_category: 'None',
  });
  const [computerSpecs, setComputerSpecs] = useState({
    computer_quantity: 0,
    computer_brand: '',
    display: '',
    cpu: '',
    ram: '',
    main_memory: '',
    gpu: '',
    operation_system: '',
    protection_system: '',
    software_installed: [],
  });

  const handleComputerChange = (e) => {
    setComputerSpecs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    console.log(allRoom)
    console.log(computerSpecs.software_installed)
  };

  useEffect(() => {
    if (Object.keys(thisRoom).length !== 0) {
      setRoomData((prev) => ({
        ...prev,
        id: thisRoom.id,
        room_name: thisRoom.room_name,
        floor: thisRoom.floor,
        description: thisRoom.description,
        seat: thisRoom.seat,
        total_uses: thisRoom.total_uses,
        room_status: thisRoom.room_status,
        room_category: thisRoom.room_category,
      })
      );
      setComputerSpecs((prev) => ({
        ...prev,
        computer_quantity: thisRoom.laboratory.computer_quantity,
        computer_brand: thisRoom.laboratory.computer_brand,
        display: thisRoom.laboratory.display,
        cpu: thisRoom.laboratory.cpu,
        ram: thisRoom.laboratory.ram,
        main_memory: thisRoom.laboratory.main_memory,
        gpu: thisRoom.laboratory.gpu,
        operation_system: thisRoom.laboratory.operation_system,
        protection_system: thisRoom.laboratory.protection_system,
        software_installed: thisRoom.laboratory.software_installed,
      })
      );
    }
  }, [thisRoom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(roomData);
    // Perform your desired action here, e.g., send data to the server

    try {
      const response = await axios.put(API_DATA.updateEditRoom, roomData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data.message,
      });
      navigate("/Admin");
    }
    catch (error) {
      Swal.fire({
        title: 'Update Failed...',
        icon: 'error',
        text: error.response.data.message,
      })
    }
  };

  return (
    <div style={
      {
        marginLeft: '3vw',
        marginRight: '3vw'
      }
    }>
      <Slide direction='left' in={true}>
        <form onSubmit={handleSubmit}>
          <h1 style={{ marginTop: '20px' }}>Editing {roomData.id}</h1>
          {thisRoom && (
            <>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <TextField
                    name='description'
                    label='Description'
                    value={roomData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin='dense'
                    required
                  />
                </Grid>
                <Grid item sm={6}>
                  <TextField
                    name='seat'
                    label='Seat'
                    value={roomData.seat}
                    onChange={handleChange}
                    type='number'
                    fullWidth
                    margin='dense'
                    required
                  />
                  <TextField
                    name='total_uses'
                    label='Total Uses'
                    value={roomData.total_uses}
                    onChange={handleChange}
                    type='number'
                    fullWidth
                    margin='dense'
                    required
                  />
                  <Autocomplete sx={{ marginTop: '10px' }}
                    id="status"
                    value={roomData.room_status}
                    options={['Active', 'Available', 'Unavailable']}
                    onChange={(event, newValue) => {
                      setRoomData((prevState) => ({
                        ...prevState,
                        room_status: newValue
                      }))
                    }}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Status" required />}
                  />
                  <Autocomplete sx={{ marginTop: '10px' }}
                    id="category"
                    value={roomData.room_category}
                    options={['Small_Lecture_Room',
                      'Medium_Lecture_Room',
                      'Large_Lecture_Room',
                      'Education_Service_Room',
                      'Entertainment_Room',
                      'Large_Conference_Room',
                      'Small_Laboratory_Room',
                      'Large_Laboratory_Room',
                      'Support_Room',
                      'Multi_Purpose_Hall',
                      'None']}
                    onChange={(event, newValue) => {
                      setRoomData((prevState) => ({
                        ...prevState,
                        room_category: newValue
                      }))
                    }}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Category" required />}
                  />
                </Grid>
              </Grid>



              {showComputerForm && (
                <Grow in={true} timeout={500}>
                  <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                    <Grid item sm={12}>
                      <h1>Computer Specifications</h1>
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='computer_quantity'
                        label='Computer Quantity'
                        value={computerSpecs.computer_quantity}
                        onChange={handleComputerChange}
                        type='number'
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='computer_brand'
                        label='Computer Brand'
                        value={computerSpecs.computer_brand}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='display'
                        label='Display'
                        value={computerSpecs.display}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='cpu'
                        label='CPU'
                        value={computerSpecs.cpu}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='ram'
                        label='RAM'
                        value={computerSpecs.ram}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='main_memory'
                        label='Main Memory'
                        value={computerSpecs.main_memory}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='gpu'
                        label='GPU'
                        value={computerSpecs.gpu}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='operation_system'
                        label='Operation System'
                        value={computerSpecs.operation_system}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <TextField
                        name='protection_system'
                        label='Protection System'
                        value={computerSpecs.protection_system}
                        onChange={handleComputerChange}
                        fullWidth
                        margin='dense'
                        required
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <Autocomplete sx={{ marginTop: '9px' }}
                        multiple
                        freeSolo
                        options={computerSpecs.software_installed}
                        defaultValue={computerSpecs.software_installed}
                        onChange={(event, newValue) => {
                          setComputerSpecs((prev) => ({
                            ...prev,
                            software_installed: newValue
                          })
                          )
                        }}
                        fullWidth
                        renderInput={(params) => <TextField {...params} label="Software Installed" required />}
                      />
                    </Grid>
                  </Grid>
                </Grow>
              )}
              <Grid container spacing={2} sx={{ marginTop: '10px', marginBottom: '25px' }}>
                <Grid item sm={12}>
                  <Button onClick={() => setShowComputerForm(!showComputerForm)} sx={{ marginRight: '20px' }}>
                    {showComputerForm ? 'Hide Computer Specs' : 'Show Computer Specs'}
                  </Button>
                  <Button type='submit' variant='contained' color='primary'>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </>)}
        </form>
      </Slide>
    </div>
  );
}

export default EditRoomData;
