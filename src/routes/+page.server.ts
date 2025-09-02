export const load = async ({locals}) => {
    return {
        isAuthenticated: !!locals.jwt,
    }
}
