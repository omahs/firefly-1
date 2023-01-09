import { AddressTypes } from '@iota/types'
import { DownloadErrorType, DownloadWarningType } from '../enums'
import { IIrc27Metadata } from '../interfaces'

export interface INft {
    id: string
    address: string
    name: string
    metadata?: string
    issuer?: AddressTypes
    parsedMetadata?: IIrc27Metadata
    isSpendable: boolean
    latestOutputId: string
    composedUrl: string
    filePath: string
    error: {
        type: DownloadErrorType
        message?: string
    }
    warning: {
        type: DownloadWarningType
        message?: string
    }
    isLoaded: boolean
}
