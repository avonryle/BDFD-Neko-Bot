export interface ScanRequest {
	message: string
	success: boolean
	unsafe: boolean
	domain: string
	ip_address: string
	server: string
	content_type: string
	status_code: number
	page_size: number
	domain_rank: number
	dns_valid: boolean
	parking: boolean
	spamming: boolean
	malware: boolean
	phishing: boolean
	suspicious: boolean
	adult: boolean
	risk_score: number
	domain_age: {
		human: string
		timestamp: number
		iso: string
	},
	category: string
	request_id: string
}