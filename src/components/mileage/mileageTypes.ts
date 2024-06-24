export type IExistAddress = {
  FavoriteFullAddress: string,
  FavoriteLocationMileageID: number,
  LocationName: string,
}
export type IAdditionalLoc = {
  Stop: string,
  StopNumber?: number, 
}

export type IMileageTableData = {
  Status: string,
  Employee: string,
  TravelDate: string,
  Purpose: string,
  Origin: string,
  Destination: string,
  RoundTrip: number,
  Distance: number,
  AccountCode: number,
  DepartmentCode: number,
  SubmittalDate: string,
  ApprovalDate: string
}

export type IMileageDataAndStats = {
  approvedMileage: number,
  pendingMileage: number,
  totalMileageTrip: number,
  totalMileageDistance: number
}

export type IMileageHRDataAndStatsGuage = {
  approvedMileage: number,
  pendingMileage: number,
  totalMileageTrip: number,
  totalMileageDistance: number,
  ApprovedDistance: number,
  PendingDistance:number
}

export type IMileageHRDataAndStatsGraph = {
  EvalDate: string[],
  TotalTrip: number[],
  ApprovedTrip: number[],
  PendingTrip: number[],
  ApprovedDistance: number[],
  PendingDistance: number[],
}