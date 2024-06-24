import React, { useState } from 'react';
import { Typography, TextField, Select, MenuItem, Button, Modal, Box, FormControl, Radio, RadioGroup, FormControlLabel, Popover, Tooltip, SelectChangeEvent } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EastIcon from '@mui/icons-material/East';
import { IExistAddress, IAdditionalLoc } from './mileageTypes'

type MileageFormType = {
  existFavAddress: IExistAddress[]
}

const MileageForm = ({existFavAddress}: MileageFormType) => {
  const [tripDate, setTripDate] = useState<any>(dayjs(new Date()))
  const [roundTrip, setRoundTrip] = useState<number>(0)
  const [accCode, setAccCode] = useState<string>('')
  const [depCode, setDepCode] = useState<string>('')

  const [open, setOpen] = useState<boolean>(false);
  const [inprogress, setInprogress] = useState<boolean>(true)
  const [submitStatus, setSubmitStatus] = useState<string>('')
  const [startingLocationRadio, setStartingLocationRadio] = useState<string>("startSearchBar")
  const [endingLocationRadio, setEndingLocationRadio] = useState<string>("endSearchBar")
  const [additionalLocation, setAdditionalLocation] = useState<IAdditionalLoc[] | []>([])
  const [stopLocationRadio, setStopLocationRadio] = useState<string[]>([])

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(true)

    const EvalDate = dayjs(tripDate).format('YYYY-MM-DD');
    const Purpose = e.currentTarget.purpose.value;
    const RoundTrip = e.currentTarget.roundTrip.value;
    const AccountCode = e.currentTarget.accountCode.value;
    const DepartmentCode = e.currentTarget.departmentCode.value;
    let Origin: string = '';
    let Destination: string = '';

    if (startingLocationRadio === "startSearchBar") {
      Origin = e.currentTarget.OriginAddress.value;
    } else {
      const favLocID = parseInt(e.currentTarget.startingFavDropDown.value);
      const matchedFavLocObject: IExistAddress | undefined = existFavAddress.find((location: IExistAddress) => location.FavoriteLocationMileageID === favLocID);
      if (!matchedFavLocObject) {
        alert('Invalid favorite starting location, please make changes to your address(es)')
        return
      }
      Origin = matchedFavLocObject.FavoriteFullAddress;
    }
    if (endingLocationRadio === "endSearchBar") {
      Destination = e.currentTarget.DestinationAddress.value;
    } else {
      const favLocID = parseInt(e.currentTarget.endingFavDropDown.value);
      const matchedFavLocObject: IExistAddress | undefined = existFavAddress.find((location: IExistAddress) => location.FavoriteLocationMileageID === favLocID)
      if (!matchedFavLocObject) {
        alert('Invalid ending location, please make changes to your address(es)')
        return
      }
      Destination = matchedFavLocObject.FavoriteFullAddress;
    }
    let stopsLocationArray = []
    for (let i = 0; i < additionalLocation.length; i++) {
      if (stopLocationRadio[i].includes('stopSearchBar')) {
        const stopObject = {} as IAdditionalLoc;
        stopObject.StopNumber = i
        stopObject.Stop = e.currentTarget[`stopAddress-${i}`].value;
        stopsLocationArray.push(stopObject)
      } else {
        const favLocID = parseInt(e.currentTarget[`stopFavDropDown-${i}`].value);
        const matchedFavLocObject = existFavAddress.find(location => location.FavoriteLocationMileageID === favLocID)
        if (!matchedFavLocObject) {
          alert('Invalid favorite stop location, please make changes to your address(es)')
          return
        }
        const stopObject = {} as IAdditionalLoc;
        stopObject.StopNumber = i
        stopObject.Stop = matchedFavLocObject.FavoriteFullAddress;
        stopsLocationArray.push(stopObject)
      }
    }

    const mileageSubmission = {
      EvalDate,
      RoundTrip,
      AccountCode,
      DepartmentCode,
      Purpose,
      Origin,
      Destination,
      stopsLocationArray
    };

    // const mileageSubmission = {
    //   EvalDate: '2024-05-26',
    //   RoundTrip: '0',
    //   AccountCode: '1',
    //   DepartmentCode: '2',
    //   Purpose: 'testing',
    //   Origin: 'address here',
    //   Destination: 'address here',
    //   stopsLocationArray: [
    //     {
    //       StopNumber: 0,
    //       Stop: 'address here',
    //     }
    //   ]
    // }

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mileageSubmission)
    }

    // fetch(`route`, req)
    //   .then(res => res.json())
    //   .then(data => {
    //      do something here
    //   })
    //   .catch((err: Error) => {
    //      do something here
    //   })
  };

  const handleClose = (event: any, reason: any) => {
    if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return;
    }
    setOpen(false);
    setInprogress(true);
  }

  const handleSubmitStatus = () =>  {
    if (inprogress) {
      return (
        <Box sx={{ flexBasis: '100%', textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )
    } else {
      return (
        <Box sx={{ flexBasis: '100%', textAlign: 'center', margin: 'auto' }}>
          <Typography sx={{ margin: 2 }}>{submitStatus}</Typography>
          <Button onClick={() => (setOpen(false), setInprogress(true))}>Close</Button>
        </Box>
      )
    }
  }

  const style = {
    position: 'absolute',
    top: '47.5%',
    left: '47.5%',
    transform: 'translate(-47.5%, -47.5%)',
    width: '300px',
    height: '200px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexWrap: 'wrap'
  };

  const handleAddingStops = () => {
    const shallowcopyAdditionalLocation = additionalLocation ? [...additionalLocation] : []
    const newBlankData = {
      Stop: '',
      StopLat: '',
      StopLon: '',
      StopAddress: '',
      StopCity: '',
      StopState: '',
      StopZip: ''
    }
    shallowcopyAdditionalLocation.push(newBlankData)
    setAdditionalLocation(shallowcopyAdditionalLocation)
    const shallowcopyStopLocationRadio = [...stopLocationRadio]
    shallowcopyStopLocationRadio.push(`stopSearchBar-${shallowcopyStopLocationRadio.length}`)
    setStopLocationRadio(shallowcopyStopLocationRadio)
  }

  const handleRemoveStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!additionalLocation) {
      return
    }
    const selectedID = parseInt(e.currentTarget.id.split('-')[1])
    const shallowcopyAdditionalLocation = [...additionalLocation]
    shallowcopyAdditionalLocation.splice(selectedID, 1)
    setAdditionalLocation(shallowcopyAdditionalLocation)
    const shallowcopyStopLocationRadio = [...stopLocationRadio]
    shallowcopyStopLocationRadio.splice(selectedID, 1)

    setStopLocationRadio(shallowcopyStopLocationRadio)
  }

  const [infoPopupAnchorEl, setInfoPopupAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClickInfoButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    setInfoPopupAnchorEl(event.currentTarget);
  };

  const handleCloseInfoPopup = () => {
    setInfoPopupAnchorEl(null);
  };

  const openInfoPopup = Boolean(infoPopupAnchorEl);
  const infoPopupId = openInfoPopup ? 'simple-popover' : undefined;
  
  return (
    <Box sx={{ width: '100%', p: 0, m: 0, display: 'flex', flexWrap: 'wrap' }}>
      <Box sx={{ flexBasis: '100%', maxWidth: '100%', ml: 'auto', mr: 'auto', mt: 0, p: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: 34, fontFamily: 'Georgia', align: "center" }}>
          New Mileage Form
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ flexBasis: '100%', display: 'flex', width: '100%', marginBottom: 2, flexWrap: 'wrap', gap: {sm: '0', md: '5%'} }}>
          {/* Day Picker */}
          <Box sx={{display: 'flex', flexBasis: {sm: '100%', md: '47.5%'}, flexWrap: 'wrap', mb: 2, width: '100%' }}>
            <Typography sx={{fontWeight: 'bold', height: 'fit-content', width: '100%'}}>Travel Date:</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                // inputFormat="MM/DD/YYYY"
                value={tripDate}
                onChange={(newValue) => setTripDate(dayjs(newValue))}
                // renderInput={(params: any) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>

          {/* Round Trip */}
          <Box sx={{display: 'flex', flexBasis: {sm: '100%', md: '47.5%'}, flexWrap: 'wrap', mb: 2, width: '100%' }}>
            <Typography sx={{fontWeight: 'bold', width: '100%'}}>Round Trip:</Typography>
            {
              additionalLocation && additionalLocation.length > 0 ?
                <Select
                  id="radioMyList"
                  name='roundTrip'
                  value={0}
                  variant='outlined'
                  fullWidth
                  disabled
                >
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </Select>
                :
                <Select
                  id="radioMyList"
                  name='roundTrip'
                  value={String(roundTrip)}
                  onChange={(e: SelectChangeEvent) => setRoundTrip(parseInt(e.target.value as string))}
                  variant='outlined'
                  fullWidth
                >
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </Select>
            }
          </Box>

          {/* Account Code */}
          <Box sx={{display: 'flex', flexBasis: {sm: '100%', md: '47.5%'}, flexWrap: 'wrap', mb: 2, width: '100%'}}>
            <Typography sx={{fontWeight: 'bold', height: 'fit-content', width: '100%'}}>Account Code:</Typography>
            <Select
              id="accountCode"
              name='accountCode'
              label="Account Code"
              value={accCode}
              onChange={(e: SelectChangeEvent) => setAccCode(e.target.value)}
              required
              variant='outlined'
              fullWidth
            >
              <MenuItem value={0}></MenuItem>
              <MenuItem value={1}>Personal Transportation</MenuItem>
              <MenuItem value={2}>Company Transportation</MenuItem>
            </Select>
          </Box>

          {/* Department Code */}
          <Box sx={{display: 'flex', flexBasis: {sm: '100%', md: '47.5%'}, flexWrap: 'wrap', mb: 2, width: '100%'}}>
            <Typography sx={{fontWeight: 'bold', height: 'fit-content', width: '100%'}}>Department Code:</Typography>
            <Select
              id="departmentCode"
              name='departmentCode'
              label="Department Code"
              value={depCode}
              onChange={(e: SelectChangeEvent) => setDepCode(e.target.value)}
              required
              variant='outlined'
              fullWidth
            >
              <MenuItem value={0}></MenuItem>
              <MenuItem value={1}>Sales</MenuItem>
              <MenuItem value={2}>Engineering</MenuItem>
              <MenuItem value={3}>Management</MenuItem>
              <MenuItem value={4}>IT</MenuItem>
              <MenuItem value={5}>Human Resources</MenuItem>
            </Select>
          </Box>

          {/* Purpose */}
          <Box sx={{display: 'flex', flexBasis: '100%', flexWrap: 'wrap', mb: 2, width: '100%'}}>
            <Typography sx={{fontWeight: 'bold', height: 'fit-content', width: '100%'}}>Purpose:</Typography>
            <TextField
                id="purpose"
                name='purpose'
                variant='outlined'
                fullWidth
                required
              />
          </Box>

          {/* Start Location */}
          <Box sx={{display: 'flex', flexBasis: '100%', flexWrap: 'wrap', mb: 2, width: '100%'}}>
            <Typography sx={{fontWeight: 'bold', height: 'fit-content', width: '100%'}}>Starting Location:</Typography>
            <Box sx={{width: '100%'}}>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="starting-location-row-radio-buttons-group-label"
                  name="starting-location-row-radio-buttons-group"
                  value={startingLocationRadio}
                  onChange={(event) => setStartingLocationRadio(event.target.value)}
                >
                  <FormControlLabel value="startSearchBar" control={<Radio />} label="Search Bar" />
                  <FormControlLabel value="startFavoriteList" control={<Radio />} label="Favorite List" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box sx={{width: '100%'}}>
              {
                startingLocationRadio === "startSearchBar" ?
                  <TextField fullWidth id="OriginAddress" required />
                  :
                  <Box>
                    <Typography>Your Favorite Locations:</Typography>
                    <Select fullWidth size='small' name='startingFavDropDown' id='startingFavDropDown'>
                      {existFavAddress && existFavAddress.map((item: IExistAddress, index: number) => {
                        return (
                          <MenuItem key={`starting-${index}`} value={item.FavoriteLocationMileageID}>{item.LocationName + ' - ' + item.FavoriteFullAddress}</MenuItem>
                        )
                      })}
                    </Select>
                  </Box>
              }
            </Box>
          </Box>

          {/* Additional Stops */}
          <Box sx={{display: 'flex', flexBasis: '100%', flexWrap: 'wrap', mb: 2, width: '100%'}}>
            <Typography sx={{fontWeight: 'bold', height: 'fit-content', width: '100%'}}>Additional Stops (Optional):</Typography>
            {
              additionalLocation && additionalLocation.map((_, index) => {
                return (
                  <>
                    <Box sx={{width: '100%', display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center' }} key={`customField-${index}`}>
                      <Typography>Stop #{index + 1}</Typography>
                        {
                          index + 1 == additionalLocation.length ?
                            <Tooltip title="Delete">
                              <Button onClick={handleRemoveStop} variant='outlined' sx={{ width: '100px' }} id={`closeButton-${index}`}>
                                Delete <CloseIcon sx={{color: 'red'}} id={`closeIcon-${index}`} />
                              </Button>
                            </Tooltip>
                            : <></>
                        }
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby={`stop-location-row-radio-buttons-group-label-${index}`}
                          name={`ending-location-row-radio-buttons-group-${index}`}
                          value={stopLocationRadio[index]}
                          onChange={(e) => {
                            const shallowcopyStopLocationRadio = [...stopLocationRadio]
                            shallowcopyStopLocationRadio.splice(index, 1, e.currentTarget.value)
                            setStopLocationRadio(shallowcopyStopLocationRadio)
                          }}
                          >
                          <FormControlLabel value={`stopSearchBar-${index}`} control={<Radio />} label="Search Bar" />
                          <FormControlLabel value={`stopFavoriteList-${index}`} control={<Radio />} label="Favorite List" />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                    <Box sx={{width: '100%'}}>
                      {
                        stopLocationRadio[index] === "stopSearchBar-" + index ?
                          <TextField fullWidth id={`stopAddress-${index}`} required />
                          :
                          <Box>
                            <Typography>Your Favorite Locations:</Typography>
                            <Select fullWidth size='small' name={`stopFavDropDown-${index}`} id={`stopFavDropDown-${index}`}>
                              {existFavAddress && existFavAddress.map((item, favIndex) => {
                                return (
                                  <MenuItem key={`stop-${index}-${favIndex}`} value={item.FavoriteLocationMileageID}>{item.LocationName + ' - ' + item.FavoriteFullAddress}</MenuItem>
                                )
                              })}
                            </Select>
                          </Box>
                      }
                    </Box>
                  </>
                )
              })
            }
          </Box>

          {/* Add more locations button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button onClick={handleAddingStops} variant='contained' ><AddIcon />Add more stops</Button>
            <Tooltip title="Click for details..">
              <Button aria-describedby={infoPopupId} variant="text" onClick={handleClickInfoButton}>
                <InfoOutlinedIcon />
              </Button>
            </Tooltip>
            <Popover
              id={infoPopupId}
              open={openInfoPopup}
              anchorEl={infoPopupAnchorEl}
              onClose={handleCloseInfoPopup}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: 2, width: '500px' }}>
                <Box sx={{ flexBasis: '100%', display: 'flex', justifyContent: 'center', m: 1 }}>
                  <Typography sx={{ width: '75px', height: '35px', border: '1px solid black', borderRadius: '5px', textAlign: 'center' }}>Start</Typography>
                  <EastIcon />
                  <Typography sx={{ width: '75px', height: '35px', border: '1px solid black', borderRadius: '5px', textAlign: 'center' }}>Stop 1</Typography>
                  <EastIcon />
                  <Typography sx={{ width: '75px', height: '35px', border: '1px solid black', borderRadius: '5px', textAlign: 'center' }}>Stop 2</Typography>
                  <EastIcon />
                  <Typography sx={{ width: '75px', height: '35px', border: '1px solid black', borderRadius: '5px', textAlign: 'center' }}>End</Typography>
                </Box>
                <Box sx={{ flexBasis: '100%' }}>
                  <Typography variant='h5'>How does adding stops work?</Typography>
                  <Typography>When adding stop(s), you are creating multiple mileages that are in a series. For example (from diagram above): this means that you are creating 3 separate mileages.</Typography>
                  <Typography>1. From "Starting" location to "Stop #1" location</Typography>
                  <Typography>3. From "Stop #1" location to "Stop #2" location</Typography>
                  <Typography>2. From "Stop #2" location to "Ending" location</Typography>
                  <br />
                  <Typography variant='subtitle2' sx={{ fontWeight: 'bold', color: 'red' }}>***IMPORTANT: Please note that this is NOT 3 separate mileages that have either the same "Starting" location or "Ending" location***</Typography>
                </Box>
              </Box>
            </Popover>
          </Box>

          {/* End location */}
          <Box sx={{display: 'flex', flexBasis: '100%', flexWrap: 'wrap', mb: 2, width: '100%'}}>
            <Typography sx={{fontWeight: 'bold', height: 'fit-content', width: '100%'}}>Ending Location:</Typography>
            <Box sx={{width: '100%'}}>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="ending-location-row-radio-buttons-group-label"
                  name="ending-location-row-radio-buttons-group"
                  value={endingLocationRadio}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndingLocationRadio((e.currentTarget as HTMLInputElement).value )}
                >
                  <FormControlLabel value="endSearchBar" control={<Radio />} label="Search Bar" />
                  <FormControlLabel value="endFavoriteList" control={<Radio />} label="Favorite List" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box sx={{width: '100%'}}>
              {
                endingLocationRadio === "endSearchBar" ?
                  <TextField fullWidth id="DestinationAddress" required />
                  :
                  <Box>
                    <Typography>Your Favorite Locations:</Typography>
                    <Select fullWidth size='small' name='endingFavDropDown' id='endingFavDropDown'>
                      {existFavAddress && existFavAddress.map((item, index: number) => {
                        return (
                          <MenuItem key={`ending-${index}`} value={item.FavoriteLocationMileageID}>{item.LocationName + ' - ' + item.FavoriteFullAddress}</MenuItem>
                        )
                      })}
                    </Select>
                  </Box>
              }
            </Box>
          </Box>

          <Box sx={{display: 'flex', flexBasis: '100%'}}>
            <Button type='submit' variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </Box>
      </form>

      <Modal
        // disablebackdropclick='true'
        open={open}
        onClose={(event: any, reason: any) => handleClose(event, reason)}
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ flexBasis: '100%', textAlign: 'center' }}>
            Creating new mileage:
          </Typography>
          {handleSubmitStatus()}
        </Box>
      </Modal>
    </Box>
  );
};

export default MileageForm;