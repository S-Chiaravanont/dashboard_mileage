import React, {useState} from 'react';
import { TextField, Typography, Box, Button } from '@mui/material';
import { IExistAddress } from './mileageTypes'

type MileageFavoriteLocType = {
    existFavAddress: IExistAddress[],
    setExistFavAddress: (existFavAddress: IExistAddress[]) => void
}

export default function MileageFavoriteLoc({existFavAddress, setExistFavAddress}: MileageFavoriteLocType) {
    const [selectedFavRow, setSelectedFavRow] = useState<string | null>(null)

    const handleAddFavLocation = (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault()
        const favLocationName: string = e.currentTarget.favLocationName.value
        const FavFullAddress: string = e.currentTarget.favLocationFullAddress.value
        if (!favLocationName || !FavFullAddress) return
        if (!selectedFavRow && existFavAddress.length >= 5) return
        let newFavoriteLocationMileageID: number;
        if (selectedFavRow) newFavoriteLocationMileageID = parseInt(selectedFavRow)
        else newFavoriteLocationMileageID = existFavAddress.length + 1;

        const payload: IExistAddress = {
            LocationName: favLocationName,
            FavoriteFullAddress: FavFullAddress,
            FavoriteLocationMileageID: newFavoriteLocationMileageID
        }

        const copyExistFavAddress = [...existFavAddress]
        if (selectedFavRow) {
            copyExistFavAddress.splice(newFavoriteLocationMileageID, 1, payload)
        } else {
            copyExistFavAddress.push(payload)
        }
        setExistFavAddress(copyExistFavAddress)
        e.currentTarget.favLocationName.value = ''
        e.currentTarget.favLocationFullAddress.value = ''
        setSelectedFavRow(null);
        // const req = {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         },
        //     body: JSON.stringify(payload)
        // }
        // fetch(`/route`, req)
        //     .then(res => res.json())
        //     .then(data => {
        //         // do something here
        //     })
        //     .catch((error: Error) => {
        //         console.error(error)
        //     })
    }

    const handleSelectFavRow = (value: string) => {
        if (value === selectedFavRow) {
        setSelectedFavRow(null)
        } else {
        setSelectedFavRow(value)
        }
    }

    return (
        <>
            <Typography variant="h6" sx={{ flexBasis: '100%', textAlign: 'start', borderBottom: '1px solid gray' }}>
                Favorite locations:
            </Typography>
            <Box sx={{flexBasis: '100%'}}>
                <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '5px', marginBottom: '5px', height: '190px', textAlign: 'center', background: '#fff' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', width: '100px' }}>Name</th>
                            <th style={{ border: '1px solid black', width: 'max-content' }}>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                    {existFavAddress && existFavAddress.length > 0 ? existFavAddress.map((location: IExistAddress, index: number) => {
                        return (
                        <tr key={`location-${index}`} id={`row-${index}`}
                            className='existFavAddressRows'
                            onClick={() => handleSelectFavRow(`row-${location.FavoriteLocationMileageID}`)}
                            style={{
                                backgroundColor: `${selectedFavRow === `row-${location.FavoriteLocationMileageID}` ? 'lightgray' : 'white'}`,
                            }}>
                            <td style={{ border: '1px solid black', width: '100px', fontSize: '12px' }}>{location.LocationName}</td>
                            <td style={{ border: '1px solid black', width: 'max-content', fontSize: '12px' }}>{location.FavoriteFullAddress}</td>
                        </tr>
                        )
                    }) : <></>}
                    {
                        existFavAddress && existFavAddress.length < 5 && existFavAddress.length != 0 ? Array.from({ length: 5 - existFavAddress.length }).map((_, index) => {
                        return (
                            <tr key={`emptyLocation-${index}`}>
                                <td style={{ border: '1px solid black', width: '100px', fontSize: '12px' }}>-</td>
                                <td style={{ border: '1px solid black', width: 'max-content', fontSize: '12px' }}>-</td>
                            </tr>
                        )
                        }) : <></>
                    }
                    {existFavAddress && existFavAddress.length === 0 ? ['', '', '', '', ''].map((_, index) => {
                        return (
                        <tr key={`location-${index}`}>
                            <td style={{ border: '1px solid black', width: '100px', fontSize: '12px' }}>-</td>
                            <td style={{ border: '1px solid black', width: 'max-content', fontSize: '12px' }}>-</td>
                        </tr>
                        )
                    }) : <></>}
                    </tbody>
                </table>
            </Box>
            <Box sx={{flexBasis: '100%', background: '#fff'}}>
                <form onSubmit={handleAddFavLocation} style={{ border: '1px solid black', padding: '8px' }}>
                    <Box style={{ display: 'flex', flexWrap: 'nowrap', width: '100%', alignItems: 'center', marginBottom: '5px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '15px' }}>Search:</Typography>
                        <TextField size='small' sx={{ fontWeight: 'bold', marginRight: '5px', whiteSpace: 'nowrap', fontSize: '15px', width: '100%' }} placeholder='Address...' required id='favLocationFullAddress' />
                    </Box>
                    <Box style={{ display: 'flex', flexWrap: 'nowrap', width: '100%', alignItems: 'center', marginBottom: '5px' }}>
                        <Typography sx={{ fontWeight: 'bold', marginRight: '5px', whiteSpace: 'nowrap', fontSize: '15px' }}>Add name:</Typography>
                        <TextField hiddenLabel name='favLocationName' id='favLocationName' required size='small' fullWidth variant='standard' placeholder='insert name here...' />
                    </Box>
                    <Button size='small' type='submit' variant='outlined' fullWidth>{selectedFavRow ? 'Replace' : existFavAddress && existFavAddress.length < 5 ? 'Add' : 'Replace (need selection)'}</Button>
                </form>
            </Box>
        </>
    )
}