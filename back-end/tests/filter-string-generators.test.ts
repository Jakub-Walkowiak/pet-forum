import { getContainsFilterString, getOrderByString, getReplyFilterString, getTagFilterString, getUserFilterString, getUserTypeFilterString } from "../src/helpers/query-generators/posts/post-filter-string-generators"
import { OrderByMode, OrderByOption, PostType, ReplyOption, TagMode, UserTypeOption } from "../src/types/post-fetch-options"

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
        it('Replies=no should ignore replyTo parameter', () => {
            expect(getReplyFilterString(ReplyOption.NO, 3)).toEqual(expect.not.stringContaining('3'))
        })

        it('Replies=both without replyTo should produce empty string', () => {
            expect(getReplyFilterString(ReplyOption.BOTH, undefined)).toBe('')
        })

        it('Replies=yes and Replies=both with replyTo should produce identical result', () => {
            expect(getReplyFilterString(ReplyOption.BOTH, 3)).toEqual(getReplyFilterString(ReplyOption.YES, 3))
        })

        it('Replies=yes result should contain IS NOT NULL if no replyTo is provided', () => {
            expect(getReplyFilterString(ReplyOption.YES, undefined)).toEqual(expect.stringContaining('IS NOT NULL'))
        })
    })

    describe('Contains filter string generation', () => {
        it('Undefined should return empty string', () => {
            expect(getContainsFilterString(undefined)).toBe('')
        })

        it('Clause should be of form LIKE LOWER(\'%input%\')', () => {
            expect(getContainsFilterString('input')).toEqual(expect.stringContaining('LIKE LOWER(\'%input%\')'))
        })
    })
})