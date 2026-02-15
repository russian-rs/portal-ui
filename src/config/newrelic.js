const applicationID = Number(import.meta.env.VITE_NEW_RELIC_APP_ID)
const licenseKey = import.meta.env.VITE_NEW_RELIC_LICENSE_KEY
const accountID = Number(import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID)

export const jsConfig = {
    info: {
        applicationID,
        beacon: "bam.eu01.nr-data.net",
        errorBeacon: "bam.eu01.nr-data.net",
        licenseKey,
        sa: 1,
    },
    init: {
        ajax: {
            deny_list: ["bam.eu01.nr-data.net"],
        },
        distributed_tracing: {
            enabled: true,
        },
        privacy: {
            cookies_enabled: true,
        },
    },
    loader_config: {
        accountID,
        agentID: applicationID,
        applicationID,
        licenseKey,
        trustKey: accountID,
    },
}