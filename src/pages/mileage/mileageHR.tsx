import React, { useEffect, useState } from 'react';
import '../../styles.css'
import { Typography, Box, Button } from '@mui/material';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { LineChart } from '@mui/x-charts/LineChart';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { IMileageHRDataAndStatsGuage, IMileageHRDataAndStatsGraph, IMileageTableData } from '../../components/mileage/mileageTypes'
import mileageData from '../../components/mileage/mileageStaffs.json'
import MileageHRTable from '../../components/mileage/mileageHRTable'
import MileageTableData from '../../components/mileage/mileageTableData.json'


export default function MileageHRPage() {
    const [mileageHRDataAndStatsGuageData, setMileageHRDataAndStatsGuageData] = useState<IMileageHRDataAndStatsGuage | null>(null)
    const [mileageHRDataAndStatsGraphData, setMileageHRDataAndStatsGraphData] = useState<IMileageHRDataAndStatsGraph | null>(null)
    const [mileageHRTableData, setMileageHRTableData] = useState<IMileageTableData[] | null>(null)
    const [tab, setTab] = useState<string>('stats') // stats | table

    useEffect(() => {
        const getUserMileageInfoAndStatsGuageData = async () => {
            setMileageHRDataAndStatsGuageData(mileageData.MileageHRDataAndStatsGuage)
            // or use fetch method if API route exist
        }
        
        const getUserMileageInfoAndStatsGraphData = async () => {
            setMileageHRDataAndStatsGraphData(mileageData.MileageHRDataAndStatsGraph)
            // or use fetch method if API route exist
        }
        const getMileageTableData = async () => {
            setMileageHRTableData(MileageTableData.MileageTableData)
            // or use fetch method if API route exist
        }
        getUserMileageInfoAndStatsGuageData()
        getUserMileageInfoAndStatsGraphData()
        getMileageTableData()
    }, [])

    const [isHoveredTT, setIsHoveredTT] = useState(false);
    const [isHoveredPM, setIsHoveredPM] = useState(false);
    const [isHoveredAM, setIsHoveredAM] = useState(false);
    const [isHoveredTM, setIsHoveredTM] = useState(false);

    const handleRandomize = (e: React.MouseEvent) => {
        function getRandomInt(decimal: boolean, trip: string, type: string): number {
            let maxNumber: number = 1;
            if (trip === 'trip') {
                if (type === 'guage') {
                    maxNumber = 1000;
                } else if (type === 'graph') {
                    maxNumber = 35;
                }
            } else if (trip === 'distance') {
                if (type === 'guage') {
                    maxNumber = 4500;
                } else if (type === 'graph') {
                    maxNumber = 800;
                }
            }
            if (decimal) {
                return parseFloat((Math.random() * maxNumber).toFixed(2))
            } else {
                return Math.floor(Math.random() * maxNumber)
            }
        }
        if (e.currentTarget.id === "guage-random") {
            const newMileageHRDataAndStatsGuage = {} as IMileageHRDataAndStatsGuage;
            newMileageHRDataAndStatsGuage.approvedMileage = getRandomInt(false, 'trip', 'guage');
            newMileageHRDataAndStatsGuage.pendingMileage = getRandomInt(false, 'trip', 'guage');
            newMileageHRDataAndStatsGuage.ApprovedDistance = getRandomInt(true, 'distance', 'guage');
            newMileageHRDataAndStatsGuage.PendingDistance = getRandomInt(true, 'distance', 'guage');
            newMileageHRDataAndStatsGuage.totalMileageTrip = newMileageHRDataAndStatsGuage.approvedMileage + newMileageHRDataAndStatsGuage.pendingMileage;
            newMileageHRDataAndStatsGuage.totalMileageDistance = newMileageHRDataAndStatsGuage.ApprovedDistance + newMileageHRDataAndStatsGuage.PendingDistance;
            setMileageHRDataAndStatsGuageData(newMileageHRDataAndStatsGuage)
        } else if (e.currentTarget.id === "graph-random") {
            const newMileageHRDataAndStatsGraph = {} as IMileageHRDataAndStatsGraph;
            newMileageHRDataAndStatsGraph.EvalDate = [...mileageData.MileageHRDataAndStatsGraph.EvalDate]
            newMileageHRDataAndStatsGraph.ApprovedTrip = []
            newMileageHRDataAndStatsGraph.PendingTrip = []
            newMileageHRDataAndStatsGraph.PendingDistance = []
            newMileageHRDataAndStatsGraph.ApprovedDistance = []
            newMileageHRDataAndStatsGraph.TotalTrip = []
            console.log('newMileageHRDataAndStatsGraph', newMileageHRDataAndStatsGraph)
            for (let i = 0; i < mileageData.MileageHRDataAndStatsGraph.EvalDate.length; i++) {
                newMileageHRDataAndStatsGraph.ApprovedTrip.push(getRandomInt(false, 'trip', 'graph'))
                newMileageHRDataAndStatsGraph.PendingTrip.push(getRandomInt(false, 'trip', 'graph'))
                newMileageHRDataAndStatsGraph.PendingDistance.push(getRandomInt(true, 'distance', 'graph'))
                newMileageHRDataAndStatsGraph.ApprovedDistance.push(getRandomInt(true, 'distance', 'graph'))
                newMileageHRDataAndStatsGraph.TotalTrip.push(newMileageHRDataAndStatsGraph.ApprovedTrip[i] + newMileageHRDataAndStatsGraph.PendingTrip[i])
            }
            setMileageHRDataAndStatsGraphData(newMileageHRDataAndStatsGraph)
        }
    }

    const handleReset = (e: React.MouseEvent) => {
        if (e.currentTarget.id === "guage-reset") {
            setMileageHRDataAndStatsGuageData(mileageData.MileageHRDataAndStatsGuage)
        } else if (e.currentTarget.id === "graph-reset") {
            setMileageHRDataAndStatsGraphData(mileageData.MileageHRDataAndStatsGraph)
        }
    }

    const handleTabChange = (e: React.MouseEvent) => {
        if (e.currentTarget.id !== tab) {
            setTab(e.currentTarget.id)
        }
    }

    return (
        <Box sx={{ display: 'flex', width: '100%', }}>
            <Box sx={{position: 'fixed', width: '100px', backgroundColor: 'white', height: '100vh', display: {xs: 'none', sm: 'none', md: 'block'}}}>
                <Box sx={{transform: 'rotate(90deg)', display: 'flex', pl: '100%'}}>
                    <Typography variant='h3' fontFamily={'times new roman'}>MILEAGE...</Typography>
                    <AirportShuttleIcon sx={{fontSize: '50px' }} className='car' />
                </Box>
            </Box>
            <Box sx={{flexBasis: '100%', display: 'flex', pl: {sm: '0px', md:'100px'}, flexWrap: 'wrap'}} >
                <Box sx={{flexBasis: '40%', padding: 2, borderRadius: '10px 10px 0px 0px', background: `${tab === 'stats' ? 'linear-gradient(180deg, rgba(255,221,221,1) 0%, rgb(248,249,253,1) 100%)': 'none'}`, ':hover': {background: 'lightgray', cursor: 'pointer'}}} id="stats" onClick={handleTabChange}>
                    <Box sx={{margin: '0px', padding: '0'}}>
                        <Typography variant='h4'>Dashboard (All Staffs)</Typography>
                    </Box>
                    <Box sx={{margin: '0px', padding: '0'}}>
                        <p style={{margin: '0px', padding: '0', color: 'gray'}}>Information about company current mileage</p>
                    </Box>
                </Box>
                <Box sx={{flexBasis: '40%', padding: 2, borderRadius: '10px 10px 0px 0px', background: `${tab === 'table' ? 'linear-gradient(180deg, rgba(255,221,221,1) 0%, rgb(248,249,253,1) 100%)': 'none'}`, ':hover': {background: 'lightgray', cursor: 'pointer'}}}>
                    <Box sx={{margin: '0px', padding: '0'}} id="table" onClick={handleTabChange}>
                        <Typography variant='h4'>Table (History)</Typography>
                    </Box>
                    <Box sx={{margin: '0px', padding: '0'}}>
                        <p style={{margin: '0px', padding: '0', color: 'gray'}}>Search and obtain mileage information</p>
                    </Box>
                </Box>
                {tab === 'stats' ? 
                <>
                    <Box sx={{display: 'flex', flexBasis: {md: '60%', sm: '100%'}, pl: 2, flexWrap: 'wrap', mb: 2, mr: '5%', maxWidth: '900px'}}>
                        <Box sx={{flexBasis: '100%'}}>
                            <Typography>Current month: June</Typography>
                        </Box>
                        <Box sx={{flexBasis: '100%', display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2, flexWrap: 'wrap', rowGap: 2}}>
                            <Box onMouseEnter={() => setIsHoveredTT(true)} onMouseLeave={() => setIsHoveredTT(false)} className={`containerTotalTrip ${isHoveredTT ? "containerHoveredTotalTrip" : ''}`}>
                                <Gauge
                                    width={180}
                                    height={150}
                                    value={mileageHRDataAndStatsGuageData ? mileageHRDataAndStatsGuageData.totalMileageTrip : 0}
                                    valueMax={mileageHRDataAndStatsGuageData ? mileageHRDataAndStatsGuageData.totalMileageTrip: 0}
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
                                <Box className={`overlayTotalTrip ${isHoveredTT ? "overlayHoveredTotalTrip" : ''}`}>
                                    {/* <Typography>Hover Content:</Typography> */}
                                </Box>
                            </Box>
                            <Box onMouseEnter={() => setIsHoveredPM(true)} onMouseLeave={() => setIsHoveredPM(false)} className={`containerPendingMileage ${isHoveredPM ? "containerHoveredPendingMileage" : ''}`}>
                                <Gauge
                                    width={180}
                                    height={150}
                                    value={mileageHRDataAndStatsGuageData ? mileageHRDataAndStatsGuageData.pendingMileage : 0}
                                    valueMax={mileageHRDataAndStatsGuageData ? mileageHRDataAndStatsGuageData.pendingMileage + mileageHRDataAndStatsGuageData.approvedMileage : 0}
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
                                <Box className={`overlayPendingMileage ${isHoveredPM ? "overlayHoveredPendingMileage" : ''}`}>
                                    <Typography sx={{lineHeight: '200px', fontSize: '3rem'}}>{mileageHRDataAndStatsGuageData ? (100 * mileageHRDataAndStatsGuageData?.pendingMileage / (mileageHRDataAndStatsGuageData?.approvedMileage + mileageHRDataAndStatsGuageData?.pendingMileage)).toFixed(1) : 0}%</Typography>
                                </Box>
                            </Box>
                            <Box onMouseEnter={() => setIsHoveredAM(true)} onMouseLeave={() => setIsHoveredAM(false)} className={`containerApprovedMileage ${isHoveredAM ? "containerHoveredApprovedMileage" : ''}`}>
                                <Gauge
                                    width={180}
                                    height={150}
                                    value={mileageHRDataAndStatsGuageData ? mileageHRDataAndStatsGuageData.approvedMileage : 0}
                                    valueMax={mileageHRDataAndStatsGuageData ? mileageHRDataAndStatsGuageData.pendingMileage + mileageHRDataAndStatsGuageData.approvedMileage : 0}
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
                                <Box className={`overlayApprovedMileage ${isHoveredAM ? "overlayHoveredApprovedMileage" : ''}`}>
                                    <Typography sx={{lineHeight: '200px', fontSize: '3rem'}}>
                                        {mileageHRDataAndStatsGuageData ? (100 * mileageHRDataAndStatsGuageData?.approvedMileage / (mileageHRDataAndStatsGuageData?.approvedMileage + mileageHRDataAndStatsGuageData?.pendingMileage)).toFixed(1) : 0}%
                                    </Typography>
                                </Box>
                            </Box>
                            <Box onMouseEnter={() => setIsHoveredTM(true)} onMouseLeave={() => setIsHoveredTM(false)} className={`containerTotalMileage ${isHoveredTM ? "containerHoveredTotalMileage" : ''}`}>
                                <Box sx={{width: '100%', textAlign: 'center'}}>
                                    <Typography sx={{fontSize: '2.5rem', lineHeight: '100px', mt: 6, width: '100%', textAlign: 'center',}}>{mileageHRDataAndStatsGuageData ? mileageHRDataAndStatsGuageData.totalMileageDistance.toFixed(1) : 0}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{fontWeight: 'bold', }}>Miles</Typography>
                                </Box>
                                <Box className={`overlayTotalMileage ${isHoveredTM ? "overlayHoveredTotalMileage" : ''}`}>
                                    <Typography sx={{lineHeight: '200px', fontSize: '2.5rem'}}>
                                        ${mileageHRDataAndStatsGuageData ? (mileageHRDataAndStatsGuageData?.totalMileageDistance * 0.65).toFixed(1) : 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{flexBasis: '100%', backgroundColor: '#fff', borderRadius: '30px', minHeight: '400px', maxHeight: '450px', width: '100%', mb: 2}}>
                            {mileageHRDataAndStatsGraphData ? 
                                <LineChart
                                    xAxis={[{ data: mileageHRDataAndStatsGraphData.EvalDate, scaleType: 'point', label: 'Date' }]}
                                    series={[
                                        { curve: "catmullRom", data: mileageHRDataAndStatsGraphData.TotalTrip, label: 'Total Trip', yAxisKey: 'leftAxisTrip', color: 'blue' },
                                        { curve: "catmullRom", data: mileageHRDataAndStatsGraphData.ApprovedTrip, label: 'Approved Trip', yAxisKey: 'leftAxisTrip', color: 'purple' },
                                        { curve: "catmullRom", data: mileageHRDataAndStatsGraphData.PendingTrip, label: 'Pending Trip', yAxisKey: 'leftAxisTrip', color: 'violet' },
                                        { curve: "linear", data: mileageHRDataAndStatsGraphData.ApprovedDistance, label: 'Approved Distance', yAxisKey: 'rightAxisDistance', color: 'lightgray' },
                                        { curve: "linear", data: mileageHRDataAndStatsGraphData.PendingDistance, label: 'Pending Distance', yAxisKey: 'rightAxisDistance', color: 'darkgray' },
                                    ]}
                                    yAxis={[{id: 'leftAxisTrip', label: '# of Trips'}, {id: 'rightAxisDistance', label: 'Distance (miles)'}]}
                                    rightAxis="rightAxisDistance"
                                /> : <></>}
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', flexBasis: {md: '20%', sm: '100%'}, p: {sm: 2, md: 0}, alignContent: 'start', flexWrap: 'wrap', }}>
                        <Box sx={{display: 'flex', flexBasis: '100%', maxWidth: '200px', mr: '50%', flexWrap: 'wrap', mb: 2, p: 2}}>
                            <Box sx={{flexBasis: '100%', display: 'flex', flexWrap: 'wrap', mb: 2}}>
                                <Typography variant="h6" sx={{ flexBasis: '100%', textAlign: 'start', borderBottom: '1px solid gray' }}>
                                    Actions:
                                </Typography>
                            </Box>
                            <Box sx={{flexBasis: '100%', display: 'flex', flexWrap: {xs: 'wrap', sm: 'wrap', md:'wrap'}, gap: 2}}>
                                <Button sx={{minWidth: '200px'}} variant='outlined' onClick={handleRandomize} id="guage-random">Randomize Guage</Button>
                                <Button sx={{minWidth: '200px'}} variant='outlined' onClick={handleReset} id="guage-reset" >Reset Guage</Button>
                                <Button sx={{minWidth: '200px'}} variant='outlined' onClick={handleRandomize} id="graph-random">Randomize Graph</Button>
                                <Button sx={{minWidth: '200px'}} variant='outlined' onClick={handleReset} id="graph-reset" >Reset Graph</Button>
                            </Box>
                        </Box>
                    </Box>
                </>
                : <></>
                }
                {tab === 'table' ? 
                <Box sx={{flexBasis: '100%', width: '100%', padding: 2}}>
                    <MileageHRTable mileageHRTableData={mileageHRTableData} />
                </Box>
                : <></>
            }
            </Box>
        </Box>
    )
}
