import { LogExecutionTime } from "../util/decorators/LogExecutionTime";
import {WrapMethodWithErrorHandler} from "../util/decorators/WrapMethodWithErrorHandler";

class test {
    constructor() {

    }

    @WrapMethodWithErrorHandler()
    @LogExecutionTime()
    err() {

        return 10
    }
}

new test().err()