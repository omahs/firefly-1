import { get } from 'svelte/store'
import { profileManager } from '../../stores'
import { handleNewOutputEvent } from './newOutput'

export function subscribe(): void {
    const manager = get(profileManager)

    manager.listen([], (error, result) => {
        if (error) {
            console.error(error)
        } else {
            const events = {
                NewOutput: handleNewOutputEvent,
                // ...
            }

            // do we need to handle the parsing?
            const { accountIndex, event } = JSON.parse(result)

            const eventNames = Object.keys(event)

            eventNames.forEach((name) => {
                events[name](event)
            })
        }
    })
}
