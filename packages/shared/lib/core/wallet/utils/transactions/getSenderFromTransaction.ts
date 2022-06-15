import { Sender } from '@core/wallet/types'
import { Transaction } from '@iota/wallet'
import { getSenderFromOutput } from '../outputs'
import { getNonRemainderOutputFromTransaction } from './getNonRemainderOutputFromTransaction'
import { getSenderFromTransactionInputs } from './getSenderFromTransactionInputs'

export function getSenderFromTransaction(transaction: Transaction, accountAddress: string): Sender {
    if (!transaction?.incoming) {
        return { type: 'address', address: accountAddress }
    } else if (transaction?.incoming) {
        getSenderFromTransactionInputs(transaction.payload.essence.inputs) ??
            getSenderFromOutput(getNonRemainderOutputFromTransaction(transaction, accountAddress))
    } else {
        return undefined
    }
}
