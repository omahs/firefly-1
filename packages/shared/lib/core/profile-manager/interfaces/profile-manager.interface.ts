import type {
    SyncOptions,
    ClientOptions,
    EventType,
    GenerateAddressOptions,
    LedgerNanoStatus,
    NodeInfoWrapper,
    WalletEvent,
} from '@iota/wallet'

import { IAccount } from '@core/account/interfaces'
import { IAuth } from '@core/network/interfaces'

import { WalletApiEventHandler } from '../types'

export interface IProfileManager {
    id: string
    backup(destination: string, password: string): Promise<void>
    bech32ToHex(bech32Address: string): Promise<string>
    changeStrongholdPassword(currentPassword: string, newPassword: string): Promise<void>
    clearStrongholdPassword(): Promise<void>
    destroy(): void
    emitTestEvent(event: WalletEvent): Promise<void>
    generateAddress(
        accountIndex: number,
        internal: boolean,
        addressIndex: number,
        options?: GenerateAddressOptions,
        bech32Hrp?: string
    ): Promise<string>
    generateMnemonic(): Promise<string>
    getAccountIndexes(): Promise<number[]>
    getAccount(accountIndex: number): Promise<IAccount>
    getAccounts(): Promise<IAccount[]>
    getNodeInfo(url?: string, auth?: IAuth): Promise<NodeInfoWrapper>
    getLedgerNanoStatus(): Promise<LedgerNanoStatus>
    hexToBech32(hex: string, bech32Hrp?: string): Promise<string>
    isStrongholdPasswordAvailable(): Promise<boolean>
    listen(eventTypes: EventType[], callback: WalletApiEventHandler): void
    clearListeners(eventTypes: EventType[]): Promise<void>
    removeLatestAccount(): Promise<void>
    restoreBackup(source: string, password: string): Promise<void>
    setClientOptions(options: ClientOptions): Promise<void>
    setStrongholdPassword(password: string): Promise<void>
    setStrongholdPasswordClearInterval(intervalInMilliseconds?: number): Promise<void>
    startBackgroundSync(options?: SyncOptions, intervalInMilliseconds?: number): Promise<void>
    stopBackgroundSync(): Promise<void>
    storeMnemonic(mnemonic: string): Promise<void>
    verifyMnemonic(mnemonic: string): Promise<void>
}
