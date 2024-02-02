// Method to transform date input into YYYY-MM-DD format
export function formatCustomDate(inputDate: any): string {
    const date = new Date(inputDate);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
}     