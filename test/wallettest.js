const Dex = artifacts.require("Dex")
const Link = artifacts.require("Link")
const truffleAssert = require("truffle-assertions")

contract.skip("Dex", accounts => {
    it("should only be possible for owner to add tokens", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.passes(
            dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]})
        )
        await truffleAssert.reverts(
            dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[1]})
        )
    })

    it("it should handle deposits correctly", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address, 100)
        await dex.deposit(100, web3.utils.fromUtf8("LINK"))
        let balance = await dex.balances(accounts[0], web3.utils.fromUtf8("LINK"))
        assert.equal( balance.toNumber(), 100 )
    })

    it("it should handle faulty withdrrawals correctly", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.reverts( dex.withdraw(500, web3.utils.fromUtf8("LINK")))

    })


    it("it should handle correct withdrrawals correctly", async () => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.passes( dex.withdraw(100, web3.utils.fromUtf8("LINK")))

    })
})