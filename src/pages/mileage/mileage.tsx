import React, { useEffect, useState } from 'react';
import '../../styles.css'
import { Typography, Box, Button, Modal } from '@mui/material';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import AddIcon from '@mui/icons-material/Add';
import MileageForm from '../../components/mileage/mileageForm';
import { LineChart } from '@mui/x-charts/LineChart';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import MileageFavoriteLoc from '../../components/mileage/mileageFavoriteLoc';
import { IMileageDataAndStats, IMileageHRDataAndStatsGraph, IExistAddress } from '../../components/mileage/mileageTypes'
import mileageData from '../../components/mileage/mileageStaffs.json';
import FavoriteAddress from '../../components/mileage/favoriteLocation.json'

export default function MileagePage() {
    const [openAddMileageModal, setOpenAddMileageModal] = useState<boolean>(false);
    const [mileageDataAndStatsGuage, setMileageDataAndStatsGuage] = useState<IMileageDataAndStats | null>(null)
    const [mileageDataAndStatsGraph, setMileageDataAndStatsGraph] = useState<IMileageHRDataAndStatsGraph | null>(null)
    const [existFavAddress, setExistFavAddress] = useState<IExistAddress[] | []>([])

    useEffect(() => {
        setMileageDataAndStatsGuage(mileageData.MileageDataAndStatsGuage)
        setMileageDataAndStatsGraph(mileageData.MileageDataAndStatsGraph)
        setExistFavAddress(FavoriteAddress.FavoriteLocation)
    }, [])

    const handleOpenAddMileageModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpenAddMileageModal(true)
    }

    const handleCloseAddMileageModal = () => {
        setOpenAddMileageModal(false)
    }

    return (
        <Box sx={{display: 'flex', width: '100%'}}>
            <Box sx={{position: 'fixed', width: '100px', backgroundColor: 'white', height: '100vh', display: {xs: 'none', sm: 'none', md: 'block'}}}>
                <Box sx={{transform: 'rotate(90deg)', display: 'flex', pl: '100%'}}>
                    <Typography variant='h3' fontFamily={'fantasy'}>MILEAGE...</Typography>
                    <AirportShuttleIcon sx={{fontSize: '50px' }} className='car' />
                </Box>
            </Box>
            <Box sx={{flexBasis: '100%', display: 'flex', pl: {sm: '0px', md:'100px'}, flexWrap: 'wrap'}}>
                <Box sx={{flexBasis: '100%', padding: 2}}>
                    <Box sx={{margin: '0px', padding: '0'}}>
                        <Typography variant='h4'>Dashboard</Typography>
                    </Box>
                    <Box sx={{margin: '0px', padding: '0'}}>
                        <p style={{margin: '0px', padding: '0', color: 'gray'}}>Information about your current mileage</p>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', flexBasis: {md: '60%', sm: '100%'}, pl: 2, flexWrap: 'wrap', mb: 2, mr: '5%', maxWidth: '900px'}}>
                    <Box sx={{flexBasis: '100%'}}>
                        <Typography>Current month: June</Typography>
                    </Box>
                    <Box sx={{flexBasis: '100%', display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2, flexWrap: 'wrap'}}>
                        <Box sx={{ background: 'linear-gradient(180deg, rgba(68,255,156,1) 0%, rgba(206,255,247,1) 100%)', width: '200px', height: '200px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderRadius: '30px', mb: 2}}>
                            <Gauge
                                width={180}
                                height={150}
                                value={mileageDataAndStatsGuage ? mileageDataAndStatsGuage.totalMileageTrip : 0}
                                valueMax={mileageDataAndStatsGuage ? mileageDataAndStatsGuage.totalMileageTrip : 0}  
                                startAngle={-110}
                                endAngle={110}
                                sx={{
                                    [`& .${gaugeClasses.valueText}`]: {
                                        fontSize: 40,
                                        transform: 'translate(0px, 0px)',
                                    },
                                    [`& .${gaugeClasses.valueArc}`]: {
                                        fill: 'rgba(50,210,120,1)',
                                    },
                                }}
                                />
                            <Typography sx={{fontWeight: 'bold'}}>Total Trip</Typography>
                        </Box>
                        <Box sx={{background: 'linear-gradient(180deg, rgba(255,166,21,1) 0%, rgba(181,255,217,1) 100%)', width: '200px', height: '200px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderRadius: '30px', mb: 2}}>
                            <Gauge
                                width={180}
                                height={150}
                                value={mileageDataAndStatsGuage ? mileageDataAndStatsGuage.pendingMileage : 0}
                                valueMax={mileageDataAndStatsGuage ? mileageDataAndStatsGuage.totalMileageTrip : 0}
                                startAngle={-110}
                                endAngle={110}
                                sx={{
                                    [`& .${gaugeClasses.valueText}`]: {
                                        fontSize: 40,
                                        transform: 'translate(0px, 0px)',
                                    },
                                    [`& .${gaugeClasses.valueArc}`]: {
                                        fill: 'rgba(210,130,10,1)',
                                    },
                                }}
                                />
                            <Typography sx={{fontWeight: 'bold'}}>Pending Mileage</Typography>
                        </Box>
                        <Box sx={{background: 'linear-gradient(180deg, rgba(205,21,255,1) 0%, rgba(181,252,255,1) 100%)', width: '200px', height: '200px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderRadius: '30px', mb: 2}}>
                            <Gauge
                                width={180}
                                height={150}
                                value={mileageDataAndStatsGuage ? mileageDataAndStatsGuage.approvedMileage : 0}
                                valueMax={mileageDataAndStatsGuage ? mileageDataAndStatsGuage.totalMileageTrip : 0}
                                startAngle={-110}
                                endAngle={110}
                                sx={{
                                    [`& .${gaugeClasses.valueText}`]: {
                                        fontSize: 40,
                                        transform: 'translate(0px, 0px)',
                                    },
                                    [`& .${gaugeClasses.valueArc}`]: {
                                        fill: 'rgba(175,10,210,1)',
                                    },
                                }}
                                />
                            <Typography sx={{fontWeight: 'bold'}}>Approved Mileage</Typography>
                        </Box>
                        <Box sx={{background: 'linear-gradient(0deg, rgba(255,199,199,1) 0%, rgba(255,0,0,1) 100%)', width: '200px', height: '200px', justifyContent: 'center', borderRadius: '30px', textAlign: 'center', mb: 2}}>
                            <Box>
                                <Typography sx={{fontSize: '3rem', lineHeight: '162px',}}>{mileageDataAndStatsGuage ? mileageDataAndStatsGuage.totalMileageDistance.toFixed(2) : 0}</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{fontWeight: 'bold', }}>Miles</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{flexBasis: '100%', backgroundColor: '#fff', borderRadius: '30px', minHeight: '400px', maxHeight: '450px', width: '100%', mb: 2}}>
                    {mileageDataAndStatsGraph ? 
                        <LineChart
                            xAxis={[{ data: mileageDataAndStatsGraph.EvalDate, scaleType: 'point', label: 'Date' }]}
                            series={[
                                { curve: "catmullRom", data: mileageDataAndStatsGraph.TotalTrip, label: 'Total Trip', yAxisKey: 'leftAxisTrip', color: 'blue' },
                                { curve: "catmullRom", data: mileageDataAndStatsGraph.ApprovedTrip, label: 'Approved Trip', yAxisKey: 'leftAxisTrip', color: 'purple' },
                                { curve: "catmullRom", data: mileageDataAndStatsGraph.PendingTrip, label: 'Pending Trip', yAxisKey: 'leftAxisTrip', color: 'violet' },
                                { curve: "linear", data: mileageDataAndStatsGraph.ApprovedDistance, label: 'Approved Distance', yAxisKey: 'rightAxisDistance', color: 'lightgray' },
                                { curve: "linear", data: mileageDataAndStatsGraph.PendingDistance, label: 'Pending Distance', yAxisKey: 'rightAxisDistance', color: 'darkgray' },
                            ]}
                            yAxis={[{id: 'leftAxisTrip', label: '# of Trips'}, {id: 'rightAxisDistance', label: 'Distance (miles)'}]}
                            rightAxis="rightAxisDistance"
                        /> : <></>}
                    </Box>
                </Box>
                <Box sx={{display: 'flex', flexBasis: {md: '30%', sm: '100%'}, p: {sm: 2, md: 0}, alignContent: 'start', flexWrap: 'wrap', }}>
                    <Box sx={{display: 'flex', flexBasis: '100%', maxWidth: '200px', mr: '50%', flexWrap: 'wrap', mb: 2, p: 2}}>
                        <Box sx={{flexBasis: '100%', display: 'flex', flexWrap: 'wrap', mb: 2}}>
                            <Typography variant="h6" sx={{ flexBasis: '100%', textAlign: 'start', borderBottom: '1px solid gray' }}>
                                Actions:
                            </Typography>
                        </Box>
                        <Box sx={{flexBasis: '100%', display: 'flex', flexWrap: {xs: 'wrap', sm: 'nowrap', md:'wrap'}, gap: 2}}>
                            <Button sx={{minWidth: '200px'}} variant='outlined' onClick={handleOpenAddMileageModal}><AddIcon fontSize='small'/> Add New Mileage</Button>
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', flexBasis: '100%', mr: 'auto', flexWrap: 'wrap', borderRadius: '30px', p: 2}}>
                        <MileageFavoriteLoc existFavAddress={existFavAddress} setExistFavAddress={setExistFavAddress} />
                    </Box>
                </Box>
            </Box>
            <Modal
                open={openAddMileageModal}
                onClose={handleCloseAddMileageModal}
                id="addMileageModal"
            >
                <Box className="mileageFormModal">
                    <MileageForm existFavAddress={existFavAddress} />
                </Box>
            </Modal>
        </Box>
    )
}
