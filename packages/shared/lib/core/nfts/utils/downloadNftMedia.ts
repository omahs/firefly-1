import { Platform } from '@core/app'
import { activeProfile, activeProfileId } from '@core/profile'
import { get } from 'svelte/store'
import { addOrUpdateNftInAllAccountNfts } from '../actions'
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
                    nft = { ...nft, isLoaded: false, downloadError: 'error.nft.notMatchingFileTypes' }
                } else if (
                    MAX_FILE_SIZE_IN_BYTES > 0 &&
                    Number(response.headers.get('Content-Length')) > MAX_FILE_SIZE_IN_BYTES
                ) {
                    nft = { ...nft, isLoaded: false, downloadWarning: 'error.nft.fileTooLarge' }
                } else {
                    await Platform.downloadFile(nft.composedUrl, filePath)
                    nft = { ...nft, isLoaded: true, downloadWarning: '', downloadError: '' }
                }
            } else {
                nft = { ...nft, isLoaded: true, downloadWarning: '', downloadError: 'error.nft.unsupportedUrl' }
            }
        } else {
            nft.isLoaded = true
        }
    } catch (err) {
        nft = { ...nft, isLoaded: false, downloadWarning: '', downloadError: err }
    }
    addOrUpdateNftInAllAccountNfts(accountIndex, nft)
}
