import { Option } from "../../types/Option";

export interface SystemMemberData {
    tag: Option<string>
    user_id: string
    autosend: boolean
}