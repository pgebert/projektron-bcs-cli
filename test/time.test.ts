import {expect} from "chai";
import {Time} from "../src/time";

describe('Time', () => {
    describe('#fromString()', () => {
        it('should read in time with format "hh:mm" when called fromString', () => {
            const time = Time.fromString("01:15");

            expect(time.minutes).to.equal(75);
        })
    })
    describe('#toString()', () => {
        it('should format time as "hh:mm" string when called toString', () => {
            const time = new Time(75);
            const formattedTime = time.toString();

            expect(formattedTime).to.equal('01:15');
        })
    })
    describe('#getHours()', () => {
        it('should return number of hours when called getHours', () => {
            const time = new Time(75);
            const hours = time.getHours();

            expect(hours).to.equal(1);
        })
    })
    describe('#getRemainingMinutes()', () => {
        it('should return number of remaining minutes when called getRemainingMinutes', () => {
            const time = new Time(75);
            const remainingMinutes = time.getRemainingMinutes();

            expect(remainingMinutes).to.equal(15);
        })
    })
})
