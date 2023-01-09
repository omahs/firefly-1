import { Platform } from '@core/app'
import { activeProfile, activeProfileId } from '@core/profile'
import { get } from 'svelte/store'
import { addOrUpdateNftInAllAccountNfts } from '../actions'
import { DownloadErrorType, DownloadWarningType } from '../enums'
import { INft } from '../interfaces'

export async function downloadNftMedia(nft: INft, accountIndex: number): Promise<void> {
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * 1000000

    try {
        const filePath = `${get(activeProfileId)}/${nft.id}`
        const localFile = await fetch(`build/${filePath}`)
        if (localFile.status !== 200 && localFile.status !== 304) {
            if (nft.composedUrl) {
                const response = await fetch(nft.composedUrl, { method: 'HEAD', cache: 'force-cache' })
                if (response.headers.get('Content-Type') !== nft.parsedMetadata.type) {
                    nft = { ...nft, isLoaded: false, error: { type: DownloadErrorType.NotMatchingFileTypes } }
                } else if (
                    MAX_FILE_SIZE_IN_BYTES > 0 &&
                    Number(response.headers.get('Content-Length')) > MAX_FILE_SIZE_IN_BYTES
                ) {
                    nft = { ...nft, isLoaded: false, warning: { type: DownloadWarningType.FileTooLarge } }
                } else {
                    await Platform.downloadFile(nft.composedUrl, filePath)
                    nft = { ...nft, isLoaded: true }
                }
            } else {
                nft = { ...nft, isLoaded: true, error: { type: DownloadErrorType.UnsupportedUrl } }
            }
        } else {
            nft.isLoaded = true
        }
    } catch (err) {
        nft = { ...nft, isLoaded: false, error: { type: DownloadErrorType.Generic, message: err } }
    }
    addOrUpdateNftInAllAccountNfts(accountIndex, nft)
}
