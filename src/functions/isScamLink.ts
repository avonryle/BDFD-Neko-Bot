import { ScanRequest } from "../typings/interfaces/http/ScanRequest";

export default function(data: ScanRequest): boolean {
    return (
        data.phishing || data.suspicious
    ) && (
        data.category !== 'N/A' && 
        data.domain_age.iso !== null &&
        data.domain_age.human !== 'N/A' &&
        data.domain_age.timestamp !== null
    )
}