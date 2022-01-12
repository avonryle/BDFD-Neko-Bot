import { fork } from "child_process";
import { argv } from "process";

fork(`./dist/__tests__/${argv[2]}.js`)