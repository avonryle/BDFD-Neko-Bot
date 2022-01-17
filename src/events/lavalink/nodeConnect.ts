import createLavalinkEventHandler from "../../functions/createLavalinkEventHandler";

export default createLavalinkEventHandler("nodeConnect", async function(node) {
    console.log(`Node ${node.options.name} is online!`)
})