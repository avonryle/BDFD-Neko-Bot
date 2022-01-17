import { SystemMemberRequest } from "./SystemMemberRequest"

export interface SystemMemberFrontRequest {
    timestamp: string
    id: string
    members: SystemMemberRequest[]
}