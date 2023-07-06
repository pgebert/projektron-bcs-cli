export class Time {
    minutes: number;

    constructor(minutes: number) {
        this.minutes = minutes;
    }

    public static fromString(time: string): Time {
        return new Time(this.toMinutes(time));
    }

    private static toMinutes(time: string): number {
        const [hours, minutes] = time.split(":").map(t => parseInt(t, 10) || 0);
        return hours * 60 + minutes;
    }

    plus(other: Time): Time {
        return new Time(this.minutes + other.minutes);
    }

    minus(other: Time): Time {
        return new Time(this.minutes - other.minutes);
    }

    getHours(): number {
        return Math.floor(this.minutes / 60);
    }

    getRemainingMinutes(): number {
        return this.minutes % 60;
    }

    toString(): string {
        return `${this.getHours().toString().padStart(2, '0')}:${this.getRemainingMinutes().toString().padStart(2, '0')}`;
    }
}
