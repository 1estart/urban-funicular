import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";

describe("counter", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Counter as Program<Counter>;

    // Генерируем PDA, как ожидает программа
    const [counterPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("counter")],
        program.programId
    );

    it("Инициализирует счётчик", async () => {
        await program.methods
            .initialize()
            .accounts({
                counter: counterPDA,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        const account = await program.account.counter.fetch(counterPDA);
        expect(account.count.toNumber()).to.equal(0);
    });

    it("Инкрементирует счётчик", async () => {
        await program.methods
            .increment()
            .accounts({
                counter: counterPDA,
            })
            .rpc();

        const account = await program.account.counter.fetch(counterPDA);
        expect(account.count.toNumber()).to.equal(1);
    });
});