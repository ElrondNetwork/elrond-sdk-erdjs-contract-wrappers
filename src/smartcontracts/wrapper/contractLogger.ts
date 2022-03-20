import { Address } from "../../address";
import { NetworkConfig } from "../../networkConfig";
import { Transaction } from "../../transaction";
import { Query } from "../query";
import { QueryResponse } from "../queryResponse";
import { SmartContractResults } from "../smartContractResults";
import { findImmediateResult, findResultingCalls, TypedResult } from "./deprecatedContractResults";

/**
 * Provides a simple interface in order to easily call or query the smart contract's methods.
 */
export class ContractLogger {

    synchronizedNetworkConfig(networkConfig: NetworkConfig) {
        console.log(`Synchronized network config - chainID: ${networkConfig.ChainID.valueOf()}`);
    }

    transactionCreated(transaction: Transaction) {
        console.log(`Tx ${transaction.getHash()} created. Sending...`);
    }

    deployComplete(transaction: Transaction, smartContractResults: SmartContractResults, smartContractAddress: Address) {
        logReturnMessages(transaction, smartContractResults);
        console.log(`done. (address: ${smartContractAddress.bech32()} )`);
    }

    transactionSent(_transaction: Transaction) {
        console.log(`awaiting results...`);
    }

    transactionComplete(_result: any, _resultData: string, transaction: Transaction, smartContractResults: SmartContractResults) {
        logReturnMessages(transaction, smartContractResults);
        console.log(`done.`);
    }

    queryCreated(_query: Query) {
        console.log(`Query created. Sending...`);
    }

    queryComplete(_result: any, _response: QueryResponse) {
        console.log(`done.`);
    }
}

function logReturnMessages(transaction: Transaction, smartContractResults: SmartContractResults) {
    let immediate = findImmediateResult(smartContractResults)!;
    logSmartContractResultIfMessage("(immediate)", transaction, immediate);

    let resultingCalls = findResultingCalls(smartContractResults);
    for (let i in resultingCalls) {
        logSmartContractResultIfMessage("(resulting call)", transaction, resultingCalls[i]);
    }
}

function logSmartContractResultIfMessage(info: string, _transaction: Transaction, smartContractResult: TypedResult) {
    if (smartContractResult.getReturnMessage()) {
        console.log(`Return message ${info} message: ${smartContractResult.getReturnMessage()}`);
    }
}
