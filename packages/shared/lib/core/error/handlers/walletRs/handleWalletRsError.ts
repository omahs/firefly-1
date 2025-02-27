import { WalletRsError } from '../../enums'
import { IError } from '../../interfaces'
import { handleGenericError } from '../handleGenericError'
import {
    handleClientError,
    handleInsufficientFundsError,
    handleIotaClientError,
    handleNoOutputsToConsolidateError,
} from './subhandlers'

export function handleWalletRsError(error: IError): void {
    if (error?.type) {
        switch (error.type) {
            case WalletRsError.ClientError.valueOf():
                handleClientError(error)
                break
            case WalletRsError.InsufficientFunds.valueOf():
                handleInsufficientFundsError(error)
                break
            case WalletRsError.NoOutputsToConsolidate.valueOf():
                handleNoOutputsToConsolidateError(error)
                break
            case WalletRsError.IotaClientError.valueOf():
                handleIotaClientError(error)
                break
            default:
                handleGenericError(error)
        }
    } else {
        handleGenericError(error)
    }
}
