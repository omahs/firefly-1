import { selectedAccount } from '@core/account/stores/selected-account.store'
import { handleError } from '@core/error/handlers/handleError'
import { localize } from '@core/i18n'
import { checkStronghold } from '@lib/stronghold'
import { get } from 'svelte/store'
import { ActivityType } from '../enums'
import { ITransactionActivityData } from '../interfaces'
import { updateActivityDataByActivityId } from '../stores'

export async function claimActivity(activityId: string, data: ITransactionActivityData): Promise<void> {
    await checkStronghold()
    const account = get(selectedAccount)
    try {
        updateActivityDataByActivityId(account.id, activityId, { type: ActivityType.Transaction, isClaiming: true })
        const results = await account.claimOutputs([data.outputId])
        if (results.length > 0) {
            const transactionId = results[0].transactionId
            updateActivityDataByActivityId(account.id, activityId, {
                type: ActivityType.Transaction,
                claimingTransactionId: transactionId,
            })
        } else {
            throw Error(localize('notifications.claimed.claimSpendOutputs'))
        }
    } catch (err) {
        handleError(err)
        updateActivityDataByActivityId(account.id, activityId, { type: ActivityType.Transaction, isClaiming: false })
    }
}
