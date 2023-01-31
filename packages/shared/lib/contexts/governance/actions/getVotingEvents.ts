import { get } from 'svelte/store'
import type { ParticipationEventWithNodes } from '@iota/wallet'
import { selectedAccount } from '@core/account/stores'

export function getVotingEvents(): Promise<{ [eventId: string]: ParticipationEventWithNodes }> {
    const account = get(selectedAccount)
    return account?.getParticipationEvents()
}
