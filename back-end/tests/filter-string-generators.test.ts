import { getOrderByString, getReplyFilterString, getTagFilterString, getUserFilterString, getUserTypeFilterString } from "../src/helpers/post-fetch-query-generators/filter-string-generators"
import { OrderByMode, OrderByOption, PostType, TagMode, UserTypeOption } from "../src/types/post-fetch-options"

describe('Testing partial query assembly', () => {
    describe('\'ORDER BY\' string generation', () => {
        it.each([
            [OrderByOption.LIKES, 'like_count'],
            [OrderByOption.REPLIES, 'reply_count'],
            [OrderByOption.DATE, 'date_posted'],
        ])('With %p, should contain %p', (by: OrderByOption, expected: string) => {
            expect(getOrderByString(by, OrderByMode.ASC)).toEqual(expect.stringContaining(expected))
        })

        it.each([
            [OrderByMode.ASC, 'ASC'],
            [OrderByMode.DESC, 'DESC'],
        ])('With %p, should contain %p', (mode: OrderByMode, expected: string) => {
            expect(getOrderByString(OrderByOption.DATE, mode)).toEqual(expect.stringContaining(expected))
        })
    })
    
    describe('User type filter string generation', () => {
        it('No user provided should return empty string', () => {
            expect(getUserTypeFilterString(UserTypeOption.FOLLOWED, undefined)).toBe('')
        })

        it('Followed should return single part query fragment', () => {
            expect(getUserTypeFilterString(UserTypeOption.FOLLOWED, 3)).toEqual(expect.not.stringContaining('AND'))
        })

        it('Mutuals should return two part query fragment', () => {
            expect(getUserTypeFilterString(UserTypeOption.MUTUTALS, 7)).toEqual(expect.stringContaining('AND'))
        })

        it('None option should return empty string', () => {
            expect(getUserTypeFilterString(UserTypeOption.NONE, 7)).toBe('')
        })
    })

    describe('Tag filter string generation', () => {
        it('Undefined tags should return empty string', () => {
            expect(getTagFilterString(TagMode.ANY, undefined, PostType.BLOG)).toBe('')
        })

        it('Empty tags should return empty string', () => {
            expect(getTagFilterString(TagMode.ANY, [], PostType.BLOG)).toBe('')
        })

        it('Any should create a single IN clause', () => {
            expect(getTagFilterString(TagMode.ANY, [1, 2, 3], PostType.BLOG)).toEqual(expect.not.stringContaining('AND'))
        })

        it('All should create multiple in clauses', () => {
            expect(getTagFilterString(TagMode.ALL, [1, 2, 3], PostType.BLOG)).toEqual(expect.stringContaining('AND'))
        })

        it('Blog type should contain proper table', () => {
            expect(getTagFilterString(TagMode.ANY, [1, 2, 3], PostType.BLOG)).toEqual(expect.stringContaining('blog_tagged'))
        })

        it('Advice type should contain proper table', () => {
            expect(getTagFilterString(TagMode.ALL, [1, 2, 3], PostType.ADVICE)).toEqual(expect.stringContaining('advice_tagged'))
        })
    })

    describe('Individual user filter string generation', () => {
        it('No user should return empty string', () => {
            expect(getUserFilterString(undefined)).toBe('')
        })

        it('User id should return string with said id (with apostrophes)', () => {
            expect(getUserFilterString(1)).toEqual(expect.stringContaining('\'1\''))
        })
    })

    describe('Reply filter string generation', () => {
        it('Replies=false should return check for NULL reply_to', () => {
            expect(getReplyFilterString(false)).toBe('reply_to IS NULL')
        })

        it('Replies=true should return check for NOT NULL reply_to', () => {
            expect(getReplyFilterString(true)).toBe('reply_to IS NOT NULL')
        })
    })
})