import { getNodeInfo } from '@core/profile-manager'
import { INodeInfoResponse } from '../interfaces/node-info-response.interface'
import { updateNodeInfo } from '../stores/node-info.store'

export async function getAndUpdateNodeInfo(forwardErrors = false): Promise<void> {
    let nodeInfoResponse: INodeInfoResponse
    try {
        nodeInfoResponse = await getNodeInfo()
        updateNodeInfo(nodeInfoResponse?.nodeInfo)
    } catch (err) {
        nodeInfoResponse = null
        updateNodeInfo(nodeInfoResponse?.nodeInfo)
        if (forwardErrors) {
            return Promise.reject(err)
        } else {
            console.error(err)
        }
    }
}
