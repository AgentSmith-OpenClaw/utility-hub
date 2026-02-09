import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Payment } from '../components/EMICalculator/EMICalculator.types';

export const exportToExcel = (schedule: Payment[], filename: string = 'emi_schedule.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(schedule);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Amortization Schedule");
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(data, filename);
};
