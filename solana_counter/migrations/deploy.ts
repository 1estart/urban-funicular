const anchor = require("@coral-xyz/anchor");

module.exports = async function (provider) {
    const program = anchor.workspace.Counter;
    await program.methods.initialize().rpc();
};