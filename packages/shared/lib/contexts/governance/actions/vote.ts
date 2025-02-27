import { get } from 'svelte/store'

import { selectedAccount, updateSelectedAccount } from '@core/account/stores'
import { activeProfile } from '@core/profile/stores'
import { ProfileType } from '@core/profile/enums'
import { handleLedgerError } from '@core/ledger/utils'
import { showAppNotification } from '@auxiliary/notification/actions'
import { localize } from '@core/i18n'
import { handleError } from '@core/error/handlers'
import { processAndAddToActivities } from '@core/wallet'
import { setPendingGovernanceTransactionIdForAccount } from '../stores'

export async function vote(eventId?: string, answers?: number[]): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })

        const account = get(selectedAccount)
        const transaction = await account.vote(eventId, answers)
        setPendingGovernanceTransactionIdForAccount(account.index, transaction.transactionId)

        await processAndAddToActivities(transaction)

        showAppNotification({
            type: 'success',
            message: localize('notifications.vote.success'),
            alert: true,
        })
    } catch (err) {
        const _activeProfile = get(activeProfile)
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err?.error)
        } else {
            handleError(err)
        }
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
