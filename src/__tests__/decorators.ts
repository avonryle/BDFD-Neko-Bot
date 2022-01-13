import { LogExecutionTime } from "../util/decorators/LogExecutionTime";
import {WrapMethodWithErrorHandler} from "../util/decorators/WrapMethodWithErrorHandler";

class test {
    constructor() {

    }

    @WrapMethodWithErrorHandler()
    @LogExecutionTime()
    err() {
        throw new Error("woah")
        return 10
    }
}

new test().err()