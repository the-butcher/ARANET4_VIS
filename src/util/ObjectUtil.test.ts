import { ObjectUtil } from "./ObjectUtil";

test('it determines equality', () => {

    expect(ObjectUtil.isEqual({

    }, {

    })).toBeTruthy();

    expect(ObjectUtil.isEqual({
        t: []
    }, {
        t: []
    })).toBeTruthy();

    expect(ObjectUtil.isEqual({
        t: [
            'a'
        ]
    }, {
        t: [
            'a'
        ]
    })).toBeTruthy();

    expect(ObjectUtil.isEqual({
        t: [
            'a'
        ]
    }, {
        t: [
            'b'
        ]
    })).toBeFalsy()

    expect(ObjectUtil.isEqual({
        "A": "A"
    }, {
        "A": "A"
    })).toBeTruthy();

    expect(ObjectUtil.isEqual({
        "A": "A"
    }, {
        "A": "B"
    })).toBeFalsy();

    expect(ObjectUtil.isEqual({
        "A": "A"
    }, {
        "B": "A"
    })).toBeFalsy();


});