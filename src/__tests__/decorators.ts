import {WrapMethodWithErrorHandler} from "../util/decorators/WrapMethodWithErrorHandler";

class test {
    constructor() {

    }

    @WrapMethodWithErrorHandler()
    err() {
        throw new Error("woah")
        return 10
    }
}

new test().err()