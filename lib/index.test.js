const chai = require("chai"),
    expect = chai.expect;
chai.should();

describe('name or description of test', () => {
    // beforeEach ( () =>{});
    // afterEach ( () =>{});
    it('should pass', () => {
        expect(true).to.equal(true);
    });
});