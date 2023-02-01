import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { dashboardRouter } from '../'

import { FilterRoute } from '../../enums'
import { ITokenRouterEvent } from '../../interfaces'
import { resetRouterWithDrawerDelay } from '../../utils'

export const filterRoute = writable<FilterRoute>(null)
export const filterRouter = writable<FilterRouter>(null)

export class FilterRouter extends Subrouter<FilterRoute> {
    constructor() {
        super(FilterRoute.Filter, filterRoute, get(dashboardRouter))
    }
    public next(event: ITokenRouterEvent = {}): void {
        if (get(filterRoute) === FilterRoute.Filter) {}
    }

    public closeDrawer(): void {
        get(dashboardRouter).previous()
        resetRouterWithDrawerDelay(get(filterRouter))
    }
}
