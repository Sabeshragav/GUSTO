export interface RegistrationEmailData {
    to: string;
    name: string;
    uniqueCode: string;
    events: { title: string; eventType: string; submissionEmail?: string }[];
    amount: number;
}
export interface AbstractRejectionData {
    to: string;
    name: string;
    originalEvent: string;
    fallbackEvent: string;
}

export interface AbstractApprovalData {
    to: string;
    name: string;
    event: string;
}