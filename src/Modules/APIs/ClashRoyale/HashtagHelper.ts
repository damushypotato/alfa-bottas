//? https://github.com/weeco/wrap-royale/blob/master/src/utils/HashtagHelper.ts

export namespace HashtagHelper {
    /**
     * Converts Hashtag (player or clantag) to a normalized version without # or common pitfalls
     * @param hashtag Player or clantag
     */
     export function normalizeHashtag(hashtag: string): string {
        if (hashtag == null) {
            return '';
        }

        hashtag = hashtag
            .trim()
            .toUpperCase()
            .replace(/O/g, '0'); // replace capital O with zero

        if (hashtag.startsWith('#')) hashtag = hashtag.substr(1, hashtag.length - 1);

        return hashtag;
    }

    /**
     * Checks if a hashtag is potentially valid. Hashtags will be normalized before running through the test.
     * @param hashtag The to be checked hashtag
     * @param skipNormalization Weather to skip the normalizing of the hashtag. Defaults to false
     */
    export function isValidHashtag(hashtag: string, skipNormalization = false): boolean {
        // Simple validation first before doing computationally more expensive stuff
        if (hashtag === undefined || hashtag === null) {
            return false;
        }
        if (hashtag.length > 14 || hashtag.length < 3) {
            return false;
        }

        let tag = hashtag;
        if (!skipNormalization) tag = normalizeHashtag(hashtag);
        const tagCharacters: string[] = ['0', '2', '8', '9', 'P', 'Y', 'L', 'Q', 'G', 'R', 'J', 'C', 'U', 'V'];

        for (const char of tag) {
            if (tagCharacters.indexOf(char) === -1) {
                return false;
            }
        }

        return true;
    }
}
