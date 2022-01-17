import createLavalinkEventHandler from "../../functions/createLavalinkEventHandler";

export default createLavalinkEventHandler("nodeError", function (node, error) {
    console.log(`Node ${node.options.name} errored!`, error)
})