export function extractQueryParameters(query) {
    return query.substr(1).split('&').reduce((queryParameters, parameter) => {
        const [key, value] = parameter.split('=')
        queryParameters[key] = value
        return queryParameters
    }, {})
}