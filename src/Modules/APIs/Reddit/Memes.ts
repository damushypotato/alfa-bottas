import { reddit } from 'reddit.images';

export interface Meme {
    id: string;
    type: string;
    title: string;
    author: string;
    postLink: string;
    image: string;
    text: string;
    thumbnail: string;
    subreddit: string;
    NSFW: boolean;
    spoiler: boolean;
    createdUtc: number;
    upvotes: number;
    downvotes: number;
    upvoteRatio: number;
}

const subreddits = [
    'memes',
    'dankmemes'
]

export const GetMeme = async () => {
    const meme: Meme = await reddit.FetchSubredditPost({
        subreddit: subreddits[Math.floor(Math.random() * subreddits.length)],
        images: true
    });

    if (!meme.image) meme.image = 'https://cdn.kapwing.com/collections/meme_template_with_white_impact_text_on_top_and_bottom_ykpl1_thumbnail.jpg';

    return meme;
}