export const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(t => parseInt(t) || 0);
    return hours * 60 + minutes;
}


export const toTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
}
