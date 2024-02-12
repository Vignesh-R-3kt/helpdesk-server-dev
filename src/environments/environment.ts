export const environment = {
    production: false,
    apiUrl: '',
    auth: {
        clientId: 'd2610670-80fe-4e08-9709-8a7bae667822',
        authority: 'https://login.microsoftonline.com/818467cf-44b9-45a5-a41a-1ef924fcd795',
        resourceMapURL: 'https://graph.microsoft.com/v1.0/me',
        // postLogoutRedirectUri: 'http://localhost:4200',
        postLogoutRedirectUri: 'https://helpdesk-server-dev.vercel.app',
    },
}