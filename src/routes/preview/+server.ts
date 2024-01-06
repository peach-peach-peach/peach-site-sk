import { getCategoryByName } from '$lib/sdk/categories.js'
import { createMicroCMSClient, type Article } from '$lib/sdk/microcms.js'
import { error, redirect } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const contentId = url.searchParams.get('contentId')
	const draftKey = url.searchParams.get('draftKey')
	const contentType = url.searchParams.get('contentType')

	if (contentId == null || draftKey == null || contentType == null || !isContentType(contentType)) {
		throw error(400, 'required params are missing')
	}

	const article = await createMicroCMSClient().get<Article | null>({
		endpoint: contentType,
		contentId,
		queries: { draftKey }
	})

	if (article == null) {
		throw error(400, 'article not found')
	}

	throw redirect(307, `/${getCategoryByName(article.category.name).value}/${contentId}?draftKey=${draftKey}`)
}

const isContentType = (contentType: string | null) => contentType === 'articles'