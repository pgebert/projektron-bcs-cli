import {expect} from "chai";
import {Time} from "../src/time";

describe('Time', () => {
    describe('#toString()', () => {
        it('should format time as "hh:mm" string when single digit hour is passed', () => {
            const time = new Time(15);
            const formattedTime = time.toString();

            expect(formattedTime).to.equal('00:15');
        })
    })
})
