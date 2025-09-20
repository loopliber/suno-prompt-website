


export function createPageUrl(pageName: string) {
    // Homepage should always point to root domain
    if (pageName.toLowerCase() === 'homepage') {
        return '/';
    }
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}