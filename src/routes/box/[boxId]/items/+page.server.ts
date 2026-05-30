import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	if (!locals.jwt) {
		redirect(307, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}
	return {
		boxId: params.boxId
	};
};
