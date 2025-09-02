import { userToken, setHydrationComplete } from '$lib';
import { language } from '$lib/stores/lang.js';

export const load = async ({ data }) => {
    if (data?.userLanguage) {
        language.set(data.userLanguage as any);
    }

    userToken.set(data?.userToken)

    setHydrationComplete(true);

    return data;
};
