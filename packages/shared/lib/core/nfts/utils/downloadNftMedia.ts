import { Platform } from '@core/app'
import { activeProfile, activeProfileId } from '@core/profile'
import { get } from 'svelte/store'
import { addOrUpdateNftInAllAccountNfts } from '../actions'
import { BYTES_PER_MEGABYTE } from '../constants'
import { DownloadErrorType, DownloadWarningType } from '../enums'
import { DownloadMetadata, INft } from '../interfaces'

export async function downloadNftMedia(nft: INft, accountIndex: number): Promise<void> {
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE

    let downloadMetadata: DownloadMetadata
    try {
        const filePath = `${get(activeProfileId)}/${nft.id}`
        const localFile = await fetch(`build/${filePath}`)
        if (localFile.status !== 200 && localFile.status !== 304) {
            if (nft.composedUrl) {
                const response = await fetch(nft.composedUrl, { method: 'HEAD', cache: 'force-cache' })
                if (response.headers.get('Content-Type') !== nft.parsedMetadata.type) {
                    downloadMetadata = { isLoaded: false, error: { type: DownloadErrorType.NotMatchingFileTypes } }
                } else if (
                    MAX_FILE_SIZE_IN_BYTES > 0 &&
                    Number(response.headers.get('Content-Length')) > MAX_FILE_SIZE_IN_BYTES
                ) {
                    downloadMetadata = { isLoaded: false, warning: { type: DownloadWarningType.FileTooLarge } }
                } else {
                    await Platform.downloadFile(nft.composedUrl, filePath)
                    downloadMetadata = { isLoaded: true }
                }
            } else {
                downloadMetadata = { isLoaded: true, error: { type: DownloadErrorType.UnsupportedUrl } }
            }
        } else {
            downloadMetadata = { isLoaded: true }
        }
    } catch (err) {
        downloadMetadata = { isLoaded: false, error: { type: DownloadErrorType.Generic, message: err } }
    }
    nft.downloadMetadata = downloadMetadata
    addOrUpdateNftInAllAccountNfts(accountIndex, nft)
}
