import { userToken, setHydrationComplete } from '$lib';
import { language } from '$lib/stores/lang.js';

export const load = async ({ data }) => {
    if (data?.userLanguage) {
        language.set(data.userLanguage as any);
    }

    if (data?.userToken) {
        userToken.set(data.userToken)
    } else {
        userToken.set(null);
    }

    setHydrationComplete(true);

    return data;
};
