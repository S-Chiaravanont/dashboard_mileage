import React, { useEffect, useState } from 'react';
import { Box, Typography, Tooltip, Checkbox, IconButton, Popover, List, ListItem, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import "jspdf-autotable"
import { IMileageTableData } from './mileageTypes';

type MileageHRTableType = {
    mileageHRTableData: IMileageTableData[] | null,
}

export default function MileageHRTable({ mileageHRTableData }: MileageHRTableType) {
    const [statusAnchorEl, setStatusAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [statusList, setStatusList] = useState<string[]>([]);
    const [filteredMileageData, setFilteredMileageData] = useState<IMileageTableData[] | null>(null);

    const handleOpenPopoverStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
        setStatusAnchorEl(event.currentTarget);
    };

    const handleClosePopoverStatus = () => {
        setStatusAnchorEl(null);
    };

    const handleStatusToggle = (status: string) => {
        let newSelectedStatuses: string[] | [] = [] as string[];

        if (status === 'Show all') {
            // Toggle between selecting all and deselecting all
            newSelectedStatuses = selectedStatuses?.length === statusList?.length ? [] : statusList;
        } else {
            const currentIndex: number = selectedStatuses?.indexOf(status);
            newSelectedStatuses = [...selectedStatuses];

            if (currentIndex === -1) {
                newSelectedStatuses.push(status);
            } else {
                newSelectedStatuses.splice(currentIndex, 1);
            }
        }
        if (newSelectedStatuses?.includes("Show all") && newSelectedStatuses?.length !== statusList?.length) {
            const showAllIndex = newSelectedStatuses.indexOf("Show all")
            newSelectedStatuses?.splice(showAllIndex, 1);
        } else if (!newSelectedStatuses?.includes("Show all") && newSelectedStatuses?.length === (statusList ? statusList.length : 0) - 1) {
            newSelectedStatuses.push("Show all")
        }

        const translatedNewSelectedStatuses = newSelectedStatuses?.reduce((acc: any[], item) => {
            if (item === 'Pending') return ['Pending', ...acc];
            else if (item === 'Not Submitted') return ['Not Submitted', ...acc];
            else if (item === 'Approved') return ['Approved', ...acc];
            else if (item === 'Denied') return ['Denied', ...acc];
            else return [item, ...acc]
        }, [])

        setSelectedStatuses(newSelectedStatuses);

        // Filter data based on the selected statuses
        const filteredMileage = mileageHRTableData ? mileageHRTableData.filter((item: IMileageTableData) => translatedNewSelectedStatuses?.includes('Show all') || translatedNewSelectedStatuses?.includes(item.Status)) : null;
        setFilteredMileageData(filteredMileage);
    };

    useEffect(() => {
        setFilteredMileageData(mileageHRTableData)
        setStatusList(['Pending', 'Approved', 'Not Submitted', 'Denied', 'Show all'])
    }, []) 

    const renderResponsiveTable = () => {
        return (
            <table id='mileageHRtable' className='mileageHRTable'>
                <thead>
                    <tr className='headerRow'>
                        <th className="headerCell">
                            Status
                            <IconButton sx={{  fontSize: '20px', padding: 0 }} onClick={handleOpenPopoverStatus}><MoreVertIcon /></IconButton>
                            <Popover
                                open={Boolean(statusAnchorEl)}
                                anchorEl={statusAnchorEl}
                                onClose={handleClosePopoverStatus}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <List>
                                    {statusList && statusList.map((status) => (
                                        <ListItem key={status} dense>
                                            <Checkbox
                                                checked={selectedStatuses.includes(status)}
                                                onChange={() => handleStatusToggle(status)}
                                            />
                                            <ListItemText primary={status} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Popover>
                        </th>
                        <th className="headerCell">Employee</th>
                        <th className="headerCell">Travel Date</th>
                        <th className="headerCell">Purpose</th>
                        <th className="headerCell">Origin</th>
                        <th className="headerCell">Destination</th>
                        <th className="headerCell">Round Trip</th>
                        <th className="headerCell">Distance</th>
                        <th className="headerCell">Account Code</th>
                        <th className="headerCell">Department Code</th>
                        <th className="headerCell">Approval Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMileageData && filteredMileageData.map((item: IMileageTableData, index: number) => (
                        <tr key={index} className="bodyRow">
                            <td className="bodyCell">{item.Status}</td>
                            <td className="bodyCell">{item.Employee ? item.Employee : '--'}</td>
                            <td className="bodyCell">{item.TravelDate ? item.TravelDate : "N/A"}</td>
                            <td className="bodyCell">{item.Purpose ? item.Purpose : '--'}</td>
                            <td className="bodyCell">{item.Origin ? item.Origin : '--'}</td>
                            <td className="bodyCell">{item.Destination ? item.Destination : '--'}</td>
                            <td className="bodyCell">{item.RoundTrip === 0 ? 'No' : 'Yes'}</td>
                            <td className="bodyCell">{item.Distance ? item.Distance : '--'}</td>
                            <td className="bodyCell">{item.AccountCode ? item.AccountCode : '--'}</td>
                            <td className="bodyCell">{item.DepartmentCode ? item.DepartmentCode : '--'}</td>
                            <td className="bodyCell">{item.ApprovalDate ? item.ApprovalDate : "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    const handlePDFDownload = () => {
        //set up PDF config
        const doc = new jsPDF("landscape", "pt", "A4");

        const title = "mileageHRTableData Report";
        const headers = [["#", "Status", "Employee", "Travel Date", "Purpose", "Origin", "Destination", "Round Trip", "Distance", "Account Code", "Department Code", "Submittal Date", "Approval Date"]];

        const data = filteredMileageData?.map((item: IMileageTableData, index: number) => {
            return [index, item.Status, item.Employee, item.TravelDate, item.Purpose, item.Origin, item.Destination, item.RoundTrip === 1 ? "Yes" : "No", item.Distance, item.AccountCode, item.DepartmentCode, item.SubmittalDate, item.ApprovalDate]
        })

        let content = {
            startY: 50,
            head: headers,
            body: data
        }

        doc.text(title, 40, 40);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        doc.autoTable(content);

        doc.save("mileageHRTableData Report.pdf")
    }

    return (
        <>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: 34, align: "center" }}>
                Employee Mileage Data
            </Typography>
            <Box sx={{ display: 'flex', marginTop: 2, alignItems: 'center' }}>
                <Typography> Download:</Typography>
                <Tooltip title="Download mileage as PDF">
                    <IconButton sx={{ '&:hover': { backgroundColor: '#c7c6d85e' } }} 
                    onClick={handlePDFDownload}
                    >
                        <PictureAsPdfIcon />
                    </IconButton>
                </Tooltip>
            </Box> 
            <Box sx={{ overflowX: 'scroll', width: '100%'}}>
                {renderResponsiveTable()}
            </Box>
        </>
    )
}