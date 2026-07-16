export function storageUrl(path: string): string {
    return `${Ziggy.url.replace(/\/$/, '')}/storage/${path}`;
}
