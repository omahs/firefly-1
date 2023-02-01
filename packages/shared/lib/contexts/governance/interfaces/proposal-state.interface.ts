import type { ParticipationEventStatus, Question } from '@iota/wallet'
import { IOrganization } from '..'
import { ProposalStatus, ProposalType } from '../enums'

export interface IProposal extends IProposalMetadata {
    state: ParticipationEventStatus
}

export interface IProposalState {
    [proposalId: string]: {
        state: ParticipationEventStatus
    }
}

export interface IRegisteredProposals {
    [proposalId: string]: IProposalMetadata
}

export interface IProposalMetadata {
    id: string
    milestones?: Record<ProposalStatus, number>
    organization?: IOrganization
    type: ProposalType
    questions: Question[]
    additionalInfo: string
    title: string
    participated: boolean
    nodeUrl: string
}
